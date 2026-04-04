import React from 'react';
import { Link } from 'react-router-dom';


const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/services/${category.slug}`}
      className="group relative bg-white rounded-[2.5rem] border border-[#EADBC8]/30 shadow-[0_10px_30px_rgba(16,44,87,0.04)] hover:shadow-[0_30px_60px_rgba(16,44,87,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-visible h-full"
    >
      {/* ── Image area ── */}
      <div className="relative w-full h-64 rounded-t-[2.5rem] overflow-hidden bg-[#FEFAF6]">
        {/* Full-bleed photo */}
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102C57]/90 via-[#102C57]/20 to-transparent" />
        {/* High-Clarity Premium Rating Badge — Top Left */}
        <div className="absolute top-5 left-5 z-20 flex items-center group/rate">
          <div className="bg-[#102C57] px-4 py-2 rounded-2xl shadow-[0_8px_20px_rgba(16,44,87,0.3)] border border-white/10 flex items-center gap-2.5 transition-all duration-500 group-hover/rate:scale-110 group-hover/rate:bg-[#DAC0A3] group-hover:bg-[#102C57]">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-3 h-3 transition-colors duration-500 ${i < Math.floor(category.avgRating || 4.8) ? 'text-[#DAC0A3] group-hover/rate:text-[#102C57]' : 'text-white/20'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="w-[1px] h-3 bg-white/20 group-hover/rate:bg-[#102C57]/20"></div>
            <span className="text-white text-[13px] font-black tracking-tight group-hover/rate:text-[#102C57]">
              {category.avgRating || '4.8'}
            </span>
          </div>
        </div>
        {/* Category Name Overlay (only visible on hover or mobile) */}
        <div className="absolute bottom-6 left-8 right-8 z-20">
          <h3
            className="text-white text-3xl font-black uppercase tracking-tighter leading-none mb-1 transition-colors group-hover:drop-shadow-sm"
            style={{ '--hover-color': category.color || '#DAC0A3' }}
          >
            {category.name}
          </h3>
          <div
            className="w-10 h-[3px] rounded-full group-hover:w-full transition-all duration-500"
            style={{ backgroundColor: category.color || '#DAC0A3' }}
          />
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="p-8 pt-6 flex flex-col flex-1">
        <p className="text-[#102C57]/60 text-[10px] font-black uppercase tracking-[0.15em] mb-4 leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {category.description || `Professional ${category.name?.toLowerCase() || 'general'} services by top-rated local experts.`}
        </p>

        {/* Subcategories list */}
        {category.subCategories && category.subCategories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {category.subCategories.slice(0, 3).map(sub => (
              <span
                key={sub.id}
                className="text-[8px] font-black uppercase tracking-widest bg-[#102C57]/5 text-[#102C57]/60 px-3 py-1.5 rounded-lg border border-[#102C57]/5 transition-all duration-300 group-hover:text-white"
                style={{ '--hover-bg': category.color || '#102C57' }}
              >
                {sub.name}
              </span>
            ))}
            {category.subCategories.length > 3 && (
              <span className="text-[8px] font-black uppercase tracking-widest text-[#DAC0A3]/60 py-1.5">
                +{category.subCategories.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-[#EADBC8]/30 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DAC0A3]/60">Status</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#102C57] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Instant Booking Available
            </span>
          </div>

          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all duration-500"
            style={{ backgroundColor: category.color || '#102C57' }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

/* Additional Inline Styles for hover interactions */
const customStyles = `
  .group:hover [style*="--hover-bg"] {
    background-color: var(--hover-bg) !important;
    border-color: var(--hover-bg) !important;
  }
  .group:hover h3[style*="--hover-color"] {
    color: var(--hover-color) !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = customStyles;
  document.head.appendChild(styleTag);
}

export default CategoryCard;
