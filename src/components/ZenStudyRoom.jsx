import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize2, Minimize2, Play, Pause, RotateCcw, Volume2, 
  VolumeX, Moon, Sparkles, BookOpen, CheckSquare, Edit3, 
  X, Check, Flame, Clock, Radio, Award
} from 'lucide-react';

const FOCUS_QUOTES = [
  "\"The secret of getting ahead is getting started.\" — Mark Twain",
  "\"It does not matter how slowly you go as long as you do not stop.\" — Confucius",
  "\"Success in CA exams is the sum of small efforts, repeated day in and day out.\"",
  "\"Deep work is the superpower of the knowledge economy.\" — Cal Newport",
  "\"Focus is a muscle. Every uninterrupted minute strengthens it.\"",
  "\"One paper, one standard, one concept at a time. You've got this.\""
];

export default function ZenStudyRoom({ isOpen, onClose, defaultSubject = 'CA Revision' }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [studyTopic, setStudyTopic] = useState(() => localStorage.getItem('tutovia_zen_topic') || defaultSubject);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  
  // Timer state
  const [timerMode, setTimerMode] = useState('pomodoro50'); // 'pomodoro50' | 'pomodoro25' | 'stopwatch'
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(() => parseInt(localStorage.getItem('tutovia_zen_sessions') || '0', 10));

  // Audio state
  const [soundscape, setSoundscape] = useState('none'); // 'none' | 'brown' | 'rain' | 'alpha'
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef(null);
  const audioNodesRef = useRef([]);

  // Scratchpad state
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadText, setScratchpadText] = useState(() => localStorage.getItem('tutovia_zen_scratchpad') || '');
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Live time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Rotate quotes every 90 seconds
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % FOCUS_QUOTES.length);
    }, 90000);
    return () => clearInterval(quoteInterval);
  }, []);

  // Save topic
  useEffect(() => {
    localStorage.setItem('tutovia_zen_topic', studyTopic);
  }, [studyTopic]);

  // Save scratchpad
  useEffect(() => {
    localStorage.setItem('tutovia_zen_scratchpad', scratchpadText);
  }, [scratchpadText]);

  // Save completed sessions
  useEffect(() => {
    localStorage.setItem('tutovia_zen_sessions', sessionsCompleted.toString());
  }, [sessionsCompleted]);

  // Timer tick
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (timerMode === 'stopwatch') {
          setStopwatchSeconds((prev) => prev + 1);
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerMode, isBreak]);

  // Handle timer completion with Web Audio soft chime
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // AudioContext fallback
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    playChime();
    if (!isBreak) {
      setSessionsCompleted((prev) => prev + 1);
      setIsBreak(true);
      setTimeLeft(timerMode === 'pomodoro50' ? 10 * 60 : 5 * 60);
    } else {
      setIsBreak(false);
      setTimeLeft(timerMode === 'pomodoro50' ? 50 * 60 : 25 * 60);
    }
  };

  const handleSwitchMode = (mode) => {
    setTimerMode(mode);
    setIsRunning(false);
    setIsBreak(false);
    if (mode === 'pomodoro50') setTimeLeft(50 * 60);
    else if (mode === 'pomodoro25') setTimeLeft(25 * 60);
    else if (mode === 'stopwatch') setStopwatchSeconds(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === 'pomodoro50') setTimeLeft(50 * 60);
    else if (timerMode === 'pomodoro25') setTimeLeft(25 * 60);
    else if (timerMode === 'stopwatch') setStopwatchSeconds(0);
  };

  // Fullscreen handlers
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Web Audio Synthesizer for Relaxing Background Noise
  const stopAudio = () => {
    audioNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {}
    });
    audioNodesRef.current = [];
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const startSoundscape = (type, vol = volume) => {
    stopAudio();
    if (type === 'none') return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(vol * 0.4, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === 'brown') {
        // Brown noise generator (warm deep focus rumble)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        audioNodesRef.current.push(whiteNoise, filter, masterGain);

      } else if (type === 'rain') {
        // Rain soundscape: filtered pink/white noise with droplet fluctuation
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(800, ctx.currentTime);
        bandpass.Q.setValueAtTime(0.5, ctx.currentTime);

        whiteNoise.connect(bandpass);
        bandpass.connect(masterGain);
        whiteNoise.start();
        audioNodesRef.current.push(whiteNoise, bandpass, masterGain);

      } else if (type === 'alpha') {
        // Alpha wave binaural / harmonic tone (10Hz beat between 216Hz and 226Hz)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(216, ctx.currentTime);
        osc2.frequency.setValueAtTime(226, ctx.currentTime);

        const toneGain = ctx.createGain();
        toneGain.gain.setValueAtTime(0.15, ctx.currentTime);

        osc1.connect(toneGain);
        osc2.connect(toneGain);
        toneGain.connect(masterGain);

        osc1.start();
        osc2.start();
        audioNodesRef.current.push(osc1, osc2, toneGain, masterGain);
      }
    } catch {
      // Audio synth fallback
    }
  };

  const handleSoundscapeChange = (type) => {
    setSoundscape(type);
    startSoundscape(type, volume);
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    if (audioNodesRef.current.length > 0 && audioContextRef.current) {
      const master = audioNodesRef.current[audioNodesRef.current.length - 1];
      if (master && master.gain) {
        master.gain.setValueAtTime(newVol * 0.4, audioContextRef.current.currentTime);
      }
    }
  };

  // Cleanup audio on unmount or close
  useEffect(() => {
    return () => stopAudio();
  }, []);

  if (!isOpen) return null;

  // Format time strings
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatStopwatch = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060911] text-slate-100 flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-300">
      
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* TOP BAR: Clock, Topic, Controls */}
      <header className="relative z-10 flex items-center justify-between border-b border-slate-800/60 pb-5">
        
        {/* Left: Live Time & Date */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
          </div>
          <span className="hidden sm:inline text-xs text-slate-500 font-medium">
            {currentTime.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Center: Current CA Paper Focus */}
        <div className="flex items-center gap-2 max-w-md">
          {isEditingTopic ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={studyTopic}
                onChange={(e) => setStudyTopic(e.target.value)}
                placeholder="e.g. Paper 1: Accounting - AS 28"
                className="bg-slate-900 border border-sky-500/50 rounded-lg px-3 py-1 text-xs text-white focus:outline-none w-64"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTopic(false)}
              />
              <button
                onClick={() => setIsEditingTopic(false)}
                className="p-1 rounded bg-sky-500 text-black hover:bg-sky-400"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTopic(true)}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition-all"
              title="Click to rename your study topic"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="truncate max-w-[220px]">{studyTopic || 'Set Study Topic'}</span>
              <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
            </button>
          )}
        </div>

        {/* Right: Actions (Scratchpad, Fullscreen, Close) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScratchpad(!showScratchpad)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              showScratchpad 
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.15)]' 
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Open quick note / rough calculation scratchpad"
          >
            <Edit3 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Scratchpad</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
            title="Toggle True Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-800 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Exit Zen Room"
          >
            <X className="w-4 h-4" />
            <span>Exit Zen Desk</span>
          </button>
        </div>

      </header>

      {/* CENTER: Main Timer Display & Audio Controller */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto text-center py-6">
        
        {/* Mode Selector Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-900/80 border border-slate-800/80 mb-8 backdrop-blur-md">
          <button
            onClick={() => handleSwitchMode('pomodoro50')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timerMode === 'pomodoro50' 
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎯 50/10 CA Deep Sprint
          </button>
          <button
            onClick={() => handleSwitchMode('pomodoro25')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timerMode === 'pomodoro25' 
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ 25/5 Classic Pomodoro
          </button>
          <button
            onClick={() => handleSwitchMode('stopwatch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timerMode === 'stopwatch' 
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⏱️ Open Stopwatch
          </button>
        </div>

        {/* State Badge */}
        {timerMode !== 'stopwatch' && (
          <div className="mb-4">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
              isBreak 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isBreak ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400 animate-ping'}`} />
              {isBreak ? 'Restorative Break' : 'Deep Study In Progress'}
            </span>
          </div>
        )}

        {/* Giant Monospace Timer */}
        <div className="relative group">
          <div className="text-7xl sm:text-9xl md:text-[11rem] font-black font-mono tracking-tight text-white/95 leading-none transition-all drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
            {timerMode === 'stopwatch' ? formatStopwatch(stopwatchSeconds) : formatTime(timeLeft)}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-500 tracking-widest uppercase mt-4">
            {timerMode === 'stopwatch' ? 'Elapsed Focus Time' : isBreak ? 'Take a breath & stretch' : 'Zero Distractions • Pure Focus'}
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl hover:scale-105 ${
              isRunning 
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700' 
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{timeLeft === 0 ? 'Start Next' : 'Focus Now'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {timerMode !== 'stopwatch' && (
            <button
              onClick={() => setTimeLeft((prev) => prev + 300)}
              className="px-4 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all"
              title="Add 5 minutes to current session"
            >
              +5 Min
            </button>
          )}
        </div>

        {/* Sessions Streak Counter */}
        <div className="flex items-center gap-3 mt-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Flame className="w-4 h-4 fill-amber-400" />
            {sessionsCompleted} Sprints Finished Today
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">Every sprint counts toward your ICAI aggregate</span>
        </div>

      </main>

      {/* BOTTOM BAR: Ambient Audio Synthesizer & Motivational Quote */}
      <footer className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800/60 pt-5">
        
        {/* Ambient Sound Generator Controls */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800/80 px-4 py-2.5 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mr-1">
            <Radio className={`w-4 h-4 ${soundscape !== 'none' ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Soundscape:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'none', label: 'Off' },
              { id: 'brown', label: '🪵 Brown Noise' },
              { id: 'rain', label: '🌧️ Rain Shower' },
              { id: 'alpha', label: '🧠 Alpha Wave' }
            ].map((snd) => (
              <button
                key={snd.id}
                onClick={() => handleSoundscapeChange(snd.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  soundscape === snd.id
                    ? 'bg-sky-500 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                }`}
              >
                {snd.label}
              </button>
            ))}
          </div>

          {soundscape !== 'none' && (
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-800">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                title="Adjust ambient sound volume"
              />
            </div>
          )}
        </div>

        {/* Motivational Stoic Quote */}
        <div className="text-center md:text-right max-w-lg">
          <p className="text-xs text-slate-400 italic">
            {FOCUS_QUOTES[quoteIndex]}
          </p>
        </div>

      </footer>

      {/* COLLAPSIBLE ZEN SCRATCHPAD SLIDE-OVER */}
      {showScratchpad && (
        <div className="fixed top-20 right-6 z-50 w-80 sm:w-96 bg-[#0B101B]/95 border border-sky-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-white text-xs">Rough Calc & Quick Notes</span>
            </div>
            <button
              onClick={() => setShowScratchpad(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Jot down section numbers, doubts, or rough calculations. Auto-saved locally.
          </p>
          <textarea
            value={scratchpadText}
            onChange={(e) => setScratchpadText(e.target.value)}
            placeholder="Type your notes here... (e.g. AS 28: Recoverable amt is higher of Fair Value - Cost to sell & Value in use)"
            rows={10}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono resize-none"
          />
          <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500">
            <span>{scratchpadText.length} characters</span>
            <button
              onClick={() => setScratchpadText('')}
              className="hover:text-rose-400 transition-colors"
            >
              Clear notes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
