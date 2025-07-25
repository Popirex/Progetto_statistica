import matplotlib.pyplot as plt
import csv

# Parametri del cavo
y_min = 100     # bordo superiore (vicino all'origine)
y_max = 300     # bordo inferiore (lontano dall'origine)
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
n_bins = 50
bin_width = sezione_cavo / n_bins

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
    # Etichetta con altezza
    ax.text(
        rect.get_x() + rect.get_width() / 2,
        densita[i] + max(densita) * 0.01,
        f"{densita[i]:.1f}",
        ha='center',
        va='bottom',
        fontsize=7,
        color='white',
        rotation=90
    )

# Inverti asse x: bordo superiore a sinistra
ax.invert_xaxis()

# Etichette e titoli
ax.set_xlabel("Posizione y (da bordo superiore a bordo inferiore)", color='white')
ax.set_ylabel("Densità (fotoni per unità y)", color='white')
ax.set_title("Distribuzione fotoni in uscita - Punto 2b", color='white')
ax.tick_params(colors='white')

# Etichetta costante con larghezza bin
ax.text(0.98, 0.95,
        f"Larghezza base bin: {bin_width:.2f} unità y",
        color='white',
        transform=ax.transAxes,
        fontsize=9,
        ha='right')

# Layout e salvataggio
plt.tight_layout()
plt.savefig("istogramma_uscite.png", dpi=100, facecolor='black')
plt.show()
