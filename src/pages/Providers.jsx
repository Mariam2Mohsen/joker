import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import StarRating from '../components/UI/StarRating';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Modal from '../components/UI/Modal';
import { useProviders } from '../hooks/useProviders';
import ProviderDetailsModal from '../components/UI/ProviderDetailsModal';
import ZeroState from '../components/UI/ZeroState';

const Providers = () => {
  const { providers, isLoading } = useProviders();
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (providerId) => {
    setSelectedProviderId(providerId);
    setIsModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FEFAF6] relative border-t-2 border-[#EADBC8]/20">
        
        {/* Abstract Background Top */}
        <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[100%] rounded-full bg-[#DAC0A3]/20 blur-3xl opacity-30"></div>
          <div className="absolute top-[10%] right-[-10%] w-[40%] h-[80%] rounded-full bg-[#102C57]/10 blur-3xl opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 relative z-10">
          
          <div className="text-center mb-10 md:mb-24 animate-in fade-in slide-in-from-top-4 duration-700">
            <h4 className="text-[#DAC0A3] font-black uppercase tracking-[0.3em] text-sm mb-4">Our Elite Network</h4>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#102C57] tracking-tight">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#102C57] to-[#DAC0A3]">Skilled Providers</span>
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-[#102C57]/70 max-w-2xl mx-auto leading-relaxed">
              Find and connect with highly vetted professionals. We ensure you get the best service, reliability, and local trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
            {isLoading ? (
              <div className="col-span-full h-64 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#DAC0A3] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : providers.length > 0 ? (
              providers.map((provider, index) => (
                <div key={provider.id} className="animate-in fade-in slide-in-from-bottom-10 duration-700 h-full" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card padding="p-0" className="flex flex-col h-full group perspective-1000 border-[3px] border-white hover:border-[#DAC0A3] transition-all duration-500 rounded-[3rem] shadow-xl hover:shadow-[0_30px_60px_rgba(16,44,87,0.12)] bg-white/60 backdrop-blur-sm">
                    <div className="relative p-8 md:p-10 flex flex-col items-center flex-grow">
                      
                      {/* Premium Badge */}
                      <div className="absolute top-6 right-6">
                        <div className="w-10 h-10 rounded-full bg-[#DAC0A3]/20 flex items-center justify-center group-hover:rotate-[360deg] transition-all duration-1000 border border-[#DAC0A3]/30">
                          <svg className="w-5 h-5 text-[#DAC0A3]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </div>
                      </div>

                      <div className="w-32 h-32 rounded-[2.5rem] bg-[#FEFAF6] border-[4px] border-[#102C57]/10 overflow-hidden shadow-xl mb-6 group-hover:scale-105 group-hover:border-[#DAC0A3] transition-all duration-500 flex-shrink-0">
                        <img
                          src={provider.avatar}
                          alt={provider.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='150' height='150' fill='%23FEFAF6'/%3E%3Ccircle cx='75' cy='55' r='25' fill='%23102C57' opacity='0.2'/%3E%3Cpath d='M30 120 C 30 90, 120 90, 120 120' stroke='%23102C57' stroke-width='8' fill='none' opacity='0.2'/%3E%3C/svg%3E`; }}
                        />
                      </div>

                      <h3 className="font-black text-[#102C57] text-xl uppercase tracking-tight mb-2 text-center group-hover:text-[#DAC0A3] transition-colors">{provider.name}</h3>
                      <StarRating rating={provider.rating} className="mb-6 scale-90" />

                      <div className="flex flex-wrap justify-center gap-2 mb-8 flex-grow">
                        {provider.categories.map((cat, i) => (
                          <span key={i} className="text-[9px] font-black uppercase tracking-widest text-[#102C57]/70 bg-[#102C57]/5 px-3 py-1.5 rounded-lg border-2 border-[#102C57]/5 group-hover:border-[#DAC0A3]/30 group-hover:text-[#102C57] transition-all duration-300">
                            {cat}
                          </span>
                        ))}
                      </div>

                      <button 
                        onClick={() => handleViewDetails(provider.id)}
                        className="w-full mt-auto block"
                      >
                        <Button variant="primary" fullWidth size="lg" className="group-hover:shadow-[0_15px_30px_rgba(16,44,87,0.2)] bg-[#102C57] hover:bg-[#DAC0A3] hover:text-[#102C57] transition-all py-4 border-none text-[10px]">
                          View Details
                        </Button>
                      </button>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <ZeroState 
                  title="No Providers Available" 
                  message="We couldn't find any professional providers at the moment. We are constantly expanding our team, so please check back soon!"
                  actionLabel="Join as Provider"
                  onAction={() => window.location.href='/signup-provider'}
                />
              </div>
            ) }
          </div>

        </div>
      </div>
      
      {/* Reusable Details Modal */}
      <ProviderDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        providerId={selectedProviderId} 
      />
    </MainLayout>
  );
};

export default Providers;
