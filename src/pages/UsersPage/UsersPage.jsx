import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Edit3, Trash2, Plus, Search, ChevronLeft,
  ChevronRight, Settings, ShieldAlert
} from 'lucide-react';

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionId, setActiveActionId] = useState(null);


  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://joker-hm0k.onrender.com/api/users/get_users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();

    const handleClickOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [fetchUsers]);

  const toggleStatus = async (id, currentStatus) => {
    try {

      const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

      await axios.put(`https://joker-hm0k.onrender.com/api/users/user_update/${id}`, {
        account_status: nextStatus
      });

      setUsers(prevUsers => prevUsers.map(user =>
        user.Users_id === id ? { ...user, account_status: nextStatus } : user
      ));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("somthing rong");
    }
  };


  const confirmDelete = async () => {
    try {
      await axios.delete(`https://joker-hm0k.onrender.com/api/users/user_delete/${deleteModal.userId}`);
      setUsers(users.filter(user => user.Users_id !== deleteModal.userId));
      setDeleteModal({ show: false, userId: null });
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      const serverMsg = error.response?.data?.message || "Cannot delete an Admin account";
      toast.error(serverMsg);
      setDeleteModal({ show: false, userId: null });
    }
  };


  const filteredUsers = users.filter(user => {
    const name = user.Full_Name || "";
    const phone = user.phone_number || "";
    const userStatus = user.account_status || "";

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);

    const matchesStatus = statusFilter === "ALL" ||
      (statusFilter === "Active" && userStatus === "Active") ||
      (statusFilter === "Inactive" && userStatus === "Inactive") ||
      (statusFilter === "Pending" && userStatus === "Pending");

    return matchesSearch && matchesStatus;
  });


  const indexOfLastUser = currentPage * entriesPerPage;
  const indexOfFirstUser = indexOfLastUser - entriesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FEFAF6]">
      <div className="animate-pulse font-black text-[#102C57] uppercase tracking-widest text-xs">
        Loading Personnel Directory...
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#FEFAF6] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#102C57] uppercase tracking-tight">Personnel Management</h2>
          <p className="text-[#DAC0A3] text-[10px] font-bold uppercase tracking-widest mt-1">Staff Directory / System Users</p>
        </div>

        <button
          onClick={() => navigate('/admin/users/add')}
          className="bg-[#102C57] text-white px-8 py-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase shadow-xl shadow-[#102C57]/20 hover:bg-[#1a3d75] transition-all tracking-widest"
        >
          <Plus size={16} strokeWidth={3} /> Add New User
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-[#EADBC8] overflow-hidden">
        {/* Filters & Search Bar */}
        <div className="p-6 flex flex-wrap justify-between items-center gap-4 bg-white border-b border-[#FEFAF6]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[#102C57] uppercase tracking-widest opacity-40">Filters</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="border border-[#DAC0A3] rounded-lg px-4 py-2 text-[10px] font-black outline-none text-[#102C57] bg-[#FEFAF6] uppercase tracking-widest cursor-pointer"
            >
              <option value="ALL">ALL STATUS</option>
              <option value="Active">ACTIVE</option>

              <option value="Inactive">INACTIVE</option>
            </select>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-4 pr-10 py-2.5 border border-[#EADBC8] rounded-xl text-xs outline-none w-64 bg-[#FEFAF6] focus:ring-2 focus:ring-[#102C57]/5 focus:border-[#102C57] transition-all"
            />
            <Search className="absolute right-3 top-3 text-[#DAC0A3]" size={14} />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#102C57] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="py-5 px-8">Full Name</th>
                <th className="py-5 px-8 text-center">Phone Number</th>
                <th className="py-5 px-8 text-center">Status</th>
                <th className="py-5 px-8 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEFAF6]">
              {currentUsers.length > 0 ? currentUsers.map((user) => (
                <tr key={user.Users_id} className="hover:bg-[#FEFAF6]/50 transition-colors group">
                  <td className="py-5 px-8 text-[#102C57] text-xs font-black">
                    <div className="flex flex-col">
                      <span>{user.Full_Name}</span>
                      <span className="text-[9px] text-[#DAC0A3] font-bold lowercase tracking-normal">{user.Email}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-slate-500 text-[11px] text-center font-bold">{user.phone_number || "---"}</td>
                  <td className="py-5 px-8">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleStatus(user.Users_id, user.account_status)}
                        className={`w-11 h-5 flex items-center rounded-full p-1 transition-all duration-300 ${user.account_status.toLowerCase() === 'active'
                          ? 'bg-green-500 shadow-sm shadow-green-100'
                          : 'bg-[#EADBC8]'
                          }`}
                      >
                        <div className={`w-3.5 h-3.5 bg-white rounded-full transition-all shadow-sm ${user.account_status === 'active' ? 'translate-x-5' : 'translate-x-0'
                          }`}></div>
                      </button>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-center">
                    <div className="relative flex justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionId(activeActionId === user.Users_id ? null : user.Users_id);
                        }}
                        className={`p-2 rounded-lg transition-all ${activeActionId === user.Users_id ? 'bg-[#102C57] text-white shadow-lg' : 'bg-[#FEFAF6] text-[#DAC0A3] hover:text-[#102C57] border border-[#EADBC8]'}`}
                      >
                        <Settings size={14} />
                      </button>

                      {activeActionId === user.Users_id && (
                        <div className="absolute right-full mr-2 top-0 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-[#EADBC8] overflow-hidden z-[100] min-w-[120px]">
                          <button
                            onClick={() => navigate(`/admin/users/edit/${user.Users_id}`)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-[#102C57] hover:bg-[#FEFAF6] uppercase tracking-widest text-left transition-colors"
                          >
                            <Edit3 size={12} className="text-[#DAC0A3]" /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal({ show: true, userId: user.Users_id })}
                            className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-red-500 hover:bg-red-50 uppercase tracking-widest text-left border-t border-[#FEFAF6] transition-colors"
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
                  <td colSpan="4" className="py-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-40">No personnel found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 flex justify-between items-center bg-white border-t border-[#F2EBE4]">
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
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="text-slate-300 hover:text-[#102C57] disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-md text-[11px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#102C57] text-white shadow-md shadow-[#102C57]/20 scale-110' : 'text-slate-400 hover:bg-[#FEFAF6]'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="text-slate-300 hover:text-[#102C57] disabled:opacity-20 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-[#102C57]/40 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full shadow-2xl border border-[#EADBC8] text-center">
            <div className="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-red-500">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-[#102C57] text-2xl font-black mb-4 uppercase tracking-tight">Confirm Deletion</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em] mb-10 leading-relaxed">This action will permanently revoke access and remove the user from the staff directory.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal({ show: false, userId: null })} className="flex-1 py-4 rounded-xl bg-[#FEFAF6] border border-[#EADBC8] text-[#102C57] font-black text-[10px] uppercase tracking-widest hover:bg-[#EADBC8]/10 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-red-200 hover:bg-red-600 transition-all">Delete Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;