import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'p-8',
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-white border border-[#EADBC8]/30',
    glass: 'bg-white/70 backdrop-blur-md border border-white/20',
    dark: 'bg-[#102C57] text-[#FEFAF6] border-none'
  };

  const hoverStyle = hover ? 'hover:shadow-[0_20px_50px_rgba(16,44,87,0.06)] hover:-translate-y-1 transition-all duration-500' : '';

  return (
    <div className={`rounded-[2.5rem] shadow-[0_10px_30px_rgba(16,44,87,0.02)] ${variants[variant]} ${padding} ${hoverStyle} ${className}`}>
      {children}
    </div>
  );
};

export default Card;