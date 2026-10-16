import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../ThemeContextV2.jsx';
import { V2_THEMES } from '../themes.js';

const InputField = forwardRef(function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  icon: Icon,
  error,
  isValid = false,
  autoComplete,
  disabled = false,
  helperText,
  rightElement
}, ref) {
  const { activePhase } = useTheme();
  const currentTheme = V2_THEMES[activePhase] || V2_THEMES.eclipse;
  const isDarkTheme = activePhase === 'twilight' || activePhase === 'eclipse';
  const [isFocused, setIsFocused] = useState(false);

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
        {Icon && (
          <div 
            className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
              error 
                ? 'text-rose-400' 
                : isFocused 
                  ? 'text-indigo-500 opacity-100' 
                  : 'text-slate-400 opacity-60'
            }`}
          >
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={`w-full text-sm font-medium rounded-xl py-3 border transition-all duration-200 outline-none ${
            Icon ? 'pl-10' : 'pl-4'
          } ${isValid ? 'pr-10' : 'pr-4'} ${
            error 
              ? 'border-rose-500/80 ring-2 ring-rose-500/20 bg-rose-500/5' 
              : isDarkTheme
                ? 'bg-[#081026] border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/25'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
          }`}
        />

        {/* Subtle Checkmark for valid field */}
        {isValid && !error && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
            <CheckCircle2 size={16} />
          </div>
        )}
      </div>

      {/* Accessible Animated Error Region */}
      <div aria-live="polite" className="min-h-[18px]">
        <AnimatePresence mode="wait">
          {error ? (
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
          ) : helperText ? (
            <p id={`${id}-helper`} className={`text-[11px] leading-tight pt-0.5 ${currentTheme.subText}`}>
              {helperText}
            </p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default InputField;
