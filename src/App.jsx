import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { TutorChat } from './components/TutorChat.jsx';
import BottomNav from './components/BottomNav.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Exams from './pages/Exams.jsx';
import Flashcards from './pages/Flashcards.jsx';
import Wellness from './pages/Wellness.jsx';
import News from './pages/News.jsx';
import Community from './pages/Community.jsx';
import User from './pages/User.jsx';
import Login from './pages/Login.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Subject from './pages/Subject.jsx';
import Analytics from './pages/Analytics.jsx';
import PYQ from './pages/PYQ.jsx';
import NotFound from './pages/NotFound.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import Contact from './pages/Contact.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import AppExclusive from './pages/AppExclusive.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import CloudSyncModal from './components/CloudSyncModal.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

export default function App() {
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const { user, needsOnboarding, loading, showSyncModal, handleAcceptSync, handleDeclineSync } = useAuth();

  // If auth state is still initializing from storage, show a minimal loading spinner to avoid route bouncing
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is NOT logged in, show the public marketing site or login page
  if (!user) {
    return (
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    );
  }

  // If user IS logged in, show the private app dashboard
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-static-white">
        
        {/* Navigation Header */}
        <Navbar 
          onOpenTutor={() => setIsTutorOpen(true)} 
        />

        {/* Main Content Viewport */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard onOpenTutor={() => setIsTutorOpen(true)} />} />
            <Route path="/subject/:id" element={<Subject />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/flashcards" element={<AppExclusive />} />
            <Route path="/wellness" element={<AppExclusive />} />
            <Route path="/news" element={<News />} />
            <Route path="/community" element={<AppExclusive />} />
            <Route path="/profile" element={<User />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/pyq" element={<PYQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav onOpenTutor={() => setIsTutorOpen(true)} />

        {/* Floating Slide-over AI Tutor Assistant */}
        <TutorChat 
          isOpen={isTutorOpen} 
          onClose={() => setIsTutorOpen(false)} 
        />

        {/* First-time Student CA Onboarding */}
        <OnboardingModal 
          isOpen={needsOnboarding} 
        />

        {/* Cross-Device Cloud Sync Prompt Modal */}
        <CloudSyncModal 
          isOpen={showSyncModal} 
          onClose={handleDeclineSync} 
          onAccept={handleAcceptSync} 
        />

        {/* Footer */}
        <footer className="border-t border-surface-border glass-panel py-6 text-center text-xs text-slate-500">
          <div className="max-w-[1600px] w-full mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>© 2026 <strong>Tutovia</strong> — Mindful Study Coach & AI Tutor. Built for CA excellence.</span>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="/contact" className="hover:text-slate-300 transition-colors">Contact Support</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Tutovia Cloud Engine Active</span>
            </div>
          </div>
        </footer>

        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
