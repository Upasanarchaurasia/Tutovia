const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Set localStorage to simulate logged-in user
  await page.goto('http://localhost:3000/login');
  await page.evaluate(() => {
    localStorage.setItem('tutovia_auth', JSON.stringify({ id: 'dummy', name: 'Student' }));
  });
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'dashboard_screenshot.png', fullPage: true });
  await browser.close();
})();
