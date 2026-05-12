import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageContainer from '../components/layout/PageContainer';
import ProjectGrid from '../components/dashboard/ProjectGrid';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import './DashboardPage.css';

const DashboardPage = () => {
  const [projects, setProjects] = useState([
    { id: '1', title: 'Technical Spec Analysis', createdAt: 'May 12, 2026', sourceCount: 3 },
    { id: '2', title: 'React Hooks Deep Dive', createdAt: 'May 10, 2026', sourceCount: 5 },
    { id: '3', title: 'System Architecture', createdAt: 'May 08, 2026', sourceCount: 2 },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;
    const newProject = {
      id: Math.random().toString(36).substr(2, 9),
      title: newProjectTitle,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      sourceCount: 0
    };
    setProjects([newProject, ...projects]);
    setNewProjectTitle('');
    setIsCreateModalOpen(false);
    toast.success('Project created successfully');
  };

  const handleEditProject = () => {
    if (!newProjectTitle.trim()) return;
    setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, title: newProjectTitle } : p));
    setIsEditModalOpen(false);
    toast.success('Project title updated');
  };

  const handleDeleteProject = () => {
    setProjects(projects.filter(p => p.id === selectedProject.id ? false : true));
    setIsDeleteModalOpen(false);
    toast.success('Project deleted');
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    setNewProjectTitle(project.title);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  return (
    <PageContainer>
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Projects
            </button>
            <button 
              className={`filter-tab ${filter === 'mine' ? 'active' : ''}`}
              onClick={() => setFilter('mine')}
            >
              My Projects
            </button>
          </div>

          <div className="dashboard-controls">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="view-toggle">
              <button className="active"><LayoutGrid size={18} /></button>
              <button><List size={18} /></button>
            </div>

            <button className="sort-dropdown">
              Most Recent <ChevronDown size={14} />
            </button>

            <Button onClick={() => setIsCreateModalOpen(true)}>
              + New Project
            </Button>
          </div>
        </header>

        <ProjectGrid 
          projects={filteredProjects} 
          onCreateNew={() => setIsCreateModalOpen(true)}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      </div>

      {/* Create Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject} disabled={!newProjectTitle.trim()}>Create</Button>
          </>
        }
      >
        <Input 
          label="Project Title"
          placeholder="Enter project title..."
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
          autoFocus
        />
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pencil size={18} /> Edit Project Title
          </div>
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProject} disabled={!newProjectTitle.trim()}>Save Changes</Button>
          </>
        }
      >
        <Input 
          label="Project Title"
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
          autoFocus
        />
      </Modal>

      {/* Delete Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteProject}>Delete</Button>
          </>
        }
      >
        <div className="delete-confirm">
          <div className="delete-icon-large">
            <Trash2 size={32} />
          </div>
          <p>This action cannot be undone. All sources, messages, and notes in this project will be permanently deleted.</p>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default DashboardPage;
