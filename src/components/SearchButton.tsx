import React from 'react';

interface SearchButtonProps {
    className: string;
    onClick: () => void;
    children: React.ReactNode;
  }
  
  const SearchButton: React.FC<SearchButtonProps> = ({ className, onClick, children }) => {
    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  };
  
  export default SearchButton;