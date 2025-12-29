import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { useProjects } from '../hooks/useProjects';

const AddProjectModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const { createProject } = useProjects();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    createProject({ name }, { 
      onSuccess: () => {
        setName('');
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <Motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} 
          className="absolute inset-0 bg-forest/40 dark:bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <Motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative z-10 border transition-all
            bg-cream border-[#CCD5AE]
            dark:bg-dark-card dark:border-dark-border"
        >
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 transition-transform hover:scale-110
              text-olive dark:text-dark-sub dark:hover:text-white"
          >
            <HiX size={24} />
          </button>

          <h3 className="text-2xl font-black mb-2 tracking-tighter uppercase text-olive dark:text-dark-text">New Workspace</h3>
          <p className="text-[10px] font-black uppercase tracking-widest mb-8 opacity-40 text-forest dark:text-dark-sub">
            Beri nama untuk project kanban baru Anda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-2 opacity-60 text-olive dark:text-dark-sub">Project Name</label>
              <input 
                autoFocus required
                className="w-full border-none rounded-2xl p-4 font-medium transition-all focus:ring-2
                  bg-pale text-forest placeholder-olive/30 focus:ring-olive
                  dark:bg-dark-bg dark:text-dark-text dark:placeholder-white/20 dark:focus:ring-blue-500"
                placeholder="Misal: Proyek React Next.js"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all
                bg-olive text-white shadow-olive/20
                dark:bg-blue-600 dark:hover:bg-blue-700 dark:shadow-none"
            >
              Buat Workspace
            </button>
          </form>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddProjectModal;