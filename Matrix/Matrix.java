package Matrix;

import java.util.Arrays;

// This shall be the Java matrix library 
// *YIPPEE*


/*
 * 
 * I think it might be worth mentioning the layout of the data
 * 
 * data = {
 * {blah, blah, blah}, 
 * {blah, blah, blah},
 * {blah, blah, blah}
 * }
 * 
 * This is kind of weird because some places might visualize it differently(I would add an example but I don't want to make it 
 * any more confusing) so just know that to reference things from the data in the data array from the Matrix class you need to use
 * 
 * matrixObject.data[row][column]
 * 
 * Have a great day!
 * 
 */

public class Matrix {

    public static void main(String[] args) {
        
        double[][] data = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };

        // Making a new Matrix and printing it out
        Matrix mat = new Matrix(data);
        mat.print();
        


    }

    // PIVs ------------------------------------------

    // The dimensions of the matrix
    private int rows;
    private int cols;

    // The data in the matrix
    private double[][] data;


    // The random constructor
    public Matrix(int numRows, int numCols) {

        // Taking down the dimensions
        this.rows = numRows;
        this.cols = numCols;

        // We just want a random matrix with this constructor, so here is where we can randomize it
        this.data = new double[this.rows][this.cols];

        // Looping for every value in the matrix
        for (int rowNum = 0; rowNum < this.rows; rowNum++) {

            for (int colNum = 0; colNum < this.cols; colNum++) {

                this.data[rowNum][colNum] = Math.random();

            }

        }

    }

    // The non random constructor
    public Matrix(double[][] inputData) {

        // Setting the dimensions
        this.rows = inputData.length;
        this.cols = inputData[0].length;

        // Declaring the data variable
        this.data = new double[this.rows][this.cols];

        // Running a deep copy so that we can make sure there aren't any reference errors
        for (int i = 0; i < this.rows; i++) {

            this.data[i] = Arrays.copyOf(inputData[i], inputData[i].length);

        }

    }


    // Now for the methods ---------------------------

    // A simple print function (not too fancy unfortunately)
    public void print() {

        // The maximum number of digits
        final int MAX_DIGITS = 5;

        // Looping for every value in the matrix
        for (int rowNum = 0; rowNum < this.rows; rowNum++) {

            for (int colNum = 0; colNum < this.cols; colNum++) {

                // We want to limit the string length so that we can make sure that all of the squares are nice and pretty
                String str = "" + this.data[rowNum][colNum];

                // If it is already bigger than the max length, we can truncate it and be done
                if (str.length() > MAX_DIGITS) {
                    str = str.substring(0, 5);
                } else {

                    // It is smaller so we need to append spaces to the end to make it the same size
                    while (str.length() < MAX_DIGITS) {
                        str += " ";
                    }

                }

                // Adding on the style :D
                if (colNum == 0) {
                    str = "| " + str + ", ";
                } else if (colNum == this.cols - 1) {
                    str += " |";
                } else {
                    str += ", ";
                }
                

                // Printing out this element
                System.out.print(str);

            }

            // Adding on the carriage return
            System.out.println();

        }

    }

    // The scalar element multiplication method
    public Matrix elementMultiplication(double scalar) {

        // This specific element multiplication method is going to be the scalar one, but there will also be 
        // one for Matrices that are the same size 

        // Looping for every value in the matrix to multiply by the scalar
        for (int rowNum = 0; rowNum < this.rows; rowNum++) {

            for (int colNum = 0; colNum < this.cols; colNum++) {

                this.data[rowNum][colNum] *= scalar;

            }

        }

        // This is not a static method, so it changes itself and returns self
        return this;

    }

    // The static scalar element multiplication method 
    public static Matrix elementMultiplication(Matrix mat, double scalar) {

        // Looping for every value in the matrix to multiply by the scalar
        for (int rowNum = 0; rowNum < mat.rows; rowNum++) {

            for (int colNum = 0; colNum < mat.cols; colNum++) {

                mat.data[rowNum][colNum] *= scalar;

            }

        }

        // This is not a static method, so it changes itself and returns self
        return mat;

    }

    // The element wise multiplication method 
    public Matrix elementMultiplication(Matrix other) {

        // Making sure that they have the same dimensions
        if (this.rows != other.rows || this.cols != other.cols) {

            System.out.println("In element-wise multiplication, both matrices have to have the same dimensions.");
            throw new Error("ElementMultiplicationSizeError");

        }

        // Looping for every value in the matrix to multiply by the scalar
        for (int rowNum = 0; rowNum < this.rows; rowNum++) {

            for (int colNum = 0; colNum < this.cols; colNum++) {

                this.data[rowNum][colNum] *= other.data[rowNum][colNum];

            }

        }

        // This is not a static method, so it changes itself and returns self
        return this;

    }

    // The static element wise multiplication method
    public Matrix elementMultiplication(Matrix other) {

        // Making sure that they have the same dimensions
        if (this.rows != other.rows || this.cols != other.cols) {

            System.out.println("In element-wise multiplication, both matrices have to have the same dimensions.");
            throw new Error("ElementMultiplicationSizeError");

        }

        // Looping for every value in the matrix to multiply by the scalar
        for (int rowNum = 0; rowNum < this.rows; rowNum++) {

            for (int colNum = 0; colNum < this.cols; colNum++) {

                this.data[rowNum][colNum] *= other.data[rowNum][colNum];

            }

        }

        // This is not a static method, so it changes itself and returns self
        return this;

    }

}