import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import './NoteCard.css';

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className="note-card" onClick={() => onEdit(note)}>
      <div className="note-card-header">
        <h4 className="note-title">{note.title || 'Untitled Note'}</h4>
        <div className="note-actions">
          <button className="note-action-btn" onClick={(e) => { e.stopPropagation(); onEdit(note); }}>
            <Pencil size={12} />
          </button>
          <button className="note-action-btn delete" onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <p className="note-preview">{note.content || 'Empty note...'}</p>
    </div>
  );
};

export default NoteCard;
