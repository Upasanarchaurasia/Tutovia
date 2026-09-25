import React, { useState, useEffect } from 'react';
import { User as UserIcon, Settings, Target, Flame, Trophy, Clock, BookOpen, ChevronRight, LogOut, Shield, Edit2, Check, Loader2, Moon, Sun, AlertTriangle, Cloud, Smartphone, Laptop, RefreshCw } from 'lucide-react';
import axios from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function User() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [icaiDates, setIcaiDates] = useState(null);
  const { 
    user, 
    logout, 
    syncStatus, 
    lastSyncedAt, 
    isSyncEnabled, 
    triggerSync, 
    toggleCloudSync, 
    setShowSyncModal 
  } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  useEffect(() => {
    if (isEditing && formData.attempt) {
      axios.get(`/api/icai-exam-dates?attempt=${encodeURIComponent(formData.attempt)}`)
        .then(res => setIcaiDates(res.data))
        .catch(err => console.error(err));
    }
  }, [isEditing, formData.attempt]);

  const fetchProfile = async () => {
    const uid = user?.id;
    if (!uid) return;
    try {
      const res = await axios.get(`/api/profile?userId=${uid}`).catch(() => ({ data: {} }));
      setProfile(res.data);
      setFormData(res.data);
      
      const progRes = await axios.get(`/api/progress?userId=${uid}`).catch(() => ({ data: null }));
      if (progRes?.data) setProgressData(progRes.data);

      const datesRes = await axios.get(`/api/icai-exam-dates?attempt=${encodeURIComponent(res.data?.attempt || '')}`).catch(() => ({ data: null }));
      if (datesRes?.data) setIcaiDates(datesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const uid = user?.id;
    if (!uid) {
      setIsSaving(false);
      return;
    }
    try {
      const res = await axios.post(`/api/profile?userId=${uid}`, formData);
      setProfile(res.data);
      const datesRes = await axios.get(`/api/icai-exam-dates?attempt=${encodeURIComponent(res.data?.attempt || '')}`).catch(() => ({ data: null }));
      if (datesRes?.data) setIcaiDates(datesRes.data);
      setIsEditing(false);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to save profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSync = async () => {
    addToast('Initiating cloud sync with Supabase...', 'info');
    const res = await triggerSync(true);
    if (res?.success) {
      addToast('Data successfully synced between iOS App and Website!', 'success');
      fetchProfile();
    } else {
      addToast(res?.reason || 'Sync completed with local defaults.', 'info');
    }
  };

  const handleResetProgress = async (type) => {
    if (!window.confirm(`Are you absolutely sure you want to reset your ${type} progress? This cannot be undone.`)) {
      return;
    }
    
    try {
      await axios.post('/api/progress/reset', { type, userId: user.id });
      addToast(`${type === 'exams' ? 'Exam' : 'Flashcard'} progress has been reset.`, 'info');
      // Refresh local progress state
      const progRes = await axios.get(`/api/progress?userId=${user.id}`);
      setProgressData(progRes.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to reset progress.', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("WARNING: This will permanently wipe your account progress, study streaks, and records. This action cannot be undone. Continue?")) {
      return;
    }
    try {
      await axios.post('/api/progress/reset', { type: 'exams', userId: user.id });
      await axios.post('/api/progress/reset', { type: 'flashcards', userId: user.id });
      addToast('Your study data has been erased. Signing out...', 'info');
      setTimeout(async () => {
        await logout();
        navigate('/');
      }, 1200);
    } catch (err) {
      addToast('Failed to process data erasure.', 'error');
    }
  };

  const stats = [
    { label: "Focus Hours", value: progressData?.study_hours_today || "0", icon: Clock, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Current Streak", value: `${progressData?.current_streak || 0} Days`, icon: Flame, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Tasks Done", value: progressData?.completed_pomodoros || "0", icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Mock Exams", value: progressData?.total_exams || "0", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" }
  ];

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Student Profile
          </h1>
          <p className="text-slate-400 mt-1">Manage your learning journey and CA Intermediate goals.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card border border-surface-border text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-surface-border text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-1 mb-4 shadow-xl relative group">
                <div className="w-full h-full bg-surface rounded-full flex items-center justify-center border-4 border-surface overflow-hidden relative">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-10 h-10 text-indigo-400" />
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-[10px] font-bold">CHANGE</span>
                    <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                      const file = e.target.files[0];
                      if(file) {
                        if (file.size > 500 * 1024) {
                          alert("Image size must be less than 500KB");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          const base64String = reader.result;
                          setProfile(prev => ({...prev, avatar_url: base64String}));
                          setFormData(prev => ({...prev, avatar_url: base64String}));
                          try {
                            await axios.post(`/api/profile?userId=${user.id}`, {
                              ...profile,
                              avatar_url: base64String
                            });
                          } catch (err) {
                            console.error("Failed to save avatar", err);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}/>
                  </label>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">{user?.name || profile.name}</h2>
              <p className="text-indigo-400 font-medium text-sm mb-4">CA Intermediate • {profile.ca_group}</p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-6">
                <Shield className="w-3.5 h-3.5" />
                <span>Pro Member</span>
              </div>
              
              <div className="space-y-3 text-left">
                <div className="p-3 rounded-xl bg-surface-card border border-surface-border flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Email</span>
                  <span className="text-slate-200 text-sm font-medium">{user?.email || 'student@icai.org'}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-card border border-surface-border flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Joined</span>
                  <span className="text-slate-200 text-sm font-medium">August 2026</span>
                </div>
              </div>

              {/* Owner-Exclusive Admin Portal Link */}
              {(user?.id === 'u1' || (user?.email && user.email.toLowerCase() === 'chaurasiaupasana70@gmail.com')) && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="w-full mt-4 flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all font-semibold text-xs group"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Website Admin Portal</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Setup */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Goal & Preferences Card */}
          <div className="glass-panel p-6 rounded-3xl border border-surface-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Academic Goals
                </h3>
                <p className="text-xs text-slate-400 mt-1">These settings influence your dashboard and study plan.</p>
              </div>
              
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-semibold"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-static-white transition-colors text-sm font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              
              <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">CA Stage & Group</label>
                {isEditing ? (
                  <div className="space-y-2">
                    <select 
                      value={formData.ca_stage || 'intermediate'}
                      onChange={(e) => setFormData({...formData, ca_stage: e.target.value})}
                      className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                    >
                      <option value="foundation">CA Foundation</option>
                      <option value="intermediate">CA Intermediate</option>
                      <option value="ittc">CA ITTC (Training)</option>
                      <option value="final">CA Final</option>
                    </select>
                    {(formData.ca_stage === 'intermediate' || formData.ca_stage === 'final') && (
                      <select 
                        value={formData.ca_group}
                        onChange={(e) => setFormData({...formData, ca_group: e.target.value})}
                        className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Group 1">Group 1</option>
                        <option value="Group 2">Group 2</option>
                        <option value="Both Groups">Both Groups</option>
                      </select>
                    )}
                  </div>
                ) : (
                  <div className="text-white font-medium">
                    {profile.ca_stage === 'foundation' ? 'CA Foundation' :
                     profile.ca_stage === 'final' ? `CA Final (${profile.ca_group})` :
                     profile.ca_stage === 'ittc' ? 'CA ITTC' :
                     `CA Intermediate (${profile.ca_group})`}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Target Attempt</label>
                {isEditing ? (
                  <select 
                    value={formData.attempt}
                    onChange={(e) => setFormData({...formData, attempt: e.target.value})}
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Not set">Select Attempt</option>
                    <option value="May 2024">May 2024</option>
                    <option value="September 2024">September 2024</option>
                    <option value="January 2025">January 2025</option>
                    <option value="May 2025">May 2025</option>
                    <option value="September 2025">September 2025</option>
                    <option value="January 2026">January 2026</option>
                    <option value="May 2026">May 2026</option>
                    <option value="September 2026">September 2026</option>
                    <option value="January 2027">January 2027</option>
                    <option value="May 2027">May 2027</option>
                  </select>
                ) : (
                  <div className="text-white font-medium">{profile.attempt || "Not set"}</div>
                )}
              </div>
              <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">UI Theme</label>
                <button 
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-3 px-4 py-2 w-full rounded-xl bg-surface border border-surface-border text-white text-sm hover:bg-surface-border/50 transition-colors font-medium shadow-sm"
                >
                  {theme === 'dark' ? (
                    <><Sun className="w-4 h-4 text-amber-400" /> Switch to Light Mode</>
                  ) : (
                    <><Moon className="w-4 h-4 text-indigo-500" /> Switch to Dark Mode</>
                  )}
                </button>
              </div>
              <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Official ICAI Exam Date</label>
                <div className="text-white font-medium">
                  {icaiDates ? (
                    icaiDates.declared ? (
                      <span className="text-emerald-400">{icaiDates.dates}</span>
                    ) : (
                      <span className="text-slate-400 italic">Not declared yet.</span>
                    )
                  ) : "Loading..."}
                </div>
              </div>

            </div>
          </div>

          {/* Timetable Configuration Card */}
          <div className="glass-panel p-6 rounded-3xl border border-surface-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  Timetable Configuration
                </h3>
                <p className="text-xs text-slate-400 mt-1">Configure your daily limits for the AI Timetable Generator.</p>
              </div>
              
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-semibold"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-static-white transition-colors text-sm font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              
              <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Target Daily Study Hours</label>
                {isEditing ? (
                  <select 
                    value={formData.daily_study_hours || "8"}
                    onChange={(e) => setFormData({...formData, daily_study_hours: e.target.value})}
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {[2, 4, 6, 8, 10, 12, 14].map(h => <option key={h} value={h}>{h} Hours</option>)}
                  </select>
                ) : (
                  <div className="text-white font-medium">{profile.daily_study_hours || "8"} Hours</div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Wake & Sleep Time</label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input 
                      type="time" 
                      value={formData.wake_time || "07:00"}
                      onChange={(e) => setFormData({...formData, wake_time: e.target.value})}
                      className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input 
                      type="time" 
                      value={formData.sleep_time || "23:00"}
                      onChange={(e) => setFormData({...formData, sleep_time: e.target.value})}
                      className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ) : (
                  <div className="text-white font-medium">Wake: {profile.wake_time || "07:00 AM"} | Sleep: {profile.sleep_time || "11:00 PM"}</div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-surface-card border border-surface-border md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Fixed Commitments (College, Gym, Work)</label>
                {isEditing ? (
                  <textarea 
                    value={formData.commitments || ""}
                    onChange={(e) => setFormData({...formData, commitments: e.target.value})}
                    placeholder="e.g. 10:00-14:00 College, 18:00-19:00 Gym"
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[60px]"
                  />
                ) : (
                  <div className="text-white font-medium whitespace-pre-wrap">{profile.commitments || "None specified"}</div>
                )}
              </div>

            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="glass-panel p-4 rounded-2xl border border-surface-border hover:-translate-y-1 transition-transform">
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* CA Career Journey Roadmap */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 mt-6 relative overflow-hidden bg-gradient-to-b from-surface-card to-background">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Your CA Career Journey
            </h2>
            <div className="relative border-l-2 border-slate-700 ml-4 space-y-8 py-2">
              <div className={`relative pl-6 ${profile?.ca_stage === 'foundation' ? 'opacity-100' : ''}`}>
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-background ${profile?.ca_stage === 'foundation' ? 'bg-indigo-500 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-emerald-500'}`} />
                {profile?.ca_stage === 'foundation' && (
                  <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full flex items-center justify-center">
                    <Flame className="w-3 h-3 text-white absolute" />
                  </div>
                )}
                <h4 className={`${profile?.ca_stage === 'foundation' ? 'text-indigo-400 text-lg' : 'text-emerald-400'} font-bold`}>CA Foundation</h4>
                <p className={`text-xs mt-1 ${profile?.ca_stage === 'foundation' ? 'text-indigo-300/70' : 'text-slate-400'}`}>
                  {profile?.ca_stage === 'foundation' ? 'Current Stage.' : 'Cleared successfully.'}
                </p>
              </div>
              <div className={`relative pl-6 ${(profile?.ca_stage === 'foundation') ? 'opacity-50' : ''}`}>
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-background ${profile?.ca_stage === 'intermediate' ? 'bg-indigo-500 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : (profile?.ca_stage === 'foundation' ? 'bg-slate-700' : 'bg-emerald-500')}`} />
                {profile?.ca_stage === 'intermediate' && (
                   <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full flex items-center justify-center">
                     <Flame className="w-3 h-3 text-white absolute z-10" />
                   </div>
                )}
                <h4 className={`${profile?.ca_stage === 'intermediate' ? 'text-indigo-400 text-lg' : (profile?.ca_stage === 'foundation' ? 'text-slate-300' : 'text-emerald-400')} font-bold`}>CA Intermediate</h4>
                <p className={`text-xs mt-1 ${profile?.ca_stage === 'intermediate' ? 'text-indigo-300/70' : 'text-slate-400'}`}>
                  {profile?.ca_stage === 'intermediate' ? `Current Stage. You are preparing for ${profile?.ca_group}.` : (profile?.ca_stage === 'foundation' ? 'Next milestone.' : 'Cleared successfully.')}
                </p>
              </div>
              <div className={`relative pl-6 ${(profile?.ca_stage === 'foundation' || profile?.ca_stage === 'intermediate') ? 'opacity-50' : ''}`}>
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-background ${profile?.ca_stage === 'ittc' ? 'bg-indigo-500 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : (profile?.ca_stage === 'final' ? 'bg-emerald-500' : 'bg-slate-700')}`} />
                {profile?.ca_stage === 'ittc' && (
                   <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full flex items-center justify-center">
                     <Flame className="w-3 h-3 text-white absolute z-10" />
                   </div>
                )}
                <h4 className={`${profile?.ca_stage === 'ittc' ? 'text-indigo-400 text-lg' : (profile?.ca_stage === 'final' ? 'text-emerald-400' : 'text-slate-300')} font-bold`}>ITT & Orientation / Articleship</h4>
                <p className={`text-xs mt-1 ${profile?.ca_stage === 'ittc' ? 'text-indigo-300/70' : 'text-slate-500'}`}>
                  {profile?.ca_stage === 'ittc' ? 'Current Stage. Practical training.' : (profile?.ca_stage === 'final' ? 'Completed successfully.' : 'Pre-requisite for Final.')}
                </p>
              </div>
              <div className={`relative pl-6 ${profile?.ca_stage !== 'final' ? 'opacity-50' : ''}`}>
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-background ${profile?.ca_stage === 'final' ? 'bg-indigo-500 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-700'}`} />
                 {profile?.ca_stage === 'final' && (
                   <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full flex items-center justify-center">
                     <Flame className="w-3 h-3 text-white absolute z-10" />
                   </div>
                )}
                <h4 className={`${profile?.ca_stage === 'final' ? 'text-indigo-400 text-lg' : 'text-slate-300'} font-bold flex items-center gap-2`}>CA Final <Trophy className="w-3 h-3 text-amber-500" /></h4>
                <p className={`text-xs mt-1 ${profile?.ca_stage === 'final' ? 'text-indigo-300/70' : 'text-slate-500'}`}>
                  {profile?.ca_stage === 'final' ? `Current Stage. The ultimate milestone! Preparing for ${profile?.ca_group}.` : 'The ultimate milestone to become a Chartered Accountant.'}
                </p>
              </div>
            </div>
          </div>



          {/* CLOUD SYNCHRONIZATION (APP <-> WEBSITE) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 mt-6 relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Cross-Device Cloud Sync</h2>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Keep your study timetable, streak, completed chapters, and mock scores synchronized between the Tutovia iOS App and Website via Supabase.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  syncStatus === 'synced' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : syncStatus === 'syncing'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    syncStatus === 'synced' ? 'bg-emerald-400' : syncStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-indigo-400'
                  }`} />
                  {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Synced with Cloud' : 'Cloud Active'}
                </span>
              </div>
            </div>

            {/* Sync Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-surface border border-surface-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Connected Devices</span>
                  <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-medium">
                    <Smartphone className="w-4 h-4" />
                    <span>App</span>
                    <span className="text-slate-500">↔</span>
                    <Laptop className="w-4 h-4" />
                    <span>Web</span>
                  </div>
                </div>
                <p className="text-sm text-white font-medium">iOS App (org.tutovia.app) & Tutovia Web</p>
                <p className="text-xs text-slate-400 mt-1">Changes made on your iPhone automatically appear on the website and vice versa.</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-surface-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sync Status</span>
                  <span className="text-xs text-indigo-300">
                    {lastSyncedAt ? `Last: ${new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Ready to sync'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-300">Background Auto-Sync</span>
                  <button
                    type="button"
                    onClick={() => toggleCloudSync(!isSyncEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${isSyncEnabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isSyncEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">Continuous background sync keeps all study metrics identical.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleManualSync}
                disabled={syncStatus === 'syncing'}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now (Force Update)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSyncModal(true)}
                className="px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-hover text-slate-300 hover:text-white text-sm font-semibold border border-surface-border transition-colors cursor-pointer"
              >
                Open Sync Settings Dialog
              </button>
            </div>
          </div>

          {/* DANGER ZONE - Hard Reset Controls */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 mt-6 relative overflow-hidden bg-rose-500/5">
            <h2 className="text-xl font-bold text-rose-400 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-slate-300 text-sm mb-6">
              Need a fresh start? You can reset your progress here. This will only wipe your learning progress (scores, streaks, review statuses) but will retain the underlying question banks.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-surface border border-rose-500/20">
                <h3 className="text-white font-bold mb-2">Reset Exam Progress</h3>
                <p className="text-xs text-slate-400 mb-4">Wipes all mock exam scores and attempt history.</p>
                <button 
                  onClick={() => handleResetProgress('exams')}
                  className="px-4 py-2 w-full rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-bold border border-rose-500/20 transition-colors"
                >
                  Reset Exam Data
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-rose-500/20">
                <h3 className="text-white font-bold mb-2">Reset Flashcard Progress</h3>
                <p className="text-xs text-slate-400 mb-4">Resets all flashcards back to "Pending" status.</p>
                <button 
                  onClick={() => handleResetProgress('flashcards')}
                  className="px-4 py-2 w-full rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-bold border border-rose-500/20 transition-colors"
                >
                  Reset Flashcards Data
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 sm:col-span-2">
                <h3 className="text-rose-300 font-bold mb-1">Permanent Data & Account Erasure</h3>
                <p className="text-xs text-slate-400 mb-4">Erase your learning streaks, notes, exam history, and account profile permanently per privacy laws.</p>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-600/30 transition-colors"
                >
                  Erase My Data & Delete Account
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
