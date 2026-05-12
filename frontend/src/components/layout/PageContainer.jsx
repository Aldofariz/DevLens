import React from 'react';
import Navbar from './Navbar';
import './PageContainer.css';

const PageContainer = ({ children, showNavbar = true }) => {
  return (
    <div className="page-container">
      {showNavbar && <Navbar />}
      <main className="page-main">
        {children}
      </main>
    </div>
  );
};

export default PageContainer;
