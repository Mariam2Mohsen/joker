import React from "react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="bg-[#FEFAF6] py-28 relative overflow-hidden border-t-2 border-[#EADBC8]/20">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#EADBC8]/30 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="bg-[#102C57] rounded-[4rem] p-12 md:p-24 overflow-hidden relative shadow-2xl border-4 border-[#DAC0A3]/10">
          {/* Internal glow effects */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#DAC0A3]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#DAC0A3]/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            {/* Text Section */}
            <div className="text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-3 mb-8 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/10 shadow-xl">
                <span className="w-3 h-3 rounded-full bg-[#DAC0A3] animate-pulse shadow-[0_0_10px_#DAC0A3]"></span>
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FEFAF6]">
                  Join our growing network
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-[#FEFAF6] uppercase tracking-tighter leading-[0.9] mb-8">
                Ready to Experience <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DAC0A3] via-white to-[#DAC0A3]">
                  Excellence?
                </span>
              </h2>

              <p className="text-[#FEFAF6]/70 font-medium text-xl leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0">
                Whether you need a quick fix or a major renovation, our top-rated
                professionals are ready to help. Book your first service today
                and feel the difference.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                <Link
                  to="/signup-customer"
                  className="w-full sm:w-auto bg-[#DAC0A3] text-[#102C57] px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:shadow-[0_20px_50px_rgba(218,192,163,0.4)] hover:-translate-y-1.5 transition-all duration-500 text-center min-w-[240px]"
                >
                  Get Started Now
                </Link>

                <Link
                  to="/services"
                  className="w-full sm:w-auto bg-white/5 backdrop-blur-md text-[#FEFAF6] border-2 border-white/20 px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 hover:border-[#DAC0A3] hover:-translate-y-1.5 transition-all duration-500 text-center min-w-[240px] shadow-xl"
                >
                  Browse Services
                </Link>
              </div>
            </div>

            {/* SVG Badge Section */}
            <div className="hidden lg:block relative w-[450px] h-[450px] flex-shrink-0">
              {/* Glow */}
              <div className="absolute inset-10 bg-[#DAC0A3]/20 rounded-full blur-[100px] animate-pulse"></div>

              <div className="relative w-full h-full flex items-center justify-center group">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full transition-all duration-700 group-hover:scale-105 group-hover:rotate-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Gradient */}
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F5E6C8" />
                      <stop offset="100%" stopColor="#DAC0A3" />
                    </linearGradient>

                    {/* Glow */}
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Background circle */}
                  <circle cx="100" cy="100" r="75" fill="url(#goldGradient)" />

                  {/* Glass ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="#DAC0A3"
                    strokeWidth="2"
                    opacity="0.5"
                  />

                  {/* JK Logo */}
                  <g
                    stroke="#102C57"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    filter="url(#glow)"
                  >
                    {/* Modern curved J */}
                    <path d="M85 60 V110 Q85 145 60 135" />

                    {/* K vertical */}
                    <line x1="115" y1="60" x2="115" y2="140" />

                    {/* K dynamic arms */}
                    <path d="M115 100 L145 65" />
                    <path d="M115 100 L145 140" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;