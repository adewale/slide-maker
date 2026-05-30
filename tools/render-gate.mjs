#!/usr/bin/env node
// render-gate.mjs — the RENDERED gate. deck-lint reads Markdown + tokens; this
// measures what actually reaches the screen (Lesson 9: measure the artifact, not
// the source). It serves a built deck, drives a browser over every slide, and
// checks three things the static gate structurally cannot see:
//
//   1. flash-bang   — per-slide screen luminance from screenshots; flags a dark
//                     slide cutting to a bright one even when the darkness comes
//                     from a background IMAGE or gradient (not a flat token).
//   2. contrast     — actual rendered text colour vs its effective background
//                     (WCAG AA), catching card/image backgrounds tokens miss.
//   3. overflow     — elements whose rendered box spills past the slide viewport.
//
// Viewports: defaults to desktop 1280x720. Pass --viewport WxH[:label]
// (repeatable) or the --mobile shortcut to also check mobile sizes — the deck
// system ships a distinct MobileScrollView under 640px portrait, so desktop-only
// rendering misses the layout users on phones actually see.
//
// Usage:
//   node tools/render-gate.mjs <built-dist-dir> [--name N] [--threshold 0.5]
//                                               [--viewport WxH[:label]] [--mobile]
//                                               [--json p]
//   node tools/render-gate.mjs --url http://localhost:3030 [...]   # already serving
//
// Exits non-zero if any flash-bang / contrast / overflow violation is found
// on any viewport.

import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join, resolve, extname, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const C = { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', magenta: '\x1b[35m', cyan: '\x1b[36m' };
const CHECK = `${C.green}✓${C.reset}`, CROSS = `${C.red}✗${C.reset}`, DOT = `${C.yellow}○${C.reset}`;
const FLASHBANG_DELTA = 0.5; // matches deck-lint + pixel-audit

const DESKTOP_VP = { w: 1280, h: 720, label: 'desktop' };
// Mirrors the three sizes already used in screenshot-audit.mjs.
const MOBILE_VPS = [
  { w: 375, h: 667, label: 'iphone-se' },
  { w: 412, h: 915, label: 'pixel-7' },
  { w: 667, h: 375, label: 'iphone-se-landscape' },
];

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };

function serveStatic(root) {
  return new Promise((res) => {
    const server = createServer((req, resp) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      let fp = join(root, p);
      try { if (statSync(fp).isDirectory()) fp = join(fp, 'index.html'); } catch {}
      if (!existsSync(fp)) fp = join(root, 'index.html'); // SPA fallback
      try {
        const body = readFileSync(fp);
        resp.writeHead(200, { 'content-type': MIME[extname(fp)] || 'application/octet-stream' });
        resp.end(body);
      } catch { resp.writeHead(404); resp.end('not found'); }
    });
    server.listen(0, '127.0.0.1', () => res({ server, port: server.address().port }));
  });
}

// ── screenshot luminance (flash-bang) ──────────────────────────────────
function srgbToLinear(c) { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }
function pngLuminance(png) {
  const total = png.width * png.height, step = Math.max(1, Math.floor(total / 20000));
  let sum = 0, n = 0;
  for (let p = 0; p < total; p += step) {
    const i = p * 4; if (png.data[i + 3] === 0) continue;
    sum += 0.2126 * srgbToLinear(png.data[i]) + 0.7152 * srgbToLinear(png.data[i + 1]) + 0.0722 * srgbToLinear(png.data[i + 2]); n++;
  }
  return n ? sum / n : 0.5;
}

// ── in-page DOM sampling: rendered contrast + overflow ─────────────────
// Runs inside the browser. Resolves each text element's effective background by
// walking ancestors, computes WCAG contrast, and flags boxes past the viewport.
// Takes the active viewport so the overflow check tracks the page size we set.
function samplePage(vp) {
  const lin = c => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  const relLum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const parse = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); return { rgb: [p[0], p[1], p[2]], a: p[3] === undefined ? 1 : p[3] }; };
  const effBg = el => { let n = el; while (n) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0.1) return c.rgb; n = n.parentElement; } return [255, 255, 255]; };
  const ratio = (a, b) => { const l1 = relLum(a), l2 = relLum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); };
  const root = document.querySelector('.slidev-layout') || document.body;
  const vw = vp.w, vh = vp.h;
  const contrast = [], overflow = [];
  const texts = root.querySelectorAll('h1,h2,h3,h4,p,li,span,strong,em,td,th,a,blockquote,code');
  for (const el of texts) {
    if (el.closest('.slidev-vclick-hidden')) continue;
    const txt = (el.textContent || '').trim(); if (!txt) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.5) continue;
    const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
    const fg = parse(cs.color); if (!fg) continue;
    const size = parseFloat(cs.fontSize), bold = (parseInt(cs.fontWeight) || 400) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const cr = ratio(fg.rgb, effBg(el));
    const min = large ? 3.0 : 4.5;
    if (cr < min) contrast.push({ text: txt.slice(0, 40), ratio: +cr.toFixed(2), need: min, size: Math.round(size) });
  }
  for (const el of root.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const over = Math.max(0, r.right - vw, r.bottom - vh, -r.left, -r.top);
    if (over > 4 && getComputedStyle(el).overflow === 'visible') {
      const tag = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '');
      overflow.push({ el: tag, px: Math.round(over) });
    }
  }
  const oMap = new Map();
  for (const o of overflow) if (!oMap.has(o.el) || oMap.get(o.el).px < o.px) oMap.set(o.el, o);
  return { contrast: contrast.slice(0, 8), overflow: [...oMap.values()].slice(0, 6) };
}

function parseViewport(spec) {
  const [size, label] = spec.split(':');
  const m = size.match(/^(\d+)x(\d+)$/i);
  if (!m) throw new Error(`bad --viewport "${spec}", want WxH[:label]`);
  return { w: parseInt(m[1], 10), h: parseInt(m[2], 10), label: label || `${m[1]}x${m[2]}` };
}

function parseArgs(argv) {
  const o = { dist: null, url: null, name: null, threshold: FLASHBANG_DELTA, json: null, viewports: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--url') o.url = argv[++i];
    else if (a === '--name') o.name = argv[++i];
    else if (a === '--threshold') o.threshold = Number(argv[++i]);
    else if (a === '--json') o.json = argv[++i];
    else if (a === '--viewport') o.viewports.push(parseViewport(argv[++i]));
    else if (a === '--mobile') o.viewports.push(...MOBILE_VPS);
    else if (a === '-h' || a === '--help') o.help = true;
    else if (!o.dist) o.dist = a;
  }
  if (o.viewports.length === 0) o.viewports = [DESKTOP_VP];
  return o;
}

async function runOnViewport(browser, baseUrl, vp, threshold, shotRoot) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto(`${baseUrl}/#/999`, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(800);
  const count = await page.evaluate(() => { const m = location.hash.match(/#\/(\d+)/); return m ? parseInt(m[1], 10) : 1; });

  const shotDir = join(shotRoot, vp.label);
  mkdirSync(shotDir, { recursive: true });

  const slides = [];
  for (let i = 1; i <= count; i++) {
    await page.goto(`${baseUrl}/#/${i}`, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(700);
    const shot = join(shotDir, `slide-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: shot });
    const lum = pngLuminance(PNG.sync.read(readFileSync(shot)));
    const dom = await page.evaluate(samplePage, { w: vp.w, h: vp.h }).catch(() => ({ contrast: [], overflow: [] }));
    slides.push({ i, lum, ...dom });
  }
  await page.close();

  const flashBangs = [], contrastFails = [], overflowFails = [];
  for (const s of slides) {
    const jump = s.i > 1 ? Math.abs(s.lum - slides[s.i - 2].lum) : 0;
    if (jump >= threshold) flashBangs.push({ from: s.i - 1, to: s.i, delta: jump });
    for (const c of s.contrast) contrastFails.push({ slide: s.i, ...c });
    for (const v of s.overflow) overflowFails.push({ slide: s.i, ...v });
  }
  return { viewport: vp, slides, flashBangs, contrastFails, overflowFails };
}

function printViewportSection(report, threshold) {
  const { viewport: vp, slides, flashBangs, contrastFails, overflowFails } = report;
  console.log(`\n${C.bold}[${vp.label} ${vp.w}x${vp.h}]${C.reset}`);
  for (const s of slides) {
    const jump = s.i > 1 ? Math.abs(s.lum - slides[s.i - 2].lum) : 0;
    const fb = jump >= threshold;
    const tags = [];
    if (fb) tags.push(`${C.red}↯ flash-bang +${jump.toFixed(2)}${C.reset}`);
    if (s.contrast.length) tags.push(`${C.yellow}${s.contrast.length} contrast${C.reset}`);
    if (s.overflow.length) tags.push(`${C.yellow}${s.overflow.length} overflow${C.reset}`);
    console.log(`  slide ${String(s.i).padStart(2)}  ${C.dim}luma ${s.lum.toFixed(3)}${C.reset}  ${tags.join('  ') || C.dim + 'ok' + C.reset}`);
  }
  const line = (label, arr, fmt) => {
    if (!arr.length) { console.log(`  ${CHECK} ${label}: clean`); return; }
    console.log(`  ${DOT} ${C.yellow}${label}: ${arr.length}${C.reset}`);
    for (const x of arr.slice(0, 8)) console.log(`     ${C.dim}${fmt(x)}${C.reset}`);
  };
  line('flash-bang', flashBangs, x => `slide ${x.from}→${x.to} Δ${x.delta.toFixed(2)}`);
  line('contrast (WCAG AA)', contrastFails, x => `slide ${x.slide}: "${x.text}" ${x.ratio}:1 (need ${x.need}:1, ${x.size}px)`);
  line('overflow', overflowFails, x => `slide ${x.slide}: ${x.el} +${x.px}px past viewport`);
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (o.help || (!o.dist && !o.url)) {
    console.log('usage: node tools/render-gate.mjs <built-dist-dir> [--name N] [--threshold 0.5]');
    console.log('         [--viewport WxH[:label]] [--mobile] [--json p]');
    console.log('       node tools/render-gate.mjs --url http://localhost:3030');
    process.exit(o.help ? 0 : 2);
  }

  let baseUrl = o.url, handle = null;
  if (!baseUrl) {
    const dist = resolve(o.dist);
    if (!existsSync(join(dist, 'index.html'))) { console.error(`${C.red}no index.html in ${dist} — build the deck first${C.reset}`); process.exit(2); }
    handle = await serveStatic(dist);
    baseUrl = `http://127.0.0.1:${handle.port}`;
  }
  const name = o.name || (o.dist ? basename(resolve(o.dist)) : 'deck');
  const shotRoot = join(tmpdir(), `render-gate-${process.pid}`);
  mkdirSync(shotRoot, { recursive: true });

  const vpLabels = o.viewports.map(v => `${v.label}(${v.w}x${v.h})`).join(', ');
  console.log(`${C.bold}${C.magenta}render-gate${C.reset}  ${C.dim}${name} @ ${baseUrl}  (flash-bang ≥ ${o.threshold}, viewports: ${vpLabels})${C.reset}`);

  const browser = await chromium.launch();
  const reports = [];
  for (const vp of o.viewports) reports.push(await runOnViewport(browser, baseUrl, vp, o.threshold, shotRoot));
  await browser.close();
  if (handle) handle.server.close();

  for (const rep of reports) printViewportSection(rep, o.threshold);

  const total = reports.reduce((s, r) => s + r.flashBangs.length + r.contrastFails.length + r.overflowFails.length, 0);
  console.log('');
  console.log(total
    ? `  ${CROSS} ${C.red}${total} rendered violation(s) across ${reports.length} viewport(s)${C.reset}`
    : `  ${CHECK} ${C.green}rendered clean across ${reports.length} viewport(s)${C.reset}`);

  if (o.json) {
    const out = resolve(o.json); mkdirSync(dirname(out), { recursive: true });
    const payload = {
      name, when: new Date().toISOString(), threshold: o.threshold,
      viewports: reports.map(r => ({
        label: r.viewport.label, w: r.viewport.w, h: r.viewport.h,
        slides: r.slides.map(s => ({ i: s.i, lum: s.lum })),
        flashBangs: r.flashBangs, contrastFails: r.contrastFails, overflowFails: r.overflowFails,
      })),
    };
    writeFileSync(out, JSON.stringify(payload, null, 2));
    console.log(`  ${C.dim}report → ${o.json}${C.reset}`);
  }
  process.exit(total ? 1 : 0);
}

main().catch(e => { console.error(`${C.red}${e.stack || e.message}${C.reset}`); process.exit(2); });

