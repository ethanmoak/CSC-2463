let vanhelsing
let character;

function preload() {
  vanhelsing =  loadImage("media/Van Helsing.png")
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);


  character = new Character(random(80, width-80),random(80, height-80));
  character.addAnimation("right", new spriteanimation(vanhelsing,0,0,9));
  character.addAnimation("left", new spriteanimation(vanhelsing,0,0, 9));
  character.addAnimation("stand", new spriteanimation(vanhelsing,0,0,1));
  character.currentAnimation = "stand";
}

function draw() {
  background(220);

  character.draw();
}

function keyPressed() {
  character.keyPressed();
}

function keyReleased(){
  character.keyReleased();
}

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentAnimation = null
    this.animations = {};
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      switch (this.currentAnimation) {
        case "right":
          this.x += 2;
          break;
        case "left":
          this.x -= 2;
          break;
      }
        
      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }
  
  keyPressed() {
    switch(keyCode) {
      case RIGHT_ARROW:
        this.currentAnimation = "right";
        
        break;
      case LEFT_ARROW:
        this.currentAnimation = "left";
        this.animations[this.currentAnimation].flipped = true;
      
        break;
    }
  }
  
  keyReleased() {
    this.currentAnimation = "stand";
    //this.animations[this.currentAnimation].flipped = true;
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
    let s = (this.flipped) ? -1 : 1;
    scale(s,1);
    image(this.spritesheet, 0, 0, 80, 80, this.u*80, this.v*80, 80, 80);

    this.frameCount++;
    if (this.frameCount % 5 == 0)
      this.u++;

    if (this.u == this.startU + this.duration) 
      this.u = this.startU;
  }
}
