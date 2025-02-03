function setup() {
    createCanvas(400, 400);
    background(0, 0, 139); // Dark blue background
  
    translate(width / 2, height / 2); // Center canvas
  
    // Outer Circle
    fill(0, 128, 0); // Green
    stroke(255); // White outline
    strokeWeight(3);
    ellipse(0, 0, 180, 180);
  
    // Star (Even Bigger to Fill the Circle More)
    fill(255, 0, 0); // Red star
    stroke(255);
    strokeWeight(3);
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI * i / 5 - HALF_PI;
      let x = cos(angle) * 90;
      let y = sin(angle) * 90;
      vertex(x, y);
  
      angle = TWO_PI * (i + 0.5) / 5 - HALF_PI;
      x = cos(angle) * 35;
      y = sin(angle) * 35;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
