import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Layers, 
  PlusCircle, 
  ClipboardList,
  LogOut,
  User,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useAuth } from "../../../hooks/useAuth";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/provider/home" },
    { label: "My Services", icon: <Layers size={20} />, path: "/provider/services" },
    { label: "Add Service", icon: <PlusCircle size={20} />, path: "/dashboard/add-service" },
    { label: "Service Requests", icon: <ClipboardList size={20} />, path: "/dashboard/service-requests" },
  ];

  return (
    <aside className="w-64 sm:w-72 min-h-screen bg-[#102C57] flex flex-col flex-shrink-0 z-50 transition-all duration-500 overflow-hidden relative border-r border-[#DAC0A3]/10 shadow-2xl">
      {/* Sleek Header Section */}
      <div className="p-8 mb-6 flex flex-col items-center text-center relative overflow-hidden group">
         <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#DAC0A3]/20 to-transparent"></div>
         <div className="relative mb-4 group-hover:scale-105 transition-transform duration-500">
            <div className="w-20 h-20 rounded-[2.5rem] bg-[#FEFAF6] flex items-center justify-center text-[#102C57] text-3xl font-black shadow-2xl border-4 border-[#102C57]">
               {user?.firstName ? user.firstName[0] : "P"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-[#102C57] rounded-full shadow-lg"></div>
         </div>
         <h3 className="text-[#FEFAF6] font-black text-sm tracking-tight mb-1">{user?.firstName ? `${user.firstName} ${user.lastName}` : "Provider Admin"}</h3>
         <p className="text-[#DAC0A3] text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Verified Partner</p>
      </div>

      {/* Modern Simple Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 relative group ${
                isActive
                  ? "bg-[#FEFAF6] text-[#102C57] shadow-2xl shadow-[#102C57]/40 translate-x-1"
                  : "text-[#FEFAF6]/50 hover:text-[#FEFAF6] hover:bg-white/5"
              }`
            }
          >
            <span className="transition-transform group-hover:scale-110">{item.icon}</span>
            <span className="truncate">{item.label}</span>
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Simple Footer Actions */}
      <div className="p-6 space-y-2 border-t border-[#DAC0A3]/10">
        <button className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.25em] text-[#FEFAF6]/40 hover:text-[#FEFAF6] hover:bg-white/5 transition-all group">
          <Settings size={20} className="group-hover:rotate-45 transition-transform" />
          <span>Settings</span>
        </button>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.25em] text-red-400 hover:bg-red-500 hover:text-white transition-all group shadow-inner"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;