import React, { useState } from 'react';
import './App.css'; // Usaremos para estilizar depois

function App() {
  // Criando 'estados' para guardar os valores de cada campo do formulário
  const [size, setSize] = useState('');
  const [condo, setCondo] = useState('');
  const [parking, setParking] = useState('');
  const [suites, setSuites] = useState('');
  const [toilets, setToilets] = useState('');

  // Estado para guardar o resultado da previsão e o status de carregamento
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função que será chamada quando o formulário for enviado
  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede que a página recarregue
    setLoading(true);
    setPrediction(null);
    setError('');

    const formData = {
      "Size": parseInt(size),
      "Condo": parseInt(condo),
      "Parking": parseInt(parking),
      "Suites": parseInt(suites),
      "Toilets": parseInt(toilets)
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
      setError("Não foi possível conectar à API. Verifique se o servidor backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Estima Aluguel SP 🏘️</h1>
        <p>Preencha os dados abaixo para obter uma estimativa do valor do aluguel.</p>

        <form onSubmit={handleSubmit}>
          <input type="number" value={size} onChange={e => setSize(e.target.value)} placeholder="Tamanho (m²)" required />
          <input type="number" value={condo} onChange={e => setCondo(e.target.value)} placeholder="Valor do Condomínio (R$)" required />
          <input type="number" value={parking} onChange={e => setParking(e.target.value)} placeholder="Vagas de Garagem" required />
          <input type="number" value={suites} onChange={e => setSuites(e.target.value)} placeholder="Nº de Suítes" required />
          <input type="number" value={toilets} onChange={e => setToilets(e.target.value)} placeholder="Nº de Banheiros" required />
          <button type="submit" disabled={loading}>{loading ? 'Estimando...' : 'Estimar Preço'}</button>
        </form>

        {/* Exibindo o resultado ou o erro */}
        {error && <p className="error">{error}</p>}
        {prediction !== null && (
          <div className="result">
            <h2>Valor Estimado do Aluguel:</h2>
            <p>R$ {prediction.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;