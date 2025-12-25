import React from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { HiPlus, HiLockClosed } from 'react-icons/hi';
import KanbanColumn from '../components/KanbanColumn'; 
import ProjectProgressBar from '../components/ProjectProgressBar';

const KanbanView = ({ 
  projects, tasks, selectedProjectId, onSelectProject, 
  onOpenAddProject, onOpenAddTask, onEditTask, sensors, onDragEnd, isReadOnly = false 
}) => {
  // --- MODE GALLERY: Tampilan saat milih project ---
  if (!selectedProjectId) {
    return (
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end border-b border-[#E0E5B6] pb-8">
          <div>
            <h3 className="font-black text-[#606C38] uppercase tracking-[0.4em] text-[11px] mb-2">Workspaces</h3>
            <h2 className="text-4xl font-black text-[#283618] tracking-tighter">Pilih Fokusmu</h2>
          </div>
          <button 
            onClick={onOpenAddProject}
            className="bg-[#606C38] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#283618] transition-all shadow-lg"
          >
            + Create New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.filter(p => p.status === 'active').map(project => (
            <div 
              key={project.id} 
              onClick={() => onSelectProject(project.id)} 
              className="bg-[#FAEDCE] p-10 rounded-[3.5rem] border border-[#E0E5B6] shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between min-h-[320px]"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#606C38]/10 flex items-center justify-center mb-6 group-hover:bg-[#606C38] transition-colors">
                  <span className="font-black text-[#606C38] group-hover:text-[#FEFAE0]">{project.name.charAt(0)}</span>
                </div>
                <h4 className="text-3xl font-black text-[#283618] mb-8 leading-tight">{project.name}</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase text-[#606C38]/50">
                   <span>Project Health</span>
                   <span>{project.task_stats?.total || 0} Tasks</span>
                </div>
                <ProjectProgressBar stats={project.task_stats} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- MODE BOARD: Tampilan saat di dalam project ---
  return (
    <div className={`flex flex-col h-full ${isReadOnly ? 'grayscale-[0.4]' : ''}`}>
      <div className="flex justify-between items-end mb-12 border-b border-[#E0E5B6] pb-8">
        <div className="max-w-md w-full">
          <div className="flex items-center gap-3 mb-3">
             {isReadOnly && (
               <div className="bg-[#606C38] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                 <HiLockClosed size={12} /> View Only
               </div>
             )}
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#606C38] opacity-50">Current Progress</p>
          </div>
          <ProjectProgressBar stats={projects.find(p => p.id === selectedProjectId)?.task_stats} />
        </div>
        
        {!isReadOnly && (
          <button 
            onClick={onOpenAddTask}
            className="bg-[#606C38] text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#283618] hover:-translate-y-1 transition-all"
          >
            + New Task
          </button>
        )}
      </div>

      {!isReadOnly ? (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {['todo', 'in-progress', 'done'].map(status => (
              <KanbanColumn 
                key={status} status={status} 
                tasks={tasks.filter(t => t.status === status)} 
                onEditTask={onEditTask} projectId={selectedProjectId}
              />
            ))}
          </div>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pointer-events-none select-none">
          {['todo', 'in-progress', 'done'].map(status => (
            <KanbanColumn 
              key={status} status={status} 
              tasks={tasks.filter(t => t.status === status)} 
              projectId={selectedProjectId} isReadOnly={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanView;