import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckSquare, Trash2, Plus, Clock, Target } from 'lucide-react';

export default function Checklist({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`https://paceboard-backend.onrender.com/api/users/${user.id}/checklist`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim() || !newTaskTime.trim()) return;
    try {
      const res = await axios.post(`https://paceboard-backend.onrender.com/api/users/${user.id}/checklist`, {
        taskName: newTaskName,
        time: newTaskTime,
        completed: false
      });
      setTasks([...tasks, res.data]);
      setNewTaskName('');
      setNewTaskTime('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      const res = await axios.put(`https://paceboard-backend.onrender.com/api/checklist/${id}`, {
        completed: !currentStatus
      });
      setTasks(tasks.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://paceboard-backend.onrender.com/api/checklist/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div>Please login first</div>;

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Target size={36} className="logo-icon" style={{ color: 'var(--primary)' }} />
        Daily Planner
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Plan your daily and monthly fitness routines and stay on target.</p>

      <form className="card glass-panel" onSubmit={addTask} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input 
            type="text" 
            placeholder="E.g., Morning 5K Walk" 
            value={newTaskName} 
            onChange={(e) => setNewTaskName(e.target.value)} 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}
          />
        </div>
        <div>
          <input 
            type="time" 
            value={newTaskTime} 
            onChange={(e) => setNewTaskTime(e.target.value)} 
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '100%' }}>
          <Plus size={20} /> Add Target
        </button>
      </form>

      <div className="dashboard-grid">
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}><CheckSquare className="logo-icon" size={24} /> My Targets</h3>
          {tasks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No targets set yet. Add one above!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', transition: 'all 0.3s', opacity: t.completed ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id, t.completed)} style={{ width: 24, height: 24, cursor: 'pointer' }} />
                    <div>
                      <h4 style={{ fontSize: '1.2rem', textDecoration: t.completed ? 'line-through' : 'none' }}>{t.taskName}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                        <Clock size={16} /> {t.time}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteTask(t.id)} style={{ background: 'transparent', color: 'var(--error, #EF4444)', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
