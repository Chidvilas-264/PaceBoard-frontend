import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', username: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const res = await axios.post('/api/login', {
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem('paceboardUser', JSON.stringify(res.data));
        setUser(res.data);
        if (!res.data.preferredActivity) navigate('/questionnaire');
        else navigate('/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        const res = await axios.post('/api/register', formData);
        localStorage.setItem('paceboardUser', JSON.stringify(res.data));
        setUser(res.data);
        navigate('/questionnaire');
      }
    } catch (err) {
      setError(err.response?.data || 'Invalid credentials or server error');
    }
  };

  return (
    <div className="animate-fade-in auth-container">
      <div className="card auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          {isLogin ? 'Welcome Back!' : 'Create an Account'}
        </h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="input-field" onChange={handleInputChange} required />
            </div>
          )}
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" className="input-field" onChange={handleInputChange} required />
          </div>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone" className="input-field" onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" className="input-field" onChange={handleInputChange} required />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="input-field" onChange={handleInputChange} required />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" className="input-field" onChange={handleInputChange} required />
            </div>
          )}
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>
            {isLogin ? 'Register now' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
}
