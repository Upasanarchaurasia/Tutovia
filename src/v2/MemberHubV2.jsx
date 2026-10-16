import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  GraduationCap, Bot, Compass, TrendingUp, 
  ArrowRight, LogOut, User, Settings, ChevronDown, 
  Sunrise, Sun, Sunset, Moon, Sparkles, CheckCircle2,
  X, Play, Pause, RotateCcw, Send, Check, ShieldCheck,
  Flame, Clock, BookOpen, Sparkle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from './ThemeContextV2.jsx';
import { V2_THEMES } from './themes.js';

export default function MemberHubV2() {
  const navigate = useNavigate();
  const { user, profile, loading, logout } = useAuth();
  const { activePhase, selectPhase, currentPhaseInfo, isAuto } = useTheme();
  const currentTheme = V2_THEMES[activePhase] || V2_THEMES.eclipse;
  const isDarkTheme = activePhase === 'twilight' || activePhase === 'eclipse';
  const shouldReduceMotion = useReducedMotion();

  // Dropdown & Modal states
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [studySpaceOpen, setStudySpaceOpen] = useState(false);
  const [activeStudyTab, setActiveStudyTab] = useState('tutor'); // 'tutor' | 'plan' | 'progress'
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Focus Timer state for Study Space
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // AI Tutor interactive questions in V2
  const [tutorQuery, setTutorQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Welcome to your V2 study space! Ask me any CA concept, section provision, or practical case law scenario without hesitation.'
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Study tasks completed tracker
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Corporate Law: Review Sec 135 CSR expenditure thresholds', done: true },
    { id: 2, title: 'Taxation: Capital Gains indexation formula practice', done: false },
    { id: 3, title: 'Auditing: SA 500 audit evidence documentation', done: false }
  ]);

  const accountMenuRef = useRef(null);
  const themeMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Auth Protection: If not authenticated and not loading, redirect to V2 login
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true, state: { from: '/hub' } });
    }
  }, [user, loading, navigate]);

  // Compute time-aware supportive greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Good night';
  };

  const studentName = 
    user?.user_metadata?.name || 
    user?.name || 
    user?.fullName || 
    profile?.full_name || 
    (user?.email ? user.email.split('@')[0] : 'CA Aspirant');

  const formattedName = studentName ? (studentName.charAt(0).toUpperCase() + studentName.slice(1)) : 'CA Aspirant';

  const handleOpenStudySpace = (tab = 'tutor') => {
    setActiveStudyTab(tab);
    setStudySpaceOpen(true);
    setAccountMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleSendQuestion = (e) => {
    e?.preventDefault();
    if (!tutorQuery.trim()) return;

    const userText = tutorQuery.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setTutorQuery('');
    setIsAiTyping(true);

    setTimeout(() => {
      let aiResponse = `Here is a clear first-principles breakdown for "${userText}":\n\n• Key Provision: Focus on the legislative intent and statutory thresholds.\n• Practical Application: In ICAI examination questions, state the section reference first, followed by facts analysis and conclusion.\n• Exam Tip: Avoid rote memorization; structure your working notes methodically.`;

      if (userText.toLowerCase().includes('csr') || userText.includes('135')) {
        aiResponse = `Section 135 (Corporate Social Responsibility):\n\n1. Applicability: Net worth ≥ ₹500 Cr, OR Turnover ≥ ₹1,000 Cr, OR Net Profit ≥ ₹5 Cr during the immediately preceding financial year.\n2. Spend Requirement: At least 2% of average net profits made during the 3 immediately preceding financial years.\n3. Committee: Required if CSR liability exceeds ₹50 Lakhs (3 or more directors, at least 1 independent).`;
      } else if (userText.toLowerCase().includes('tax') || userText.toLowerCase().includes('capital gains')) {
        aiResponse = `Capital Gains Summary:\n\n• Short-term vs Long-term is determined by holding period (12 / 24 / 36 months depending on asset class).\n• Section 48 sets the computation mechanism: Full value of consideration minus expenditure incurred wholly and exclusively in transfer, cost of acquisition, and improvement.`;
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsAiTyping(false);
    }, 700);
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-sans ${currentTheme.pageBg}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg animate-pulse">
            <GraduationCap size={24} />
          </div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">Preparing study space...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-500 ${currentTheme.pageBg}`}
      style={{ backgroundImage: currentTheme.pageGradient }}
    >
      {/* Ambient Glow Backdrop (Soft, non-distracting) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={
            shouldReduceMotion
              ? { scale: 1, opacity: 0.3 }
              : { 
                  x: [0, 20, -15, 0],
                  y: [0, -15, 12, 0],
                  scale: [1, 1.05, 0.98, 1],
                  opacity: [0.25, 0.38, 0.28, 0.25] 
                }
          } 
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-5%] left-[10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: currentTheme.ambient1 }}
        />
        <motion.div 
          animate={
            shouldReduceMotion
              ? { scale: 1, opacity: 0.25 }
              : { 
                  x: [0, -16, 14, 0],
                  y: [0, 16, -10, 0],
                  scale: [1, 0.98, 1.04, 1],
                  opacity: [0.22, 0.32, 0.24, 0.22] 
                }
          } 
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[-5%] right-[10%] w-[680px] h-[680px] rounded-full blur-[150px] pointer-events-none"
          style={{ background: currentTheme.ambient2 }}
        />
      </div>

      {/* Minimal Navigation Header */}
      <header className={`w-full border-b py-3 px-4 sm:px-8 transition-colors duration-500 z-30 ${currentTheme.navBg}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo & Return to Website */}
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg p-1"
              title="Return to Tutovia V2 Homepage"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105 text-white ${currentTheme.logoIcon} shrink-0`}>
                <GraduationCap size={18} />
              </div>
              <span className={`text-lg font-heading font-black tracking-tight leading-none ${currentTheme.logoText}`}>
                Tutovia
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-indigo-500/20 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
              <Sparkles size={11} /> App Gateway
            </span>
          </div>

          {/* Right Header Navigation Elements */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Launch Button */}
            <button
              onClick={() => handleOpenStudySpace('tutor')}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <span>Open My App</span>
              <ArrowRight size={13} />
            </button>

            {/* Theme Selector */}
            <div className="relative shrink-0" ref={themeMenuRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                aria-expanded={themeMenuOpen}
                aria-label="Theme selector"
                title={`Theme: ${currentPhaseInfo.name}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-sm cursor-pointer whitespace-nowrap ${
                  isDarkTheme 
                    ? 'bg-[#0F172A] text-white border-slate-700 hover:bg-[#1E293B]' 
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isAuto ? (
                  <Sparkles size={12} className="text-amber-500 shrink-0" />
                ) : (
                  activePhase === 'aurora' ? <Sunrise size={12} className="text-amber-500 shrink-0" /> :
                  activePhase === 'lumen' ? <Sun size={12} className="text-blue-500 shrink-0" /> :
                  activePhase === 'twilight' ? <Sunset size={12} className="text-amber-500 shrink-0" /> :
                  <Moon size={12} className="text-indigo-400 shrink-0" />
                )}
                <span className="hidden sm:inline capitalize">{currentPhaseInfo.name}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${themeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border p-2 z-50 backdrop-blur-xl ${
                      isDarkTheme 
                        ? 'bg-[#0B1120]/95 border-slate-700 text-slate-100' 
                        : 'bg-white/95 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 text-slate-400">
                      Rhythm Modes
                    </div>
                    {[
                      { id: 'aurora', label: 'Aurora (Dawn)', icon: Sunrise, color: 'text-amber-500' },
                      { id: 'lumen', label: 'Lumen (Daylight)', icon: Sun, color: 'text-blue-500' },
                      { id: 'twilight', label: 'Twilight (Evening)', icon: Sunset, color: 'text-amber-500' },
                      { id: 'eclipse', label: 'Eclipse (Night)', icon: Moon, color: 'text-indigo-400' }
                    ].map((phase) => {
                      const Icon = phase.icon;
                      const isSelected = activePhase === phase.id && !isAuto;
                      return (
                        <button
                          key={phase.id}
                          onClick={() => {
                            selectPhase(phase.id);
                            setThemeMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                            isSelected 
                              ? (isDarkTheme ? 'bg-slate-800 text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold') 
                              : (isDarkTheme ? 'hover:bg-slate-800/60 text-slate-300' : 'hover:bg-slate-50 text-slate-700')
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={14} className={phase.color} />
                            <span>{phase.label}</span>
                          </div>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                        </button>
                      );
                    })}
                    <div className="border-t border-slate-500/20 my-1 pt-1">
                      <button
                        onClick={() => {
                          selectPhase('auto');
                          setThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          isAuto 
                            ? (isDarkTheme ? 'bg-slate-800 text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold') 
                            : (isDarkTheme ? 'hover:bg-slate-800/60 text-slate-300' : 'hover:bg-slate-50 text-slate-700')
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} className="text-amber-400" />
                          <span>Auto (Time-based)</span>
                        </div>
                        {isAuto && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile & Account Menu */}
            <div className="relative shrink-0" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                aria-expanded={accountMenuOpen}
                aria-label="Account menu"
                className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-sm cursor-pointer ${
                  isDarkTheme 
                    ? 'bg-[#0F172A] text-white border-slate-700 hover:bg-[#1E293B]' 
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {formattedName.charAt(0)}
                </div>
                <span className="hidden md:inline text-xs font-semibold max-w-[120px] truncate">
                  {formattedName}
                </span>
                <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${accountMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {accountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl border p-2 z-50 backdrop-blur-xl ${
                      isDarkTheme 
                        ? 'bg-[#0B1120]/95 border-slate-700 text-slate-100' 
                        : 'bg-white/95 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="px-3 py-2 border-b border-slate-500/20 mb-1">
                      <div className="text-xs font-bold truncate">{formattedName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                    </div>

                    <button
                      onClick={() => { setProfileModalOpen(true); setAccountMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isDarkTheme ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <User size={14} className="text-indigo-400" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => { setSettingsModalOpen(true); setAccountMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isDarkTheme ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Settings size={14} className="text-indigo-400" />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-slate-500/20 my-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-rose-500 ${
                          isDarkTheme ? 'hover:bg-rose-950/30' : 'hover:bg-rose-50'
                        }`}
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 z-10">
        
        {/* 1. Welcome Panel (Hero) */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center flex flex-col items-center mb-10 sm:mb-12"
        >
          {/* Account Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border mb-5 bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>Account Ready • Closed Beta Access</span>
          </div>

          {/* Time-Aware Supportive Greeting */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mb-3 ${currentTheme.h1}`}>
            {getGreeting()}, {formattedName} 👋
          </h1>

          {/* Core Message */}
          <p className={`text-base sm:text-xl font-semibold mb-2 max-w-xl ${currentTheme.h2}`}>
            Your personalized Tutovia experience is ready.
          </p>

          <p className={`text-xs sm:text-sm leading-relaxed max-w-lg mb-8 ${currentTheme.bodyText}`}>
            Your study space is primed for focused, calm CA preparation. Jump in whenever you're ready to start your daily session.
          </p>

          {/* 2. One Primary Action (Main Visual Focus) */}
          <div className="w-full max-w-md flex flex-col items-center gap-3">
            <button
              onClick={() => handleOpenStudySpace('tutor')}
              className="w-full py-4 sm:py-4.5 px-8 rounded-2xl font-bold text-base sm:text-lg text-white shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25 border border-orange-400/30 focus-visible:ring-4 focus-visible:ring-orange-400/50"
            >
              <span>Open My Tutovia App</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-[11px] sm:text-xs text-slate-400 font-medium text-center">
              Interactive study space in this browser • Ready with your study plan
            </p>
          </div>
        </motion.div>

        {/* 3. Small "What you can do in the app" Preview (Exactly 3 cards) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
          className="w-full"
        >
          <div className="text-center mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              What you can do in your study space
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Card 1: AI Tutor */}
            <div 
              onClick={() => handleOpenStudySpace('tutor')}
              className={`group p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl cursor-pointer hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between ${
                isDarkTheme 
                  ? 'bg-slate-900/60 border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-900/80' 
                  : 'bg-white/80 border-slate-200/90 hover:border-indigo-400 hover:bg-white shadow-sm'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Bot size={20} />
                </div>
                <h3 className={`text-base font-bold font-heading mb-1.5 ${currentTheme.h2}`}>
                  AI Tutor
                </h3>
                <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 mb-2">
                  Ask doubts without hesitation.
                </p>
                <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>
                  First-principles conversational guidance breaking down complex ICAI provisions with zero judgment.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-500/15 flex items-center justify-between text-xs font-semibold text-indigo-500 group-hover:text-indigo-400">
                <span>Launch Tutor</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 2: Personalized Study Plan */}
            <div 
              onClick={() => handleOpenStudySpace('plan')}
              className={`group p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl cursor-pointer hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between ${
                isDarkTheme 
                  ? 'bg-slate-900/60 border-slate-700/60 hover:border-amber-500/50 hover:bg-slate-900/80' 
                  : 'bg-white/80 border-slate-200/90 hover:border-amber-400 hover:bg-white shadow-sm'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Compass size={20} />
                </div>
                <h3 className={`text-base font-bold font-heading mb-1.5 ${currentTheme.h2}`}>
                  Personalized Study Plan
                </h3>
                <p className="text-xs font-semibold text-amber-500 dark:text-amber-400 mb-2">
                  Know exactly what to focus on next.
                </p>
                <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>
                  Daily high-yield study blocks mapped against your exam attempt date and articleship schedule.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-500/15 flex items-center justify-between text-xs font-semibold text-amber-500 group-hover:text-amber-400">
                <span>View Study Plan</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 3: Progress & Revision */}
            <div 
              onClick={() => handleOpenStudySpace('progress')}
              className={`group p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl cursor-pointer hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between ${
                isDarkTheme 
                  ? 'bg-slate-900/60 border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-900/80' 
                  : 'bg-white/80 border-slate-200/90 hover:border-emerald-400 hover:bg-white shadow-sm'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <TrendingUp size={20} />
                </div>
                <h3 className={`text-base font-bold font-heading mb-1.5 ${currentTheme.h2}`}>
                  Progress & Revision
                </h3>
                <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 mb-2">
                  Stay consistent and revise at the right time.
                </p>
                <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>
                  Spaced repetition cues and adaptive recovery that eliminate backlog stress when work runs late.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-500/15 flex items-center justify-between text-xs font-semibold text-emerald-500 group-hover:text-emerald-400">
                <span>Check Progress</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Interactive Tutovia V2 Study Space (Self-contained in V2) */}
      <AnimatePresence>
        {studySpaceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25 }}
              className={`w-full max-w-3xl rounded-3xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
                isDarkTheme ? 'bg-[#0B1120] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Study Space Modal Header */}
              <div className="px-5 py-4 border-b border-slate-500/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold font-heading">Tutovia Study Space</h2>
                    <p className="text-[11px] text-slate-400">Your calm, personalized CA learning cockpit</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStudySpaceOpen(false)}
                    className="p-1.5 rounded-full hover:bg-slate-500/20 text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Study Space Tabs */}
              <div className="px-5 pt-3 border-b border-slate-500/20 flex items-center gap-2 shrink-0">
                {[
                  { id: 'tutor', label: 'AI Tutor', icon: Bot },
                  { id: 'plan', label: 'Study Plan', icon: Compass },
                  { id: 'progress', label: 'Focus & Progress', icon: TrendingUp }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeStudyTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveStudyTab(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer ${
                        isActive 
                          ? 'border-indigo-500 text-indigo-500 bg-indigo-500/10' 
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Body */}
              <div className="flex-1 overflow-y-auto p-5">
                {activeStudyTab === 'tutor' && (
                  <div className="flex flex-col h-[400px]">
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3">
                      {chatMessages.map((msg, i) => (
                        <div 
                          key={i} 
                          className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.sender === 'ai' && (
                            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                              AI
                            </div>
                          )}
                          <div 
                            className={`p-3 rounded-2xl text-xs max-w-[80%] whitespace-pre-line leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-sm'
                                : (isDarkTheme ? 'bg-slate-800/90 text-slate-200 rounded-tl-sm border border-slate-700' : 'bg-slate-100 text-slate-800 rounded-tl-sm')
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {isAiTyping && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                          <span>Tutovia AI is reasoning from first principles...</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Topic Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {['Sec 135 CSR thresholds', 'Capital Gains Sec 48', 'Ind AS 115 revenue model'].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => { setTutorQuery(chip); }}
                          className="px-2 py-1 rounded-lg text-[11px] font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Query Input */}
                    <form onSubmit={handleSendQuestion} className="flex gap-2 shrink-0">
                      <input
                        type="text"
                        value={tutorQuery}
                        onChange={(e) => setTutorQuery(e.target.value)}
                        placeholder="Type any CA doubt or topic to understand clearly..."
                        className={`flex-1 px-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isDarkTheme ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Send size={13} />
                        <span>Ask</span>
                      </button>
                    </form>
                  </div>
                )}

                {activeStudyTab === 'plan' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Current Phase Target</span>
                        <span className="text-xs font-bold text-emerald-500">Day 14 of 60</span>
                      </div>
                      <h4 className="text-sm font-bold font-heading mb-1">Corporate & Other Laws + Taxation Core Module</h4>
                      <p className="text-xs text-slate-400">Paced for CA Intermediate May / Nov Exam Cycle with automatic articleship evening recovery.</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's High-Yield Checklist</h4>
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            task.done 
                              ? (isDarkTheme ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 line-through' : 'bg-emerald-50 border-emerald-300 text-emerald-800 line-through')
                              : (isDarkTheme ? 'bg-slate-800/60 border-slate-700 text-slate-200 hover:border-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-white')
                          }`}
                        >
                          <span className="text-xs font-medium">{task.title}</span>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${task.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-500'}`}>
                            {task.done && <Check size={13} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeStudyTab === 'progress' && (
                  <div className="space-y-5">
                    {/* Pomodoro Timer */}
                    <div className="p-5 rounded-2xl border text-center flex flex-col items-center border-slate-500/20 bg-slate-500/5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Calm Focus Session</div>
                      <div className="text-4xl font-black font-heading tracking-tight mb-3">
                        {formatTimer(timerSeconds)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsTimerRunning(!isTimerRunning)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                          <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
                        </button>
                        <button
                          onClick={() => { setIsTimerRunning(false); setTimerSeconds(25 * 60); }}
                          className="p-2 rounded-xl border border-slate-500/30 text-slate-400 hover:text-slate-100 transition-colors"
                          title="Reset Timer"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Consistency Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl border border-slate-500/20 text-center">
                        <div className="text-2xl font-black font-heading text-amber-500">5 Days 🔥</div>
                        <div className="text-[11px] text-slate-400 font-medium">Study Streak</div>
                      </div>
                      <div className="p-3.5 rounded-xl border border-slate-500/20 text-center">
                        <div className="text-2xl font-black font-heading text-emerald-500">0 Stress</div>
                        <div className="text-[11px] text-slate-400 font-medium">Backlog Recalibration</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* V2 Member Profile Modal */}
      <AnimatePresence>
        {profileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
                isDarkTheme ? 'bg-[#0B1120] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/20 mb-4">
                <h3 className="font-bold text-base font-heading">Member Profile</h3>
                <button onClick={() => setProfileModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Full Name</span>
                  <div className="p-2.5 rounded-xl border border-slate-500/20 font-bold">{formattedName}</div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Email Address</span>
                  <div className="p-2.5 rounded-xl border border-slate-500/20">{user?.email || 'student@icai.org'}</div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Exam Level</span>
                  <div className="p-2.5 rounded-xl border border-slate-500/20">CA Intermediate / Final Cohort</div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Account Access</span>
                  <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    <span>Closed Beta Active • Tutovia V2</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-500/20 flex justify-end">
                <button
                  onClick={() => setProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* V2 Settings Modal */}
      <AnimatePresence>
        {settingsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
                isDarkTheme ? 'bg-[#0B1120] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/20 mb-4">
                <h3 className="font-bold text-base font-heading">Study Preferences</h3>
                <button onClick={() => setSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">Daily Rhythm Auto-Switch</div>
                    <div className="text-slate-400 text-[11px]">Adapts colors to Aurora, Lumen, Twilight & Eclipse</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">Articleship Overtime Recovery</div>
                    <div className="text-slate-400 text-[11px]">Zero penalty for delayed evening sessions</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">First-Principles Explanation Depth</div>
                    <div className="text-slate-400 text-[11px]">Includes analogies and bare act sections</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4" />
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-500/20 flex justify-end">
                <button
                  onClick={() => setSettingsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Minimal Footer */}
      <footer className="w-full py-4 px-4 text-center border-t border-slate-500/15 text-[11px] text-slate-400 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Tutovia • Built for focused, judgment-free CA preparation</span>
            <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-500/15 border border-slate-500/20 text-slate-400">v2.15.0</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-slate-200 transition-colors">
              Public Website
            </Link>
            <span>•</span>
            <button onClick={handleSignOut} className="hover:text-rose-400 transition-colors cursor-pointer">
              Sign Out
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
