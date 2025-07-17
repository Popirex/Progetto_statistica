const aInput = document.getElementById("aInput");
const dInput = document.getElementById("dInput");
const lcmInput = document.getElementById("lcmInput");
const numInput = document.getElementById("numInput");
const resetButton = document.getElementById("resetButton");
const traiettoriaSlider = document.getElementById('traiettoria');
const polarizzatoSlider = document.getElementById('polarizzata');

/*
traiettoriaSlider.addEventListener('input', () => {
  visione_traiettoria = traiettoriaSlider.value;
}); */

resetButton.addEventListener("click", () => {
  const a = parseFloat(aInput.value);
  const lcm_alpha_input = parseFloat(lcmInput.value);
  const num_fotoni = parseInt(numInput.value);
  const d = parseFloat(dInput.value);
  const valore_slider = traiettoriaSlider.value;
  const valore_slider_polarizzato = polarizzatoSlider.value;
    if (isNaN(a) || isNaN(lcm_alpha_input) || isNaN(num_fotoni) || isNaN(d)) {
    alert("Inserisci valori validi.");
    return;
  }


  // AGGIORNO LE VARIABILI LOCALI CON GLI INPUT DELLA UI
  quantita_fotoni = num_fotoni;
  lcm_alpha = lcm_alpha_input;
  lcm = lcm_alpha * width;
  prob_a = a;
  prob_d = d;
  visione_traiettoria = valore_slider;
  fotone_polarizzato = valore_slider_polarizzato;

  // RESETTO I CONTATORI PER LE NUOVE PERCENTUALI AL TERMINE DELLA SIMULAZIONE
  quantita_contatto_aria = 0;
  quantita_scappati = 0;
  quantita_deviati = 0;
  terminato = false;

  // Ricrea fotoni
  fotoni = [];
  for (let i = 0; i < quantita_fotoni; i++) {
    let f = new Fotone();
    f.a = a;  // AGGIORNO LA PROBABILITA A PER OGNI NUOVA SIMULAZIONE
    f.d =d    // AGGIORNO LA PROBABILITA D PER OGNI NUOVA SIMULAZIONE
    f.visione_traiettoria = visione_traiettoria;
    f.fotone_polarizzato = fotone_polarizzato;
    fotoni.push(f);
  }
});


