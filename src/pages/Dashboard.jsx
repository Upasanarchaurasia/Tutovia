import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Award, Clock, AlertTriangle, CheckCircle2, Calendar, 
  Smile, ArrowRight, Play, Sparkles, Timer, Brain, BellRing, 
  AlertCircle, BookOpen, Target, ChevronRight, X, RotateCcw
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from '../api.js';
import PomodoroTimer from '../components/PomodoroTimer.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import TimetableGeneratorModal from '../components/TimetableGeneratorModal.jsx';
import EditTimetableModal from '../components/EditTimetableModal.jsx';
import BadgeGallery from '../components/BadgeGallery.jsx';
import ExamCountdown from '../components/ExamCountdown.jsx';
import { exportTimetableToICS } from '../utils/calendarExport.js';
import { supabase } from '../supabaseClient.js';
import { SYLLABUS_BY_STAGE } from '../data/syllabusData.js';

let initialNotificationsShown = false;

// --- Subject Card Component ---
const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', progress: 'bg-emerald-500' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', progress: 'bg-blue-500' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', progress: 'bg-rose-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', progress: 'bg-purple-500' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', progress: 'bg-amber-500' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', progress: 'bg-indigo-500' }
};

const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();
  const c = colorMap[subject.color] || colorMap.indigo;
  
  let statusText = "In Progress";
  let statusColor = "text-indigo-400";
  let progressColor = c.progress;

  if (subject.questionsAttempted === 0) {
    statusText = "Not Started";
    statusColor = "text-slate-400";
    progressColor = "bg-slate-600";
  } else if (subject.accuracy !== null && subject.accuracy < 60) {
    statusText = "Needs Attention";
    statusColor = "text-rose-400";
    progressColor = "bg-rose-500";
  } else if (subject.accuracy !== null && subject.accuracy >= 60) {
    statusText = "Active / Strong";
    statusColor = "text-emerald-400";
    progressColor = "bg-emerald-500";
  }

  return (
    <div 
      onClick={() => navigate(`/subject/${subject.id}`)}
      className={`glass-panel p-5 rounded-2xl border ${subject.questionsAttempted === 0 ? 'border-surface-border' : c.border} cursor-pointer hover:-translate-y-1 hover:border-indigo-500/40 transition-all group relative overflow-hidden`}
    >
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors pr-8 leading-tight">{subject.title}</h4>
        <div className={`w-8 h-8 rounded-lg ${subject.questionsAttempted === 0 ? 'bg-slate-800 text-slate-500' : `${c.bg} ${c.text}`} flex items-center justify-center shrink-0`}>
          <BookOpen className="w-4 h-4" />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Progress</span>
          <span className="font-bold text-slate-200">{subject.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-surface-card rounded-full overflow-hidden">
          <div 
            className={`h-full ${progressColor} rounded-full`} 
            style={{ width: `${subject.progress}%` }} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="p-2 bg-surface-card rounded-lg border border-surface-border">
          <span className="text-slate-500 block mb-0.5">Accuracy</span>
          <span className={`font-bold ${subject.accuracy !== null ? 'text-slate-200' : 'text-slate-500'}`}>
            {subject.accuracy !== null ? `${subject.accuracy}%` : '—'}
          </span>
        </div>
        <div className="p-2 bg-surface-card rounded-lg border border-surface-border">
          <span className="text-slate-500 block mb-0.5">Attempted</span>
          <span className="font-bold text-slate-300">{subject.questionsAttempted}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-surface-border">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
          {statusText}
        </span>
        {statusText === "Needs Attention" && (
          <span className="text-[10px] bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
            Practice Recommended
          </span>
        )}
      </div>
    </div>
  );
};


export default function Dashboard({ onOpenTutor }) {
  const [progress, setProgress] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [moods, setMoods] = useState([]);
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  // Mood State & Check-in Modal
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [selectedMood, setSelectedMood] = useState('Focused');
  const [moodNote, setMoodNote] = useState('');

  // Timetable Generator Modal State
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reschedulePrompt, setReschedulePrompt] = useState(null);

  // Focus Mode State
  const [isFocusMode, setIsFocusMode] = useState(false);

  // 12-Hour Clock
  const [clock12Str, setClock12Str] = useState('');

  useEffect(() => {
    const update12HourClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedH = hours.toString().padStart(2, '0');
      setClock12Str(`${formattedH}:${minutes}:${seconds} ${ampm}`);
    };

    update12HourClock();
    const interval = setInterval(update12HourClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    const uid = user?.id || 'u1';
    try {
      const profRes = await axios.get(`/api/profile?userId=${uid}`).catch(() => ({ data: {} }));
      if (profRes?.data) setProfile(profRes.data);
      
      const [progRes, schedRes, moodRes, subRes, analyticsRes] = await Promise.all([
        axios.post('/api/progress/check-in', { userId: uid }).catch(() => null),
        axios.get(`/api/progress?userId=${uid}`).catch(() => ({ data: null })),
        axios.get(`/api/schedule?userId=${uid}`).catch(() => ({ data: [] })),
        axios.get(`/api/mood?userId=${uid}`).catch(() => ({ data: [] })),
        axios.get(`/api/subjects?userId=${uid}`).catch(() => ({ data: [] })),
        axios.get(`/api/analytics?userId=${uid}`).catch(() => ({ data: null }))
      ]).then(([, p, s, m, sub, a]) => [p, s, m, sub, a]);
      
      if (progRes?.data) setProgress(progRes.data);
      if (schedRes?.data) setSchedule(Array.isArray(schedRes.data) ? schedRes.data : []);
      if (moodRes?.data) setMoods(Array.isArray(moodRes.data) ? moodRes.data : []);
      if (subRes?.data) setSubjects(Array.isArray(subRes.data) ? subRes.data : []);
      if (analyticsRes?.data) setAnalytics(analyticsRes.data);

      // Show Mood Check-in if not logged today
      const today = new Date().toDateString();
      const hasLoggedMoodToday = moodRes.data.some(m => m.date && m.date.includes('Today'));
      if (!hasLoggedMoodToday) {
        setTimeout(() => setShowMoodCheckIn(true), 2000);
      }

      if (!initialNotificationsShown) {
        initialNotificationsShown = true;
        
        const affirmations = [
          "Believe you can and you're halfway there.",
          "Success is the sum of small efforts repeated daily.",
          "You don't have to be perfect to be amazing.",
          "A little progress each day adds up to big results.",
          "Focus on the step in front of you, not the whole staircase."
        ];
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        
        setTimeout(() => {
          addToast(`Daily Affirmation: ${randomAffirmation}`, 'motivation', 8000);
        }, 500);
        
        const pendingCount = schedRes.data.filter(s => !s.done).length;
        if (pendingCount > 0) {
          setTimeout(() => {
            addToast(`You have ${pendingCount} pending session${pendingCount > 1 ? 's' : ''} for today. Let's get to work!`, 'info', 10000);
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleToggleSchedule = async (id) => {
    try {
      const res = await axios.post('/api/schedule/toggle', { id });
      setSchedule(res.data);
    } catch (err) {
      console.error('Error toggling schedule item:', err);
    }
  };

  const handleGenerateAIClick = () => {
    setShowTimetableModal(true);
  };

  const submitGenerateAI = async (config) => {
    setIsGeneratingAI(true);
    addToast('Analyzing weaknesses and generating AI Timetable...', 'info');
    try {
      const res = await axios.post('/api/schedule/ai-generate', { 
        userId: user.id,
        ...config
      });
      setSchedule(res.data);
      addToast('AI Timetable successfully generated!', 'success');
    } catch (err) {
      console.error('Error generating AI schedule:', err);
      addToast('Failed to generate AI Timetable.', 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveEditedSchedule = async (newSchedule) => {
    setSchedule(newSchedule);
    addToast('Timetable schedule updated successfully!', 'success');
    try {
      await axios.post('/api/schedule/custom', { userId: user.id, schedule: newSchedule }).catch(() => {});
      if (user?.id) {
        supabase.from('schedule').upsert(newSchedule.map(s => ({
          user_id: user.id,
          time_range: s.timeRange || s.time12 || s.time,
          activity: s.activity,
          focus: s.focus,
          type: s.type,
          status: s.status,
          done: s.done
        }))).catch(() => {});
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusUpdate = async (item, newStatus) => {
    try {
      const res = await axios.post('/api/schedule/update-status', { id: item.id, status: newStatus });
      setSchedule(res.data);
    } catch (err) {
      setSchedule(prev => prev.map(s => s.id === item.id ? { ...s, status: newStatus, done: newStatus === 'Completed' } : s));
    }

    if (newStatus === 'Not Completed' || newStatus === 'Partially Completed') {
      setReschedulePrompt(item);
    }
  };

  const handleConfirmReschedule = () => {
    if (!reschedulePrompt) return;
    addToast(`"${reschedulePrompt.activity}" flagged for tomorrow's priority revision!`, 'motivation');
    setReschedulePrompt(null);
  };

  const handleSaveMood = async () => {
    try {
      await axios.post('/api/mood', { mood: selectedMood, note: moodNote });
      setShowMoodCheckIn(false);
      addToast(`Emotional Check-in saved. Have a great session!`, 'success');
      // Refresh moods
      const moodRes = await axios.get(`/api/mood?userId=${user.id}`);
      setMoods(moodRes.data);
    } catch (err) {
      console.error(err);
      addToast('Could not save mood. Is the backend server running?', 'error');
      setShowMoodCheckIn(false); // Don't trap the user
    }
  };

  // --- Official ICAI Exam Countdown Logic (Group-Aware) ---
  const [daysToExam, setDaysToExam] = useState(null);
  const [officialExamMeta, setOfficialExamMeta] = useState(null);
  
  useEffect(() => {
    if (profile?.attempt) {
      const attempt = profile.attempt || "September 2026";
      const group = profile.ca_group || "Both Groups";
      const stage = profile.ca_stage || "intermediate";

      axios.get(`/api/icai-exam-dates?attempt=${encodeURIComponent(attempt)}&group=${encodeURIComponent(group)}&stage=${encodeURIComponent(stage)}`)
        .then(res => {
          if (res?.data) {
            setDaysToExam(res.data.daysLeft !== undefined ? res.data.daysLeft : 0);
            setOfficialExamMeta(res.data);
          }
        })
        .catch(() => {
          const [monthStr, yearStr] = attempt.split(' ');
          const monthMap = { 'January': 0, 'Jan': 0, 'May': 4, 'September': 8, 'Sep': 8, 'November': 10 };
          const monthIndex = monthMap[monthStr] !== undefined ? monthMap[monthStr] : 8;
          const year = parseInt(yearStr, 10) || 2026;
          const day = group === 'Group 2' ? 19 : 12;
          const targetDate = new Date(year, monthIndex, day);
          const diffDays = Math.max(0, Math.ceil((targetDate - new Date()) / (1000 * 60 * 60 * 24)));
          setDaysToExam(diffDays);
        });
    }
  }, [profile?.attempt, profile?.ca_group, profile?.ca_stage]);

  // Client-side strict group filter safeguard for subjects
  const displayedSubjects = useMemo(() => {
    if (!profile?.ca_group || profile.ca_group === 'Both Groups') {
      return subjects;
    }
    return subjects.filter(s => s.group === profile.ca_group);
  }, [subjects, profile?.ca_group]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Syncing study workspace...</p>
      </div>
    );
  }

  const overdueItem = schedule.find(s => !s.done && s.isOverdue);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* --- MOOD CHECK-IN MODAL --- */}
      {showMoodCheckIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-indigo-500/30 shadow-2xl relative">
            <button onClick={() => setShowMoodCheckIn(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
              <Smile className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Daily Emotional Check-in</h3>
            <p className="text-slate-400 text-sm mb-6">How are you feeling about your studies today?</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {['Focused', 'Overwhelmed', 'Anxious', 'Motivated', 'Exhausted', 'Calm'].map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                    selectedMood === m 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-surface-card border-surface-border text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            
            <textarea
              placeholder="Any quick thoughts? (optional)"
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors mb-6 resize-none h-20"
            />
            
            <button
              onClick={handleSaveMood}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-static-white text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
            >
              Start My Day
            </button>
          </div>
        </div>
      )}


      {/* 1. Header Banner with 12-Hour Time */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-indigo-500/20 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Current Time: <strong>{clock12Str}</strong></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good evening, {user?.name || 'Scholar'} 👋
            </h1>
            <p className="text-indigo-400 font-bold text-sm mt-1 max-w-2xl leading-relaxed">
              CA Intermediate — {profile?.ca_group || 'Not selected'}
            </p>
          </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
            {daysToExam !== null && (
              <div className="flex flex-col items-center bg-indigo-950/40 border border-indigo-500/30 rounded-xl px-4 py-2 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-0.5">Days to {profile?.attempt || 'Exam'}</span>
                <div className="text-2xl font-black text-white leading-none tracking-tight">{daysToExam}</div>
              </div>
            )}
            <div className="flex items-center gap-3">
            <button
              onClick={() => fetchDashboardData()}
              disabled={isRefreshing}
              title="Refresh Dashboard"
              className="px-3 py-2.5 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-200 border border-surface-border flex items-center gap-2 transition-all text-sm font-semibold"
            >
              <RotateCcw className={`w-4 h-4 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onOpenTutor}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-static-white text-sm font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Brain className="w-4 h-4 text-indigo-200" />
              <span>Ask AI Tutor</span>
            </button>
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold border flex items-center gap-2 transition-all ${isFocusMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-surface-card hover:bg-slate-800 text-slate-200 border-surface-border'}`}
            >
              <Target className="w-4 h-4" />
              <span>{isFocusMode ? 'Exit Focus Mode' : 'Focus Mode'}</span>
            </button>
            <Link
              to="/exams"
              className="px-4 py-2.5 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-surface-border flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Start Mock</span>
            </Link>
          </div>
          </div>
        </div>
      </div>

      {!isFocusMode && <ExamCountdown profile={profile} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!isFocusMode && (<>
          {/* 2. NEXT BEST ACTION (AI Coach Recommendation) */}
          <div className="h-full glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 to-background flex items-center justify-between shadow-lg shadow-indigo-500/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1 block">AI Study Coach Recommendation</span>
                <h3 className="text-lg font-bold text-white leading-tight">{analytics?.nextAction || "Take a mock exam to get started."}</h3>
                <p className="text-sm text-slate-400 mt-1">Based on your recent performance and weaknesses.</p>
              </div>
            </div>
            <Link to="/exams" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-static-white text-sm font-bold transition-all shadow-md">
              Action <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          </>)}
        </div>
        <div className="lg:col-span-1">
          <PomodoroTimer userId={user?.id} />
        </div>
      </div>

      {/* 3. Recovery Mode / Uncompleted Session Reminder Notification */}
      {overdueItem && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Recovery Mode (Overdue Task)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">{overdueItem.time12}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{overdueItem.title}</h4>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Link
              to={overdueItem.link || '/flashcards'}
              className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Play className="w-4 h-4" />
              <span>Start Task</span>
            </Link>
            <button
              onClick={() => handleToggleSchedule(overdueItem.id)}
              className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-static-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Completed</span>
            </button>
          </div>
        </div>
      )}

      {!isFocusMode && (
        <>
      {/* 4. Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
                {/* Daily Study Goal Ring */}
        <div className="glass-card p-4 rounded-2xl border border-surface-border flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-surface-border" strokeWidth="3" />
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-purple-500" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - Math.min(100, Math.round(((parseFloat(progress?.study_hours_today || 0)) / (parseFloat(progress?.daily_goal_minutes ? progress.daily_goal_minutes / 60 : 3))) * 100))} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-white">{Math.min(100, Math.round(((parseFloat(progress?.study_hours_today || 0)) / (parseFloat(progress?.daily_goal_minutes ? progress.daily_goal_minutes / 60 : 3))) * 100))}%</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Daily Goal</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-white">{progress?.study_hours_today || '0.0'}</span>
              <span className="text-xs font-medium text-slate-500">/ {progress?.daily_goal_minutes ? (progress.daily_goal_minutes / 60).toFixed(1) : '3.0'} hrs</span>
            </div>
          </div>
        </div>

        {/* Average Quiz Score */}
        <div className="glass-card p-5 rounded-2xl border border-surface-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Quiz Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{progress?.avg_score || 0}%</span>
              <span className="text-xs font-medium text-emerald-400">Mock Exams</span>
            </div>
          </div>
        </div>

        {/* XP & Level Tracker */}
        <div className="glass-card p-5 rounded-2xl border border-surface-border flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 z-10 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="z-10 flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-400 font-medium">Level {progress?.level || 1}</span>
              <span className="text-[10px] font-bold text-purple-400">{progress?.xp || 0} XP</span>
            </div>
            <div className="w-full h-1.5 bg-surface-card rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                style={{ width: `${progress?.levelProgress || 0}%` }} 
              />
            </div>
          </div>
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/10 blur-2xl rounded-full -mr-8 -mt-8"></div>
        </div>

        {/* Exam Readiness Score */}
        <div className="glass-card p-5 rounded-2xl border border-surface-border flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Exam Readiness Score</span>
            <div className="flex items-baseline gap-2">
              {analytics?.readinessScore !== null ? (
                <>
                  <span className="text-2xl font-bold text-white">{analytics?.readinessScore}%</span>
                  <span className="text-[10px] text-amber-400">Calculated</span>
                </>
              ) : (
                <span className="text-sm font-medium text-slate-400">Calculating...</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Gamification Badge Row */}
      <BadgeGallery progress={progress} compact={true} />

      {/* 5. Weak Topics Spotlight */}
      {analytics?.weaknesses && analytics.weaknesses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            Priority Focus Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.weaknesses.map((weakness, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-rose-500/30 transition-all">
                <h3 className="font-bold text-slate-200 mb-3">{weakness.subject}</h3>
                <div className="space-y-2">
                  {weakness.topics.map((topic, tidx) => (
                    <div key={tidx} className="text-xs text-rose-300 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                      • {topic}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Subject Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            My Subjects
          </h2>
          {(profile?.ca_stage === 'intermediate' || profile?.ca_stage === 'final' || !profile?.ca_stage) && profile?.ca_group && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {profile.ca_group === 'Both Groups' ? '📚 Both Groups (6 Subjects)' : `📂 ${profile.ca_group} (3 Subjects)`}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedSubjects.length > 0 ? (
            displayedSubjects.map(sub => (
              <SubjectCard key={sub.id} subject={sub} />
            ))
          ) : (
            <div className="col-span-full p-8 text-center bg-surface-card border border-surface-border rounded-2xl">
              <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-1">No Subjects Found</h3>
              <p className="text-slate-400 text-sm">Please check your profile settings and ensure your CA Stage is selected correctly.</p>
            </div>
          )}
        </div>
      </div>

      {/* My Syllabus Quick View */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border mt-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          My Official Syllabus
        </h2>
        <div className="space-y-3">
          {SYLLABUS_BY_STAGE[profile?.ca_stage || 'intermediate']?.papers.length > 0 ? (
            SYLLABUS_BY_STAGE[profile?.ca_stage || 'intermediate'].papers.map(paper => (
              <a key={paper.id} href={paper.officialPdfUrl} target="_blank" rel="noopener noreferrer" className={`p-4 rounded-2xl bg-surface-card border hover:border-${paper.color}-500/50 transition-colors flex items-center justify-between group`}>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider text-${paper.color}-400 mb-1 block`}>{paper.code}</span>
                  <h4 className="text-white font-bold group-hover:text-indigo-300 transition-colors">{paper.shortTitle}</h4>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
              </a>
            ))
          ) : (
            <p className="text-slate-400 text-sm">No official syllabus papers found for this stage.</p>
          )}
        </div>
      </div>

            </>
      )}

      {/* 7. Chart & Timetable Schedule Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {!isFocusMode && (<>
          {/* Performance Chart */}
        <div className="lg:col-span-3 glass-panel p-6 rounded-3xl border border-surface-border flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Mock Exam Score Progression</h3>
              <p className="text-xs text-slate-400">Score history across practice quizzes</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Last 5 Attempts
            </span>
          </div>

          <div className="h-64 w-full">
            {progress?.trend && progress.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progress.trend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '12px', color: '#fff' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6366F1" 
                    strokeWidth={3} 
                    dot={{ fill: '#818CF8', r: 5 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No mock exam history yet. Take your first test!
              </div>
            )}
          </div>
        </div>
        </>)}

        {/* Timetable Schedule Checklist */}
        <div className="lg:col-span-3 glass-panel p-6 rounded-3xl border border-surface-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Daily Timetable</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-border text-slate-300 text-xs font-bold border border-surface-border flex items-center gap-1.5 transition-all"
                  title="Edit session details or add custom slots"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => exportTimetableToICS(schedule, user?.name)}
                  className="px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-border text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 transition-all"
                  title="Download .ics file for Google Calendar / Apple Calendar"
                >
                  📅 Export
                </button>
                <button
                  onClick={() => submitGenerateAI({ 
                    studyHours: profile?.daily_study_hours || 8,
                    availableHours: profile?.daily_study_hours || 8,
                    wakeTime: profile?.wake_time || '07:00',
                    sleepTime: profile?.sleep_time || '23:00',
                    commitmentsStr: profile?.commitments || ''
                  })}
                  disabled={isGeneratingAI}
                  className="px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-border text-slate-300 text-xs font-bold border border-surface-border flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                  🔄 Regenerate
                </button>
                <button
                  onClick={handleGenerateAIClick}
                  disabled={isGeneratingAI}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  ⚙️ Change Study Hours
                </button>
              </div>
            </div>

            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-border text-xs text-slate-400">
                    <th className="py-2 font-medium">Time</th>
                    <th className="py-2 font-medium">Subject/Activity</th>
                    <th className="py-2 font-medium">Focus</th>
                    <th className="py-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((item) => (
                    <tr 
                      key={item.id}
                      className={`border-b border-surface-border/50 transition-colors ${
                        item.status === 'Completed'
                          ? 'opacity-50 text-slate-500 hover:bg-surface-card/20' 
                          : 'text-slate-200 hover:bg-surface-card'
                      }`}
                    >
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-mono font-bold ${item.status === 'Completed' ? 'line-through text-slate-500' : 'text-indigo-400'}`}>{item.timeRange || item.time12 || item.time}</span>
                        </div>
                      </td>
                      <td className={`py-3 pr-4 text-xs font-semibold ${item.status === 'Completed' ? 'line-through' : ''}`}>
                        {item.activity || item.title}
                      </td>
                      <td className={`py-3 text-[11px] ${item.status === 'Completed' ? 'line-through' : ''}`}>
                        {item.focus ? (
                          <span className={`px-2 py-0.5 rounded-full whitespace-nowrap ${
                            item.type === 'study' ? 'bg-indigo-500/10 text-indigo-300' :
                            item.type === 'break' ? 'bg-emerald-500/10 text-emerald-300' :
                            item.type === 'commitment' ? 'bg-amber-500/10 text-amber-300' :
                            'bg-slate-500/10 text-slate-300'
                          }`}>
                            {item.focus}
                          </span>
                        ) : (
                           item.duration && <span className="text-slate-400">{item.duration}</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={item.status || (item.done ? 'Completed' : 'Not Completed')}
                          onChange={(e) => handleStatusUpdate(item, e.target.value)}
                          className="bg-surface-card border border-surface-border rounded-lg text-xs px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Not Completed">❌ Not Completed</option>
                          <option value="Partially Completed">⚠️ Partially Completed</option>
                          <option value="Completed">✅ Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {profile?.whyThisSchedule && (
              <div className="mt-4 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Brain className="w-3 h-3" /> Why this schedule?</h4>
                <div className="text-xs text-slate-300 leading-relaxed prose prose-invert prose-p:my-1 prose-strong:text-indigo-300">
                  <span dangerouslySetInnerHTML={{__html: profile.whyThisSchedule.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}}></span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <TimetableGeneratorModal 
        isOpen={showTimetableModal} 
        onClose={() => setShowTimetableModal(false)}
        onGenerate={submitGenerateAI}
        defaultHours={profile?.daily_study_hours || 8}
      />

      <EditTimetableModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        schedule={schedule}
        onSave={handleSaveEditedSchedule}
      />

      {/* Adaptive Reschedule Dialog */}
      {reschedulePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-surface-border w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Adaptive AI Rescheduling</h3>
                <p className="text-xs text-slate-400">Keep your revision streak on track</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              You marked <strong className="text-amber-300">{reschedulePrompt.activity || 'this session'}</strong> as <em>{reschedulePrompt.status || 'Pending'}</em>. Would you like Tutovia AI to automatically reschedule this topic with top priority in tomorrow's timetable?
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setReschedulePrompt(null)}
                className="flex-1 py-2.5 rounded-xl bg-surface-card hover:bg-surface-border text-slate-300 text-xs font-semibold border border-surface-border transition-colors"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Prioritize Tomorrow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}









