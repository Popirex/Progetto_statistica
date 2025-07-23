//DATI MODIFICABILI 

int visone_traiettoria = 0;

float lcm_alpha = 0.01;

float prob_a = 0.01;

float prob_d = 0.01;

int quantita_fotoni = 500000;

int larghezza = 1200;
int altezza = 400;

float lcm = lcm_alpha * larghezza;

//DATI PER STATISTICHE

int contatto_aria = 0;

int quantita_scappati = 0;

int quantita_deviati = 0;

int quantita_contatto_aria = 0;

int visione_traiettoria = 0;

int fotone_polarizzato = 0;

//CREO LA CLASSE CAVO

class Cavo {

  void disegna() {
    fill(color(255, 255, 0));
    rect(0, 100, width, 200);

    fill(128);
    rect(0, 50, width, 50);
    rect(0, 300, width, 50);
  }

  void bordo() {
    stroke(0);
    strokeWeight(5);
    line(0, 50, width, 50);
    line(0, 100, width, 100);
    line(0, 300, width, 300);
    line(0, 350, width, 350);
    strokeWeight(1);
  }
}

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
  boolean visione_traiettoria = false;

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

  void disegna() {
    fill(0);
    ellipse(pos.x, pos.y, r, r);

    if (visione_traiettoria) {
      noFill();
      stroke(0, 50);
      beginShape();
      for (PVector p : traiettoria) {
        vertex(p.x, p.y);
      }
      endShape();
    }
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
Cavo cavo;

void setup() {
  size(1200, 400);
  cavo = new Cavo();
  for (int i = 0; i < quantita_fotoni; i++) {
    fotoni.add(new Fotone());
  }
}

void draw() {
  background(255);
  frameRate(60);

  cavo.disegna();

  for (int i = fotoni.size() - 1; i >= 0; i--) {
    Fotone f = fotoni.get(i);

    if (f.deviato == 1) {
      quantita_deviati++;
      f.deviato++;
    }

    if (!f.elimina) {
      f.muovi();
      f.disegna();
    } else {
      fotoni.remove(i);
    }
  }

  cavo.bordo();

  if (fotoni.isEmpty()) {
    int percentuale_interagiti_aria = round((float) quantita_contatto_aria / quantita_fotoni * 100);
    int percentuale_scappati = round((float) quantita_scappati / quantita_fotoni * 100);
    int percentuale_deviati = round((float) quantita_deviati / quantita_fotoni * 100);

    println("Con " + quantita_fotoni + " fotoni e un LCM di " + lcm + ", una probabilità a = " + prob_a * 100 + "% e una probabilità d = " + prob_d * 100 + "%:");
    println(" - il " + percentuale_interagiti_aria + "% ha interagito con l'aria");
    println(" - il " + percentuale_scappati + "% è uscito dal cavo");
    println(" - il " + percentuale_deviati + "% è stato deviato almeno una volta");
    noLoop();
  }
}
