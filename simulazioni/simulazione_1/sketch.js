let raggio =15;

function setup() {
    createCanvas(600, 400);
    background(0);
    stroke(0);
    line(0, 0, width, height);
  }
  
  function draw() {
    colorMode(HSB);
    for(let i = 0; i < 10; i++){
        let probabilita = random(0, 1, 0.001);
        fill(360*probabilita, 100, 100);
        ellipse(random(0, width), random(0, height), raggio, raggio);
        
    }
  }