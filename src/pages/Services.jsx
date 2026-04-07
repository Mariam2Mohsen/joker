import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import SubCategoryPill from '../components/Categories/SubCategoryPill';
import { ServiceSkeleton } from '../components/UI/Skeleton';
import ServiceCard from '../components/Services/ServiceCard';
import { useCategories, useCategoryBySlug } from '../hooks/useCategories';
import { useServices } from '../hooks/useServices';
import ZeroState from '../components/UI/ZeroState';

/* ── Reusable styled select ── */
const FilterSelect = ({ label, name, value, onChange, disabled, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DAC0A3] ml-1">{label}</label>
    <div className="relative group">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-white border-2 border-[#EADBC8]/50 rounded-2xl px-5 py-3.5 text-sm font-black text-[#102C57] outline-none focus:border-[#102C57] hover:border-[#DAC0A3] transition-all cursor-pointer appearance-none shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {children}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#DAC0A3] group-hover:text-[#102C57] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  </div>
);

/* ── Sort bar button ── */
const SortBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 border-2 ${active
      ? 'bg-[#102C57] text-white border-[#102C57] shadow-lg shadow-[#102C57]/20'
      : 'bg-white text-[#102C57]/50 border-[#EADBC8]/50 hover:border-[#DAC0A3] hover:text-[#102C57]'
      }`}
  >
    {children}
    {active && (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 7" />
      </svg>
    )}
  </button>
);

const Services = () => {
  const { slug } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState(''); // 'rating' | 'price_asc' | 'price_desc' | 'availability'
  const [filters, setFilters] = useState({
    subCategory: 'all',
    priceUnit: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    availability: '',
  });

  // ── API data ──
  const { categories: allCategories, isLoading: catsLoading } = useCategories();
  const { category, isLoading: catLoading } = useCategoryBySlug(slug);
  const { services: apiServices, isLoading: servicesLoading } = useServices();
  const isLoading = catsLoading || catLoading || servicesLoading;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () =>
    setFilters({ subCategory: 'all', priceUnit: '', minPrice: '', maxPrice: '', minRating: '', availability: '' });

  const priceUnits = useMemo(() => [...new Set((apiServices || []).map(s => s.unit))], [apiServices]);

  const mappedServices = useMemo(() => {
    return apiServices || [];
  }, [apiServices]);

  const filteredServices = useMemo(() => {
    let result = mappedServices.filter(service => {
      // Category match
      const isCatMatch = !slug || (
        String(service.categoryId) === String(category?.id) ||
        String(service.categoryId).toLowerCase() === (category?.name || '').toLowerCase()
      );
      if (!isCatMatch) return false;

      // Sub-category match
      const subCatObj = category?.subCategories?.find(s => String(s.id) === String(filters.subCategory));
      const subCatName = (subCatObj?.name || '').toLowerCase().replace(/[\s-]/g, '');
      const serviceSubId = String(service.subCategoryId).toLowerCase().replace(/[\s-]/g, '');
      const isSubMatch = filters.subCategory === 'all' || (
        String(service.subCategoryId) === String(filters.subCategory) ||
        (subCatName && serviceSubId.includes(subCatName)) ||
        (subCatName && subCatName.includes(serviceSubId))
      );
      if (!isSubMatch) return false;

      // Price unit
      if (filters.priceUnit && service.unit !== filters.priceUnit) return false;
      // Min / Max price
      if (filters.minPrice && service.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && service.price > Number(filters.maxPrice)) return false;
      // Min rating
      if (filters.minRating && service.rating < Number(filters.minRating)) return false;
      // Max distance
      // if (filters.maxDistance && (service.distance ?? 999) > Number(filters.maxDistance)) return false;
      // Availability
      if (filters.availability && service.availability !== filters.availability) return false;

      return true;
    });

    // Sorting
    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'availability') {
      const order = { available: 0, not_available: 1, booked: 2 };
      result = [...result].sort((a, b) => (order[a.availability] ?? 3) - (order[b.availability] ?? 3));
    }

    return result;
  }, [filters, sortBy, slug, category, mappedServices]);

  const hasActiveFilters =
    filters.subCategory !== 'all' || filters.priceUnit || filters.minPrice ||
    filters.maxPrice || filters.minRating || filters.availability;

  const activeCount = [
    filters.subCategory !== 'all',
    filters.priceUnit,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.availability,
  ].filter(Boolean).length;

  return (
    <MainLayout>
      <div className="min-h-screen">

        {/* ════ DARK HERO ════ */}
        <div className="relative overflow-hidden pt-12 md:pt-28 pb-12 md:pb-20 bg-[#102C57]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DAC0A3]/8 rounded-full blur-[120px] -mr-56 -mt-56 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/3 rounded-full blur-[80px] -ml-40 -mb-20 pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #DAC0A3 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />

          <div className="container mx-auto px-4 md:px-10 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 mb-10 animate-in fade-in slide-in-from-top-2 duration-500">
              <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#DAC0A3] transition-colors">Home</Link>
              <span className="text-white/20">/</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Services</span>
              {category && (
                <>
                  <span className="text-white/20">/</span>
                  <Link
                    to={`/services/${category.slug}`}
                    className="text-[10px] font-black uppercase tracking-widest text-[#DAC0A3]/60 hover:text-[#DAC0A3] transition-colors"
                  >
                    {category.name}
                  </Link>
                </>
              )}
              {filters.subCategory !== 'all' && (
                <>
                  <span className="text-white/20">/</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#DAC0A3]">
                    {category?.subCategories?.find(s => String(s.id) === String(filters.subCategory))?.name || 'Subcategory'}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 md:gap-10 lg:gap-16">

              {/* Category image */}
              <div className="flex-shrink-0 animate-in fade-in zoom-in duration-700">
                {isLoading ? (
                  <div className="w-48 h-52 rounded-[2.5rem] bg-white/8 animate-pulse" />
                ) : category ? (
                  <div className="relative w-48 h-52 rounded-[2.5rem] overflow-visible shadow-2xl shadow-black/40 group">
                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/15">
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#102C57]/80 via-[#102C57]/20 to-transparent rounded-[2.5rem]" />
                    </div>
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 z-20">
                      <svg className="w-3 h-3 text-[#102C57]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[#102C57] text-[10px] font-black uppercase tracking-wider">From {category.rate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-48 h-52 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/40 border border-white/15 bg-white/5">
                    <div className="grid grid-cols-2 w-full h-full">
                      {(allCategories || []).slice(0, 4).map(cat => (
                        <div key={cat.id} className="relative overflow-hidden">
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }} />
                          <div className="absolute inset-0 bg-[#102C57]/50" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102C57]/70 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-2.5 border border-white/20">
                        <span className="text-white text-[10px] font-black uppercase tracking-widest">All Services</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & description */}
              <div className="flex-1 animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
                <div className="flex items-center gap-4 mb-5">
                  <span className="h-[3px] w-10 bg-[#DAC0A3]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.45em] text-[#DAC0A3]">
                    {category ? category.name : 'Premium Discovery'}
                  </span>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-12 w-72 bg-white/8 animate-pulse rounded-full" />
                    <div className="h-4 w-96 bg-white/8 animate-pulse rounded-full" />
                  </div>
                ) : (
                  <>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4 md:mb-5">
                      {category ? (
                        <>Explore{' '}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DAC0A3] via-white to-[#DAC0A3]">
                            {filters.subCategory !== 'all'
                              ? category.subCategories?.find(s => String(s.id) === String(filters.subCategory))?.name || category.name
                              : category.name
                            }
                          </span>
                        </>
                      ) : (
                        <>All{' '}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DAC0A3] via-white to-[#DAC0A3]">Services</span>
                        </>
                      )}
                    </h1>
                    <p className="text-white/55 font-medium text-base max-w-lg leading-relaxed">
                      {(() => {
                        const rawDesc = filters.subCategory !== 'all'
                          ? category?.subCategories?.find(s => String(s.id) === String(filters.subCategory))?.description || category?.description
                          : category?.description || 'Explore our wide range of professional services, delivered by verified experts directly to your doorstep.';
                        return rawDesc.length > 60 ? rawDesc.slice(0, 60).trimEnd() + '...' : rawDesc;
                      })()}
                    </p>
                  </>
                )}

                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-white leading-none">{filteredServices.length}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/35 mt-1">Services</span>
                  </div>
                  <div className="w-px h-10 bg-white/15" />
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-white leading-none">{allCategories?.length || 0}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/35 mt-1">Categories</span>
                  </div>
                  <div className="w-px h-10 bg-white/15" />
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-[#DAC0A3] leading-none">4.8★</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/35 mt-1">Avg Rating</span>
                  </div>
                </div>
              </div>

              {/* Filter toggle button */}
              <div className="flex-shrink-0 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-3 px-7 py-4 rounded-2xl border-2 font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-lg ${isFilterOpen || hasActiveFilters
                    ? 'bg-[#DAC0A3] text-[#102C57] border-[#DAC0A3] shadow-[#DAC0A3]/30'
                    : 'bg-white/8 text-white border-white/15 hover:bg-white/15 hover:border-white/30 backdrop-blur-sm'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  {isFilterOpen ? 'Hide Filters' : 'Refine Search'}
                  {activeCount > 0 && (
                    <span className="bg-[#102C57] text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black">
                      {activeCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ════ FILTER PANEL ════ */}
        <div className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${isFilterOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-[#FEFAF6] border-b-2 border-[#EADBC8]/40 shadow-xl">
            <div className="container mx-auto px-4 md:px-10 py-10">

              {/* Row 1 – 5 filter columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

                {/* 1. Sub-Category */}
                <FilterSelect label="Sub-Category" name="subCategory" value={filters.subCategory} onChange={handleFilterChange} disabled={!category}>
                  <option value="all">All Sub-Categories</option>
                  {category?.subCategories?.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </FilterSelect>

                {/* 2. Price */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DAC0A3] ml-1">Price (EGP)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#DAC0A3] font-black text-xs pointer-events-none">$</span>
                      <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        placeholder="Min"
                        className="w-full bg-white border-2 border-[#EADBC8]/50 rounded-2xl pl-7 pr-3 py-3.5 text-sm font-black text-[#102C57] outline-none focus:border-[#102C57] hover:border-[#DAC0A3] transition-all shadow-sm placeholder:text-[#DAC0A3]/40"
                      />
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#DAC0A3] font-black text-xs pointer-events-none">$</span>
                      <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="Max"
                        className="w-full bg-white border-2 border-[#EADBC8]/50 rounded-2xl pl-7 pr-3 py-3.5 text-sm font-black text-[#102C57] outline-none focus:border-[#102C57] hover:border-[#DAC0A3] transition-all shadow-sm placeholder:text-[#DAC0A3]/40"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Rating */}
                <FilterSelect label="Min Rating ★" name="minRating" value={filters.minRating} onChange={handleFilterChange}>
                  <option value="">Any Rating</option>
                  <option value="4.9">4.9 ★ & above</option>
                  <option value="4.8">4.8 ★ & above</option>
                  <option value="4.7">4.7 ★ & above</option>
                  <option value="4.5">4.5 ★ & above</option>
                  <option value="4.0">4.0 ★ & above</option>
                </FilterSelect>

                {/* 4. Availability */}
                <FilterSelect label="Availability" name="availability" value={filters.availability} onChange={handleFilterChange}>
                  <option value="">All Status</option>
                  <option value="available">✅ Available</option>
                  <option value="not_available">❌ Not Available</option>
                  <option value="booked">🔒 Booked</option>
                </FilterSelect>
              </div>

              {/* Filter footer */}
              <div className="mt-8 pt-6 border-t-2 border-[#EADBC8]/30 flex justify-between items-center">
                <span className="text-[11px] font-medium text-[#102C57]/40">
                  Showing <span className="text-[#102C57] font-black">{filteredServices.length}</span> result{filteredServices.length !== 1 ? 's' : ''}
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-[#DAC0A3] hover:text-red-500 transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ════ LIGHT CONTENT AREA ════ */}
        <div className="bg-[#FEFAF6] min-h-screen">
          <div className="container mx-auto px-4 md:px-10 py-14">
            <div className="flex flex-col lg:flex-row gap-12">

              {/* ── Sidebar ── */}
              <aside className="w-full lg:w-64 flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="bg-white rounded-[2rem] p-6 border border-[#EADBC8]/40 shadow-[0_8px_30px_rgba(16,44,87,0.04)] sticky top-32">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#102C57] mb-6 border-b-2 border-[#EADBC8]/30 pb-4">
                    {category ? 'Other Categories' : 'Browse By Category'}
                  </h3>
                  <div className="space-y-1">
                    {(allCategories || []).filter(c => !category || c.slug !== slug).map(cat => (
                      <Link
                        key={cat.id}
                        to={`/services/${cat.slug}`}
                        className="flex items-center gap-4 group p-3 px-4 rounded-xl hover:bg-[#FEFAF6] transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-[#EADBC8]/40 group-hover:border-[#DAC0A3]/50 transition-colors">
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#102C57]/50 group-hover:text-[#102C57] transition-colors">{cat.name}</span>
                        <svg className="w-3 h-3 text-[#102C57]/20 group-hover:text-[#DAC0A3] ml-auto transition-all group-hover:translate-x-1 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                    {!category && !catsLoading && (
                      <div className="p-4 bg-[#FEFAF6] rounded-xl border border-dashed border-[#EADBC8] mt-4">
                        <p className="text-[9px] font-bold text-[#102C57]/30 uppercase text-center leading-relaxed">
                          Select a category to see sub-categories
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sidebar CTA */}
                  <div className="mt-8 p-5 bg-[#102C57] rounded-2xl text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-2">Need Help?</p>
                    <p className="text-xs font-bold text-white/80 leading-relaxed mb-4">Our team can find the right expert for you</p>
                    <Link to="/contact" className="block text-[10px] font-black uppercase tracking-widest text-[#102C57] bg-[#DAC0A3] py-2.5 rounded-xl hover:bg-white transition-colors">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </aside>

              {/* ── Main Content ── */}
              <div className="flex-1">

                {/* Sub-category pills */}
                {category && (
                  <div className="flex flex-wrap gap-3 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
                    <SubCategoryPill
                      name="All Experts"
                      active={filters.subCategory === 'all'}
                      onClick={() => setFilters(prev => ({ ...prev, subCategory: 'all' }))}
                    />
                    {!isLoading && category.subCategories?.map(sub => (
                      <SubCategoryPill
                        key={sub.id}
                        name={sub.name}
                        description={sub.description}
                        active={filters.subCategory === sub.id}
                        onClick={() => setFilters(prev => ({ ...prev, subCategory: sub.id }))}
                      />
                    ))}
                  </div>
                )}

                {/* ── Sort Bar ── */}
                <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b-2 border-[#EADBC8]/30 animate-in fade-in duration-500">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#102C57]/35 mr-1">Sort by:</span>

                  <SortBtn active={sortBy === 'rating'} onClick={() => setSortBy(sortBy === 'rating' ? '' : 'rating')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Rating
                  </SortBtn>

                  <SortBtn active={sortBy === 'price_asc'} onClick={() => setSortBy(sortBy === 'price_asc' ? '' : 'price_asc')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    Price ↑
                  </SortBtn>

                  <SortBtn active={sortBy === 'price_desc'} onClick={() => setSortBy(sortBy === 'price_desc' ? '' : 'price_desc')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    Price ↓
                  </SortBtn>

                  <SortBtn active={sortBy === 'availability'} onClick={() => setSortBy(sortBy === 'availability' ? '' : 'availability')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    Availability
                  </SortBtn>

                  <span className="ml-auto text-[11px] font-bold text-[#102C57]/40">
                    {filteredServices.length} result{filteredServices.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {isLoading ? (
                    [1, 2, 3, 4, 5, 6].map(i => <ServiceSkeleton key={i} />)
                  ) : filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => {
                      const cat = allCategories?.find(c =>
                        String(c.id) === String(service.categoryId) ||
                        String(c.slug) === String(service.categoryId)
                      );
                      const serviceSubId = String(service.subCategoryId).toLowerCase().replace(/[\s-]/g, '');
                      const sub = cat?.subCategories?.find(s => {
                        const sIdMatch = String(s.id) === String(service.subCategoryId);
                        const sName = (s.name || '').toLowerCase().replace(/[\s-]/g, '');
                        return sIdMatch || (sName && serviceSubId.includes(sName)) || (sName && sName.includes(serviceSubId));
                      });
                      return (
                        <div
                          key={service.id}
                          className="animate-in fade-in slide-in-from-bottom-6 duration-700"
                          style={{ animationDelay: `${index * 80}ms` }}
                        >
                          <ServiceCard
                            service={service}
                            categoryName={cat?.name || 'Service'}
                            subCategoryName={sub?.name || ''}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full">
                      <ZeroState 
                        title="No Services Found" 
                        message={hasActiveFilters 
                          ? "We couldn't find any services matching your current filters. Try adjusting your preferences or clearing all filters." 
                          : "We're currently expanding our network of experts. Check back soon for new services!"}
                        actionLabel={hasActiveFilters ? "Clear All Filters" : "Browse Categories"}
                        onAction={hasActiveFilters ? clearFilters : () => window.location.href='/services'}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;
