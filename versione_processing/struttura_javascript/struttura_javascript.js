//DATI MODIFICABILI
let visione_traiettoria = 0;  // 0 non la vedi, 1 la vedi

let lcm_alpha = 0.01;

let prob_a = 0.01;

let prob_d = 0.01;

let quantita_fotoni = 100;

width = 1200;

lcm = lcm_alpha * width;


//DATI PER STATISTICHE
quantita_contatto_aria = 0;

quantita_scappati = 0;

quantita_deviati = 0;

visione_traiettoria = 0;

fotone_polarizzato = 0;



//STRUTTURA CAVO
class Cavo{
  
  disegna(){
    fill('yellow');
    rect(0, 100, width, 200); /*rettangolo giallo*/
    fill('gray');
    rect(0, 50, width, 50); /*rettangolo del bordo superiore*/
    rect(0, 300, width, 50); /*rettangolo del bordo inferiore*/
  }

  bordo(){
    //MARCATURA BORDI PER ASPETTO ESTETICO
    stroke('black');
    strokeWeight(5);
    line(0, 50, width, 50);
    line(0, 100, width, 100);
    line(0, 300, width, 300);
    line(0, 350, width, 350);
    line(0, 100, width, 100);
    strokeWeight(0.5);
  }

}


//CLASSE FOTONE CON VARIABILI E FUNZIONI
class Fotone{
  
  constructor(){

  //  DATI INIZIALI PER CREARE IL FOTONE
    this.colore = 250;
    this.r = 4;
    this.pos = createVector(0, random(100+(this.r/2), 300-(this.r/2))); //posizione di partenza
    if (fotone_polarizzato == 1){
      this.angolo= radians(0)
    }
    else{
      this.angolo = radians(random(-89,90)); //angolo di partenza casuale in radianti per i vettori
    }
    this.direzione = p5.Vector.fromAngle(this.angolo); // vettore direzione unitario dato dall'angolo
    this.velocita = 5;
  //  ARRAY CONTENENTE TUTTI I VERTICI DELLA TRAIETTORIA (USATI PER DISEGNARE LA TRAIETTORIA E CALCOLARE LA DISTANZA TOTALE PERCORSA)
    this.traiettoria = [];

  //  PROBABILITA A -> PROBABILITA CHE IL FOTONE INTERAGISCA CON L'ARIA E SCOMPAIA (DA MODIFICARE PER RACCOLGIERE DATI)
    this.a = prob_a;
    this.d = prob_d;

  //  FLAG UTILIZZATO PER VERIFICARE SE LA DISTANZA PERCORSA E' MINORE DEL LIBERO CAMMINO MEDIO && OGNI VOLTA CHE LA DIST. E' >= DEL LCM  il flag_posizione DIVENTA LA POSIZIONE CORRENTE DEL FOTONE. CIO PERMETTE 
  //  DI VEDERE SE IL FOTONE INTERAGISCE CON CON L'ARIA OGNI VOLTA CHE LA DISTANZA DEL LIBERO CAMMINO MEDIO E' PERCORSA
    this.flag_posizione = createVector(this.pos.x, this.pos.y);

  //  VARIABILE BOOLEANA  PER VEDERE SE IL FOTONE E' DA ELIMINARE O MENO, DATO CHE VIENE  ELIMINATO NEL DRAW LOOP. (fatto per poter gestire migliaia di fotoni)
    this.elimina = false;

  //  VARIABILE PER TENERE TRACCIA DELLA LUNGHEZZA TOTALE PERCORSA DAL FOTONE QUANDO VIENE ELIMINATO
    this.lunghezza_volo = 0;

  //  VARIABILE PER CALCOLARE LA PERCENTUALE DI FOTONI CHE HANNO SUBITO UNA DEVIAZIONE.
    this.deviato = 0;

  // ALL'INZIO NON SI VEDE LA TRAIETTORIA
    this.visione_traiettoria = visione_traiettoria;
    
  //all'inizio i fotoni non sono polarizzati
    this.fotone_polarizzato = 0;
  
  

  }
  
  disegna(){
    
    /*  DISEGNO IL FOTONE */
    fill('white');
    ellipse(this.pos.x, this.pos.y, this.r, this.r);


    
    /*DISEGNO LA TRAIETTORIA DEL FOTONE */
    if(this.visione_traiettoria == 1){
    noFill();
    stroke(0, 50);
    beginShape();
    for(let p of this.traiettoria){
      vertex(p.x, p.y);
    }
    endShape();
    }
  }
    

  
  muovi(){

    //VERIFICO CHE IL FOTONE NON SIA USCITO DALLA FIBRA OTTICA, SE E' USCITO IMPOSTO IL FLAG PER L'ELIMINAZIONE A TRUE E AUMENTO IL COUNT DEI FOTONI SCAPPATI
    if(this.pos.x >= width+(this.r/2)){
      this.elimina = true;
      quantita_scappati+=1;
    }
  
    
    //  VERSIONE CON DEVIAZIONE DELL'ANGOLO STANDARD, NO TOTALE MODIFICA:

    let probabilita_d = random();

    if (this.pos.y <= 100 + (this.r / 2) || this.pos.y >= 300 - (this.r / 2)) {
      let haColpitoLimiteSuperiore = false;
      let haColpitoLimiteInferiore = false;

      // Blocca la posizione al bordo
      if (this.pos.y <= 100 + (this.r / 2)) {
        this.pos.y = 100 + (this.r / 2);
        haColpitoLimiteSuperiore = true;
      }
      if (this.pos.y >= 300 - (this.r / 2)) {
        this.pos.y = 300 - (this.r / 2);
        haColpitoLimiteInferiore = true;
      }

      if (this.d >= probabilita_d) {
        
        let maxDeviazione = radians(89); // DEVIAZIONE POSSIBILE DA GRADI A RADIANTI, positivi o negativi
        let deviazione = random(-maxDeviazione, maxDeviazione);
    
        // CALCOLO IL NUOVO ANGOLO IN BASE ALLA DEVIAZIONE
        this.angolo += deviazione;

        //CREO IL NUOVO VETTORE DIREZIONE E MI ASSICURO CHE NON TORNI IN DIETRO
        let nuovaDirezione = p5.Vector.fromAngle(this.angolo);


        // CONTROLLO CHE LA NUOVA DIREZIONE NON SPINGA IL FOTONE CONTRO LA PARETE, SE LO FA LO FACCIO RIMBALZARE (100% ELASTICO), INVERSIONE DIREZIONE Y
        if (haColpitoLimiteSuperiore && nuovaDirezione.y < 0) {
          nuovaDirezione.y *= -1;
        }
        if (haColpitoLimiteInferiore && nuovaDirezione.y > 0) {
          nuovaDirezione.y *= -1;
        }
        // CONTROLLO CHE NON PROVI A TORNARE INDIETRO, E' RARO MA CAPITA E NON E' MOLTO REALISTICO
        if (nuovaDirezione.x < 0) {
          nuovaDirezione.x *= -1;
        }

        this.direzione = nuovaDirezione;

        //SE L'ANGOLO VIENE DEVIATO MODIFICO IL COLORE DEL FOTONE PER FARLO NOTARE, SE NON TI PIACE TOMMY LO TOGLIAMO
        this.colore = random(0, 360);
        this.deviato++;
      } 
      else {
        this.direzione.y *= -1;
      }
    }
      
    //MODIFICO LA POSIZIONE DEL FOTONE CON IL PRODOTTO DELLA VELOCITA' (HARDCODED) E UNA COPIA DEL VETTORE DIREZIONE (A CAUSA DI ALCUNE LIMITAZIONI DELLA LIBRERIA E DELLA GESTIONE DEI VETTORI)
    this.pos.add(this.direzione.copy().mult((this.velocita)));

    //AGGIUNGO ALL'ARRAY TRAIETTORIA IL VETTORE POSIZIONE A OGNI ITERAZIONE IN MODO DA AVERE TUTTE LE COORDINATE DEI VERTICI PER IL DISEGNO DELLA TRAIETTORIA E IL CALCOLO DELLA DISTANZA PERCORSA
    this.traiettoria.push(this.pos.copy());

    //VERIFICO SE LA DISTANZA (TRA LA POSIZIONE SALVATA PRECEDENTEMENTE E LA POSIZIONE ATTUALE) E' MAGGIORE DEL LIBERO CAMMINO MEDIO
    if(dist(this.pos.x,  this.pos.y, this.flag_posizione.x, this.flag_posizione.y) >= lcm){

      //SALVO LA POSIZIONE ATTUALE PER  IL  CALCOLO DELLA DISTANZA IN FUTURO
      this.flag_posizione.x = this.pos.x;
      this.flag_posizione.y = this.pos.y;

      // CREO UNA PROBABILITA RANDOMICA E VERIFICO SE LA MIA PROBABILITA HARDCODED E' MAGGIORE O UGUALE, SE LO E' ELIMINO IL FOTONE E STAMPO 'INTERAZIONE CON ARIA' E AUMENTO IL COUNT DEI FOTONI CHE INTERAGISCONO
      let probabilita_a = random();
      if(this.a >= probabilita_a){
        this.elimina = true;
        quantita_contatto_aria+=1;
      }
    }

  }
  
}





//CREAZIONE ARRAY E VARIABILE PER CREARE IL CAVO DI FIBRA OTTICA E I FOTONI
let fotoni = [];
let cavo;

//CREO IL CAVO, I FOTONI E IL CANVAS NEL SETUP
function setup() {
  
  cavo = new Cavo();
  for(let i = 0; i < quantita_fotoni; i++){
    fotoni[i] = new Fotone();
  }
  createCanvas(1200, 400);
}











//INIZIO IL CICLO DRAW (ESEGUITO 60 VOLTE AL SECONDO) E DISEGNO IL BACKGROUND IMMEDIATAMENTE
function draw() {
  frameRate(60);
  background(255);

  //DISEGNO IL CAVO DI FIBRA OTTICA COME PRIMA COSA PER AVERE I FOTONI SOPRA
  cavo.disegna();

  //ITERO PER TUTTI I FOTONI NELL'ARRAY
  for(let i = fotoni.length-1; i >= 0; i--){

    if(fotoni[i].deviato == 1){
      quantita_deviati+=1;
      fotoni[i].deviato++;
    }

    //SE NON SONO ELIMINATI LI DISEGNO E LI ANIMO
    if(!fotoni[i].elimina){
    //PROVA PER VEDERE SE CONVIENE PRIMA CALCOLARE LA DIREZIONE E POI DISEGNARE O VICEVERSA
    fotoni[i].muovi();
    fotoni[i].disegna();
    //fotoni[i].muovi();
    }

    //SE SONO ELIMINATI
    else{
      /* 

      //CREO UNA VARIABILE MOMENTANEA CON IL FOTONE CORRENTE PER COMODITA'
      let fotone_momentaneo = fotoni[i];

      //ITERO PER TUTTI I VERTICI DELLA TRAIETTORIA IN MODO DA CALCOLARE LA DISTANZA TOTALE PERCORSA, POI LA STAMPO E RIMUOVO IL FOTONE DALLA SIMULAZIONE (VISTO CHE HA IL FLAG ELIMINATO == TRUE)
      for(let i = 1; i < fotone_momentaneo.traiettoria.length; i++){
        let distanza_vertici = dist(fotone_momentaneo.traiettoria[i].x, fotone_momentaneo.traiettoria[i].y, fotone_momentaneo.traiettoria[i-1].x, fotone_momentaneo.traiettoria[i-1].y);
        fotone_momentaneo.lunghezza_volo += distanza_vertici;
      }

      */
      fotoni.splice(i, 1);
    }

  }

  cavo.bordo();

  //VERIFICO CHE TUTTI I FOTONI SIANO STATI ELIMINATI, SE SI CALCOLO LA PERCENTUALE DI INTERAGITI E DI SCAPPATI E LA STAMPO, ho tolto && terminato == false
  let percentuale_interagiti_aria = round((quantita_contatto_aria / quantita_fotoni)*100);
  let percentuale_scappati = round((quantita_scappati / quantita_fotoni) * 100);
  let percentuale_deviati = round((quantita_deviati / quantita_fotoni) * 100)
  let messaggio_finale = 'Con ' + quantita_fotoni + ' fotoni e un LCM di ' + lcm + ', una probabilità a = ' +  prob_a*100 + '% e una probabilità d = ' + prob_d*100 + '%: il ' + percentuale_interagiti_aria + '% ha interagito con l\'aria e il ' + percentuale_scappati + '% è uscito dal cavo.';    
  let messaggio_deviati = 'Il ' + percentuale_deviati + '% dei fotoni è stato diffuso almeno una volta con un nuovo angolo.'
  
}