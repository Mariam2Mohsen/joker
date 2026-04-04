import React, { useState } from "react";
import { 
  Heart, 
  Star, 
  ArrowUpRight, 
  Activity, 
  Zap, 
  DollarSign, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import TopHeader from "./provider/components/TopHeader";
import CustomerSidebar from "./customer/components/Sidebar";

const PremiumStatCard = ({ title, value, icon, trend, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[3.5rem] p-10 border border-[#EADBC8]/40 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_80px_-15px_rgba(16,44,87,0.1)] transition-all duration-700 group relative overflow-hidden ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
  >
    <div className={`absolute top-[-25%] right-[-15%] w-[60%] h-[60%] ${color}/5 rounded-full blur-[60px] group-hover:blur-[80px] group-hover:scale-125 transition-all duration-1000`}></div>
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className={`w-14 h-14 rounded-[1.5rem] ${color} text-white flex items-center justify-center shadow-2xl shadow-${color}/30 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700`}>
        {icon}
      </div>
      <div className="flex items-center gap-1.5 bg-[#FEFAF6] px-4 py-1.5 rounded-full border border-[#EADBC8]/60 shadow-sm transition-all group-hover:border-[#102C57]/20">
         <div className={`w-1.5 h-1.5 rounded-full bg-[#DAC0A3]`}></div>
         <span className="text-[9px] font-black uppercase text-[#102C57] tracking-wider opacity-80">{trend}</span>
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-[10px] font-black text-[#102C57]/40 uppercase tracking-[0.3em] mb-4 leading-none">{title}</h3>
      <p className="text-4xl font-black text-[#102C57] tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{value}</p>
    </div>
  </div>
);

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats] = useState({
    activeOrders: 4,
    savedServices: 12,
    totalSpent: "1,250",
    loyaltyPoints: 350
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FEFAF6] font-sans selection:bg-[#102C57] selection:text-white">
      <TopHeader />
      <div className="flex flex-1 overflow-hidden">
        <CustomerSidebar />
        <main className="flex-1 p-10 overflow-auto scroll-smooth relative">
          {/* Subtle Ambient Background Mesh */}
          <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,#EADBC8_0,transparent_15%)] opacity-30 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 items-start space-y-12">
            
            {/* Welcome Terminal Header */}
            <div className="p-12 bg-white rounded-[4rem] border border-[#EADBC8]/40 shadow-2xl relative overflow-hidden group/welcome transition-all duration-700 hover:shadow-black/5">
                <div className="absolute top-0 right-0 w-[45%] h-full bg-[#102C57]/5 backdrop-blur-[10px] skew-x-[15deg] translate-x-[15%] group-hover/welcome:translate-x-0 transition-transform duration-1000"></div>
                <div className="relative z-10 max-w-2xl text-left">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="px-5 py-2 bg-[#102C57] text-[#FEFAF6] rounded-xl text-[10px] font-black uppercase tracking-[0.4em] shadow-lg shadow-[#102C57]/20 border border-white/10">PRESTIGE: 1.0</div>
                      <div className="flex items-center gap-2 group-hover/welcome:scale-110 transition-transform">
                         <Zap size={14} className="text-[#DAC0A3] fill-[#DAC0A3]" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#DAC0A3]">Account Protocol: ACTIVE</span>
                      </div>
                   </div>
                   <h1 className="text-5xl font-black text-[#102C57] tracking-tighter leading-tight group-hover/welcome:translate-x-1 transition-transform mb-4">Personal Intelligence Hub</h1>
                   <p className="text-[12px] font-black uppercase text-[#DAC0A3] tracking-[0.15em] opacity-80 leading-relaxed md:w-4/5 italic">
                       Synced with Global Services. Your account status is optimized for high-priority bookings and expert class access.
                   </p>
                </div>

                <div className="mt-10 relative z-10 flex flex-wrap gap-6 lg:justify-end">
                   <button 
                      onClick={() => navigate('/services')}
                      className="bg-[#102C57] text-white px-10 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 group/btn"
                   >
                      Find New Intelligence <ArrowUpRight size={18} className="group-hover/btn:rotate-45 transition-transform" />
                   </button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
               <PremiumStatCard 
                  title="Current Hub Loads" 
                  value={stats.activeOrders.toString()} 
                  icon={<Activity size={24} />} 
                  trend="STABLE OPERATIONS" 
                  color="bg-[#102C57]"
               />
               <PremiumStatCard 
                  title="Saved Intelligence" 
                  value={stats.savedServices.toString()} 
                  icon={<Heart size={24} />} 
                  trend="WISH LIST READY" 
                  color="bg-[#102C57]"
               />
               <PremiumStatCard 
                  title="Financial Integration" 
                  value={`${stats.totalSpent} L.E`} 
                  icon={<DollarSign size={24} />} 
                  trend="SYNCHRONIZED COST" 
                  color="bg-[#102C57]"
               />
               <PremiumStatCard 
                  title="Prestige Points" 
                  value={stats.loyaltyPoints.toString()} 
                  icon={<Star size={24} />} 
                  trend="LOYALTY CLASS" 
                  color="bg-[#102C57]"
               />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {/* Recent Orders Log */}
               <div className="lg:col-span-2 bg-white rounded-[4rem] border border-[#EADBC8] p-12 shadow-2xl relative overflow-hidden transition-all duration-700 hover:shadow-black/5">
                  <div className="flex justify-between items-center mb-12">
                     <div className="flex items-center gap-4">
                        <div className="w-3 h-10 bg-[#102C57] rounded-full"></div>
                        <div>
                           <h3 className="text-lg font-black text-[#102C57] uppercase tracking-[0.3em] leading-none mb-1 text-left">Operational Log</h3>
                           <p className="text-[10px] font-black uppercase text-[#DAC0A3] tracking-widest opacity-60 text-left">Latest Service Integrations</p>
                        </div>
                     </div>
                     <button className="text-[10px] font-black text-[#DAC0A3] uppercase hover:text-[#102C57] transition-all bg-[#FEFAF6] px-8 py-3 rounded-2xl border border-[#EADBC8]/40 hover:shadow-lg active:scale-95 tracking-widest">SHOW ALL NODES</button>
                  </div>
                  
                  <div className="space-y-8">
                     {[
                       { id: 1, service: 'Royal Villa Cleaning Protocol', provider: 'Hoon Integrated Services', time: 'Pending Sync', price: '450.00 L.E', type: 'ACTIVE' },
                       { id: 2, service: 'Expert Class AC Restoration', provider: 'Global Cooling Node', time: 'Completed', price: '1,200.00 L.E', type: 'RESOLVED' },
                       { id: 3, service: 'Elite Security Deployment', provider: 'Petra Defensive Unit', time: 'In Progress', price: '3,500.00 L.E', type: 'ACTIVE' },
                     ].map((order) => (
                       <div key={order.id} className="flex flex-col md:flex-row items-center gap-8 group/item px-8 py-7 hover:bg-[#FEFAF6] rounded-[3.5rem] transition-all duration-700 border border-transparent hover:border-[#EADBC8]/40 cursor-pointer active:scale-[0.98]">
                         <div className={`w-18 h-18 rounded-[1.75rem] bg-[#102C57] text-[#FEFAF6] flex items-center justify-center shadow-2xl transform group-hover/item:rotate-[10deg] group-hover/item:scale-110 transition-all duration-700 font-extrabold text-xl`}>
                           {order.service[0]}
                         </div>
                         <div className="flex-1 text-left">
                           <div className="flex items-center gap-3 mb-1.5">
                              <span className="text-[9px] font-black uppercase text-[#DAC0A3] tracking-[0.3em] group-hover/item:text-[#102C57] transition-colors">{order.type} Protocol</span>
                              <div className="w-1 h-1 bg-[#EADBC8] rounded-full text-left"></div>
                              <span className="text-[9px] font-black uppercase text-[#DAC0A3] tracking-widest">{order.time}</span>
                           </div>
                           <h4 className="text-lg font-black text-[#102C57] group-hover/item:translate-x-2 transition-transform duration-500 opacity-90">{order.service}</h4>
                           <p className="text-[10px] font-black uppercase text-[#DAC0A3] tracking-[0.2em] mt-1 italic">Operator: {order.provider}</p>
                         </div>
                         <div className="text-right w-full md:w-auto">
                           <p className="text-md font-black text-[#102C57] mb-2">{order.price}</p>
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#DAC0A3]/40 group-hover/item:text-[#102C57] group-hover/item:bg-[#FEFAF6] transition-all shadow-sm ml-auto">
                              <ArrowUpRight size={18} className="group-hover/item:scale-125 transition-transform" />
                           </div>
                         </div>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Quick Command Hub */}
               <div className="bg-[#102C57] rounded-[4.5rem] p-12 shadow-3xl text-white relative overflow-hidden group/main grid content-start gap-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,#DAC0A3_0,transparent_30%)] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-1000"></div>
                    <div className="text-left">
                       <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-[#DAC0A3] flex items-center gap-4">
                          <div className="w-8 h-1 bg-[#DAC0A3]"></div> Customer Protocol
                       </h3>
                       <div className="grid grid-cols-1 gap-6">
                         <button 
                           onClick={() => navigate('/services')}
                           className="w-full bg-white/5 hover:bg-[#FEFAF6] hover:text-[#102C57] p-8 rounded-[2.5rem] flex items-center justify-between transition-all duration-700 group/btn border border-white/5 hover:border-transparent active:scale-95 shadow-lg"
                         >
                           <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-[#DAC0A3]/20 rounded-[1.25rem] flex items-center justify-center text-[#DAC0A3] group-hover/btn:bg-[#102C57] group-hover/btn:text-[#FEFAF6] transition-all duration-700 shadow-inner"><Plus size={24} /></div>
                             <div className="text-left">
                                <p className="text-[12px] font-black uppercase tracking-[0.3em] leading-none mb-1.5">New Service</p>
                                <p className="text-[9px] font-medium opacity-40 uppercase tracking-widest leading-none">Register Unit</p>
                             </div>
                           </div>
                           <ArrowUpRight size={20} className="opacity-0 group-hover/btn:opacity-100 group-hover/btn:rotate-45 transition-all" />
                         </button>
                         
                         <button className="w-full bg-white/5 hover:bg-white/10 p-8 rounded-[2.5rem] flex items-center justify-between transition-all duration-700 group/btn border border-white/5 active:scale-95">
                           <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-white/10 rounded-[1.25rem] flex items-center justify-center text-white group-hover/btn:bg-[#DAC0A3] group-hover/btn:text-[#102C57] transition-all duration-700 shadow-inner"><Heart size={24} /></div>
                             <div className="text-left">
                                <p className="text-[12px] font-black uppercase tracking-[0.3em] leading-none mb-1.5">Vault</p>
                                <p className="text-[9px] font-medium opacity-40 uppercase tracking-widest leading-none">Favorites</p>
                             </div>
                           </div>
                           <ArrowUpRight size={20} className="opacity-10 group-hover/btn:opacity-100 group-hover/btn:rotate-45 transition-all" />
                         </button>

                         <button className="w-full bg-white text-[#102C57] p-10 rounded-[3.5rem] flex items-center justify-between transition-all duration-700 group/fin shadow-2xl shadow-black/40 active:scale-95 mt-6 hover:shadow-emerald-500/10">
                           <div className="flex items-center gap-6">
                             <div className="w-16 h-16 bg-[#102C57]/10 rounded-[1.75rem] flex items-center justify-center text-[#102C57] group-hover/fin:bg-[#102C57] group-hover/fin:text-white transition-all duration-700"><ShieldCheck size={28} /></div>
                             <div className="text-left">
                                <p className="text-sm font-black uppercase tracking-[0.3em] leading-none mb-1.5">Loyalty</p>
                                <p className="text-[10px] font-black text-[#DAC0A3] uppercase tracking-widest">Upgrade Prestige</p>
                             </div>
                           </div>
                           <Zap size={22} className="text-[#DAC0A3] group-hover/fin:animate-pulse" />
                         </button>
                       </div>
                    </div>

                    <div className="mt-14 p-10 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[3.5rem] relative group/tip overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-[#DAC0A3]/5 rounded-full blur-2xl group-hover/tip:bg-[#DAC0A3]/20 transition-all"></div>
                       <p className="text-[15px] font-bold text-white/90 mb-6 leading-relaxed italic group-hover/tip:translate-x-1 transition-transform text-left">"Hub Tip: Ensure your intelligence notifications are active for real-time order sync."</p>
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#DAC0A3]">Advice Protocol</span>
                          <div className="flex-1 h-px bg-white/10"></div>
                       </div>
                    </div>
                 </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;