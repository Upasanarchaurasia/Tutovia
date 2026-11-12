// Runs against deployed V3 assets on the production VM. All browser API writes
// are intercepted into isolated fixtures; no student database is modified.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const root = 'http://161.118.173.142';
const output = '/home/ubuntu/tutovia_v3_daily_build/qa';
fs.mkdirSync(output, { recursive: true });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fixture(browser, { userId = 'qa-daily-a', signedIn = true, empty = false, fail = false, storageState } = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, storageState });
  const user = { id: userId, name: 'V3 verification student', email: `${userId}@example.invalid` };
  const today = new Date(Date.now() + 19800000).toISOString().slice(0, 10);
  const model = {
    fail, failSave: false, saves: 0, focusWrites: 0, zeroWrites: 0, moodWrites: 0, generates: 0,
    schedule: empty ? [] : [
      { id: 'long', activity: 'Advanced Accounting', focus: 'AS 10 asset recognition · 45 mins', time: '00:00', type: 'study', status: 'Not Completed', done: false, link: '/subject/advanced-accounting' },
      { id: 'short', activity: 'Taxation quick revision', focus: 'GST input credits · 15 mins', time: '23:59', type: 'study', status: 'Not Completed', done: false, link: '/subject/taxation' },
      { id: 'done', activity: 'Completed law task', focus: 'Companies Act', time: '07:00', type: 'study', status: 'Completed', done: true }
    ]
  };
  const profile = { id: userId, ca_stage: 'intermediate', ca_group: 'Both Groups', daily_study_hours: 6, is_onboarded: true };
  const progress = { total_study_minutes: 480, completed_pomodoros: 20, current_streak: 7, last_active_date: today, total_exams: 0, attempts: [], trend: [], xp: 4800, level: 7 };
  const subjects = [{ id: 'advanced-accounting', title: 'Advanced Accounting', group: 'Group 1', progress: 0, questionsAttempted: 0, accuracy: null }, { id: 'taxation', title: 'Taxation', group: 'Group 1', progress: 0, questionsAttempted: 0, accuracy: null }];
  const analytics = { readinessScore: 0, examsTaken: 0, weaknesses: [], nextAction: 'A supporting recommendation from saved records.' };
  const cards = [
    { id: 'due', subject_id: 'advanced-accounting', group: 'Group 1', chapter: 'AS 10 due revision', status: 'hard', next_review_date: new Date(Date.now() - 86400000).toISOString(), question: 'Recognise an asset?', points: ['Apply the recognition criteria.'] },
    { id: 'future', subject_id: 'taxation', group: 'Group 1', chapter: 'Future GST revision', status: 'good', next_review_date: new Date(Date.now() + 86400000 * 3).toISOString(), question: 'GST?', points: ['Review later.'] },
    { id: 'undated', subject_id: 'taxation', group: 'Group 1', chapter: 'Undated revision', status: 'hard', question: 'Undated?', points: ['Not due without a date.'] }
  ];
  const exam = { id: 'advanced-accounting-qa', subject_id: 'advanced-accounting', title: 'Advanced Accounting verification mock', duration_sec: 300, questions: [{ id: 'q1', topic: 'AS 10', question: 'Verification question', options: ['Option A', 'Option B'], correct: 0 }] };
  await context.addInitScript(({ user, profile, signedIn }) => {
    if (!sessionStorage.getItem('qa-daily-initialized')) {
      if (signedIn) localStorage.setItem('tutovia_user', JSON.stringify(user));
      else { localStorage.removeItem('tutovia_user'); sessionStorage.removeItem('tutovia_user'); }
      sessionStorage.setItem('qa-daily-initialized', 'true');
    }
    localStorage.setItem(`tutovia_onboarded_${user.id}`, 'true');
    localStorage.setItem(`tutovia_profile_${user.id}`, JSON.stringify(profile));
    if (!localStorage.getItem('tutovia_v2_theme_mode')) localStorage.setItem('tutovia_v2_theme_mode', 'eclipse');
  }, { user, profile, signedIn });
  await context.route('**/*.supabase.co/**', route => route.fulfill({ status: 400, json: { message: 'Isolated browser verification' } }));
  await context.route('**/api/**', async route => {
    const request = route.request(), url = new URL(request.url()), path = url.pathname;
    const reply = (json, status = 200) => route.fulfill({ status, json });
    const body = request.method() === 'GET' ? {} : request.postDataJSON() || {};
    if (path === '/api/auth/login') return reply(user);
    if (request.method() !== 'GET') {
      if (path === '/api/schedule/custom') { if (model.failSave) return reply({ error: 'Verification save failure' }, 503); model.saves++; model.schedule = structuredClone(body.schedule); return reply(model.schedule); }
      if (path === '/api/progress/study-hours') {
        if (body.minutesAdded === 0) model.zeroWrites++;
        if (body.minutesAdded > 0) {
          model.focusWrites++; progress.total_study_minutes += body.minutesAdded;
          const first = model.schedule.find(task => !task.done); if (first) first.done = true; // Existing legacy side effect.
        }
        return reply({ ...progress, schedule: model.schedule });
      }
      if (path === '/api/mood') { model.moodWrites++; return reply({ success: true }); }
      if (path === '/api/schedule/ai-generate') { model.generates++; return reply(model.schedule); }
      if (path === '/api/user/attempt-preference') return reply({ success: true, attempt: body.attempt });
      // Unexpected writes are blocked, never forwarded to the production API.
      return reply({ error: 'Write blocked during verification' }, 409);
    }
    if (model.fail && ['/api/dashboard/bundle', '/api/profile', '/api/progress', '/api/schedule', '/api/mood', '/api/subjects', '/api/analytics', '/api/flashcards'].includes(path)) return reply({ error: 'Verification outage' }, 503);
    if (path === '/api/dashboard/bundle') return reply({ profile, progress, schedule: model.schedule, subjects, moods: [], analytics });
    if (path === '/api/profile') return reply(profile);
    if (path === '/api/progress') return reply(progress);
    if (path === '/api/schedule') return reply(model.schedule);
    if (path === '/api/analytics') return reply(analytics);
    if (path === '/api/subjects') return reply(subjects);
    if (path === '/api/flashcards') return reply(empty ? [] : cards);
    if (path === '/api/exams') return reply([exam]);
    if (path === `/api/exams/${exam.id}`) return reply(exam);
    if (path === '/api/exam-attempts/upcoming') return reply([{ id: 'official', attempt_code: 'Next verified attempt', status: 'official' }, { id: 'tentative', attempt_code: 'Following attempt', status: 'tentative' }]);
    if (path === '/api/icai-exam-dates') return reply({ isOfficial: true, targetDate: new Date(Date.now() + 10 * 86400000).toISOString(), daysLeft: 10, papers: ['Verified paper'], officialNoticePdfUrl: 'https://resource.cdn.icai.org/94359exam-aps6372-stu-iff-jan2027.pdf' });
    return reply([]);
  });
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const ready = async () => { await page.getByRole('heading', { name: /V3 verification student/ }).waitFor({ timeout: 45000 }); await page.getByRole('heading', { name: 'Daily Timetable', exact: true }).waitFor(); };
  return { context, page, model, ready, errors, user, profile };
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  let current;
  try {
    const f = current = await fixture(browser, { signedIn: false });
    const { page, model } = f;
    await page.goto(`${root}/v3/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/v3/login');
    await page.locator('#login-email').fill(f.user.email);
    await page.locator('#login-password').fill('verification-only');
    await page.getByRole('button', { name: /Sign in/i }).click();
    await page.waitForURL('**/v3/dashboard');
    await f.ready();
    assert.deepEqual(await page.locator('.daily-dashboard > [data-section]').evaluateAll(nodes => nodes.map(node => node.dataset.section)), ['welcome', 'today', 'next-session', 'timetable', 'subjects', 'revision', 'progress', 'strategy']);
    assert((await page.locator('[data-section="today"]').innerText()).includes('No dated focus sessions'));
    assert.equal(await page.locator('[data-section="today"] .daily-day-active').count(), 1, 'No seven-day history may be invented from the streak');
    assert.equal(await page.locator('[data-testid="exam-countdown"]').count(), 1);
    console.log('PASS: login, section order, single countdown and honest daily metrics');

    const saves = model.saves;
    await page.getByRole('button', { name: '15 minutes', exact: true }).click();
    assert.equal(model.saves, saves, 'Temporary available time must not overwrite the plan');
    await page.locator('[data-section="next-session"]').getByRole('heading', { name: 'Taxation quick revision', exact: true }).waitFor();
    assert(!await page.locator('[data-section="revision"]').getByText('Future GST revision', { exact: true }).count());
    assert(!await page.locator('[data-section="revision"]').getByText('Undated revision', { exact: true }).count());
    await page.getByRole('link', { name: 'Review flashcards →', exact: true }).first().click();
    assert(new URL(page.url()).pathname === '/v3/flashcards');
    await page.getByText('Recognise an asset?', { exact: true }).waitFor();
    console.log('PASS: time preference and date-backed revision route/filter');
    await page.goto(`${root}/v3/dashboard`, { waitUntil: 'domcontentloaded' }); await f.ready();
    await page.clock.install();
    await page.getByRole('button', { name: '15 minutes', exact: true }).click();
    await page.getByRole('button', { name: 'Start session', exact: true }).click();
    await page.getByRole('button', { name: 'Pause focus timer' }).waitFor();
    assert.equal(model.schedule.find(task => task.id === 'short').done, false);
    assert.equal(model.schedule.find(task => task.id === 'short').status, 'In Progress');
    assert((await page.getByTestId('timer-topic').innerText()).includes('GST input credits'));
    const deadline = await page.evaluate(id => JSON.parse(localStorage.getItem(`tutovia_v3_${id}_session`)).endsAt, f.user.id);
    await page.getByRole('button', { name: 'Refresh Dashboard', exact: true }).click();
    await wait(600);
    assert.equal(await page.evaluate(id => JSON.parse(localStorage.getItem(`tutovia_v3_${id}_session`)).endsAt, f.user.id), deadline);
    await page.clock.fastForward(1500);
    await page.getByRole('button', { name: 'Pause focus timer' }).click();
    await page.reload({ waitUntil: 'domcontentloaded' }); await f.ready();
    await page.getByRole('button', { name: 'Resume session', exact: true }).click();
    await page.clock.fastForward(15 * 60 * 1000 + 2000);
    await page.getByText(/Focus time recorded on this device/).waitFor();
    await wait(1000);
    assert.equal(model.focusWrites, 1);
    assert.equal(model.schedule.find(task => task.id === 'long').done, false, 'Legacy progress side effect must be restored');
    assert.equal(model.schedule.find(task => task.id === 'short').done, false, 'A focus block does not complete a task');
    await page.reload({ waitUntil: 'domcontentloaded' }); await f.ready(); await wait(300);
    assert.equal(model.focusWrites, 1, 'Reload must not duplicate a finished session');
    assert.equal(model.zeroWrites, 0, 'Zero-minute background sync must not reach the legacy study endpoint');
    assert((await page.locator('[data-section="today"]').innerText()).includes('15 min / 360 min'));
    await page.getByLabel('Status for Taxation quick revision').selectOption('Completed');
    await wait(300);
    assert.equal(model.schedule.find(task => task.id === 'short').done, true);
    await page.getByRole('button', { name: /Show completed tasks \(2\)/ }).click();
    await page.getByRole('button', { name: /Hide completed tasks \(2\)/ }).waitFor();
    console.log('PASS: selected task, stable timer, resume, focus recording and explicit completion');

    await page.getByRole('button', { name: /Progress and achievements/ }).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.getByRole('button', { name: /Progress and achievements/ }).getAttribute('aria-expanded'), 'true');
    await page.reload({ waitUntil: 'domcontentloaded' }); await f.ready();
    assert.equal(await page.getByRole('button', { name: /Progress and achievements/ }).getAttribute('aria-expanded'), 'true');
    await page.getByRole('button', { name: /^Exam strategy/ }).click();
    await page.getByText('CA Passing & Aggregate Simulator', { exact: true }).waitFor();
    assert((await page.locator('[data-section="strategy"]').innerText()).includes('0/12'));
    await page.getByRole('button', { name: /^Exam strategy/ }).click();
    await page.getByRole('button', { name: 'Focus Mode', exact: true }).click();
    assert(await page.getByTestId('pomodoro').isVisible());
    assert(await page.locator('[data-section="timetable"]').isVisible());
    assert(!await page.locator('[data-section="subjects"]').isVisible());
    await page.getByRole('button', { name: 'Exit Focus Mode', exact: true }).click();
    await page.getByRole('button', { name: 'Zen Study Desk', exact: true }).click();
    await page.getByTitle('Exit Zen Room', { exact: true }).click();
    await page.getByRole('main').getByRole('button', { name: 'Ask AI Tutor', exact: true }).click();
    await page.getByTitle('Close Drawer', { exact: true }).click();
    console.log('PASS: keyboard collapse/persistence, truthful milestones and existing study controls');

    await page.getByRole('button', { name: 'Reflect on today', exact: true }).click();
    await page.keyboard.press('Escape');
    assert(!await page.getByRole('dialog', { name: 'End-of-day reflection' }).count());
    await page.getByRole('button', { name: 'Reflect on today', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Advanced Accounting', exact: true }).check();
    model.failSave = true;
    await page.getByRole('button', { name: 'Save reflection & selected tasks', exact: true }).click();
    await wait(500);
    assert(!model.schedule.find(task => task.id === 'long').scheduled_date);
    assert(await page.getByRole('dialog', { name: 'End-of-day reflection' }).isVisible());
    model.failSave = false;
    await page.getByLabel('How did today feel? (optional)').selectOption('Calm');
    await page.getByRole('button', { name: 'Save reflection & selected tasks', exact: true }).click();
    await wait(500);
    assert(model.schedule.find(task => task.id === 'long').scheduled_date);
    assert.equal(model.moodWrites, 1);
    await page.reload({ waitUntil: 'domcontentloaded' }); await f.ready();
    assert(await page.getByText('No sessions planned for today.', { exact: true }).count() === 0); // Completed tasks remain accessible.
    console.log('PASS: reflection failure/success, saved carry-forward and completed task access');

    // Recording answers creates a resumable activity; merely visiting an exam does not.
    await page.goto(`${root}/v3/exams?examId=advanced-accounting-qa`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Verification question', exact: true }).waitFor();
    assert.equal(await page.evaluate(id => localStorage.getItem(`tutovia_v3_${id}_practiceResume`), f.user.id), null);
    await page.getByRole('button', { name: /Option A/ }).click();
    await wait(200);
    await page.goto(`${root}/v3/dashboard`, { waitUntil: 'domcontentloaded' }); await f.ready();
    await page.locator('[data-section="next-session"]').getByRole('heading', { name: 'Advanced Accounting verification mock', exact: true }).waitFor();
    await page.getByRole('link', { name: 'Continue activity', exact: true }).click();
    await page.getByRole('heading', { name: 'Verification question', exact: true }).waitFor();
    assert((await page.getByRole('button', { name: /Option A/ }).getAttribute('class')).includes('bg-indigo-600/20'));
    await page.goto(`${root}/v3/dashboard`, { waitUntil: 'domcontentloaded' }); await f.ready();
    console.log('PASS: unfinished exam resumes actual recorded answers, not a page visit');

    const themes = [['Aurora', 'morning'], ['Lumen', 'day'], ['Twilight', 'evening'], ['Eclipse', 'night']];
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      for (const [name, phase] of themes) {
        await page.getByRole('button', { name: 'Theme selector' }).click();
        await page.getByRole('button', { name: new RegExp(`${name}.*[AP]M`) }).click();
        await page.locator(`.v3-study.phase-${phase}`).waitFor();
        const bounds = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
        assert(bounds.content <= bounds.viewport, `${name} at ${width}px must fit`);
        await page.screenshot({ path: `${output}/daily-${width}-${phase}.png`, fullPage: false });
      }
    }
    const leaks = await page.locator('a[href]').evaluateAll(links => links.map(link => new URL(link.href)).filter(url => url.origin === location.origin && !url.pathname.startsWith('/v3/') && !url.pathname.startsWith('/api/')).map(url => url.pathname));
    assert.deepEqual(leaks, []);
    assert.deepEqual(f.errors, []);
    console.log('PASS: desktop/mobile across all four themes; navigation stays within V3');

    const state = await f.context.storageState();
    const other = current = await fixture(browser, { userId: 'qa-daily-b', storageState: state, empty: true });
    await other.page.goto(`${root}/v3/dashboard`, { waitUntil: 'domcontentloaded' }); await other.ready();
    assert.equal(await other.page.getByRole('button', { name: /Progress and achievements/ }).getAttribute('aria-expanded'), 'false');
    assert((await other.page.locator('[data-section="today"]').innerText()).includes('No dated focus sessions'));
    assert((await other.page.locator('[data-section="next-session"]').innerText()).includes('Create today’s plan'));
    console.log('PASS: account-separated activity/preferences and useful empty state');
    const failed = current = await fixture(browser, { userId: 'qa-daily-failure', fail: true });
    await failed.page.goto(`${root}/v3/dashboard`, { waitUntil: 'domcontentloaded' }); await failed.ready();
    await failed.page.getByRole('button', { name: 'Retry dashboard data', exact: true }).waitFor();
    assert((await failed.page.locator('[data-section="today"]').innerText()).includes('Unavailable'));
    failed.model.fail = false;
    await failed.page.getByRole('button', { name: 'Retry dashboard data', exact: true }).click();
    await failed.page.getByRole('heading', { name: 'Taxation quick revision', exact: true }).waitFor();
    assert.deepEqual(failed.errors, []);
    console.log('PASS: loading/failure/empty states and retry recovery');

    // Read-only checks of real records and the official dynamic attempt engine.
    const live = await browser.newContext();
    const attemptsResponse = await live.request.get(`${root}/api/exam-attempts/upcoming`);
    assert(attemptsResponse.ok());
    assert(Array.isArray(await attemptsResponse.json()));
    const bundleResponse = await live.request.get(`${root}/api/dashboard/bundle?userId=u1`);
    assert(bundleResponse.ok());
    const bundle = await bundleResponse.json();
    assert(Array.isArray(bundle.schedule));
    assert(Array.isArray(bundle.progress?.attempts));
    const realCards = await live.request.get(`${root}/api/flashcards?userId=u1`);
    assert(realCards.ok()); assert(Array.isArray(await realCards.json()));
    await live.close();
    console.log('PASS: real production dashboard/flashcard records and dynamic attempt API are reachable (read only)');
    console.log('All writes above used isolated browser fixtures; live student data was not changed.');
  } catch (error) {
    if (current) await current.page.screenshot({ path: `${output}/failure.png`, fullPage: true }).catch(() => {});
    throw error;
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
