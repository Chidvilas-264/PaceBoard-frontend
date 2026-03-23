import React from 'react';
import { Activity, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home({ user }) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="hero-section">
        <h1 className="hero-title">Your Fitness Journey<br />Starts Here</h1>
        <p className="hero-subtitle">
          Join a community of passionate individuals dedicated to achieving their health goals. Track your progress, challenge your friends, and stay motivated with PaceBoard.
        </p>
        <button className="btn-primary" style={{ fontSize: '1.25rem', padding: '1rem 2rem' }} onClick={() => navigate(user ? '/dashboard' : '/auth')}>Get Started Today</button>
      </div>

      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Global Fitness Community</h2>
        <div className="dashboard-grid" style={{ gap: '2rem' }}>
          <img src="/global_running.png" alt="Running globally" style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
          <img src="/global_yoga.png" alt="Yoga globally" style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
          <img src="/global_cycling.png" alt="Cycling globally" style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '4rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingUp size={48} className="logo-icon" style={{ margin: '0 auto 1rem' }} />
          <h3>Track Progress</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Monitor steps, distance, and calories daily.</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Users size={48} className="logo-icon" style={{ margin: '0 auto 1rem' }} />
          <h3>Active Community</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Join local groups and participate in events.</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <ShieldCheck size={48} className="logo-icon" style={{ margin: '0 auto 1rem' }} />
          <h3>Weekly Challenges</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Compete with friends on the leaderboard.</p>
        </div>
      </div>

      <div style={{ marginTop: '5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Top Active Groups on the Leaderboard !</h2>
        <div className="dashboard-grid">
          <div className="card">
            <h3 className="card-title"><Activity size={20} /> Downtown Runners</h3>
            <p>Locality: Downtown</p>
            <p>Total Points: 15,240</p>
          </div>
          <div className="card">
            <h3 className="card-title"><Activity size={20} /> Yoga for Life</h3>
            <p>Locality: Westside</p>
            <p>Total Points: 12,100</p>
          </div>
          <div className="card">
            <h3 className="card-title"><Activity size={20} /> Morning Walkers</h3>
            <p>Locality: Downtown</p>
            <p>Total Points: 10,800</p>
          </div>
        </div>
      </div>
    </div>
  );
}
