import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../ThemeContextV2.jsx';
import { V2_THEMES } from '../themes.js';

const PasswordField = forwardRef(function PasswordField({
  id,
  label = 'Password',
  value,
  onChange,
  placeholder = '••••••••',
  required = true,
  error,
  autoComplete = 'current-password',
  disabled = false,
  showRequirements = false,
  rightElement
}, ref) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { activePhase } = useTheme();
  const currentTheme = V2_THEMES[activePhase] || V2_THEMES.eclipse;
  const isDarkTheme = activePhase === 'twilight' || activePhase === 'eclipse';

  const isMinLength = (value || '').length >= 6;
  const hasLetter = /[a-zA-Z]/.test(value || '');
  const hasNumber = /[0-9]/.test(value || '');

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label 
          htmlFor={id} 
          className={`block text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
            isFocused ? currentTheme.accentText : currentTheme.subText
          }`}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {rightElement}
      </div>

      <div className="relative rounded-xl shadow-sm">
        <div 
          className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
            error 
              ? 'text-rose-400' 
              : isFocused 
                ? 'text-indigo-500 opacity-100' 
                : 'text-slate-400 opacity-60'
          }`}
        >
          <Lock size={16} />
        </div>
        
        <input
          ref={ref}
          id={id}
          name={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full text-sm font-medium rounded-xl py-3 pl-10 pr-11 border transition-all duration-200 outline-none ${
            error 
              ? 'border-rose-500/80 ring-2 ring-rose-500/20 bg-rose-500/5' 
              : isDarkTheme
                ? 'bg-[#081026] border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/25'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
          }`}
        />

        {/* Password Visibility Toggle with soft scale/fade transition */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.90 }}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {showPassword ? (
              <motion.span
                key="eye-off"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center"
              >
                <EyeOff size={16} />
              </motion.span>
            ) : (
              <motion.span
                key="eye-on"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center"
              >
                <Eye size={16} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Password Requirements Indicator (for Sign Up) */}
      {showRequirements && value.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-1.5 space-y-1"
        >
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <CheckCircle2 
              size={13} 
              className={isMinLength ? 'text-emerald-500' : 'text-slate-400 opacity-60'} 
            />
            <span className={isMinLength ? 'text-emerald-500 font-semibold' : currentTheme.subText}>
              At least 6 characters
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <CheckCircle2 
              size={13} 
              className={hasLetter && hasNumber ? 'text-emerald-500' : 'text-slate-400 opacity-60'} 
            />
            <span className={hasLetter && hasNumber ? 'text-emerald-500 font-semibold' : currentTheme.subText}>
              Includes letters and numbers
            </span>
          </div>
        </motion.div>
      )}

      {/* Accessible Animated Error Region */}
      <div aria-live="polite" className="min-h-[18px]">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key={`${id}-err`}
              id={`${id}-error`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center gap-1.5 text-xs text-rose-500 font-medium pt-0.5"
            >
              <AlertCircle size={13} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default PasswordField;
