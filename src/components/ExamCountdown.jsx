import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

export default function ExamCountdown() {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    // Assuming next CA Exams are in May 2027 (typical cycle)
    const targetDate = new Date('2027-05-01T00:00:00');
    const now = new Date();
    const diffTime = Math.abs(targetDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    setDaysLeft(diffDays);
  }, []);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex items-center justify-between shadow-lg shadow-indigo-500/10 hover:border-indigo-500/40 transition-colors">
      
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
      
      <div className="flex items-center gap-4 z-10">
        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
          <Calendar className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-indigo-200">Next CA Exams (May 2027)</h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Stay on track!
          </p>
        </div>
      </div>
      
      <div className="text-right z-10 flex items-center gap-3 bg-surface p-2 px-4 rounded-xl border border-surface-border">
        <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
        <div>
          <div className="text-2xl font-bold text-white leading-none">{daysLeft}</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Days Left</div>
        </div>
      </div>
      
    </div>
  );
}
