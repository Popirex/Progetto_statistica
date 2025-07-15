


class Cavo{
  
  disegna(){
    
    fill('yellow');
    rect(0, 100, width, 200); /*rettangolo giallo*/
    fill('gray');
    rect(0, 50, width, 50); /*rettangolo del bordo superiore*/

    rect(0, 300, width, 50); /*rettangolo del bordo inferiore*/
    
  }
  
}

class Fotone{
  
  constructor(){
    this.r = 6;
    this.pos = createVector(0, random(100+(this.r/2), 300-(this.r/2))); //posizione di partenza
    
    this.angolo = radians(random(-89,90)); //angolo di partenza casuale in radianti per i vettori
    
    this.direzione = p5.Vector.fromAngle(this.angolo); // vettore direzione unitario dato dall'angolo
    
    this.velocita = 5;

    this.traiettoria = [];

    this.a;
    
    
  }
  
  disegna(){
    
    fill('red');
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
    noFill();
    stroke(0, 50);
    beginShape();
    for(let p of this.traiettoria){
        vertex(p.x, p.y);
    }
    endShape();
  }
  
  
  muovi(){
        this.a = random();
        console.log(this.a);
      if(this.pos.y < 100+(this.r/2) || this.pos.y >= 300-(this.r/2)){
        this.direzione.y *= -1;
        //let deviazione = radians(random(-15,15))
      }
    
      this.pos.add(this.direzione.copy().mult((this.velocita)));
      this.traiettoria.push(this.pos.copy());

    }
  
}