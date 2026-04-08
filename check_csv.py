import csv

csv_path = r'c:\Users\marcelo.silva\Documents\proyecto indicadores AGE\gauge-wise-flows\modelo_carga_indicadores.csv'

real_indicators = []
with open(csv_path, mode='r', encoding='utf-8') as f:
    # Use semicolon as delimiter based on preview
    reader = csv.reader(f, delimiter=';')
    next(reader) # skip header
    for row in reader:
        if row and len(row) > 0 and row[0].strip() and not row[0].startswith(';'):
            real_indicators.append(row[0].strip())

print(f"Total indicators found in CSV: {len(real_indicators)}")
print("First 5 indicator names in CSV:")
for name in real_indicators[:5]:
    print(f"- {name}")
