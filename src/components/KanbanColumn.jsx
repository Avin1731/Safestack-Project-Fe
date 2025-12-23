import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTaskCard from './SortableTaskCard';

const KanbanColumn = ({ status, tasks }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 min-h-[500px] flex flex-col">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 px-2 flex justify-between">
        {status.replace('-', ' ')}
        <span className="bg-slate-700 text-slate-300 px-2 rounded-full text-[10px]">
          {tasks.length}
        </span>
      </h3>
      
      <div ref={setNodeRef} className="flex-1 space-y-4">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard key={task._id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="py-10 text-center text-slate-700 text-xs border-2 border-dashed border-slate-800 rounded-xl">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;