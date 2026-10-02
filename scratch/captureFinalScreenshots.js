// scratch/captureFinalScreenshots.js
import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Pre-seed localStorage with authenticated student session
  await page.addInitScript(() => {
    window.localStorage.setItem('tutovia_user', JSON.stringify({
      id: 'u1',
      name: 'Upasana Chaurasia',
      email: 'upasana@tutovia.com',
      role: 'student',
      ca_group: 'Both',
      phone: '+91 98765 43210'
    }));
    window.localStorage.setItem('tutovia_cloud_sync_prompt_dismissed', 'true');
    window.localStorage.setItem('tutovia_cloud_sync_enabled', 'false');
    window.localStorage.setItem('tutovia_onboarded_u1', 'true');
  });

  // 1. Dashboard at / after login / redirection
  console.log('1. Capturing Dashboard after login...');
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/screenshot_dashboard_working.png' });
  console.log('Saved screenshots/screenshot_dashboard_working.png');

  // 2. News updates with official circulars & preview modal
  console.log('2. Capturing News Page & Official Circular Viewer...');
  await page.goto('http://localhost:3000/news');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'screenshots/screenshot_news_updates_verified.png' });
  console.log('Saved screenshots/screenshot_news_updates_verified.png');

  // Click on "Read Circular & Notes"
  const previewBtn = await page.$('button:has-text("Read Circular & Notes")');
  if (previewBtn) {
    await previewBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'screenshots/screenshot_news_pdf_modal.png' });
    console.log('Saved screenshots/screenshot_news_pdf_modal.png');
    // Close modal
    const closeBtn = await page.$('button:has-text("Close Preview")');
    if (closeBtn) await closeBtn.click();
  }

  // 3. Chapter Snapshots - Advanced Accounting Chapter 2 & Chapter 4
  console.log('3. Capturing Chapter Snapshots...');
  await page.goto('http://localhost:3000/subject/advanced-accounting');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1200);

  // Switch to Revision & Notes
  const revTab = await page.$('button:has-text("Revision & Notes"), button:has-text("Revision Notes & Formulas")');
  if (revTab) {
    await revTab.click();
    await page.waitForTimeout(800);
  }

  // Click Chapter 2 (Framework for Preparation & Presentation of Financial Statements)
  const ch2 = await page.$('button:has-text("Ch 2:")');
  if (ch2) {
    await ch2.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'screenshots/screenshot_chapter_snapshot_ch2_specific.png' });
    console.log('Saved screenshots/screenshot_chapter_snapshot_ch2_specific.png');
  }

  // Click Chapter 4 (Accounting for Branches including Foreign Branches)
  const ch4 = await page.$('button:has-text("Ch 4:")');
  if (ch4) {
    await ch4.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'screenshots/screenshot_chapter_snapshot_ch4_branches.png' });
    console.log('Saved screenshots/screenshot_chapter_snapshot_ch4_branches.png');
  }

  await browser.close();
  console.log('Finished capturing all final screenshots!');
}

capture().catch(console.error);
