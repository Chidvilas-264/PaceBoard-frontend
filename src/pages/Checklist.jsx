import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckSquare, Trash2, Plus, Clock, Target, Sparkles, Edit2, Check } from 'lucide-react';

export default function Checklist({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [taskAmpm, setTaskAmpm] = useState('AM');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTime, setEditingTime] = useState('');

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

  const generateRoutine = async () => {
    setIsGenerating(true);
    const prompt = `As an elite AI fitness coach, generate a customized daily routine checklist for a user. User stats: Age: ${user.age || 25}, Gender: ${user.gender || 'unspecified'}, Weight: ${user.weight || 70}kg, Height: ${user.height || 170}cm. Please output ONLY a valid JSON array of objects in this EXACT format: [{"taskName": "Drink water", "time": "08:00 AM"}, {"taskName": "Morning run", "time": "08:30 AM"}]. Do not include any greeting, explanation, or markdown formatting like \`\`\`json. Just the raw array. Generate exactly 5 highly-effective fitness/health tasks spread throughout the day.`;
    try {
      const res = await axios.post(`https://paceboard-backend.onrender.com/api/ai/chat`, { message: prompt });
      let output = res.data.response;
      
      // Extract JSON array using regex in case the AI added conversational text
      const jsonMatch = output.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
         throw new Error("Could not find a JSON array in the AI response");
      }
      
      const routines = JSON.parse(jsonMatch[0]);
      for (const item of routines) {
        await axios.post(`https://paceboard-backend.onrender.com/api/users/${user.id}/checklist`, {
          taskName: item.taskName || item.task,
          time: item.time,
          completed: false
        });
      }
      await fetchTasks();
    } catch (e) {
      console.error(e);
      alert('Failed to generate routine or parse AI output.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim() || !newTaskTime.trim()) return;
    const timeString = `${newTaskTime} ${taskAmpm}`;
    try {
      const res = await axios.post(`https://paceboard-backend.onrender.com/api/users/${user.id}/checklist`, {
        taskName: newTaskName,
        time: timeString,
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

  const saveEditedTime = async (id) => {
    try {
      if(!editingTime.trim()) {
        setEditingTaskId(null);
        return;
      }
      const res = await axios.put(`https://paceboard-backend.onrender.com/api/checklist/${id}`, {
        time: editingTime
      });
      setTasks(tasks.map(t => t.id === id ? res.data : t));
      setEditingTaskId(null);
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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Time" 
            value={newTaskTime} 
            onChange={(e) => setNewTaskTime(e.target.value)} 
            style={{ width: '90px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}
          />
          <select value={taskAmpm} onChange={(e) => setTaskAmpm(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold' }}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '100%', padding: '0.75rem 1.5rem' }}>
          <Plus size={20} /> Add Target
        </button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <button 
          onClick={generateRoutine} 
          disabled={isGenerating}
          className="btn-primary" 
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none' }}
        >
          <Sparkles size={20} />
          {isGenerating ? 'AI is Generating...' : 'Auto-Generate AI Routine'}
        </button>
      </div>

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
                      {editingTaskId === t.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                          <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                          <input 
                            type="text" 
                            value={editingTime} 
                            onChange={(e) => setEditingTime(e.target.value)} 
                            style={{ background: 'var(--background)', color: 'var(--text-main)', border: '1px solid var(--primary)', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.9rem', outline: 'none' }}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditedTime(t.id);
                              if (e.key === 'Escape') setEditingTaskId(null);
                            }}
                          />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                          <Clock size={16} /> {t.time}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <button onClick={() => {
                      if (editingTaskId === t.id) {
                        saveEditedTime(t.id);
                      } else {
                        setEditingTaskId(t.id);
                        setEditingTime(t.time);
                      }
                    }} style={{ background: 'transparent', color: editingTaskId === t.id ? '#10B981' : 'var(--text-muted)', border: 'none', cursor: 'pointer', padding: '0.5rem', transition: 'color 0.2s' }}>
                      {editingTaskId === t.id ? <Check size={20} /> : <Edit2 size={20} />}
                    </button>
                    <button onClick={() => deleteTask(t.id)} style={{ background: 'transparent', color: 'var(--error, #EF4444)', border: 'none', cursor: 'pointer', padding: '0.5rem', transition: 'color 0.2s' }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
