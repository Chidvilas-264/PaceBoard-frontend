import React, { useState } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Bell, Moon, Sun, Trash2, LogOut, CheckCircle } from 'lucide-react';

export default function Settings({ user, setUser, setTheme, handleLogout }) {
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
    password: '',
    dailyStepGoal: user?.dailyStepGoal || 10000,
    theme: user?.theme || 'light',
    height: user?.height || '',
    weight: user?.weight || '',
    age: user?.age || '',
    gender: user?.gender || '',
    locality: user?.locality || '',
    preferredActivity: user?.preferredActivity || 'Walk',
    privateProfile: user?.privateProfile || false
  });
  const [success, setSuccess] = useState('');

  const heightM = formData.height ? formData.height / 100 : 0;
  const bmi = heightM > 0 && formData.weight ? (formData.weight / (heightM * heightM)).toFixed(1) : null;
  
  let bmiCategory = '';
  let bmiColor = '';
  if (bmi) {
    if (bmi < 18.5) { bmiCategory = 'Underweight'; bmiColor = '#3B82F6'; }
    else if (bmi < 25) { bmiCategory = 'Healthy Weight'; bmiColor = '#10B981'; }
    else if (bmi < 30) { bmiCategory = 'Overweight'; bmiColor = '#F59E0B'; }
    else { bmiCategory = 'Obese'; bmiColor = '#EF4444'; }
  }

  const minIdeal = heightM > 0 ? (18.5 * heightM * heightM).toFixed(1) : 0;
  const maxIdeal = heightM > 0 ? (24.9 * heightM * heightM).toFixed(1) : 0;

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
      const res = await axios.put(`https://paceboard-backend.onrender.com/api/user/${user.id}`, formData);
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
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Health & Fitness Metrics</h2>
        
        {bmi && (
           <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderLeft: `4px solid ${bmiColor}`, background: 'var(--surface)' }}>
              <div>
                 <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Body Mass Index (BMI)</h4>
                 <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Healthy Safe Range: 18.5 - 24.9</p>
                 <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.875rem', marginTop: '2px', fontWeight: 'bold' }}>Ideal Weight: {minIdeal} - {maxIdeal} kg</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '2rem', fontWeight: 'bold', color: bmiColor, lineHeight: 1 }}>{bmi}</div>
                 <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: bmiColor, marginTop: '4px' }}>{bmiCategory}</div>
              </div>
           </div>
        )}

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 0, gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="form-group">
            <label>Height (cm)</label>
            <input type="number" name="height" value={formData.height} className="input-field" onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Weight (kg)</label>
            <input type="number" name="weight" value={formData.weight} className="input-field" onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input type="number" name="age" value={formData.age} className="input-field" onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} className="select-field" onChange={handleInputChange}>
               <option value="Male">Male</option>
               <option value="Female">Female</option>
               <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Locality</label>
            <input type="text" name="locality" value={formData.locality} className="input-field" onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Preferred Activity</label>
            <select name="preferredActivity" value={formData.preferredActivity} className="select-field" onChange={handleInputChange}>
                <option value="Walk">Walk</option>
                <option value="Jog">Jog</option>
                <option value="Run">Run</option>
                <option value="Workout">Workout</option>
                <option value="Yoga">Yoga</option>
                <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '2rem 0' }} />

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

        <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '2rem 0' }} />

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Privacy Controls</h2>
        <div className="card" style={{ background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', marginBottom: '2rem', borderRadius: '12px' }}>
           <div>
             <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               Make Profile Private
             </h4>
             <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
               When active, other users won't see you in the "Challenge Members" tab to invite or challenge you. 
             </p>
           </div>
           <div>
              <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                 <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} checked={formData.privateProfile} onChange={(e) => setFormData({ ...formData, privateProfile: e.target.checked })} />
                 <span style={{
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: formData.privateProfile ? '#10B981' : 'var(--border)', 
                    transition: '.4s', borderRadius: '34px'
                 }}>
                    <span style={{
                       position: 'absolute', height: '26px', width: '26px', left: '4px', bottom: '4px',
                       backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                       transform: formData.privateProfile ? 'translateX(26px)' : 'translateX(0)'
                    }}></span>
                 </span>
              </label>
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
