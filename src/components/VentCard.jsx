import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiChat, HiLightningBolt, HiFire, HiReply } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useVents } from '../hooks/useVents';

// Helper Avatar
const getAvatarFromHash = (hash) => {
  if (!hash) return '👤';
  const avatars = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];
  const index = hash.charCodeAt(hash.length - 1) % avatars.length;
  return avatars[index];
};

// --- SUB-COMPONENT: COMMENT ITEM ---
const CommentItem = ({ comment, ventId }) => {
  const { toggleCommentLike, replyComment, toggleReplyLike } = useVents();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);

  const handleLike = () => toggleCommentLike({ ventId, commentId: comment._id });
  const handleReplyLike = (replyId) => toggleReplyLike({ ventId, commentId: comment._id, replyId });

  const startReplyToMain = () => {
    setReplyTarget(null);
    setIsReplying(!isReplying);
  };

  const startReplyToSub = (targetHash) => {
    setReplyTarget(targetHash);
    setIsReplying(true);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    replyComment({ 
        ventId, 
        commentId: comment._id, 
        content: replyText,
        replyTo: replyTarget 
    });
    
    setReplyText('');
    setIsReplying(false);
    setReplyTarget(null);
  };

  // Logic Identitas & Styling (WhatsApp Style)
  const isMine = comment.isMine;
  const isOP = comment.isOP;
  const avatar = getAvatarFromHash(comment.authorHash || 'guest');

  return (
    <div className={`flex flex-col gap-1 w-full ${isMine ? 'items-end' : 'items-start'}`}>
      
      {/* 1. BUBBLE UTAMA */}
      <div className={`
         relative max-w-[85%] p-3 rounded-2xl text-sm shadow-sm border
         ${isMine 
           ? 'bg-[#E1FFC7] text-[#283618] rounded-tr-none border-[#C4E4AE]' 
           : 'bg-white text-[#283618] rounded-tl-none border-gray-200'}
      `}>
         
         {/* Header Bubble */}
         <div className="flex items-center gap-2 mb-1">
            <span className={`font-bold text-[10px] uppercase tracking-wider ${isMine ? 'text-[#4A7C59]' : 'text-orange-600'}`}>
               {isMine ? "ANDA" : `TEMAN ${avatar}`}
            </span>
            {isOP && (
               <span className="bg-[#283618] text-[#FEFAE0] text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                 PENULIS
               </span>
            )}
         </div>

         {/* Isi Pesan */}
         <p className="leading-snug text-[13px]">{comment.content}</p>

         {/* Footer Actions */}
         <div className="flex items-center justify-end gap-3 mt-2">
             <button 
                onClick={handleLike}
                className="flex items-center gap-1 text-[10px] font-bold text-black/40 hover:text-orange-500 transition-colors"
             >
                <HiFire className={`${comment.likes?.length > 0 ? 'text-orange-500' : ''}`} />
                {comment.likes?.length > 0 && <span>{comment.likes.length}</span>}
             </button>

             <button 
                onClick={startReplyToMain}
                className="flex items-center gap-1 text-[10px] font-bold text-black/40 hover:text-[#606C38] transition-colors"
             >
                <HiReply /> Balas
             </button>
         </div>
      </div>

      {/* 2. NESTED REPLIES */}
      {comment.replies && comment.replies.length > 0 && (
        <div className={`flex flex-col gap-2 mt-1 w-[90%] ${isMine ? 'items-end' : 'items-start'}`}>
           {comment.replies.map((rep, idx) => {
              const repIsMine = rep.isMine;
              const repIsOP = rep.isOP;
              const repAvatar = getAvatarFromHash(rep.authorHash);
              const targetAvatar = rep.replyTo ? getAvatarFromHash(rep.replyTo) : null;
              const replyId = rep._id || idx;

              return (
                <div key={replyId} className={`
                    relative p-2.5 rounded-xl text-xs shadow-sm border max-w-[90%]
                    ${repIsMine 
                       ? 'bg-[#F0FDF4] text-[#283618] rounded-tr-none border-[#DCFCE7]' 
                       : 'bg-gray-50 text-[#283618] rounded-tl-none border-gray-200'}
                `}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold text-[9px] uppercase ${repIsMine ? 'text-[#4A7C59]' : 'text-orange-600'}`}>
                           {repIsMine ? "ANDA" : `TEMAN ${repAvatar}`}
                        </span>
                        {repIsOP && <span className="text-[8px] bg-[#283618]/10 px-1 rounded text-[#283618] font-bold">OP</span>}
                    </div>

                    {targetAvatar && (
                       <div className="text-[9px] bg-black/5 px-1.5 py-0.5 rounded mb-1 inline-flex items-center gap-1 opacity-70">
                          <HiReply className="rotate-180" /> Ke: Teman {targetAvatar}
                       </div>
                    )}

                    <p className="leading-snug">{rep.content}</p>

                    <div className="flex justify-end gap-2 mt-1.5">
                       <button onClick={() => handleReplyLike(replyId)} className={`text-[9px] flex items-center gap-0.5 ${rep.likes?.length > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                          <HiFire /> {rep.likes?.length || ''}
                       </button>
                       {!repIsMine && (
                         <button onClick={() => startReplyToSub(rep.authorHash)} className="text-[9px] text-gray-400 hover:text-[#606C38]">
                            <HiReply />
                         </button>
                       )}
                    </div>
                </div>
              );
           })}
        </div>
      )}

      {/* 3. INPUT REPLY */}
      <AnimatePresence>
        {isReplying && (
          <Motion.form 
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            onSubmit={handleReplySubmit} 
            className={`flex gap-2 mt-2 items-center ${isMine ? 'justify-end' : 'justify-start'}`}
          >
             <div className="relative">
                 {replyTarget && (
                     <div className="absolute -top-6 left-0 text-[9px] bg-[#606C38] text-white px-2 py-0.5 rounded-t-lg flex items-center gap-1">
                         Balas ke Teman {getAvatarFromHash(replyTarget)}
                         <button type="button" onClick={() => setReplyTarget(null)} className="ml-1 hover:text-red-200">×</button>
                     </div>
                 )}
                 <input 
                    autoFocus
                    type="text" 
                    placeholder={replyTarget ? "Tulis balasan..." : "Balas komentar ini..."}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className={`bg-white border border-[#606C38]/20 focus:border-[#606C38] rounded-xl px-3 py-2 text-xs w-52 outline-none shadow-sm text-[#283618] ${replyTarget ? 'rounded-tl-none' : ''}`}
                 />
             </div>
             <button type="submit" className="bg-[#606C38] text-white p-2 rounded-xl text-xs shadow-md hover:bg-[#283618] transition-colors">
               <HiChat size={14} />
             </button>
          </Motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN COMPONENT ---
const VentCard = ({ vent }) => {
  const { deleteVent, toggleSupport, addComment } = useVents();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const moodColors = {
    '😊': 'bg-[#FAEDCE]', '😔': 'bg-[#E0E5B6]', '😠': 'bg-[#FFD6A5]',
    '🤯': 'bg-[#E9EDC9]', '😭': 'bg-[#D8E2DC]', '😴': 'bg-[#FFF1E6]', 
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
      id={vent._id || vent.id} // PENTING: ID untuk Scroll Into View
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full rounded-[2rem] p-6 mb-6 shadow-lg border-2 border-white/60 ${bgColor}`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
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
          <button onClick={handleDelete} className="p-2 bg-white/40 text-red-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm">
            <HiOutlineTrash size={18} />
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="mb-6 pl-1">
        <p className="text-[#283618] text-lg font-medium leading-relaxed whitespace-pre-wrap font-sans">
          {vent.content}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#283618]/5">
        <button 
          onClick={handleSupport}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest shadow-sm border
            ${vent.isSupported 
              ? 'bg-[#606C38] text-white border-[#606C38] shadow-md transform scale-105' 
              : 'bg-white/60 text-[#606C38] border-white/40 hover:bg-white hover:shadow-md'}`}
        >
          <HiLightningBolt size={16} className={vent.isSupported ? 'animate-pulse' : ''} />
          <span>{vent.supportCount > 0 ? vent.supportCount : 'Dukung'}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest border shadow-sm
            ${showComments 
              ? 'bg-white text-[#283618] ring-2 ring-[#606C38]/20' 
              : 'bg-white/60 text-[#606C38] border-white/40 hover:bg-white hover:shadow-md'}`}
        >
          <HiChat size={16} />
          <span>{vent.commentCount > 0 ? vent.commentCount : 'Komen'}</span>
        </button>
      </div>

      {/* COMMENTS */}
      {showComments && (
        <Motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6"
        >
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-inner">
            
            {/* List Komentar */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#606C38]/20 scrollbar-track-transparent">
              {vent.comments && vent.comments.length > 0 ? (
                vent.comments.map((c, idx) => (
                   <CommentItem 
                      key={c._id || idx} // FIX: Gunakan idx sebagai fallback aman, JANGAN Math.random()
                      comment={c} 
                      ventId={vent._id || vent.id} 
                   />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block p-3 rounded-full bg-white/50 mb-2 text-xl shadow-sm">🍃</div>
                  <p className="text-xs text-[#283618]/60 font-bold uppercase tracking-widest">
                    Belum ada suara.<br/>Jadilah yang pertama.
                  </p>
                </div>
              )}
            </div>

            {/* Input Komentar */}
            <form onSubmit={handleCommentSubmit} className="flex gap-3 relative">
              <input 
                type="text" 
                placeholder="Tulis tanggapan..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-white border border-white focus:border-[#606C38] rounded-2xl px-5 py-3 text-sm outline-none placeholder:text-black/30 shadow-sm transition-all text-[#283618]"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="bg-[#283618] text-[#FEFAE0] p-3.5 rounded-2xl hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-md active:scale-95"
              >
                <HiChat size={20} />
              </button>
            </form>
          </div>
        </Motion.div>
      )}
    </Motion.div>
  );
};

export default VentCard;