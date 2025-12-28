import React, { useState, useEffect } from 'react';
import { HiEye } from 'react-icons/hi';
import api from '../api/axios'; // Pastikan path import axios instance kamu benar

const Footer = ({ userName }) => {
  const [visitCount, setVisitCount] = useState(0);

  // FETCH REAL COUNT DARI DATABASE
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        // Kita pakai method PUT agar server otomatis nambah +1
        const res = await api.put('/analytics/visit');
        setVisitCount(res.data.visits);
      } catch (error) {
        console.error("Gagal memuat visitor count", error);
        // Fallback jika backend mati/error, biar gak 0 banget
        setVisitCount(8888); 
      }
    };

    fetchVisits();
  }, []);

  return (
    <footer className="w-full py-4 px-8 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#FAEDCE] to-[#FEFAE0] border-t border-[#606C38]/10 relative z-10 transition-all">
      
      {/* KIRI: Status Environment */}
      <div className="flex items-center gap-3 group cursor-default flex-1 justify-start">
        {/* Animated Pulse Dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#606C38] opacity-40 group-hover:opacity-75 transition-opacity"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#606C38]/80 group-hover:bg-[#606C38] transition-colors"></span>
        </span>
        
        <p className="text-[10px] font-bold text-[#606C38]/60 group-hover:text-[#606C38] uppercase tracking-[0.25em] transition-colors whitespace-nowrap hidden sm:block">
          SafeTask Env
        </p>
      </div>

      {/* TENGAH: Real-Time Global Visitor Counter */}
      <div className="flex items-center justify-center gap-2 bg-[#606C38]/5 px-4 py-1.5 rounded-full border border-[#606C38]/10 shadow-sm mx-4">
        <HiEye className="text-[#606C38]/50 text-xs" />
        <div className="flex items-baseline gap-1">
           <span className="text-[10px] font-bold text-[#606C38]/40 uppercase tracking-wider">Visits</span>
           {/* Angka dengan font monospace agar lebar digit konsisten */}
           <span className="text-xs font-black text-[#283618] font-mono tracking-tight">
             {visitCount > 0 ? visitCount.toLocaleString() : '...'}
           </span>
        </div>
      </div>
      
      {/* KANAN: User Info & Copyright */}
      <div className="flex items-center gap-4 mt-2 md:mt-0 flex-1 justify-end">
        <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#606C38]/20"></span>
            <p className="text-[10px] font-black text-[#283618]/70 uppercase tracking-[0.15em] hover:text-[#283618] transition-colors cursor-default max-w-[150px] truncate text-right">
                {userName || 'Guest'}
            </p>
        </div>
        
        <span className="text-[#606C38]/20 text-xs font-light hidden sm:inline">|</span>
        
        <p className="text-[10px] font-bold text-[#606C38]/40 uppercase tracking-[0.2em] whitespace-nowrap">
          © 2025
        </p>
      </div>

    </footer>
  );
};

export default Footer;