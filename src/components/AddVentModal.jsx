import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { HiX, HiPaperAirplane } from 'react-icons/hi';
import { useVents } from '../hooks/useVents';
import { useTheme } from '../context/ThemeContext'; // Import Context

// Konfigurasi Warna Mood (Light & Dark Versions)
const moodPalette = {
  '😊': { 
    label: 'Senang',
    // Light Mode (Creamy Yellow)
    bg: '#FAEDCE', text: '#283618', btn: '#606C38',
    // Dark Mode (Deep Gold/Brown)
    darkBg: '#423D27', darkText: '#FEFAE0', darkBtn: '#606C38'
  },
  '😔': { 
    label: 'Sedih',
    // Light Mode (Sage Green)
    bg: '#E0E5B6', text: '#283618', btn: '#588157',
    // Dark Mode (Deep Olive/Swamp)
    darkBg: '#2F3820', darkText: '#E0E5B6', darkBtn: '#588157'
  },
  '😠': { 
    label: 'Marah',
    // Light Mode (Terra Cotta/Orange)
    bg: '#D4A373', text: '#FEFAE0', btn: '#BC6C25',
    // Dark Mode (Deep Burnt Sienna)
    darkBg: '#4A2C20', darkText: '#FFD6A5', darkBtn: '#BC6C25'
  },
  '🤯': { 
    label: 'Stress',
    // Light Mode (Pale Green)
    bg: '#E9EDC9', text: '#283618', btn: '#606C38',
    // Dark Mode (Deep Forest)
    darkBg: '#253326', darkText: '#E9EDC9', darkBtn: '#606C38'
  },
  '😭': { 
    label: 'Nangis',
    // Light Mode (Greyish Green)
    bg: '#CCD5AE', text: '#FEFAE0', btn: '#344E41',
    // Dark Mode (Deep Slate Green)
    darkBg: '#2D362E', darkText: '#CCD5AE', darkBtn: '#588157'
  },
  '😴': { 
    label: 'Lelah',
    // Light Mode (Pale Cream)
    bg: '#FEFAE0', text: '#283618', btn: '#606C38',
    // Dark Mode (Charcoal Grey)
    darkBg: '#292929', darkText: '#FEFAE0', darkBtn: '#606C38'
  },
};

const AddVentModal = ({ isOpen, onClose }) => {
  const { createVent } = useVents();
  const { isDarkMode } = useTheme(); // Deteksi Dark Mode
  
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setContent('');
      setMood('😊');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !content.trim()) return;

    setIsSubmitting(true);
    
    // Simpan warna background light-nya saja ke DB (agar konsisten saat dilihat orang lain)
    // Atau simpan mood-nya saja, biar frontend yang render warnanya nanti.
    // Di sini kita kirim color light sebagai default fallback.
    const color = moodPalette[mood].bg;

    try {
      await createVent({ content, mood, color });
      onClose();
    } catch (error) {
      console.error("Gagal mengirim:", error);
      alert("Gagal mengirim curhatan. Coba lagi ya!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tentukan warna aktif berdasarkan Dark Mode
  const activeTheme = moodPalette[mood];
  const activeBg = isDarkMode ? activeTheme.darkBg : activeTheme.bg;
  const activeText = isDarkMode ? activeTheme.darkText : activeTheme.text;
  const activeBtn = isDarkMode ? activeTheme.darkBtn : activeTheme.btn;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          
          {/* Backdrop (Darker in Dark Mode) */}
          <Motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} 
            className="absolute inset-0 bg-forest/60 dark:bg-black/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <Motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
            style={{ backgroundColor: activeBg }} // Background Dinamis
            className="w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col transition-colors duration-500 border-4 border-white/20 dark:border-white/5"
          >
            
            {/* Header */}
            <div className="flex justify-between items-start px-8 pt-8 pb-4">
              <div>
                <h3 className="text-3xl font-black tracking-tighter transition-colors duration-500" style={{ color: activeText }}>
                  The Void
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mt-1" style={{ color: activeText }}>
                  Ekspresikan perasaanmu
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
                style={{ color: activeText }}
              >
                <HiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-8 pb-8">
              
              {/* Text Area */}
              <div className="relative flex-1 mb-8 group">
                <textarea
                  required autoFocus disabled={isSubmitting}
                  className="w-full h-52 border-2 border-transparent rounded-[2rem] p-6 text-lg font-medium resize-none outline-none transition-all shadow-inner focus:shadow-lg
                    bg-white/40 focus:border-white/60 placeholder:text-black/20 text-slate-800
                    dark:bg-black/20 dark:focus:border-white/20 dark:placeholder:text-white/20 dark:text-white/90"
                  placeholder={`Ceritakan kenapa kamu merasa ${activeTheme.label.toLowerCase()}...`}
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  style={{ color: isDarkMode ? activeTheme.darkText : '#283618' }} 
                />
                <div 
                  className="absolute bottom-4 right-6 text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm transition-colors duration-500 bg-white/50 dark:bg-black/30" 
                  style={{ color: activeText }}
                >
                  {content.length}/1000
                </div>
              </div>

              {/* Mood Selector & Submit */}
              <div className="flex flex-col gap-6">
                
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60" style={{ color: activeText }}>Pilih Mood</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/30 dark:bg-white/10" style={{ color: activeText }}>
                      {activeTheme.label}
                    </span>
                </div>

                <div className="flex justify-between gap-2 p-2 rounded-2xl backdrop-blur-sm shadow-inner bg-white/30 dark:bg-black/20">
                  {Object.keys(moodPalette).map((m) => (
                    <button
                      key={m} type="button" 
                      onClick={() => setMood(m)}
                      title={moodPalette[m].label}
                      className={`relative w-12 h-12 flex items-center justify-center rounded-xl text-2xl transition-all duration-300
                        ${mood === m 
                          ? 'bg-white shadow-lg scale-110 -translate-y-1 z-10 dark:bg-white/10' 
                          : 'hover:bg-white/40 opacity-60 hover:opacity-100 hover:scale-105 dark:hover:bg-white/5'}`}
                    >
                      {m}
                      {mood === m && (
                        <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-current" style={{ color: activeBtn }} />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  style={{ backgroundColor: activeBtn, color: '#FEFAE0' }}
                  className="w-full font-black py-4 rounded-2xl transition-all uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mt-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">MENGIRIM...</span>
                  ) : (
                    <>
                      LEPASKAN <HiPaperAirplane className="rotate-90 text-lg" />
                    </>
                  )}
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