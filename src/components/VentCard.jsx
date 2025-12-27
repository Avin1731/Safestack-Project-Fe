import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { HiOutlineTrash, HiChat, HiLightningBolt } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useVents } from '../hooks/useVents';

// Helper sederhana untuk generate Avatar dari Hash
const getAvatarFromHash = (hash) => {
  if (!hash) return '👤';
  const avatars = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];
  const index = hash.charCodeAt(hash.length - 1) % avatars.length;
  return avatars[index];
};

const VentCard = ({ vent }) => {
  const { deleteVent, toggleSupport, addComment } = useVents();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Warna background sedikit lebih soft/pastel agar teks lebih terbaca
  const moodColors = {
    '😊': 'bg-[#FAEDCE]', // Cream
    '😔': 'bg-[#E0E5B6]', // Sage Green Soft
    '😠': 'bg-[#FFD6A5]', // Apricot (Ganti agar beda dr senang)
    '🤯': 'bg-[#E9EDC9]', // Muted Green
    '😭': 'bg-[#D8E2DC]', // Greyish Blue
    '😴': 'bg-[#FFF1E6]', // Mist
  };

  const bgColor = moodColors[vent.mood] || 'bg-white';
  
  const handleSupport = () => toggleSupport(vent._id || vent.id);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment({ id: vent._id || vent.id, content: commentText });
    setCommentText('');
  };

  const handleDelete = () => {
    if (window.confirm("Hapus curhatan ini selamanya?")) {
      deleteVent(vent._id || vent.id);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Tambahkan shadow lebih tegas dan border putih tipis untuk depth
      className={`relative w-full rounded-[2rem] p-6 mb-6 shadow-md border-2 border-white/50 ${bgColor}`}
    >
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {/* Mood Icon dengan Background Putih Transparan */}
          <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center text-2xl shadow-sm border border-white/40">
            {vent.mood}
          </div>
          
          <div>
            <h4 className="font-black text-[#283618] text-sm uppercase tracking-wider flex items-center gap-2">
              {vent.isOwner ? (
                <span className="bg-[#606C38] text-white px-2 py-0.5 rounded-lg text-[10px] shadow-sm">KAMU</span>
              ) : (
                <span className="bg-white/50 px-2 py-0.5 rounded-lg text-[10px] text-[#606C38] font-bold">ANONIM</span>
              )}
            </h4>
            <p className="text-[10px] text-[#606C38]/70 font-bold mt-1 ml-1">
              {formatDistanceToNow(new Date(vent.createdAt), { addSuffix: true, locale: id })}
            </p>
          </div>
        </div>

        {vent.isOwner && (
          <button 
            onClick={handleDelete}
            className="p-2 bg-white/40 text-red-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm"
            title="Hapus Curhatan"
          >
            <HiOutlineTrash size={18} />
          </button>
        )}
      </div>

      {/* --- CONTENT --- */}
      <div className="mb-6 pl-1">
        <p className="text-[#283618] text-lg font-medium leading-relaxed whitespace-pre-wrap font-sans">
          {vent.content}
        </p>
      </div>

      {/* --- ACTIONS BUTTONS (Distinct Look) --- */}
      <div className="flex items-center gap-3 pt-2">
        <button 
          onClick={handleSupport}
          // BUTTON DESIGN: Punya background sendiri biar gak nyatu sama kartu
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest shadow-sm border
            ${vent.isSupported 
              ? 'bg-[#606C38] text-white border-[#606C38] shadow-md transform scale-105' 
              : 'bg-white/60 text-[#606C38] border-white/20 hover:bg-white hover:shadow-md'}`}
        >
          <HiLightningBolt size={16} className={vent.isSupported ? 'animate-pulse' : ''} />
          <span>{vent.supportCount > 0 ? vent.supportCount : 'Dukung'}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest border shadow-sm
            ${showComments 
              ? 'bg-white text-[#283618] ring-2 ring-[#606C38]/20' 
              : 'bg-white/60 text-[#606C38] border-white/20 hover:bg-white hover:shadow-md'}`}
        >
          <HiChat size={16} />
          <span>{vent.commentCount > 0 ? vent.commentCount : 'Komen'}</span>
        </button>
      </div>

      {/* --- COMMENTS SECTION (CONTAINERIZED) --- */}
      {showComments && (
        <Motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6"
        >
          {/* VISUAL SEPARATION: 
             Bungkus area komentar dalam kotak semi-transparan (Glassmorphism)
             atau warna solid yang kontras agar terpisah dari konten utama.
          */}
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-4 border border-white/50 shadow-inner">
            
            {/* List Komentar */}
            <div className="space-y-4 mb-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#606C38]/20 scrollbar-track-transparent">
              {vent.comments && vent.comments.length > 0 ? (
                vent.comments.map((c, idx) => {
                  const isOP = c.authorHash === vent.authorHash; 
                  const avatar = getAvatarFromHash(c.authorHash || 'guest');

                  return (
                    <div key={idx} className={`flex gap-3 ${isOP ? 'flex-row-reverse' : ''}`}>
                      
                      {/* Avatar Bubble */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm shadow-md border border-[#E0E5B6]" title="Identitas Anonim">
                        {avatar}
                      </div>

                      {/* Bubble Chat */}
                      <div className={`
                        max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm relative
                        ${isOP 
                          ? 'bg-[#606C38] text-white rounded-tr-none' // Penulis: Hijau Gelap
                          : 'bg-white text-[#283618] rounded-tl-none'} // Orang lain: Putih
                      `}>
                        <div className={`flex items-center gap-2 mb-1 ${isOP ? 'justify-end' : 'justify-start'}`}>
                          <span className={`font-bold text-[9px] uppercase tracking-wider ${isOP ? 'text-white/70' : 'text-[#606C38]/70'}`}>
                            {isOP ? "Penulis (OP)" : `Teman ${avatar}`}
                          </span>
                        </div>
                        <p className="leading-snug">{c.content}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block p-3 rounded-full bg-white/50 mb-2 text-xl">🍃</div>
                  <p className="text-xs text-[#283618]/60 font-bold uppercase tracking-widest">
                    Belum ada suara.
                  </p>
                </div>
              )}
            </div>

            {/* Form Komentar */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 relative">
              <input 
                type="text" 
                placeholder="Tulis tanggapan..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                // INPUT DESIGN: Putih solid agar terlihat jelas sebagai field
                className="flex-1 bg-white border border-white/50 focus:border-[#606C38] rounded-xl px-4 py-3 text-sm outline-none placeholder:text-black/30 shadow-sm transition-all text-[#283618]"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="bg-[#283618] text-[#FEFAE0] p-3 rounded-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-md active:scale-95"
              >
                <HiChat size={18} />
              </button>
            </form>
          </div>
        </Motion.div>
      )}
    </Motion.div>
  );
};

export default VentCard;