import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
export default function DailySubjectCard({
  subject,
  resume
}) {
  const attempted = Number.isFinite(subject.questionsAttempted) ? subject.questionsAttempted : null;
  const accuracy = Number.isFinite(subject.accuracy) ? subject.accuracy : null;
  const progress = Number.isFinite(subject.progress) ? subject.progress : null;
  const status = attempted === 0 ? 'Not started' : attempted === null ? 'Practice data unavailable' : accuracy !== null && accuracy < 60 ? 'Needs attention' : 'In progress';
  return <article className="glass-panel daily-card flex flex-col gap-4">
    <div className="flex items-start justify-between gap-3"><h3 className="font-bold text-sm leading-snug"><Link className="hover:underline" to={`/subject/${subject.id}`}>{subject.title}</Link></h3><BookOpen size={20} className="shrink-0 daily-accent" /></div>
    <div><div className="flex justify-between daily-muted mb-2"><span>Progress</span><strong>{progress === null ? 'Not recorded' : `${progress}%`}</strong></div><div className="h-1.5 bg-surface-card rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{
          width: `${Math.min(100, Math.max(0, progress || 0))}%`
        }} /></div></div>
    <div className="grid grid-cols-2 gap-2 text-xs"><div className="daily-inset"><span className="daily-muted block">Accuracy</span><strong>{accuracy === null ? '—' : `${accuracy}%`}</strong></div><div className="daily-inset"><span className="daily-muted block">Questions attempted</span><strong>{attempted === null ? '—' : attempted}</strong></div></div>
    <div className="daily-muted">{status}</div>
    {resume && <Link className="daily-link text-sm" to={resume.link}>Continue: {resume.topic || resume.title}</Link>}
    <Link className="daily-secondary mt-auto" to={`/subject/${subject.id}`}>Open subject <ArrowRight size={15} /></Link>
  </article>;
}
