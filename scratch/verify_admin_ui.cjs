const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost/admin...');
  await page.goto('http://localhost/admin', { waitUntil: 'networkidle' });

  // If unlock screen is present
  const unlockInput = await page.$('input[placeholder*="admin password"]');
  if (unlockInput) {
    console.log('Admin unlock screen detected. Entering master key...');
    await unlockInput.fill('tutovia@admin2026');
    await page.click('button:has-text("Unlock Admin Portal")');
    await page.waitForTimeout(2000);
  }

  console.log('Taking screenshot of Admin Overview...');
  await page.screenshot({ path: '/home/ubuntu/tutovia/admin_overview.png', fullPage: true });

  console.log('Switching to Active Students / Users tab...');
  const usersTabBtn = await page.waitForSelector('button:has-text("Active Students"), button:has-text("Users")');
  await usersTabBtn.click();
  await page.waitForTimeout(2000);

  console.log('Taking screenshot of Users tab...');
  await page.screenshot({ path: '/home/ubuntu/tutovia/admin_users.png', fullPage: true });

  console.log('Opening Dossier modal for first student...');
  const dossierBtn = await page.waitForSelector('button:has-text("Dossier")');
  await dossierBtn.click();
  await page.waitForTimeout(1500);

  console.log('Taking screenshot of Student Dossier Modal...');
  await page.screenshot({ path: '/home/ubuntu/tutovia/admin_dossier.png' });

  console.log('Verification screenshots captured successfully!');
  await browser.close();
})().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
