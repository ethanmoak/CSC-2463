//function setup() {
   // createCanvas(400, 200); // Set the canvas size
    //background(0, 255, 0); // Green background
    function setup() {
      let cnv = createCanvas(400, 200);
      cnv.position(0, 0);  // First canvas at (0, 0)
      background(0, 255, 0);
    // Draw the circle
    fill(255); // White fill
    stroke(0); // Black outline
    ellipse(120, 100, 120, 120); // Circle at (120, 100) with a diameter of 120
  
    // Draw the square
    fill(255); // White fill
    stroke(0); // Black outline
    rect(220, 40, 120, 120); // Square at (220, 40) with a width and height of 120
  }
  
