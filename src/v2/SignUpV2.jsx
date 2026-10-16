import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { User, Phone, Mail, ArrowRight, CheckCircle2, AlertCircle, MailCheck, ShieldCheck, GraduationCap } from 'lucide-react';
import axios from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from './ThemeContextV2.jsx';
import { V2_THEMES } from './themes.js';
import InputField from './auth/InputField.jsx';
import PasswordField from './auth/PasswordField.jsx';

export default function SignUpV2() {
  const navigate = useNavigate();
  const location = useLocation();
  const outletCtx = useOutletContext() || {};
  const { user, login, signUpWithSupabase } = useAuth();
  const { activePhase } = useTheme();
  const currentTheme = V2_THEMES[activePhase] || V2_THEMES.eclipse;
  const shouldReduceMotion = useReducedMotion();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isVerificationPending, setIsVerificationPending] = useState(false);

  // Focus management
  const nameInputRef = useRef(null);

  // Auto-focus first input on load
  useEffect(() => {
    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  // Validate redirect URL to prevent open-redirect vulnerabilities
  const isSafeRedirect = (url) => {
    return url && typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');
  };
  const destination = isSafeRedirect(location.state?.from) ? location.state.from : '/hub';

  // If user is already authenticated, redirect them away to destination
  useEffect(() => {
    if (user) {
      navigate(destination, { replace: true });
    }
  }, [user, navigate, destination]);

  const triggerError = (message) => {
    setErrorMsg(message);
    if (outletCtx.triggerShake) {
      outletCtx.triggerShake();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Field Validations matching backend contracts
    if (name.trim().length < 2) {
      triggerError('Please enter your full name (minimum 2 characters).');
      setIsLoading(false);
      return;
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '').trim();
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (!cleanPhone || digitsOnly.length < 10) {
      triggerError('Please enter a valid 10-digit mobile number for account verification.');
      setIsLoading(false);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      triggerError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      triggerError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      triggerError('Passwords do not match. Please re-type your password to confirm.');
      setIsLoading(false);
      return;
    }

    try {
      try {
        const data = await signUpWithSupabase(name.trim(), email.trim().toLowerCase(), password, cleanPhone);
        if (data?.session) {
          setSuccessMsg('Account created successfully! Welcome to Tutovia.');
          setTimeout(() => navigate(destination, { replace: true }), 400);
        } else {
          setSuccessMsg('Account created! Please check your email inbox to verify your account.');
          setIsVerificationPending(true);
        }
      } catch (sbErr) {
        // Fallback to VM server registration
        const regRes = await axios.post('/api/auth/register', { 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          password,
          phone: cleanPhone 
        });
        if (regRes.data?.id) {
          login(regRes.data, true);
          setSuccessMsg('Account created successfully! Welcome to Tutovia.');
          setTimeout(() => navigate(destination, { replace: true }), 400);
        } else {
          throw sbErr;
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Registration failed. Please check your information and try again.';
      triggerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between my-auto py-1 sm:py-2">
      <AnimatePresence mode="wait">
        {isVerificationPending ? (
          // Verification Pending Screen
          <motion.div 
            key="verification-screen"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="text-center py-4 space-y-5 my-auto"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <MailCheck size={32} />
            </div>

            <div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-2 inline-block ${currentTheme.audienceBadge}`}>
                Verification Link Sent
              </span>
              <h2 className={`text-2xl font-heading font-black tracking-tight mb-2 ${currentTheme.h2}`}>
                Check your inbox
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed max-w-sm mx-auto ${currentTheme.bodyText}`}>
                We’ve dispatched a confirmation email to <span className="font-bold underline text-indigo-400">{email}</span>. Please click the verification link to activate your access.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border text-left text-xs ${currentTheme.highlightBox}`}>
              <div className="font-bold mb-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span>Next Steps:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 opacity-90 pl-1">
                <li>Check Spam/Junk folder if not in inbox within 2 minutes.</li>
                <li>Click "Confirm Email" in the message.</li>
                <li>Return here to log into your account.</li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer ${currentTheme.primaryBtn}`}
              >
                <span>Proceed to Sign In</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200 shrink-0" />
              </Link>
            </div>
          </motion.div>
        ) : (
          // Regular Sign Up Form (Compact 2-column layout fitted to 680px card)
          <div key="signup-form" className="w-full h-full flex flex-col justify-between">
            {/* Eyebrow & Heading */}
            <div className="text-center mb-3 shrink-0">
              <div className="flex justify-center mb-1.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md text-white ${currentTheme.logoIcon}`}>
                  <GraduationCap size={20} />
                </div>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border mb-1 inline-block ${currentTheme.audienceBadge}`}>
                Start Your Journey
              </span>
              <h1 className={`text-xl sm:text-2xl font-heading font-black tracking-tight mt-0.5 mb-1 ${currentTheme.h2}`}>
                Build a study rhythm that works for you
              </h1>
              <p className={`text-[11px] sm:text-xs leading-tight ${currentTheme.bodyText}`}>
                Join Tutovia and get calm guidance for planning, learning, and consistency.
              </p>

              {/* Beta Badge */}
              <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Free during closed beta &bull; No credit card required</span>
              </div>
            </div>

            {/* Error Banner */}
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="mb-2.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-start gap-2 shrink-0"
                  role="alert"
                >
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium text-[11px] leading-tight">{errorMsg}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Banner */}
            <AnimatePresence mode="wait">
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="mb-2.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2 shrink-0"
                  role="status"
                >
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium text-[11px] leading-tight">{successMsg}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form with Intelligent 2-Column Layout */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Row 1: Name and Mobile side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <InputField
                  ref={nameInputRef}
                  id="signup-name"
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Upasana Chaurasia"
                  required
                  autoComplete="name"
                  icon={User}
                  isValid={name.trim().length >= 2}
                  disabled={isLoading}
                />

                <InputField
                  id="signup-phone"
                  label="Mobile Number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  required
                  autoComplete="tel"
                  icon={Phone}
                  isValid={phone.replace(/\D/g, '').length >= 10}
                  disabled={isLoading}
                />
              </div>

              {/* Row 2: Email full width */}
              <InputField
                id="signup-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@icai.org"
                required
                autoComplete="email"
                icon={Mail}
                isValid={email.includes('@') && email.includes('.')}
                disabled={isLoading}
              />

              {/* Row 3: Password and Confirm Password side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <PasswordField
                  id="signup-password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="≥ 6 characters"
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                  showRequirements={false}
                />

                <PasswordField
                  id="signup-confirm-password"
                  label="Confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                  error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
                />
              </div>

              {/* Password Requirements Indicator */}
              <div className="flex items-center gap-3 text-[11px] pt-0.5">
                <span className={`inline-flex items-center gap-1 ${password.length >= 6 ? 'text-emerald-500 font-semibold' : currentTheme.subText}`}>
                  <CheckCircle2 size={12} className={password.length >= 6 ? 'text-emerald-500' : 'opacity-40'} />
                  <span>≥ 6 chars</span>
                </span>
                <span className={`inline-flex items-center gap-1 ${/[a-zA-Z]/.test(password) && /[0-9]/.test(password) ? 'text-emerald-500 font-semibold' : currentTheme.subText}`}>
                  <CheckCircle2 size={12} className={/[a-zA-Z]/.test(password) && /[0-9]/.test(password) ? 'text-emerald-500' : 'opacity-40'} />
                  <span>Letters & numbers</span>
                </span>
                {confirmPassword && (
                  <span className={`inline-flex items-center gap-1 ${password === confirmPassword ? 'text-emerald-500 font-semibold' : 'text-rose-400'}`}>
                    <CheckCircle2 size={12} className={password === confirmPassword ? 'text-emerald-500' : 'opacity-40'} />
                    <span>{password === confirmPassword ? 'Match' : 'Mismatch'}</span>
                  </span>
                )}
              </div>

              {/* Policy Consent Notice */}
              <div className="text-[10px] leading-tight text-slate-500 dark:text-slate-400 text-center pt-0.5">
                By signing up, you agree to Tutovia's{' '}
                <span className="underline cursor-pointer">Terms</span>{' '}
                and{' '}
                <span className="underline cursor-pointer">Privacy Policy</span>.
              </div>

              {/* Primary Submit Button */}
              <div className="pt-1.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${currentTheme.primaryBtn}`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
                      <span>Creating your account…</span>
                    </>
                  ) : (
                    <>
                      <span>Create My Free Account</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200 shrink-0" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Switch to Sign In */}
            <div className="mt-4 pt-3 border-t border-slate-500/15 text-center text-xs shrink-0">
              <span className={currentTheme.subText}>Already have an account? </span>
              <Link
                to="/login"
                className={`font-bold hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1 ${currentTheme.accentText}`}
              >
                Sign in &rarr;
              </Link>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
