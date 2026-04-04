import React from 'react';
import Button from './Button';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#102C57]/60 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl border-4 border-[#DAC0A3]/30 p-10 max-w-sm w-full transition-all duration-300 scale-100 text-center">
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-[#FEFAF6] rounded-full mx-auto flex items-center justify-center text-5xl shadow-inner border-2 border-[#EADBC8]/50">
            🚪
          </div>
          <div className="absolute -bottom-2 right-1/2 translate-x-12 bg-red-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-black text-[#102C57] uppercase tracking-tighter mb-4">
          Leaving So Soon?
        </h3>
        
        <p className="text-[#102C57]/60 font-medium mb-10 leading-relaxed">
          Are you sure you want to log out of your session? We'll miss you!
        </p>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={onConfirm}
            className="w-full bg-[#102C57] text-[#FEFAF6] font-black uppercase text-xs tracking-[0.3em] py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            Yes, Log Me Out
          </Button>
          
          <button 
            onClick={onClose}
            className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-[#102C57]/40 hover:text-[#102C57] transition-colors"
          >
            Cancel & Stay
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
