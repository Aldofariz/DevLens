import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Plus, MessageSquare, StickyNote, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import SourceList from '../components/workspace/sources/SourceList';
import AddSourceModal from '../components/workspace/sources/AddSourceModal';
import ChatWindow from '../components/workspace/chat/ChatWindow';
import NoteCard from '../components/workspace/notes/NoteCard';
import NoteEditor from '../components/workspace/notes/NoteEditor';
import Button from '../components/ui/Button';
import { getProjects, updateProject, createProject } from '../services/api/projects';
import { getSources, addSource, deleteSource } from '../services/api/sources';
import { getMessages, sendMessage } from '../services/api/messages';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api/notes';
import './WorkspacePage.css';

const WorkspacePage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [sources, setSources] = useState([]);
  const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    
    Promise.all([
      getProjects(),
      getSources(projectId),
      getMessages(projectId),
      getNotes(projectId),
    ])
      .then(([projRes, srcRes, msgRes, noteRes]) => {
        const foundProject = projRes.data.projects.find(p => p.id === projectId);
        if (!foundProject) {
          toast.error("Project not found");
          navigate('/dashboard');
          return;
        }
        setProject(foundProject);
        setTitleInput(foundProject.title);
        setSources(srcRes.data.sources);
        setMessages(msgRes.data.messages);
        setNotes(noteRes.data.notes);
      })
      .catch(() => toast.error("Failed to load workspace"))
      .finally(() => setLoading(false));
  }, [projectId]);

  // Project Title Handlers
  const handleTitleBlur = async () => {
    setIsEditingTitle(false);
    if (titleInput.trim() === project.title || !titleInput.trim()) return;
    try {
      await updateProject(projectId, { title: titleInput.trim() });
      setProject((prev) => ({ ...prev, title: titleInput.trim() }));
      toast.success("Project title updated");
    } catch {
      setTitleInput(project.title); // revert on failure
      toast.error("Failed to update title");
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") e.target.blur();
    if (e.key === "Escape") { setTitleInput(project.title); setIsEditingTitle(false); }
  };

  const handleNewProject = async () => {
    try {
      const res = await createProject({ title: "Untitled Project" });
      navigate(`/workspace/${res.data.project.id}`);
    } catch {
      toast.error("Failed to create new project");
    }
  };

  // Sources Handlers
  const handleAddSource = async (formData) => {
    try {
      const res = await addSource(projectId, formData);
      setSources((prev) => [...prev, res.data.source]);
      toast.success("Source added successfully");
      setIsAddSourceModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  const handleDeleteSource = async (sourceId) => {
    const original = [...sources];
    setSources((prev) => prev.filter((s) => s.id !== sourceId));
    try {
      await deleteSource(projectId, sourceId);
      toast.success("Source removed");
    } catch {
      setSources(original);
      toast.error("Failed to remove source");
    }
  };

  // Chat Handlers
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isAiLoading) return;

    const userMsg = { 
      id: Date.now().toString(), 
      role: "user", 
      content: inputValue, 
      createdAt: new Date().toISOString() 
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsAiLoading(true);

    try {
      const res = await sendMessage(projectId, { content: userMsg.content });
      const aiMsg = res.data.message; 
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      toast.error("AI failed to respond. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Notes Handlers
  const handleAddNote = async () => {
    try {
      const res = await createNote(projectId, { title: "New Note", content: "" });
      setNotes((prev) => [res.data.note, ...prev]);
      setEditingNote(res.data.note);
    } catch {
      toast.error("Failed to create note");
    }
  };

  const handleSaveNote = async (updatedNote) => {
    // This is called by NoteEditor's debounced effect
    try {
      const res = await updateNote(projectId, updatedNote.id, {
        title: updatedNote.title,
        content: updatedNote.content,
      });
      setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? res.data.note : n)));
    } catch {
      toast.error("Failed to auto-save note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    const original = [...notes];
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (editingNote?.id === noteId) setEditingNote(null);
    try {
      await deleteNote(projectId, noteId);
      toast.success("Note deleted");
    } catch {
      setNotes(original);
      toast.error("Failed to delete note");
    }
  };

  if (loading) return <div className="workspace-loading">Loading Workspace...</div>;

  return (
    <div className="workspace-container">
      <nav className="workspace-navbar">
        <div className="ws-nav-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ChevronLeft size={20} />
          </button>
          <div className="ws-logo">DL</div>
        </div>

        <div className="ws-nav-center">
          {isEditingTitle ? (
            <input 
              className="title-edit-input"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleBlur}
              autoFocus
            />
          ) : (
            <div className="title-display" onClick={() => setIsEditingTitle(true)}>
              <h1>{project?.title}</h1>
              <Pencil size={14} className="edit-icon" />
            </div>
          )}
        </div>

        <div className="ws-nav-right">
          <Button variant="outline" size="sm" onClick={handleNewProject}>
            <Plus size={16} /> New Project
          </Button>
          <div className="ws-divider"></div>
          <Navbar />
        </div>
      </nav>

      <div className="workspace-layout">
        {/* LEFT COLUMN - SOURCES */}
        <aside className="workspace-sidebar sources-sidebar">
          <SourceList 
            sources={sources} 
            onAddClick={() => setIsAddSourceModalOpen(true)}
            onDeleteSource={handleDeleteSource}
          />
        </aside>

        {/* CENTER COLUMN - CHAT */}
        <main className="workspace-center">
          {messages.length === 0 ? (
            <div className="chat-placeholder">
              <div className="chat-empty">
                <div className="chat-empty-logo">DL</div>
                <h2>{project?.title}</h2>
                <p>{sources.length} sources · {new Date(project?.createdAt).toLocaleDateString()}</p>
                <span>Add sources and start asking questions.</span>
              </div>
            </div>
          ) : (
            <ChatWindow messages={messages} isLoading={isAiLoading} />
          )}
          
          <div className="chat-input-area">
            <form className="chat-input-container" onSubmit={handleSendMessage}>
              <textarea 
                placeholder="Ask anything about your documents..."
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                type="submit" 
                className="send-btn" 
                disabled={!inputValue.trim() || isAiLoading}
              >
                <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </form>
            <p className="chat-disclaimer">DevLens AI answers based on your uploaded sources only.</p>
          </div>
        </main>

        {/* RIGHT COLUMN - NOTES */}
        <aside className="workspace-sidebar notes-sidebar">
          <div className="notes-header">
            <h3>NOTES</h3>
            <button className="add-note-btn" onClick={handleAddNote}>
              <Plus size={16} />
            </button>
          </div>
          
          <div className="notes-list">
            {editingNote && (
              <NoteEditor 
                note={editingNote} 
                onSave={handleSaveNote}
                onCancel={() => setEditingNote(null)}
              />
            )}
            
            {notes.length === 0 && !editingNote ? (
              <div className="notes-empty">
                <StickyNote size={48} />
                <p>No notes yet</p>
              </div>
            ) : (
              <div className="notes-items">
                {notes
                  .filter(n => n.id !== editingNote?.id)
                  .map(note => (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      onEdit={setEditingNote}
                      onDelete={handleDeleteNote}
                    />
                  ))
                }
              </div>
            )}
          </div>
        </aside>
      </div>

      <AddSourceModal 
        isOpen={isAddSourceModalOpen}
        onClose={() => setIsAddSourceModalOpen(false)}
        onAdd={handleAddSource}
      />
    </div>
  );
};

export default WorkspacePage;
