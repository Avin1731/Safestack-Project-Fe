import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HiOutlineClock, HiOutlineTrash, HiPencil } from 'react-icons/hi';
import { useTasks } from '../hooks/useTasks';

const TaskCard = ({ task, projectId, onEditTask, isReadOnly = false }) => {
  const { deleteTask } = useTasks(projectId);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: task.id,
    disabled: isReadOnly 
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  const priorityColors = {
    low: 'bg-[#CCD5AE]/70 text-olive border-olive/10 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-500/30',
    medium: 'bg-[#D4A373]/80 text-white border-[#D4A373]/20 dark:bg-yellow-600/80 dark:border-yellow-500/30',
    high: 'bg-[#BC6C25]/80 text-white border-[#BC6C25]/20 dark:bg-red-600/80 dark:border-red-500/30',
  };

  const cursorStyle = isReadOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing';

  return (
    <div 
      ref={setNodeRef} style={style}
      className={`
        relative overflow-hidden backdrop-blur-md rounded-[2.5rem] transition-all duration-300 group mb-4 border
        bg-gradient-to-b from-pale/90 to-cream/90 border-sage
        dark:from-dark-card/90 dark:to-dark-bg/90 dark:border-dark-border
        ${isDragging ? 'shadow-2xl ring-2 ring-olive scale-[1.02] dark:ring-blue-500' : 'hover:shadow-lg hover:border-olive/30 hover:-translate-y-0.5 dark:hover:border-blue-500/30'}
      `}
    >
      {/* Header: Priority & Actions */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className={`text-[8px] uppercase font-black px-3 py-1.5 rounded-full tracking-widest border shadow-sm ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        
        {!isReadOnly && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onEditTask(task); }} 
              className="p-1.5 rounded-full transition-all
                text-olive/70 hover:text-olive hover:bg-olive/10
                dark:text-dark-sub dark:hover:text-blue-400 dark:hover:bg-blue-500/20"
              title="Edit Task"
            >
              <HiPencil size={16} />
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if(window.confirm('Hapus task ini?')) deleteTask(task.id); 
              }} 
              className="p-1.5 rounded-full transition-all
                text-earth/70 hover:text-earth hover:bg-earth/10
                dark:text-red-400 dark:hover:text-red-500 dark:hover:bg-red-500/20"
              title="Delete Task"
            >
              <HiOutlineTrash size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <h4 
        {...attributes} 
        {...listeners} 
        className={`font-black text-lg mb-3 leading-tight relative z-10
          text-forest dark:text-dark-text ${cursorStyle}`}
      >
        {task.title}
      </h4>
      
      {/* Description */}
      {task.description && (
        <p className="text-sm font-medium line-clamp-2 mb-5 relative z-10
          text-olive/80 dark:text-dark-sub">
          {task.description}
        </p>
      )}

      {/* Footer: Date */}
      <div className="flex items-center gap-2 text-[9px] font-black uppercase relative z-10
        text-olive/50 dark:text-dark-sub/50">
        <HiOutlineClock size={12} />
        <span>{new Date(task.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
      </div>
      
      {/* Decorative Element */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-xl transition-colors
        bg-olive/5 group-hover:bg-olive/10
        dark:bg-blue-500/5 dark:group-hover:bg-blue-500/10" />
    </div>
  );
};

export default TaskCard;