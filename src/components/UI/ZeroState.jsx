import React from 'react';
import Button from './Button';

const ZeroState = ({ 
  title = "No Content Found", 
  message = "We couldn't find anything matching your criteria. Try adjusting your filters or search terms.",
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
      <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl border-2 border-[#EADBC8]/30 group hover:rotate-6 transition-transform">
        {icon || (
          <svg className="w-10 h-10 text-[#DAC0A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <h3 className="text-2xl font-black text-[#102C57] uppercase tracking-tighter mb-4">
        {title}
      </h3>
      <p className="text-[#102C57]/50 font-medium max-w-md mx-auto leading-relaxed mb-10">
        {message}
      </p>
      {actionLabel && (
        <Button variant="primary" onClick={onAction} className="px-10 h-14">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default ZeroState;
