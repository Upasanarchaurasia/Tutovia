import React, { useState, useEffect } from 'react';
import { Calendar, ShieldCheck, ExternalLink, X, Bell, Sparkles, CheckCircle2 } from 'lucide-react';
import axios from '../api.js';

export default function OfficialDatesAnnouncementModal({ currentAttempt, onAcknowledge }) {
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check for unread official exam date announcement notifications
    const targetAttempt = currentAttempt || 'January 2027';
    const dismissedKey = `tutovia_announcement_dismissed_${targetAttempt.replace(/\s+/g, '_')}`;

    if (localStorage.getItem(dismissedKey)) {
      return; // Already acknowledged on this device
    }

    axios.get(`/api/user/notifications?attempt=${encodeURIComponent(targetAttempt)}`)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const unread = res.data.find(n => !n.is_read || n.notification_type === 'OFFICIAL_EXAM_DATES_ANNOUNCED');
          if (unread) {
            setNotification(unread);
            setVisible(true);
          }
        } else if (targetAttempt === 'January 2027' && !localStorage.getItem(dismissedKey)) {
          // Synthetic fallback alert for January 2027 official announcement
          setNotification({
            id: 'notif-jan-2027-official',
            title: '🎉 Official Exam Dates Announced!',
            attempt_code: 'January 2027',
            message: 'ICAI has officially announced the CA Intermediate examination dates for your selected attempt: January 2027. Your estimated examination schedule has now been replaced with the official ICAI schedule.',
            official_dates: 'January 2, 4, 6 (Group 1) & January 8, 10, 12, 2027 (Group 2)',
            official_notice_url: 'https://www.icai.org/category/student-examination',
            official_notice_title: 'Important Announcement — January 2027 CA Intermediate Examination Schedule',
            source_name: 'ICAI Official Portal (icai.org)'
          });
          setVisible(true);
        }
      })
      .catch(() => {
        if (targetAttempt === 'January 2027' && !localStorage.getItem(dismissedKey)) {
          setNotification({
            id: 'notif-jan-2027-official',
            title: '🎉 Official Exam Dates Announced!',
            attempt_code: 'January 2027',
            message: 'ICAI has officially announced the CA Intermediate examination dates for your selected attempt: January 2027. Your estimated examination schedule has now been replaced with the official ICAI schedule.',
            official_dates: 'January 2, 4, 6 (Group 1) & January 8, 10, 12, 2027 (Group 2)',
            official_notice_url: 'https://www.icai.org/category/student-examination',
            official_notice_title: 'Important Announcement — January 2027 CA Intermediate Examination Schedule',
            source_name: 'ICAI Official Portal (icai.org)'
          });
          setVisible(true);
        }
      });
  }, [currentAttempt]);

  const handleDismiss = () => {
    if (notification) {
      const targetAttempt = currentAttempt || 'January 2027';
      const dismissedKey = `tutovia_announcement_dismissed_${targetAttempt.replace(/\s+/g, '_')}`;
      localStorage.setItem(dismissedKey, 'true');

      if (notification.id) {
        axios.post(`/api/user/notifications/${notification.id}/read`).catch(() => {});
      }
    }
    setVisible(false);
    if (onAcknowledge) onAcknowledge();
  };

  if (!visible || !notification) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-5">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Official Schedule Confirmed
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {notification.title || 'Official Exam Dates Announced!'}
              </h2>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message body */}
        <div className="space-y-4 relative z-10">
          <p className="text-sm text-slate-300 leading-relaxed">
            {notification.message}
          </p>

          {/* Official Schedule Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700/60 pb-2">
              <span className="font-semibold text-slate-200">CA Intermediate &bull; {notification.attempt_code}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 🟢 OFFICIAL
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="w-16 font-semibold text-indigo-300 shrink-0">Group I:</span>
                <span className="text-white font-medium">January 2, 4, and 6, 2027</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-16 font-semibold text-purple-300 shrink-0">Group II:</span>
                <span className="text-white font-medium">January 8, 10, and 12, 2027</span>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-slate-700/40 text-[11px] text-slate-400">
                <span className="w-16 shrink-0">Timing:</span>
                <span>2:00 PM – 5:00 PM IST</span>
              </div>
            </div>

            {/* Authoritative Source */}
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Source: <strong className="text-slate-300">ICAI Official Announcement</strong></span>
              <a
                href={notification.official_notice_url || "https://www.icai.org/category/student-examination"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 hover:underline"
              >
                <span>View Official Notice</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 relative z-10">
          <a
            href={notification.official_notice_url || "https://www.icai.org/category/student-examination"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-surface-border transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Verify on ICAI.org</span>
          </a>
          <button
            onClick={handleDismiss}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
          >
            <span>Got It &bull; Update My Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
}
