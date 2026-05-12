import React from 'react';
import './Input.css';

const Input = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className={`input-container ${Icon ? 'has-icon' : ''} ${error ? 'has-error' : ''}`}>
        {Icon && <Icon size={18} className="input-icon" />}
        <input className="input-field" {...props} />
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export default Input;
