import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  GraduationCap, Bot, Compass, TrendingUp, 
  ArrowRight, LogOut, User, Settings, ChevronDown, 
  Sunrise, Sun, Sunset, Moon, Sparkles, CheckCircle2,
  X, Check, Send, Sparkle, Target, Calendar, Clock
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
  
  // V2 Flow & Preview Modals
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState('CA Intermediate (Both Groups)');
  const [selectedPace, setSelectedPace] = useState('Post-Articleship Evening (8 PM - 11 PM)');
  const [directionCompleted, setDirectionCompleted] = useState(false);

  // Capability Preview Modals
  const [previewModal, setPreviewModal] = useState(null); // 'tutor' | 'direction' | 'progress' | null
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Interactive query demo inside AI Tutor Preview
  const [previewQuery, setPreviewQuery] = useState('');
  const [previewAnswer, setPreviewAnswer] = useState(
    'Section 135 (Corporate Social Responsibility):\n\n• Applicability: Net worth ≥ ₹500 Cr, OR Turnover ≥ ₹1,000 Cr, OR Net Profit ≥ ₹5 Cr during the immediately preceding financial year.\n• Expenditure: Minimum 2≥ of average net profits of 3 preceding financial years.\n• Exam Tip: Always check if the profit threshold applies to the immediately preceding FY rather than an average.'
  );

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
    user•.user_metadata•.name || 
    user•.name || 
    user•.fullName || 
    profile•.full_name || 
    (user•.email • user.email.split('@')[0] : 'CA Aspirant');

  const formattedName = studentName • (studentName.charAt(0).toUpperCase() + studentName.slice(1)) : 'CA Aspirant';

  const handleSignOut = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleAskPreview = (q) => {
    const query = q || previewQuery;
    if (!query.trim()) return;

    if (query.toLowerCase().includes('tax') || query.toLowerCase().includes('capital gains')) {
      setPreviewAnswer(
        'Section 48 (Computation of Capital Gains):\n\n• Mode of Computation: Full value of consideration received or accruing as a result of the transfer.\n• Deductions: (i) Expenditure incurred wholly and exclusively in connection with such transfer, (ii) Cost of acquisition, (iii) Cost of any improvement.\n• Exam Insight: Remember that securities transaction tax (STT) paid is NOT deductible under Section 48.'
      );
    } else if (query.toLowerCase().includes('ind as') || query.toLowerCase().includes('revenue')) {
      setPreviewAnswer(
        'Ind AS 115 (Revenue from Contracts with Customers):\n\n• 5-Step Model: (1) Identify the contract, (2) Identify performance obligations, (3) Determine transaction price, (4) Allocate transaction price, (5) Recognize revenue when/as obligation is satisfied.\n• Analogy: Think of a mobile phone sold with a 12-month data plan â€” revenue for the phone is recognized on delivery, while service revenue is recognized over the 12 months.'
      );
    } else {
      setPreviewAnswer(
        `First-Principles Breakdown for "${query}":\n\n• Core Legislative Intent: Evaluates the statutory purpose before delving into technical arithmetic.\n• Practical Application: In ICAI problem questions, begin with the governing section and provision criteria, analyze the scenario facts, and end with an unambiguous conclusion.\n• Exam Technique: Allocate specific working notes for statutory deductions and exclusions.`
      );
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-sans ${currentTheme.pageBg}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg animate-pulse">
            <GraduationCap size={24} />
          </div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">Preparing member homeâ€¦</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-500 ${currentTheme.pageBg}`}
      style={{ backgroundImage: currentTheme.pageGradient }}
    >
      {/* Ambient Glow Backdrop (Theme-adaptive, soft) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={
            shouldReduceMotion
              • { scale: 1, opacity: 0.3 }
              : { 
                  x: [0, 20, -15, 0],
                  y: [0, -15, 12, 0],
                  scale: [1, 1.05, 0.98, 1],
                  opacity: [0.25, 0.38, 0.28, 0.25] 
                }
          } 
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-5≥] left-[10≥] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: currentTheme.ambient1 }}
        />
        <motion.div 
          animate={
            shouldReduceMotion
              • { scale: 1, opacity: 0.25 }
              : { 
                  x: [0, -16, 14, 0],
                  y: [0, 16, -10, 0],
                  scale: [1, 0.98, 1.04, 1],
                  opacity: [0.22, 0.32, 0.24, 0.22] 
                }
          } 
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[-5≥] right-[10≥] w-[680px] h-[680px] rounded-full blur-[150px] pointer-events-none"
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
              <Sparkles size={11} /> Member Home
            </span>
          </div>

          {/* Right Header Navigation Elements */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Primary Action Button */}
            <button
              onClick={() => { setOnboardingStep(1); setOnboardingOpen(true); }}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <span>Set Up Direction</span>
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
                    • 'bg-[#0F172A] text-white border-slate-700 hover:bg-[#1E293B]' 
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isAuto • (
                  <Sparkles size={12} className="text-amber-500 shrink-0" />
                ) : (
                  activePhase === 'aurora' • <Sunrise size={12} className="text-amber-500 shrink-0" /> :
                  activePhase === 'lumen' • <Sun size={12} className="text-blue-500 shrink-0" /> :
                  activePhase === 'twilight' • <Sunset size={12} className="text-amber-500 shrink-0" /> :
                  <Moon size={12} className="text-indigo-400 shrink-0" />
                )}
                <span className="hidden sm:inline capitalize">{currentPhaseInfo.name}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${themeMenuOpen • 'rotate-180' : ''}`} />
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
                        • 'bg-[#0B1120]/95 border-slate-700 text-slate-100' 
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
                              • (isDarkTheme • 'bg-slate-800 text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold') 
                              : (isDarkTheme • 'hover:bg-slate-800/60 text-slate-300' : 'hover:bg-slate-50 text-slate-700')
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
                            • (isDarkTheme • 'bg-slate-800 text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold') 
                            : (isDarkTheme • 'hover:bg-slate-800/60 text-slate-300' : 'hover:bg-slate-50 text-slate-700')
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

            {/* Profile & Settings Menu */}
            <div className="relative shrink-0" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                aria-expanded={accountMenuOpen}
                aria-label="Account menu"
                className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-sm cursor-pointer ${
                  isDarkTheme 
                    • 'bg-[#0F172A] text-white border-slate-700 hover:bg-[#1E293B]' 
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {formattedName.charAt(0)}
                </div>
                <span className="hidden md:inline text-xs font-semibold max-w-[120px] truncate">
                  {formattedName}
                </span>
                <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${accountMenuOpen • 'rotate-180' : ''}`} />
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
                        • 'bg-[#0B1120]/95 border-slate-700 text-slate-100' 
                        : 'bg-white/95 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="px-3 py-2 border-b border-slate-500/20 mb-1">
                      <div className="text-xs font-bold truncate">{formattedName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user•.email}</div>
                    </div>

                    <button
                      onClick={() => { setProfileModalOpen(true); setAccountMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isDarkTheme • 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <User size={14} className="text-indigo-400" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => { setSettingsModalOpen(true); setAccountMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isDarkTheme • 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Settings size={14} className="text-indigo-400" />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-slate-500/20 my-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-rose-500 ${
                          isDarkTheme • 'hover:bg-rose-950/30' : 'hover:bg-rose-50'
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
          initial={shouldReduceMotion • { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center flex flex-col items-center mb-10 sm:mb-12"
        >
          {/* Account Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border mb-5 bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>Account Ready • Closed Beta Member</span>
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
            Your study space is primed for focused, calm CA preparation. Calibrate your daily syllabus milestones to begin.
          </p>

          {/* 2. One Primary Action (V2-Only Action) */}
          <div className="w-full max-w-md flex flex-col items-center gap-3">
            <button
              onClick={() => { setOnboardingStep(1); setOnboardingOpen(true); }}
              className="w-full py-4 sm:py-4.5 px-8 rounded-2xl font-bold text-base sm:text-lg text-white shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25 border border-orange-400/30 focus-visible:ring-4 focus-visible:ring-orange-400/50"
            >
              <span>Set Up My Study Direction</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-[11px] sm:text-xs text-slate-400 font-medium text-center">
              Calibrate your daily CA syllabus block and exam timeline in under 2 minutes
            </p>
          </div>
        </motion.div>

        {/* 3. Three Compact Capability Cards */}
        <motion.div
          initial={shouldReduceMotion • { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
          className="w-full"
        >
          <div className="text-center mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Core Capabilities in Closed Beta
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Card 1: AI Tutor */}
            <div 
              onClick={() => setPreviewModal('tutor')}
              className={`group p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl cursor-pointer hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between ${
                isDarkTheme 
                  • 'bg-slate-900/60 border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-900/80' 
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
                <span>Preview AI Tutor</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 2: Personalized Study Direction */}
            <div 
              onClick={() => setPreviewModal('direction')}
              className={`group p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl cursor-pointer hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between ${
                isDarkTheme 
                  • 'bg-slate-900/60 border-slate-700/60 hover:border-amber-500/50 hover:bg-slate-900/80' 
                  : 'bg-white/80 border-slate-200/90 hover:border-amber-400 hover:bg-white shadow-sm'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Compass size={20} />
                </div>
                <h3 className={`text-base font-bold font-heading mb-1.5 ${currentTheme.h2}`}>
                  Personalized Study Direction
                </h3>
                <p className="text-xs font-semibold text-amber-500 dark:text-amber-400 mb-2">
                  Know exactly what to focus on next.
                </p>
                <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>
                  Daily high-yield study blocks mapped against your exam attempt date and articleship schedule.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-500/15 flex items-center justify-between text-xs font-semibold text-amber-500 group-hover:text-amber-400">
                <span>View Direction</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 3: Revision & Progress */}
            <div 
              onClick={() => setPreviewModal('progress')}
              className={`group p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl cursor-pointer hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between ${
                isDarkTheme 
                  • 'bg-slate-900/60 border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-900/80' 
                  : 'bg-white/80 border-slate-200/90 hover:border-emerald-400 hover:bg-white shadow-sm'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <TrendingUp size={20} />
                </div>
                <h3 className={`text-base font-bold font-heading mb-1.5 ${currentTheme.h2}`}>
                  Revision & Progress
                </h3>
                <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 mb-2">
                  Stay consistent and revise at the right time.
                </p>
                <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>
                  Spaced repetition cues and adaptive recovery that eliminate backlog stress when work runs late.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-500/15 flex items-center justify-between text-xs font-semibold text-emerald-500 group-hover:text-emerald-400">
                <span>Explore System</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* V2 Study Direction Onboarding Flow (3-Step Setup) */}
      <AnimatePresence>
        {onboardingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl relative ${
                isDarkTheme • 'bg-[#0B1120] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/20 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {onboardingStep}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-heading">
                      {onboardingStep === 1 && 'Select Your CA Exam Level'}
                      {onboardingStep === 2 && 'Set Your Daily Study Rhythm'}
                      {onboardingStep === 3 && 'Study Direction Calibrated'}
                    </h3>
                    <p className="text-[11px] text-slate-400">Step {onboardingStep} of 3 • Tutovia V2 Setup</p>
                  </div>
                </div>
                <button onClick={() => setOnboardingOpen(false)} className="text-slate-400 hover:text-slate-100">
                  <X size={18} />
                </button>
              </div>

              {/* Step 1: Select Exam Level */}
              {onboardingStep === 1 && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 mb-2">
                    Tutovia adapts its high-yield daily curriculum to your specific examination scope:
                  </p>
                  {[
                    'CA Foundation',
                    'CA Intermediate (Group 1)',
                    'CA Intermediate (Group 2)',
                    'CA Intermediate (Both Groups)',
                    'CA Final (Both Groups)'
                  ].map((lvl) => (
                    <div
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedLevel === lvl
                          • 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold'
                          : (isDarkTheme • 'border-slate-700 bg-slate-800/50 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 hover:bg-white')
                      }`}
                    >
                      <span className="text-xs">{lvl}</span>
                      {selectedLevel === lvl && <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />}
                    </div>
                  ))}
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setOnboardingStep(2)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Continue</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Set Daily Routine */}
              {onboardingStep === 2 && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 mb-2">
                    Select the schedule that best accommodates your daily articleship or college routine:
                  </p>
                  {[
                    { title: 'Early Morning Focus (6:00 AM - 8:30 AM)', desc: 'Ideal before office commute; high retention focus block.' },
                    { title: 'Post-Articleship Evening (8:00 PM - 11:00 PM)', desc: 'Optimized with low-stress gradual ramp-up and zero overtime penalties.' },
                    { title: 'Split Schedule (Morning 1.5h + Evening 2h)', desc: 'Balanced distribution with active recall in between.' }
                  ].map((pace) => (
                    <div
                      key={pace.title}
                      onClick={() => setSelectedPace(pace.title)}
                      className={`p-3.5 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                        selectedPace === pace.title
                          • 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                          : (isDarkTheme • 'border-slate-700 bg-slate-800/50 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 hover:bg-white')
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{pace.title}</span>
                        {selectedPace === pace.title && <CheckCircle2 size={16} className="text-amber-400 shrink-0" />}
                      </div>
                      <span className="text-[11px] font-normal text-slate-400">{pace.desc}</span>
                    </div>
                  ))}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={() => setOnboardingStep(1)}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => { setOnboardingStep(3); setDirectionCompleted(true); }}
                      className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Lock Direction</span>
                      <Check size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Direction Confirmed */}
              {onboardingStep === 3 && (
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-heading mb-1">Your Study Direction is Locked!</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Tutovia has aligned your high-yield milestones for <strong className="text-slate-200">{selectedLevel}</strong> on a <strong className="text-slate-200">{selectedPace}</strong> routine.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-500/20 bg-slate-500/5 text-left text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Daily High-Yield Target:</span>
                      <span className="font-semibold text-slate-200">1 Core Topic + 3 Questions</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Backlog Recovery Policy:</span>
                      <span className="font-semibold text-emerald-400">Zero Guilt • Automatic Shift</span>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-center">
                    <button
                      onClick={() => setOnboardingOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                    >
                      Done & Return to Member Home
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Tutor Capability Preview Modal */}
      <AnimatePresence>
        {previewModal === 'tutor' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full max-w-xl rounded-3xl border p-6 shadow-2xl flex flex-col ${
                isDarkTheme • 'bg-[#0B1120] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/20 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-heading">AI Tutor • Capability Preview</h3>
                    <p className="text-[11px] text-slate-400">First-principles conversational explanations</p>
                  </div>
                </div>
                <button onClick={() => setPreviewModal(null)} className="text-slate-400 hover:text-slate-100">
                  <X size={18} />
                </button>
              </div>

              {/* Interactive Demo Content */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                <p className="text-xs text-slate-400">
                  Tutovia AI breaks down statutory jargon into conversational, real-world mental models. Try asking:
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Sec 135 CSR thresholds',
                    'Capital Gains Sec 48 deductions',
                    'Ind AS 115 revenue model'
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleAskPreview(chip)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-2xl border border-slate-500/20 bg-slate-500/5 text-xs whitespace-pre-line leading-relaxed max-h-[220px] overflow-y-auto font-sans">
                  {previewAnswer}
                </div>

                <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Full interactive chat is included with your Tutovia account.</span>
                  <span className="font-bold text-indigo-400">Beta Ready</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-500/20 flex justify-end shrink-0">
                <button
                  onClick={() => setPreviewModal(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Personalized Study Direction Capability Preview Modal */}
      <AnimatePresence>
        {previewModal === 'direction' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${
                isDarkTheme • 'bg-[#0B1120] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/20 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <Compass size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-heading">Personalized Study Direction • Preview</h3>
                    <p className="text-[11px] text-slate-400">High-yield blocks mapped against your exam attempt</p>
                  </div>
                </div>
                <button onClick={() => setPreviewModal(null)} className="text-slate-400 hover:text-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                  <div className="font-bold text-amber-400 mb-1">How Study Direction Works</div>
                  <p className="text-slate-400">
                    Instead of overwhelming you with the entire 800-page ICAI study material at once, Tutovia serves one high-yield study block each morning based on your remaining preparation days.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-300">Sample Daily Block (Corporate Law):</div>
                  <div className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/40 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span>Statutory Thresholds: Sec 135 CSR & Sec 149 Independent Directors</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/40 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span>Past 3 RTP Questions: Practice Board Report Disclosures</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-500/20 flex items-center justify-between">
                <button
                  onClick={() => { setPreviewModal(null); setOnboardingOpen(true); }}
                  className="text-xs text-amber-400 hover:underline font-semibold"
                >
                  Calibrate My Study Direction â†’
                </button>
                <button
                  onClick={() => setPreviewModal(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Revision & Progress Capability Preview Modal */}
      <AnimatePresence>
        {previewModal === 'progress' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${
                isDarkTheme • 'bg-[#0B1120] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/20 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-heading">Revision & Progress • Preview</h3>
                    <p className="text-[11px] text-slate-400">Zero-guilt adaptive scheduling & active recall</p>
                  </div>
                </div>
                <button onClick={() => setPreviewModal(null)} className="text-slate-400 hover:text-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                  <div className="font-bold text-emerald-400 mb-1">The Articleship Reality Principle</div>
                  <p className="text-slate-400">
                    Traditional timetable tools generate massive backlog guilt when office audit assignments run late. Tutovia recalculates remaining syllabus blocks without penalty or unachievable weekend cramming.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl border border-slate-700 text-center">
                    <div className="text-lg font-black text-emerald-400">Spaced Intervals</div>
                    <div className="text-[11px] text-slate-400">1-day, 7-day, 21-day revision triggers</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-700 text-center">
                    <div className="text-lg font-black text-amber-400">Adaptive Shift</div>
                    <div className="text-[11px] text-slate-400">Recalibrates quietly without shame</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-500/20 flex justify-end">
                <button
                  onClick={() => setPreviewModal(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Close
                </button>
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
                isDarkTheme • 'bg-[#0B1120] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
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
                  <div className="p-2.5 rounded-xl border border-slate-500/20">{user•.email || 'student@icai.org'}</div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Exam Scope</span>
                  <div className="p-2.5 rounded-xl border border-slate-500/20">{selectedLevel}</div>
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
                isDarkTheme • 'bg-[#0B1120] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
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
          <span>Tutovia V2 • Built for focused, judgment-free CA preparation</span>
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
