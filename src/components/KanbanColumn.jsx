import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const KanbanColumn = ({ status, tasks, onEditTask, projectId, isReadOnly = false }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status, disabled: isReadOnly });

  const config = {
    'todo': { 
      label: '📌 RENCANA', 
      headerBg: 'bg-pale/80 dark:bg-dark-card/80',
      borderColor: 'border-[#D4A373]/30 dark:border-yellow-900/30', 
      accent: 'bg-[#D4A373] dark:bg-yellow-600' 
    },
    'in-progress': { 
      label: '⚡ PROSES', 
      headerBg: 'bg-cream/80 dark:bg-dark-bg/80',
      borderColor: 'border-[#BC6C25]/20 dark:border-orange-900/30', 
      accent: 'bg-[#BC6C25] dark:bg-orange-600' 
    },
    'done': { 
      label: '✅ SELESAI', 
      headerBg: 'bg-[#E9EDC9]/80 dark:bg-blue-900/20',
      borderColor: 'border-olive/30 dark:border-blue-900/30', 
      accent: 'bg-olive dark:bg-blue-600' 
    }
  };

  const current = config[status];
  const containerHeight = isReadOnly ? 'h-fit' : 'h-[75vh]';
  const listScroll = isReadOnly ? '' : 'overflow-y-auto scrollbar-hide';
  const droppablePadding = isReadOnly ? 'pb-0' : 'pb-20';

  return (
    <div className={`flex flex-col ${containerHeight} min-w-[340px] rounded-[3rem] backdrop-blur-sm border transition-all duration-300 shadow-sm relative overflow-hidden
      bg-white/40 border-sage
      dark:bg-dark-card/30 dark:border-dark-border ${current.borderColor}`}>
      
      {/* Visual Indicator saat Drag Over */}
      {isOver && !isReadOnly && (
        <div className="absolute inset-0 z-0 pointer-events-none animate-pulse
          bg-olive/5 dark:bg-blue-500/5" />
      )}

      {/* Header Kolom (Sticky) */}
      <div className={`flex items-center gap-3 p-6 sticky top-0 z-20 backdrop-blur-md border-b 
        ${current.headerBg} ${current.borderColor} dark:border-dark-border`}>
        <div className={`w-3 h-3 rounded-full shadow-sm ${current.accent} ${status === 'in-progress' ? 'animate-pulse' : ''}`} />
        <h3 className="font-black text-xs uppercase tracking-[0.25em] text-forest/80 dark:text-dark-text">
          {current.label}
        </h3>
        <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-lg
          bg-white/50 text-forest/50
          dark:bg-dark-bg/50 dark:text-dark-sub">
          {tasks.length}
        </span>
      </div>

      {/* Area List Task */}
      <div 
        ref={setNodeRef} 
        className={`flex-1 p-4 space-y-4 ${listScroll} ${droppablePadding} relative z-10`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              projectId={projectId} 
              onEditTask={onEditTask} 
              isReadOnly={isReadOnly} 
            />
          ))}
        </SortableContext>
        
        {/* Empty State Placeholder */}
        {tasks.length === 0 && !isReadOnly && (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-[2.5rem] gap-2 mt-2
            border-olive/10 text-olive/40
            dark:border-dark-border dark:text-dark-sub/40">
            <span className="text-2xl opacity-50">📥</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Kosong</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;