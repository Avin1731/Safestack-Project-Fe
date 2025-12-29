import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext'; // Pake Context
import { 
  HiX, 
  HiOutlineHome, 
  HiOutlineViewGrid, 
  HiOutlineChatAlt2, 
  HiOutlineClock, 
  HiLogout,
  HiUser,
  HiMoon, 
  HiSun
} from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, user, onLogout }) => {
  // Ambil fungsi tema dari context
  const { isDarkMode, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: <HiOutlineHome size={22} /> },
    { id: 'kanban', label: 'Kanban', icon: <HiOutlineViewGrid size={22} /> },
    { id: 'void', label: 'The Void', icon: <HiOutlineChatAlt2 size={22} /> },
    { id: 'history', label: 'Riwayat', icon: <HiOutlineClock size={22} /> },
    { id: 'profile', label: 'Profile', icon: <HiUser size={22} /> }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Gelap */}
          <Motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-forest/30 dark:bg-black/60 backdrop-blur-sm z-40" 
          />

          {/* Sidebar Panel */}
          <Motion.aside 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            // Class panjang ini untuk: Scrollable tapi Scrollbar hidden, dan warna berubah sesuai tema
            className="fixed right-0 top-0 h-full w-[340px] shadow-2xl z-50 p-8 flex flex-col border-l transition-colors duration-300 
            overflow-y-auto scrollbar-hide 
            bg-pale border-sage dark:bg-dark-card dark:border-dark-border"
          >
            {/* Header: Tombol Tema & Close */}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-xl border transition-all shadow-sm bg-cream border-sage text-olive dark:bg-dark-bg dark:border-dark-border dark:text-yellow-400"
              >
                {isDarkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
              </button>

              <button 
                onClick={onClose} 
                className="p-2 rounded-xl shadow-lg hover:scale-110 transition-transform bg-olive text-white dark:bg-dark-border"
              >
                <HiX size={20} />
              </button>
            </div>

            {/* Profile Section */}
            <div 
                onClick={() => { setActiveTab('profile'); onClose(); }}
                className="p-6 rounded-[2.5rem] border mb-8 flex flex-col items-center cursor-pointer group transition-all 
                bg-cream/50 border-sage hover:bg-cream dark:bg-dark-bg/50 dark:border-dark-border dark:hover:bg-dark-bg"
            >
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-dark-border shadow-xl overflow-hidden bg-olive flex items-center justify-center group-hover:scale-105 transition-transform">
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                  ) : (
                    <span className="text-4xl font-black text-cream">
                      {user?.displayName?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-center w-full px-2">
                <h3 className="text-lg font-black tracking-tight truncate text-forest dark:text-dark-text">
                  {user?.displayName || 'Guest User'}
                </h3>
                {/* Quote User Tampil Disini */}
                <p className="text-xs italic mt-2 font-medium line-clamp-2 text-olive/60 dark:text-dark-sub">
                  "{user?.quote || "Let's make things happen."}"
                </p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] ml-4 mb-4 text-olive/50 dark:text-dark-sub">Main Menu</p>
              {menuItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveTab(item.id); onClose(); }} 
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl font-bold text-xs uppercase tracking-widest transition-all duration-300 group
                    ${activeTab === item.id 
                      ? 'bg-olive text-white shadow-xl translate-x-1 dark:bg-blue-600' 
                      : 'text-olive/70 hover:bg-cream dark:text-dark-sub dark:hover:bg-dark-bg hover:translate-x-1'}`}
                >
                  <span className={`${activeTab === item.id ? 'text-white' : 'opacity-40 group-hover:opacity-100'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <button 
              onClick={onLogout} 
              className="mt-8 w-full group py-4 rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg transition-all flex justify-center items-center gap-3 active:scale-95 bg-earth hover:bg-[#a05a1d] dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <HiLogout size={18} className="group-hover:translate-x-1 transition-transform" /> 
              Logout Session
            </button>
          </Motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;