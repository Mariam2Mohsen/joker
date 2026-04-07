import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const API = "https://joker-hm0k.onrender.com/api/admin";

const PendingProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); 
      const res = await axios.get(`${API}/providers/pending`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProviders(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 401) {
        Swal.fire("Unauthorized", "Session expired, please login again", "error");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProviders(); 
  }, []);

  const handleStatusUpdate = async (id, newStatus, name) => {
    const result = await Swal.fire({
      title: `Confirm ${newStatus}`,
      text: `Update status for ${name} to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d254a",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Confirm"
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        
     
        await axios.patch(`${API}/providers/${id}/status`, 
          { status: newStatus },
          { 
            headers: { Authorization: `Bearer ${token}` } 
          }
        );
        
    
        setProviders(prev => prev.map(p => 
          p.Users_id === id ? { ...p, Status: newStatus } : p
        ));

        Swal.fire("Success", `Account ${newStatus} successfully`, "success");
      } catch (err) {
        console.error("Update Error:", err);
        Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
      }
    }
  };


  const filteredData = providers.filter(p => {
    const nameMatch = (p.Name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const currentStatus = (p.Status || "").toUpperCase();
    const targetFilter = statusFilter.toUpperCase();
    const statusMatch = targetFilter === "ALL" || currentStatus === targetFilter;
    
    return nameMatch && statusMatch;
  });

  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredData.length, totalPages, currentPage]);

  return (
    <div className="p-10 bg-[#F8FAFC] min-h-screen font-sans text-[#0d254a]">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0d254a] border-l-4 border-[#0d254a] pl-4">
          Pending Providers Management
        </h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm font-semibold bg-white outline-none focus:ring-1 focus:ring-[#0d254a]"
            >
              <option value="ALL">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Rejected">Rejected</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="border border-gray-300 rounded-l-md px-4 py-2 text-sm w-72 outline-none focus:border-[#0d254a]"
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
            <div className="bg-white border border-l-0 border-gray-300 px-4 py-2.5 rounded-r-md">
              <FaSearch className="text-gray-400 text-sm" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0d254a] text-white text-[13px] font-bold uppercase tracking-wider">
                <th className="p-5 border-r border-white/10">Provider Name</th>
                <th className="p-5 border-r border-white/10">Join Date</th>
                <th className="p-5 border-r border-white/10">Services</th>
                <th className="p-5 border-r border-white/10">Contact</th>
                <th className="p-5 border-r border-white/10 text-center">Status</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-base">
              {loading ? (
                <tr><td colSpan="6" className="p-10 text-center text-gray-500 font-bold animate-pulse">Loading data...</td></tr>
              ) : (
                currentItems.map((p) => (
                  <tr key={p.Users_id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                    <td className="p-5 font-bold text-[#0d254a]">{p.Name}</td>
                    <td className="p-5 text-gray-600 text-sm">{p.Joining_Date ? new Date(p.Joining_Date).toLocaleDateString() : 'N/A'}</td>
                    
                    <td className="p-5">
                      <div className="flex flex-wrap gap-1 max-w-[250px]">
                        {p.Service_Names && p.Service_Names !== 'No Services' ? (
                          p.Service_Names.split(',').map((service, index) => (
                            <span key={index} className="bg-blue-50 text-[#0d254a] px-2 py-1 rounded text-[11px] font-bold border border-blue-100">
                              {service.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic text-xs">No services</span>
                        )}
                      </div>
                    </td>

                    <td className="p-5 text-gray-600 font-medium text-sm">{p.Contact_Number}</td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-tighter ${
                        p.Status === 'Active' ? 'bg-green-100 text-green-700' : 
                        p.Status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.Status}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => handleStatusUpdate(p.Users_id, "Active", p.Name)}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-[#0d254a] hover:text-white transition-all text-xs font-bold shadow-sm"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(p.Users_id, "Inactive", p.Name)}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-red-600 hover:text-white transition-all text-xs font-bold shadow-sm"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/pending-providers/${p.Users_id}`)}
                          className="p-2 text-[#0d254a] hover:bg-gray-100 rounded-full transition-all"
                        >
                          <FaEye size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loading && currentItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500 italic">No providers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-sm font-semibold text-gray-500">
          <div className="flex items-center gap-3">
            <span>Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => {setEntriesPerPage(Number(e.target.value)); setCurrentPage(1);}}
              className="border border-gray-300 rounded px-2 py-1 outline-none bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-30"
              >
                <FaChevronLeft size={12} />
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-30"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingProviders;