const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser to test Study Material...');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

  // 1. Visit Study Material page
  console.log('Navigating to http://localhost/study-material');
  await page.goto('http://localhost/study-material', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Take screenshot of main catalog
  await page.screenshot({ path: '/home/ubuntu/tutovia/screenshot_catalog_verified.png' });
  console.log('Catalog screenshot saved: screenshot_catalog_verified.png');

  // 2. Search for AS 7 Construction Contracts
  console.log('Typing "AS 7" into search input...');
  const searchInput = await page.$('input[placeholder*="Search by chapter"]');
  if (searchInput) {
    await searchInput.fill('AS 7');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/home/ubuntu/tutovia/screenshot_as7_search_verified.png' });
    console.log('AS 7 search screenshot saved: screenshot_as7_search_verified.png');

    // Click on "View Chapter PDF" or "View PDF"
    const viewBtn = await page.$('button:has-text("View Chapter PDF"), button:has-text("View PDF")');
    if (viewBtn) {
      console.log('Clicking View PDF button...');
      await viewBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: '/home/ubuntu/tutovia/screenshot_as7_modal_verified.png' });
      console.log('Modal screenshot saved: screenshot_as7_modal_verified.png');
    }
  }

  await browser.close();
  console.log('Verification finished successfully!');
})();
