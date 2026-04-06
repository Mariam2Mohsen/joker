import React, { useState, useEffect } from "react";
import TopHeader from "../components/TopHeader";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Wrench, Search, Filter, ArrowUpRight, DollarSign, CheckCircle2, LayoutGrid, List, Power, Activity, ShieldCheck, ShieldAlert, Zap, Layers } from 'lucide-react';
import toast from "react-hot-toast";

const MyServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const token = localStorage.getItem("authToken");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://joker-hm0k.onrender.com/api/provider/services/my-services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync operational services.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await axios.patch(`https://joker-hm0k.onrender.com/api/provider/services/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success(`Protocol ${id} status updated.`);
        fetchServices();
      }
    } catch (err) {
      toast.error("Status toggle protocol failure.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, [token]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FEFAF6] font-sans selection:bg-[#102C57] selection:text-white">
      <TopHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-10 overflow-auto scroll-smooth relative">
          {/* Subtle Ambient Background Mesh */}
          <div className="absolute left-0 top-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,#EADBC8_0,transparent_15%)] opacity-30 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 items-start space-y-12">
            
            {/* Operational Intelligence Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-12 bg-white rounded-[4rem] border border-[#EADBC8]/40 shadow-2xl relative overflow-hidden group/header transition-all duration-700 hover:shadow-black/5">
               <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(225deg,rgba(16,44,87,0.03)_0%,transparent_50%)] pointer-events-none"></div>
               <div>
                  <h1 className="text-5xl font-black text-[#102C57] tracking-tighter mb-4 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-[#102C57] text-[#FEFAF6] flex items-center justify-center font-black shadow-2xl group-hover/header:rotate-12 transition-transform duration-700">
                       <Layers size={28} />
                    </div>
                    Active Operational Node
                  </h1>
                  <p className="text-[11px] font-black uppercase text-[#DAC0A3] tracking-[0.3em] flex items-center gap-3 mt-4 ml-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/50 animate-pulse"></span>
                    Intelligence Hub: Verified Protocols
                  </p>
               </div>

               <div className="flex items-center gap-4 bg-[#FEFAF6] p-3 rounded-3xl border border-[#EADBC8]/30 relative z-10 shadow-inner group/controls">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`h-14 px-8 rounded-2xl transition-all duration-500 flex items-center gap-3 font-black text-[10px] uppercase tracking-widest ${viewMode === "grid" ? "bg-[#102C57] text-white shadow-2xl scale-105" : "text-[#102C57]/40 hover:text-[#102C57]"}`}
                  >
                    <LayoutGrid size={16} /> Grid View
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`h-14 px-8 rounded-2xl transition-all duration-500 flex items-center gap-3 font-black text-[10px] uppercase tracking-widest ${viewMode === "list" ? "bg-[#102C57] text-white shadow-2xl scale-105" : "text-[#102C57]/40 hover:text-[#102C57]"}`}
                  >
                    <List size={16} /> List View
                  </button>
               </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-[4rem] h-80 animate-pulse border border-[#EADBC8]/40 shadow-sm"></div>
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="py-48 bg-white rounded-[5rem] border border-[#EADBC8]/40 shadow-2xl flex flex-col items-center justify-center gap-10 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[#102C57]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                 <div className="w-32 h-32 rounded-[3.5rem] bg-[#FEFAF6] border-2 border-[#DAC0A3]/20 flex items-center justify-center text-[#DAC0A3]/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-inner">
                    <Activity size={56} strokeWidth={1} />
                 </div>
                 <div className="text-center relative z-10">
                    <p className="text-lg font-black text-[#102C57] uppercase tracking-[0.3em] mb-4">Zero Intelligence Detected</p>
                    <p className="text-[11px] font-black uppercase text-[#DAC0A3] tracking-[0.2em] opacity-80 leading-relaxed italic">Synchronizing with global terminal... No active nodes found.</p>
                 </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {services.map((svc) => (
                  <div key={svc.id} className="bg-white rounded-[4.5rem] p-10 border border-[#EADBC8]/40 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_80px_-15px_rgba(16,44,87,0.12)] transition-all duration-700 group relative overflow-hidden active:scale-[0.97]">
                    <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#102C57]/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#DAC0A3]/10 transition-all duration-1000"></div>
                    
                    <div className="flex justify-between items-start mb-10 relative z-10">
                       <div className="relative group/avatar">
                          <div className="w-20 h-20 rounded-[2rem] bg-[#102C57] text-[#FEFAF6] flex items-center justify-center font-black text-xl shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative overflow-hidden border-4 border-white">
                             {svc.image ? (
                               <img src={`https://joker-hm0k.onrender.com/images/${svc.image}`} alt="" className="w-full h-full object-cover" />
                             ) : svc.service_name[0]}
                             <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${svc.status === 'Active' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-[#DAC0A3] shadow-black/10'} shadow-lg transition-colors`}></div>
                       </div>
                       
                       <div className="flex flex-col items-end gap-3">
                          <span className="px-5 py-2.5 rounded-2xl bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-[0.3em] border border-emerald-100 shadow-sm flex items-center gap-2">
                             <ShieldCheck size={12} />
                             Operational Verified
                          </span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(svc.id, svc.status); }}
                            className={`p-4 rounded-2xl transition-all duration-500 shadow-lg active:scale-90 group/toggle border ${svc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white' : 'bg-[#FEFAF6] text-[#DAC0A3] border-[#EADBC8] hover:bg-[#102C57] hover:text-[#FEFAF6]'}`}
                            title={svc.status === 'Active' ? 'Deactivate Protocol' : 'Activate Protocol'}
                          >
                            <Power size={20} className="group-hover/toggle:rotate-45 transition-transform" />
                          </button>
                       </div>
                    </div>

                    <div className="relative z-10 space-y-3 mb-10">
                       <div className="flex items-center gap-3">
                          <ShieldCheck size={14} className="text-[#DAC0A3]" />
                          <span className="text-[10px] font-black uppercase text-[#DAC0A3] tracking-[0.3em]">Verified Service</span>
                       </div>
                       <h3 className="text-xl font-black text-[#102C57] uppercase tracking-tighter group-hover:translate-x-2 transition-transform duration-500 leading-tight">{svc.service_name}</h3>
                       <p className="text-[10px] font-medium text-[#102C57]/40 uppercase tracking-[0.2em]">{svc.category_name} Intelligence</p>
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-[#FEFAF6] relative z-10 mt-auto">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#FEFAF6] flex items-center justify-center text-[#102C57] font-black shadow-inner group-hover:bg-[#102C57] group-hover:text-[#FEFAF6] group-hover:shadow-2xl transition-all duration-700">
                             <DollarSign size={18} />
                          </div>
                          <div>
                             <p className="text-lg font-black text-[#102C57] tracking-tight">{(svc.price || 0).toLocaleString()} L.E</p>
                             <p className="text-[9px] font-black uppercase text-[#DAC0A3] tracking-widest leading-none mt-1 opacity-60">Intelligence Cost</p>
                          </div>
                       </div>
                       <button className="h-14 w-14 bg-[#FEFAF6] text-[#102C57] hover:bg-[#102C57] hover:text-[#FEFAF6] rounded-2xl transition-all duration-700 group-hover:scale-110 active:scale-90 border border-[#EADBC8]/30 shadow-sm hover:shadow-black/5 flex items-center justify-center">
                          <ArrowUpRight size={22} className="group-hover:rotate-45 transition-transform" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[5rem] border border-[#EADBC8] shadow-3xl overflow-hidden group hover:shadow-black/5 transition-all duration-1000 relative">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#102C57]/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-1000 opacity-0 group-hover:opacity-100"></div>
                <table className="w-full text-left">
                  <thead className="bg-[#102C57] text-[#FEFAF6]">
                    <tr>
                      <th className="px-12 py-10 text-[12px] font-black uppercase tracking-[0.3em]">Operational Node</th>
                      <th className="px-12 py-10 text-[12px] font-black uppercase tracking-[0.3em]">Cost Protocol</th>
                      <th className="px-12 py-10 text-center text-[12px] font-black uppercase tracking-[0.3em]">Integration Status</th>
                      <th className="px-12 py-10 text-right text-[12px] font-black uppercase tracking-[0.3em]">Command Center</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FEFAF6]">
                    {services.map((svc) => (
                      <tr key={svc.id} className="group/row hover:bg-[#FEFAF6]/50 transition-all duration-700 cursor-pointer">
                        <td className="px-12 py-10">
                          <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-[1.25rem] bg-[#102C57] text-[#FEFAF6] flex items-center justify-center font-black text-xs shadow-2xl relative overflow-hidden transform group-hover/row:scale-110 transition-transform">
                               {svc.image ? (
                                 <img src={`https://joker-hm0k.onrender.com/images/${svc.image}`} alt="" className="w-full h-full object-cover" />
                               ) : svc.service_name[0]}
                               <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                            <div>
                               <h3 className="text-md font-black text-[#102C57] uppercase tracking-tight group-hover/row:translate-x-2 transition-transform duration-500 opacity-90">{svc.service_name}</h3>
                               <p className="text-[10px] font-black text-[#DAC0A3] uppercase tracking-widest mt-1 opacity-60">HUB: {svc.category_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-10">
                           <div className="flex items-center gap-4 group/cost">
                              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black border border-orange-100 group-hover/cost:bg-orange-600 group-hover/cost:text-white transition-all"><DollarSign size={16} /></div>
                              <p className="text-md font-black text-[#102C57]">{(svc.price || 0).toLocaleString()} L.E</p>
                           </div>
                        </td>
                        <td className="px-12 py-10 text-center">
                           <div className="flex items-center justify-center gap-4">
                              <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-3 transition-all duration-500 shadow-sm ${
                                svc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-[#FEFAF6] text-[#DAC0A3] border-[#EADBC8]'
                              }`}>
                                 <Zap size={12} className={svc.status === 'Active' ? 'animate-pulse' : ''} />
                                 {svc.status}
                              </span>
                           </div>
                        </td>
                        <td className="px-12 py-10 text-right">
                           <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(svc.id, svc.status); }}
                                className={`p-4 rounded-xl transition-all duration-500 shadow-md transform active:scale-90 hover:scale-110 border ${svc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-[#FEFAF6] text-[#DAC0A3] border-[#EADBC8]'}`}
                              >
                                <Power size={18} />
                              </button>
                              <button className="p-4 bg-[#FEFAF6] text-[#102C57] hover:bg-[#102C57] hover:text-[#FEFAF6] rounded-xl transition-all duration-500 hover:scale-110 active:scale-90 border border-[#EADBC8]/40 shadow-md">
                                 <ArrowUpRight size={18} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyServicesPage;