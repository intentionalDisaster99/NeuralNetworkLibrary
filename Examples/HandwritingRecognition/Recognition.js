
// The variables that will hold the data 
let testingData = [];
let testingLabels = [];
let trainingData = [];
let trainingLabels = [];

// The elements that will show the user what we have been doing 
let briansLabel;
let correctLabel;

// BRIAN
let brian;

// A bool to make it easy to know if the data has loaded or not
let loaded = false;


function setup() {

    // Creating the screen 
    createCanvas(420, 420); // Odd dimensions because it is divisible by 28

    // Loading the data (You know, hence the name)
    loadData();

    // Now to create the idiot
    brian = new NeuralNetwork([784, 10, 5, 2, 10]);

    // Making sure that the user knows it's just loading
    console.log("Loading...");

}

function mousePressed() {

    saveTheIdiot();


}

function draw() {

    // Checking to make sure it is loaded 
    if (!loaded) { return }

    // Picking a random digit to work with
    let index = Math.floor((Math.random() * trainingData.length));

    // Drawing the one we are on now
    drawDigit(index);

    // Now to train brian
    train();

    // Just logging what the dataset thinks it is and what Brian thinks it is
    console.log("It is a ", trainingLabels[index]);

    // These are the probabilities of each (Tho they might not add up to 1)
    let output = brian.feedForward(trainingData[index]);

    // Figuring out which one is the highest one
    let highestIndex = 0;
    let highest = 0;
    for (let i = 0; i < 10; i++) {
        if (output[i] > highest) {
            highest = output[i];
            highestIndex = i;
        }
    }

    // Printing out what we got from Brian
    console.log("Brian thinks that it is a " + highestIndex);




}

// Now for a simple training function that I will probably be refactoring later
function train() {

    for (let i = 0; i < 500; i++) {

        // Picking a random training index to train on 
        let index = Math.floor((Math.random() * trainingData.length));

        // Setting up the input
        let labels = [];
        for (let j = 0; j < 10; j++) {
            if (j == trainingLabels[index]) {
                labels.push(1);
            } else {
                labels.push(0)
            }
        }

        // Running it back through brian 
        brian.train(trainingData[i], labels);

    }


}


function drawDigit(index) {

    // Finding the width and height of the rectangles
    let rectWidth = width / 28;
    let rectHeight = height / 28;

    // Making sure that there is no stroke
    noStroke();

    // Now we want to actually draw it
    for (let x = 0; x < 28; x++) {

        for (let y = 0; y < 28; y++) {

            // Finding the color that we need to draw here
            fill(trainingData[index][x + y * 28], trainingData[index][x + y * 28], trainingData[index][x + y * 28]);

            // Drawing
            rect(x * rectWidth, y * rectHeight, rectWidth, rectHeight);

        }

    }


}

async function loadData() {


    // First, getting the training data
    // var rawTrainingData;

    // Getting the data out of the training file
    let rawTrainingData = await fetch('/Examples/HandwritingRecognition/mnist_train.csv')
        .then(function (res) {
            if (!res.ok) {
                throw new Error('Network response was not ok ' + res.statusText);
            }
            // rawTrainingData = res.text();
            return res.text(); // Use .text() to read the file as text
        })
        .then(function (data) {
            // Getting the data out
            // console.log(data.slice(0, 100))
            return data;
            // rawTrainingData = data;
        })
        .catch(function (error) {
            console.error('There has been a problem with your fetch operation:', error);
        });

    // Getting the data out of the testing file
    let rawTestingData = await fetch('/Examples/HandwritingRecognition/mnist_test.csv')
        .then(function (res) {
            if (!res.ok) {
                throw new Error('Network response was not ok ' + res.statusText);
            }
            // rawTrainingData = res.text();
            return res.text(); // Use .text() to read the file as text
        })
        .then(function (data) {
            // Getting the data out
            // console.log(data.slice(0, 100))
            return data;
            // rawTrainingData = data;
        })
        .catch(function (error) {
            console.error('There has been a problem with your fetch operation:', error);
        });

    // Splitting the data by the new line
    rawTestingData = rawTestingData.split('\n');
    rawTrainingData = rawTrainingData.split('\n');



    // Okay, now that we have the data, we need to separated it out into a legible format
    // The way I'll do this is to have a data array and labels array and then use the index values to match them

    // First, the training set
    for (let i = 0; i < rawTrainingData.length; i++) {

        // The first value is the label, so we can save that
        trainingLabels.push(rawTrainingData[i][0]);

        // Making a new array, this one being the picture of the digit
        let image = [];

        // Making another array, this one the one that we will be using to split the image along the commas
        let thisImage = rawTrainingData[i].split(',');

        // Looping again to get the 
        for (let j = 0; j < (28 * 28); j++) {

            // console.log("Pushing ", thisImage[j])
            image.push(thisImage[j]);

        }

        // Adding the image to the training data
        trainingData.push(image);

    }

    // Now, the testing set
    for (let i = 0; i < rawTestingData.length; i++) {

        // The first value is the label, so we can save that
        testingLabels.push(rawTestingData[i][0]);

        // Making a new array, this one being the picture of the digit
        let image = [];

        // Looping again to get the 
        for (let j = 0; j < (28 * 28); j++) {

            // Adding this to the image
            image.push(rawTestingData[i][j]);

        }

        // Adding the image to the training data
        testingData.push(image);

    }

    // Now, we should have everything, albeit a lot, so we can restart the drawing
    loaded = true;

    // Telling the user that it has finished loading
    console.log("Finished loading!");

}


// This should (hopefully) be a function that saves Brian as a JSON file to be used later
function saveTheIdiot() {

    let spaghettifiedBrian = JSON.stringify(brian);//brian.toJSON();

    // console.log(spaghettifiedBrian);

    brian = NeuralNetwork.fromJSON(spaghettifiedBrian);


}