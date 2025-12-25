import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, 
  HiOutlineHome, 
  HiOutlineViewGrid, 
  HiOutlineChatAlt2, 
  HiOutlineClock, 
  HiPencil, 
  HiCheck,
  HiLogout
} from 'react-icons/hi';
import api from '../api/axios';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, user, setUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  
  // LOGIC FIX: Jangan langsung kasih placeholder kalau user punya photoUrl
  // Gunakan optional chaining dan fallback yang benar
  const [newPhoto, setNewPhoto] = useState(user?.photoUrl || ''); 

  const handleUpdate = async () => {
    try {
      const res = await api.put('/auth/profile', { 
        displayName: newName, 
        photoUrl: newPhoto 
      });
      
      const updated = { ...user, ...res.data };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal update profil:", error);
      alert("Gagal update profil.");
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: <HiOutlineHome size={24} /> },
    { id: 'kanban', label: 'Kanban', icon: <HiOutlineViewGrid size={24} /> },
    { id: 'void', label: 'The Void', icon: <HiOutlineChatAlt2 size={24} /> },
    { id: 'history', label: 'Riwayat', icon: <HiOutlineClock size={24} /> }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" 
          />
          <Motion.aside 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-[#FAEDCE] shadow-2xl z-50 p-8 flex flex-col border-l border-[#E0E5B6]"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-[#FEFAE0] rounded-xl text-[#606C38] hover:scale-110 transition-transform shadow-sm border border-[#E0E5B6]">
              <HiX size={20} />
            </button>

            <div className="flex flex-col items-center mt-8 mb-12">
              <div className="relative group mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-[#FEFAE0] shadow-lg overflow-hidden bg-[#CCD5AE] flex items-center justify-center">
                  {/* LOGIC DISPLAY FOTO */}
                  {newPhoto ? (
                    <img 
                      src={newPhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      // INI KUNCINYA AGAR FOTO GOOGLE MUNCUL
                      referrerPolicy="no-referrer" 
                      onError={(e) => {
                        e.target.style.display = 'none'; // Sembunyikan jika error
                        setNewPhoto(''); // Fallback ke inisial
                      }}
                    />
                  ) : (
                    // FALLBACK INISIAL JIKA TIDAK ADA FOTO
                    <span className="text-4xl font-black text-[#606C38]">
                      {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                
                {/* Tombol edit hanya muncul saat isEditing true biar bersih */}
                {isEditing && (
                  <button 
                    onClick={() => { 
                      const u = prompt("Masukkan URL Foto Profil Baru:", newPhoto); 
                      if(u) setNewPhoto(u); 
                    }} 
                    className="absolute bottom-0 right-0 bg-[#606C38] text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <HiPencil size={14} />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2 w-full justify-center animate-pulse">
                  <input 
                    className="bg-[#FEFAE0] text-sm font-bold text-[#283618] px-3 py-1.5 rounded-lg border border-[#606C38] w-40 text-center shadow-inner focus:outline-none" 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)} 
                    autoFocus
                  />
                  <button onClick={handleUpdate} className="bg-[#606C38] text-white p-1.5 rounded-lg hover:bg-[#283618] transition-colors">
                    <HiCheck size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group cursor-pointer p-1" onClick={() => setIsEditing(true)}>
                  <h3 className="text-xl font-black text-[#283618] tracking-tight truncate max-w-[180px]">
                    {user?.displayName || 'User'}
                  </h3>
                  <HiPencil size={14} className="text-[#606C38]/40 group-hover:text-[#606C38] transition-colors" />
                </div>
              )}
              <p className="text-[10px] font-bold text-[#606C38]/40 uppercase tracking-widest mt-1">SafeStack Member</p>
            </div>

            <nav className="flex-1 space-y-3">
              {menuItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveTab(item.id); onClose(); }} 
                  className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wide transition-all duration-200
                    ${activeTab === item.id ? 'bg-[#606C38] text-white shadow-lg translate-x-2' : 'text-[#606C38]/70 hover:bg-[#FEFAE0]'}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <button onClick={onLogout} className="mt-8 w-full bg-[#BC6C25] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-[#a05a1d] active:scale-95 transition-all flex justify-center items-center gap-2">
              <HiLogout size={18} /> Logout Account
            </button>
          </Motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;