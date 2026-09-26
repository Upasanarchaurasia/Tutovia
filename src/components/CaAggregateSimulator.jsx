import React, { useState, useEffect } from 'react';
import { 
  Calculator, Award, AlertCircle, CheckCircle2, ChevronRight, 
  Sparkles, RotateCcw, TrendingUp, Star, ShieldCheck, Target, 
  HelpCircle, BookmarkCheck
} from 'lucide-react';

const INTER_PAPERS = {
  g1: [
    { id: 'p1', code: 'Paper 1', name: 'Advanced Accounting', defaultMarks: 55, group: 1 },
    { id: 'p2', code: 'Paper 2', name: 'Corporate and Other Laws', defaultMarks: 50, group: 1 },
    { id: 'p3', code: 'Paper 3', name: 'Taxation (DT & GST)', defaultMarks: 50, group: 1 }
  ],
  g2: [
    { id: 'p4', code: 'Paper 4', name: 'Cost and Management Accounting', defaultMarks: 55, group: 2 },
    { id: 'p5', code: 'Paper 5', name: 'Auditing and Ethics', defaultMarks: 48, group: 2 },
    { id: 'p6', code: 'Paper 6', name: 'FM & Strategic Management', defaultMarks: 52, group: 2 }
  ]
};

const STRATEGY_PRESETS = [
  {
    title: 'Balanced Pass (50s)',
    desc: 'Even focus across all subjects to safely hit 50%',
    marks: { p1: 52, p2: 50, p3: 50, p4: 52, p5: 50, p6: 50 }
  },
  {
    title: 'Exemption Anchor (70+ in Practical)',
    desc: 'Max out Paper 1 & Paper 4 to cushion Law and Audit',
    marks: { p1: 72, p2: 44, p3: 42, p4: 70, p5: 42, p6: 46 }
  },
  {
    title: 'Both Groups Set-Off Cushion',
    desc: 'Surplus in Group 1 offsets a tight Group 2 to clear 300 aggregate',
    marks: { p1: 68, p2: 55, p3: 52, p4: 45, p5: 42, p6: 44 }
  },
  {
    title: 'Rank / Distinction Target (70%+)',
    desc: 'Aim for 420+ marks across both groups',
    marks: { p1: 75, p2: 68, p3: 65, p4: 74, p5: 66, p6: 72 }
  }
];

export default function CaAggregateSimulator({ defaultGroup = 'Both Groups' }) {
  const [selectedGroup, setSelectedGroup] = useState(() => {
    if (defaultGroup === 'Group 1') return 'g1';
    if (defaultGroup === 'Group 2') return 'g2';
    return 'both';
  });

  const [marks, setMarks] = useState(() => {
    const saved = localStorage.getItem('tutovia_sim_marks');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return { p1: 55, p2: 50, p3: 50, p4: 55, p5: 48, p6: 52 };
  });

  const [savedFeedback, setSavedFeedback] = useState(false);

  // Active papers based on group selection
  const activePapers = selectedGroup === 'g1' 
    ? INTER_PAPERS.g1 
    : selectedGroup === 'g2' 
      ? INTER_PAPERS.g2 
      : [...INTER_PAPERS.g1, ...INTER_PAPERS.g2];

  const handleMarkChange = (paperId, val) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setMarks(prev => ({ ...prev, [paperId]: num }));
  };

  const applyPreset = (presetMarks) => {
    setMarks(prev => ({ ...prev, ...presetMarks }));
  };

  const handleSaveMarks = () => {
    localStorage.setItem('tutovia_sim_marks', JSON.stringify(marks));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleReset = () => {
    setMarks({ p1: 50, p2: 50, p3: 50, p4: 50, p5: 50, p6: 50 });
  };

  // Calculations
  const g1Papers = INTER_PAPERS.g1;
  const g2Papers = INTER_PAPERS.g2;

  const g1Total = g1Papers.reduce((sum, p) => sum + (marks[p.id] || 0), 0);
  const g2Total = g2Papers.reduce((sum, p) => sum + (marks[p.id] || 0), 0);

  const totalPossible = activePapers.length * 100;
  const totalScored = selectedGroup === 'g1' ? g1Total : selectedGroup === 'g2' ? g2Total : (g1Total + g2Total);
  const overallPercentage = ((totalScored / totalPossible) * 100).toFixed(1);
  const targetRequired = totalPossible * 0.5; // 50% aggregate

  // Individual paper fails (< 40)
  const failedPapers = activePapers.filter(p => (marks[p.id] || 0) < 40);
  
  // Exemptions (>= 60)
  const exemptions = activePapers.filter(p => (marks[p.id] || 0) >= 60);

  // Group 1 & Group 2 individual check
  const g1HasFail = g1Papers.some(p => (marks[p.id] || 0) < 40);
  const g2HasFail = g2Papers.some(p => (marks[p.id] || 0) < 40);

  // Determine Final Verdict
  let status = 'pass'; // 'pass' | 'distinction' | 'setoff' | 'aggregate_deficit' | 'paper_fail'
  let verdictTitle = '';
  let verdictDesc = '';
  let verdictColor = '';

  if (failedPapers.length > 0) {
    status = 'paper_fail';
    verdictTitle = 'Paper Shortfall (< 40 Marks)';
    verdictDesc = `ICAI requires a minimum of 40 marks in every single paper. You need more marks in: ${failedPapers.map(p => `${p.code} (${marks[p.id] || 0})`).join(', ')}.`;
    verdictColor = 'rose';
  } else if (totalScored < targetRequired) {
    status = 'aggregate_deficit';
    const deficit = targetRequired - totalScored;
    verdictTitle = `Aggregate Deficit (-${deficit} Marks)`;
    verdictDesc = `All papers cleared individual 40 mark criteria, but aggregate is ${overallPercentage}%. You need ${deficit} more mark${deficit > 1 ? 's' : ''} to reach 50% (${targetRequired}/${totalPossible}).`;
    verdictColor = 'amber';
  } else {
    // Both individual and aggregate criteria met!
    if (selectedGroup === 'both') {
      const g1Pass = !g1HasFail && g1Total >= 150;
      const g2Pass = !g2HasFail && g2Total >= 150;

      if (!g1Pass || !g2Pass) {
        status = 'setoff';
        const surplusGroup = g1Total >= 150 ? 'Group 1' : 'Group 2';
        const deficitGroup = g1Total >= 150 ? 'Group 2' : 'Group 1';
        verdictTitle = 'Passed via ICAI Set-Off Rule! ⚖️';
        verdictDesc = `Eligible for Set-off! Surplus marks in ${surplusGroup} compensated for ${deficitGroup} (Total ${totalScored}/600 >= 300). Both Groups cleared together!`;
        verdictColor = 'emerald';
      } else if (parseFloat(overallPercentage) >= 70) {
        status = 'distinction';
        verdictTitle = 'Passed with Distinction! 🏆';
        verdictDesc = `Sensational! ${totalScored}/600 (${overallPercentage}%). You are in top percentile CA Rank zone!`;
        verdictColor = 'emerald';
      } else {
        status = 'pass';
        verdictTitle = 'Both Groups Cleared! 🎉';
        verdictDesc = `Group 1 (${g1Total}/300) and Group 2 (${g2Total}/300) both cleared standard 50% benchmarks independently. Total: ${totalScored}/600.`;
        verdictColor = 'emerald';
      }
    } else {
      if (parseFloat(overallPercentage) >= 70) {
        status = 'distinction';
        verdictTitle = 'Passed with Distinction! 🏆';
        verdictDesc = `${totalScored}/${totalPossible} (${overallPercentage}%). Solid foundation for Rank holder merit list!`;
        verdictColor = 'emerald';
      } else {
        status = 'pass';
        verdictTitle = 'Group Cleared Successfully! 🎉';
        verdictDesc = `Cleared all individual papers (>= 40) and comfortably hit ${overallPercentage}% aggregate (>= 150/300).`;
        verdictColor = 'emerald';
      }
    }
  }

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/20 shadow-xl relative overflow-hidden">
      
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-5 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-bold mb-2">
            <Calculator className="w-3.5 h-3.5 text-sky-400" />
            <span>Official ICAI 40/50 Passing Algorithm</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            CA Passing & Aggregate Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Simulate your target marks, verify the individual 40-mark threshold, 50% aggregate rules, and 60+ paper exemptions.
          </p>
        </div>

        {/* Group Selector Pill */}
        <div className="flex items-center p-1 rounded-2xl bg-surface-card border border-surface-border">
          <button
            onClick={() => setSelectedGroup('g1')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGroup === 'g1' 
                ? 'bg-sky-500 text-black shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Group 1 (3 Papers)
          </button>
          <button
            onClick={() => setSelectedGroup('g2')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGroup === 'g2' 
                ? 'bg-sky-500 text-black shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Group 2 (3 Papers)
          </button>
          <button
            onClick={() => setSelectedGroup('both')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGroup === 'both' 
                ? 'bg-sky-500 text-black shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Both Groups (Set-Off)
          </button>
        </div>
      </div>

      {/* STRATEGY PRESETS PILLS */}
      <div className="mb-6">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          ⚡ Quick Strategy Benchmarks:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {STRATEGY_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset.marks)}
              className="p-2.5 rounded-xl bg-surface-card/60 hover:bg-surface-card border border-surface-border hover:border-sky-500/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  {preset.title}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN SIMULATOR GRID: Paper Inputs on Left, Verdict Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Paper Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {activePapers.map((paper) => {
              const mark = marks[paper.id] || 0;
              const isExempt = mark >= 60;
              const isFail = mark < 40;

              return (
                <div 
                  key={paper.id}
                  className={`p-4 rounded-2xl bg-surface-card border transition-all ${
                    isFail 
                      ? 'border-rose-500/30 bg-rose-500/5' 
                      : isExempt 
                        ? 'border-amber-500/30 bg-amber-500/5' 
                        : 'border-surface-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                          {paper.code}
                        </span>
                        {isExempt && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            <Star className="w-3 h-3 fill-amber-300" /> 60+ Exemption
                          </span>
                        )}
                        {isFail && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                            Shortfall (&lt;40)
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{paper.name}</h4>
                    </div>

                    {/* Numeric Input */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={mark}
                        onChange={(e) => handleMarkChange(paper.id, e.target.value)}
                        className={`w-16 text-center font-mono font-bold text-base py-1 rounded-xl bg-surface border focus:outline-none ${
                          isFail 
                            ? 'text-rose-400 border-rose-500/50' 
                            : isExempt 
                              ? 'text-amber-300 border-amber-500/50' 
                              : 'text-white border-surface-border focus:border-sky-500'
                        }`}
                      />
                      <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={mark}
                      onChange={(e) => handleMarkChange(paper.id, e.target.value)}
                      className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                        isFail 
                          ? 'bg-rose-950 accent-rose-500' 
                          : isExempt 
                            ? 'bg-amber-950 accent-amber-400' 
                            : 'bg-slate-800 accent-sky-400'
                      }`}
                    />
                    <span className="text-[11px] font-mono text-slate-400 w-8 text-right font-semibold">
                      {mark}m
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to 50s</span>
            </button>
            <button
              onClick={handleSaveMarks}
              className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold border border-sky-500/30 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{savedFeedback ? 'Saved to Profile! ✓' : 'Save Target Marks'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Real-time Verdict Card & Analytics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Verdict Box */}
          <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${
            verdictColor === 'emerald'
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : verdictColor === 'amber'
                ? 'bg-amber-950/20 border-amber-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
          }`}>
            
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                verdictColor === 'emerald'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : verdictColor === 'amber'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                Simulator Result
              </span>

              <div className="text-right">
                <span className="text-2xl font-black text-white font-mono leading-none">
                  {totalScored}
                </span>
                <span className="text-xs text-slate-400 font-mono"> / {totalPossible}</span>
              </div>
            </div>

            <h3 className={`text-xl font-black mb-2 flex items-center gap-2 ${
              verdictColor === 'emerald' ? 'text-emerald-300' : verdictColor === 'amber' ? 'text-amber-300' : 'text-rose-400'
            }`}>
              {verdictColor === 'emerald' && <CheckCircle2 className="w-6 h-6 shrink-0" />}
              {verdictColor === 'amber' && <AlertCircle className="w-6 h-6 shrink-0" />}
              {verdictColor === 'rose' && <AlertCircle className="w-6 h-6 shrink-0" />}
              <span>{verdictTitle}</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              {verdictDesc}
            </p>

            {/* Progress Bar towards 50% Aggregate */}
            <div className="space-y-1.5 border-t border-slate-800/80 pt-4">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Aggregate Percentage</span>
                <span className={`font-mono font-bold ${parseFloat(overallPercentage) >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {overallPercentage}% / 50.0% Pass
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    parseFloat(overallPercentage) >= 50 
                      ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' 
                      : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                  }`}
                  style={{ width: `${Math.min(100, (totalScored / totalPossible) * 100)}%` }}
                />
              </div>
            </div>

            {/* Group 1 & Group 2 Split (when Both Groups selected) */}
            {selectedGroup === 'both' && (
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-card border border-surface-border">
                  <span className="text-[10px] text-slate-400 block font-semibold">Group 1 Total</span>
                  <span className={`font-bold font-mono text-sm ${g1Total >= 150 && !g1HasFail ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {g1Total} / 300
                  </span>
                  <span className="text-[10px] block text-slate-500 mt-0.5">
                    {g1Total >= 150 ? '✅ 50% Met' : `Short by ${150 - g1Total}`}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-card border border-surface-border">
                  <span className="text-[10px] text-slate-400 block font-semibold">Group 2 Total</span>
                  <span className={`font-bold font-mono text-sm ${g2Total >= 150 && !g2HasFail ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {g2Total} / 300
                  </span>
                  <span className="text-[10px] block text-slate-500 mt-0.5">
                    {g2Total >= 150 ? '✅ 50% Met' : `Short by ${150 - g2Total}`}
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Exemptions Roster Box */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Exemptions Secured (&ge;60 Marks)</span>
            </h4>
            {exemptions.length > 0 ? (
              <div className="space-y-2">
                {exemptions.map(ex => (
                  <div key={ex.id} className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                    <span className="font-semibold text-amber-200">{ex.code}: {ex.name}</span>
                    <span className="font-mono font-bold text-amber-300">{marks[ex.id]} Marks ⭐</span>
                  </div>
                ))}
                <p className="text-[10px] text-slate-400 mt-1">
                  Exemptions carry forward automatically for the subsequent 3 exam attempts under ICAI regulations.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Score 60+ marks in any paper to secure an official ICAI exemption.
              </p>
            )}
          </div>

          {/* Golden Rules Explainer */}
          <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20">
            <h5 className="text-[11px] font-bold text-sky-400 flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> ICAI Golden Passing Rules
            </h5>
            <ul className="text-[11px] text-slate-300 space-y-1 list-disc pl-4">
              <li><strong>Min 40%</strong> in each individual subject.</li>
              <li><strong>Min 50% Aggregate</strong> across all papers of the group.</li>
              <li><strong>Set-Off Benefit:</strong> If appearing for both groups together, surplus marks in one group offset a deficit in the other group, provided each paper has &ge; 40!</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
