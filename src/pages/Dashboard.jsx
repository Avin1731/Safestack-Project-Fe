import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { HiCheckCircle, HiLightningBolt, HiArrowRight } from 'react-icons/hi';

const Dashboard = ({ activeTasksCount, ventsCount, onOpenVoid, userName }) => {
  
  const [localName] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        return parsed.displayName || parsed.name; 
      }
    } catch (e) {
      console.error("Gagal membaca user lokal", e);
    }
    return null;
  });

  const displayName = userName || localName || 'Guest';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 pt-6 px-4 md:px-8">
      
      {/* 1. GREETING SECTION */}
      <Motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter break-words leading-[1.1] max-w-4xl
          text-forest dark:text-dark-text">
          Hello, <span className="text-olive dark:text-blue-400">{displayName}</span>
        </h2>
        <p className="font-medium text-lg opacity-80 text-olive dark:text-dark-sub">
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
          className="relative p-8 md:p-10 rounded-[3rem] border-2 flex flex-col justify-between min-h-[380px] shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden
            bg-pale border-sage hover:border-olive/30 
            dark:bg-dark-card dark:border-dark-border dark:hover:border-blue-500/30"
        >
          {/* Background Icon Decor */}
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700 pointer-events-none">
             <HiCheckCircle size={180} className="text-olive dark:text-blue-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 rounded-full bg-olive text-cream dark:bg-blue-600 dark:text-white">
                <HiCheckCircle size={20} />
              </span>
              <h3 className="font-black uppercase tracking-[0.3em] text-xs text-olive dark:text-blue-400">Active Tasks</h3>
            </div>
            <p className="text-sm font-bold max-w-xs text-forest/60 dark:text-dark-sub">
              Tugas yang menunggu sentuhan emasmu.
            </p>
          </div>

          <div className="relative z-10 flex items-end justify-between mt-4 h-full">
            <div className="text-[10rem] md:text-[12rem] font-black leading-[0.8] tracking-tighter group-hover:translate-x-2 transition-transform duration-500 -mb-4 ml-[-0.5rem]
              text-forest dark:text-dark-text">
              {activeTasksCount}
            </div>
            
            <div className="mb-2 h-full flex flex-col justify-end pointer-events-none">
               <span 
                 className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity
                 text-olive dark:text-dark-sub"
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
          className="relative p-8 md:p-10 rounded-[3rem] border flex flex-col justify-between min-h-[380px] shadow-lg group overflow-hidden
            bg-gradient-to-br from-[#CCD5AE] to-[#E9EDC9] border-sage
            dark:from-slate-800 dark:to-slate-900 dark:border-dark-border"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cream/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-olive/10 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="p-2 rounded-full shadow-sm animate-bounce-slow bg-cream text-olive dark:bg-dark-bg dark:text-blue-400">
                <HiLightningBolt size={20} />
              </span>
              <h3 className="font-black uppercase tracking-[0.3em] text-xs drop-shadow-sm text-cream dark:text-dark-sub">Void Pulse</h3>
            </div>
            
            <p className="font-bold text-3xl md:text-4xl leading-tight tracking-tight text-forest dark:text-dark-text">
              Ada <span className="underline decoration-4 underline-offset-4 decoration-olive dark:decoration-blue-500 text-cream dark:text-blue-200">{ventsCount}</span> suara <br/>
              yang sedang <span className="italic font-serif font-medium opacity-80">mengudara</span>.
            </p>
          </div>
          
          <div className="relative z-10 mt-8">
            <button 
              onClick={onOpenVoid}
              className="group/btn pl-8 pr-6 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 w-fit
                bg-forest text-cream hover:bg-black
                dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
            >
              <span>Explore The Void</span>
              <span className="p-1 rounded-full transition-colors bg-cream/10 group-hover/btn:bg-cream group-hover/btn:text-forest dark:group-hover/btn:text-blue-600">
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