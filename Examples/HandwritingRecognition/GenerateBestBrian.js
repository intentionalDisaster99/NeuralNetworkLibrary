// This file is to generate the best Brian I can
/*

You'd think you could just train him a lot, but annoyingly it never really seems like I can because
there is usually a time when he ends up only guessing zero and I don't know why.
I think it's because there is a zero in one of the matrices that manages to completely zero out every output node except for the zero one.  

I think I can figure it out because it isn't a random node that it's landing on and I'm working on it, but for now we have this

*/

// Very boring to look at, unfortunately, with only logging the scores that we get

// Declaring the idiot
let brian;

// Declaring the idiot with the highest score
let bestBrian;

// The variable that we will be using to record the highest percentage that we have and which Brian has that
let highScore = 0;

// The global variable that we will use to see if the data has been loaded or not
let loaded = false;

// The variables that hold the training data
let testingData = [];
let testingLabels = [];
let trainingData = [];
let trainingLabels = [];

function setup() {

    // Loading the data
    loadData();

    // Making Brian (same sizes as from main recognition.js sketch)
    brian = new NeuralNetwork([784, 256, 64, 32, 10]);

}

function draw() {

    if (!loaded) { return };

    // First, we want to train Brian
    train(1000);

    // Now we want to see if Brian gets a better score on, like, 10,000 of the training data
    let score = test(1000);

    // Checking to see if we have a new high score
    if (score > highScore) {
        bestBrian = new NeuralNetwork(brian);
    }

    // Checking to see if we are done training because Brian has quit learning and gone to guessing only zero
    if (score < 20) {
        saveTheIdiot();
    }



}

// Saving when the user pressed enter
function keyPressed() {
    if (keyCode === ENTER) {
        saveTheIdiot();
    }
}

// A function to test with some of the 
function test(times) {

    // Tracking variables
    let total = 0;
    let right = 0;

    // Looping for a bit of the training set
    for (let i = 0; i < times; i++) {

        let index = Math.floor(Math.random() * trainingData.length);

        // Getting the outputs
        let output = brian.feedForward(trainingData[index]);

        // Figuring out what the highest one is 
        let highestIndex = 0;
        let highest = 0;
        for (let j = 0; j < 10; j++) {
            if (output[j] > highest) {
                highest = output[j];
                highestIndex = j;
            }
        }

        // It's right if the highestIndex is the same as the label
        if (highestIndex == trainingLabels[index]) {
            right++;
        }

        // Adding another to the total
        total++;

    }

    // Logging the score because I am beyond interested
    console.log(right / total * 100 + "%")

    // Returning the percentage
    return right / total * 100;

}




// These functions are just taken straight from Recognition.js
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

// This should (hopefully) be a function that saves Brian as a JSON file to be used later
function saveTheIdiot() {

    let spaghettifiedBrian = JSON.stringify(bestBrian);//brian.toJSON();

    // console.log(spaghettifiedBrian);

    brian = NeuralNetwork.fromJSON(spaghettifiedBrian);


    // Saving the data to the json file
    download(spaghettifiedBrian, 'Brian.JSON', "Saved Network");

}

// A function that downloads to the computer
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}