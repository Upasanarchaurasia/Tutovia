import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GraduationCap, ArrowLeft, Sunrise, Sun, Sunset, Moon, Sparkles, ChevronDown } from 'lucide-react';
import { useTheme } from '../ThemeContextV2.jsx';
import { V2_THEMES } from '../themes.js';
import AuthCarousel from './AuthCarousel.jsx';

export default function AuthLayout({ children, activeTitle, showCarousel = true }) {
  const { activePhase, selectPhase, currentPhaseInfo, isAuto } = useTheme();
  const currentTheme = V2_THEMES[activePhase] || V2_THEMES.eclipse;
  const isDarkTheme = activePhase === 'twilight' || activePhase === 'eclipse';
  const shouldReduceMotion = useReducedMotion();

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-500 ${currentTheme.pageBg}`}
      style={{ backgroundImage: currentTheme.pageGradient }}
    >
      {/* Refined Ambient Background Animation (Theme-adaptive, slow imperceptible drift) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={
            shouldReduceMotion
              ? { scale: 1, opacity: 0.35 }
              : { 
                  x: [0, 16, -10, 0],
                  y: [0, -12, 10, 0],
                  scale: [1, 1.05, 0.98, 1],
                  opacity: [0.30, 0.42, 0.32, 0.30] 
                }
          } 
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-8%] left-[8%] w-[680px] h-[680px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
          style={{ background: currentTheme.ambient1 }}
        />
        <motion.div 
          animate={
            shouldReduceMotion
              ? { scale: 1, opacity: 0.30 }
              : { 
                  x: [0, -14, 12, 0],
                  y: [0, 14, -8, 0],
                  scale: [1, 0.98, 1.05, 1],
                  opacity: [0.25, 0.38, 0.28, 0.25] 
                }
          } 
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-[-8%] right-[8%] w-[780px] h-[780px] rounded-full blur-[160px] pointer-events-none transition-all duration-1000"
          style={{ background: currentTheme.ambient2 }}
        />
      </div>

      {/* Top Bar with entrance animation */}
      <header className={`w-full border-b py-3 px-4 sm:px-8 transition-colors duration-500 z-30 ${currentTheme.navBg}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo linked to V2 Home with subtle fade-and-rise */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg p-1"
              title="Return to Tutovia V2 Homepage"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105 text-white ${currentTheme.logoIcon} shrink-0`}>
                <GraduationCap size={18} />
              </div>
              <span className={`text-lg font-heading font-black tracking-tight leading-none ${currentTheme.logoText}`}>
                Tutovia
              </span>
            </Link>
          </motion.div>

          {/* Right Actions: Back to Tutovia link + Theme Selector */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors hover:bg-slate-500/10 ${currentTheme.subText} hover:opacity-100 focus-visible:ring-2 focus-visible:ring-indigo-400`}
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back to Tutovia</span>
              <span className="sm:hidden">Back</span>
            </Link>

            {/* Compact Theme Control */}
            <div className="relative shrink-0" ref={themeMenuRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                aria-expanded={themeMenuOpen}
                aria-label="Theme selector"
                title={`Current theme: ${currentPhaseInfo.name}${isAuto ? ' (Auto time-based)' : ' (Manual)'}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-sm cursor-pointer whitespace-nowrap ${
                  isDarkTheme 
                    ? 'bg-[#0F172A] text-white border-slate-700 hover:bg-[#1E293B]' 
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isAuto ? (
                  <Sparkles size={12} className="text-amber-500 shrink-0" />
                ) : (
                  activePhase === 'aurora' ? <Sunrise size={12} className="text-amber-500 shrink-0" /> :
                  activePhase === 'lumen' ? <Sun size={12} className="text-blue-500 shrink-0" /> :
                  activePhase === 'twilight' ? <Sunset size={12} className="text-pink-500 shrink-0" /> :
                  <Moon size={12} className="text-indigo-400 shrink-0" />
                )}
                <span className="font-bold text-[11px] hidden md:inline">
                  {isAuto ? `${currentPhaseInfo.name} · Auto` : currentPhaseInfo.name}
                </span>
                <ChevronDown size={11} className={`opacity-80 transition-transform duration-200 shrink-0 ${themeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Compact Dropdown Menu */}
              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-60 rounded-2xl border-2 p-2.5 shadow-2xl z-50 ${
                      isDarkTheme 
                        ? 'bg-[#0B1120] border-slate-700 text-slate-50 shadow-black/90' 
                        : 'bg-white border-slate-300 text-slate-900 shadow-slate-900/25'
                    }`}
                  >
                    <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Atmosphere
                    </div>

                    <button
                      onClick={() => { selectPhase('auto'); setThemeMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all mb-1 border ${
                        isAuto 
                          ? currentTheme.activeThemePill 
                          : isDarkTheme ? 'hover:bg-slate-800 border-transparent text-slate-200' : 'hover:bg-slate-100 border-transparent text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={13} className="text-amber-500" />
                        <span>Auto (Follows time)</span>
                      </div>
                      {isAuto && <span className="text-[10px] uppercase font-black">Active</span>}
                    </button>

                    <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-500/20">
                      {[
                        { id: 'aurora', name: 'Aurora', icon: Sunrise, time: 'Morning' },
                        { id: 'lumen', name: 'Lumen', icon: Sun, time: 'Day' },
                        { id: 'twilight', name: 'Twilight', icon: Sunset, time: 'Evening' },
                        { id: 'eclipse', name: 'Eclipse', icon: Moon, time: 'Night' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { selectPhase(item.id); setThemeMenuOpen(false); }}
                          className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium transition-all border ${
                            !isAuto && activePhase === item.id 
                              ? currentTheme.activeThemePill 
                              : isDarkTheme ? 'hover:bg-slate-800/80 border-transparent text-slate-300' : 'hover:bg-slate-100 border-transparent text-slate-700'
                          }`}
                        >
                          <item.icon size={13} />
                          <span className="font-semibold">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </header>

      {/* Main Responsive Grid Layout (Desktop: Side-by-Side Companion + Form Card | Mobile: Centered Form Card) */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10 w-full max-w-7xl mx-auto">
        <div className={`w-full max-w-6xl mx-auto ${showCarousel ? 'grid lg:grid-cols-12 gap-8 lg:gap-12 items-center' : 'flex justify-center'}`}>
          
          {/* Desktop Companion Panel (V1 Carousel modernized into V2 design system) */}
          {showCarousel && (
            <div className="hidden lg:flex lg:col-span-6 xl:col-span-6 w-full h-full items-center justify-center">
              <AuthCarousel />
            </div>
          )}

          {/* Form Card Column */}
          <div className={`w-full ${showCarousel ? 'lg:col-span-6 xl:col-span-6' : 'max-w-lg'} flex justify-center`}>
            {children}
          </div>
        </div>
      </main>

      {/* Footer Trust Note */}
      <footer className="w-full py-4 px-4 text-center text-xs opacity-70 z-10">
        <p className={currentTheme.subText}>
          Tutovia &bull; Built for focused, judgment-free CA preparation.
        </p>
      </footer>
    </div>
  );
}
