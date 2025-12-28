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

  // --- FUNGSI SCROLL / REDIRECT KE CARD ---
  const handleTrendingClick = (ventId) => {
    if (!ventId) return;

    // 1. Cari elemen card berdasarkan ID
    const element = document.getElementById(ventId);
    
    if (element) {
      // 2. Scroll smooth ke elemen
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 3. Efek Highlight visual
      element.style.transition = 'all 0.5s ease';
      element.style.transform = 'scale(1.05)';
      element.style.boxShadow = '0 0 0 4px rgba(96, 108, 56, 0.5)'; // Ring Hijau
      element.style.zIndex = '50'; // Z-index tinggi agar di atas elemen lain

      // 4. Reset efek setelah 1.5 detik
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
    <div className="w-[30%] flex flex-col h-full overflow-y-auto pr-4 scrollbar-hide pb-10 border-r border-[#E0E5B6]/50 bg-gradient-to-b from-[#FEFAE0] to-[#FEFAE0]/50">
      
      {/* 1. HEADER & BUTTON */}
      <div className="mb-8 pt-2">
        <h2 className="text-4xl font-black text-[#283618] tracking-tighter mb-1">The Void</h2>
        <p className="text-[10px] font-bold text-[#606C38] uppercase tracking-[0.3em] opacity-80 mb-8 pl-1">
          Ruang Cerita Anonim
        </p>

        <button 
          onClick={onOpenAddVent}
          className="group w-full bg-[#283618] text-[#FEFAE0] py-4 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
        >
          <span className="text-xl group-hover:-translate-y-1 group-hover:rotate-12 transition-transform duration-300">✍️</span> 
          <span>Mulai Cerita</span>
        </button>
      </div>

      {/* 2. POJOK PEDULI (Trending) */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 font-bold text-[#283618] text-[10px] uppercase tracking-widest mb-4 px-2 opacity-60">
          <HiFire className="text-orange-500 text-sm" /> Sedang Trending
        </h3>
        
        <div className="space-y-4">
          
          {/* A. Butuh Rangkulan */}
          {trending.needLove ? (
            <div 
              onClick={() => handleTrendingClick(trending.needLove._id || trending.needLove.id)}
              className="relative overflow-hidden bg-white/60 backdrop-blur-sm p-4 rounded-3xl border border-red-100 shadow-sm hover:shadow-md hover:border-red-300 transition-all cursor-pointer group active:scale-95"
              title="Klik untuk melihat postingan ini"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-125 transition-transform"></div>
              
              <div className="flex items-center gap-2 mb-2 relative z-10">
                 <span className="text-[9px] bg-red-50 text-red-600 px-2 py-1 rounded-lg font-black uppercase tracking-wider border border-red-100">SOS</span>
                 <span className="text-lg">{trending.needLove.mood}</span>
              </div>
              <p className="text-xs text-[#283618] font-medium line-clamp-2 italic opacity-70 group-hover:opacity-100 transition-opacity mb-3">
                "{trending.needLove.content}"
              </p>
              <div className="flex items-center gap-1 text-[10px] text-red-400 font-bold group-hover:text-red-500 transition-colors">
                 <HiHeart className="group-hover:animate-ping" /> 
                 <span className="underline decoration-red-200 decoration-2 underline-offset-2">Beri dukungan pertama</span>
              </div>
            </div>
          ) : null}

          {/* B. Support System */}
          {trending.topSupported ? (
            <div 
              onClick={() => handleTrendingClick(trending.topSupported._id || trending.topSupported.id)}
              className="relative overflow-hidden bg-white/60 backdrop-blur-sm p-4 rounded-3xl border border-green-100 shadow-sm hover:shadow-md hover:border-green-300 transition-all cursor-pointer group active:scale-95"
              title="Klik untuk melihat postingan ini"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-125 transition-transform"></div>
              
              <div className="flex items-center gap-2 mb-2 relative z-10">
                 <span className="text-[9px] bg-green-50 text-green-700 px-2 py-1 rounded-lg font-black uppercase tracking-wider border border-green-100">HERO</span>
                 <span className="text-lg">{trending.topSupported.mood}</span>
              </div>
              <p className="text-xs text-[#283618] font-medium line-clamp-2 italic opacity-70 group-hover:opacity-100 transition-opacity mb-3">
                "{trending.topSupported.content}"
              </p>
              <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold group-hover:text-green-700 transition-colors">
                 <HiLightningBolt className="group-hover:text-yellow-500 transition-colors" /> 
                 {trending.topSupported.supportLen || trending.topSupported.supportCount || 0} Strength collected
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#606C38]/20 to-transparent mb-8"></div>

      {/* 3. FILTER KATEGORI */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 font-bold text-[#283618] text-[10px] uppercase tracking-widest mb-4 px-2 opacity-60">
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
                    ? 'bg-[#606C38] text-white shadow-lg translate-x-1' 
                    : 'bg-white/40 hover:bg-white text-[#283618] hover:shadow-md'}`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-125' : 'group-hover:scale-110'}`}>
                    {cat.icon}
                  </span> 
                  <span className={isActive ? 'opacity-100' : 'opacity-80'}>{cat.label}</span>
                </div>
                
                {/* Counter Badge */}
                {count > 0 && (
                  <span className={`text-[10px] min-w-[20px] h-5 flex items-center justify-center rounded-full font-black relative z-10 transition-colors
                     ${isActive ? 'bg-white text-[#606C38]' : 'bg-[#606C38]/10 text-[#606C38]'}`}>
                     {count}
                  </span>
                )}
                
                {/* Active Background Decor */}
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SORTING */}
      <div>
        <h3 className="flex items-center gap-2 font-bold text-[#283618] text-[10px] uppercase tracking-widest mb-4 px-2 opacity-60">
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
                    ? 'bg-[#BC6C25] border-[#BC6C25] text-white shadow-md' 
                    : 'bg-transparent border-transparent hover:bg-[#BC6C25]/10 text-[#283618]'}`}
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