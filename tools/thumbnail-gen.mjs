#!/usr/bin/env node
// thumbnail-gen.mjs — screenshot a built deck's cover for the gallery.
//
// Usage:
//   node tools/thumbnail-gen.mjs <built-dist-dir> <output-png>
//
// Designed for the build pipeline (tools/build.py): after `slidev build`
// produces examples/_build/<deck>/, this tool serves it, renders slide 1 at
// 1280x720, and writes thumb.png. The gallery's _card_html() picks it up via
// the relative './<deck>/thumb.png' path.

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, extname, dirname } from 'node:path';
import { chromium } from 'playwright';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };

function serveStatic(root) {
  return new Promise((res) => {
    const server = createServer((req, resp) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      let fp = join(root, p);
      try { if (statSync(fp).isDirectory()) fp = join(fp, 'index.html'); } catch {}
      if (!existsSync(fp)) fp = join(root, 'index.html');
      try { resp.writeHead(200, { 'content-type': MIME[extname(fp)] || 'application/octet-stream' }); resp.end(readFileSync(fp)); }
      catch { resp.writeHead(404); resp.end(); }
    });
    server.listen(0, '127.0.0.1', () => res({ server, port: server.address().port }));
  });
}

async function main() {
  const [dist, outPath] = process.argv.slice(2);
  if (!dist || !outPath || ['-h', '--help'].includes(dist)) {
    console.log('usage: node tools/thumbnail-gen.mjs <built-dist-dir> <output-png>');
    process.exit(dist === '-h' || dist === '--help' ? 0 : 2);
  }
  const distAbs = resolve(dist);
  if (!existsSync(join(distAbs, 'index.html'))) {
    console.error(`no index.html in ${distAbs} — build the deck first`);
    process.exit(2);
  }

  const { server, port } = await serveStatic(distAbs);
  const browser = await chromium.launch();
  let exitCode = 0;
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    // domcontentloaded + a settle delay — networkidle stalls forever on decks
    // pulling Google Fonts / image backgrounds; lesson learned the hard way.
    await page.goto(`http://127.0.0.1:${port}/#/1`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: resolve(outPath) });
    console.log(`thumbnail → ${outPath}`);
  } catch (e) {
    console.error(`thumbnail-gen failed: ${e.message}`);
    exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
  process.exit(exitCode);
}

main().catch(e => { console.error(e.stack || e.message); process.exit(2); });
