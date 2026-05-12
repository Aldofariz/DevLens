import React, { useState } from 'react';
import { Mail, Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
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
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
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

          {!isLogin && (
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              icon={ShieldCheck}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

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
