import React from 'react';
import { Upload, FileText } from 'lucide-react';
import SourceItem from './SourceItem';
import './SourceList.css';

const SourceList = ({ sources, onAddClick, onDeleteSource }) => {
  return (
    <div className="source-list-container">
      <div className="source-list-header">
        <h3>SOURCES</h3>
      </div>
      
      <button className="add-source-btn" onClick={onAddClick}>
        <Upload size={16} />
        <span>Add source</span>
      </button>

      <div className="sources-scroll-area">
        {sources.length === 0 ? (
          <div className="empty-sources">
            <FileText size={48} className="empty-icon" />
            <p>No sources yet</p>
            <span>Add a PDF, image, or link to get started.</span>
          </div>
        ) : (
          <div className="sources-items">
            {sources.map(source => (
              <SourceItem 
                key={source.id} 
                source={source} 
                onDelete={onDeleteSource} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SourceList;
