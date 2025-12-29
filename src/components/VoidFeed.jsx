import React from 'react';
import { motion as Motion } from 'framer-motion';
import VentCard from './VentCard';

const SkeletonCard = () => (
  <div className="w-full rounded-[2rem] p-6 mb-6 border-2 animate-pulse
    border-sage/50 bg-white/40 
    dark:border-dark-border dark:bg-dark-card/50">
    <div className="flex gap-4 mb-4">
      <div className="w-12 h-12 rounded-2xl bg-sage/50 dark:bg-dark-border" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 w-1/3 rounded-full bg-sage/50 dark:bg-dark-border" />
        <div className="h-3 w-1/4 rounded-full bg-sage/30 dark:bg-dark-border/50" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 w-full rounded-full bg-sage/30 dark:bg-dark-border/50" />
      <div className="h-4 w-5/6 rounded-full bg-sage/30 dark:bg-dark-border/50" />
      <div className="h-4 w-4/6 rounded-full bg-sage/30 dark:bg-dark-border/50" />
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

const VoidFeed = ({ vents, isLoading }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto pr-2 md:pr-4 scrollbar-hide pb-20 scroll-smooth">
      
      {isLoading ? (
        <div className="max-w-3xl mx-auto pt-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
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
                <h3 className="text-xl font-black tracking-tight text-forest dark:text-dark-text">Belum ada suara</h3>
                <p className="text-sm font-medium max-w-xs mx-auto leading-relaxed text-olive/70 dark:text-dark-sub">
                  Hening sekali di sini.<br/>Jadilah yang pertama memecah kesunyian.
                </p>
              </div>
            </Motion.div>
          ) : (
            <Motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="max-w-3xl mx-auto pt-2"
            >
              {vents.map((vent) => (
                <Motion.div key={vent._id || vent.id} variants={itemVariants}>
                  <VentCard vent={vent} />
                </Motion.div>
              ))}
              
              {/* END MARKER */}
              <Motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center gap-4 py-12 opacity-30 justify-center group hover:opacity-60 transition-opacity"
              >
                <div className="h-px w-12 transition-all bg-forest group-hover:w-20 dark:bg-dark-text" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-forest dark:text-dark-text">
                  Dasar Void
                </p>
                <div className="h-px w-12 transition-all bg-forest group-hover:w-20 dark:bg-dark-text" />
              </Motion.div>
            </Motion.div>
          )}
        </>
      )}

    </div>
  );
};

export default VoidFeed;