import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { HiCheckCircle, HiLightningBolt, HiArrowRight } from 'react-icons/hi';

const Dashboard = ({ activeTasksCount, ventsCount, onOpenVoid, userName }) => {
  
  // FIX: Menggunakan Lazy State Initialization untuk membaca LocalStorage sekali saja saat mount.
  // Tidak perlu useEffect, sehingga tidak ada cascading render.
  const [localName] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        return parsed.displayName || parsed.name; // Ambil field yang tersedia
      }
    } catch (e) {
      console.error("Gagal membaca user lokal", e);
    }
    return null;
  });

  // LOGIC UTAMA: Prioritas 1 (Props) -> Prioritas 2 (Local Storage) -> Default
  const displayName = userName || localName || 'Guest';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 pt-6 px-4 md:px-8">
      
      {/* 1. GREETING SECTION */}
      <Motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-4xl md:text-5xl font-black text-[#283618] tracking-tighter break-words leading-[1.1] max-w-4xl">
          Hello, <span className="text-[#606C38]">{displayName}</span>
        </h2>
        <p className="text-[#606C38] font-medium text-lg opacity-80">
          Siap untuk produktif atau butuh ruang untuk bernapas hari ini?
        </p>
      </Motion.div>

      {/* 2. MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD A: ACTIVE TASKS */}
        <Motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-[#FAEDCE] p-8 md:p-10 rounded-[3rem] border-2 border-[#E0E5B6] flex flex-col justify-between min-h-[380px] shadow-sm hover:shadow-xl hover:border-[#606C38]/30 transition-all duration-500 group overflow-hidden"
        >
          {/* Background Icon Decor */}
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700 pointer-events-none">
             <HiCheckCircle size={180} className="text-[#606C38]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#606C38] text-[#FEFAE0] p-2 rounded-full">
                <HiCheckCircle size={20} />
              </span>
              <h3 className="font-black text-[#606C38] uppercase tracking-[0.3em] text-xs">Active Tasks</h3>
            </div>
            <p className="text-[#283618]/60 text-sm font-bold max-w-xs">
              Tugas yang menunggu sentuhan emasmu.
            </p>
          </div>

          <div className="relative z-10 flex items-end justify-between mt-4 h-full">
            <div className="text-[10rem] md:text-[12rem] font-black text-[#283618] leading-[0.8] tracking-tighter group-hover:translate-x-2 transition-transform duration-500 -mb-4 ml-[-0.5rem]">
              {activeTasksCount}
            </div>
            
            <div className="mb-2 h-full flex flex-col justify-end pointer-events-none">
               <span 
                 className="text-xs font-bold text-[#606C38] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity"
                 style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
               >
                 Keep Going
               </span>
            </div>
          </div>
        </Motion.div>
        
        {/* CARD B: VOID PULSE */}
        <Motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-gradient-to-br from-[#CCD5AE] to-[#E9EDC9] p-8 md:p-10 rounded-[3rem] border border-[#E0E5B6] flex flex-col justify-between min-h-[380px] shadow-lg group overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FEFAE0]/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#606C38]/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#FEFAE0] text-[#606C38] p-2 rounded-full shadow-sm animate-bounce-slow">
                <HiLightningBolt size={20} />
              </span>
              <h3 className="font-black text-[#FEFAE0] uppercase tracking-[0.3em] text-xs drop-shadow-sm">Void Pulse</h3>
            </div>
            
            <p className="font-bold text-3xl md:text-4xl text-[#283618] leading-tight tracking-tight">
              Ada <span className="text-[#FEFAE0] underline decoration-[#606C38] decoration-4 underline-offset-4">{ventsCount}</span> suara <br/>
              yang sedang <span className="italic font-serif font-medium opacity-80">mengudara</span>.
            </p>
          </div>
          
          <div className="relative z-10 mt-8">
            <button 
              onClick={onOpenVoid}
              className="group/btn bg-[#283618] text-[#FEFAE0] pl-8 pr-6 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 w-fit"
            >
              <span>Explore The Void</span>
              <span className="bg-[#FEFAE0]/10 p-1 rounded-full group-hover/btn:bg-[#FEFAE0] group-hover/btn:text-[#283618] transition-colors">
                <HiArrowRight size={16} />
              </span>
            </button>
          </div>
        </Motion.div>

      </div>
    </div>
  );
};

export default Dashboard;