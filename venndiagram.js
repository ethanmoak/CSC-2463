//function setup() {
  //createCanvas(400, 400);
  //background(255);  // Set background to white
  function setup() {
    let cnv = createCanvas(400, 400);
    cnv.position(650, 650);  // Second canvas at (650, 0)
    background(100);
  
  noStroke();  // Disable the outline
  
  // Draw the Red circle (top)
  fill(255, 0, 0, 100);  // Red with transparency
  ellipse(200, 130, 200, 200);  // First circle
  
  // Draw the Blue circle (bottom-left)
  fill(0, 0, 255, 100);  // Blue with transparency
  ellipse(130, 250, 200, 200);  // Second circle
  
  // Draw the green circle (bottom-right)
  fill(0, 255, 0, 100);  // Green with transparency
  ellipse(270, 250, 200, 200);  // Third circle
}
