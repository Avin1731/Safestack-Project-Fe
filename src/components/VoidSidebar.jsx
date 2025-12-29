import React from 'react';
import { HiFilter, HiSortDescending, HiFire, HiHeart, HiLightningBolt } from 'react-icons/hi';
import { useVents } from '../hooks/useVents';

const VoidSidebar = ({ 
  activeFilter, 
  setActiveFilter, 
  activeSort, 
  setActiveSort, 
  onOpenAddVent 
}) => {
  
  const { stats } = useVents(); 
  const { counts = {}, trending = {} } = stats || {};

  const handleTrendingClick = (ventId) => {
    if (!ventId) return;
    const element = document.getElementById(ventId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight effect
      element.style.transition = 'all 0.5s ease';
      element.style.transform = 'scale(1.02)';
      element.style.boxShadow = '0 0 0 4px rgba(96, 108, 56, 0.5)';
      element.style.zIndex = '50';

      setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = 'none';
        element.style.zIndex = 'auto';
      }, 1500);
    } else {
      alert("Postingan mungkin ada di bawah, coba scroll manual ya! 👇");
    }
  };

  const categories = [
    { id: 'all', label: 'Semua', icon: '🌈' },
    { id: '😊', label: 'Senang', icon: '😊' },
    { id: '😔', label: 'Sedih', icon: '😔' },
    { id: '😠', label: 'Marah', icon: '😠' },
    { id: '🤯', label: 'Stress', icon: '🤯' },
    { id: '😭', label: 'Nangis', icon: '😭' },
    { id: '😴', label: 'Lelah', icon: '😴' },
  ];

  return (
    <div className="w-[30%] flex flex-col h-full overflow-y-auto pr-4 scrollbar-hide pb-10 border-r 
      border-sage/50 bg-gradient-to-b from-cream to-cream/50
      dark:border-dark-border dark:from-dark-bg dark:to-dark-card/50">
      
      {/* 1. HEADER & BUTTON */}
      <div className="mb-8 pt-2">
        <h2 className="text-4xl font-black tracking-tighter mb-1 text-forest dark:text-dark-text">The Void</h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mb-8 pl-1 text-olive dark:text-dark-sub">
          Ruang Cerita Anonim
        </p>

        <button 
          onClick={onOpenAddVent}
          className="group w-full py-4 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95
            bg-forest text-cream hover:bg-black
            dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
        >
          <span className="text-xl group-hover:-translate-y-1 group-hover:rotate-12 transition-transform duration-300">✍️</span> 
          <span>Mulai Cerita</span>
        </button>
      </div>

      {/* 2. TRENDING */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest mb-4 px-2 opacity-60 text-forest dark:text-dark-text">
          <HiFire className="text-earth text-sm" /> Sedang Trending
        </h3>
        
        <div className="space-y-4">
          
          {/* A. Need Love */}
          {trending.needLove ? (
            <div 
              onClick={() => handleTrendingClick(trending.needLove._id || trending.needLove.id)}
              className="relative overflow-hidden backdrop-blur-sm p-4 rounded-3xl border shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-95
                bg-white/60 border-red-100 hover:border-red-300
                dark:bg-dark-card dark:border-red-900/50 dark:hover:border-red-700"
              title="Klik untuk melihat"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-125 transition-transform"></div>
              
              <div className="flex items-center gap-2 mb-2 relative z-10">
                  <span className="text-[9px] px-2 py-1 rounded-lg font-black uppercase tracking-wider border
                    bg-red-50 text-red-600 border-red-100
                    dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">SOS</span>
                  <span className="text-lg">{trending.needLove.mood}</span>
              </div>
              <p className="text-xs font-medium line-clamp-2 italic opacity-70 group-hover:opacity-100 transition-opacity mb-3 text-forest dark:text-dark-sub">
                "{trending.needLove.content}"
              </p>
              <div className="flex items-center gap-1 text-[10px] font-bold transition-colors text-red-400 group-hover:text-red-500">
                  <HiHeart className="group-hover:animate-ping" /> 
                  <span className="underline decoration-red-200 dark:decoration-red-800 decoration-2 underline-offset-2">Beri dukungan pertama</span>
              </div>
            </div>
          ) : null}

          {/* B. Support System */}
          {trending.topSupported ? (
            <div 
              onClick={() => handleTrendingClick(trending.topSupported._id || trending.topSupported.id)}
              className="relative overflow-hidden backdrop-blur-sm p-4 rounded-3xl border shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-95
                bg-white/60 border-green-100 hover:border-green-300
                dark:bg-dark-card dark:border-green-900/50 dark:hover:border-green-700"
              title="Klik untuk melihat"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-125 transition-transform"></div>
              
              <div className="flex items-center gap-2 mb-2 relative z-10">
                  <span className="text-[9px] px-2 py-1 rounded-lg font-black uppercase tracking-wider border
                    bg-green-50 text-green-700 border-green-100
                    dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">HERO</span>
                  <span className="text-lg">{trending.topSupported.mood}</span>
              </div>
              <p className="text-xs font-medium line-clamp-2 italic opacity-70 group-hover:opacity-100 transition-opacity mb-3 text-forest dark:text-dark-sub">
                "{trending.topSupported.content}"
              </p>
              <div className="flex items-center gap-1 text-[10px] font-bold transition-colors text-green-600 group-hover:text-green-700 dark:text-green-400 dark:group-hover:text-green-300">
                  <HiLightningBolt className="group-hover:text-yellow-500 transition-colors" /> 
                  {trending.topSupported.supportLen || trending.topSupported.supportCount || 0} Strength collected
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-gradient-to-r from-transparent via-olive/20 dark:via-dark-border to-transparent mb-8"></div>

      {/* 3. FILTER */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest mb-4 px-2 opacity-60 text-forest dark:text-dark-text">
          <HiFilter /> Filter Mood
        </h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => {
            const isActive = activeFilter === cat.id;
            const count = counts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 text-sm font-bold group relative overflow-hidden
                  ${isActive 
                    ? 'bg-olive text-white shadow-lg translate-x-1 dark:bg-blue-600' 
                    : 'bg-white/40 hover:bg-white text-forest hover:shadow-md dark:bg-dark-card dark:text-dark-sub dark:hover:bg-dark-bg'}`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-125' : 'group-hover:scale-110'}`}>
                    {cat.icon}
                  </span> 
                  <span className={isActive ? 'opacity-100' : 'opacity-80'}>{cat.label}</span>
                </div>
                
                {count > 0 && (
                  <span className={`text-[10px] min-w-[20px] h-5 flex items-center justify-center rounded-full font-black relative z-10 transition-colors
                      ${isActive ? 'bg-white text-olive dark:text-blue-600' : 'bg-olive/10 text-olive dark:bg-black/30 dark:text-dark-sub'}`}>
                      {count}
                  </span>
                )}
                
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SORTING */}
      <div>
        <h3 className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest mb-4 px-2 opacity-60 text-forest dark:text-dark-text">
          <HiSortDescending /> Urutkan
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { id: 'newest', label: '🕒 Terbaru' },
            { id: 'supported', label: '💪 Paling Kuat' },
            { id: 'discussed', label: '🔥 Sedang Ramai' }
          ].map((sort) => {
             const isActive = activeSort === sort.id;
             return (
              <button 
                key={sort.id}
                onClick={() => setActiveSort(sort.id)}
                className={`text-left px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 border-2
                  ${isActive 
                    ? 'bg-earth border-earth text-white shadow-md dark:bg-blue-600 dark:border-blue-600' 
                    : 'bg-transparent border-transparent hover:bg-earth/10 text-forest dark:text-dark-sub dark:hover:bg-dark-card'}`}
              >
                {sort.label}
              </button>
             );
          })}
        </div>
      </div>

    </div>
  );
};

export default VoidSidebar;