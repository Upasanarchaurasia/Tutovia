import React, { useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import BottomNav from './components/BottomNav.jsx';
import { TutorChat } from './components/TutorChat.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import './study.css';
import api from '../../api.js';

function StudyShell() {
  const { needsOnboarding } = useAuth();
  const { activePhase, theme } = useTheme();
  const [tutorOpen, setTutorOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    // The legacy server treats zero minutes as a 25-minute session and completes
    // a task. Background cloud sync sends zero; a page visit must not count as work.
    const guard = api.interceptors.request.use(config => {
      if (config.url === '/api/progress/study-hours' && config.data?.minutesAdded === 0) {
        return Promise.reject(new Error('Zero-duration sync does not record study activity.'));
      }
      return config;
    });
    return () => api.interceptors.request.eject(guard);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className={`v3-study phase-${activePhase} ${theme} min-h-screen bg-background text-main flex flex-col selection:bg-indigo-500 selection:text-static-white`}>
      <ToastProvider>
        <ErrorBoundary>
          <Navbar onOpenTutor={() => setTutorOpen(true)} />
          <main className="relative flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
            <Outlet context={{ onOpenTutor: () => setTutorOpen(true) }} />
          </main>
          <BottomNav onOpenTutor={() => setTutorOpen(true)} />
          <TutorChat isOpen={tutorOpen} onClose={() => setTutorOpen(false)} />
          {needsOnboarding && <OnboardingModal isOpen={true} />}
          <footer className="relative border-t border-surface-border glass-panel py-6 text-center text-xs text-slate-500">
            <div className="max-w-[1600px] w-full mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span>© {new Date().getFullYear()} <strong>Tutovia</strong> — Mindful Study Coach &amp; AI Tutor. Built for CA excellence.</span>
              <div className="flex items-center gap-4">
                <Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/contact">Contact Support</Link>
              </div>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400" />Tutovia Cloud Engine Active</span>
            </div>
          </footer>
        </ErrorBoundary>
      </ToastProvider>
    </div>
  );
}

export default function StudyLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center" role="status">Opening your study space…</div>;
  if (!user) return <Navigate to="/login" state={{ from: `${location.pathname}${location.search}` }} replace />;
  return <ThemeProvider><StudyShell key={user.id} /></ThemeProvider>;
}
