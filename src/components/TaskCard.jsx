import React from 'react';
import { HiOutlineClock, HiOutlineTrash } from 'react-icons/hi';

const TaskCard = ({ task }) => {
  const priorityColors = {
    low: 'bg-green-500/10 text-green-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    high: 'bg-red-500/10 text-red-500',
  };

  return (
    <div className="bg-slate-700/50 border border-slate-600 p-4 rounded-xl hover:border-blue-500/50 transition-all cursor-grab active:cursor-grabbing group">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <button className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <HiOutlineTrash size={16} />
        </button>
      </div>
      <h4 className="font-bold text-slate-100 mb-1">{task.title}</h4>
      <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>
      <div className="flex items-center gap-1 text-[10px] text-slate-500">
        <HiOutlineClock />
        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TaskCard;