import React, { useState, useEffect } from 'react';
import { Settings, Search, Plus, ChevronLeft, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ServiceList = () => {
  const navigate = useNavigate();
  const [activeActionId, setActiveActionId] = useState(null);
  
  // States
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [bulkAction, setBulkAction] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ show: false, serviceId: null });

  // Helper to get token
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { 'Authorization': `Bearer ${token}` };
  };

  // 1. Fetch Data from Server
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/services/services', {
        headers: getAuthHeader()
      });

      const data = response.data.data || response.data;
      setServices(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error("Error fetching services:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Admin privileges required.");
      } else {
        toast.error("Failed to load services from server.");
      }
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Close actions menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // 2. Filter Logic
  const filteredData = Array.isArray(services) ? services.filter(service => {
    const searchStr = searchTerm.toLowerCase();
    const name = service.name ? service.name.toLowerCase() : "";
    const matchesSearch = name.includes(searchStr) || String(service.service_id).includes(searchStr);
    const matchesStatus = statusFilter === "ALL" || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // 3. Update Status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await axios.patch(`http://localhost:5000/api/admin/services/services/${id}/status`, 
        { status: newStatus },
        { headers: getAuthHeader() }
      );
      
      setServices(services.map(s => s.service_id === id ? { ...s, status: newStatus } : s));
      toast.success("Service status updated successfully");
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error.response?.data?.message || "Unauthorized: Failed to update status");
    }
  };

  // 4. Delete Service
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/services/services/${deleteModal.serviceId}`, {
        headers: getAuthHeader()
      });
      setServices(services.filter(s => s.service_id !== deleteModal.serviceId));
      setDeleteModal({ show: false, serviceId: null });
      toast.success("Service removed successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Unauthorized: Failed to delete service");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map(item => item.service_id));
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#FEFAF6] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#102C57] uppercase tracking-tight">Service List</h2>
          <p className="text-[#DAC0A3] text-[10px] font-bold uppercase tracking-widest mt-1">Management / Services</p>
        </div>
        <button
          onClick={() => navigate('/admin/service/add')}
          className="bg-[#102C57] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1a3d75] transition-all shadow-xl shadow-[#102C57]/20 flex items-center gap-3"
        >
          <Plus size={16} strokeWidth={3} /> Add New Service
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-[#EADBC8] overflow-hidden">
        {/* Filters */}
        <div className="p-6 flex flex-wrap items-center gap-4 bg-white border-b border-[#FEFAF6] justify-between">
          <div className="flex items-center gap-2">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="border border-[#EADBC8] rounded-xl px-4 py-2 text-[10px] font-black outline-none text-[#102C57] bg-[#FEFAF6] min-w-[140px] uppercase tracking-widest"
            >
              <option value="">Bulk Action</option>
              <option value="delete">Delete</option>
            </select>
            <button className="bg-[#102C57] text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#1a3d75] transition-all shadow-sm">
              Apply
            </button>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end min-w-[300px]">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="border border-[#EADBC8] rounded-xl px-4 py-2 text-[10px] font-black outline-none text-[#102C57] bg-[#FEFAF6] uppercase tracking-widest"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="relative flex-1 max-w-[240px]">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-4 pr-10 py-2 border border-[#EADBC8] rounded-xl text-xs outline-none bg-[#FEFAF6] focus:ring-2 focus:ring-[#102C57]/5 transition-all"
              />
              <Search className="absolute right-3 top-2 text-[#DAC0A3]" size={14} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#102C57] text-white text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="py-5 px-6 text-center w-10 border-r border-white/5">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === currentItems.length && currentItems.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-[#DAC0A3] w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-5 px-4 text-center w-10 opacity-50">#</th>
                <th className="py-5 px-6">Service Name</th>
                <th className="py-5 px-4 text-center">Category</th>
                <th className="py-5 px-4 text-center">Sub Category</th>
                <th className="py-5 px-4 text-center">Price</th>
                <th className="py-5 px-4 text-center">Discount</th>
                <th className="py-5 px-4 text-center">Commission</th>
                <th className="py-5 px-4 text-center">Status</th>
                <th className="py-5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEFAF6]">
              {loading ? (
                <tr><td colSpan="10" className="p-10 text-center font-bold text-[#102C57]">Loading secure data...</td></tr>
              ) : currentItems.length > 0 ? currentItems.map((service, index) => {
                const displayPrice = service.pricing && service.pricing.length > 0 
                  ? service.pricing[0].max_price 
                  : "0.00";

                return (
                  <tr key={service.service_id} className="hover:bg-[#FEFAF6]/50 transition-colors group">
                    <td className="py-5 px-6 text-center border-r border-[#FEFAF6]">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(service.service_id)}
                        onChange={() => toggleSelect(service.service_id)}
                        className="accent-[#102C57] w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-5 px-4 text-center text-slate-400 text-[10px] font-bold">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col">
                        <span className="text-[#102C57] text-xs font-black">{service.name}</span>
                        <span className="text-[9px] text-[#DAC0A3] font-bold uppercase tracking-wider">
                          ID: SVR-{String(service.service_id).padStart(4, '0')}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="bg-white px-3 py-1 rounded-full border border-[#EADBC8] text-[9px] font-black text-[#102C57] uppercase tracking-tighter">
                        {service.category_name}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-center text-[#DAC0A3] text-[10px] font-bold uppercase italic">
                      {service.sub_category_name || `Sub ${service.sub_category_id}`}
                    </td>
                    <td className="py-5 px-4 text-[#102C57] text-xs text-center font-black">
                      ${displayPrice}
                    </td>
                    <td className="py-5 px-4 text-red-500 text-[10px] text-center font-black">
                      {service.discount}%
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <span className="text-[#102C57] text-[10px] font-black">{service.commission_value}</span>
                        <span className="text-[#DAC0A3] text-[8px] font-bold uppercase">{service.commission_type}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => toggleStatus(service.service_id, service.status)}
                          className={`w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300 ${
                            service.status === 'Active' ? 'bg-green-500 shadow-sm' : 'bg-[#EADBC8]'
                          }`}
                        >
                          <div className={`w-3 h-3 bg-white rounded-full transition-all shadow-sm ${
                            service.status === 'Active' ? 'translate-x-5' : 'translate-x-0'
                          }`}></div>
                        </button>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className="relative flex justify-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionId(activeActionId === service.service_id ? null : service.service_id);
                          }}
                          className={`p-2 rounded-lg transition-all ${activeActionId === service.service_id ? 'bg-[#102C57] text-white shadow-lg' : 'bg-[#FEFAF6] text-[#DAC0A3] hover:text-[#102C57] border border-[#EADBC8]'}`}
                        >
                          <Settings size={14} />
                        </button>

                        {activeActionId === service.service_id && (
                          <div className="absolute right-full mr-2 top-0 bg-white rounded-xl shadow-2xl border border-[#EADBC8] overflow-hidden z-[100] min-w-[140px]">
                            <button onClick={() => navigate(`/admin/service/edit/${service.service_id}`)} className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-[#102C57] hover:bg-[#FEFAF6] uppercase tracking-widest text-left">
                              <Edit3 size={12} className="text-[#DAC0A3]" /> Edit Item
                            </button>
                            <button onClick={() => setDeleteModal({ show: true, serviceId: service.service_id })} className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-red-500 hover:bg-red-50 uppercase tracking-widest text-left border-t border-[#FEFAF6]">
                              <Trash2 size={12} className="text-red-300" /> Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              }) : (
                <tr><td colSpan="10" className="p-20 text-center text-[#DAC0A3] text-xs font-black uppercase tracking-widest opacity-40">No services found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 flex justify-between items-center bg-white border-t border-[#FEFAF6]">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase">
            <span>Show</span>
            <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border border-[#EADBC8] rounded bg-white text-[#102C57]">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>Entries</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="text-slate-300 hover:text-[#102C57] disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-7 h-7 rounded-md text-[11px] font-black ${currentPage === i + 1 ? 'bg-[#102C57] text-white shadow-md' : 'text-slate-400 hover:bg-[#FDFCFB]'}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage >= totalPages} className="text-slate-300 hover:text-[#102C57] disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-[#102C57]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-[#EADBC8] text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <FaExclamationTriangle size={24} />
            </div>
            <h3 className="text-[#102C57] text-xl font-black mb-2">Delete Service?</h3>
            <p className="text-[#DAC0A3] text-xs font-bold uppercase tracking-wider mb-8">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase shadow-lg shadow-red-200">Delete</button>
              <button onClick={() => setDeleteModal({ show: false, serviceId: null })} className="flex-1 py-3 rounded-xl bg-[#FEFAF6] text-[#102C57] font-black text-[10px] uppercase border border-[#EADBC8]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;