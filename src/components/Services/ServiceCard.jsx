import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import Button from '../UI/Button';

/* ── Availability config ── */
const AVAIL = {
  available: { dot: 'bg-emerald-400', label: 'Available', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  busy: { dot: 'bg-amber-400', label: 'Not Available', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  not_available: { dot: 'bg-amber-400', label: 'Not Available', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  booked: { dot: 'bg-red-400', label: 'Booked', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const ServiceCard = ({
  service,
  categoryName = '',
  subCategoryName = '',
  className = '',
}) => {
  const avail = AVAIL[service.availability] || AVAIL.available;

  return (
    <Card
      padding="p-0"
      className={`flex flex-col h-full group overflow-hidden border border-[#EADBC8]/40 hover:border-[#102C57]/30 transition-all duration-500 shadow-lg hover:shadow-2xl rounded-3xl bg-white ${className}`}
    >

      <div className="relative aspect-video overflow-hidden rounded-t-3xl flex-shrink-0 bg-[#FEFAF6]">
        <img
          src={service.image}
          alt={service.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `data:image/svg+xml,%3Csvg width='800' height='600' viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='800' height='600' fill='%23FEFAF6'/%3E%3Cpath d='M0 0l800 600M800 0L0 600' stroke='%23EADBC8' stroke-width='2' opacity='0.3'/%3E%3Crect x='300' y='200' width='200' height='200' rx='40' fill='%23102C57' opacity='0.05'/%3E%3Ctext x='400' y='310' font-family='Arial, sans-serif' font-size='24' font-weight='900' fill='%23102C57' opacity='0.2' text-anchor='middle' text-transform='uppercase' letter-spacing='4'%3ENO IMAGE%3C/text%3E%3C/svg%3E`;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f3c]/80 via-[#0d1f3c]/20 to-transparent" />

        {/* Service name — bottom-left overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <h3 className="text-white text-xl font-black uppercase tracking-tight leading-tight drop-shadow-lg group-hover:text-[#DAC0A3] transition-colors duration-300 line-clamp-2">
            {service.name}
          </h3>
        </div>

        {/* Rating chip — top-right */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#102C57]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl shadow-lg border border-white/15">
          <span className="text-yellow-400 text-sm leading-none">★</span>
          <span className="text-sm font-black leading-none">{service.rating}</span>
        </div>
      </div>

      {/* ══════════════════════════════
          BODY
      ══════════════════════════════ */}
      <div className="flex flex-col flex-1 p-5 gap-4">

        {/* ── Row 1: Category breadcrumb & Availability ── */}
        <div className="flex items-center justify-between gap-2">
          <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${avail.bg} ${avail.text} ${avail.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${avail.dot} ${service.availability === 'available' ? 'animate-pulse' : ''}`} />
            {avail.label}
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 min-w-0 justify-end flex-1">
            {categoryName && (
              <span className="text-[10px] font-black uppercase tracking-widest text-[#102C57]/40 truncate">
                {categoryName}
              </span>
            )}
            {subCategoryName && (
              <>
                <span className="text-[#DAC0A3] text-[10px]">›</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#DAC0A3] truncate">
                  {subCategoryName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Row 2: Provider ── */}
        <div className="flex items-center gap-3 bg-[#FEFAF6] rounded-2xl px-4 py-3 border border-[#EADBC8]/40">
          {/* Avatar placeholder */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#102C57] to-[#1a3f7a] flex items-center justify-center flex-shrink-0 shadow-md">
            {service.providerAvatar ? (
              <img src={service.providerAvatar} alt={service.provider} className="w-full h-full rounded-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = `<span class="text-white text-[11px] font-black uppercase leading-none">${(service.provider || '?')[0]}</span>`; }} />
            ) : (
              <span className="text-white text-[11px] font-black uppercase leading-none">
                {(service.provider || '?')[0]}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-widest text-[#102C57]/35 leading-none mb-0.5">Expert Provider</p>
            <p className="text-xs font-black text-[#102C57] truncate">{service.provider}</p>
          </div>
          {/* Verified tick */}
          <div className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-[#102C57] flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* ── Row 3: Stats (Price details) ── */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#102C57] text-white rounded-2xl shadow-inner my-1">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Pricing Type</span>
            <span className="text-sm font-bold leading-none capitalize text-[#DAC0A3]">
              {service.pricingTypes && service.pricingTypes[0]
                ? service.pricingTypes[0].type
                : service.unit.includes('hr') ? 'Hourly' : 'Fixed'}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Estimated Cost</span>
            <div className="flex items-end gap-1 justify-end">
              <span className="text-xl font-black leading-none">{service.price}</span>
              <span className="text-[9px] text-white/70 font-bold mb-0.5">{service.unit}</span>
            </div>
          </div>
        </div>

        {/* ── Row 4: Description ── */}
        <p className="text-[#102C57]/55 text-[11px] font-medium leading-relaxed line-clamp-2 flex-1">
          {service.description || `Premium ${service.name.toLowerCase()} service for your home, delivered by verified experts.`}
        </p>

        {/* ── Row 5: Action buttons ── */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#EADBC8]/30 mt-auto">
          <Link
            to={`/service/${service.id}`}
            className="flex-1 text-center text-[10px] font-black uppercase tracking-widest text-[#102C57] border-2 border-[#EADBC8]/60 py-3 rounded-2xl hover:border-[#102C57] hover:bg-[#102C57] hover:text-white transition-all duration-300"
          >
            Details
          </Link>
          <Link to="" className="flex-1">
            <button className="w-full bg-[#102C57] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#DAC0A3] hover:text-[#102C57] transition-all duration-300 shadow-md hover:shadow-xl">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
