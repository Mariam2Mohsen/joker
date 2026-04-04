import React from 'react';

const SubCategoryPill = ({ name, active, onClick, rating = 4.8, description = '' }) => {
  return (
    <div className="relative group/pill">
      <button
        onClick={onClick}
        className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 border-2 whitespace-nowrap ${active
            ? 'bg-[#102C57] text-[#FEFAF6] border-[#102C57] shadow-lg scale-105'
            : 'bg-white text-[#102C57]/60 border-[#EADBC8]/40 hover:border-[#102C57]/30 hover:text-[#102C57]'
          }`}
      >
        {name}
      </button>

      {/* Quick Look Popup */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-4 bg-[#102C57] rounded-2xl shadow-2xl opacity-0 group-hover/pill:opacity-100 translate-y-2 group-hover/pill:translate-y-0 transition-all duration-300 pointer-events-none z-30">
        <div className="text-center">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#DAC0A3]/60 block mb-1">Quick Look</span>
          <p className="text-[#FEFAF6]/80 text-[10px] font-bold uppercase tracking-widest leading-tight">
            {description || `Premium ${name} services with verified experts.`}
          </p>
        </div>
        {/* Triangle tail */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#102C57]"></div>
      </div>
    </div>
  );
};

export default SubCategoryPill;
