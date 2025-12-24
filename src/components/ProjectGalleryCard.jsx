import React from 'react';
import ProjectProgressBar from './ProjectProgressBar';

const ProjectGalleryCard = ({ project, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-[#FAEDCE] p-10 rounded-[3rem] border border-[#E0E5B6] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden"
    >
      {/* Status Badge */}
      <div className={`absolute top-6 right-8 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${project.status === 'completed' ? 'bg-[#606C38] text-white' : 'bg-[#BC6C25] text-white'}`}>
        {project.status}
      </div>

      <h4 className="text-2xl font-black text-[#283618] mb-6 leading-tight group-hover:text-[#606C38] transition-colors">
        {project.name}
      </h4>
      
      {/* Pasang Rainbow Progress Bar */}
      <ProjectProgressBar stats={project.task_stats} />
      
      <div className="mt-8 pt-6 border-t border-[#E0E5B6]/50 flex items-center justify-between opacity-40">
        <span className="text-[10px] font-bold italic tracking-tighter">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <button className="text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
          Open Board →
        </button>
      </div>
    </div>
  );
};

export default ProjectGalleryCard;