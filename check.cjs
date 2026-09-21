const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.error('Browser Error:', msg.text());
  });
  
  page.on('pageerror', err => {
    console.error('Page Error:', err.message);
  });
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000); // Wait for React to mount
  const content = await page.content();
  if (!content.includes('Tutovia')) {
      console.log('App might be blank! Content snippet:', content.substring(0, 500));
  } else {
      console.log('App loaded fine!');
  }
  await browser.close();
})();
