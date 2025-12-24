import React from 'react';
import { motion as Motion } from 'framer-motion';
import { HiChevronLeft } from 'react-icons/hi';
import ProgressBar from '../components/ProjectProgressBar';

const ProjectGallery = ({ projects, tasks, onSelectProject, onOpenAddModal, onBack }) => {
  // Fungsi menghitung statistik tugas per proyek
  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const total = projectTasks.length;
    
    if (total === 0) return { todo: 0, inProgress: 0, done: 0, total: 0 };

    // Kalkulasi persentase untuk Rainbow Bar
    return {
      todo: (projectTasks.filter(t => t.status === 'todo').length / total) * 100,
      ongoing: (projectTasks.filter(t => t.status === 'in-progress').length / total) * 100,
      done: (projectTasks.filter(t => t.status === 'done').length / total) * 100,
      total
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-10">
      {/* HEADER SECTION: Added Back Button */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-6">
          {/* Tombol Kembali ke Dashboard Utama */}
          <button 
            onClick={onBack}
            className="p-4 bg-[#FAEDCE] rounded-[1.5rem] text-[#606C38] hover:scale-110 active:scale-95 transition-all shadow-sm border border-[#E0E5B6]"
            title="Kembali ke Dashboard"
          >
            <HiChevronLeft size={28} />
          </button>

          <div>
            <h2 className="text-4xl font-black text-[#606C38] tracking-tighter leading-tight">My Projects</h2>
            <p className="text-[#606C38]/60 font-bold uppercase tracking-widest text-[10px] mt-1 ml-1">Kelola fokusmu hari ini.</p>
          </div>
        </div>

        {/* Tombol Create New Project */}
        <button 
          onClick={onOpenAddModal}
          className="bg-[#606C38] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#283618] active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="text-lg">+</span> Project Baru
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
              className="bg-[#FAEDCE] p-10 rounded-[3.5rem] border border-[#E0E5B6] shadow-sm cursor-pointer group transition-all hover:shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div 
                  className="w-14 h-14 rounded-2xl shadow-inner border border-white/20" 
                  style={{ backgroundColor: project.themeColor || '#CCD5AE' }} 
                />
                <div className="bg-[#606C38]/5 px-3 py-1 rounded-full border border-[#606C38]/10">
                  <span className="text-[9px] font-black text-[#606C38] uppercase tracking-tighter">{stats.total} Tasks</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-[#283618] mb-6 group-hover:text-[#606C38] transition-colors leading-tight truncate">
                {project.name}
              </h3>
              
              <div className="space-y-3 pt-6 border-t border-[#E0E5B6]/50">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#606C38]/60 px-1">
                  <span>Progress</span>
                  <span className="text-[#606C38]">{Math.round((stats.done / 100) * stats.total || 0)}/{stats.total} Done</span>
                </div>
                
                {/* Rainbow Progress Bar */}
                <ProgressBar stats={stats} />
              </div>

              {/* Action Hint */}
              <div className="mt-8 opacity-0 group-hover:opacity-40 transition-opacity flex justify-end">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Board →</span>
              </div>
            </Motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectGallery;