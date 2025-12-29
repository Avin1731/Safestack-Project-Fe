import React, { useState, useEffect } from 'react';
import { HiEye } from 'react-icons/hi';
import api from '../api/axios'; 

const Footer = ({ userName }) => {
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await api.put('/analytics/visit');
        setVisitCount(res.data.visits);
      } catch (error) {
        console.error("Gagal memuat visitor count", error);
        setVisitCount(8888); 
      }
    };

    fetchVisits();
  }, []);

  return (
    <footer className="w-full py-4 px-8 flex flex-col md:flex-row items-center justify-between relative z-10 transition-all
      bg-gradient-to-r from-pale to-cream border-t border-olive/10
      dark:from-dark-card dark:to-dark-bg dark:border-dark-border">
      
      {/* KIRI: Status Environment */}
      <div className="flex items-center gap-3 group cursor-default flex-1 justify-start">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-olive opacity-40 group-hover:opacity-75 transition-opacity dark:bg-blue-500"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-olive/80 group-hover:bg-olive transition-colors dark:bg-blue-500"></span>
        </span>
        
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] transition-colors whitespace-nowrap hidden sm:block
          text-olive/60 group-hover:text-olive dark:text-dark-sub dark:group-hover:text-white">
          SafeTask Env
        </p>
      </div>

      {/* TENGAH: Real-Time Global Visitor Counter */}
      <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border shadow-sm mx-4
        bg-olive/5 border-olive/10 dark:bg-dark-bg dark:border-dark-border">
        <HiEye className="text-olive/50 text-xs dark:text-dark-sub" />
        <div className="flex items-baseline gap-1">
           <span className="text-[10px] font-bold uppercase tracking-wider text-olive/40 dark:text-dark-sub/50">Visits</span>
           <span className="text-xs font-black font-mono tracking-tight text-forest dark:text-dark-text">
             {visitCount > 0 ? visitCount.toLocaleString() : '...'}
           </span>
        </div>
      </div>
      
      {/* KANAN: User Info & Copyright */}
      <div className="flex items-center gap-4 mt-2 md:mt-0 flex-1 justify-end">
        <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-olive/20 dark:bg-dark-sub/20"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] transition-colors cursor-default max-w-[150px] truncate text-right
              text-forest/70 hover:text-forest dark:text-dark-sub dark:hover:text-white">
                {userName || 'Guest'}
            </p>
        </div>
        
        <span className="text-olive/20 text-xs font-light hidden sm:inline dark:text-dark-border">|</span>
        
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap text-olive/40 dark:text-dark-sub/40">
          © 2025
        </p>
      </div>

    </footer>
  );
};

export default Footer;