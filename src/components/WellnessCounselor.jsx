import React, { useState, useRef, useEffect } from 'react';
import { HeartHandshake, Send, Sparkles, UserCheck, RefreshCw, Compass, Lightbulb, ShieldCheck } from 'lucide-react';
import axios from '../api.js';
import ReactMarkdown from 'react-markdown';

export function WellnessCounselor() {
  const [messages, setMessages] = useState([
    {
      sender: 'counselor',
      text: "🌿 Hello! I am **Dr. Maya**, your Mindful Life & Career Counselor at Tutovia.\n\nWhether you are feeling exam stress, uncertain about your career path in finance & business, or struggling to balance study with your personal life—I am here to listen, support, and guide you step-by-step. What is on your mind today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const counselorChips = [
    "I'm feeling overwhelmed with exam pressure",
    "Help me plan my career path in corporate finance & accounting",
    "How do I balance study hours with personal & mental wellness?",
    "I scored lower than expected—how to rebuild confidence?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/counselor/chat', { messages: updatedMessages });
      const counselorMsg = { sender: 'counselor', text: res.data.reply };
      setMessages(prev => [...prev, counselorMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'counselor',
        text: "I'm here for you! It seems there was a minor network hiccup. Take a deep breath and let's try sending your message once more."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border space-y-6 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-static-white shadow-lg shadow-emerald-500/20">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Dr. Maya — Life & Career Counselor
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-400">Personal Guidance, Stress Management & Career Mentorship</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Safe Confidential Space</span>
        </span>
      </div>

      {/* Chat Area */}
      <div className="bg-surface/60 rounded-2xl border border-surface-border p-4 h-96 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[88%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                : 'bg-surface-card border border-surface-border text-slate-200 rounded-bl-none shadow-sm'
            }`}>
              {msg.sender === 'counselor' && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Counselor Guidance</span>
                </div>
              )}
              <div className="whitespace-pre-wrap font-sans markdown-content">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-card border border-surface-border p-3.5 rounded-2xl rounded-bl-none text-slate-400 text-xs flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Dr. Maya is drafting thoughtful guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Counselor Suggestion Chips */}
      <div>
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Topics to explore:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {counselorChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip)}
              className="text-xs px-3 py-1.5 rounded-full bg-surface-card hover:bg-emerald-600/20 hover:border-emerald-500/40 text-slate-300 border border-surface-border transition-all text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share your concerns about study stress, career goals, or personal balance..."
          className="flex-1 bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-static-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
        >
          <span>Consult</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
