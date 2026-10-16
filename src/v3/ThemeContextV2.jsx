import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

/**
 * ThemeContextV2 — Dedicated 4-Atmosphere Visual Theme Engine for Tutovia V2
 * 
 * Exclusively powers the V2 experience with 4 distinct atmospheres:
 * - 🌅 Aurora:   05:00 AM – 11:59 AM ("Fresh Start")
 * - ☀️ Lumen:    12:00 PM – 04:59 PM ("Focus Mode")
 * - 🌇 Twilight: 05:00 PM – 08:59 PM ("Reflect & Recharge" / Sunset to Blue Hour)
 * - 🌙 Eclipse:  09:00 PM – 04:59 AM ("Calm Companion" / Night Study)
 */
export const PHASES_V2 = {
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    label: 'Fresh beginnings',
    tagline: 'Fresh beginnings. Brighter days.',
    timeLabel: '05:00 AM – 11:59 AM',
    startMinutes: 5 * 60, // 300
    endMinutes: 11 * 60 + 59, // 719
    icon: '🌅',
    greeting: 'Good morning! Ready to make today count?',
    quote: '“Every sunrise is an invitation to begin again with clarity.”',
    color: '#F97316',
    primary: '#F97316'
  },
  lumen: {
    id: 'lumen',
    name: 'Lumen',
    label: 'Focus. Learn. Grow.',
    tagline: 'Focus. Learn. Grow.',
    timeLabel: '12:00 PM – 04:59 PM',
    startMinutes: 12 * 60, // 720
    endMinutes: 16 * 60 + 59, // 1019
    icon: '☀️',
    greeting: "Let's focus on what matters today.",
    quote: '“One focused hour is worth four distracted ones. Keep your momentum.”',
    color: '#0284C7',
    primary: '#0284C7'
  },
  twilight: {
    id: 'twilight',
    name: 'Twilight',
    label: 'Reflect. Recharge. Rise.',
    tagline: 'Reflect. Recharge. Rise.',
    timeLabel: '05:00 PM – 08:59 PM',
    startMinutes: 17 * 60, // 1020
    endMinutes: 20 * 60 + 59, // 1259
    icon: '🌇',
    greeting: "You've come this far today. Let's see what you achieved.",
    quote: '“Your day is slowing down. Reflect on what you completed.”',
    color: '#F97316',
    primary: '#F97316'
  },
  eclipse: {
    id: 'eclipse',
    name: 'Eclipse',
    label: 'Rest. Reimagine. Achieve.',
    tagline: 'Rest. Reimagine. Achieve.',
    timeLabel: '09:00 PM – 04:59 AM',
    startMinutes: 21 * 60, // 1260
    endMinutes: 4 * 60 + 59, // 299
    icon: '🌙',
    greeting: "Still studying? I'm here. Let's make it easier.",
    quote: '“Rest restores memory. A fresh mind is your greatest exam asset.”',
    color: '#6366F1',
    primary: '#6366F1'
  }
};

export function getAutoPhaseForTime(date = new Date()) {
  const minutes = date.getHours() * 60 + date.getMinutes();
  if (minutes >= 300 && minutes <= 719) return 'aurora';
  if (minutes >= 720 && minutes <= 1019) return 'lumen';
  if (minutes >= 1020 && minutes <= 1259) return 'twilight';
  return 'eclipse';
}

const ThemeContextV2 = createContext(null);

export function ThemeProviderV2({ children }) {
  // 'auto' | 'aurora' | 'lumen' | 'twilight' | 'eclipse'
  const [phaseMode, setPhaseMode] = useState(() => {
    try {
      return localStorage.getItem('tutovia_v2_theme_mode') || 'auto';
    } catch {
      return 'auto';
    }
  });

  const [deviceTime, setDeviceTime] = useState(() => new Date());

  // Real-time local clock polling (every 30 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setDeviceTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const isAuto = phaseMode === 'auto';

  // Determine current active phase
  const activePhase = useMemo(() => {
    if (!isAuto && PHASES_V2[phaseMode]) {
      return phaseMode;
    }
    return getAutoPhaseForTime(deviceTime);
  }, [phaseMode, isAuto, deviceTime]);

  const selectPhase = (modeId) => {
    setPhaseMode(modeId);
    try {
      localStorage.setItem('tutovia_v2_theme_mode', modeId);
    } catch (e) {
      console.warn('Could not save theme preference', e);
    }
  };

  const currentPhaseInfo = PHASES_V2[activePhase] || PHASES_V2.twilight;

  const value = {
    activePhase,
    phaseMode,
    selectPhase,
    currentPhaseInfo,
    isAuto,
    deviceTime,
    phases: PHASES_V2
  };

  return (
    <ThemeContextV2.Provider value={value}>
      {children}
    </ThemeContextV2.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContextV2);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProviderV2');
  }
  return context;
}

export default ThemeContextV2;
