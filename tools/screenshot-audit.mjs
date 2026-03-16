#!/usr/bin/env node

// screenshot-audit.mjs — Visual regression and contrast checker for Slidev decks
// Usage:  node screenshot-audit.mjs <base-url> [deck-name]
//         node screenshot-audit.mjs http://localhost:3000 reference
//
// Takes a screenshot of every slide, then analyses each for:
// 1. Black-rectangle Mermaid nodes (rendering failures)
// 2. Text that is likely unreadable (low contrast regions)
// 3. Slides that appear effectively empty (hidden v-click content)
// 4. Content that overflows the viewport
//
// Requires: playwright (npm install playwright)

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// ── Config ─────────────────────────────────────────────────────

const VIEWPORT = { width: 1280, height: 720 };
const WAIT_MS = 2000; // wait for Mermaid/animations
const OUT_DIR = '/tmp/slide-audit';

// ── Terminal colours ──────────────────────────────────────────

const isTTY = process.stdout.isTTY;
const C = isTTY
  ? { reset: '\x1b[0m', bold: '\x1b[1m', red: '\x1b[31m', green: '\x1b[32m',
      yellow: '\x1b[33m', cyan: '\x1b[36m', dim: '\x1b[2m', bgRed: '\x1b[41m',
      bgGreen: '\x1b[42m', bgYellow: '\x1b[43m', white: '\x1b[37m' }
  : Object.fromEntries(['reset','bold','red','green','yellow','cyan','dim','bgRed','bgGreen','bgYellow','white'].map(k=>[k,'']));

const CRIT = `${C.bgRed}${C.bold}${C.white} CRIT ${C.reset}`;
const WARN = `${C.bgYellow}${C.bold}${C.white} WARN ${C.reset}`;
const PASS = `${C.bgGreen}${C.bold}${C.white} PASS ${C.reset}`;
const INFO = `${C.cyan}INFO${C.reset}`;

// ── Pixel analysis helpers ────────────────────────────────────

/**
 * Analyse a screenshot buffer for visual issues.
 * Uses Playwright's page.evaluate to inspect the live DOM.
 */
async function analyseSlide(page, slideNum) {
  const issues = [];

  // 1. Check for black-rectangle Mermaid rendering failures
  //    Mermaid SVGs with nodes that have very dark fills and no visible text
  const mermaidIssues = await page.evaluate(() => {
    const problems = [];
    const svgs = document.querySelectorAll('.slidev-layout svg, .slidev-layout .mermaid');
    for (const svg of svgs) {
      const rects = svg.querySelectorAll('rect, circle, ellipse, polygon, path');
      let darkNodeCount = 0;
      let totalNodes = 0;
      for (const r of rects) {
        const style = getComputedStyle(r);
        const fill = style.fill || r.getAttribute('fill') || '';
        if (!fill || fill === 'none' || fill === 'transparent') continue;
        totalNodes++;
        // Check if fill is very dark (close to black)
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, 1, 1);
        const [r2, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const luminance = (0.299 * r2 + 0.587 * g + 0.114 * b) / 255;
        if (luminance < 0.1) darkNodeCount++;
      }
      if (totalNodes > 2 && darkNodeCount / totalNodes > 0.5) {
        problems.push(`${darkNodeCount}/${totalNodes} SVG shapes are near-black — likely Mermaid rendering failure`);
      }
    }
    return problems;
  });
  for (const m of mermaidIssues) {
    issues.push({ severity: 'CRITICAL', message: m });
  }

  // 2. Check for effectively empty slides (all content hidden by v-click)
  const contentCheck = await page.evaluate(() => {
    const layout = document.querySelector('.slidev-layout');
    if (!layout) return { empty: false, reason: '' };
    const text = layout.innerText?.trim() || '';
    // Count visible text characters (excluding just the title)
    const lines = text.split('\n').filter(l => l.trim());
    // Only count hidden v-click elements within the current slide's layout
    const hiddenInSlide = layout.querySelectorAll('.slidev-vclick-hidden').length;
    if (lines.length <= 1 && hiddenInSlide > 0) {
      return { empty: true, reason: `only title visible, ${hiddenInSlide} elements hidden behind v-click` };
    }
    return { empty: false, reason: '' };
  });
  if (contentCheck.empty) {
    issues.push({ severity: 'INFO', message: contentCheck.reason });
  }

  // 3. Check for text contrast issues by sampling text elements
  const contrastIssues = await page.evaluate(() => {
    const problems = [];

    function getLuminance(r, g, b) {
      const [rs, gs, bs] = [r, g, b].map(c => {
        const s = c / 255;
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function parseColor(str) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = str;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return { r, g, b, luminance: getLuminance(r, g, b) };
    }

    function contrastRatio(l1, l2) {
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    // Sample text elements
    const textEls = document.querySelectorAll('.slidev-layout h1, .slidev-layout h2, .slidev-layout h3, .slidev-layout p, .slidev-layout li, .slidev-layout span, .slidev-layout strong, .slidev-layout code');
    for (const el of textEls) {
      if (el.offsetWidth === 0 || el.offsetHeight === 0) continue;
      if (el.classList.contains('slidev-vclick-hidden')) continue;
      const text = el.innerText?.trim();
      if (!text || text.length < 2) continue;

      const style = getComputedStyle(el);
      const fg = parseColor(style.color);

      // Walk up to find the effective background
      let bgEl = el;
      let bg = null;
      while (bgEl) {
        const bgStyle = getComputedStyle(bgEl);
        const bgColor = bgStyle.backgroundColor;
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          bg = parseColor(bgColor);
          break;
        }
        bgEl = bgEl.parentElement;
      }
      if (!bg) continue; // transparent all the way up

      const ratio = contrastRatio(fg.luminance, bg.luminance);
      const fontSize = parseFloat(style.fontSize);
      const isBold = parseInt(style.fontWeight) >= 700;
      const isLarge = fontSize >= 24 || (fontSize >= 18.66 && isBold);
      const threshold = isLarge ? 3.0 : 4.5;

      if (ratio < threshold) {
        const snippet = text.slice(0, 40) + (text.length > 40 ? '...' : '');
        problems.push(`"${snippet}" — ${ratio.toFixed(1)}:1 (need ${threshold}:1, ${isLarge ? 'large' : 'body'} text)`);
      }
    }
    return problems;
  });
  for (const c of contrastIssues) {
    issues.push({ severity: 'WARN', message: c });
  }

  // 4. Check for content overflow (content extending beyond viewport)
  const overflow = await page.evaluate((vh) => {
    const layout = document.querySelector('.slidev-layout');
    if (!layout) return false;
    return layout.scrollHeight > vh + 10; // 10px tolerance
  }, VIEWPORT.height);
  if (overflow) {
    issues.push({ severity: 'WARN', message: 'content overflows viewport — needs split or reduction' });
  }

  return issues;
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node screenshot-audit.mjs <base-url> [deck-name]');
    console.error('  e.g. node screenshot-audit.mjs http://localhost:3000 reference');
    process.exit(1);
  }

  const baseUrl = args[0].replace(/\/$/, '');
  const deckName = args[1] || '';
  const deckUrl = deckName ? `${baseUrl}/${deckName}` : baseUrl;

  console.log(`${C.bold}${C.cyan}screenshot-audit${C.reset}  ${C.dim}Visual quality checker for Slidev decks${C.reset}`);
  console.log(`${C.dim}target: ${deckUrl}${C.reset}`);
  console.log('');

  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT });

  // Discover slide count by navigating to slide 1 and reading total
  await page.goto(`${deckUrl}/#/1`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1500);

  const totalSlides = await page.evaluate(() => {
    // Slidev exposes slide count in the nav
    const nav = document.querySelector('.slidev-nav-total, [class*="total"]');
    if (nav) return parseInt(nav.textContent);
    // Fallback: check the footer
    const footer = document.body.innerText.match(/\/ (\d+)/);
    if (footer) return parseInt(footer[1]);
    return 0;
  });

  if (!totalSlides) {
    console.error(`${C.red}Could not determine slide count. Is the server running?${C.reset}`);
    await browser.close();
    process.exit(1);
  }

  console.log(`${C.dim}scanning ${totalSlides} slides...${C.reset}`);
  console.log('');

  const results = [];
  let critCount = 0, warnCount = 0, infoCount = 0, passCount = 0;

  for (let i = 1; i <= totalSlides; i++) {
    await page.goto(`${deckUrl}/#/${i}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(WAIT_MS);

    // Screenshot
    const screenshotPath = join(OUT_DIR, `slide-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: screenshotPath });

    // Analyse
    const issues = await analyseSlide(page, i);
    results.push({ slide: i, issues, screenshot: screenshotPath });

    if (issues.length === 0) {
      passCount++;
      process.stdout.write(`${C.green}.${C.reset}`);
    } else {
      const hasCrit = issues.some(i => i.severity === 'CRITICAL');
      const hasWarn = issues.some(i => i.severity === 'WARN');
      if (hasCrit) { critCount++; process.stdout.write(`${C.red}X${C.reset}`); }
      else if (hasWarn) { warnCount++; process.stdout.write(`${C.yellow}!${C.reset}`); }
      else { infoCount++; process.stdout.write(`${C.cyan}i${C.reset}`); }
    }
  }

  console.log('');
  console.log('');

  // Print issues
  for (const r of results) {
    if (r.issues.length === 0) continue;
    const hasCrit = r.issues.some(i => i.severity === 'CRITICAL');
    const hasWarn = r.issues.some(i => i.severity === 'WARN');
    const badge = hasCrit ? CRIT : hasWarn ? WARN : INFO;
    console.log(`${badge} ${C.bold}slide ${r.slide}${C.reset}`);
    for (const issue of r.issues) {
      const icon = issue.severity === 'CRITICAL' ? `${C.red}\u2717` : issue.severity === 'WARN' ? `${C.yellow}\u25CB` : `${C.cyan}\u2022`;
      console.log(`  ${icon} ${issue.message}${C.reset}`);
    }
  }

  // Summary
  console.log('');
  console.log(`${C.bold}${'═'.repeat(50)}${C.reset}`);
  console.log(`${C.bold}Summary${C.reset}  ${totalSlides} slides scanned`);
  console.log('');
  if (passCount > 0) console.log(`  ${C.green}${C.bold}${passCount}${C.reset}${C.green} passing${C.reset}`);
  if (critCount > 0) console.log(`  ${C.red}${C.bold}${critCount}${C.reset}${C.red} critical${C.reset}`);
  if (warnCount > 0) console.log(`  ${C.yellow}${C.bold}${warnCount}${C.reset}${C.yellow} warnings${C.reset}`);
  if (infoCount > 0) console.log(`  ${C.cyan}${C.bold}${infoCount}${C.reset}${C.cyan} info${C.reset}`);
  console.log('');
  console.log(`${C.dim}Screenshots saved to ${OUT_DIR}/${C.reset}`);

  // Write JSON report
  const report = {
    url: deckUrl,
    timestamp: new Date().toISOString(),
    totalSlides,
    summary: { pass: passCount, critical: critCount, warnings: warnCount, info: infoCount },
    slides: results.map(r => ({ slide: r.slide, issues: r.issues, screenshot: r.screenshot })),
  };
  const reportPath = join(OUT_DIR, 'report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`${C.dim}JSON report: ${reportPath}${C.reset}`);

  await browser.close();
  process.exit(critCount > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
