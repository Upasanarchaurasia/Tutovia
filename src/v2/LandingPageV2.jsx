import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Brain, Sparkles, Check, Zap, 
  BarChart, BookOpen, Timer, Target, Calendar, 
  Clock, Bot, Flame, ArrowRight, Play, RotateCcw, 
  Send, Compass, Sun, Moon, Sunrise, Sunset, 
  Heart, Coffee, ShieldCheck, ChevronRight, Award,
  Sparkle, CheckCircle2, HelpCircle, X, Mail, User, CheckCircle
} from 'lucide-react';
import { useTheme, PHASES } from '../context/ThemeContext.jsx';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

function TypewriterText({ text }) {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayText('');
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayText}</span>;
}

export default function LandingPageV2() {
  const { activePhase, selectPhase, currentPhaseInfo, isAuto } = useTheme();

  // Sandbox interactive state
  const [sandboxTab, setSandboxTab] = useState('ai');
  const [aiQuery, setAiQuery] = useState(null);
  const [simMarks, setSimMarks] = useState({ p1: 68, p2: 52, p3: 45 });

  // In-Page V2 Modal States (100% isolated, zero navigation to main site)
  const [showV2Modal, setShowV2Modal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Tutovia V2 Early Access');
  const [submittedWaitlist, setSubmittedWaitlist] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  // Info Modal for Privacy / Terms / Contact
  const [infoModal, setInfoModal] = useState(null);

  const openActionModal = (title = 'Tutovia V2 Early Access') => {
    setModalTitle(title);
    setSubmittedWaitlist(false);
    setShowV2Modal(true);
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubmittedWaitlist(true);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const problems = [
    {
      id: 0,
      studentVoice: "“I don't know what to study next.”",
      problemTitle: "Decision Paralysis Every Morning",
      problemDetail: "Wasting the first 45 minutes of every day flipping through books, unsure whether to revise Accounting Standards or tackle Tax amendments.",
      solutionTitle: "Personalized Daily Direction",
      solutionDetail: "Tutovia maps the entire ICAI syllabus, analyzes your syllabus progress and exam attempt date, and serves one clear, prioritized study block every morning.",
      icon: Compass,
      tag: "Intelligent Guidance"
    },
    {
      id: 1,
      studentVoice: "“I make schedules but struggle to follow them.”",
      problemTitle: "Rigid Timetables Break Quickly",
      problemDetail: "One missed morning lecture or family commitment triggers a backlog panic, causing the entire monthly timetable to be abandoned.",
      solutionTitle: "Adaptive AI Rescheduling",
      solutionDetail: "When life gets in the way, Tutovia rebalances your upcoming days with zero guilt. No backlog anxiety — just a calm recalculation of what matters most.",
      icon: Calendar,
      tag: "Guilt-Free Planning"
    },
    {
      id: 2,
      studentVoice: "“I don't know where I'm actually weak.”",
      problemTitle: "Invisible Exam Blind Spots",
      problemDetail: "Rereading familiar chapters because they feel comfortable, while high-weightage weak chapters quietly remain unrevised.",
      solutionTitle: "Diagnostic Mastery Radar",
      solutionDetail: "Heatmaps highlight chapter retention, quiz accuracy, and PYQ coverage so you know exactly which 20% of topics yield 80% of exam marks.",
      icon: Target,
      tag: "Objective Clarity"
    },
    {
      id: 3,
      studentVoice: "“I lose consistency after week 2.”",
      problemTitle: "Study Fatigue & Burnout",
      problemDetail: "Starting with 14-hour unsustainable marathons, crashing by the second week, and struggling to reopen the books.",
      solutionTitle: "Mindful Pacing & Micro-Streaks",
      solutionDetail: "Designed around sustainable 25-minute Pomodoro sessions and daily streak milestones that honor realistic stamina over exhausting burnout.",
      icon: Flame,
      tag: "Sustainable Habits"
    },
    {
      id: 4,
      studentVoice: "“I feel overwhelmed by 600 pages.”",
      problemTitle: "The Monolithic Syllabus Mountain",
      problemDetail: "Staring at three giant volumes of Corporate Law and Taxation wondering how anyone retains it all before exam day.",
      solutionTitle: "SM-2 Spaced Repetition Flashcards",
      solutionDetail: "Core formulas, case laws, and Standards are distilled into bite-sized active recall cards scheduled right before your brain forgets them.",
      icon: Brain,
      tag: "Long-Term Retention"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-main flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500 selection:text-white transition-colors duration-700">
      
      {/* Ambient Time-of-Day Glow Sphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.35, 0.5, 0.35] }} 
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-15%] left-[10%] w-[700px] h-[700px] rounded-full blur-[140px] transition-all duration-1000"
          style={{
            background: activePhase === 'morning' 
              ? 'radial-gradient(circle, rgba(255,231,163,0.45) 0%, rgba(245,158,114,0.2) 60%, transparent 80%)'
              : activePhase === 'day'
              ? 'radial-gradient(circle, rgba(224,242,254,0.5) 0%, rgba(99,102,241,0.15) 60%, transparent 80%)'
              : activePhase === 'evening'
              ? 'radial-gradient(circle, rgba(251,207,232,0.45) 0%, rgba(196,181,253,0.25) 60%, transparent 80%)'
              : 'radial-gradient(circle, rgba(221,214,254,0.2) 0%, rgba(76,74,109,0.2) 60%, transparent 80%)'
          }}
        />
        <motion.div 
          animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.4, 0.25] }} 
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-10%] right-[5%] w-[800px] h-[800px] rounded-full blur-[160px] transition-all duration-1000"
          style={{
            background: activePhase === 'morning'
              ? 'radial-gradient(circle, rgba(255,209,184,0.35) 0%, rgba(255,249,239,0.2) 70%, transparent 90%)'
              : activePhase === 'day'
              ? 'radial-gradient(circle, rgba(221,245,233,0.4) 0%, rgba(56,189,248,0.15) 70%, transparent 90%)'
              : activePhase === 'evening'
              ? 'radial-gradient(circle, rgba(244,165,138,0.35) 0%, rgba(196,181,253,0.2) 70%, transparent 90%)'
              : 'radial-gradient(circle, rgba(191,219,254,0.15) 0%, rgba(35,33,54,0.4) 70%, transparent 90%)'
          }}
        />
      </div>

      {/* TOP NAVIGATION — 100% Isolated for V2 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-surface-border transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          
          {/* Logo (Scrolls to top of V2) */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="text-white" size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-heading font-black tracking-tight text-white block leading-none">Tutovia</span>
                <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase">V2</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Your Journey</span>
            </div>
          </div>

          {/* In-Page Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-400">
            <button onClick={() => scrollToSection('journey')} className="hover:text-white transition-colors">Daily Journey</button>
            <button onClick={() => scrollToSection('problems')} className="hover:text-white transition-colors">Why Tutovia</button>
            <button onClick={() => scrollToSection('engines')} className="hover:text-white transition-colors">Core Features</button>
            <button onClick={() => scrollToSection('wellbeing')} className="hover:text-white transition-colors">Mindful Study</button>
            <button onClick={() => scrollToSection('sandbox')} className="hover:text-white transition-colors">Live Demo</button>
            <button 
              onClick={() => {
                setSandboxTab('ai');
                scrollToSection('sandbox');
              }} 
              className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20"
            >
              <Bot size={14} />
              <span>AI Tutor</span>
            </button>
          </div>

          {/* Right: Time-of-Day Switcher & V2 Actions */}
          <div className="flex items-center gap-3">
            
            {/* Time Atmosphere Preview Pills */}
            <div className="hidden lg:flex items-center gap-1 bg-surface-card border border-surface-border p-1 rounded-full text-xs font-semibold shadow-sm">
              {[
                { id: 'morning', label: 'Morning', icon: Sunrise },
                { id: 'day', label: 'Day', icon: Sun },
                { id: 'evening', label: 'Evening', icon: Sunset },
                { id: 'night', label: 'Night', icon: Moon },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => selectPhase(p.id)}
                  title={`Preview ${p.label} atmosphere`}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
                    activePhase === p.id 
                      ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <p.icon size={13} />
                  <span>{p.label}</span>
                </button>
              ))}
              <button
                onClick={() => selectPhase('auto')}
                title="Automatically adapt to your device's local time"
                className={`px-2 py-1 rounded-full text-[11px] transition-colors ${
                  isAuto ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Auto
              </button>
            </div>

            <button 
              onClick={() => openActionModal('Tutovia V2 Sign In')} 
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Log In
            </button>
            
            <button 
              onClick={() => openActionModal('Start Your Journey with Tutovia V2')} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <span>Start Your Journey</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16">
        
        {/* ======================================================== */}
        {/* 1. HERO SECTION */}
        {/* ======================================================== */}
        <section className="relative pt-20 pb-28 md:pt-28 md:pb-36 px-4 overflow-hidden min-h-[92vh] flex items-center">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Copy */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="lg:col-span-7 text-center lg:text-left">
              
              {/* Daily Phase Greeting Badge */}
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-card border border-surface-border text-xs sm:text-sm font-bold mb-8 shadow-sm">
                <span className="text-base">{currentPhaseInfo.icon}</span>
                <span className="text-white font-medium">{currentPhaseInfo.greeting}</span>
                <span className="text-slate-400 hidden sm:inline">&bull;</span>
                <span className="text-slate-300 hidden sm:inline">{currentPhaseInfo.label}</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 variants={fadeIn} className="text-5xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-white mb-6 leading-[1.08]">
                Your journey.<br />
                Your pace.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300">
                  Your companion.
                </span>
              </motion.h1>

              {/* Supporting Text */}
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Meet Tutovia V2 — an intelligent, human study companion designed to help CA aspirants plan without panic, learn without distraction, and keep moving forward every single day.
              </motion.p>

              {/* CTAs (All In-Page Isolated) */}
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => openActionModal('Get Started with Tutovia V2')} 
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl text-base sm:text-lg font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  Start Your Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => scrollToSection('journey')} 
                  className="w-full sm:w-auto bg-surface-card border border-surface-border text-white px-7 py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-surface transition-all flex items-center justify-center gap-2"
                >
                  Explore Tutovia V2 <ChevronRight size={18} className="text-indigo-400" />
                </button>
              </motion.div>

              {/* Subtle Trust Indicators */}
              <motion.div variants={fadeIn} className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs sm:text-sm font-medium text-slate-400">
                <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-400"/> Calm, anti-glare environment</span>
                <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-400"/> Built for CA Intermediate & Final</span>
                <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-400"/> Zero credit card needed</span>
              </motion.div>
            </motion.div>

            {/* Right: Floating Companion & Daily Rhythm Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative bg-surface-card/95 border border-surface-border rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                
                {/* Companion Header */}
                <div className="flex items-center justify-between pb-5 border-b border-surface-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                      <Sparkles className="text-indigo-400" size={24} />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-white text-base">Tutovia Study Companion</div>
                      <div className="text-xs text-slate-400">{currentPhaseInfo.name} &bull; {currentPhaseInfo.label}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                    <Flame size={14} className="animate-pulse" />
                    <span>14 Day Streak</span>
                  </div>
                </div>

                {/* Companion Encouraging Thought */}
                <div className="my-5 p-4 rounded-2xl bg-surface border border-surface-border/70">
                  <div className="text-xs font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                    <Heart size={13} className="text-rose-400" />
                    <span>Mindful Compassion</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    "{currentPhaseInfo.encouragement}"
                  </p>
                </div>

                {/* Floating Journey Cards Stack */}
                <div className="space-y-3">
                  
                  {/* Card 1: Today's High-Yield Focus Slot */}
                  <div className="p-3.5 rounded-2xl bg-surface border border-surface-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center">
                        <BookOpen size={18} className="text-sky-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Direct Tax: Capital Gains (Sec 54)</div>
                        <div className="text-[11px] text-slate-400">High Weightage &bull; 8-10 Marks</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-400">2h Slot</span>
                  </div>

                  {/* Card 2: Spaced Repetition Flashcard */}
                  <div className="p-3.5 rounded-2xl bg-surface border border-surface-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Brain size={18} className="text-purple-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">AS 22: Deferred Tax Assets</div>
                        <div className="text-[11px] text-slate-400">Memory fading &bull; Quick 3-min recall</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-purple-400 px-2 py-0.5 rounded-md bg-purple-500/10">Due Now</span>
                  </div>

                  {/* Card 3: Daily Progress Ring */}
                  <div className="p-3.5 rounded-2xl bg-surface border border-surface-border">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-slate-300">Daily Target Completion</span>
                      <span className="font-mono font-bold text-emerald-400">82% on track</span>
                    </div>
                    <div className="w-full h-2 bg-surface-card rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[82%]" />
                    </div>
                  </div>
                </div>

                {/* Footer preview note */}
                <div className="mt-4 pt-3 border-t border-surface-border/60 text-center">
                  <span className="text-[11px] text-slate-400 italic">
                    {currentPhaseInfo.quote}
                  </span>
                </div>

              </div>
            </motion.div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. SIGNATURE CONCEPT: "Your Journey Through the Day" */}
        {/* ======================================================== */}
        <section id="journey" className="py-24 px-4 bg-surface border-y border-surface-border">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/20">
                <Sun size={14} /> The Natural Progression
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-5">
                Your Journey Through the Day
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Study tools shouldn't feel like rigid spreadsheets. Tutovia's visual atmosphere gently evolves with your daily natural rhythm — from morning sunrise to twilight wind-down.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 'morning',
                  name: 'Morning',
                  title: 'Fresh Start',
                  time: '6 AM – 11 AM',
                  icon: Sunrise,
                  desc: 'Wake up with a clear, calm agenda. No decision paralysis or scramble — your high-yield chapters are ready.',
                  colors: 'Sunlight #FFE7A3 & Peach #FFD1B8',
                  bgGradient: 'from-amber-500/15 via-orange-500/10 to-transparent'
                },
                {
                  id: 'day',
                  name: 'Day',
                  title: 'Focus Mode',
                  titleColor: 'text-sky-400',
                  time: '11 AM – 5 PM',
                  icon: Sun,
                  desc: 'Clean, bright, high-contrast workspace for deep work sessions, mock questions, and complex numericals.',
                  colors: 'Clean #FFFFFF & Soft Blue #E0F2FE',
                  bgGradient: 'from-sky-500/15 via-indigo-500/10 to-transparent'
                },
                {
                  id: 'evening',
                  name: 'Evening',
                  title: 'Reflect & Recharge',
                  time: '5 PM – 9 PM',
                  icon: Sunset,
                  desc: 'Consolidate what you learned. Review daily wins without harsh guilt for uncompleted tasks.',
                  colors: 'Sunset Peach #F4A58A & Lavender #C4B5FD',
                  bgGradient: 'from-rose-500/15 via-purple-500/10 to-transparent'
                },
                {
                  id: 'night',
                  name: 'Night',
                  title: 'Wind Down',
                  time: '9 PM – 6 AM',
                  icon: Moon,
                  desc: 'Calming twilight mode. Rest is part of preparation. Deep sleep cements memory into long-term recall.',
                  colors: 'Twilight #F4F3FA & Soft Lavender',
                  bgGradient: 'from-purple-500/15 via-indigo-950/20 to-transparent'
                },
              ].map((phaseItem) => (
                <div
                  key={phaseItem.id}
                  onClick={() => selectPhase(phaseItem.id)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
                    activePhase === phaseItem.id
                      ? 'bg-surface-card border-indigo-500/60 shadow-xl ring-2 ring-indigo-500/20'
                      : 'bg-surface-card/60 border-surface-border hover:border-slate-600'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${phaseItem.bgGradient} opacity-60 pointer-events-none`} />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-surface border border-surface-border flex items-center justify-center">
                        <phaseItem.icon size={22} className="text-white" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">{phaseItem.time}</span>
                    </div>

                    <h3 className="font-heading font-bold text-white text-lg mb-1">{phaseItem.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">{phaseItem.desc}</p>
                    
                    <div className="mt-auto pt-4 border-t border-surface-border/50 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{phaseItem.name} Mode</span>
                      <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">Preview &rarr;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. STUDENT PROBLEMS VS. TUTOVIA SOLUTIONS */}
        {/* ======================================================== */}
        <section id="problems" className="py-24 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4 border border-rose-500/20">
                <Target size={14} /> The CA Struggle, Solved
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-5">
                Why Standard Schedules Fail CA Students
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                The ICAI curriculum is not just big — it is cognitively heavy. Here is how Tutovia replaces guilt and confusion with structured daily relief.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((p) => {
                const IconComponent = p.icon;
                return (
                  <div key={p.id} className="p-7 rounded-3xl bg-surface-card border border-surface-border flex flex-col justify-between hover:border-slate-600 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <IconComponent size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface border border-surface-border text-slate-400">
                          {p.tag}
                        </span>
                      </div>

                      <p className="text-xs text-rose-300 font-medium italic mb-2">
                        {p.studentVoice}
                      </p>
                      <h4 className="font-heading font-bold text-white text-base mb-2">
                        {p.problemTitle}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {p.problemDetail}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-surface-border">
                      <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                        <Check size={14} />
                        <span>{p.solutionTitle}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {p.solutionDetail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. CORE ENGINES */}
        {/* ======================================================== */}
        <section id="engines" className="py-24 px-4 bg-surface border-y border-surface-border">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-500/20">
                <Zap size={14} /> Built For Deep Performance
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-5">
                The 4 Core Study Engines
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Everything you need to master your attempt, thoughtfully integrated into one calm system.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Syllabus Mastery Tracker',
                  desc: 'Comprehensive coverage of CA Intermediate & Final papers. Track chapter weightage, revision rounds, and past year question frequency.',
                  icon: BookOpen,
                  color: 'text-indigo-400',
                  badge: 'ICAI Aligned'
                },
                {
                  title: 'SM-2 Active Spaced Repetition',
                  desc: 'Never forget Tax sections, case law citations, or Accounting Standards. Cards resurface right as your memory retention curve dips.',
                  icon: Brain,
                  color: 'text-purple-400',
                  badge: 'Scientifically Proven'
                },
                {
                  title: 'Dynamic CA Passing Simulator',
                  desc: 'Simulate paper marks against the 40% individual minimum and 50% aggregate rule. Know your safe margin before stepping into the exam hall.',
                  icon: BarChart,
                  color: 'text-emerald-400',
                  badge: 'ICAI 40/50 Rule'
                },
                {
                  title: 'Mindful Zen Study Room',
                  desc: 'Custom Pomodoro intervals, ambient white noise, binaural alpha waves, and breathing breaks to protect mental health during articleship and exam season.',
                  icon: Coffee,
                  color: 'text-amber-400',
                  badge: 'Anti-Burnout'
                }
              ].map((engine, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-surface-card border border-surface-border flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-surface border border-surface-border flex items-center justify-center shrink-0">
                    <engine.icon size={28} className={engine.color} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <h3 className="font-heading font-bold text-white text-xl">{engine.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface border border-surface-border text-slate-400">
                        {engine.badge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {engine.desc}
                    </p>
                    <button 
                      onClick={() => openActionModal(`Explore ${engine.title}`)} 
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
                    >
                      <span>Explore this feature</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. INTERACTIVE SANDBOX DEMO */}
        {/* ======================================================== */}
        <section id="sandbox" className="py-24 px-4 bg-background">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
                <Sparkles size={14} /> Live Interactive Preview
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-5">
                Try Tutovia Right Now
              </h2>
              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
                Interact with our core tools below — no login or sign-up needed.
              </p>
            </div>

            {/* Sandbox Tabs */}
            <div className="flex justify-center mb-8">
              <div className="p-1 rounded-2xl bg-surface-card border border-surface-border flex gap-1">
                {[
                  { id: 'ai', label: 'AI CA Tutor', icon: Bot },
                  { id: 'simulator', label: 'ICAI Marks Simulator', icon: BarChart },
                  { id: 'timetable', label: 'Daily Study Agenda', icon: Calendar }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSandboxTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      sandboxTab === t.id 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <t.icon size={15} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sandbox Content Container */}
            <div className="bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
              
              {/* 1. AI Tutor Tab */}
              {sandboxTab === 'ai' && (
                <div className="w-full max-w-xl space-y-4">
                  <div className="text-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                      Sample CA Intermediate Doubts
                    </span>
                    <p className="text-xs text-slate-400 mt-2">
                      Click any question below to see how Tutovia explains concepts clearly with bullet points and exam relevance.
                    </p>
                  </div>

                  {aiQuery ? (
                    <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                        <User size={14} />
                        <span>Question: {aiQuery.q}</span>
                      </div>
                      <div className="pt-2 border-t border-surface-border/60 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                        <strong className="text-indigo-400 block mb-1">Tutovia AI Tutor:</strong>
                        <TypewriterText text={aiQuery.a} />
                      </div>
                      <div className="pt-2 flex justify-between items-center text-xs">
                        <button 
                          onClick={() => setAiQuery(null)} 
                          className="text-slate-400 hover:text-white flex items-center gap-1.5"
                        >
                          <RotateCcw size={13} />
                          <span>Try another question</span>
                        </button>
                        <button
                          onClick={() => openActionModal('Full AI Tutor Access')}
                          className="text-indigo-400 hover:text-indigo-300 font-bold"
                        >
                          Ask Custom Question &rarr;
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {[
                        { 
                          q: "Ind AS 115: 5-Step Model for Revenue Recognition", 
                          a: "The 5 steps are: (1) Identify the contract with the customer, (2) Identify separate performance obligations, (3) Determine the transaction price, (4) Allocate the transaction price to obligations, and (5) Recognize revenue when (or as) the entity satisfies each performance obligation!" 
                        },
                        { 
                          q: "Difference between Qualified vs Adverse Opinion (SA 705)", 
                          a: "Qualified Opinion: Misstatements are material but NOT pervasive. Adverse Opinion: Misstatements are BOTH material AND pervasive to the financial statements, rendering them misleading overall." 
                        },
                        { 
                          q: "CARO 2020: Physical inventory verification clause", 
                          a: "Under Clause (ii)(a), the auditor must report whether physical verification of inventory was conducted by management at reasonable intervals, and whether discrepancies of 10% or more in aggregate for each class of inventory were properly dealt with in books." 
                        }
                      ].map((q, i) => (
                        <button 
                          key={i} 
                          onClick={() => setAiQuery(q)} 
                          className="w-full bg-surface border border-surface-border hover:border-sky-500/50 text-left p-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 transition-colors flex items-center justify-between group"
                        >
                          <span className="truncate pr-2">{q.q}</span>
                          <Send size={14} className="text-slate-500 group-hover:text-sky-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Simulator Tab */}
              {sandboxTab === 'simulator' && (
                <div className="w-full max-w-xl">
                  <div className="text-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      Interactive ICAI 40/50 Rule Demo
                    </span>
                    <p className="text-xs text-slate-300 mt-2">
                      Drag the sliders below to test individual paper pass marks (min 40) and aggregate percentage (min 50%).
                    </p>
                  </div>

                  <div className="space-y-4 bg-surface p-6 rounded-2xl border border-surface-border mb-6">
                    {[
                      { key: 'p1', code: 'Paper 1', name: 'Advanced Accounting' },
                      { key: 'p2', code: 'Paper 2', name: 'Corporate Laws' },
                      { key: 'p3', code: 'Paper 3', name: 'Taxation' }
                    ].map((p) => (
                      <div key={p.key} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">{p.code}: {p.name}</span>
                          <span className={`font-mono font-bold ${simMarks[p.key] >= 60 ? 'text-amber-400' : simMarks[p.key] < 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {simMarks[p.key]} Marks {simMarks[p.key] >= 60 ? '⭐ Exemption' : simMarks[p.key] < 40 ? '❌ Fail (<40)' : '✓'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={simMarks[p.key]}
                          onChange={(e) => setSimMarks({ ...simMarks, [p.key]: parseInt(e.target.value) || 0 })}
                          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Calculated Verdict */}
                  {(() => {
                    const total = simMarks.p1 + simMarks.p2 + simMarks.p3;
                    const pct = ((total / 300) * 100).toFixed(1);
                    const hasFail = simMarks.p1 < 40 || simMarks.p2 < 40 || simMarks.p3 < 40;
                    const hasAgg = total >= 150;

                    return (
                      <div className={`p-4 rounded-xl border flex items-center justify-between ${
                        !hasFail && hasAgg
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      }`}>
                        <div>
                          <div className="font-bold text-sm">
                            {!hasFail && hasAgg ? 'RESULT: GROUP 1 CLEARED! 🎉' : hasFail ? 'RESULT: INDIVIDUAL PAPER SHORTFALL (<40)' : 'RESULT: AGGREGATE DEFICIT (<150)'}
                          </div>
                          <div className="text-xs text-slate-300 mt-0.5">
                            Total: <strong>{total}/300 ({pct}%)</strong> &bull; {!hasFail && hasAgg ? 'Both 40-mark and 50% aggregate criteria met.' : hasFail ? 'Shortfall in one or more papers.' : `Needs ${150 - total} more marks to hit 50%.`}
                          </div>
                        </div>
                        <button
                          onClick={() => openActionModal('Full CA Passing Simulator')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md shrink-0 ml-3"
                        >
                          Full Simulator →
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* 3. Timetable Tab */}
              {sandboxTab === 'timetable' && (
                <div className="w-full max-w-xl">
                  <div className="text-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                      Smart 12-Hour Study Agenda
                    </span>
                    <p className="text-xs text-slate-300 mt-2">
                      Tutovia dynamically fits 8 hours of effective revision around your coaching lectures and sleep habits.
                    </p>
                  </div>

                  <div className="space-y-2 bg-surface p-4 rounded-2xl border border-surface-border">
                    {[
                      { time: '07:00 AM – 09:30 AM', title: 'Deep Work: Advanced Accounting (AS 28)', type: 'Study', tag: 'High Focus' },
                      { time: '09:30 AM – 10:30 AM', title: 'Breakfast & Mindful Stretch Break', type: 'Break', tag: 'Rest' },
                      { time: '10:30 AM – 01:30 PM', title: 'Direct Tax Laws: Capital Gains & Deductions', type: 'Study', tag: 'Core Theory' },
                      { time: '02:00 PM – 05:00 PM', title: 'Live Coaching Lecture / Articleship Slot', type: 'Class', tag: 'Fixed Slot' },
                      { time: '06:00 PM – 08:30 PM', title: 'Corporate Laws: Share Capital & Debentures', type: 'Study', tag: 'Active Recall' },
                      { time: '09:00 PM – 10:00 PM', title: 'Daily Diagnostic MCQ Practice Quiz', type: 'Mock', tag: 'Diagnostic' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-surface-card border border-surface-border/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-indigo-400 font-bold">{item.time}</span>
                          <span className="font-semibold text-slate-200">{item.title}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.type === 'Study' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                          item.type === 'Mock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          item.type === 'Class' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {item.tag}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={() => openActionModal('Personalized Timetable Generator')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <span>Generate my personalized timetable</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. STUDENT VOICES & ENCOURAGING SOCIAL PROOF */}
        {/* ======================================================== */}
        <section id="wellbeing" className="py-24 px-4 bg-surface-card/40 border-b border-surface-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
                <Award size={14} /> Genuine Encouragement
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4">
                You Are Not Studying Alone
              </h2>
              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
                Real reflections from CA aspirants building consistent daily habits with Tutovia.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "“The adaptive rescheduling is what saved me. I got sick for 4 days and usually that means ditching the schedule. Tutovia just smoothly rearranged my papers with zero drama.”",
                  author: "Aditya S.",
                  target: "CA Intermediate &bull; Group 1 Aspirant"
                },
                {
                  quote: "“The night wind-down mode actually helped me sleep. Seeing 'You've done enough for today' instead of an endless backlog relieved so much of my daily guilt.”",
                  author: "Sneha P.",
                  target: "CA Final &bull; Direct Tax Focus"
                },
                {
                  quote: "“The passing simulator showed me exactly why my aggregate was falling short even when clearing individual papers. That single insight changed how I apportion study hours.”",
                  author: "Kavya N.",
                  target: "CA Intermediate &bull; Both Groups"
                }
              ].map((testi, i) => (
                <div key={i} className="p-7 rounded-3xl bg-surface border border-surface-border flex flex-col justify-between">
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6 font-normal">
                    {testi.quote}
                  </p>
                  <div>
                    <div className="font-heading font-bold text-white text-sm">{testi.author}</div>
                    <div className="text-xs text-slate-400" dangerouslySetInnerHTML={{ __html: testi.target }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 7. FINAL INVITATION CTA */}
        {/* ======================================================== */}
        <section className="py-28 px-4 text-center">
          <div className="max-w-4xl mx-auto p-12 sm:p-16 rounded-3xl bg-surface-card border border-surface-border shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4 inline-block">
                Start Today &bull; V2
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-black text-white mb-6 leading-tight">
                Ready to begin your journey?
              </h2>
              <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-xl mx-auto font-normal">
                Every big achievement begins with a single calm, consistent day. Join students preparing for their next CA attempt with confidence on Tutovia V2.
              </p>
              <button 
                onClick={() => openActionModal('Start Your Journey with Tutovia V2')} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl text-base sm:text-lg font-bold shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <span>Start Your Journey Free</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER — 100% In-Page Isolated */}
      <footer className="border-t border-surface-border bg-surface py-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-surface-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <GraduationCap className="text-indigo-400" size={18} />
              </div>
              <span className="font-heading font-bold text-white text-base">Tutovia <span className="text-purple-400">V2</span></span>
              <span className="text-xs text-slate-500">&bull; Your Journey Through the Day</span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
              <button 
                onClick={() => setInfoModal({ title: 'Privacy Policy', text: 'At Tutovia V2, we respect student privacy. We do not sell personal data, display intrusive ads, or track student browsing history. All study sessions, notes, and quiz metrics remain encrypted and confidential.' })} 
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setInfoModal({ title: 'Terms of Service', text: 'Tutovia V2 is an independent educational companion designed for CA Intermediate and Final exam revision. Course materials and standards reference official ICAI publications for fair educational study purposes.' })} 
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => setInfoModal({ title: 'Contact Support', text: 'Have questions, suggestions, or feedback for Tutovia V2? Email our team at support@tutovia.com or reach out via our student community channel.' })} 
                className="hover:text-white transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>&copy; 2026 Tutovia V2. Designed with care for CA aspirants across India.</div>
            <div>Not affiliated with ICAI. Independent educational platform.</div>
          </div>
        </div>
      </footer>

      {/* IN-PAGE V2 EXPERIENCE / EARLY ACCESS MODAL */}
      <AnimatePresence>
        {showV2Modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Close Button */}
              <button 
                onClick={() => setShowV2Modal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface border border-surface-border flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Tutovia V2 Environment
                </span>
                <h3 className="text-xl font-extrabold text-white">{modalTitle}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You are exploring the dedicated <strong>Tutovia V2</strong> standalone experience. Join the V2 early cohort or jump directly into the live interactive sandboxes on this page.
                </p>
              </div>

              {submittedWaitlist ? (
                <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle size={24} />
                  </div>
                  <h4 className="font-bold text-white text-base">You're on the V2 Priority List!</h4>
                  <p className="text-xs text-slate-300">
                    We've saved your spot for <strong>{emailInput}</strong>. You'll receive early access to new V2 features before anyone else.
                  </p>
                  <button
                    onClick={() => setShowV2Modal(false)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
                  >
                    Continue Exploring V2
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request V2 Access</span>
                    <ArrowRight size={14} />
                  </button>

                  <div className="pt-3 border-t border-surface-border text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowV2Modal(false);
                        scrollToSection('sandbox');
                      }}
                      className="text-xs font-bold text-purple-400 hover:text-purple-300"
                    >
                      Or try the Live Interactive Sandboxes below &darr;
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* IN-PAGE INFO MODAL (Privacy / Terms / Contact) */}
      <AnimatePresence>
        {infoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <button 
                onClick={() => setInfoModal(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface border border-surface-border flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
              <h3 className="text-lg font-bold text-white">{infoModal.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {infoModal.text}
              </p>
              <div className="pt-2 text-right">
                <button
                  onClick={() => setInfoModal(null)}
                  className="px-4 py-2 rounded-xl bg-surface border border-surface-border hover:bg-surface-card text-xs font-bold text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
