const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:3000/login');
  await page.evaluate(() => {
    localStorage.setItem('tutovia_auth', JSON.stringify({ id: 'dummy', name: 'Student' }));
  });
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(3000);
  await browser.close();
})();
