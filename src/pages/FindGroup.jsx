import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Search, MapPin, Users, Plus, X, Navigation, CheckCircle } from 'lucide-react';

export default function FindGroup({ user }) {
  const [groups, setGroups] = useState([]);
  const [filter, setFilter] = useState('locality');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [myGroupIds, setMyGroupIds] = useState(new Set());
  const [newGroup, setNewGroup] = useState({ name: '', locality: user?.locality || '', preferredActivity: user?.preferredActivity || '' });
  const [isLocating, setIsLocating] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}:${parts[1]}:${parts[0]}`;
    return dateStr;
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchGroups = async () => {
    try {
      const url = `https://paceboard-backend.onrender.com/api/groups?${filter}=${filter === 'locality' ? user.locality : user.preferredActivity}`;
      const res = await axios.get(url);
      setGroups(res.data.filter(g => g.totalMembers != null && g.totalMembers > 0));
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  };

  const fetchMyGroups = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`https://paceboard-backend.onrender.com/api/users/${user.id}/groups`);
      setMyGroupIds(new Set(res.data.map(g => g.id)));
    } catch(err) {
      console.error("Failed to fetch my groups:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGroups();
      fetchMyGroups();
    }
  }, [user, filter]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setIsCreatingGroup(true);
    setFormError('');
    try {
      await axios.post('https://paceboard-backend.onrender.com/api/groups', { ...newGroup, creatorId: user.id });
      setShowCreateModal(false);
      setNewGroup({ name: '', locality: user?.locality || '', preferredActivity: user?.preferredActivity || '' });
      fetchGroups();
      fetchMyGroups();
      showToast('Group created successfully! Check your Dashboard.', 'success');
    } catch (err) {
      console.error(err);
      if (err.response?.data === "Group name already exists") {
        setFormError("Group name already exists, try new group names.");
      } else {
        setFormError('Failed to create group. Please try again later.');
      }
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(`https://paceboard-backend.onrender.com/api/groups/${groupId}/join/${user.id}`);
      showToast('Joined group successfully! Check your Dashboard.', 'success');
      fetchGroups();
      fetchMyGroups();
    } catch (err) {
      console.error(err);
      showToast('Failed to join group or you are already a member.', 'error');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Permanently delete this group? This action is irreversible.")) return;
    try {
      await axios.delete(`https://paceboard-backend.onrender.com/api/groups/${groupId}/${user.id}`);
      showToast('Group has been successfully deleted.', 'success');
      fetchGroups();
      fetchMyGroups();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete group or backend is still updating. Please wait a minute and try again.', 'error');
    }
  };

  const handleViewDetails = async (g) => {
    setDetailsModal(g);
    setGroupMembers([]); // reset
    if (g.creatorId === user.id) {
      try {
        const res = await axios.get(`https://paceboard-backend.onrender.com/api/groups/${g.id}/members`);
        setGroupMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch group members:", err);
      }
    }
  };

  const handleUseCurrentLocation = () => {
    if (!window.confirm("Allow PaceBoard to access your precise location?")) return;
    
    if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your browser", 'error');
        return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const city = res.data.locality || res.data.city || res.data.principalSubdivision;
            if (city) {
                setNewGroup({ ...newGroup, locality: city });
                setIsLocating('success');
                setTimeout(() => setIsLocating(false), 2500);
            } else {
                showToast("Could not determine city name from location.", 'error');
                setIsLocating(false);
            }
        } catch (err) {
            console.error("Error getting location coordinates:", err);
            showToast("Failed to get location.", 'error');
            setIsLocating(false);
        }
    }, () => {
        setIsLocating(false);
        showToast("Unable to retrieve your location. Please allow location permissions.", 'error');
    });
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
                Active since: {formatDate(g.activeSince)}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              {myGroupIds.has(g.id) ? (
                <button className="btn-primary" style={{ flex: 1, opacity: 0.5, cursor: 'not-allowed', background: 'var(--surface)' }} disabled>
                  {g.creatorId === user.id ? 'Joined (Admin)' : 'Joined'}
                </button>
              ) : (
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => handleJoinGroup(g.id)}>Join Group</button>
              )}
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => handleViewDetails(g)}>View Details</button>
              {g.creatorId === user.id && (
                <button className="btn-outline" onClick={() => handleDeleteGroup(g.id)} style={{ flex: '0.5', color: '#EF4444', borderColor: '#EF4444' }}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p style={{ gridColumn: '1 / -1', color: 'var(--text-muted)' }}>No groups found with this filter. Why not create one?</p>
        )}
      </div>

      {showCreateModal && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div className="card glass-panel animate-fade-in" style={{ background: 'var(--background)', width: '100%', maxWidth: '450px', padding: '2rem', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Create New Group</h2>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'var(--surface)', border: 'none', color: 'var(--text-main)', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            </div>
            {formError && (
              <div style={{ padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid #EF4444', fontSize: '0.9rem' }}>
                {formError}
              </div>
            )}
            <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Group Name</label>
                <input type="text" value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})} style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="e.g. Downtown Runners" required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Locality</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" value={newGroup.locality} onChange={e => setNewGroup({...newGroup, locality: e.target.value})} style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="e.g. Ramnagar" required />
                  <button type="button" onClick={handleUseCurrentLocation} disabled={isLocating === true} style={{ background: isLocating === 'success' ? '#10B981' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '0 1rem', cursor: isLocating === true ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isLocating === true ? 0.7 : 1, transition: 'all 0.3s' }} title="Use Current GPS Location">
                    {isLocating === 'success' ? <CheckCircle size={20} className="animate-fade-in" /> : <Navigation size={20} />}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Primary Activity</label>
                <input type="text" value={newGroup.preferredActivity} onChange={e => setNewGroup({...newGroup, preferredActivity: e.target.value})} style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem' }} placeholder="e.g. Jog" required />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-outline" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold', background: 'var(--surface)' }}>Cancel</button>
                <button type="submit" disabled={isCreatingGroup} className="btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold', opacity: isCreatingGroup ? 0.7 : 1, cursor: isCreatingGroup ? 'wait' : 'pointer' }}>
                  {isCreatingGroup ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {detailsModal && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div className="card glass-panel animate-fade-in" style={{ background: 'var(--background)', width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Group Details</h2>
              <button onClick={() => setDetailsModal(null)} style={{ background: 'var(--surface)', border: 'none', color: 'var(--text-main)', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{detailsModal.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <MapPin size={20} /> <span style={{ fontSize: '1.1rem' }}>Locality: {detailsModal.locality}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <Users size={20} /> <span style={{ fontSize: '1.1rem' }}>Active Members: {detailsModal.totalMembers}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <Search size={20} /> <span style={{ fontSize: '1.1rem' }}>Activity: {detailsModal.preferredActivity}</span>
              </div>
              
              {detailsModal.creatorId === user.id ? (
                <div style={{ marginTop: '0.5rem', background: 'var(--surface)', padding: '1rem', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                  <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <Users size={16} /> Member Roster
                  </h4>
                  {groupMembers.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {groupMembers.map(m => (
                        <li key={m.id} style={{ padding: '0.5rem', background: 'var(--background)', borderRadius: '4px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          <strong>{m.name || m.username}</strong> <span style={{ color: 'var(--text-muted)' }}>• {m.locality}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading or no additional members yet.</p>
                  )}
                </div>
              ) : (
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', background: 'var(--surface)', padding: '1rem', borderRadius: '8px' }}>
                  Full member list visibility is restricted to group administrators to protect user privacy.
                </p>
              )}
            </div>
            <button className="btn-primary" onClick={() => setDetailsModal(null)} style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', fontWeight: 'bold' }}>Close Details</button>
          </div>
        </div>
      , document.body)}

      {toast && createPortal(
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: toast.type === 'error' ? '#EF4444' : '#10B981', color: 'white', padding: '1rem 1.5rem', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)', zIndex: 9999999, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }} className="animate-fade-in">
          {toast.message}
        </div>
      , document.body)}
    </div>
  );
}
