import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import Button from '../UI/Button';
import StarRating from '../UI/StarRating';
import ProviderDetailsModal from '../UI/ProviderDetailsModal';
import { useProviders } from '../../hooks/useProviders';
const ProvidersSection = () => {
  const scrollRef = useRef(null);
  const { providers, isLoading } = useProviders();
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProfile = (providerId) => {
    setSelectedProviderId(providerId);
    setIsModalOpen(true);
  };

  

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 350;
    scrollRef.current.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-[#FEFAF6] py-28 relative border-y-2 border-[#EADBC8]/20">
      <div className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[3px] w-12 bg-[#DAC0A3]"></span>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#DAC0A3]">Our Elite Network</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-[#102C57] uppercase tracking-tighter leading-none mb-6">
              Meet Our <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#102C57] via-[#DAC0A3] to-[#102C57]">Skilled Experts</span>
            </h2>
            <p className="text-[#102C57]/60 font-medium text-lg leading-relaxed max-w-xl">Highly vetted professionals with proven track records of excellence, reliability, and local trust.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/providers">
              <Button variant="primary" size="lg" className="w-full sm:w-auto mt-4 sm:mt-0 shadow-[0_10px_30px_rgba(16,44,87,0.2)]">
                View All Providers
              </Button>
            </Link>
            <div className="flex gap-4">
              <button
                onClick={() => scroll('prev')}
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white border-[3px] border-[#DAC0A3]/30 text-[#102C57] hover:bg-[#102C57] hover:text-[#FEFAF6] hover:border-[#102C57] transition-all duration-300 shadow-xl"
                aria-label="Previous"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={() => scroll('next')}
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white border-[3px] border-[#DAC0A3]/30 text-[#102C57] hover:bg-[#102C57] hover:text-[#FEFAF6] hover:border-[#102C57] transition-all duration-300 shadow-xl"
                aria-label="Next"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-12 overflow-x-auto scrollbar-hide scroll-smooth py-12 px-2"
        >
          {isLoading ? (
            <div className="w-full text-center py-10 text-[#102C57]">Loading providers...</div>
          ) : providers.map((provider, index) => (
            <div key={provider.id} className="flex-shrink-0 w-[340px] animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
              <Card padding="p-0" className="flex flex-col h-full group perspective-1000 border-[3px] border-white hover:border-[#DAC0A3] transition-all duration-500 rounded-[3rem] shadow-xl hover:shadow-2xl">
                <div className="relative p-12 flex flex-col items-center">
                  {/* Premium Badge */}
                  <div className="absolute top-8 right-8">
                    <div className="w-12 h-12 rounded-full bg-[#DAC0A3]/20 flex items-center justify-center group-hover:rotate-[360deg] transition-all duration-1000 border border-[#DAC0A3]/30">
                      <svg className="w-6 h-6 text-[#DAC0A3]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </div>
                  </div>

                  <div className="w-36 h-36 rounded-[3rem] bg-[#FEFAF6] border-[4px] border-[#102C57]/10 overflow-hidden shadow-2xl mb-8 group-hover:scale-105 group-hover:border-[#DAC0A3] transition-all duration-500">
                    <img
                      src={provider.avatar}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-black text-[#102C57] text-2xl uppercase tracking-tighter mb-2 text-center group-hover:text-[#DAC0A3] transition-colors">{provider.name}</h3>
                  <StarRating rating={provider.rating} className="mb-8" />

                  <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {provider.categories.map((cat, i) => (
                      <span key={i} className="text-[9px] font-black uppercase tracking-widest text-[#102C57]/60 bg-[#102C57]/5 px-4 py-2 rounded-xl border-2 border-[#102C57]/5 group-hover:border-[#DAC0A3]/30 group-hover:text-[#102C57]">
                        {cat}
                      </span>
                    ))}
                  </div>

                  <button
onClick={() => handleViewProfile(provider.Users_id || provider.id)}                   
 className="w-full"
                  >
                    <Button variant="primary" fullWidth size="lg" className="group-hover:shadow-[0_20px_50px_rgba(16,44,87,0.3)] bg-[#102C57] hover:bg-[#DAC0A3] hover:text-[#102C57] transition-all py-5 border-none">
                      View details
                    </Button>
                  </button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <ProviderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        providerId={selectedProviderId}
      />
    </section>
  );
};

export default ProvidersSection;
