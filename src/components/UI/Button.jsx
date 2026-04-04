import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-2xl';
  
  const variants = {
    primary: 'bg-[#102C57] text-[#FEFAF6] hover:shadow-[0_10px_30px_rgba(16,44,87,0.2)] hover:-translate-y-1',
    secondary: 'bg-[#DAC0A3] text-[#102C57] hover:bg-[#FEFAF6] hover:shadow-[0_10px_30px_rgba(218,192,163,0.3)] hover:-translate-y-1',
    outline: 'bg-transparent border-2 border-[#102C57] text-[#102C57] hover:bg-[#102C57] hover:text-[#FEFAF6]',
    ghost: 'bg-transparent text-[#102C57]/60 hover:text-[#102C57] hover:bg-[#102C57]/5',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-[0_10px_30px_rgba(239,68,68,0.2)] hover:-translate-y-1'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[9px]',
    md: 'px-8 py-4 text-[11px]',
    lg: 'px-12 py-5 text-[12px]',
    icon: 'p-3'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;