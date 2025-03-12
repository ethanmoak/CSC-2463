let trainImg;
let trainOsc1, trainOsc2, noise, filter, lfo, gain, envelope, distortion, reverb;
let showImage = false; // Controls when to display image

function preload() {
  trainImg = loadImage("media/train.jpg", img => {
    console.log("Image loaded successfully!");
  }, err => {
    console.error("Image failed to load. Check file path!");
  });
}

function setup() {
  createCanvas(500, 300);
  background(220);
  textAlign(CENTER, CENTER);
  textSize(18);
  text("Click to play realistic train rumble!", width / 2, height / 2);

  // **Gain Node (Controls Volume)**
  gain = new Tone.Gain(0.8).toDestination();

  // **Oscillators for Deep Engine Rumble**
  trainOsc1 = new Tone.Oscillator({
    type: "sine",
    frequency: 40, // Deep engine bass
    volume: -3,
  });

  trainOsc2 = new Tone.Oscillator({
    type: "sine",
    frequency: 42, // Slight detune for natural rumble
    volume: -3,
  });

  // **Noise Source for Rolling Wheels**
  noise = new Tone.Noise("brown"); // Low-frequency rolling noise

  // **Low-Pass Filter to Shape Noise & Oscillator**
  filter = new Tone.Filter({
    type: "lowpass",
    frequency: 500, // Keeps it deep & muffled
    Q: 1,
  });

  // **LFO to Modulate the "Chugging" Effect**
  lfo = new Tone.LFO({
    frequency: 2.5, // Creates rhythmic pulsing (~2.5 chugs per second)
    min: 200,
    max: 600, // Modulates the filter frequency for movement
  });

  // **Envelope for Smooth Start & Stop**
  envelope = new Tone.AmplitudeEnvelope({
    attack: 2, // Slow fade-in
    decay: 4,
    sustain: 0.5,
    release: 3, // Gradual fade-out
  });

  // **Distortion for a Slight Gritty, Mechanical Effect**
  distortion = new Tone.Distortion(0.2); // Adds realism to the engine noise

  // **Reverb to Simulate an Open Train Environment**
  reverb = new Tone.Reverb({
    decay: 4,
    preDelay: 0.5,
  });

  // **Connect Everything Together**
  trainOsc1.connect(filter);
  trainOsc2.connect(filter);
  noise.connect(filter);
  filter.connect(envelope);
  envelope.connect(distortion);
  distortion.connect(reverb);
  reverb.connect(gain);

  // **LFO Modulates the Filter for Track Wheel Movement**
  lfo.connect(filter.frequency);
}

function draw() {
  background(220);
  text("Click to play realistic train rumble!", width / 2, height / 2);

  // Show the train image *only after clicking*
  if (showImage) {
    image(trainImg, 50, 50, 400, 200);
  }
}

function mouseClicked() {
  Tone.start().then(() => {
    showImage = true; // Show the train image when clicked
    console.log("Train rumble playing...");

    // Start sound elements
    trainOsc1.start();
    trainOsc2.start();
    noise.start();
    lfo.start(); // Start rhythmic train movement

    // Trigger envelope for smooth fade-in
    envelope.triggerAttack();

    // **Stop after 12 seconds**
    setTimeout(() => {
      envelope.triggerRelease();
      setTimeout(() => {
        trainOsc1.stop();
        trainOsc2.stop();
        noise.stop();
        lfo.stop();
        showImage = false; // Hide the train image after sound stops
        console.log("Train rumble stopped.");
      }, 3000); // Allow time for fade-out
    }, 9000); // Play for 9s before fading out
  }).catch(err => console.error("Tone.js failed to start:", err));
}
