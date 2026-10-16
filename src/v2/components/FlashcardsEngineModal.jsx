import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Layers, RotateCcw, ChevronLeft, ChevronRight, 
  CheckCircle2, Sparkles, Award, HelpCircle, BookOpen,
  Filter
} from 'lucide-react';
import { ACADEMIC_TRACKS, TRACK_LIST, getActiveTrack } from '../academicTracks.js';

export default function FlashcardsEngineModal({ 
  isOpen, 
  onClose, 
  currentTrackId = 'ca_foundation', 
  isDarkTheme = false 
}) {
  const [selectedTrackId, setSelectedTrackId] = useState(currentTrackId);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState({});

  const storageKey = 'tutovia_v2_flashcards_progress';

  // Load progress
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setProgress(JSON.parse(stored));
    } catch {}
  }, []);

  const track = getActiveTrack(selectedTrackId);
  const cards = track.flashcards || [];
  const currentCard = cards[cardIndex] || cards[0];

  const handleRateCard = (rating) => {
    if (!currentCard) return;
    const updated = {
      ...progress,
      [currentCard.id]: {
        rating, // 'again' | 'hard' | 'good' | 'mastered'
        updatedAt: new Date().toISOString()
      }
    };
    setProgress(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    // Move to next card
    setIsFlipped(false);
    if (cardIndex < cards.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCardIndex((cardIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCardIndex((cardIndex - 1 + cards.length) % cards.length);
  };

  if (!isOpen) return null;

  const currentStatus = currentCard && progress[currentCard.id]?.rating;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-2xl rounded-3xl border-2 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDarkTheme 
              ? 'bg-[#0B1120] border-slate-800 text-slate-100' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className={`p-5 border-b flex items-center justify-between gap-4 ${
            isDarkTheme ? 'border-slate-800 bg-[#0F172A]' : 'border-slate-100 bg-slate-50'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg tracking-tight">
                  Spaced Repetition Flashcards
                </h3>
                <p className="text-[11px] opacity-70">
                  Formulas, legal sections, and accounting rules recall
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors ${
                isDarkTheme ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Track Switcher */}
          <div className={`px-5 py-2.5 border-b flex items-center gap-2 overflow-x-auto scrollbar-none ${
            isDarkTheme ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/50'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 shrink-0">Stage:</span>
            {TRACK_LIST.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTrackId(t.id);
                  setCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedTrackId === t.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDarkTheme
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.shortName}
              </button>
            ))}
          </div>

          {/* Card Body */}
          <div className="p-6 flex-1 flex flex-col items-center justify-center">
            {currentCard ? (
              <div className="w-full max-w-lg">
                {/* Meta info */}
                <div className="flex items-center justify-between text-xs font-semibold mb-3 px-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-bold">
                    {currentCard.topic}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>Card {cardIndex + 1} of {cards.length}</span>
                    {currentStatus && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black ${
                        currentStatus === 'mastered' ? 'bg-emerald-500/10 text-emerald-500' :
                        currentStatus === 'good' ? 'bg-blue-500/10 text-blue-500' :
                        currentStatus === 'hard' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {currentStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* Flip Card Container */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`w-full min-h-[220px] rounded-3xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between select-none shadow-lg relative group ${
                    isDarkTheme
                      ? 'bg-slate-900 border-slate-700 hover:border-indigo-500 text-slate-100'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-400 text-slate-900 shadow-slate-100'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase tracking-wider opacity-60 flex items-center justify-between">
                    <span>{isFlipped ? 'Answer & Core Insight' : 'Question / Concept'}</span>
                    <span className="group-hover:text-indigo-500 transition-colors">Click card to flip ↺</span>
                  </div>

                  <div className="py-4 text-center">
                    <p className="text-base sm:text-lg font-bold leading-relaxed">
                      {isFlipped ? currentCard.answer : currentCard.question}
                    </p>
                  </div>

                  <div className="text-center text-[11px] opacity-60 font-medium">
                    {isFlipped ? 'Tap to see question' : 'Tap to reveal answer'}
                  </div>
                </div>

                {/* Spaced Repetition Rating Buttons (when flipped) */}
                {isFlipped ? (
                  <div className="mt-5 grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleRateCard('again')}
                      className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold transition-all"
                    >
                      Again (0d)
                    </button>
                    <button
                      onClick={() => handleRateCard('hard')}
                      className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold transition-all"
                    >
                      Hard (1d)
                    </button>
                    <button
                      onClick={() => handleRateCard('good')}
                      className="py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 text-xs font-bold transition-all"
                    >
                      Good (3d)
                    </button>
                    <button
                      onClick={() => handleRateCard('mastered')}
                      className="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-bold transition-all"
                    >
                      Mastered (7d)
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      onClick={handlePrev}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                        isDarkTheme ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <ChevronLeft size={16} />
                      <span>Previous</span>
                    </button>

                    <button
                      onClick={() => setIsFlipped(true)}
                      className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      Show Answer
                    </button>

                    <button
                      onClick={handleNext}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                        isDarkTheme ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs opacity-60">No flashcards found for this track.</p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
