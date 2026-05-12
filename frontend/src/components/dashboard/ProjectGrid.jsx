import React from 'react';
import { Plus } from 'lucide-react';
import ProjectCard from './ProjectCard';
import './ProjectGrid.css';

const ProjectGrid = ({ projects, onCreateNew, onEdit, onDelete }) => {
  return (
    <div className="project-grid">
      <div className="create-project-card" onClick={onCreateNew}>
        <div className="plus-icon-circle">
          <Plus size={24} />
        </div>
        <span>Create new project</span>
      </div>
      
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
