import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

/**
 * Centralized configuration for the 4-mode automatic time-based theme system.
 * Time ranges are defined in local device 24-hour time:
 * - MORNING: 05:00 AM – 10:59 AM (minutes: 300 to 659)
 * - DAY:     11:00 AM – 04:59 PM (minutes: 660 to 1019)
 * - EVENING: 05:00 PM – 07:59 PM (minutes: 1020 to 1199)
 * - NIGHT:   08:00 PM – 04:59 AM (minutes: 1200 to 1439, and 0 to 299)
 */
export const TIME_THEME_CONFIG = {
  morning: {
    id: 'morning',
    name: 'Morning',
    label: 'Fresh Start',
    timeLabel: '05:00 AM – 10:59 AM',
    startHour: 5,
    startMinute: 0,
    endHour: 10,
    endMinute: 59,
    startMinutes: 5 * 60, // 300
    endMinutes: 10 * 60 + 59, // 659
    icon: '🌅',
    greeting: 'Good morning 🌅',
    tagline: 'Fresh sunrise & mindful momentum.',
    subtext: "Let's build today's CA study milestones with fresh energy and clear direction.",
    encouragement: 'Start with one high-impact chapter while your mind is completely fresh.',
    quote: 'Every sunrise is an invitation to begin again with clarity.',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300/40',
    accent: '#E06D38',
    accentSoft: '#FDE6D2',
    textColor: '#2B2338',
    description: 'Fresh, warm, positive & motivating daylight tones.'
  },
  day: {
    id: 'day',
    name: 'Day',
    label: 'Focus Mode',
    timeLabel: '11:00 AM – 04:59 PM',
    startHour: 11,
    startMinute: 0,
    endHour: 16,
    endMinute: 59,
    startMinutes: 11 * 60, // 660
    endMinutes: 16 * 60 + 59, // 1019
    icon: '☀️',
    greeting: 'Good afternoon ☀️',
    tagline: 'Deep focus & productive flow.',
    subtext: 'Time to master your core chapters, practice questions, and lock in concepts.',
    encouragement: 'Protect your focus slot. 25 minutes of deep work beats hours of multitasking.',
    quote: 'One focused hour is worth four distracted ones. Keep your momentum.',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-300/40',
    accent: '#4F46E5',
    accentSoft: '#EEF2FF',
    textColor: '#0F172A',
    description: 'Crisp, bright, high-readability productivity environment.'
  },
  evening: {
    id: 'evening',
    name: 'Evening',
    label: 'Reflect & Recharge',
    timeLabel: '05:00 PM – 07:59 PM',
    startHour: 17,
    startMinute: 0,
    endHour: 19,
    endMinute: 59,
    startMinutes: 17 * 60, // 1020
    endMinutes: 19 * 60 + 59, // 1199
    icon: '🌇',
    greeting: 'Good evening 🌇',
    tagline: "You've come a long way today.",
    subtext: "You don't have to finish everything today. Let's consolidate what matters most.",
    encouragement: 'Celebrate the revision blocks you completed. Consistency compounds quietly.',
    quote: 'Progress is quiet. Honor the steps you took today.',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300/40',
    accent: '#D96041',
    accentSoft: '#FCE8E2',
    textColor: '#2C2237',
    description: 'Sunset-inspired, warm, relaxing & reflective tones.'
  },
  night: {
    id: 'night',
    name: 'Night',
    label: 'Wind Down',
    timeLabel: '08:00 PM – 04:59 AM',
    startHour: 20,
    startMinute: 0,
    endHour: 4,
    endMinute: 59,
    startMinutes: 20 * 60, // 1200
    endMinutes: 4 * 60 + 59, // 299 (next day morning cutoff)
    icon: '🌙',
    greeting: 'Good night 🌙',
    tagline: 'Calm evening & restorative study.',
    subtext: 'Rest is part of the syllabus — sleep consolidates memory for exam success ✨',
    encouragement: 'Close high-stress tabs. Deep review or restful sleep will consolidate memory.',
    quote: 'Rest restores memory. A fresh mind is your greatest exam asset.',
    badgeBg: 'bg-purple-950/60 text-purple-200 border-purple-400/20',
    accent: '#818CF8',
    accentSoft: 'rgba(129, 140, 248, 0.18)',
    textColor: '#F1F5F9',
    description: 'Eye-friendly, anti-glare, deep soft dark surfaces.'
  }
};

// Backward-compatible alias
export const PHASES = TIME_THEME_CONFIG;

/**
 * Calculates active time phase from local device/browser time.
 * Supports passing an optional Date object for testing/simulation.
 */
export function getTimePhase(date = new Date()) {
  const minutes = date.getHours() * 60 + date.getMinutes();

  // 05:00 AM – 10:59 AM
  if (minutes >= 300 && minutes <= 659) {
    return 'morning';
  }
  // 11:00 AM – 04:59 PM
  if (minutes >= 660 && minutes <= 1019) {
    return 'day';
  }
  // 05:00 PM – 07:59 PM
  if (minutes >= 1020 && minutes <= 1199) {
    return 'evening';
  }
  // 08:00 PM – 04:59 AM
  return 'night';
}

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Theme preference: 'auto' | 'light' | 'dark'
  const [themePreference, setThemePreferenceState] = useState(() => {
    return localStorage.getItem('tutovia_theme_preference') || 'auto';
  });

  // Optional manual phase preview/override (e.g. user clicking a specific preview phase)
  const [manualPhaseOverride, setManualPhaseOverride] = useState(() => {
    const savedJourney = localStorage.getItem('tutovia_journey_mode');
    if (savedJourney && ['morning', 'day', 'evening', 'night'].includes(savedJourney)) {
      return savedJourney;
    }
    return null;
  });

  // Calculate the effective active phase based on preference, time, or override
  const calculateEffectivePhase = (pref, override) => {
    if (pref === 'dark') {
      return 'night';
    }
    if (pref === 'light') {
      // In Light mode, keep on Day or current daytime phase, never Night
      if (override && ['morning', 'day', 'evening'].includes(override)) {
        return override;
      }
      const timePhase = getTimePhase();
      return timePhase === 'night' ? 'day' : timePhase;
    }
    // Auto mode
    if (override && ['morning', 'day', 'evening', 'night'].includes(override)) {
      return override;
    }
    return getTimePhase();
  };

  const [activePhase, setActivePhase] = useState(() => {
    const savedPref = localStorage.getItem('tutovia_theme_preference') || 'auto';
    const savedJourney = localStorage.getItem('tutovia_journey_mode');
    const override = (savedJourney && ['morning', 'day', 'evening', 'night'].includes(savedJourney)) ? savedJourney : null;
    return calculateEffectivePhase(savedPref, override);
  });

  // Update root element classes, attributes and CSS variables whenever activePhase changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all old phase and theme classes
    root.classList.remove('phase-morning', 'phase-day', 'phase-evening', 'phase-night', 'light', 'dark');

    // Add current phase class
    root.classList.add(`phase-${activePhase}`);

    // Set standard light/dark class for system and Tailwind compatibility
    const isDark = activePhase === 'night';
    root.classList.add(isDark ? 'dark' : 'light');

    // Data attributes for targeted CSS styling
    root.setAttribute('data-theme-preference', themePreference);
    root.setAttribute('data-time-phase', activePhase);

    // Save to localStorage for instant hydration on page refresh
    localStorage.setItem('tutovia_theme_preference', themePreference);
    localStorage.setItem('tutovia_theme', isDark ? 'dark' : 'light');
    localStorage.setItem('tutovia_journey_mode', manualPhaseOverride || (themePreference === 'auto' ? 'auto' : activePhase));
  }, [activePhase, themePreference, manualPhaseOverride]);

  // Real-time automatic checking mechanism:
  // Detects when the time passes a boundary (e.g. 10:59 AM -> 11:00 AM) without requiring a reload.
  useEffect(() => {
    // If user locked preference into Light or Dark without auto, or has a temporary override, don't auto-flip unless auto is active
    if (themePreference !== 'auto' || manualPhaseOverride !== null) {
      return;
    }

    const checkTime = () => {
      const computed = getTimePhase();
      setActivePhase((prev) => (prev !== computed ? computed : prev));
    };

    // Immediate check
    checkTime();

    // Check periodically (every 20 seconds is extremely lightweight and ensures boundary transitions within seconds)
    const interval = setInterval(checkTime, 20000);
    return () => clearInterval(interval);
  }, [themePreference, manualPhaseOverride]);

  // Set theme preference: 'auto' | 'light' | 'dark'
  const setThemePreference = (pref) => {
    if (!['auto', 'light', 'dark'].includes(pref)) return;
    setThemePreferenceState(pref);
    setManualPhaseOverride(null); // Reset manual override on explicit preference selection
    localStorage.setItem('tutovia_theme_preference', pref);
    localStorage.removeItem('tutovia_journey_mode');

    if (pref === 'auto') {
      setActivePhase(getTimePhase());
    } else if (pref === 'dark') {
      setActivePhase('night');
    } else if (pref === 'light') {
      const current = getTimePhase();
      setActivePhase(current === 'night' ? 'day' : current);
    }
  };

  // Select phase function (supports clicking specific mode or returning to 'auto')
  const selectPhase = (phaseId) => {
    if (phaseId === 'auto') {
      setThemePreference('auto');
    } else if (TIME_THEME_CONFIG[phaseId]) {
      setManualPhaseOverride(phaseId);
      setActivePhase(phaseId);
      localStorage.setItem('tutovia_journey_mode', phaseId);
    }
  };

  // Reset back to automatic time detection
  const resetToAuto = () => {
    setThemePreference('auto');
  };

  // Backward-compatible toggleTheme
  const toggleTheme = () => {
    if (activePhase === 'night') {
      setThemePreference('light');
    } else {
      setThemePreference('dark');
    }
  };

  const currentPhaseInfo = TIME_THEME_CONFIG[activePhase] || TIME_THEME_CONFIG.day;
  const isAuto = themePreference === 'auto' && manualPhaseOverride === null;
  const theme = activePhase === 'night' ? 'dark' : 'light';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        activePhase,
        themePreference,
        setThemePreference,
        manualPhaseOverride,
        selectPhase,
        resetToAuto,
        isAuto,
        currentPhaseInfo,
        PHASES: TIME_THEME_CONFIG,
        TIME_THEME_CONFIG,
        getTimePhase
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
