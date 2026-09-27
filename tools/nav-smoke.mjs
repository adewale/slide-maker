#!/usr/bin/env node
// nav-smoke.mjs — the navigation smoke from LESSONS_LEARNED #18.
//
// Slidev 52.16.0 broke hash navigation on subdirectory deploys: paging produced
// `#/slide-maker/slide-maker/2`, navigation jammed and reloads 404'd. deck-lint, style
// audit and a static build all passed it, and it escaped to GitHub Pages. This smoke
// pages through a BUILT deck served under the same subdirectory base Pages uses, with
// GitHub-Pages-like static serving (no SPA fallback: unknown paths are 404):
//
//   1. load <base>/<deck>/#/1                       HTTP 200, route #/1
//   2. press ArrowRight until 3 slides have passed  every step is #/N?clicks=C+1 or #/N+1
//   3. open the reached slide as a deep link        HTTP 200, route #/N
//   4. reload it                                    HTTP 200, route #/N
//
// Usage:
//   node tools/nav-smoke.mjs <site-dir> --base /slide-maker --deck slide-maker [--deck reference]
//        [--slides 3]
//   node tools/nav-smoke.mjs examples/_build --base /slide-maker --all   # every built deck
//   node tools/nav-smoke.mjs --url https://adewale.github.io/slide-maker --deck slide-maker
//
// <site-dir> is the directory that is published at <base> (e.g. examples/_build, which
// Pages serves at /slide-maker/). Exit 0 = pass, 1 = navigation failure, 2 = usage or
// infrastructure error (missing build, browser failed to launch).

import { createServer } from 'node:http';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { expectRoute, formatRoute, gotoSlide, pressNext } from './slidev-nav.mjs';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.txt': 'text/plain' };
const MAX_PRESSES_PER_SLIDE = 40;

function parseArgs(argv) {
  const o = { site: null, url: null, base: '', decks: [], all: false, slides: 3 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--url') o.url = argv[++i].replace(/\/$/, '');
    else if (a === '--base') o.base = argv[++i].replace(/\/$/, '');
    else if (a === '--deck') o.decks.push(argv[++i]);
    else if (a === '--all') o.all = true;
    else if (a === '--slides') o.slides = Number(argv[++i]);
    else if (a === '-h' || a === '--help') o.help = true;
    else if (!o.site) o.site = a;
  }
  return o;
}

// Static server with GitHub Pages semantics under a base prefix.
function servePages(root, base) {
  return new Promise((res) => {
    const server = createServer((req, resp) => {
      const path = decodeURIComponent(req.url.split('?')[0]);
      const notFound = () => {
        const page = join(root, '404.html');
        resp.writeHead(404, { 'content-type': 'text/html' });
        resp.end(existsSync(page) ? readFileSync(page) : 'not found');
      };
      if (base && path !== base && !path.startsWith(`${base}/`)) return notFound();
      let fp = join(root, path.slice(base.length));
      try {
        if (statSync(fp).isDirectory()) {
          if (!path.endsWith('/')) { resp.writeHead(301, { location: `${path}/` }); return resp.end(); }
          fp = join(fp, 'index.html');
        }
      } catch { return notFound(); }
      if (!existsSync(fp)) return notFound();
      resp.writeHead(200, { 'content-type': MIME[extname(fp)] || 'application/octet-stream' });
      resp.end(readFileSync(fp));
    });
    server.listen(0, '127.0.0.1', () => res(server));
  });
}

async function smokeDeck(browser, deckUrl, slidesToPage) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  try {
    await gotoSlide(page, deckUrl, 1);
    console.log(`  ✓ ${deckUrl}/#/1 loads, route #/1`);

    let slide = 1;
    for (let k = 0; k < slidesToPage; k++) {
      let route = { slide, clicks: 0 };
      for (let presses = 0; route.slide === slide; presses++) {
        if (presses >= MAX_PRESSES_PER_SLIDE) throw new Error(`still on slide ${slide} after ${presses} ArrowRight presses`);
        route = await pressNext(page);
      }
      slide = route.slide;
      console.log(`  ✓ ArrowRight reaches ${formatRoute(route)}`);
    }

    const deep = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    try {
      await gotoSlide(deep, deckUrl, slide);
      console.log(`  ✓ deep link ${deckUrl}/#/${slide} opens on #/${slide}`);
      const response = await deep.reload({ waitUntil: 'domcontentloaded' });
      if (response && !response.ok()) throw new Error(`reload of #/${slide} returned HTTP ${response.status()}`);
      await expectRoute(deep, slide, { clicks: 0 });
      console.log(`  ✓ reload keeps #/${slide}`);
    } finally {
      await deep.close();
    }
  } finally {
    await page.close();
  }
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (o.all && o.site) {
    // Every subdirectory holding a built Slidev deck (index.html + assets/).
    const root = resolve(o.site);
    o.decks.push(...readdirSync(root, { withFileTypes: true })
      .filter((e) => e.isDirectory() && existsSync(join(root, e.name, 'index.html')) && existsSync(join(root, e.name, 'assets')))
      .map((e) => e.name).sort());
  }
  if (o.help || (!o.site && !o.url) || o.decks.length === 0 || !(o.slides >= 1)) {
    console.log('usage: node tools/nav-smoke.mjs <site-dir> --base /slide-maker (--deck NAME [--deck NAME] | --all) [--slides 3]');
    console.log('       node tools/nav-smoke.mjs --url https://host/base --deck NAME');
    process.exit(o.help ? 0 : 2);
  }

  let origin = o.url, server = null;
  if (!origin) {
    const root = resolve(o.site);
    for (const deck of o.decks) {
      if (!existsSync(join(root, deck, 'index.html'))) {
        console.error(`nav-smoke: no ${join(root, deck, 'index.html')}; build the deck first`);
        process.exit(2);
      }
    }
    server = await servePages(root, o.base);
    origin = `http://127.0.0.1:${server.address().port}${o.base}`;
  }

  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    console.error(`nav-smoke: could not launch Chromium: ${e.message.split('\n')[0]}`);
    server?.close();
    process.exit(2);
  }

  let failed = 0;
  for (const deck of o.decks) {
    const deckUrl = `${origin}/${deck}`;
    console.log(`nav-smoke: ${deck} (${deckUrl}/)`);
    try {
      await smokeDeck(browser, deckUrl, o.slides);
    } catch (e) {
      failed++;
      console.error(`  ✗ ${deck}: ${e.message}`);
    }
  }
  await browser.close();
  server?.close();
  console.log(failed ? `nav-smoke: ${failed}/${o.decks.length} deck(s) failed` : `nav-smoke: ${o.decks.length} deck(s) navigate correctly`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(`nav-smoke: ${e.stack || e.message}`); process.exit(2); });
