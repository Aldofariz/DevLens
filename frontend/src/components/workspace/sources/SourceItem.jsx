import React from 'react';
import { FileText, Link, Image, Trash2 } from 'lucide-react';
import './SourceItem.css';

const SourceItem = ({ source, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'pdf':
      case 'md':
        return <FileText size={16} />;
      case 'link':
        return <Link size={16} />;
      case 'image':
        return <Image size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <div className="source-item">
      <div className="source-info">
        <div className={`source-type-icon ${source.type}`}>
          {getIcon(source.type)}
        </div>
        <span className="source-name" title={source.name}>{source.name}</span>
      </div>
      <button 
        className="source-delete-btn" 
        onClick={(e) => { e.stopPropagation(); onDelete(source.id); }}
        title="Remove source"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default SourceItem;
