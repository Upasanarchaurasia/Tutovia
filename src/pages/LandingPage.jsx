import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Brain, Rocket, Check, Sparkles, Star, Zap, 
  Layers, BarChart, BookOpen, Users, Timer, Target, Calendar, 
  TrendingUp, Clock, Bot, Activity, Flame, ArrowRight, Play,
  RefreshCw, Send, Lock, RotateCcw, Crosshair
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
    }, 25);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayText}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [sandboxTab, setSandboxTab] = useState('ai');
  const [aiQuery, setAiQuery] = useState(null);
  const [simMarks, setSimMarks] = useState({ p1: 68, p2: 52, p3: 45 });

  return (
    <div className="min-h-screen bg-background text-main flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Interactive Ambient Mesh Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-full blur-[150px]" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-gradient-to-br from-blue-600/10 to-emerald-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/70 backdrop-blur-xl border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="text-white" size={22} />
            </div>
            <span className="text-xl font-black text-white tracking-tight">Tutovia</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-bold text-slate-300 hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/login')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-600/25">
              Start Free
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16">
        
        {/* 1. HERO SECTION */}
        <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 px-4 overflow-hidden min-h-[90vh] flex items-center">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Copy */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 text-center lg:text-left">
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8 uppercase tracking-widest shadow-sm">
                <Zap size={16} className="animate-pulse text-amber-400" /> The Algorithm Replacing 5 Study Apps
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
                Your Unfair Academic Advantage.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">Powered by AI.</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Stop drowning in notes and cramming forgotten chapters. Tutovia pinpoints your weak spots, automates your daily schedule, and locks knowledge into permanent memory.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-white text-indigo-950 px-8 py-4 rounded-xl text-lg font-black shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group">
                  Claim Your Free Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto bg-surface border border-surface-border text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-surface-card transition-all flex items-center justify-center gap-2">
                  Try Live Demo <Play size={18} className="text-indigo-400" />
                </button>
              </motion.div>
              <motion.div variants={fadeIn} className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-slate-500">
                <span className="flex items-center gap-1"><Check size={16} className="text-emerald-500"/> No credit card required</span>
                <span className="flex items-center gap-1"><Check size={16} className="text-emerald-500"/> Instant Setup</span>
              </motion.div>
            </motion.div>

            {/* Right: Live Interactive Mockup */}
            <motion.div initial={{ opacity: 0, x: 50, rotateY: -10 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full" />
              
              <div className="relative bg-surface-card border border-surface-border rounded-3xl p-6 shadow-2xl backdrop-blur-xl transform-gpu rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
                
                {/* Header Mock */}
                <div className="flex justify-between items-center mb-6 border-b border-surface-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <GraduationCap className="text-indigo-400" size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Dashboard</div>
                      <div className="text-xs text-slate-400">CA Final &bull; May 2027</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                    <Flame size={16} className="text-amber-500 animate-pulse" />
                    <span className="text-amber-500 font-bold text-sm">14 Days</span>
                  </div>
                </div>

                {/* Body Mock */}
                <div className="space-y-4">
                  {/* Pomodoro Mock */}
                  <div className="bg-surface border border-surface-border rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                        <Timer className="text-rose-400" size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">Deep Work Session</div>
                        <div className="text-xs text-slate-400">Direct Tax Laws</div>
                      </div>
                    </div>
                    <div className="text-xl font-black text-rose-400 font-mono tracking-wider">24:59</div>
                  </div>

                  {/* Flashcard Alert Mock */}
                  <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20"><Brain size={40} /></div>
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-2 uppercase tracking-wide">
                      <Zap size={14} /> SM-2 Spaced Repetition
                    </div>
                    <div className="font-bold text-white mb-1">Deferred Tax Assets</div>
                    <div className="text-sm text-slate-300 mb-4">Memory fading. Optimal review time: Now.</div>
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg w-full transition-colors shadow-lg shadow-indigo-500/25">
                      Review Flashcard
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </section>

        {/* 2. THE SECRET WEAPON: Interactive Sandbox */}
        <section id="sandbox" className="py-24 px-4 bg-surface-card/40 border-y border-surface-border relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4 uppercase tracking-widest">
                <Crosshair size={14} /> Test Drive The Tech
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Experience the Unfair Advantage</h2>
              <p className="text-lg text-slate-400 font-medium">Don't just take our word for it. Try the engines right here.</p>
            </div>

            <div className="bg-surface border border-surface-border rounded-3xl overflow-hidden shadow-2xl">
              {/* Tabs */}
              <div className="flex border-b border-surface-border bg-surface-card flex-col md:flex-row">
                <button onClick={() => setSandboxTab('ai')} className={`flex-1 py-4 text-sm font-bold transition-colors ${sandboxTab === 'ai' ? 'text-sky-400 border-b-2 border-sky-500 bg-surface' : 'text-slate-400 hover:text-white'}`}>
                  <Bot size={18} className="inline mr-2 mb-0.5"/> 24/7 AI CA Mentor
                </button>
                <button onClick={() => setSandboxTab('simulator')} className={`flex-1 py-4 text-sm font-bold transition-colors ${sandboxTab === 'simulator' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-surface' : 'text-slate-400 hover:text-white'}`}>
                  <Target size={18} className="inline mr-2 mb-0.5"/> ICAI 40/50 Passing Tester
                </button>
                <button onClick={() => setSandboxTab('timetable')} className={`flex-1 py-4 text-sm font-bold transition-colors ${sandboxTab === 'timetable' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-surface' : 'text-slate-400 hover:text-white'}`}>
                  <Calendar size={18} className="inline mr-2 mb-0.5"/> Adaptive Timetable Engine
                </button>
              </div>

              {/* Sandbox Content */}
              <div className="p-8 md:p-12 min-h-[420px] flex flex-col items-center justify-center relative">
                
                {/* 1. AI Mentor Tab */}
                {sandboxTab === 'ai' && (
                  <div className="w-full max-w-2xl flex flex-col h-full">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-6 px-2">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
                          <Bot size={16} className="text-sky-400" />
                        </div>
                        <div className="bg-surface-card border border-surface-border rounded-2xl rounded-tl-sm p-4 text-sm text-slate-300">
                          Hi! I'm your CA Study AI. Ask me to break down complex ICAI case laws, tax calculations, or accounting standards simply.
                        </div>
                      </div>
                      
                      {aiQuery && (
                        <>
                          <div className="flex gap-4 flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                              <Users size={16} className="text-indigo-400" />
                            </div>
                            <div className="bg-indigo-600 rounded-2xl rounded-tr-sm p-4 text-sm text-white font-medium">
                              {aiQuery.q}
                            </div>
                          </div>
                          
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
                              <Bot size={16} className="text-sky-400" />
                            </div>
                            <div className="bg-surface-card border border-sky-500/30 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-200 leading-relaxed shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                              <TypewriterText text={aiQuery.a} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {!aiQuery && (
                      <div className="grid sm:grid-cols-2 gap-3 mt-auto">
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
                          <button key={i} onClick={() => setAiQuery(q)} className="bg-surface border border-surface-border hover:border-sky-500/50 text-left p-3 rounded-xl text-sm font-semibold text-slate-300 transition-colors flex items-center justify-between group">
                            <span className="truncate pr-2">{q.q}</span>
                            <Send size={14} className="text-slate-500 group-hover:text-sky-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                    {aiQuery && (
                      <button onClick={() => setAiQuery(null)} className="mx-auto mt-4 text-sm text-slate-400 hover:text-white flex items-center gap-2">
                        <RotateCcw size={14} /> Try Another Question
                      </button>
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
                      <p className="text-xs text-slate-400 mt-2">
                        Drag the sliders below to test individual paper pass marks (min 40) and aggregate percentage (min 50%).
                      </p>
                    </div>

                    <div className="space-y-4 bg-surface-card p-6 rounded-2xl border border-surface-border mb-6">
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
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
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
                            <div className="text-xs text-slate-400 mt-0.5">
                              Total: <strong>{total}/300 ({pct}%)</strong> • {!hasFail && hasAgg ? 'Both 40-mark and 50% aggregate criteria met.' : hasFail ? 'Shortfall in one or more papers.' : `Needs ${150 - total} more marks to hit 50%.`}
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
                      <p className="text-xs text-slate-400 mt-2">
                        Tutovia dynamically fits 8 hours of effective revision around your coaching lectures and sleep habits.
                      </p>
                    </div>

                    <div className="space-y-2 bg-surface-card p-4 rounded-2xl border border-surface-border">
                      {[
                        { time: '07:00 AM – 09:30 AM', title: 'Deep Work: Advanced Accounting (AS 28)', type: 'Study', tag: 'High Focus' },
                        { time: '09:30 AM – 10:30 AM', title: 'Breakfast & Mindful Stretch Break', type: 'Break', tag: 'Rest' },
                        { time: '10:30 AM – 01:30 PM', title: 'Direct Tax Laws: Capital Gains & Deductions', type: 'Study', tag: 'Core Theory' },
                        { time: '02:00 PM – 05:00 PM', title: 'Live Coaching Lecture / Articleship Slot', type: 'Class', tag: 'Fixed Slot' },
                        { time: '06:00 PM – 08:30 PM', title: 'Corporate Laws: Share Capital & Debentures', type: 'Study', tag: 'Active Recall' },
                        { time: '09:00 PM – 10:00 PM', title: 'Daily Diagnostic MCQ Practice Quiz', type: 'Mock', tag: 'Diagnostic' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-surface border border-surface-border/60 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-indigo-400 font-bold">{item.time}</span>
                            <span className="font-semibold text-slate-200">{item.title}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.type === 'Study' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                            item.type === 'Mock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            item.type === 'Class' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-slate-800 text-slate-400'
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

        {/* 3. THE 3 CORE ENGINES */}
        <section className="py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">The 3 Proprietary Study Engines</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">We consolidated generic study tools into three incredibly powerful systems designed specifically to crack CA exams.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Engine 1 */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="bg-surface-card border border-surface-border rounded-3xl p-8 hover:border-sky-500/50 transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity"><Brain size={120} /></div>
                <div className="w-14 h-14 bg-sky-500/10 border border-sky-500/30 rounded-2xl flex items-center justify-center mb-8">
                  <BookOpen className="text-sky-400" size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Adaptive AI Syllabus Engine</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  Never wonder what chapter to revise next. Our engine maps the entire ICAI New Syllabus (Intermediate & Final), analyzes your quiz mistakes, and prioritizes high-weightage chapters automatically.
                </p>
                <div className="space-y-3 mt-auto border-t border-surface-border pt-6">
                  {['Full ICAI Syllabus Breakdown', '24/7 Context-Aware AI CA Tutor', 'Official ICAI PDF Study Links'].map((f,i)=><div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-300"><Check size={16} className="text-sky-400"/>{f}</div>)}
                </div>
              </motion.div>

              {/* Engine 2 */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="bg-surface-card border border-surface-border rounded-3xl p-8 hover:border-emerald-500/50 transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity"><Target size={120} /></div>
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-8">
                  <BarChart className="text-emerald-400" size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Predictive Exam Radar & Simulator</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  Most students fail because they ignore blind spots. Tutovia provides real-time diagnostic heatmaps and the official ICAI 40/50 aggregate simulator with Set-Off rules and 60+ exemption tracking.
                </p>
                <div className="space-y-3 mt-auto border-t border-surface-border pt-6">
                  {['Full-length CA Mock Exams', 'ICAI 40/50 Passing Simulator', 'Subject Mastery Radar Heatmaps'].map((f,i)=><div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-300"><Check size={16} className="text-emerald-400"/>{f}</div>)}
                </div>
              </motion.div>

              {/* Engine 3 */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                className="bg-surface-card border border-surface-border rounded-3xl p-8 hover:border-indigo-500/50 transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity"><Flame size={120} /></div>
                <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-8">
                  <Clock className="text-indigo-400" size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Zen Study Desk & Daily Rhythm</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  Eliminate distraction and screen glare. Enjoy a calming obsidian study sanctuary with synthesized noise generators (Brown noise, Rain, Alpha waves), adaptive 12-hour timetables, and calendar exports.
                </p>
                <div className="space-y-3 mt-auto border-t border-surface-border pt-6">
                  {['Distraction-Free Zen Desk', 'Adaptive 12-Hour Daily Timetable', 'RFC 5545 Calendar .ics Export'].map((f,i)=><div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-300"><Check size={16} className="text-indigo-400"/>{f}</div>)}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. THE MATH OF PASSING (Comparison) */}
        <section className="py-24 px-4 bg-surface border-y border-surface-border">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">The Math of Passing</h2>
              <p className="text-xl text-slate-400 font-medium">Why Tutovia students save 15+ hours a week and score higher.</p>
            </div>

            <div className="rounded-3xl border border-surface-border overflow-hidden shadow-2xl bg-surface-card">
              <div className="grid grid-cols-3 bg-surface p-6 border-b border-surface-border">
                <div className="font-bold text-slate-400 uppercase tracking-widest text-xs md:text-sm">Metric</div>
                <div className="font-black text-slate-500 text-center uppercase tracking-widest text-xs md:text-sm">Traditional Method</div>
                <div className="font-black text-indigo-400 text-center uppercase tracking-widest text-xs md:text-sm">With Tutovia</div>
              </div>
              
              {[
                { m: 'Revision Strategy', bad: 'Rereading 500-page books', good: 'Algorithmic active-recall cards' },
                { m: 'Memory After 14 Days', bad: 'Drops to ~20% (Forgetting Curve)', good: 'Maintained at 85%+ via SM-2' },
                { m: 'Time Wasted Planning', bad: '45 minutes every morning', good: '0 mins (Auto-generated agenda)' },
                { m: 'Exam Certainty', bad: '"Did I cover enough?" Anxiety', good: 'Quantifiable Readiness Index %' },
                { m: 'Doubt Resolution', bad: 'Waiting days for teachers', good: 'Instant AI Tutor breakdown' }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 p-6 border-b border-surface-border last:border-0 items-center hover:bg-surface/50 transition-colors">
                  <div className="font-bold text-white text-sm md:text-base">{row.m}</div>
                  <div className="text-center text-slate-400 text-sm md:text-base font-medium">{row.bad}</div>
                  <div className="text-center text-indigo-300 font-bold text-sm md:text-base flex items-center justify-center gap-2">
                    <Check size={18} className="text-emerald-500 hidden sm:block" /> {row.good}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. LIVE PULSE & SOCIAL PROOF */}
        <section className="py-24 px-4 overflow-hidden relative border-b border-surface-border bg-gradient-to-b from-surface to-background">
          <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">You Are Not Studying Alone</h2>
            <p className="text-xl text-slate-400 font-medium">Join thousands of serious aspirants climbing the ranks every day.</p>
          </div>
          
          <div className="flex gap-4 overflow-hidden whitespace-nowrap opacity-80" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="flex gap-4 shrink-0">
              {[
                { t: "Ankit M. reached Level 14 in Taxation", i: TrendingUp, c: "text-emerald-400" },
                { t: "Priya S. reviewed 120 flashcards today", i: Brain, c: "text-purple-400" },
                { t: "Rahul just cleared a tricky Ind AS-103 doubt", i: Bot, c: "text-indigo-400" },
                { t: "Sneha achieved a 30-day Focus Streak", i: Flame, c: "text-amber-400" },
                { t: "Arjun scored 82% in Final Mock Exam", i: Target, c: "text-sky-400" },
              ].map((item, idx) => (
                <div key={idx} className="bg-surface-card border border-surface-border rounded-full px-6 py-3 flex items-center gap-3">
                  <item.i size={18} className={item.c} />
                  <span className="text-slate-300 font-bold text-sm">{item.t}</span>
                </div>
              ))}
            </motion.div>
            <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="flex gap-4 shrink-0">
              {[
                { t: "Ankit M. reached Level 14 in Taxation", i: TrendingUp, c: "text-emerald-400" },
                { t: "Priya S. reviewed 120 flashcards today", i: Brain, c: "text-purple-400" },
                { t: "Rahul just cleared a tricky Ind AS-103 doubt", i: Bot, c: "text-indigo-400" },
                { t: "Sneha achieved a 30-day Focus Streak", i: Flame, c: "text-amber-400" },
                { t: "Arjun scored 82% in Final Mock Exam", i: Target, c: "text-sky-400" },
              ].map((item, idx) => (
                <div key={idx} className="bg-surface-card border border-surface-border rounded-full px-6 py-3 flex items-center gap-3">
                  <item.i size={18} className={item.c} />
                  <span className="text-slate-300 font-bold text-sm">{item.t}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 6. 60-SECOND ONBOARDING */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">From Sign Up to Day-1 Plan in 60 Seconds</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: "01", t: "Set Your Target", d: "Tell Tutovia your exam stage (Foundation/Inter/Final) and target attempt date." },
                { num: "02", t: "Log Your Availability", d: "Input your daily study hours. The Adaptive Planner calculates your required pace." },
                { num: "03", t: "Execute & Level Up", d: "Wake up to a high-yield daily agenda. Launch a Pomodoro timer and start crushing it." }
              ].map((step, i) => (
                <div key={i} className="relative p-8 border border-surface-border rounded-3xl bg-surface-card hover:border-indigo-500/30 transition-colors group">
                  <div className="text-6xl font-black text-surface-border mb-6 group-hover:text-indigo-500/20 transition-colors">{step.num}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.t}</h3>
                  <p className="text-slate-400 font-medium">{step.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FINAL CTA */}
        <section className="py-32 px-4 text-center border-t border-surface-border">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-emerald-900/20 border border-indigo-500/30 rounded-3xl p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-indigo-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                The exam date is fixed.<br />How you prepare isn't.
              </h2>
              <p className="text-xl text-indigo-200 mb-10 font-medium max-w-2xl mx-auto">
                Join ambitious students who replaced study stress with a predictable, AI-powered revision engine.
              </p>
              <button onClick={() => navigate('/login')} className="bg-white text-indigo-950 px-10 py-5 rounded-2xl text-xl font-black shadow-2xl shadow-white/10 hover:scale-105 transition-all">
                Start Free Today &bull; Instant Access
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-surface-border bg-surface py-10 text-slate-500 text-sm font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <GraduationCap className="text-indigo-400" size={18} />
            </div>
            <span className="font-bold text-white text-lg">Tutovia</span>
            <span>&copy; 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
