import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HiOutlineClock, HiOutlineTrash, HiPencil } from 'react-icons/hi';
import { useTasks } from '../hooks/useTasks';

const TaskCard = ({ task, projectId, onEditTask }) => {
  const { deleteTask } = useTasks(projectId);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  const priorityColors = {
    low: 'bg-[#CCD5AE] text-[#606C38]',
    medium: 'bg-[#D4A373] text-white',
    high: 'bg-[#BC6C25] text-white',
  };

  return (
    <div 
      ref={setNodeRef} style={style}
      className={`bg-[#FAEDCE] border border-[#E0E5B6] p-6 rounded-[2.5rem] transition-all group mb-4 relative overflow-hidden ${isDragging ? 'shadow-2xl ring-2 ring-[#606C38]' : 'hover:shadow-xl'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[7px] uppercase font-black px-3 py-1 rounded-full tracking-widest ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onEditTask(task); }} className="text-[#606C38] hover:scale-125 transition-transform"><HiPencil size={18} /></button>
          <button onClick={(e) => { e.stopPropagation(); if(window.confirm('Hapus?')) deleteTask(task.id); }} className="text-[#BC6C25] hover:scale-125 transition-transform"><HiOutlineTrash size={18} /></button>
        </div>
      </div>

      <h4 {...attributes} {...listeners} className="font-black text-[#283618] text-lg mb-2 cursor-grab active:cursor-grabbing leading-tight">
        {task.title}
      </h4>
      <p className="text-xs text-[#606C38]/70 font-medium line-clamp-2 mb-4">{task.description}</p>

      <div className="flex items-center gap-2 text-[9px] font-black uppercase opacity-40">
        <HiOutlineClock size={12} />
        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TaskCard;