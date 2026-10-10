// Captures of the real app for the video, driven through its own storage so
// every shot is reproducible. The person is fictional (src/persona.ts); the
// app's "Load Sample Data" (the author's own CV) is not used.
//
// Needs the app running (APP, default http://localhost:3099) and, for the AI
// section, a local Ollama with the model in AI_MODEL (default gemma2:9b).
// Usage: PLAYWRIGHT=<playwright-core> CHROME=<headless shell> node scripts/capture-app.cjs [data|design|ai|ai-go|panels]
const { chromium } = require(process.env.PLAYWRIGHT);
const fs = require('node:fs');
const path = require('node:path');

const APP = process.env.APP || 'http://localhost:3099';
const MODEL = process.env.AI_MODEL || 'gemma2:9b';
const OUT = path.join(__dirname, '..', 'public', 'cv');
const INPUT = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'capture-input.json'), 'utf8'));
const only = process.argv.slice(2);
const want = (k) => only.length === 0 || only.includes(k);

const MONTAGE = {
  templates: ['minimal', 'professional', 'modern', 'creative', 'swiss', 'harvard', 'startup', 'elegant'],
  palettes: ['default', 'ocean', 'forest', 'sunset', 'grape', 'rose', 'teal', 'charcoal'],
  layouts: ['single', 'sidebar-left', 'sidebar-right', 'two-column'],
};

async function context(browser, storage = {}, dpr = 2) {
  // English UI everywhere (the history shows relative times in the browser's locale).
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: dpr, locale: 'en-US', timezoneId: 'America/Los_Angeles' });
  await ctx.addInitScript(([persona, model, extra]) => {
    localStorage.setItem('cv-data', JSON.stringify(persona));
    localStorage.setItem('ai-config', JSON.stringify({ provider: 'ollama', baseUrl: 'http://localhost:11434', model, systemPrompt: '' }));
    for (const [k, v] of Object.entries(extra)) localStorage.setItem(k, v);
    // The dev-server badge is not part of the app.
    const hide = () => { const s = document.createElement('style'); s.textContent = 'nextjs-portal{display:none!important}'; document.head.appendChild(s); };
    if (document.head) hide(); else document.addEventListener('DOMContentLoaded', hide);
  }, [INPUT.persona, MODEL, storage]);
  return ctx;
}

async function open(ctx) {
  const page = await ctx.newPage();
  await page.goto(`${APP}/editor`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(2500);
  return page;
}

/** The first CV page in the preview: the white box with an A4 proportion holding the name. */
async function pageBox(page) {
  return page.evaluate(() => {
    const hit = [...document.querySelectorAll('body *')].find((e) => e.children.length === 0 && /Alex Rivera/.test(e.textContent || '') && e.getBoundingClientRect().x > 900);
    let el = hit;
    while (el && el.parentElement) {
      const r = el.getBoundingClientRect();
      if (r.width > 300 && r.height / r.width > 1.3 && r.height / r.width < 1.5) return { x: r.x, y: r.y, width: r.width, height: r.height };
      el = el.parentElement;
    }
    return null;
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME });
  const boxes = {};

  if (want('data')) {
    const ctx = await context(browser);
    const page = await open(ctx);
    await page.screenshot({ path: path.join(OUT, 'data.png') });
    await page.getByText('JSON', { exact: true }).first().click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(OUT, 'json.png') });
    await ctx.close();
    console.log('data: data.png json.png');
  }

  if (want('design')) {
    const shots = [];
    for (const [kind, ids] of Object.entries(process.env.SKIP_MONTAGE ? {} : MONTAGE)) {
      for (const id of ids) {
        const storage = { 'cv-template-id': kind === 'templates' ? id : 'modern', 'cv-palette-id': kind === 'palettes' ? id : 'default', 'cv-layout-id': kind === 'layouts' ? id : 'single' };
        if (kind === 'layouts') storage['cv-template-id'] = 'modern';
        const ctx = await context(browser, storage);
        const page = await open(ctx);
        const box = await pageBox(page);
        const file = `${kind.slice(0, -1)}-${id}.png`;
        if (box) await page.screenshot({ path: path.join(OUT, file), clip: box });
        shots.push(file);
        await ctx.close();
      }
    }
    const ctx = await context(browser, { 'cv-template-id': 'modern' });
    const page = await open(ctx);
    await page.locator('button', { hasText: 'Design & Export' }).first().click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT, 'design.png') });
    await ctx.close();
    console.log('design:', shots.length, 'page shots + design.png');
  }

  // The AI panel connected and the job pasted, up to the Generate button.
  // `ai-go` alone retakes these two shots without running the model.
  async function aiReady(page) {
    await page.locator('button', { hasText: 'AI Enhance' }).first().click();
    await page.waitForTimeout(1200);
    // The provider panel needs a Connect before Generate unlocks.
    await page.locator('button', { hasText: /^\s*Connect\s*$/ }).first().click();
    await page.waitForTimeout(3000);
    await page.locator('textarea').first().fill(INPUT.job);
    // The "Models loaded" toast belongs to the Connect, not to this shot.
    for (let i = 0; i < 40 && (await page.locator('[data-sonner-toast]').count()) > 0; i++) await page.waitForTimeout(250);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, 'ai-ready.png') });
    const gen = page.locator('button', { hasText: /Generate Optimized CV/ }).first();
    await gen.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, 'ai-go.png') });
    return gen;
  }

  if (only.includes('ai-go')) {
    const ctx = await context(browser, {}, 1.5);
    await aiReady(await open(ctx));
    await ctx.close();
    console.log('ai-go: ai-ready.png ai-go.png');
  }

  if (want('ai')) {
    // DPR 1.5 JPEGs: a frame every 1.5 s while the model writes.
    const ctx = await context(browser, {}, 1.5);
    const page = await open(ctx);
    const gen = await aiReady(page);
    const t0 = Date.now();
    await gen.click();
    let n = 0;
    for (;;) {
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(OUT, `ai-${String(n++).padStart(3, '0')}.jpg`), type: 'jpeg', quality: 80 });
      const busy = (await page.locator('button', { hasText: /Generating/ }).count()) > 0;
      if ((!busy && n > 3) || Date.now() - t0 > 300000) break;
    }
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT, 'ai-done.png') });
    console.log(`ai: ${n} frames in ${Math.round((Date.now() - t0) / 1000)} s`);
    boxes.aiSeconds = Math.round((Date.now() - t0) / 1000);
    boxes.aiFrames = n;
    // The version the run produced, as the app stored it, for the before/after.
    // Read straight off the preview: exactly the text the shot shows.
    const shown = await page.evaluate(() => {
      const hit = [...document.querySelectorAll('body *')].find((e) => e.children.length === 0 && /Alex Rivera/.test(e.textContent || '') && e.getBoundingClientRect().x > 900);
      let el = hit;
      while (el && el.parentElement) {
        const r = el.getBoundingClientRect();
        if (r.width > 300 && r.height / r.width > 1.3) break;
        el = el.parentElement;
      }
      return el ? el.innerText : '';
    });
    fs.writeFileSync(path.join(__dirname, '..', 'src', 'generated.json'), JSON.stringify({ job: INPUT.job, previewText: shown }, null, 2) + '\n');
    // The result waits to be reviewed: the "Ready to apply" card.
    const ready = page.locator('text=Ready to apply').first();
    if (await ready.count()) {
      await ready.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT, 'ai-review.png') });
      const apply = page.locator('button', { hasText: 'Apply to Editor' }).first();
      const ab = await apply.boundingBox();
      const cb = await page.locator('text=CV Generated!').first().locator('xpath=ancestor::div[contains(@class,"rounded")][1]').boundingBox();
      boxes.applyButton = ab && { x: ab.x, y: ab.y, w: ab.width, h: ab.height };
      boxes.readyCard = cb && { x: cb.x, y: cb.y, w: cb.width, h: cb.height };
      // Apply, then adjust by hand: the last sentence of the new summary goes.
      await apply.click();
      await page.waitForTimeout(1500);
      const summary = page.locator('textarea').first();
      await summary.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      const sel = await summary.evaluate((el) => {
        const v = el.value;
        const cut = Math.max(v.lastIndexOf('. ', v.length - 3) + 2, 0);
        el.focus();
        el.setSelectionRange(cut, v.length);
        return { cut, len: v.length, removed: v.slice(cut) };
      });
      await page.waitForTimeout(300);
      const tb = await summary.boundingBox();
      boxes.summaryBox = tb && { x: tb.x, y: tb.y, w: tb.width, h: tb.height };
      boxes.removedSentence = sel.removed;
      await page.screenshot({ path: path.join(OUT, 'edit-selected.png') });
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT, 'edit-done.png') });
    }
    // The history the run just added.
    const hist = page.locator('button').filter({ has: page.locator('svg.lucide-history') }).first();
    if (await hist.count()) { await hist.click(); await page.waitForTimeout(1200); await page.screenshot({ path: path.join(OUT, 'history.png') }); }
    await ctx.close();
  }

  if (want('panels')) {
    const ctx = await context(browser);
    const page = await open(ctx);
    // Your record in and out: the Import menu, then the menu with Export as JSON.
    await page.locator('button', { hasText: /^\s*Import\s*$/ }).first().click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, 'import-menu.png') });
    const jsonItem = await page.locator('[role=menuitem]', { hasText: 'JSON File' }).first().boundingBox();
    boxes.importJson = jsonItem && { x: jsonItem.x, y: jsonItem.y, w: jsonItem.width, h: jsonItem.height };
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    await page.locator('button').filter({ has: page.locator('svg.lucide-ellipsis, svg.lucide-more-horizontal') }).first().click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, 'export-menu.png') });
    const exportItem = await page.locator('[role=menuitem]', { hasText: 'Export as JSON' }).first().boundingBox();
    boxes.exportJson = exportItem && { x: exportItem.x, y: exportItem.y, w: exportItem.width, h: exportItem.height };
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const db = page.locator('button').filter({ has: page.locator('svg.lucide-database') }).first();
    if (await db.count()) { await db.click(); await page.waitForTimeout(1500); await page.screenshot({ path: path.join(OUT, 'storage.png') }); }
    await ctx.close();
    console.log('panels: storage.png');
  }

  if (Object.keys(boxes).length) {
    const metaPath = path.join(__dirname, '..', 'src', 'capture-meta.json');
    const prev = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')) : {};
    fs.writeFileSync(metaPath, JSON.stringify({ ...prev, ...boxes }, null, 2) + '\n');
  }
  await browser.close();
})();
