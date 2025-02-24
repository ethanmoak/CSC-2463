let startContext, samples, sampler, button1, button2, button3, button4, delTimeSlider, feedbackSlider, distSlider, wetSlider;

let rev = new Tone.Reverb(5).toDestination();
let dist = new Tone.Distortion(0).connect(rev);
let del = new Tone.FeedbackDelay(0, 0).connect(dist);
del.wet.value = 0.5

function preload() {
  //sampler = new Tone.Player("media/Lambo.mp3").toDestination();
  samples = new Tone.Players({
    Lambo: "media/Lambo.mp3",
    Mustang: "media/Mustang.mp3",
    LexusLFA: "media/LexusLFA.mp3",
    Supra: "media/Supra.mp3"

  }).connect(del);
}

function setup() {
  createCanvas(400, 400);
  startContext = createButton("Start Audio Context");
  startContext.position(0,0);
  startContext.mousePressed(startAudioContext);
  button1 = createButton('Play Lambo Sample');
  button1.position(10,30);
  button2 = createButton('Play Mustang Sample');
  button2.position(200,30);
  button3 = createButton('Play Lexus LFA Sample');
  button3.position(10,60);
  button4 = createButton('Play Supra Sample');
  button4.position(200,60);
  button1.mousePressed(() => {samples.player("Lambo").start()});
  button2.mousePressed(() => {samples.player("Mustang").start()});
  button3.mousePressed(() => {samples.player("LexusLFA").start()});
  button4.mousePressed(() => {samples.player("Supra").start()});
  delTimeSlider = createSlider(0, 1, 0, 0.01);
  delTimeSlider.position(10, 300);
  delTimeSlider.input(() => {del.delayTime.value = delTimeSlider.value()});
  feedbackSlider = createSlider(0, 0.99, 0, 0.01);
  feedbackSlider.position(200, 300);
  feedbackSlider.input(() => {del.feedback.value = feedbackSlider.value()});
  distSlider = createSlider(0, 10, 0, 0.01);
  distSlider.position(10, 330);
  distSlider.input(() => {dist.distortion = distSlider.value()});
  wetSlider = createSlider(0, 1, 0, 0.01);
  wetSlider.position(200, 330);
  wetSlider.input(() => {rev.wet.value = wetSlider.value()});
  //button1.mousePressed(() => {sampler.start()});
}

function draw() {
  background(220);
  text("Delay Time: " + delTimeSlider.value(), 15, 300);
  text("Feedback: " + feedbackSlider.value(), 215, 300);
  text("Distortion: " + distSlider.value(), 15, 330);
  text("Reverb Wet: " + wetSlider.value(), 215, 330);
}

//function playSample() {
//  sampler.start();
// }

function startAudioContext(){
  if (Tone.context.state != 'running') {
    Tone.start();
    console.log("Audio Context Started")
  } else {
    console.log("Audio Context Already Running")
  }
}