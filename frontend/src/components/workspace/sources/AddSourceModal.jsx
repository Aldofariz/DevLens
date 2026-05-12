import React, { useState } from 'react';
import { Upload, Link, UploadCloud, X, Check } from 'lucide-react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import './AddSourceModal.css';

const AddSourceModal = ({ isOpen, onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAdd = () => {
    if (activeTab === 'upload' && selectedFile) {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        name: selectedFile.name,
        type: selectedFile.name.split('.').pop() === 'pdf' ? 'pdf' : 'md',
        createdAt: new Date().toISOString(),
      });
      setSelectedFile(null);
    } else if (activeTab === 'url' && url) {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        name: url.replace(/(^\w+:|^)\/\//, '').split('/')[0],
        type: 'link',
        createdAt: new Date().toISOString(),
      });
      setUrl('');
    }
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add Source"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleAdd} 
            disabled={(activeTab === 'upload' && !selectedFile) || (activeTab === 'url' && !url)}
          >
            Add Source
          </Button>
        </>
      }
    >
      <div className="add-source-tabs">
        <button 
          className={`source-tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <Upload size={16} /> Upload File
        </button>
        <button 
          className={`source-tab ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => setActiveTab('url')}
        >
          <Link size={16} /> Add URL
        </button>
      </div>

      <div className="source-content">
        {activeTab === 'upload' ? (
          <div className="upload-zone">
            <input 
              type="file" 
              id="file-upload" 
              hidden 
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.md"
            />
            <label htmlFor="file-upload" className="upload-label">
              {selectedFile ? (
                <div className="selected-file">
                  <Check size={32} className="check-icon" />
                  <span>{selectedFile.name}</span>
                  <button className="remove-file" onClick={(e) => { e.preventDefault(); setSelectedFile(null); }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud size={48} />
                  <p>Drag and drop your file here</p>
                  <span>Supports PDF, PNG, JPG, Markdown</span>
                  <div className="browse-link">Browse files</div>
                </>
              )}
            </label>
          </div>
        ) : (
          <div className="url-zone">
            <Input 
              placeholder="Paste a URL here..."
              icon={Link}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
            />
            <p className="url-hint">DevLens will crawl the content of the provided URL to use as a source.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddSourceModal;
