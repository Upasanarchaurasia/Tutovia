import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, BookOpen, ChevronRight, CheckCircle2, Sparkles, 
  ArrowUpRight, ArrowRight, Layers, GraduationCap, Compass,
  Lightbulb, Clock, Check
} from 'lucide-react';
import { ACADEMIC_TRACKS, TRACK_LIST, getActiveTrack } from '../academicTracks.js';

export default function UnifiedSubjectHubModal({ 
  isOpen, 
  onClose, 
  currentTrackId, 
  onSwitchTrack, 
  isDarkTheme = false 
}) {
  const [selectedTrackId, setSelectedTrackId] = useState(currentTrackId || 'ca_foundation');
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);

  if (!isOpen) return null;

  const currentTrack = getActiveTrack(selectedTrackId);
  const subjects = currentTrack.subjects || [];
  const activeSubject = subjects[selectedSubjectIndex] || subjects[0];
  const nextTrack = currentTrack.nextStepPreview?.targetId ? ACADEMIC_TRACKS[currentTrack.nextStepPreview.targetId] : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-4xl rounded-3xl border-2 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDarkTheme 
              ? 'bg-[#0B1120] border-slate-800 text-slate-100' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className={`p-6 border-b flex items-start justify-between gap-4 ${
            isDarkTheme ? 'border-slate-800 bg-[#0F172A]/80' : 'border-slate-100 bg-slate-50/80'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Unified Subject Hub
                </span>
                <span className="text-xs opacity-60">"For Students, By Students"</span>
              </div>
              <h2 className="text-2xl font-heading font-black tracking-tight">
                Curriculum Journey & Progression Bridge
              </h2>
              <p className="text-xs sm:text-sm opacity-70 mt-1 max-w-2xl">
                Explore your active syllabus modules while previewing how foundational concepts expand into the next stage of your professional journey.
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-2xl border transition-colors ${
                isDarkTheme ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Academic Track Switcher Pills */}
          <div className={`px-6 py-3 border-b flex items-center gap-2 overflow-x-auto scrollbar-none ${
            isDarkTheme ? 'border-slate-800/80 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider opacity-60 shrink-0 mr-1">Stage:</span>
            {TRACK_LIST.map((track) => {
              const isSelected = selectedTrackId === track.id;
              const isUserTrack = currentTrackId === track.id;

              return (
                <button
                  key={track.id}
                  onClick={() => {
                    setSelectedTrackId(track.id);
                    setSelectedSubjectIndex(0);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : isDarkTheme
                        ? 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{track.shortName}</span>
                  {isUserTrack && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">Current</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Subject List */}
            <div className="md:col-span-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 px-1">
                Core Subjects ({subjects.length})
              </div>
              {subjects.map((sub, idx) => {
                const isActive = selectedSubjectIndex === idx;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-2 ${
                      isActive
                        ? isDarkTheme
                          ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm'
                          : 'bg-indigo-50/80 border-indigo-400 text-indigo-950 shadow-sm'
                        : isDarkTheme
                          ? 'border-slate-800/80 bg-slate-900/30 text-slate-300 hover:bg-slate-800/50'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm tracking-tight">{sub.name}</div>
                      <div className="text-[11px] opacity-70 mt-0.5 line-clamp-1">{sub.highlight}</div>
                    </div>
                    <ChevronRight size={16} className={`shrink-0 mt-0.5 transition-transform ${isActive ? 'translate-x-0.5 text-indigo-500' : 'opacity-40'}`} />
                  </button>
                );
              })}

              {/* Action to switch user's primary track */}
              {selectedTrackId !== currentTrackId && onSwitchTrack && (
                <div className="pt-3">
                  <button
                    onClick={() => {
                      onSwitchTrack(selectedTrackId);
                      onClose();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Check size={14} />
                    <span>Set {currentTrack.shortName} as My Track</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Topic Syllabus & Bridge Explorer */}
            <div className="md:col-span-8 flex flex-col gap-4">
              {activeSubject && (
                <div className={`p-5 rounded-2xl border ${
                  isDarkTheme ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <BookOpen size={16} className="text-indigo-500" />
                      <span>{activeSubject.name}</span>
                    </h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      High-Yield Focus
                    </span>
                  </div>

                  <p className="text-xs opacity-75 mb-4">
                    Key chapters mapped for comprehensive concept mastery and step-by-step problem solving:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeSubject.topics.map((topic, i) => (
                      <div 
                        key={i}
                        className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                          isDarkTheme ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200'
                        }`}
                      >
                        <CheckCircle2 size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                        <span className="font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Step Journey Bridge */}
              {currentTrack.nextStepPreview && (
                <div className={`p-5 rounded-2xl border relative overflow-hidden ${
                  isDarkTheme 
                    ? 'bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border-indigo-500/30' 
                    : 'bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-white border-indigo-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-300">
                      {currentTrack.nextStepPreview.title}
                    </h4>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed mb-3">
                    {currentTrack.nextStepPreview.teaser}
                  </p>
                  {nextTrack && (
                    <button
                      onClick={() => {
                        setSelectedTrackId(nextTrack.id);
                        setSelectedSubjectIndex(0);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>Preview {nextTrack.shortName} Syllabus</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t flex items-center justify-between gap-4 ${
            isDarkTheme ? 'border-slate-800 bg-[#0F172A]/50' : 'border-slate-100 bg-slate-50'
          }`}>
            <span className="text-xs opacity-60 font-medium">
              Active track: <strong>{currentTrack.name}</strong>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
