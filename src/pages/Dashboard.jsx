import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Zap, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export default function Dashboard({ user }) {
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [currentSteps, setCurrentSteps] = useState(7432);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const fetchGroups = async () => {
      try {
        const localityRes = await axios.get(`https://paceboard-backend.onrender.com/api/groups?locality=${user.locality}`);
        setSuggestedGroups(localityRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroups();
  }, [user, navigate]);

  const progressPercent = user ? Math.min((currentSteps / user.dailyStepGoal) * 100, 100) : 0;

  useEffect(() => {
    if (progressPercent >= 100 && !hasCelebrated) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899']
      });
      setHasCelebrated(true);
    }
  }, [progressPercent, hasCelebrated]);

  const addSteps = () => {
    setCurrentSteps(prev => prev + 1500);
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome back, {user.name}!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Keep up the great work. You're doing amazing.</p>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <Zap size={32} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Fitness Streak</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{user.fitnessStreak || 12} Days</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card glass-panel" style={{ gridColumn: '1 / -1' }}>
          <h3 className="card-title"><Activity className="logo-icon" size={24} /> Daily Step Goal</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
            <div>
              <span style={{ fontSize: '3.5rem', fontWeight: '900', color: progressPercent >= 100 ? 'var(--primary)' : 'var(--text-main)', transition: 'color 0.5s' }}>{currentSteps}</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>/ {user.dailyStepGoal} steps</span>
            </div>
            <div style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '1.5rem' }}>
              {Math.floor(progressPercent)}%
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%`, transition: 'width 0.5s ease-out' }}></div>
          </div>
          {progressPercent < 100 && (
            <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={addSteps}>
              🏃 Log +1500 Steps
            </button>
          )}
          {progressPercent >= 100 && (
            <div className="animate-fade-in" style={{ marginTop: '1.5rem', textAlign: 'center', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', fontWeight: 'bold' }}>
              🎉 Daily Goal Reached! Amazing Job!
            </div>
          )}
        </div>
        
        <div className="card glass-panel">
          <h3 className="card-title"><Award className="logo-icon" size={24} /> Total Steps (Monthly)</h3>
          <div style={{ fontSize: '3rem', fontWeight: '900', marginTop: '1rem' }}>
             {user.monthlySteps || 120500}
          </div>
          <p style={{ color: 'var(--secondary)', marginTop: '0.5rem', fontWeight: 'bold' }}>+12% from last month</p>
        </div>

        <div className="card glass-panel">
          <h3 className="card-title"><Award className="logo-icon" size={24} /> Trophy Case</h3>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
             <div title="Beginner's Luck" style={{ textAlign: 'center' }}>
               <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'white' }}><span style={{fontSize:'1.8rem'}}>🌟</span></div>
               <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold' }}>Starter</div>
             </div>
             {(user.fitnessStreak || 12) >= 7 && (
               <div title="Streak Master" style={{ textAlign: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'white' }}><span style={{fontSize:'1.8rem'}}>⚡</span></div>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold' }}>Streaker</div>
               </div>
             )}
             {progressPercent >= 100 && (
               <div title="Goal Crusher" className="animate-fade-in" style={{ textAlign: 'center' }}>
                 <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'white' }}><span style={{fontSize:'1.8rem'}}>🔥</span></div>
                 <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold' }}>Crusher</div>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 className="card-title">Suggested Groups for You</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Based on your {user.preferredActivity} preference in {user.locality}</p>
          {suggestedGroups.length > 0 ? (
            suggestedGroups.map(g => (
              <div key={g.id} className="challenge-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {g.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600 }}>{g.name}</h4>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{g.totalMembers} Members</span>
                  </div>
                </div>
                <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Join</button>
              </div>
            ))
          ) : (
            <p>No groups found in your locality just yet. Be the first to start one!</p>
          )}
        </div>
        
        <div className="card">
          <h3 className="card-title">Weekly Challenges</h3>
          <div className="challenge-item">
            <div>
              <h4 style={{ fontWeight: 600 }}>10K Step Weekathon</h4>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ends in 3 days</span>
            </div>
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Join</button>
          </div>
          <div className="challenge-item">
            <div>
              <h4 style={{ fontWeight: 600 }}>Local Joggers Sprint</h4>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ongoing</span>
            </div>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View</button>
          </div>
        </div>
      </div>
    </div>
  );
}
