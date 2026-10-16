import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Brain, Sparkles, Check, Zap, 
  BarChart, BookOpen, Timer, Target, Calendar, 
  Clock, Bot, Flame, ArrowRight, Play, RotateCcw, 
  Send, Compass, Sun, Moon, Sunrise, Sunset, 
  Heart, Coffee, ShieldCheck, ChevronRight, ChevronDown, ChevronUp, Award,
  Sparkle, CheckCircle2, HelpCircle, X, Menu,
  MessageSquare, Shield, Smile, Lightbulb, TrendingUp,
  Activity, CheckCheck, RefreshCw, Star, ArrowUpRight,
  Mail, User, Lock, Download, FileText, LogOut,
  Layers, Users
} from 'lucide-react';
import { useTheme } from './ThemeContextV2.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import AtmosphereBackground from '../components/AtmosphereBackground.jsx';
import heroPhotoAurora from '../assets/tutovia_hero_aurora.jpg';
import heroPhotoLumen from '../assets/tutovia_hero_lumen.jpg';
import heroPhotoTwilight from '../assets/tutovia_hero_twilight.jpg';
import heroPhotoEclipse from '../assets/tutovia_hero_eclipse.jpg';

// Multi-Stage Academic Tracks & V2 Growth Modals ("For Students, By Students")
import AcademicTrackSelector from './components/AcademicTrackSelector.jsx';
import UnifiedSubjectHubModal from './components/UnifiedSubjectHubModal.jsx';
import PeerStudyRoomModal from './components/PeerStudyRoomModal.jsx';
import FlashcardsEngineModal from './components/FlashcardsEngineModal.jsx';
import EmpathyOnboardingModal from './components/EmpathyOnboardingModal.jsx';
import { ACADEMIC_TRACKS, TRACK_LIST, getActiveTrack, getSavedTrackId, saveTrackId } from './academicTracks.js';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

function TypewriterText({ text }) {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayText('');
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayText}</span>;
}

// Global V2 Revision Version Identifier
export const TUTOVIA_V2_VERSION = 'v2.16.0';

/**
 * Isolated Reading Progress Bar
 * Uses direct DOM manipulation via requestAnimationFrame to avoid triggering
 * full-page React re-renders on every scroll pixel.
 */
function ReadingProgressBar({ color }) {
  const barRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && barRef.current) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        barRef.current.style.width = `${progress}%`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div 
      ref={barRef}
      className="absolute bottom-0 left-0 h-[2px] pointer-events-none will-change-[width]" 
      style={{ 
        width: '0%', 
        backgroundColor: color 
      }} 
    />
  );
}

export default function LandingPageV2() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activePhase, selectPhase, currentPhaseInfo, isAuto } = useTheme();
  const isDarkTheme = activePhase === 'twilight' || activePhase === 'eclipse';

  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  // Multi-Stage Academic Track State ("For Students, By Students")
  const [activeTrackId, setActiveTrackId] = useState(() => getSavedTrackId());
  
  // Growth & Community Modals
  const [subjectHubOpen, setSubjectHubOpen] = useState(false);
  const [peerStudyRoomOpen, setPeerStudyRoomOpen] = useState(false);
  const [flashcardsOpen, setFlashcardsOpen] = useState(false);
  const [empathyOnboardingOpen, setEmpathyOnboardingOpen] = useState(false);

  // Hero interactive card view mode ('dialogue' | 'companion')
  const [heroCardMode, setHeroCardMode] = useState('dialogue');

  // Interactive Student Struggles Selector State
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);

  // Expandable Founder Story Toggle State
  const [expandedStory, setExpandedStory] = useState(false);

  // Interactive Test Drive Sandbox States
  const [sandboxTab, setSandboxTab] = useState('ai');
  const [sandboxAiQuery, setSandboxAiQuery] = useState(null);
  const [simMarks, setSimMarks] = useState({ p1: 68, p2: 52, p3: 45 });

  // Scroll dynamics states (throttled to avoid frame drops)
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Defer preloading of inactive theme hero photos until after initial page load & idle
  const [preloadAllHeroPhotos, setPreloadAllHeroPhotos] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(() => setPreloadAllHeroPhotos(true), { timeout: 3500 });
      return () => window.cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => setPreloadAllHeroPhotos(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;
    let lastSection = '';

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrolled = scrollY > 20;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        setIsScrolled(scrolled);
      }

      // Scrollspy detection across reorganized product sections
      const sections = ['modes', 'problems', 'engines', 'sandbox', 'story', 'about'];
      const scrollPosition = scrollY + 140;
      
      let current = '';
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = sectionId;
            break;
          }
        }
      }
      if (current !== lastSection) {
        lastSection = current;
        setActiveSection(current);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hero interactive preview conversation state (Merged with Demo scenarios)
  const [heroActiveAction, setHeroActiveAction] = useState('beginner');
  const [heroTyping, setHeroTyping] = useState(false);

  // V2 Specific Modals: Early Access Waitlist & Admin Login
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonEmail, setComingSoonEmail] = useState('');
  const [comingSoonAttempt, setComingSoonAttempt] = useState('CA Inter - Nov 2026');
  const [comingSoonSubmitted, setComingSoonSubmitted] = useState(false);

  // Legal / Info Modals
  const [infoModalType, setInfoModalType] = useState(null); // 'privacy' | 'terms' | 'contact' | null

  // Admin Modal
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminUserId, setAdminUserId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Leads state
  const [leadsList, setLeadsList] = useState([]);

  // Load leads from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tutovia_v2_waitlist_leads');
      if (stored) {
        setLeadsList(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load leads from localStorage', e);
    }
  }, []);

  // Save new lead
  const handleSaveLead = (e) => {
    e.preventDefault();
    if (!comingSoonEmail || !comingSoonEmail.includes('@')) return;

    const newLead = {
      id: Date.now(),
      email: comingSoonEmail.trim(),
      attempt: comingSoonAttempt,
      submittedAt: new Date().toISOString()
    };

    const updated = [newLead, ...leadsList];
    setLeadsList(updated);
    try {
      localStorage.setItem('tutovia_v2_waitlist_leads', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setComingSoonSubmitted(true);
  };

  // Export leads to CSV
  const handleExportCSV = () => {
    if (leadsList.length === 0) {
      alert('No waitlist leads to export yet.');
      return;
    }
    const headers = 'ID,Email,Attempt,Timestamp\n';
    const rows = leadsList.map(l => `"${l.id}","${l.email}","${l.attempt}","${l.submittedAt}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tutovia_v2_waitlist_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Admin login handler (securely without displaying credentials in UI)
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminError('');
    if (adminUserId.trim().toLowerCase() === 'admin' && adminPassword === 'Admin') {
      setIsAdminLoggedIn(true);
    } else {
      setAdminError('Invalid User ID or Password. Please try again.');
    }
  };

  // -------------------------------------------------------------
  // COMPLETE 4-PHASE FULL-UI THEME PALETTES
  // Exact user-specified palettes for Morning, Day, Evening, and Night
  // -------------------------------------------------------------
  const theme = {
    aurora: {
      id: 'aurora',
      name: 'Aurora',
      tagline: 'Fresh beginnings. Brighter days.',
      heroPhoto: heroPhotoAurora,
      pageBg: 'bg-[#FAF8FE] text-[#1E1B4B]',
      pageGradient: 'linear-gradient(180deg, #D4D0F5 0%, #E8E5FA 16%, #FCE7F0 36%, #FDDFC3 58%, #FEF3C7 78%, #FFFDF7 100%)',
      heroOverlay: 'linear-gradient(135deg, rgba(212, 208, 245, 0.28) 0%, rgba(252, 231, 240, 0.20) 30%, rgba(254, 243, 199, 0.16) 65%, rgba(253, 223, 195, 0.10) 100%)',
      heroReadability: 'radial-gradient(circle at 25% 45%, rgba(255, 255, 255, 0.76) 0%, rgba(254, 243, 199, 0.20) 60%, transparent 85%)',
      navBg: 'bg-[#EBE7FA]/85 border-[#D8D2F2] text-[#1E1B4B]',
      logoIcon: 'bg-gradient-to-tr from-[#F97316] to-[#EA580C] text-white',
      logoText: 'text-[#1E1B4B]',
      navLinks: 'text-[#334155] hover:text-[#1E1B4B]',
      activeThemePill: 'bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white font-bold shadow-md shadow-orange-500/25',
      inactiveThemePill: 'text-[#475569] hover:text-[#1E1B4B]',
      autoBadge: 'text-[#EA580C] font-bold',
      heroGreeting: 'bg-[#FDDFC3]/75 text-[#9A3412] border-[#FDBA74] font-semibold shadow-sm',
      audienceBadge: 'bg-[#E0E7FF]/80 text-[#3730A3] border-[#C7D2FE] font-bold',
      heroHeadline: 'text-[#1E1B4B]',
      heroSubtitle: 'text-[#EA580C] font-bold',
      heroSupporting: 'text-[#334155]',
      primaryBtn: 'bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-bold shadow-lg shadow-orange-500/25',
      secondaryBtn: 'bg-white/90 hover:bg-white text-[#1E1B4B] font-semibold border border-[#E2E8F0] shadow-sm',
      trustChip: 'bg-white/90 text-[#334155] border-[#E2E8F0] shadow-sm',
      chatCard: 'bg-white/90 backdrop-blur-xl border border-[#E9E4F5] shadow-2xl shadow-indigo-950/10',
      chatInner: 'bg-[#FAF8FE] border border-[#EAE5F6]',
      chatHeaderBot: 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white',
      chatHeaderTitle: 'text-[#1E1B4B]',
      chatHeaderSubtitle: 'text-[#64748B]',
      chatPillActive: 'bg-[#F97316] text-white font-semibold border-[#F97316] shadow-sm',
      chatPillInactive: 'bg-white border-[#E2E8F0] text-[#334155] hover:bg-[#FAF8FE]',
      chatBubbleStudent: 'bg-gradient-to-r from-[#635EB0] to-[#4F46E5] text-white font-medium shadow-sm',
      chatBubbleTutor: 'bg-white border border-[#E2E8F0] text-[#1E1B4B] shadow-sm',
      chatInput: 'bg-white border-[#CBD5E1] text-[#334155]',
      chatSend: 'bg-[#635EB0] hover:bg-[#4F46E5] text-white',
      sectionAlt: 'bg-transparent',
      sectionBadge: 'bg-[#FDDFC3]/70 text-[#9A3412] border-[#FDBA74] font-bold',
      h2: 'text-[#1E1B4B]',
      h3: 'text-[#1E1B4B]',
      sectionDesc: 'text-[#334155]',
      card: 'bg-white/88 backdrop-blur-md border border-white/70 text-[#1E1B4B] shadow-lg shadow-indigo-950/5 hover:border-[#F97316]/50 hover:shadow-xl',
      cardAlt: 'bg-[#FAF7FD]/90 border border-[#EBE5F8] text-[#1E1B4B]',
      quote: 'text-[#1E1B4B]',
      bodyText: 'text-[#334155]',
      subText: 'text-[#64748B]',
      accentText: 'text-[#EA580C] font-semibold',
      accentBorder: 'border-[#F97316]',
      ambient1: 'radial-gradient(circle, rgba(212,208,245,0.45) 0%, rgba(252,231,240,0.3) 50%, transparent 75%)',
      ambient2: 'radial-gradient(circle, rgba(254,243,199,0.55) 0%, rgba(253,223,195,0.35) 60%, transparent 80%)',
      footerBg: 'bg-[#EBE7FA]/85 border-t border-[#DED7F5] text-[#334155]',
      footerTitle: 'text-[#1E1B4B] font-bold',
      footerLink: 'text-[#334155] hover:text-[#1E1B4B]',
      differenceTutoviaCard: 'border-2 border-[#F97316]/50 bg-gradient-to-b from-[#FFF7ED] via-white to-white text-[#1E1B4B] shadow-xl shadow-orange-500/10',
      differenceTradCard: 'border border-[#E2E8F0] bg-white/80 text-[#334155] shadow-sm',
      highlightBox: 'bg-[#FDDFC3]/60 border border-[#FDBA74] text-[#1E1B4B]',
      modalBg: 'bg-white border-[#E2E8F0] text-[#1E1B4B]',
      ctaGradient: 'linear-gradient(180deg, #D4D0F5 0%, #FCE7F0 45%, #FEF3C7 100%)'
    },
    lumen: {
      id: 'lumen',
      name: 'Lumen',
      tagline: 'Focus. Learn. Grow.',
      heroPhoto: heroPhotoLumen,
      pageBg: 'bg-[#F8FAFC] text-[#0F172A]',
      pageGradient: 'linear-gradient(180deg, #A3DEFF 0%, #BAE6FD 20%, #D0F0FD 45%, #EAF6FB 72%, #F8FAFC 100%)',
      heroOverlay: 'linear-gradient(135deg, rgba(163, 222, 255, 0.22) 0%, rgba(186, 230, 253, 0.16) 35%, rgba(224, 242, 254, 0.10) 70%, transparent 100%)',
      heroReadability: 'radial-gradient(circle at 25% 45%, rgba(255, 255, 255, 0.78) 0%, rgba(240, 249, 255, 0.22) 60%, transparent 85%)',
      navBg: 'bg-[#E1F3FE]/85 border-[#BAE6FD] text-[#0F172A]',
      logoIcon: 'bg-gradient-to-tr from-[#0284C7] to-[#0369A1] text-white',
      logoText: 'text-[#0F172A]',
      navLinks: 'text-[#334155] hover:text-[#0F172A]',
      activeThemePill: 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#0F172A] font-bold shadow-md shadow-amber-500/25',
      inactiveThemePill: 'text-[#475569] hover:text-[#0F172A]',
      autoBadge: 'text-[#0284C7] font-bold',
      heroGreeting: 'bg-[#BAE6FD]/60 text-[#0369A1] border-[#7DD3FC] font-semibold shadow-sm',
      audienceBadge: 'bg-[#E0F2FE]/80 text-[#0284C7] border-[#BAE6FD] font-bold',
      heroHeadline: 'text-[#0F172A]',
      heroSubtitle: 'text-[#0284C7] font-bold',
      heroSupporting: 'text-[#334155]',
      primaryBtn: 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white font-bold shadow-lg shadow-sky-600/25',
      secondaryBtn: 'bg-white hover:bg-[#F0F9FF] text-[#0F172A] font-semibold border border-[#BAE6FD] shadow-sm',
      trustChip: 'bg-white/95 text-[#334155] border-[#BAE6FD] shadow-sm',
      chatCard: 'bg-white/90 backdrop-blur-xl border border-[#BAE6FD] shadow-2xl shadow-slate-900/10',
      chatInner: 'bg-[#F0F9FF] border border-[#BAE6FD]/60',
      chatHeaderBot: 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white',
      chatHeaderTitle: 'text-[#0F172A]',
      chatHeaderSubtitle: 'text-[#475569]',
      chatPillActive: 'bg-[#0284C7] text-white font-semibold border-[#0284C7] shadow-sm',
      chatPillInactive: 'bg-white border-[#CBD5E1] text-[#334155] hover:bg-[#F0F9FF]',
      chatBubbleStudent: 'bg-[#0284C7] text-white shadow-sm font-medium',
      chatBubbleTutor: 'bg-white border border-[#E2E8F0] text-[#0F172A] shadow-sm',
      chatInput: 'bg-white border-[#CBD5E1] text-[#334155]',
      chatSend: 'bg-[#0284C7] text-white',
      sectionAlt: 'bg-transparent',
      sectionBadge: 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD] font-bold',
      h2: 'text-[#0F172A]',
      h3: 'text-[#0F172A]',
      sectionDesc: 'text-[#334155]',
      card: 'bg-white/88 backdrop-blur-md border border-white/80 text-[#0F172A] shadow-lg shadow-slate-900/5 hover:border-[#0284C7]/40 hover:shadow-xl',
      cardAlt: 'bg-[#F0F9FF]/90 border border-[#BAE6FD]/60 text-[#0F172A]',
      quote: 'text-[#0F172A]',
      bodyText: 'text-[#334155]',
      subText: 'text-[#475569]',
      accentText: 'text-[#0284C7] font-semibold',
      accentBorder: 'border-[#0284C7]',
      ambient1: 'radial-gradient(circle, rgba(163,222,255,0.35) 0%, rgba(137,220,250,0.18) 50%, transparent 70%)',
      ambient2: 'radial-gradient(circle, rgba(2,132,199,0.16) 0%, rgba(56,189,248,0.08) 60%, transparent 75%)',
      footerBg: 'bg-[#E1F3FE]/90 border-t border-[#BAE6FD] text-[#334155]',
      footerTitle: 'text-[#0F172A] font-bold',
      footerLink: 'text-[#334155] hover:text-[#0F172A]',
      differenceTutoviaCard: 'border-2 border-[#0284C7]/40 bg-gradient-to-b from-[#F0F9FF] via-white to-white text-[#0F172A] shadow-xl shadow-sky-500/10',
      differenceTradCard: 'border border-[#E2E8F0] bg-[#F8FAFC]/90 text-[#334155] shadow-sm',
      highlightBox: 'bg-[#E0F2FE] border border-[#BAE6FD] text-[#0F172A]',
      modalBg: 'bg-white border-[#E2E8F0] text-[#0F172A]',
      ctaGradient: 'linear-gradient(180deg, #A3DEFF 0%, #E0F2FE 50%, #BAE6FD 100%)'
    },
    twilight: {
      id: 'twilight',
      name: 'Twilight',
      tagline: 'Reflect. Recharge. Rise.',
      heroPhoto: heroPhotoTwilight,
      pageBg: 'bg-[#1C123D] text-[#F8FAFC]',
      pageGradient: 'linear-gradient(180deg, #1C123D 0%, #2F154E 18%, #4A1254 38%, #6B1751 58%, #8E2648 76%, #3E1038 90%, #150A26 100%)',
      heroOverlay: 'linear-gradient(180deg, rgba(28, 18, 61, 0.32) 0%, rgba(47, 21, 78, 0.22) 35%, rgba(110, 23, 81, 0.16) 70%, rgba(234, 88, 12, 0.12) 100%)',
      heroReadability: 'radial-gradient(circle at 25% 45%, rgba(28, 18, 61, 0.65) 0%, rgba(28, 18, 61, 0.22) 60%, transparent 88%)',
      navBg: 'bg-[#1C123D]/85 border-[#4A2D6C]/60 text-[#F8FAFC]',
      logoIcon: 'bg-gradient-to-tr from-[#F97316] via-[#EA580C] to-[#E11D48] text-white',
      logoText: 'text-[#F8FAFC]',
      navLinks: 'text-[#F1EBF5] hover:text-white',
      activeThemePill: 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-bold shadow-md shadow-orange-500/30',
      inactiveThemePill: 'text-[#BDB4CA] hover:text-[#F8FAFC]',
      autoBadge: 'text-[#F97F7E] font-bold',
      heroGreeting: 'bg-[#3B1C4E]/80 text-[#FDBA74] border-[#6D328C] font-semibold shadow-sm',
      audienceBadge: 'bg-[#35164A]/80 text-[#F97F7E] border-[#731E5F] font-bold',
      heroHeadline: 'text-white',
      heroSubtitle: 'text-transparent bg-clip-text bg-gradient-to-r from-[#F97F7E] via-[#F472B6] to-[#C084FC] font-bold',
      heroSupporting: 'text-[#F1EBF5]',
      primaryBtn: 'bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#E11D48] hover:from-[#EA580C] hover:to-[#BE123C] text-white font-bold shadow-lg shadow-orange-500/30',
      secondaryBtn: 'bg-[#2F154E]/90 hover:bg-[#3D1D63] text-white font-semibold border border-[#5E3282] shadow-sm',
      trustChip: 'bg-[#2F154E]/85 text-[#F1EBF5] border-[#5E3282] shadow-sm',
      chatCard: 'bg-[#26133E]/90 backdrop-blur-2xl border border-[#50296E] shadow-2xl shadow-black/50',
      chatInner: 'bg-[#1A0B2C] border border-[#3E1C58]',
      chatHeaderBot: 'bg-gradient-to-r from-[#F97316] to-[#A855F7] text-white',
      chatHeaderTitle: 'text-white',
      chatHeaderSubtitle: 'text-[#CBD5E1]',
      chatPillActive: 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-semibold border-[#F97316] shadow-sm',
      chatPillInactive: 'bg-[#2F154E] border-[#5E3282] text-[#F1EBF5] hover:bg-[#3D1D63]',
      chatBubbleStudent: 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-medium shadow-sm',
      chatBubbleTutor: 'bg-[#26133E] border border-[#50296E] text-white shadow-sm',
      chatInput: 'bg-[#1A0B2C] border-[#50296E] text-[#F1EBF5]',
      chatSend: 'bg-[#F97316] text-white',
      sectionAlt: 'bg-transparent',
      sectionBadge: 'bg-[#3B1C4E] text-[#FDBA74] border-[#6D328C] font-bold',
      h2: 'text-white',
      h3: 'text-white',
      sectionDesc: 'text-[#F1EBF5]',
      card: 'bg-[#2B1647]/85 backdrop-blur-xl border border-[#5C307E]/70 text-[#F8FAFC] shadow-xl shadow-black/45 hover:border-[#F97F7E]/60 hover:shadow-2xl',
      cardAlt: 'bg-[#1E0F33]/90 border border-[#3E1D5B] text-[#F8FAFC]',
      quote: 'text-white',
      bodyText: 'text-[#F1EBF5]',
      subText: 'text-[#C4B7D1]',
      accentText: 'text-[#F97F7E] font-semibold',
      accentBorder: 'border-[#F97F7E]',
      ambient1: 'radial-gradient(ellipse 110% 60% at 50% 10%, rgba(115,30,95,0.45) 0%, rgba(147,51,234,0.3) 45%, transparent 75%)',
      ambient2: 'radial-gradient(ellipse 120% 70% at 50% 90%, rgba(249,115,22,0.42) 0%, rgba(244,63,94,0.28) 45%, transparent 80%)',
      footerBg: 'bg-[#150A26]/95 border-t border-[#3A1E59] text-[#E2E8F0]',
      footerTitle: 'text-white font-bold',
      footerLink: 'text-[#E2E8F0] hover:text-white',
      differenceTutoviaCard: 'border-2 border-[#F97316]/60 bg-gradient-to-b from-[#3E1A52] via-[#24113B] to-[#1C0E31] text-white shadow-2xl shadow-orange-500/20',
      differenceTradCard: 'border border-[#4A2D6C] bg-[#1E0F33]/80 text-[#CBD5E1]',
      highlightBox: 'bg-[#3B1C4E] border border-[#6D328C] text-white',
      modalBg: 'bg-[#26133E] border-[#50296E] text-white',
      ctaGradient: 'linear-gradient(180deg, #1C123D 0%, #6B1751 50%, #150A26 100%)'
    },
    eclipse: {
      id: 'eclipse',
      name: 'Eclipse',
      tagline: 'Rest. Reimagine. Achieve.',
      heroPhoto: heroPhotoEclipse,
      pageBg: 'bg-[#050B1E] text-[#F1F5F9]',
      pageGradient: 'linear-gradient(180deg, #050B1E 0%, #0A1333 22%, #101F52 45%, #182865 68%, #0C1538 88%, #050B1E 100%)',
      heroOverlay: 'linear-gradient(180deg, rgba(5, 11, 30, 0.30) 0%, rgba(10, 19, 51, 0.22) 45%, rgba(24, 40, 101, 0.15) 100%)',
      heroReadability: 'radial-gradient(circle at 25% 45%, rgba(5, 11, 30, 0.65) 0%, rgba(10, 19, 51, 0.22) 60%, transparent 88%)',
      navBg: 'bg-[#0A1333]/85 border-[#1C2C68]/60 text-[#F1F5F9]',
      logoIcon: 'bg-gradient-to-tr from-[#4F46E5] to-[#6366F1] text-white',
      logoText: 'text-[#F1F5F9]',
      navLinks: 'text-[#E2E8F0] hover:text-white',
      activeThemePill: 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-bold shadow-md shadow-indigo-500/25',
      inactiveThemePill: 'text-[#94A3B8] hover:text-[#F1F5F9]',
      autoBadge: 'text-[#82A0DC] font-bold',
      heroGreeting: 'bg-[#101F52]/80 text-[#93C5FD] border-[#253D88] font-semibold shadow-sm',
      audienceBadge: 'bg-[#182865]/80 text-[#A5B4FC] border-[#31489D] font-bold',
      heroHeadline: 'text-white',
      heroSubtitle: 'text-[#82A0DC] font-bold',
      heroSupporting: 'text-[#E2E8F0]',
      primaryBtn: 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white font-bold shadow-lg shadow-indigo-500/25',
      secondaryBtn: 'bg-[#0F1D4A]/90 hover:bg-[#162761] text-white font-semibold border border-[#233B85] shadow-sm',
      trustChip: 'bg-[#0F1D4A] text-[#E2E8F0] border-[#233B85] shadow-sm',
      chatCard: 'bg-[#0A1438]/90 backdrop-blur-2xl border border-[#1E3272] shadow-2xl shadow-black/60',
      chatInner: 'bg-[#060D26] border border-[#142354]',
      chatHeaderBot: 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white',
      chatHeaderTitle: 'text-white',
      chatHeaderSubtitle: 'text-[#CBD5E1]',
      chatPillActive: 'bg-[#4F46E5] text-white font-semibold border-[#4F46E5] shadow-sm',
      chatPillInactive: 'bg-[#0F1D4A] border-[#233B85] text-[#E2E8F0] hover:bg-[#162761]',
      chatBubbleStudent: 'bg-[#4F46E5] text-white font-medium shadow-sm',
      chatBubbleTutor: 'bg-[#0A1438] border border-[#1E3272] text-white shadow-sm',
      chatInput: 'bg-[#060D26] border-[#233B85] text-[#E2E8F0]',
      chatSend: 'bg-[#4F46E5] text-white',
      sectionAlt: 'bg-transparent',
      sectionBadge: 'bg-[#101F52] text-[#82A0DC] border-[#253D88] font-bold',
      h2: 'text-white',
      h3: 'text-white',
      sectionDesc: 'text-[#E2E8F0]',
      card: 'bg-[#0A1438]/85 backdrop-blur-xl border border-[#1E3272]/70 text-[#F1F5F9] shadow-xl shadow-black/50 hover:border-[#6366F1]/50 hover:shadow-2xl',
      cardAlt: 'bg-[#060D26]/90 border border-[#142354] text-[#F1F5F9]',
      quote: 'text-white',
      bodyText: 'text-[#E2E8F0]',
      subText: 'text-[#94A3B8]',
      accentText: 'text-[#82A0DC] font-semibold',
      accentBorder: 'border-[#4F46E5]/60',
      ambient1: 'radial-gradient(circle at 70% 15%, rgba(35,55,141,0.35) 0%, rgba(20,34,88,0.2) 50%, transparent 70%)',
      ambient2: 'radial-gradient(circle at 25% 55%, rgba(79,70,229,0.22) 0%, rgba(16,31,82,0.15) 55%, transparent 75%)',
      footerBg: 'bg-[#050B1E]/95 border-t border-[#162456] text-[#E2E8F0]',
      footerTitle: 'text-white font-bold',
      footerLink: 'text-[#E2E8F0] hover:text-white',
      differenceTutoviaCard: 'border-2 border-[#4F46E5]/60 bg-gradient-to-b from-[#142258] via-[#0A1438] to-[#060D26] text-white shadow-2xl shadow-indigo-500/20',
      differenceTradCard: 'border border-[#1E3272] bg-[#060D26]/80 text-[#CBD5E1]',
      highlightBox: 'bg-[#101F52] border border-[#253D88] text-white',
      modalBg: 'bg-[#0A1438] border-[#1E3272] text-white',
      ctaGradient: 'linear-gradient(180deg, #050B1E 0%, #101F52 50%, #050B1E 100%)'
    }
  };

  // Aliases for backward compatibility
  theme.morning = theme.aurora;
  theme.day = theme.lumen;
  theme.evening = theme.twilight;
  theme.night = theme.eclipse;

  const currentTheme = theme[activePhase] || theme.eclipse;

  const currentTrackConfig = getActiveTrack(activeTrackId);
  const trackPrompts = currentTrackConfig.tutorDoubtPrompts || [];

  // Interactive sample actions in Hero Chat Mockup (Dynamic per Academic Track, preserving universal actions)
  const heroActions = [
    ...(trackPrompts.length > 0 ? [
      {
        id: trackPrompts[0].id,
        icon: '💡',
        label: trackPrompts[0].label,
        scenario: `${currentTrackConfig.shortName} • Concept Foundation`,
        studentMsg: trackPrompts[0].query,
        tutorReplies: trackPrompts[0].answer.split('\n\n').filter(Boolean)
      },
      ...(trackPrompts[1] ? [{
        id: trackPrompts[1].id,
        icon: '🎯',
        label: trackPrompts[1].label,
        scenario: `${currentTrackConfig.shortName} • Practical Application`,
        studentMsg: trackPrompts[1].query,
        tutorReplies: trackPrompts[1].answer.split('\n\n').filter(Boolean)
      }] : [])
    ] : []),
    {
      id: 'hours',
      icon: '⏰',
      label: 'Only 2 hours tonight',
      scenario: 'Daily Pressure & Time Management',
      studentMsg: "I'm exhausted from classes / coaching / office and only have 2 hours tonight. What should I study?",
      tutorReplies: [
        "Let's protect your energy and avoid heavy, unmanageable theory tonight.",
        "• Block 1 (40 min): 3 practical computational problems from your strongest chapter to build easy momentum.",
        "• Break (10 min): Step away from the screen, grab water, no social media.",
        "• Block 2 (50 min): 15 spaced repetition flashcards on essential formulas or section definitions.",
        "You'll sleep knowing you kept your study streak unbroken without crashing!"
      ]
    },
    {
      id: 'fear',
      icon: '🫂',
      label: "Scared I'll fail",
      scenario: 'Mindset & Exam Anxiety Support',
      studentMsg: "Everyone else seems so prepared. I feel like I'm hopelessly behind and scared I'll fail.",
      tutorReplies: [
        "Take a deep breath. What you are feeling is completely normal—almost every commerce & professional student experiences it.",
        "Exam preparation is not a sprint against others; it is a quiet, compounding daily habit. You don't need to master 100% of everything tonight—you only need to win the next 30 minutes.",
        "Let's pick just ONE high-yield concept you feel okay about and master it right now. I'm right here with you."
      ]
    },
    {
      id: 'plan',
      icon: '🗓️',
      label: 'Adaptive revision plan',
      scenario: 'Syllabus Architecture & Phasing',
      studentMsg: "How should I structure my revision rounds before my exam attempt?",
      tutorReplies: [
        "Here is the proven 3-Tier Revision Architecture:",
        "• Round 1 (60% time): Core concept completion + illustrative textbook/ICAI numericals.",
        "• Round 2 (25% time): Past Year Questions (PYQs) + Revision Test Papers (RTPs) + active recall.",
        "• Round 3 (15% time): Full 3-hour Mock Exam Papers under strict timed conditions.",
        "Tutovia adapts these dates automatically if classes run late or you ever need an off-day!"
      ]
    }
  ];

  // Auto-align active hero action when track changes
  useEffect(() => {
    if (heroActions.length > 0) {
      setHeroActiveAction(heroActions[0].id);
    }
  }, [activeTrackId]);

  const handleHeroActionClick = (actionId) => {
    if (heroActiveAction === actionId) return;
    setHeroTyping(true);
    setHeroActiveAction(actionId);
    setTimeout(() => {
      setHeroTyping(false);
    }, 280);
  };

  const currentHeroAction = heroActions.find(a => a.id === heroActiveAction) || heroActions[0];

  // Dynamic phase encouragements (Merged from V1 companion)
  const encouragements = {
    aurora: "Every sunrise brings a clean slate. You don't have to finish everything today—just win the next study block.",
    lumen: "Your momentum is building. Stay with this problem until the concept clicks. You're closer than you think.",
    twilight: "Take a breath. You showed up and put in honest effort today after articleship or classes. Let's consolidate your wins.",
    eclipse: "Your brain continues cementing today's formulas while you sleep. Give yourself permission to truly rest."
  };

  // Stage 1: Student Problem Cards (Interactive Selectable Struggles)
  const studentProblems = [
    {
      id: 'start',
      emoji: '🧭',
      icon: Compass,
      tag: 'Intelligent Guidance',
      category: 'Decision Paralysis',
      quote: "“I don't know where to start.”",
      shortLabel: "I don't know where to start.",
      description: "Staring at hundreds of pages across vast syllabi, wasting the first 45 minutes of every morning wondering whether to revise Accounting Standards or tax amendments.",
      solutionTitle: 'Personalized Daily Direction',
      solution: "Tutovia maps the entire ICAI syllabus against your exam attempt date, serving one clear, prioritized study block every morning so you start studying in 30 seconds.",
      actionLabel: "See How Tutovia Plans Your Day",
      actionTarget: "modes",
      mockup: {
        badge: 'Morning Study Block',
        title: 'Direct Tax: Capital Gains (Sec 54)',
        meta: '2h Slot • High-Yield (8-10 Marks Target)',
        status: 'Auto-mapped for your attempt date'
      }
    },
    {
      id: 'concept',
      emoji: '🧠',
      icon: Brain,
      tag: 'Judgment-Free Mentorship',
      category: 'Conceptual Roadblocks',
      quote: "“I don't understand this topic.”",
      shortLabel: "I don't understand this topic.",
      description: "Rereading the same dense standard or section 5 times without it clicking, but hesitating to ask coaching teachers because it feels like a basic question.",
      solutionTitle: 'Conversational First-Principles AI',
      solution: "Ask without hesitation. Tutovia breaks down difficult provisions into simple, real-world analogies until the core concept clicks with total clarity.",
      actionLabel: "Try An AI Explanation",
      actionTarget: "sandbox-ai",
      mockup: {
        badge: 'First-Principles Dialogue',
        title: 'AS 10: Component Accounting',
        meta: '“Think of an airplane: engine overhaul vs fuselage...”',
        status: 'Step-by-step intuitive breakdown'
      }
    },
    {
      id: 'time',
      emoji: '⏰',
      icon: Calendar,
      tag: 'Guilt-Free Planning',
      category: 'Articleship & Rigid Schedules',
      quote: "“I don't have enough time.”",
      shortLabel: "I don't have enough time.",
      description: "Balancing coaching lectures, college, or intense articleship hours. Missing one day triggers a backlog cascade, causing the entire timetable to collapse.",
      solutionTitle: 'Adaptive AI Rescheduling',
      solution: "When life gets in the way, Tutovia gently recalculates what matters most with zero guilt, zero shame, and zero backlog anxiety.",
      actionLabel: "Explore Adaptive Timetable",
      actionTarget: "sandbox-timetable",
      mockup: {
        badge: 'Dynamic Reschedule Engine',
        title: 'Articleship Running Late (+90m)',
        meta: 'Non-critical chapters smoothly shifted to Saturday',
        status: 'Zero backlog guilt'
      }
    },
    {
      id: 'consistency',
      emoji: '🔥',
      icon: Flame,
      tag: 'Sustainable Habits',
      category: 'Study Fatigue & Burnout',
      quote: "“I'm losing consistency and motivation.”",
      shortLabel: "I'm losing consistency.",
      description: "Studying in isolation for months, starting with unsustainable 14-hour marathons, crashing by week two, and anxiety whispering whether efforts will translate into marks.",
      solutionTitle: 'Mindful Pacing & Micro-Streaks',
      solution: "Designed around sustainable 25-minute Pomodoro sprints and daily streak milestones that honor realistic stamina over exhausting burnout.",
      actionLabel: "Start Your Study Plan",
      actionTarget: "waitlist",
      mockup: {
        badge: 'Habit & Stamina Protection',
        title: '14-Day Consistency Pacing Active',
        meta: '25-min Sprint • 5-min Restorative Break',
        status: 'Sustained momentum over burnout'
      }
    },
    {
      id: 'weakness',
      emoji: '🎯',
      icon: Target,
      tag: 'Objective Clarity',
      category: 'Invisible Exam Blind Spots',
      quote: "“I don't know where I'm actually weak.”",
      shortLabel: "I don't know where I'm weak.",
      description: "Rereading familiar chapters because they feel comfortable, while high-weightage weak chapters quietly remain unrevised before exams.",
      solutionTitle: 'Diagnostic Mastery Radar',
      solution: "Heatmaps track chapter retention, quiz accuracy, and PYQ coverage so you know exactly which 20% of topics yield 80% of exam marks.",
      actionLabel: "Test ICAI Passing Simulator",
      actionTarget: "sandbox-sim",
      mockup: {
        badge: 'Aggregate Diagnostic Radar',
        title: 'Taxation: 45/100 (Below 50% Group Target)',
        meta: 'Set-off Required: Advanced Accounting target +15',
        status: 'High-yield compensatory balance'
      }
    },
    {
      id: 'overwhelmed',
      emoji: '📚',
      icon: BookOpen,
      tag: 'Long-Term Retention',
      category: 'Monolithic Syllabus Mountain',
      quote: "“I feel overwhelmed by the syllabus.”",
      shortLabel: "I feel overwhelmed by the syllabus.",
      description: "Staring at multi-volume modules of Corporate Law, Audit, and Taxation wondering how anyone retains thousands of sections, case laws, and Standards on exam day.",
      solutionTitle: 'SM-2 Spaced Repetition Decks',
      solution: "Core formulas, case laws, and Standards are distilled into active recall cards scheduled right before your brain forgets them.",
      actionLabel: "Explore Preparation Engines",
      actionTarget: "engines",
      mockup: {
        badge: 'Spaced Recall Engine',
        title: 'CARO 2020: 21 Reporting Clauses',
        meta: 'Active recall scheduled before the forgetting curve',
        status: 'Long-term retention locked'
      }
    }
  ];

  // Complete Prep Ecosystem: 4 Intentional Phases (Credible status-badged architecture)
  const prepEcosystemPhases = [
    {
      phase: 'Phase 1',
      title: 'Planning & Rhythm',
      modeMatch: 'Aurora (Morning)',
      time: '05:00 AM – 11:59 AM',
      icon: Calendar,
      color: 'text-amber-500',
      badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
      status: 'Available in Beta',
      statusColor: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400',
      headline: 'Decision clarity before lectures or articleship begin',
      description: 'Translates the vast ICAI syllabus into realistic daily blocks tailored to your exam attempt date.',
      capabilities: [
        'Adaptive AI Rescheduling with zero backlog guilt',
        'ICAI New Syllabus Chapter & Weightage Mapping',
        '12-Hour Mindful Agenda matching natural stamina'
      ]
    },
    {
      phase: 'Phase 2',
      title: 'Focus & Concept Mastery',
      modeMatch: 'Lumen (Day)',
      time: '12:00 PM – 04:59 PM',
      icon: Bot,
      color: 'text-sky-500',
      badgeBg: 'bg-sky-500/10 border-sky-500/20 text-sky-500',
      status: 'Available in Beta',
      statusColor: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400',
      headline: 'Deep comprehension without fear of basic questions',
      description: 'Conversational first-principles doubt solving that unpacks complex standards using everyday analogies.',
      capabilities: [
        'Context-Aware First-Principles CA AI Tutor',
        'Zen Study Desk & 25-min Pomodoro focus sprints',
        'Instant 24/7 conceptual doubt solving'
      ]
    },
    {
      phase: 'Phase 3',
      title: 'Testing & Simulator',
      modeMatch: 'Twilight (Evening)',
      time: '05:00 PM – 08:59 PM',
      icon: Target,
      color: 'text-orange-500',
      badgeBg: 'bg-orange-500/10 border-orange-500/20 text-orange-500',
      status: 'Interactive Preview',
      statusColor: 'bg-sky-500/10 border-sky-500/25 text-sky-600 dark:text-sky-400',
      headline: 'Objective exam accuracy & memory retention',
      description: 'Calculates group aggregate set-offs and exposes blind spots with high-yield past paper analytics.',
      capabilities: [
        'ICAI 40/50 Passing & Set-Off Aggregate Simulator',
        'Interactive Past Year Questions (PYQ) & RTP drills',
        'Subject Mastery Heatmaps pinpointing exam blind spots'
      ]
    },
    {
      phase: 'Phase 4',
      title: 'Reflect & Wellbeing',
      modeMatch: 'Eclipse (Night)',
      time: '09:00 PM – 04:59 AM',
      icon: Heart,
      color: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      status: 'Available After Sign-Up',
      statusColor: 'bg-purple-500/10 border-purple-500/25 text-purple-600 dark:text-purple-400',
      headline: 'Restorative wind-down & mental stamina protection',
      description: 'Grounds exam anxiety and previews tomorrow so your mind can completely power down for restorative sleep.',
      capabilities: [
        'Compassionate Mindset Guidance & Exam Anxiety Grounding',
        'Tomorrow\'s Calm Blueprint so your mind can switch off',
        'Burnout protection honoring sleep as vital prep'
      ]
    }
  ];

  // Test Drive The Engines: Interactive Queries (Merged from V1 Sandbox)
  const sandboxQueries = [
    { 
      q: "Explain Section 54 Capital Gains exemption simply", 
      a: "Under Section 54, if an individual/HUF sells a Long-Term residential house and invests the capital gains into 1 new house (or 2 houses if gains <= Rs. 2 Crores, once in a lifetime), the capital gains are exempt. The new house must be purchased within 1 yr before / 2 yrs after transfer, or constructed within 3 yrs!" 
    },
    { 
      q: "Ind AS 115: 5-step model for revenue recognition", 
      a: "The 5 steps are: (1) Identify the contract with the customer, (2) Identify separate performance obligations, (3) Determine the transaction price, (4) Allocate the transaction price to obligations, and (5) Recognize revenue when (or as) the entity satisfies each performance obligation!" 
    },
    { 
      q: "Difference between Qualified vs Adverse Opinion (SA 705)", 
      a: "Qualified Opinion: Misstatements are material but NOT pervasive to the financial statements. Adverse Opinion: Misstatements are BOTH material AND pervasive, rendering the entire financial statements misleading overall." 
    },
    { 
      q: "CARO 2020: Physical inventory verification clause", 
      a: "Under Clause (ii)(a), the auditor must report whether physical verification of inventory was conducted by management at reasonable intervals, and whether discrepancies of 10% or more in aggregate for each class of inventory were properly dealt with in books of account." 
    }
  ];

  // Test Drive The Engines: 12-Hour Study Agenda (Merged from V1 Sandbox)
  const sandboxTimetable = [
    { time: '07:00 AM – 09:30 AM', title: 'Deep Work: Advanced Accounting (AS 28)', type: 'Study', tag: 'High Focus' },
    { time: '09:30 AM – 10:30 AM', title: 'Breakfast & Mindful Stretch Break', type: 'Break', tag: 'Rest' },
    { time: '10:30 AM – 01:30 PM', title: 'Direct Tax Laws: Capital Gains & Deductions', type: 'Study', tag: 'Core Theory' },
    { time: '02:00 PM – 05:00 PM', title: 'Live Coaching Lecture / Articleship Slot', type: 'Class', tag: 'Fixed Slot' },
    { time: '06:00 PM – 08:30 PM', title: 'Corporate Laws: Share Capital & Debentures', type: 'Study', tag: 'Active Recall' },
    { time: '09:00 PM – 10:00 PM', title: 'Daily Diagnostic MCQ Practice Quiz', type: 'Mock', tag: 'Diagnostic' },
  ];

  // Stage 3: Merged "A Day With Tutovia — Four Modes That Match Your Natural Rhythm"
  // Unifies circadian timeline and all pedagogical capabilities under each time window
  const circadianModes = [
    {
      id: 'aurora',
      name: 'Aurora',
      label: 'Morning',
      purpose: 'Plan with clarity',
      icon: Sunrise,
      time: '05:00 AM – 11:59 AM',
      progression: 'Fresh beginnings. Brighter days.',
      greetingTime: '07:00 AM',
      quote: '“Good morning. You have two hours before your first lecture. Ready to make today count?”',
      atmosphere: 'Soft sunrise glow, lavender-peach horizon, and calm morning clarity.',
      features: [
        {
          icon: Calendar,
          name: 'Smart Study Planning',
          desc: 'Realistic bite-sized study blocks tailored to your morning energy and daily schedule.'
        },
        {
          icon: Target,
          name: 'Daily Priority Focus',
          desc: 'Pinpoints your single highest-yield revision goal before lectures or articleship begin.'
        },
        {
          icon: Sunrise,
          name: 'Gentle Wake-Up Guidance',
          desc: 'Starts your day with clear direction and momentum—zero guilt or overwhelming panic.'
        }
      ]
    },
    {
      id: 'lumen',
      name: 'Lumen',
      label: 'Day',
      purpose: 'Learn with focus',
      icon: Sun,
      time: '12:00 PM – 04:59 PM',
      progression: 'Focus. Learn. Grow.',
      greetingTime: '01:30 PM',
      quote: '“Let\'s focus on what matters today. Tackled 3 tough concepts during lunch? Let\'s verify.”',
      atmosphere: 'Crisp daylight blue, maximum-contrast workspace for deep uninterrupted focus.',
      features: [
        {
          icon: Brain,
          name: 'Personal AI Tutor',
          desc: 'Step-by-step analogies, intuitive examples, and judgment-free conceptual dialogue.'
        },
        {
          icon: MessageSquare,
          name: '24/7 Doubt Solving',
          desc: 'Clear foundational queries instantly without ever worrying about asking "silly" questions.'
        },
        {
          icon: Timer,
          name: 'Mindful Focus & Pomodoro',
          desc: 'Structured focus sprints, anti-glare reading, and timely restorative breaks.'
        }
      ]
    },
    {
      id: 'twilight',
      name: 'Twilight',
      label: 'Evening',
      purpose: 'Practice and reflect',
      icon: Sunset,
      time: '05:00 PM – 08:59 PM',
      progression: 'Reflect. Recharge. Rise.',
      greetingTime: '06:45 PM',
      quote: '“You\'ve completed 78% of today\'s plan after articleship. Let\'s consolidate.”',
      atmosphere: 'Rich sunset purple-rose glow, warm evening ambient lighting.',
      features: [
        {
          icon: RefreshCw,
          name: 'Spaced Active Recall',
          desc: 'Retain what you learned today through targeted, low-friction recall drills.'
        },
        {
          icon: TrendingUp,
          name: 'Learning Journey Tracker',
          desc: 'Consolidate progress, celebrate consistency, and see syllabus completion climb.'
        },
        {
          icon: Coffee,
          name: 'Post-Work Decompression',
          desc: 'Tailored 45-minute revision blocks designed specifically for tired evening minds.'
        }
      ]
    },
    {
      id: 'eclipse',
      name: 'Eclipse',
      label: 'Night',
      purpose: 'Wind down without guilt',
      icon: Moon,
      time: '09:00 PM – 04:59 AM',
      progression: 'Rest. Reimagine. Achieve.',
      greetingTime: '10:30 PM',
      quote: '“You\'ve done enough for today. Let\'s prepare tomorrow\'s plan and get restorative rest.”',
      atmosphere: 'Deep midnight navy, soothing moonlight contrast to protect eyes and wind down.',
      features: [
        {
          icon: Heart,
          name: 'Supportive Mindset Guidance',
          desc: 'Empathetic reassurance and grounding perspective when anxiety or self-doubt strikes.'
        },
        {
          icon: CheckCircle2,
          name: 'Tomorrow\'s Calm Blueprint',
          desc: 'Auto-schedules tomorrow\'s top task so your brain can completely switch off.'
        },
        {
          icon: Moon,
          name: 'Burnout Protection & Rest',
          desc: 'Gentle reminders that restorative sleep is an essential part of the syllabus.'
        }
      ]
    }
  ];

  // Smooth scroll handler
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Context-aware struggle action router
  const handleStruggleAction = (target) => {
    if (target === 'sandbox-ai') {
      setSandboxTab('ai');
      scrollToSection('sandbox');
    } else if (target === 'sandbox-sim') {
      setSandboxTab('simulator');
      scrollToSection('sandbox');
    } else if (target === 'sandbox-timetable') {
      setSandboxTab('timetable');
      scrollToSection('sandbox');
    } else if (target === 'waitlist' || target === 'signup') {
      navigate('/signup');
    } else {
      scrollToSection(target);
    }
  };

  // Open Coming Soon waitlist modal
  const handleOpenComingSoon = () => {
    setComingSoonSubmitted(false);
    setComingSoonOpen(true);
  };

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-all duration-700 ${currentTheme.pageBg}`}
      style={{ backgroundImage: currentTheme.pageGradient }}
    >

      {/* Dynamic Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.04, 1], opacity: [0.35, 0.5, 0.35] }} 
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[10%] w-[750px] h-[750px] rounded-full blur-[140px] transition-all duration-1000"
          style={{ background: currentTheme.ambient1 }}
        />
        <motion.div 
          animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.45, 0.25] }} 
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-10%] right-[10%] w-[850px] h-[850px] rounded-full blur-[160px] transition-all duration-1000"
          style={{ background: currentTheme.ambient2 }}
        />

        {/* Cinematic Sunset Horizon Layer for Twilight */}
        {activePhase === 'twilight' && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-[600px] pointer-events-none transition-all duration-1000"
            style={{
              background: 'radial-gradient(ellipse 140% 70% at 50% 100%, rgba(249,115,22,0.38) 0%, rgba(217,70,239,0.22) 35%, transparent 75%)'
            }}
          />
        )}
      </div>

      {/* ======================================================== */}
      {/* NAVIGATION BAR */}
      {/* ======================================================== */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
          isScrolled 
            ? `shadow-lg shadow-black/5 ${currentTheme.navBg}` 
            : `border-transparent ${currentTheme.navBg}`
        }`}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
          
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 whitespace-nowrap"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105 text-white ${currentTheme.logoIcon} shrink-0`}>
              <GraduationCap size={20} />
            </div>
            <span className={`text-xl font-heading font-black tracking-tight leading-none ${currentTheme.logoText}`}>Tutovia</span>
          </div>

          {/* Desktop Navigation Links (Product Discovery System) */}
          <div className={`hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-semibold ${currentTheme.navLinks}`}>
            <button 
              onClick={() => scrollToSection('modes')} 
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeSection === 'modes' 
                  ? `${currentTheme.accentText} bg-slate-500/10 shadow-sm font-bold` 
                  : 'opacity-80 hover:opacity-100 hover:bg-slate-500/5'
              }`}
            >
              Study Modes
            </button>
            <button 
              onClick={() => setSubjectHubOpen(true)}
              className="px-2.5 xl:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap opacity-80 hover:opacity-100 hover:bg-slate-500/5 flex items-center gap-1.5"
            >
              <BookOpen size={14} className="text-indigo-500" />
              <span>Subject Hub</span>
            </button>
            <button 
              onClick={() => setPeerStudyRoomOpen(true)}
              className="px-2.5 xl:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap opacity-80 hover:opacity-100 hover:bg-slate-500/5 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Peer Library</span>
            </button>
            <button 
              onClick={() => setFlashcardsOpen(true)}
              className="px-2.5 xl:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap opacity-80 hover:opacity-100 hover:bg-slate-500/5 flex items-center gap-1.5"
            >
              <Layers size={14} className="text-amber-500" />
              <span>Flashcards</span>
            </button>
            <button 
              onClick={() => scrollToSection('engines')} 
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeSection === 'engines' 
                  ? `${currentTheme.accentText} bg-slate-500/10 shadow-sm font-bold` 
                  : 'opacity-80 hover:opacity-100 hover:bg-slate-500/5'
              }`}
            >
              Prep Engines
            </button>
            <button 
              onClick={() => scrollToSection('sandbox')} 
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeSection === 'sandbox' 
                  ? `${currentTheme.accentText} bg-slate-500/10 shadow-sm font-bold` 
                  : 'opacity-80 hover:opacity-100 hover:bg-slate-500/5'
              }`}
            >
              Live Demo
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeSection === 'about' 
                  ? `${currentTheme.accentText} bg-slate-500/10 shadow-sm font-bold` 
                  : 'opacity-80 hover:opacity-100 hover:bg-slate-500/5'
              }`}
            >
              Trust & Ethics
            </button>
          </div>

          {/* Right Nav: Time-based Switcher & CTAs */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-3 shrink-0">
            
            {/* Single Compact Theme Control with Dropdown (Reduced Transparency / 100% Solid) */}
            <div className="relative shrink-0" ref={themeMenuRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                aria-expanded={themeMenuOpen}
                aria-label="Theme selector"
                title={`Current theme: ${currentPhaseInfo.name}${isAuto ? ' (Auto time-based)' : ' (Manual)'}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-md cursor-pointer whitespace-nowrap ${
                  isDarkTheme 
                    ? 'bg-[#0F172A] text-white border-slate-700 hover:bg-[#1E293B]' 
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isAuto ? (
                  <Sparkles size={13} className="text-amber-500 shrink-0" />
                ) : (
                  activePhase === 'aurora' ? <Sunrise size={13} className="text-amber-500 shrink-0" /> :
                  activePhase === 'lumen' ? <Sun size={13} className="text-blue-500 shrink-0" /> :
                  activePhase === 'twilight' ? <Sunset size={13} className="text-pink-500 shrink-0" /> :
                  <Moon size={13} className="text-indigo-400 shrink-0" />
                )}
                <span className="font-bold whitespace-nowrap">
                  {isAuto ? `${currentPhaseInfo.name} · Auto` : currentPhaseInfo.name}
                </span>
                <ChevronDown size={12} className={`opacity-80 transition-transform duration-200 shrink-0 ${themeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Compact Dropdown Menu (100% Solid Opaque) */}
              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-64 rounded-2xl border-2 p-3 shadow-2xl z-50 ${
                      isDarkTheme 
                        ? 'bg-[#0B1120] border-slate-700 text-slate-50 shadow-black/90' 
                        : 'bg-white border-slate-300 text-slate-900 shadow-slate-900/25'
                    }`}
                  >
                    <div className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Appearance
                    </div>

                    {/* Auto Option */}
                    <button
                      onClick={() => { selectPhase('auto'); setThemeMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all mb-1 border ${
                        isAuto 
                          ? currentTheme.activeThemePill 
                          : isDarkTheme ? 'hover:bg-slate-800 border-transparent text-slate-200' : 'hover:bg-slate-100 border-transparent text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles size={14} className={isAuto ? '' : 'text-amber-500'} />
                        <div className="text-left">
                          <div className="font-bold flex items-center gap-1.5">
                            <span>Auto</span>
                            <span className="text-[10px] opacity-75 font-normal">(Local Time)</span>
                          </div>
                          <div className="text-[10px] opacity-70">Detects device clock</div>
                        </div>
                      </div>
                      {isAuto && <Check size={14} className="shrink-0" />}
                    </button>

                    <div className={`my-1.5 border-t ${isDarkTheme ? 'border-slate-800' : 'border-slate-200'}`} />

                    {/* 4 Named Modes */}
                    {[
                      { id: 'aurora', name: 'Aurora', time: '05:00 AM – 11:59 AM', icon: Sunrise, color: 'text-amber-500' },
                      { id: 'lumen', name: 'Lumen', time: '12:00 PM – 04:59 PM', icon: Sun, color: 'text-blue-500' },
                      { id: 'twilight', name: 'Twilight', time: '05:00 PM – 08:59 PM', icon: Sunset, color: 'text-pink-500' },
                      { id: 'eclipse', name: 'Eclipse', time: '09:00 PM – 04:59 AM', icon: Moon, color: 'text-indigo-400' }
                    ].map(item => {
                      const isSelected = !isAuto && activePhase === item.id;
                      const isCurrentlyActiveInAuto = isAuto && activePhase === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { selectPhase(item.id); setThemeMenuOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-all mb-1 border ${
                            isSelected 
                              ? currentTheme.activeThemePill 
                              : isDarkTheme ? 'hover:bg-slate-800 border-transparent text-slate-200' : 'hover:bg-slate-100 border-transparent text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <item.icon size={14} className={isSelected ? '' : item.color} />
                            <div className="text-left">
                              <div className="font-bold flex items-center gap-1">
                                <span>{item.name}</span>
                                {isCurrentlyActiveInAuto && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-500/20 font-bold">Active</span>
                                )}
                              </div>
                              <div className="text-[10px] opacity-70 font-mono">{item.time}</div>
                            </div>
                          </div>
                          {isSelected && <Check size={14} className="shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Status & Login Link */}
            {user ? (
              <div className="flex items-center gap-1.5 xl:gap-2">
                <div 
                  className={`text-xs xl:text-sm font-bold px-3 py-1.5 flex items-center gap-1.5 rounded-full border-2 shrink-0 shadow-sm ${
                    isDarkTheme 
                      ? 'bg-[#0F172A] text-white border-slate-700' 
                      : 'bg-white text-slate-900 border-slate-300'
                  }`}
                  title={user.email}
                >
                  <User size={14} className="shrink-0 text-emerald-500" />
                  <span className="max-w-[110px] truncate">{user.user_metadata?.name || user.name || user.email?.split('@')[0] || 'Account'}</span>
                </div>
                <button
                  onClick={logout}
                  className={`p-1.5 rounded-full border-2 text-slate-400 hover:text-red-500 hover:border-red-400 transition-colors ${
                    isDarkTheme ? 'bg-[#0F172A] border-slate-700' : 'bg-white border-slate-300'
                  }`}
                  title="Sign Out"
                  aria-label="Sign out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className={`text-xs xl:text-sm font-bold transition-all px-3 py-1.5 flex items-center gap-1.5 rounded-full border-2 focus-visible:ring-2 focus-visible:ring-indigo-400 shrink-0 whitespace-nowrap shadow-sm hover:shadow ${
                  isDarkTheme 
                    ? 'bg-[#0F172A] text-white border-slate-700 hover:bg-[#1E293B]' 
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <User size={14} className="shrink-0 text-indigo-500" />
                <span>Sign In</span>
              </button>
            )}
            
            {/* Primary Nav CTA: Try Tutovia Free */}
            <button 
              onClick={() => navigate(user ? '/hub' : '/signup')}
              className={`text-xs xl:text-sm font-bold px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-indigo-400 shrink-0 whitespace-nowrap shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${currentTheme.primaryBtn}`}
            >
              <span>{user ? 'My Account' : 'Try Tutovia Free'}</span>
              <ArrowRight size={14} className="shrink-0" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2 shrink-0">
            <button 
              onClick={() => navigate(user ? '/hub' : '/login')}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 whitespace-nowrap shadow-sm ${
                isDarkTheme 
                  ? 'bg-[#0F172A] text-white border-slate-700 hover:bg-[#1E293B]' 
                  : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1">
                <User size={12} className={user ? "text-emerald-500" : "text-indigo-500"} />
                <span>{user ? (user.user_metadata?.name || user.name || 'Account') : 'Sign In'}</span>
              </span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border-2 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isDarkTheme ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Scroll / Reading Progress Indicator (Isolated RAF DOM updates, 0 parent re-renders) */}
        <ReadingProgressBar color={currentPhaseInfo.primary} />

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-b px-4 py-5 space-y-4 shadow-xl ${
                isDarkTheme ? 'bg-[#0B1120] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex flex-col gap-1.5 font-medium">
                <button
                  onClick={() => { setMobileMenuOpen(false); setSubjectHubOpen(true); }}
                  className="text-left py-2 px-3 rounded-lg text-sm font-semibold transition-all border flex items-center justify-between bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span>Unified Subject Hub</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase">Open</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); setPeerStudyRoomOpen(true); }}
                  className="text-left py-2 px-3 rounded-lg text-sm font-semibold transition-all border flex items-center justify-between bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                >
                  <span className="flex items-center gap-2">
                    <Users size={16} />
                    <span>Peer Study Room (Live)</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); setFlashcardsOpen(true); }}
                  className="text-left py-2 px-3 rounded-lg text-sm font-semibold transition-all border flex items-center justify-between bg-amber-500/10 border-amber-500/30 text-amber-400"
                >
                  <span className="flex items-center gap-2">
                    <Layers size={16} />
                    <span>Spaced Flashcards</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase">Recall</span>
                </button>
                {[
                  { id: 'modes', label: 'Study Modes' },
                  { id: 'engines', label: 'Preparation Engines' },
                  { id: 'sandbox', label: 'Live Sandbox & AI Demo' },
                  { id: 'story', label: 'Founder Story' },
                  { id: 'about', label: 'Trust & Ethics' },
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      if (item.tab) setSandboxTab(item.tab);
                      scrollToSection(item.id);
                    }}
                    className={`text-left py-2 px-3 rounded-lg text-sm font-semibold transition-all border flex items-center justify-between ${
                      activeSection === item.id 
                        ? `${currentTheme.activeThemePill}` 
                        : isDarkTheme ? 'bg-slate-900/60 border-slate-800 text-slate-200 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeSection === item.id && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                  </button>
                ))}
              </div>

              {/* Time Theme Selector on Mobile */}
              <div className="pt-2 border-t border-slate-500/20">
                <div className={`flex items-center justify-between mb-2 text-xs font-semibold ${currentTheme.subText}`}>
                  <span>Theme & Lighting</span>
                  {isAuto && (
                    <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                      <Sparkles size={11} /> Auto Synced
                    </span>
                  )}
                </div>

                {/* Auto Toggle / Button */}
                <button
                  onClick={() => selectPhase('auto')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold mb-2 transition-all border ${
                    isAuto ? currentTheme.activeThemePill : currentTheme.card
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className={isAuto ? '' : 'text-amber-500'} />
                    <span>Auto (Follows local time)</span>
                  </div>
                  {isAuto && <Check size={14} />}
                </button>

                {/* 4 Named Modes Grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'aurora', label: 'Aurora', time: '5 AM – 12 PM', icon: Sunrise },
                    { id: 'lumen', label: 'Lumen', time: '12 PM – 5 PM', icon: Sun },
                    { id: 'twilight', label: 'Twilight', time: '5 PM – 9 PM', icon: Sunset },
                    { id: 'eclipse', label: 'Eclipse', time: '9 PM – 5 AM', icon: Moon },
                  ].map(p => {
                    const isSelected = !isAuto && activePhase === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => selectPhase(p.id)}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all border ${
                          isSelected ? currentTheme.activeThemePill : currentTheme.card
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <p.icon size={13} />
                          <div className="text-left">
                            <div className="font-bold">{p.label}</div>
                            <div className="text-[9px] opacity-70">{p.time}</div>
                          </div>
                        </div>
                        {isSelected && <Check size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate(user ? '/hub' : '/signup'); }}
                  className={`w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 ${currentTheme.primaryBtn}`}
                >
                  <span>{user ? 'My Account' : 'Try Tutovia Free'}</span>
                  <ArrowRight size={16} />
                </button>
                {user && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="w-full text-xs font-semibold py-2 text-rose-500 flex items-center justify-center gap-1.5"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pt-16 relative z-10">
        
        {/* ======================================================== */}
        {/* STAGE 1: KNOW — HERO SECTION & LIVE PREVIEW */}
        {/* ======================================================== */}
        <section id="hero" className="relative pt-10 pb-14 md:pt-14 md:pb-16 px-4 overflow-hidden min-h-[82vh] lg:min-h-[84vh] flex items-center">
          {/* 1. Atmospheric Photographic Hero Background (Study Desk beside Window changing with theme - Full View) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[
              { id: 'aurora', src: heroPhotoAurora, alt: 'Tutovia study desk at sunrise (Aurora)' },
              { id: 'lumen', src: heroPhotoLumen, alt: 'Tutovia study desk at midday (Lumen)' },
              { id: 'twilight', src: heroPhotoTwilight, alt: 'Tutovia study desk at sunset (Twilight)' },
              { id: 'eclipse', src: heroPhotoEclipse, alt: 'Tutovia study desk at night (Eclipse)' }
            ].map(photo => {
              const isActive = activePhase === photo.id;
              if (!isActive && !preloadAllHeroPhotos) return null;
              return (
                <img 
                  key={photo.id}
                  src={photo.src} 
                  alt={photo.alt} 
                  loading={isActive ? "eager" : "lazy"}
                  decoding={isActive ? "sync" : "async"}
                  fetchPriority={isActive ? "high" : "low"}
                  className={`absolute inset-0 w-full h-full object-cover object-[center_62%] filter saturate-[1.05] transition-opacity duration-1000 ${
                    isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
                  }`}
                />
              );
            })}
            {/* 2. Theme-Adaptive Sophisticated Gradient Overlay */}
            <div 
              className="absolute inset-0 transition-all duration-700 pointer-events-none z-10" 
              style={{ background: currentTheme.heroOverlay }}
            />
            {/* 3. Subtle Local Readability Layer */}
            <div 
              className="absolute inset-0 transition-all duration-700 pointer-events-none z-10" 
              style={{ background: currentTheme.heroReadability }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Core Value Proposition */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="lg:col-span-7 text-center lg:text-left">
              
              {/* Contextual Badge */}
              <motion.div variants={fadeIn} className="flex justify-center lg:justify-start mb-3">
                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold shadow-sm ${currentTheme.audienceBadge}`}>
                  <GraduationCap size={15} />
                  <span>For Students, By Students • Commerce & CA Professional Journey</span>
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 variants={fadeIn} className={`text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight mb-4 leading-[1.12] ${currentTheme.heroHeadline}`}>
                For Students,<br className="hidden sm:inline" /> By Students.
              </motion.h1>

              {/* Concise Value Proposition & Mission */}
              <motion.p variants={fadeIn} className={`text-lg sm:text-xl md:text-2xl mb-3 leading-relaxed font-bold ${currentTheme.heroSubtitle}`}>
                Built by students who have walked the path — the empathetic AI study partner that grows with learners across their entire Commerce & Professional journey.
              </motion.p>

              {/* Supporting Line */}
              <motion.p variants={fadeIn} className={`text-sm sm:text-base mb-5 max-w-2xl leading-relaxed ${currentTheme.heroSupporting}`}>
                From Class 11 & 12 fundamentals to CA Foundation, Intermediate, and Final mastery. Peer-to-peer, realistic, and calibrated to actual student pressure and daily routines.
              </motion.p>

              {/* Multi-Stage Academic Track / Stage Selector */}
              <motion.div variants={fadeIn} className="mb-6 flex flex-col items-center lg:items-start w-full">
                <div className="text-[11px] font-black uppercase tracking-wider opacity-60 mb-1.5 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-indigo-500" />
                  <span>Select Academic Track (Adaptive AI & Schedule Preview):</span>
                </div>
                <AcademicTrackSelector 
                  activeTrackId={activeTrackId}
                  onSelectTrack={(id) => {
                    setActiveTrackId(id);
                    saveTrackId(id);
                  }}
                  isDarkTheme={isDarkTheme}
                />
              </motion.div>

              {/* Primary & Secondary CTAs */}
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-7">
                <button
                  onClick={() => navigate('/signup')}
                  className={`w-full sm:w-auto font-bold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group text-base focus-visible:ring-2 focus-visible:ring-indigo-400 ${currentTheme.primaryBtn}`}
                >
                  <span>Try Tutovia Free</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('modes')}
                  className={`w-full sm:w-auto px-7 py-3.5 rounded-xl border transition-colors text-base font-semibold focus-visible:ring-2 focus-visible:ring-indigo-400 ${currentTheme.secondaryBtn}`}
                >
                  Explore How It Works
                </button>
              </motion.div>

              {/* Short Trust Row below CTAs */}
              <motion.div variants={fadeIn} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium">
                <span className={`inline-flex items-center gap-1.5 ${currentTheme.subText}`}>
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>Free during beta</span>
                </span>
                <span className="opacity-30 hidden sm:inline">•</span>
                <span className={`inline-flex items-center gap-1.5 ${currentTheme.subText}`}>
                  <ShieldCheck size={14} className="text-indigo-400 shrink-0" />
                  <span>No credit card required</span>
                </span>
                <span className="opacity-30 hidden sm:inline">•</span>
                <span className={`inline-flex items-center gap-1.5 ${currentTheme.subText}`}>
                  <Coffee size={14} className="text-amber-500 shrink-0" />
                  <span>Calm, judgment-free support</span>
                </span>
              </motion.div>

            </motion.div>

            {/* Right Column: Interactive Tutor Conversation Preview (Merged with Try Demo + V1 Companion) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className={`rounded-2xl border p-5 sm:p-6 relative backdrop-blur-md shadow-2xl ${currentTheme.chatCard}`}>
                
                {/* Tutor Card Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-500/20 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${currentTheme.chatHeaderBot}`}>
                        <Bot size={20} />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div>
                      <div className={`font-heading font-bold text-sm sm:text-base flex items-center gap-2 ${currentTheme.chatHeaderTitle}`}>
                        <span>Tutovia AI Tutor</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentTheme.audienceBadge}`}>
                          Interactive Demo
                        </span>
                      </div>
                      <div className={`text-xs ${currentTheme.chatHeaderSubtitle}`}>Always here. Never judging.</div>
                    </div>
                  </div>
                  
                  {/* Streak & Live Indicator */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs font-bold">
                      <Flame size={13} className="text-amber-500 animate-pulse" />
                      <span>14 Day Streak</span>
                    </div>
                  </div>
                </div>

                {/* View Mode Selector Tabs (Dialogue vs Companion Snapshot) */}
                <div className="flex items-center gap-1.5 mb-3.5 p-1 rounded-xl bg-slate-500/10 border border-slate-500/15">
                  <button
                    onClick={() => setHeroCardMode('dialogue')}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      heroCardMode === 'dialogue'
                        ? `${currentTheme.chatPillActive} shadow-sm`
                        : `${currentTheme.subText} hover:opacity-100`
                    }`}
                  >
                    <Bot size={13} />
                    <span>AI Tutor Dialogue</span>
                  </button>
                  <button
                    onClick={() => setHeroCardMode('companion')}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      heroCardMode === 'companion'
                        ? `${currentTheme.chatPillActive} shadow-sm`
                        : `${currentTheme.subText} hover:opacity-100`
                    }`}
                  >
                    <Sparkles size={13} />
                    <span>Companion Rhythm</span>
                  </button>
                </div>

                {heroCardMode === 'companion' ? (
                  /* V1 Companion Rhythm Snapshot Mode */
                  <div className="space-y-3.5">
                    {/* Mindful Compassion Encouragement */}
                    <div className={`p-3.5 rounded-xl border ${currentTheme.chatInner}`}>
                      <div className="text-xs font-bold text-rose-500 mb-1 flex items-center gap-1.5">
                        <Heart size={13} className="text-rose-500" />
                        <span>Mindful Compassion • {currentPhaseInfo.name}</span>
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed font-medium ${currentTheme.bodyText}`}>
                        "{encouragements[activePhase] || currentPhaseInfo.quote}"
                      </p>
                    </div>

                    {/* Today's High-Yield Focus Slot */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between ${currentTheme.cardAlt}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sky-500 ${currentTheme.audienceBadge}`}>
                          <BookOpen size={16} />
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${currentTheme.h3}`}>Direct Tax: Capital Gains (Sec 54)</div>
                          <div className={`text-[11px] ${currentTheme.subText}`}>High Weightage • 8-10 Marks Target</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-sky-500">2h Slot</span>
                    </div>

                    {/* Spaced Repetition Flashcard */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between ${currentTheme.cardAlt}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-purple-500 ${currentTheme.audienceBadge}`}>
                          <Brain size={16} />
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${currentTheme.h3}`}>AS 22: Deferred Tax Assets</div>
                          <div className={`text-[11px] ${currentTheme.subText}`}>Active Recall • 3-min concept verification</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-purple-500 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20">
                        Due Now
                      </span>
                    </div>

                    {/* Daily Target Completion Bar */}
                    <div className={`p-3 rounded-xl border ${currentTheme.cardAlt}`}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className={`font-semibold ${currentTheme.bodyText}`}>Daily Study Target Completion</span>
                        <span className="font-mono font-bold text-emerald-500">82% On Track</span>
                      </div>
                      <div className="w-full h-2 bg-slate-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[82%]" />
                      </div>
                    </div>

                    {/* Card Footer Quote & Action */}
                    <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                      <span className={`italic text-[11px] ${currentTheme.subText}`}>
                        {currentPhaseInfo.quote}
                      </span>
                      <button
                        onClick={() => setHeroCardMode('dialogue')}
                        className={`font-bold underline text-xs shrink-0 ${currentTheme.accentText}`}
                      >
                        Try AI Tutor Chat →
                      </button>
                    </div>
                  </div>
                ) : (
                  <>

                {/* Quick Action Interactive Filters (Merged from Try Demo) */}
                <div className="mb-4">
                  <div className={`text-[11px] font-bold mb-2 uppercase tracking-wider ${currentTheme.subText}`}>
                    Try a real student question:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {heroActions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => handleHeroActionClick(action.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                          heroActiveAction === action.id 
                            ? currentTheme.chatPillActive 
                            : currentTheme.chatPillInactive
                        }`}
                      >
                        <span>{action.icon}</span>
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Conversation Box */}
                <div className={`space-y-3.5 min-h-[230px] flex flex-col justify-end rounded-xl p-4 border ${currentTheme.chatInner}`}>
                  
                  {/* Scenario context indicator */}
                  <div className={`text-[11px] font-bold flex items-center gap-1.5 ${currentTheme.accentText}`}>
                    <Lightbulb size={13} />
                    <span>Context: {currentHeroAction.scenario}</span>
                  </div>

                  {/* Student Bubble */}
                  <motion.div 
                    key={`student-${currentHeroAction.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className={`max-w-[88%] rounded-2xl rounded-tr-none px-4 py-2.5 text-xs sm:text-sm ${currentTheme.chatBubbleStudent}`}>
                      <p className="font-medium">{currentHeroAction.studentMsg}</p>
                    </div>
                  </motion.div>

                  {/* Tutor Response Bubble */}
                  <motion.div 
                    key={`tutor-${currentHeroAction.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-2.5 justify-start"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${currentTheme.chatHeaderBot}`}>
                      <Bot size={13} />
                    </div>
                    <div className={`max-w-[92%] rounded-2xl rounded-tl-none px-4 py-3 text-xs sm:text-sm leading-relaxed border space-y-2 ${currentTheme.chatBubbleTutor}`}>
                      {heroTyping ? (
                        <div className="flex items-center gap-1.5 py-1 opacity-60">
                          <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      ) : (
                        currentHeroAction.tutorReplies.map((paragraph, index) => (
                          <p key={index} className={index === 0 ? "font-semibold" : ""}>
                            {paragraph}
                          </p>
                        ))
                      )}
                    </div>
                  </motion.div>

                </div>

                {/* Interactive Tutor Input & Early Access Action */}
                <div className="mt-4 pt-3 border-t border-slate-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className={`w-full sm:flex-1 border rounded-xl px-3 py-2 text-xs flex items-center justify-between ${currentTheme.chatInput}`}>
                    <span>Ask anything about CA preparation...</span>
                    <Sparkles size={14} className="text-amber-500" />
                  </div>
                  <button 
                    onClick={() => navigate('/signup')}
                    className={`w-full sm:w-auto font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow focus-visible:ring-2 focus-visible:ring-indigo-400 ${currentTheme.primaryBtn}`}
                  >
                    <span>Meet Your Tutor</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}

          </div>
        </motion.div>

          </div>

          {/* Atmospheric Theme Pill from Screenshot */}
          <div className="absolute bottom-5 left-6 z-20 hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-xl border text-xs font-semibold shadow-lg transition-all duration-500 bg-black/45 border-white/20 text-white">
            <span className="text-base">{currentPhaseInfo.icon}</span>
            <span className="tracking-wider font-bold">{currentPhaseInfo.name.toUpperCase()}</span>
            <span className="opacity-40">—</span>
            <span className="font-medium text-slate-100">{currentPhaseInfo.tagline}</span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: STUDY MODES & DAILY RHYTHM */}
        {/* ======================================================== */}
        <section id="modes" className="py-20 px-4 relative scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border mb-3 inline-block ${currentTheme.sectionBadge}`}>
                Daily Rhythm & Capabilities
              </span>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mt-2 mb-4 ${currentTheme.h2}`}>
                A Day with Tutovia: Four Modes That Match Your Natural Rhythm
              </h2>
              <p className={`text-base sm:text-lg ${currentTheme.sectionDesc}`}>
                Tutovia isn't an app you open only when you have a question. It lives with your natural daily rhythm from sunrise to sleep—adapting its lighting, tone, and tutoring capabilities to your mental energy.
              </p>
              <div className={`mt-3 text-xs font-semibold flex items-center justify-center gap-1.5 ${currentTheme.accentText}`}>
                <Sparkles size={14} />
                <span>Click any mode below to see the entire interface transform in real time.</span>
              </div>
            </div>

            {/* 4 Horizontal Mode Selector Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {circadianModes.map(mode => {
                const isActive = activePhase === mode.id;
                const ModeIcon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => selectPhase(mode.id)}
                    className={`text-left rounded-2xl border-2 p-5 transition-all duration-300 flex flex-col justify-between shadow-md relative focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                      isActive 
                        ? `${currentTheme.card} ring-2 ${currentTheme.accentBorder} scale-[1.02] shadow-xl` 
                        : `${currentTheme.cardAlt} hover:scale-[1.01] hover:shadow-lg opacity-85 hover:opacity-100`
                    }`}
                  >
                    <div>
                      {/* Top Header: Icon + Mode Name + Active / Time Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <ModeIcon size={20} className={isActive ? currentTheme.accentText : 'opacity-70'} />
                          <h3 className={`font-heading font-black text-base sm:text-lg ${currentTheme.h3}`}>{mode.name}</h3>
                        </div>
                        {isActive ? (
                          <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${currentTheme.activeThemePill}`}>
                            Active
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${currentTheme.audienceBadge}`}>
                            {mode.label}
                          </span>
                        )}
                      </div>

                      {/* Time Window & 1-Line Purpose */}
                      <div className={`text-[11px] font-mono font-semibold mb-1 ${currentTheme.subText}`}>{mode.time}</div>
                      <div className={`text-xs font-bold mb-2 ${currentTheme.accentText}`}>{mode.purpose}</div>
                      <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>{mode.progression}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-500/15 flex items-center justify-between text-[11px]">
                      <span className={`font-medium ${currentTheme.subText}`}>{mode.greetingTime} Sync</span>
                      <span className={`font-bold ${isActive ? currentTheme.accentText : 'opacity-60'}`}>
                        {isActive ? 'Current Atmosphere' : 'Click to preview →'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Mode Deep-Dive Capability Panel */}
            {(() => {
              const activeModeObj = circadianModes.find(m => m.id === activePhase) || circadianModes[0];
              const ActiveIcon = activeModeObj.icon;
              return (
                <div className={`rounded-3xl border-2 p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-500 ${currentTheme.card}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-500/15 mb-6">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${currentTheme.logoIcon}`}>
                        <ActiveIcon size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-mono font-semibold ${currentTheme.subText}`}>{activeModeObj.time}</span>
                          <span className="opacity-40">•</span>
                          <span className={`text-xs font-bold uppercase tracking-wider ${currentTheme.accentText}`}>{activeModeObj.purpose}</span>
                        </div>
                        <h3 className={`font-heading font-black text-xl sm:text-2xl ${currentTheme.h2}`}>
                          {activeModeObj.name} Mode Active: {activeModeObj.atmosphere}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isAuto ? (
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${currentTheme.trustChip}`}>
                          🕒 Auto-Synced to System Clock
                        </span>
                      ) : (
                        <button
                          onClick={() => selectPhase('auto')}
                          className={`text-xs font-bold underline px-3 py-1.5 focus-visible:ring-2 focus-visible:ring-indigo-400 ${currentTheme.accentText}`}
                        >
                          Reset to Auto (Device Clock)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Daily Companion Quote */}
                  <div className={`p-4 rounded-2xl border mb-6 text-xs sm:text-sm italic leading-relaxed flex items-start gap-3 ${currentTheme.highlightBox}`}>
                    <span className="text-xl shrink-0 not-italic">💬</span>
                    <div>
                      <span className="font-semibold not-italic text-[10px] uppercase tracking-wider block opacity-75 mb-0.5">
                        {activeModeObj.greetingTime} • Daily Companion Sync
                      </span>
                      {activeModeObj.quote}
                    </div>
                  </div>

                  {/* 3 Capabilities Active in this Mode */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {activeModeObj.features.map((feat, fIdx) => {
                      const FeatIcon = feat.icon;
                      return (
                        <div key={fIdx} className={`p-4 rounded-xl border flex flex-col justify-between ${currentTheme.cardAlt}`}>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${currentTheme.audienceBadge}`}>
                                <FeatIcon size={14} />
                              </div>
                              <h4 className={`font-heading font-bold text-sm ${currentTheme.h3}`}>{feat.name}</h4>
                            </div>
                            <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>{feat.desc}</p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-500/15 flex items-center justify-between text-[10px]">
                            <span className={currentTheme.subText}>Status</span>
                            <span className="font-bold text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 size={11} /> Active
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: STUDENT STRUGGLES & EMPATHY */}
        {/* ======================================================== */}
        <section id="problems" className="py-20 px-4 relative scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border mb-3 inline-block ${currentTheme.sectionBadge}`}>
                We Understand The Real Struggle
              </span>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mt-2 mb-4 ${currentTheme.h2}`}>
                Studying isn't always about knowing the answer.
              </h2>
              <p className={`text-base sm:text-lg ${currentTheme.sectionDesc}`}>
                Most hurdles in CA preparation aren't about lack of intellect—they are about uncertainty, burnout, and having to figure out vast syllabi all on your own.
              </p>
            </div>

            {/* 2-Column Interactive Struggles Layout */}
            <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">
              
              {/* Left Column: 6 Clickable Struggle Selector Cards */}
              <div className="lg:col-span-5 space-y-3">
                <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${currentTheme.subText}`}>
                  Select a common preparation roadblock:
                </div>
                {studentProblems.map((p, idx) => {
                  const isSelected = selectedProblemIndex === idx;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProblemIndex(idx)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                        isSelected
                          ? `${currentTheme.card} ring-2 ${currentTheme.accentBorder} shadow-lg scale-[1.01]`
                          : `${currentTheme.cardAlt} hover:border-slate-400 opacity-80 hover:opacity-100`
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-xl shrink-0 mt-0.5">{p.emoji}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentTheme.audienceBadge}`}>
                              {p.category}
                            </span>
                          </div>
                          <div className={`font-heading font-bold text-sm leading-snug line-clamp-1 ${currentTheme.h3}`}>
                            {p.shortLabel}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} className={`shrink-0 mt-1 transition-transform ${isSelected ? `${currentTheme.accentText} translate-x-1` : 'opacity-40'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Detailed Empathy, Solution & Mockup Panel */}
              <div className="lg:col-span-7">
                {(() => {
                  const activeProblem = studentProblems[selectedProblemIndex] || studentProblems[0];
                  const ActiveProbIcon = activeProblem.icon;
                  return (
                    <div className={`rounded-3xl border-2 p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6 transition-all duration-300 ${currentTheme.card}`}>
                      
                      {/* Header with Quote & Tag */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${currentTheme.audienceBadge}`}>
                            {activeProblem.tag}
                          </span>
                          <span className={`text-xs font-semibold ${currentTheme.subText}`}>
                            Roadblock {selectedProblemIndex + 1} of {studentProblems.length}
                          </span>
                        </div>
                        <h3 className={`font-heading font-black text-2xl sm:text-3xl leading-snug mb-3 ${currentTheme.h2}`}>
                          {activeProblem.quote}
                        </h3>
                        <p className={`text-xs sm:text-sm leading-relaxed ${currentTheme.bodyText}`}>
                          {activeProblem.description}
                        </p>
                      </div>

                      {/* How Tutovia Solves It */}
                      <div className={`p-5 rounded-2xl border ${currentTheme.highlightBox}`}>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${currentTheme.accentText}`}>
                          <Sparkles size={14} />
                          <span>Tutovia Solution: {activeProblem.solutionTitle}</span>
                        </div>
                        <p className={`text-xs sm:text-sm leading-relaxed font-medium ${currentTheme.bodyText}`}>
                          {activeProblem.solution}
                        </p>
                      </div>

                      {/* Interactive Visual Mini-Mockup Card */}
                      <div className={`p-4 rounded-2xl border space-y-2 ${currentTheme.chatInner}`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${currentTheme.accentText}`}>
                            <ActiveProbIcon size={13} />
                            <span>Tutovia Feature In Action</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 ${currentTheme.subText}`}>
                            {activeProblem.mockup.badge}
                          </span>
                        </div>
                        <div className={`font-heading font-bold text-sm sm:text-base ${currentTheme.h3}`}>
                          {activeProblem.mockup.title}
                        </div>
                        <div className={`text-xs font-mono ${currentTheme.subText}`}>
                          {activeProblem.mockup.meta}
                        </div>
                        <div className="pt-2 border-t border-slate-500/15 flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                          <CheckCircle2 size={13} />
                          <span>{activeProblem.mockup.status}</span>
                        </div>
                      </div>

                      {/* Contextual Action Button */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className={`text-xs ${currentTheme.subText}`}>
                          Experience how Tutovia resolves this in practice
                        </span>
                        <button
                          onClick={() => handleStruggleAction(activeProblem.actionTarget)}
                          className={`w-full sm:w-auto font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${currentTheme.primaryBtn}`}
                        >
                          <span>{activeProblem.actionLabel}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>

                    </div>
                  );
                })()}
              </div>

            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 4: PREPARATION ENGINES & ARCHITECTURE */}
        {/* ======================================================== */}
        <section id="engines" className="py-20 px-4 relative scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border mb-3 inline-block ${currentTheme.sectionBadge}`}>
                Complete Prep Architecture
              </span>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mt-2 mb-4 ${currentTheme.h2}`}>
                Four Core Preparation Engines Mapped to Your Day
              </h2>
              <p className={`text-base sm:text-lg ${currentTheme.sectionDesc}`}>
                Each phase of your study day targets a specific cognitive challenge—from high-energy analytical planning in the morning to deep concept mastery during the day, testing in the evening, and restorative mindset balance at night.
              </p>
            </div>

            {/* 4 Engine Cards with Honest Status Badges */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {prepEcosystemPhases.map((phase, pIdx) => {
                const Icon = phase.icon;
                return (
                  <motion.div
                    key={pIdx}
                    whileHover={{ y: -4 }}
                    className={`rounded-2xl border p-6 flex flex-col justify-between transition-all shadow-md ${currentTheme.card}`}
                  >
                    <div>
                      {/* Header: Phase badge & Mode match */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${phase.badgeBg}`}>
                          {phase.phase}
                        </span>
                        <span className={`text-[11px] font-bold ${currentTheme.accentText}`}>
                          {phase.modeMatch}
                        </span>
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentTheme.audienceBadge}`}>
                          <Icon size={16} className={phase.color} />
                        </div>
                        <h3 className={`font-heading font-bold text-base ${currentTheme.h3}`}>
                          {phase.title}
                        </h3>
                      </div>

                      {/* Time span & Concrete Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[11px] font-mono font-medium ${currentTheme.subText}`}>
                          {phase.time}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${phase.statusColor}`}>
                          {phase.status}
                        </span>
                      </div>

                      {/* Headline & Description */}
                      <p className={`text-xs font-semibold leading-snug mb-2 ${currentTheme.bodyText}`}>
                        {phase.headline}
                      </p>
                      <p className={`text-xs leading-relaxed mb-4 opacity-80 ${currentTheme.bodyText}`}>
                        {phase.description}
                      </p>

                      {/* Capabilities Checklist */}
                      <div className="space-y-2 pt-3 border-t border-slate-500/15">
                        {phase.capabilities.map((cap, cIdx) => (
                          <div key={cIdx} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className={`text-[11px] leading-relaxed font-medium ${currentTheme.bodyText}`}>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-500/15 flex items-center justify-between text-[11px]">
                      <span className={`font-medium ${currentTheme.subText}`}>Engine Layer</span>
                      <button
                        onClick={() => scrollToSection('sandbox')}
                        className={`font-bold hover:underline ${currentTheme.accentText}`}
                      >
                        Try Demo Below ↓
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Sandbox Bridge Callout */}
            <div className={`rounded-2xl border p-5 sm:p-6 text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 ${currentTheme.highlightBox}`}>
              <div className="text-left text-xs sm:text-sm">
                <strong className={`block font-bold ${currentTheme.h3}`}>Want to see how these engines feel?</strong>
                <span className={currentTheme.bodyText}>Test drive the AI CA Mentor, ICAI Passing Simulator, and Adaptive Timetable live.</span>
              </div>
              <button
                onClick={() => scrollToSection('sandbox')}
                className={`font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shrink-0 shadow-md ${currentTheme.primaryBtn}`}
              >
                Test Drive Live Demo ↓
              </button>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* NEW SECTION: "FOR STUDENTS, BY STUDENTS" GROWTH ECOSYSTEM */}
        {/* Multi-Stage Curriculum, Virtual Peer Room & Spaced Recall */}
        {/* ======================================================== */}
        <section id="ecosystem" className="py-20 px-4 relative scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border mb-3 inline-block ${currentTheme.sectionBadge}`}>
                "For Students, By Students"
              </span>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mt-2 mb-4 ${currentTheme.h2}`}>
                The Complete Commerce & CA Growth Journey
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${currentTheme.sectionDesc}`}>
                Built by students who walked the path. Discover curriculum roadmaps, join live distraction-free study rooms, and master legal sections with spaced repetition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Unified Subject Hub */}
              <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${currentTheme.card}`}>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center mb-4">
                    <BookOpen size={24} />
                  </div>
                  <h3 className={`text-xl font-heading font-bold mb-2 ${currentTheme.h3}`}>
                    Unified Subject Hub
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${currentTheme.bodyText}`}>
                    Explore your active stage — Class 11, Class 12, CA Foundation, or CA Inter/Final — and preview the next bridge in your journey with high-yield syllabus roadmaps.
                  </p>
                </div>
                <button
                  onClick={() => setSubjectHubOpen(true)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm ${currentTheme.primaryBtn}`}
                >
                  <BookOpen size={14} />
                  <span>Explore Subject Hub & Bridges</span>
                </button>
              </div>

              {/* Card 2: Peer Study Room (Virtual Library) */}
              <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between relative overflow-hidden ${currentTheme.card}`}>
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[11px] font-black uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>1,480+ Live</span>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4">
                    <Users size={24} />
                  </div>
                  <h3 className={`text-xl font-heading font-bold mb-2 ${currentTheme.h3}`}>
                    Virtual Peer Library
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${currentTheme.bodyText}`}>
                    Study alongside commerce aspirants worldwide. Zero distractions, procedural Web Audio (binaural alpha waves, rain, brown noise), and focus timers.
                  </p>
                </div>
                <button
                  onClick={() => setPeerStudyRoomOpen(true)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Users size={14} />
                  <span>Enter Peer Study Room (Live)</span>
                </button>
              </div>

              {/* Card 3: Spaced Repetition Flashcards */}
              <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${currentTheme.card}`}>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-4">
                    <Layers size={24} />
                  </div>
                  <h3 className={`text-xl font-heading font-bold mb-2 ${currentTheme.h3}`}>
                    Practice & Flashcards Engine
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${currentTheme.bodyText}`}>
                    Formula sheets, golden rules, company shares forfeiture, Contract Act clauses, AS 10 & CARO 2020 with active recall and spaced repetition drills.
                  </p>
                </div>
                <button
                  onClick={() => setFlashcardsOpen(true)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border ${
                    isDarkTheme ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  <Layers size={14} className="text-amber-500" />
                  <span>Practice Flashcards</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 5: LIVE INTERACTIVE SANDBOX */}
        {/* ======================================================== */}
        <section id="sandbox" className="py-20 px-4 relative scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border mb-3 inline-block ${currentTheme.sectionBadge}`}>
                Live Interactive Sandbox
              </span>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mt-2 mb-4 ${currentTheme.h2}`}>
                Test Drive The Tutovia Engines
              </h2>
              <p className={`text-base sm:text-lg ${currentTheme.sectionDesc}`}>
                Experience Tutovia's three core intelligence engines firsthand right now—no login or sign-up required.
              </p>
            </div>

            {/* Sandbox Master Container */}
            <div className={`rounded-3xl border-2 p-5 sm:p-8 max-w-5xl mx-auto shadow-2xl relative ${currentTheme.card}`}>
              
              {/* 3 Sandbox Mode Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8 p-1.5 rounded-2xl bg-slate-500/10 border border-slate-500/15 max-w-xl mx-auto">
                <button
                  onClick={() => setSandboxTab('ai')}
                  className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    sandboxTab === 'ai'
                      ? `${currentTheme.chatPillActive} shadow-md`
                      : `${currentTheme.subText} hover:opacity-100`
                  }`}
                >
                  <Bot size={15} />
                  <span>24/7 AI CA Mentor</span>
                </button>

                <button
                  onClick={() => setSandboxTab('simulator')}
                  className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    sandboxTab === 'simulator'
                      ? `${currentTheme.chatPillActive} shadow-md`
                      : `${currentTheme.subText} hover:opacity-100`
                  }`}
                >
                  <Target size={15} />
                  <span>ICAI 40/50 Passing Tester</span>
                </button>

                <button
                  onClick={() => setSandboxTab('timetable')}
                  className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    sandboxTab === 'timetable'
                      ? `${currentTheme.chatPillActive} shadow-md`
                      : `${currentTheme.subText} hover:opacity-100`
                  }`}
                >
                  <Calendar size={15} />
                  <span>Adaptive Timetable</span>
                </button>
              </div>

              {/* TAB 1: 24/7 AI CA MENTOR */}
              {sandboxTab === 'ai' && (
                <div className="space-y-6">
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${currentTheme.subText}`}>
                      Choose a real CA query to test mentor clarity:
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {sandboxQueries.map((item, idx) => {
                        const isSelected = (sandboxAiQuery?.q || sandboxQueries[0].q) === item.q;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSandboxAiQuery(item)}
                            className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-2 ${
                              isSelected
                                ? `${currentTheme.chatPillActive} shadow-sm`
                                : `${currentTheme.cardAlt} hover:border-slate-400`
                            }`}
                          >
                            <span className="line-clamp-1">{item.q}</span>
                            <ChevronRight size={14} className="shrink-0 opacity-70" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Query & Answer Display Box */}
                  {(() => {
                    const activeItem = sandboxAiQuery || sandboxQueries[0];
                    return (
                      <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${currentTheme.chatInner}`}>
                        {/* Student Prompt */}
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 bg-indigo-600 text-xs font-bold">
                            CA
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-[11px] font-bold ${currentTheme.subText}`}>Student Question:</div>
                            <div className={`font-heading font-bold text-sm sm:text-base ${currentTheme.h3}`}>
                              “{activeItem.q}”
                            </div>
                          </div>
                        </div>

                        {/* Mentor Answer */}
                        <div className={`rounded-xl p-4 border space-y-2 ${currentTheme.chatBubbleTutor}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Bot size={15} className="text-amber-500" />
                            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                              Tutovia AI CA Mentor Response
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm leading-relaxed font-medium">
                            <TypewriterText text={activeItem.a} />
                          </p>
                        </div>

                        {/* Pedagogical Guarantee Note & Live App Trigger */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-500/15 text-xs">
                          <span className={`text-[11px] flex items-center gap-1.5 ${currentTheme.subText}`}>
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span>Strictly grounded in current ICAI Study Modules & Notifications.</span>
                          </span>
                          <button
                            onClick={() => navigate('/signup')}
                            className={`font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${currentTheme.primaryBtn}`}
                          >
                            <span>Ask Your Own Questions</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 2: ICAI 40/50 PASSING & SET-OFF SIMULATOR */}
              {sandboxTab === 'simulator' && (
                <div className="space-y-6">
                  <div className="text-center max-w-xl mx-auto mb-4">
                    <h4 className={`font-heading font-bold text-lg mb-1 ${currentTheme.h3}`}>
                      CA Group Passing & Aggregate Set-Off Simulator
                    </h4>
                    <p className={`text-xs ${currentTheme.bodyText}`}>
                      ICAI Passing Rule: Minimum <strong>40%</strong> marks in every individual paper + Minimum <strong>50% aggregate (150/300)</strong> to pass the group. Adjust the sliders below to see live pass/fail status and how Tutovia optimizes subject set-offs.
                    </p>
                  </div>

                  {/* Interactive Mark Sliders */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { key: 'p1', title: 'Paper 1: Advanced Accounting', score: simMarks.p1 },
                      { key: 'p2', title: 'Paper 2: Corporate & Other Laws', score: simMarks.p2 },
                      { key: 'p3', title: 'Paper 3: Taxation', score: simMarks.p3 },
                    ].map(paper => {
                      const isIndividualPass = paper.score >= 40;
                      const isExemption = paper.score >= 60;
                      return (
                        <div key={paper.key} className={`p-4 rounded-xl border flex flex-col justify-between ${currentTheme.cardAlt}`}>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs font-bold ${currentTheme.h3}`}>{paper.title}</span>
                              {isExemption && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  Exemption (60+)
                                </span>
                              )}
                            </div>
                            <div className="flex items-baseline justify-between mb-3">
                              <span className={`text-2xl font-mono font-black ${isIndividualPass ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {paper.score}
                              </span>
                              <span className={`text-xs font-mono ${currentTheme.subText}`}>/ 100 Marks</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={paper.score}
                              onChange={(e) => setSimMarks({ ...simMarks, [paper.key]: Number(e.target.value) })}
                              className="w-full accent-orange-500 cursor-pointer"
                            />
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-500/15 flex items-center justify-between text-[11px]">
                            <span className={currentTheme.subText}>Paper Status:</span>
                            <span className={`font-bold ${isIndividualPass ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {isIndividualPass ? '>= 40 Passed' : '< 40 Failed'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Aggregate Results & Live Verdict */}
                  {(() => {
                    const total = simMarks.p1 + simMarks.p2 + simMarks.p3;
                    const percentage = ((total / 300) * 100).toFixed(1);
                    const individualPass = simMarks.p1 >= 40 && simMarks.p2 >= 40 && simMarks.p3 >= 40;
                    const aggregatePass = total >= 150;
                    const passed = individualPass && aggregatePass;

                    return (
                      <div className={`p-5 rounded-2xl border transition-all ${
                        passed
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-rose-500/10 border-rose-500/30'
                      }`}>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-lg font-black ${passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {passed ? '🎉 GROUP PASSED!' : '⚠️ NOT PASSING YET'}
                              </span>
                              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/10">
                                {total} / 300 ({percentage}%)
                              </span>
                            </div>
                            <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>
                              {passed
                                ? `Both conditions met! All 3 papers >= 40 marks and aggregate exceeds 150 (50%). Notice how your Paper 1 score (${simMarks.p1}) compensated for Paper 3 (${simMarks.p3}).`
                                : !individualPass
                                ? `You must score at least 40 marks in every single paper. One or more papers are currently below 40.`
                                : `All papers are >= 40, but total aggregate is ${total}/300. You need at least 150 marks (short by ${150 - total} marks).`}
                            </p>
                          </div>

                          <button
                            onClick={() => setSimMarks({ p1: 68, p2: 52, p3: 45 })}
                            className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${currentTheme.secondaryBtn}`}
                          >
                            <RotateCcw size={12} />
                            <span>Reset Marks</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 3: ADAPTIVE 12-HOUR TIMETABLE ENGINE */}
              {sandboxTab === 'timetable' && (
                <div className="space-y-6">
                  <div className="text-center max-w-xl mx-auto mb-4">
                    <h4 className={`font-heading font-bold text-lg mb-1 ${currentTheme.h3}`}>
                      Adaptive 12-Hour Study Agenda
                    </h4>
                    <p className={`text-xs ${currentTheme.bodyText}`}>
                      A balanced, realistic schedule engineered around natural circadian peaks, articleship commitments, and restorative breaks—with zero guilt if plans change.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sandboxTimetable.map((slot, sIdx) => (
                      <div key={sIdx} className={`p-3.5 rounded-xl border flex flex-col justify-between ${currentTheme.cardAlt}`}>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-500/10 text-slate-400">
                              {slot.time}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              slot.type === 'Study' ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20' :
                              slot.type === 'Break' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                              slot.type === 'Class' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                              'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                            }`}>
                              {slot.tag}
                            </span>
                          </div>
                          <div className={`font-heading font-bold text-xs sm:text-sm leading-snug mb-2 ${currentTheme.h3}`}>
                            {slot.title}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-500/15 flex items-center justify-between text-[11px]">
                          <span className={currentTheme.subText}>Engine Action:</span>
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <Check size={11} /> Scheduled
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Adaptive Reschedule Highlight Box */}
                  <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${currentTheme.highlightBox}`}>
                    <div className="flex items-center gap-2.5 text-xs">
                      <Clock size={16} className="text-amber-500 shrink-0" />
                      <span className={`font-medium ${currentTheme.bodyText}`}>
                        Articleship running 90 minutes late? Tutovia dynamically recalculates evening high-yield blocks without creating overwhelming backlogs.
                      </span>
                    </div>
                    <button
                      onClick={() => navigate('/signup')}
                      className={`font-bold text-xs px-4 py-2 rounded-xl transition-all shrink-0 ${currentTheme.primaryBtn}`}
                    >
                      Personalize My Timetable
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 6: FOUNDER STORY & RESPONSIBLE AI */}
        {/* ======================================================== */}
        <section id="story" className="py-20 px-4 relative scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border mb-3 inline-block ${currentTheme.sectionBadge}`}>
                The Story Behind Tutovia
              </span>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mt-2 mb-4 ${currentTheme.h2}`}>
                Why I Started Tutovia
              </h2>
              <p className={`text-base sm:text-lg ${currentTheme.sectionDesc}`}>
                Built from a student's perspective, for the learning journey students actually experience.
              </p>
            </div>

            {/* Concise Founder Story Card */}
            <div className={`rounded-3xl border-2 p-6 sm:p-10 max-w-5xl mx-auto shadow-xl relative overflow-hidden mb-12 ${currentTheme.card}`}>
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                
                {/* Founder Info & Picture Badge */}
                <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl border bg-slate-500/5">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-heading font-black text-2xl shadow-lg mb-4 ${currentTheme.logoIcon}`}>
                    UC
                  </div>
                  <h3 className={`font-heading font-bold text-xl mb-0.5 ${currentTheme.h3}`}>Upasana Chaurasia</h3>
                  <p className={`text-xs font-semibold ${currentTheme.accentText}`}>Founder, Tutovia</p>
                  <p className={`text-xs mt-1 ${currentTheme.subText}`}>CA Aspirant & Finance Graduate</p>
                  
                  <div className="mt-4 pt-3 border-t border-slate-500/15 w-full flex items-center justify-around text-[11px]">
                    <span className={`font-medium ${currentTheme.subText}`}>Perspective: Student-First</span>
                  </div>
                </div>

                {/* Concise 3-Step Narrative */}
                <div className="lg:col-span-8 space-y-4">
                  <blockquote className={`text-base sm:text-lg font-medium italic leading-relaxed border-l-4 pl-4 ${currentTheme.accentBorder} ${currentTheme.h3}`}>
                    “I built Tutovia because I lived the exact pressure, fragmentation, and loneliness of professional exam preparation. Students don't need another rigid checklist—they need a mentor who understands.”
                  </blockquote>

                  <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className={`p-3.5 rounded-xl border ${currentTheme.cardAlt}`}>
                      <strong className={`block font-bold mb-1 ${currentTheme.h3}`}>1. The Beginning</strong>
                      <span className={`leading-relaxed ${currentTheme.bodyText}`}>Living the fragmented grind of separate coaching, notes, and isolation.</span>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${currentTheme.cardAlt}`}>
                      <strong className={`block font-bold mb-1 ${currentTheme.h3}`}>2. The Realization</strong>
                      <span className={`leading-relaxed ${currentTheme.bodyText}`}>The issue isn't lack of material; it's knowing what, when, and how to stay consistent.</span>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${currentTheme.highlightBox}`}>
                      <strong className={`block font-bold mb-1 ${currentTheme.accentText}`}>3. The Mission</strong>
                      <span className={`leading-relaxed ${currentTheme.bodyText}`}>“Students don't just need more answers. They need better guidance.”</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setExpandedStory(!expandedStory)}
                      className={`text-xs font-bold flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 ${currentTheme.accentText}`}
                    >
                      <span>{expandedStory ? 'Collapse Founder Journey' : 'Read the Full Founder Journey'}</span>
                      {expandedStory ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Expandable Extended Narrative & Milestones */}
              <AnimatePresence>
                {expandedStory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-8 border-t border-slate-500/20 overflow-hidden"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Evolution Milestones */}
                      <div className="space-y-3">
                        <h4 className={`font-heading font-bold text-sm uppercase tracking-wider mb-3 ${currentTheme.subText}`}>
                          The Evolution Journey
                        </h4>
                        {[
                          { icon: BookOpen, title: "Student", desc: "Experiencing fragmented notes, classes, and isolation firsthand." },
                          { icon: HelpCircle, title: "Question", desc: "Why does having more material not lead to more clarity or consistency?" },
                          { icon: Lightbulb, title: "Idea", desc: "An AI tutor that adapts to stamina, context, and emotional burnout." },
                          { icon: Target, title: "Experiment", desc: "Testing spaced recall and guilt-free rescheduling with fellow aspirants." },
                          { icon: Sparkles, title: "Tutovia", desc: "A living 24/7 study companion designed for real human growth." },
                        ].map((m, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${currentTheme.audienceBadge}`}>
                              <m.icon size={13} />
                            </div>
                            <div className="text-xs">
                              <strong className={`font-bold ${currentTheme.h3}`}>{m.title}: </strong>
                              <span className={currentTheme.bodyText}>{m.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Extended Philosophy */}
                      <div className="space-y-3 text-xs leading-relaxed">
                        <h4 className={`font-heading font-bold text-sm uppercase tracking-wider mb-3 ${currentTheme.subText}`}>
                          Core Conviction
                        </h4>
                        <p className={currentTheme.bodyText}>
                          Tutovia is being built around a simple belief: Students already have access to enormous amounts of information. The challenge is navigating it without burning out or feeling alone.
                        </p>
                        <p className={currentTheme.bodyText}>
                          We are building an experience that feels personal, empathetic, and grounded in the realities of professional preparation. An AI that knows when you are tired, celebrates your discipline, and stays with you until the goal is achieved.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Responsible AI Subsection */}
            <div id="about" className="pt-12 scroll-mt-20">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border mb-3 inline-block ${currentTheme.sectionBadge}`}>
                  Ethical & Transparent
                </span>
                <h3 className={`text-2xl sm:text-3xl font-heading font-black tracking-tight mt-2 mb-3 ${currentTheme.h2}`}>
                  Responsible, Student-First AI
                </h3>
                <p className={`text-sm sm:text-base ${currentTheme.sectionDesc}`}>
                  We believe AI should empower students to think independently, build genuine confidence, and safeguard their privacy.
                </p>
              </div>

              {/* 4 Trust Pillars */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-10">
                <div className={`border rounded-2xl p-5 ${currentTheme.card}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold mb-3 ${currentTheme.audienceBadge}`}>
                    <GraduationCap size={18} />
                  </div>
                  <h4 className={`font-heading font-bold text-sm mb-1.5 ${currentTheme.h3}`}>Student-First AI</h4>
                  <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>
                    Tutovia is designed to support and mentor students rather than replace human faculties or coaching teachers.
                  </p>
                </div>

                <div className={`border rounded-2xl p-5 ${currentTheme.card}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold mb-3 ${currentTheme.audienceBadge}`}>
                    <ShieldCheck size={18} />
                  </div>
                  <h4 className={`font-heading font-bold text-sm mb-1.5 ${currentTheme.h3}`}>Responsible Personalization</h4>
                  <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>
                    Personalization strictly serves your learning efficiency while maintaining rigorous respect for student data privacy.
                  </p>
                </div>

                <div className={`border rounded-2xl p-5 ${currentTheme.card}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold mb-3 ${currentTheme.audienceBadge}`}>
                    <Lightbulb size={18} />
                  </div>
                  <h4 className={`font-heading font-bold text-sm mb-1.5 ${currentTheme.h3}`}>Transparent Guidance</h4>
                  <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>
                    Tutovia encourages students to reason, question, and understand deeply rather than simply providing shallow shortcuts.
                  </p>
                </div>

                <div className={`border rounded-2xl p-5 ${currentTheme.card}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold mb-3 ${currentTheme.audienceBadge}`}>
                    <Smile size={18} />
                  </div>
                  <h4 className={`font-heading font-bold text-sm mb-1.5 ${currentTheme.h3}`}>Human Growth</h4>
                  <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>
                    Supporting academic, personal, and career development so you grow as a disciplined, confident professional.
                  </p>
                </div>
              </div>

              {/* Educational Notice */}
              <div className={`max-w-3xl mx-auto border rounded-xl p-4 text-center text-xs leading-relaxed ${currentTheme.cardAlt}`}>
                <strong>Educational Guidance Notice:</strong> Tutovia provides intelligent study planning, spaced active recall, and pedagogical guidance based on official educational syllabi. Always cross-verify statutory case laws, amendments, and official notification circulars with your primary examination board guidelines.
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 7: HONEST CLOSED BETA SOCIAL PROOF NOTICE */}
        {/* ======================================================== */}
        <section className="py-12 px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className={`border-2 rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden shadow-xl ${currentTheme.card}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${currentTheme.audienceBadge}`}>
                <Sparkles size={24} />
              </div>
              <h3 className={`font-heading font-bold text-2xl sm:text-3xl mb-2 ${currentTheme.h2}`}>
                Currently in Closed Beta for CA Aspirants
              </h3>
              <p className={`text-sm max-w-xl mx-auto mb-6 leading-relaxed ${currentTheme.bodyText}`}>
                We believe in genuine pedagogy and zero fabricated metrics. As early students across CA Foundation, Intermediate, and Final complete their study cycles, their verified experiences will be shared here.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className={`font-bold text-sm px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-lg ${currentTheme.primaryBtn}`}
              >
                <span>Join Closed Beta</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 8: FINAL BETA CTA */}
        {/* ======================================================== */}
        <section className="py-24 px-4 relative overflow-hidden">
          {/* Subtle atmospheric backplate matching active theme */}
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none transition-all duration-700" 
            style={{ background: currentTheme.ctaGradient }}
          />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            
            <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border mb-6 inline-block ${currentTheme.sectionBadge}`}>
              Begin Today
            </span>

            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight mb-6 leading-tight ${currentTheme.heroHeadline}`}>
              Your journey doesn't have to be figured out alone.
            </h2>

            <p className={`text-xl sm:text-2xl mb-4 ${currentTheme.heroSubtitle}`}>
              Learn. Plan. Practice. Grow.
            </p>

            <p className={`text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed ${currentTheme.heroSupporting}`}>
              Tutovia is here whenever you need your next step.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className={`w-full sm:w-auto font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base group focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-lg ${currentTheme.primaryBtn}`}
              >
                <span>Try Tutovia Free</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('modes')}
                className={`w-full sm:w-auto px-7 py-4 rounded-xl border transition-colors text-base focus-visible:ring-2 focus-visible:ring-indigo-400 ${currentTheme.secondaryBtn}`}
              >
                Explore Study Modes
              </button>
            </div>

            <div className={`mt-8 text-xs ${currentTheme.subText}`}>
              Free during beta • No credit card required • Join the early-access waitlist
            </div>

          </div>
        </section>

      </main>

      {/* ======================================================== */}
      {/* FOOTER */}
      {/* ======================================================== */}
      <footer className={`border-t py-12 px-4 text-xs transition-colors duration-500 relative z-10 ${currentTheme.footerBg}`}>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${currentTheme.logoIcon}`}>
                <GraduationCap size={18} />
              </div>
              <span className={`font-heading font-black text-base ${currentTheme.footerTitle}`}>Tutovia</span>
            </div>
            <p className={`text-xs leading-relaxed ${currentTheme.bodyText}`}>
              Your AI tutor for learning, consistency, confidence, and growth. Built specifically for CA aspirants across all levels.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className={`font-bold text-xs uppercase tracking-wider mb-3 ${currentTheme.footerTitle}`}>Explore</div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('modes')} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Study Modes
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('problems')} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Student Struggles
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('engines')} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Prep Engines
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('sandbox')} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Live Demo Sandbox
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('story')} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Founder Story
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Trust & Ethics
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <div className={`font-bold text-xs uppercase tracking-wider mb-3 ${currentTheme.footerTitle}`}>Legal & Trust</div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setInfoModalType('privacy')} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setInfoModalType('terms')} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setInfoModalType('contact')} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Responsible AI
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Atmosphere */}
          <div>
            <div className={`font-bold text-xs uppercase tracking-wider mb-3 ${currentTheme.footerTitle}`}>Get Started</div>
            <ul className="space-y-2 mb-4">
              <li>
                <button onClick={() => navigate('/login')} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Sign In
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/signup')} className={`font-semibold transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.accentText}`}>
                  Sign Up for Free
                </button>
              </li>
              <li>
                <button onClick={handleOpenComingSoon} className={`transition-colors focus-visible:ring-1 focus-visible:ring-indigo-400 ${currentTheme.footerLink}`}>
                  Join Beta Waitlist
                </button>
              </li>
              <li>
                <button onClick={() => setAdminModalOpen(true)} className={`text-[11px] opacity-75 hover:opacity-100 transition-opacity focus-visible:ring-1 focus-visible:ring-indigo-400`}>
                  {isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}
                </button>
              </li>
            </ul>
            <div className={`text-[11px] ${currentTheme.subText}`}>
              Current Atmosphere: <span className="font-bold capitalize">{currentPhaseInfo.name}</span>
              {isAuto && <span className="ml-1 text-[10px] opacity-75 font-normal">(Auto Synced)</span>}
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Tutovia. All rights reserved.</span>
            <span className="opacity-40">•</span>
            <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-500/15 border border-slate-500/20">
              {TUTOVIA_V2_VERSION}
            </span>
          </div>
          <div className={currentTheme.subText}>
            Designed for learning, consistency, confidence, and growth.
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* COMING SOON MODAL (Early-Access Waitlist) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {comingSoonOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border-2 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative ${
                isDarkTheme ? 'bg-[#0B1120] border-slate-700 text-slate-50' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <button
                onClick={() => setComingSoonOpen(false)}
                aria-label="Close early access modal"
                className="absolute top-4 right-4 opacity-60 hover:opacity-100 p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <X size={20} />
              </button>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${currentTheme.audienceBadge}`}>
                <Sparkles size={24} />
              </div>

              <h3 className={`font-heading font-bold text-2xl mb-2 ${currentTheme.h2}`}>
                Join the Early-Access Waitlist
              </h3>

              <p className={`text-sm mb-6 leading-relaxed ${currentTheme.bodyText}`}>
                We are putting the finishing touches on Tutovia's personalized AI tutor and adaptive study companion for CA aspirants. Reserve your beta spot!
              </p>

              {comingSoonSubmitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-2" />
                  <div className={`font-bold text-sm ${currentTheme.h3}`}>You're on the priority list!</div>
                  <div className={`text-xs mt-1 ${currentTheme.subText}`}>We'll notify you as soon as early access invites roll out.</div>
                </div>
              ) : (
                <form onSubmit={handleSaveLead} className="space-y-4">
                  <div>
                    <label htmlFor="waitlist-email" className={`block text-xs font-semibold mb-1 ${currentTheme.subText}`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className={`absolute left-3 top-3.5 ${currentTheme.subText}`} />
                      <input
                        id="waitlist-email"
                        name="email"
                        type="email"
                        required
                        value={comingSoonEmail}
                        onChange={(e) => setComingSoonEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className={`w-full rounded-xl pl-9 pr-4 py-2.5 text-sm border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${
                          isDarkTheme ? 'bg-[#131B2E] text-white border-slate-700 placeholder-slate-400' : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="waitlist-attempt" className={`block text-xs font-semibold mb-1 ${currentTheme.subText}`}>
                      Target CA Level & Attempt
                    </label>
                    <select
                      id="waitlist-attempt"
                      name="attempt"
                      value={comingSoonAttempt}
                      onChange={(e) => setComingSoonAttempt(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2.5 text-sm border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${
                        isDarkTheme ? 'bg-[#131B2E] text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-300'
                      }`}
                    >
                      <option value="CA Foundation - Dec 2026">CA Foundation — Dec 2026</option>
                      <option value="CA Foundation - June 2027">CA Foundation — June 2027</option>
                      <option value="CA Inter - Nov 2026">CA Intermediate — Nov 2026</option>
                      <option value="CA Inter - May 2027">CA Intermediate — May 2027</option>
                      <option value="CA Final - Nov 2026">CA Final — Nov 2026</option>
                      <option value="CA Final - May 2027">CA Final — May 2027</option>
                      <option value="Other / General Study">Other CA Level / General Study</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className={`w-full font-bold py-3 rounded-xl transition-all shadow-md text-sm focus-visible:ring-2 focus-visible:ring-indigo-400 ${currentTheme.primaryBtn}`}
                  >
                    Get Priority Beta Access
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* ADMIN LOGIN / LEADS MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {adminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border-2 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative ${
                isDarkTheme ? 'bg-[#0B1120] border-slate-700 text-slate-50' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <button
                onClick={() => setAdminModalOpen(false)}
                aria-label="Close admin modal"
                className="absolute top-4 right-4 opacity-60 hover:opacity-100 p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <X size={20} />
              </button>

              {!isAdminLoggedIn ? (
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${currentTheme.audienceBadge}`}>
                    <Lock size={20} />
                  </div>
                  <h3 className={`font-heading font-bold text-xl mb-1 ${currentTheme.h2}`}>
                    Tutovia Sign In
                  </h3>
                  <p className={`text-xs mb-6 ${currentTheme.subText}`}>
                    Enter authorized credentials to access the administrative waitlist panel.
                  </p>

                  {adminError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs p-3 rounded-xl mb-4 font-semibold">
                      {adminError}
                    </div>
                  )}

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label htmlFor="admin-userid" className={`block text-xs font-semibold mb-1 ${currentTheme.subText}`}>
                        User ID
                      </label>
                      <input
                        id="admin-userid"
                        name="userid"
                        type="text"
                        required
                        value={adminUserId}
                        onChange={(e) => setAdminUserId(e.target.value)}
                        placeholder="Enter user ID"
                        className={`w-full rounded-xl px-3.5 py-2.5 text-sm border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${
                          isDarkTheme ? 'bg-[#131B2E] text-white border-slate-700 placeholder-slate-400' : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="admin-password" className={`block text-xs font-semibold mb-1 ${currentTheme.subText}`}>
                        Password
                      </label>
                      <input
                        id="admin-password"
                        name="password"
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full rounded-xl px-3.5 py-2.5 text-sm border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${
                          isDarkTheme ? 'bg-[#131B2E] text-white border-slate-700 placeholder-slate-400' : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-500'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className={`w-full font-bold py-2.5 rounded-xl transition-all shadow-md text-sm focus-visible:ring-2 focus-visible:ring-indigo-400 ${currentTheme.primaryBtn}`}
                    >
                      Sign In
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-500/20 mb-4">
                    <div>
                      <h3 className={`font-heading font-bold text-lg ${currentTheme.h2}`}>Waitlist Leads Panel</h3>
                      <p className="text-xs text-emerald-500 font-semibold">Authenticated as Admin</p>
                    </div>
                    <button
                      onClick={() => setIsAdminLoggedIn(false)}
                      className="text-xs text-rose-500 hover:opacity-80 px-2.5 py-1 rounded-lg border border-rose-500/20 focus-visible:ring-2 focus-visible:ring-indigo-400 font-semibold"
                    >
                      Log Out
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-xs ${currentTheme.bodyText}`}>
                      Total Waitlist Leads: <strong className={currentTheme.h3}>{leadsList.length}</strong>
                    </div>
                    <button
                      onClick={handleExportCSV}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-indigo-400 ${currentTheme.primaryBtn}`}
                    >
                      <Download size={13} />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className={`max-h-60 overflow-y-auto rounded-xl border-2 ${
                    isDarkTheme ? 'bg-[#131B2E] border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}>
                    {leadsList.length === 0 ? (
                      <div className={`p-6 text-center text-xs ${currentTheme.subText}`}>
                        No waitlist leads recorded yet in local storage.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead className={`border-b border-slate-500/20 font-semibold ${currentTheme.subText}`}>
                          <tr>
                            <th className="p-2.5">Email</th>
                            <th className="p-2.5">Target Level</th>
                            <th className="p-2.5">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-500/10">
                          {leadsList.map((lead) => (
                            <tr key={lead.id} className="hover:opacity-80">
                              <td className={`p-2.5 font-medium ${currentTheme.h3}`}>{lead.email}</td>
                              <td className={`p-2.5 ${currentTheme.bodyText}`}>{lead.attempt}</td>
                              <td className={`p-2.5 ${currentTheme.subText}`}>{new Date(lead.submittedAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* LEGAL & CONTACT INFO MODALS */}
      {/* ======================================================== */}
      <AnimatePresence>
        {infoModalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative ${currentTheme.modalBg}`}
            >
              <button
                onClick={() => setInfoModalType(null)}
                aria-label="Close information dialog"
                className="absolute top-4 right-4 opacity-60 hover:opacity-100 p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <X size={20} />
              </button>

              {infoModalType === 'privacy' && (
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${currentTheme.audienceBadge}`}>
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className={`font-heading font-bold text-xl mb-2 ${currentTheme.h2}`}>
                    Privacy Policy
                  </h3>
                  <div className={`text-xs space-y-3 leading-relaxed max-h-72 overflow-y-auto pr-2 ${currentTheme.bodyText}`}>
                    <p>
                      At Tutovia, we treat your study data and academic progress with the highest level of confidentiality.
                    </p>
                    <p>
                      <strong className={currentTheme.h3}>1. Data Collection:</strong> During our closed beta, we collect your email address and target CA exam level solely to notify you when access is available and to tailor study recommendations.
                    </p>
                    <p>
                      <strong className={currentTheme.h3}>2. Zero Commercial Selling:</strong> We never sell, rent, or trade your personal information or study queries to third-party advertisers.
                    </p>
                    <p>
                      <strong className={currentTheme.h3}>3. Security:</strong> All communications with Tutovia are encrypted in transit via industry-standard protocols.
                    </p>
                  </div>
                </div>
              )}

              {infoModalType === 'terms' && (
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${currentTheme.audienceBadge}`}>
                    <FileText size={20} />
                  </div>
                  <h3 className={`font-heading font-bold text-xl mb-2 ${currentTheme.h2}`}>
                    Terms of Service
                  </h3>
                  <div className={`text-xs space-y-3 leading-relaxed max-h-72 overflow-y-auto pr-2 ${currentTheme.bodyText}`}>
                    <p>
                      Welcome to Tutovia. By using our platform and joining our early-access waitlist, you agree to these basic terms:
                    </p>
                    <p>
                      <strong className={currentTheme.h3}>1. Pedagogical Companion:</strong> Tutovia provides intelligent study scheduling, conceptual clarifications, and active recall assistance. It is designed to complement, not replace, official ICAI study guidelines and faculty lectures.
                    </p>
                    <p>
                      <strong className={currentTheme.h3}>2. Syllabus Verification:</strong> CA aspirants should always cross-verify the latest statutory amendments, case laws, and notification circulars with official ICAI announcements.
                    </p>
                    <p>
                      <strong className={currentTheme.h3}>3. Beta Nature:</strong> Tutovia V2 is provided as an early-access preview. Features and interfaces may evolve based on authentic student feedback.
                    </p>
                  </div>
                </div>
              )}

              {infoModalType === 'contact' && (
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${currentTheme.audienceBadge}`}>
                    <Mail size={20} />
                  </div>
                  <h3 className={`font-heading font-bold text-xl mb-2 ${currentTheme.h2}`}>
                    Contact Tutovia Support
                  </h3>
                  <p className={`text-xs mb-4 leading-relaxed ${currentTheme.bodyText}`}>
                    Have questions about the beta, feature feedback, or suggestions for CA syllabus modules? We'd love to hear from you.
                  </p>
                  <div className={`border rounded-xl p-4 mb-4 ${currentTheme.cardAlt}`}>
                    <div className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${currentTheme.subText}`}>
                      Direct Email Support
                    </div>
                    <a 
                      href="mailto:support@tutovia.com" 
                      className={`text-sm font-bold flex items-center gap-1.5 ${currentTheme.accentText}`}
                    >
                      <span>support@tutovia.com</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                  <p className={`text-[11px] ${currentTheme.subText}`}>
                    We typically reply within 24 hours during normal study working days.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* V2 GROWTH & EMPOWERMENT MODALS ("For Students, By Students") */}
      {/* ======================================================== */}
      
      {/* 1. Unified Subject Hub Modal */}
      <UnifiedSubjectHubModal 
        isOpen={subjectHubOpen} 
        onClose={() => setSubjectHubOpen(false)}
        currentTrackId={activeTrackId}
        onSwitchTrack={(id) => {
          setActiveTrackId(id);
          saveTrackId(id);
        }}
        isDarkTheme={isDarkTheme}
      />

      {/* 2. Peer Study Room / Virtual Library Modal */}
      <PeerStudyRoomModal 
        isOpen={peerStudyRoomOpen}
        onClose={() => setPeerStudyRoomOpen(false)}
        isDarkTheme={isDarkTheme}
        activeSubject={currentTrackConfig.shortName}
      />

      {/* 3. Spaced Repetition Flashcards Modal */}
      <FlashcardsEngineModal 
        isOpen={flashcardsOpen}
        onClose={() => setFlashcardsOpen(false)}
        currentTrackId={activeTrackId}
        isDarkTheme={isDarkTheme}
      />

      {/* 4. Empathy Onboarding Modal */}
      <EmpathyOnboardingModal 
        isOpen={empathyOnboardingOpen}
        onClose={() => setEmpathyOnboardingOpen(false)}
        onComplete={(data) => {
          setActiveTrackId(data.academic_track);
          navigate('/signup');
        }}
        isDarkTheme={isDarkTheme}
      />

    </div>
  );
}
