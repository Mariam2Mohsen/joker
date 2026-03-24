import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FEFAF6] relative">
      {/* Sidebar Overlay - Mobile only */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[150] lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, Overlay on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-[200] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area (Navbar + Page Content) */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Navbar - Pass toggle to handle the hamburger click */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;