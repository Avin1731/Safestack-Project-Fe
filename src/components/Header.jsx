import React from 'react';
import { HiMenu, HiPlus } from 'react-icons/hi';

const Header = ({ activeTab, onToggleSidebar, onAddTask, onAddVent, isLoading }) => {
  return (
    <header className="h-24 bg-[#E0E5B6] px-10 flex justify-between items-center shadow-sm border-b border-[#CCD5AE]">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-black capitalize text-[#606C38] tracking-tight">{activeTab}</h2>
        {/* Loading var digunakan agar linter bersih */}
        {isLoading && <span className="text-[10px] bg-[#606C38] text-white px-3 py-1 rounded-full animate-pulse font-bold">SYNCING...</span>}
      </div>

      <div className="flex items-center gap-6">
        {activeTab === 'kanban' && (
          <button onClick={onAddTask} className="flex items-center gap-2 bg-[#606C38] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#283618] transition-all">
            <HiPlus size={20} /> New Task
          </button>
        )}
        {activeTab === 'void' && (
          <button onClick={onAddVent} className="bg-[#BC6C25] text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#a05a1d] transition-all text-sm uppercase">Post to Void</button>
        )}
        <button onClick={onToggleSidebar} className="p-2 text-[#606C38] hover:bg-[#CCD5AE] rounded-xl transition-all">
          <HiMenu size={32} />
        </button>
      </div>
    </header>
  );
};

export default Header;