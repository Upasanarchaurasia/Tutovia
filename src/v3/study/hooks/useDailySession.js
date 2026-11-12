import { useEffect, useRef, useState } from 'react';
import { readUser, writeUser } from '../utils/dailyStudy.js';
export function useDailySession(userId, onFinish, notify) {
  const [session, setSession] = useState(() => readUser(userId, 'session', null));
  const [events, setEvents] = useState(() => readUser(userId, 'activity', []));
  const latest = useRef(session),
    owner = useRef(userId),
    finishRef = useRef(onFinish),
    notifyRef = useRef(notify);
  finishRef.current = onFinish;
  notifyRef.current = notify;
  const completedIds = useRef(new Set());
  const persist = value => {
    latest.current = value;
    setSession(value);
    try {
      writeUser(owner.current, 'session', value);
    } catch {
      notifyRef.current('Session is running, but this browser could not save a resume point.', 'error');
    }
  };
  useEffect(() => {
    owner.current = userId;
    const restored = readUser(userId, 'session', null);
    latest.current = restored;
    setSession(restored);
    setEvents(readUser(userId, 'activity', []));
  }, [userId]);
  const finish = async (current, completed) => {
    if (completedIds.current.has(current.id)) return;
    const existing = readUser(owner.current, 'activity', []);
    if (existing.some(event => event.id === current.id)) {
      persist({
        ...current,
        running: false,
        remaining: 0,
        finished: true
      });
      return;
    }
    completedIds.current.add(current.id);
    const end = current.running ? Math.min(Date.now(), current.endsAt) : null;
    const segments = [...(current.segments || []), ...(end && current.segmentStart ? [{
      start: new Date(current.segmentStart).toISOString(),
      end: new Date(end).toISOString()
    }] : [])];
    const seconds = segments.reduce((sum, segment) => sum + Math.max(0, Date.parse(segment.end) - Date.parse(segment.start)) / 1000, 0);
    const event = {
      id: current.id,
      kind: 'focus',
      at: new Date(end || Date.now()).toISOString(),
      completed,
      taskId: current.taskId,
      title: current.title,
      topic: current.topic,
      subjectId: current.subjectId,
      segments,
      seconds
    };
    const next = seconds > 0 ? [...existing, event].slice(-365) : existing;
    let recorded = false;
    try {
      writeUser(owner.current, 'activity', next);
      setEvents(next);
      recorded = true;
    } catch {
      notifyRef.current('Focus time could not be stored on this device.', 'error');
    }
    persist({
      ...current,
      segments,
      running: false,
      remaining: completed ? 0 : current.remaining,
      finished: true,
      recorded
    });
    if (completed && seconds > 0 && recorded) await finishRef.current?.(event);
  };
  useEffect(() => {
    const tick = () => {
      const current = latest.current;
      if (!current?.running) return;
      const remaining = Math.max(0, Math.ceil((current.endsAt - Date.now()) / 1000));
      setSession({
        ...current,
        remaining
      });
      if (!remaining) finish(current, true);
    };
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [userId]);
  const start = (task, minutes = 25) => {
    const previous = latest.current;
    if (previous?.running) return previous.taskId === task?.id;
    if (previous && !previous.finished && previous.taskId === task?.id) {
      persist({
        ...previous,
        running: true,
        segmentStart: Date.now(),
        endsAt: Date.now() + previous.remaining * 1000
      });
      return true;
    }
    // Switching away from a paused task is explicit; retain its elapsed focus.
    if (previous && !previous.finished) finish(previous, false);
    const duration = Math.min(25, Math.max(1, minutes)) * 60;
    persist({
      id: `focus-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      taskId: task?.id || null,
      title: task?.activity || task?.title || 'Independent focus session',
      topic: task?.focus || task?.topic || '',
      subjectId: task?.subject_id || null,
      link: task?.link || null,
      duration,
      remaining: duration,
      running: true,
      segmentStart: Date.now(),
      endsAt: Date.now() + duration * 1000,
      segments: [],
      startedAt: new Date().toISOString()
    });
    return true;
  };
  const pause = () => {
    const current = latest.current;
    if (!current?.running) return;
    const end = Math.min(Date.now(), current.endsAt);
    persist({
      ...current,
      running: false,
      remaining: Math.max(0, Math.ceil((current.endsAt - Date.now()) / 1000)),
      segments: [...current.segments, {
        start: new Date(current.segmentStart).toISOString(),
        end: new Date(end).toISOString()
      }]
    });
  };
  const reset = () => {
    const current = latest.current;
    if (current && !current.finished) finish(current, false);
    persist(null);
  };
  return {
    session,
    events,
    start,
    pause,
    reset,
    end: () => latest.current && finish(latest.current, false),
    active: !!session?.running
  };
}
