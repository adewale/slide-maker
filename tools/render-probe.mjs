#!/usr/bin/env node
// render-probe.mjs — fast pre-flight check for render-gate's assumptions.
//
// Run this BEFORE refactoring tools/render-gate.mjs. It exercises the same
// primitives (static server, goto, slide-count probe, screenshot, DOM eval)
// with strict per-check budgets, so the failure modes that turned out to
// matter this session surface in seconds instead of timing out a full gate
// run for minutes:
//
//   • Does 127.0.0.1 accept the local server? (proved blocked for slidev's
//     dev port earlier; static http server is fine.)
//   • Does goto with domcontentloaded return quickly? (networkidle stalls
//     forever on decks pulling Google Fonts / image backgrounds.)
//   • Does the slide-count probe return a sane number? (/#/999 does NOT
//     redirect on Slidev 52+ — the loop would iterate 999 times.)
//   • Does samplePage serialize through page.evaluate with the {w,h} arg?
//     (The fault line of the template-string → function refactor.)
//
// Usage:
//   node tools/render-probe.mjs <built-dist-dir>
//   npm run render-probe -- <built-dist-dir>
//
// Exits 0 only if every check passes within its budget.

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { chromium } from 'playwright';

const C = { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m', magenta: '\x1b[35m' };
const CHECK = `${C.green}✓${C.reset}`, CROSS = `${C.red}✗${C.reset}`;

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

async function timed(label, budgetMs, fn) {
  const start = Date.now();
  try {
    const result = await Promise.race([
      fn(),
      new Promise((_, rej) => setTimeout(() => rej(new Error(`exceeded ${budgetMs}ms budget`)), budgetMs)),
    ]);
    return { label, ok: true, ms: Date.now() - start, detail: result };
  } catch (e) {
    return { label, ok: false, ms: Date.now() - start, detail: e.message };
  }
}

// Mirrors render-gate's samplePage shape (function form, {w,h} arg). If a
// future refactor breaks the arg threading or the page.evaluate serialisation,
// this probe surfaces it in milliseconds instead of letting it cascade.
function samplePage(vp) {
  const root = document.querySelector('.slidev-layout') || document.body;
  return { vw: vp.w, vh: vp.h, hasLayout: !!document.querySelector('.slidev-layout'), elementCount: root.querySelectorAll('*').length };
}

function printResults(results) {
  for (const r of results) {
    const sym = r.ok ? CHECK : CROSS;
    const dur = `${C.dim}${String(r.ms).padStart(5)}ms${C.reset}`;
    console.log(`  ${sym} ${dur}  ${r.label}  ${C.dim}— ${r.detail}${C.reset}`);
  }
}

async function cleanup(state) {
  try { if (state.page) await state.page.close(); } catch {}
  try { if (state.browser) await state.browser.close(); } catch {}
  try { if (state.server) state.server.close(); } catch {}
}

async function main() {
  const arg = process.argv[2];
  if (!arg || ['-h', '--help'].includes(arg)) {
    console.log('usage: node tools/render-probe.mjs <built-dist-dir>');
    console.log('  Fast pre-flight checks for render-gate assumptions (target: <30s).');
    console.log('  Run before refactoring render-gate.mjs.');
    process.exit(arg ? 0 : 2);
  }
  const dist = resolve(arg);
  if (!existsSync(join(dist, 'index.html'))) {
    console.error(`${C.red}no index.html in ${dist} — build the deck first${C.reset}`);
    process.exit(2);
  }

  console.log(`${C.bold}${C.magenta}render-probe${C.reset}  ${C.dim}${dist}${C.reset}\n`);
  const state = {};
  const results = [];

  // 1. Static server boots + 127.0.0.1 reachable
  const sv = await timed('static server boots + 127.0.0.1 reachable', 5000, async () => {
    const h = await serveStatic(dist);
    state.server = h.server;
    const r = await fetch(`http://127.0.0.1:${h.port}/index.html`);
    if (!r.ok) throw new Error(`fetch returned ${r.status}`);
    return `port ${h.port}`;
  });
  results.push(sv);
  if (!sv.ok) { printResults(results); await cleanup(state); process.exit(1); }
  const baseUrl = `http://127.0.0.1:${sv.detail.match(/\d+/)[0]}`;

  // 2. Chromium launches
  const br = await timed('chromium launches', 10000, async () => {
    state.browser = await chromium.launch();
    state.page = await state.browser.newPage({ viewport: { width: 1280, height: 720 } });
    return 'ok';
  });
  results.push(br);
  if (!br.ok) { printResults(results); await cleanup(state); process.exit(1); }

  // 3. goto /#/1 with domcontentloaded returns under budget. networkidle would
  //    stall here on any deck loading external Google Fonts / image backgrounds.
  const g = await timed('goto /#/1 with domcontentloaded', 8000, async () => {
    await state.page.goto(`${baseUrl}/#/1`, { waitUntil: 'domcontentloaded', timeout: 6000 });
    await state.page.waitForTimeout(800);
    return 'reached';
  });
  results.push(g);

  // 4. Slide-count probe returns a sane number. The old /#/999 trick assumed
  //    Slidev redirects to the last slide — it does not on Slidev 52+.
  const count = await timed('slide-count via footer "N / total"', 3000, async () => {
    const c = await state.page.evaluate(() => {
      const m = document.body.innerText.match(/(\d+)\s*\/\s*(\d+)/);
      return m ? parseInt(m[2], 10) : null;
    });
    if (c === null) throw new Error('no "N / total" footer — render-gate would over-count or fail');
    if (c > 200) throw new Error(`count=${c} is implausibly high (likely a 999-style probe bug)`);
    return `${c} slides`;
  });
  results.push(count);

  // 5. One screenshot succeeds
  const ss = await timed('screenshot one slide', 5000, async () => {
    const path = join(tmpdir(), `render-probe-${process.pid}.png`);
    await state.page.screenshot({ path });
    return path;
  });
  results.push(ss);

  // 6. samplePage threads {w,h} through page.evaluate and returns expected shape.
  //    Catches the template-string → function refactor breaking serialisation.
  const ev = await timed('page.evaluate(samplePage, {w,h}) shape', 3000, async () => {
    const r = await state.page.evaluate(samplePage, { w: 1280, h: 720 });
    if (r.vw !== 1280 || r.vh !== 720) throw new Error('vw/vh did not thread from arg');
    if (typeof r.elementCount !== 'number') throw new Error('unexpected return shape');
    return `vw/vh threaded; ${r.elementCount} elements`;
  });
  results.push(ev);

  await cleanup(state);
  printResults(results);

  const allOk = results.every(r => r.ok);
  const total = results.reduce((s, r) => s + r.ms, 0);
  console.log('');
  console.log(allOk
    ? `  ${CHECK} ${C.green}render-gate assumptions hold for this deck (${total}ms total)${C.reset}`
    : `  ${CROSS} ${C.red}render-gate would break or stall on this deck — fix the failing assumption first${C.reset}`);
  process.exit(allOk ? 0 : 1);
}

main().catch(e => { console.error(`${C.red}${e.stack || e.message}${C.reset}`); process.exit(2); });
