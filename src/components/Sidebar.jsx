import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaUserCircle, FaList, FaThLarge, FaBriefcase,
  FaCalendarAlt, FaHandshake, FaMoneyBillWave,
  FaUsers, FaGift, FaChevronDown, FaChevronUp
} from 'react-icons/fa';

import Logo from '../assets/Logo.jpeg';

const Sidebar = ({ onClose }) => {
  const [openMenus, setOpenMenus] = useState({
    systemUsers: false,
    categories: true,
    services: false
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const itemClass = ({ isActive }) =>
    `flex items-center justify-between p-4 transition-all duration-300 text-[13px] font-bold border-l-4 cursor-pointer group ${isActive
      ? 'bg-[#1a3d75] text-[#FEFAF6] border-[#DAC0A3]'
      : 'text-[#FEFAF6]/80 border-transparent hover:bg-[#1a3d75]/50 hover:text-[#FEFAF6]'
    }`;

  const subItemClass = ({ isActive }) =>
    `flex items-center pl-10 py-3 text-[12px] transition-all duration-300 ${isActive
      ? 'text-[#DAC0A3] font-black'
      : 'text-[#FEFAF6]/60 hover:text-[#FEFAF6]'
    }`;

  // Helper to close sidebar on link click (mobile)
  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 bg-[#102C57] flex flex-col h-screen overflow-y-auto shadow-2xl relative z-[200] border-r border-white/5 scrollbar-hide">
      {/* Brand Logo Section */}
      <div className="p-8 flex flex-col items-center gap-4 bg-[#0d254a] border-b border-white/5">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#DAC0A3] to-[#EADBC8] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <img
            src={Logo}
            alt="Logo"
            className="relative h-20 w-20 object-cover rounded-2xl shadow-2xl border border-white/10"
          />
        </div>
        <div className="text-center">
          <h1 className="text-base font-black text-white tracking-[0.2em] leading-none uppercase">Admin Panel</h1>
          <p className="text-[8px] text-[#DAC0A3] font-black uppercase tracking-[0.4em] mt-2 opacity-80">Management Suite</p>
        </div>
      </div>

      {/* User Quick Info */}
      {/* <div className="px-6 py-6 border-b border-white/5 bg-[#0d254a]/50">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <FaUserCircle size={40} className="text-[#DAC0A3]" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d254a]"></span>
          </div>
          <div className="overflow-hidden">
            <p className="text-[12px] font-black text-[#FEFAF6] truncate">Welcome!</p>
            <p className="text-[10px] text-[#DAC0A3]/70 font-bold uppercase tracking-widest">Admin User</p>
          </div>
        </div>
      </div> */}

      <nav className="flex-1 py-4 space-y-1">
        {/* Main Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => itemClass({ isActive })}
          onClick={handleLinkClick}
        >
          <div className="flex items-center gap-4"><FaThLarge size={16} /> Dashboard</div>
        </NavLink>

        {/* Category Management */}
        <div className="border-t border-white/5 pt-1 mt-1">
          <div onClick={() => toggleMenu('categories')} className="flex items-center justify-between p-4 cursor-pointer text-[#FEFAF6]/80 hover:text-[#FEFAF6] transition-all group">
            <div className="flex items-center gap-4 text-[13px] font-bold">
              <FaList size={16} /> Categories
            </div>
            {openMenus.categories ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
          </div>

          {openMenus.categories && (
            <div className="flex flex-col bg-[#0d254a]/20">
              <NavLink to="/admin/category/list" className={subItemClass} onClick={handleLinkClick}>
                ○ Category List
              </NavLink>
              <NavLink to="/admin/subcategory/list" className={subItemClass} onClick={handleLinkClick}>
                ○ Sub Categories
              </NavLink>
            </div>
          )}
        </div>

        {/* Service Management */}
        <div>
          <div onClick={() => toggleMenu('services')} className="flex items-center justify-between p-4 cursor-pointer text-[#FEFAF6]/80 hover:text-[#FEFAF6] transition-all group">
            <div className="flex items-center gap-4 text-[13px] font-bold">
              <FaBriefcase size={16} /> Services
            </div>
            <div className="flex items-center gap-2">
              {openMenus.services ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
            </div>
          </div>

          {openMenus.services && (
            <div className="flex flex-col bg-[#0d254a]/20">
              <NavLink to="/admin/service/list" className={subItemClass} onClick={handleLinkClick}>
                ○ Service List
              </NavLink>
              <NavLink to="/admin/service/add" className={subItemClass} onClick={handleLinkClick}>
                ○ Add New Service
              </NavLink>
            </div>
          )}
        </div>

        {/* Others */}
        {[
          { name: 'Appointments', icon: <FaCalendarAlt size={16} /> },
          { name: 'Offers', icon: <FaGift size={16} /> },
          { name: 'Payouts', icon: <FaMoneyBillWave size={16} /> },
          { name: 'Customers', icon: <FaUsers size={16} /> }
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 cursor-pointer text-[#FEFAF6]/80 hover:text-[#FEFAF6] transition-all group">
            <div className="flex items-center gap-4 text-[13px] font-bold">
              {item.icon} {item.name}
            </div>
            <div className="flex items-center gap-2">
              {item.badge && <span className="bg-red-400 text-white text-[9px] px-1.5 py-0.5 rounded-lg font-black">{item.badge}</span>}
              <FaChevronDown size={10} className="opacity-40" />
            </div>
          </div>
        ))}

        {/* System Users */}
        <div className="border-t border-white/5 pt-1 mt-1">
          <div onClick={() => toggleMenu('systemUsers')} className="flex items-center justify-between p-4 cursor-pointer text-[#FEFAF6]/80 hover:text-[#FEFAF6] transition-all group">
            <div className="flex items-center gap-4 text-[13px] font-bold">
              <FaUsers size={16} /> System Users
            </div>
            {openMenus.systemUsers ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
          </div>

          {openMenus.systemUsers && (
            <div className="flex flex-col bg-[#0d254a]/20">
              <NavLink to="/admin/users/list" className={subItemClass} onClick={handleLinkClick}>○ Users List</NavLink>
              <NavLink to="/admin/users/add" className={subItemClass} onClick={handleLinkClick}>○ New User</NavLink>
            </div>
          )}
        </div>
      </nav>


    </aside>
  );
};

export default Sidebar;