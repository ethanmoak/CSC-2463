function setup() {
    createCanvas(400, 200);
    background(0); // Black background
  
    // Pac-Man (Flipped to Face Left and Bigger)
    fill(255, 255, 0); // Adjusted Yellow to match example
    noStroke();
    arc(100, 100, 160, 160, QUARTER_PI+PI, -QUARTER_PI+PI, PIE);
    
    // Ghost (Bigger, Shifted Right, Adjusted Color and Shape)
    fill(255, 0, 0); // Adjusted to match example
    arc(315, 90, 140, 140, PI, 0, CHORD); // Top rounded shape
    rect(245, 70, 140, 100, 20, 20, 0, 0); // Lower body with slight rounding
  
    // Eyes
    fill(255); // White (Enlarged to match example)
    ellipse(280, 85, 45, 45);
    ellipse(350, 85, 45, 45);
  
    fill(0, 0, 255); // Blue pupils (Centered better)
    ellipse(280, 85, 29, 29);
    ellipse(350, 85, 29, 29);
  }
  
