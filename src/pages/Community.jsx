import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageSquare, ThumbsUp, PlusCircle, Send, Sparkles, Filter, CheckCircle2, Award, Wifi } from 'lucide-react';
import axios from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../supabaseClient.js';

export default function Community() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeView, setActiveView] = useState('discussions');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [showNewDoubtModal, setShowNewDoubtModal] = useState(false);
  const [newTopic, setNewTopic] = useState('Taxation (Direct & GST)');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyInput, setReplyInput] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const channelRef = useRef(null);

  useEffect(() => {
    fetchData();
    // Subscribe to Supabase Realtime for live doubt updates
    const channel = supabase
      .channel('public:doubts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'doubts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setDoubts(prev => [{ ...payload.new, replies: [], upvotes: payload.new.upvotes || 0 }, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setDoubts(prev => prev.map(d => d.id === payload.new.id ? { ...d, ...payload.new } : d));
        } else if (payload.eventType === 'DELETE') {
          setDoubts(prev => prev.filter(d => d.id !== payload.old.id));
        }
      })
      .subscribe((status) => {
        setIsLive(status === 'SUBSCRIBED');
      });
    channelRef.current = channel;
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [doubtsRes, leaderboardRes] = await Promise.all([
        axios.get('/api/doubts'),
        axios.get('/api/leaderboard')
      ]);
      setDoubts(doubtsRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoubt = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const authorName = user?.name || user?.email?.split('@')[0] || 'CA Aspirant';
      await axios.post('/api/doubts', {
        topic: newTopic,
        title: newTitle,
        content: newContent,
        author: authorName,
        avatar: authorName.substring(0, 2).toUpperCase()
      });
      setNewTitle('');
      setNewContent('');
      setShowNewDoubtModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReply = async (doubtId) => {
    const text = replyInput[doubtId];
    if (!text || !text.trim()) return;

    try {
      const authorName = user?.name || user?.email?.split('@')[0] || 'CA Aspirant';
      await axios.post(`/api/doubts/${doubtId}/replies`, {
        content: text,
        author: authorName
      });
      setReplyInput(prev => ({ ...prev, [doubtId]: '' }));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = (doubtId) => {
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        const current = d.upvotes || 0;
        return { ...d, upvotes: current + 1 };
      }
      return d;
    }));
  };

  const topics = [
    'All',
    'Taxation (Direct & GST)',
    'Advanced Accounting',
    'Corporate & Other Laws',
    'Cost & Management Accounting',
    'Auditing & Ethics',
    'FM & SM'
  ];

  const filteredDoubts = selectedTopic === 'All'
    ? doubts
    : doubts.filter(d => d.topic === selectedTopic);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading community doubt forum...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Community</span>
            {isLive && (
              <span className="flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                <Wifi className="w-2.5 h-2.5" /> LIVE
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Network</h1>
          <p className="text-slate-400 text-sm mt-1">
            Learn together, resolve doubts, and compete on the global leaderboard.
          </p>
        </div>

        <div className="flex bg-surface-card p-1 rounded-xl border border-surface-border w-full sm:w-auto">
          <button
            onClick={() => setActiveView('discussions')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeView === 'discussions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Discussions
          </button>
          <button
            onClick={() => setActiveView('leaderboard')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeView === 'leaderboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {activeView === 'discussions' && (
        <>
          <div className="flex justify-between items-center mt-6">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {topics.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                    selectedTopic === t
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewDoubtModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-static-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 whitespace-nowrap ml-4"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Question</span>
            </button>
          </div>

          {/* Doubts Feed */}
          <div className="space-y-6 mt-4">
            {filteredDoubts.map(doubt => (
          <div 
            key={doubt.id}
            className="glass-panel p-6 rounded-3xl border border-surface-border space-y-4 hover:border-indigo-500/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-static-white">
                  {doubt.avatar}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-200 block">{doubt.author}</span>
                  <span className="text-[10px] text-slate-400">{doubt.created_at}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpvote(doubt.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-card hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 border border-surface-border text-xs font-semibold transition-colors"
                  title="Upvote / Helpful"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{doubt.upvotes || 4}</span>
                </button>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {doubt.topic}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-1.5">{doubt.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{doubt.content}</p>
            </div>

            {/* Discussion Thread Replies */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>{doubt.replies.length} Discussion Responses</span>
              </div>

              {doubt.replies.map(reply => (
                <div key={reply.id} className="p-3 rounded-2xl bg-surface-card border border-surface-border space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300">{reply.author}</span>
                    <span className="text-[10px] text-slate-500">{reply.created_at}</span>
                  </div>
                  <p className="text-xs text-slate-200">{reply.content}</p>
                </div>
              ))}

              {/* Inline Reply Input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={replyInput[doubt.id] || ''}
                  onChange={(e) => setReplyInput({ ...replyInput, [doubt.id]: e.target.value })}
                  placeholder="Write a helpful response to your classmate..."
                  className="flex-1 bg-surface-card border border-surface-border rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => handleAddReply(doubt.id)}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-static-white text-xs font-semibold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>
        </>
      )}

      {/* LEADERBOARD VIEW */}
      {activeView === 'leaderboard' && (
        <div className="glass-panel p-6 rounded-3xl border border-surface-border space-y-6">
          <div className="text-center py-6">
            <h2 className="text-2xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" /> Global Rankings
            </h2>
            <p className="text-slate-400 text-sm">Compete with other CA aspirants based on study consistency.</p>
          </div>

          <div className="space-y-3">
            {leaderboard.map((item, idx) => (
              <div 
                key={item.userId || idx} 
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${idx === 0 ? 'bg-amber-500/10 border-amber-500/30' : idx === 1 ? 'bg-slate-300/10 border-slate-300/30' : idx === 2 ? 'bg-amber-700/10 border-amber-700/30' : 'bg-surface-card border-surface-border'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-amber-400 text-amber-900' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-600 text-amber-50' : 'bg-surface border border-surface-border text-slate-400'}`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">{item.name} {(item.userId === user?.id || item.name === user?.name) && '(You)'}</span>
                    <span className="text-xs text-slate-400">{item.current_streak} Day Streak</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-300">{Math.floor(item.total_study_minutes / 60)}h {item.total_study_minutes % 60}m</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Study Time</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Doubt Modal */}
      {showNewDoubtModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-surface-border space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-white">Post New Question to Community</h3>

            <form onSubmit={handleCreateDoubt} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Select Topic</label>
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Corporate Finance">Corporate Finance</option>
                  <option value="Financial Accounting">Financial Accounting</option>
                  <option value="Financial Markets">Financial Markets</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Question Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., How to calculate terminal value in DCF?"
                  className="w-full bg-surface-card border border-surface-border rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Details & Problem Description</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide context or formulas you're stuck on..."
                  className="w-full bg-surface-card border border-surface-border rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewDoubtModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-card text-slate-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-static-white text-xs font-semibold shadow-md"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
