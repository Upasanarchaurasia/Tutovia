import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Flag, Layers, Award, Sparkles, 
  ArrowRight, ShieldCheck, Clock, BookOpen, FileText, Zap
} from 'lucide-react';

const DEFAULT_MILESTONES = {
  phase1: [
    { id: 'p1_1', text: 'Finish 100% ICAI Study Material Illustrations & Exercise', done: true },
    { id: 'p1_2', text: 'Prepare handwritten formula sheets & section digests', done: true },
    { id: 'p1_3', text: 'Mark LDR (Last Day Revision) tricky questions', done: false },
    { id: 'p1_4', text: 'First conceptual revision of Accounting Standards & Laws', done: false }
  ],
  phase2: [
    { id: 'p2_1', text: 'Solve current term official ICAI RTP (Revision Test Paper)', done: false },
    { id: 'p2_2', text: 'Attempt 2 full-syllabus MTPs in strict 3-hour exam conditions', done: false },
    { id: 'p2_3', text: 'Review past 5 years PYQ trends and exam patterns', done: false },
    { id: 'p2_4', text: 'Eliminate topic blind spots identified by Tutovia radar', done: false }
  ],
  phase3: [
    { id: 'p3_1', text: 'Review only pre-marked LDR questions in the 1.5-day gap', done: false },
    { id: 'p3_2', text: 'Standard on Auditing (SA) & Section Number fast recall drill', done: false },
    { id: 'p3_3', text: 'Direct Tax & GST amendment digest quick skim', done: false },
    { id: 'p3_4', text: 'Final mind conditioning & 15-minute reading strategy rehearsal', done: false }
  ]
};

export default function StudyMilestoneTimeline() {
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem('tutovia_study_milestones');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_MILESTONES;
  });

  useEffect(() => {
    localStorage.setItem('tutovia_study_milestones', JSON.stringify(milestones));
  }, [milestones]);

  const toggleTask = (phase, id) => {
    setMilestones(prev => ({
      ...prev,
      [phase]: prev[phase].map(item => 
        item.id === id ? { ...item, done: !item.done } : item
      )
    }));
  };

  const getPhaseStats = (phaseKey) => {
    const list = milestones[phaseKey] || [];
    const completed = list.filter(i => i.done).length;
    const total = list.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, pct };
  };

  const p1 = getPhaseStats('phase1');
  const p2 = getPhaseStats('phase2');
  const p3 = getPhaseStats('phase3');

  const allCompleted = p1.completed + p2.completed + p3.completed;
  const allTotal = p1.total + p2.total + p3.total;
  const overallPct = Math.round((allCompleted / allTotal) * 100);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-2">
            <Flag className="w-3.5 h-3.5 text-indigo-400" />
            <span>3-Phase Preparation Roadmap</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Strategic Exam Milestone Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            The proven 3-phase journey from conceptual mastery to 1.5-day exam marathon.
          </p>
        </div>

        {/* Global Readiness Gauge */}
        <div className="flex items-center gap-3 bg-surface-card px-4 py-2.5 rounded-2xl border border-surface-border">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Overall Progress</span>
            <span className="text-lg font-black text-white font-mono">{overallPct}% Ready</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
            {allCompleted}/{allTotal}
          </div>
        </div>
      </div>

      {/* 3 PHASES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Phase 1 */}
        <div className="p-5 rounded-2xl bg-surface-card/60 border border-surface-border flex flex-col justify-between hover:border-sky-500/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Phase 1 • Days 1–90
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">{p1.pct}%</span>
            </div>
            
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Conceptual Mastery</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              ICAI modules, back questions & handwritten summary sheets.
            </p>

            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-sky-400 rounded-full transition-all duration-300" style={{ width: `${p1.pct}%` }} />
            </div>

            <div className="space-y-2.5">
              {milestones.phase1.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask('phase1', task.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 transition-all ${
                    task.done 
                      ? 'bg-sky-500/10 border-sky-500/30 text-slate-200' 
                      : 'bg-surface border-surface-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <button className="mt-0.5 shrink-0">
                    {task.done ? (
                      <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                  <span className={`leading-snug ${task.done ? 'line-through text-slate-400' : ''}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Phase 2 */}
        <div className="p-5 rounded-2xl bg-surface-card/60 border border-surface-border flex flex-col justify-between hover:border-indigo-500/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Phase 2 • Days 91–135
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">{p2.pct}%</span>
            </div>
            
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>RTP & MTP Speed Drills</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Revision test papers, 3-hour full mocks & error rectification.
            </p>

            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${p2.pct}%` }} />
            </div>

            <div className="space-y-2.5">
              {milestones.phase2.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask('phase2', task.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 transition-all ${
                    task.done 
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-slate-200' 
                      : 'bg-surface border-surface-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <button className="mt-0.5 shrink-0">
                    {task.done ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                  <span className={`leading-snug ${task.done ? 'line-through text-slate-400' : ''}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Phase 3 */}
        <div className="p-5 rounded-2xl bg-surface-card/60 border border-surface-border flex flex-col justify-between hover:border-emerald-500/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Phase 3 • Final 15 Days
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">{p3.pct}%</span>
            </div>
            
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>1.5-Day Exam Marathon</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              LDR questions only, auditing standards & quick recall flash notes.
            </p>

            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${p3.pct}%` }} />
            </div>

            <div className="space-y-2.5">
              {milestones.phase3.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask('phase3', task.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 transition-all ${
                    task.done 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200' 
                      : 'bg-surface border-surface-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <button className="mt-0.5 shrink-0">
                    {task.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                  <span className={`leading-snug ${task.done ? 'line-through text-slate-400' : ''}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
