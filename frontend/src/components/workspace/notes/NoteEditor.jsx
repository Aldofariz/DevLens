import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';
import './NoteEditor.css';

const NoteEditor = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  
  const debouncedTitle = useDebounce(title, 500);
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    if (debouncedTitle !== note.title || debouncedContent !== note.content) {
      onSave({ ...note, title: debouncedTitle, content: debouncedContent });
    }
  }, [debouncedTitle, debouncedContent]);

  return (
    <div className="note-editor glass">
      <div className="note-editor-header">
        <input 
          className="note-editor-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          autoFocus
        />
        <button className="close-editor-btn" onClick={onCancel}>
          <X size={16} />
        </button>
      </div>
      <textarea 
        className="note-editor-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
      />
      <div className="note-editor-footer">
        <span className="auto-save-hint">
          <Check size={12} /> Auto-saving...
        </span>
      </div>
    </div>
  );
};

export default NoteEditor;
