import { chromium } from 'playwright';

async function testAll() {
  const browser = await chromium.launch({ headless: true });
  
  const setupPage = async (url) => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => {
      const user = { id: 'u1', name: 'Upasana', email: 'chaurasiaupasana70@gmail.com' };
      const prof = { id: 'u1', name: 'Upasana', ca_group: 'Both Groups', ca_stage: 'intermediate', is_onboarded: true, attempt: 'January 2027' };
      localStorage.setItem('tutovia_user', JSON.stringify(user));
      localStorage.setItem('tutovia_profile_u1', JSON.stringify(prof));
      localStorage.setItem('tutovia_profile', JSON.stringify(prof));
      localStorage.setItem('tutovia_onboarded_u1', 'true');
      localStorage.setItem('tutovia_onboarded', 'true');
    });
    return page;
  };

  const routes = ['/', '/subject/advanced-accounting', '/exams', '/flashcards', '/wellness', '/news', '/community', '/profile', '/analytics', '/pyq', '/tutor'];

  const pageLocal = await setupPage('http://localhost:3000');
  const pageRemote = await setupPage('http://161.118.173.142');

  for (const r of routes) {
    const localErrors = [];
    const remoteErrors = [];
    pageLocal.on('pageerror', e => localErrors.push(e.message));
    pageRemote.on('pageerror', e => remoteErrors.push(e.message));

    await pageLocal.goto('http://localhost:3000' + r, { waitUntil: 'networkidle' }).catch(e => localErrors.push(e.message));
    await pageRemote.goto('http://161.118.173.142' + r, { waitUntil: 'networkidle' }).catch(e => remoteErrors.push(e.message));
    await pageLocal.waitForTimeout(600);
    await pageRemote.waitForTimeout(600);

    const localText = (await pageLocal.locator('main').innerText().catch(() => '')).slice(0, 100).replace(/\n/g, ' ');
    const remoteText = (await pageRemote.locator('main').innerText().catch(() => '')).slice(0, 100).replace(/\n/g, ' ');

    console.log(`Route [${r}]:`);
    console.log(`  Local (${localText.length} chars, errs: ${localErrors.length}): ${localText}`);
    console.log(`  Remote (${remoteText.length} chars, errs: ${remoteErrors.length}): ${remoteText}`);
  }

  await browser.close();
}

testAll().catch(console.error);
