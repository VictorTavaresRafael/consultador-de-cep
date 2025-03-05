import React from "react";
import { FaSave, FaCheck } from "react-icons/fa";


interface SaveButtonProps {
  handleSave: () => void;
  isSaved: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  handleSave,
  isSaved,
}) => {
  return (
    <>
      <button
        onClick={handleSave}
        className={`flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105  ${
          isSaved ? "opacity-50 cursor-not-allowed" : ""
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
    </>
  );
};

export default SaveButton;
