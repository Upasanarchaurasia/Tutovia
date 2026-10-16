import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Compass, Brain, Clock, Target, Heart, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useTheme } from '../ThemeContextV2.jsx';
import { V2_THEMES } from '../themes.js';

export default function AuthCarousel() {
  const { activePhase } = useTheme();
  const currentTheme = V2_THEMES[activePhase] || V2_THEMES.eclipse;
  const isDarkTheme = activePhase === 'twilight' || activePhase === 'eclipse';
  const shouldReduceMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const manualPauseTimerRef = useRef(null);

  const baseUrl = import.meta.env.BASE_URL || '/';

  const slides = [
    {
      id: 'direction',
      badge: 'Personalized Daily Direction',
      icon: Compass,
      headline: 'Never wonder where to start your day.',
      description: 'Tutovia maps the entire ICAI syllabus against your exam attempt date, serving one clear, high-yield study block every morning.',
      image: `${baseUrl}story2.jpg`,
      alt: 'Student planning study goals with AI mentor',
      accentColor: 'text-amber-500',
      badgeColor: 'bg-amber-500/10 border-amber-500/25 text-amber-500'
    },
    {
      id: 'doubt-solving',
      badge: 'Judgment-Free Mentorship',
      icon: Brain,
      headline: 'Ask any question without hesitation.',
      description: 'First-principles conversational explanations break down complex standards and provisions using intuitive real-world analogies.',
      image: `${baseUrl}story4.jpg`,
      alt: 'Student exploring interactive flashcards and concepts',
      accentColor: 'text-indigo-400',
      badgeColor: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400'
    },
    {
      id: 'rescheduling',
      badge: 'Adaptive Schedule Recovery',
      icon: Clock,
      headline: 'Articleship running late? Zero backlog guilt.',
      description: 'When coaching or office hours overrun, Tutovia dynamically recalculates your evening blocks so you never feel hopelessly behind.',
      image: `${baseUrl}story5.jpg`,
      alt: 'Student focusing with timed study blocks',
      accentColor: 'text-sky-400',
      badgeColor: 'bg-sky-500/10 border-sky-500/25 text-sky-400'
    },
    {
      id: 'consistency',
      badge: 'Sustainable Study Habits',
      icon: Target,
      headline: 'Consistent compounding beats 14-hour crashes.',
      description: 'Calibrated around 25-minute Pomodoro sprints and milestone streaks that protect focus, build confidence, and prevent fatigue.',
      image: `${baseUrl}story7.jpg`,
      alt: 'Visual progress charts and milestone analytics',
      accentColor: 'text-emerald-400',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
    },
    {
      id: 'recovery',
      badge: 'Stamina & Burnout Protection',
      icon: Heart,
      headline: 'Restorative sleep is part of the syllabus.',
      description: 'Nightly wind-downs, anxiety grounding, and calm tomorrow blueprints ensure your mind powers down for real cognitive restoration.',
      image: `${baseUrl}story3.jpg`,
      alt: 'Student finding calm balance and confidence',
      accentColor: 'text-rose-400',
      badgeColor: 'bg-rose-500/10 border-rose-500/25 text-rose-400'
    }
  ];

  // Auto-advance every 7 seconds, paused on hover/focus/manual interaction or reduced motion
  useEffect(() => {
    if (shouldReduceMotion || isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, shouldReduceMotion, slides.length]);

  const handleManualAction = (callback) => {
    callback();
    setIsPaused(true);
    if (manualPauseTimerRef.current) clearTimeout(manualPauseTimerRef.current);
    manualPauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 9000);
  };

  const handlePrev = () => {
    handleManualAction(() => {
      setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    });
  };

  const handleNext = () => {
    handleManualAction(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    });
  };

  const currentSlide = slides[activeIndex];
  const SlideIcon = currentSlide.icon;

  return (
    <div 
      className={`hidden lg:flex flex-col justify-between w-full max-w-lg lg:h-[680px] rounded-3xl border-2 p-5 sm:p-6 transition-colors duration-400 shadow-2xl relative overflow-hidden backdrop-blur-xl shrink-0 select-none ${
        isDarkTheme 
          ? 'bg-[#0B1120]/80 border-slate-700/60 text-slate-100 shadow-slate-950/40' 
          : 'bg-white/80 border-slate-200/80 text-slate-900 shadow-indigo-950/5'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-label="Tutovia Study Highlights Companion"
    >
      {/* 1. Top Row: Category Badge on left, Previous/Next controls on right */}
      <div className="flex items-center justify-between z-10 shrink-0 h-8">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wide transition-colors duration-300 ${currentSlide.badgeColor}`}>
          <SlideIcon size={14} className="shrink-0" />
          <span>{currentSlide.badge}</span>
        </span>

        {/* Accessible Navigation Controls */}
        <div className="flex items-center gap-1.5" aria-label="Carousel navigation">
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className={`p-1.5 rounded-full border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer ${
              isDarkTheme 
                ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200' 
                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className={`p-1.5 rounded-full border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer ${
              isDarkTheme 
                ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200' 
                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 2 & 3. Main Center Content: Enlarged Image Frame + Fixed-Height Caption */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-2 overflow-hidden w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.32, ease: 'easeOut' }}
            className="flex flex-col items-center text-center w-full"
          >
            {/* 2. Main Visual: Prominent Image Frame (clamp(340px, 30vw, 410px), 1:1 aspect ratio) */}
            <div 
              className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl shrink-0 bg-slate-900/10 mx-auto"
              style={{
                width: 'clamp(340px, 30vw, 410px)',
                height: 'clamp(340px, 30vw, 410px)'
              }}
            >
              <img 
                src={currentSlide.image} 
                alt={currentSlide.alt} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* 3. Caption: Heading & Description directly below image with fixed height */}
            <div className="w-full max-w-[420px] mx-auto mt-3.5 shrink-0 text-center flex flex-col justify-center h-[68px] overflow-hidden px-1">
              <h3 className={`text-base sm:text-lg font-heading font-black tracking-tight mb-1 truncate ${currentTheme.h2}`}>
                {currentSlide.headline}
              </h3>
              <p className={`text-xs leading-relaxed line-clamp-2 max-w-sm mx-auto ${currentTheme.bodyText}`}>
                {currentSlide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. Footer: Slide indicators and slide count anchored consistently at bottom */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-500/20 z-10 shrink-0 h-8">
        <div className="flex items-center gap-2" role="tablist" aria-label="Slide indicators">
          {slides.map((slide, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={slide.id}
                onClick={() => handleManualAction(() => setActiveIndex(idx))}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}: ${slide.badge}`}
                className={`h-2 rounded-full transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer ${
                  isActive 
                    ? 'w-8 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm' 
                    : isDarkTheme 
                      ? 'w-2.5 bg-slate-700 hover:bg-slate-600' 
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>

        <span className={`text-[11px] font-mono font-medium ${currentTheme.subText}`}>
          0{activeIndex + 1} / 0{slides.length}
        </span>
      </div>
    </div>
  );
}
