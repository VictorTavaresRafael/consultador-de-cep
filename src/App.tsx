import React, { useState, ChangeEvent } from 'react';
import "./Styles.css";
// import { FaSearchLocation } from "react-icons/fa";
import Api from './services/Api';

interface CepData {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ddd?: string;
}

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [data, setData] = useState<CepData>({});

  const handleSearch = async () => {
    if (input === "") {
      alert("Preencha algum CEP");
      return;
    }

    try {
      const response = await Api.get(`${input}/json`);
      setData(response.data);
      setInput("");
    } catch (error) {
      alert("CEP não encontrado");
      // setInput("");
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  return (
    <div className="container">
      <h1 className="title" class="font-mono">Buscador de CEP</h1>

      <div className="containerInput">
        <input
          type="text"
          placeholder="Digite o seu CEP"
          value={input}
          onChange={handleChange}
        />
        <button className="buttonSearch" onClick={handleSearch}>
          {/* <FaSearchLocation size={25} color="#FFFF" /> */}
          Buscar
        </button>
      </div>

      {Object.keys(data).length > 0 && (
        <main className="main">
          <h2>CEP: {data.cep}</h2>
          <span>Rua: {data.logradouro}</span>
          <span>Bairro: {data.bairro}</span>
          <span>Cidade: {data.localidade}</span>
          <span>Estado: {data.uf}</span>
          <span>DDD: {data.ddd}</span>
        </main>
      )}
    </div>
  );
};

export default App;