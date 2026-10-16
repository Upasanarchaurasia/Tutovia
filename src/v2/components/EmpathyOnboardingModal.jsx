import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, ArrowRight, ArrowLeft, GraduationCap, 
  Clock, ShieldAlert, Sparkles, BookOpen, Brain, 
  Award, Heart, Calendar, Flame
} from 'lucide-react';
import { TRACK_LIST, getActiveTrack, saveTrackId } from '../academicTracks.js';

export default function EmpathyOnboardingModal({ 
  isOpen, 
  onClose, 
  onComplete, 
  isDarkTheme = false 
}) {
  const [step, setStep] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState('ca_foundation');
  const [selectedPressures, setSelectedPressures] = useState(['coaching_clash']);
  const [studyPace, setStudyPace] = useState('evening_2h');
  const [targetAttempt, setTargetAttempt] = useState('May / June 2027');

  if (!isOpen) return null;

  const currentTrackConfig = getActiveTrack(selectedTrack);

  const togglePressure = (id) => {
    if (selectedPressures.includes(id)) {
      setSelectedPressures(selectedPressures.filter(p => p !== id));
    } else {
      setSelectedPressures([...selectedPressures, id]);
    }
  };

  const handleFinish = () => {
    saveTrackId(selectedTrack);
    
    // Save to tutovia_profile & tutovia_schedule
    const profileData = {
      academic_track: selectedTrack,
      track_name: currentTrackConfig.name,
      pressures: selectedPressures,
      study_pace: studyPace,
      target_attempt: targetAttempt,
      onboarded_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('tutovia_profile', JSON.stringify(profileData));
      localStorage.setItem('tutovia_onboarded', 'true');
    } catch {}

    if (onComplete) {
      onComplete(profileData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-2xl rounded-3xl border-2 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
            isDarkTheme 
              ? 'bg-[#0B1120] border-slate-800 text-slate-100' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className={`p-6 border-b flex items-start justify-between gap-4 ${
            isDarkTheme ? 'border-slate-800 bg-[#0F172A]' : 'border-slate-100 bg-slate-50'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  Step {step} of 3
                </span>
                <span className="text-xs opacity-60">"For Students, By Students"</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black tracking-tight">
                {step === 1 && "Choose Your Academic Track"}
                {step === 2 && "What Pressures Are You Balancing?"}
                {step === 3 && "Your Realistic Daily Study Rhythm"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors ${
                isDarkTheme ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex-1 overflow-y-auto">
            {/* Step 1: Track Selection */}
            {step === 1 && (
              <div className="space-y-3">
                <p className="text-xs opacity-70 mb-4">
                  Tutovia personalizes your study schedule, syllabus roadmaps, and AI tutor context based on where you are on your Commerce journey:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TRACK_LIST.map((t) => {
                    const isSelected = selectedTrack === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTrack(t.id)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-500/10 shadow-sm'
                            : isDarkTheme
                              ? 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">{t.category}</span>
                          {isSelected && <Check size={16} className="text-indigo-600" />}
                        </div>
                        <div className="font-bold text-sm tracking-tight mb-1">{t.name}</div>
                        <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">{t.tagline}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Empathetic Pressures */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-xs opacity-75 leading-relaxed">
                  Real life isn't an unbroken 12-hour schedule. Tell us what usually gets in the way so Tutovia builds dynamic delay buffers instead of guilt:
                </p>

                <div className="space-y-2.5">
                  {[
                    { id: 'coaching_clash', title: 'School / College & Coaching Timetable Clashes', desc: 'Running between physical lectures leaves zero energy for evening homework.' },
                    { id: 'articleship_delay', title: 'Articleship Office Overtime (+90m Late Audit)', desc: 'Audit calls run late, completely wrecking traditional fixed study timetables.' },
                    { id: 'preboards_term', title: 'School Pre-boards / Term Exam Backlogs', desc: 'Need focused 8-mark problem drills to secure internal marks without burning out.' },
                    { id: 'theory_exhaustion', title: 'Mental Fatigue & Law Section Overload', desc: 'Rereading the same dense legal provisions without retention.' },
                    { id: 'fear_of_failing', title: 'Exam Anxiety & Fear of Wasting an Attempt', desc: 'Overwhelmed by syllabus volume and constant fear of falling behind peers.' }
                  ].map((item) => {
                    const isChecked = selectedPressures.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => togglePressure(item.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'border-indigo-600 bg-indigo-500/10'
                            : isDarkTheme
                              ? 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                          isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-400'
                        }`}>
                          {isChecked && <Check size={12} />}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold tracking-tight">{item.title}</div>
                          <div className="text-[11px] opacity-75 mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Realistic Study Rhythm */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-xs opacity-75 leading-relaxed">
                  How much focused study time can you commit on typical weekdays without sacrificing essential sleep?
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: 'evening_2h', title: 'Protected 2 Hours (Late Evening Routine)', desc: 'Best for articleship trainees & students with heavy coaching. 2 focused blocks.' },
                    { id: 'split_4h', title: 'Balanced 4 Hours (Morning 1.5h + Evening 2.5h)', desc: 'Early concept building followed by evening computational drills.' },
                    { id: 'dedicated_6h', title: 'Dedicated 6–8 Hours (Exam Leave / Full-Time)', desc: 'Full 3-tier revision architecture (Concepts -> PYQs -> Mocks).' }
                  ].map((p) => {
                    const isSelected = studyPace === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setStudyPace(p.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-500/10'
                            : isDarkTheme
                              ? 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-400'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold tracking-tight">{p.title}</div>
                          <div className="text-[11px] opacity-75 mt-0.5">{p.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-1.5">
                    Target Exam / Attempt Window
                  </label>
                  <select
                    value={targetAttempt}
                    onChange={(e) => setTargetAttempt(e.target.value)}
                    className={`w-full p-3 rounded-xl border text-xs font-semibold focus:outline-none focus:border-indigo-500 ${
                      isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="May / June 2027">May / June 2027 (Upcoming Attempt)</option>
                    <option value="November / December 2027">November / December 2027</option>
                    <option value="February / March 2027 (Board Exams)">February / March 2027 (Board Exams)</option>
                    <option value="May 2028">May 2028 (Long-Term Mastery)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className={`p-4 border-t flex items-center justify-between gap-4 ${
            isDarkTheme ? 'border-slate-800 bg-[#0F172A]' : 'border-slate-100 bg-slate-50'
          }`}>
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                  isDarkTheme ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Sparkles size={14} />
                <span>Create My Empathetic Study Space</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
