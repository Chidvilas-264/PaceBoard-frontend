import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, User as UserIcon, LogOut, Settings as SettingsIcon, Users, Target, Moon, Sun, LayoutDashboard, Trophy } from 'lucide-react';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Questionnaire from './pages/Questionnaire';
import Dashboard from './pages/Dashboard';
import FindGroup from './pages/FindGroup';
import Challenges from './pages/Challenges';
import Settings from './pages/Settings';
import Leaderboard from './pages/Leaderboard';


function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('paceboardUser')) || null);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [theme, setTheme] = useState(localStorage.getItem('paceboardTheme') || user?.theme || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('paceboardTheme', theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('paceboardUser');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="app">
        <nav className="navbar">
          <Link to="/" className="nav-brand">
            <img src="/logo.png" alt="PaceBoard Logo" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            PaceBoard
          </Link>
          <div className="nav-links">
            <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link" title="Dashboard">
                  {path === '/dashboard' ? <span style={{fontWeight: 700, color: 'var(--primary)'}}>Dashboard</span> : <LayoutDashboard size={20} />}
                </Link>
                <Link to="/groups" className="nav-link" title="Groups">
                  {path === '/groups' ? <span style={{fontWeight: 700, color: 'var(--primary)'}}>Groups</span> : <Users size={20} />}
                </Link>
                <Link to="/leaderboard" className="nav-link" title="Leaderboard">
                  {path === '/leaderboard' ? <span style={{fontWeight: 700, color: 'var(--primary)'}}>Leaderboard</span> : <Trophy size={20} />}
                </Link>
                <Link to="/challenges" className="nav-link" title="Challenges">
                  {path === '/challenges' ? <span style={{fontWeight: 700, color: 'var(--primary)'}}>Challenges</span> : <Target size={20} />}
                </Link>
                <Link to="/settings" className="nav-link" title="Settings">
                  {path === '/settings' ? <span style={{fontWeight: 700, color: 'var(--primary)'}}>Settings</span> : <SettingsIcon size={20} />}
                </Link>
                <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.4rem 1rem' }} title="Logout">
                  <LogOut size={16} style={{ marginRight: '8px' }} /> Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn-primary">Login / Register</Link>
            )}
          </div>
        </nav>

        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/auth" element={<Auth setUser={setUser} />} />
            <Route path="/questionnaire" element={<Questionnaire user={user} setUser={setUser} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/groups" element={<FindGroup user={user} />} />
            <Route path="/leaderboard" element={<Leaderboard user={user} />} />
            <Route path="/challenges" element={<Challenges user={user} />} />
            <Route path="/settings" element={<Settings user={user} setUser={setUser} setTheme={setTheme} handleLogout={handleLogout} />} />
          </Routes>
        </main>

        <footer className="footer">
          <img src="/logo.png" alt="PaceBoard Logo" style={{ width: 64, height: 64, marginBottom: '1rem', borderRadius: '50%' }} />
          <p>© 2026 PaceBoard Fitness. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Contact Administrator: chidvilassai26@gmail.com | +91-8886422516</p>
        </footer>
        
      </div>
  );
}

export default App;
