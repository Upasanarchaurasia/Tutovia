import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Lightbulb, Sparkles, Bookmark, AlertCircle } from 'lucide-react';
import axios from '../api.js';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/news'),
      axios.get('/api/profile')
    ])
    .then(([newsRes, profileRes]) => {
      setProfile(profileRes.data);
      
      // Personalize Feed Sorting based on CA Group
      const group1Subjects = ['Advanced Accounting', 'Corporate & Other Laws', 'Taxation'];
      const group2Subjects = ['Cost & Management Accounting', 'Auditing & Ethics', 'FM & SM'];
      
      let prioritizedSubjects = [];
      if (profileRes.data.ca_group === 'Group 1') prioritizedSubjects = group1Subjects;
      else if (profileRes.data.ca_group === 'Group 2') prioritizedSubjects = group2Subjects;
      else prioritizedSubjects = [...group1Subjects, ...group2Subjects];

      const sortedNews = [...newsRes.data].sort((a, b) => {
        const aPrioritized = prioritizedSubjects.includes(a.category) ? 1 : 0;
        const bPrioritized = prioritizedSubjects.includes(b.category) ? 1 : 0;
        return bPrioritized - aPrioritized; // Priority subjects first
      });

      setNewsList(sortedNews);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  const categories = [
    'All', 'ICAI Updates', 'Exam Updates', 'Advanced Accounting', 
    'Corporate & Other Laws', 'Taxation', 'Cost & Management Accounting', 
    'Auditing & Ethics', 'FM & SM', 'Finance & Economy'
  ];

  const icaiUpdates = newsList.filter(item => item.source && item.source.toLowerCase().includes('icai'));

  let filteredNews = newsList;
  if (selectedCategory === 'ICAI Updates') {
    filteredNews = icaiUpdates;
  } else if (selectedCategory !== 'All') {
    filteredNews = newsList.filter(item => item.category === selectedCategory);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Fetching real-world finance & study insights...</p>
      </div>
    );
  }

  const renderBold = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Newspaper className="w-3.5 h-3.5 text-indigo-400" />
            <span>Curated Academic & Industry Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Related News & Practical Applicability</h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Bridge the gap between theoretical exam concepts and real-world finance markets. Every news item includes a direct breakdown of how it applies to your corporate finance & accounting syllabus!
          </p>
        </div>
      </div>

      {/* Latest ICAI Updates Prominent Section */}
      {icaiUpdates.length > 0 && selectedCategory === 'All' && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30">
          <h3 className="text-rose-400 font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> 🔴 Latest ICAI Updates
          </h3>
          <div className="space-y-3">
            {icaiUpdates.slice(0, 2).map(update => (
              <div key={update.id} className="p-4 rounded-xl bg-surface-card border border-rose-500/20 flex flex-col sm:flex-row gap-4 justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">{update.headline || update.title}</h4>
                  <p className="text-xs text-slate-400">{update.summary}</p>
                </div>
                {update.originalUrl && (
                  <a href={update.originalUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 h-fit rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 hover:bg-rose-500/30 transition-all">
                    Read Announcement <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Articles Grid */}
      <div className="space-y-6">
        {filteredNews.map((article) => (
          <div 
            key={article.id}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border space-y-6 hover:border-indigo-500/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border w-fit uppercase tracking-wider ${
                  article.importance === '🔴 MUST KNOW' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                  article.importance === '🟡 RELEVANT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/30'
                }`}>
                  {article.importance || "🔵 GENERAL FINANCE"}
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Relevant to: {article.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-3 sm:mt-0">
                <span className="font-semibold text-slate-300">Source: {article.source}</span>
                <span>•</span>
                <span>{article.date ? new Date(article.date).toLocaleDateString() : 'Recent'}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2 leading-snug">{renderBold(article.headline || article.title)}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{renderBold(article.summary)}</p>
            </div>

            {/* Practical Applicability Highlight Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-surface-card to-purple-500/10 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-indigo-400" />
                <span>Why this matters to you</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {renderBold(article.whyItMatters || article.applicability)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {article.originalUrl && (
                <a href={article.originalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 text-xs font-bold border border-surface-border transition-all">
                  Read Original <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 text-xs font-bold border border-surface-border transition-all">
                <Bookmark className="w-3 h-3" /> Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-bold border border-indigo-500/30 transition-all sm:ml-auto">
                <Sparkles className="w-3 h-3" /> ✨ Ask Tutovia AI
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
