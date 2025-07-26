import csv
import math

# File di input/output
file_input = "risultati_totali.csv"
file_output = "risultati.txt"

# Lista per le proporzioni scappati/totali
proporzioni = []

with open(file_input, newline='') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        if len(row) < 2:
            continue
        try:
            tot = int(row[0])
            scappati = int(row[1])
            proporzione = scappati / tot
            proporzioni.append(proporzione)
        except:
            continue

# Calcoli statistici
n = len(proporzioni)
media = sum(proporzioni) / n                     # Attesa empirica
varianza = sum((x - media) ** 2 for x in proporzioni) / (n - 1)
dev_std = math.sqrt(varianza)
z_95 = 1.96
errore_max = 0.01


# Numero minimo di FOTONI per stimare p con errore massimo ±0.01 al 95%
n_fotoni_minimi = (z_95 ** 2 * media * (1 - media)) / (errore_max ** 2)

# Stampa su console
print(f"Numero campioni (simulazioni): {n}")
print(f"Attesa (media empirica): {media:.4f}")
print(f"Deviazione standard: {dev_std:.4f}")
print(f"Numero minimo di fotoni per simulazione per errore ±{errore_max}: {math.ceil(n_fotoni_minimi)}")

# Scrivi su file txt
with open(file_output, 'w') as out:
    out.write("Analisi statistica - Punto 2c (fotoni richiesti)\n")
    out.write("===============================================\n")
    out.write(f"Simulazioni analizzate: {n}\n")
    out.write(f"Attesa (media proporzione scappati): {media:.4f}\n")
    out.write(f"Varianza empirica: {varianza:.6f}\n")
    out.write(f"Deviazione standard campionaria: {dev_std:.4f}\n")
    out.write(f"Intervallo di confidenza desiderato: ±{errore_max}\n")
    out.write(f"Numero minimo di fotoni richiesti (95% confidenza): {math.ceil(n_fotoni_minimi)}\n")
