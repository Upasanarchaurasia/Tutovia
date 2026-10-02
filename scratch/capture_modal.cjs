const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

  await page.goto('http://localhost/study-material', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Search AS 7
  const searchInput = await page.$('input[placeholder*="Search by chapter"]');
  if (searchInput) {
    await searchInput.fill('AS 7');
    await page.waitForTimeout(1000);

    // Find the first View button
    const viewButtons = await page.$$('button:has-text("View")');
    console.log(`Found ${viewButtons.length} view buttons`);
    if (viewButtons.length > 0) {
      await viewButtons[0].click();
      console.log('Clicked View button on AS 7!');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: '/home/ubuntu/tutovia/screenshot_as7_modal_live.png' });
      console.log('Saved screenshot_as7_modal_live.png');
    }
  }

  await browser.close();
})();
