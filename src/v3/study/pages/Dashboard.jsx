import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Play, Brain, Moon, Target, RotateCcw, Calendar, ArrowRight, X, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../../api.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { getPapersForStage, CA_STAGES } from '../../../data/syllabusData.js';
import { exportTimetableToICS } from '../../../utils/calendarExport.js';
import { useDashboardData } from '../hooks/useDashboardData.js';
import { useDailySession } from '../hooks/useDailySession.js';
import { dayIST, nextDayIST, minuteIST, readUser, writeUser, chooseTask, isComplete, isResumable, studyTask, taskDate, taskLabel, taskDuration, scheduleFingerprint, dueCards, focusToday, weekActivity } from '../utils/dailyStudy.js';
import DailySessionTimer from '../components/DailySessionTimer.jsx';
import DailySubjectCard from '../components/DailySubjectCard.jsx';
import DailyDialog from '../components/DailyDialog.jsx';
import DailyCollapsible from '../components/DailyCollapsible.jsx';
import ExamCountdown from '../components/ExamCountdown.jsx';
import EditTimetableModal from '../components/EditTimetableModal.jsx';
import TimetableGeneratorModal from '../components/TimetableGeneratorModal.jsx';
import BadgeGallery from '../components/BadgeGallery.jsx';
import ZenStudyRoom from '../components/ZenStudyRoom.jsx';
import CaAggregateSimulator from '../components/CaAggregateSimulator.jsx';
import StudyMilestoneTimeline from '../components/StudyMilestoneTimeline.jsx';
import '../dailyDashboard.css';
export default function Dashboard({
  onOpenTutor
}) {
  const {
    user
  } = useAuth();
  return user ? <DailyDashboard key={user.id} user={user} onOpenTutor={onOpenTutor} /> : null;
}
function DailyDashboard({
  user,
  onOpenTutor
}) {
  const {
    profile: savedProfile
  } = useAuth();
  const {
    addToast
  } = useToast();
  const {
    currentPhaseInfo
  } = useTheme();
  const resource = useDashboardData(user.id);
  const data = resource.data || {};
  const profile = {
    ...savedProfile,
    ...data.profile,
    id: user.id
  };
  const schedule = Array.isArray(data.schedule) ? data.schedule : [];
  const progress = data.progress;
  const analytics = data.analytics;
  const [now, setNow] = useState(new Date());
  const [focusMode, setFocusMode] = useState(false),
    [zenOpen, setZenOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false),
    [generateOpen, setGenerateOpen] = useState(false);
  const [available, setAvailable] = useState(null),
    [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false),
    [saveError, setSaveError] = useState('');
  const savingRef = useRef(false),
    scheduleRef = useRef(schedule);
  scheduleRef.current = schedule;
  const [showCompleted, setShowCompleted] = useState(false),
    [allRevision, setAllRevision] = useState(false);
  const [reflectionOpen, setReflectionOpen] = useState(false),
    [reflectionMood, setReflectionMood] = useState(''),
    [reflectionNote, setReflectionNote] = useState('');
  const [moveIds, setMoveIds] = useState([]);
  const [dismissed, setDismissed] = useState(() => readUser(user.id, 'adjustDismissed', {}));
  const [reflectionDay, setReflectionDay] = useState(() => readUser(user.id, 'reflectionDay', ''));
  const [restoreSchedule, setRestoreSchedule] = useState(() => readUser(user.id, 'pendingScheduleRestore', null));
  const ownerAlive = useRef(true);
  useEffect(() => {
    ownerAlive.current = true;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      ownerAlive.current = false;
      clearInterval(interval);
    };
  }, []);
  async function commitSchedule(next, {
    baseline = scheduleRef.current,
    compare = true
  } = {}) {
    if (savingRef.current) throw new Error('A timetable save is already in progress.');
    savingRef.current = true;
    setSaving(true);
    setSaveError('');
    try {
      if (compare) {
        const {
          data: latest
        } = await api.get('/api/schedule', {
          params: {
            userId: user.id
          }
        });
        if (!Array.isArray(latest) || scheduleFingerprint(latest) !== scheduleFingerprint(baseline)) throw new Error('Your timetable changed elsewhere. Refresh before saving to keep those changes.');
      }
      const response = await api.post('/api/schedule/custom', {
        userId: user.id,
        schedule: next
      });
      if (!Array.isArray(response.data) || scheduleFingerprint(response.data) !== scheduleFingerprint(next)) throw new Error('The timetable save was not confirmed. Refresh before retrying.');
      if (ownerAlive.current) resource.update({
        schedule: response.data
      });
      try {
        localStorage.setItem(`tutovia_schedule_${user.id}`, JSON.stringify(response.data));
      } catch {
        addToast('Plan saved; the browser cache could not be updated.', 'info');
      }
      return response.data;
    } catch (error) {
      if (ownerAlive.current) setSaveError(error.message || 'Timetable could not be saved.');
      throw error;
    } finally {
      savingRef.current = false;
      if (ownerAlive.current) setSaving(false);
    }
  }

  // The legacy progress route changes a pending task as a side effect. Preserve
  // the fresh task statuses: a finished focus block is not a completed study task.
  async function recordFocus(event) {
    if (savingRef.current) {
      addToast('Focus time is saved on this device. Server totals were not updated while your timetable was being saved.', 'info');
      return;
    }
    savingRef.current = true;
    setSaving(true);
    try {
      const {
        data: before
      } = await api.get('/api/schedule', {
        params: {
          userId: user.id
        }
      });
      if (!Array.isArray(before)) throw new Error('Timetable could not be checked before recording focus time.');
      const result = await api.post('/api/progress/study-hours', {
        userId: user.id,
        minutesAdded: Math.max(1, Math.round(event.seconds / 60)),
        isPomodoro: true,
        activityType: 'study'
      });
      if (!Array.isArray(result.data?.schedule)) throw new Error('Server focus update could not be confirmed.');
      const corrected = result.data.schedule.map(task => {
        const previous = before.find(item => String(item.id) === String(task.id));
        return previous ? {
          ...task,
          done: previous.done,
          status: previous.status
        } : task;
      });
      if (scheduleFingerprint(corrected) !== scheduleFingerprint(result.data.schedule)) {
        writeUser(user.id, 'pendingScheduleRestore', {
          before: result.data.schedule,
          corrected
        });
        if (ownerAlive.current) setRestoreSchedule({
          before: result.data.schedule,
          corrected
        });
        const restored = await api.post('/api/schedule/custom', {
          userId: user.id,
          schedule: corrected
        });
        if (!Array.isArray(restored.data) || scheduleFingerprint(restored.data) !== scheduleFingerprint(corrected)) throw new Error('Focus time saved; timetable needs a retry.');
        writeUser(user.id, 'pendingScheduleRestore', null);
        if (ownerAlive.current) setRestoreSchedule(null);
      }
      if (ownerAlive.current) {
        resource.update({
          schedule: corrected
        });
        addToast('Focus time saved. Your study task remains open until you mark it completed.', 'success');
        resource.refresh();
      }
    } catch {
      if (ownerAlive.current) addToast('Focus time is recorded on this device. The server update could not be fully confirmed; refresh to check your totals.', 'error');
    } finally {
      savingRef.current = false;
      if (ownerAlive.current) setSaving(false);
    }
  }
  const controller = useDailySession(user.id, recordFocus, addToast);
  const today = dayIST(now);
  const todayTasks = schedule.filter(task => !taskDate(task) || taskDate(task) <= today);
  const unfinished = todayTasks.filter(task => !isComplete(task));
  const done = todayTasks.filter(isComplete);
  const selectedTask = schedule.find(task => String(task.id) === String(selectedId) && !isComplete(task));
  const nextTask = selectedTask || chooseTask(schedule, {
    now,
    available,
    activeId: !controller.session?.finished && (!available || controller.active || controller.session?.remaining <= available * 60) ? controller.session?.taskId : null
  });
  const practice = readUser(user.id, 'practiceResume', null);
  const hasPractice = practice?.kind === 'exam' && practice.userId === user.id && Object.keys(practice.answers || {}).length > 0;
  const resumeFocus = controller.session && !controller.session.finished && (!available || controller.active || controller.session.remaining <= available * 60);
  const resumeTask = resumeFocus ? {
    id: controller.session.taskId,
    activity: controller.session.title,
    focus: controller.session.topic,
    subject_id: controller.session.subjectId,
    link: controller.session.link
  } : null;
  const workingSource = resumeTask || (!selectedTask && !available && hasPractice ? {
    id: `practice-${practice.examId}`,
    activity: practice.title,
    focus: practice.topic,
    subject_id: practice.subjectId,
    link: `/exams?examId=${encodeURIComponent(practice.examId)}`
  } : nextTask);
  const scheduledWorkingTask = workingSource ? {
    ...workingSource,
    subject_id: workingSource.subject_id || workingSource.link?.match(/^\/subject\/([^/?#]+)/)?.[1]
  } : null;
  const cards = useMemo(() => {
    let local = {};
    try {
      local = JSON.parse(localStorage.getItem(`tutovia_fc_progress_${user.id}`) || '{}');
    } catch {}
    return Array.isArray(data.flashcards) ? data.flashcards.map(card => ({
      ...card,
      ...(local[card.id]?.confirmed === true ? local[card.id] : {})
    })) : [];
  }, [data.flashcards, user.id]);
  const due = dueCards(cards, profile, now);
  const workingTask = scheduledWorkingTask || (available && due.length ? {
    id: `revision-${due[0].id}`,
    activity: `Revision: ${due[0].title || due[0].chapter || 'Flashcards'}`,
    focus: due[0].chapter || due[0].topic || 'Due flashcard review',
    subject_id: due[0].subject_id,
    revision: true,
    link: `/flashcards?subject=${encodeURIComponent(due[0].subject_id)}&due=1&card=${encodeURIComponent(due[0].id)}`
  } : null);
  const daily = focusToday(controller.events, now);
  const reviewEvents = cards.filter(card => card.confirmed && card.reviewed_at).map(card => ({
    kind: 'revision',
    at: card.reviewed_at
  }));
  const days = weekActivity(progress, [...controller.events, ...reviewEvents], progress?.attempts, now);
  const dailyGoal = Number(profile.daily_study_hours) > 0 ? Number(profile.daily_study_hours) * 60 : Number(progress?.daily_goal_minutes) > 0 ? Number(progress.daily_goal_minutes) : null;
  const stage = profile.ca_stage || 'intermediate';
  const stageSubjects = getPapersForStage(stage, profile.ca_group);
  const displayedSubjects = stage === 'intermediate' ? (Array.isArray(data.subjects) ? data.subjects : []).filter(subject => !profile.ca_group || profile.ca_group === 'Both Groups' || subject.group === profile.ca_group) : stageSubjects.map(paper => ({
    ...paper,
    ...(data.subjects || []).find(subject => subject.id === paper.id)
  }));
  const weaknesses = Array.isArray(analytics?.weaknesses) ? analytics.weaknesses.filter(group => stage === 'intermediate' || displayedSubjects.some(subject => subject.id === group.subject_id || subject.title === group.subject)).flatMap(group => (group.topics || []).map(topic => ({
    subject: group.subject,
    topic
  }))) : [];
  const missed = unfinished.find(task => taskLabel(task, now) === 'Missed session');
  const visibleMissed = missed && dismissed[today] !== String(missed.id);
  const examCount = Number.isFinite(progress?.total_exams) ? progress.total_exams : progress?.attempts?.length ?? analytics?.examsTaken;
  const readiness = examCount > 0 && Number.isFinite(analytics?.readinessScore) ? `${analytics.readinessScore}%` : examCount === 0 ? 'Not assessed yet' : 'Unavailable';
  async function startTask(task) {
    if (!task || savingRef.current) return;
    if (!studyTask(task)) {
      addToast('Breaks stay separate from recorded focus time. Open the wellness space for this activity.', 'info');
      return;
    }
    if (controller.active && controller.session.taskId !== task.id) {
      addToast('Pause or end your current session before switching tasks.', 'info');
      return;
    }
    try {
      const savedTask = schedule.find(item => String(item.id) === String(task.id));
      if (savedTask && !isResumable(savedTask)) await commitSchedule(schedule.map(item => item.id === savedTask.id ? {
        ...item,
        done: false,
        status: 'In Progress'
      } : item));
      controller.start(task, available || Math.min(taskDuration(task) || 25, 25));
      setSelectedId(task.id);
      document.querySelector('[data-testid="pomodoro"]')?.scrollIntoView({
        behavior: 'instant',
        block: 'nearest'
      });
    } catch (error) {
      addToast(error.message, 'error');
    }
  }
  async function updateStatus(task, status) {
    try {
      await commitSchedule(schedule.map(item => item.id === task.id ? {
        ...item,
        status,
        done: status === 'Completed'
      } : item));
      addToast('Task status saved.', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    }
  }
  async function generatePlan(config) {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError('');
    try {
      const {
        data: next
      } = await api.post('/api/schedule/ai-generate', {
        userId: user.id,
        ...config
      });
      if (!Array.isArray(next)) throw new Error('Plan generation was not confirmed.');
      resource.update({
        schedule: next
      });
      setGenerateOpen(false);
      addToast('Your study plan has been saved.', 'success');
    } catch (error) {
      setSaveError('Your plan could not be generated. Please retry.');
      throw error;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }
  async function moveToTomorrow(ids) {
    if (!ids.length) return;
    await commitSchedule(schedule.map(task => ids.includes(String(task.id)) && !isComplete(task) ? {
      ...task,
      scheduled_date: nextDayIST(now),
      status: 'Not Completed',
      done: false
    } : task));
    addToast(`${ids.length} unfinished ${ids.length === 1 ? 'task' : 'tasks'} moved to tomorrow.`, 'success');
  }
  function dismissReflection() {
    setReflectionOpen(false);
    setReflectionDay(today);
    try {
      writeUser(user.id, 'reflectionDay', today);
    } catch {
      addToast('Reflection dismissal could not be saved.', 'error');
    }
  }
  async function saveReflection() {
    if (savingRef.current) return;
    try {
      if (moveIds.length) {
        await moveToTomorrow(moveIds);
        setMoveIds([]);
      }
      if (reflectionMood || reflectionNote.trim()) {
        savingRef.current = true;
        setSaving(true);
        await api.post('/api/mood', {
          userId: user.id,
          mood: reflectionMood || 'Reflection',
          note: reflectionNote.trim()
        });
        setReflectionMood('');
        setReflectionNote('');
        addToast('Your reflection has been saved.', 'success');
      }
      dismissReflection();
    } catch (error) {
      addToast(error.message || 'Reflection could not be saved. Please retry.', 'error');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }
  const taskRow = task => <article key={task.id} className={`daily-task ${String(workingTask?.id) === String(task.id) ? 'daily-task-current' : ''}`} aria-label={`${task.activity || task.title}, ${taskLabel(task, now)}`}>
    <div className="daily-task-time"><Clock size={14} /><span>{task.timeRange || task.time12 || task.time || 'Flexible time'}{taskDate(task) && taskDate(task) !== today && <span className="block">{taskDate(task)}</span>}</span></div>
    <div className="min-w-0"><h3 className="font-semibold text-sm break-words">{task.activity || task.title}</h3><p className="daily-muted mt-1">{task.focus || 'Choose a focus for this study block.'}</p><span className="daily-badge mt-2">{String(workingTask?.id) === String(task.id) ? 'Current / next session' : taskLabel(task, now)}</span></div>
    <div className="flex flex-wrap gap-2 items-center"><label className="daily-muted"><span className="sr-only">Status for {task.activity || task.title}</span><select className="daily-select" value={isComplete(task) ? 'Completed' : /in progress/i.test(task.status || '') ? 'In Progress' : /partially/i.test(task.status || '') ? 'Partially Completed' : 'Not Completed'} disabled={saving} onChange={event => updateStatus(task, event.target.value)}><option value="Not Completed">{taskLabel(task, now) === 'Missed session' ? 'Missed session' : 'Not started'}</option><option value="In Progress">In progress</option><option value="Partially Completed">Partially completed</option><option value="Completed">Completed</option></select></label>{!isComplete(task) && studyTask(task) && <button className="daily-secondary" disabled={saving || controller.active && controller.session.taskId !== task.id} onClick={() => {
        setSelectedId(task.id);
        startTask(task);
      }}>Start</button>}{task.link && /^\/(subject\/|exams|flashcards|pyq)/.test(task.link) && <Link className="daily-link min-h-10 inline-flex items-center" to={task.link}>Open task ↗</Link>}{!studyTask(task) && <Link className="daily-secondary" to="/wellness">Open break</Link>}</div>
  </article>;
  if (resource.loading && !resource.data) return <div className="space-y-5" role="status" aria-label="Loading study dashboard"><div className="glass-panel daily-card h-36">Loading your study plan…</div><div className="grid md:grid-cols-3 gap-4">{[1, 2, 3].map(index => <div key={index} className="glass-panel daily-card h-24" />)}</div><div className="glass-panel daily-card h-64" /></div>;
  return <div className="daily-dashboard space-y-5 md:space-y-6" data-testid="daily-dashboard">
    {resource.errors.length > 0 && <div className="daily-notice" role="alert">Some data could not be refreshed ({resource.errors.join(', ')}). Previously loaded records are kept where available. <button className="daily-link min-h-10" onClick={() => resource.refresh()} disabled={resource.refreshing}>Retry dashboard data</button></div>}
    {saveError && <div className="daily-notice daily-error" role="alert">{saveError}<button className="daily-link min-h-10" onClick={() => resource.refresh()}>Refresh timetable</button></div>}
    {restoreSchedule && <div className="daily-notice" role="alert">Focus time was recorded, but timetable statuses need to be checked. <button className="daily-secondary" disabled={saving} onClick={async () => {
        try {
          await commitSchedule(restoreSchedule.corrected, {
            baseline: restoreSchedule.before
          });
          writeUser(user.id, 'pendingScheduleRestore', null);
          setRestoreSchedule(null);
          addToast('Timetable statuses restored.', 'success');
        } catch (error) {
          addToast(error.message, 'error');
        }
      }}>Retry timetable sync</button></div>}

    <header className="glass-panel daily-card" data-section="welcome">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="min-w-0"><p className="daily-eyebrow">YOUR DAILY STUDY COMPANION</p><h1 className="text-xl sm:text-2xl font-heading font-extrabold mt-1">{currentPhaseInfo.greeting}, {user.name || 'Scholar'}</h1><p className="daily-muted mt-2">{CA_STAGES.find(item => item.id === stage)?.label || 'CA student'} · {profile.ca_group || 'Group not selected'} <span className="mx-2">·</span><time>{now.toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })} IST</time></p></div>
        <div className="flex flex-wrap gap-2"><button className="daily-secondary" title="Refresh Dashboard" aria-label="Refresh Dashboard" onClick={() => resource.refresh()} disabled={resource.refreshing}><RotateCcw size={16} />{resource.refreshing ? 'Refreshing…' : 'Refresh'}</button><button className="daily-secondary" onClick={onOpenTutor}><Brain size={16} />Ask AI Tutor</button><div className="flex flex-wrap gap-2 rounded-2xl border border-surface-border p-1" role="group" aria-label="Study environment"><button className="daily-secondary border-0" onClick={() => setZenOpen(true)}><Moon size={16} />Zen Study Desk</button><button className="daily-secondary border-0" aria-pressed={focusMode} onClick={() => setFocusMode(value => !value)}><Target size={16} />{focusMode ? 'Exit Focus Mode' : 'Focus Mode'}</button></div></div>
      </div>
      <ExamCountdown profile={profile} onAttemptChange={attempt => resource.update({
        profile: {
          ...profile,
          attempt
        }
      })} />
    </header>

    <section aria-labelledby="today-summary-title" data-section="today">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3"><h2 id="today-summary-title" className="daily-title">Today’s study summary</h2><button className="daily-link min-h-10 text-sm" disabled={controller.active} onClick={() => setReflectionOpen(true)}>Reflect on today</button></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><Summary label="Focus time / saved goal" value={daily.recorded ? `${daily.minutes} min / ${dailyGoal ? `${dailyGoal} min` : 'goal not set'}` : `— / ${dailyGoal ? `${dailyGoal} min` : 'goal not set'}`} note={daily.recorded ? 'Dated V3 focus sessions on this device' : 'No dated focus sessions recorded here yet'} /><Summary label="Completed study sessions" value={daily.recorded ? daily.completed : '—'} note={daily.recorded ? 'Finished V3 focus blocks today' : 'No dated session count is available'} /><Summary label="Current study streak" value={Number.isFinite(progress?.current_streak) ? `${progress.current_streak} days` : 'Unavailable'} note="Reported by the existing IST streak service" /></div>
      <p className="daily-muted mt-3 text-xs">Daily focus totals use dated sessions recorded here. Older server focus totals are cumulative and are shown under progress.</p>
      <div className="flex flex-wrap items-center gap-4 mt-4"><span className="daily-muted">Weekly consistency</span><div className="flex gap-2 sm:gap-3" role="list" aria-label="Seven-day activity in IST">{days.map(day => <div role="listitem" key={day.date}><button className={`daily-day ${day.active ? 'daily-day-active' : ''}`} title={`${day.date}: ${day.description}`} aria-label={`${new Date(`${day.date}T12:00:00+05:30`).toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'short',
              timeZone: 'Asia/Kolkata'
            })}: ${day.description}`} onClick={() => addToast(`${day.date}: ${day.description}`, 'info')}><span>{new Date(`${day.date}T12:00:00+05:30`).toLocaleDateString('en-IN', {
                  weekday: 'narrow',
                  timeZone: 'Asia/Kolkata'
                })}</span>{day.active ? <CheckCircle2 size={14} /> : <span aria-hidden="true">—</span>}</button></div>)}</div><span className="daily-muted text-xs">Filled = confirmed activity or check-in · — = history unavailable</span></div>
    </section>

    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4" aria-label="Your next study session" data-section="next-session">
      <div className="glass-panel daily-card lg:col-span-2 flex flex-col">
        <div className="flex flex-wrap justify-between items-center gap-3"><h2 className="daily-title">{resumeFocus || hasPractice && !selectedTask && !available ? 'Resume where you left off' : 'Next study session'}</h2><div className="flex flex-wrap gap-1" role="group" aria-label="Available time today">{[[15, '15 minutes'], [30, '30 minutes'], [null, 'My usual plan']].map(([value, label]) => <button key={label} className={`daily-choice ${available === value ? 'daily-choice-active' : ''}`} aria-pressed={available === value} onClick={() => {
              setAvailable(value);
              setSelectedId(null);
            }}>{label}</button>)}</div></div>
        <p className="daily-muted mt-2">Available time is temporary; your saved timetable stays unchanged.</p>
        {workingTask ? <div className="mt-5 flex-1 flex flex-col"><p className="daily-eyebrow">{resumeFocus ? controller.active ? 'SESSION IN PROGRESS' : 'SAVED UNFINISHED SESSION' : 'FROM YOUR SAVED STUDY ACTIVITY'}</p><h3 className="text-xl sm:text-2xl font-extrabold mt-2">{workingTask.activity || workingTask.title}</h3><p className="mt-2 text-sm">{workingTask.focus || 'Continue your saved practice activity.'}</p><p className="daily-muted mt-3">{workingTask.timeRange || workingTask.time12 || workingTask.time || 'Flexible start'}{taskDuration(workingTask) && ` · ${taskDuration(workingTask)} minutes planned`}</p><p className="daily-muted mt-3">{resumeFocus || isResumable(workingTask) ? 'This activity was explicitly started and is still unfinished.' : workingTask.revision ? `A flashcard with a saved due date. Use a ${available}-minute focus block; review duration is not estimated.` : available ? `This saved task fits your ${available}-minute window.` : 'The next relevant unfinished task in your timetable.'}</p>{analytics?.nextAction && <p className="daily-inset daily-muted mt-4"><Sparkles size={14} className="inline mr-1" />Coach guidance: {analytics.nextAction}</p>}<div className="flex flex-wrap gap-3 mt-5"><button className="daily-primary px-6" disabled={saving || controller.active && controller.session.taskId !== workingTask.id} onClick={() => startTask(workingTask)}><Play size={18} />{controller.active ? 'Session running' : resumeFocus ? 'Resume session' : 'Start session'}</button>{workingTask.link && /^\/(subject\/|exams|flashcards|pyq)/.test(workingTask.link) && <Link className="daily-secondary" to={workingTask.link}>Continue activity <ArrowRight size={16} /></Link>}{!schedule.length && <button className="daily-secondary" onClick={() => setGenerateOpen(true)}>Create a study plan</button>}</div></div> : <div className="my-auto py-6"><h3 className="text-lg font-bold">{!Array.isArray(data.schedule) ? 'Your plan is unavailable' : schedule.length === 0 ? 'Let’s give today a clear direction' : unfinished.length === 0 ? 'Today’s tasks are complete. Well done.' : 'No saved task fits this time window'}</h3><p className="daily-muted mt-2">{available && unfinished.length ? 'Choose your usual plan, or use this time to review your due flashcards.' : 'Create a plan or choose a short revision activity when you’re ready.'}</p><div className="flex flex-wrap gap-3 mt-5"><button className="daily-primary" disabled={saving} onClick={() => setGenerateOpen(true)}>Create today’s plan</button><Link className="daily-secondary" to="/flashcards">Optional revision</Link></div></div>}
      </div>
      <DailySessionTimer controller={controller} />
    </section>

    <section className="glass-panel daily-card" aria-labelledby="timetable-title" data-section="timetable">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="timetable-title" className="daily-title flex items-center gap-2"><Calendar size={19} />Daily Timetable</h2><p className="daily-muted mt-1">Your saved times and ordering, with unfinished work kept in view.</p></div><div className="flex flex-wrap gap-2"><button className="daily-secondary" disabled={saving} onClick={() => setEditOpen(true)}>Edit timetable</button><button className="daily-secondary" disabled={!schedule.length} onClick={() => exportTimetableToICS(todayTasks, user.name)}>Export calendar</button><button className="daily-secondary" disabled={saving} onClick={() => setGenerateOpen(true)}>Plan settings &amp; regenerate</button></div></div>
      {visibleMissed && <div className="daily-notice my-4"><div><strong className="text-sm">Adjust your plan</strong><p className="daily-muted mt-1">{missed.activity || missed.title} is still unfinished. Choose what works for you.</p></div><div className="flex flex-wrap gap-2"><button className="daily-secondary" disabled={saving} onClick={() => startTask(missed)}>Resume task</button><button className="daily-secondary" disabled={saving} onClick={() => moveToTomorrow([String(missed.id)]).catch(error => addToast(error.message, 'error'))}>Move to tomorrow</button><button className="daily-link min-h-10" onClick={() => {
            const next = {
              ...dismissed,
              [today]: String(missed.id)
            };
            setDismissed(next);
            try {
              writeUser(user.id, 'adjustDismissed', next);
            } catch {
              addToast('Dismissal could not be saved.', 'error');
            }
          }}>Dismiss reminder</button></div></div>}
      <div className="space-y-3 mt-4">{unfinished.map(taskRow)}{!todayTasks.length && <p className="daily-muted py-5">{Array.isArray(data.schedule) ? 'No sessions planned for today.' : 'The timetable could not be loaded. Use Retry dashboard data above.'}</p>}</div>
      {done.length > 0 && <div className="mt-4"><button className="daily-secondary" aria-expanded={showCompleted} aria-controls="completed-tasks" onClick={() => setShowCompleted(value => !value)}>{showCompleted ? 'Hide' : 'Show'} completed tasks ({done.length})</button><div id="completed-tasks" hidden={!showCompleted} className="space-y-3 mt-3">{done.map(taskRow)}</div></div>}
      {schedule.some(task => taskDate(task) > today) && <details className="mt-4"><summary className="daily-link cursor-pointer py-3 min-h-10">Future sessions ({schedule.filter(task => taskDate(task) > today).length})</summary><div className="space-y-3">{schedule.filter(task => taskDate(task) > today).map(task => <div key={task.id} className="daily-inset"><strong className="text-sm">{task.activity || task.title}</strong><p className="daily-muted">{taskDate(task)} · {task.timeRange || task.time12 || task.time || 'Flexible time'}</p></div>)}</div></details>}
      {profile.whyThisSchedule && <details className="mt-4"><summary className="daily-link cursor-pointer py-3 min-h-10">Why this schedule?</summary><p className="daily-muted">{profile.whyThisSchedule}</p></details>}
    </section>

    <section data-section="subjects" aria-labelledby="subjects-title" hidden={focusMode}>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4"><h2 id="subjects-title" className="daily-title flex gap-2 items-center"><BookOpen size={19} />My Subjects</h2><Link className="daily-secondary" to="/syllabus">Open Syllabus Hub <ArrowRight size={15} /></Link></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{displayedSubjects.map(subject => <DailySubjectCard key={subject.id} subject={subject} resume={workingTask?.subject_id === subject.id && (resumeFocus || hasPractice) ? {
          title: workingTask.activity,
          topic: workingTask.focus,
          link: workingTask.link || `/subject/${subject.id}`
        } : null} />)}</div>{!displayedSubjects.length && <p className="glass-panel daily-card daily-muted">No subject records available for your selected stage and group. <Link className="daily-link" to="/profile">Review study goals</Link></p>}
    </section>

    <section className="glass-panel daily-card" data-section="revision" aria-labelledby="revision-title" hidden={focusMode}>
      <div className="flex justify-between gap-3 items-center"><h2 id="revision-title" className="daily-title">Priority revision</h2><button className="daily-link min-h-10" aria-expanded={allRevision} onClick={() => setAllRevision(value => !value)}>{allRevision ? 'Show less' : 'View all'}</button></div>
      <div className="grid md:grid-cols-2 gap-5 mt-4"><div><h3 className="font-semibold text-sm">Revision due today · {due.length}</h3><p className="daily-muted mt-1">Includes overdue cards with saved review dates.</p>{resource.errors.includes('flashcards') && <p className="daily-error text-xs mt-2">Revision data could not be refreshed. <button className="underline min-h-10" onClick={() => resource.refresh()}>Retry revision data</button></p>}<ul className="space-y-3 mt-3">{(allRevision ? due : due.slice(0, 3)).map(card => <li key={card.id} className="daily-inset"><strong className="text-sm">{card.chapter || card.topic || 'Flashcard revision'}</strong><p className="daily-muted mt-1">{displayedSubjects.find(subject => subject.id === card.subject_id)?.title || card.subject_id} · Due {dayIST(card.next_review_date)}</p><Link className="daily-link min-h-10 inline-flex items-center" to={`/flashcards?subject=${encodeURIComponent(card.subject_id)}&due=1&card=${encodeURIComponent(card.id)}`}>Review flashcards →</Link></li>)}</ul>{!due.length && <p className="daily-muted mt-4">No dated revision is due in the available records. <Link className="daily-link min-h-10 inline-flex items-center" to="/flashcards">Build a revision rhythm →</Link></p>}</div><div><h3 className="font-semibold text-sm">Weak topics from your mock attempts</h3><ul className="space-y-3 mt-3">{(allRevision ? weaknesses : weaknesses.slice(0, 3)).map((weakness, index) => <li className="daily-inset" key={`${weakness.topic}-${index}`}><strong className="text-sm">{weakness.topic}</strong><p className="daily-muted mt-1">{weakness.subject}</p><Link className="daily-link min-h-10 inline-flex items-center" to={`/exams?subject=${encodeURIComponent(displayedSubjects.find(subject => subject.title === weakness.subject)?.id || '')}`}>Practise topic →</Link></li>)}</ul>{!weaknesses.length && <p className="daily-muted mt-4">{examCount === 0 ? 'Take your first mock to identify topics needing practice.' : 'No diagnosed weak topics in the available records.'} <Link className="daily-link min-h-10 inline-flex items-center" to="/exams">Open mock exams →</Link></p>}</div></div>
    </section>

    <div hidden={focusMode} data-section="progress"><DailyCollapsible userId={user.id} name="progress" title="Progress and achievements" description={`Readiness: ${readiness} · ${Number.isFinite(progress?.xp) ? `${progress.xp} XP` : 'XP unavailable'} · Explore your score history and badges`} onError={addToast}>{open => <div className="space-y-5"><div className="grid sm:grid-cols-3 gap-3"><Summary label="Exam readiness" value={readiness} note={examCount > 0 ? 'Average mock score plus a capped practice-coverage bonus; an estimate, not a prediction.' : 'A mock attempt is required for assessment.'} /><Summary label="XP and level" value={Number.isFinite(progress?.xp) ? `${progress.xp} XP · Level ${progress.level ?? '—'}` : 'Unavailable'} note="From your recorded focus time and exam completions" /><Summary label="Total recorded focus" value={Number.isFinite(progress?.total_study_minutes) ? `${progress.total_study_minutes} min` : 'Unavailable'} note="Cumulative server total, not today’s focus time" /></div><div className="flex flex-wrap gap-4"><span className="daily-muted">Average mock score: {examCount > 0 && Number.isFinite(progress?.avg_score) ? `${progress.avg_score}%` : examCount === 0 ? 'No attempts yet' : 'Unavailable'}</span><Link className="daily-link" to="/analytics">Open full analytics →</Link></div><BadgeGallery progress={{
            ...progress,
            completed_exams: examCount,
            mastered_flashcards: cards.filter(card => card.status === 'mastered').length,
            best_accuracy: Math.max(0, ...(progress?.attempts || []).map(attempt => attempt.score_pct || 0))
          }} compact={false} /><div><h3 className="font-semibold">Mock Exam Score Progression</h3>{open && progress?.trend?.length > 0 ? <div className="h-56 mt-4" role="img" aria-label="Scores from your last five saved mock attempts"><ResponsiveContainer width="100%" height="100%"><LineChart data={progress.trend} margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0
                }}><CartesianGrid strokeDasharray="3 3" stroke="var(--bg-surface-border)" /><XAxis dataKey="name" stroke="var(--text-secondary)" tick={{
                    fontSize: 12
                  }} /><YAxis domain={[0, 100]} stroke="var(--text-secondary)" tick={{
                    fontSize: 12
                  }} /><Tooltip contentStyle={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--bg-surface-border)',
                    borderRadius: 12,
                    color: 'var(--text-primary)'
                  }} /><Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={3} isAnimationActive={false} /></LineChart></ResponsiveContainer></div> : <p className="daily-muted mt-3">{examCount === 0 ? 'No mock attempts yet.' : 'Score history is unavailable.'}</p>}</div></div>}</DailyCollapsible></div>
    <div hidden={focusMode} data-section="strategy"><DailyCollapsible userId={user.id} name="strategy" title="Exam strategy" description="Passing simulator and your study milestone checklist" onError={addToast}><p className="daily-muted mb-4">Simulator marks are planning scenarios, not recorded student scores. Milestones are checked off by you.</p><CaAggregateSimulator defaultGroup={profile.ca_group || 'Both Groups'} onGenerate={generatePlan} /><div className="mt-5"><StudyMilestoneTimeline /></div></DailyCollapsible></div>
    {!controller.active && minuteIST(now) >= 17 * 60 && reflectionDay !== today && <div className="daily-notice"><p className="daily-muted">A quiet moment to close the day: review {done.length} completed tasks and decide what carries forward.</p><button className="daily-secondary" onClick={() => setReflectionOpen(true)}>Optional daily reflection</button><button className="daily-link min-h-10" onClick={dismissReflection}>Not today</button></div>}

    <EditTimetableModal isOpen={editOpen} onClose={() => setEditOpen(false)} schedule={schedule} onSave={async next => {
      await commitSchedule(next);
      addToast('Timetable saved.', 'success');
    }} />
    <TimetableGeneratorModal isOpen={generateOpen} onClose={() => setGenerateOpen(false)} onGenerate={generatePlan} defaultHours={profile.daily_study_hours} />
    <ZenStudyRoom isOpen={zenOpen} onClose={() => setZenOpen(false)} defaultSubject={workingTask?.activity || 'Study revision'} />
    {reflectionOpen && <DailyDialog titleId="reflection-title" busy={saving} onClose={dismissReflection}><div className="flex justify-between items-center gap-3"><h2 id="reflection-title" className="daily-title">End-of-day reflection</h2><button className="daily-secondary" disabled={saving} onClick={dismissReflection} aria-label="Close reflection"><X size={17} /></button></div><p className="daily-muted mt-3">{done.length} tasks completed · {unfinished.length} unfinished. Reflection is optional.</p><label className="block mt-4 text-sm">How did today feel? (optional)<select className="daily-select w-full mt-2" value={reflectionMood} onChange={event => setReflectionMood(event.target.value)}><option value="">Skip mood</option>{['Focused', 'Overwhelmed', 'Anxious', 'Motivated', 'Exhausted', 'Calm'].map(mood => <option key={mood}>{mood}</option>)}</select></label><label className="block mt-4 text-sm">A note for tomorrow (optional)<textarea className="daily-select w-full mt-2 min-h-20" value={reflectionNote} onChange={event => setReflectionNote(event.target.value)} /></label><fieldset className="mt-4"><legend className="font-semibold text-sm">Choose unfinished tasks to move to tomorrow</legend><div className="space-y-2 mt-3">{unfinished.map(task => <label className="daily-inset flex items-center gap-3 text-sm" key={task.id}><input type="checkbox" checked={moveIds.includes(String(task.id))} onChange={event => setMoveIds(ids => event.target.checked ? [...ids, String(task.id)] : ids.filter(id => id !== String(task.id)))} />{task.activity || task.title}</label>)}</div></fieldset><div className="flex flex-wrap gap-2 mt-5"><button className="daily-primary" disabled={saving} onClick={saveReflection}>{saving ? 'Saving…' : 'Save reflection & selected tasks'}</button><button className="daily-secondary" disabled={saving} onClick={dismissReflection}>Skip reflection</button></div></DailyDialog>}
  </div>;
}
function Summary({
  label,
  value,
  note
}) {
  return <div className="glass-panel daily-card"><p className="daily-muted">{label}</p><strong className="block text-xl font-extrabold mt-2">{value}</strong><p className="daily-muted mt-2 text-xs">{note}</p></div>;
}
