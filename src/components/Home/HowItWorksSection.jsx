import React from 'react';

const STEPS = [
  {
    id: 1,
    title: 'Choose Service',
    description: 'Browse our comprehensive list of professional services and select what you need.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    ),
  },
  {
    id: 2,
    title: 'Pick a Provider',
    description: 'Review provider profiles, ratings, and past work to find your perfect match.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    ),
  },
  {
    id: 3,
    title: 'Schedule & Relax',
    description: 'Book a convenient time and let our highly vetted experts handle the rest.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    ),
  }
];

const HowItWorksSection = () => {
  return (
    <section className="bg-[#102C57] py-28 relative overflow-hidden border-y-2 border-[#EADBC8]/10">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#DAC0A3]/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-[3px] w-12 bg-[#DAC0A3]"></span>
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#DAC0A3]">Simple & Secure</span>
            <span className="h-[3px] w-12 bg-[#DAC0A3]"></span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-[#FEFAF6] uppercase tracking-tighter leading-none mb-8">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEFAF6] to-[#DAC0A3]">Works</span>
          </h2>
          <p className="text-[#FEFAF6]/60 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Experience the future of home services. Our streamlined process ensures you get the highest quality professional help in just a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connecting line for desktop - clearer and more prominent */}
          <div className="hidden md:block absolute top-[5rem] left-[15%] right-[15%] h-[3px] bg-gradient-to-r from-transparent via-[#DAC0A3]/30 to-transparent"></div>

          {STEPS.map((step, index) => (
            <div 
              key={step.id} 
              className="relative text-center group animate-in fade-in slide-in-from-bottom-10 duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="mx-auto w-40 h-40 mb-10 relative">
                <div className="absolute inset-0 bg-[#102C57] rounded-full border-[6px] border-[#FEFAF6]/10 group-hover:border-[#DAC0A3] shadow-2xl transition-all duration-500 z-10 flex items-center justify-center text-[#FEFAF6] group-hover:text-[#DAC0A3] group-hover:scale-105">
                  <div className="transform group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>
                </div>
                {/* Step number badge - more prominent */}
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#DAC0A3] text-[#102C57] rounded-full flex items-center justify-center text-xl font-black z-20 shadow-[0_0_30px_rgba(218,192,163,0.3)] border-[3px] border-[#102C57] group-hover:rotate-12 transition-all">
                  {step.id}
                </div>
              </div>
              <h3 className="text-3xl font-black text-[#FEFAF6] uppercase tracking-tighter mb-6 group-hover:text-[#DAC0A3] transition-colors">{step.title}</h3>
              <p className="text-[#FEFAF6]/50 font-medium leading-relaxed text-base max-w-[280px] mx-auto group-hover:text-[#FEFAF6]/80 transition-colors">{step.description}</p>
              
              {/* Accessibility improvement: more visible indicator for step progression */}
              <div className="mt-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-1 w-12 bg-[#DAC0A3] rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
