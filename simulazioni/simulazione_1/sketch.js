let quantita_fotoni = 1;

let fotoni = [];
let cavo;
function setup() {
  
  cavo = new Cavo();
  for(let i = 0; i < quantita_fotoni; i++){
    fotoni[i] = new Fotone();
  }
  createCanvas(800, 400);
}

function draw() {
  

  background(255);
  cavo.disegna();
  for(let i = fotoni.length-1; i >= 0; i--){
    fotoni[i].disegna();
    fotoni[i].muovi();
    if(fotoni[i].pos.x > width || fotoni[i].a >= 0.995) fotoni.splice(i, 1); // splice si chiama sull'array fotoni non sul singolo fotone fotoni[i] e p = 0.005 di scomparire
  }
  
}