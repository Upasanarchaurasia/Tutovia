import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Smartphone, 
  Layers, 
  HeartPulse, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Download,
  Apple
} from 'lucide-react';

const FEATURE_DATA = {
  '/flashcards': {
    title: 'Spaced Repetition Flashcards',
    tagline: 'Memorize CA concepts with tactile swipe gestures & offline review',
    icon: Layers,
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/30',
    bgBadge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    highlights: [
      'Tactile haptic feedback on card flip (Know / Repeat)',
      '100% Offline review on metro & daily commute',
      'SM-2 spaced repetition algorithm tuned for rapid recall',
      'Home screen widget showing daily review count'
    ]
  },
  '/wellness': {
    title: 'Mindful Wellness & Counselor',
    tagline: 'Stay calm and focused with Dr. Maya, 4-7-8 breathing, and ambient soundscapes',
    icon: HeartPulse,
    color: 'from-rose-500 to-pink-500',
    borderColor: 'border-rose-500/30',
    bgBadge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    highlights: [
      'Background audio playback with screen locked',
      'Guided 4-7-8 breathing reset with haptic breath cues',
      'Dr. Maya 24/7 exam stress & mindset counseling',
      'Sleep & recovery log synced to your phone health kit'
    ]
  },
  '/community': {
    title: 'CA Doubt Forum & Community',
    tagline: 'Realtime peer discussion and tricky sum discussions on mobile',
    icon: Users,
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/30',
    bgBadge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    highlights: [
      'Snap & upload textbook problem photos in seconds',
      'Instant push notifications when your doubt is answered',
      'Live peer discussions & solution upvoting',
      'CA peer leaderboard and contributor badges'
    ]
  }
};

export default function AppExclusive() {
  const location = useLocation();
  const feature = FEATURE_DATA[location.pathname] || FEATURE_DATA['/flashcards'];
  const Icon = feature.icon;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-xl w-full glass-panel p-8 sm:p-10 rounded-3xl border border-surface-border text-center shadow-2xl relative overflow-hidden">
        {/* Subtle glow background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Smartphone size={14} className="text-indigo-400" />
            <span>Tutovia App Exclusive</span>
          </div>

          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20`}>
            <Icon size={32} className="text-white" />
          </div>

          {/* Headline & Description */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {feature.title}
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">
              {feature.tagline}
            </p>
          </div>

          {/* Feature Highlights Card */}
          <div className={`p-5 rounded-2xl bg-surface-card border ${feature.borderColor} text-left space-y-2.5`}>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Mobile Hardware Features
            </span>
            {feature.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          {/* Download & Back CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Tutovia iOS & Android App is in active release packaging (Bundle ID: org.tutovia.app). Sideloadly & TestFlight builds available!');
                }}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
              >
                <Download size={16} />
                <span>Get on Mobile App</span>
              </a>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 border border-surface-border text-sm font-semibold transition-all"
              >
                <ArrowLeft size={16} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <p className="text-[11px] text-slate-500">
              Desktop website is dedicated to Timetable, AI Tutor, PYQs, Mock Exams & Analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
