// button component

import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick}>{label}</button>
  );
};

export default Button; // export default Button: Button 컴포넌트를 default로 export
