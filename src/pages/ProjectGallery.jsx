import React from 'react';
import { motion as Motion } from 'framer-motion';
import { HiChevronLeft } from 'react-icons/hi';
import ProgressBar from '../components/ProjectProgressBar';

const ProjectGallery = ({ projects, tasks, onSelectProject, onOpenAddModal, onBack }) => {
  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const total = projectTasks.length;
    
    if (total === 0) return { todo: 0, inProgress: 0, done: 0, total: 0 };

    return {
      todo: (projectTasks.filter(t => t.status === 'todo').length / total) * 100,
      ongoing: (projectTasks.filter(t => t.status === 'in-progress').length / total) * 100,
      done: (projectTasks.filter(t => t.status === 'done').length / total) * 100,
      total
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-10">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-6">
          {/* Tombol Back (Opsional, hanya muncul jika ada fungsi onBack) */}
          {onBack && (
            <button 
                onClick={onBack}
                className="p-4 rounded-[1.5rem] transition-all shadow-sm border
                bg-pale text-olive border-sage hover:scale-110 active:scale-95
                dark:bg-dark-card dark:text-dark-sub dark:border-dark-border dark:hover:text-white"
                title="Kembali"
            >
                <HiChevronLeft size={28} />
            </button>
          )}

          <div>
            <h3 className="font-black uppercase tracking-[0.4em] text-[11px] mb-2 text-olive dark:text-blue-400">Workspaces</h3>
            <h2 className="text-4xl font-black tracking-tighter leading-tight text-forest dark:text-dark-text">Pilih Fokusmu</h2>
          </div>
        </div>

        <button 
          onClick={onOpenAddModal}
          className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 active:scale-95
            bg-olive text-white hover:bg-forest
            dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <span className="text-lg">+</span> Create New
        </button>
      </div>

      {/* PROJECT GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.filter(p => p.status === 'active').map((project) => {
          const stats = getProjectStats(project.id || project._id);
          return (
            <Motion.div
              key={project.id || project._id}
              whileHover={{ y: -12 }}
              onClick={() => onSelectProject(project.id || project._id)}
              className="p-10 rounded-[3.5rem] border shadow-sm cursor-pointer group transition-all hover:shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[320px]
                bg-pale border-sage
                dark:bg-dark-card dark:border-dark-border dark:hover:border-blue-500/50"
            >
              <div>
                <div className="flex justify-between items-start mb-8">
                    <div 
                    className="w-14 h-14 rounded-2xl shadow-inner border border-white/20 flex items-center justify-center
                        bg-olive/10 group-hover:bg-olive dark:bg-blue-900/30 dark:group-hover:bg-blue-600 transition-colors"
                    >
                        <span className="font-black text-olive group-hover:text-cream dark:text-blue-400 dark:group-hover:text-white">
                            {project.name.charAt(0)}
                        </span>
                    </div>
                    <div className="px-3 py-1 rounded-full border
                    bg-olive/5 border-olive/10 
                    dark:bg-dark-bg dark:border-dark-border">
                    <span className="text-[9px] font-black uppercase tracking-tighter text-olive dark:text-dark-sub">
                        {stats.total} Tasks
                    </span>
                    </div>
                </div>
                
                <h3 className="text-3xl font-black mb-6 leading-tight transition-colors
                    text-forest group-hover:text-olive
                    dark:text-dark-text dark:group-hover:text-blue-400">
                    {project.name}
                </h3>
              </div>
              
              <div className="space-y-3 pt-6 border-t border-sage/50 dark:border-dark-border">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-1
                  text-olive/60 dark:text-dark-sub">
                  <span>Progress</span>
                  <span className="text-olive dark:text-blue-400">{Math.round((stats.done / 100) * stats.total || 0)}/{stats.total} Done</span>
                </div>
                
                <ProgressBar stats={stats} />
              </div>
            </Motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectGallery;