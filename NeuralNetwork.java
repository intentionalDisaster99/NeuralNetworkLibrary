import MatrixLibrary.Matrix;

public class NeuralNetwork {
    

    public static void main(String[] args) {

        int[] layout = {4, 4, 4, 1};
        NeuralNetwork brain = new NeuralNetwork(layout);

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
    private double learningRate = 0.025;

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
        for (int i = 0; i < this.layout.length - 3; i++) {

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
        for (let i = 1; i < this.hiddenLayout.length; i++) {

            // I don't actually need to save these for the feedforward function, so these aren't going in an array
            hiddenOutput = Matrix.mult(this.weights_h[i - 1], hiddenOutput).add(this.biases_h[i]).map(this.activation);

        }

        // Generating the output layer values     
        let output = Matrix.mult(this.weights_ho, hiddenOutput).add(this.bias_o).map(this.activation);

        return output.toArray();

    }

    // The activation function (or )

}
