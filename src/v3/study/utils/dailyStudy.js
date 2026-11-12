// Dated records only. Never turn cumulative counters or page visits into daily activity.
export const dayIST = (date = new Date()) => {
  const time = new Date(date).getTime();
  return Number.isFinite(time) ? new Date(time + 19800000).toISOString().slice(0, 10) : '';
};
export const nextDayIST = (date = new Date()) => dayIST(new Date(new Date(date).getTime() + 86400000));
export const minuteIST = (date = new Date()) => {
  const shifted = new Date(new Date(date).getTime() + 19800000);
  return shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
};
export function readUser(userId, name, fallback) {
  if (!userId) return fallback;
  try {
    const value = JSON.parse(localStorage.getItem(`tutovia_v3_${userId}_${name}`)) ?? fallback;
    return Array.isArray(fallback) && !Array.isArray(value) ? fallback : value;
  } catch {
    return fallback;
  }
}
export function writeUser(userId, name, value) {
  if (!userId) throw new Error('Please sign in before saving.');
  localStorage.setItem(`tutovia_v3_${userId}_${name}`, JSON.stringify(value));
}
export function taskStart(task) {
  const text = task.timeRange || task.time12 || task.time || '';
  const match = text.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    let hours = Number(match[1]);
    if (match[3]) hours = hours % 12 + (/PM/i.test(match[3]) ? 12 : 0);
    return hours * 60 + Number(match[2]);
  }
  return Number.isFinite(task.start_mins) ? task.start_mins : null;
}
export function taskDuration(task) {
  const explicit = Number(task.duration_minutes || task.duration);
  if (explicit > 0 && Number.isFinite(explicit)) return explicit;
  const range = task.timeRange?.split(/\s*[-–]\s*/);
  if (range?.length === 2) {
    const start = taskStart({
      time: range[0]
    });
    const end = taskStart({
      time: range[1]
    });
    if (start !== null && end !== null && end > start) return end - start;
  }
  const match = `${task.focus || ''}`.match(/(\d+)\s*min/i);
  return match ? Number(match[1]) : null;
}
export const isComplete = task => task.done === true || task.status?.toLowerCase() === 'completed';
export const isResumable = task => !isComplete(task) && /in progress|partially completed/i.test(task.status || '');
export const taskDate = task => task.scheduled_date || (typeof task.date === 'string' ? task.date.slice(0, 10) : null);
export const studyTask = task => !['wellness', 'break', 'commitment', 'sleep', 'meal'].includes(task.type);
export function taskLabel(task, now = new Date()) {
  if (isComplete(task)) return 'Completed';
  if (/in progress/i.test(task.status || '')) return 'In progress';
  if (/partially completed/i.test(task.status || '')) return 'Partially completed';
  const date = taskDate(task);
  if (date && date > dayIST(now)) return 'Not started';
  const start = taskStart(task);
  if (date && date < dayIST(now) || start !== null && minuteIST(now) > start + (taskDuration(task) || 45)) return 'Missed session';
  return 'Not started';
}
export function chooseTask(tasks, {
  now = new Date(),
  available = null,
  activeId = null
} = {}) {
  const today = dayIST(now);
  const candidates = tasks.filter(task => !isComplete(task) && studyTask(task) && (!taskDate(task) || taskDate(task) <= today));
  const active = candidates.find(task => String(task.id) === String(activeId));
  if (active) return active;
  const resumable = candidates.find(isResumable);
  const relevant = available ? candidates.filter(task => taskDuration(task) && taskDuration(task) <= available) : candidates;
  if (!available && resumable) return resumable;
  return relevant.find(task => {
    const start = taskStart(task);
    return start !== null && start >= minuteIST(now);
  }) || relevant[0] || null;
}
export function scheduleFingerprint(tasks) {
  return JSON.stringify(tasks.map(({
    id,
    activity,
    title,
    focus,
    type,
    status,
    done,
    timeRange,
    time12,
    time,
    scheduled_date,
    link
  }) => ({
    id,
    activity,
    title,
    focus,
    type,
    status,
    done: !!done,
    timeRange,
    time12,
    time,
    scheduled_date,
    link
  })));
}
export function dueCards(cards, profile, now = new Date()) {
  return cards.filter(card => card.status && card.status !== 'pending' && card.next_review_date && Number.isFinite(Date.parse(card.next_review_date)) && new Date(card.next_review_date) <= now && (card.ca_stage ? card.ca_stage === (profile?.ca_stage || 'intermediate') : !profile?.ca_stage || profile.ca_stage === 'intermediate') && (!profile?.ca_group || profile.ca_group === 'Both Groups' || card.group === profile.ca_group || card.group === 'General' || card.isCustom)).sort((a, b) => new Date(a.next_review_date) - new Date(b.next_review_date));
}
export function focusToday(events, now = new Date()) {
  const day = dayIST(now);
  const start = Date.parse(`${day}T00:00:00+05:30`),
    end = start + 86400000;
  let seconds = 0;
  for (const event of events.filter(item => item.kind === 'focus')) {
    for (const segment of event.segments || []) seconds += Math.max(0, Math.min(end, Date.parse(segment.end)) - Math.max(start, Date.parse(segment.start))) / 1000;
  }
  const completed = events.filter(event => event.kind === 'focus' && event.completed && dayIST(event.at) === day).length;
  return {
    minutes: Math.floor(seconds / 60),
    completed,
    recorded: events.some(event => event.kind === 'focus' && (dayIST(event.at) === day || (event.segments || []).some(segment => Date.parse(segment.start) < end && Date.parse(segment.end) > start)))
  };
}
export function weekActivity(progress, events, attempts, now = new Date()) {
  // The streak service confirms last_active_date, which includes check-ins. It does
  // not expose its historical calendar. Unknown days must not be labelled inactive.
  return Array.from({
    length: 7
  }, (_, index) => {
    const date = dayIST(new Date(new Date(now).getTime() - (6 - index) * 86400000));
    const sources = [];
    if (progress?.last_active_date === date) sources.push('Activity confirmed by the streak service (study or check-in)');
    if (events.some(event => dayIST(event.at) === date)) sources.push('Dated V3 study activity on this device');
    if ((attempts || []).some(attempt => attempt.created_at && dayIST(attempt.created_at) === date)) sources.push('Saved mock exam attempt');
    return {
      date,
      active: sources.length > 0,
      description: sources.join('; ') || 'No dated activity record available'
    };
  });
}
