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
  const [sandboxTab, setSandboxTab] = useState('flashcard');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardScheduled, setCardScheduled] = useState(false);
  const [aiQuery, setAiQuery] = useState(null);

  const handleCardSchedule = () => {
    setCardScheduled(true);
    setTimeout(() => {
      setCardFlipped(false);
      setCardScheduled(false);
    }, 2000);
  };

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
                <button onClick={() => setSandboxTab('flashcard')} className={`flex-1 py-4 text-sm font-bold transition-colors ${sandboxTab === 'flashcard' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-surface' : 'text-slate-400 hover:text-white'}`}>
                  <Brain size={18} className="inline mr-2 mb-0.5"/> Active Recall Simulator
                </button>
                <button onClick={() => setSandboxTab('ai')} className={`flex-1 py-4 text-sm font-bold transition-colors ${sandboxTab === 'ai' ? 'text-purple-400 border-b-2 border-purple-500 bg-surface' : 'text-slate-400 hover:text-white'}`}>
                  <Bot size={18} className="inline mr-2 mb-0.5"/> 24/7 AI Mentor
                </button>
              </div>

              {/* Sandbox Content */}
              <div className="p-8 md:p-12 min-h-[400px] flex flex-col items-center justify-center relative">
                
                {/* Flashcard Simulator */}
                {sandboxTab === 'flashcard' && (
                  <div className="w-full max-w-md perspective-1000">
                    <AnimatePresence mode="wait">
                      {cardScheduled ? (
                        <motion.div key="scheduled" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} 
                          className="absolute inset-0 flex flex-col items-center justify-center text-emerald-400">
                          <Check size={48} className="mb-4" />
                          <div className="text-xl font-black text-white">Knowledge Locked.</div>
                          <div className="text-sm font-medium mt-2">Next review algorithmically scheduled.</div>
                        </motion.div>
                      ) : (
                        <motion.div key="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
                          <div className="text-center mb-6 text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            <Layers size={16} /> Tap to flip card
                          </div>
                          <div className={`relative w-full aspect-[4/3] cursor-pointer preserve-3d transition-transform duration-500 ${cardFlipped ? 'rotate-y-180' : ''}`}
                            onClick={() => setCardFlipped(!cardFlipped)}>
                            
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg">
                              <span className="text-indigo-400 text-xs font-black uppercase mb-4 tracking-widest">Question</span>
                              <h3 className="text-2xl font-bold text-white leading-snug">What is the penalty for late filing under Section 234F?</h3>
                            </div>
                            
                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg">
                              <span className="text-purple-400 text-xs font-black uppercase mb-4 tracking-widest">Answer</span>
                              <h3 className="text-xl font-bold text-white leading-snug">Rs. 5,000 (if filed before Dec 31)<br/><br/>Rs. 10,000 (after Dec 31)</h3>
                            </div>
                          </div>

                          {/* Action Buttons (visible only when flipped) */}
                          <div className={`mt-8 flex justify-center gap-3 transition-opacity duration-300 ${cardFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <button onClick={(e) => { e.stopPropagation(); handleCardSchedule(); }} className="flex-1 bg-surface-card border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 py-3 rounded-xl text-sm font-bold transition-colors">
                              Again <span className="block text-[10px] text-rose-400/60 font-normal">in 1 day</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleCardSchedule(); }} className="flex-1 bg-surface-card border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 py-3 rounded-xl text-sm font-bold transition-colors">
                              Good <span className="block text-[10px] text-amber-400/60 font-normal">in 3 days</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleCardSchedule(); }} className="flex-1 bg-surface-card border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 py-3 rounded-xl text-sm font-bold transition-colors">
                              Easy <span className="block text-[10px] text-emerald-400/60 font-normal">in 7 days</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* AI Mentor Simulator */}
                {sandboxTab === 'ai' && (
                  <div className="w-full max-w-2xl flex flex-col h-full">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-6 px-2">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                          <Bot size={16} className="text-indigo-400" />
                        </div>
                        <div className="bg-surface-card border border-surface-border rounded-2xl rounded-tl-sm p-4 text-sm text-slate-300">
                          Hi! I'm your CA Study AI. Ask me to break down complex topics, solve problems, or explain concepts like a 5-year-old.
                        </div>
                      </div>
                      
                      {aiQuery && (
                        <>
                          <div className="flex gap-4 flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                              <Users size={16} className="text-purple-400" />
                            </div>
                            <div className="bg-purple-600 rounded-2xl rounded-tr-sm p-4 text-sm text-white font-medium">
                              {aiQuery.q}
                            </div>
                          </div>
                          
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                              <Bot size={16} className="text-indigo-400" />
                            </div>
                            <div className="bg-surface-card border border-indigo-500/30 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-200 leading-relaxed shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                              <TypewriterText text={aiQuery.a} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {!aiQuery && (
                      <div className="grid sm:grid-cols-2 gap-3 mt-auto">
                        {[
                          { q: "Explain Marginal Relief simply", a: "Marginal Relief ensures that the additional income tax payable on income exceeding a surcharge threshold (like Rs. 50 Lakhs) does not exceed the actual income earned above that threshold. It's like ensuring the tax penalty isn't bigger than the bonus itself!" },
                          { q: "Difference between AS-14 and Ind AS-103", a: "AS-14 treats Amalgamations as either 'Pooling of Interests' or 'Purchase Method'. Ind AS-103 ONLY uses the 'Acquisition Method'. Also, under Ind AS-103, Goodwill is tested for impairment annually, while AS-14 amortizes it over a period not exceeding 5 years." }
                        ].map((q, i) => (
                          <button key={i} onClick={() => setAiQuery(q)} className="bg-surface border border-surface-border hover:border-purple-500/50 text-left p-3 rounded-xl text-sm font-semibold text-slate-300 transition-colors flex items-center justify-between group">
                            <span className="truncate pr-2">{q.q}</span>
                            <Send size={14} className="text-slate-500 group-hover:text-purple-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                    {aiQuery && (
                      <button onClick={() => setAiQuery(null)} className="mx-auto mt-4 text-sm text-slate-400 hover:text-white flex items-center gap-2">
                        <RotateCcw size={14} /> Reset Demo
                      </button>
                    )}
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
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">The 3 Proprietary Engines</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">We consolidated generic study tools into three incredibly powerful systems designed specifically to crack exams.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Engine 1 */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="bg-surface-card border border-surface-border rounded-3xl p-8 hover:border-indigo-500/50 transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity"><Brain size={120} /></div>
                <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-8">
                  <Lock className="text-indigo-400" size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">The Memory Lock Engine</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  70% of what you read today is forgotten within 48 hours. Our SM-2 spaced-repetition algorithm calculates the precise hour before you forget a formula, serving flashcards at the scientifically optimal moment.
                </p>
                <div className="space-y-3 mt-auto border-t border-surface-border pt-6">
                  {['SM-2 Spaced Repetition Flashcards', 'Active Recall Chapter Notes', 'Dynamic Revision Scheduler'].map((f,i)=><div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-300"><Check size={16} className="text-indigo-500"/>{f}</div>)}
                </div>
              </motion.div>

              {/* Engine 2 */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="bg-surface-card border border-surface-border rounded-3xl p-8 hover:border-amber-500/50 transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity"><Target size={120} /></div>
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-8">
                  <BarChart className="text-amber-400" size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Predictive Exam Radar</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  Most students fail because they revise what they already like, ignoring blind spots. Tutovia's radar provides a real-time diagnostic heatmap highlighting exact topics that will pull your marks down.
                </p>
                <div className="space-y-3 mt-auto border-t border-surface-border pt-6">
                  {['Full-length CA Mock Exams', 'Subject Mastery Heatmaps', 'Predictive Readiness Score'].map((f,i)=><div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-300"><Check size={16} className="text-amber-500"/>{f}</div>)}
                </div>
              </motion.div>

              {/* Engine 3 */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                className="bg-surface-card border border-surface-border rounded-3xl p-8 hover:border-emerald-500/50 transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity"><Flame size={120} /></div>
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-8">
                  <Activity className="text-emerald-400" size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Deep-Work Catalyst</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  Eliminate procrastination. We bundle Pomodoro focus sprints with a dopamine-driven XP loop, daily streak protection, and a peer leaderboard that turns studying into a highly addictive daily habit.
                </p>
                <div className="space-y-3 mt-auto border-t border-surface-border pt-6">
                  {['Pomodoro Session Planner', 'XP Leveling & Badges', 'Live Peer Leaderboard'].map((f,i)=><div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-300"><Check size={16} className="text-emerald-500"/>{f}</div>)}
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
