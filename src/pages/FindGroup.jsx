import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Users } from 'lucide-react';

export default function FindGroup({ user }) {
  const [groups, setGroups] = useState([]);
  const [filter, setFilter] = useState('locality');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`/api/groups?${filter}=${filter === 'locality' ? user.locality : user.preferredActivity}`);
        setGroups(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchGroups();
  }, [user, filter]);

  if (!user) return <div>Please login first</div>;

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Find Your Group</h1>
      
      <div className="card glass-panel" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
        <Search className="logo-icon" size={24} />
        <div className="radio-group" style={{ margin: 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="radio" name="filter" value="locality" checked={filter === 'locality'} onChange={() => setFilter('locality')} />
            Top groups in my locality
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="radio" name="filter" value="preferredActivity" checked={filter === 'preferredActivity'} onChange={() => setFilter('preferredActivity')} />
            Groups by my preference ({user.preferredActivity})
          </label>
        </div>
      </div>

      <div className="dashboard-grid">
        {groups.map(g => (
          <div key={g.id} className="card">
            <h3 className="card-title">{g.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <MapPin size={16} /> {g.locality}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <Users size={16} /> {g.totalMembers} active members
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" style={{ flex: 1 }}>Join Group</button>
              <button className="btn-outline" style={{ flex: 1 }}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
