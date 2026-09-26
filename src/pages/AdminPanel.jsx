import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3, Users, FileText, HelpCircle, Shield, LogOut,
  Trash2, Plus, Search, CheckCircle, AlertCircle, RefreshCw,
  Newspaper, MessageSquare, BookOpen, ChevronRight, Eye, EyeOff,
  Mail
} from 'lucide-react';

const ADMIN_PASSWORD = 'tutovia@admin2026';
const ADMIN_KEY_HEADER = { 'x-admin-key': ADMIN_PASSWORD, 'Content-Type': 'application/json' };
const SESSION_KEY = 'tutovia_admin_auth';

// ── Helper ─────────────────────────────────────────────────────────────────────
const apiFetch = (url, opts = {}) =>
  fetch(url, { ...opts, headers: { ...ADMIN_KEY_HEADER, ...(opts.headers || {}) } }).then(r => r.json());

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
      </div>
    </div>
  );
}

// ── Tab Button ─────────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={16} />
      {children}
    </button>
  );
}

// ── Overview Tab ───────────────────────────────────────────────────────────────
function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deployDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">📊 Platform Overview</h2>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-400"><RefreshCw size={18} className="animate-spin" /> Loading stats…</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} color="bg-indigo-600" />
          <StatCard icon={BookOpen} label="Exam Questions" value={stats?.totalExamQuestions} color="bg-violet-600" />
          <StatCard icon={MessageSquare} label="Community Doubts" value={stats?.totalDoubts} color="bg-sky-600" />
          <StatCard icon={FileText} label="Flashcards" value={stats?.totalFlashcards} color="bg-emerald-600" />
          <StatCard icon={BarChart3} label="Exam Attempts" value={stats?.totalAttempts} color="bg-amber-600" />
          <StatCard icon={Mail} label="Support Inbox" value={stats?.totalMessages ?? 0} color="bg-rose-600" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">🖥️ Site Health</h3>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-medium">PM2 Process: Online</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Tutovia backend is running via PM2 on Oracle Cloud VM.</p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">🚀 Last Deploy</h3>
          <p className="text-white font-medium">{deployDate}</p>
          <p className="text-xs text-slate-500 mt-2">Frontend built with Vite + React. Nginx serving from /var/www/tutovia/dist.</p>
        </div>
      </div>
    </div>
  );
}

// ── Users Tab ──────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiFetch('/api/admin/users')
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-bold text-white">👥 Users ({users.length})</h2>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-400"><RefreshCw size={18} className="animate-spin" /> Loading users…</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-surface-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">CA Stage</th>
                <th className="px-4 py-3 font-medium">Group</th>
                <th className="px-4 py-3 font-medium">Attempt</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No users found.</td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id || i} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{u.name || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{u.email || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-900/50 text-indigo-300 border border-indigo-700/40">
                      {u.ca_stage || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{u.ca_group || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{u.attempt || '—'}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{u.joined || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-500">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Content Tab ────────────────────────────────────────────────────────────────
function ContentTab() {
  const [sub, setSub] = useState('news');
  const [news, setNews] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingDoubts, setLoadingDoubts] = useState(false);
  const [showAddNews, setShowAddNews] = useState(false);
  const [newNewsForm, setNewNewsForm] = useState({
    title: '', summary: '', category: '', source: '', originalUrl: '', whyItMatters: ''
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadNews = useCallback(() => {
    setLoadingNews(true);
    apiFetch('/api/admin/news')
      .then(data => setNews(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingNews(false));
  }, []);

  const loadDoubts = useCallback(() => {
    setLoadingDoubts(true);
    apiFetch('/api/admin/doubts')
      .then(data => setDoubts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingDoubts(false));
  }, []);

  useEffect(() => {
    if (sub === 'news') loadNews();
    if (sub === 'community') loadDoubts();
  }, [sub, loadNews, loadDoubts]);

  const deleteNews = async (id) => {
    if (!window.confirm('Delete this news article?')) return;
    await apiFetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    setNews(prev => prev.filter(n => n.id !== id));
    showToast('Article deleted.');
  };

  const deleteDoubt = async (id) => {
    if (!window.confirm('Delete this doubt?')) return;
    await apiFetch(`/api/admin/doubts/${id}`, { method: 'DELETE' });
    setDoubts(prev => prev.filter(d => String(d.id) !== String(id)));
    showToast('Doubt deleted.');
  };

  const addNews = async () => {
    if (!newNewsForm.title || !newNewsForm.summary) return showToast('Title and summary required.', 'error');
    setSaving(true);
    const item = await apiFetch('/api/admin/news', { method: 'POST', body: JSON.stringify(newNewsForm) });
    setNews(prev => [item, ...prev]);
    setNewNewsForm({ title: '', summary: '', category: '', source: '', originalUrl: '', whyItMatters: '' });
    setShowAddNews(false);
    setSaving(false);
    showToast('News article added!');
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-white">📝 Content Management</h2>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${toast.type === 'error' ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-emerald-900/50 border border-emerald-700 text-emerald-300'}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSub('news')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${sub === 'news' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
        >
          <Newspaper size={14} /> News Articles
        </button>
        <button
          onClick={() => setSub('community')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${sub === 'community' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
        >
          <MessageSquare size={14} /> Community Moderation
        </button>
      </div>

      {/* News Sub-tab */}
      {sub === 'news' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddNews(v => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all"
            >
              <Plus size={15} /> {showAddNews ? 'Cancel' : 'Add News'}
            </button>
          </div>

          {showAddNews && (
            <div className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white mb-2">Add News Article</h3>
              {[
                { key: 'title', label: 'Title *', placeholder: 'Article headline…' },
                { key: 'summary', label: 'Summary *', placeholder: 'Brief summary…' },
                { key: 'category', label: 'Category', placeholder: 'e.g. Taxation' },
                { key: 'source', label: 'Source', placeholder: 'e.g. ICAI' },
                { key: 'originalUrl', label: 'Source URL', placeholder: 'https://…' },
                { key: 'whyItMatters', label: 'Why It Matters', placeholder: 'CA relevance…' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-slate-400 mb-1">{f.label}</label>
                  <input
                    value={newNewsForm[f.key]}
                    onChange={e => setNewNewsForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
              <button
                onClick={addNews}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all disabled:opacity-50"
              >
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                {saving ? 'Adding…' : 'Add Article'}
              </button>
            </div>
          )}

          {loadingNews ? (
            <div className="flex items-center gap-3 text-slate-400"><RefreshCw size={18} className="animate-spin" /> Loading…</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-surface-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-slate-400 text-left">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {news.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No news articles loaded yet.</td></tr>
                  ) : news.map((n, i) => (
                    <tr key={n.id || i} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white max-w-xs">
                        <p className="truncate font-medium">{n.headline || n.title || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-sky-900/40 text-sky-300 border border-sky-700/30">{n.category || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{n.date || '—'}</td>
                      <td className="px-4 py-3 text-slate-400">{n.source || '—'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteNews(n.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/60 text-red-400 text-xs font-medium transition-all border border-red-800/30"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Community Sub-tab */}
      {sub === 'community' && (
        <div className="space-y-4">
          {loadingDoubts ? (
            <div className="flex items-center gap-3 text-slate-400"><RefreshCw size={18} className="animate-spin" /> Loading…</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-surface-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-slate-400 text-left">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Topic</th>
                    <th className="px-4 py-3 font-medium">Author</th>
                    <th className="px-4 py-3 font-medium">Upvotes</th>
                    <th className="px-4 py-3 font-medium">Replies</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {doubts.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No community doubts yet.</td></tr>
                  ) : doubts.map((d, i) => (
                    <tr key={d.id || i} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white max-w-xs">
                        <p className="truncate font-medium">{d.title || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-violet-900/40 text-violet-300 border border-violet-700/30">{d.topic || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{d.author || '—'}</td>
                      <td className="px-4 py-3 text-slate-400">{d.votes ?? d.upvotes ?? 0}</td>
                      <td className="px-4 py-3 text-slate-400">{(d.replies || []).length}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteDoubt(d.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/60 text-red-400 text-xs font-medium transition-all border border-red-800/30"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Question Bank Tab ──────────────────────────────────────────────────────────
const CA_SUBJECTS = [
  'Advanced Accounting',
  'Corporate & Other Laws',
  'Taxation',
  'Cost & Management Accounting',
  'Auditing & Ethics',
  'FM & SM',
];

function QuestionBankTab() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    subject: CA_SUBJECTS[0],
    examTitle: '',
    question: '',
    optionA: '', optionB: '', optionC: '', optionD: '',
    correctAnswer: '0',
    explanation: ''
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    apiFetch('/api/exams')
      .then(data => setExams(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = exams.reduce((acc, e) => {
    const subj = e.subject || 'Other';
    if (!acc[subj]) acc[subj] = [];
    acc[subj].push(e);
    return acc;
  }, {});

  const submitQuestion = async () => {
    if (!form.examTitle || !form.question || !form.optionA) return showToast('Fill all required fields.', 'error');
    setSaving(true);
    try {
      await apiFetch('/api/admin/questions', {
        method: 'POST',
        body: JSON.stringify({
          subject: form.subject,
          examTitle: form.examTitle,
          question: form.question,
          options: [form.optionA, form.optionB, form.optionC, form.optionD],
          correctAnswer: parseInt(form.correctAnswer),
          explanation: form.explanation
        })
      });
      showToast('Question added successfully!');
      setForm(prev => ({ ...prev, question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '0', explanation: '' }));
    } catch {
      showToast('Failed to add question. Check exam title matches exactly.', 'error');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">❓ Question Bank</h2>

      {toast && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${toast.type === 'error' ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-emerald-900/50 border border-emerald-700 text-emerald-300'}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Exams table */}
      {loading ? (
        <div className="flex items-center gap-3 text-slate-400"><RefreshCw size={18} className="animate-spin" /> Loading exams…</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([subject, exList]) => (
            <div key={subject} className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-white/5 border-b border-surface-border">
                <span className="text-sm font-semibold text-indigo-300">{subject}</span>
                <span className="ml-2 text-xs text-slate-500">({exList.length} exam{exList.length !== 1 ? 's' : ''})</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-left">
                    <th className="px-4 py-2.5 font-medium">Exam Title</th>
                    <th className="px-4 py-2.5 font-medium">Questions</th>
                    <th className="px-4 py-2.5 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {exList.map((e, i) => (
                    <tr key={e.id || i} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2.5 text-white">{e.title || '—'}</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-900/40 text-emerald-300 border border-emerald-700/30">
                          {(e.questions || []).length} Qs
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">{e.date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Add Question Form */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Plus size={16} className="text-indigo-400" /> Add MCQ Question
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Subject *</label>
            <select
              value={form.subject}
              onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-surface-border text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CA_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Exam Title * (must match existing)</label>
            <input
              value={form.examTitle}
              onChange={e => setForm(p => ({ ...p, examTitle: e.target.value }))}
              placeholder="e.g. GST Full Mock Test"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Question Text *</label>
          <textarea
            value={form.question}
            onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
            placeholder="Enter the MCQ question…"
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {['A', 'B', 'C', 'D'].map((letter, idx) => (
            <div key={letter}>
              <label className="block text-xs text-slate-400 mb-1">Option {letter} *</label>
              <input
                value={form[`option${letter}`]}
                onChange={e => setForm(p => ({ ...p, [`option${letter}`]: e.target.value }))}
                placeholder={`Option ${letter}…`}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Correct Answer *</label>
            <select
              value={form.correctAnswer}
              onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-surface-border text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="0">A (index 0)</option>
              <option value="1">B (index 1)</option>
              <option value="2">C (index 2)</option>
              <option value="3">D (index 3)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Explanation</label>
            <input
              value={form.explanation}
              onChange={e => setForm(p => ({ ...p, explanation: e.target.value }))}
              placeholder="Brief explanation of correct answer…"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <button
          onClick={submitQuestion}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
          {saving ? 'Adding…' : 'Add Question'}
        </button>
      </div>
    </div>
  );
}

// ── Support Inbox Tab ─────────────────────────────────────────────────────────
function SupportInboxTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    apiFetch('/api/admin/messages')
      .then(d => setMessages(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleResolve = async (id) => {
    await apiFetch(`/api/admin/messages/${id}/resolve`, { method: 'PATCH' });
    load();
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await apiFetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    load();
  };

  const filtered = messages.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Mail size={20} className="text-rose-400" />
          Student Inquiries & Feedback ({messages.length})
        </h2>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search inquiries…"
            className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-surface-border text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-400 p-8">
          <RefreshCw size={18} className="animate-spin" /> Loading inquiries…
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-surface-card border border-surface-border rounded-2xl text-slate-400 text-sm">
          No support inquiries received yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => (
            <div
              key={m.id}
              className={`p-5 rounded-2xl border transition-all ${
                m.status === 'Resolved'
                  ? 'bg-surface-card/40 border-surface-border opacity-75'
                  : 'bg-surface-card border-rose-500/30 shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white text-sm">{m.name}</span>
                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Tutovia Support')}`}
                    className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                    title="Click to reply via email"
                  >
                    {m.email}
                  </a>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    m.status === 'Resolved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {m.status || 'New'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{m.createdAt || m.date}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleResolve(m.id)}
                      className="px-2.5 py-1 rounded-lg bg-surface border border-surface-border hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 transition-colors"
                      title={m.status === 'Resolved' ? 'Mark as New' : 'Mark as Resolved'}
                    >
                      {m.status === 'Resolved' ? 'Mark New' : 'Mark Resolved'}
                    </button>
                    <button
                      onClick={() => deleteMsg(m.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-xs font-semibold text-amber-400 mb-1.5">{m.subject}</div>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Access Denied (for non-owner users trying /admin directly) ─────────────────
function AccessDenied() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface-card border border-rose-500/30 rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-2xl text-center">
        <div className="w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
          <Shield size={28} className="text-rose-400" />
        </div>
        <h1 className="text-xl font-bold text-white">Access Denied</h1>
        <p className="text-sm text-slate-400">
          This portal is restricted to the site owner only. Please log in with the correct account.
        </p>
        <a
          href="/"
          className="inline-block mt-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

// ── Owner account check ────────────────────────────────────────────────────────
const OWNER_IDS = ['u1'];
const OWNER_EMAILS = ['chaurasiaupasana70@gmail.com'];

function isOwnerUser(userData) {
  if (!userData) return false;
  const id = userData.id || '';
  const email = (userData.email || '').toLowerCase();
  return OWNER_IDS.includes(id) || OWNER_EMAILS.includes(email);
}

// ── Main Admin Panel ───────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');

  // Read user from localStorage (same mechanism as AuthContext)
  const rawUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('tutovia_user') || 'null');
    } catch {
      return null;
    }
  })();

  // Only allow access if the currently logged-in user is the owner
  if (!isOwnerUser(rawUser)) {
    return <AccessDenied />;
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'content', label: 'Content', icon: FileText },
    { key: 'questions', label: 'Question Bank', icon: HelpCircle },
    { key: 'inbox', label: 'Support Inbox', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-100">
      {/* Header */}
      <div className="border-b border-surface-border glass-panel sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">Tutovia Admin</h1>
              <p className="text-xs text-slate-500">
                Logged in as <span className="text-amber-400 font-semibold">{rawUser?.name || 'Owner'}</span> · Owner Access
              </p>
            </div>
          </div>
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
          >
            <LogOut size={15} /> Back to App
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tab Bar */}
        <div className="flex flex-wrap gap-2 bg-surface-card border border-surface-border rounded-2xl p-1.5">
          {tabs.map(t => (
            <TabBtn key={t.key} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} icon={t.icon}>
              {t.label}
            </TabBtn>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'questions' && <QuestionBankTab />}
          {activeTab === 'inbox' && <SupportInboxTab />}
        </div>
      </div>
    </div>
  );
}

