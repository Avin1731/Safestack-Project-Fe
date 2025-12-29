import React from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { HiPlus, HiLockClosed, HiCheckCircle, HiClipboardCheck, HiChartPie } from 'react-icons/hi';
import KanbanColumn from '../components/KanbanColumn'; 
import ProjectProgressBar from '../components/ProjectProgressBar';
// --- IMPORT PENTING ---
import ProjectGallery from './ProjectGallery'; 

const KanbanView = ({ 
  projects, 
  tasks, 
  selectedProjectId, 
  onSelectProject, 
  onOpenAddProject, 
  onOpenAddTask, 
  onEditTask, 
  sensors, 
  onDragEnd,
  isReadOnly = false 
}) => {
  
  // ==========================================
  // 1. MODE GALLERY (TAMPILKAN LIST PROJECT)
  // ==========================================
  // Disini kita pakai ProjectGallery agar tidak duplikat kode
  if (!selectedProjectId) {
    return (
      <ProjectGallery 
        projects={projects}
        tasks={tasks}
        onSelectProject={onSelectProject}
        onOpenAddModal={onOpenAddProject}
        onBack={null} // Di Kanban view, biasanya tidak ada tombol back saat di root
      />
    );
  }

  const currentProject = projects.find(p => p.id === selectedProjectId);

  // ==========================================
  // 2. MODE HISTORY / READ ONLY
  // ==========================================
  if (isReadOnly) {
    const doneTasks = tasks.filter(t => t.status === 'done');
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;
    
    return (
      <div className="flex justify-center items-start min-h-screen py-10 relative">
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#606C38_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="w-full max-w-3xl backdrop-blur-xl border-2 rounded-[3rem] shadow-2xl flex flex-col h-fit min-h-[60vh] mb-10
          bg-pale/90 border-sage dark:bg-dark-card/90 dark:border-dark-border">
          
          {/* Header Card */}
          <div className="p-8 border-b flex flex-col items-center text-center relative overflow-hidden rounded-t-[3rem]
            bg-cream border-sage dark:bg-dark-bg dark:border-dark-border">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sage via-olive to-sage dark:from-blue-900 dark:via-blue-500 dark:to-blue-900" />
            
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-bounce shadow-lg
              bg-olive text-cream shadow-olive/30
              dark:bg-blue-600 dark:text-white dark:shadow-none">
              <HiCheckCircle size={48} />
            </div>
            
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-2 line-clamp-1 text-forest dark:text-dark-text">
              {currentProject?.name}
            </h2>
            
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border
              bg-olive/10 text-olive border-olive/20
              dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-500/30">
              <HiLockClosed size={12} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Archived Report</span>
            </div>
          </div>

          {/* Task List */}
          <div className="p-10 shadow-inner relative grow bg-white/40 dark:bg-black/20">
            {doneTasks.length > 0 ? (
              <div className="space-y-4">
                 <KanbanColumn 
                   key="done" 
                   status="done" 
                   tasks={doneTasks} 
                   projectId={selectedProjectId} 
                   isReadOnly={true} 
                 />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center opacity-40 gap-4 py-20">
                <HiClipboardCheck size={48} className="text-olive dark:text-dark-sub" />
                <p className="text-xs font-bold uppercase tracking-widest text-olive dark:text-dark-sub">Tidak ada task tersimpan</p>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="p-6 border-t flex justify-between items-center rounded-b-[3rem]
            bg-cream border-sage text-forest
            dark:bg-dark-bg dark:border-dark-border dark:text-dark-text">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-olive/10 text-olive dark:bg-dark-card dark:text-dark-sub">
                <HiChartPie size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-olive/50 dark:text-dark-sub/50">Completed Tasks</span>
                <span className="text-xl font-black leading-none">
                  {doneTasks.length} <span className="text-sm font-bold text-olive/40 dark:text-dark-sub">/ {totalTasks}</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-olive/50 dark:text-dark-sub/50">Success Rate</span>
              <p className={`text-sm font-bold ${completionRate === 100 ? 'text-olive dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {completionRate}% COMPLETE
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. MODE KANBAN (Active Project)
  // ==========================================
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-12 border-b pb-8 border-sage dark:border-dark-border">
        <div className="max-w-md w-full">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2 text-olive dark:text-dark-sub">Project Progress</p>
          <ProjectProgressBar stats={currentProject?.task_stats} />
        </div>
        
        <button 
          onClick={onOpenAddTask}
          className="px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 hover:-translate-y-1
            bg-olive text-white hover:bg-forest
            dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <HiPlus size={16} /> New Task
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-full">
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