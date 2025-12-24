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
          onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <Motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#FEFAE0] w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative z-10 border border-[#CCD5AE]"
        >
          <button onClick={onClose} className="absolute top-8 right-8 text-[#606C38] hover:scale-110 transition-transform">
            <HiX size={24} />
          </button>

          <h3 className="text-2xl font-black text-[#606C38] mb-2 tracking-tighter uppercase">New Workspace</h3>
          <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-8">Beri nama untuk project kanban baru Anda.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-[#606C38]/60 uppercase tracking-widest mb-2 ml-2">Project Name</label>
              <input 
                autoFocus required
                className="w-full bg-[#FAEDCE] border-none rounded-2xl p-4 text-[#283618] focus:ring-2 focus:ring-[#606C38] placeholder-[#606C38]/30 font-medium"
                placeholder="Misal: Proyek React Next.js"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-[#606C38] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-[#606C38]/20 hover:scale-[1.02] active:scale-95 transition-all"
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