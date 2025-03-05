//O uso de IA foi parcial e focado em partes específicas do projeto, principalmente para a lógica de cache, não possuo muito conhecimente e precisei do auxilio da IA. As partes críticas, como a lógica de negócio e integração com a API, foram desenvolvidas manualmente para garantir o controle total sobre o funcionamento da aplicação.
import React, { useState, ChangeEvent, useEffect } from 'react';
import { FaSearchLocation, FaSave, FaCheck, FaTrash } from 'react-icons/fa';

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
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savedAddresses, setSavedAddresses] = useState<CepData[]>([]);
// Uso de IA: A lógica de cache foi implementada com auxílio de IA para evitar
// consultas desnecessárias à API e melhorar a performance.
  const [cache, setCache] = useState<Record<string, CepData>>({});
  const [searchHistory, setSearchHistory] = useState<CepData[]>([]); // Estado do histórico de pesquisas

  // Carregar endereços salvos do localStorage ao iniciar
  useEffect(() => {
    const storedAddresses = localStorage.getItem('savedAddresses');
    if (storedAddresses) {
      setSavedAddresses(JSON.parse(storedAddresses));
    }
  }, []);

  // Atualizar localStorage sempre que savedAddresses mudar
  useEffect(() => {
    localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const handleSearch = async () => {
    if (input === '') {
      alert('Preencha algum CEP');
      return;
    }

    // Uso de IA: Verificar se o CEP já está no cache
    if (cache[input]) {
      setData(cache[input]);
      setIsSaved(false);
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${input}/json/`);
      const result = await response.json();
      if (result.erro) {
        alert('CEP não encontrado');
        return;
      }

      setData(result);
      setInput('');
      setIsSaved(false);

      // Adicionar ao cache
      setCache((prevCache) => ({
        ...prevCache,
        [input]: result,
      }));

      setSearchHistory((prevHistory) => [result, ...prevHistory]);
    } catch (error) {
      alert('Erro ao buscar CEP');
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <h1 className="text-blue-900 text-6xl md:text-8xl font-extrabold animate-fliptitle text-center font-[Poppins] mb-8">
        Consultador de CEP
      </h1>

      <div className="flex items-center mt-5">
        <h2 className="text-blue-800 text-3xl font-semibold mr-4 text-center font-[Poppins]">
        Digite o CEP que deseja consultar, no campo abaixo:
        </h2>
      </div>

      <div className="flex bg-white bg-opacity-90 p-4 my-4 rounded-lg shadow-lg w-full max-w-md">
        <input
          type="text"
          placeholder="Digite o seu CEP"
          value={input}
          onChange={handleChange}
          className="bg-transparent border-0 text-xl outline-none placeholder-blue-400 text-blue-900 flex-grow py-1 font-[Poppins]"
        />
        <button
          className="bg-transparent border-none flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-125"
          onClick={handleSearch}
          aria-label="Buscar CEP"
        >
          <FaSearchLocation className="text-blue-900 text-2xl" />
        </button>
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
        <div className={`${savedAddresses.length > 0 ? "w-full md:flex-1" : "w-full max-w-md"}`}>
          {Object.keys(data).length > 0 && (
            <>
              <h2 className="text-blue-900 text-4xl font-bold mb-4 text-center md:text-left font-[Poppins]">
                Endereço Consultado:
              </h2>
              <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg flex flex-col items-center text-center">
                <h2 className="text-blue-900 text-5xl font-extrabold my-2 font-[Poppins]">
                  CEP: {data.cep}
                </h2>
                <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                  Rua: {data.logradouro}
                </span>
                <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                  Bairro: {data.bairro}
                </span>
                <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                  Cidade: {data.localidade}
                </span>
                <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                  Estado: {data.uf}
                </span>
                <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                  DDD: {data.ddd}
                </span>

                <button
                  onClick={handleSave}
                  className={`flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 font-[Poppins] ${
                    isSaved ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isSaved}
                  aria-label="Salvar Endereço"
                >
                  {isSaved ? (
                    <>
                      <FaCheck className="text-white" />
                      Salvo!
                    </>
                  ) : (
                    <>
                      <FaSave className="text-white" />
                      Salvar Endereço
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Endereços salvos */}
        {savedAddresses.length > 0 && (
          <div className="w-full md:flex-1">
            <section className="w-full">
              <h2 className="text-blue-900 text-4xl font-bold mb-4 text-center md:text-left font-[Poppins]">
                Endereços Salvos:
              </h2>
              <div className="space-y-4">
                {savedAddresses.map((addr, index) => (
                  <div
                    key={index}
                    className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg flex flex-col items-center text-center"
                  >
                    <h2 className="text-blue-900 text-3xl font-extrabold my-2 font-[Poppins]">
                      CEP: {addr.cep}
                    </h2>
                    <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                      Rua: {addr.logradouro}
                    </span>
                    <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                      Bairro: {addr.bairro}
                    </span>
                    <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                      Cidade: {addr.localidade}
                    </span>
                    <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                      Estado: {addr.uf}
                    </span>
                    <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                      DDD: {addr.ddd}
                    </span>
                    <button
                      onClick={() => handleDelete(addr.cep!)}
                      className="mt-2 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-1 rounded-lg transition-all duration-300 hover:bg-red-700 hover:scale-105 font-[Poppins]"
                      aria-label="Excluir Endereço"
                    >
                      <FaTrash className="text-white" />
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Histórico de Pesquisas */}
      {searchHistory.length > 0 && (
        <div className="w-full max-w-4xl mt-8">
          <h2 className="text-blue-900 text-4xl font-bold mb-4 text-center md:text-left font-[Poppins]">
            Histórico de Pesquisas:
          </h2>
          <div className="space-y-4">
            {searchHistory.map((addr, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg flex flex-col items-center text-center"
              >
                <h2 className="text-blue-900 text-3xl font-extrabold my-2 font-[Poppins]">
                  CEP: {addr.cep}
                </h2>
                <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                  Rua: {addr.logradouro}
                </span>
                <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                  Bairro: {addr.bairro}
                </span>
                <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                  Cidade: {addr.localidade}
                </span>
                <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                  Estado: {addr.uf}
                </span>
                <span className="text-blue-800 text-xl font-semibold mb-2 font-[Poppins]">
                  DDD: {addr.ddd}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;