import React from 'react';

export const CategorySkeleton = () => (
  <div className="bg-white rounded-[2.5rem] p-8 border border-[#EADBC8]/30 shadow-sm flex flex-col items-center animate-pulse">
    <div className="w-24 h-24 rounded-[2rem] bg-[#EADBC8]/20 mb-6"></div>
    <div className="h-4 w-32 bg-[#EADBC8]/30 rounded-full mb-3"></div>
    <div className="h-2 w-48 bg-[#EADBC8]/10 rounded-full mb-1"></div>
    <div className="h-2 w-40 bg-[#EADBC8]/10 rounded-full"></div>
  </div>
);

/** Matches the updated CategoryCard layout exactly */
export const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] border border-[#EADBC8]/30 shadow-sm flex flex-col overflow-visible animate-pulse">
    {/* Image block */}
    <div className="relative w-full h-64 rounded-t-[2.5rem] overflow-hidden bg-[#EADBC8]/20">
      {/* Fake price badge */}
      <div className="absolute top-5 right-5 w-24 h-8 bg-white/60 rounded-xl" />
      {/* Fake rating badge */}
      <div className="absolute top-5 left-5 w-16 h-8 bg-white/40 rounded-xl" />
    </div>
    {/* Content block */}
    <div className="p-8 pt-6 flex flex-col flex-1 gap-4">
      <div className="h-8 w-2/3 bg-[#EADBC8]/30 rounded-xl" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-[#EADBC8]/15 rounded-full" />
        <div className="h-3 w-3/4 bg-[#EADBC8]/10 rounded-full" />
      </div>
      <div className="mt-auto pt-6 border-t border-[#EADBC8]/20 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-2 w-16 bg-[#EADBC8]/20 rounded-full" />
          <div className="h-3 w-24 bg-[#EADBC8]/30 rounded-full" />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#EADBC8]/20" />
      </div>
    </div>
  </div>
);

/** Matches the new shared ServiceCard layout exactly */
export const ServiceSkeleton = () => (
  <div className="bg-white rounded-[3rem] overflow-hidden border-2 border-[#EADBC8]/20 shadow-xl animate-pulse flex flex-col h-full">
    {/* Image block */}
    <div className="aspect-[4/5] bg-[#EADBC8]/20 relative">
      <div className="absolute top-6 right-6 w-16 h-10 bg-white/60 rounded-xl" />
      <div className="absolute top-6 left-6 w-14 h-12 bg-white/40 rounded-2xl" />
      <div className="absolute bottom-8 left-8 w-48 h-8 bg-white/30 rounded-xl" />
    </div>
    {/* Content block */}
    <div className="p-8 pb-10 flex flex-col flex-1 bg-white space-y-8">
      {/* Provider placeholder */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#EADBC8]/20" />
        <div className="space-y-2">
          <div className="h-2 w-12 bg-[#EADBC8]/10 rounded-full" />
          <div className="h-3 w-24 bg-[#EADBC8]/20 rounded-full" />
        </div>
      </div>
      {/* Description placeholder */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-[#EADBC8]/15 rounded-full" />
        <div className="h-3 w-3/4 bg-[#EADBC8]/10 rounded-full" />
      </div>
      {/* Buttons placeholder */}
      <div className="mt-auto pt-6 border-t-2 border-[#EADBC8]/20 flex flex-col gap-4">
        <div className="h-3 w-24 bg-[#EADBC8]/20 rounded-full" />
        <div className="h-12 w-full bg-[#EADBC8]/30 rounded-2xl" />
      </div>
    </div>
  </div>
);
