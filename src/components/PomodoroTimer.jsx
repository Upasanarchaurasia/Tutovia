import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, CheckCircle } from 'lucide-react';
import axios from '../api.js';

export default function PomodoroTimer({ userId }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, break

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleComplete = async () => {
    if (mode === 'focus') {
      try {
        await axios.post('/api/progress/pomodoro', { userId });
      } catch (err) {
        console.error(err);
      }
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-950/20 to-background shadow-xl text-center">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Timer className="w-5 h-5 text-rose-400" /> Pomodoro Timer
        </h3>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${mode === 'focus' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
          {mode === 'focus' ? 'Focus Session' : 'Short Break'}
        </span>
      </div>
      
      <div className="text-5xl font-black text-white tracking-widest my-6 font-mono drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">
        {formatTime(timeLeft)}
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={toggleTimer}
          className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-lg shadow-rose-600/30"
        >
          {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-10 h-10 rounded-full bg-surface border border-surface-border hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
