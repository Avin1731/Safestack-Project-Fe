import React from 'react';
import { HiOutlineHome, HiOutlineViewGrid, HiOutlineChatAlt2, HiOutlineLogout } from 'react-icons/hi';

const Sidebar = ({ user, onLogout, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <HiOutlineHome size={22} /> },
    { id: 'kanban', name: 'Kanban Board', icon: <HiOutlineViewGrid size={22} /> },
    { id: 'void', name: 'The Void', icon: <HiOutlineChatAlt2 size={22} /> },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-black text-blue-500 tracking-tighter italic">SafeTask</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <img src={user.photoUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-blue-500" />
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{user.displayName}</p>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
        >
          <HiOutlineLogout size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;