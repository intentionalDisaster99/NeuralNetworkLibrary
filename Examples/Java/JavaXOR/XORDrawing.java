package Examples.Java.JavaXOR;

// Importing the drawing stuff 
// import java.awt.Canvas;
// import java.awt.Graphics;
import java.awt.*;
import javax.swing.JFrame;

import NetworkLibrary.NeuralNetwork;


/*
 * Just a note to fellow devs here, I think I'm going to try something really dumb here.
 * I'm going to try to write a butt ton of methods so that it's really readable later for someone who
 * comes in wanting to learn. 
 * 
 * It's dumb because you usually want to write LESS code and this is MORE code, but I think it's worth it.
 * 
 * Theoretically, though, it might mean in the future I could stop using comments because my code would be so readable(tho I pride myself in my comments)
 */


public class XORDrawing extends Canvas{

    // My neural network
    public static NeuralNetwork brain;

    // The places where we will be putting the things
    public static JFrame frame;
    public static Canvas canvas;

    
    public static void main(String[] args) {

        // Creating my neural network
        int[] layout = {2, 4, 4, 4, 2};
        brain = new NeuralNetwork(layout);

        // Creating the frame where we will be putting all of the things
        frame = new JFrame("XOR Neural Network Example");

        // The canvas that we will be drawing on
        canvas = new XORDrawing();
        canvas.setSize(600, 600);
        frame.add(canvas);
        frame.pack();
        frame.setVisible(true);

        while (true) {

            train(brain, 1);
            canvas.repaint();

            try {
                Thread.sleep(1/60);
            }
            catch(InterruptedException e) {
                System.err.println(e.getMessage());
            }

            
        }
    }

    // Here's a static method that returns the XOR output to help with testing
    public static double XOR(double x, double y) {
        if (x == 1 && y == 0 || x == 0 && y == 1) {
            return 1.0;
        }
        return 0;
    }

    // A method that randomly gets the input and expected output of the network
    public static double[][] getRandomIO() {

        // The output, duh
        double[][] output = new double[2][2];

        // The inputs will be the first part of the output
        output[0][0] = Math.round(Math.random());
        output[0][1] = Math.round(Math.random());

        // We need to use the the input to find the output
        output[1][0] = (XOR(output[0][0], output[0][1]) == 1) ? 0 : 1;
        output[1][1] = XOR(output[0][0], output[0][1]);

        // Returning 
        return output;

    }
    

    // Now a method to train the network
    public static void train(NeuralNetwork brain, int times) {

        // Accounting for times
        for (int i = 0; i < times; i++) {

            // Getting the training data 
            double[][] data = getRandomIO();

            // Training the brain 
            brain.train(data[0], data[1]);

        }

    }
    

    // Overriding the paint method to draw the screen
    @Override
    public void paint(Graphics g) {

        // Create an off-screen image for double buffering
        Image offScreenImage = canvas.createImage(canvas.getWidth(), canvas.getHeight());
        
        // The graphics that are actually taken off of that off screen image
        Graphics offScreenGraphics = offScreenImage.getGraphics();

        // Here is where I'd add any styling if I was any good at that (hint hint)
        // But for now, I'll just call my method that draws the screen based on the AI
        drawScreen(offScreenGraphics);

        g.drawImage(offScreenImage, 0, 0, this);

    }

    // Overriding the update method to stop the screen from flashing
    @Override
    public void update(Graphics g) {
        paint(g);
    }

    public static void drawScreen(Graphics g) {
        int SPACING = 15;

        // Getting the dimensions out of the canvas
        int width = canvas.getSize().width;
        int height = canvas.getSize().height;

        // Looping through the screen
        for (int row = 0; row < height; row += SPACING) {
            for (int col = 0; col < width ; col += SPACING) {

                // Making an input
                double[] inputArr = {(double)row / (double)height, (double)col / (double)width};

                // Getting the output from the network
                double[] output = brain.feedForward(inputArr);

                // Setting the color to show what the network thought
                g.setColor(new Color((float)output[1],(float)output[1],(float)output[1]));

                // Drawing a rectangle where we are
                g.fillRect(row, col, SPACING, SPACING);


            }

        }
        
    }

}


// A method that will fill the screen based on what the network thinks the screen should look like
