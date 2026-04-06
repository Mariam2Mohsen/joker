import React from 'react';

const Carousel = ({ children, onPrev, onNext }) => (
  <div className="relative flex items-center gap-4">
    <button
      type="button"
      onClick={onPrev}
      className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 text-xl font-light"
      aria-label="Previous"
    >
      ‹
    </button>
    <div className="flex-1 overflow-hidden">{children}</div>
    <button
      type="button"
      onClick={onNext}
      className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 text-xl font-light"
      aria-label="Next"
    >
      ›
    </button>
  </div>
);

export default Carousel;
