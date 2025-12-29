import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiChat, HiLightningBolt, HiFire, HiReply } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useVents } from '../hooks/useVents';

// --- HELPER: Avatar ---
const getAvatarFromHash = (hash) => {
  if (!hash) return '👤';
  const avatars = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];
  const index = hash.charCodeAt(hash.length - 1) % avatars.length;
  return avatars[index];
};

// --- SUB-COMPONENT: COMMENT ITEM ---
const CommentItem = ({ comment, ventId }) => {
  const { toggleCommentLike, replyComment, toggleReplyLike } = useVents();
  
  // Local State for Optimistic UI Like
  const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false); 

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);

  // --- LIKE HANDLER (Optimistic) ---
  const handleLike = () => {
    // 1. Update UI First
    const newCount = likesCount + 1; 
    setLikesCount(newCount);
    setIsLiked(true);

    // 2. Send Request
    toggleCommentLike({ ventId, commentId: comment._id });
  };

  const handleReplyLikeLocal = (replyId) => {
     toggleReplyLike({ ventId, commentId: comment._id, replyId });
  };

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

  const isMine = comment.isMine;
  const isOP = comment.isOP;
  const avatar = getAvatarFromHash(comment.authorHash || 'guest');

  return (
    <div className={`flex flex-col gap-1 w-full ${isMine ? 'items-end' : 'items-start'}`}>
      
      {/* 1. MAIN BUBBLE */}
      <div className={`
          relative max-w-[85%] p-3 rounded-2xl text-sm shadow-sm border
          ${isMine 
            ? 'bg-[#E1FFC7] text-forest border-[#C4E4AE] dark:bg-green-900 dark:text-green-100 dark:border-green-800 rounded-tr-none' 
            : 'bg-white text-forest border-gray-200 dark:bg-dark-card dark:text-dark-text dark:border-dark-border rounded-tl-none'}
      `}>
          
          <div className="flex items-center gap-2 mb-1">
             <span className={`font-bold text-[10px] uppercase tracking-wider ${isMine ? 'text-forest dark:text-green-300' : 'text-earth dark:text-orange-400'}`}>
                {isMine ? "ANDA" : `TEMAN ${avatar}`}
             </span>
             {isOP && (
                <span className="bg-forest text-cream px-1.5 py-0.5 rounded-full font-bold text-[8px] dark:bg-blue-600 dark:text-white">
                  PENULIS
                </span>
             )}
          </div>

          <p className="leading-snug text-[13px]">{comment.content}</p>

          <div className="flex items-center justify-end gap-3 mt-2">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-1 text-[10px] font-bold transition-colors 
                  ${isLiked || likesCount > 0 ? 'text-earth dark:text-orange-500' : 'text-olive/40 hover:text-earth dark:text-dark-sub dark:hover:text-orange-400'}`}
              >
                 <HiFire />
                 {likesCount > 0 && <span>{likesCount}</span>}
              </button>

              <button 
                onClick={startReplyToMain}
                className="flex items-center gap-1 text-[10px] font-bold text-olive/40 hover:text-olive transition-colors dark:text-dark-sub dark:hover:text-blue-400"
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
                        ? 'bg-[#F0FDF4] text-forest border-[#DCFCE7] dark:bg-green-900/50 dark:text-green-100 dark:border-green-800 rounded-tr-none' 
                        : 'bg-gray-50 text-forest border-gray-200 dark:bg-dark-bg dark:text-dark-text dark:border-dark-border rounded-tl-none'}
                `}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold text-[9px] uppercase ${repIsMine ? 'text-forest dark:text-green-300' : 'text-earth dark:text-orange-400'}`}>
                           {repIsMine ? "ANDA" : `TEMAN ${repAvatar}`}
                        </span>
                        {repIsOP && <span className="text-[8px] bg-forest/10 px-1 rounded text-forest font-bold dark:bg-blue-900 dark:text-blue-200">OP</span>}
                    </div>

                    {targetAvatar && (
                        <div className="text-[9px] bg-black/5 px-1.5 py-0.5 rounded mb-1 inline-flex items-center gap-1 opacity-70 dark:bg-white/10 dark:text-dark-sub">
                           <HiReply className="rotate-180" /> Ke: Teman {targetAvatar}
                        </div>
                    )}

                    <p className="leading-snug">{rep.content}</p>

                    <div className="flex justify-end gap-2 mt-1.5">
                        <button onClick={() => handleReplyLikeLocal(replyId)} className={`text-[9px] flex items-center gap-0.5 ${rep.likes?.length > 0 ? 'text-earth dark:text-orange-500' : 'text-olive/40 dark:text-dark-sub'}`}>
                           <HiFire /> {rep.likes?.length || ''}
                        </button>
                        {!repIsMine && (
                          <button onClick={() => startReplyToSub(rep.authorHash)} className="text-[9px] text-olive/40 hover:text-olive dark:text-dark-sub dark:hover:text-blue-400">
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
                     <div className="absolute -top-6 left-0 text-[9px] bg-olive text-white px-2 py-0.5 rounded-t-lg flex items-center gap-1 dark:bg-blue-600">
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
                    className={`border rounded-xl px-3 py-2 text-xs w-52 outline-none shadow-sm transition-all
                      bg-white border-olive/20 focus:border-olive text-forest
                      dark:bg-dark-bg dark:border-dark-border dark:focus:border-blue-500 dark:text-dark-text ${replyTarget ? 'rounded-tl-none' : ''}`}
                 />
             </div>
             <button type="submit" className="bg-olive text-white p-2 rounded-xl text-xs shadow-md hover:bg-forest transition-colors dark:bg-blue-600 dark:hover:bg-blue-700">
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

  // 1. Initial State from Props
  // Ensure the backend sends `isSupported` (boolean) and `supportCount` (number)
  // `supports` array in Mongoose schema should be converted to count & boolean in backend controller before sending
  const [isSupported, setIsSupported] = useState(vent.isSupported || (vent.supports && vent.supports.includes('CURRENT_USER_ID'))); 
  const [supportCount, setSupportCount] = useState(vent.supportCount || vent.supports?.length || 0);

  const moodColors = {
    '😊': 'bg-pale dark:bg-slate-800', 
    '😔': 'bg-sage dark:bg-slate-700', 
    '😠': 'bg-[#FFD6A5] dark:bg-red-900/40',
    '🤯': 'bg-[#E9EDC9] dark:bg-yellow-900/30', 
    '😭': 'bg-[#D8E2DC] dark:bg-cyan-900/30', 
    '😴': 'bg-[#FFF1E6] dark:bg-purple-900/30', 
  };

  const bgColor = moodColors[vent.mood] || 'bg-white dark:bg-dark-card';

  // --- FIXED SUPPORT BUTTON LOGIC ---
  const handleSupport = async () => {
    // A. Optimistic Update (Update UI Immediately)
    const previousSupported = isSupported;
    const previousCount = supportCount;

    const newSupported = !isSupported;
    const newCount = newSupported ? supportCount + 1 : supportCount - 1;

    setIsSupported(newSupported);
    setSupportCount(newCount);

    try {
      // B. Send Request
      // response now directly contains { isSupported, supportCount } because useVents.js returns res.data
      const data = await toggleSupport(vent._id || vent.id);
      
      // C. Sync Data from Backend
      if (data) {
         if (typeof data.supportCount === 'number') {
             setSupportCount(data.supportCount);
         }
         // Optional: Sync supported status if backend sends it
         if (typeof data.isSupported === 'boolean') {
             setIsSupported(data.isSupported);
         }
      }
    } catch (error) {
      console.error("Failed to support:", error);
      // D. Rollback on error
      setIsSupported(previousSupported);
      setSupportCount(previousCount);
    }
  };

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
      id={vent._id || vent.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full rounded-[2rem] p-6 mb-6 shadow-lg border-2 
        border-white/60 dark:border-dark-border ${bgColor}`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border
            bg-white/60 border-white/40 dark:bg-black/20 dark:border-white/10">
            {vent.mood}
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider flex items-center gap-2 text-forest dark:text-dark-text">
              {vent.isOwner ? (
                <span className="bg-olive text-white px-2 py-0.5 rounded-lg text-[10px] shadow-sm dark:bg-blue-600">KAMU</span>
              ) : (
                <span className="bg-white/50 px-2 py-0.5 rounded-lg text-[10px] text-olive font-bold dark:bg-white/10 dark:text-dark-sub">ANONIM</span>
              )}
            </h4>
            <p className="text-[10px] text-olive/70 font-bold mt-1 ml-1 dark:text-dark-sub">
              {formatDistanceToNow(new Date(vent.createdAt), { addSuffix: true, locale: id })}
            </p>
          </div>
        </div>
        
        {vent.isOwner && (
          <button onClick={handleDelete} className="p-2 bg-white/40 text-red-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm dark:bg-black/20 dark:hover:bg-red-900/50">
            <HiOutlineTrash size={18} />
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="mb-6 pl-1">
        <p className="text-forest text-lg font-medium leading-relaxed whitespace-pre-wrap font-sans dark:text-dark-text">
          {vent.content}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3 pt-2 border-t border-forest/5 dark:border-white/10">
        
        {/* SUPPORT BUTTON */}
        <button 
          onClick={handleSupport}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest shadow-sm border
            ${isSupported 
              ? 'bg-olive text-white border-olive shadow-md transform scale-105 dark:bg-blue-600 dark:border-blue-600' 
              : 'bg-white/60 text-olive border-white/40 hover:bg-white dark:bg-black/20 dark:text-dark-sub dark:border-white/10 dark:hover:bg-dark-card'}`}
        >
          <HiLightningBolt size={16} className={isSupported ? 'animate-pulse text-yellow-300' : ''} />
          <span>{supportCount > 0 ? supportCount : 'Dukung'}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest border shadow-sm
            ${showComments 
              ? 'bg-white text-forest ring-2 ring-olive/20 dark:bg-dark-card dark:text-dark-text dark:ring-blue-500/30' 
              : 'bg-white/60 text-olive border-white/40 hover:bg-white dark:bg-black/20 dark:text-dark-sub dark:border-white/10 dark:hover:bg-dark-card'}`}
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
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-inner dark:bg-black/20 dark:border-white/10">
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-olive/20 dark:scrollbar-thumb-white/20 scrollbar-track-transparent">
              {vent.comments && vent.comments.length > 0 ? (
                vent.comments.map((c, idx) => (
                    <CommentItem 
                       key={c._id || idx} 
                       comment={c} 
                       ventId={vent._id || vent.id} 
                    />
                 ))
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block p-3 rounded-full bg-white/50 mb-2 text-xl shadow-sm dark:bg-white/10">🍃</div>
                  <p className="text-xs text-forest/60 font-bold uppercase tracking-widest dark:text-dark-sub">
                    Belum ada suara.<br/>Jadilah yang pertama.
                  </p>
                </div>
              )}
            </div>

            {/* Input Comment */}
            <form onSubmit={handleCommentSubmit} className="flex gap-3 relative">
              <input 
                type="text" 
                placeholder="Tulis tanggapan..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-white border border-white focus:border-olive rounded-2xl px-5 py-3 text-sm outline-none placeholder:text-black/30 shadow-sm transition-all text-forest
                  dark:bg-dark-bg dark:border-dark-border dark:focus:border-blue-500 dark:placeholder:text-white/30 dark:text-dark-text"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="bg-forest text-cream p-3.5 rounded-2xl hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-md active:scale-95 dark:bg-blue-600 dark:text-white"
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