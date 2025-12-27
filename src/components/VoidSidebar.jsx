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
  
  // Ambil data stats dari hook
  const { stats } = useVents(); 
  const { counts = {}, trending = {} } = stats || {};

  const categories = [
    { id: 'all', label: 'Semua Rasa', icon: '🌈' },
    { id: '😊', label: 'Senang', icon: '😊' },
    { id: '😔', label: 'Sedih', icon: '😔' },
    { id: '😠', label: 'Marah', icon: '😠' },
    { id: '🤯', label: 'Stress', icon: '🤯' },
    { id: '😭', label: 'Nangis', icon: '😭' },
    { id: '😴', label: 'Lelah', icon: '😴' },
  ];

  return (
    <div className="w-[30%] flex flex-col h-full overflow-y-auto pr-2 scrollbar-hide pb-10 border-r border-[#E0E5B6]/50">
      
      {/* 1. HEADER & BUTTON */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#283618] tracking-tighter mb-1">The Void</h2>
        <p className="text-xs font-bold text-[#606C38] uppercase tracking-widest opacity-80 mb-6">
          Pojok Cerita Anonim
        </p>

        <button 
          onClick={onOpenAddVent}
          className="w-full bg-[#283618] text-[#FEFAE0] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
        >
          <span className="text-lg">✍️</span> Mulai Cerita
        </button>
      </div>

      {/* DIVIDER */}
      <hr className="border-[#606C38]/10 mb-8 mx-2" />

      {/* 2. POJOK PEDULI (TRENDING) */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 font-bold text-[#283618] text-xs uppercase tracking-widest mb-4 px-2">
          <HiFire className="text-orange-500" /> Pojok Peduli
        </h3>
        
        <div className="space-y-3">
          {/* A. Butuh Rangkulan (Data Real) */}
          {trending.needLove ? (
            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 cursor-pointer hover:bg-red-50 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Butuh Rangkulan</span>
                 <span className="text-sm">{trending.needLove.mood}</span>
              </div>
              <p className="text-xs text-[#283618] font-medium line-clamp-2 italic opacity-80 group-hover:opacity-100">
                "{trending.needLove.content}"
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-red-400 font-bold">
                 <HiHeart /> Jadilah pendukung pertama
              </div>
            </div>
          ) : (
             <div className="text-[10px] text-center opacity-40 p-3 border border-dashed border-[#283618]/20 rounded-xl">
                Semua baik-baik saja ✨
             </div>
          )}

          {/* B. Support System (Data Real) */}
          {trending.topSupported ? (
            <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 cursor-pointer hover:bg-green-50 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Support System</span>
                 <span className="text-sm">{trending.topSupported.mood}</span>
              </div>
              <p className="text-xs text-[#283618] font-medium line-clamp-2 italic opacity-80 group-hover:opacity-100">
                "{trending.topSupported.content}"
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-green-600 font-bold">
                 <HiLightningBolt /> {trending.topSupported.supportLen || trending.topSupported.supportCount || 0} Strength
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* DIVIDER */}
      <hr className="border-[#606C38]/10 mb-8 mx-2" />

      {/* 3. FILTER KATEGORI (DENGAN COUNT) */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 font-bold text-[#283618] text-xs uppercase tracking-widest mb-4 px-2">
          <HiFilter /> Filter Rasa
        </h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-bold group
                ${activeFilter === cat.id 
                  ? 'bg-[#606C38] text-white shadow-md' 
                  : 'bg-transparent hover:bg-[#606C38]/10 text-[#283618]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span> 
                {cat.label}
              </span>
              
              {/* COUNTER REAL */}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors
                 ${activeFilter === cat.id ? 'bg-white/20 text-white' : 'bg-[#606C38]/10 text-[#606C38]'}`}>
                 {counts[cat.id] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* DIVIDER */}
      <hr className="border-[#606C38]/10 mb-8 mx-2" />

      {/* 4. SORTING */}
      <div>
        <h3 className="flex items-center gap-2 font-bold text-[#283618] text-xs uppercase tracking-widest mb-4 px-2">
          <HiSortDescending /> Urutkan
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { id: 'newest', label: '🕒 Terbaru' },
            { id: 'supported', label: '💪 Paling Kuat' },
            { id: 'discussed', label: '🔥 Sedang Ramai' }
          ].map((sort) => (
            <button 
              key={sort.id}
              onClick={() => setActiveSort(sort.id)}
              className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all 
                ${activeSort === sort.id 
                  ? 'bg-[#BC6C25] text-white shadow-md' 
                  : 'bg-transparent hover:bg-[#BC6C25]/10 text-[#283618]'}`}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default VoidSidebar;