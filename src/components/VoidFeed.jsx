import React from 'react';
import { motion as Motion } from 'framer-motion';
import VentCard from './VentCard';

// Komponen Skeleton (Loading Placeholder)
const SkeletonCard = () => (
  <div className="w-full rounded-[2rem] p-6 mb-6 border-2 border-[#E0E5B6]/50 bg-white/40 animate-pulse">
    <div className="flex gap-4 mb-4">
      {/* Avatar Skeleton */}
      <div className="w-12 h-12 rounded-2xl bg-[#E0E5B6]/50" />
      <div className="flex-1 space-y-2 py-1">
        {/* Title Skeleton */}
        <div className="h-4 w-1/3 bg-[#E0E5B6]/50 rounded-full" />
        <div className="h-3 w-1/4 bg-[#E0E5B6]/30 rounded-full" />
      </div>
    </div>
    {/* Content Skeleton */}
    <div className="space-y-3">
      <div className="h-4 w-full bg-[#E0E5B6]/30 rounded-full" />
      <div className="h-4 w-5/6 bg-[#E0E5B6]/30 rounded-full" />
      <div className="h-4 w-4/6 bg-[#E0E5B6]/30 rounded-full" />
    </div>
  </div>
);

// Konfigurasi Animasi
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15 // Delay antar kartu
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

const VoidFeed = ({ vents, isLoading }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto pr-2 md:pr-4 scrollbar-hide pb-20 scroll-smooth">
      
      {/* 1. LOADING STATE (SKELETON) */}
      {isLoading ? (
        <div className="max-w-3xl mx-auto pt-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          {/* 2. EMPTY STATE */}
          {vents?.length === 0 ? (
            <Motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-[60vh] text-center gap-6"
            >
              <Motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl opacity-80 filter drop-shadow-xl"
              >
                🍃
              </Motion.div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#283618] tracking-tight">Belum ada suara</h3>
                <p className="text-sm font-medium text-[#606C38]/70 max-w-xs mx-auto leading-relaxed">
                  Hening sekali di sini.<br/>Jadilah yang pertama memecah kesunyian.
                </p>
              </div>
            </Motion.div>
          ) : (
            
            // 3. FEED LIST (ANIMATED)
            <Motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="max-w-3xl mx-auto pt-2"
            >
              {vents.map((vent) => (
                <Motion.div key={vent._id || vent.id} variants={itemVariants}>
                  {/* ID diteruskan ke VentCard agar fitur scroll sidebar bekerja */}
                  <VentCard vent={vent} />
                </Motion.div>
              ))}
              
              {/* END OF FEED */}
              <Motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center gap-4 py-12 opacity-30 justify-center group hover:opacity-60 transition-opacity"
              >
                <div className="h-px w-12 bg-[#283618] group-hover:w-20 transition-all" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#283618]">
                  Dasar Void
                </p>
                <div className="h-px w-12 bg-[#283618] group-hover:w-20 transition-all" />
              </Motion.div>
            </Motion.div>
          )}
        </>
      )}

    </div>
  );
};

export default VoidFeed;