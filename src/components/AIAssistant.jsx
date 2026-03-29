import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your PaceBoard AI Fitness Assistant. How can I help you crush your goals today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch("https://paceboard-backend.onrender.com/api/ai/chat", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const responseText = result.response || "Keep pushing forward! I am here to motivate you.";

      setMessages(prev => [...prev, { text: responseText, sender: 'ai' }]);
    } catch(err) {
      console.error(err);
      let errMsg = err.message;
      if (errMsg.includes("loading")) errMsg = "Please wait a moment, my brain is zooming into action! Try again in 10 seconds.";
      setMessages(prev => [...prev, { text: `Oh no! My AI brain hit a snag: ${errMsg}`, sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      {!isOpen && (
        <button className="btn-primary" onClick={() => setIsOpen(true)} style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', animation: 'bounce 2s infinite' }}>
          <MessageSquare size={28} />
        </button>
      )}

      {isOpen && (
        <div className="card glass-panel" style={{ width: '380px', height: '500px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', right: 0, bottom: 0, position: 'absolute' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <Bot size={24} /> AI Fitness Coach
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: 'white' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: 'var(--background)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.sender === 'ai' && <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '50%', color: 'white' }}><Bot size={16} /></div>}
                <div style={{ background: m.sender === 'user' ? 'var(--primary)' : 'var(--surface)', color: m.sender === 'user' ? 'white' : 'var(--text-main)', padding: '0.75rem 1rem', borderRadius: '12px', borderBottomRightRadius: m.sender === 'user' ? 0 : '12px', borderBottomLeftRadius: m.sender === 'ai' ? 0 : '12px', maxWidth: '75%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  {m.text}
                </div>
                {m.sender === 'user' && <div style={{ background: 'var(--text-muted)', padding: '0.5rem', borderRadius: '50%', color: 'white' }}><User size={16} /></div>}
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '50%', color: 'white' }}><Bot size={16} /></div>
                <div style={{ background: 'var(--surface)', color: 'var(--text-main)', padding: '0.75rem 1rem', borderRadius: '12px', borderBottomLeftRadius: 0, fontStyle: 'italic', opacity: 0.7 }}>Thinking...</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: '0.5rem' }}>
            <input type="text" placeholder="Ask your AI Coach..." value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', padding: '0.5rem' }} />
            <button type="submit" disabled={isLoading} style={{ background: 'var(--primary)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isLoading ? 0.7 : 1 }}>
              <Send size={18} style={{ marginLeft: '-2px' }}/>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
