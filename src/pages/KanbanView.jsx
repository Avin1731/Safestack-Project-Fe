import React from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import KanbanColumn from '../components/KanbanColumn';
import ProjectProgressBar from '../components/ProjectProgressBar';

const KanbanView = ({ 
  projects, 
  tasks, 
  selectedProjectId, 
  onSelectProject, 
  onOpenAddProject, 
  onOpenAddTask, 
  onEditTask,
  sensors,
  onDragEnd 
}) => {
  if (!selectedProjectId) {
    return (
      <div className="space-y-12">
        <div className="space-y-2">
          <h3 className="font-black text-[#606C38] uppercase tracking-[0.3em] text-xs">PILIH WORKSPACE</h3>
          <p className="text-[#606C38]/60 text-sm font-medium">Masuk ke project untuk mulai mengelola tugas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <button 
            onClick={onOpenAddProject}
            className="h-64 border-4 border-dashed border-[#CCD5AE] rounded-[3rem] flex items-center justify-center font-black text-[#606C38]/40 hover:bg-[#CCD5AE]/10 transition-all"
          >
            NEW PROJECT
          </button>

          {projects.filter(p => p.status === 'active').map(project => (
            <div 
              key={project.id} 
              onClick={() => onSelectProject(project.id)} 
              className="bg-[#FAEDCE] p-10 rounded-[3rem] border border-[#E0E5B6] shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <h4 className="text-2xl font-black text-[#606C38] mb-6">{project.name}</h4>
              <ProjectProgressBar stats={project.task_stats} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-8">
        <div className="max-w-md w-full">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#606C38] mb-2 opacity-50">Project Progress</p>
          <ProjectProgressBar stats={projects.find(p => p.id === selectedProjectId)?.task_stats} />
        </div>
        <button 
          onClick={onOpenAddTask}
          className="bg-[#606C38] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-[#283618] transition-all"
        >
          + New Task
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {['todo', 'in-progress', 'done'].map(status => (
            <KanbanColumn 
              key={status} 
              status={status} 
              tasks={tasks.filter(t => t.status === status)} 
              onEditTask={onEditTask}
              projectId={selectedProjectId}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanView;