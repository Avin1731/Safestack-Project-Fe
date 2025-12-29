import React from 'react';
import ProjectProgressBar from './ProjectProgressBar';

const ProjectGalleryCard = ({ project, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="p-10 rounded-[3rem] border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden
        bg-pale border-sage
        dark:bg-dark-card dark:border-dark-border"
    >
      {/* Status Badge */}
      <div className={`absolute top-6 right-8 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest
        ${project.status === 'completed' 
          ? 'bg-olive text-white dark:bg-blue-600' 
          : 'bg-earth text-white dark:bg-orange-600'}`}>
        {project.status}
      </div>

      <h4 className="text-2xl font-black mb-6 leading-tight transition-colors
        text-forest group-hover:text-olive
        dark:text-dark-text dark:group-hover:text-blue-400">
        {project.name}
      </h4>
      
      <ProjectProgressBar stats={project.task_stats} />
      
      <div className="mt-8 pt-6 border-t flex items-center justify-between opacity-40
        border-sage/50 text-forest
        dark:border-dark-border dark:text-dark-sub">
        <span className="text-[10px] font-bold italic tracking-tighter">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <button className="text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform text-forest dark:text-white">
          Open Board →
        </button>
      </div>
    </div>
  );
};

export default ProjectGalleryCard;