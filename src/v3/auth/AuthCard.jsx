import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../ThemeContextV2.jsx';
import { V2_THEMES } from '../themes.js';

export default function AuthCard({ children, className = '', shake = false }) {
  const { activePhase } = useTheme();
  const currentTheme = V2_THEMES[activePhase] || V2_THEMES.eclipse;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div 
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.99 }}
      animate={
        shake && !shouldReduceMotion
          ? { x: [0, -7, 7, -5, 5, -2, 2, 0], opacity: 1, y: 0, scale: 1 }
          : { opacity: 1, y: 0, scale: 1, x: 0 }
      }
      transition={
        shake
          ? { duration: 0.45, ease: 'easeInOut' }
          : { duration: 0.32, ease: 'easeOut' }
      }
      className={`w-full max-w-lg lg:h-[680px] rounded-3xl border-2 p-6 sm:p-8 lg:p-9 transition-colors duration-400 shadow-2xl relative overflow-hidden backdrop-blur-xl shrink-0 flex flex-col justify-between ${currentTheme.authCardBg} ${className}`}
    >
      {children}
    </motion.div>
  );
}
