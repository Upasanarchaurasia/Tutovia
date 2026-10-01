import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3, Users, FileText, HelpCircle, Shield, LogOut,
  Trash2, Plus, Search, CheckCircle, AlertCircle, RefreshCw,
  Newspaper, MessageSquare, BookOpen, ChevronRight, Eye, EyeOff,
  Mail, Flame, Clock, Calendar, Award, Sparkles, Phone, ExternalLink,
  Check, X, Copy, Lock, Unlock, UserCheck, Activity, Target
} from 'lucide-react';

const ADMIN_PASSWORD = 'tutovia@admin2026';
const ADMIN_KEY_HEADER = { 'x-admin-key': ADMIN_PASSWORD, 'Content-Type': 'application/json' };
const SESSION_KEY = 'tutovia_admin_auth';

// ── Helper ─────────────────────────────────────────────────────────────────────
const apiFetch = (url, opts = {}) =>
  fetch(url, { ...opts, headers: { ...ADMIN_KEY_HEADER, ...(opts.headers || {}) } }).then(r => r.json());

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, subtext, color, pulse = false }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-400 uppercase tracking-widest">{label}</p>
          {pulse && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">{value ?? '—'}</p>
        {subtext && <p className="text-[11px] text-slate-400 mt-0.5 truncate">{subtext}</p>}
      </div>
    </div>
  );
}

// ── Tab Button ─────────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, icon: Icon, badge, children }) {
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
      <span>{children}</span>
      {badge !== undefined && badge !== null && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
          active ? 'bg-indigo-950 text-indigo-200' : 'bg-white/10 text-slate-300'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Student Dossier Modal ──────────────────────────────────────────────────────
function StudentDossierModal({ user, onClose }) {
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    apiFetch(`/api/admin/users/${encodeURIComponent(user.id)}`)
      .then(data => setDetailedData(data))
      .catch(() => setDetailedData(user))
      .finally(() => setLoading(false));
  }, [user]);

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const u = detailedData || user;
  if (!u) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-surface-border flex items-start justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
              {(u.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{u.name || 'CA Aspirant'}</h3>
                {u.activity_status === 'active_today' && (
                  <span className="flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Today
                  </span>
                )}
                {u.activity_status === 'active_recent' && (
                  <span className="text-xs bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 rounded-full font-medium">
                    Active Recently
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-0.5">{u.email || 'No email registered'}</p>
              <span className="inline-block mt-1 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                Source: {u.source || 'Database'} · ID: <span className="font-mono text-slate-300">{u.id}</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Contact Bar */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Mobile Number</p>
                <p className="text-sm font-semibold text-white font-mono">{u.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {u.phone && (
                <>
                  <button
                    onClick={() => copyToClipboard(u.phone, 'phone')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-all border border-white/5"
                  >
                    {copiedField === 'phone' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copiedField === 'phone' ? 'Copied' : 'Copy Phone'}
                  </button>
                  <a
                    href={`https://wa.me/${u.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-all shadow-md shadow-emerald-900/30"
                  >
                    <ExternalLink size={14} /> WhatsApp
                  </a>
                </>
              )}
              {u.email && (
                <button
                  onClick={() => copyToClipboard(u.email, 'email')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-all border border-white/5"
                >
                  {copiedField === 'email' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copiedField === 'email' ? 'Copied' : 'Copy Email'}
                </button>
              )}
            </div>
          </div>

          {/* Academic & Study KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock size={13} className="text-amber-400" /> Study Logged
              </p>
              <p className="text-xl font-bold text-white">{u.study_hours || `${((u.total_study_minutes || 0) / 60).toFixed(1)}h`}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{u.total_study_minutes || 0} mins total</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Flame size={13} className="text-orange-400" /> Active Streak
              </p>
              <p className="text-xl font-bold text-orange-400">{u.current_streak ? `${u.current_streak} days` : '0 days'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Consecutive study</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Target size={13} className="text-indigo-400" /> Pomodoros
              </p>
              <p className="text-xl font-bold text-white">{u.completed_pomodoros || 0}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Focus sessions</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Award size={13} className="text-emerald-400" /> Exam Tests
              </p>
              <p className="text-xl font-bold text-white">{u.completed_exams || (u.attempts?.length ?? 0)}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Mocks completed</p>
            </div>
          </div>

          {/* Academic Profile Details */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-indigo-400" /> Academic Profile & Targets
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">CA Stage</span>
                <span className="font-medium text-white capitalize">{u.ca_stage || 'Intermediate'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Group Target</span>
                <span className="font-medium text-white">{u.ca_group || 'Both Groups'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Exam Attempt</span>
                <span className="font-medium text-amber-300">{u.attempt || 'September 2026'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Target Score</span>
                <span className="font-medium text-emerald-300">{u.target_score || '60%'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Daily Target</span>
                <span className="font-medium text-white">{u.daily_study_hours || 6} hours / day</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Last Active</span>
                <span className="font-medium text-slate-300">{u.last_active_date || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Daily Schedule & Routine */}
          {(u.wake_time || u.sleep_time || u.commitments) && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} className="text-violet-400" /> Daily Routine & Commitments
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Wake Time</span>
                  <span className="font-medium text-white">{u.wake_time || '—'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Sleep Time</span>
                  <span className="font-medium text-white">{u.sleep_time || '—'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Commitments</span>
                  <span className="font-medium text-white">{u.commitments || 'Self-study focus'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Mock Attempts */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} className="text-amber-400" /> Exam & Quiz Attempts ({u.attempts?.length || 0})
            </h4>
            {(!u.attempts || u.attempts.length === 0) ? (
              <p className="text-xs text-slate-400 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
                No mock exam attempts logged by this student yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {u.attempts.map((att, idx) => (
                  <div key={att.id || idx} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-white font-medium">{att.exam_title || att.subject || 'Practice Exam'}</p>
                      <p className="text-slate-400">{att.submitted_at ? new Date(att.submitted_at).toLocaleDateString('en-IN') : 'Completed'}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-400 text-sm">{att.score ?? '—'}</span>
                      <span className="text-slate-400 block">{att.percentage ? `${att.percentage}%` : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-border bg-white/[0.01] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Overview Tab ───────────────────────────────────────────────────────────────
function OverviewTab({ onSelectStudent, onViewAllUsers }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      apiFetch('/api/admin/stats').catch(() => null),
      apiFetch('/api/admin/users').catch(() => [])
    ])
      .then(([sData, uData]) => {
        if (sData) setStats(sData);
        if (Array.isArray(uData)) setUsers(uData);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const deployDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const activeStudents = users.filter(u => u.activity_status === 'active_today' || u.activity_status === 'active_recent' || (u.total_study_minutes || 0) > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📊 Platform & Student Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time synchronization between Supabase Cloud and Tutovia production VM.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-all border border-surface-border"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* KPI Stat Cards */}
      {loading && !stats ? (
        <div className="flex items-center gap-3 text-slate-400 py-6">
          <RefreshCw size={18} className="animate-spin" /> Loading stats…
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            icon={Users}
            label="Total Students"
            value={stats?.totalUsers ?? users.length}
            subtext="Registered accounts"
            color="bg-indigo-600"
          />
          <StatCard
            icon={Activity}
            label="Active Today"
            value={stats?.activeUsersToday ?? users.filter(u => u.activity_status === 'active_today').length}
            subtext="Studying right now"
            color="bg-emerald-600"
            pulse={true}
          />
          <StatCard
            icon={Clock}
            label="Study Hours"
            value={`${stats?.totalStudyHours ?? '0'}h`}
            subtext="Total focus time"
            color="bg-amber-600"
          />
          <StatCard
            icon={Flame}
            label="Active Streaks"
            value={users.filter(u => (u.current_streak || 0) > 0).length}
            subtext="Daily learners"
            color="bg-orange-600"
          />
          <StatCard
            icon={BookOpen}
            label="Exam Bank"
            value={stats?.totalExamQuestions ?? '—'}
            subtext="CA Mock questions"
            color="bg-violet-600"
          />
          <StatCard
            icon={Mail}
            label="Support Inbox"
            value={stats?.totalMessages ?? 0}
            subtext="Student inquiries"
            color="bg-rose-600"
          />
        </div>
      )}

      {/* Live Spotlight: Active Students */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <h3 className="text-base font-bold text-white">Active Students Live Spotlight</h3>
          </div>
          {onViewAllUsers && (
            <button
              onClick={onViewAllUsers}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 hover:underline"
            >
              View All {users.length} Students <ChevronRight size={14} />
            </button>
          )}
        </div>

        {activeStudents.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-sm bg-black/20 rounded-xl">
            No active students recorded in the current session.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeStudents.slice(0, 6).map(u => (
              <div
                key={u.id}
                onClick={() => onSelectStudent && onSelectStudent(u)}
                className="bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 cursor-pointer transition-all duration-200 group hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-950/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-base group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {(u.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {u.name || 'CA Aspirant'}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{u.email || u.phone || 'No contact'}</p>
                    </div>
                  </div>
                  {u.activity_status === 'active_today' ? (
                    <span className="shrink-0 flex items-center gap-1 text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Today
                    </span>
                  ) : (
                    <span className="shrink-0 text-[11px] bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-medium">
                      Recent
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700/40 grid grid-cols-3 gap-1 text-center">
                  <div className="bg-black/20 rounded-lg p-1.5">
                    <span className="text-[10px] text-slate-400 block">Study</span>
                    <span className="text-xs font-bold text-amber-300">{u.study_hours || '0h'}</span>
                  </div>
                  <div className="bg-black/20 rounded-lg p-1.5">
                    <span className="text-[10px] text-slate-400 block">Streak</span>
                    <span className="text-xs font-bold text-orange-400">🔥 {u.current_streak || 0}d</span>
                  </div>
                  <div className="bg-black/20 rounded-lg p-1.5">
                    <span className="text-[10px] text-slate-400 block">Stage</span>
                    <span className="text-xs font-medium text-slate-300 truncate block">{u.ca_group || 'Inter'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Infrastructure & Sync Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Backend PM2 Daemon
          </h3>
          <p className="text-white font-medium">tutovia (Node.js Express)</p>
          <p className="text-xs text-slate-400 mt-1">Host: Oracle Cloud VM · 161.118.173.142</p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
            Supabase Cloud Sync
          </h3>
          <p className="text-white font-medium">Profiles & Progress Live</p>
          <p className="text-xs text-slate-400 mt-1">Synchronized with tivosvngnljlpfufulgj.supabase.co</p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            Production Release
          </h3>
          <p className="text-white font-medium">{deployDate}</p>
          <p className="text-xs text-slate-400 mt-1">Nginx serving dist build from /var/www/tutovia</p>
        </div>
      </div>
    </div>
  );
}

// ── Users Tab ──────────────────────────────────────────────────────────────────
function UsersTab({ selectedUserForDossier, onClearDossier }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [dossierUser, setDossierUser] = useState(selectedUserForDossier || null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (selectedUserForDossier) {
      setDossierUser(selectedUserForDossier);
    }
  }, [selectedUserForDossier]);

  const loadUsers = useCallback(() => {
    setLoading(true);
    apiFetch('/api/admin/users')
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const copyText = (text, id) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filter logic
  const filtered = users.filter(u => {
    const s = search.toLowerCase();
    const matchesSearch =
      (u.name || '').toLowerCase().includes(s) ||
      (u.email || '').toLowerCase().includes(s) ||
      (u.phone || '').includes(s) ||
      (u.ca_group || '').toLowerCase().includes(s) ||
      (u.attempt || '').toLowerCase().includes(s);

    if (!matchesSearch) return false;

    if (activeFilter === 'today') return u.activity_status === 'active_today';
    if (activeFilter === 'recent') return u.activity_status === 'active_recent' || u.activity_status === 'active_today';
    if (activeFilter === 'streaks') return (u.current_streak || 0) > 0;
    if (activeFilter === 'group1') return (u.ca_group || '').toLowerCase().includes('group 1') || (u.ca_group || '').toLowerCase().includes('both');
    if (activeFilter === 'group2') return (u.ca_group || '').toLowerCase().includes('group 2') || (u.ca_group || '').toLowerCase().includes('both');
    if (activeFilter === 'both') return (u.ca_group || '').toLowerCase().includes('both');

    return true;
  });

  const activeTodayCount = users.filter(u => u.activity_status === 'active_today').length;
  const streaksCount = users.filter(u => (u.current_streak || 0) > 0).length;
  const totalStudyMinutes = users.reduce((acc, u) => acc + (u.total_study_minutes || 0), 0);
  const totalHours = (totalStudyMinutes / 60).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Student Dossier Modal */}
      {dossierUser && (
        <StudentDossierModal
          user={dossierUser}
          onClose={() => {
            setDossierUser(null);
            if (onClearDossier) onClearDossier();
          }}
        />
      )}

      {/* Top Header & Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-card border border-surface-border rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider">Total Enrolled</p>
            <p className="text-xl font-bold text-white">{users.length}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Users size={18} />
          </div>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Today
            </p>
            <p className="text-xl font-bold text-emerald-400">{activeTodayCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Activity size={18} />
          </div>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider">Active Streaks</p>
            <p className="text-xl font-bold text-orange-400">🔥 {streaksCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
            <Flame size={18} />
          </div>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider">Total Study Time</p>
            <p className="text-xl font-bold text-amber-300">{totalHours}h</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Clock size={18} />
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-1">
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: 'all', label: `All (${users.length})` },
            { key: 'today', label: `Active Today (${activeTodayCount})`, activeDot: true },
            { key: 'recent', label: 'Active Recently' },
            { key: 'streaks', label: 'Streaks 🔥' },
            { key: 'group1', label: 'Group 1' },
            { key: 'group2', label: 'Group 2' },
            { key: 'both', label: 'Both Groups' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeFilter === f.key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f.activeDot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search student, email, phone…"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-surface-border text-slate-400 hover:text-white transition-all"
            title="Refresh Users"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center gap-3 text-slate-400 py-10 justify-center">
          <RefreshCw size={18} className="animate-spin" /> Loading active users…
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-surface-border shadow-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] text-slate-400 text-left border-b border-surface-border">
                <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider">Student Profile</th>
                <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider">Status & Activity</th>
                <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider">Phone / Mobile</th>
                <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider">Academic Details</th>
                <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider">Study Logged</th>
                <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider">Streak</th>
                <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border bg-slate-900/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <p className="text-base font-semibold text-slate-300">No students found matching your criteria</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting the filter or search query.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={u.id || i} className="hover:bg-white/[0.04] transition-colors group">
                    {/* Student Name & Email */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 shrink-0">
                          {(u.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                            {u.name || 'CA Aspirant'}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{u.email || '—'}</p>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            {u.source === 'Supabase Cloud' ? (
                              <span className="text-teal-400/90 font-mono">Cloud</span>
                            ) : (
                              <span className="text-purple-400/90 font-mono">Local</span>
                            )}
                            · Joined: {u.joined || '—'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status & Activity */}
                    <td className="px-4 py-3.5">
                      {u.activity_status === 'active_today' ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active Today
                          </span>
                          <p className="text-[11px] text-slate-400">Today {u.last_active_date !== 'Never' ? `(${u.last_active_date})` : ''}</p>
                        </div>
                      ) : u.activity_status === 'active_recent' ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                            <Clock size={11} /> {u.status_label || 'Active Recently'}
                          </span>
                          <p className="text-[11px] text-slate-400">{u.last_active_date}</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            Inactive
                          </span>
                          <p className="text-[11px] text-slate-500">{u.last_active_date || 'Never'}</p>
                        </div>
                      )}
                    </td>

                    {/* Phone / Mobile */}
                    <td className="px-4 py-3.5">
                      {u.phone ? (
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-300 font-mono text-xs font-medium">{u.phone}</span>
                          <button
                            onClick={() => copyText(u.phone, `phone-${u.id}`)}
                            className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                            title="Copy Phone"
                          >
                            {copiedId === `phone-${u.id}` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs italic">Not provided</span>
                      )}
                    </td>

                    {/* Academic Details */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-900/40 text-indigo-300 border border-indigo-700/30 capitalize">
                            {u.ca_stage || 'Intermediate'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {u.ca_group || 'Both Groups'}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-400/90 font-medium">
                          Attempt: {u.attempt || 'Sept 2026'}
                        </p>
                      </div>
                    </td>

                    {/* Study Logged & Progress */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">{u.study_hours || '0h'}</span>
                          <span className="text-[11px] text-slate-400">({u.total_study_minutes || 0}m)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>🍅 {u.completed_pomodoros || 0} pomodoros</span>
                        </div>
                      </div>
                    </td>

                    {/* Streak */}
                    <td className="px-4 py-3.5">
                      {u.current_streak > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          <Flame size={13} className="text-orange-400 fill-orange-400" />
                          {u.current_streak} {u.current_streak === 1 ? 'day' : 'days'}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setDossierUser(u)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all duration-200 shadow-sm"
                        title="View Student Dossier"
                      >
                        <Eye size={13} />
                        Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
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

// ── Admin Unlock Screen ────────────────────────────────────────────────────────
function AdminUnlockScreen({ password, setPassword, onUnlock, error }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface-card border border-amber-500/30 rounded-2xl p-8 w-full max-w-md space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Shield size={32} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Tutovia Admin Portal</h1>
          <p className="text-sm text-slate-400">
            Owner & Administrator Authentication. Enter your Master Admin Key to access student metrics and management.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onUnlock} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Master Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password…"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-surface-border text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-sm transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2"
          >
            <Unlock size={16} /> Unlock Admin Portal
          </button>
        </form>

        <div className="pt-2 text-center border-t border-surface-border">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            ← Back to Student Dashboard
          </a>
        </div>
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
  const [adminUnlocked, setAdminUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [masterPassword, setMasterPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState(null);

  // Read user from localStorage (same mechanism as AuthContext)
  const rawUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('tutovia_user') || 'null');
    } catch {
      return null;
    }
  })();

  const isOwner = isOwnerUser(rawUser) || adminUnlocked;

  const handleUnlock = (e) => {
    e?.preventDefault();
    if (masterPassword === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch {}
      setAdminUnlocked(true);
      setUnlockError('');
    } else {
      setUnlockError('Invalid Master Key. Access denied.');
    }
  };

  const handleLock = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setAdminUnlocked(false);
  };

  if (!isOwner) {
    return (
      <AdminUnlockScreen
        password={masterPassword}
        setPassword={setMasterPassword}
        onUnlock={handleUnlock}
        error={unlockError}
      />
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Active Students', icon: Users },
    { key: 'content', label: 'Content', icon: FileText },
    { key: 'questions', label: 'Question Bank', icon: HelpCircle },
    { key: 'inbox', label: 'Support Inbox', icon: Mail },
  ];

  const handleSelectStudent = (student) => {
    setSelectedStudentForDossier(student);
    setActiveTab('users');
  };

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
              <p className="text-xs text-slate-400">
                Logged in as <span className="text-amber-400 font-semibold">{rawUser?.name || 'Administrator'}</span> · Full Access
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLock}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 font-medium transition-all border border-transparent hover:border-rose-500/20"
              title="Lock admin session"
            >
              <Lock size={13} /> Lock
            </button>
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 text-xs font-medium transition-all border border-surface-border"
            >
              <LogOut size={13} /> Back to App
            </a>
          </div>
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
          {activeTab === 'overview' && (
            <OverviewTab
              onSelectStudent={handleSelectStudent}
              onViewAllUsers={() => setActiveTab('users')}
            />
          )}
          {activeTab === 'users' && (
            <UsersTab
              selectedUserForDossier={selectedStudentForDossier}
              onClearDossier={() => setSelectedStudentForDossier(null)}
            />
          )}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'questions' && <QuestionBankTab />}
          {activeTab === 'inbox' && <SupportInboxTab />}
        </div>
      </div>
    </div>
  );
}

