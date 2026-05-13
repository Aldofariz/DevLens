import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './LoginPage.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    // Clear password when switching modes
    setFormData(prev => ({ ...prev, password: '' }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Step 2: After login, direct to dashboard
        await login({ email: formData.email, password: formData.password });
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        // Step 1: After register, switch to login view
        await register({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        });
        toast.success('Registration successful! Please sign in with your new account.');
        setIsLogin(true);
        // Clear password for the login step
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="blur-blob blob-1"></div>
      <div className="blur-blob blob-2"></div>
      
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="auth-logo">DL</div>
          <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
          <p>{isLogin ? 'Sign in to your workspace' : 'Start simplifying your docs today'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <Input
              name="name"
              placeholder="Full name"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-input-wrapper">
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <Button type="submit" variant="primary" className="btn-full" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="auth-footer">
          <button onClick={handleToggle} className="toggle-btn">
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
