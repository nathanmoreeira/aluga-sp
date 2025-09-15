# Importando as bibliotecas necessárias
from flask import Flask, request, jsonify
from flask_cors import CORS  # Para permitir que nosso frontend acesse a API
import joblib
import pandas as pd

# Inicializando o aplicativo Flask
app = Flask(__name__)
CORS(app)  # Habilitando o CORS

# Carregando o modelo que salvamos anteriormente
model = joblib.load('model/model.pkl')
print("Modelo carregado com sucesso!")

# Definindo o endpoint /predict, que aceitará requisições do tipo POST
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print("Dados recebidos:", data)
    features = pd.DataFrame([data], columns=['Size', 'Condo', 'Parking', 'Suites', 'Toilets'])
    prediction = model.predict(features)[0]
    print("Previsão calculada:", prediction)
    return jsonify({'prediction': round(prediction, 2)}) # Arredondando para 2 casas decimais

# Rodando a aplicação
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)