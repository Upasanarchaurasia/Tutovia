import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, KeyRound, X, Sparkles, GraduationCap } from 'lucide-react';
import axios from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from './ThemeContextV2.jsx';
import { V2_THEMES } from './themes.js';
import InputField from './auth/InputField.jsx';
import PasswordField from './auth/PasswordField.jsx';

export default function LoginV2() {
  const navigate = useNavigate();
  const location = useLocation();
  const outletCtx = useOutletContext() || {};
  const { user, login, loginWithSupabase, resetPassword } = useAuth();
  const { activePhase } = useTheme();
  const currentTheme = V2_THEMES[activePhase] || V2_THEMES.eclipse;
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Focus management
  const emailInputRef = useRef(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');

  // Auto-focus email input on load
  useEffect(() => {
    const timer = setTimeout(() => {
      emailInputRef.current?.focus();
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  // Validate redirect URL to prevent open-redirect vulnerabilities
  const isSafeRedirect = (url) => {
    return url && typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');
  };
  const destination = isSafeRedirect(location.state?.from) ? location.state.from : '/';

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

    if (!email.trim() || !password) {
      triggerError('Please enter both your email address and password.');
      setIsLoading(false);
      return;
    }

    try {
      try {
        await loginWithSupabase(email.trim().toLowerCase(), password);
        setSuccessMsg('Welcome back! Redirecting you now…');
        setTimeout(() => navigate(destination, { replace: true }), 350);
      } catch (sbErr) {
        // Fallback to VM server authentication
        const logRes = await axios.post('/api/auth/login', { 
          email: email.trim().toLowerCase(), 
          password 
        });
        if (logRes.data?.id) {
          login(logRes.data, rememberMe);
          setSuccessMsg('Welcome back! Redirecting you now…');
          setTimeout(() => navigate(destination, { replace: true }), 350);
        } else {
          throw sbErr;
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error || 
        (err.message === 'Invalid login credentials' ? 'Incorrect email or password. Please try again.' : err.message) ||
        'Login failed. Please check your credentials and try again.';
      triggerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotMsg('');
    try {
      await resetPassword(forgotEmail.trim().toLowerCase());
      setForgotMsg('Password reset instructions have been sent to your email.');
    } catch {
      setForgotMsg('If an account exists with this email, a reset link has been dispatched.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between my-auto py-1 sm:py-3">
      {/* Eyebrow & Heading */}
      <div className="text-center mb-6 shrink-0">
        <div className="flex justify-center mb-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md text-white ${currentTheme.logoIcon}`}>
            <GraduationCap size={22} />
          </div>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-2 inline-block ${currentTheme.audienceBadge}`}>
          Welcome Back
        </span>
        <h1 className={`text-2xl sm:text-3xl font-heading font-black tracking-tight mt-0.5 mb-1.5 ${currentTheme.h2}`}>
          Welcome back to Tutovia
        </h1>
        <p className={`text-xs sm:text-sm leading-relaxed ${currentTheme.bodyText}`}>
          Your calm, intelligent study companion is ready when you are.
        </p>
      </div>

      {/* Global Error Banner */}
      <AnimatePresence mode="wait">
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs sm:text-sm flex items-start gap-2.5 shrink-0"
            role="alert"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMsg}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Success Banner */}
      <AnimatePresence mode="wait">
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm flex items-start gap-2.5 shrink-0"
            role="status"
          >
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{successMsg}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign In Form (Vertically centered with elegant spacing) */}
      <form onSubmit={handleSubmit} className="space-y-4 my-auto">
        <InputField
          ref={emailInputRef}
          id="login-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="student@icai.org"
          required
          autoComplete="email"
          icon={Mail}
          disabled={isLoading}
        />

        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          disabled={isLoading}
        />

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-0.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <span className={`font-medium ${currentTheme.bodyText}`}>Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => {
              setForgotEmail(email);
              setShowForgotModal(true);
            }}
            className={`font-semibold hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1 cursor-pointer ${currentTheme.accentText}`}
          >
            Forgot password?
          </button>
        </div>

        {/* Primary Submit Button with hover lift and arrow slide */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${currentTheme.primaryBtn}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Signing you in…</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200 shrink-0" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Switch to Sign Up */}
      <div className="mt-6 pt-5 border-t border-slate-500/15 text-center text-xs shrink-0">
        <span className={currentTheme.subText}>New to Tutovia? </span>
        <Link
          to="/signup"
          className={`font-bold hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1 ${currentTheme.accentText}`}
        >
          Create your free account &rarr;
        </Link>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`w-full max-w-md rounded-3xl border-2 p-6 sm:p-8 shadow-2xl relative ${currentTheme.card}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentTheme.audienceBadge}`}>
                    <KeyRound size={16} />
                  </div>
                  <h3 className={`font-heading font-bold text-lg ${currentTheme.h3}`}>Reset Password</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className={`p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity focus-visible:ring-2 focus-visible:ring-indigo-400 ${currentTheme.subText}`}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <p className={`text-xs leading-relaxed mb-5 ${currentTheme.bodyText}`}>
                Enter the email address registered with Tutovia. We’ll send you a secure link to reset your password.
              </p>

              {forgotMsg && (
                <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400 flex items-start gap-2">
                  <Sparkles size={14} className="shrink-0 mt-0.5" />
                  <span>{forgotMsg}</span>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <InputField
                  id="forgot-email"
                  label="Registered Email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="student@icai.org"
                  required
                  icon={Mail}
                />

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-colors ${currentTheme.secondaryBtn}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md ${currentTheme.primaryBtn}`}
                  >
                    {forgotLoading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
