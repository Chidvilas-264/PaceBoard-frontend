import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your PaceBoard AI Fitness Assistant. How can I help you crush your goals today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Check if the API Key exists in the environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "I'm ready to upgrade! Please add your VITE_GEMINI_API_KEY to the project environment variables before I can generate real AI responses.", sender: 'ai' }]);
      }, 500);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are an elite, highly motivational fitness coach for the PaceBoard app. Answer this strictly in 2 to 3 concise sentences. Query: ${userMessage.text}`;
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      setMessages(prev => [...prev, { text: responseText, sender: 'ai' }]);
    } catch(err) {
      console.error(err);
      setMessages(prev => [...prev, { text: "Oh no! My AI brain hit a snag. Please ensure your Gemini API Key is valid and active.", sender: 'ai' }]);
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
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: '0.5rem' }}>
            <input type="text" placeholder="Ask your AI Coach..." value={input} onChange={(e) => setInput(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', padding: '0.5rem' }} />
            <button type="submit" style={{ background: 'var(--primary)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={18} style={{ marginLeft: '-2px' }}/>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
