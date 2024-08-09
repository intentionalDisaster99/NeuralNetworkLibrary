// This will be my matrix library to use with the neural network library I'm making


// My matrix class
class Matrix {

    // The constructor
    constructor(rows, cols) {

        // Remembering how many rows and columns there are
        this.rows = rows || 1;
        this.cols = cols || 1;

        // Making a 2D array that will hold the values
        this.data = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));

    }


    // This will be my multiplication/division method
    mult(other) {

        // Checking to see if it is matrix multiplication or just scalar multiplication
        if (typeof other === 'number') {

            // Making a new matrix
            let newMat = new Matrix(this.rows, this.cols);

            // Multiplying every value by the scalar
            for (let i = 0; i < this.rows; i++) {

                // Checking multiple columns
                for (let j = 0; j < this.cols; j++) {
                    newMat.data[i][j] = this.data[i][j] * other;
                }

            }

            // Setting this matrix to the new one 
            Object.assign(this, newMat);

            // Returning the new one
            return this;

        }

        // Checking to see if it is matrix multiplication
        if (other instanceof Matrix) {

            // It is in fact matrix multiplication, so here is where the fun begins

            // Checking the sizes to make sure they work
            if (this.cols != other.rows) {

                console.log("The columns in the first inputted Matrix must be the same as the rows in the second inputted Matrix.");

                console.log("Matrix a:");
                this.print();
                console.log("Matrix b:");
                other.print();

                throw new Error("MatrixMultiplicationSizeError");

            }

            // The matrix we will be returning 
            let newMat = new Matrix(this.rows, other.cols);

            // Actually doing the multiplication 
            for (let row = 0; row < newMat.rows; row++) {

                for (let col = 0; col < newMat.cols; col++) {

                    // We need to multiply every element in the row of the first matrix by every element in the column of the second matrix 
                    // The shared dimension would be the number in the row/column we are looking at
                    let sum = 0;
                    for (let i = 0; i < this.cols; i++) {

                        sum += this.data[row][i] * other.data[i][col];

                    }

                    // Now we just need to set the new matrix to include the data
                    newMat.data[row][col] = sum;

                }


            }

            // Setting this matrix and returning self
            Object.assign(this, newMat);
            return this;
        }

        // They didn't put in a useful input
        console.log("The inputted argument of the Matrix multiplication method must be another Matrix object or a number.");
        throw new Error("MatrixMultiplicationTypeError");

    }

    // The element wise multiplication method
    elementMult(other) {

        // Making sure that the input is another Matrix object
        if (!(other instanceof Matrix) && !(typeof other === 'number')) {

            console.log("The argument in the element-wise multiplication must also be a Matrix object or a number.");
            throw new Error("ElementWiseMatrixMultiplicationTypeError");

        }

        // If it is a number, I can just call the normal mult one 
        if (typeof other === 'number') {
            return this.mult(other);
        }

        // Checking to make sure they are the same size 
        if (this.cols != other.cols || this.rows != other.rows) {

            console.log("For element-wise Matrix multiplication, both matrices must have the same dimensions.")

            console.log("Matrix a:");
            this.print();
            console.log("Matrix b:");
            other.print();

            throw new Error("ElementWiseMatrixMultiplicationSizeError");

        }

        // Looping through this matrix to multiply each by each in the other 
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {

                // Actually doing the multiplication
                this.data[row][col] *= other.data[row][col];

            }
        }

        return this;

    }

    // This will be the add/subtract method
    add(input) {
        let newMat = new Matrix(this.rows, this.cols);

        // Checking to see if it is a scalar multiplication
        if (typeof input === 'number') {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMat.data[i][j] = this.data[i][j] + input;
                }
            }

            // Setting this and returning this
            Object.assign(this, newMat);
            return this;
        }

        if (input instanceof Matrix) {
            if (this.rows !== input.rows || this.cols !== input.cols) {

                console.log("Two added matrices must have the same dimensions.");

                console.log("Matrix a:");
                this.print();
                console.log("Matrix b:");
                input.print();

                throw new Error("MatrixAdditionSizeError");


            }

            // Actually adding
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMat.data[i][j] = this.data[i][j] + input.data[i][j];
                }
            }

            // Resetting and returning
            Object.assign(this, newMat);
            return this;
        }

        console.log("The input to the Matrix addition method must be a number or another Matrix object.");
        throw new Error("MatrixAdditionTypeError");
    }

    // Just a method to make subtraction easier
    subtract(input) {
        if (input instanceof Matrix) {
            return this.add(input.mult(-1));
        } else if (typeof input === 'number') {
            return this.add(input * -1);
        }

        // There must be an invalid input here
        console.log("The input to the subtract method must be another Matrix object or a number.");
        throw new Error("MatrixSubtractionTypeError");
    }

    // This will be to set the matrix to a new matrix
    set(newMat) {
        // To avoid any weird pointers and reference variables, I'm going to hardcode a deep copy

        // Clearing the matrix
        this.data = [];

        // Check if newMat is a 1D array (vector)
        if (newMat[0] === undefined || typeof newMat[0] !== 'object') {
            // Setting it up for 1D array
            for (let i = 0; i < newMat.length; i++) {
                this.data[i] = [Number(newMat[i])];
            }

            this.rows = newMat.length;
            this.cols = 1;

        } else {
            // Setting it up for 2D array
            for (let i = 0; i < newMat.length; i++) {
                this.data[i] = [];
                for (let j = 0; j < newMat[i].length; j++) {
                    this.data[i][j] = Number(newMat[i][j]);
                }
            }

            this.rows = newMat.length;
            this.cols = newMat[0].length;
        }

        // Returning self because that can be useful
        return this;
    }

    // A method that returns a copy of the matrix
    copy() {

        // First to make a new one to return
        let newMat = new Matrix(this.rows, this.cols);

        // Looping to recreate the data
        newMat.data = [];
        for (let i = 0; i < this.data.length; i++) {
            newMat.data.push(this.data[i].slice());
        }

        // Returning the new matrix
        return newMat;

        // There might be an error here; I was watching the Olympics at the same time ¯\_(ツ)_/¯

    }

    // This will be the dot product one
    dot(other) {

        // Checking to make sure it is a matrix
        if (!(other instanceof Matrix)) {
            console.error("Dot product requires another Matrix instance.");
            throw new Error("DotProductTypeError");
        }

        // Checking to make sure that the sizes match
        if (this.cols !== 1 || other.cols !== 1 || this.rows !== other.rows) {
            console.error("Both matrices must be vectors of the same length.");
            throw new Error("DotProductSizeError");
        }

        // Actually calculating the sum
        let sum = 0;
        for (let i = 0; i < this.rows; i++) {
            sum += this.data[i][0] * other.data[i][0];
        }
        return sum;
    }

    // A function to randomize the matrix
    randomize() {

        // Looping for each element to randomize it
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random();
            }
        }
        return this;
    }

    // A function to floor each of the elements in case I only want integers
    floor() {

        // Looping for each of the elements of 
        for (let i = 0; i < this.data.length; i++) {

            for (let j = 0; j < this.data[0].length; j++) {
                this.data[i][j] = Math.floor(this.data[i][j]);
            }

        }

        return this;
    }

    // A function to transpose the elements of the matrix
    transpose() {

        // The matrix we want to return
        let newMat = new Matrix(this.cols, this.rows);

        // Transpose the elements
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                newMat.data[j][i] = this.data[i][j];
            }
        }

        // Resetting and returning
        Object.assign(this, newMat);
        return this;
    }

    // A nice and easy print function
    print() {
        console.table(this.data);
        // Returning itself so that it can be used to track assignment operations
        return this;
    }

    // A function that will simply apply a function to every single element
    map(fn) {

        // The Matrix to return
        let newMat = new Matrix(this.rows, this.cols);

        for (let i = 0; i < this.rows; i++) {

            // Checking multiple columns
            if (this.cols > 1) {
                for (let j = 0; j < this.cols; j++) {
                    newMat.data[i][j] = fn(this.data[i][j], i, j);
                }
            } else {
                newMat.data[i] = [fn(this.data[i][0], i, 0)];
            }
        }

        // Resetting and returning
        Object.assign(this, newMat);
        return this;

    }

    // A method that will return the data as an array
    toArray() {
        // Deep copy of the data to avoid direct reference issues
        return this.data.map(row => row.slice());
    }


    // -------------------STATIC METHODS-----------------------
    // These will return a new matrix object for each 

    // The multiplication method  
    static mult(one, two) {

        // Checking to make sure that the first one is a matrix object
        if (!(one instanceof Matrix)) {

            console.log("The first input into the static matrix multiplication must be a matrix.");
            throw new Error("StaticMultiplicationTypeError");

        }

        // Checking to see if it is scalar multiplication
        if (typeof two === 'number') {

            // Making a new matrix
            let newMat = new Matrix(one.rows, one.cols);

            // Multiplying every value by the scalar
            for (let i = 0; i < one.rows; i++) {

                // Checking multiple columns
                for (let j = 0; j < one.cols; j++) {
                    newMat.data[i][j] = one.data[i][j] * two;
                }

            }


            // Returning the new one
            return newMat;

        }

        // Checking to see if it is matrix multiplication
        if (two instanceof Matrix) {

            // It is in fact matrix multiplication, so here is where the fun begins

            // Checking the sizes to make sure they work
            if (one.cols != two.rows) {

                console.log("Incorrect sizes in static matrix multiplication.");

                console.log("Matrix a:");
                one.print();
                console.log("Matrix b:");
                two.print();

                throw new Error("StaticMultiplicationSizeError");

            }

            // The matrix we will be returning 
            let newMat = new Matrix(one.rows, two.cols);

            // Actually doing the multiplication 
            for (let row = 0; row < newMat.rows; row++) {

                for (let col = 0; col < newMat.cols; col++) {

                    // We need to multiply every element in the row of the first matrix by every element in the column of the second matrix 
                    // The shared dimension would be the number in the row/column we are looking at
                    let sum = 0;
                    for (let i = 0; i < one.cols; i++) {

                        sum += one.data[row][i] * two.data[i][col];

                    }

                    // Now we just need to set the new matrix to include the data
                    newMat.data[row][col] = sum;

                }


            }

            return newMat;
        }

        // They didn't put in a useful input
        console.log("The second argument in static matrix multiplication must be a number or a Matrix object.");
        throw new Error("InvalidInputMultiplicationError");

    }

    // The static element wise multiplication
    static elementMult(one, two) {

        // Making sure that the inputs are Matrix object.
        if (!(two instanceof Matrix) && !(typeof two === 'number')) {

            console.log("The second argument in the static element-wise multiplication must also be a Matrix object or a number.");
            throw new Error("StaticElementWiseMatrixMultiplicationTypeError");

        }
        if (!(one instanceof Matrix) && !(typeof one === 'number')) {

            console.log("The first argument in the static element-wise multiplication must also be a Matrix object or a number.");
            throw new Error("StaticElementWiseMatrixMultiplicationTypeError");

        }

        // If it is a number, I can just call the normal mult one 
        if (typeof two === 'number') {
            return one.mult(two);
        }

        // Checking to make sure they are the same size 
        if (one.cols != two.cols || one.rows != two.rows) {

            console.log("For element-wise Matrix multiplication, both matrices must have the same dimensions.");

            console.log("Matrix a:");
            one.print();
            console.log("Matrix b:");
            two.print();

            throw new Error("ElementWiseMatrixMultiplicationSizeError");

        }

        // The thing to return 
        let newMat = new Matrix(one.rows, one.cols);

        // Looping through this matrix to multiply each by each in the other 
        for (let row = 0; row < one.rows; row++) {
            for (let col = 0; col < one.cols; col++) {

                // Actually doing the multiplication
                newMat.data[row][col] = one.data[one][two] * two.data[row][col];

            }
        }

        return newMat;


    }


    // The addition method
    static add(one, two) {

        let newMat = new Matrix(one.rows, one.cols);

        // Checking to see if it is a simple scalar
        if (typeof two === 'number') {

            for (let i = 0; i < one.rows; i++) {
                for (let j = 0; j < one.cols; j++) {
                    newMat.data[i][j] = one.data[i][j] + two;
                }
            }
            return newMat;
        }

        // Checking to see if it's matrix addition
        if (two instanceof Matrix) {

            // Checking the sizes
            if (one.rows !== two.rows || one.cols !== two.cols) {

                // Throwing size errors
                console.log("The the added matrices must have the same dimensions.");

                console.log("Matrix a:");
                one.print();
                console.log("Matrix b:");
                two.print();

                throw new Error("StaticMatrixAdditionSizeError");

            }

            // Doing the addition
            for (let i = 0; i < one.rows; i++) {
                for (let j = 0; j < one.cols; j++) {
                    newMat.data[i][j] = one.data[i][j] + two.data[i][j];
                }
            }
            return newMat;
        }

        console.log("Invalid addition input.");
        throw new Error("StaticInvalidAdditionInputError");
    }

    // The static subtraction method 
    static subtract(one, two) {

        // Making sure the first input is actually a Matrix object
        if (!(one instanceof Matrix)) {

            console.log("The first argument in the static matrix subtraction must be a Matrix object.");

            throw new Error("StaticMatrixSubtractionTypeError");

        }

        // Checking to see if it is scalar subtraction
        if (typeof two === 'number') {

            return Matrix.add(one, two * -1);

        }

        // Checking to see if it is matrix subtraction
        if (two instanceof Matrix) {

            return Matrix.add(one, Matrix.mult(two, -1));

        }

        // If it got here, then there is a type error with the second argument
        console.log("The second argument in the static matrix subtraction call must be either a number or a Matrix object.");

        throw new Error("StaticMatrixSubtractionTypeError");

    }

    // The static set method, but it will be a from array method instead
    static fromArray(arr) {

        // Returning a new matrix
        return new Matrix(arr.length, arr[0].length).set(arr);

    }

    // The static dot product method
    static dot(one, two) {

        // Checking to make sure it is a matrix
        if (!(one instanceof Matrix) || !(two instanceof Matrix)) {

            console.log("Both inputs to the static dot product method must be Matrix objects.");
            throw new Error("StaticDotProductTypeError");

        }

        // Checking to make sure that the sizes match
        if (one.cols !== 1 || two.cols !== 1 || one.rows !== two.rows) {

            console.error("Both matrices in the dot product must be vectors of the same length.");
            throw new Error("StaticDotProductSizeError");

        }

        // Actually calculating the sum
        let sum = 0;
        for (let i = 0; i < one.rows; i++) {
            sum += one.data[i][0] * two.data[i][0];
        }
        return sum;

    }

    // The static transposition method 
    static transpose(one) {

        // Checking to make sure the input is a Matrix object
        if (!(one instanceof Matrix)) {

            console.log("The static transpose method requires an input of a Matrix.");
            throw new Error("StaticTransposeTypeError");

        }

        // The matrix we want to return
        let newMat = new Matrix(one.cols, one.rows);

        // Transpose the elements
        for (let i = 0; i < one.rows; i++) {
            for (let j = 0; j < one.cols; j++) {
                newMat.data[j][i] = one.data[i][j];
            }
        }

        return newMat;
    }

    // The static map function
    static map(mat, fn) {

        // Checking to make sure that the matrix input is actually a matrix
        if (!(mat instanceof Matrix)) {
            console.log("The first argument in the static map function must be a Matrix object.");
            throw new Error("StaticMapTypeError");
        }

        // The Matrix to return
        let newMat = new Matrix(mat.rows, mat.cols);

        // Looping through and applying the function
        for (let i = 0; i < mat.rows; i++) {

            for (let j = 0; j < mat.cols; j++) {
                newMat.data[i][j] = fn(mat.data[i][j], i, j);
            }
        }

        return newMat;
    }


}   
