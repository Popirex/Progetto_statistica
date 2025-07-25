//CREAZIONE ARRAY E VARIABILE PER CREARE IL CAVO DI FIBRA OTTICA E I FOTONI
let fotoni = [];
let cavo;
let terminato = false; // variabile per vedere se ho gia stampato le percentuali

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

      console.log('distanza totale percorsa: ' + round(fotone_momentaneo.lunghezza_volo) + ' pixel');
      */
      fotoni.splice(i, 1);
    }

  }

  cavo.bordo();

  //VERIFICO CHE TUTTI I FOTONI SIANO STATI ELIMINATI, SE SI CALCOLO LA PERCENTUALE DI INTERAGITI E DI SCAPPATI E LA STAMPO, ho tolto && terminato == false
  terminato = true;
  let percentuale_interagiti_aria = round((quantita_contatto_aria / quantita_fotoni)*100);
  let percentuale_scappati = round((quantita_scappati / quantita_fotoni) * 100);
  let percentuale_deviati = round((quantita_deviati / quantita_fotoni) * 100)
  let messaggio_finale = 'Con ' + quantita_fotoni + ' fotoni e un LCM di ' + lcm + ', una probabilità a = ' +  prob_a*100 + '% e una probabilità d = ' + prob_d*100 + '%: il ' + percentuale_interagiti_aria + '% ha interagito con l\'aria e il ' + percentuale_scappati + '% è uscito dal cavo.';    
  let messaggio_deviati = 'Il ' + percentuale_deviati + '% dei fotoni è stato diffuso almeno una volta con un nuovo angolo.'
  fill(0);         // Colore del testo (bianco)
  textSize(15);      // Dimensione del testo
  textAlign(LEFT);   // Allineamento
  text(messaggio_finale, 10, height - 20);  // TESTO CON POSIZIONE
  text(messaggio_deviati, 10, height - 5); // TESTO CON POSIZIONE

  
  
}
