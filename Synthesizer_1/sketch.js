let synth1, polySynth, noise1, ampEnv1, filt1, metalSynth, fmSynth, basicSynth;
let lowPassFilter, rev;
let activeKey = null;

let keyNotes = {
  'a': 'A4',
  's': 'B4',
  'd': 'C5',
  'f': 'D5'
};

let keyNotes1 = {
  'q': 'D4',
  'w': 'F4',
  'e': 'A4'
};

function setup() {
  createCanvas(500, 400);
  
  // Filter and Reverb as Sound Processors
  lowPassFilter = new Tone.Filter(800, "lowpass").toDestination();
  rev = new Tone.Reverb(2).toDestination();

  // Monophonic Synth
  synth1 = new Tone.Synth({
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.9, release: 0.3 }
  }).connect(rev);

  // Polyphonic Synth
  polySynth = new Tone.PolySynth(Tone.Synth).connect(rev);
  polySynth.set({
    envelope: { attack: 0.1, decay: 0.1, sustain: 1, release: 0.1 },
    oscillator: { type: 'sawtooth' }
  });

  // Noise Generator with Envelope and Filter
  ampEnv1 = new Tone.AmplitudeEnvelope({
    attack: 0.1, decay: 0.5, sustain: 0, release: 0.1
  }).toDestination();
  
  filt1 = new Tone.Filter(1500, "highpass").connect(ampEnv1);
  noise1 = new Tone.Noise('pink').start().connect(filt1);

  // Metal Synth
  metalSynth = new Tone.MetalSynth({
    envelope: { attack: 0.5, decay: 5, sustain: 1, release: 3 }
  }).toDestination();

  // FM Synth
  fmSynth = new Tone.FMSynth({
    harmonicity: 1.5,
    modulationIndex: 10
  }).connect(lowPassFilter);

  // Basic Synth
  basicSynth = new Tone.Synth({
    envelope: { attack: 0.9, decay: 1, sustain: 0.5, release: 1 },
    oscillator: { type: 'sine' }
  }).toDestination();

  // Button for Interactive Synth Play
  let synthButton = createButton("Play A#3");
  synthButton.position(50, 350);
  synthButton.mousePressed(() => {
    basicSynth.triggerAttackRelease("A#3", 2);
  });
}

function draw() {
  background(220);
  textSize(14);
  text("Keys Mapping:", 20, 20);
  text("a-f: Monophonic Synth", 20, 40);
  text("q-e: Polyphonic Synth", 20, 60);
  text("z: Noise Generator", 20, 80);
  text("x: Metal Synth", 20, 100);
  text("c: FM Synth", 20, 120);
}

function keyPressed() {
  let pitch = keyNotes[key];
  let pitch1 = keyNotes1[key];

  if (pitch && key !== activeKey) {
    synth1.triggerRelease();
    activeKey = key;
    synth1.triggerAttack(pitch);
  } else if (pitch1) {
    polySynth.triggerAttack(pitch1);
  } else if (key === "z") {
    ampEnv1.triggerAttackRelease(0.1);
  } else if (key === "x") {
    metalSynth.triggerAttackRelease("C5", 4);
  } else if (key === "c") {
    fmSynth.triggerAttack("A4");
  }
}

function keyReleased() {
  let pitch1 = keyNotes1[key];

  if (key === activeKey) {
    synth1.triggerRelease();
    activeKey = null;
  } else if (pitch1) {
    polySynth.triggerRelease(pitch1);
  } else if (key === "c") {
    fmSynth.triggerRelease();
  }
}

