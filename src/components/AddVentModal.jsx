import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { HiX, HiPaperAirplane } from 'react-icons/hi';
import { useVents } from '../hooks/useVents';

// Konfigurasi warna yang lebih soft & modern
const moodPalette = {
  '😊': { bg: '#FAEDCE', btn: '#606C38', text: '#283618', label: 'Senang' },
  '😔': { bg: '#E0E5B6', btn: '#588157', text: '#283618', label: 'Sedih' },
  '😠': { bg: '#D4A373', btn: '#BC6C25', text: '#FEFAE0', label: 'Marah' },
  '🤯': { bg: '#E9EDC9', btn: '#606C38', text: '#283618', label: 'Stress' },
  '😭': { bg: '#CCD5AE', btn: '#344E41', text: '#FEFAE0', label: 'Nangis' },
  '😴': { bg: '#FEFAE0', btn: '#606C38', text: '#283618', label: 'Lelah' },
};

const AddVentModal = ({ isOpen, onClose }) => {
  const { createVent } = useVents();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form saat modal dibuka
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
    
    const color = moodPalette[mood].bg;

    try {
      await createVent({ 
        content, 
        mood, 
        color 
      });
      onClose();
    } catch (error) {
      console.error("Gagal mengirim:", error);
      alert("Gagal mengirim curhatan. Coba lagi ya!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTheme = moodPalette[mood];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          
          {/* Backdrop Blur dengan animasi smooth */}
          <Motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose} 
            className="absolute inset-0 bg-[#283618]/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <Motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
            style={{ backgroundColor: currentTheme.bg }}
            className="w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col transition-colors duration-500 border-4 border-white/20"
          >
            
            {/* Header / Top Bar */}
            <div className="flex justify-between items-start px-8 pt-8 pb-4">
              <div>
                <h3 className="text-3xl font-black tracking-tighter transition-colors duration-500" style={{ color: currentTheme.text }}>
                  The Void
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mt-1" style={{ color: currentTheme.text }}>
                  Ekspresikan perasaanmu
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                style={{ color: currentTheme.text }}
              >
                <HiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-8 pb-8">
              
              {/* Text Area */}
              <div className="relative flex-1 mb-8 group">
                <textarea
                  required
                  autoFocus
                  disabled={isSubmitting}
                  className="w-full h-52 bg-white/40 border-2 border-transparent focus:border-white/60 rounded-[2rem] p-6 text-lg font-medium resize-none outline-none transition-all placeholder:text-black/20 text-slate-800 shadow-inner focus:shadow-lg focus:bg-white/50"
                  placeholder={`Ceritakan kenapa kamu merasa ${currentTheme.label.toLowerCase()}...`}
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  style={{ color: currentTheme.text }}
                />
                
                {/* Character Counter */}
                <div className="absolute bottom-4 right-6 text-[10px] font-bold px-2 py-1 rounded-md bg-white/50 backdrop-blur-sm transition-colors duration-500" style={{ color: currentTheme.text }}>
                  {content.length}/1000
                </div>
              </div>

              {/* Mood Selector & Submit */}
              <div className="flex flex-col gap-6">
                
                {/* Moods Label */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60" style={{ color: currentTheme.text }}>Pilih Mood</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/30" style={{ color: currentTheme.text }}>{currentTheme.label}</span>
                </div>

                {/* Mood Icons */}
                <div className="flex justify-between gap-2 p-2 bg-white/30 rounded-2xl backdrop-blur-sm shadow-inner">
                  {Object.keys(moodPalette).map((m) => (
                    <button
                      key={m} 
                      type="button" 
                      onClick={() => setMood(m)}
                      title={moodPalette[m].label}
                      className={`relative w-12 h-12 flex items-center justify-center rounded-xl text-2xl transition-all duration-300
                        ${mood === m ? 'bg-white shadow-lg scale-110 -translate-y-1 z-10' : 'hover:bg-white/40 opacity-60 hover:opacity-100 hover:scale-105'}`}
                    >
                      {m}
                      {mood === m && (
                        <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-current" style={{ color: currentTheme.btn }} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  style={{ backgroundColor: currentTheme.btn }}
                  className="w-full text-[#FEFAE0] font-black py-4 rounded-2xl transition-all uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mt-2"
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