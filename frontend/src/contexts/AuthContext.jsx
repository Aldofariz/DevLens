import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., via a "me" endpoint)
    const checkAuth = async () => {
      try {
        // Assuming there's a /auth/me endpoint that returns user info if session/cookie is valid
        // const response = await axiosInstance.get('/auth/me');
        // setUser(response.data.user);
        
        // For now, check localStorage for a mock user to simulate persistence if needed
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth check failed', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    // const response = await axiosInstance.post('/auth/login', { email, password });
    // setUser(response.data.user);
    // localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Mock login
    const mockUser = { id: '1', name: 'Dev User', email };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (name, email, password) => {
    // const response = await axiosInstance.post('/auth/register', { name, email, password });
    // setUser(response.data.user);
    
    // Mock register
    const mockUser = { id: '1', name, email };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = async () => {
    // await axiosInstance.post('/auth/logout');
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
