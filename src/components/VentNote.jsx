import React from 'react';
import { motion as Motion } from 'framer-motion';
import { HiOutlineXCircle } from 'react-icons/hi';
import { useVents } from '../hooks/useVents'; // Gunakan hook yang sudah ada

const VentNote = ({ vent }) => {
  const { deleteVent } = useVents();

  const handleDelete = () => {
    if (window.confirm('Hapus curhatan ini?')) {
      deleteVent(vent._id, {
        onError: () => {
          alert("Gagal: Kamu hanya bisa menghapus curhatanmu sendiri.");
        }
      });
    }
  };

  return (
    <Motion.div
      drag
      dragMomentum={false}
      initial={{ 
        x: vent.position?.x || 0, 
        y: vent.position?.y || 0, 
        rotate: vent.rotation || 0,
        opacity: 0,
        scale: 0.8 
      }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      whileDrag={{ scale: 1.1, rotate: 0 }}
      className="absolute p-4 w-48 shadow-2xl cursor-grab active:cursor-grabbing select-none rounded-sm group"
      style={{ backgroundColor: vent.color || '#FAEDCE' }}
    >
      <button 
        onClick={handleDelete}
        className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
      >
        <HiOutlineXCircle size={22} />
      </button>

      {/* Pin dekoratif */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full shadow-inner border border-red-700"></div>
      
      <p className="text-slate-800 font-medium text-sm leading-tight mb-2 font-mono break-words whitespace-pre-wrap">
        {vent.content}
      </p>
      
      <div className="flex justify-between items-center mt-2 border-t border-black/10 pt-2">
        <span className="text-lg">{vent.mood}</span>
        <span className="text-[9px] text-black/40 font-bold uppercase tracking-tighter">
          {vent.authorHash ? `Anon: ${vent.authorHash.substring(0, 6)}` : 'Guest'}
        </span>
      </div>
    </Motion.div>
  );
};

export default VentNote;