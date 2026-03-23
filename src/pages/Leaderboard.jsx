import React, { useState } from 'react';
import { Trophy, Medal, Crown, Star } from 'lucide-react';

export default function Leaderboard({ user }) {
  const [activeTab, setActiveTab] = useState('global');

  if (!user) return <div>Please login first</div>;

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown color="#FBBF24" size={24} style={{ marginRight: '8px' }} />;
      case 2: return <Medal color="#9CA3AF" size={24} style={{ marginRight: '8px' }} />;
      case 3: return <Medal color="#B45309" size={24} style={{ marginRight: '8px' }} />;
      default: return <span style={{ width: '32px', display: 'inline-block', fontWeight: 'bold' }}>#{rank}</span>;
    }
  };

  const globalScores = [
    { rank: 1, name: "Maria Gonzalez", steps: 350200, locality: "New York" },
    { rank: 2, name: "Akio Tanaka", steps: 342110, locality: "Tokyo" },
    { rank: 3, name: "Chris Hemsworth", steps: 310500, locality: "Sydney" },
    { rank: 14, name: user.name || "You", steps: user.monthlySteps || 120500, locality: user.locality, isUser: true },
    { rank: 15, name: "Priya Sharma", steps: 119000, locality: "Delhi" },
  ];

  const localScores = [
    { rank: 1, name: "Alex Johnson", steps: 210400, locality: user.locality },
    { rank: 2, name: "Sarah Smith", steps: 195200, locality: user.locality },
    { rank: 3, name: "David Chen", steps: 180000, locality: user.locality },
    { rank: 4, name: "Emily White", steps: 150000, locality: user.locality },
    { rank: 6, name: user.name || "You", steps: user.monthlySteps || 120500, locality: user.locality, isUser: true },
  ];

  const scoresToDisplay = activeTab === 'global' ? globalScores : localScores;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
        <Trophy className="logo-icon" size={40} style={{ marginRight: '1rem' }} /> Top Performers Leaderboard
      </h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={activeTab === 'global' ? 'btn-primary' : 'btn-outline'} 
          style={{ flex: 1, padding: '1rem', fontSize: '1.125rem' }} 
          onClick={() => setActiveTab('global')}>
          🌍 Global Rankings
        </button>
        <button 
          className={activeTab === 'local' ? 'btn-primary' : 'btn-outline'} 
          style={{ flex: 1, padding: '1rem', fontSize: '1.125rem' }} 
          onClick={() => setActiveTab('local')}>
          📍 Local ({user.locality})
        </button>
      </div>

      <div className="card glass-panel" style={{ padding: '0' }}>
        {scoresToDisplay.map((score, index) => (
          <div key={index} style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            padding: '1.5rem', borderBottom: index !== scoresToDisplay.length - 1 ? '1px solid var(--border)' : 'none',
            background: score.isUser ? 'var(--surface)' : 'transparent' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.25rem' }}>
              <div style={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
                {getRankIcon(score.rank)}
              </div>
              <div style={{ marginLeft: '1rem' }}>
                <span style={{ fontWeight: score.isUser ? '800' : '600', color: score.isUser ? 'var(--primary)' : 'inherit' }}>
                  {score.name}
                </span>
                {score.isUser && <Star size={16} fill="var(--primary)" color="var(--primary)" style={{ marginLeft: '8px' }} />}
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{score.locality}</div>
              </div>
            </div>
            <div style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--secondary)' }}>
              {score.steps.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>steps</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
