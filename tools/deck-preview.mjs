#!/usr/bin/env node

// deck-preview.mjs — Headless screenshot tool for Slidev decks
//
// Usage:  ./deck-preview.mjs <deck-name>
// Example: ./deck-preview.mjs cloudflare
//
// Starts a lightweight SPA-aware HTTP server, uses Playwright to capture
// every slide (including all v-click states), and generates a contact sheet.

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TOOLS_DIR = import.meta.dirname;
const EXAMPLES_DIR = join(TOOLS_DIR, '..', 'examples');
const BUILD_DIR = join(EXAMPLES_DIR, '_build');
const PREVIEW_DIR = join(TOOLS_DIR, '..', '_preview');
const VIEWPORT = { width: 1280, height: 720 };
const NAV_WAIT_MS = 2000;
const VCLICK_PAUSE_MS = 200;
const MAX_VCLICKS = 40;
const MAX_PROBE_SLIDES = 80;

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const deckName = process.argv[2];
if (!deckName) {
  console.error('Usage: deck-preview.mjs <deck-name>');
  console.error('Example: deck-preview.mjs cloudflare');
  process.exit(1);
}

const deckBuildDir = join(BUILD_DIR, deckName);
try {
  const s = await stat(deckBuildDir);
  if (!s.isDirectory()) throw new Error();
} catch {
  console.error(`Error: build directory not found: ${deckBuildDir}`);
  console.error('Run build.sh first to build the deck.');
  process.exit(1);
}

const outDir = join(PREVIEW_DIR, deckName);
await mkdir(outDir, { recursive: true });

// ---------------------------------------------------------------------------
// SPA-aware static file server
// ---------------------------------------------------------------------------

const MIME_TYPES = {
  '.html':  'text/html',
  '.css':   'text/css',
  '.js':    'application/javascript',
  '.mjs':   'application/javascript',
  '.json':  'application/json',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.gif':   'image/gif',
  '.svg':   'image/svg+xml',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':   'font/ttf',
  '.otf':   'font/otf',
  '.ico':   'image/x-icon',
  '.webp':  'image/webp',
  '.wasm':  'application/wasm',
};

async function tryReadFile(filePath) {
  try {
    return await readFile(filePath);
  } catch {
    return null;
  }
}

function startSpaServer() {
  const server = createServer(async (req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    const filePath = join(BUILD_DIR, urlPath);
    const ext = extname(filePath);

    // 1. Try serving the exact file
    const data = await tryReadFile(filePath);
    if (data) {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(data);
      return;
    }

    // 2. If path has a file extension and wasn't found, it's a genuine 404
    if (ext) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    // 3. SPA fallback: walk up the path tree and serve the nearest index.html
    const segments = urlPath.split('/').filter(Boolean);
    for (let i = segments.length; i >= 1; i--) {
      const candidate = join(BUILD_DIR, ...segments.slice(0, i), 'index.html');
      const fallbackData = await tryReadFile(candidate);
      if (fallbackData) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fallbackData);
        return;
      }
    }

    // 4. Last resort: root index.html
    const rootIndex = await tryReadFile(join(BUILD_DIR, 'index.html'));
    if (rootIndex) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(rootIndex);
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  });

  return new Promise((resolve) => {
    // Listen on port 0 to get a random available port
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      console.log(`SPA server listening on http://127.0.0.1:${port}`);
      resolve({ server, port });
    });
  });
}

// ---------------------------------------------------------------------------
// Slide count detection
// ---------------------------------------------------------------------------

async function detectSlideCount(page, baseUrl) {
  // Strategy 1: Read the "N / M" text indicator from the nav
  await page.goto(`${baseUrl}/1`, { waitUntil: 'networkidle', timeout: 20_000 });
  await page.waitForTimeout(NAV_WAIT_MS);

  const countFromNav = await page.evaluate(() => {
    const text = document.body.innerText;
    const match = text.match(/\d+\s*\/\s*(\d+)/);
    if (match) return parseInt(match[1], 10);

    // Try Slidev's internal nav object
    try {
      const nav = /** @type {any} */ (window).__slidev__?.nav;
      if (nav?.total) return nav.total;
    } catch { /* ignore */ }

    return 0;
  });

  if (countFromNav > 0) {
    console.log(`Detected ${countFromNav} slides from nav indicator.`);
    return countFromNav;
  }

  // Strategy 2: Probe slides sequentially by checking for .slidev-layout
  console.log('Nav indicator not found, probing slides sequentially...');
  let count = 0;
  for (let i = 1; i <= MAX_PROBE_SLIDES; i++) {
    try {
      await page.goto(`${baseUrl}/${i}`, { waitUntil: 'networkidle', timeout: 10_000 });
      await page.waitForTimeout(800);
      const hasLayout = await page.evaluate(() => {
        return document.querySelector('.slidev-layout') !== null;
      });
      if (!hasLayout && i > 1) break;
      count = i;
    } catch {
      break;
    }
  }
  console.log(`Probed ${count} slides.`);
  return count;
}

// ---------------------------------------------------------------------------
// Screenshot capture
// ---------------------------------------------------------------------------

async function captureSlides(page, baseUrl, totalSlides) {
  const screenshots = [];

  for (let i = 1; i <= totalSlides; i++) {
    const slideUrl = `${baseUrl}/${i}`;
    await page.goto(slideUrl, { waitUntil: 'networkidle', timeout: 15_000 });
    await page.waitForTimeout(NAV_WAIT_MS);

    // Advance through all v-clicks on this slide
    for (let c = 0; c < MAX_VCLICKS; c++) {
      const beforeHtml = await page.evaluate(() => document.body.innerHTML.length);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(VCLICK_PAUSE_MS);

      // Check if we navigated away to a different slide
      const currentUrl = page.url();
      const currentPath = new URL(currentUrl).pathname.replace(/\/$/, '');
      const expectedPath = `/${deckName}/${i}`;
      if (currentPath !== expectedPath) {
        // We overshot — go back to this slide (fully clicked-through state lost,
        // but that's the last state before navigation, so go back and break)
        await page.goto(slideUrl, { waitUntil: 'networkidle', timeout: 10_000 });
        await page.waitForTimeout(500);
        // Re-advance all v-clicks we had before (up to c)
        for (let r = 0; r < c; r++) {
          await page.keyboard.press('ArrowDown');
          await page.waitForTimeout(100);
        }
        break;
      }

      const afterHtml = await page.evaluate(() => document.body.innerHTML.length);
      if (beforeHtml === afterHtml) break; // No change — all clicks exhausted
    }

    // Hide nav controls for a clean screenshot
    await page.evaluate(() => {
      const selectors = [
        '.slidev-nav',
        '.slidev-icon-btn',
        '[class*="nav-control"]',
        '.slidev-controls',
        '.slidev-progress',
      ];
      for (const sel of selectors) {
        for (const el of document.querySelectorAll(sel)) {
          /** @type {HTMLElement} */ (el).style.opacity = '0';
          /** @type {HTMLElement} */ (el).style.pointerEvents = 'none';
        }
      }
    });

    const filename = `slide-${String(i).padStart(2, '0')}.png`;
    const filepath = join(outDir, filename);
    await page.screenshot({ path: filepath });
    screenshots.push(filename);
    process.stdout.write(`  Captured ${filename}  (${i}/${totalSlides})\r`);
  }
  console.log(); // Clear the carriage-return line
  return screenshots;
}

// ---------------------------------------------------------------------------
// Contact sheet HTML generation
// ---------------------------------------------------------------------------

function generateContactSheet(screenshots) {
  const cards = screenshots.map((file, idx) => {
    const num = idx + 1;
    return `    <figure>
      <img src="${file}" alt="Slide ${num}" loading="lazy">
      <figcaption>Slide ${num}</figcaption>
    </figure>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Preview: ${deckName} (${screenshots.length} slides)</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0e0e0e;
      color: #ccc;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
    }
    h1 {
      text-align: center;
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .meta {
      text-align: center;
      color: #666;
      font-size: 0.8rem;
      margin-bottom: 2rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }
    figure {
      background: #1a1a1a;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #292929;
      transition: border-color 0.2s;
    }
    figure:hover { border-color: #555; }
    figure img {
      width: 100%;
      display: block;
    }
    figcaption {
      padding: 0.4rem 0.75rem;
      font-size: 0.75rem;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>${deckName}</h1>
  <div class="meta">${screenshots.length} slides &mdash; ${new Date().toISOString().slice(0, 10)}</div>
  <div class="grid">
${cards}
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log(`\nDeck preview: ${deckName}`);
console.log(`Build dir:    ${deckBuildDir}`);
console.log(`Output dir:   ${outDir}\n`);

const { server, port } = await startSpaServer();
const baseUrl = `http://127.0.0.1:${port}/${deckName}`;

let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  // Detect total slide count
  const totalSlides = await detectSlideCount(page, baseUrl);
  if (totalSlides === 0) {
    console.error('Error: could not detect any slides.');
    process.exit(1);
  }

  // Capture screenshots
  console.log(`\nCapturing ${totalSlides} slides at ${VIEWPORT.width}x${VIEWPORT.height}...`);
  const screenshots = await captureSlides(page, baseUrl, totalSlides);

  // Generate contact sheet
  const contactSheetHtml = generateContactSheet(screenshots);
  const contactSheetPath = join(outDir, 'index.html');
  await writeFile(contactSheetPath, contactSheetHtml);

  // Summary
  console.log(`\n--- Summary ---`);
  console.log(`  ${screenshots.length} slides captured`);
  console.log(`  Screenshots: ${outDir}/`);
  console.log(`  Contact sheet: ${contactSheetPath}`);
  console.log(`\n  open ${contactSheetPath}\n`);

  await context.close();
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
} finally {
  if (browser) await browser.close();
  server.close();
}
