let colors = [
  'red', 'orange', 'yellow', 'green', 'cyan', 
  'blue', 'magenta', 'brown', 'white', 'black'
];
let currentColor = 'black';
let paletteWidth = 40;
let lastX, lastY;

function setup() {
  createCanvas(800, 800);
  background(255);
  drawPalette();
}

function drawPalette() {
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    rect(0, i * 40, paletteWidth, 40);
  }
}

function draw() {
  if (mouseIsPressed) {
    if (mouseX > paletteWidth) {
      stroke(currentColor);
      strokeWeight(50);
      if (lastX !== undefined && lastY !== undefined) {
        line(lastX, lastY, mouseX, mouseY);
      }
      lastX = mouseX;
      lastY = mouseY;
    } else {
      lastX = undefined;
      lastY = undefined;
    }
  } else {
    lastX = undefined;
    lastY = undefined;
  }
}

function mousePressed() {
  if (mouseX < paletteWidth) {
    let index = floor(mouseY / 40);
    if (index >= 0 && index < colors.length) {
      currentColor = colors[index];
    }
  }
}
