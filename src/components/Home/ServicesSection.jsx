import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import ServiceCard from '../Services/ServiceCard';
import { ServiceSkeleton } from '../UI/Skeleton';
import { useCategories } from '../../hooks/useCategories';
import { useServices } from '../../hooks/useServices';

const ServicesSection = () => {
  const { categories, isLoading: catsLoading } = useCategories();
  const { services: apiServices, isLoading: servicesLoading } = useServices();
  const isLoading = catsLoading || servicesLoading;

  // Helper to find names for the card overlay
  const getNames = (service) => {
    // Try to find by ID first, then by name (lowercase match)
    const cat = categories?.find(c => 
      String(c.id) === String(service.categoryId) || 
      (c.name || '').toLowerCase() === String(service.categoryId).toLowerCase()
    );
    
    // Similarly for subcategories
    const sub = cat?.subCategories?.find(s => 
      String(s.id) === String(service.subCategoryId) || 
      (s.name || '').toLowerCase() === String(service.subCategoryId).toLowerCase()
    );

    return {
      categoryName: cat?.name || 'Service',
      subCategoryName: sub?.name || ''
    };
  };

  return (
    <section className="bg-white py-14 md:py-28 relative overflow-hidden border-y-2 border-[#EADBC8]/20">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FEFAF6] rounded-full blur-[100px] -mr-48 -mt-48 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#DAC0A3]/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 animate-in fade-in slide-in-from-top-6 duration-1000">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[3px] w-12 bg-[#DAC0A3]"></span>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#DAC0A3]">Premium discovery</span>
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-[#102C57] uppercase tracking-tighter leading-none mb-4 md:mb-6">
              Explore Our <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#102C57] via-[#DAC0A3] to-[#102C57]">Expert Services</span>
            </h2>
            <p className="text-[#102C57]/60 font-bold leading-relaxed text-lg max-w-xl">
              Choose from our most requested professional solutions, delivered by highly vetted experts with a commitment to excellence.
            </p>
          </div>
          <Link
            to="/services"
            className="group flex items-center justify-center gap-6 bg-white border-2 border-[#102C57] px-12 py-6 rounded-[2rem] hover:bg-[#102C57] hover:text-white transition-all duration-500 shadow-xl hover:shadow-[#102C57]/30"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em]"> Explore All Services</span>
            <div className="w-8 h-8 rounded-full border-2 border-[#DAC0A3] group-hover:border-white flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
          {/* <Link to="/services" className="group">
            <Button variant="outline" size="lg" className="border-2 border-[#102C57] text-[#102C57] hover:bg-[#102C57] hover:text-white px-12 py-6 rounded-2xl shadow-xl transition-all duration-500 font-black uppercase text-xs tracking-widest">
              Explore All Services
            </Button>
          </Link> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {isLoading
            ? Array(4).fill(0).map((_, i) => <ServiceSkeleton key={i} />)
            : (apiServices || []).slice(0, 4).map((service, index) => {
              const names = getNames(service);
              return (
                <div
                  key={service.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <ServiceCard
                    service={service}
                    categoryName={names.categoryName}
                    subCategoryName={names.subCategoryName}
                  />
                </div>
              );
            })
          }
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
