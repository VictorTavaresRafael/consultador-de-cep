import React from "react";

interface CardHistoryProps {
  cep: string | undefined;
  logradouro: string | undefined;
  bairro: string | undefined;
  localidade: string | undefined;
  uf: string | undefined;
  ddd: string | undefined;
}

const CardHistory: React.FC<CardHistoryProps> = ({
  cep,
  logradouro,
  bairro,
  localidade,
  uf,
  ddd,
}) => {
  return (
    <>
      <div
        className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg flex flex-col items-center text-center"
      >
        <h2 className="text-blue-900 text-3xl font-extrabold my-2 ">
          CEP: {cep}
        </h2>
        <span className="text-blue-800 text-xl font-semibold mb-2 ">
          Rua: {logradouro}
        </span>
        <span className="text-blue-800 text-xl font-semibold mb-2 ">
          Bairro: {bairro}
        </span>
        <span className="text-blue-800 text-xl font-semibold mb-2 ">
          Cidade: {localidade}
        </span>
        <span className="text-blue-800 text-xl font-semibold mb-2 ">
          Estado: {uf}
        </span>
        <span className="text-blue-800 text-xl font-semibold mb-2 ">
          DDD: {ddd}
        </span>
      </div>
    </>
  );
};

export default CardHistory;
