import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  footer,
  size = 'md' 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#102C57]/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`relative w-full ${sizes[size]} bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(16,44,87,0.2)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500`}>
        {/* Header */}
        <div className="bg-[#102C57] p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-3xl font-black text-[#FEFAF6] uppercase tracking-tighter mb-2 relative z-10">{title}</h2>
          {subtitle && (
            <p className="text-[#DAC0A3] text-[10px] font-black uppercase tracking-[0.3em] relative z-10">{subtitle}</p>
          )}
        </div>

        {/* Body */}
        <div className="p-8 md:p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-8 md:p-10 pt-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
