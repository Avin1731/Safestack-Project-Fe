import React from 'react';
import { motion as Motion } from 'framer-motion';
import { HiCheckCircle, HiArchive, HiEye, HiCalendar, HiChartPie } from 'react-icons/hi';

const HistoryView = ({ completedProjects, onOpenProject }) => {
  if (completedProjects.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center opacity-40 gap-6">
        <div className="p-6 rounded-full bg-olive/10 dark:bg-dark-card dark:border dark:border-dark-border">
          <HiArchive size={64} className="text-olive dark:text-dark-sub" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-black tracking-tight text-olive dark:text-dark-text">Belum Ada Riwayat</h3>
          <p className="font-medium text-sm mt-1 text-olive/60 dark:text-dark-sub">Selesaikan project di Kanban untuk melihatnya di sini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex items-end justify-between border-b pb-8 border-sage dark:border-dark-border">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-2xl shadow-lg shadow-olive/20 bg-olive text-cream dark:bg-blue-600 dark:text-white dark:shadow-none">
            <HiCheckCircle size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-forest dark:text-dark-text">Riwayat Project</h2>
            <p className="font-bold uppercase tracking-widest text-[11px] mt-1.5 text-olive/70 dark:text-dark-sub">
              Arsip & Pencapaian Tim
            </p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-5xl font-black text-olive dark:text-dark-text">{completedProjects.length}</span>
          <p className="font-bold text-[10px] uppercase tracking-widest text-olive/50 dark:text-dark-sub">Completed</p>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedProjects.map((project, idx) => (
          <Motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative rounded-[2rem] border p-1 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300
              bg-white border-sage hover:border-olive/30
              dark:bg-dark-card dark:border-dark-border dark:hover:border-blue-500/50"
          >
            <div className="rounded-[1.8rem] p-7 h-full flex flex-col justify-between relative overflow-hidden
              bg-cream/30 dark:bg-dark-bg/30">
              
              {/* Decorative Background Icon */}
              <HiCheckCircle className="absolute -right-4 -top-4 text-9xl transform rotate-12 text-olive/5 dark:text-white/5" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider
                    bg-sage text-olive dark:bg-blue-900/50 dark:text-blue-200">
                    Selesai
                  </span>
                  {project.updatedAt && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-olive/40 dark:text-dark-sub">
                      <HiCalendar size={12} />
                      <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <h4 className="text-2xl font-black leading-tight mb-2 line-clamp-2 transition-colors
                  text-forest group-hover:text-olive 
                  dark:text-dark-text dark:group-hover:text-blue-400">
                  {project.name}
                </h4>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <HiChartPie className="text-olive/40 dark:text-dark-sub" />
                    <span className="text-sm font-bold text-olive/70 dark:text-dark-sub">
                      {project.task_stats?.total || 0} Tasks
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => onOpenProject(project.id)}
                className="mt-8 w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg
                  bg-olive text-white hover:bg-forest shadow-olive/20
                  dark:bg-blue-600 dark:hover:bg-blue-700 dark:shadow-none"
              >
                <HiEye size={18} />
                Lihat Detail
              </button>
            </div>
          </Motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;