//VALORE ALPHA PER MODIFICARE IL LIBERO CAMMINO MEDIO
let lcm_alpha = 0.01;

let prob_a = 0.01

let prob_d = 0.01

// NUMERO DI FOTONI NELLA SIMULAZIONE
quantita_fotoni = 100;

quantita_contatto_aria = 0;

quantita_scappati = 0;

//  LIBERO CAMMINO MEDIO DEL FOTONE CALCOLATO COME PRODOTTO DELLA LUNGHEZZA DEL CAVO DI FIBRA OTTICA E IL VALORE ALPHA DELL'LCM -> variabie globale
lcm = lcm_alpha * 800;





//CREAZIONE DELLA CLASSE CAVO CON LE ISTRUZIONI PER DISEGNARLO A OGNI FRAME COME BACKGROUND
class Cavo{
  
  disegna(){
    fill('yellow');
    rect(0, 100, width, 200); /*rettangolo giallo*/
    fill('gray');
    rect(0, 50, width, 50); /*rettangolo del bordo superiore*/
    rect(0, 300, width, 50); /*rettangolo del bordo inferiore*/
  }

}


//CLASSE FOTONE CON VARIABILI E FUNZIONI
class Fotone{
  
  constructor(){

  //  DATI INIZIALI PER CREARE IL FOTONE
    this.r = 6;
    this.pos = createVector(0, random(100+(this.r/2), 300-(this.r/2))); //posizione di partenza
    this.angolo = radians(random(-89,90)); //angolo di partenza casuale in radianti per i vettori
    this.direzione = p5.Vector.fromAngle(this.angolo); // vettore direzione unitario dato dall'angolo
    this.velocita = 5;
  //  ARRAY CONTENENTE TUTTI I VERTICI DELLA TRAIETTORIA (USATI PER DISEGNARE LA TRAIETTORIA E CALCOLARE LA DISTANZA TOTALE PERCORSA)
    this.traiettoria = [];

  //  PROBABILITA A -> PROBABILITA CHE IL FOTONE INTERAGISCA CON L'ARIA E SCOMPAIA (DA MODIFICARE PER RACCOLGIERE DATI)
    this.a = typeof a !== "undefined" ? a : prob_a; // se non e' definita la imposto a 0.01
    this.d = typeof d !== "undefined" ? d : prob_d

  //  FLAG UTILIZZATO PER VERIFICARE SE LA DISTANZA PERCORSA E' MINORE DEL LIBERO CAMMINO MEDIO && OGNI VOLTA CHE LA DIST. E' >= DEL LCM  il flag_posizione DIVENTA LA POSIZIONE CORRENTE DEL FOTONE. CIO PERMETTE 
  //  DI VEDERE SE IL FOTONE INTERAGISCE CON CON L'ARIA OGNI VOLTA CHE LA DISTANZA DEL LIBERO CAMMINO MEDIO E' PERCORSA
    this.flag_posizione = createVector(this.pos.x, this.pos.y);

  //  VARIABILE BOOLEANA  PER VEDERE SE IL FOTONE E' DA ELIMINARE O MENO, DATO CHE VIENE  ELIMINATO NEL DRAW LOOP. (fatto per poter gestire migliaia di fotoni)
    this.elimina = false;

  //  VARIABILE PER TENERE TRACCIA DELLA LUNGHEZZA TOTALE PERCORSA DAL FOTONE QUANDO VIENE ELIMINATO
    this.lunghezza_volo = 0;

  }
  
  disegna(){
    
    /*  DISEGNO IL FOTONE */
    fill('red');
    ellipse(this.pos.x, this.pos.y, this.r, this.r);


  //  /*DISEGNO LA TRAIETTORIA DEL FOTONE */
  //  noFill();
  //  stroke(0, 50);
  //  beginShape();
  //  for(let p of this.traiettoria){
  //      vertex(p.x, p.y);
  //  }
  //  endShape();

  }
  
  
  muovi(){
  
    //CONTROLLO SE IL FOTONE TOCCA LA PARETE DEL CAVO, SE SI INVERTO LA DIREZIONE Y POICHE' RIMBALZA
      let probabilita_d = random()
      if (this.pos.y <= 100 + (this.r / 2) || this.pos.y >= 300 - (this.r / 2)) {
        let haColpitoLimiteSuperiore = false;
        let haColpitoLimiteInferiore = false;
    
        // Determina quale limite è stato colpito e aggancia la posizione
        if (this.pos.y <= 100 + (this.r / 2)) {
            this.pos.y = 100 + (this.r / 2); // Aggancia al limite superiore
            haColpitoLimiteSuperiore = true;
        }
        if (this.pos.y >= 300 - (this.r / 2)) {
            this.pos.y = 300 - (this.r / 2); // Aggancia al limite inferiore
            haColpitoLimiteInferiore = true;
        }
        if (this.d >= probabilita_d) {
          // Logica per rimbalzo con angolo casuale
          if (haColpitoLimiteSuperiore) {
              // Se ha colpito sopra, deve andare in giù (angolo positivo)
              this.angolo = radians(random(0, 89));
          } else if (haColpitoLimiteInferiore) {
              // Se ha colpito sotto, deve andare in su (angolo negativo)
              this.angolo = radians(random(-89, 0));
          }
            this.direzione = p5.Vector.fromAngle(this.angolo)
          }
          else
              this.direzione.y *= -1;

      //TODO: AGGIUNGERE LA PROBABILITA' d CHE A CONTATTO CON LA PARETE IL FOTONE VENGA DIFFUSO (ALTERAZIONE DEL SUO ANGOLO)
      //let deviazione = radians(random(-15,15))
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

      //VERIFICO CHE IL FOTONE NON SIA USCITO DALLA FIBRA OTTICA, SE E' USCITO IMPOSTO IL FLAG PER L'ELIMINAZIONE A TRUE E AUMENTO IL COUNT DEI FOTONI SCAPPATI
      if(this.pos.x >= width+(this.r/2)){
        this.elimina = true;
        quantita_scappati+=1;
      }

      // CREO UNA PROBABILITA RANDOMICA E VERIFICO SE LA MIA PROBABILITA HARDCODED E' MAGGIORE O UGUALE, SE LO E' ELIMINO IL FOTONE E STAMPO 'INTERAZIONE CON ARIA' E AUMENTO IL COUNT DEI FOTONI CHE INTERAGISCONO
      let probabilita_a = random();
      if(this.a >= probabilita_a){
        this.elimina = true;
        quantita_contatto_aria+=1;
        console.log("INTERAZIONE CON ARIA");
      }
    }

  }
  
}