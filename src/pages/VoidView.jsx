import React from 'react';
import VentNote from '../components/VentNote';

const VoidView = ({ vents, onOpenAddVent }) => {
  return (
    <div className="h-full flex flex-col space-y-10">
      <div className="flex justify-between items-end border-b border-[#E0E5B6] pb-8">
        <div>
          <h3 className="font-black text-[#606C38] uppercase tracking-[0.4em] text-[11px] mb-2">Deep Thoughts</h3>
          <h2 className="text-4xl font-black text-[#283618] tracking-tighter">The Void</h2>
        </div>
        <button 
          onClick={onOpenAddVent} 
          className="bg-[#283618] text-[#FEFAE0] px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
        >
          Whisper to Void ✨
        </button>
      </div>

      <div className="relative flex-1 bg-[#FAEDCE]/40 rounded-[5rem] border-2 border-dashed border-[#CCD5AE] overflow-hidden shadow-inner backdrop-blur-sm group">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#606C38_1px,transparent_1px)] [background-size:40px_40px]" />
        
        {vents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
             <div className="w-2 h-2 bg-[#606C38] rounded-full animate-ping" />
             <p className="font-black text-[#606C38] uppercase tracking-[0.4em] text-[10px]">Silence in the void...</p>
          </div>
        ) : (
          vents.map(v => <VentNote key={v.id || v._id} vent={v} />)
        )}
      </div>
    </div>
  );
};

export default VoidView;