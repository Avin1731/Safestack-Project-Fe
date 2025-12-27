import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const KanbanColumn = ({ status, tasks, onEditTask, projectId, isReadOnly = false }) => {
  const { setNodeRef } = useDroppable({ id: status, disabled: isReadOnly });

  const config = {
    'todo': { 
      label: '📌 RENCANA', 
      bgColor: 'bg-[#FAEDCE]/40', 
      borderColor: 'border-[#D4A373]/30', 
      accent: 'bg-[#D4A373]' 
    },
    'in-progress': { 
      label: '⚡ PROSES', 
      bgColor: 'bg-[#FEFAE0]/60', 
      borderColor: 'border-[#BC6C25]/20', 
      accent: 'bg-[#BC6C25]' 
    },
    'done': { 
      label: '✅ SELESAI', 
      bgColor: 'bg-[#E9EDC9]/40', 
      borderColor: 'border-[#606C38]/30', 
      accent: 'bg-[#606C38]' 
    }
  };

  const current = config[status];

  // --- LOGIC STYLE DINAMIS ---
  // Jika ReadOnly (History): Tinggi otomatis (h-fit), scroll dimatikan (biar scroll page aja).
  // Jika Kanban Mode: Tinggi fix (h-[70vh]), scroll aktif di dalam kolom.
  const containerHeight = isReadOnly ? 'h-fit' : 'h-[70vh] overflow-hidden';
  const listScroll = isReadOnly ? '' : 'overflow-y-auto scrollbar-hide';
  const droppablePadding = isReadOnly ? 'pb-0' : 'pb-10';

  return (
    <div className={`flex flex-col ${containerHeight} min-w-[320px] rounded-[3rem] border ${current.borderColor} ${current.bgColor} p-6 transition-all shadow-inner`}>
      
      {/* Header Kolom */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className={`w-2 h-2 rounded-full ${current.accent} animate-pulse`} />
        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-[#283618]/70">
          {current.label}
        </h3>
        <span className="ml-auto text-[10px] font-black opacity-30">{tasks.length}</span>
      </div>

      {/* Area List Task */}
      <div 
        ref={setNodeRef} 
        className={`flex-1 space-y-4 ${listScroll} ${droppablePadding}`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              projectId={projectId} 
              onEditTask={onEditTask} 
              // PENTING: Oper status read only ke TaskCard buat hilangin tombol edit/delete
              isReadOnly={isReadOnly} 
            />
          ))}
        </SortableContext>
        
        {/* Placeholder hanya muncul kalau bukan mode Read Only */}
        {tasks.length === 0 && !isReadOnly && (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-black/5 rounded-[2.5rem] opacity-20 italic text-xs">
            Drop tasks here...
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;