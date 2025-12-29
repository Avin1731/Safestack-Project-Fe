import React from 'react';
import { HiMenu, HiChevronLeft, HiCheckCircle } from 'react-icons/hi';
import { useProjects } from '../hooks/useProjects';

const Header = ({ 
  activeTab, 
  onToggleSidebar, 
  selectedProject, 
  onBack, 
  onGoHome, 
  isLoading, 
  isReadyToComplete 
}) => {
  const { completeProject } = useProjects(); 

  const handleComplete = () => {
    if (!isReadyToComplete) {
      alert("Selesaikan semua tugas dulu sebelum menyelesaikan project!");
      return;
    }
    
    if (window.confirm(`Yakin ingin menyelesaikan project "${selectedProject.name}"? Project akan dipindah ke Riwayat.`)) {
      completeProject(selectedProject.id || selectedProject._id); 
      onBack(); 
    }
  };

  return (
    <header className="px-6 md:px-10 py-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300
      bg-pale/95 border-b border-sage shadow-sm
      dark:bg-dark-bg/95 dark:border-dark-border dark:shadow-none">
      
      <div className="flex items-center gap-8">
        {/* LOGO AREA */}
        <button onClick={onGoHome} className="group flex items-center gap-2 focus:outline-none" title="Ke Dashboard">
          <div className="bg-olive text-cream p-1.5 rounded-lg rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-sm dark:bg-blue-600 dark:text-white">
            <span className="font-black text-xs tracking-tighter">SS</span>
          </div>
          <span className="text-xl font-black text-forest tracking-tighter hover:text-olive transition-colors dark:text-dark-text dark:hover:text-blue-400">SafeStack</span>
        </button>

        {/* Separator Line */}
        <div className="h-6 w-[1px] bg-sage hidden md:block dark:bg-dark-border" />

        <div className="flex items-center gap-4">
          {/* Tombol Back */}
          {activeTab === 'kanban' && selectedProject && (
            <button onClick={onBack} className="p-2.5 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-sm group
              bg-cream text-olive border border-sage
              dark:bg-dark-card dark:text-dark-sub dark:border-dark-border dark:hover:text-white" 
              title="Kembali ke Galeri">
              <HiChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold tracking-tight leading-none drop-shadow-sm truncate max-w-[200px] md:max-w-md
              text-forest/80 dark:text-dark-text">
              {selectedProject ? selectedProject.name : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            {isLoading && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1 h-1 bg-olive rounded-full animate-pulse dark:bg-blue-500" />
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-olive/40 dark:text-dark-sub">Syncing</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Tombol Complete Project */}
        {selectedProject && selectedProject.status !== 'completed' && (
          <button 
            onClick={handleComplete}
            disabled={!isReadyToComplete}
            className={`hidden md:flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg 
              ${isReadyToComplete 
                ? 'bg-olive text-white hover:bg-forest hover:-translate-y-0.5 active:scale-95 shadow-olive/30 dark:bg-blue-600 dark:hover:bg-blue-700' 
                : 'bg-sage/50 text-olive/40 cursor-not-allowed opacity-60 dark:bg-dark-card dark:text-dark-sub/30'}`}
          >
            <HiCheckCircle size={18} />
            {isReadyToComplete ? 'Complete' : 'Tasks Left'}
          </button>
        )}

        {/* Tombol Sidebar */}
        <button 
          onClick={onToggleSidebar} 
          className="p-2.5 rounded-xl transition-all border border-transparent hover:shadow-sm
            text-forest hover:bg-cream hover:border-sage
            dark:text-dark-text dark:hover:bg-dark-card dark:hover:border-dark-border"
        >
          <HiMenu size={32} />
        </button>
      </div>
    </header>
  );
};

export default Header;