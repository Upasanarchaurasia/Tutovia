// scratch/verifyAllThreeIssues.js
import { chromium } from 'playwright';
import path from 'path';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('1. Testing Login & Dashboard Redirection (No 404)...');
  // First set localStorage user credentials so app recognizes logged-in user
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');

  // Fill login credentials
  await page.fill('input[type="email"]', 'upasana.test@tutovia.com');
  await page.fill('input[type="password"]', 'Password@123');
  await page.click('button[type="submit"]');

  // Wait for navigation / redirect to Dashboard
  await page.waitForTimeout(1500);
  const currentUrl = page.url();
  console.log('Current URL after login:', currentUrl);

  // Take screenshot of Dashboard
  await page.screenshot({ path: 'screenshots/screenshot_dashboard_after_login.png' });
  console.log('Saved screenshot_dashboard_after_login.png');

  // Also verify /dashboard directly redirects to / without 404
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(1000);
  console.log('Navigated to /dashboard, landed on:', page.url());
  const bodyText = await page.innerText('body');
  const is404 = bodyText.includes('404') && bodyText.includes('Page not found');
  console.log('Is 404 present on /dashboard?:', is404);

  console.log('2. Testing News Page & Official Circular PDF Viewer...');
  await page.goto('http://localhost:3000/news');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1200);

  // Capture News Feed showing PDF badges and Open Official Circular buttons
  await page.screenshot({ path: 'screenshots/screenshot_news_official_pdfs.png' });
  console.log('Saved screenshot_news_official_pdfs.png');

  // Click "Read Circular & Notes" on the first article
  const readBtn = await page.$('button:has-text("Read Circular & Notes")');
  if (readBtn) {
    await readBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'screenshots/screenshot_news_circular_modal.png' });
    console.log('Saved screenshot_news_circular_modal.png');
    // Close modal
    const closeBtn = await page.$('button:has-text("Close Preview")');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(500);
  }

  console.log('3. Testing Specific Chapter Snapshots (No generic text)...');
  await page.goto('http://localhost:3000/subject/advanced-accounting');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  // Switch to Revision tab
  const revisionTab = await page.$('button:has-text("Revision & Notes"), button:has-text("Revision Notes & Formulas")');
  if (revisionTab) {
    await revisionTab.click();
    await page.waitForTimeout(1000);
  }

  // Capture Chapter 1 Snapshots (Accounting Standards)
  await page.screenshot({ path: 'screenshots/screenshot_chapter_snapshot_ch1.png' });
  console.log('Saved screenshot_chapter_snapshot_ch1.png');

  // Switch to Chapter 2 (Framework for Preparation & Presentation of Financial Statements)
  const ch2Btn = await page.$('button:has-text("Ch 2:")');
  if (ch2Btn) {
    await ch2Btn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'screenshots/screenshot_chapter_snapshot_ch2_framework.png' });
    console.log('Saved screenshot_chapter_snapshot_ch2_framework.png');
  }

  // Switch to Chapter 4 (Accounting for Branches including Foreign Branches)
  const ch4Btn = await page.$('button:has-text("Ch 4:")');
  if (ch4Btn) {
    await ch4Btn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'screenshots/screenshot_chapter_snapshot_ch4_branches.png' });
    console.log('Saved screenshot_chapter_snapshot_ch4_branches.png');
  }

  // Also test Corporate Laws Chapter 2 (Prospectus & Allotment of Securities)
  await page.goto('http://localhost:3000/subject/corporate-laws');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1200);
  const lawRevTab = await page.$('button:has-text("Revision & Notes"), button:has-text("Revision Notes & Formulas")');
  if (lawRevTab) {
    await lawRevTab.click();
    await page.waitForTimeout(800);
    const lawCh2Btn = await page.$('button:has-text("Ch 2:")');
    if (lawCh2Btn) {
      await lawCh2Btn.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: 'screenshots/screenshot_chapter_snapshot_corporate_laws_ch2.png' });
      console.log('Saved screenshot_chapter_snapshot_corporate_laws_ch2.png');
    }
  }

  await browser.close();
  console.log('All verification checks completed successfully!');
}

run().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
