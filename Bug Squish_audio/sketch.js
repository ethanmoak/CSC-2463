let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});

let gameState = GameStates.START;
let score = 0;
let highScore = 0;
let time = 30;
let textPadding = 15;
let gameFont;
let bugs = [];
let bugSprites;

let sounds, synth, bgLoop; // ✅ renamed loop → bgLoop
let bgMusicPlaying = false;
let gameOverSoundPlayed = false;
let warningPlayed = false;

function preload() {
  gameFont = loadFont("media/PressStart2P-Regular.ttf");
  bugSprites = loadImage("media/New Piskel.png");

  sounds = new Tone.Players({
    bugSquish: "media/bugsquish.mp3",
    gameStart: "media/gamestartclick.mp3",
    missedBug: "media/missedbug.mp3",
    bugsMoving: "media/bugsmoving.mp3"
  }).toDestination();
}

function setup() {
  createCanvas(400, 400);
  textFont(gameFont);

  for (let i = 0; i < 5; i++) {
    bugs.push(new Bug());
  }

  synth = new Tone.PolySynth(Tone.MembraneSynth).toDestination();

  bgLoop = new Tone.Loop(time => {
    let bassSynth = new Tone.MembraneSynth().toDestination();
    let melodySynth = new Tone.Synth({
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.1, release: 0.5 }
    }).toDestination();

    let chordProgression = [
        ["C3", "E3", "G3"], // C major
        ["A2", "C3", "E3"], // A minor
        ["F3", "A3", "C4"], // F major
        ["G2", "B2", "D3"]  // G major
    ];
    
    let chord = chordProgression[Math.floor((time * 2) % chordProgression.length)];

    // Play an arpeggio instead of a static chord
    chord.forEach((note, i) => {
        melodySynth.triggerAttackRelease(note, "16n", time + i * 0.1);
    });

    // Add a bass note every beat
    let bassNotes = ["C2", "A1", "F1", "G1"];
    bassSynth.triggerAttackRelease(bassNotes[Math.floor((time * 2) % bassNotes.length)], "8n", time);
}, "0.5");

Tone.Transport.bpm.value = 100; // Starts at 100 BPM

  
  synth.volume.value = -100; // lower background music volume
}

function draw() {
  background(220);

  if (gameState === GameStates.PLAY && !bgMusicPlaying) {
    bgLoop.start(0); // ✅ fixed here
    Tone.Transport.start();
    bgMusicPlaying = true;

    sounds.player("bugsMoving").loop = true;
    sounds.player("bugsMoving").volume.value = -15;
    sounds.player("bugsMoving").start();
  } else if ((gameState === GameStates.START || gameState === GameStates.END) && bgMusicPlaying) {
    bgLoop.stop(); // ✅ fixed here
    Tone.Transport.stop();
    bgMusicPlaying = false;

    sounds.player("bugsMoving").stop();
  }

  switch (gameState) {
    case GameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press ENTER to Start", width / 2, height / 2);
      break;

    case GameStates.PLAY:
      textAlign(LEFT, TOP);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - textPadding, textPadding);

      time -= deltaTime / 1000;
      if (time <= 0) {
        gameState = GameStates.END;
      }

      if (time <= 5 && !warningPlayed) {
        warningPlayed = true;
    
        let warningSynth = new Tone.FMSynth({
            harmonicity: 2,
            modulationIndex: 10,
            oscillator: { type: "sine" },
            envelope: { attack: 0.05, decay: 0.1, sustain: 0.1, release: 0.2 }
        }).toDestination();
    
        let warningNotes = ["C6", "A5", "F5", "D5"];
        let warningIndex = 0;
    
        let warningInterval = setInterval(() => {
            if (time <= 0) {
                clearInterval(warningInterval); // ✅ Stops the sound when time runs out
            } else {
                warningSynth.triggerAttackRelease(warningNotes[warningIndex], "8n");
                warningIndex = (warningIndex + 1) % warningNotes.length;
            }
        }, 300); // Plays every 300ms
    }
    
    

      for (let bug of bugs) {
        bug.move();
        bug.draw();
      }

      Tone.Transport.bpm.value = map(time, 30, 0, 90, 160);
      gameOverSoundPlayed = false;
      break;

      case GameStates.END:
        textAlign(CENTER, CENTER);
        text("Game Over!", width / 2, height / 2 - 20);
        text("Score: " + score, width / 2, height / 2);
        if (score > highScore) highScore = score;
        text("High Score: " + highScore, width / 2, height / 2 + 20);
        text("Press ENTER to Restart", width / 2, height / 2 + 40);
    
        if (!gameOverSoundPlayed) {
            gameOverSoundPlayed = true;
    
            // 🎵 Descending melody to indicate the game is over
            let gameOverSynth = new Tone.Synth({
                oscillator: { type: "triangle" },
                envelope: { attack: 0.05, decay: 0.2, sustain: 0.1, release: 0.5 }
            }).toDestination();
    
            let gameOverNotes = ["C5", "A4", "F4", "D4", "C4"];
            gameOverNotes.forEach((note, i) => {
                gameOverSynth.triggerAttackRelease(note, "8n", `+${i * 0.3}`);
            });
    
            // Optionally, stop all other sounds
            sounds.player("bugsMoving").stop();
            bgLoop.stop();
            Tone.Transport.stop();
        }
    
        warningPlayed = false;
        break;
    
  }
}

async function keyPressed() {
  await Tone.start();
  

  if (keyCode = 13) {
    if (gameState === GameStates.START || gameState === GameStates.END) {
      gameState = GameStates.PLAY;
      sounds.player("gameStart").start();

      let melody = ["C3", "E3", "G3", "C4"];
      melody.forEach((note, i) => {
        synth.triggerAttackRelease(note, "8n", `+${i * 0.2}`);
      });

      score = 0;
      time = 30;
      bugs = [];
      for (let i = 0; i < 5; i++) {
        bugs.push(new Bug());
      }
    }
  }
}

async function mousePressed() {
  await Tone.start();

  let hitBug = false;
  if (gameState === GameStates.PLAY) {
    for (let i = bugs.length - 1; i >= 0; i--) {
      if (bugs[i].isClicked(mouseX, mouseY)) {
        bugs[i].squish();
        score++;
        sounds.player("bugSquish").start(); // only mp3 plays
        bugs.push(new Bug());
        hitBug = true;
        let newBPM = 90 + (score * 2); // Base BPM is 90, increases by 2 per bug
        newBPM = constrain(newBPM, 90, 200); // Limit max BPM to 200
        Tone.Transport.bpm.value = newBPM;

        break;
      }
    }
    if (!hitBug) {
      sounds.player("missedBug").start();
      synth.triggerAttackRelease("E4", "8n");
    }
  }
}

class Bug {
  constructor() {
    this.speed = 1 + score * 0.1;
    this.size = 80;

    let spawnEdge = floor(random(4));
    if (spawnEdge === 0) {
      this.x = -this.size; this.y = random(height); this.xDir = 1; this.yDir = 0;
    } else if (spawnEdge === 1) {
      this.x = width; this.y = random(height); this.xDir = -1; this.yDir = 0;
    } else if (spawnEdge === 2) {
      this.x = random(width); this.y = -this.size; this.xDir = 0; this.yDir = 1;
    } else {
      this.x = random(width); this.y = height; this.xDir = 0; this.yDir = -1;
    }

    this.animations = {
      "walk": new SpriteAnimation(bugSprites, 0, 10),
      "squish": new SpriteAnimation(bugSprites, 10, 1)
    };
    this.currentAnimation = "walk";
    this.squished = false;
  }

  move() {
    if (!this.squished) {
      this.x += this.speed * this.xDir;
      this.y += this.speed * this.yDir;

      if (this.x < -this.size) this.x = width;
      if (this.x > width) this.x = -this.size;
      if (this.y < -this.size) this.y = height;
      if (this.y > height) this.y = -this.size;
    }
  }

  draw() {
    push();
    translate(this.x + this.size / 2, this.y + this.size / 2);
    if (this.xDir < 0) rotate(-HALF_PI);
    else if (this.xDir > 0) rotate(HALF_PI);
    else if (this.yDir > 0) rotate(PI);
    this.animations[this.currentAnimation].draw();
    pop();
  }

  isClicked(mx, my) {
    return !this.squished && mx > this.x && mx < this.x + this.size && my > this.y && my < this.y + this.size;
  }

  squish() {
    this.squished = true;
    this.currentAnimation = "squish";
    setTimeout(() => {
      let index = bugs.indexOf(this);
      if (index > -1) bugs.splice(index, 1);
    }, 500);
  }
}

class SpriteAnimation {
  constructor(spriteSheet, startFrame, frameCount) {
    this.spriteSheet = spriteSheet;
    this.startFrame = startFrame;
    this.frameCount = frameCount;
    this.currentFrame = 0;
    this.frameDelay = 5;
    this.counter = 0;
  }

  draw() {
    let frame = this.startFrame + this.currentFrame;
    image(this.spriteSheet, -40, -40, 80, 80, frame * 80, 0, 80, 80);
    this.counter++;
    if (this.counter % this.frameDelay === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
  }
}
