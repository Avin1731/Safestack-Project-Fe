import React from 'react';

const ProjectProgressBar = ({ stats }) => {
  // Ambil data stats yang sudah dikirim oleh projectController.js
  const { todo = 0, ongoing = 0, done = 0, total = 0 } = stats || {};
  
  // Fungsi hitung lebar agar bar tetap scale 100% secara dinamis
  const getWidth = (count) => (total === 0 ? 0 : (count / total) * 100);

  return (
    <div className="w-full space-y-2">
      {/* Container Bar Utama */}
      <div className="w-full h-4 bg-[#FEFAE0] rounded-full overflow-hidden flex border border-[#E0E5B6] shadow-inner">
        {/* Segmen TODO (Warna Coklat Soft) */}
        <div 
          className="h-full bg-[#D4A373] transition-all duration-700 ease-in-out border-r border-white/20" 
          style={{ width: `${getWidth(todo)}%` }} 
        />
        {/* Segmen ONGOING (Warna Orange/Kuning Terang) */}
        <div 
          className="h-full bg-[#BC6C25] transition-all duration-700 ease-in-out border-r border-white/20" 
          style={{ width: `${getWidth(ongoing)}%` }} 
        />
        {/* Segmen DONE (Warna Hijau Aman) */}
        <div 
          className="h-full bg-[#606C38] transition-all duration-700 ease-in-out" 
          style={{ width: `${getWidth(done)}%` }} 
        />
      </div>

      {/* Label Persentase & Info */}
      <div className="flex justify-between items-center px-1">
        <span className="text-[9px] font-black uppercase text-[#606C38] opacity-50 tracking-widest">
          {total > 0 ? `${Math.round(getWidth(done))}% Complete` : 'No Tasks Yet'}
        </span>
        <div className="flex gap-2">
           <span className="w-2 h-2 rounded-full bg-[#D4A373]" title="Todo" />
           <span className="w-2 h-2 rounded-full bg-[#BC6C25]" title="Ongoing" />
           <span className="w-2 h-2 rounded-full bg-[#606C38]" title="Done" />
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressBar;