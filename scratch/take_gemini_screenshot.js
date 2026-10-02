import http from 'http';
import fs from 'fs';
import path from 'path';
import express from 'express';
import { chromium } from 'playwright';

const app = express();
const PORT = 3001;
const distPath = path.resolve('./dist');

app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(PORT, async () => {
  console.log(`Preview server running on http://localhost:${PORT}`);

  const artifactDir = 'C:\\Users\\Nidhi Chaurasia\\.gemini\\antigravity\\brain\\82394e1b-06e4-44f1-b4a5-976c4e9c79f7';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2
  });

  try {
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('tutovia_user', JSON.stringify({
        id: 'u1',
        name: 'Upasana',
        email: 'Chaurasiaupasana70@gmail.com'
      }));
      localStorage.setItem('tutovia_profile_u1', JSON.stringify({
        id: 'u1',
        name: 'Upasana',
        ca_group: 'Both Groups',
        ca_stage: 'intermediate'
      }));
      localStorage.setItem('tutovia_onboarded_u1', 'true');
      localStorage.setItem('tutovia_onboarded', 'true');
      localStorage.setItem('tutovia_cloud_sync_prompt_dismissed', 'true');
    });

    console.log('Navigating to Gemini Voices page...');
    await page.goto(`http://localhost:${PORT}/gemini-voices`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const shotPath = path.join(artifactDir, 'screenshot_gemini_voices.png');
    await page.screenshot({ path: shotPath, fullPage: true });
    console.log('✅ Screenshot captured successfully:', shotPath);
  } catch (err) {
    console.error('Error taking screenshot:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
