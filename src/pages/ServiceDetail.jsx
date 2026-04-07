import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import StarRating from '../components/UI/StarRating';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import ServiceCard from '../components/Services/ServiceCard';
import { useCategories } from '../hooks/useCategories';
import { useServiceById, useServices } from '../hooks/useServices';

const ServiceDetail = () => {
    const { id } = useParams();
    const { categories, isLoading: catsLoading } = useCategories();
    const { service, isLoading: serviceLoading } = useServiceById(id);
    const { services: apiServices, isLoading: apiServicesLoading } = useServices();
    
    const isLoading = catsLoading || serviceLoading || apiServicesLoading;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const mappedServices = apiServices || [];

    if (isLoading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-[#FEFAF6]">
                    <div className="w-16 h-16 border-4 border-[#DAC0A3]/20 border-t-[#DAC0A3] rounded-full animate-spin"></div>
                </div>
            </MainLayout>
        );
    }

    if (!service) {
        return (
            <MainLayout>
                <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFAF6] p-10">
                    <h2 className="text-3xl font-black text-[#102C57] mb-6">Service Not Found</h2>
                    <Link to="/services">
                        <Button variant="primary">Back to Services</Button>
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="bg-[#FEFAF6] pb-24">
            {/* Hero section from photo */}
                <section className="relative h-[300px] md:h-[550px] overflow-hidden">
                    <div className="absolute inset-0">
                        <img 
                            src={service.image} 
                            alt={service.name} 
                            className="w-full h-full object-cover scale-105"
                            onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#102C57]/80 via-[#102C57]/40 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 container mx-auto px-4 md:px-10 h-full flex flex-col justify-center text-[#FEFAF6]">
                        <div className="max-w-2xl">
                           <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-3 leading-tight">
                               {service.name}
                           </h1>
                           <p className="text-sm md:text-xl text-[#FEFAF6]/80 font-medium mb-4 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">
                               {service.description || 'Quick, clean and professional home services at your doorstep. Skilled experts you can trust for every job.'}
                           </p>
                           <div className="flex items-center gap-4">
                               <StarRating rating={service.rating} size="lg" />
                               <span className="text-sm font-bold uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full border border-white/20">
                                   {service.rating} Rating
                               </span>
                           </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 md:px-10 relative -mt-24 z-20">
                    {/* Floating Info Card from photo */}
                    <div className="bg-[#102C57]/90 backdrop-blur-xl border-4 border-[#DAC0A3]/30 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10">
                            <div className="flex-1 text-center lg:text-left">
                                <h2 className="text-2xl md:text-4xl font-black text-[#FEFAF6] uppercase tracking-tighter mb-2">
                                    {service.name}
                                </h2>
                                <p className="text-[#DAC0A3] font-black uppercase text-xs tracking-[0.3em] mb-6 md:mb-8">
                                    {service.completedJobs || '150+'} completed jobs
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-[#FEFAF6]/80 font-medium text-sm">
                                    <div className="flex items-center gap-4 justify-center lg:justify-start">
                                        <div className="w-10 h-10 rounded-xl bg-[#DAC0A3]/20 flex items-center justify-center text-[#DAC0A3] flex-shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                        </div>
                                        <span className="truncate">{service.provider}</span>
                                    </div>
                                    <div className="flex items-center gap-4 justify-center lg:justify-start">
                                        <div className="w-10 h-10 rounded-xl bg-[#DAC0A3]/20 flex items-center justify-center text-[#DAC0A3] flex-shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        </div>
                                        <span>Price Type: per {service.unit === '/hr' ? 'Hour' : 'Visit'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 justify-center lg:justify-start">
                                        <div className="w-10 h-10 rounded-xl bg-[#DAC0A3]/20 flex items-center justify-center text-[#DAC0A3] flex-shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                        </div>
                                        <span>Service Areas: {service.areas || 'All Cairo'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center lg:items-end gap-4 md:gap-6 min-w-[180px] md:min-w-[200px]">
                                <div className="text-center lg:text-right">
                                    <span className="text-[#FEFAF6] text-xl font-bold uppercase tracking-widest opacity-60">LE</span>
                                    <span className="text-4xl md:text-6xl font-black text-[#DAC0A3] tracking-tighter ml-2">{service.price}</span>
                                    <span className="text-[#FEFAF6]/60 font-bold ml-2">{service.unit}</span>
                                </div>
                                <Button 
                                    variant="secondary" 
                                    size="lg" 
                                    className="bg-[#DAC0A3] text-[#102C57] font-black px-8 md:px-12 py-4 md:py-5 rounded-2xl shadow-2xl hover:scale-105 transition-transform"
                                >
                                    BOOK NOW
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Section from photo */}
                    <div className="mt-28">
                        <div className="flex items-center gap-4 mb-10">
                            <span className="h-[3px] w-12 bg-[#DAC0A3]"></span>
                            <h3 className="text-3xl font-black text-[#102C57] uppercase tracking-tighter">Gallery</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {(service.gallery && service.gallery.length > 0 ? service.gallery : Array(4).fill(service.image)).map((img, i) => (
                                <div key={i} className="group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] h-48 md:h-64 border-4 border-white shadow-xl hover:border-[#DAC0A3] transition-all duration-500">
                                    <img 
                                        src={img} 
                                        alt={`${service.name} gallery ${i}`} 
                                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                                        onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Reviews Section from photo */}
                    <div className="mt-32">
                        <div className="flex items-center gap-4 mb-10">
                            <span className="h-[3px] w-12 bg-[#DAC0A3]"></span>
                            <h3 className="text-3xl font-black text-[#102C57] uppercase tracking-tighter">Customer Reviews</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                            {[
                                ...(service.reviews || []),
                                {
                                    id: 'static-1',
                                    name: 'Sarah Ahmed',
                                    rating: 5,
                                    text: 'Absolute lifesaver! The provider was professional, arrived on time, and did an amazing job. Highly recommend!',
                                    avatar: 'https://i.pravatar.cc/150?u=sarah'
                                },
                                {
                                    id: 'static-2',
                                    name: 'Mohamed Ali',
                                    rating: 4.5,
                                    text: 'Great service and very reasonable pricing. Will definitely book again for my home maintenance needs.',
                                    avatar: 'https://i.pravatar.cc/150?u=mohamed'
                                },
                                {
                                    id: 'static-3',
                                    name: 'Laila Hassan',
                                    rating: 5,
                                    text: 'The best experience I have had with home services in Egypt. Very professional and polite.',
                                    avatar: 'https://i.pravatar.cc/150?u=laila'
                                }
                            ].slice(0, 3).map((review) => (
                                <div key={review.id} className="relative pt-8 group">
                                    {/* Avatar floating like in photo */}
                                    <div className="absolute top-0 left-10 z-20 w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform">
                                        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-white border-2 border-[#EADBC8] p-10 pt-12 rounded-[2.5rem] shadow-lg group-hover:shadow-2xl transition-all h-full flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-black text-[#102C57] uppercase tracking-widest text-sm">{review.name}</h4>
                                            <div className="flex gap-1">
                                                <StarRating rating={review.rating} size="sm" />
                                            </div>
                                        </div>
                                        <p className="text-[#102C57]/60 font-medium italic mb-2 leading-relaxed">
                                            "{review.text}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Related Services Section from photo */}
                    <div className="mt-32">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <span className="h-[3px] w-12 bg-[#DAC0A3]"></span>
                                <h3 className="text-3xl font-black text-[#102C57] uppercase tracking-tighter">Related Services</h3>
                            </div>
                            <Link to="/services">
                                <Button variant="outline" className="border-2 border-[#102C57] text-[#102C57] font-black uppercase text-xs tracking-widest px-8">SEE ALL</Button>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {mappedServices.filter(s => String(s.id) !== String(service.id) && String(s.categoryId) === String(service.categoryId)).slice(0, 4).map((item, index) => {
                                // Flexible match
                                const cat = categories?.find(c => 
                                    String(c.id) === String(item.categoryId) || 
                                    String(c.slug) === String(item.categoryId)
                                );
                                const serviceSubId = String(item.subCategoryId).toLowerCase().replace(/[\s-]/g, '');
                                const sub = cat?.subCategories?.find(s => {
                                    const sIdMatch = String(s.id) === String(item.subCategoryId);
                                    const sName = (s.name || '').toLowerCase().replace(/[\s-]/g, '');
                                    return sIdMatch || (sName && serviceSubId.includes(sName)) || (sName && sName.includes(serviceSubId));
                                });
                                return (
                                    <div 
                                        key={item.id} 
                                        className="animate-in fade-in slide-in-from-bottom-8 duration-700 h-full" 
                                        style={{ animationDelay: `${index * 150}ms` }}
                                    >
                                        <ServiceCard 
                                            service={item}
                                            categoryName={cat?.name || 'Service'}
                                            subCategoryName={sub?.name || ''}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ServiceDetail;
