import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  onClick, 
  className = '',
  disabled = false 
}) => {
  const baseClasses = 'px-4 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#102C57] text-white hover:bg-[#1a3a6e] focus:ring-[#102C57]',
    secondary: 'bg-[#EADBC8] text-[#102C57] hover:bg-[#DAC0A3] focus:ring-[#DAC0A3]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;