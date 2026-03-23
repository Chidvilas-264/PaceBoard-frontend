import React, { useState } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Bell, Moon, Sun, Trash2, LogOut, CheckCircle } from 'lucide-react';

export default function Settings({ user, setUser, setTheme, handleLogout }) {
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
    password: '',
    dailyStepGoal: user?.dailyStepGoal || 10000,
    theme: user?.theme || 'light'
  });
  const [success, setSuccess] = useState('');

  if (!user) return <div>Please login first</div>;

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setFormData({ ...formData, theme: newTheme });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      const res = await axios.put(`/api/user/${user.id}`, formData);
      localStorage.setItem('paceboardUser', JSON.stringify(res.data));
      setUser(res.data);
      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <SettingsIcon className="logo-icon" size={32} /> Preferences
      </h1>

      {success && (
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--secondary)', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={20} /> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Account Details</h2>
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 0, gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" value={formData.phone} className="input-field" onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} className="input-field" onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" name="password" className="input-field" onChange={handleInputChange} placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label>Daily Step Goal</label>
            <input type="number" name="dailyStepGoal" value={formData.dailyStepGoal} className="input-field" onChange={handleInputChange} />
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Theme Settings</h2>
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'auto', gap: '1rem', marginBottom: '2rem' }}>
          <div className="form-group">
            <label style={{ marginBottom: '1rem' }}>Select Application Theme</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={() => handleThemeChange('light')} className={formData.theme === 'light' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Sun size={20} /> Bright Theme
              </button>
              <button type="button" onClick={() => handleThemeChange('dark')} className={formData.theme === 'dark' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Moon size={20} /> Dark Theme
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}>
          Save All Changes
        </button>

        <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '3rem 0' }} />

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#EF4444' }}>Danger Zone</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={handleLogout} className="btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
            <LogOut size={20} /> Logout Account
          </button>
          <button type="button" className="btn-primary" style={{ background: '#EF4444', border: 'none', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }} onClick={() => {
            if(window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
              handleLogout();
            }
          }}>
            <Trash2 size={20} /> Delete Account
          </button>
        </div>
      </form>
    </div>
  );
}
