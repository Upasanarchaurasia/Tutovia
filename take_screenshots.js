import http from 'http';
import fs from 'fs';
import path from 'path';
import express from 'express';
import { chromium } from 'playwright';

const app = express();
const PORT = 3000;
const distPath = path.resolve('./dist');

// Proxy /api to backend server running on port 5000
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

// Serve static frontend files
app.use(express.static(distPath));

// SPA fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(PORT, async () => {
  console.log(`Frontend preview running on http://localhost:${PORT}`);

  const artifactDir = 'C:\\Users\\Nidhi Chaurasia\\.gemini\\antigravity\\brain\\146ef669-f69a-49d0-b247-8585e131f2b8';
  const projectScreenshotsDir = path.resolve('./screenshots');
  if (!fs.existsSync(projectScreenshotsDir)) fs.mkdirSync(projectScreenshotsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });

  try {
    // ----------------------------------------------------
    // SCREENSHOT 1: Signup Page with Mobile Number Field
    // ----------------------------------------------------
    console.log('[1/3] Navigating to Signup Page...');
    const page1 = await context.newPage();
    await page1.goto(`http://localhost:${PORT}/login`, { waitUntil: 'networkidle' });
    await page1.waitForTimeout(600);
    
    // Explicitly click the bottom toggle button: "Sign Up"
    const toggleToSignUp = page1.locator('p:has-text("Don\'t have an account?") button, button:has-text("Sign Up")').last();
    if (await toggleToSignUp.isVisible()) {
      await toggleToSignUp.click();
      await page1.waitForTimeout(600);
    }

    // Fill in demo data
    const nameInput = page1.locator('input[placeholder*="Upasana"], input[type="text"]').first();
    if (await nameInput.isVisible()) await nameInput.fill('Upasana Chaurasia');

    const phoneInput = page1.locator('input[type="tel"]');
    if (await phoneInput.isVisible()) await phoneInput.fill('+91 98765 43210');

    const emailInput = page1.locator('input[type="email"]');
    if (await emailInput.isVisible()) await emailInput.fill('upasana.ca@tutovia.com');

    const passInput = page1.locator('input[type="password"]');
    if (await passInput.isVisible()) await passInput.fill('Tutovia@2026');

    await page1.waitForTimeout(600);

    const shot1Artifact = path.join(artifactDir, 'screenshot_signup.png');
    const shot1Project = path.join(projectScreenshotsDir, 'screenshot_signup.png');
    await page1.screenshot({ path: shot1Artifact, fullPage: true });
    await page1.screenshot({ path: shot1Project, fullPage: true });
    console.log('✅ Captured Signup Screenshot:', shot1Artifact);
    await page1.close();

    // ----------------------------------------------------
    // SCREENSHOT 2: Flashcards Page with Progress & Reviews
    // ----------------------------------------------------
    console.log('[2/3] Navigating to Flashcards Page...');
    const page2 = await context.newPage();

    // Pre-populate login in localStorage
    await page2.addInitScript(() => {
      localStorage.setItem('tutovia_user', JSON.stringify({
        id: 'u1',
        name: 'Upasana',
        email: 'Chaurasiaupasana70@gmail.com',
        phone: '+91 98765 43210'
      }));
      localStorage.setItem('tutovia_profile_u1', JSON.stringify({
        id: 'u1',
        name: 'Upasana',
        ca_group: 'Both Groups',
        ca_stage: 'intermediate',
        attempt: 'May 2027',
        phone: '+91 98765 43210'
      }));
      localStorage.setItem('tutovia_onboarded_u1', 'true');
      localStorage.setItem('tutovia_onboarded', 'true');
      localStorage.setItem('tutovia_cloud_sync_prompt_dismissed', 'true');
      localStorage.setItem('tutovia_cloud_sync_enabled', 'false');
    });

    await page2.goto(`http://localhost:${PORT}/flashcards`, { waitUntil: 'networkidle' });
    await page2.waitForTimeout(1000);

    // If any modal appeared, dismiss it
    const dismissModal = page2.locator('button:has-text("Keep Local Only"), button:has-text("Maybe Later")').first();
    if (await dismissModal.isVisible()) {
      await dismissModal.click();
      await page2.waitForTimeout(500);
    }

    const shot2Artifact = path.join(artifactDir, 'screenshot_flashcards.png');
    const shot2Project = path.join(projectScreenshotsDir, 'screenshot_flashcards.png');
    await page2.screenshot({ path: shot2Artifact, fullPage: true });
    await page2.screenshot({ path: shot2Project, fullPage: true });
    console.log('✅ Captured Flashcards Screenshot:', shot2Artifact);
    await page2.close();

    // ----------------------------------------------------
    // SCREENSHOT 3: AI Tutor Chatbot Working (Groq Qwen)
    // ----------------------------------------------------
    console.log('[3/3] Navigating to Dashboard and Opening AI Tutor...');
    const page3 = await context.newPage();
    await page3.addInitScript(() => {
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
      localStorage.setItem('tutovia_cloud_sync_enabled', 'false');
    });

    await page3.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    await page3.waitForTimeout(1000);

    // If any modal appeared, dismiss it
    const dismissBtn = page3.locator('button:has-text("Maybe Later"), button:has-text("Skip"), button:has-text("Close")').first();
    if (await dismissBtn.isVisible()) {
      await dismissBtn.click();
      await page3.waitForTimeout(500);
    }

    // Open Tutor Chat
    const tutorTrigger = page3.locator('button:has-text("AI Tutor"), button[title*="Tutor"], button:has-text("Ask Tutor")').first();
    if (await tutorTrigger.isVisible()) {
      await tutorTrigger.click();
    } else {
      const floatingBtn = page3.locator('button:has(.lucide-sparkles), button:has(.lucide-bot)').first();
      if (await floatingBtn.isVisible()) await floatingBtn.click();
    }
    await page3.waitForTimeout(1000);

    // Type query into tutor chat input
    const chatInput = page3.locator('input[placeholder*="Ask"], textarea[placeholder*="Ask"]').first();
    if (await chatInput.isVisible()) {
      await chatInput.fill('Explain AS 2 Inventory Valuation rules in 3 bullet points for CA Intermediate exam.');
      await chatInput.press('Enter');

      // Wait for AI response to finish streaming/typing
      console.log('Waiting for AI Tutor response from Groq...');
      await page3.waitForTimeout(5000);
    }

    const shot3Artifact = path.join(artifactDir, 'screenshot_ai_tutor.png');
    const shot3Project = path.join(projectScreenshotsDir, 'screenshot_ai_tutor.png');
    await page3.screenshot({ path: shot3Artifact, fullPage: true });
    await page3.screenshot({ path: shot3Project, fullPage: true });
    console.log('✅ Captured AI Tutor Screenshot:', shot3Artifact);
    await page3.close();

    console.log('🎉 All 3 screenshots captured successfully!');
  } catch (err) {
    console.error('Error taking screenshots:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
