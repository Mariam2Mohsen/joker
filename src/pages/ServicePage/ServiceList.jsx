import React, { useState, useEffect } from 'react';
import { Settings, MoreVertical, Search, Plus, ChevronLeft, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ServiceList = () => {
  const navigate = useNavigate();
  const [activeActionId, setActiveActionId] = useState(null);
  
  // Initial default data
  const defaultServices = [
    { id: 1, name: 'Petra', category: 'Programing', subCategory: 'General', maxPrice: '100', discount: '10%', commissionType: 'Value', commissionValue: '10', status: 'approved' },
    { id: 2, name: 'Web Dev', category: 'Programing', subCategory: 'Custom', maxPrice: '500', discount: '5%', commissionType: 'Percentage', commissionValue: '5', status: 'approved' },
    { id: 3, name: 'Cleaning', category: 'Home Services', subCategory: 'Deep Clean', maxPrice: '150', discount: '15%', commissionType: 'Value', commissionValue: '20', status: 'approved' },
    { id: 4, name: 'Plumbing', category: 'Maintenance', subCategory: 'Repair', maxPrice: '80', discount: '0%', commissionType: 'Fixed', commissionValue: '15', status: 'approved' },
    { id: 5, name: 'Home Renovation', category: 'Renovation', subCategory: 'Custom', maxPrice: '2000', discount: '20%', commissionType: 'Percentage', commissionValue: '10', status: 'approved' },
  ];

  // Initialize from localStorage
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('admin_services');
    return saved ? JSON.parse(saved) : defaultServices;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [bulkAction, setBulkAction] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ show: false, serviceId: null });

  // Sync with localStorage whenever services change
  useEffect(() => {
    localStorage.setItem('admin_services', JSON.stringify(services));
  }, [services]);

  // Click outside to close action menu
  useEffect(() => {
    const handleClickOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter logic
  const filteredData = services.filter(service => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch =
      service.name.toLowerCase().includes(searchStr) ||
      service.category.toLowerCase().includes(searchStr) ||
      (service.subCategory && service.subCategory.toLowerCase().includes(searchStr));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "approved" && (service.status === "approved" || service.status === "Active")) ||
      (statusFilter === "rejected" && (service.status === "rejected" || service.status === "Inactive"));

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const toggleStatus = (id) => {
    setServices(services.map(service => {
      if (service.id === id) {
        const isCurrentlyActive = service.status === 'approved' || service.status === 'Active';
        return { ...service, status: isCurrentlyActive ? 'Inactive' : 'Active' };
      }
      return service;
    }));
    toast.info("Status updated successfully");
  };

  const confirmDelete = () => {
    setServices(services.filter(s => s.id !== deleteModal.serviceId));
    setDeleteModal({ show: false, serviceId: null });
    toast.success("Service removed from records");
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map(item => item.id));
    }
  };

  const handleBulkApply = () => {
    if (selectedIds.length === 0) {
      toast.warning("Please select items first");
      return;
    }
    if (!bulkAction) {
      toast.warning("Please select an action");
      return;
    }

    if (bulkAction === 'delete') {
      setServices(services.filter(s => !selectedIds.includes(s.id)));
      toast.success(`${selectedIds.length} items deleted`);
    } else if (bulkAction === 'activate') {
      setServices(services.map(s => selectedIds.includes(s.id) ? { ...s, status: 'Active' } : s));
      toast.success(`${selectedIds.length} items activated`);
    } else if (bulkAction === 'deactivate') {
      setServices(services.map(s => selectedIds.includes(s.id) ? { ...s, status: 'Inactive' } : s));
      toast.success(`${selectedIds.length} items deactivated`);
    }
    
    setSelectedIds([]);
    setBulkAction("");
  };

  return (
    <div className="p-4 md:p-8 bg-[#FEFAF6] min-h-screen">
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
        <div className="p-6 flex flex-wrap items-center gap-4 bg-white border-b border-[#FEFAF6] justify-between">
          <div className="flex items-center gap-2">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="border border-[#EADBC8] rounded-xl px-4 py-2 text-[10px] font-black outline-none text-[#102C57] bg-[#FEFAF6] min-w-[140px] uppercase tracking-widest"
            >
              <option value="">Bulk Action</option>
              <option value="activate">Activate</option>
              <option value="deactivate">Deactivate</option>
              <option value="delete">Delete</option>
            </select>
            <button 
              onClick={handleBulkApply}
              className="bg-[#102C57] text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#1a3d75] transition-all shadow-sm"
            >
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
              <option value="approved">Active</option>
              <option value="rejected">Inactive</option>
            </select>

            <div className="relative flex-1 max-w-[240px]">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-4 pr-10 py-2 border border-[#EADBC8] rounded-xl text-xs outline-none bg-[#FEFAF6] focus:ring-2 focus:ring-[#102C57]/5 transition-all placeholder:text-[#DAC0A3]/50"
              />
              <Search className="absolute right-3 top-2 text-[#DAC0A3]" size={14} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
              {currentItems.length > 0 ? currentItems.map((service, index) => (
                <tr key={service.id} className="hover:bg-[#FEFAF6]/50 transition-colors group">
                  <td className="py-5 px-6 text-center border-r border-[#FEFAF6]">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(service.id)}
                      onChange={() => toggleSelect(service.id)}
                      className="accent-[#102C57] w-3.5 h-3.5 cursor-pointer"
                    />
                  </td>
                  <td className="py-5 px-4 text-center text-slate-400 text-[10px] font-bold">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="text-[#102C57] text-xs font-black">{service.name}</span>
                      <span className="text-[9px] text-[#DAC0A3] font-bold uppercase tracking-wider">ID: SVR-{service.id.toString().padStart(4, '0')}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="bg-[#FEFAF6] px-3 py-1 rounded-full border border-[#EADBC8] text-[9px] font-black text-[#102C57] uppercase whitespace-nowrap">{service.category}</span>
                  </td>
                  <td className="py-5 px-4 text-slate-400 text-[10px] text-center font-bold uppercase">{service.subCategory || '—'}</td>
                  <td className="py-5 px-4 text-[#102C57] text-xs text-center font-black">${service.maxPrice || '0'}</td>
                  <td className="py-5 px-4 text-red-500 text-[10px] text-center font-black italic">{service.discount}</td>
                  <td className="py-5 px-4 text-slate-500 text-[9px] text-center font-black uppercase tracking-tighter">
                    {service.commissionValue} <span className="text-[7px] text-[#DAC0A3]">{service.commissionType}</span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleStatus(service.id)}
                        className={`w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300 ${
                          (service.status === 'approved' || service.status === 'Active') ? 'bg-green-500 shadow-sm shadow-green-100' : 'bg-[#EADBC8]'
                        }`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-all shadow-sm ${
                          (service.status === 'approved' || service.status === 'Active') ? 'translate-x-5' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <div className="relative flex justify-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionId(activeActionId === service.id ? null : service.id);
                        }}
                        className={`p-2 rounded-lg transition-all ${activeActionId === service.id ? 'bg-[#102C57] text-white shadow-lg' : 'bg-[#FEFAF6] text-[#DAC0A3] hover:text-[#102C57] border border-[#EADBC8]'}`}
                      >
                        <Settings size={14} className={activeActionId === service.id ? 'animate-spin-slow' : ''} />
                      </button>

                      {activeActionId === service.id && (
                        <div className="absolute right-full mr-2 top-0 bg-white rounded-xl shadow-2xl border border-[#EADBC8] overflow-hidden z-[100] min-w-[120px] animate-scaleIn">
                          <button 
                            onClick={() => navigate(`/admin/service/edit/${service.id}`)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-[#102C57] hover:bg-[#FEFAF6] uppercase tracking-widest text-left"
                          >
                            <Edit3 size={12} className="text-[#DAC0A3]" /> Edit Item
                          </button>
                          <button 
                            onClick={() => setDeleteModal({ show: true, serviceId: service.id })}
                            className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-red-500 hover:bg-red-50 uppercase tracking-widest text-left border-t border-[#FEFAF6]"
                          >
                            <Trash2 size={12} className="text-red-300" /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="11" className="p-20 text-center text-[#DAC0A3] text-xs font-black uppercase tracking-widest opacity-40">No services found in records.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 flex justify-between items-center bg-white border-t border-[#FEFAF6]">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-[#EADBC8] rounded bg-white text-[#102C57] outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>Entries</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-slate-300 hover:text-[#102C57] disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-md text-[11px] font-black transition-all ${
                  currentPage === i + 1 ? 'bg-[#102C57] text-white shadow-md' : 'text-slate-400 hover:bg-[#FDFCFB]'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="text-slate-300 hover:text-[#102C57] disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {deleteModal.show && (
        <div className="fixed inset-0 bg-[#102C57]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-[#EADBC8] text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <FaExclamationTriangle size={24} />
            </div>
            <h3 className="text-[#102C57] text-xl font-black mb-2">Are you sure you want to delete this service?</h3>
            <div className="flex gap-3 mt-8">
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase shadow-lg shadow-red-200">Delete</button>
              <button onClick={() => setDeleteModal({ show: false, serviceId: null })} className="flex-1 py-3 rounded-xl bg-[#FEFAF6] text-[#102C57] font-black text-[10px] uppercase border border-[#EADBC8]">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
