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


function preload() {
  gameFont = loadFont("media/PressStart2P-Regular.ttf");
  bugSprites = loadImage("media/New Piskel.png"); // ✅ Fixed file path
}


function setup() {
  createCanvas(400, 400);
  textFont(gameFont);
  for (let i = 0; i < 5; i++) {
    bugs.push(new Bug(random(width), random(height)));
  }
}


function draw() {
  background(220);


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


      for (let bug of bugs) {
        bug.move();
        bug.draw();
      }
      break;
   
    case GameStates.END:
      textAlign(CENTER, CENTER);
      text("Game Over!", width / 2, height / 2 - 20);
      text("Score: " + score, width / 2, height / 2);
      if (score > highScore) highScore = score;
      text("High Score: " + highScore, width / 2, height / 2 + 20);
      text("Press ENTER to Restart", width / 2, height / 2 + 40);
      break;
  }
}


function keyPressed() {
  if (keyCode = ENTER) { // ✅ Fixed key check
    if (gameState === GameStates.START || gameState === GameStates.END) {
      gameState = GameStates.PLAY;
      score = 0;
      time = 30;
      bugs = [];
      for (let i = 0; i < 5; i++) {
        bugs.push(new Bug(random(width), random(height)));
      }
    }
  }
}


function mousePressed() {
  if (gameState === GameStates.PLAY) {
    for (let i = bugs.length - 1; i >= 0; i--) {  // Loop from topmost bug
      if (bugs[i].isClicked(mouseX, mouseY)) {
        bugs[i].squish();
        score++;  // Only count one squish per click
        bugs.push(new Bug(random(width), random(height))); // Spawn new bug
        break;  // Stop checking other bugs once one is squished
      }
    }
  }
}



class Bug {
  constructor() {
    this.speed = 1 + score * 0.1;
    this.size = 80;

    // Spawn bugs from the screen edges
    let spawnEdge = floor(random(4)); // 0 = left, 1 = right, 2 = top, 3 = bottom
    if (spawnEdge === 0) { // Left side
      this.x = -this.size;
      this.y = random(height);
      this.xDir = 1;  // Move right
      this.yDir = 0;
    } else if (spawnEdge === 1) { // Right side
      this.x = width;
      this.y = random(height);
      this.xDir = -1;  // Move left
      this.yDir = 0;
    } else if (spawnEdge === 2) { // Top side
      this.x = random(width);
      this.y = -this.size;
      this.xDir = 0;
      this.yDir = 1;  // Move down
    } else { // Bottom side
      this.x = random(width);
      this.y = height;
      this.xDir = 0;
      this.yDir = -1;  // Move up
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

      // If bug goes off-screen, wrap it around
      if (this.x < -this.size) this.x = width;
      if (this.x > width) this.x = -this.size;
      if (this.y < -this.size) this.y = height;
      if (this.y > height) this.y = -this.size;
    }
  }

  draw() {
    push();
    translate(this.x + this.size / 2, this.y + this.size / 2);

    // Adjust Rotation for Correct Facing Direction
    if (this.xDir < 0) { 
      rotate(-HALF_PI); // Moving left → Rotate 90° counterclockwise
    } else if (this.xDir > 0) { 
      rotate(HALF_PI);  // Moving right → Rotate 90° clockwise
    } else if (this.yDir < 0) { 
      rotate(0);        // Moving up → No rotation
    } else if (this.yDir > 0) { 
      rotate(PI);       // Moving down → Rotate 180°
    }

    let animation = this.animations[this.currentAnimation];
    animation.draw();
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
      if (index > -1) {
        bugs.splice(index, 1);
      }
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
    let frameWidth = 80, frameHeight = 80;
    image(this.spriteSheet, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight,
          frame * frameWidth, 0, frameWidth, frameHeight);
    this.counter++;
    if (this.counter % this.frameDelay === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
  }
}



