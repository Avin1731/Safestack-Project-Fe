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
  const { completeProject } = useProjects(); // Pastikan hook ini mengembalikan fungsi yang valid

  const handleComplete = () => {
    // Validasi logic sebelum eksekusi
    if (!isReadyToComplete) {
      alert("Selesaikan semua tugas dulu sebelum menyelesaikan project!");
      return;
    }
    
    if (window.confirm(`Yakin ingin menyelesaikan project "${selectedProject.name}"? Project akan dipindah ke Riwayat.`)) {
      // Panggil fungsi complete dengan ID project
      completeProject(selectedProject.id || selectedProject._id); 
      onBack(); // Kembali ke gallery setelah selesai
    }
  };

  return (
    <header className="px-10 py-6 flex justify-between items-center bg-[#FAEDCE]/95 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_20px_-5px_rgba(40,54,24,0.1)] border-b border-[#E0E5B6]">
      <div className="flex items-center gap-8">
        {/* LOGO AREA */}
        <button onClick={onGoHome} className="group flex items-center gap-2 focus:outline-none" title="Ke Dashboard">
          <div className="bg-[#606C38] text-[#FEFAE0] p-1.5 rounded-lg rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-sm">
            <span className="font-black text-xs tracking-tighter">SS</span>
          </div>
          <span className="text-xl font-black text-[#283618] tracking-tighter hover:text-[#606C38] transition-colors">SafeStack</span>
        </button>

        {/* Separator Line */}
        <div className="h-6 w-[1px] bg-[#E0E5B6] hidden md:block" />

        <div className="flex items-center gap-4">
          {/* Tombol Back HANYA muncul saat di dalam Board Proyek */}
          {activeTab === 'kanban' && selectedProject && (
            <button onClick={onBack} className="p-2.5 bg-[#FEFAE0] rounded-xl text-[#606C38] hover:scale-110 active:scale-95 transition-all shadow-sm border border-[#E0E5B6] group" title="Kembali ke Galeri">
              <HiChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold text-[#283618]/80 tracking-tight leading-none drop-shadow-sm truncate max-w-[200px] md:max-w-md">
              {selectedProject ? selectedProject.name : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            {isLoading && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1 h-1 bg-[#606C38] rounded-full animate-pulse" />
                <span className="text-[7px] font-black text-[#606C38]/40 uppercase tracking-[0.2em]">Syncing</span>
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
                ? 'bg-[#606C38] text-white hover:bg-[#283618] hover:-translate-y-0.5 active:scale-95 shadow-[#606C38]/30' 
                : 'bg-[#CCD5AE]/50 text-[#606C38]/40 cursor-not-allowed opacity-60'}`}
          >
            <HiCheckCircle size={18} />
            {isReadyToComplete ? 'Complete' : 'Tasks Left'}
          </button>
        )}

        {/* Tombol Sidebar SEKARANG SELALU MUNCUL */}
        <button 
          onClick={onToggleSidebar} 
          className="text-[#283618] p-2.5 hover:bg-[#FEFAE0] rounded-xl transition-all border border-transparent hover:border-[#E0E5B6] hover:shadow-sm"
        >
          <HiMenu size={32} />
        </button>
      </div>
    </header>
  );
};

export default Header;