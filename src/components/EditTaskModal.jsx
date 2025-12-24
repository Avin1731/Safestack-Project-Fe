import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { useTasks } from '../hooks/useTasks';

const EditTaskModal = ({ isOpen, onClose, task, projectId }) => {
  const { updateTask } = useTasks(projectId);
  
  // Inisialisasi state langsung dari props untuk menghindari cascading renders
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTask({ 
      id: task.id || task._id, 
      title, 
      description, 
      priority 
    }, { 
      onSuccess: () => onClose() 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
          />
          <Motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
            className="bg-[#FAEDCE] w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-[#E0E5B6] relative z-10"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-[#606C38] hover:scale-110 transition-transform">
              <HiX size={24} />
            </button>
            <h3 className="text-2xl font-black mb-8 text-[#606C38] tracking-tight text-center uppercase">Edit Tugas</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#606C38]/60 uppercase tracking-[0.2em] mb-2 ml-1">Judul Tugas</label>
                <input required className="w-full bg-[#FEFAE0] border border-[#E0E5B6] rounded-2xl p-4 text-[#283618] focus:outline-none focus:border-[#606C38] transition-all font-medium" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#606C38]/60 uppercase tracking-[0.2em] mb-2 ml-1">Deskripsi</label>
                <textarea className="w-full bg-[#FEFAE0] border border-[#E0E5B6] rounded-2xl p-4 text-[#283618] focus:outline-none focus:border-[#606C38] transition-all h-24 resize-none font-medium" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#606C38]/60 uppercase tracking-[0.2em] mb-2 ml-1">Prioritas</label>
                <select className="w-full bg-[#FEFAE0] border border-[#E0E5B6] rounded-2xl p-4 text-[#283618] focus:outline-none focus:border-[#606C38] font-bold cursor-pointer" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#606C38] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-[#283618] transition-all active:scale-95 uppercase tracking-widest text-xs mt-4">Simpan Perubahan</button>
            </form>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditTaskModal;