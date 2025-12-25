import React from 'react';

const Dashboard = ({ activeTasksCount, ventsCount, onOpenVoid }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      <div className="bg-[#FAEDCE] p-16 rounded-[4rem] border border-[#E0E5B6] flex flex-col justify-between min-h-[400px] shadow-sm hover:shadow-xl transition-all group">
        <div>
          <h3 className="font-black text-[#606C38] mb-2 uppercase tracking-[0.4em] text-[11px]">Active Tasks</h3>
          <p className="text-[#606C38]/50 text-xs font-bold uppercase tracking-widest">Focus on what matters</p>
        </div>
        <div className="text-[12rem] font-black text-[#606C38] leading-none tracking-tighter group-hover:scale-105 transition-transform duration-500">
          {activeTasksCount}
        </div>
      </div>
      
      <div className="bg-[#CCD5AE] p-16 rounded-[4rem] flex flex-col justify-between min-h-[400px] shadow-[0_20px_50px_rgba(96,108,56,0.15)] group relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#606C38]/10 rounded-full" />
        
        <div className="relative z-10">
          <h3 className="font-black text-[#FEFAE0] uppercase tracking-[0.4em] text-[11px] mb-6">Void Pulse</h3>
          <p className="italic font-bold text-3xl text-[#283618] leading-tight">
            Ada <span className="text-[#FEFAE0]">{ventsCount}</span> pikiran <br/>yang sedang mengudara.
          </p>
        </div>
        
        <button 
          onClick={onOpenVoid}
          className="bg-[#FEFAE0] text-[#606C38] px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-lg w-fit hover:bg-[#606C38] hover:text-[#FEFAE0] transition-all relative z-10 active:scale-95"
        >
          Explore the Void
        </button>
      </div>
    </div>
  );
};

export default Dashboard;