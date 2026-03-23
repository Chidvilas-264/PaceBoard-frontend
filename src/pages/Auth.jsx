import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isForgotPassword) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await axios.put('https://paceboard-backend.onrender.com/api/forgot-password', {
          username: formData.username,
          password: formData.password
        });
        setError('');
        setIsForgotPassword(false);
        setIsLogin(true);
        alert("Password reset successfully! Please log in with your new password.");
      } else if (isLogin) {
        const res = await axios.post('https://paceboard-backend.onrender.com/api/login', {
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
        const res = await axios.post('https://paceboard-backend.onrender.com/api/register', formData);
        localStorage.setItem('paceboardUser', JSON.stringify(res.data));
        setUser(res.data);
        navigate('/questionnaire');
      }
    } catch (err) {
      const respData = err.response?.data;
      const errorMessage = typeof respData === 'string' 
        ? respData 
        : (respData?.message || 'Invalid credentials or server error');
      setError(errorMessage);
    }
  };

  return (
    <div className="animate-fade-in auth-container">
      <div className="card auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back!' : 'Create an Account')}
        </h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && !isForgotPassword && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="input-field" onChange={handleInputChange} required />
            </div>
          )}
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" className="input-field" onChange={handleInputChange} required />
          </div>
          {!isLogin && !isForgotPassword && (
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
          <div className="form-group" style={{ position: 'relative' }}>
            <label>{isForgotPassword ? 'New Password' : 'Password'}</label>
            <input type={showPassword ? "text" : "password"} name="password" className="input-field" onChange={handleInputChange} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '38px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {(!isLogin || isForgotPassword) && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input type={showPassword ? "text" : "password"} name="confirmPassword" className="input-field" onChange={handleInputChange} required />
            </div>
          )}
          
          {isLogin && !isForgotPassword && (
            <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1rem' }}>
              <button type="button" onClick={() => setIsForgotPassword(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer' }}>
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          {isForgotPassword ? (
            <button onClick={() => { setIsForgotPassword(false); setIsLogin(true); }} style={{ background: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>
              Back to Login
            </button>
          ) : (
            <>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>
                {isLogin ? 'Register now' : 'Log in here'}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
