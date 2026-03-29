import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Users, Plus, X } from 'lucide-react';

export default function FindGroup({ user }) {
  const [groups, setGroups] = useState([]);
  const [filter, setFilter] = useState('locality');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', locality: user?.locality || '', preferredActivity: user?.preferredActivity || '' });

  useEffect(() => {
    if (user) fetchGroups();
  }, [user, filter]);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`https://paceboard-backend.onrender.com/api/groups?${filter}=${filter === 'locality' ? user.locality : user.preferredActivity}`);
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.name.trim() || !newGroup.locality.trim() || !newGroup.preferredActivity.trim()) return;
    try {
      await axios.post('https://paceboard-backend.onrender.com/api/groups', {
        ...newGroup,
        creatorId: user.id
      });
      setShowCreateModal(false);
      setNewGroup({ name: '', locality: user?.locality || '', preferredActivity: user?.preferredActivity || '' });
      fetchGroups();
      alert('Group created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(`https://paceboard-backend.onrender.com/api/groups/${groupId}/join/${user.id}`);
      alert('Joined group successfully! Check your Dashboard.');
      fetchGroups();
    } catch (err) {
      console.error(err);
      alert('Failed to join group or you are already a member.');
    }
  };

  if (!user) return <div>Please login first</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Find Your Group</h1>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Create Group
        </button>
      </div>
      
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <Users size={16} /> {g.totalMembers} active members
            </div>
            {g.activeSince && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Active since: {g.activeSince}
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => handleJoinGroup(g.id)}>Join Group</button>
              <button className="btn-outline" style={{ flex: 1 }}>View Details</button>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p style={{ gridColumn: '1 / -1', color: 'var(--text-muted)' }}>No groups found with this filter. Why not create one?</p>
        )}
      </div>

      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div className="card glass-panel" style={{ background: 'var(--background)', width: '100%', maxWidth: '450px', padding: '2rem', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Create New Group</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'var(--surface)', border: 'none', color: 'var(--text-main)', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Group Name</label>
                <input type="text" value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})} style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="e.g. Downtown Runners" required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Locality</label>
                <input type="text" value={newGroup.locality} onChange={e => setNewGroup({...newGroup, locality: e.target.value})} style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="e.g. Hyderabad" required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Primary Activity</label>
                <input type="text" value={newGroup.preferredActivity} onChange={e => setNewGroup({...newGroup, preferredActivity: e.target.value})} style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="e.g. Jog" required />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>Create Group</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
