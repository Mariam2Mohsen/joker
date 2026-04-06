import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import Sidebar from "../components/Sidebar";
import { DollarSign, CalendarCheck, ClipboardList, Star, Clock, CheckCircle2, ArrowUpRight, Plus, Award, Activity, Zap, Cpu, MousePointer2 } from 'lucide-react';

const PremiumStatCard = ({ title, value, icon, trend, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[3.52rem] p-10 border border-[#EADBC8]/40 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_80px_-15px_rgba(16,44,87,0.1)] transition-all duration-700 group relative overflow-hidden ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
  >
    {/* Micro-Glow Effects */}
    <div className={`absolute top-[-25%] right-[-15%] w-[60%] h-[60%] ${color}/5 rounded-full blur-[60px] group-hover:blur-[80px] group-hover:scale-125 transition-all duration-1000`}></div>
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className={`w-16 h-16 rounded-3xl ${color} text-white flex items-center justify-center shadow-2xl shadow-${color}/30 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700`}>
        {icon}
      </div>
      <div className="flex items-center gap-1.5 bg-[#FEFAF6] px-4 py-1.5 rounded-full border border-[#EADBC8]/60 shadow-sm transition-all group-hover:border-[#102C57]/20">
         <div className={`w-1.5 h-1.5 rounded-full ${trend.startsWith('+') ? 'bg-emerald-500' : 'bg-[#DAC0A3]'}`}></div>
         <span className="text-[10px] font-black uppercase text-[#102C57] tracking-wider opacity-80">{trend}</span>
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-[11px] font-black text-[#102C57]/40 uppercase tracking-[0.3em] mb-3 leading-none">{title}</h3>
      <p className="text-4xl font-black text-[#102C57] tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{value}</p>
    </div>
    <div className="absolute bottom-5 right-10 opacity-0 group-hover:opacity-10 group-hover:-translate-y-2 transition-all duration-700">
       <MousePointer2 size={32} strokeWidth={3} className="text-[#102C57]" />
    </div>
  </div>
);

const HomeProvider = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalBookings: 0,
    avgRating: 0,
    activeServices: 0,
    pendingRequests: 0
  });

  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch("https://joker-hm0k.onrender.com/api/provider/services/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchDashboardStats();
  }, [token]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FEFAF6] font-sans selection:bg-[#102C57] selection:text-white">
      <TopHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-10 overflow-auto scroll-smooth relative">
          {/* Subtle Ambient Background Mesh */}
          <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,#EADBC8_0,transparent_15%)] opacity-30 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 items-start space-y-12">
            
            {/* Intelligent Greeting Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-12 bg-white rounded-[4rem] border border-[#EADBC8]/40 shadow-2xl relative overflow-hidden group/header transition-all duration-700 hover:shadow-black/5">
               <div className="absolute top-0 right-0 w-[40%] h-full bg-[#102C57]/5 backdrop-blur-[10px] skew-x-[15deg] translate-x-[10%] group-hover/header:translate-x-0 transition-transform duration-1000"></div>
               <div className="relative z-10 max-w-lg">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="px-4 py-2 bg-[#102C57] text-[#FEFAF6] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-[#102C57]/20">CORE: 1.2</div>
                     <div className="flex items-center gap-2 group-hover/header:scale-110 transition-transform">
                        <Activity size={14} className="text-[#DAC0A3]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#DAC0A3]">Operational Link: OK</span>
                     </div>
                  </div>
                  <h1 className="text-5xl font-black text-[#102C57] tracking-tighter leading-tight group-hover/header:translate-x-1 transition-transform mb-3">Intelligence Terminal</h1>
                  <p className="text-[11px] font-black uppercase text-[#DAC0A3] tracking-[0.1em] opacity-80 leading-relaxed md:w-3/4 italic">
                    Successfully integrated with Petra Global Database. Current operational status is optimized for high-demand services.
                  </p>
               </div>
               
               <div className="mt-10 lg:mt-0 relative z-10 flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-[#FEFAF6] px-10 py-6 rounded-[2.5rem] border border-[#EADBC8]/40 shadow-inner group/clock flex items-center gap-6 hover:shadow-lg transition-all duration-500">
                    <div className="w-14 h-14 rounded-3xl bg-[#102C57] text-[#FEFAF6] flex items-center justify-center font-black shadow-2xl shadow-black/20 group-hover/clock:rotate-[15deg] group-hover/clock:scale-110 transition-all duration-700">
                      <Clock size={26} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-[#102C57] uppercase tracking-[0.3em] opacity-20 mb-1 leading-none">Terminal Sync</p>
                      <p className="text-2xl font-black text-[#102C57] tracking-tight">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</p>
                    </div>
                  </div>
                  <button className="bg-[#DAC0A3] text-[#102C57] p-8 rounded-[3rem] shadow-xl hover:rotate-3 hover:scale-105 active:scale-90 transition-all group/btn shadow-black/5 hover:bg-white border-2 border-transparent hover:border-[#DAC0A3]">
                     <Cpu size={28} strokeWidth={2.5} className="group-hover/btn:animate-spin-slow" />
                  </button>
               </div>
            </div>

            {/* Premium Intelligence Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <PremiumStatCard 
                title="Revenue Intelligence" 
                value={`${stats.totalEarnings.toLocaleString()} L.E`} 
                icon={<DollarSign size={28} />} 
                trend="+18.2% MONTHLY" 
                color="bg-[#102C57]"
              />
              <PremiumStatCard 
                title="Operational Load" 
                value={stats.totalBookings.toString()} 
                icon={<CalendarCheck size={28} />} 
                trend="STABLE LOAD" 
                color="bg-[#102C57]"
              />
              <PremiumStatCard 
                title="Pending Requests" 
                value={stats.pendingRequests.toString()} 
                icon={<ClipboardList size={28} />} 
                trend="QUEUE READY" 
                color="bg-[#102C57]"
                onClick={() => navigate("/dashboard/service-requests")}
              />
              <PremiumStatCard 
                title="Trust Protocol" 
                value={`${stats.avgRating}/5.0`} 
                icon={<Award size={28} />} 
                trend="EXPERT CLASS" 
                color="bg-[#102C57]"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Intelligent Timeline Analytics */}
              <div className="lg:col-span-2 bg-white rounded-[4rem] border border-[#EADBC8] p-12 shadow-2xl relative overflow-hidden transition-all duration-700 hover:shadow-black/5">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-10 bg-[#102C57] rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-black text-[#102C57] uppercase tracking-[0.3em] leading-none mb-1">Timeline Analytics</h3>
                      <p className="text-[10px] font-black uppercase text-[#DAC0A3] tracking-widest opacity-60">Successive Log Events</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                     <button className="text-[10px] font-black text-[#DAC0A3] uppercase hover:text-[#102C57] transition-all bg-[#FEFAF6] w-12 h-12 flex items-center justify-center rounded-2xl border border-[#EADBC8]/40 shadow-sm active:scale-90"><Activity size={18} /></button>
                     <button className="text-[10px] font-black text-[#DAC0A3] uppercase hover:text-[#102C57] transition-all bg-[#FEFAF6] px-8 py-3 rounded-2xl border border-[#EADBC8]/40 shadow-sm hover:shadow-lg active:scale-95">LOG CENTER →</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-8">
                  {[
                    { id: 1, text: 'Neural Booking: Home Cleaning Integration', time: '2 min ago', type: 'SUCCESS', icon: <Zap size={18} />, color: 'bg-emerald-50 text-emerald-600' },
                    { id: 2, text: 'Financial Payout: 1,450.00 L.E Finalized', time: '1 hour ago', type: 'PAYOUT', icon: <DollarSign size={18} />, color: 'bg-[#102C57] text-white shadow-xl' },
                    { id: 3, text: 'Trust Award: Expert Class review detected', time: '3 hours ago', type: 'TRUST', icon: <Star size={18} />, color: 'bg-amber-50 text-amber-600' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center gap-8 group/item px-8 py-6 hover:bg-[#FEFAF6] rounded-[3rem] transition-all duration-700 border border-transparent hover:border-[#EADBC8]/40 cursor-pointer active:scale-[0.98]">
                      <div className={`w-16 h-16 rounded-[1.75rem] ${item.color} flex items-center justify-center shadow-2xl transform group-hover/item:rotate-[10deg] group-hover/item:scale-110 transition-all duration-700`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-[9px] font-black uppercase text-[#DAC0A3] tracking-[0.3em] group-hover/item:text-[#102C57] transition-colors">{item.type} protocol</span>
                           <div className="w-1 h-1 bg-[#EADBC8] rounded-full"></div>
                           <span className="text-[9px] font-black uppercase text-[#DAC0A3] tracking-widest">{item.time}</span>
                        </div>
                        <p className="text-md font-black text-[#102C57] group-hover/item:translate-x-2 transition-transform duration-500 opacity-90">{item.text}</p>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#DAC0A3]/30 group-hover/item:text-[#102C57] group-hover/item:bg-[#FEFAF6] transition-all shadow-sm">
                        <ArrowUpRight size={20} className="group-hover/item:scale-125 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Terminal Hub */}
              <div className="bg-[#102C57] rounded-[4.5rem] p-12 shadow-3xl text-white relative overflow-hidden group/main grid content-start gap-10">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,#DAC0A3_0,transparent_30%)] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-1000"></div>
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.4em] mb-12 text-[#DAC0A3] flex items-center gap-4">
                       <div className="w-8 h-1 bg-[#DAC0A3]"></div> Command Protocol
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <button 
                        onClick={() => navigate('/dashboard/add-service')}
                        className="w-full bg-white/5 hover:bg-[#FEFAF6] hover:text-[#102C57] p-8 rounded-[2.5rem] flex items-center justify-between transition-all duration-700 group/btn border border-white/5 hover:border-transparent active:scale-95 shadow-lg"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-[#DAC0A3]/20 rounded-[1.25rem] flex items-center justify-center text-[#DAC0A3] group-hover/btn:bg-[#102C57] group-hover/btn:text-[#FEFAF6] transition-all duration-700 shadow-inner"><Plus size={24} /></div>
                          <div className="text-left">
                             <p className="text-[12px] font-black uppercase tracking-[0.3em] leading-none mb-1.5">New Intelligence</p>
                             <p className="text-[9px] font-medium opacity-40 uppercase tracking-widest leading-none">Register Operational Node</p>
                          </div>
                        </div>
                        <ArrowUpRight size={20} className="opacity-0 group-hover/btn:opacity-100 group-hover/btn:rotate-45 transition-all" />
                      </button>
                      
                      <button className="w-full bg-white/5 hover:bg-white/10 p-8 rounded-[2.5rem] flex items-center justify-between transition-all duration-700 group/btn border border-white/5 active:scale-95">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-white/10 rounded-[1.25rem] flex items-center justify-center text-white group-hover/btn:bg-[#DAC0A3] group-hover/btn:text-[#102C57] transition-all duration-700 shadow-inner"><CalendarCheck size={24} /></div>
                          <div className="text-left">
                             <p className="text-[12px] font-black uppercase tracking-[0.3em] leading-none mb-1.5">View Intelligence</p>
                             <p className="text-[9px] font-medium opacity-40 uppercase tracking-widest leading-none">Access Active Loads</p>
                          </div>
                        </div>
                        <ArrowUpRight size={20} className="opacity-10 group-hover/btn:opacity-100 group-hover/btn:rotate-45 transition-all" />
                      </button>

                      <button className="w-full bg-white text-[#102C57] p-10 rounded-[3rem] flex items-center justify-between transition-all duration-700 group/fin shadow-2xl shadow-black/40 active:scale-95 mt-6 hover:shadow-emerald-500/10">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-[#102C57]/10 rounded-[1.75rem] flex items-center justify-center text-[#102C57] group-hover/fin:bg-[#102C57] group-hover/fin:text-white transition-all duration-700"><Award size={28} /></div>
                          <div className="text-left">
                             <p className="text-sm font-black uppercase tracking-[0.3em] leading-none mb-1.5">Protocol: Asset</p>
                             <p className="text-[10px] font-black text-[#DAC0A3] uppercase tracking-widest">Execute Asset Transfer</p>
                          </div>
                        </div>
                        <Zap size={22} className="text-[#DAC0A3] group-hover/fin:animate-pulse" />
                      </button>
                    </div>
                 </div>

                 <div className="mt-14 p-10 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[3.5rem] relative group/tip overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#DAC0A3]/5 rounded-full blur-2xl group-hover/tip:bg-[#DAC0A3]/20 transition-all"></div>
                    <p className="text-[15px] font-bold text-white/90 mb-6 leading-relaxed italic group-hover/tip:translate-x-1 transition-transform">"Security protocol: Ensure your operational certificates are updated for priority load access."</p>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#DAC0A3]">System Advice Protocol</span>
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

export default HomeProvider;