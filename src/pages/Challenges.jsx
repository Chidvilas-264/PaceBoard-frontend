import React, { useState } from 'react';
import { Target, Trophy, Clock, Zap } from 'lucide-react';

export default function Challenges({ user }) {
  const [activeTab, setActiveTab] = useState('myChallenges');

  if (!user) return <div>Please login first</div>;

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>PaceBoard Challenges</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button className={activeTab === 'myChallenges' ? 'btn-primary' : 'btn-outline'} onClick={() => setActiveTab('myChallenges')}>My Challenges</button>
        <button className={activeTab === 'create' ? 'btn-primary' : 'btn-outline'} onClick={() => setActiveTab('create')}>Create Challenge</button>
        <button className={activeTab === 'groups' ? 'btn-primary' : 'btn-outline'} onClick={() => setActiveTab('groups')}>Challenge Groups</button>
        <button className={activeTab === 'members' ? 'btn-primary' : 'btn-outline'} onClick={() => setActiveTab('members')}>Challenge Members</button>
      </div>

      <div className="card glass-panel" style={{ padding: '2rem' }}>
        {activeTab === 'myChallenges' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy className="logo-icon" /> My Active & Completed Challenges
            </h2>
            <div className="dashboard-grid">
              <div className="card" style={{ background: 'var(--surface)', borderLeft: '4px solid #10B981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="card-title" style={{ margin: 0 }}>10K Step Weekathon</h3>
                  <span style={{ fontSize: '0.75rem', background: 'var(--primary)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>ACTIVE</span>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>Ends in 3 days</p>
                <div className="progress-bar" style={{ marginBottom: '0.75rem', height: '8px' }}>
                  <div className="progress-fill" style={{ width: '60%', background: '#10B981' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>42,000 / 70,000 steps</span>
                  <span style={{ color: '#10B981', fontWeight: 'bold' }}>60%</span>
                </div>
              </div>

              <div className="card" style={{ background: 'var(--surface)', borderLeft: '4px solid #8B5CF6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="card-title" style={{ margin: 0 }}>Weekend Warrior 50K</h3>
                  <span style={{ fontSize: '0.75rem', background: '#374151', color: '#D1D5DB', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>COMPLETED</span>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>Finished on Mar 20, 2026</p>
                <div style={{ display: 'inline-block', background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  🏆 Success (+500 pts)
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap className="logo-icon" /> Host a New Challenge
            </h2>
            <form>
              <div className="form-group">
                <label>Challenge Name</label>
                <input type="text" className="input-field" placeholder="E.g., 50K Steps Weekend" required />
              </div>
              <div className="form-group">
                <label>Target Steps</label>
                <input type="number" className="input-field" placeholder="50000" required />
              </div>
              <div className="form-group">
                <label>Duration (Days)</label>
                <input type="number" className="input-field" placeholder="3" required />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Create Challenge</button>
            </form>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy className="logo-icon" /> Challenge Other Groups
            </h2>
            <div className="dashboard-grid">
              <div className="card" style={{ background: 'var(--background)' }}>
                <h3 className="card-title">Downtown Runners</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Ranked #1 in Locality</p>
                <button className="btn-secondary" style={{ width: '100%' }}>Send Invite</button>
              </div>
              <div className="card" style={{ background: 'var(--background)' }}>
                <h3 className="card-title">Yoga for Life</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Ranked #2 in Locality</p>
                <button className="btn-secondary" style={{ width: '100%' }}>Send Invite</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target className="logo-icon" /> Challenge Your Group Members
            </h2>
            <div className="dashboard-grid">
              <div className="challenge-item" style={{ border: '1px solid var(--border)' }}>
                <div>
                  <h4 style={{ fontWeight: 600 }}>Alex Johnson</h4>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Top Scorer</span>
                </div>
                <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Challenge</button>
              </div>
              <div className="challenge-item" style={{ border: '1px solid var(--border)' }}>
                <div>
                  <h4 style={{ fontWeight: 600 }}>Sarah Smith</h4>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Streak: 12 Days</span>
                </div>
                <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Challenge</button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
