import React from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { HiPlus, HiLockClosed, HiCheckCircle, HiClipboardCheck, HiChartPie } from 'react-icons/hi';
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
  onDragEnd,
  isReadOnly = false 
}) => {
  
  // ==========================================
  // 1. MODE GALLERY (Belum pilih project)
  // ==========================================
  if (!selectedProjectId) {
    return (
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
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

  const currentProject = projects.find(p => p.id === selectedProjectId);

  // ==========================================
  // 2. MODE HISTORY / READ ONLY (FIXED LAYOUT)
  // ==========================================
  if (isReadOnly) {
    const doneTasks = tasks.filter(t => t.status === 'done');
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;
    
    return (
      // Ubah min-h-full agar background merentang, hapus h-fixed
      <div className="flex justify-center items-start min-h-screen py-10 relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#606C38_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Container: 
            - Hapus h-[85vh] -> ganti jadi h-fit min-h-[500px]
            - Hapus overflow-hidden -> biarkan memanjang ke bawah
        */}
        <div className="w-full max-w-3xl bg-[#FAEDCE]/90 backdrop-blur-xl border-2 border-[#E0E5B6] rounded-[3rem] shadow-2xl flex flex-col h-fit min-h-[60vh] mb-10">
          
          {/* Header Card */}
          <div className="bg-[#FEFAE0] p-8 border-b border-[#E0E5B6] flex flex-col items-center text-center relative overflow-hidden rounded-t-[3rem]">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#CCD5AE] via-[#606C38] to-[#CCD5AE]" />
            
            <div className="w-20 h-20 bg-[#606C38] text-[#FEFAE0] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(96,108,56,0.3)] mb-4 animate-bounce">
              <HiCheckCircle size={48} />
            </div>
            
            <h2 className="text-3xl font-black text-[#283618] tracking-tighter uppercase mb-2 line-clamp-1">
              {currentProject?.name}
            </h2>
            
            <div className="flex items-center gap-2 text-[#606C38] bg-[#606C38]/10 px-4 py-1.5 rounded-full border border-[#606C38]/20">
              <HiLockClosed size={12} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Archived Report</span>
            </div>
          </div>

          {/* Task List Area 
              - Hapus overflow-y-auto -> biar tidak ada scroll dalam
              - Hapus flex-1 -> biar height mengikuti konten
          */}
          <div className="p-10 bg-white/40 shadow-inner relative grow">
            {doneTasks.length > 0 ? (
              <div className="space-y-4">
                 <KanbanColumn 
                    key="done" 
                    status="done" 
                    tasks={doneTasks} 
                    projectId={selectedProjectId} 
                    isReadOnly={true} // Props ini penting!
                  />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center opacity-40 gap-4 py-20">
                <HiClipboardCheck size={48} className="text-[#606C38]" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#606C38]">Tidak ada task tersimpan</p>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="p-6 bg-[#FEFAE0] border-t border-[#E0E5B6] flex justify-between items-center text-[#283618] rounded-b-[3rem]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#606C38]/10 rounded-lg text-[#606C38]">
                <HiChartPie size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#606C38]/50">Completed Tasks</span>
                <span className="text-xl font-black leading-none">
                  {doneTasks.length} <span className="text-sm text-[#606C38]/40 font-bold">/ {totalTasks}</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#606C38]/50">Success Rate</span>
              <p className={`text-sm font-bold ${completionRate === 100 ? 'text-[#606C38]' : 'text-orange-600'}`}>
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
      <div className="flex justify-between items-end mb-12 border-b border-[#E0E5B6] pb-8">
        <div className="max-w-md w-full">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#606C38] opacity-50 mb-2">Project Progress</p>
          <ProjectProgressBar stats={currentProject?.task_stats} />
        </div>
        
        <button 
          onClick={onOpenAddTask}
          className="bg-[#606C38] text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#283618] hover:-translate-y-1 transition-all flex items-center gap-2"
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