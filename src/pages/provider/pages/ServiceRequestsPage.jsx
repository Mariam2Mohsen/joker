import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import Sidebar from "../components/Sidebar";
import { ClipboardList, Filter, Search, Calendar, DollarSign, CheckCircle2, XCircle, Clock, ArrowUpRight, ShieldAlert, Zap, Layers, Trash2, RotateCcw } from 'lucide-react';
import toast from "react-hot-toast";

const ServiceRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("authToken");

  const fetchServiceRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/provider/services/service-requests?status=requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
      toast.error("Failed to sync intelligence history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRequests();
  }, [token]);

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === "ALL" ? true : req.status === filter;
    const matchesSearch = req.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.category_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FEFAF6] font-sans selection:bg-[#102C57] selection:text-white">
      <TopHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-10 overflow-auto scroll-smooth relative">
          {/* Subtle Ambient Background Mesh */}
          <div className="absolute right-0 bottom-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,#EADBC8_0,transparent_15%)] opacity-30 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 items-start space-y-12">
            
            {/* Intelligence Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-12 bg-white rounded-[4rem] border border-[#EADBC8]/40 shadow-2xl relative overflow-hidden group/header transition-all duration-700 hover:shadow-black/5">
               <div className="absolute top-0 right-0 w-[50%] h-full bg-[linear-gradient(225deg,rgba(16,44,87,0.02)_0%,transparent_50%)] pointer-events-none skew-x-[-15deg] translate-x-[20%]"></div>
               <div>
                  <h1 className="text-5xl font-black text-[#102C57] tracking-tighter mb-4 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-[#102C57] text-[#FEFAF6] flex items-center justify-center font-black shadow-2xl group-hover/header:rotate-[-12deg] transition-transform duration-700">
                       <ClipboardList size={28} />
                    </div>
                    Intelligence Requests History
                  </h1>
                  <p className="text-[11px] font-black uppercase text-[#DAC0A3] tracking-[0.3em] flex items-center gap-3 mt-4 ml-1">
                    <span className="w-2 h-2 bg-amber-500 rounded-full shadow-sm shadow-amber-500/50 animate-pulse"></span>
                    Operational Queue: Pending Intelligence
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10 bg-[#FEFAF6] p-3 rounded-[2.5rem] border border-[#EADBC8]/40 hover:shadow-lg transition-all duration-500">
                  <div className="relative group/search w-full sm:w-64">
                    <input 
                       type="text" 
                       placeholder="Find intelligence ID..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full h-14 pl-12 pr-6 bg-white border-2 border-transparent rounded-2xl outline-none text-[11px] font-black uppercase tracking-widest text-[#102C57] placeholder:text-[#102C57]/20 focus:border-[#102C57]/40 transition-all shadow-inner"
                    />
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DAC0A3]/60 group-focus-within/search:text-[#102C57] transition-colors" />
                  </div>
                  
                  <div className="relative group/filter w-full sm:w-52">
                    <select 
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full h-14 pl-12 pr-10 bg-white border-2 border-transparent rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest text-[#102C57] appearance-none cursor-pointer focus:border-[#102C57]/40 transition-all hover:bg-[#FEFAF6] shadow-sm"
                    >
                      <option value="ALL">LOG STATUS: ALL</option>
                      <option value="Pending">LOG STATUS: PENDING</option>
                      <option value="Rejected">LOG STATUS: REJECTED</option>
                    </select>
                    <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DAC0A3]/60 group-hover/filter:text-[#102C57] transition-colors" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#102C57]/20 group-hover/filter:text-[#102C57] transition-colors opacity-50"><RotateCcw size={14} /></div>
                  </div>
               </div>
            </div>

            {/* Premium Table Content */}
            <div className="bg-white rounded-[5rem] border border-[#EADBC8] shadow-3xl overflow-hidden group hover:shadow-black/5 transition-all duration-1000 relative">
               <div className="absolute top-0 left-0 w-96 h-96 bg-[#102C57]/5 rounded-full blur-[120px] pointer-events-none transition-opacity duration-1000 opacity-0 group-hover:opacity-100"></div>
               <div className="overflow-x-auto selection:bg-[#DAC0A3]/50 selection:text-[#102C57]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#102C57] text-[#FEFAF6]">
                      <th className="px-12 py-10 text-left text-[11px] font-black uppercase tracking-[0.4em] border-b border-white/5">Operational Request</th>
                      <th className="px-12 py-10 text-left text-[11px] font-black uppercase tracking-[0.4em] border-b border-white/5">Price Intelligence</th>
                      <th className="px-12 py-10 text-center text-[11px] font-black uppercase tracking-[0.4em] border-b border-white/5">System Protocol Status</th>
                      <th className="px-12 py-10 text-center text-[11px] font-black uppercase tracking-[0.4em] border-b border-white/5">Sync Timestamp</th>
                      <th className="px-12 py-10 text-right text-[11px] font-black uppercase tracking-[0.4em] border-b border-white/5">Action Center</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FEFAF6]">
                    {loading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan="5" className="px-12 py-12">
                            <div className="h-12 bg-[#FEFAF6] rounded-2xl w-full opacity-60"></div>
                          </td>
                        </tr>
                      ))
                    ) : filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-12 py-48 text-center bg-white">
                          <div className="flex flex-col items-center gap-8 group/empty">
                            <div className="w-28 h-28 rounded-[3.5rem] bg-[#FEFAF6] border-2 border-[#DAC0A3]/20 flex items-center justify-center text-[#DAC0A3]/40 group-hover/empty:scale-110 group-hover/empty:rotate-12 transition-all duration-700 shadow-inner">
                               <Layers size={48} strokeWidth={1} />
                            </div>
                            <p className="text-[14px] font-black uppercase text-[#102C57]/40 tracking-[0.4em] group-hover/empty:tracking-[0.6em] transition-all duration-1000">No Intelligence Logged</p>
                            <p className="text-[9px] font-black uppercase text-[#DAC0A3] tracking-widest leading-none opacity-60">Initialize new operational node to begin logging.</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredRequests.map((req) => (
                      <tr key={req.id} className="group/row hover:bg-[#FEFAF6]/50 transition-all duration-700 cursor-pointer border-l-8 border-transparent hover:border-[#102C57]">
                        <td className="px-12 py-10">
                          <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-[1.25rem] bg-[#102C57] text-[#FEFAF6] flex items-center justify-center font-black text-xs shadow-2xl relative overflow-hidden group-hover/row:scale-110 transition-transform duration-500">
                               {req.image ? (
                                 <img src={`http://localhost:5000/images/${req.image}`} alt="" className="w-full h-full object-cover" />
                               ) : req.service_name[0]}
                            </div>
                            <div>
                               <p className="text-sm font-black text-[#102C57] uppercase tracking-tight group-hover/row:translate-x-2 transition-transform duration-500 mb-1">{req.service_name}</p>
                               <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-black text-[#DAC0A3] uppercase tracking-widest">{req.category_name} Intelligence</span>
                                  <div className="w-1 h-1 bg-[#EADBC8] rounded-full"></div>
                                  <div className="flex items-center gap-1.5 transform group-hover/row:scale-110 transition-transform">
                                     <Zap size={10} className="text-[#DAC0A3]" />
                                     <span className="text-[9px] font-black tracking-widest uppercase text-[#102C57]/30">Queue: Active</span>
                                  </div>
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-10">
                           <div className="flex items-center gap-4 group/cost">
                              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-md border border-orange-100 group-hover/cost:bg-orange-600 group-hover/cost:text-white transition-all duration-500"><DollarSign size={16} /></div>
                              <div>
                                 <p className="text-md font-black text-[#102C57] tracking-tight">{(req.price || 0).toLocaleString()} L.E</p>
                                 <p className="text-[8px] font-black uppercase text-[#DAC0A3] tracking-[0.2em] leading-none mt-1">Operational Cost</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-12 py-10">
                           <div className="flex justify-center">
                              <span className={`px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-3 shadow-sm border transition-all duration-700 ${
                                req.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-100 hover:shadow-amber-500/10" :
                                "bg-red-50 text-red-600 border-red-100 hover:shadow-red-500/10"
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  req.status === "Pending" ? "bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                                  "bg-red-500"
                                }`}></div>
                                {req.status}
                              </span>
                           </div>
                        </td>
                        <td className="px-12 py-10 text-center">
                           <div className="text-center group/date inline-flex flex-col items-center">
                              <div className="flex items-center justify-center gap-3 text-[#102C57] mb-1.5 bg-[#FEFAF6] px-5 py-2 rounded-2xl border border-[#EADBC8]/40 shadow-inner group-hover/row:shadow-md transition-all">
                                 <Calendar size={14} className="text-[#DAC0A3]" />
                                 <p className="text-[11px] font-black tracking-tight">{new Date(req.submitted_on).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center justify-center gap-2 text-[#DAC0A3] opacity-40 group-hover/row:opacity-100 transition-opacity">
                                 <Clock size={10} />
                                 <p className="text-[8px] font-black uppercase tracking-widest leading-none mt-0.5">Integration: Standard</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-12 py-10 text-right">
                           <div className="flex items-center justify-end gap-3">
                              <button className="p-4 bg-[#FEFAF6] text-[#DAC0A3] hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-500 hover:scale-110 border border-[#EADBC8]/30 group/trash active:scale-90">
                                 <Trash2 size={18} className="group-hover/trash:animate-bounce" />
                              </button>
                              <button className="p-4 bg-[#FEFAF6] text-[#102C57] hover:bg-[#102C57] hover:text-[#FEFAF6] rounded-xl transition-all duration-500 hover:scale-110 active:scale-95 group/act relative overflow-hidden border border-[#EADBC8]/30 shadow-md">
                                 <ArrowUpRight size={20} className="relative z-10 group-hover/act:rotate-45 transition-transform" />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ServiceRequestsPage;