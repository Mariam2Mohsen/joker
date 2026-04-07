import { Edit3, Trash2, Plus, Search, ChevronLeft, ChevronRight, Settings, ShieldAlert } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SubCategoryList = () => {
  const navigate = useNavigate();
  const [activeActionId, setActiveActionId] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ show: false, subCategoryId: null });


  const getAuthHeaders = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });


  const fetchSubCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://joker-hm0k.onrender.com/api/subcategories', getAuthHeaders());
      if (res.data.success) {
        setSubCategories(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load sub-categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubCategories();


    const handleClickOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [fetchSubCategories]);


  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const res = await axios.patch(`https://joker-hm0k.onrender.com/api/subcategories/${id}/status`,
        { status: newStatus },
        getAuthHeaders()
      );
      if (res.data.success) {
        toast.success(res.data.message || "Status updated");
        fetchSubCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };


  const confirmDelete = async () => {
    try {
      const res = await axios.delete(`https://joker-hm0k.onrender.com/api/subcategories/${deleteModal.subCategoryId}`, getAuthHeaders());
      if (res.data.success) {
        toast.success("Sub-category removed successfully");
        setSubCategories(prev => prev.filter(item => item.id !== deleteModal.subCategoryId));
        setDeleteModal({ show: false, subCategoryId: null });
       
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };


  const filteredData = subCategories.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  return (
    <div className="p-4 md:p-8 bg-[#FEFAF6] min-h-screen font-sans">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#102C57] uppercase tracking-tight">Sub Category management</h2>
          <p className="text-[#DAC0A3] text-[10px] font-bold uppercase tracking-widest mt-1">Management / Sub Categories</p>
        </div>
        <Link to="/admin/subcategory/add" className="bg-[#102C57] text-white px-8 py-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase shadow-xl shadow-[#102C57]/20 hover:bg-[#1a3d75] transition-all tracking-widest">
          <Plus size={16} strokeWidth={3} /> Add New Sub-Category
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-[#EADBC8] overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 flex flex-wrap justify-between items-center gap-4 bg-white border-b border-[#FEFAF6]">
          <div className="text-[10px] font-black text-[#102C57]/40 uppercase tracking-widest">
            {loading ? 'Fetching...' : `Total: ${filteredData.length} Items`}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-4 pr-10 py-2.5 border border-[#EADBC8] rounded-xl text-xs outline-none w-64 bg-[#FEFAF6] focus:ring-2 focus:ring-[#102C57]/5 focus:border-[#102C57] transition-all"
            />
            <Search className="absolute right-3 top-3 text-[#DAC0A3]" size={14} />
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#102C57] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="py-5 px-8">Sub Category Name</th>
                <th className="py-5 px-8 text-center uppercase">Parent Category</th>
                <th className="py-5 px-8 text-center uppercase">Status</th>
                <th className="py-5 px-8 text-center uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEFAF6]">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center text-[#DAC0A3] text-[10px] font-black uppercase tracking-widest animate-pulse">Loading Data...</td></tr>
              ) : currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#FEFAF6]/50 transition-colors group">
                  <td className="py-5 px-8 text-[#102C57] text-xs font-black">{item.name}</td>
                  <td className="py-5 px-8 text-slate-500 text-[10px] text-center font-bold uppercase tracking-tight">
                    {item.category_name || 'N/A'}
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleStatus(item.id, item.status)}
                        className={`w-11 h-5 flex items-center rounded-full p-1 transition-all duration-300 ${item.status === 'active' ? 'bg-green-500' : 'bg-[#EADBC8]'}`}
                      >
                        <div className={`w-3.5 h-3.5 bg-white rounded-full transition-all shadow-sm ${item.status === 'active' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-center relative overflow-visible">
                    <div className="flex justify-center items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionId(prev => prev === item.id ? null : item.id);
                        }}
                        className={`p-2 rounded-lg transition-all z-10 ${activeActionId === item.id ? 'bg-[#102C57] text-white' : 'bg-[#FEFAF6] text-[#DAC0A3] border border-[#EADBC8]'}`}
                      >
                        <Settings size={14} className={activeActionId === item.id ? 'animate-spin-slow' : ''} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeActionId === item.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-full mr-2 top-0 -translate-y-1/2 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-[#EADBC8] overflow-hidden z-[999] min-w-[150px] animate-in fade-in zoom-in duration-200"
                        >
                          <button
                            onClick={() => { setActiveActionId(null); navigate(`/admin/subcategory/edit/${item.id}`); }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-[#102C57] hover:bg-[#FEFAF6] uppercase tracking-widest text-left"
                          >
                            <Edit3 size={12} className="text-[#DAC0A3]" /> Edit Item
                          </button>
                          <button
                            onClick={() => { setActiveActionId(null); setDeleteModal({ show: true, subCategoryId: item.id }); }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-red-500 hover:bg-red-50 uppercase tracking-widest text-left border-t border-[#FEFAF6]"
                          >
                            <Trash2 size={12} className="text-red-300" /> Remove Item
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer - Pagination */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center bg-white border-t border-[#F2EBE4] gap-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 border border-[#EADBC8] rounded bg-white text-[#102C57] outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>Entries</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="text-slate-300 hover:text-[#102C57] disabled:opacity-20">
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-7 h-7 rounded-md text-[11px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#102C57] text-white shadow-md' : 'text-slate-400'}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="text-slate-300 hover:text-[#102C57] disabled:opacity-20">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-[#102C57]/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full shadow-2xl border border-[#EADBC8] text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-red-500 border border-red-100">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-[#102C57] text-2xl font-black mb-4 uppercase tracking-tight">Remove Sub-Category?</h3>
            <p className="text-[#DAC0A3] text-[10px] font-black uppercase tracking-[0.1em] mb-10 leading-relaxed">This action cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal({ show: false, subCategoryId: null })} className="flex-1 py-4 rounded-xl bg-[#FEFAF6] border border-[#EADBC8] text-[#102C57] font-black text-[10px] uppercase">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase shadow-lg shadow-red-200">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoryList;