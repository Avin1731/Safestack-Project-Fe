import React from 'react';
import { motion as Motion } from 'framer-motion';
import { HiCheckCircle, HiArchive, HiEye, HiCalendar, HiChartPie } from 'react-icons/hi';

const HistoryView = ({ completedProjects, onOpenProject }) => {
  if (completedProjects.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center opacity-40 gap-6">
        <div className="p-6 bg-[#606C38]/10 rounded-full">
          <HiArchive size={64} className="text-[#606C38]" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-black text-[#606C38] tracking-tight">Belum Ada Riwayat</h3>
          <p className="text-[#606C38]/60 font-medium text-sm mt-1">Selesaikan project di Kanban untuk melihatnya di sini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex items-end justify-between border-b border-[#E0E5B6] pb-8">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-[#606C38] rounded-2xl text-[#FEFAE0] shadow-lg shadow-[#606C38]/20">
            <HiCheckCircle size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#283618] tracking-tighter">Riwayat Project</h2>
            <p className="text-[#606C38]/70 font-bold uppercase tracking-widest text-[11px] mt-1.5">
              Arsip & Pencapaian Tim
            </p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-5xl font-black text-[#606C38]">{completedProjects.length}</span>
          <p className="text-[#606C38]/50 font-bold text-[10px] uppercase tracking-widest">Completed</p>
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
            className="group relative bg-white rounded-[2rem] border border-[#E0E5B6] p-1 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="bg-[#FEFAE0]/30 rounded-[1.8rem] p-7 h-full flex flex-col justify-between relative overflow-hidden">
              {/* Decorative Background Icon */}
              <HiCheckCircle className="absolute -right-4 -top-4 text-[#606C38]/5 text-9xl transform rotate-12" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-[#E0E5B6] text-[#606C38] text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
                    Selesai
                  </span>
                  {project.updatedAt && (
                    <div className="flex items-center gap-1 text-[#606C38]/40 text-[10px] font-bold">
                      <HiCalendar size={12} />
                      <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <h4 className="text-2xl font-black text-[#283618] leading-tight mb-2 line-clamp-2 group-hover:text-[#606C38] transition-colors">
                  {project.name}
                </h4>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <HiChartPie className="text-[#606C38]/40" />
                    <span className="text-sm font-bold text-[#606C38]/70">
                      {project.task_stats?.total || 0} Tasks
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => onOpenProject(project.id)}
                className="mt-8 w-full py-4 bg-[#606C38] text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#283618] active:scale-95 transition-all shadow-lg shadow-[#606C38]/20"
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