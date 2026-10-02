// scratch/captureSnapshots.js
import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.localStorage.setItem('tutovia_user', JSON.stringify({ id: 'u1', name: 'Upasana Chaurasia' }));
    window.localStorage.setItem('tutovia_cloud_sync_prompt_dismissed', 'true');
    window.localStorage.setItem('tutovia_cloud_sync_enabled', 'false');
    window.localStorage.setItem('tutovia_onboarded_u1', 'true');
  });

  await page.goto('http://localhost:3000/subject/advanced-accounting');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Click 'Revision Notes' tab
  await page.click('button:has-text("Revision Notes")');
  await page.waitForTimeout(800);

  // Capture Chapter 1
  await page.screenshot({ path: 'screenshots/screenshot_chapter_snapshot_ch1_standards.png' });
  console.log('Saved ch1 standards');

  // Click Chapter 2 (Framework)
  await page.click('button:has-text("Ch 2:")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/screenshot_chapter_snapshot_ch2_framework.png' });
  console.log('Saved ch2 framework');

  // Click Chapter 4 (Branch Accounting)
  await page.click('button:has-text("Ch 4:")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/screenshot_chapter_snapshot_ch4_branches.png' });
  console.log('Saved ch4 branches');

  await browser.close();
  console.log('Done capturing snapshots!');
}

main().catch(console.error);
