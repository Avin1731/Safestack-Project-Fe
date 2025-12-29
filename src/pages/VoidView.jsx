import React, { useState } from 'react';
import VoidSidebar from '../components/VoidSidebar';
import VoidFeed from '../components/VoidFeed';
import { useVents } from '../hooks/useVents';

const VoidView = ({ onOpenAddVent }) => {
  const [activeFilter, setActiveFilter] = useState('all'); 
  const [activeSort, setActiveSort] = useState('newest');

  const { vents: filteredVents, isLoading } = useVents(activeFilter, activeSort);

  return (
    <div className="flex flex-col md:flex-row h-full gap-8">
      {/* Sidebar Filter */}
      <VoidSidebar 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeSort={activeSort}
        setActiveSort={setActiveSort}
        onOpenAddVent={onOpenAddVent}
      />

      {/* Feed Content */}
      <VoidFeed 
        vents={filteredVents} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default VoidView;