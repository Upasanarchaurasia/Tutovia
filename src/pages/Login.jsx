import React, { useState } from 'react';
import { GraduationCap, ArrowRight, Mail, Lock, Sparkles, User as UserIcon, X, Check, KeyRound, Phone } from 'lucide-react';
import axios from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { StoryAnimation } from '../components/StoryAnimation.jsx';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');

  const { login, loginWithSupabase, signUpWithSupabase, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp && name.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      setIsLoading(false);
      return;
    }
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (isSignUp && (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        try {
          const data = await signUpWithSupabase(name.trim(), email.trim().toLowerCase(), password, cleanPhone);
          if (data?.session) {
            setSuccessMsg('Account created successfully! Welcome to Tutovia.');
          } else {
            setSuccessMsg('Account created! Please check your email inbox to verify your account, then sign in.');
            setIsSignUp(false);
          }
        } catch (sbErr) {
          // VM server fallback
          const regRes = await axios.post('/api/auth/register', { 
            name: name.trim(), 
            email: email.trim().toLowerCase(), 
            password,
            phone: cleanPhone 
          });
          if (regRes.data?.id) {
            login(regRes.data, true);
            setSuccessMsg('Account created successfully! Welcome to Tutovia.');
          } else {
            throw sbErr;
          }
        }
      } else {
        try {
          await loginWithSupabase(email.trim().toLowerCase(), password);
          setSuccessMsg('Login successful! Redirecting...');
        } catch (sbErr) {
          // VM server fallback
          const logRes = await axios.post('/api/auth/login', { 
            email: email.trim().toLowerCase(), 
            password 
          });
          if (logRes.data?.id) {
            login(logRes.data, true);
            setSuccessMsg('Login successful! Redirecting...');
          } else {
            throw sbErr;
          }
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || (isSignUp ? 'Registration failed. Please check details.' : 'Login failed. Invalid credentials.'));
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
      await resetPassword(forgotEmail);
      setForgotMsg('Password reset instructions have been sent to your email.');
    } catch (err) {
      setForgotMsg('If an account exists, a reset link has been dispatched.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8 py-12 z-10">
        
        {/* Left Side: Story Animation (Hidden on mobile) */}
        <div className="hidden lg:block w-full h-full min-h-[500px]">
          <StoryAnimation />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center mb-6 lg:justify-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-center lg:text-left text-3xl font-extrabold text-white tracking-tight">
            Welcome to Tutovia
          </h2>
          <p className="mt-2 text-center lg:text-left text-sm text-indigo-300 mb-6">
            Your Emotionally Intelligent CA Study Companion
          </p>

          <div className="glass-panel py-8 px-4 sm:rounded-3xl sm:px-10 border border-surface-border shadow-2xl">
            
            {errorMsg && (
              <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
                <Check className="w-4 h-4" /> {successMsg}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-surface-border rounded-xl bg-surface-card text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        placeholder="Upasana Chaurasia"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-500" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-surface-border rounded-xl bg-surface-card text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-surface-border rounded-xl bg-surface-card text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    placeholder="student@icai.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-surface-border rounded-xl bg-surface-card text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded bg-surface-card border-surface-border text-indigo-500 focus:ring-indigo-500 focus:ring-offset-background"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400">
                      Remember me
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgotModal(true);
                    }}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/25 text-sm font-bold text-static-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-indigo-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-5 text-center">
              <p className="text-xs text-slate-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="ml-2 font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-surface-border w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-white font-bold">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                Reset Password
              </div>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mb-4">
              Enter the email address associated with your Tutovia account to receive a secure password reset link.
            </p>

            {forgotMsg && (
              <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs">
                {forgotMsg}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="student@icai.org"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-card border border-surface-border text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/20"
              >
                {forgotLoading ? 'Sending...' : 'Send Recovery Email'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
