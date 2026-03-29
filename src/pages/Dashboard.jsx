import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Activity, Zap, Award, MapPin, Sparkles, Target, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import FitnessMap from '../components/FitnessMap';

export default function Dashboard({ user }) {
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [currentSteps, setCurrentSteps] = useState(7432);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [confirmExitDialog, setConfirmExitDialog] = useState(null);
  const navigate = useNavigate();

  const handleExitGroup = async (groupId) => {
    try {
      await axios.post(`https://paceboard-backend.onrender.com/api/groups/${groupId}/leave/${user.id}`);
      setMyGroups(myGroups.filter(g => g.id !== groupId));
    } catch (err) {
      console.error("Failed to leave group:", err);
    }
    setConfirmExitDialog(null);
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const fetchGroups = async () => {
      try {
        const localityRes = await axios.get(`https://paceboard-backend.onrender.com/api/groups?locality=${user.locality}`);
        setSuggestedGroups(localityRes.data);
        const myGrpRes = await axios.get(`https://paceboard-backend.onrender.com/api/users/${user.id}/groups`);
        setMyGroups(myGrpRes.data);
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

  const monthlySteps = user?.monthlySteps || 120500;
  const isBeginner = user?.dailyStepGoal < 8000 || monthlySteps < 60000;
  const aiChallenge = isBeginner ? { name: "Beginner 5K Weekly Walk", diff: "Easy", color: "#10B981" } : { name: "Elite Marathon Prep (High Intensity)", diff: "Advanced", color: "#EF4444" };

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

      <div className="card glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--surface)' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
           <MapPin size={24} className="logo-icon" /> Your Location & Nearby Groups
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>View your current position and find active fitness communities in your area.</p>
        <FitnessMap groups={suggestedGroups} />
      </div>

      <div className="dashboard-grid" style={{ marginTop: '0' }}>
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
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Sparkles size={24} className="logo-icon" style={{ color: '#F59E0B' }}/> AI Group Suggestions
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Curated based on your locality ({user.locality}) & {user.preferredActivity} preference</p>
          {suggestedGroups.length > 0 ? (
            suggestedGroups.map(g => (
              <div key={g.id} className="challenge-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(g.name || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600 }}>{g.name || 'Fitness Group'}</h4>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{g.totalMembers} Members</span>
                  </div>
                </div>
                <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => navigate('/groups')}>View</button>
              </div>
            ))
          ) : (
            <p>Scanning global servers for nearby communities... Invite friends to start one!</p>
          )}

          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
             <Users size={24} className="logo-icon" style={{ color: 'var(--primary)' }}/> My Groups
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Groups you have recently joined</p>
          {myGroups.length > 0 ? (
            myGroups.map(g => (
              <div key={g.id} className="challenge-item" style={{ background: 'var(--background)', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                  <div style={{ background: 'var(--secondary)', color: 'white', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(g.name || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600 }}>{g.name || 'Fitness Group'}</h4>
                    {g.activeSince && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Active since: {g.activeSince}
                      </div>
                    )}
                  </div>
                </div>
                <button className="btn-outline" onClick={() => setConfirmExitDialog(g.id)} style={{ width: '100%', marginTop: '1rem', color: '#EF4444', borderColor: '#EF4444' }}>
                  Exit Group
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>You haven't joined any groups yet. Explore and join to see them here.</p>
          )}
        </div>
        
        <div className="card">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Target size={24} className="logo-icon" style={{ color: '#10B981' }} /> AI Challenges Tracker
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Dynamically tailored to your {monthlySteps.toLocaleString()} monthly steps!</p>
          
          <div className="challenge-item" style={{ borderLeft: `5px solid ${aiChallenge.color}` }}>
            <div>
              <h4 style={{ fontWeight: 600 }}>{aiChallenge.name}</h4>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Difficulty: {aiChallenge.diff}</span>
            </div>
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Join</button>
          </div>

          <div className="challenge-item">
            <div>
              <h4 style={{ fontWeight: 600 }}>10K Step Weekathon</h4>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ends in 3 days</span>
            </div>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View</button>
          </div>
        </div>
      </div>

      {confirmExitDialog && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div className="card glass-panel animate-fade-in" style={{ background: 'var(--background)', width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Leave Group?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Are you sure you want to exit this group? You can always rejoin later if you change your mind.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-outline" onClick={() => setConfirmExitDialog(null)} style={{ flex: 1, padding: '0.75rem', fontWeight: 'bold' }}>Cancel</button>
              <button className="btn-primary" onClick={() => handleExitGroup(confirmExitDialog)} style={{ flex: 1, padding: '0.75rem', fontWeight: 'bold', background: '#EF4444', color: 'white' }}>Yes, Exit</button>
            </div>
          </div>
        </div>
      , document.body)}

    </div>
  );
}
