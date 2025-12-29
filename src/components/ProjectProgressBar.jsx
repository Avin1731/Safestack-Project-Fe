import React from 'react';

const ProjectProgressBar = ({ stats }) => {
  const { todo = 0, ongoing = 0, done = 0, total = 0 } = stats || {};
  const getWidth = (count) => (total === 0 ? 0 : (count / total) * 100);

  return (
    <div className="w-full space-y-2">
      {/* Container Bar Utama */}
      <div className="w-full h-4 rounded-full overflow-hidden flex border shadow-inner
        bg-cream border-sage
        dark:bg-dark-bg dark:border-dark-border">
        
        {/* TODO Segment (Coklat/Kuning) */}
        <div 
          className="h-full transition-all duration-700 ease-in-out border-r border-white/20
            bg-[#D4A373] dark:bg-yellow-600" 
          style={{ width: `${getWidth(todo)}%` }} 
        />
        
        {/* ONGOING Segment (Orange) */}
        <div 
          className="h-full transition-all duration-700 ease-in-out border-r border-white/20
            bg-[#BC6C25] dark:bg-orange-600" 
          style={{ width: `${getWidth(ongoing)}%` }} 
        />
        
        {/* DONE Segment (Hijau/Biru) */}
        <div 
          className="h-full transition-all duration-700 ease-in-out
            bg-olive dark:bg-blue-600" 
          style={{ width: `${getWidth(done)}%` }} 
        />
      </div>

      {/* Label Persentase & Info */}
      <div className="flex justify-between items-center px-1">
        <span className="text-[9px] font-black uppercase tracking-widest opacity-50
          text-olive dark:text-dark-sub">
          {total > 0 ? `${Math.round(getWidth(done))}% Complete` : 'No Tasks Yet'}
        </span>
        <div className="flex gap-2">
           <span className="w-2 h-2 rounded-full bg-[#D4A373] dark:bg-yellow-600" title="Todo" />
           <span className="w-2 h-2 rounded-full bg-[#BC6C25] dark:bg-orange-600" title="Ongoing" />
           <span className="w-2 h-2 rounded-full bg-olive dark:bg-blue-600" title="Done" />
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressBar;