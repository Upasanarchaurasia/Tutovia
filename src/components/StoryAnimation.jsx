import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookX, BatteryWarning,
  Bot, Sparkles,
  Layers, Lightbulb,
  Timer, Target,
  LineChart, Trophy,
  GraduationCap, Heart
} from 'lucide-react';

export function StoryAnimation() {
  const [phase, setPhase] = useState(0);

  // Loop through 6 phases every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 6);
    }, 6000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-center overflow-hidden bg-slate-900/80 rounded-3xl border border-surface-border shadow-2xl p-8 backdrop-blur-sm">
      
      <AnimatePresence mode="wait">
        
        {/* PHASE 0: THE STRUGGLE */}
        {phase === 0 && (
          <motion.div 
            key="struggle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center w-full max-w-md"
          >
            <div className="relative w-full aspect-square max-w-[300px] mb-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
              <img src="/story1.jpg" alt="Student struggling to study" className="w-full h-full object-cover" />
              <motion.div animate={{ y: [-10, 10, -10], rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -top-4 -left-4 text-slate-300 drop-shadow-xl bg-slate-800 p-2 rounded-full border border-slate-600">
                <BookX size={32} />
              </motion.div>
              <motion.div animate={{ x: [-15, 15, -15], rotate: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -bottom-4 -right-4 text-rose-500 drop-shadow-xl bg-slate-800 p-2 rounded-full border border-slate-600">
                <BatteryWarning size={32} />
              </motion.div>
            </div>
            
            <h3 className="text-2xl font-bold text-rose-400 mb-2">Overwhelmed & Stressed?</h3>
            <p className="text-slate-300">
              Endless chapters, running out of time, and feeling lost in the syllabus.
            </p>
          </motion.div>
        )}

        {/* PHASE 1: THE DISCOVERY (AI TUTOR) */}
        {phase === 1 && (
          <motion.div 
            key="discovery"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center w-full max-w-md"
          >
            <div className="relative w-full aspect-square max-w-[300px] mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/30 border border-indigo-500/50">
              <img src="/story2.jpg" alt="Student discovering AI tutor" className="w-full h-full object-cover" />
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -right-4 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] bg-slate-800 p-2 rounded-full border border-slate-600">
                <Sparkles size={32} />
              </motion.div>
              <motion.div animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -bottom-4 -left-4 bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-500/40 border border-indigo-400">
                <Bot size={32} className="text-white" />
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold text-indigo-400 mb-2">Meet Your AI Tutor</h3>
            <p className="text-slate-300">
              Instant answers, simplified concepts, and a personalized study path just for you.
            </p>
          </motion.div>
        )}

        {/* PHASE 2: AI FLASHCARDS */}
        {phase === 2 && (
          <motion.div 
            key="flashcards"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center w-full max-w-md"
          >
            <div className="relative w-full aspect-square max-w-[300px] mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/30 border border-sky-500/50">
              <img src="/story4.jpg" alt="Smart AI Flashcards" className="w-full h-full object-cover" />
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute -top-4 -right-4 text-amber-400 drop-shadow-xl bg-slate-800 p-2 rounded-full border border-slate-600">
                <Lightbulb size={32} />
              </motion.div>
              <motion.div animate={{ x: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -bottom-4 -left-4 text-sky-400 drop-shadow-xl bg-slate-800 p-2 rounded-full border border-slate-600">
                <Layers size={32} />
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold text-sky-400 mb-2">Smart Flashcards</h3>
            <p className="text-slate-300">
              Generate AI flashcards instantly and retain memory forever using Spaced Repetition.
            </p>
          </motion.div>
        )}

        {/* PHASE 3: POMODORO FOCUS */}
        {phase === 3 && (
          <motion.div 
            key="focus"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center w-full max-w-md"
          >
            <div className="relative w-full aspect-square max-w-[300px] mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/30 border border-orange-500/50">
              <img src="/story5.jpg" alt="Deep focus with Pomodoro timer" className="w-full h-full object-cover" />
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -top-4 -left-4 text-orange-400 drop-shadow-xl bg-slate-800 p-2 rounded-full border border-slate-600">
                <Timer size={32} />
              </motion.div>
              <motion.div animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -bottom-4 -right-4 text-rose-400 drop-shadow-xl bg-slate-800 p-2 rounded-full border border-slate-600">
                <Target size={32} />
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold text-orange-400 mb-2">Deep Focus Mode</h3>
            <p className="text-slate-300">
              Lock in with the built-in Pomodoro timer and eliminate all distractions.
            </p>
          </motion.div>
        )}

        {/* PHASE 4: GOAL TRACKER / ANALYTICS */}
        {phase === 4 && (
          <motion.div 
            key="analytics"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center w-full max-w-md"
          >
            <div className="relative w-full aspect-square max-w-[300px] mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-fuchsia-500/30 border border-fuchsia-500/50">
              <img src="/story7.jpg" alt="Analytics and Goal Tracker" className="w-full h-full object-cover" />
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -left-4 text-fuchsia-400 drop-shadow-xl bg-slate-800 p-2 rounded-full border border-slate-600">
                <LineChart size={32} />
              </motion.div>
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -bottom-4 -right-4 text-amber-400 drop-shadow-xl bg-slate-800 p-2 rounded-full border border-slate-600">
                <Trophy size={32} />
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold text-fuchsia-400 mb-2">Advanced Analytics</h3>
            <p className="text-slate-300">
              Track your daily goals, view progress charts, and conquer your milestones.
            </p>
          </motion.div>
        )}

        {/* PHASE 5: SUCCESS & PERSONAL GROWTH */}
        {phase === 5 && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center w-full max-w-md"
          >
            <div className="relative w-full aspect-square max-w-[300px] mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/30 border border-emerald-500/50">
              <img src="/story3.jpg" alt="Student enjoying balance and growth" className="w-full h-full object-cover" />
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -top-4 -left-4 text-emerald-400 drop-shadow-xl bg-slate-800 p-2 rounded-full border border-slate-600">
                <GraduationCap size={32} />
              </motion.div>
              <motion.div animate={{ scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -bottom-4 -right-4 text-rose-400 drop-shadow-xl bg-slate-800 p-2 rounded-full border border-slate-600">
                <Heart size={32} />
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Balance & Growth</h3>
            <p className="text-slate-300">
              Ace your exams while making time for mindfulness, hobbies, and personal development.
            </p>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Progress Dots */}
      <div className="absolute bottom-6 flex gap-3">
        {[0, 1, 2, 3, 4, 5].map((dot) => (
          <div 
            key={dot} 
            className={`h-2 rounded-full transition-all duration-500 ${phase === dot ? 'w-10 bg-indigo-500' : 'w-3 bg-slate-700'}`}
          />
        ))}
      </div>
    </div>
  );
}
