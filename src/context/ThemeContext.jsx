import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const PHASES = {
  morning: {
    id: 'morning',
    name: 'Morning',
    label: 'Fresh Start',
    timeLabel: '6 AM – 11 AM',
    icon: '☀️',
    greeting: 'Good morning ☀️',
    tagline: 'Ready to make today count?',
    subtext: "Let's build today's journey with fresh energy and clear direction.",
    encouragement: "Start with one high-impact chapter while your mind is completely fresh.",
    bg: '#FFF9EF',
    accent: '#F59E72',
    accentSoft: '#FFE7A3',
    textColor: '#283044',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300/40',
    quote: 'Every sunrise is an invitation to begin again with clarity.'
  },
  day: {
    id: 'day',
    name: 'Day',
    label: 'Focus Mode',
    timeLabel: '11 AM – 5 PM',
    icon: '🌤️',
    greeting: 'Good afternoon 🌤️',
    tagline: 'Deep focus & productive flow.',
    subtext: 'Time to master your core chapters, practice questions, and lock in concepts.',
    encouragement: "Protect your focus slot. 25 minutes of deep work beats hours of multitasking.",
    bg: '#F8FAFC',
    accent: '#6366F1',
    accentSoft: '#E0F2FE',
    textColor: '#1E293B',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-300/40',
    quote: 'One focused hour is worth four distracted ones. Keep your momentum.'
  },
  evening: {
    id: 'evening',
    name: 'Evening',
    label: 'Reflect & Recharge',
    timeLabel: '5 PM – 9 PM',
    icon: '🌇',
    greeting: 'Good evening 🌇',
    tagline: "You've come a long way today.",
    subtext: "You don't have to finish everything today. Let's focus on what matters most.",
    encouragement: "Celebrate the revision blocks you completed. Consistency compounds quietly.",
    bg: '#FFF5F0',
    accent: '#F4A58A',
    accentSoft: '#C4B5FD',
    textColor: '#3B3448',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300/40',
    quote: 'Progress is quiet. Honor the steps you took today.'
  },
  night: {
    id: 'night',
    name: 'Night',
    label: 'Wind Down',
    timeLabel: '9 PM – 6 AM',
    icon: '🌙',
    greeting: 'Good night 🌙',
    tagline: "You've done enough for today.",
    subtext: 'Sleep well. Rest is part of the syllabus — we will continue tomorrow ✨',
    encouragement: "Close your study tabs. Deep sleep consolidates what you learned into long-term memory.",
    bg: '#13121F',
    accent: '#DDD6FE',
    accentSoft: '#BFDBFE',
    textColor: '#F4F3FA',
    badgeBg: 'bg-purple-950/60 text-purple-200 border-purple-400/20',
    quote: 'Rest restores memory. A fresh mind is your greatest exam asset.'
  }
};

export function getTimePhase(hour = new Date().getHours()) {
  if (hour >= 6 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export const ThemeProvider = ({ children }) => {
  // Stored mode: 'auto' or a specific phase 'morning' | 'day' | 'evening' | 'night'
  const [phaseMode, setPhaseMode] = useState(() => {
    return localStorage.getItem('tutovia_journey_mode') || 'auto';
  });

  const [activePhase, setActivePhase] = useState(() => {
    const saved = localStorage.getItem('tutovia_journey_mode') || 'auto';
    return saved === 'auto' ? getTimePhase() : saved;
  });

  // Backward-compatible theme property ('dark' for night, 'light' for morning/day/evening)
  const theme = activePhase === 'night' ? 'dark' : 'light';

  // Apply classes and CSS variables whenever activePhase changes
  useEffect(() => {
    const root = window.document.documentElement;
    // Remove all old phase classes
    root.classList.remove('phase-morning', 'phase-day', 'phase-evening', 'phase-night', 'light', 'dark');

    // Add current phase class
    root.classList.add(`phase-${activePhase}`);

    // Set light/dark for standard CSS backward compatibility
    if (activePhase === 'night') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }

    localStorage.setItem('tutovia_journey_mode', phaseMode);
    localStorage.setItem('tutovia_theme', activePhase === 'night' ? 'dark' : 'light');
  }, [activePhase, phaseMode]);

  // Keep time phase in sync if mode is 'auto'
  useEffect(() => {
    if (phaseMode !== 'auto') {
      setActivePhase(phaseMode);
      return;
    }

    const checkTime = () => {
      const computed = getTimePhase();
      setActivePhase(computed);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [phaseMode]);

  // Select phase function
  const selectPhase = (phaseId) => {
    if (phaseId === 'auto') {
      setPhaseMode('auto');
      setActivePhase(getTimePhase());
    } else if (PHASES[phaseId]) {
      setPhaseMode(phaseId);
      setActivePhase(phaseId);
    }
  };

  // Backward compatible toggleTheme
  const toggleTheme = () => {
    if (activePhase === 'night') {
      selectPhase('day');
    } else {
      selectPhase('night');
    }
  };

  const currentPhaseInfo = PHASES[activePhase] || PHASES.day;

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      activePhase,
      phaseMode,
      selectPhase,
      isAuto: phaseMode === 'auto',
      currentPhaseInfo,
      PHASES
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
