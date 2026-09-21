import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageSquare, ArrowLeft, Send, CheckCircle2, Headphones, Sparkles } from 'lucide-react';

export default function Contact() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback / Feature Suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    // In production, dispatch to support inbox
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-surface-border shadow-2xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-surface-border">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Headphones size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Contact & Support</h1>
              <p className="text-xs text-slate-400 mt-1">We're here to help you conquer your CA journey.</p>
            </div>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Message Received!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Thank you for reaching out. Our support team typically responds within 24 hours. Keep up your study momentum!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 rounded-xl bg-surface border border-surface-border text-xs font-bold text-slate-300 hover:text-white"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="CA Aspirant"
                    className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Inquiry Type</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="Feedback / Feature Suggestion">Feedback / Feature Suggestion</option>
                  <option value="Technical Issue / Bug Report">Technical Issue / Bug Report</option>
                  <option value="Account & Data Assistance">Account & Data Assistance</option>
                  <option value="AI Tutor Accuracy Report">AI Tutor Accuracy Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">How Can We Help?</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or feedback..."
                  className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-static-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Send size={16} /> Send Message
              </button>

              <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <Mail size={14} className="text-indigo-400" /> Direct email: <a href="mailto:support@tutovia.com" className="text-indigo-300 underline">support@tutovia.com</a>
                </span>
                <span>Average response time: &lt; 24h</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
