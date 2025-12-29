import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { useTasks } from '../hooks/useTasks';

const AddTaskModal = ({ isOpen, onClose, projectId }) => {
  const { createTask } = useTasks(projectId); 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');

  const handleSubmit = (e) => {
    e.preventDefault();
    createTask({ title, description, priority, status, projectId }, { 
      onSuccess: () => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setStatus('todo');
        onClose();
      } 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} 
            className="absolute inset-0 bg-forest/30 dark:bg-black/70 backdrop-blur-sm"
          />

          <Motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border relative z-10 transition-all
              bg-pale border-sage
              dark:bg-dark-card dark:border-dark-border"
          >
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 transition-transform hover:scale-110
                text-olive dark:text-dark-sub dark:hover:text-white"
            >
              <HiX size={24} />
            </button>

            <h3 className="text-2xl font-black mb-8 tracking-tight text-center uppercase text-olive dark:text-dark-text">Tambah Tugas Baru</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1 opacity-60 text-olive dark:text-dark-sub">Judul Tugas</label>
                <input
                  required
                  className="w-full border rounded-2xl p-4 transition-all font-medium focus:outline-none
                    bg-cream border-sage text-forest focus:border-olive
                    dark:bg-dark-bg dark:border-dark-border dark:text-dark-text dark:focus:border-blue-500"
                  placeholder="Apa yang harus dikerjakan?"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1 opacity-60 text-olive dark:text-dark-sub">Deskripsi</label>
                <textarea
                  className="w-full border rounded-2xl p-4 transition-all h-24 resize-none font-medium focus:outline-none
                    bg-cream border-sage text-forest focus:border-olive
                    dark:bg-dark-bg dark:border-dark-border dark:text-dark-text dark:focus:border-blue-500"
                  placeholder="Detail tugas (opsional)..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1 opacity-60 text-olive dark:text-dark-sub">Prioritas</label>
                  <select 
                    className="w-full border rounded-2xl p-4 font-bold cursor-pointer appearance-none text-xs focus:outline-none
                      bg-cream border-sage text-forest focus:border-olive
                      dark:bg-dark-bg dark:border-dark-border dark:text-dark-text dark:focus:border-blue-500"
                    value={priority} onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1 opacity-60 text-olive dark:text-dark-sub">Status Awal</label>
                  <select 
                    className="w-full border rounded-2xl p-4 font-bold cursor-pointer appearance-none text-xs focus:outline-none
                      bg-cream border-sage text-forest focus:border-olive
                      dark:bg-dark-bg dark:border-dark-border dark:text-dark-text dark:focus:border-blue-500"
                    value={status} onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs mt-4
                  bg-olive text-white hover:bg-forest
                  dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Simpan Tugas
              </button>
            </form>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;