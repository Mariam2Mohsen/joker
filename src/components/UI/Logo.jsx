import React from 'react';
import logoImg from '../../assets/logo.jpg';

const Logo = ({ className = '', variant = 'dark', ...props }) => (
  <div 
    className={`flex items-center ${className}`} 
    {...props}
  >
    <img 
      src={logoImg} 
      alt="JoKeR Logo" 
      className="h-full w-auto object-contain"
    />
  </div>
);

export default Logo;
