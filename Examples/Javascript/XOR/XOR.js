
// This is a sort of test sketch to run the neural network library 
// It will be the xor example

let trainingData = [
    { "input": [0, 1], "output": [1] },
    { "input": [1, 1], "output": [0] },
    { "input": [0, 0], "output": [0] },
    { "input": [1, 0], "output": [1] },
]

// Declaring the global variables
let brain;
let spacing = 10;
let spacingLabel;
let spacingSlider;
let lrLabel;
let lrSlider;
let hiddenLayout;
let img;
let imageIntID;


function setup() {

    // Drawing the canvas
    createCanvas(500, 500);

    // Initializing the layout that we want in the neural network
    let layout = [2, 4, 1, 4, 2, 1];

    // Creating a neural network to use 
    brain = new NeuralNetwork(layout);

    // Creating the HTML elements that we will be using
    lrLabel = createP("Learning rate: " + 0.1);
    lrSlider = createSlider(0.01, 0.5, 0.025, 0.01);
    spacingLabel = createP("Resolution: " + spacing);
    spacingSlider = createSlider(1, 25, 10, 1);

    // The image that will hold the pixels that we need to draw
    img = createImage(width, height);

    // Load the image's pixels into memory.
    img.loadPixels();

    // Set all the image's pixels to the initial randomness that is Brian's brain right now
    for (let x = 0; x < img.width; x += 1) {
        for (let y = 0; y < img.height; y += 1) {
            for (let i = 0; i < 4; i++) {

                // Getting the pixel location
                let pixelIndex = 4 * ((y) * width + (x)) + i;

                // Checking to see if it is the alpha
                if (i == 3) {

                    // Running the neural network
                    let input1 = x / width;
                    let input2 = y / height;

                    img.pixels[pixelIndex] = brain.feedForward([input1, input2]) * 255;

                } else {

                    // Changing the color values to black
                    img.pixels[pixelIndex] = 0;

                }

            }
        }
    }

    // Update the image's pixel values.
    img.updatePixels();

    // Drawing the image initially initially
    image(img, 0, 0);

}


function draw() {

    // Training the brain
    trainData();

    // Drawing the pixels
    drawPix();

}

function trainData() {

    // Getting the learning rate
    brain.learningRate = lrSlider.value();

    // Adjusting the label
    lrLabel.html("Learning rate: " + brain.learningRate);

    // Training 100 times
    for (let i = 0; i < 100; i++) {

        // Making sure that it's a random order
        let data = trainingData[Math.floor(Math.random() * 4)];

        // Taking out the data from the dataset
        let _input = data['input'];
        let label = data['output'];

        // Actually training the brain
        brain.train(_input, label);
    }

}


// The function to draw every pixel
function drawPix() {

    // Getting the spacing
    spacing = spacingSlider.value();

    // Adjusting the look of the label
    spacingLabel.html("Resolution: " + spacing);

    for (let x = 0; x < width; x += spacing) {

        for (let y = 0; y < height; y += spacing) {

            // Sizing the inputs to make them fit the sizing of the dataset
            let input1 = x / width;
            let input2 = y / height;

            // Getting an output from the 
            let output = brain.feedForward([input1, input2]);

            // Mapping the output to an grayscale value
            output = output[0][0] * 255;

            // Looping for the resolution
            for (let pixX = 0; pixX < spacing; pixX++) {

                // Making sure that it doesn't overlap to the other side
                if (x + pixX >= width) {
                    continue;
                }

                // Updating the area defined by the resolution
                for (let pixY = 0; pixY < spacing; pixY++) {

                    // Finding the location of the rgb values we want to change
                    let pixelIndex = 4 * ((y + pixY) * width + (x + pixX));

                    // Setting the actual pixel values
                    img.pixels[pixelIndex] = output;
                    img.pixels[pixelIndex + 1] = output;
                    img.pixels[pixelIndex + 2] = output;

                }

            }

        }

    }

    // Setting the img pixels
    img.updatePixels();

    // Actually drawing the image to the screen
    image(img, 0, 0);

}