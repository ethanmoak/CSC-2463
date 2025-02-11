let vanhelsing, viking, jungleWarrior;
let characters = [];

function preload() {
  vanhelsing = loadImage("media/Van Helsing.png");
  viking = loadImage("media/viking.png");
  jungleWarrior = loadImage("media/jungle warrior.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  // Create multiple character instances
  characters.push(new Character(random(80, width - 80), random(80, height - 80), vanhelsing));
  characters.push(new Character(random(80, width - 80), random(80, height - 80), viking));
  characters.push(new Character(random(80, width - 80), random(80, height - 80), jungleWarrior));
}

function draw() {
  background(220);

  for (let character of characters) {
    character.draw();
  }
}

function keyPressed() {
  for (let character of characters) {
    character.keyPressed();
  }
}

function keyReleased() {
  for (let character of characters) {
    character.keyReleased();
  }
}

class Character {
  constructor(x, y, spriteSheet) {
    this.x = x;
    this.y = y;
    this.currentAnimation = "stand";
    this.animations = {};

    // Adding animations (assuming same sprite layout for all)
    this.addAnimation("right", new spriteanimation(spriteSheet, 0, 0, 9));
    this.addAnimation("left", new spriteanimation(spriteSheet, 0, 0, 9));
    this.addAnimation("stand", new spriteanimation(spriteSheet, 0, 0, 1));
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      if (this.currentAnimation === "right") {
        this.x += 2;
      } else if (this.currentAnimation === "left") {
        this.x -= 2;
      }

      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }

  keyPressed() {
    if (keyCode === RIGHT_ARROW) {
      this.currentAnimation = "right";
    } else if (keyCode === LEFT_ARROW) {
      this.currentAnimation = "left";
      this.animations[this.currentAnimation].flipped = true;
    }
  }

  keyReleased() {
    this.currentAnimation = "stand";
  }
}

class spriteanimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
    this.flipped = false;
  }

  draw() {
    let s = this.flipped ? -1 : 1;
    scale(s, 1);
    image(this.spritesheet, 0, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);

    this.frameCount++;
    if (this.frameCount % 5 === 0) this.u++;

    if (this.u === this.startU + this.duration) this.u = this.startU;
  }
}
