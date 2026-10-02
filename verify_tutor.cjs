const { chromium } = require('/home/ubuntu/tutovia/node_modules/playwright');

async function run() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('http://127.0.0.1/tutor', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('Page Title:', await page.title());
  console.log('Heading:', await page.locator('h1, h2').allInnerTexts());
  console.log('Console Errors:', errors);

  // Take screenshot of welcome screen
  await page.screenshot({ path: '/home/ubuntu/tutor_welcome.png', fullPage: false });
  console.log('Welcome screenshot saved.');

  // Click 'Explain a concept' prompt
  const conceptBtn = page.locator('button:has-text("Explain a concept")').first();
  if (await conceptBtn.isVisible()) {
    console.log('Clicking Explain a concept prompt...');
    await conceptBtn.click();
    await page.waitForTimeout(6500); // Wait for AI response
    await page.screenshot({ path: '/home/ubuntu/tutor_chat_active.png', fullPage: false });
    console.log('Active chat screenshot saved.');
  }

  await browser.close();
}

run().catch(console.error);
