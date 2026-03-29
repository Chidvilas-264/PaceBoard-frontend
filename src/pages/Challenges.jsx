import React, { useState } from 'react';
import axios from 'axios';
import { Target, Trophy, Clock, Zap, MessageSquare, CheckCircle, Bot } from 'lucide-react';

export default function Challenges({ user }) {
  const [activeTab, setActiveTab] = useState('myChallenges');
  const [invitedGroups, setInvitedGroups] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberAction, setMemberAction] = useState(null); // 'create' or 'generate'
  const [aiGeneratedChallenge, setAiGeneratedChallenge] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [memberChallengeForm, setMemberChallengeForm] = useState({ details: '', duration: '', complete: false });
  const [activeChallenges, setActiveChallenges] = useState([
    { id: 1, title: '10K Step Weekathon', status: 'ACTIVE', info: 'Ends in 3 days', progress: { cur: 42000, max: 70000, pct: 60 }, color: '#10B981' },
    { id: 2, title: 'Weekend Warrior 50K', status: 'COMPLETED', info: 'Finished on Mar 20, 2026', successText: '🏆 Success (+500 pts)', color: '#8B5CF6' }
  ]);

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
              {activeChallenges.map(challenge => (
                <div key={challenge.id} className="card" style={{ background: 'var(--surface)', borderLeft: `4px solid ${challenge.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="card-title" style={{ margin: 0 }}>{challenge.title}</h3>
                    <span style={{ fontSize: '0.75rem', background: challenge.status === 'ACTIVE' ? 'var(--primary)' : '#374151', color: challenge.status === 'ACTIVE' ? 'white' : '#D1D5DB', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>{challenge.status}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>{challenge.info}</p>
                  
                  {challenge.status === 'ACTIVE' && challenge.progress && (
                    <>
                      <div className="progress-bar" style={{ marginBottom: '0.75rem', height: '8px' }}>
                        <div className="progress-fill" style={{ width: `${challenge.progress.pct}%`, background: challenge.color }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{challenge.progress.cur.toLocaleString()} / {challenge.progress.max.toLocaleString()} steps</span>
                        <span style={{ color: challenge.color, fontWeight: 'bold' }}>{challenge.progress.pct}%</span>
                      </div>
                    </>
                  )}
                  {challenge.status === 'COMPLETED' && challenge.successText && (
                    <div style={{ display: 'inline-block', background: `${challenge.color}20`, color: challenge.color, padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {challenge.successText}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap className="logo-icon" /> Host a New Challenge
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              setActiveChallenges(prev => [{
                id: Date.now(), title: e.target[0].value, status: 'ACTIVE', info: `Duration: ${e.target[2].value} days`, progress: { cur: Math.floor(Math.random() * 5000), max: parseInt(e.target[1].value), pct: 0 }, color: '#EF4444'
              }, ...prev]);
              alert('Challenge created!');
              setActiveTab('myChallenges');
            }}>
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
              {['Downtown Runners', 'Yoga for Life'].map((groupName, idx) => (
                <div key={groupName} className="card" style={{ background: 'var(--background)' }}>
                  <h3 className="card-title">{groupName}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Ranked #{idx + 1} in Locality</p>
                  
                  {!invitedGroups.includes(groupName) ? (
                    <button className="btn-secondary" style={{ width: '100%' }} onClick={() => {
                      alert('Sent invite!');
                      setInvitedGroups(prev => [...prev, groupName]);
                    }}>
                      Send Invite
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ color: '#10B981', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                        <CheckCircle size={18} /> Invite Sent!
                      </div>
                      <button className="btn-primary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => setActiveTab('create')}>
                        Create Custom Challenge
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target className="logo-icon" /> Challenge Your Group Members
            </h2>
            <div className="dashboard-grid">
              {[{name: 'Alex Johnson', stat: 'Top Scorer'}, {name: 'Sarah Smith', stat: 'Streak: 12 Days'}].map((member) => (
                <div key={member.name} className="challenge-item" style={{ border: '1px solid var(--border)', flexDirection: 'column', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <h4 style={{ fontWeight: 600 }}>{member.name}</h4>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{member.stat}</span>
                    </div>
                    {selectedMember !== member.name && (
                      <button className="btn-outline" onClick={() => setSelectedMember(member.name)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Challenge</button>
                    )}
                  </div>
                  
                  {selectedMember === member.name && (
                    <div className="animate-fade-in" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      {!memberAction && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-primary" onClick={() => setMemberAction('create')} style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}>Create Challenge</button>
                          <button className="btn-secondary" onClick={async () => {
                            setMemberAction('generate');
                            setIsGenerating(true);
                            try {
                              const res = await axios.post("https://paceboard-backend.onrender.com/api/ai/chat", { message: `Generate a fun, short, customized fitness challenge for my friend ${member.name} who focuses on ${member.stat}. Do not format with markdown, just plain text.` });
                              setAiGeneratedChallenge(res.data.response);
                            } catch (e) {
                              setAiGeneratedChallenge("Do 50 Pushups by the end of tomorrow! " + e.message);
                            }
                            setIsGenerating(false);
                          }} style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', background: '#8B5CF6' }}>Generate AI Challenge</button>
                        </div>
                      )}

                      {memberAction === 'create' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                          <input type="text" className="input-field" placeholder="Challenge Details (e.g., Run 5km)" value={memberChallengeForm.details} onChange={e => setMemberChallengeForm({...memberChallengeForm, details: e.target.value})} />
                          <input type="text" className="input-field" placeholder="Duration (e.g., 2 days)" value={memberChallengeForm.duration} onChange={e => setMemberChallengeForm({...memberChallengeForm, duration: e.target.value})} />
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                            <input type="checkbox" checked={memberChallengeForm.complete} onChange={e => setMemberChallengeForm({...memberChallengeForm, complete: e.target.checked})} /> Require proof of completion
                          </label>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button className="btn-outline" onClick={() => setMemberAction(null)} style={{ flex: 1, padding: '0.5rem' }}>Cancel</button>
                            <button className="btn-primary" onClick={() => {
                              setActiveChallenges(prev => [{
                                id: Date.now(), title: `Challenge vs ${member.name}`, status: 'ACTIVE', info: memberChallengeForm.details || 'Custom Challenge', progress: { cur: 0, max: 100, pct: 0 }, color: '#3B82F6'
                              }, ...prev]);
                              alert('Challenge sent!'); 
                              setMemberAction(null); 
                              setSelectedMember(null); 
                              setActiveTab('myChallenges');
                            }} style={{ flex: 1, padding: '0.5rem' }}>Send</button>
                          </div>
                        </div>
                      )}

                      {memberAction === 'generate' && (
                        <div style={{ marginTop: '0.5rem', background: 'var(--surface)', padding: '1rem', borderRadius: '8px' }}>
                          {isGenerating ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                              <Bot className="animate-spin" size={18} /> AI is crafting the perfect challenge...
                            </div>
                          ) : (
                            <div>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem', fontStyle: 'italic' }}>"{aiGeneratedChallenge}"</p>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-outline" onClick={() => { setMemberAction(null); setAiGeneratedChallenge(null); }} style={{ flex: 1, padding: '0.5rem' }}>Cancel</button>
                                <button className="btn-primary" onClick={() => {
                                  let shortInfo = aiGeneratedChallenge;
                                  if (shortInfo && shortInfo.length > 60) shortInfo = shortInfo.substring(0, 60) + '...';
                                  setActiveChallenges(prev => [{
                                    id: Date.now(), title: `AI Challenge vs ${member.name}`, status: 'ACTIVE', info: shortInfo || 'AI Generated', progress: { cur: 0, max: 100, pct: 0 }, color: '#F59E0B'
                                  }, ...prev]);
                                  alert('AI Challenge sent to ' + member.name + '!');
                                  setMemberAction(null);
                                  setSelectedMember(null);
                                  setActiveTab('myChallenges');
                                }} style={{ flex: 1, padding: '0.5rem' }}>Send AI Challenge</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
