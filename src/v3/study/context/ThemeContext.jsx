import React, { createContext, useContext } from 'react';
import { useTheme as useAtmosphere } from '../../ThemeContextV2.jsx';
import { TIME_THEME_CONFIG } from './phaseConfig.js';

export { TIME_THEME_CONFIG } from './phaseConfig.js';
export const PHASES = TIME_THEME_CONFIG;
const ThemeContext = createContext(null);
const phaseNames = { aurora: 'morning', lumen: 'day', twilight: 'evening', eclipse: 'night' };
const atmosphereNames = { morning: 'aurora', day: 'lumen', evening: 'twilight', night: 'eclipse' };

// V3's existing atmosphere preference drives the independently owned study UI.
// Tokens are applied to the study shell, never to the public landing/auth pages.
export function ThemeProvider({ children }) {
  const atmosphere = useAtmosphere();
  const activePhase = phaseNames[atmosphere.activePhase] || 'night';
  const theme = activePhase === 'night' ? 'dark' : 'light';
  const selectPhase = id => atmosphere.selectPhase(atmosphereNames[id] || id);
  const setThemePreference = preference => selectPhase(preference === 'dark' ? 'night' : preference === 'light' ? 'day' : 'auto');
  const value = {
    activePhase, theme, isAuto: atmosphere.isAuto,
    themePreference: atmosphere.isAuto ? 'auto' : theme,
    manualPhaseOverride: atmosphere.isAuto ? null : activePhase,
    currentPhaseInfo: TIME_THEME_CONFIG[activePhase],
    selectPhase, setThemePreference,
    resetToAuto: () => selectPhase('auto'),
    toggleTheme: () => selectPhase(theme === 'dark' ? 'day' : 'night'),
    PHASES: TIME_THEME_CONFIG, TIME_THEME_CONFIG,
    getTimePhase: () => activePhase
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('Study theme requires the V3 study shell.');
  return value;
}
