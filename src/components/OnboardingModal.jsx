import React, { useState } from 'react';
import { Sparkles, Target, Calendar, Clock, BookOpen, Check, GraduationCap, Trophy, Laptop, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { CA_STAGES } from '../data/syllabusData.js';

const STAGE_ICONS = {
  foundation: GraduationCap,
  intermediate: BookOpen,
  ittc: Laptop,
  final: Trophy
};

const STAGE_COLORS = {
  foundation: 'emerald',
  intermediate: 'indigo',
  ittc: 'cyan',
  final: 'amber'
};

const colorClasses = {
  emerald: { active: 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-emerald-500/10', inactive: 'bg-surface-card border-surface-border text-slate-400 hover:border-emerald-400/40' },
  indigo:  { active: 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-indigo-500/10',   inactive: 'bg-surface-card border-surface-border text-slate-400 hover:border-indigo-400/40' },
  cyan:    { active: 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-cyan-500/10',           inactive: 'bg-surface-card border-surface-border text-slate-400 hover:border-cyan-400/40' },
  amber:   { active: 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-amber-500/10',       inactive: 'bg-surface-card border-surface-border text-slate-400 hover:border-amber-400/40' }
};

export default function OnboardingModal({ isOpen, onClose }) {
  const { completeOnboarding, user } = useAuth();

  // Step 1 — CA Stage
  const [step, setStep] = useState(1);
  const [caStage, setCaStage] = useState('intermediate');

  // Step 2 — Group / Scheme / Attempt / Score / Hours
  const [caGroup, setCaGroup] = useState('Both Groups');
  const [attempt, setAttempt] = useState('September 2026');
  const [targetScore, setTargetScore] = useState('60%');
  const [studyHours, setStudyHours] = useState(8);
  const [wakeTime, setWakeTime] = useState('06:30');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const selectedStage = CA_STAGES.find(s => s.id === caStage);
  const showGroupSelector = caStage === 'intermediate' || caStage === 'final';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await completeOnboarding({
        ca_stage: caStage,
        ca_group: showGroupSelector ? caGroup : null,
        attempt,
        target_score: targetScore,
        daily_study_hours: parseInt(studyHours, 10),
        wake_time: wakeTime,
        sleep_time: sleepTime,
        commitments: '09:00 - 13:00 College / Articleship'
      });
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to save onboarding:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-surface border border-surface-border w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-surface-border bg-surface-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Welcome, {user?.name || 'Student'}!</h2>
            <p className="text-xs text-indigo-300">
              {step === 1 ? 'Step 1 of 2 — Select your CA Stage' : 'Step 2 of 2 — Personalize your study plan'}
            </p>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-700'}`} />
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-700'}`} />
          </div>
        </div>

        {/* Step 1: CA Stage Selection */}
        {step === 1 && (
          <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-400" /> Which stage of CA are you preparing for?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CA_STAGES.map(stage => {
                  const Icon = STAGE_ICONS[stage.id];
                  const colorKey = STAGE_COLORS[stage.id];
                  const colors = colorClasses[colorKey];
                  const isSelected = caStage === stage.id;
                  return (
                    <button
                      type="button"
                      key={stage.id}
                      onClick={() => setCaStage(stage.id)}
                      className={`p-4 rounded-2xl border text-left transition-all shadow-md ${isSelected ? colors.active : colors.inactive}`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xl">{stage.emoji}</span>
                        <span className="font-bold text-sm">{stage.label}</span>
                        {isSelected && <Check className="w-4 h-4 ml-auto" />}
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-80">{stage.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Study Plan Customization */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            {/* CA Group (only for Inter & Final) */}
            {showGroupSelector && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Target {selectedStage?.label} Group
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Group 1', 'Group 2', 'Both Groups'].map(group => (
                    <button
                      type="button"
                      key={group}
                      onClick={() => setCaGroup(group)}
                      className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all ${
                        caGroup === group
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/10'
                          : 'bg-surface-card border-surface-border text-slate-400 hover:border-indigo-400/40'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Attempt & Score */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Target Attempt
                </label>
                <select
                  value={attempt}
                  onChange={(e) => setAttempt(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option>September 2025</option>
                  <option>January 2026</option>
                  <option>May 2026</option>
                  <option>September 2026</option>
                  <option>January 2027</option>
                  <option>May 2027</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-400" /> Target Score Goal
                </label>
                <select
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="50%">50% (Clear the Exam)</option>
                  <option value="60%">60% (Exemption in Key Papers)</option>
                  <option value="70%">70% (All-India Ranker Goal)</option>
                </select>
              </div>
            </div>

            {/* Daily Study Goal */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" /> Target Daily Study Hours
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[4, 6, 8, 10, 12].map(hrs => (
                  <button
                    type="button"
                    key={hrs}
                    onClick={() => setStudyHours(hrs)}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                      studyHours === hrs
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                        : 'bg-surface-card border-surface-border text-slate-400 hover:border-indigo-400/40'
                    }`}
                  >
                    {hrs} hrs
                  </button>
                ))}
              </div>
            </div>

            {/* Wake / Sleep */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Wake-up Time</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Sleep Time</label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl border border-surface-border text-slate-400 hover:text-white text-sm font-semibold transition-all"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Check className="w-5 h-5" /> Launch My Personalized Study Plan</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
