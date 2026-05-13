import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProjects, createProject, updateProject, deleteProject } from '../services/api/projects';
import PageContainer from '../components/layout/PageContainer';
import ProjectGrid from '../components/dashboard/ProjectGrid';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import './DashboardPage.css';

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  // Fetch projects on mount
  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res.data.projects))
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) return;
    try {
      const res = await createProject({ title: newProjectTitle });
      setProjects((prev) => [res.data.project, ...prev]);
      setNewProjectTitle('');
      setIsCreateModalOpen(false);
      toast.success('Project created successfully');
      navigate(`/workspace/${res.data.project.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleEditProject = async () => {
    if (!newProjectTitle.trim() || !selectedProject) return;
    const oldTitle = selectedProject.title;
    
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === selectedProject.id ? { ...p, title: newProjectTitle } : p))
    );
    setIsEditModalOpen(false);
    
    try {
      await updateProject(selectedProject.id, { title: newProjectTitle });
      toast.success('Project title updated');
    } catch (err) {
      setProjects((prev) =>
        prev.map((p) => (p.id === selectedProject.id ? { ...p, title: oldTitle } : p))
      );
      toast.error(err.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    const originalProjects = [...projects];
    
    // Optimistic update
    setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
    setIsDeleteModalOpen(false);
    
    try {
      await deleteProject(selectedProject.id);
      toast.success('Project deleted');
    } catch (err) {
      setProjects(originalProjects);
      toast.error(err.response?.data?.message || 'Failed to delete project');
    }
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
