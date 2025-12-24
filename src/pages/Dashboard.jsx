import React from 'react';

const Dashboard = ({ activeTasksCount, ventsCount, onOpenVoid }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl">
      <div className="bg-[#FAEDCE] p-12 rounded-[3rem] shadow-sm border border-[#E0E5B6] flex flex-col justify-center min-h-[300px]">
        <h3 className="font-bold text-[#606C38] mb-4 uppercase tracking-[0.2em] text-[10px]">TUGAS AKTIF</h3>
        <div className="text-9xl font-black text-[#606C38] leading-none tracking-tighter">
          {activeTasksCount}
        </div>
      </div>
      
      <div className="bg-[#CCD5AE] p-12 rounded-[3rem] shadow-lg flex flex-col justify-between min-h-[300px]">
        <div>
          <h3 className="font-bold text-[#606C38] uppercase tracking-[0.2em] text-[10px] mb-4">PESAN VOID</h3>
          <p className="opacity-80 italic font-medium text-lg text-[#283618]">
            Ada {ventsCount} curhatan mengambang.
          </p>
        </div>
        <button 
          onClick={onOpenVoid}
          className="bg-[#FEFAE0] text-[#606C38] px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-sm w-fit hover:scale-105 transition-all"
        >
          BUKA VOID
        </button>
      </div>
    </div>
  );
};

export default Dashboard;