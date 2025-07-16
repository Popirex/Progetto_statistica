const aInput = document.getElementById("aInput");
const lcmInput = document.getElementById("lcmInput");
const numInput = document.getElementById("numInput");
const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", () => {
  const a = parseFloat(aInput.value);
  const lcm_alpha_input = parseFloat(lcmInput.value);
  const num_fotoni = parseInt(numInput.value);

  if (isNaN(a) || isNaN(lcm_alpha_input) || isNaN(num_fotoni)) {
    alert("Inserisci valori validi.");
    return;
  }

  // AGGIORNO LE VARIABILI LOCALI CON GLI INPUT DELLA UI
  quantita_fotoni = num_fotoni;
  lcm_alpha = lcm_alpha_input;
  lcm = lcm_alpha * 800;

  // RESETTO I CONTATORI PER LE NUOVE PERCENTUALI AL TERMINE DELLA SIMULAZIONE
  quantita_contatto_aria = 0;
  quantita_scappati = 0;
  terminato = false;

  // Ricrea fotoni
  fotoni = [];
  for (let i = 0; i < quantita_fotoni; i++) {
    let f = new Fotone();
    f.a = a;  // AGGIORNO LA PROBABILITA A PER OGNI NUOVA SIMULAZIONE

    //      TO DO: SE TE LO DIMENTICHI SEI COGLIONE
    //QUANDO CI SARA LA PROBABILITA D SARA DA MODIFICARE QUI E AGGIUNGERE  f.d = d; 
    fotoni.push(f);
  }
});
