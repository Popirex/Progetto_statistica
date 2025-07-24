//DATI MODIFICABILI 

float lcm_alpha = 0.08;

float prob_a = 0.1;

float prob_d = 0.01;

int quantita_fotoni = 100;

float lcm = 0;

//DATI PER STATISTICHE

int contatto_aria = 0;

int quantita_scappati = 0;

int quantita_deviati = 0;


int quantita_contatto_aria = 0;

int fotone_polarizzato = 0;


//CREO LA CLASSE FOTONE

class Fotone {
  float r = 4;
  PVector pos;
  float angolo;
  PVector direzione;
  float velocita = 5;
  ArrayList<PVector> traiettoria = new ArrayList<PVector>();

  float a = prob_a;
  float d = prob_d;

  PVector flag_posizione;
  boolean elimina = false;
  float lunghezza_volo = 0;
  int deviato = 0;

  Fotone() {
    if (fotone_polarizzato == 1) {
      angolo = radians(0);
    } else {
      angolo = radians(random(-89, 90));
    }
    pos = new PVector(0, random(100 + r / 2, 300 - r / 2));
    direzione = PVector.fromAngle(angolo);
    flag_posizione = pos.copy();
  }

  void muovi() {
    if (pos.x >= width + (r / 2)) {
      elimina = true;
      quantita_scappati++;
    }

    float probabilita_d = random(1);

    boolean haColpitoLimiteSuperiore = false;
    boolean haColpitoLimiteInferiore = false;

    if (pos.y <= 100 + (r / 2) || pos.y >= 300 - (r / 2)) {
      if (pos.y <= 100 + (r / 2)) {
        pos.y = 100 + (r / 2);
        haColpitoLimiteSuperiore = true;
      }
      if (pos.y >= 300 - (r / 2)) {
        pos.y = 300 - (r / 2);
        haColpitoLimiteInferiore = true;
      }

      if (d >= probabilita_d) {
        float maxDeviazione = radians(89);
        float deviazione = random(-maxDeviazione, maxDeviazione);
        angolo += deviazione;
        PVector nuovaDirezione = PVector.fromAngle(angolo);

        if (haColpitoLimiteSuperiore && nuovaDirezione.y < 0) {
          nuovaDirezione.y *= -1;
        }
        if (haColpitoLimiteInferiore && nuovaDirezione.y > 0) {
          nuovaDirezione.y *= -1;
        }
        if (nuovaDirezione.x < 0) {
          nuovaDirezione.x *= -1;
        }

        direzione = nuovaDirezione;
        deviato++;
      } else {
        direzione.y *= -1;
      }
    }

    pos.add(direzione.copy().mult(velocita));
    traiettoria.add(pos.copy());

    if (PVector.dist(pos, flag_posizione) >= lcm) {
      flag_posizione = pos.copy();
      float probabilita_a = random(1);
      if (a >= probabilita_a) {
        elimina = true;
        quantita_contatto_aria++;
      }
    }
  }
}

ArrayList<Fotone> fotoni = new ArrayList<Fotone>();

//INIZIA LA SIMULAZIONE CON SETUP E DRAW
void setup() {
  size(1200, 400);
  //devo definire qui lcm perche per avere i dati corretti di width e heigth devo prima aver creato la finestra
  lcm = lcm_alpha * width;
  for (int i = 0; i < quantita_fotoni; i++) {
    fotoni.add(new Fotone());
  }
}

void draw() {
 background(0); 
 frameRate(144);


  for (int i = fotoni.size() - 1; i >= 0; i--) {
    Fotone f = fotoni.get(i);

// non credo il conteggio della percentuale dei deviati serva, con conferma di tommaso rimuovo
    if (f.deviato == 1) {
      quantita_deviati++;
      f.deviato++;
    }

    if (!f.elimina) {
      f.muovi();
    } else {
      //salvare qui i suoi dati prima di eliminare
      fotoni.remove(i);
    }
  }


// UNA VOLTA CHE IL SISTEMA PER SALVARE I DATI E' PRONTO (DA FARE QUANDO MUORE IL FOTONE NON QUANDO FINISCONO TUTTI) QUI PUO RIMANERE SOLO exit();
  if (fotoni.isEmpty()) {
    int percentuale_interagiti_aria = round((float) quantita_contatto_aria / quantita_fotoni * 100);
    int percentuale_scappati = round((float) quantita_scappati / quantita_fotoni * 100);
    int percentuale_deviati = round((float) quantita_deviati / quantita_fotoni * 100);

    println("Con " + quantita_fotoni + " fotoni e un LCM di " + lcm + " su una lunghezza di " + width +  ", una probabilità a = " + prob_a * 100 + "% e una probabilità d = " + prob_d * 100 + "%:");
    println(" - il " + percentuale_interagiti_aria + "% ha interagito con l'aria");
    println(" - il " + percentuale_scappati + "% è uscito dal cavo");
    println(" - il " + percentuale_deviati + "% è stato deviato almeno una volta");
    exit();
  }
}
