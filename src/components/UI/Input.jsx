import React from 'react';

export const Input = ({ label, required, error, valid, ...props }) => {
  const isInvalid = !!error;
  const isValid = !!valid && !error;

  return (
    <div className="w-full flex flex-col gap-1.5 relative group">
      {label && (
        <div className="flex justify-between items-center px-1">
          <label className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 
            ${isInvalid ? 'text-red-500' : isValid ? 'text-green-600' : 'text-[#102C57]'}`}>
            {label} {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        </div>
      )}
      <div className="relative">
        <input
          className={`w-full h-12 px-4 bg-[#FEFAF6] rounded-xl outline-none text-[#102C57] text-sm font-medium transition-all duration-300 border-2
            ${isInvalid
              ? 'border-red-400 bg-red-50/30 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
              : isValid
                ? 'border-green-400 bg-green-50/20 focus:border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                : 'border-[#EADBC8]/60 focus:border-[#102C57] focus:bg-white shadow-sm'
            }`}
          {...props}
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 scale-100">
          {isInvalid && (
            <div className="text-red-500 animate-in zoom-in-50 duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
          )}
          {isValid && (
            <div className="text-green-500 animate-in zoom-in-50 duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          )}
        </div>
      </div>

      {error && (
        <span className="text-red-600 text-[10px] font-bold uppercase tracking-wider mt-0.5 px-2 flex justify-end animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
};