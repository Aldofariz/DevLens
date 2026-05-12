import React, { useState, useEffect } from 'react';
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
import './WorkspacePage.css';

const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectTitle, setProjectTitle] = useState('Technical Spec Analysis');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [sources, setSources] = useState([
    { id: '1', name: 'API_Documentation.pdf', type: 'pdf', createdAt: '2026-05-12' },
    { id: '2', name: 'Schema_Design.md', type: 'md', createdAt: '2026-05-12' },
  ]);
  const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAddSource = (newSource) => {
    setSources([...sources, newSource]);
    toast.success('Source added');
  };

  const handleDeleteSource = (sourceId) => {
    setSources(sources.filter(s => s.id !== sourceId));
    toast.success('Source removed');
  };

  const handleTitleSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      setIsEditingTitle(false);
      if (projectTitle.trim()) {
        toast.success('Project renamed');
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isAiLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMsg]);
    setInputValue('');
    setIsAiLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: `I've analyzed your ${sources.length} sources. Based on the documentation, I can help you understand the technical specifications and architecture. What specific part would you like me to explain?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsAiLoading(false);
    }, 1500);
  };

  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  const handleAddNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: '',
      content: '',
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setEditingNote(newNote);
  };

  const handleSaveNote = (updatedNote) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(n => n.id !== noteId));
    if (editingNote?.id === noteId) setEditingNote(null);
    toast.success('Note deleted');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

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
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              onKeyDown={handleTitleSubmit}
              onBlur={handleTitleSubmit}
              autoFocus
            />
          ) : (
            <div className="title-display" onClick={() => setIsEditingTitle(true)}>
              <h1>{projectTitle}</h1>
              <Pencil size={14} className="edit-icon" />
            </div>
          )}
        </div>

        <div className="ws-nav-right">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
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
                <h2>{projectTitle}</h2>
                <p>{sources.length} sources · May 12, 2026</p>
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
