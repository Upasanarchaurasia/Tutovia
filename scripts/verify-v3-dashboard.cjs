// Production browser checks. Authentication is simulated; existing API reads are real.
// All other API writes are blocked to preserve student data during verification.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = 'http://161.118.173.142';
const output = process.env.V3_QA_OUTPUT || '/home/ubuntu/tutovia_v3_dashboard_build/qa';

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  const bundleResponses = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().includes('/api/dashboard/bundle')) bundleResponses.push(response.status());
  });
  const user = { id: 'u1', name: 'Dashboard verification', email: 'dashboard-verification@example.invalid' };
  await context.addInitScript(() => {
    localStorage.setItem('tutovia_v2_theme_mode', 'eclipse');
    localStorage.setItem('tutovia_onboarded_u1', 'true');
    localStorage.setItem('tutovia_profile_u1', JSON.stringify({ id: 'u1', ca_stage: 'intermediate', ca_group: 'Both Groups', is_onboarded: true }));
    localStorage.setItem('tutovia_announcement_dismissed_January_2027', 'true');
  });
  await context.route('**/*.supabase.co/**', route => route.fulfill({ status: 400, json: { message: 'Simulated authentication for browser verification' } }));
  await context.route('**/api/**', route => {
    const request = route.request();
    if (request.url().endsWith('/api/auth/login') && request.method() === 'POST') return route.fulfill({ status: 200, json: user });
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method())) return route.fulfill({ status: 200, json: {} });
    return route.continue();
  });
  async function settleDashboard() {
    await page.getByRole('heading', { name: /Dashboard verification/ }).waitFor({ timeout: 45000 });
    await page.waitForTimeout(2300);
    const moodClose = page.getByRole('button', { name: 'Close mood check-in' });
    if (await moodClose.isVisible()) await moodClose.click();
  }
  async function assertV3Links() {
    const leaked = await page.locator('a[href]').evaluateAll(links => links.map(a => a.href).filter(href => {
      const url = new URL(href);
      return url.origin === location.origin && !url.pathname.startsWith('/v3/') && !url.pathname.startsWith('/api/');
    }));
    assert.deepEqual(leaked, [], 'Internal navigation must remain inside V3');
  }

  try {
    await page.goto(`${base}/v3/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/v3/login');
    console.log('PASS: signed-out dashboard redirects to V3 login');
    await page.getByLabel('Email Address').fill(user.email);
    await page.locator('#login-password').fill('browser-verification-only');
    await page.getByRole('button', { name: /Sign In|Sign in/i }).click();
    await page.waitForURL('**/v3/dashboard');
    await settleDashboard();
    await page.getByRole('heading', { name: 'My Subjects', exact: true }).waitFor();
    await page.getByRole('heading', { name: 'Pomodoro Timer', exact: true }).waitFor();
    assert(bundleResponses.includes(200), 'Live dashboard API must return 200');
    console.log('PASS: login opens independent V3 dashboard using live study data');
    await assertV3Links();

    await page.getByRole('button', { name: 'Start focus timer' }).click();
    await page.waitForTimeout(1300);
    await page.getByRole('button', { name: 'Pause focus timer' }).click();
    assert(!await page.getByText('25:00', { exact: true }).isVisible());
    await page.getByRole('button', { name: 'Reset focus timer' }).click();
    await page.getByText('25:00', { exact: true }).waitFor();
    console.log('PASS: timer starts, pauses and resets');

    const bundleCount = bundleResponses.length;
    await page.getByTitle('Refresh Dashboard', { exact: true }).click();
    await page.waitForTimeout(2600);
    assert(bundleResponses.length > bundleCount, 'Refresh must request fresh dashboard data');
    if (await page.getByRole('button', { name: 'Close mood check-in' }).isVisible()) await page.getByRole('button', { name: 'Close mood check-in' }).click();

    await page.getByRole('button', { name: 'Focus Mode', exact: true }).click();
    await page.getByRole('button', { name: 'Exit Focus Mode', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Exit Focus Mode', exact: true }).click();
    await page.getByRole('button', { name: 'Zen Study Desk', exact: true }).click();
    await page.getByTitle('Exit Zen Room', { exact: true }).click();
    await page.getByRole('main').getByRole('button', { name: 'Ask AI Tutor', exact: true }).click();
    await page.waitForTimeout(300);
    assert(await page.getByText('Your AI Tutor', { exact: false }).count() || await page.locator('textarea, input[placeholder*="Ask"]').count());
    await page.goto(`${base}/v3/dashboard`, { waitUntil: 'domcontentloaded' });
    await settleDashboard();
    console.log('PASS: focus mode, Zen desk and tutor open within V3');

    await page.getByRole('button', { name: 'Theme selector' }).click();
    await page.getByRole('button', { name: /Lumen.*12:00/ }).click();
    await page.locator('.v3-study.phase-day').waitFor();
    await page.screenshot({ path: `${output}/dashboard-desktop-light.png`, fullPage: true });
    await page.getByRole('button', { name: 'Theme selector' }).click();
    await page.getByRole('button', { name: /Eclipse.*09:00/ }).click();
    await page.locator('.v3-study.phase-night').waitFor();
    await page.screenshot({ path: `${output}/dashboard-desktop.png`, fullPage: true });
    console.log('PASS: dashboard follows V3 atmosphere changes');

    await page.getByRole('link', { name: 'Start Mock', exact: true }).click();
    await page.waitForURL('**/v3/exams');
    await page.waitForTimeout(1500);
    await assertV3Links();
    await page.goto(`${base}/v3/subject/advanced-accounting`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: /Advanced Accounting/i }).first().waitFor({ timeout: 30000 });
    await assertV3Links();
    await page.goto(`${base}/v3/profile`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Sign Out', exact: true }).waitFor({ timeout: 30000 });
    await assertV3Links();
    console.log('PASS: exams, subjects and profile stay within V3');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/v3/dashboard`, { waitUntil: 'domcontentloaded' });
    await settleDashboard();
    await assertV3Links();
    const actionBounds = await page.getByRole('main').locator('button, a').evaluateAll(elements => elements.filter(element => /^(Ask AI Tutor|Zen Study Desk|Focus Mode|Start Mock)$/.test(element.textContent.trim())).map(element => {
      const bounds = element.getBoundingClientRect();
      return { label: element.textContent.trim(), left: bounds.left, right: bounds.right, viewport: innerWidth };
    }));
    assert.equal(actionBounds.length, 4);
    assert(actionBounds.every(bounds => bounds.left >= 0 && bounds.right <= bounds.viewport), 'All mobile header actions must fit the viewport');
    const widths = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert(widths.content <= widths.viewport, `Mobile overflow: ${JSON.stringify(widths)}`);
    await page.screenshot({ path: `${output}/dashboard-mobile.png`, fullPage: true });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await settleDashboard();
    assert(new URL(page.url()).pathname === '/v3/dashboard');
    console.log('PASS: mobile layout and dashboard reload preserve V3');

    await page.goto(`${base}/v3/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    assert(await page.locator('.v3-study').count() === 0, 'Landing page must not use dashboard shell');
    assert(await page.evaluate(() => !document.documentElement.className.includes('phase-')), 'Dashboard theme must not leak into the public page');
    assert.deepEqual(errors, [], 'No browser runtime errors');
    console.log('PASS: V3 landing preserved; no runtime errors');
    console.log(`Screenshots: ${output}`);
  } catch (error) {
    await page.screenshot({ path: `${output}/failure.png`, fullPage: true }).catch(() => {});
    throw error;
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
