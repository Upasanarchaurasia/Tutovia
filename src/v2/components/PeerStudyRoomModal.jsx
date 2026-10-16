import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, RotateCcw, Volume2, VolumeX, 
  Users, Sparkles, Moon, Sun, Flame, Clock, 
  CheckCircle2, Radio, Edit3, Check, Maximize2, Minimize2,
  BookOpen
} from 'lucide-react';

const PEER_ACTIVITIES = [
  { name: 'Ananya S. (Bengaluru)', track: 'CA Foundation', action: 'Finished 50m on Business Laws (Contract Act)', time: 'Just now' },
  { name: 'Rohan M. (Mumbai)', track: 'CA Intermediate', action: 'Mastered AS 10 Component Accounting', time: '1m ago' },
  { name: 'Kavita D. (Delhi)', track: 'Class 12 Boards', action: 'Completed 6 Partnership Revaluation problems', time: '3m ago' },
  { name: 'Tanmay K. (Pune)', track: 'CA Intermediate', action: 'Articleship adjusted: logged 45m Direct Tax Sec 54', time: '5m ago' },
  { name: 'Shreya P. (Kolkata)', track: 'Class 11 Commerce', action: 'Mastered 3 Golden Rules & BRS adjustments', time: '7m ago' },
  { name: 'Arjun N. (Hyderabad)', track: 'CA Foundation', action: 'Solved 25 Time Value of Money annuity questions', time: '9m ago' }
];

export default function PeerStudyRoomModal({ 
  isOpen, 
  onClose, 
  isDarkTheme = true, 
  activeSubject = 'Commerce & CA Revision' 
}) {
  // Timer state
  const [timerMode, setTimerMode] = useState('pomodoro50'); // 'pomodoro50' | 'pomodoro25' | 'stopwatch'
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    try {
      return parseInt(localStorage.getItem('tutovia_zen_sessions') || '0', 10);
    } catch {
      return 0;
    }
  });

  // Peer & Room state
  const [activeStudentsCount, setActiveStudentsCount] = useState(1482);
  const [currentPeerIndex, setCurrentPeerIndex] = useState(0);
  const [topic, setTopic] = useState(() => {
    try {
      return localStorage.getItem('tutovia_zen_topic') || activeSubject;
    } catch {
      return activeSubject;
    }
  });
  const [isEditingTopic, setIsEditingTopic] = useState(false);

  // Scratchpad state
  const [scratchpadText, setScratchpadText] = useState(() => {
    try {
      return localStorage.getItem('tutovia_zen_scratchpad') || '';
    } catch {
      return '';
    }
  });

  // Soundscape (Procedural Web Audio)
  const [soundscape, setSoundscape] = useState('none'); // 'none' | 'brown' | 'rain' | 'alpha'
  const [volume, setVolume] = useState(0.4);
  const audioContextRef = useRef(null);
  const audioNodesRef = useRef([]);

  // Live active count fluctuation (creates authentic communal feeling)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStudentsCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Peer ticker rotation
  useEffect(() => {
    const peerInterval = setInterval(() => {
      setCurrentPeerIndex(prev => (prev + 1) % PEER_ACTIVITIES.length);
    }, 7000);
    return () => clearInterval(peerInterval);
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (timerMode === 'stopwatch') {
          setStopwatchSeconds(prev => prev + 1);
        } else {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setIsRunning(false);
              setSessionsCompleted(c => {
                const updated = c + 1;
                try {
                  localStorage.setItem('tutovia_zen_sessions', updated.toString());
                } catch {}
                return updated;
              });
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerMode]);

  // Save scratchpad and topic
  useEffect(() => {
    try {
      localStorage.setItem('tutovia_zen_scratchpad', scratchpadText);
    } catch {}
  }, [scratchpadText]);

  useEffect(() => {
    try {
      localStorage.setItem('tutovia_zen_topic', topic);
    } catch {}
  }, [topic]);

  // Audio synthesis
  const stopAudio = () => {
    audioNodesRef.current.forEach(node => {
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
    if (type === 'none') {
      setSoundscape('none');
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(vol * 0.4, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === 'alpha') {
        // Binaural beats: 216 Hz & 226 Hz (10 Hz Alpha wave for focused deep study)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        oscL.frequency.setValueAtTime(216, ctx.currentTime);
        oscR.frequency.setValueAtTime(226, ctx.currentTime);

        if (pannerL && pannerR) {
          pannerL.pan.setValueAtTime(-1, ctx.currentTime);
          pannerR.pan.setValueAtTime(1, ctx.currentTime);
          oscL.connect(pannerL);
          pannerL.connect(masterGain);
          oscR.connect(pannerR);
          pannerR.connect(masterGain);
        } else {
          oscL.connect(masterGain);
          oscR.connect(masterGain);
        }

        oscL.start();
        oscR.start();
        audioNodesRef.current = [oscL, oscR, masterGain];
      } else if (type === 'brown') {
        // Brown noise: warm, deep, peaceful background
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
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        audioNodesRef.current = [whiteNoise, filter, masterGain];
      } else if (type === 'rain') {
        // Gentle Rain filter
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(0.7, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        audioNodesRef.current = [whiteNoise, filter, masterGain];
      }

      setSoundscape(type);
    } catch (e) {
      console.error('Audio synthesis failed', e);
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === 'pomodoro50') setTimeLeft(50 * 60);
    else if (timerMode === 'pomodoro25') setTimeLeft(25 * 60);
    else if (timerMode === 'stopwatch') setStopwatchSeconds(0);
  };

  const handleSwitchMode = (mode) => {
    setTimerMode(mode);
    setIsRunning(false);
    if (mode === 'pomodoro50') setTimeLeft(50 * 60);
    else if (mode === 'pomodoro25') setTimeLeft(25 * 60);
    else if (mode === 'stopwatch') setStopwatchSeconds(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentPeer = PEER_ACTIVITIES[currentPeerIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl rounded-3xl bg-[#0B1120] border-2 border-indigo-900/50 text-slate-100 shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Bar: Live Counter & Quit */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0F172A]/90 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{activeStudentsCount.toLocaleString()} Students Live</span>
              </div>
              <span className="hidden sm:inline text-xs text-slate-400 font-medium">
                Virtual Library • "For Students, By Students"
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  stopAudio();
                  onClose();
                }}
                className="p-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
                title="Exit Library"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Area */}
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Center Focus Timer Column */}
            <div className="md:col-span-7 flex flex-col items-center text-center">
              {/* Active Subject / Topic pill */}
              <div className="mb-4 flex items-center gap-2">
                {isEditingTopic ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="px-3 py-1 text-xs rounded-xl bg-slate-900 border border-indigo-500 text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => setIsEditingTopic(false)}
                      className="p-1 rounded-lg bg-indigo-600 text-white"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingTopic(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-700/60 text-xs font-bold text-indigo-300 hover:border-indigo-500 transition-colors"
                  >
                    <BookOpen size={13} />
                    <span>Focusing on: {topic}</span>
                    <Edit3 size={11} className="opacity-60" />
                  </button>
                )}
              </div>

              {/* Mode Selectors */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 mb-6">
                <button
                  onClick={() => handleSwitchMode('pomodoro50')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timerMode === 'pomodoro50' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  50m Deep Work
                </button>
                <button
                  onClick={() => handleSwitchMode('pomodoro25')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timerMode === 'pomodoro25' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  25m Sprint
                </button>
                <button
                  onClick={() => handleSwitchMode('stopwatch')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timerMode === 'stopwatch' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Stopwatch
                </button>
              </div>

              {/* Giant Digital Clock */}
              <div className="font-heading font-black text-6xl sm:text-7xl tracking-tight text-white mb-6 tabular-nums">
                {timerMode === 'stopwatch' ? formatTime(stopwatchSeconds) : formatTime(timeLeft)}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
                    isRunning 
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  }`}
                >
                  {isRunning ? <Pause size={18} /> : <Play size={18} />}
                  <span>{isRunning ? 'Pause Session' : 'Start Focus Block'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-3.5 rounded-2xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              {/* Stats & Session completed */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Flame size={14} className="text-amber-500" />
                  <span>{sessionsCompleted} Sessions Completed</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-indigo-400" />
                  <span>Streak Active</span>
                </span>
              </div>
            </div>

            {/* Right Column: Procedural Audio & Peer Feed */}
            <div className="md:col-span-5 flex flex-col gap-4">
              {/* Procedural Soundscape Generator (Zero Download Size) */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Radio size={13} className="text-indigo-400" />
                    <span>Focus Soundscape</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Procedural Web Audio</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { id: 'alpha', label: 'Alpha Wave (10Hz)', desc: 'Binaural focus' },
                    { id: 'brown', label: 'Brown Noise', desc: 'Deep warm drone' },
                    { id: 'rain', label: 'Gentle Rain', desc: 'Soft rain ambience' },
                    { id: 'none', label: 'Silent Mode', desc: 'No background audio' }
                  ].map((snd) => (
                    <button
                      key={snd.id}
                      onClick={() => startSoundscape(snd.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        soundscape === snd.id
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{snd.label}</div>
                      <div className="text-[10px] opacity-70">{snd.desc}</div>
                    </button>
                  ))}
                </div>

                {soundscape !== 'none' && (
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                    <Volume2 size={14} className="text-indigo-400" />
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setVolume(v);
                        startSoundscape(soundscape, v);
                      }}
                      className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Live Peer Encouragement Card */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/60">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                  <Users size={13} />
                  <span>Real-Time Student Activity</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{currentPeer.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{currentPeer.time}</span>
                  </div>
                  <div className="text-slate-300 text-xs leading-relaxed">
                    {currentPeer.action}
                  </div>
                  <div className="text-[10px] font-semibold text-indigo-400 mt-1">
                    Track: {currentPeer.track}
                  </div>
                </div>
              </div>

              {/* Study Scratchpad */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Edit3 size={13} />
                    <span>Quick Scratchpad</span>
                  </span>
                  <span className="text-[10px] text-emerald-400">Auto-saved</span>
                </div>
                <textarea
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  placeholder="Jot down quick formulas, sections, or balance sheet adjustments..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-mono"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
