import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt, FaBars, FaUser, FaShieldAlt } from 'react-icons/fa'; // أضفنا FaShieldAlt للأيقونة
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client"; 

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  
  // --- States ---
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminData, setAdminData] = useState(null); 
  const [showLogoutModal, setShowLogoutModal] = useState(false); // حالة المودال
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const socket = useRef(null);

  // جلب بيانات الأدمن من LocalStorage
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminInfo');
    if (storedAdmin) {
      try {
        const parsedData = JSON.parse(storedAdmin);
        setAdminData(parsedData);
      } catch (error) {
        console.error("Error parsing adminInfo:", error);
      }
    }
  }, []);

  // جلب الإشعارات وربط Socket.io
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("https://joker-hm0k.onrender.com/api/admin/notifications", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications || []);
          const unread = (data.notifications || []).filter(n => n.is_read === 0).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();

    socket.current = io("https://joker-hm0k.onrender.com:5000");
    socket.current.on("new_provider_registered", (data) => {
      setNotifications((prev) => [
        {
          message: data.message,
          type: data.type,
          created_at: new Date(),
          is_read: 0
        },
        ...prev
      ]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  // فتح الإشعارات وتحديثها كـ "مقروءة"
  const handleToggleNotif = async () => {
    const nextState = !isNotifOpen;
    setIsNotifOpen(nextState);

    if (nextState && unreadCount > 0) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("https://joker-hm0k.onrender.com/api/admin/notifications", {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.success) {
          setUnreadCount(0);
          setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        }
      } catch (err) {
        console.error("Error marking notifications as read:", err);
      }
    }
  };

  // إغلاق القوائم عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- دوال تسجيل الخروج ---
  const handleLogoutClick = () => {
    setIsProfileOpen(false); // نغلق قائمة البروفايل أولاً
    setShowLogoutModal(true); // نفتح المودال
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminInfo');
    navigate('/login');
  };

  return (
    <div className="flex flex-col bg-white border-b border-[#EADBC8] shadow-sm relative z-50">
      <div className="w-full h-16 flex items-center justify-between px-4 md:px-8">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="text-[#102C57] p-2 hover:bg-[#FEFAF6] rounded-xl lg:hidden transition-all active:scale-90">
            <FaBars size={20} />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={handleToggleNotif} 
              className="p-2.5 text-[#102C57] hover:bg-[#FEFAF6] rounded-xl relative group transition-all"
            >
              <FaBell size={18} className="group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-[#EADBC8] rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#FEFAF6]">
                  <h3 className="text-[11px] font-black text-[#102C57] uppercase tracking-widest">Notifications</h3>
                  <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notif, index) => (
                      <div key={index} className={`flex gap-3 p-2 hover:bg-[#FEFAF6] rounded-xl transition-colors cursor-pointer group border-l-2 ${notif.is_read === 0 ? 'border-[#102C57] bg-blue-50/30' : 'border-transparent'}`}>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                          <FaUser size={12} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-[#102C57] leading-tight">{notif.message}</p>
                          <p className="text-[8px] text-[#DAC0A3] mt-1">{new Date(notif.created_at).toLocaleString('ar-EG')}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400 text-[10px]">No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 pl-3 border-l border-[#EADBC8]/50 group transition-all">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[11px] font-black text-[#102C57] leading-none group-hover:text-[#DAC0A3] transition-colors">
                  Hi, { adminData?.name || 'Admin'}
                </span>
                <span className="text-[8px] text-green-500 font-bold uppercase mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#FEFAF6] border border-[#EADBC8] flex items-center justify-center text-[#102C57] group-hover:bg-[#102C57] group-hover:text-white transition-all shadow-sm overflow-hidden">
                {adminData?.Image ? (
                   <img src={`https://joker-hm0k.onrender.com/${adminData.Image}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                   <FaUserCircle size={24} />
                )}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-[#EADBC8] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-[#FEFAF6] border-b border-[#EADBC8]/50">
                  <p className="text-[10px] font-black text-[#102C57] uppercase tracking-wider">
                    { (adminData?.role === 1 ? 'Super Admin' : 'Admin')}
                  </p>
                  <p className="text-[9px] text-[#DAC0A3] font-bold mt-1 truncate">
                    {adminData?.email || 'Admin Dashboard'}
                  </p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={handleLogoutClick} 
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white border border-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaSignOutAlt size={12} />
                    </div>
                    Logout Securely
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal - بنفس تصميم Delete Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-[#102C57]/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full shadow-2xl border border-[#EADBC8] text-center animate-in fade-in zoom-in duration-200">
            <div className="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-red-600 border border-red-100">
              <FaShieldAlt size={32} />
            </div>
            <h3 className="text-[#102C57] text-2xl font-black mb-4 uppercase tracking-tight">Confirm Logout</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em] mb-10 leading-relaxed">
              Are you sure you want to end your session? You will need to login again to access the dashboard.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLogoutModal(false)} 
                className="flex-1 py-4 rounded-xl bg-[#FEFAF6] border border-[#EADBC8] text-[#102C57] font-black text-[10px] uppercase tracking-widest hover:bg-[#EADBC8]/10 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout} 
                className="flex-1 py-4 rounded-xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-red-200 hover:bg-red-700 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;