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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-5 rounded-3xl shadow-sm border border-[#CCD5AE] cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <p className="text-[#283618] font-medium leading-relaxed">
        {task.title}
      </p>
      <div className="mt-4 flex justify-end">
        <span className="text-[10px] bg-[#FEFAE0] px-3 py-1 rounded-full text-[#606C38] font-bold uppercase">
          Task
        </span>
      </div>
    </div>
  );
};

export default KanbanItem;