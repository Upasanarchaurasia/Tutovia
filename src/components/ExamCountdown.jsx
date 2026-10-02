import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, ExternalLink, CheckCircle2, ShieldCheck, ChevronDown, Sparkles, RefreshCw, X, Info, FileText, Download, Eye, Copy, Check } from 'lucide-react';
import axios from '../api.js';
import PdfViewerModal from './PdfViewerModal.jsx';

export default function ExamCountdown({ profile, onAttemptChange }) {
  const [examInfo, setExamInfo] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [hoursLeft, setHoursLeft] = useState(null);
  const [minutesLeft, setMinutesLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAttemptModal, setShowAttemptModal] = useState(false);
  const [upcomingAttempts, setUpcomingAttempts] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);
  const [switchingAttempt, setSwitchingAttempt] = useState(false);
  const [showPapers, setShowPapers] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Active attempt defaults to student profile or January 2027
  const currentAttempt = profile?.attempt && profile.attempt !== 'Not set' && !profile.attempt.includes('2024') && !profile.attempt.includes('2025') && !profile.attempt.includes('September 2026')
    ? profile.attempt 
    : 'January 2027';

  const group = profile?.ca_group || "Both Groups";
  const stage = profile?.ca_stage || "intermediate";

  // Fetch exam details for current attempt
  const fetchExamDetails = (att) => {
    setLoading(true);
    axios.get(`/api/icai-exam-dates?attempt=${encodeURIComponent(att)}&group=${encodeURIComponent(group)}&stage=${encodeURIComponent(stage)}`)
      .then(res => {
        if (res?.data) {
          setExamInfo(res.data);
          setDaysLeft(res.data.daysLeft !== undefined ? res.data.daysLeft : null);
          setHoursLeft(res.data.hoursLeft !== undefined ? res.data.hoursLeft : null);
          setMinutesLeft(res.data.minutesLeft !== undefined ? res.data.minutesLeft : null);
        }
      })
      .catch(err => {
        console.error("Failed to fetch official ICAI exam dates:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchExamDetails(currentAttempt);
  }, [currentAttempt, group, stage]);

  // Load upcoming attempts when switcher modal opens
  const openAttemptSwitcher = () => {
    setShowAttemptModal(true);
    setLoadingUpcoming(true);
    axios.get('/api/exam-attempts/upcoming')
      .then(res => {
        if (Array.isArray(res.data)) {
          setUpcomingAttempts(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingUpcoming(false));
  };

  // Select a new attempt
  const handleSelectAttempt = async (newAttemptCode) => {
    if (newAttemptCode === currentAttempt) {
      setShowAttemptModal(false);
      return;
    }
    setSwitchingAttempt(true);
    try {
      await axios.post('/api/user/attempt-preference', {
        attempt: newAttemptCode,
        userId: profile?.id
      });
      fetchExamDetails(newAttemptCode);
      if (onAttemptChange) {
        onAttemptChange(newAttemptCode);
      }
    } catch (err) {
      console.error('Failed to update attempt preference:', err);
    } finally {
      setSwitchingAttempt(false);
      setShowAttemptModal(false);
    }
  };

  const isOfficial = examInfo?.isOfficial;
  const isTentative = examInfo?.isTentative || !isOfficial;
  const noticePdfUrl = examInfo?.officialNoticePdfUrl || examInfo?.officialNotificationUrl;

  const targetDateFormatted = examInfo?.targetDate 
    ? new Date(examInfo.targetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : `${currentAttempt}`;

  return (
    <div className={`glass-panel p-4 sm:p-5 rounded-3xl border ${
      isOfficial 
        ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-slate-900/40 to-indigo-500/10' 
        : 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900/40 to-slate-900/60'
    } relative overflow-hidden shadow-xl transition-all duration-300 space-y-3`}>
      
      {/* Glow highlight */}
      <div className={`absolute -right-10 -top-10 w-44 h-44 ${
        isOfficial ? 'bg-emerald-500/15' : 'bg-amber-500/15'
      } rounded-full blur-3xl pointer-events-none`} />

      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            isOfficial 
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
              : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
          }`}>
            <Calendar className="w-6 h-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                CA Intermediate &bull; {currentAttempt}
              </h3>

              {/* Status Pill Badge */}
              {isOfficial ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Official &bull; Announced by ICAI
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Tentative &bull; Official dates not yet announced by ICAI
                </span>
              )}

              {/* Switch Attempt Button */}
              <button
                onClick={openAttemptSwitcher}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-surface-border transition-all"
                title="Change or select upcoming CA Intermediate attempt"
              >
                <span>Switch Attempt</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Target description & disclaimer */}
            <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-1.5">
              {isOfficial ? (
                <>
                  <span>Examination Commencing: <strong className="text-emerald-300">{targetDateFormatted}</strong></span>
                  <span className="text-slate-500 hidden sm:inline">•</span>
                  <span className="text-slate-300">{group}</span>
                  {noticePdfUrl && (
                    <div className="inline-flex items-center gap-1.5 flex-wrap ml-1">
                      {/* 1-Click In-App Viewer Modal */}
                      <button
                        onClick={() => setShowPdfViewer(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/40 text-indigo-300 text-[11px] font-semibold transition-all shadow-sm"
                        title="Read Official Notice in Tutovia"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>View Notice</span>
                      </button>

                      {/* Direct 1-Click Open PDF in New Tab */}
                      <a
                        href={noticePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold transition-all shadow-sm"
                        title="Open official ICAI notification PDF directly in new tab"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Open Notice PDF</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>

                      {/* Copy Link Button */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(noticePdfUrl);
                          setCopiedNotice(true);
                          setTimeout(() => setCopiedNotice(false), 2000);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-surface-border transition-all text-[11px]"
                        title="Copy direct ICAI PDF link"
                      >
                        {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-0.5">
                  <p className="text-amber-200/90 font-medium">
                    Estimated Examination Period: <strong>{examInfo?.datesText || currentAttempt}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {examInfo?.disclaimer || "ICAI has not yet officially announced the examination schedule. The dates shown are estimated and will automatically update when ICAI publishes the official notification."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Countdown Box / Tentative Indicator */}
        <div className="z-10 flex items-center justify-between sm:justify-end gap-3 bg-slate-900/90 p-3 px-5 rounded-2xl border border-surface-border self-stretch sm:self-auto shadow-inner">
          {isOfficial && daysLeft !== null ? (
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-emerald-400 animate-pulse" />
              <div className="text-right">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tight">
                    {daysLeft}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">Days</span>
                  {hoursLeft !== null && (
                    <span className="text-xs text-slate-400 font-mono hidden md:inline ml-1">
                      {hoursLeft}h {minutesLeft}m
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">
                  until {group === 'Group 2' ? 'Group 2' : 'Paper 1'} (2:00 PM)
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 text-right">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-sm font-bold text-amber-300">
                  {currentAttempt}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Awaiting ICAI Schedule
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Official Papers Schedule */}
      {isOfficial && examInfo?.papers && examInfo.papers.length > 0 && (
        <div className="pt-2 border-t border-white/5 relative z-10">
          <button
            onClick={() => setShowPapers(v => !v)}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>{showPapers ? 'Hide' : 'View'} Official ICAI Paper Schedule ({examInfo.papers.length} Papers)</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showPapers ? 'rotate-180' : ''}`} />
          </button>

          {showPapers && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 animate-in fade-in duration-200">
              {examInfo.papers.map((paper, idx) => (
                <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 text-xs">
                  <span className="text-slate-300 font-medium">{paper}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ATTEMPT SWITCHER MODAL */}
      {showAttemptModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-surface-border rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Select CA Intermediate Attempt</h3>
              </div>
              <button
                onClick={() => setShowAttemptModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Only upcoming CA Intermediate cycles are shown. Past completed attempts are automatically archived.
            </p>

            {loadingUpcoming ? (
              <div className="py-8 flex items-center justify-center gap-2 text-slate-400 text-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Loading upcoming ICAI attempts…</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {upcomingAttempts.map((att) => {
                  const isCurrent = att.attempt_code === currentAttempt;
                  return (
                    <button
                      key={att.id}
                      onClick={() => handleSelectAttempt(att.attempt_code)}
                      disabled={switchingAttempt}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-indigo-600/20 border-indigo-500/60 shadow-md' 
                          : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 hover:border-slate-600'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{att.attempt_code}</span>
                          {att.status === 'official' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              🟢 Official
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              🟡 Tentative
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {att.status === 'official' 
                            ? `Dates: ${att.official_dates_text || att.official_start_date}` 
                            : `Estimated Period: ${att.tentative_period_label || att.attempt_code}`}
                        </p>
                      </div>

                      {isCurrent && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="pt-2 border-t border-surface-border text-center">
              <span className="text-[11px] text-slate-500">
                Tutovia automatically detects & updates official ICAI notices for all attempts.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* In-App Official Notice PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={showPdfViewer}
        onClose={() => setShowPdfViewer(false)}
        pdfUrl={noticePdfUrl}
        title={examInfo?.officialNoticeTitle || `ICAI Examination Notification — ${currentAttempt}`}
        subtitle={`CA Intermediate • ${currentAttempt} • Official ICAI Notification`}
        portalSourceUrl="https://www.icai.org/category/student-examination"
        isOfficial={true}
      />
    </div>
  );
}
