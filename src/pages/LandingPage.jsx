import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  GraduationCap, Brain, Sparkles, Check, Zap, 
  BarChart, BookOpen, Timer, Target, Calendar, 
  Clock, Bot, Flame, ArrowRight, Play, RotateCcw, 
  Send, Compass, Sun, Moon, Sunrise, Sunset, 
  Heart, Coffee, ShieldCheck, ChevronRight, Award,
  Sparkle, CheckCircle2, HelpCircle
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

export default function LandingPage() {
  const navigate = useNavigate();
  const { activePhase, phaseMode, selectPhase, currentPhaseInfo, isAuto } = useTheme();

  // Sandbox interactive state
  const [sandboxTab, setSandboxTab] = useState('ai');
  const [aiQuery, setAiQuery] = useState(null);
  const [simMarks, setSimMarks] = useState({ p1: 68, p2: 52, p3: 45 });

  // Problem card interaction state (card flipped/expanded)
  const [activeProblem, setActiveProblem] = useState(0);

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

      {/* TOP NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-surface-border transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="text-white" size={22} />
            </div>
            <div>
              <span className="text-xl font-heading font-black tracking-tight text-white block leading-none">Tutovia</span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Your Journey</span>
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-400">
            <a href="#journey" className="hover:text-white transition-colors">Daily Journey</a>
            <a href="#problems" className="hover:text-white transition-colors">Why Tutovia</a>
            <a href="#engines" className="hover:text-white transition-colors">Core Features</a>
            <a href="#wellbeing" className="hover:text-white transition-colors">Mindful Study</a>
            <a href="#sandbox" className="hover:text-white transition-colors">Live Demo</a>
            <Link to="/tutor" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Bot size={14} />
              <span>AI Tutor</span>
            </Link>
          </div>

          {/* Right: Time-of-Day Switcher & Auth */}
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
              onClick={() => navigate('/login')} 
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Log In
            </button>
            
            <button 
              onClick={() => navigate('/login')} 
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
        {/* 1. HERO SECTION — "Your journey. Your pace. Your companion." */}
        {/* ======================================================== */}
        <section className="relative pt-20 pb-28 md:pt-28 md:pb-36 px-4 overflow-hidden min-h-[92vh] flex items-center">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Copy (7 cols) */}
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
                Meet Tutovia — an intelligent, human study companion designed to help CA aspirants plan without panic, learn without distraction, and keep moving forward every single day.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => navigate('/login')} 
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl text-base sm:text-lg font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  Start Your Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="w-full sm:w-auto bg-surface-card border border-surface-border text-white px-7 py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-surface transition-all flex items-center justify-center gap-2"
                >
                  Explore Tutovia <ChevronRight size={18} className="text-indigo-400" />
                </button>
              </motion.div>

              {/* Subtle Trust Indicators */}
              <motion.div variants={fadeIn} className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs sm:text-sm font-medium text-slate-400">
                <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-400"/> Calm, anti-glare environment</span>
                <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-400"/> Built for CA Intermediate & Final</span>
                <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-400"/> Zero credit card needed</span>
              </motion.div>
            </motion.div>

            {/* Right: Floating Companion & Daily Rhythm Preview (5 cols) */}
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
                      <div className="w-12 h-12 rounded-2xl bg-surface border border-surface-border flex items-center justify-center text-white">
                        <phaseItem.icon size={22} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-400">{phaseItem.time}</span>
                    </div>

                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">{phaseItem.name}</div>
                    <h3 className="text-xl font-heading font-bold text-white mb-2">{phaseItem.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed flex-1">
                      {phaseItem.desc}
                    </p>

                    <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">{phaseItem.colors}</span>
                      {activePhase === phaseItem.id && (
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. PROBLEM SECTION — Interactive Struggles & Solutions */}
        {/* ======================================================== */}
        <section id="problems" className="py-24 px-4 relative">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4 border border-rose-500/20">
                <HelpCircle size={14} /> Beyond Just Study Hours
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-5">
                Students Struggle With More Than Just Studying
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                CA exams test endurance, emotional regulation, and planning as much as technical knowledge. Click any struggle below to see how Tutovia helps.
              </p>
            </div>

            {/* Interactive Cards Container */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Selector (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                {problems.map((prob, idx) => (
                  <div
                    key={prob.id}
                    onClick={() => setActiveProblem(idx)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      activeProblem === idx
                        ? 'bg-surface-card border-indigo-500/60 shadow-lg translate-x-1'
                        : 'bg-surface/50 border-surface-border hover:bg-surface-card hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        activeProblem === idx ? 'bg-indigo-600 text-white' : 'bg-surface-card text-slate-400'
                      }`}>
                        <prob.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{prob.studentVoice}</div>
                        <div className="text-xs text-slate-400">{prob.tag}</div>
                      </div>
                      <ChevronRight size={16} className={`transition-transform ${activeProblem === idx ? 'rotate-90 text-indigo-400' : 'text-slate-500'}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Solution Detail Reveal (7 cols) */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  {(() => {
                    const prob = problems[activeProblem];
                    return (
                      <motion.div
                        key={prob.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-surface-card border border-surface-border rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
                      >
                        <div className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          The Real Student Pain
                        </div>
                        <div className="text-2xl sm:text-3xl font-heading font-black text-white mb-4">
                          {prob.studentVoice}
                        </div>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 bg-surface/60 p-4 rounded-2xl border border-surface-border">
                          {prob.problemDetail}
                        </p>

                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          The Tutovia Solution
                        </div>
                        <div className="text-xl font-heading font-bold text-white mb-3">
                          {prob.solutionTitle}
                        </div>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                          {prob.solutionDetail}
                        </p>

                        <div className="pt-6 border-t border-surface-border flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-400">Built into every Tutovia account</span>
                          <button
                            onClick={() => navigate('/login')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
                          >
                            <span>Experience this solution</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>

            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. CORE FEATURES ORGANIZED AROUND THE JOURNEY */}
        {/* ======================================================== */}
        <section id="engines" className="py-24 px-4 bg-surface border-y border-surface-border">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/20">
                <Compass size={14} /> Complete Prep Ecosystem
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-5">
                Organized Around Your Learning Journey
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Rather than an overwhelming dashboard of disjointed widgets, Tutovia guides you through four intentional phases every study day.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Phase 1: Planning */}
              <div className="p-7 rounded-3xl bg-surface-card border border-surface-border flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                    <Calendar size={20} />
                  </div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Phase 1</div>
                  <h3 className="text-xl font-heading font-bold text-white mb-3">Planning & Rhythm</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    Personalized timetable generation fitting around coaching lectures, articleship schedules, and sleep habits.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/> Adaptive AI Rescheduling</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/> ICAI New Syllabus Mapping</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/> 12-Hour Mindful Agenda</li>
                  </ul>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full self-start">
                  ✓ Available Now
                </span>
              </div>

              {/* Phase 2: Learning & Deep Work */}
              <div className="p-7 rounded-3xl bg-surface-card border border-surface-border flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6">
                    <Bot size={20} />
                  </div>
                  <div className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">Phase 2</div>
                  <h3 className="text-xl font-heading font-bold text-white mb-3">Focus & Concept Mastery</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    Break down complex Sections, Accounting Standards, and case laws instantly with your 24/7 AI CA tutor.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/> Context-Aware CA AI Tutor</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/> Zen Study Desk (Synthesized Audio)</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/> SM-2 Spaced Repetition Decks</li>
                  </ul>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full self-start">
                  ✓ Available Now
                </span>
              </div>

              {/* Phase 3: Practice & Simulator */}
              <div className="p-7 rounded-3xl bg-surface-card border border-surface-border flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                    <Target size={20} />
                  </div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Phase 3</div>
                  <h3 className="text-xl font-heading font-bold text-white mb-3">Testing & Simulator</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    Remove guesswork. Calculate exact 40-mark paper thresholds and 50% group aggregate requirements with Set-Off rules.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/> ICAI 40/50 Passing Calculator</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/> Interactive Past Year Questions (PYQs)</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/> Subject Mastery Radar Heatmaps</li>
                  </ul>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full self-start">
                  ✓ Available Now
                </span>
              </div>

              {/* Phase 4: Reflection & Extended */}
              <div className="p-7 rounded-3xl bg-surface-card border border-surface-border flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                    <Heart size={20} />
                  </div>
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Phase 4</div>
                  <h3 className="text-xl font-heading font-bold text-white mb-3">Reflect & Wellbeing</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    Honor your stamina. Student community doubts, official ICAI circulars, and mindful wind-down routines.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/> Wellness & Anxiety Counseling</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/> Student Doubt Community Forum</li>
                    <li className="flex items-center gap-2"><Clock size={14} className="text-indigo-400"/> Google Calendar .ics Export</li>
                  </ul>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 bg-surface border border-surface-border px-3 py-1 rounded-full self-start">
                  Roadmap: Voice Tutor & Essay Checker
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. "BECAUSE YOU'RE MORE THAN YOUR STUDY HOURS" */}
        {/* ======================================================== */}
        <section id="wellbeing" className="py-24 px-4 relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider mb-6 border border-rose-500/20">
              <Heart size={14} /> Emotional Intelligence Philosophy
            </div>
            
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-white mb-6 leading-tight">
              Because you're more than your study hours.
            </h2>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-16 font-normal">
              Most study software acts like a cold warden, turning red and sounding alarms when you miss a session. Tutovia is built with empathy.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              
              <div className="p-6 rounded-3xl bg-surface-card border border-surface-border">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
                  <Coffee size={20} />
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">When You Fall Behind</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  No red alerts, no guilt-trips. Tutovia calmly recalculates your timetable so you always know the exact next step without panic.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-surface-card border border-surface-border">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                  <Moon size={20} />
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">Late Night Fatigue</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Tutovia detects late-night fatigue and suggests restorative rest over mindless, inefficient cramming. Sleep cements memory.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-surface-card border border-surface-border">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">Pre-Exam Anxiety</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Evidence-based grounding exercises and clear quantitative readiness scores that silence the inner voice whispering "Did I do enough?".
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. INTERACTIVE LIVE ENGINES SANDBOX */}
        {/* ======================================================== */}
        <section id="sandbox" className="py-24 px-4 bg-surface border-y border-surface-border relative">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4 uppercase tracking-widest">
                <Zap size={14} /> Test Drive The Engines
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4">
                Experience the Engines Right Now
              </h2>
              <p className="text-base sm:text-lg text-slate-300 font-medium">
                Try the AI tutor, passing simulator, and smart timetable right here without creating an account.
              </p>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-3xl overflow-hidden shadow-2xl">
              
              {/* Tabs */}
              <div className="flex border-b border-surface-border bg-surface flex-col sm:flex-row">
                <button 
                  onClick={() => setSandboxTab('ai')} 
                  className={`flex-1 py-4 text-xs sm:text-sm font-bold transition-colors ${
                    sandboxTab === 'ai' ? 'text-sky-400 border-b-2 border-sky-500 bg-surface-card' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bot size={18} className="inline mr-2 mb-0.5"/> 24/7 AI CA Mentor
                </button>
                <button 
                  onClick={() => setSandboxTab('simulator')} 
                  className={`flex-1 py-4 text-xs sm:text-sm font-bold transition-colors ${
                    sandboxTab === 'simulator' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-surface-card' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Target size={18} className="inline mr-2 mb-0.5"/> ICAI 40/50 Passing Tester
                </button>
                <button 
                  onClick={() => setSandboxTab('timetable')} 
                  className={`flex-1 py-4 text-xs sm:text-sm font-bold transition-colors ${
                    sandboxTab === 'timetable' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-surface-card' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar size={18} className="inline mr-2 mb-0.5"/> Adaptive Timetable Engine
                </button>
              </div>

              {/* Sandbox Tab Content */}
              <div className="p-6 md:p-10 min-h-[420px] flex flex-col items-center justify-center relative">
                
                {/* 1. AI Mentor Tab */}
                {sandboxTab === 'ai' && (
                  <div className="w-full max-w-2xl flex flex-col h-full">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-6 px-1">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
                          <Bot size={16} className="text-sky-400" />
                        </div>
                        <div className="bg-surface border border-surface-border rounded-2xl rounded-tl-sm p-4 text-sm text-slate-200">
                          Hi! I'm your CA Study AI. Ask me to break down complex ICAI case laws, tax calculations, or accounting standards simply.
                        </div>
                      </div>
                      
                      {aiQuery && (
                        <>
                          <div className="flex gap-4 flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                              <GraduationCap size={16} className="text-indigo-400" />
                            </div>
                            <div className="bg-indigo-600 rounded-2xl rounded-tr-sm p-4 text-sm text-white font-medium">
                              {aiQuery.q}
                            </div>
                          </div>
                          
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
                              <Bot size={16} className="text-sky-400" />
                            </div>
                            <div className="bg-surface border border-sky-500/30 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-200 leading-relaxed shadow-sm">
                              <TypewriterText text={aiQuery.a} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {!aiQuery && (
                      <div className="space-y-4 w-full mt-auto">
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            { 
                              q: "Explain Section 54 Capital Gains exemption simply", 
                              a: "Under Section 54, if an individual/HUF sells a Long-Term residential house and invests the capital gains into 1 new house (or 2 houses if gains <= Rs. 2 Crores, once in a lifetime), the capital gains are exempt. The new house must be purchased within 1 yr before / 2 yrs after transfer, or constructed within 3 yrs!" 
                            },
                            { 
                              q: "Ind AS 115: 5-step model for revenue", 
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
                            <button key={i} onClick={() => setAiQuery(q)} className="bg-surface border border-surface-border hover:border-sky-500/50 text-left p-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 transition-colors flex items-center justify-between group">
                              <span className="truncate pr-2">{q.q}</span>
                              <Send size={14} className="text-slate-500 group-hover:text-sky-400 shrink-0" />
                            </button>
                          ))}
                        </div>

                        <div className="pt-2 text-center">
                          <Link 
                            to="/tutor"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-600/20"
                          >
                            <Bot size={16} />
                            <span>Ask Your Own Question in Live AI Tutor →</span>
                          </Link>
                        </div>
                      </div>
                    )}
                    {aiQuery && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                        <button onClick={() => setAiQuery(null)} className="text-xs sm:text-sm text-slate-400 hover:text-white flex items-center gap-2">
                          <RotateCcw size={14} /> Try Another Question
                        </button>
                        <Link 
                          to={`/tutor?prompt=${encodeURIComponent(aiQuery.q)}`}
                          className="text-xs sm:text-sm text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1.5"
                        >
                          <span>Ask Follow-up in Full AI Tutor →</span>
                        </Link>
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
                            onClick={() => navigate('/login')}
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
                        onClick={() => navigate('/login')}
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
          </div>
        </section>

        {/* ======================================================== */}
        {/* 7. STUDENT VOICES & ENCOURAGING SOCIAL PROOF */}
        {/* ======================================================== */}
        <section className="py-24 px-4 bg-surface-card/40 border-b border-surface-border">
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
        {/* 8. FINAL INVITATION CTA */}
        {/* ======================================================== */}
        <section className="py-28 px-4 text-center">
          <div className="max-w-4xl mx-auto p-12 sm:p-16 rounded-3xl bg-surface-card border border-surface-border shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4 inline-block">
                Start Today
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-black text-white mb-6 leading-tight">
                Ready to begin your journey?
              </h2>
              <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-xl mx-auto font-normal">
                Every big achievement begins with a single calm, consistent day. Join students preparing for their next CA attempt with confidence.
              </p>
              <button 
                onClick={() => navigate('/login')} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl text-base sm:text-lg font-bold shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <span>Start Your Journey Free</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-surface-border bg-surface py-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-surface-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <GraduationCap className="text-indigo-400" size={18} />
              </div>
              <span className="font-heading font-bold text-white text-base">Tutovia</span>
              <span className="text-xs text-slate-500">&bull; Your Journey Through the Day</span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
              <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms of Service</button>
              <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact Support</button>
              <button onClick={() => navigate('/admin')} className="hover:text-white transition-colors">Admin Portal</button>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>&copy; 2026 Tutovia. Designed with care for CA aspirants across India.</div>
            <div>Not affiliated with ICAI. Independent educational platform.</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
