import React from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../Categories/CategoryCard';
import { CategoryCardSkeleton } from '../UI/Skeleton';
import { useTopCategories } from '../../hooks/useCategories';
import logoImg from '../../assets/cta-logo.png';
import ZeroState from '../UI/ZeroState';

const CategoriesSection = () => {
  const { categories, isLoading } = useTopCategories(6);

  return (
    <section className="bg-[#FEFAF6] py-16 md:py-32 relative overflow-hidden">
      {/* Decorative logo-aligned elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 border-2 border-[#DAC0A3]/30 rounded-full"></div>
        <div className="absolute top-20 left-20 w-48 h-48 border-[12px] border-dotted border-[#DAC0A3]/20 rounded-full animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 border-[24px] border-dotted border-[#102C57]/5 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24 animate-in fade-in slide-in-from-top-6 duration-1000">
          <div className="max-w-2xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4 md:mb-6">
              <span className="h-[3px] w-12 bg-[#DAC0A3]"></span>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#DAC0A3]">Our specialty</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-[#102C57] uppercase tracking-tighter leading-none mb-4 md:mb-8">
              Discover <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#102C57] to-[#DAC0A3]">Top Categories</span>
            </h2>
            <p className="text-[#102C57]/50 font-bold text-xl leading-relaxed max-w-xl">
              From premium home care to expert maintenance, we have the right specialist for every task.
            </p>
          </div>
          
          <Link 
            to="/categories" 
            className="group flex items-center justify-center gap-6 bg-white border-2 border-[#102C57] px-12 py-6 rounded-[2rem] hover:bg-[#102C57] hover:text-white transition-all duration-500 shadow-xl hover:shadow-[#102C57]/30"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em]">Browse All</span>
            <div className="w-8 h-8 rounded-full border-2 border-[#DAC0A3] group-hover:border-white flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {isLoading
            ? [1, 2, 3, 4, 5, 6].map(i => <CategoryCardSkeleton key={i} />)
            : categories.length > 0 ? categories.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700 h-full"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <CategoryCard category={category} />
                </div>
              )) : (
                <div className="col-span-full">
                  <ZeroState 
                    title="No Categories Available" 
                    message="Our service intelligence hub is currently being recalibrated. Please check back shortly for our full selection."
                    actionLabel="Contact Support"
                    onAction={() => window.location.href='/contact'}
                  />
                </div>
              )
          }
        </div>
        
        {/* Bottom stylized CTA */}
        <div className="mt-16 md:mt-32 p-10 md:p-24 rounded-[3rem] md:rounded-[5rem] bg-[#102C57] overflow-hidden relative shadow-3xl text-center group">
          {/* THE BRAND BADGE IN THE BACKGROUND - CLEAR AND CRISP */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] aspect-square flex items-center justify-center pointer-events-none transition-all duration-1000 group-hover:rotate-6 group-hover:scale-105">
            {/* Soft Glow */}
            <div className="absolute inset-0 bg-[#DAC0A3]/5 rounded-full blur-[120px]"></div>
            {/* The Badge Image - Higher opacity for clarity */}
            <img src={logoImg} alt="" className="w-3/5 h-3/5 object-contain opacity-[0.12] transition-opacity group-hover:opacity-20 drop-shadow-2xl" />
            {/* Circular Frame */}
            <div className="absolute w-2/3 h-2/3 border-[30px] border-dotted border-white/5 rounded-full scale-125 animate-[spin_100s_linear_infinite]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-3xl md:text-6xl font-black text-[#FEFAF6] uppercase tracking-tighter mb-4 md:mb-8 leading-none">
                Looking for <br/><span className="text-[#DAC0A3]">Custom Solutions?</span>
            </h3>
            <p className="text-[#FEFAF6]/60 font-bold text-base md:text-xl max-w-2xl leading-relaxed mb-8 md:mb-12">
              Our support team is ready to match you with the perfect specialist for your unique requirements.
            </p>
            <Link 
              to="/contact" 
              className="bg-[#DAC0A3] text-[#102C57] px-16 py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] hover:bg-white hover:scale-105 hover:shadow-[0_20px_50px_rgba(218,192,163,0.4)] transition-all duration-500 shadow-2xl"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
