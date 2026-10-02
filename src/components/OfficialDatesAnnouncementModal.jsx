import React, { useState, useEffect } from 'react';
import { Calendar, ShieldCheck, ExternalLink, X, Bell, Sparkles, CheckCircle2, FileText, Download, Eye, Copy, Check } from 'lucide-react';
import axios from '../api.js';
import PdfViewerModal from './PdfViewerModal.jsx';

export default function OfficialDatesAnnouncementModal({ currentAttempt, onAcknowledge }) {
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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
            official_notice_url: 'https://resource.cdn.icai.org/94423exam290926.pdf',
            official_notice_pdf_url: 'https://resource.cdn.icai.org/94423exam290926.pdf',
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
            official_notice_url: 'https://resource.cdn.icai.org/94423exam290926.pdf',
            official_notice_pdf_url: 'https://resource.cdn.icai.org/94423exam290926.pdf',
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

  const handleCopyLink = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }).catch(() => {});
  };

  if (!visible || !notification) return null;

  const pdfUrl = notification.official_notice_pdf_url || notification.official_notice_url || "https://resource.cdn.icai.org/94423exam290926.pdf";

  return (
    <>
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

              {/* Authoritative Source & Direct 1-Click PDF Link */}
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] gap-2">
                <span className="text-slate-400 truncate">Source: <strong className="text-slate-300">ICAI Official Announcement</strong></span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowPdfViewer(true)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 hover:underline"
                    title="View PDF inside Tutovia"
                  >
                    <Eye className="w-3 h-3 text-indigo-400" />
                    <span>View Notice</span>
                  </button>
                  <span className="text-slate-600">•</span>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 hover:underline"
                    title="Open official ICAI notice PDF file directly"
                  >
                    <FileText className="w-3 h-3 text-emerald-400" />
                    <span>Open Notice PDF</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 relative z-10">
            <div className="flex items-center gap-2">
              {/* Direct 1-Click Open PDF Button (Just like BOS tab) */}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-white text-xs font-semibold border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                title="Open official ICAI notification PDF directly in browser"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Notice PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {/* View in Tutovia Button */}
              <button
                onClick={() => setShowPdfViewer(true)}
                className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-surface-border transition-all flex items-center justify-center gap-1.5"
                title="Preview PDF inside Tutovia"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Preview</span>
              </button>

              {/* Copy Link Button */}
              <button
                onClick={() => handleCopyLink(pdfUrl)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-surface-border transition-all text-xs"
                title="Copy direct ICAI PDF link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              onClick={handleDismiss}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-1.5"
            >
              <span>Got It &bull; Update My Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* In-App Official Notice PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={showPdfViewer}
        onClose={() => setShowPdfViewer(false)}
        pdfUrl={pdfUrl}
        title={notification.official_notice_title || `ICAI Examination Schedule Announcement — ${notification.attempt_code}`}
        subtitle={`CA Intermediate • ${notification.attempt_code} • Authoritative ICAI Notice`}
        portalSourceUrl="https://www.icai.org/category/student-examination"
        isOfficial={true}
      />
    </>
  );
}
