import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const KanbanItem = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.05 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        backdrop-blur-md p-6 rounded-[2.5rem] shadow-sm border
        cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-300
        bg-white/80 border-sage hover:border-olive/30
        dark:bg-dark-card dark:border-dark-border dark:hover:border-blue-500/50
        ${isDragging ? 'shadow-2xl ring-2 ring-olive rotate-2 dark:ring-blue-500' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-md
          text-olive/60 bg-sage/30
          dark:text-dark-sub dark:bg-dark-bg">
           Task
        </span>
      </div>

      <p className="font-bold text-base leading-snug mb-4
        text-forest dark:text-dark-text">
        {task.title}
      </p>
      
      <div className="flex justify-end">
        <div className="h-1 w-8 rounded-full bg-olive/20 dark:bg-dark-border"></div>
      </div>
    </div>
  );
};

export default KanbanItem;