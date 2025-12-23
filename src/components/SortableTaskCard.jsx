import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HiOutlineClock, HiOutlineTrash } from 'react-icons/hi';
import { useTasks } from '../hooks/useTasks';

const SortableTaskCard = ({ task }) => {
  const { deleteTask } = useTasks();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: 'bg-green-500/10 text-green-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    high: 'bg-red-500/10 text-red-500',
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Mencegah trigger drag saat klik hapus
    if (window.confirm('Hapus tugas ini secara permanen?')) {
      deleteTask(task._id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-slate-700/50 border border-slate-600 p-4 rounded-xl hover:border-blue-500/50 transition-all cursor-grab active:cursor-grabbing group touch-none"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {/* Tombol Delete Aktif */}
        <button 
          onClick={handleDelete}
          className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
        >
          <HiOutlineTrash size={18} />
        </button>
      </div>

      {/* Handler Drag dipisah ke konten agar tombol delete tidak macet */}
      <div {...listeners}>
        <h4 className="font-bold text-slate-100 mb-1">{task.title}</h4>
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <HiOutlineClock />
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SortableTaskCard;