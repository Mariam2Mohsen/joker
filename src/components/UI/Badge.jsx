import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const variants = {
    default: 'bg-[#FEFAF6] text-[#102C57] border-[#EADBC8]',
    success: 'bg-green-50 text-green-600 border-green-100',
    warning: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    danger: 'bg-red-50 text-red-600 border-red-100',
    premium: 'bg-[#102C57] text-[#FEFAF6] border-[#102C57]'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[8px]',
    md: 'px-3 py-1 text-[10px]'
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-black uppercase tracking-widest ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
