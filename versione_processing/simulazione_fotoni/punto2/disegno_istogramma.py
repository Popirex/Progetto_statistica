import matplotlib.pyplot as plt
import csv

# Parametri del cavo
y_min = 100     # bordo superiore
y_max = 300     # bordo inferiore
sezione_cavo = y_max - y_min

# Leggi i dati da uscite_y.csv
file_input = "uscite_y.csv"
uscite_y = []

with open(file_input, newline='') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        try:
            y = float(row[0])
            if y_min <= y <= y_max:
                uscite_y.append(y)
        except:
            continue

# Numero di intervalli nell'istogramma
n_bins = 40
bin_width = sezione_cavo / n_bins  # sarà esattamente 5

# Crea figura
fig, ax = plt.subplots(figsize=(12, 6.5), facecolor='black')
ax.set_facecolor('black')

# Istogramma (conteggi)
n, bins, patches = ax.hist(
    uscite_y,
    bins=n_bins,
    range=(y_min, y_max),
    density=False,
    edgecolor='white',
    color='cyan'
)

# Etichette reali: altezza = densità (conteggi / larghezza bin)
densita = [count / bin_width for count in n]

for i, rect in enumerate(patches):
    rect.set_height(densita[i])
    ax.text(
        rect.get_x() + rect.get_width() / 2,
        densita[i] + 5,  # spaziatura sopra la barra
        f"{densita[i]:.1f}",
        ha='center',
        va='bottom',
        fontsize=7,
        color='white',
        rotation=90
    )

# Inverti asse x per rappresentare da bordo superiore (100) a inferiore (300)
ax.invert_xaxis()

# Etichette e titoli
ax.set_xlabel("Posizione y in uscita (da 100 a 300)", color='white')
ax.set_ylabel("Densità (fotoni per unità y)", color='white')
ax.set_title("Distribuzione fotoni in uscita - Punto 2b", color='white')
ax.tick_params(colors='white')

# Imposta limite massimo asse y
ax.set_ylim(0, 500)

# Etichetta larghezza base + spiegazione
ax.text(
    0.5, -0.15,
    f"Ogni cella dell'istogramma ha dimensione {bin_width:.0f} unità y.\n"
    f"Per ottenere il numero di fotoni per cella, moltiplicare {bin_width:.0f} × il valore scritto sopra ciascuna barra.",
    color='white',
    transform=ax.transAxes,
    fontsize=10,
    ha='center',
    va='top'
)

# Layout e salvataggio
plt.tight_layout()
plt.savefig(r"C:\Users\Popir\OneDrive\Desktop\Progetto_statistica\immagini\istogramma_uscite.png", dpi=100, facecolor='black')
plt.show()
