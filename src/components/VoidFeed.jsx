import React from 'react';
import VentCard from './VentCard';

const VoidFeed = ({ vents, isLoading }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto pr-4 scrollbar-hide pb-20">
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-60 opacity-50 gap-4">
          <div className="w-8 h-8 border-4 border-[#606C38] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-xs uppercase tracking-widest text-[#283618]">Memanggil suara...</p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {vents?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-40 text-center gap-4">
              <div className="text-6xl">🍃</div>
              <p className="font-bold text-sm uppercase tracking-widest text-[#283618]">
                Sepi banget...<br/>Jadilah yang pertama bersuara.
              </p>
            </div>
          ) : (
            // Card List Feed
            <div className="max-w-3xl mx-auto">
              {vents.map((vent) => (
                <VentCard key={vent._id || vent.id} vent={vent} />
              ))}
              
              {/* End of Feed Indicator */}
              <div className="text-center py-10 opacity-30">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#283618]">
                  • Kamu sudah mencapai dasar •
                </p>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default VoidFeed;