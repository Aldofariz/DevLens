import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <div className="logo-icon">DL</div>
          <span className="logo-text">DevLens</span>
        </div>
      </div>
      
      <div className="navbar-right">
        <ThemeToggle />
        
        {user && (
          <>
            <div className="user-avatar" title={user.name}>
              {user.name.charAt(0)}
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">
              <LogOut size={20} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
