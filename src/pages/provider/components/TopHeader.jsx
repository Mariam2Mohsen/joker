import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, Search, Settings, User, LogOut, LayoutDashboard, MessageCircle, HelpCircle } from 'lucide-react';
import Logo from "../../../components/UI/Logo";
import { useAuth } from "../../../hooks/useAuth";
import LogoutModal from "../../../components/UI/LogoutModal";

const navLinkClass = ({ isActive }) =>
  `relative px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-xl flex items-center group overflow-hidden ${
    isActive 
      ? 'text-[#FEFAF6] bg-[#102C57] shadow-lg shadow-[#102C57]/20 scale-105' 
      : 'text-[#102C57]/50 hover:text-[#102C57] hover:bg-[#102C57]/5'
  }`;

const TopHeader = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email ? user.email.slice(0, 2).toUpperCase() : 'PV';
  };

  return (
    <header className="h-20 bg-white border-b border-[#EADBC8]/50 flex items-center justify-between px-8 shadow-sm z-[100] sticky top-0 transition-all duration-500">
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center hover:scale-105 transition-transform">
          <Logo className="h-10 w-auto" />
        </Link>
        
      </div>

      <div className="flex gap-6 items-center">
        {/* Global Search Bar */}
        <div className="hidden lg:flex relative items-center group">
          <input 
            type="text" 
            placeholder="Search provider dashboard..." 
            className="bg-[#FEFAF6] border border-[#EADBC8] rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-[#102C57] focus:ring-4 focus:ring-[#102C57]/5 transition-all w-72 group-hover:border-[#102C57]/40 shadow-inner"
          />
          <Search size={14} className="absolute left-3.5 text-[#DAC0A3] group-hover:text-[#102C57] transition-colors" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 border-l border-[#EADBC8] pl-6 ml-2">
          <button className="relative p-2.5 bg-[#FEFAF6] rounded-xl text-[#102C57] hover:bg-[#102C57] hover:text-white transition-all shadow-sm group">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 text-[8px] font-black bg-[#DAC0A3] text-[#102C57] w-4 h-4 flex items-center justify-center rounded-lg border-2 border-white">
              2
            </span>
          </button>

        </div>

        {/* User Profile Dropdown */}
        <div className="relative border-l border-[#EADBC8] pl-6">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-4 group focus:outline-none bg-[#FEFAF6] p-1.5 pr-4 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-[#EADBC8] shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#102C57] text-[#FEFAF6] flex items-center justify-center font-black text-xs border-2 border-white shadow-md group-hover:scale-105 transition-transform overflow-hidden">
               {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : getUserInitials()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[11px] font-black text-[#102C57] leading-none mb-1">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : "Provider Admin"}
              </p>
              <p className="text-[8px] font-black text-[#DAC0A3] uppercase tracking-widest leading-none">Verified Partner</p>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-[#EADBC8]/30 py-3 z-20 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#FEFAF6] bg-[#FEFAF6]/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#102C57]">{user?.email}</p>
                  <p className="text-[8px] font-bold text-[#DAC0A3] uppercase tracking-tighter mt-0.5">Account Type: Provider</p>
                </div>
                
                <div className="p-2 space-y-1">
                  <Link 
                    to="/messages" 
                    className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#102C57]/60 hover:text-[#102C57] hover:bg-[#FEFAF6] rounded-xl transition-all"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <MessageCircle size={14} className="text-[#DAC0A3]" /> Messages
                  </Link>
                </div>

                <div className="px-2 pt-1 border-t border-[#FEFAF6]">
                  <button 
                    onClick={() => {
                      setShowLogoutModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all text-left"
                  >
                    <LogOut size={14} /> Log Out System
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout();
          setShowLogoutModal(false);
        }}
      />
    </header>
  );
};

export default TopHeader;