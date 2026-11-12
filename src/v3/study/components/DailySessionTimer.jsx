import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
export default function DailySessionTimer({
  controller
}) {
  const {
    session,
    start,
    pause,
    reset,
    end
  } = controller;
  const [breakEnd, setBreakEnd] = useState(null),
    [breakRemaining, setBreakRemaining] = useState(300);
  useEffect(() => {
    if (session?.running) setBreakEnd(null);
  }, [session?.running]);
  useEffect(() => {
    if (!breakEnd) return;
    const timer = setInterval(() => {
      const seconds = Math.max(0, Math.ceil((breakEnd - Date.now()) / 1000));
      setBreakRemaining(seconds);
      if (!seconds) setBreakEnd(null);
    }, 500);
    return () => clearInterval(timer);
  }, [breakEnd]);
  const seconds = breakEnd ? breakRemaining : session?.remaining ?? 1500;
  const running = session?.running || !!breakEnd;
  return <section className="glass-panel daily-card h-full" aria-labelledby="focus-timer-title" data-testid="pomodoro">
    <div className="flex items-center justify-between gap-2"><h2 id="focus-timer-title" className="daily-title flex gap-2 items-center"><Timer size={19} />Pomodoro Timer</h2><span className="daily-eyebrow">{breakEnd ? 'Short break' : 'Focus session'}</span></div>
    <p className="daily-muted mt-3 min-h-10" data-testid="timer-topic">{session?.title || 'Choose a study task or start a free focus block.'}{session?.topic && <span className="block">{session.topic}</span>}</p>
    <div className="text-5xl font-black tracking-wider font-mono text-center my-5" role="timer" aria-label="Focus time remaining">{`${Math.floor(seconds / 60)}`.padStart(2, '0')}:{`${seconds % 60}`.padStart(2, '0')}</div>
    <div className="flex flex-wrap justify-center gap-3">
      <button className="daily-primary" aria-label={running ? 'Pause focus timer' : 'Start focus timer'} onClick={() => {
        if (breakEnd) setBreakEnd(null);else if (session?.running) pause();else start(session && !session.finished ? {
          id: session.taskId,
          activity: session.title,
          focus: session.topic,
          subject_id: session.subjectId,
          link: session.link
        } : null);
      }}>{running ? <Pause size={17} /> : <Play size={17} />}{running ? 'Pause' : 'Start'}</button>
      <button className="daily-secondary" aria-label="Reset focus timer" onClick={() => {
        setBreakEnd(null);
        setBreakRemaining(300);
        reset();
      }}><RotateCcw size={16} />Reset</button>
    </div>
    <div className="flex justify-center gap-4 mt-4 text-xs">
      {session && !session.finished && <button className="daily-link min-h-10" onClick={end}>End session</button>}
      {!session?.running && !breakEnd && <button className="daily-link min-h-10" onClick={() => {
        setBreakRemaining(300);
        setBreakEnd(Date.now() + 300000);
      }}>Take a 5-minute break</button>}
    </div>
    {session?.finished && <p className="daily-muted mt-3" role="status">{session.recorded === false ? 'This browser could not save focus time. Your task remains open.' : 'Focus time recorded on this device. Mark the task completed when you have finished its work.'}</p>}
  </section>;
}
