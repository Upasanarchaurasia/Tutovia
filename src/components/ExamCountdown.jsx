import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react';
import axios from '../api.js';

export default function ExamCountdown({ profile }) {
  const [examInfo, setExamInfo] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  const attempt = profile?.attempt || "September 2026";
  const group = profile?.ca_group || "Both Groups";
  const stage = profile?.ca_stage || "intermediate";

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    axios.get(`/api/icai-exam-dates?attempt=${encodeURIComponent(attempt)}&group=${encodeURIComponent(group)}&stage=${encodeURIComponent(stage)}`)
      .then(res => {
        if (!isMounted) return;
        if (res?.data) {
          setExamInfo(res.data);
          setDaysLeft(res.data.daysLeft !== undefined ? res.data.daysLeft : 0);
        }
      })
      .catch(err => {
        console.error("Failed to fetch official ICAI exam dates:", err);
        // Fallback calculation
        const [mStr, yStr] = attempt.split(' ');
        const year = parseInt(yStr, 10) || 2026;
        const monthMap = { 'January': 0, 'Jan': 0, 'May': 4, 'September': 8, 'Sep': 8, 'November': 10 };
        const mIdx = monthMap[mStr] !== undefined ? monthMap[mStr] : 8;
        const day = group === 'Group 2' ? 19 : 12;
        const target = new Date(year, mIdx, day);
        const diff = Math.max(0, Math.ceil((target - new Date()) / (1000 * 60 * 60 * 24)));
        setDaysLeft(diff);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [attempt, group, stage]);

  const targetDateFormatted = examInfo?.targetDate 
    ? new Date(examInfo.targetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : `${attempt}`;

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-indigo-500/10 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-indigo-500/10 hover:border-indigo-500/50 transition-all">
      
      {/* Glow highlight */}
      <div className="absolute -right-10 -top-10 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-start sm:items-center gap-3.5 z-10">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              CA Intermediate {group} Exam
            </h3>
            <a
              href={examInfo?.officialNotificationUrl || "https://www.icai.org/category/examination"}
              target="_blank"
              rel="noopener noreferrer"
              title="View official notification on icai.org"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 transition-all"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Official ICAI Date</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </div>

          <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-1">
            <span>Target: <strong className="text-indigo-300">{targetDateFormatted}</strong></span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400">
              {group === 'Group 2' ? 'Group 2 Papers Commencing' : group === 'Group 1' ? 'Group 1 Papers Commencing' : 'Group 1 & 2 Commencing'}
            </span>
          </p>

          {examInfo?.datesText && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              📅 {examInfo.datesText}
            </p>
          )}
        </div>
      </div>
      
      <div className="z-10 flex items-center justify-between sm:justify-end gap-3 bg-surface/80 p-2.5 px-4 rounded-xl border border-surface-border self-stretch sm:self-auto">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tight">
              {daysLeft !== null ? daysLeft : '...'}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">
              Days Left
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
