// Page-space boxes (CSS px at 1920x1080) of the elements the video highlights,
// measured on the same states the captures show. Writes src/boxes.json.
const { chromium } = require(process.env.PLAYWRIGHT);
const fs = require('node:fs');
const path = require('node:path');
const APP = process.env.APP || 'http://localhost:3099';
const INPUT = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'capture-input.json'), 'utf8'));
const box = async (loc) => { const b = await loc.first().boundingBox(); return b && { x: b.x, y: b.y, w: b.width, h: b.height }; };
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await ctx.addInitScript((persona) => {
    localStorage.setItem('cv-data', JSON.stringify(persona));
    localStorage.setItem('ai-config', JSON.stringify({ provider: 'ollama', baseUrl: 'http://localhost:11434', model: 'gemma2:9b', systemPrompt: '' }));
  }, INPUT.persona);
  const page = await ctx.newPage();
  await page.goto(`${APP}/editor`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const out = {};
  out.importButton = await box(page.locator('button', { hasText: /^\s*Import\s*$/ }));
  out.personalCard = await box(page.locator('div', { hasText: /^Personal Information/ }).locator('xpath=ancestor::div[contains(@class,"rounded")][1]'));
  out.toolbar = await box(page.locator('select, [role=combobox]').filter({ hasText: /A4/ }));
  out.printButton = await box(page.locator('button[title="Print / PDF"]'));
  out.exportButton = await box(page.locator('button[title="Export CV"]'));
  // the AI step, scrolled the way the capture scrolls it
  await page.locator('button', { hasText: 'AI Enhance' }).first().click();
  await page.waitForTimeout(1200);
  await page.locator('button', { hasText: /^\s*Connect\s*$/ }).first().click();
  await page.waitForTimeout(3000);
  await page.locator('textarea').first().fill(INPUT.job);
  const gen = page.locator('button', { hasText: /Generate Optimized CV/ }).first();
  await gen.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  out.jobBox = await box(page.locator('textarea'));
  out.generateButton = await box(gen);
  // the summary paragraph in the preview page
  out.previewSummary = await page.evaluate(() => {
    const h = [...document.querySelectorAll('body *')].find((e) => e.children.length === 0 && /professional summary/i.test(e.textContent || '') && e.getBoundingClientRect().x > 900);
    if (!h) return null;
    const p = h.parentElement.nextElementSibling || h.nextElementSibling || h.parentElement;
    const a = h.getBoundingClientRect(); const b = p.getBoundingClientRect();
    return { x: Math.min(a.x, b.x), y: a.y, w: Math.max(a.width, b.width), h: b.bottom - a.y };
  });
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'boxes.json'), JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify(out));
  await browser.close();
})();
