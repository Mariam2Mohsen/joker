import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt, FaBars, FaCog, FaUser } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const handleLogout = () => {
    navigate('/login');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col bg-white border-b border-[#EADBC8] shadow-sm relative z-50">
      <div className="w-full h-16 flex items-center justify-between px-4 md:px-8">

        {/* Left: Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="text-[#102C57] p-2 hover:bg-[#FEFAF6] rounded-xl transition-all active:scale-90 lg:hidden"
          >
            <FaBars size={20} />
          </button>

        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2.5 text-[#102C57] hover:bg-[#FEFAF6] rounded-xl transition-all relative group"
            >
              <FaBell size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-[#EADBC8] rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#FEFAF6]">
                  <h3 className="text-[11px] font-black text-[#102C57] uppercase">Notifications</h3>
                  <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">2 New</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 p-2 hover:bg-[#FEFAF6] rounded-xl transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                      <FaUser size={12} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#102C57]">New user registered</p>
                      <p className="text-[8px] text-[#DAC0A3] mt-0.5">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-2 hover:bg-[#FEFAF6] rounded-xl transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                      <FaCog size={12} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#102C57]">System update completed</p>
                      <p className="text-[8px] text-[#DAC0A3] mt-0.5">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 text-[9px] font-black text-[#102C57] uppercase tracking-widest hover:bg-[#FEFAF6] rounded-lg transition-colors border border-[#EADBC8]/50">
                  View All Activity
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-3 border-l border-[#EADBC8]/50 group transition-all"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[11px] font-black text-[#102C57] leading-none group-hover:text-[#DAC0A3] transition-colors">Hi, Admin</span>
                <span className="text-[8px] text-green-500 font-bold uppercase mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-[#FEFAF6] border border-[#EADBC8] flex items-center justify-center text-[#102C57] group-hover:bg-[#102C57] group-hover:text-white transition-all shadow-sm">
                  <FaUserCircle size={24} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-[#EADBC8] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-[#FEFAF6] border-b border-[#EADBC8]/50">
                  <p className="text-[10px] font-black text-[#102C57] uppercase">Administrator</p>
                  <p className="text-[9px] text-[#DAC0A3] font-bold mt-0.5">admin@example.com</p>
                </div>
                <div className="p-2">

                  <div className="my-.5 border-t border-[#FEFAF6]"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white border border-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaSignOutAlt size={12} />
                    </div>
                    Logout Securely
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;