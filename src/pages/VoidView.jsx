import React from 'react';
import VentNote from '../components/VentNote';

const VoidView = ({ vents, onOpenAddVent }) => {
  return (
    <div className="h-full space-y-8">
      <div className="flex justify-between items-center px-4">
        <h3 className="font-black text-[#606C38] uppercase tracking-[0.3em] text-xs font-black">Void Messages</h3>
        <button 
          onClick={onOpenAddVent} 
          className="bg-[#606C38] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-[#283618] transition-all"
        >
          Write to Void ✨
        </button>
      </div>
      <div className="relative w-full h-[65vh] bg-white/30 rounded-[4rem] border-2 border-dashed border-[#CCD5AE] overflow-hidden shadow-inner backdrop-blur-sm">
        {vents.map(v => <VentNote key={v.id || v._id} vent={v} />)}
      </div>
    </div>
  );
};

export default VoidView;