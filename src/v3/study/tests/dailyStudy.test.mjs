import test from 'node:test';
import assert from 'node:assert/strict';
import { dayIST, minuteIST, nextDayIST, taskDuration, taskLabel, chooseTask, dueCards, focusToday, weekActivity, scheduleFingerprint } from '../utils/dailyStudy.js';

test('IST boundaries and tomorrow do not use the server timezone', () => {
  const now = new Date('2026-11-12T18:40:00Z');
  assert.equal(dayIST(now), '2026-11-13');
  assert.equal(minuteIST(now), 10);
  assert.equal(nextDayIST(now), '2026-11-14');
  assert.equal(dayIST('invalid'), '');
});
const now = new Date('2026-11-12T04:30:00Z'); // 10 AM IST
const tasks = [
  { id: 'past', activity: 'Past', time: '08:00 AM', focus: '45 mins', status: 'Not Completed' },
  { id: 'short', activity: 'Short', timeRange: '10:30 AM - 10:45 AM', status: 'Not Completed' },
  { id: 'done', activity: 'Done', time: '11:00 AM', done: true },
  { id: 'tomorrow', activity: 'Tomorrow', time: '09:00 AM', scheduled_date: '2026-11-13', status: 'Not Completed' }
];
test('next task uses actual incomplete tasks and temporary duration preferences', () => {
  const before = structuredClone(tasks);
  assert.equal(chooseTask(tasks, { now }).id, 'short');
  assert.equal(chooseTask(tasks, { now, available: 15 }).id, 'short');
  assert.equal(chooseTask(tasks, { now, available: 5 }), null);
  assert.equal(chooseTask([...tasks, { id: 'resume', status: 'Partially Completed' }], { now }).id, 'resume');
  assert.equal(chooseTask(tasks, { now, activeId: 'past' }).id, 'past');
  assert.deepEqual(tasks, before);
});
test('status wording distinguishes future, missed, in progress and completion', () => {
  assert.equal(taskLabel(tasks[0], now), 'Missed session');
  assert.equal(taskLabel(tasks[1], now), 'Not started');
  assert.equal(taskLabel(tasks[2], now), 'Completed');
  assert.equal(taskLabel(tasks[3], now), 'Not started');
  assert.equal(taskLabel({ status: 'In Progress' }, now), 'In progress');
  assert.equal(taskDuration(tasks[1]), 15);
  assert.equal(taskDuration({ focus: 'Unknown' }), null);
});
test('revision requires an actual due date, matching stage and group', () => {
  const cards = [
    { id: 1, status: 'hard', group: 'Group 1', next_review_date: '2026-11-11T12:00:00Z' },
    { id: 2, status: 'hard', group: 'Group 1', next_review_date: '2026-11-13T12:00:00Z' },
    { id: 3, status: 'hard', group: 'Group 1' },
    { id: 4, status: 'pending', group: 'Group 1', next_review_date: '2026-11-11T12:00:00Z' },
    { id: 5, status: 'hard', group: 'Group 2', next_review_date: '2026-11-11T12:00:00Z' }
  ];
  assert.deepEqual(dueCards(cards, { ca_stage: 'intermediate', ca_group: 'Group 1' }, now).map(card => card.id), [1]);
  assert.deepEqual(dueCards(cards, { ca_stage: 'foundation' }, now), []);
});
test('daily focus splits real session segments across IST midnight, excluding breaks', () => {
  const events = [{ kind: 'focus', completed: true, at: '2026-11-12T18:40:00Z', segments: [{ start: '2026-11-12T18:20:00Z', end: '2026-11-12T18:40:00Z' }] }];
  assert.deepEqual(focusToday(events, new Date('2026-11-12T18:41:00Z')), { minutes: 10, completed: 1, recorded: true });
  assert.equal(focusToday(events, new Date('2026-11-12T17:00:00Z')).minutes, 10);
  assert.deepEqual(focusToday([], now), { minutes: 0, completed: 0, recorded: false });
});
test('weekly strip never reconstructs history from a streak counter or cumulative hours', () => {
  const days = weekActivity({ current_streak: 7, total_study_minutes: 400, last_active_date: '2026-11-12' }, [], [], now);
  assert.equal(days.filter(day => day.active).length, 1);
  assert(days[0].description.includes('No dated'));
  assert(days[6].description.includes('check-in'));
});
test('schedule conflict comparison ignores clock-derived flags and notices changed statuses', () => {
  assert.equal(scheduleFingerprint(tasks), scheduleFingerprint(tasks.map(task => ({ ...task, isOverdue: true }))));
  assert.notEqual(scheduleFingerprint(tasks), scheduleFingerprint(tasks.map(task => ({ ...task, done: true }))));
});
