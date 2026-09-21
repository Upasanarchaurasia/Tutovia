import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  HeartPulse, 
  Newspaper, 
  Users, 
  Bot, 
  Flame, 
  Bell,
  Sun,
  Moon, 
  Clock,
  Sparkles,
  X,
  Layers,
  BarChart3,
  BookMarked,
  Search
} from 'lucide-react';
import axios from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function Navbar({ onOpenTutor }) {
  const location = useLocation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') document.documentElement.classList.add('light');
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };
  const [studyHours, setStudyHours] = useState('0.00');
  const [streak, setStreak] = useState(0);

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return names[0][0].toUpperCase();
  };

  useEffect(() => {
    axios.get('/api/notifications').then(res => setNotifications(res.data)).catch(() => {});
    if (user?.id) {
      axios.get(`/api/progress?userId=${user.id}`).then(res => {
        setStudyHours(res.data.study_hours_today);
        setStreak(res.data.current_streak);
      }).catch(() => {});
    }
  }, [location.pathname, user]);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/flashcards', label: 'Flashcards', icon: Layers },
    { path: '/exams', label: 'Exams & Quizzes', icon: GraduationCap },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/wellness', label: 'Wellness', icon: HeartPulse },
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/pyq', label: 'PYQ Bank', icon: BookMarked },
    { path: '/community', label: 'Doubt Forum', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-surface-border">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & 12-Hour Clock */}
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
                  Tutovia
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-widest font-semibold text-indigo-400">
                  Mindful Study Coach
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex flex-nowrap overflow-x-auto no-scrollbar items-center gap-1 mx-4 max-w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-surface-card/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Widgets & Actions */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Global Search Bar */}
            <div className="hidden lg:flex items-center relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-48 xl:w-64 pl-10 pr-4 py-2 bg-surface-card border border-surface-border rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Daily Study Hours Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
              <span>{studyHours} hrs Today</span>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
              <span className="hidden sm:inline">{streak} Day Streak</span>
            </div>

                        {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-surface-card hover:bg-slate-800 text-slate-300 transition-colors border border-surface-border"
              title="Toggle Light/Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-lg bg-surface-card hover:bg-slate-800 text-slate-300 transition-colors border border-surface-border"
                title="Timetable Reminders & Notifications"
              >
                <Bell className="w-5 h-5 text-slate-300" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-4 ring-background" />
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl p-4 shadow-2xl border border-surface-border z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-sm text-slate-100">Timetable Session Reminders</span>
                    </div>
                    <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-200">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-3 rounded-xl border text-xs ${
                        n.urgent 
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' 
                          : 'bg-surface-card/70 border-surface-border text-slate-300'
                      }`}>
                        <div className="flex items-center justify-between mb-1 font-semibold">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Tutor Chat Trigger */}
            <button
              onClick={onOpenTutor}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-static-white font-medium text-sm shadow-md shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <Bot className="w-4 h-4 text-indigo-200" />
              <span>Ask AI Tutor</span>
            </button>

            {/* User Profile Link */}
            <Link 
              to="/profile" 
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] hover:scale-105 transition-transform ml-1"
              title="User Profile"
            >
              <div className="w-full h-full rounded-full bg-surface-card flex items-center justify-center overflow-hidden border-2 border-surface-card">
                <span className="text-xs font-bold text-indigo-200">{getInitials(user?.name)}</span>
              </div>
            </Link>

          </div>

        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`p-2 rounded-lg ${isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>

      </div>
    </header>
  );
}
