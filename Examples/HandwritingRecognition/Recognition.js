
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

// The different buttons that the user can press to control Brian
let nextButton;
let testButton;

// The labels that show the user how Brian is doing
let scoreText;
let labelText; // What Brian thinks it is vs what it is 


function setup() {

    // Creating the screen 
    createCanvas(420, 420); // Odd dimensions because it is divisible by 28

    // Loading the data (You know, hence the name)
    loadData();

    // Now to create the idiot
    brian = new NeuralNetwork([784, 256, 64, 32, 10]);

    // Creating the buttons
    nextButton = createButton("Next Number");
    testButton = createButton("Test Brian");

    // Making the buttons actually do stuff
    nextButton.mousePressed(next);
    testButton.mousePressed(getAccuracy);

    // Making the labels
    scoreText = createP("LOADING...");
    labelText = createP("LOADING...");

}

function draw() {

    // Checking to make sure it is loaded
    if (!loaded) { return }

    // Training Brian 100 times (100 is arbitrary; have fun changing it and see what happens)
    train(100);

}

// Now for a simple training function that I will probably be refactoring later
function train(times) {

    // Training the number of times they want us to
    for (let i = 0; i < times; i++) {

        // Picking a random training index to train on 
        let index = Math.floor((Math.random() * trainingData.length));

        // Making an array of 0's to use as the labels
        let labels = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // Putting a 1 at the index of the label
        labels[Number(trainingLabels[index])] = 1;

        let imageInputs = trainingData[index];

        // Running it back through brian
        brian.train(imageInputs, labels);

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
            fill(trainingData[index][x + y * 28] * 255, trainingData[index][x + y * 28] * 255, trainingData[index][x + y * 28] * 255);

            // Drawing
            rect(x * rectWidth, y * rectHeight, rectWidth, rectHeight);

        }

    }


}

// A function that will pick another random bit of the data to check from
function next() {

    // Picking a random digit to work with
    let index = Math.floor((Math.random() * trainingData.length));

    // Drawing the one we are on now
    drawDigit(index);

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

    // Making a string to use to tell the user about Brian's stupidity
    let labelString = "It is a " + trainingLabels[index] + ".\n";

    // What did Brian think?
    labelString += "Brian thought that it was a " + highestIndex + ".\n";

    // Was Brian right?
    if (trainingLabels[index] == highestIndex) {
        labelString += "He was right!";
    } else {
        labelString += "He was wrong!";
    }

    // Writing it to the paragraph element so that they can actually see it
    labelText.html(labelString);

}

// TODO Change these from training data to testing data
// A function that checks Brian against all of the training data and returns his score
// TODO Institute a rolling accuracy system so that it doesn't take so long
function getAccuracy() {

    // Tracking variables
    let total = 0;
    let right = 0;

    // Looping for a bit of the training set
    for (let i = 0; i < trainingLabels.length * 0.25; i++) {

        // Getting the outputs
        let output = brian.feedForward(trainingData[i]);

        // Figuring out what the highest one is 
        let highestIndex = 0;
        let highest = 0;
        for (let i = 0; i < 10; i++) {
            if (output[i] > highest) {
                highest = output[i];
                highestIndex = i;
            }
        }

        // It's right if the highestIndex is the same as the label
        if (highestIndex == trainingLabels[i]) {
            right++;
        }

        total++;

    }

    scoreText.html("Brian's last score was " + right / total * 100 + "%");


}

async function loadData() {

    // Making sure that the user knows it's just loading
    console.log("Loading...");

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

        // Looping again to get the image
        for (let j = 0; j < (28 * 28); j++) {

            // Adding in the data, just normalized to be between 0 and 1
            image.push(thisImage[j] / 255);

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

        // Looping again to get the data
        for (let j = 0; j < (28 * 28); j++) {

            // Adding in the data, just normalized to be between 0 and 1
            image.push(rawTestingData[i][j] / 255);

        }

        // Adding the image to the training data
        testingData.push(image);

    }

    // Now, we should have everything, albeit a lot, so we can restart the drawing
    loaded = true;

    // Telling the user that it has finished loading
    labelText.html("");
    scoreText.html("Brian has not been tested yet!");

}


// This should (hopefully) be a function that saves Brian as a JSON file to be used later
function saveTheIdiot() {

    let spaghettifiedBrian = JSON.stringify(brian);//brian.toJSON();

    // console.log(spaghettifiedBrian);

    brian = NeuralNetwork.fromJSON(spaghettifiedBrian);


    // Saving the data to the json file
    download(spaghettifiedBrian, 'Brian.JSON', "Saved Network");

}


// This downloads it to the computer, I need one that will save it to the browser's memory
// I'll keep this one though for whenever we get one that is really good
// function download(content, fileName, contentType) {
//     var a = document.createElement("a");
//     var file = new Blob([content], { type: contentType });
//     a.href = URL.createObjectURL(file);
//     a.download = fileName;
//     a.click();
// }