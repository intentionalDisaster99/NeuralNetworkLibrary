class NeuralNetwork {

    // Here is my constructor
    constructor(layout) {

        // Making sure that the layout is an array or a neural network to copy
        if (!Array.isArray(layout) && !(layout instanceof NeuralNetwork)) {

            // Throwing errors and just generally helpful stuff
            console.log("The input to the NeuralNetwork constructor must be an array to define the layout of the network.");
            throw new Error("NeuralNetworkConstructorTypeError");

        }

        // Checking to see if we are making a new network or cloning an old one
        if (layout instanceof NeuralNetwork) {


            // Copying the input variables.
            this.numInputNodes = layout.numInputNodes;
            this.hiddenLayout = layout.hiddenLayout.slice();
            this.numOutputNodes = layout.numOutputNodes;

            // Taking the record of the layout from the input
            this.layout = layout.layout.slice();

            // Getting random weights and biases for the outermost bits
            this.weights_ih = layout.weights_ih.copy();
            this.weights_ho = layout.weights_ho.copy();
            this.bias_o = layout.bias_o.copy();

            // Declaring the random weights and biases arrays that connect the hidden layers
            this.weights_h = [];
            this.biases_h = [];

            // Getting random weights and biases to connect the hidden layers
            for (let i = 0; i < layout.weights_h.length - 1; i++) {

                // Making the weight
                this.weights_h.push(layout.weights_h[i].copy());

            }
            for (let i = 0; i < layout.biases_h.length - 1; i++) {

                // Making the weight
                this.biases_h.push(layout.biases_h[i].copy());

            }

            // How quickly it will learn 
            this.learningRate = layout.learningRate;




        } else {

            // Checking to make sure that the input is the right length
            if (layout.length < 3) {

                // More errors yippee
                console.log("The layout for the NeuralNetwork class must be an array with a length of more than 2.\n(Otherwise you wouldn't have a hidden layer and that kinda removes the point.)");
                throw new Error("NeuralNetworkConstructorSizeError");

            }

            // Setting up the layout variables
            this.numInputNodes = layout[0];
            this.hiddenLayout = layout.slice(1, layout.length - 1);
            this.numOutputNodes = layout[layout.length - 1];

            // Recording the full layout in case I ever want it
            this.layout = layout;

            // Getting random weights and biases for the outermost bits
            this.weights_ih = new Matrix(this.hiddenLayout[0], this.numInputNodes).randomize().mult(2).add(-1);
            this.weights_ho = new Matrix(this.numOutputNodes, this.hiddenLayout[this.hiddenLayout.length - 1]).randomize().mult(2).add(-1);
            this.bias_o = new Matrix(this.numOutputNodes, 1).randomize().mult(2).add(-1);

            // Declaring the random weights and biases arrays that connect the hidden layers
            this.weights_h = [];
            this.biases_h = [];

            // Getting random weights and biases to connect the hidden layers
            for (let i = 0; i < this.hiddenLayout.length - 1; i++) {

                // Making the weight
                this.weights_h.push(new Matrix(this.hiddenLayout[i + 1], this.hiddenLayout[i]).randomize().mult(2).add(-1));

                // Making the bias
                this.biases_h.push(new Matrix(this.hiddenLayout[i], 1).randomize().mult(2).add(-1));

            }

            // We need one more bias because we need one for every hidden layer not for every connection
            this.biases_h.push(new Matrix(this.hiddenLayout[this.hiddenLayout.length - 1], 1).randomize().mult(2).add(-1));

            // How quickly it will learn 
            this.learningRate = 0.025;

        }

    }

    // A function to get a guess from the net
    feedForward(data) {

        // Making a matrix out of the input
        let input = Matrix.fromArray(data);

        // Getting the first of the hidden outputs because it uses the input layer outputs instead of other hidden outputs
        let hiddenOutput = Matrix.mult(this.weights_ih, input).add(this.biases_h[0]).map(this.activation);

        // Getting the values of the hidden layer sandwich (All of the hidden layers)
        for (let i = 1; i < this.hiddenLayout.length; i++) {

            // I don't actually need to save these for the feedforward function, so these aren't going in an array
            hiddenOutput = Matrix.mult(this.weights_h[i - 1], hiddenOutput).add(this.biases_h[i]).map(this.activation);

        }

        // Generating the output layer values
        let output = Matrix.mult(this.weights_ho, hiddenOutput).add(this.bias_o).map(this.activation);

        return output.toArray();

    }

    // A function to train the net on a guess
    train(data, targets) {

        // Running the feed forwards algorithm to get all of the data we want from the inner layers

        // Making a matrix out of the input
        let input = Matrix.fromArray(data);//.transpose();

        // I have to save the outputs from the hidden layer now for training, and I'm going to save them in this array
        let hiddenOutputs = [];

        // Getting the first of the hidden outputs because it uses the input layer outputs instead of other hidden outputs
        hiddenOutputs.push(Matrix.mult(this.weights_ih, input).add(this.biases_h[0]).map(this.activation));

        // Getting the values of the hidden layer sandwich (All of the hidden layers)
        for (let i = 1; i < this.hiddenLayout.length; i++) {

            // I don't actually need to save these for the feedforward function, so these aren't going in an array
            hiddenOutputs.push(Matrix.mult(this.weights_h[i - 1], hiddenOutputs[i - 1]).add(this.biases_h[i]).map(this.activation));

        }

        // Generating the output layer values
        let outputs = Matrix.mult(this.weights_ho, hiddenOutputs[hiddenOutputs.length - 1]).add(this.bias_o).map(this.activation);

        // Turning the labels into a matrix
        let labels = Matrix.fromArray(targets);


        // Now we need to find the error of the output layer
        let outputErrors = Matrix.subtract(labels, outputs);

        // Now we need to find the gradients to figure out what will happen next

        // Running the gradient through the activation gradient
        let outputGradient = Matrix.map(outputs, this.activationPrime).elementMult(outputErrors).mult(this.learningRate);

        // Calculating the deltas (changes)
        let weights_ho_deltas = Matrix.mult(outputGradient, Matrix.transpose(hiddenOutputs[hiddenOutputs.length - 1]));

        // Now to adjust the new weights going into the final layer
        this.weights_ho.add(weights_ho_deltas);

        // Adjusting the bias by the gradients
        this.bias_o.add(outputGradient);

        // Now for the earlier layers

        // Declaring the hidden errors
        let hiddenErrors = Matrix.transpose(this.weights_ho).mult(outputErrors);

        // Finding the error of most of the hidden layers
        for (let i = this.hiddenLayout.length - 1; i >= 0; i--) {

            // Calculating the gradient and deltas and thingz (It's cool cuz there's a z)
            let hiddenGradient = Matrix.map(hiddenOutputs[i], this.activationPrime).elementMult(hiddenErrors).mult(this.learningRate);
            let inputToUse = (i === 0) ? input : hiddenOutputs[i - 1];
            let hiddenDeltas = Matrix.mult(hiddenGradient, Matrix.transpose(inputToUse));


            if (i > 0) {
                hiddenErrors = Matrix.transpose(this.weights_h[i - 1]).mult(hiddenErrors);
                this.weights_h[i - 1].add(hiddenDeltas);
            } else {
                this.weights_ih.add(hiddenDeltas);
            }

            this.biases_h[i].add(hiddenGradient);

        }


    }


    // The activation function
    activation(x) {
        return sigmoid(x);
    }

    // The derivative of the activation function
    activationPrime(x) {
        return sigmoidPrime(x);
    }

    // A simple function to adjust the learning rate
    setLearningRate(newRate) {
        this.learningRate = newRate;
    }

    // Another simple function to change the activation function
    setActivationFunction(func, funcDeriv) {
        this.activation = func;
        this.activationPrime = funcDeriv;
    }

    // A function that returns the JSON string of the network 
    toJSON() {

        // Just saving a bunch of stuff as arrays
        return {
            layout: this.layout,
            weights_ih: this.weights_ih.toArray(),
            weights_ho: this.weights_ho.toArray(),
            weights_h: this.weights_h.map(weight => weight.toArray()),
            biases_h: this.biases_h.map(bias => bias.toArray()),
            bias_o: this.bias_o.toArray(),
            learningRate: this.learningRate
        };

    }

    // A static array to unpack from a JSON string
    static fromJSON(json) {

        let data = JSON.parse(json);
        let network = new NeuralNetwork(data.layout);

        network.weights_ih = Matrix.fromArray(data.weights_ih);
        network.weights_ho = Matrix.fromArray(data.weights_ho);
        network.weights_h = data.weights_h.map(weight => Matrix.fromArray(weight));
        network.biases_h = data.biases_h.map(bias => Matrix.fromArray(bias));
        network.bias_o = Matrix.fromArray(data.bias_o);
        network.learningRate = data.learningRate;

        return network;

    }

}




// The sigmoid activation function
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

// The derivative of the sigmoid function
function sigmoidPrime(x) {
    return x * (1 - x);
}

