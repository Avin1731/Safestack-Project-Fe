import React, { useState } from 'react';
import VoidSidebar from '../components/VoidSidebar';
import VoidFeed from '../components/VoidFeed';
import { useVents } from '../hooks/useVents';

const VoidView = ({ onOpenAddVent }) => {
  // State Filter & Sort
  const [activeFilter, setActiveFilter] = useState('all'); 
  const [activeSort, setActiveSort] = useState('newest');

  // Fetch Data (Logic ada di hook)
  const { vents: filteredVents, isLoading } = useVents(activeFilter, activeSort);

  return (
    <div className="flex h-full gap-8">
      
      {/* KIRI: Sidebar (Filter, Sort, Trending) */}
      <VoidSidebar 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeSort={activeSort}
        setActiveSort={setActiveSort}
        onOpenAddVent={onOpenAddVent}
      />

      {/* KANAN: Feed Content */}
      <VoidFeed 
        vents={filteredVents} 
        isLoading={isLoading} 
      />

    </div>
  );
};

export default VoidView;