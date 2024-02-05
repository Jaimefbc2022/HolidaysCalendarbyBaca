# [
#  {
#   "Dia": "1\/1\/2023",
#   "Dia_semana": "domingo",
#   "numDia": 1,
#   "numMes": 1,
#   "numAño": 2023
#  },

# Importa Pandas
import pandas as pd
import json

# Lee el archivo de Excel
df = pd.read_excel('/Users/jaimefbc/Documents/JavaScript/calendario.xlsx')

# Obtiene la cantidad de filas y columnas
num_filas, num_columnas = df.shape

# Muestra el DataFrame
print(df)

# Obtiene la cantidad de filas y columnas
num_filas, num_columnas = df.shape

# Muestra la cantidad de filas y columnas
print(f"Cantidad de filas: {num_filas}")
print(f"Cantidad de columnas: {num_columnas}")

json = '['

for i in range(0,num_filas):
    elemento = df.iloc[0, 0]
    
    bracket_abierto = '{'
    
    numDia = df.iloc[i, 5]
    diaSemana = df.iloc[i, 1]
    numDiaSemana = df.iloc[i, 8]
    tipoFestivo = df.iloc[i, 3]
    festividad = df.iloc[i, 4]
    numMes = df.iloc[i, 6]
    numAño = df.iloc[i, 7]
        
    
    if i == num_filas-1:
        bracket_cerrado = '}'
    else:
        bracket_cerrado = '},'
    
    
    text = bracket_abierto + "'numDia': " + str(numDia) + ", 'diaSemana': '" + str(diaSemana)+ "', 'numDiaSemana': " + str(numDiaSemana) + ", 'tipoFestivo': '" + str(tipoFestivo)+ "' , 'festividad': '" + str(festividad)+ "' , 'numMes': " + str(numMes)+ ", 'numAño': " + str(numAño)+ bracket_cerrado
    
    json = json + text

json = json + ']'

json = json.replace("'",'"')



# Ruta del archivo JSON
ruta_archivo_json = '/Users/jaimefbc/Documents/JavaScript/festividades.json'

with open(ruta_archivo_json, 'w') as archivo:
    archivo.write(json)
    
    
