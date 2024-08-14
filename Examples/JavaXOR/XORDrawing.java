package Examples.JavaXOR;

// Importing the drawing stuff 
import java.awt.Canvas;
import java.awt.Graphics;
import javax.swing.JFrame;

import NetworkLibrary.NeuralNetwork;


public class XORDrawing extends Canvas{

    
    public static void main(String[] args) {

        // Creating my neural network
        NeuralNetwork brain = new NeuralNetwork();

        // Creating the 
        JFrame frame = new JFrame("XOR Neural Network Example");
        Canvas canvas = new XORDrawing();
        canvas.setSize(600, 600);
        frame.add(canvas);
        frame.pack();
        frame.setVisible(true);
    }


    
    public void paint(Graphics g) {
        // g.fillOval(100, 100, 200, 200);

    }



}


// A method that will 