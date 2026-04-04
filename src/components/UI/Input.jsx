import React from 'react';

export const Input = ({ label, required, error, ...props }) => (
  <div className="w-full flex flex-col gap-1.5 relative group">
    {label && (
      <label className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300 text-[#102C57]`}>
        {label} {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <input
      className={`w-full h-12 px-4 bg-[#FEFAF6] rounded-xl outline-none text-[#102C57] text-sm font-medium transition-all duration-300 border-2
        ${error
          ? 'border-red-400 bg-red-50/30 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
          : 'border-[#EADBC8]/60 focus:border-[#102C57] focus:bg-white shadow-sm'
        }`}
      {...props}
    />
    {error && (
      <span className="text-red-600 text-[9px] font-bold uppercase tracking-wider mt-1 px-1 flex justify-end animate-in fade-in slide-in-from-top-1">
        {error}
      </span>
    )}
  </div>
);