import React, { useState, useMemo, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import io from "socket.io-client";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { categories: allCategories } = useCategories();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const SERVER_URL = "https://joker-hm0k.onrender.com";
  const currentUserId = user?.userId || user?.user_id || user?.id;

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      const response = await fetch(`${SERVER_URL}/api/admin/notifications`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (data.success) {
        setUnreadCount(0); 
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      }
    } catch (err) {
      console.error("❌ Error marking notifications as read:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn && currentUserId) {
      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem('authToken'); 
          if (!token) return;
          const response = await fetch(`${SERVER_URL}/api/admin/notifications`, {
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          const data = await response.json();
          if (data.success) {
            setNotifications(data.notifications || []);
            setUnreadCount((data.notifications || []).filter(n => n.is_read === 0).length);
          }
        } catch (err) {}
      };

      fetchNotifications();

      const socket = io(SERVER_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      const channelName = `notification_user_${currentUserId}`;
      socket.on(channelName, (newNotif) => {
        setNotifications(prev => [
          {
            ...newNotif,
            created_at: newNotif.created_at || new Date().toISOString(),
            is_read: 0
          }, 
          ...prev
        ]);
        setUnreadCount(prev => prev + 1);
      });

      return () => socket.disconnect();
    }
  }, [isLoggedIn, currentUserId]);

  const handleToggleNotif = () => {
    const nextState = !showNotifMenu;
    setShowNotifMenu(nextState);
    setShowUserMenu(false);
    if (nextState && unreadCount > 0) {
      markAllAsRead();
    }
  };

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
        isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-xl' : 'bg-[#FEFAF6] py-1'
      }`}>
        {/* ── Top bar: logo + auth buttons ── */}
        <div className="flex justify-between items-center px-4 md:px-10 py-3 gap-4">
          <Link to="/" className="flex items-center hover:scale-105 transition-transform flex-shrink-0">
            <Logo className="h-9 md:h-10" />
          </Link>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-6">
            {!isLoggedIn ? (
              <div className="flex gap-3">
                <Link
                  to="/signup-customer"
                  className="border-2 border-[#102C57] rounded-xl px-5 py-2 text-xs font-bold uppercase text-[#102C57] hover:bg-[#102C57] hover:text-[#FEFAF6] transition-all"
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
                {/* Notifications Bell */}
                <div className="relative">
                  <button 
                    type="button"
                    className="relative p-2.5 bg-white rounded-full text-[#102C57] hover:bg-[#102C57] hover:text-white transition-all shadow-sm border border-[#EADBC8]/50"
                    onClick={handleToggleNotif}
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 text-[8px] font-black bg-[#A855F7] text-white w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNotifMenu(false)}></div>
                      <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-[#EADBC8]/30 py-4 z-20 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="px-5 pb-3 border-b border-[#EADBC8]/20 flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#102C57]">Notifications</span>
                          {unreadCount > 0 && <span className="text-[8px] font-bold text-[#A855F7] bg-[#A855F7]/10 px-2 py-0.5 rounded-full">New</span>}
                        </div>
                        
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                          {notifications.length > 0 ? (
                            notifications.map((notif, idx) => (
                              <div key={idx} className={`px-5 py-4 hover:bg-[#FEFAF6] transition-colors border-b border-[#FEFAF6] last:border-0 ${notif.is_read === 0 ? 'bg-[#102C57]/5' : ''}`}>
                                <p className="text-[11px] text-[#102C57]/80 leading-relaxed font-medium">
                                  {notif.message}
                                </p>
                                <span className="text-[8px] text-[#DAC0A3] font-bold uppercase mt-1 block">
                                  {notif.type || 'System'} • {new Date(notif.created_at).toLocaleString()}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="py-10 text-center">
                              <p className="text-[10px] font-black uppercase text-[#102C57]/30">No notifications yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifMenu(false); }}
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
                      <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-[#EADBC8]/30 py-2 z-20">
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

          {/* Mobile: hamburger + auth icons */}
          <div className="flex md:hidden items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full bg-[#102C57] text-[#FEFAF6] flex items-center justify-center font-black text-xs relative"
              >
                {getUserInitials()}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-[#EADBC8]/30 py-2 z-20">
                      <Link to="/dash" className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#102C57]/60 hover:text-[#102C57] hover:bg-[#FEFAF6] transition-all" onClick={() => setShowUserMenu(false)}>👤 Profile</Link>
                      <button onClick={() => { setShowLogoutModal(true); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#102C57]/60 hover:text-red-500 hover:bg-red-50 transition-all text-left">🚪 Log Out</button>
                    </div>
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-[#102C57]/5 hover:bg-[#102C57]/10 transition-colors"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-[#102C57] transition-all duration-300 ${mobileNavOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-[#102C57] transition-all duration-300 ${mobileNavOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-[#102C57] transition-all duration-300 ${mobileNavOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
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

        {/* ── Desktop nav + search ── */}
        <nav className={`hidden md:flex flex-row justify-between items-center px-4 md:px-10 py-3 border-t border-[#EADBC8]/30 transition-colors ${
          isScrolled ? 'bg-white/10' : 'bg-white/50'
        }`}>
          <div className="flex flex-wrap gap-2 md:gap-4">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/categories" className={navLinkClass}>Categories</NavLink>
            <NavLink to="/services" className={navLinkClass}>Services</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact Us</NavLink>
          </div>

          <div className="relative w-auto">
            <div className={`relative flex items-center transition-all duration-300 ${searchFocused ? 'w-80' : 'w-64'}`}>
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
              {searchFocused && searchQuery.length > 1 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#EADBC8]/30 overflow-hidden z-50">
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
                          <img src={item.type === 'category' ? item.image : item.parentImage} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }} />
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

        {/* ── Mobile nav drawer ── */}
        {mobileNavOpen && (
          <div className="md:hidden bg-white border-t border-[#EADBC8]/30 shadow-xl">
            <div className="px-4 py-4 flex flex-col gap-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/categories', label: 'Categories' },
                { to: '/services', label: 'Services' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] transition-all ${
                      isActive
                        ? 'text-[#FEFAF6] bg-[#102C57]'
                        : 'text-[#102C57]/70 hover:bg-[#102C57]/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              {!isLoggedIn && (
                <div className="flex gap-3 pt-3 border-t border-[#EADBC8]/30 mt-2">
                  <Link to="/signup-customer" onClick={() => setMobileNavOpen(false)} className="flex-1 text-center border-2 border-[#102C57] rounded-xl px-4 py-2.5 text-xs font-bold uppercase text-[#102C57] hover:bg-[#102C57] hover:text-[#FEFAF6] transition-all">Sign Up</Link>
                  <Link to="/login" onClick={() => setMobileNavOpen(false)} className="flex-1 text-center bg-[#102C57] text-[#FEFAF6] rounded-xl px-4 py-2.5 border-2 border-[#102C57] text-xs font-bold uppercase hover:bg-opacity-90 transition-all">Login</Link>
                </div>
              )}
              {/* Mobile search */}
              <div className="relative pt-3 border-t border-[#EADBC8]/30 mt-2">
                <input
                  type="text"
                  placeholder="Search services or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  onKeyUp={handleSearchKeyPress}
                  className="border border-[#EADBC8] rounded-xl h-10 px-4 pl-10 text-xs w-full bg-[#FEFAF6] focus:outline-none focus:border-[#102C57] text-[#102C57]"
                />
                <span className="absolute left-3.5 top-1/2 mt-1.5 text-[#102C57]/40 text-sm" aria-hidden>🔍</span>
                {searchFocused && searchQuery.length > 1 && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-[#EADBC8]/30 overflow-hidden z-50">
                    {searchResults.map((item, i) => (
                      <Link key={i} to={item.type === 'category' ? `/services/${item.slug}` : `/services/${item.parentSlug}`} onClick={() => { setSearchQuery(''); setMobileNavOpen(false); }} className="flex items-center gap-3 p-3 hover:bg-[#FEFAF6] transition-colors border-b border-[#EADBC8]/10 last:border-0">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#EADBC8]/20 flex-shrink-0">
                          <img src={item.type === 'category' ? item.image : item.parentImage} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }} />
                        </div>
                        <span className="text-[11px] font-bold text-[#102C57] uppercase tracking-wide">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col pt-[7.5rem] md:pt-32">{children}</main>

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