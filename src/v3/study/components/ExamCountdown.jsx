import React, { useEffect, useState } from 'react';
import { Calendar, ChevronDown, X, FileText } from 'lucide-react';
import api from '../../../api.js';
import PdfViewerModal from './PdfViewerModal.jsx';
import DailyDialog from './DailyDialog.jsx';
import { dayIST } from '../utils/dailyStudy.js';
export default function ExamCountdown({
  profile,
  onAttemptChange
}) {
  const [attempts, setAttempts] = useState([]),
    [selected, setSelected] = useState('');
  const [info, setInfo] = useState(null),
    [error, setError] = useState(''),
    [retry, setRetry] = useState(0);
  const [chooser, setChooser] = useState(false),
    [viewer, setViewer] = useState(false),
    [busy, setBusy] = useState(false);
  const today = dayIST();
  const [copyStatus, setCopyStatus] = useState('');
  useEffect(() => {
    let cancelled = false;
    setError('');
    setInfo(null);
    api.get('/api/exam-attempts/upcoming', {
      params: {
        stage: profile?.ca_stage
      }
    }).then(async ({
      data
    }) => {
      if (!Array.isArray(data)) throw new Error('Exam attempts unavailable');
      if (cancelled) return;
      setAttempts(data);
      const target = data.find(item => item.attempt_code === profile?.attempt) || data[0];
      if (!target) throw new Error('No upcoming attempt is available.');
      setSelected(target.attempt_code);
      const response = await api.get('/api/icai-exam-dates', {
        params: {
          attempt: target.attempt_code,
          group: profile?.ca_group || 'Both Groups',
          stage: profile?.ca_stage || 'intermediate'
        }
      });
      if (!cancelled) setInfo(response.data);
    }).catch(() => {
      if (!cancelled) setError('Exam dates could not be loaded.');
    });
    return () => {
      cancelled = true;
    };
  }, [profile?.id, profile?.attempt, profile?.ca_group, profile?.ca_stage, retry, today]);
  const notice = info?.isOfficial && (info.officialNoticePdfUrl || info.officialNotificationUrl);
  const trustedNotice = notice && /^https:\/\/(resource\.cdn\.icai\.org|(?:www\.)?icai\.org)\//i.test(notice) ? notice : null;
  const choose = async code => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const {
        data
      } = await api.post('/api/user/attempt-preference', {
        userId: profile.id,
        attempt: code
      });
      if (!data.success) throw new Error('Save not confirmed');
      onAttemptChange(code);
      setChooser(false);
    } catch {
      setError('Attempt was not saved. Please retry.');
    } finally {
      setBusy(false);
    }
  };
  return <div className="border-t border-surface-border pt-4 mt-4" data-testid="exam-countdown">
    <div className="flex flex-wrap items-center gap-3 justify-between">
      <div className="flex flex-wrap items-center gap-2"><Calendar size={17} className="daily-accent" /><strong className="text-sm">{selected || 'Your exam attempt'}</strong>{info && <span className="daily-badge">{info.isOfficial ? 'Official · ICAI' : 'Tentative · awaiting ICAI dates'}</span>}</div>
      <button className="daily-secondary" onClick={() => setChooser(true)} disabled={!attempts.length || busy}>Switch Attempt <ChevronDown size={14} /></button>
    </div>
    {error ? <p className="daily-error mt-2" role="alert">{error} <button className="underline min-h-10" onClick={() => setRetry(value => value + 1)}>Retry exam dates</button></p> : !info ? <p className="daily-muted mt-2" role="status">Loading exam dates…</p> : <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
      <p className="daily-muted">{info.isOfficial && info.targetDate ? <>Starts {new Date(info.targetDate).toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}{Number.isFinite(info.daysLeft) && <> · <strong className="text-main">{info.daysLeft} days to go</strong></>}</> : info.disclaimer || 'Tentative — official dates not yet announced by ICAI.'}</p>
      {trustedNotice && <div className="flex flex-wrap gap-2"><button className="daily-link min-h-10 inline-flex items-center gap-1" onClick={() => setViewer(true)}><FileText size={15} />View Notice</button><a className="daily-secondary" href={trustedNotice} target="_blank" rel="noopener noreferrer">Open Notice PDF ↗</a><button className="daily-link min-h-10" onClick={async () => {
          try {
            await navigator.clipboard.writeText(trustedNotice);
            setCopyStatus('Link copied.');
          } catch {
            setCopyStatus('Copy is unavailable in this browser. Open the notice to copy its address.');
          }
        }}>Copy link</button></div>}
    </div>}
    {info?.isOfficial && info.papers?.length > 0 && <details className="mt-2"><summary className="daily-link cursor-pointer min-h-10 py-2 text-xs">Official ICAI paper schedule ({info.papers.length})</summary><ul className="space-y-2 daily-muted">{info.papers.map((paper, index) => <li key={index}>{typeof paper === 'string' ? paper : JSON.stringify(paper)}</li>)}</ul></details>}
    {chooser && <DailyDialog titleId="attempt-title" busy={busy} onClose={() => setChooser(false)}><div className="flex justify-between items-center"><h2 id="attempt-title" className="daily-title">Select upcoming exam attempt</h2><button className="daily-secondary" aria-label="Close attempt selection" onClick={() => setChooser(false)}><X size={17} /></button></div><div className="space-y-2 mt-4">{attempts.map(attempt => <button className="daily-secondary w-full justify-between" disabled={busy} key={attempt.id || attempt.attempt_code} onClick={() => choose(attempt.attempt_code)}><span>{attempt.attempt_code}</span><span className="daily-muted">{attempt.status === 'official' ? 'Official' : 'Tentative'}</span></button>)}</div>{error && <p className="daily-error" role="alert">{error}</p>}</DailyDialog>}
    {copyStatus && <p className="daily-muted mt-2" role="status">{copyStatus}</p>}
    <PdfViewerModal isOpen={viewer} onClose={() => setViewer(false)} pdfUrl={trustedNotice} title="Official ICAI examination notice" />
  </div>;
}
