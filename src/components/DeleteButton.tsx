import React from "react";
import { FaTrash } from "react-icons/fa";

interface DeleteButtonProps {
    handleDelete: (cep: string | undefined) => void;
    cep: string | undefined;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ handleDelete, cep }) => {
  return (
    <>
      <button
        onClick={() => handleDelete(cep)}
        className="mt-2 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-1 rounded-lg transition-all duration-300 hover:bg-red-700 hover:scale-105 "
        aria-label="Excluir Endereço"
      >
        <FaTrash className="text-white" />
        Excluir
      </button>
    </>
  );
};

export default DeleteButton;
