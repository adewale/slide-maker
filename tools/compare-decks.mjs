import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname } from 'path';

const REFERENCE_URL = 'https://agents-deck.giftegwuenu.com';
const LOCAL_PORT = 3987;
const LOCAL_DECK = process.argv[2] || 'slide-maker';
const LOCAL_URL = `http://localhost:${LOCAL_PORT}/${LOCAL_DECK}`;
const TOOLS_DIR = import.meta.dirname;
const BUILD_DIR = join(TOOLS_DIR, '..', 'examples', '_build');
const OUT_DIR = join(TOOLS_DIR, '..', '_compare');
const VIEWPORT = { width: 1280, height: 720 };
const WAIT_MS = 2000;

mkdirSync(join(OUT_DIR, 'reference'), { recursive: true });
mkdirSync(join(OUT_DIR, 'local'), { recursive: true });

// SPA-aware static server: serves index.html for any path without an extension
function startSpaServer() {
  const MIME = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  };

  const server = createServer(async (req, res) => {
    let filePath = join(BUILD_DIR, decodeURIComponent(req.url.split('?')[0]));
    try {
      const data = await readFile(filePath);
      const ext = extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    } catch {
      // SPA fallback: find the nearest index.html up the path
      const parts = filePath.replace(BUILD_DIR, '').split('/').filter(Boolean);
      // e.g. /cloudflare/3 -> serve /cloudflare/index.html
      for (let i = parts.length; i >= 1; i--) {
        const candidate = join(BUILD_DIR, ...parts.slice(0, i), 'index.html');
        try {
          const data = await readFile(candidate);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
          return;
        } catch { /* try parent */ }
      }
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise(resolve => {
    server.listen(LOCAL_PORT, () => {
      console.log(`SPA server on http://localhost:${LOCAL_PORT}`);
      resolve(server);
    });
  });
}

async function getSlideCount(page, baseUrl) {
  // Navigate to slide 1 and read the total from the Slidev nav "N / M" indicator
  await page.goto(`${baseUrl}/1`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(WAIT_MS);

  const total = await page.evaluate(() => {
    // Slidev renders something like "1 / 45" in the nav area
    const body = document.body.innerText;
    const match = body.match(/\d+\s*\/\s*(\d+)/);
    if (match) return parseInt(match[1], 10);

    // Try __slidev__ global
    try {
      const nav = (window).__slidev__?.nav;
      if (nav?.total) return nav.total;
    } catch {}

    return 0;
  });

  return total;
}

async function screenshotDeck(browser, baseUrl, label) {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  console.log(`\n--- ${label} (${baseUrl}) ---`);

  const total = await getSlideCount(page, baseUrl);
  if (total === 0) {
    console.log('  Could not detect slide count, probing...');
    // Fallback: probe sequentially
    let count = 0;
    for (let i = 1; i <= 60; i++) {
      await page.goto(`${baseUrl}/${i}`, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(800);
      // Check if slide content loaded (not blank/error)
      const hasContent = await page.evaluate(() => {
        return document.querySelector('.slidev-layout') !== null;
      });
      if (!hasContent && i > 1) break;
      count = i;
    }
    console.log(`  Probed ${count} slides`);
    await screenshotSlides(page, baseUrl, label, count);
    await context.close();
    return count;
  }

  console.log(`  ${total} slides detected`);
  await screenshotSlides(page, baseUrl, label, total);
  await context.close();
  return total;
}

async function screenshotSlides(page, baseUrl, label, total) {
  for (let i = 1; i <= total; i++) {
    await page.goto(`${baseUrl}/${i}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(WAIT_MS);

    // Click through all v-clicks to reveal full content
    for (let c = 0; c < 20; c++) {
      const before = await page.evaluate(() => document.body.innerHTML.length);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(150);
      const after = await page.evaluate(() => document.body.innerHTML.length);
      // If pressing down didn't change anything, we've revealed everything
      // but also check if we navigated to next slide
      const currentUrl = page.url();
      if (currentUrl !== `${baseUrl}/${i}` && !currentUrl.endsWith(`/${i}`)) {
        // We navigated away, go back
        await page.goto(`${baseUrl}/${i}`, { waitUntil: 'networkidle', timeout: 10000 });
        await page.waitForTimeout(500);
        break;
      }
      if (before === after) break;
    }

    // Hide Slidev nav controls for clean screenshots
    await page.evaluate(() => {
      const selectors = [
        '.slidev-nav',
        '.slidev-icon-btn',
        '[class*="nav-control"]',
        '.slidev-controls',
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.opacity = '0';
        });
      });
    });

    const filename = `slide-${String(i).padStart(2, '0')}.png`;
    await page.screenshot({ path: join(OUT_DIR, label, filename) });
    process.stdout.write(`  ${filename}\r`);
  }
  console.log(`  Done (${total} screenshots)`);
}

function generateReport(refCount, localCount) {
  const max = Math.max(refCount, localCount);
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Deck Comparison: Reference vs Local</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #111; color: #eee; font-family: system-ui, sans-serif; padding: 2rem; }
    h1 { text-align: center; margin-bottom: 0.5rem; font-size: 1.5rem; }
    .subtitle { text-align: center; color: #888; margin-bottom: 2rem; font-size: 0.85rem; }
    .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; align-items: start; }
    .pair img { width: 100%; border-radius: 8px; border: 1px solid #333; }
    .label { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.25rem; }
    .slide-num { font-size: 0.85rem; color: #666; text-align: center; margin-bottom: 0.5rem; }
    .empty { display: flex; align-items: center; justify-content: center; aspect-ratio: 16/9; background: #1a1a1a; border-radius: 8px; border: 1px solid #333; color: #444; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>Deck Comparison</h1>
  <div class="subtitle">Reference (agents-deck.giftegwuenu.com &mdash; ${refCount} slides) vs Local (${LOCAL_DECK} &mdash; ${localCount} slides) &mdash; ${new Date().toISOString().slice(0, 10)}</div>
`;

  for (let i = 1; i <= max; i++) {
    const num = String(i).padStart(2, '0');
    html += `  <div class="slide-num">Slide ${i}</div>\n  <div class="pair">\n`;
    html += `    <div><div class="label">Reference</div>`;
    if (i <= refCount) {
      html += `<img src="reference/slide-${num}.png" alt="Reference slide ${i}">`;
    } else {
      html += `<div class="empty">No slide</div>`;
    }
    html += `</div>\n`;
    html += `    <div><div class="label">Local</div>`;
    if (i <= localCount) {
      html += `<img src="local/slide-${num}.png" alt="Local slide ${i}">`;
    } else {
      html += `<div class="empty">No slide</div>`;
    }
    html += `</div>\n  </div>\n`;
  }

  html += `</body>\n</html>`;
  writeFileSync(join(OUT_DIR, 'index.html'), html);
  console.log(`\nReport: ${join(OUT_DIR, 'index.html')}`);
}

// Main
const server = await startSpaServer();
const browser = await chromium.launch();

try {
  const refCount = await screenshotDeck(browser, REFERENCE_URL, 'reference');
  const localCount = await screenshotDeck(browser, LOCAL_URL, 'local');
  generateReport(refCount, localCount);
  console.log(`\nDone. Open _compare/index.html to compare.`);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
} finally {
  await browser.close();
  server.close();
}
