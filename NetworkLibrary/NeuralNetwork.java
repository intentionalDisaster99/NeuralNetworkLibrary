package NetworkLibrary;
import MatrixLibrary.Matrix;
import java.util.Arrays;


public class NeuralNetwork {
    

    public static void main(String[] args) { 

        

    } 



    // Private instance variables

    // The layout of the network
    private int[] layout;

    // TODO replace the extra weights and biases with extra places in the larger array

    // The various weights
    private Matrix weights_ih;
    private Matrix weights_ho;
    private Matrix[] weights_h;

    // The various biases
    private Matrix bias_o;
    private Matrix[] biases_h;

    // The learning rate - if you're new, don't just crank this up because it won't just make it faster
    // it won't actually break anything, so feel free to try, but it might not find the best answer
    private double learningRate = 0.1;

    // The activation function (or interface or whatever)
    private Matrix.activationFunction activation = x -> 1 / (1 + Math.exp(-x));
    private Matrix.activationFunction activationPrime = x -> x * (1 - x);




    // ----------------------------------------Constructors------------------------------------------------------

    // The default constructor
    public NeuralNetwork() {

        // EVERYTHING SHALL BE NULL
        this.weights_h = null;
        this.weights_ho = null;
        this.weights_ih = null;
        this.biases_h = null;
        this.bias_o = null;

    }

    // The main constructor
    public NeuralNetwork(int[] layout) {

        // Making sure that the input layout is longer than 3 layers so they actually get something out of this network
        if (layout.length < 3) {

            // Throwing an error
            System.out.println("There is a minimum of 3 layers in the neural network library.\n(otherwise you don't really get anything out of it)");
            throw new Error("NeuralNetworkSizeError");

        }   

        // Saving the layout to use later
        this.layout = layout;

        // Getting random weights and biases for the outermost parts
        this.weights_ih = new Matrix(this.layout[1], this.layout[0]).elementMult(2).add(-1);
        this.weights_ho = new Matrix(this.layout[this.layout.length-1], this.layout[this.layout.length-2]).elementMult(2).add(-1);
        this.bias_o = new Matrix(this.layout[this.layout.length-1], 1).elementMult(2).add(-1);

        // Making the arrays for the hidden weights and biases
        this.weights_h = new Matrix[this.layout.length - 1];
        this.biases_h = new Matrix[this.layout.length];

        // Populating the hidden weights and biases
        for (int i = 0; i < this.layout.length - 2; i++) {

            this.weights_h[i] = new Matrix(this.layout[i+2], this.layout[i+1]).elementMult(2).add(-1);

            this.biases_h[i] = new Matrix(this.layout[i+1], 1).elementMult(2).add(-1);

        }

        // We actually need to add one more bias because it is one longer than the weights
        this.biases_h[this.biases_h.length - 1] = new Matrix(this.layout[this.layout.length-2], 1).elementMult(2).add(-1);

    }

    // This is the guessing function, called feed forward because you are feeding data forwards through the network
    public double[] feedForward(double[] inputArr) { 
    
        // Making a matrix out of the input
        Matrix input = new Matrix(inputArr);

        // Getting the first of the hidden outputs because it uses the input layer outputs instead of other hidden outputs
        Matrix hiddenOutput = Matrix.matrixMult(this.weights_ih, input).add(this.biases_h[0]).map(this.activation);

        // Getting the values of the hidden layer sandwich (All of the hidden layers)
        for (int i = 1; i < this.layout.length - 2; i++) {

            // I don't actually need to save these for the feedForward function, so these aren't going in an array
            hiddenOutput = Matrix.matrixMult(this.weights_h[i - 1], hiddenOutput).add(this.biases_h[i]).map(this.activation);

        }

        // Generating the output layer values     
        Matrix output = Matrix.matrixMult(this.weights_ho, hiddenOutput).add(this.bias_o).map(this.activation);

        // Making it into percentages and then an array
        return output.softMax().toVector();

    }

    // The training function
    public void train(double[] data, double[] targets) {

        // Running the feed forwards algorithm to get all of the data we want from the inner layers

        // Making a matrix out of the input
        Matrix input = new Matrix(data);

        // I have to save the outputs from the hidden layer now for training, and I'm going to save them in this array
        Matrix[] hiddenOutputs = new Matrix[this.layout.length - 2];

        // Getting the first of the hidden outputs because it uses the input layer outputs instead of other hidden outputs
        hiddenOutputs[0] = Matrix.matrixMult(this.weights_ih, input).add(this.biases_h[0]).map(this.activation);

        // Getting the values of the hidden layer sandwich (All of the hidden layers)
        for (int i = 1; i < this.layout.length - 2; i++) {

            // I don't actually need to save these for the feedforward function, so these aren't going in an array
            hiddenOutputs[i] = (Matrix.matrixMult(this.weights_h[i - 1], hiddenOutputs[i - 1]).add(this.biases_h[i]).map(this.activation));

        }

        // Generating the output layer values
        Matrix outputs = Matrix.matrixMult(this.weights_ho, hiddenOutputs[hiddenOutputs.length - 1]).add(this.bias_o).map(this.activation);

        // Turning the labels into a matrix
        Matrix labels = new Matrix(targets);

        // TODO change the line below to use subtract instead of mult -1
        // Now we need to find the error of the output layer
        Matrix outputErrors = Matrix.add(labels, Matrix.elementMult(outputs, -1));

        // Now we need to find the gradients to figure out what will happen next

        // Running the gradient through the activation gradient
        Matrix outputGradient = Matrix.map(outputs, this.activationPrime).elementMult(outputErrors).elementMult(this.learningRate);

        // Calculating the deltas (changes)
        Matrix weights_ho_deltas = Matrix.matrixMult(outputGradient, Matrix.transpose(hiddenOutputs[hiddenOutputs.length - 1]));

        // Now to adjust the new weights going into the final layer
        this.weights_ho.add(weights_ho_deltas);

        // Adjusting the bias by the gradients
        this.bias_o.add(outputGradient);

        // Now for the earlier layers

        // Declaring the hidden errors
        Matrix hiddenErrors = Matrix.transpose(this.weights_ho).matrixMult(outputErrors);

        // Finding the error of most of the hidden layers
        for (int i = this.layout.length - 3; i >= 1; i--) {

            // Calculating the gradient and thingz (It's cool cuz there's a z)
            Matrix hiddenGradient = Matrix.map(hiddenOutputs[i], this.activationPrime).elementMult(hiddenErrors).elementMult(this.learningRate);

            // Figuring out which input to use
            Matrix inputToUse = hiddenOutputs[i-1];
            if (i == 0) {
                inputToUse = input;
            }
            // let inputToUse = (i === 0) ? input : hiddenOutputs[i - 1];

            // Now for the deltas
            Matrix hiddenDeltas = Matrix.matrixMult(hiddenGradient, Matrix.transpose(inputToUse));


            if (i > 0) {
                hiddenErrors = Matrix.transpose(this.weights_h[i - 1]).matrixMult(hiddenErrors);
                this.weights_h[i - 1].add(hiddenDeltas);
            } else {
                this.weights_ih.add(hiddenDeltas);
            }

            this.biases_h[i].add(hiddenGradient);

        }

    }


    // TODO Move this to an example file 
    
    public static double XOR(double x, double y) {
        if (x == 1 && y == 0 || y == 1 && x == 0) {
            return 1;
        }
        return 0;
    } 


}

