import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, Play, Pause, RotateCcw, Sparkles, Volume2, VolumeX, Flame, Smile, Wind, CheckCircle2, Clock, Music, Compass, Settings, Moon, X
} from 'lucide-react';
import axios from '../api.js';
import { aestheticSoundEngine } from '../utils/audioPlayer.js';
import { WellnessCounselor } from '../components/WellnessCounselor.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import YoutubeAudio from '../components/YoutubeAudio.jsx';

export default function Wellness() {
  const { user } = useAuth();

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [timerFormat, setTimerFormat] = useState('full'); // 'full' or 'minutes'

  // Aesthetic Music Synthesizer State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicMode, setMusicMode] = useState('ethereal'); // 'ethereal', 'lofi', 'rain'
  const [volume, setVolume] = useState(0.35);

  // Breathing Exercise State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [breathCount, setBreathCount] = useState(4);

  // Active Tab
  const [activeTab, setActiveTab] = useState('pomodoro');

  // Pomodoro Settings
  const [settings, setSettings] = useState({ workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15 });
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15 });

  // Sleep Tracker State
  const [sleepData, setSleepData] = useState([]);
  const [sleepHours, setSleepHours] = useState(8);
  const [sleepQuality, setSleepQuality] = useState('Good');

  // Fetch Settings & Sleep Data
  useEffect(() => {
    const uid = user?.id || 'u1';
    axios.get(`/api/settings?userId=${uid}`).then(res => {
      if (res?.data) {
        setSettings(res.data);
        setSettingsForm(res.data);
        if (res.data.workDuration) setTimeLeft(res.data.workDuration * 60);
      }
    }).catch(err => console.error(err));

    axios.get(`/api/sleep?userId=${uid}`).then(res => {
      if (res?.data) setSleepData(res.data);
    }).catch(err => console.error(err));
  }, [user?.id]);

  const saveSettings = async () => {
    const uid = user?.id || 'u1';
    try {
      const res = await axios.post('/api/settings', { userId: uid, settings: settingsForm });
      setSettings(res.data);
      setShowSettings(false);
      setTimerMode('work');
      setTimeLeft(res.data.workDuration * 60);
      setIsRunning(false);
    } catch (error) {
      console.error(error);
    }
  };

  const saveSleep = async (e) => {
    e.preventDefault();
    const uid = user?.id || 'u1';
    try {
      const res = await axios.post('/api/sleep', {
        userId: uid,
        hours: sleepHours,
        quality: sleepQuality,
        date: new Date().toLocaleDateString()
      });
      setSleepData(res.data);
      alert('Sleep logged successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerMode === 'work') {
        setCompletedSessions(prev => prev + 1);
        // Accumulate +25 mins to daily study hours and strike off matching schedule item in real time!
        axios.post('/api/progress/study-hours', { minutesAdded: 25, isPomodoro: true, activityType: 'wellness' })
          .then(() => {})
          .catch(() => {});
        alert('🎉 25-Minute Focus Session Completed! +25 mins added to Daily Study Hours & schedule updated.');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerMode]);

  // YouTube Video IDs for real music tracks
  // YouTube Video IDs for real music tracks
  const youtubeTracks = {
    ethereal: '7NOSDKb0HlU', // Deep Soothing Ambient
    lofi: 'n61ULEU7CO0', // Lofi Hip Hop Mix (non-live)
    rain: 'mPZkdNFkNps', // Heavy Rain
    flute: 'yRrU0zCUVJg', // Bansuri / Little Krishna Flute
    cortisol: 'lFcSrYw-ARY' // Cortisol Reset / Binaural
  };

  // Audio Player Toggle
  const toggleMusic = (modeToPlay = musicMode) => {
    if (isPlayingMusic && modeToPlay === musicMode) {
      setIsPlayingMusic(false);
    } else {
      setMusicMode(modeToPlay);
      setIsPlayingMusic(true);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  // Breathing Cycle
  useEffect(() => {
    let breathInterval = null;
    if (isBreathingActive) {
      breathInterval = setInterval(() => {
        setBreathCount(prev => {
          if (prev > 1) return prev - 1;
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 7;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return 8;
          } else {
            setBreathPhase('Inhale');
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(breathInterval);
  }, [isBreathingActive, breathPhase]);

  const setPresetMode = (mode) => {
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === 'work') setTimeLeft(settings.workDuration * 60);
    else if (mode === 'shortBreak') setTimeLeft(settings.shortBreakDuration * 60);
    else if (mode === 'longBreak') setTimeLeft(settings.longBreakDuration * 60);
  };

  const formatTime = (secs) => {
    if (timerFormat === 'minutes') {
      const totalM = Math.floor(secs / 60);
      return `${totalM}m`;
    }
    
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aesthetic Wellness & Counselor Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Soothing Pomodoro & Counselor</h1>
            <p className="text-slate-400 text-sm mt-1">
              Relax with aesthetic ambient music, auto-track focus sessions on your timetable, and consult Dr. Maya for life & career mentorship.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1.5 rounded-2xl bg-surface-card border border-surface-border">
            <button
              onClick={() => setActiveTab('pomodoro')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'pomodoro' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Timer & Aesthetic Music</span>
            </button>

            <button
              onClick={() => setActiveTab('counselor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'counselor' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>AI Life Counselor</span>
            </button>
            <button
              onClick={() => setActiveTab('sleep')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'sleep' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Sleep & Recovery</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'counselor' ? (
        <WellnessCounselor />
      ) : activeTab === 'sleep' ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Moon className="w-6 h-6 text-purple-400" /> Sleep Tracker</h2>
          <form onSubmit={saveSleep} className="w-full max-w-md space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Hours Slept Last Night</label>
              <input type="number" min="0" max="24" step="0.5" value={sleepHours} onChange={e => setSleepHours(parseFloat(e.target.value))} className="w-full bg-surface-card border border-surface-border p-3 rounded-xl text-white outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Sleep Quality</label>
              <select value={sleepQuality} onChange={e => setSleepQuality(e.target.value)} className="w-full bg-surface-card border border-surface-border p-3 rounded-xl text-white outline-none focus:border-purple-500">
                <option>Poor</option>
                <option>Fair</option>
                <option>Good</option>
                <option>Excellent</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-static-white rounded-xl font-bold shadow-xl transition-all">Log Sleep</button>
          </form>
          <div className="w-full max-w-md mt-8">
            <h3 className="text-white font-bold mb-4 text-center">Recent Sleep Logs</h3>
            <div className="space-y-3">
              {sleepData.length === 0 && <p className="text-center text-slate-500 text-sm">No sleep logs yet.</p>}
              {sleepData.map(log => (
                <div key={log.id} className="flex justify-between p-3 rounded-xl bg-surface-card border border-surface-border">
                  <span className="text-slate-300 text-sm">{log.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">{log.hours}h</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${log.quality === 'Poor' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{log.quality}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <YoutubeAudio videoId={youtubeTracks[musicMode]} playing={isPlayingMusic} volume={volume} />
          {/* Aesthetic Soothing Music Player Bar */}
          <div className="glass-panel p-5 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/40 via-surface-card to-purple-950/40 shadow-xl">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isPlayingMusic ? 'bg-indigo-600 text-white animate-pulse shadow-lg shadow-indigo-600/30' : 'bg-surface-card border border-surface-border text-slate-400'
              }`}>
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Aesthetic Soothing Music Synthesizer
                  {isPlayingMusic && <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Playing Soothing Waves</span>}
                </h4>
                <p className="text-xs text-slate-400">Synthesized 432Hz Ethereal Waves, Warm Lo-Fi Chords & Soft Rain</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              
              {/* Soothing Soundscape Selectors */}
              <div className="flex p-1 rounded-xl bg-surface-card border border-surface-border">
                {[
                  { id: 'ethereal', label: '🌸 Ethereal 432Hz' },
                  { id: 'lofi', label: '☕ Warm Lo-Fi' },
                  { id: 'rain', label: '🌧️ Soft Rain' },
                  { id: 'flute', label: '🪈 Krishna Flute' },
                  { id: 'cortisol', label: '🧠 Cortisol Reset' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleMusic(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isPlayingMusic && musicMode === s.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 bg-surface-card border border-surface-border px-3 py-1.5 rounded-xl">
                {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Master Play / Stop */}
              <button
                onClick={() => toggleMusic(musicMode)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  isPlayingMusic
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isPlayingMusic ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingMusic ? 'Stop Music' : 'Play Soothing Sound'}</span>
              </button>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pomodoro Timer Main Card */}
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border flex flex-col justify-between items-center text-center relative overflow-hidden">
              <button onClick={() => setShowSettings(true)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-surface-card hover:bg-slate-800 rounded-xl transition-colors border border-surface-border">
                <Settings className="w-5 h-5" />
              </button>
              
              {showSettings && (
                <div className="absolute inset-0 z-20 bg-surface/95 backdrop-blur-md p-6 flex items-center justify-center">
                  <div className="w-full max-w-sm bg-surface-card p-6 rounded-2xl border border-surface-border shadow-2xl relative text-left">
                    <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                    <h3 className="text-lg font-bold text-white mb-4">Timer Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Focus Work</label>
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <input type="number" min="0" max="12" value={Math.floor((settingsForm.workDuration || 0) / 60)} onChange={e => setSettingsForm({...settingsForm, workDuration: (parseInt(e.target.value) || 0) * 60 + (settingsForm.workDuration % 60)})} className="w-full bg-surface border border-surface-border p-2 pr-8 rounded-lg text-white outline-none focus:border-indigo-500" />
                            <span className="absolute right-3 top-2.5 text-xs text-slate-500">h</span>
                          </div>
                          <div className="flex-1 relative">
                            <input type="number" min="0" max="59" value={(settingsForm.workDuration || 0) % 60} onChange={e => setSettingsForm({...settingsForm, workDuration: Math.floor((settingsForm.workDuration || 0) / 60) * 60 + (parseInt(e.target.value) || 0)})} className="w-full bg-surface border border-surface-border p-2 pr-8 rounded-lg text-white outline-none focus:border-indigo-500" />
                            <span className="absolute right-3 top-2.5 text-xs text-slate-500">m</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Short Break (minutes)</label>
                        <input type="number" min="1" max="30" value={settingsForm.shortBreakDuration} onChange={e => setSettingsForm({...settingsForm, shortBreakDuration: parseInt(e.target.value)})} className="w-full bg-surface border border-surface-border p-2 rounded-lg text-white outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Long Break (minutes)</label>
                        <input type="number" min="1" max="60" value={settingsForm.longBreakDuration} onChange={e => setSettingsForm({...settingsForm, longBreakDuration: parseInt(e.target.value)})} className="w-full bg-surface border border-surface-border p-2 rounded-lg text-white outline-none focus:border-indigo-500" />
                      </div>
                      <button onClick={saveSettings} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-static-white rounded-xl font-bold mt-2 transition-all">Save Changes</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full max-w-md space-y-6">
                
                {/* Mode Tabs */}
                <div className="flex p-1.5 rounded-2xl bg-surface-card border border-surface-border">
                  <button
                    onClick={() => setPresetMode('work')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      timerMode === 'work' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Focus ({Math.floor(settings.workDuration/60) > 0 ? `${Math.floor(settings.workDuration/60)}h ` : ''}{settings.workDuration%60}m)
                  </button>
                  <button
                    onClick={() => setPresetMode('shortBreak')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      timerMode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Short Break ({settings.shortBreakDuration}m)
                  </button>
                  <button
                    onClick={() => setPresetMode('longBreak')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      timerMode === 'longBreak' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Long Break ({settings.longBreakDuration}m)
                  </button>
                </div>

                {/* Clock */}
                <div 
                  className="py-8 cursor-pointer group" 
                  title="Click to toggle between HH:MM:SS and Minutes"
                  onClick={() => setTimerFormat(prev => prev === 'full' ? 'minutes' : 'full')}
                >
                  <span className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-white drop-shadow-lg group-hover:text-indigo-200 transition-colors">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="block text-xs uppercase tracking-widest text-indigo-400 font-semibold mt-2">
                    {timerMode === 'work' ? '🎯 Deep Work Session' : '🧘 Mindful Break'} (Click to toggle format)
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-8 py-3.5 rounded-2xl text-white font-bold text-base shadow-xl transition-all flex items-center gap-3 hover:scale-105 active:scale-95 ${
                      isRunning 
                        ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' 
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5 fill-white" />
                        <span>Pause Session</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-white" />
                        <span>Start Session</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setPresetMode(timerMode)}
                    className="p-3.5 rounded-2xl bg-surface-card hover:bg-slate-800 text-slate-300 border border-surface-border transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                {/* Session Counter */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Completed Today: <strong className="text-amber-400">{completedSessions} Sessions</strong> (+25m added & schedule auto-struck)</span>
                </div>

              </div>
            </div>

            {/* Guided 4-7-8 Breathing Bubble */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surface-border flex flex-col justify-between items-center text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Wind className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">4-7-8 Breathing Reset</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Calm your central nervous system before starting practice quizzes.
                </p>
              </div>

              <div className="my-4 relative flex items-center justify-center">
                <div className={`w-36 h-36 rounded-full border-4 border-emerald-500/40 flex items-center justify-center transition-all duration-1000 ${
                  isBreathingActive && breathPhase === 'Inhale' ? 'scale-125 bg-emerald-500/20' :
                  isBreathingActive && breathPhase === 'Hold' ? 'scale-125 bg-emerald-500/30 border-emerald-400' :
                  'scale-100 bg-surface-card/60'
                }`}>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-white block">{isBreathingActive ? breathPhase : 'Ready'}</span>
                    <span className="text-3xl font-mono font-black text-emerald-400">{isBreathingActive ? breathCount : '🧘'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsBreathingActive(!isBreathingActive);
                  setBreathPhase('Inhale');
                  setBreathCount(4);
                }}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  isBreathingActive 
                    ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                }`}
              >
                {isBreathingActive ? 'Stop Breathing' : 'Start 4-7-8 Reset'}
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
