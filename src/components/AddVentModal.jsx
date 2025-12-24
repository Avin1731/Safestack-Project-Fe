import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { useVents } from '../hooks/useVents';

// Konfigurasi warna berdasarkan mood
const moodPalette = {
  '😊': { bg: '#FAEDCE', btn: '#606C38', text: '#283618' },
  '😔': { bg: '#D4A373', btn: '#A0522D', text: '#FEFAE0' },
  '😠': { bg: '#BC6C25', btn: '#283618', text: '#FEFAE0' },
  '🤯': { bg: '#E9EDC9', btn: '#606C38', text: '#283618' },
  '😭': { bg: '#CCD5AE', btn: '#344E41', text: '#FEFAE0' },
  '😴': { bg: '#E0E5B6', btn: '#606C38', text: '#283618' },
};

const AddVentModal = ({ isOpen, onClose }) => {
  const { createVent } = useVents();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kalkulasi posisi acak di dalam area kontainer void (estimasi)
    const pos = { 
      x: Math.floor(Math.random() * 400), 
      y: Math.floor(Math.random() * 300) 
    };
    const rotate = Math.floor(Math.random() * 20) - 10;
    
    // Gunakan warna dari palette sesuai mood yang dipilih
    const color = moodPalette[mood].bg;

    createVent(
      { 
        content, 
        mood, 
        position: pos, 
        rotation: rotate, 
        color 
      }, 
      { 
        onSuccess: () => { 
          setContent(''); 
          onClose(); 
        } 
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <Motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose} 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <Motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            style={{ backgroundColor: moodPalette[mood].bg }}
            className="w-full max-w-lg rounded-[3rem] shadow-2xl p-10 relative z-10 transition-colors duration-500"
          >
            <button 
              onClick={onClose} 
              className="absolute top-8 right-8 hover:scale-110 transition-transform"
            >
              <HiX size={24} style={{ color: moodPalette[mood].btn }} />
            </button>

            <h3 className="text-3xl font-black mb-2 tracking-tighter" style={{ color: moodPalette[mood].btn }}>
              The Void
            </h3>
            <p className="opacity-60 text-xs font-bold uppercase tracking-widest mb-8">
              Lepaskan bebanmu secara anonim.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <textarea
                required
                className="w-full bg-white/30 border border-black/5 rounded-[2rem] p-8 focus:outline-none h-48 resize-none text-lg italic font-medium placeholder:text-black/20"
                placeholder="Apa yang sedang kamu rasakan?..."
                value={content} 
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(moodPalette).map(m => (
                    <button
                      key={m} 
                      type="button" 
                      onClick={() => setMood(m)}
                      className={`text-xl w-12 h-12 flex items-center justify-center rounded-2xl transition-all 
                        ${mood === m ? 'scale-125 shadow-lg bg-white/50' : 'hover:bg-white/20 opacity-50 hover:opacity-100'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  style={{ backgroundColor: moodPalette[mood].btn }}
                  className="text-white font-black px-8 py-4 rounded-full transition-all uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95"
                >
                  Lepaskan
                </button>
              </div>
            </form>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddVentModal;