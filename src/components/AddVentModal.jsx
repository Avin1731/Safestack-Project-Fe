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
    
    // Warna background sesuai mood
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
          
          {/* Backdrop Blur */}
          <Motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose} 
            className="absolute inset-0 bg-[#283618]/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <Motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            style={{ backgroundColor: currentTheme.bg }}
            className="w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col transition-colors duration-500"
          >
            
            {/* Header / Top Bar */}
            <div className="flex justify-between items-center px-8 pt-8 pb-4">
              <div>
                <h3 className="text-2xl font-black tracking-tighter" style={{ color: currentTheme.text }}>
                  The Void
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60" style={{ color: currentTheme.text }}>
                  Suarakan isi hatimu
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
                style={{ color: currentTheme.text }}
              >
                <HiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-8 pb-8">
              
              {/* Text Area */}
              <div className="relative flex-1 mb-6 group">
                <textarea
                  required
                  autoFocus
                  disabled={isSubmitting}
                  className="w-full h-48 bg-white/40 border-2 border-transparent focus:border-white/50 rounded-[2rem] p-6 text-lg font-medium resize-none outline-none transition-all placeholder:text-black/30 text-slate-800 shadow-inner"
                  placeholder="Apa yang sedang kamu rasakan saat ini?..."
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  style={{ color: currentTheme.text }}
                />
                <div className="absolute bottom-4 right-6 text-[10px] font-bold opacity-40" style={{ color: currentTheme.text }}>
                  {content.length}/1000
                </div>
              </div>

              {/* Mood Selector & Submit */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                
                {/* Moods */}
                <div className="flex gap-2 p-2 bg-white/30 rounded-2xl backdrop-blur-sm">
                  {Object.keys(moodPalette).map((m) => (
                    <button
                      key={m} 
                      type="button" 
                      onClick={() => setMood(m)}
                      title={moodPalette[m].label}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all duration-300 relative
                        ${mood === m ? 'bg-white shadow-md scale-110 z-10' : 'hover:bg-white/50 opacity-70 hover:opacity-100 hover:scale-105'}`}
                    >
                      {m}
                      {mood === m && (
                        <Motion.div 
                          layoutId="activeMoodIndicator"
                          className="absolute -bottom-1 w-1 h-1 rounded-full bg-current"
                          style={{ color: currentTheme.btn }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  style={{ backgroundColor: currentTheme.btn }}
                  className="w-full sm:w-auto text-[#FEFAE0] font-black px-8 py-4 rounded-2xl transition-all uppercase tracking-[0.15em] text-[11px] shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">MENGIRIM...</span>
                  ) : (
                    <>
                      LEPASKAN <HiPaperAirplane className="rotate-90 mb-0.5" />
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