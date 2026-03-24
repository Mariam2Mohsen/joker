import { Edit3, Trash2, Plus, Search, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const CategoryList = () => {
  const [activeActionId, setActiveActionId] = useState(null);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Petra', description: 'Programing', status: 'approved' },
    { id: 2, name: 'Petra', description: 'Programing', status: 'approved' },
    { id: 3, name: 'Petra', description: 'Programing', status: 'rejected' },
    { id: 4, name: 'Marketing', description: 'Ads', status: 'approved' },
    { id: 5, name: 'Design', description: 'UI/UX', status: 'approved' },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Click outside to close action menu
  useEffect(() => {
    const handleClickOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredData = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const toggleStatus = (id) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, status: cat.status === 'approved' ? 'rejected' : 'approved' } : cat
    ));
  };

  const removeCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <div className="p-4 md:p-8 bg-[#FEFAF6] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#102C57] uppercase tracking-tight">Category management</h2>
          <p className="text-[#DAC0A3] text-[10px] font-bold uppercase tracking-widest mt-1">Management / Categories</p>
        </div>

        <Link to="/admin/category/add" className="bg-[#102C57] text-white px-8 py-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase shadow-xl shadow-[#102C57]/20 hover:bg-[#1a3d75] transition-all tracking-widest">
          <Plus size={16} strokeWidth={3} /> Add New Category
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-[#EADBC8] overflow-hidden">
        <div className="p-6 flex flex-wrap justify-between items-center gap-4 bg-white border-b border-[#FEFAF6]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[#102C57] uppercase tracking-widest opacity-40">Filter Categories</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10 py-2.5 border border-[#EADBC8] rounded-xl text-xs outline-none w-64 bg-[#FEFAF6] focus:ring-2 focus:ring-[#102C57]/5 focus:border-[#102C57] transition-all"
            />
            <Search className="absolute right-3 top-3 text-[#DAC0A3]" size={14} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#102C57] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="py-5 px-8">Category Name</th>
                <th className="py-5 px-8 text-center text-xs font-black">Reference / Description</th>
                <th className="py-5 px-8 text-center">Status</th>
                <th className="py-5 px-8 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEFAF6]">
              {currentItems.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#FEFAF6]/50 transition-colors group">
                  <td className="py-5 px-8 text-[#102C57] text-xs font-black">{cat.name}</td>
                  <td className="py-5 px-8 text-slate-500 text-[11px] text-center font-bold">{cat.description}</td>
                  <td className="py-5 px-8">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleStatus(cat.id)}
                        className={`w-11 h-5 flex items-center rounded-full p-1 transition-all duration-300 ${cat.status === 'approved' ? 'bg-green-500 shadow-sm shadow-green-100' : 'bg-[#EADBC8]'
                          }`}
                      >
                        <div className={`w-3.5 h-3.5 bg-white rounded-full transition-all shadow-sm ${cat.status === 'approved' ? 'translate-x-5' : 'translate-x-0'
                          }`}></div>
                      </button>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-center">
                    <div className="relative flex justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionId(activeActionId === cat.id ? null : cat.id);
                        }}
                        className={`p-2 rounded-lg transition-all ${activeActionId === cat.id ? 'bg-[#102C57] text-white shadow-lg' : 'bg-[#FEFAF6] text-[#DAC0A3] hover:text-[#102C57] border border-[#EADBC8]'}`}
                      >
                        <Settings size={14} className={activeActionId === cat.id ? 'animate-spin-slow' : ''} />
                      </button>

                      {activeActionId === cat.id && (
                        <div className="absolute right-full mr-2 top-0 bg-white rounded-xl shadow-2xl border border-[#EADBC8] overflow-hidden z-[100] min-w-[120px] animate-scaleIn">
                          <button className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-[#102C57] hover:bg-[#FEFAF6] uppercase tracking-widest text-left transition-colors">
                            <Edit3 size={12} className="text-[#DAC0A3]" /> Edit
                          </button>
                          <button
                            onClick={() => removeCategory(cat.id)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-red-500 hover:bg-red-50 uppercase tracking-widest text-left border-t border-[#FEFAF6] transition-colors"
                          >
                            <Trash2 size={12} className="text-red-300" /> Remove
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


        <div className="p-6 flex justify-between items-center bg-white border-t border-[#F2EBE4]">
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
              className="text-slate-300 hover:text-[#102C57]"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-md text-[11px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#102C57] text-white' : 'text-slate-400 hover:bg-[#FDFCFB]'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="text-slate-300 hover:text-[#102C57]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;