import http from 'http';
import express from 'express';
import { chromium } from 'playwright';
import path from 'path';

async function main() {
  const app = express();
  const PORT = 3000;
  const distPath = path.resolve('./dist');

  app.use('/api', (req, res) => {
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: req.originalUrl,
      method: req.method,
      headers: req.headers
    };
    delete options.headers.host;

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.status(502).json({ error: 'Backend proxy error', details: err.message });
    });

    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
  });

  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));

  const server = app.listen(PORT);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 850 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('tutovia_user', JSON.stringify({ id: 'u1', name: 'Upasana', email: 'Chaurasiaupasana70@gmail.com' }));
    localStorage.setItem('tutovia_profile_u1', JSON.stringify({ id: 'u1', name: 'Upasana', ca_group: 'Both Groups', ca_stage: 'intermediate' }));
    localStorage.setItem('tutovia_onboarded_u1', 'true');
    localStorage.setItem('tutovia_onboarded', 'true');
    localStorage.setItem('tutovia_cloud_sync_prompt_dismissed', 'true');
    localStorage.setItem('tutovia_cloud_sync_enabled', 'false');
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const tutorTrigger = page.locator('button:has-text("Ask AI Tutor")').first();
  if (await tutorTrigger.isVisible()) await tutorTrigger.click();
  await page.waitForTimeout(600);

  const chatInput = page.locator('input[placeholder*="Ask"], textarea[placeholder*="Ask"]').first();
  if (await chatInput.isVisible()) {
    await chatInput.fill('What is Section 135 CSR threshold and expenditure under Companies Act 2013?');
    await chatInput.press('Enter');
    console.log('Waiting for AI Tutor reply...');
    await page.waitForTimeout(4500);
  }

  const tutorPanel = page.locator('aside, [role="dialog"], div.fixed.right-0, div.fixed.inset-y-0.right-0').first();
  const target = (await tutorPanel.isVisible()) ? tutorPanel : page;

  const artifactDir = 'C:\\Users\\Nidhi Chaurasia\\.gemini\\antigravity\\brain\\146ef669-f69a-49d0-b247-8585e131f2b8';
  await target.screenshot({ path: path.join(artifactDir, 'screenshot_ai_tutor_focus.png') });
  await target.screenshot({ path: './screenshots/screenshot_ai_tutor_focus.png' });
  console.log('✅ Captured focused AI Tutor screenshot!');

  await browser.close();
  server.close();
  process.exit(0);
}

main().catch(console.error);
