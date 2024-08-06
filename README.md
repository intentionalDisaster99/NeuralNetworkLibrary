# Neural Network Library
This is just a lil library that I wanted to create so that I can easily apply to whatever random project I'm working on.

## But you've already done this?!?!
Okay, yes I have, but that was a single layer, incredibly simple network. In addition, it only has one example, the simple [XOR example](https://github.com/intentionalDisaster99/XOR).
While that was fun, I hope to make this one a much longer, much more intricate challenge.

Hopefully the end result will be more useful too.



## I AM ALREADY SOLD I WANT
Awesome! There are a few ways, but I'll only outline a couple.

Right now, I only have the XOR example finished, though more are coming soon.

### XOR Example
There are two ways to run the XOR example from here. The simplest is, by far, the web editor version. You simply have to go [here](https://editor.p5js.org/intentionalDisaster99/full/c2C7rMQif) and play around. You can even edit the code there if you press the button in the top right corner.

There are some differences with the web editor version that I added, though those are simply because it makes the example work better on the web editor. It still work if you use the code directly without any changes.

Then, there's the harder method. This one is actually easier than my single layer XOR example because I included the needed p5 files \(NOT my code there, it just helps with the download) so that you can save on steps. Actually, you just need to download the files and then run them from your chosen software. I used live server in VS code personally, and it works really well.

### Function Approximation Example
This is actually exatly the same as the XOR example in the way that you use it. I made a web editor example [here](https://editor.p5js.org/intentionalDisaster99/full/sd1v2neO5) so that you can immediately play with it. I have actually added in mutltiple different example functions to showcase it that are commented out in the web editor code, so I would very much encourage you to press the little `</>` button in the top right to play with the code.

Then, for the harder method, you can simply download the files and run them with whatever live runner you like. While they are a bit harder to get working, the files in the main repo are going to generally be newer, so they might be worth using or playing around with. 


## Future Plans
I hope to continue making this more and more powerful in the future, with ore efficient algorithms and different designs\(I might get to play with branches!).

Anyway, here are some \~relatively\~ short term goals that I hope to end up adding in at some point.

- [x] Multiple layers in a more intuitive way.
- [ ] Handwriting recognition \(MNIST dataset of course).
- [ ] Flappy bird.
- [ ] Doodle recognition.
- [ ] Saving networks that do well in other files.
- [ ] GPU processing for the matrix mart of the library.
- [ ] NEAT algorithm \(Cause it's neat).
- [ ] I have [this idea](https://github.com/intentionalDisaster99/NeuralNetworkLibrary/edit/main/README.md#what-was-that-branching-stuff) to make a network that branches


## What was that branching stuff?
It was just a little idea I had to make a network that randomly branches out every so often. Basically, it would clone itself and greatly increase the clone's learning rate. 
It would slowly decrease it until it reaches the initial's learning rate. Then it would compare them and take whichever one is better.

## Uhhh why
Well, while it would probably greatly increase the training time of the network, it would probably increase the accuracy of the network and, at the end of the day, that's the goal. It would be an option that would have to specifically be toggled on when the network is instantiated so that someone who doesn't know it exists doesn't get really frustrated at it.

## Credit for p5.js
This is definitely NOT MY CODE! Huge thanks to the p5 community and creaters for all of the work that they put in to make p5 what it is today, allowing me to do all the crap I do with it. If you want to learn more or download all of it yourself, go [here](https://p5js.org).
