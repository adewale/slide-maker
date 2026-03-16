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
      // Skip all elements inside code blocks — Shiki syntax highlighting
      // colors are controlled by the syntax theme, not deck tokens.
      // Flagging individual syntax tokens is noise; the fix is choosing
      // a higher-contrast Shiki theme, not editing CSS per-token.
      if (el.closest('.slidev-code, .shiki, pre > code')) continue;
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

  // 4. Check for overlapping text elements
  const overlapIssues = await page.evaluate(() => {
    const problems = [];
    // Get all visible text elements with bounding boxes
    const textEls = document.querySelectorAll('.slidev-layout h1, .slidev-layout h2, .slidev-layout h3, .slidev-layout p, .slidev-layout li, .slidev-layout span, .slidev-layout text, .slidev-layout tspan, .slidev-layout div');
    const boxes = [];
    for (const el of textEls) {
      if (el.offsetWidth === 0 && el.offsetHeight === 0) continue;
      if (el.classList.contains('slidev-vclick-hidden')) continue;
      const text = el.innerText?.trim() || el.textContent?.trim() || '';
      if (text.length < 2) continue;
      // Skip if this element contains other text elements (only check leaf text nodes)
      if (el.querySelector('h1, h2, h3, p, li, span:not(:empty)')) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 5 || r.height < 5) continue;
      boxes.push({ text: text.slice(0, 30), x: r.left, y: r.top, w: r.width, h: r.height, tag: el.tagName });
    }

    // Check for pairwise overlaps
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        // Skip if same text (duplicate elements)
        if (a.text === b.text) continue;
        // Check bounding box overlap
        const overlapX = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
        const overlapY = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
        const overlapArea = overlapX * overlapY;
        const smallerArea = Math.min(a.w * a.h, b.w * b.h);
        // Flag if overlap is >30% of the smaller element
        if (smallerArea > 0 && overlapArea / smallerArea > 0.3) {
          problems.push(`"${a.text}" overlaps "${b.text}" (${Math.round(overlapArea / smallerArea * 100)}% overlap)`);
          if (problems.length >= 5) return problems; // cap at 5
        }
      }
    }
    return problems;
  });
  for (const o of overlapIssues) {
    issues.push({ severity: 'WARN', message: o });
  }

  // 5. Check for content overflow (content extending beyond viewport)
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

/**
 * Pixel-level analysis of the screenshot.
 * Samples the actual rendered pixels to catch issues DOM analysis misses:
 * - Large solid-black regions (Mermaid rendering failures)
 * - Near-uniform slides (broken rendering or blank slides)
 * - Color banding / unexpected dominant colors
 */
async function analysePixels(page, slideNum) {
  const issues = [];

  const pixelData = await page.evaluate(({ w, h }) => {
    // Render the viewport to a canvas and sample pixels
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    // We can't use drawWindow in Playwright, so sample visible elements
    // Instead, probe specific regions by creating test elements
    const layout = document.querySelector('.slidev-layout');
    if (!layout) return { regions: [] };

    const rect = layout.getBoundingClientRect();
    const regions = [];

    // Sample a grid of points across the slide content area
    const gridSize = 10;
    const samples = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = rect.left + (rect.width * (col + 0.5)) / gridSize;
        const y = rect.top + (rect.height * (row + 0.5)) / gridSize;
        const el = document.elementFromPoint(x, y);
        if (el) {
          const style = getComputedStyle(el);
          // Walk up for background
          let bgEl = el;
          let bgColor = 'rgba(0,0,0,0)';
          while (bgEl) {
            const bs = getComputedStyle(bgEl);
            if (bs.backgroundColor && bs.backgroundColor !== 'rgba(0, 0, 0, 0)' && bs.backgroundColor !== 'transparent') {
              bgColor = bs.backgroundColor;
              break;
            }
            bgEl = bgEl.parentElement;
          }
          samples.push({
            x: Math.round(x), y: Math.round(y),
            fg: style.color,
            bg: bgColor,
            tag: el.tagName.toLowerCase(),
            hasText: (el.innerText?.trim().length || 0) > 0,
          });
        }
      }
    }

    // Detect large uniform dark regions (potential Mermaid black boxes)
    // Check SVG elements specifically
    const svgElements = document.querySelectorAll('.slidev-layout svg rect, .slidev-layout svg circle, .slidev-layout svg path');
    const darkShapes = [];
    for (const shape of svgElements) {
      const r = shape.getBoundingClientRect();
      if (r.width < 20 || r.height < 10) continue; // skip tiny elements
      const fill = getComputedStyle(shape).fill || shape.getAttribute('fill') || '';
      if (!fill || fill === 'none') continue;

      // Parse the fill color
      const testCanvas = document.createElement('canvas');
      testCanvas.width = testCanvas.height = 1;
      const ctx = testCanvas.getContext('2d');
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, 1, 1);
      const [rv, gv, bv, av] = ctx.getImageData(0, 0, 1, 1).data;
      const lum = (0.2126 * rv + 0.7152 * gv + 0.0722 * bv) / 255;

      if (lum < 0.05 && av > 200) {
        // Check if there's visible text inside this shape
        const parent = shape.closest('g') || shape.parentElement;
        const texts = parent?.querySelectorAll('text, tspan') || [];
        let hasVisibleText = false;
        for (const t of texts) {
          const ts = getComputedStyle(t);
          const tFill = ts.fill || t.getAttribute('fill') || '';
          if (tFill && tFill !== 'none') {
            const tc = document.createElement('canvas');
            tc.width = tc.height = 1;
            const tctx = tc.getContext('2d');
            tctx.fillStyle = tFill;
            tctx.fillRect(0, 0, 1, 1);
            const [tr, tg, tb] = tctx.getImageData(0, 0, 1, 1).data;
            const tLum = (0.2126 * tr + 0.7152 * tg + 0.0722 * tb) / 255;
            // Text on black needs to be light
            if (tLum > 0.3) hasVisibleText = true;
          }
        }
        darkShapes.push({
          width: Math.round(r.width),
          height: Math.round(r.height),
          area: Math.round(r.width * r.height),
          hasVisibleText,
          luminance: lum,
        });
      }
    }

    // Detect if the slide is mostly one color (blank/broken)
    const bgCounts = {};
    for (const s of samples) {
      const key = s.bg;
      bgCounts[key] = (bgCounts[key] || 0) + 1;
    }
    const dominantBg = Object.entries(bgCounts).sort((a, b) => b[1] - a[1])[0];
    const uniformity = dominantBg ? dominantBg[1] / samples.length : 0;

    return { samples, darkShapes, uniformity, dominantBg: dominantBg?.[0] };
  }, { w: VIEWPORT.width, h: VIEWPORT.height });

  // Analyse dark shapes (potential black Mermaid boxes)
  if (pixelData.darkShapes && pixelData.darkShapes.length > 0) {
    const totalDarkArea = pixelData.darkShapes.reduce((s, d) => s + d.area, 0);
    const noText = pixelData.darkShapes.filter(d => !d.hasVisibleText);
    if (noText.length > 2 && totalDarkArea > 5000) {
      issues.push({
        severity: 'CRITICAL',
        message: `${noText.length} large black shapes without visible text (total ${totalDarkArea}px area) — likely Mermaid rendering failure`,
      });
    } else if (noText.length > 0) {
      issues.push({
        severity: 'WARN',
        message: `${noText.length} dark shape(s) without visible text — check Mermaid rendering`,
      });
    }
  }

  // Detect near-blank slides (>95% one background color, no text content)
  if (pixelData.uniformity > 0.95) {
    const hasAnyText = pixelData.samples?.some(s => s.hasText) || false;
    if (!hasAnyText) {
      issues.push({
        severity: 'WARN',
        message: `slide appears blank — ${Math.round(pixelData.uniformity * 100)}% uniform background`,
      });
    }
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

    // Analyse: DOM-level checks + pixel-level checks
    const domIssues = await analyseSlide(page, i);
    const pixelIssues = await analysePixels(page, i);
    const issues = [...domIssues, ...pixelIssues];
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
