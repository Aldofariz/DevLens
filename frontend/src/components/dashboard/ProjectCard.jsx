import React, { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/workspace/${project.id}`);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div className="project-card" onClick={handleCardClick}>
      <div className="project-card-header">
        <div className="project-icon">
          {project.title.charAt(0).toUpperCase()}
        </div>
        <div className="project-actions">
          <button className="menu-trigger" onClick={toggleMenu}>
            <MoreVertical size={18} />
          </button>
          
          {showMenu && (
            <div className="context-menu glass" onMouseLeave={() => setShowMenu(false)}>
              <button onClick={(e) => { e.stopPropagation(); onEdit(project); setShowMenu(false); }}>
                <Pencil size={14} /> Edit Title
              </button>
              <button className="delete-opt" onClick={(e) => { e.stopPropagation(); onDelete(project); setShowMenu(false); }}>
                <Trash2 size={14} /> Delete Project
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="project-card-body">
        <h3 className="project-title">{project.title}</h3>
      </div>

      <div className="project-card-footer">
        <div className="project-meta">
          <Calendar size={12} />
          <span>{project.createdAt}</span>
        </div>
        <div className="project-meta">
          <FileText size={12} />
          <span>{project.sourceCount} sources</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
