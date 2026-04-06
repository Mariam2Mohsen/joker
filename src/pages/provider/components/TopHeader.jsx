import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, LogOut, MessageCircle } from 'lucide-react';
import Logo from "../../../components/UI/Logo";
import { useAuth } from "../../../hooks/useAuth";
import LogoutModal from "../../../components/UI/LogoutModal";
import io from "socket.io-client";
const TopHeader = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const SERVER_URL = "https://joker-hm0k.onrender.com";

  const currentUserId = user?.userId || user?.user_id || user?.id;

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${SERVER_URL}/api/admin/notifications`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      if (data.success) {
        setUnreadCount(0); 
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      }
    } catch (err) {
      console.error("❌ Error marking notifications as read:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn && currentUserId) {
      console.log("🎯 [System] Initializing notifications for User:", currentUserId);

      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem('authToken'); 
          
          const response = await fetch(`${SERVER_URL}/api/admin/notifications`, {
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          
          const data = await response.json();
          
          if (data.success) {
            console.log("📥 Received My Notifications:", data.notifications);
            setNotifications(data.notifications || []);
            setUnreadCount((data.notifications || []).filter(n => n.is_read === 0).length);
          }
        } catch (err) {
          console.error("❌ [API] Fetch Error:", err);
        }
      };

      fetchNotifications();

      const socket = io(SERVER_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      socket.on("connect", () => {
        console.log("✅ [Socket] Connected successfully. ID:", socket.id);
      });

      const channelName = `notification_user_${currentUserId}`;
      socket.on(channelName, (newNotif) => {
        console.log("🔔 [Socket] New notification received:", newNotif);
        setNotifications(prev => [
          {
            ...newNotif,
            created_at: newNotif.created_at || new Date().toISOString(),
            is_read: 0
          }, 
          ...prev
        ]);
        setUnreadCount(prev => prev + 1);
      });

      return () => socket.disconnect();
    }
  }, [isLoggedIn, currentUserId]);

  const handleToggleNotif = () => {
    const nextState = !showNotifMenu;
    setShowNotifMenu(nextState);
    setShowUserMenu(false);

   
    if (nextState && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const getUserInitials = () => {
    const name = user?.Full_Name || user?.fullName || user?.email || "P V";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className="h-20 bg-white border-b border-[#EADBC8]/50 flex items-center justify-between px-8 shadow-sm z-[100] sticky top-0 transition-all duration-500">
      
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center hover:scale-105 transition-transform">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>

      <div className="flex gap-6 items-center">
        <div className="hidden lg:flex relative items-center group">
          <input 
            type="text" 
            placeholder= {user?.role === 'provider' ? "Search provider dashboard..." : "Search services..."}
            className="bg-[#FEFAF6] border border-[#EADBC8] rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-[#102C57] focus:ring-4 focus:ring-[#102C57]/5 transition-all w-72 shadow-inner"
          />
          <Search size={14} className="absolute left-3.5 text-[#DAC0A3]" />
        </div>

        <div className="flex items-center gap-3 border-l border-[#EADBC8] pl-6 ml-2">
          <div className="relative">
            <button 
              type="button"
              className="relative p-2.5 bg-[#FEFAF6] rounded-xl text-[#102C57] hover:bg-[#102C57] hover:text-white transition-all shadow-sm"
              onClick={handleToggleNotif}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[8px] font-black bg-[#A855F7] text-white w-4 h-4 flex items-center justify-center rounded-lg border-2 border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifMenu(false)}></div>
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-[#EADBC8]/30 py-4 z-20 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="px-5 pb-3 border-b border-[#EADBC8]/20 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#102C57]">Notifications</span>
                    {unreadCount > 0 && <span className="text-[8px] font-bold text-[#A855F7] bg-[#A855F7]/10 px-2 py-0.5 rounded-full">New</span>}
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((notif, idx) => (
                        <div key={idx} className={`px-5 py-4 hover:bg-[#FEFAF6] transition-colors border-b border-[#FEFAF6] last:border-0 ${notif.is_read === 0 ? 'bg-[#102C57]/5' : ''}`}>
                          <p className="text-[11px] text-[#102C57]/80 leading-relaxed font-medium">
                            {notif.message}
                          </p>
                          <span className="text-[8px] text-[#DAC0A3] font-bold uppercase mt-1 block">
                            {notif.type || 'System'} • {new Date(notif.created_at).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center">
                        <p className="text-[10px] font-black uppercase text-[#102C57]/30">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative border-l border-[#EADBC8] pl-6">
          <button 
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifMenu(false); }}
            className="flex items-center gap-4 group bg-[#FEFAF6] p-1.5 pr-4 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-[#EADBC8] shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#102C57] text-[#FEFAF6] flex items-center justify-center font-black text-xs border-2 border-white shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : getUserInitials()}
            </div>
             <div className="text-left hidden sm:block">
          <p className="text-[11px] font-black text-[#102C57] leading-none mb-1 truncate max-w-[100px]">
            {user?.Full_Name || user?.fullName || "User"}
          </p>
         
         
        </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-[#EADBC8]/30 py-3 z-20 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#FEFAF6] bg-[#FEFAF6]/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#102C57] truncate">{user?.Email || user?.email}</p>
                </div>
                
                <div className="p-2 space-y-1">
                  <Link to="/messages" className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#102C57]/60 hover:text-[#102C57] hover:bg-[#FEFAF6] rounded-xl transition-all">
                    <MessageCircle size={14} /> Messages
                  </Link>
                </div>

                <div className="px-2 pt-1 border-t border-[#FEFAF6]">
                  <button onClick={() => { setShowLogoutModal(true); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all text-left">
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => { logout(); setShowLogoutModal(false); }}
      />
    </header>
  );
};

export default TopHeader;