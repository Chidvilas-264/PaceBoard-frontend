import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Questionnaire({ user, setUser }) {
  const [formData, setFormData] = useState({
    age: '', gender: '', height: '', weight: '', locality: '', preferredActivity: 'Walk'
  });
  const [customActivity, setCustomActivity] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.preferredActivity === 'Other' && customActivity.trim() !== '') {
        payload.preferredActivity = customActivity.trim();
      }
      const res = await axios.post(`/api/questionnaire/${user.id}`, payload);
      localStorage.setItem('paceboardUser', JSON.stringify(res.data));
      setUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="animate-fade-in auth-container">
       <div className="card auth-card" style={{ maxWidth: '600px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }}>Tell us about yourself</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            We'll use this information to personalize your fitness goals and suggest groups in your locality.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 0, gap: '1rem' }}>
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" className="input-field" onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" className="select-field" onChange={handleInputChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input type="number" name="height" className="input-field" onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" name="weight" className="input-field" onChange={handleInputChange} required />
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Locality (City or Neighborhood)</label>
              <input type="text" name="locality" className="input-field" placeholder="Enter your local area" onChange={handleInputChange} required />
            </div>
            
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Preferred Activity</label>
              <select name="preferredActivity" className="select-field" onChange={handleInputChange} required>
                <option value="Walk">Walk</option>
                <option value="Jog">Jog</option>
                <option value="Run">Run</option>
                <option value="Workout">Workout</option>
                <option value="Yoga">Yoga</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {formData.preferredActivity === 'Other' && (
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Specify Your Activity</label>
                <input type="text" className="input-field" placeholder="E.g. Swimming, Cycling" value={customActivity} onChange={(e) => setCustomActivity(e.target.value)} required />
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}>
              Complete Setup
            </button>
          </form>
       </div>
    </div>
  );
}
