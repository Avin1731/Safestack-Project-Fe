import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { HiX, HiOutlineHome, HiOutlineViewGrid, HiOutlineChatAlt2, HiPencil, HiCheck } from 'react-icons/hi';
import api from '../api/axios';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, user, setUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.displayName);
  const [newPhoto, setNewPhoto] = useState(user.photoUrl);

  const handleUpdate = async () => {
    try {
      const res = await api.put('/api/auth/profile', { displayName: newName, photoUrl: newPhoto });
      const updated = { ...user, ...res.data };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setIsEditing(false);
    } catch { // Linter Clean: Optional Catch Binding
      alert("Gagal update profil");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40" />
          <Motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-1/5 bg-[#CCD5AE] shadow-2xl z-50 p-10 flex flex-col border-l border-[#E0E5B6]">
            {/* PROFILE SECTION (TOP) */}
            <div className="flex flex-col items-center mb-16 relative">
              <button onClick={onClose} className="absolute -top-4 -right-4 text-[#606C38] hover:scale-110 transition-transform"><HiX size={28} /></button>
              <div className="relative group mb-6">
                <img src={newPhoto} alt="p" className="w-32 h-32 rounded-full border-4 border-[#FEFAE0] shadow-xl object-cover" />
                <button onClick={() => { const u = prompt("URL Foto Profil:", newPhoto); if(u) setNewPhoto(u); }} className="absolute bottom-1 right-1 bg-[#606C38] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><HiPencil size={14} /></button>
              </div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input className="bg-[#FEFAE0] text-xs font-black p-1.5 rounded border border-[#606C38] w-32 text-center shadow-inner" value={newName} onChange={e => setNewName(e.target.value)} />
                  <button onClick={handleUpdate} className="text-[#606C38]"><HiCheck size={24} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#283618] truncate max-w-[150px]">{user.displayName}</h3>
                  <button onClick={() => setIsEditing(true)} className="text-[#606C38]/50 hover:text-[#606C38]"><HiPencil size={16} /></button>
                </div>
              )}
            </div>

            <nav className="flex-1 space-y-5">
              {[
                { id: 'dashboard', n: 'Home', i: <HiOutlineHome size={26} /> },
                { id: 'kanban', n: 'Kanban', i: <HiOutlineViewGrid size={26} /> },
                { id: 'void', n: 'The Void', i: <HiOutlineChatAlt2 size={26} /> }
              ].map(m => (
                <button key={m.id} onClick={() => { setActiveTab(m.id); onClose(); }} className={`w-full flex items-center gap-5 px-6 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${activeTab === m.id ? 'bg-[#FEFAE0] text-[#606C38] shadow-lg translate-x-2' : 'text-[#283618]/50 hover:bg-[#E0E5B6] hover:text-[#606C38]'}`}>
                  {m.i} <span>{m.n}</span>
                </button>
              ))}
            </nav>
            <button onClick={onLogout} className="mt-8 w-full bg-[#BC6C25] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-[#a05a1d] active:scale-95 transition-all">Logout Account</button>
          </Motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;