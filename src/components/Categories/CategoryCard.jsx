import React from 'react';
import { Link } from 'react-router-dom';

/* ── helpers ── */
const MAX_DESC_CHARS = 120;

const truncate = (text, max) => {
  if (!text) return '';
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
};

/* ── Component ── */
const CategoryCard = ({ category }) => {
  const description =
    truncate(category.description, MAX_DESC_CHARS) ||
    `Professional ${category.name?.toLowerCase() || 'general'} services by top-rated local experts.`;

  const accentColor = category.color || '#102C57';

  return (
    <Link
      to={`/services/${category.slug}`}
      className="group relative bg-white rounded-[2.5rem] border border-[#EADBC8]/30
                 shadow-[0_10px_30px_rgba(16,44,87,0.04)]
                 hover:shadow-[0_30px_60px_rgba(16,44,87,0.15)]
                 hover:-translate-y-2 transition-all duration-500
                 flex flex-col overflow-hidden"
      style={{ minHeight: '440px' }}
    >
      {/* ── Image area ── */}
      <div className="relative w-full flex-shrink-0 overflow-hidden bg-[#FEFAF6]" style={{ height: '220px' }}>
        {/* Photo */}
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `data:image/svg+xml,%3Csvg width='800' height='600' viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='800' height='600' fill='%23102C57'/%3E%3Crect x='300' y='200' width='200' height='200' rx='40' fill='white' opacity='0.05'/%3E%3Ctext x='400' y='310' font-family='Arial, sans-serif' font-size='22' font-weight='900' fill='white' opacity='0.15' text-anchor='middle'%3E${encodeURIComponent(category.name || 'SERVICE')}%3C/text%3E%3C/svg%3E`;
          }}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102C57]/90 via-[#102C57]/20 to-transparent" />

        {/* Rating badge — top left */}
        <div className="absolute top-4 left-4 z-20">
          <div
            className="bg-[#102C57] px-3 py-1.5 rounded-2xl shadow-[0_8px_20px_rgba(16,44,87,0.3)]
                       border border-white/10 flex items-center gap-2
                       transition-all duration-300 group-hover:bg-[#DAC0A3]"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 transition-colors duration-300 ${
                    i < Math.floor(category.avgRating || 4.8)
                      ? 'text-[#DAC0A3] group-hover:text-[#102C57]'
                      : 'text-white/20'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="w-[1px] h-3 bg-white/20 group-hover:bg-[#102C57]/30" />
            <span className="text-white text-[12px] font-black tracking-tight group-hover:text-[#102C57]">
              {(category.avgRating || 4.8).toFixed ? Number(category.avgRating || 4.8).toFixed(1) : '4.8'}
            </span>
          </div>
        </div>

        {/* Category name overlay — bottom of image */}
        <div className="absolute bottom-5 left-6 right-6 z-20">
          <h3 className="text-white text-2xl font-black uppercase tracking-tighter leading-tight mb-1.5 drop-shadow-sm">
            {category.name}
          </h3>
          <div
            className="h-[3px] rounded-full transition-all duration-500"
            style={{
              width: '2.5rem',
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="p-6 flex flex-col flex-1">
        {/* Verified badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#102C57]/40">
            Verified &amp; Top Rated
          </span>
        </div>

        {/* Description — fixed 2-line clamp, readable size */}
        <p
          className="text-[#102C57]/65 text-[13px] font-medium leading-relaxed mb-4 flex-shrink-0"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em', /* always reserves exactly 2 lines */
          }}
          title={category.description || ''}
        >
          {description}
        </p>

        {/* Subcategory pills — max 3, each name capped at 18 chars */}
        {category.subCategories && category.subCategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {category.subCategories.slice(0, 3).map((sub) => (
              <span
                key={sub.id}
                className="text-[10px] font-bold uppercase tracking-widest
                           bg-[#102C57]/5 text-[#102C57]/60 px-3 py-1 rounded-lg
                           border border-[#102C57]/5
                           transition-all duration-300
                           group-hover:bg-[#102C57] group-hover:text-white
                           group-hover:border-transparent
                           max-w-[110px] truncate"
                title={sub.name}
              >
                {truncate(sub.name, 18)}
              </span>
            ))}
            {category.subCategories.length > 3 && (
              <span className="text-[10px] font-bold text-[#102C57]/30 self-center">
                +{category.subCategories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Spacer pushes CTA to bottom */}
        <div className="flex-1" />

        {/* CTA row */}
        <div className="flex justify-end items-center mt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#102C57]/40 mr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            Explore More
          </span>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md
                       group-hover:rotate-12 transition-all duration-500 flex-shrink-0"
            style={{ backgroundColor: accentColor }}
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

export default CategoryCard;
