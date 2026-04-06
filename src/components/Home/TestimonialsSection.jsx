import React, { useRef, useState } from 'react';
import StarRating from '../UI/StarRating';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Homeowner",
    text: "The service exceeded my expectations. The plumber arrived on time, was extremely professional, and solved the issue within an hour.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: 2,
    name: "David Chen",
    role: "Property Manager",
    text: "I rely on this platform for all my building maintenance needs. Finding trusted professionals has never been this simple and efficient.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=david",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Restaurant Owner",
    text: "Top-notch specialized cleaning! They handled our kitchen equipment with utmost care and left the place spotless. Highly recommended.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=emily",
  },
  {
    id: 4,
    name: "Michael Thompson",
    role: "Office Manager",
    text: "The electrical repair team was fantastic. Very fast response time and the quality of work is outstanding.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=michael",
  }
];

const TestimonialsSection = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 400;
    scrollRef.current.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="bg-[#102C57] py-28 relative overflow-hidden border-y-2 border-[#DAC0A3]/10">
      {/* Background embellishments */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#DAC0A3]/5 rounded-full blur-[120px] -ml-40 -mb-40"></div>

      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="max-w-2xl text-[#FEFAF6]">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[3px] w-12 bg-[#DAC0A3]"></span>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#DAC0A3]">Real Stories</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
              What Our <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEFAF6] via-[#DAC0A3] to-[#FEFAF6]">Clients Say</span>
            </h2>
            <p className="text-[#FEFAF6]/60 font-medium text-lg leading-relaxed max-w-xl">Don't just take our word for it. Read the experiences of thousands of satisfied customers who've transformed their spaces.</p>
          </div>
          
          <div className="flex gap-6">
            <button 
              onClick={() => scroll('prev')}
              disabled={!canScrollLeft}
              className={`w-16 h-16 flex items-center justify-center rounded-2xl border-[3px] transition-all duration-300 ${!canScrollLeft ? 'border-white/5 text-white/10 cursor-not-allowed' : 'border-[#DAC0A3]/40 text-[#DAC0A3] hover:bg-[#DAC0A3] hover:text-[#102C57] hover:border-[#DAC0A3]'}`}
              aria-label="Previous testimonials"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button 
              onClick={() => scroll('next')}
              disabled={!canScrollRight}
              className={`w-16 h-16 flex items-center justify-center rounded-2xl border-[3px] transition-all duration-300 ${!canScrollRight ? 'border-white/5 text-white/10 cursor-not-allowed' : 'border-[#DAC0A3]/40 text-[#DAC0A3] hover:bg-[#DAC0A3] hover:text-[#102C57] hover:border-[#DAC0A3]'}`}
              aria-label="Next testimonials"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-10 overflow-x-auto scrollbar-hide scroll-smooth py-12 px-2"
        >
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id} className="flex-shrink-0 w-[380px] md:w-[450px]">
              <div className="bg-white/5 backdrop-blur-2xl border-2 border-white/10 p-12 rounded-[3.5rem] h-full flex flex-col group hover:bg-white/[0.08] hover:border-[#DAC0A3]/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAC0A3]/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-[#DAC0A3]/10 transition-all"></div>
                
                <StarRating rating={testimonial.rating} className="mb-8" />
                <p className="text-[#FEFAF6] text-xl font-medium leading-relaxed flex-grow mb-12 relative z-10 italic">"{testimonial.text}"</p>
                
                <div className="flex items-center gap-5 border-t-2 border-white/10 pt-8 mt-auto relative z-10">
                  <div className="relative">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 object-cover rounded-[1.5rem] border-[3px] border-[#DAC0A3] shadow-xl group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#DAC0A3] rounded-full flex items-center justify-center text-[#102C57] shadow-lg">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-[#FEFAF6] text-lg uppercase tracking-wider group-hover:text-[#DAC0A3] transition-colors">{testimonial.name}</h4>
                    <p className="text-[#DAC0A3]/70 text-xs font-black uppercase tracking-[0.2em]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
