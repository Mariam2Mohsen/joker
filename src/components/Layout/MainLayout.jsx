import React, { useState, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../UI/Logo';
import { useAuth } from '../../hooks/useAuth';
import { useCategories } from '../../hooks/useCategories';
import LogoutModal from '../UI/LogoutModal';

const navLinkClass = ({ isActive }) =>
  `relative px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-xl flex items-center group overflow-hidden ${
    isActive 
      ? 'text-[#FEFAF6] bg-[#102C57] shadow-lg shadow-[#102C57]/20 scale-105' 
      : 'text-[#102C57]/50 hover:text-[#102C57] hover:bg-[#102C57]/5'
  }`;

const MainLayout = ({ children }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { categories: allCategories } = useCategories();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2 || !allCategories) return [];
    const query = searchQuery.toLowerCase();
    return allCategories.flatMap(cat => [
      ...(cat.name.toLowerCase().includes(query) ? [{ ...cat, type: 'category' }] : []),
      ...cat.subCategories.filter(sub => sub.name.toLowerCase().includes(query)).map(sub => ({ ...sub, type: 'sub', parentSlug: cat.slug, parentImage: cat.image }))
    ]).slice(0, 5);
  }, [searchQuery, allCategories]);

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      const firstResult = searchResults[0];
      const path = firstResult.type === 'category' ? `/services/${firstResult.slug}` : `/services/${firstResult.parentSlug}`;
      navigate(path);
      setSearchQuery('');
    }
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email ? user.email.slice(0, 2).toUpperCase() : 'US';
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#FEFAF6]">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-xl' : 'bg-[#FEFAF6] py-2'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-10 py-3 gap-4 sm:gap-0">
          <Link to="/" className="flex items-center hover:scale-105 transition-transform">
            <Logo className="h-10" />
          </Link>
          
          <div className="flex items-center gap-6">
            {!isLoggedIn ? (
              <div className="flex gap-3">
                <Link
                  to="/signup-customer"
                  className="border-2 border-[#102C57] rounded-xl px-5 py-2 text-xs font-bold uppercase text-[#102C57] hover:bg-[#102C57] hover:text-[#FEFAF6] transition-all dropdown-shadow"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-[#102C57] text-[#FEFAF6] rounded-xl px-6 py-2 border-2 border-[#102C57] text-xs font-bold uppercase hover:bg-opacity-90 hover:shadow-lg transition-all"
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <button className="relative p-2 text-[#102C57]/60 hover:text-[#102C57] transition-colors group">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-[#A855F7] border-2 border-[#FEFAF6] rounded-full shadow-sm group-hover:scale-110 transition-transform"></span>
                </button>

               
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 group focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#102C57] text-[#FEFAF6] flex items-center justify-center font-black text-xs border-2 border-[#102C57]/10 group-hover:border-[#102C57] transition-all relative">
                      {getUserInitials()}
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#A855F7] border-2 border-[#FEFAF6] rounded-full"></span>
                    </div>
                  </button>

                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-[#EADBC8]/30 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="px-4 py-3 border-b border-[#EADBC8]/20 flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#102C57]">
                            {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Welcome Back'}
                          </span>
                          <span className="text-[8px] font-bold text-[#102C57]/40 truncate">{user?.email}</span>
                        </div>
                        <Link 
                          to="/dash" 
                          className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#102C57]/60 hover:text-[#102C57] hover:bg-[#FEFAF6] transition-all"
                          onClick={() => setShowUserMenu(false)}
                        >
                          👤 Profile
                        </Link>
                        <button 
                          onClick={() => {
                            setShowLogoutModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#102C57]/60 hover:text-red-500 hover:bg-red-50 transition-all text-left"
                        >
                          🚪 Log Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Modern Logout Modal */}
        <LogoutModal 
          isOpen={showLogoutModal} 
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            logout();
            setShowLogoutModal(false);
          }}
        />
        
        <nav className={`flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-3 border-t border-[#EADBC8]/30 gap-4 md:gap-0 transition-colors ${
          isScrolled ? 'bg-white/10' : 'bg-white/50'
        }`}>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/categories" className={navLinkClass}>Categories</NavLink>
            <NavLink to="/services" className={navLinkClass}>Services</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact Us</NavLink>
          </div>
          
          <div className="relative w-full md:w-auto mt-2 md:mt-0">
            <div className={`relative flex items-center transition-all duration-300 ${searchFocused ? 'md:w-80' : 'md:w-64'}`}>
              <input
                type="text"
                placeholder="Search ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
               onKeyUp={handleSearchKeyPress}
                className="border border-[#EADBC8] rounded-xl h-10 px-4 pl-10 pr-10 text-xs w-full bg-white focus:outline-none focus:border-[#102C57] focus:ring-2 focus:ring-[#102C57]/10 text-[#102C57] transition-all shadow-sm"
              />
              <span className="absolute left-3.5 text-[#102C57]/40 text-sm" aria-hidden>🔍</span>
              {searchFocused && (searchQuery.length > 1) && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#EADBC8]/30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-3 bg-[#FEFAF6] border-b border-[#EADBC8]/20">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#102C57]/40">Search Suggestions</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {searchResults.map((item, i) => (
                      <Link
                        key={i}
                        to={item.type === 'category' ? `/services/${item.slug}` : `/services/${item.parentSlug}`}
                        onClick={() => setSearchQuery('')}
                        className="flex items-center gap-4 p-4 hover:bg-[#FEFAF6] transition-colors border-b border-[#EADBC8]/10 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#EADBC8]/20 flex-shrink-0 border border-[#EADBC8]/30">
                          <img src={item.type === 'category' ? item.image : item.parentImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#102C57] uppercase tracking-wide">{item.name}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-[#102C57]/30">
                            {item.type === 'category' ? 'Category' : `In ${item.parentSlug}`}
                          </span>
                        </div>
                      </Link>
                    ))}
                    {searchResults.length === 0 && (
                      <div className="p-6 text-center">
                        <span className="text-[10px] font-bold text-[#102C57]/40 uppercase">No matches found</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex flex-col pt-44 sm:pt-40 md:pt-32">{children}</main>

      <footer className="bg-[#102C57] text-[#FEFAF6] pt-16 pb-6 mt-0">
        <div className="container mx-auto px-4 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="inline-block mb-4 hover:scale-105 transition-transform">
              <Logo variant="light" className="h-12" />
            </Link>
            <p className="text-xs text-[#EADBC8]/70 leading-relaxed max-w-[200px]">2026. All Rights Reserved by Prima Software LLC. Building better connections daily.</p>
          </div>
          <div>
            <h4 className="font-extrabold text-sm mb-6 uppercase text-[#DAC0A3] tracking-wider">Our Company</h4>
            <ul className="text-xs space-y-3 text-[#FEFAF6]/80 font-medium">
              <li><a href="#about" className="hover:text-[#DAC0A3] transition-colors">About Us</a></li>
              <li><a href="#blog" className="hover:text-[#DAC0A3] transition-colors">Our Blog</a></li>
              <li><a href="#terms" className="hover:text-[#DAC0A3] transition-colors">Terms &amp; Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-sm mb-6 uppercase text-[#DAC0A3] tracking-wider">Contact Us</h4>
            <ul className="text-xs space-y-3 text-[#FEFAF6]/80 font-medium">
              <li className="flex items-center gap-2"><span>📞</span> 01257964836</li>
              <li className="flex items-center gap-2"><span>✉️</span> Taw@gmail.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-sm mb-6 uppercase text-[#DAC0A3] tracking-wider">Our Services</h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-[#FEFAF6]/80 font-medium">
              <Link to="/services/cleaning" className="hover:text-[#DAC0A3] transition-colors">Cleaning</Link>
              <Link to="/services/plumbing" className="hover:text-[#DAC0A3] transition-colors">Plumbing</Link>
              <Link to="/services/electrical" className="hover:text-[#DAC0A3] transition-colors">Electrical</Link>
              <Link to="/services/gardening" className="hover:text-[#DAC0A3] transition-colors">Gardening</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#EADBC8]/50 border-t border-[#EADBC8]/20 font-medium font-sans">
          <p>2026. All Rights Reserved by Prima Software LLC.</p>
          <div className="flex gap-5 text-base text-[#FEFAF6]" aria-label="Social media links">
            <a href="#facebook" aria-label="Facebook" className="hover:text-[#DAC0A3] transition-transform hover:-translate-y-1">f</a>
            <a href="#instagram" aria-label="Instagram" className="hover:text-[#DAC0A3] transition-transform hover:-translate-y-1">📷</a>
            <a href="#twitter" aria-label="Twitter" className="hover:text-[#DAC0A3] transition-transform hover:-translate-y-1">𝕏</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;