import React, { useState, ChangeEvent, useEffect } from "react";
import Api from "./services/Api";
import { FaSearchLocation } from "react-icons/fa";
import SearchButton from "./components/SearchButton";
import CardResult from "./components/CardResult";
import CardSaved from "./components/CardSaved";
import CardHistory from "./components/CardHistory";

interface CepData {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ddd?: string;
}

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [data, setData] = useState<CepData>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savedAddresses, setSavedAddresses] = useState<CepData[]>([]);
  const [cache, setCache] = useState<Record<string, CepData>>({});
  const [searchHistory, setSearchHistory] = useState<CepData[]>([]);

  useEffect(() => {
    const storedAddresses = localStorage.getItem("savedAddresses");
    if (storedAddresses) {
      setSavedAddresses(JSON.parse(storedAddresses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedAddresses", JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const handleSearch = async () => {
    if (input === "") {
      alert("Preencha algum CEP");
      return;
    }

    if (cache[input]) {
      setData(cache[input]);
      setIsSaved(false);
      return;
    }

    try {          
      const response = await Api.get(`${input}/json`);
      const result = response.data;
      setData(result);
      setInput("");
      setIsSaved(false);

      setCache((prevCache) => ({
        ...prevCache,
        [input]: result,
      }));

      setSearchHistory((prevHistory) => [result, ...prevHistory]);
    } catch (error) {
      alert("Erro ao buscar CEP");
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSave = () => {
    if (Object.keys(data).length > 0) {
      const newAddresses = [...savedAddresses, data];
      setSavedAddresses(newAddresses);
      setIsSaved(true);
    }
  };

  const handleDelete = (cep: string) => {
    const updatedAddresses = savedAddresses.filter((addr) => addr.cep !== cep);
    setSavedAddresses(updatedAddresses);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-blue-100 p-4 ">
      <h1 className="text-blue-900 text-6xl md:text-8xl font-extrabold animate-fliptitle text-center mb-8">
        Consultador de CEP
      </h1>

      <div className="flex items-center mt-5">
        <h2 className="text-blue-800 text-3xl font-semibold mr-4 text-center ">
          Digite o CEP que deseja consultar, no campo abaixo:
        </h2>
      </div>

      <div className="flex bg-white bg-opacity-90 p-4 my-4 rounded-lg shadow-lg w-full max-w-md">
        <input
          type="text"
          placeholder="Digite o seu CEP"
          value={input}
          onChange={handleChange}
          className="bg-transparent border-0 text-xl outline-none placeholder-blue-400 text-blue-900 flex-grow py-1 "
        />
        <SearchButton
          className="bg-transparent border-none flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-125"
          onClick={handleSearch}
        >
          <FaSearchLocation className="text-blue-900 text-2xl" />
        </SearchButton>
      </div>

      {/* Container principal para endereço consultado e endereços salvos */}
      <div
        className={`flex ${
          savedAddresses.length > 0
            ? "flex-col md:flex-row justify-between"
            : "flex-col items-center"
        } w-full max-w-4xl mt-8 gap-8`}
      >
        {/* Endereço consultado */}
        <div
          className={`${
            savedAddresses.length > 0 ? "w-full md:flex-1" : "w-full max-w-md"
          }`}
        >
          {Object.keys(data).length > 0 && (
            <>
              <h2 className="text-blue-900 text-4xl font-bold mb-4 text-center md:text-left ">
                Endereço Consultado:
              </h2>
              <CardResult
                cep={data.cep!}
                logradouro={data.logradouro!}
                bairro={data.bairro!}
                localidade={data.localidade!}
                uf={data.uf!}
                ddd={data.ddd!}
                handleSave={handleSave}
                isSaved={isSaved}
              />
            </>
          )}
        </div>

        {/* Endereços salvos */}
        {savedAddresses.length > 0 && (
          <div className="w-full md:flex-1">
            <section className="w-full">
              <h2 className="text-blue-900 text-4xl font-bold mb-4 text-center md:text-left ">
                Endereços Salvos:
              </h2>
              <div className="space-y-4">
                {savedAddresses.map((addr, index) => (
                  <CardSaved
                    key={index}
                    cep={addr.cep}
                    logradouro={addr.logradouro}
                    bairro={addr.bairro}
                    localidade={addr.localidade}
                    uf={addr.uf}
                    ddd={addr.ddd}
                    handleDelete={() => handleDelete(addr.cep!)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Histórico de Pesquisas */}
      {searchHistory.length > 0 && (
        <div className="w-full max-w-4xl mt-8">
          <h2 className="text-blue-900 text-4xl font-bold mb-4 text-center md:text-left ">
            Histórico de Pesquisas:
          </h2>
          <div className="space-y-4">
            {searchHistory.map((addr, index) => (
              <CardHistory
                key={index}
                cep={addr.cep}
                logradouro={addr.logradouro}
                bairro={addr.bairro}
                localidade={addr.localidade}
                uf={addr.uf}
                ddd={addr.ddd}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;