import React, { useState, useEffect } from 'react';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1600&q=80',
    title: 'Transform Your Home',
    description: 'From vibrant painting to professional cleaning, we bring expert care to your doorstep.'
  },
  {
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1600&q=80',
    title: 'Technical Repairs',
    description: 'Expert plumbing and electrical fixes by certified professionals you can trust.'
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
    title: 'Reliable Maintenance',
    description: 'Keeping your sanctuary in pristine condition with regular, high-quality upkeep.'
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[420px] md:min-h-[600px] flex items-center px-4 md:px-10 overflow-hidden">
      {/* Slideshow background */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-linear scale-110"
            style={{
              backgroundImage: `url('${slide.image}')`,
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102C57] to-transparent opacity-60" />
        </div>
      ))}

      <div className="relative z-10 max-w-3xl mt-8 md:mt-0 text-[#FEFAF6]">
        <div className="overflow-hidden mb-4 md:mb-6">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] animate-in slide-in-from-bottom-12 duration-1000">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEFAF6] to-[#DAC0A3]">
              {HERO_SLIDES[currentSlide].title}
            </span>
          </h1>
        </div>

        <p className="mb-6 md:mb-10 text-base md:text-xl font-medium max-w-xl leading-relaxed text-[#FEFAF6]/90 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          {HERO_SLIDES[currentSlide].description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <button
            type="button"
            className="bg-[#DAC0A3] text-[#102C57] px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-[#FEFAF6] hover:shadow-[0_25px_60px_rgba(218,192,163,0.4)] transition-all duration-500 transform active:scale-95 group flex items-center gap-3 w-fit"
          >
            <span>Book Now</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        <div className="flex gap-4 mt-10 md:mt-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-700 ${i === currentSlide ? 'w-10 md:w-16 bg-[#DAC0A3] shadow-[0_0_20px_rgba(218,192,163,0.6)]' : 'w-4 md:w-6 bg-white/30 hover:bg-white/50'
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute right-12 bottom-12 hidden lg:flex flex-col items-end gap-2 text-[12px] font-black uppercase tracking-[0.5em] text-white/50">
        <span>0{currentSlide + 1}</span>
        <div className="w-[3px] h-20 bg-white/10 rounded-full overflow-hidden">
          <div
            className="w-full bg-[#DAC0A3] transition-all duration-1000 shadow-[0_0_15px_#DAC0A3]"
            style={{ height: `${((currentSlide + 1) / HERO_SLIDES.length) * 100}%` }}
          ></div>
        </div>
        <span>0{HERO_SLIDES.length}</span>
      </div>
    </section>
  );
};

export default Hero;
