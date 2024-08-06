// The neural network that we need. His name is Brian
let brian;

// The resolution of the lines
let resolution = 5;
let resolutionLabel;
let resolutionSlider;



function setup() {

    createCanvas(500, 500);

    // Instantiating Brian
    brian = new NeuralNetwork([1, 10, 10, 10, 10, 1]);

    // Instantiating the slider and it's label
    resolutionLabel = createP("Resolution: " + resolution);
    resolutionSlider = createSlider(1, 100, 5, 1);


}


function draw() {

    // Drawing the background as black
    background(0);

    // Moving to the center so that the function is centered at the, uh, center
    translate(height / 2, width / 2);

    // Drawing the function that we want
    whatYouWant();

    // Drawing Brian's guess
    whatBrianWants();

    // Training Brian
    trainTheIdiot();

}


// A function to draw what we want
function whatYouWant() {

    // Setting the colors to what we want
    stroke(0, 255, 0);
    noFill();

    // Getting the resolution for the drawing
    resolution = resolutionSlider.value();
    resolutionLabel.html("Resolution: " + resolution);

    // Starting shape
    beginShape();

    // Using the shape to draw the line
    for (let x = -width / 2 - resolution; x < width / 2 + resolution; x += resolution) {

        // Getting the x and y
        let i = x / (width / 2);
        let y = fn(i);

        // Moving things down to account for the fact that the function only outputs
        y -= 1;
        y *= 2;

        // Adding a vertex and adjusting the scale from the neural network
        vertex(x, y * height / 2 + height / 2);

    }

    // Closing it off
    endShape();

}

// A function that returns what Brian thinks of all this
function whatBrianWants() {

    // Setting the colors to what we want
    stroke(255, 255, 0);
    noFill();

    // Getting the resolution for the drawing
    resolution = resolutionSlider.value();
    resolutionLabel.html("Resolution: " + resolution);

    // Starting shape
    beginShape();

    // Using the shape to draw the line
    for (let x = -width / 2 - resolution; x < width / 2 + resolution; x += resolution) {

        // Getting the x and y
        let i = x / (width / 2);
        let y = brian.feedForward([i]);

        // Moving things down to account for the fact that the function only outputs
        y -= 1;
        y *= 2;

        // Adding a vertex and adjusting the scale from the neural network
        vertex(x, y * height / 2 + height / 2);

    }

    // Closing it off
    endShape();

}

// The function to train
function trainTheIdiot() {

    // Stopping if the learningRate is zero
    if (brian.learningRate <= 0) {
        return;
    }

    // Looping for a bunch of times because yes 
    let times = 100;

    // Sometimes it likes to get stuck, but I think I can fix it by upping the times every so often
    if (Math.random() < 0.001) {
        times = 10000;
    }

    // Now for the actual looping
    for (let i = 0; i < times; i++) {

        // Randomizing the label
        let x = Math.random() * 2 - 1;
        let y = fn(x);


        // Training on the random data
        brian.train([x], [y]);

    }

    // Slowly lowering the learning rate so that it stops jiggling so much
    brian.learningRate *= 0.9999999;

    // IF IT DOESN'T WORK WELL ENOUGH FOR YOU, GET RID OF THIS ^^^ :D

}

// A function that will adjust the output of the function to match the neural network's range
function adjust(x) {

    // Adjusting the function so that it at least almost looks like it's on a normal cartesian plane
    x *= -250;

    // Making sure it stays on the screen. That way, the network doesn't get confused when trained with it
    if (x > height / 2) return 1;
    if (x < - height / 2) return 0;

    // Mapping it to make it between 0 and 1
    x = x / (height / 2) / 2 + 0.5

    // Returning the answer
    return x

}

// The function we are training to match
// The input will be between -1 and 1 and the output will be between 0 and 1
function fn(x) {

    // The actual function 
    let ans = Math.sin(x)
    // let ans = x * x;

    // Returning it, but mapping it to make it being less than 1
    return adjust(ans);
}
