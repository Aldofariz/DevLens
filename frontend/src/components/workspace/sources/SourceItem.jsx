import React from 'react';
import { FileText, Link, Image, Trash2 } from 'lucide-react';
import './SourceItem.css';

const SourceItem = ({ source, onDelete }) => {
  const getIcon = (type) => {
    if (type === 'url') return <Link size={16} />;
    if (type?.includes('image')) return <Image size={16} />;
    if (type?.includes('pdf')) return <FileText size={16} />;
    return <FileText size={16} />;
  };

  const typeClass = source.fileType === 'url' ? 'url' : 'file';

  return (
    <div className="source-item">
      <div className="source-info">
        <div className={`source-type-icon ${typeClass}`}>
          {getIcon(source.fileType)}
        </div>
        <span className="source-name" title={source.fileName}>{source.fileName}</span>
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
