
// The variables that will hold the data 
let testingData = [];
let testingLabels = [];
let trainingData = [];
let trainingLabels = [];

// The elements that will show the user what we have been doing 
let briansLabel;
let correctLabel;


function setup() {

    // Creating the screen 
    createCanvas(420, 420); // Odd dimensions because it is divisible by 28

    // Loading the data (You know, hence the name)
    loadData();


}

function draw() {


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

        // Looping again to get the 
        for (let j = 0; j < (28 * 28); j++) {

            // Adding this to the image
            image.push(rawTrainingData[i][j]);

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

    // I now have to add to the training set because I had to truncate it to make it under the 100 megabyte limit
    rawTrainingData = await fetch('/Examples/HandwritingRecognition/mnist_train.csv')
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
    rawTrainingData = rawTrainingData.split('\n');

    // First, the training set
    for (let i = 0; i < rawTrainingData.length; i++) {

        // The first value is the label, so we can save that
        trainingLabels.push(rawTrainingData[i][0]);

        // Making a new array, this one being the picture of the digit
        let image = [];

        // Looping again to get the 
        for (let j = 0; j < (28 * 28); j++) {

            // Adding this to the image
            image.push(rawTrainingData[i][j]);

        }

        // Adding the image to the training data
        trainingData.push(image);

    }

    // Now, we should have everything, albeit a lot 

}