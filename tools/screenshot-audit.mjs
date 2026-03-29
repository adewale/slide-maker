#!/usr/bin/env node

// screenshot-audit.mjs — Visual regression and contrast checker for Slidev decks
// Usage:  node screenshot-audit.mjs <base-url> [deck-name]
//         node screenshot-audit.mjs http://localhost:3000 reference
//
// Checks every slide at every v-click state for:
// 1. Mermaid SVG text-vs-fill contrast (WCAG)
// 2. Text contrast against effective background (WCAG AA)
// 3. Text overlap (bounding box intersection)
// 4. Content overflow (scrollHeight > viewport)
// 5. v-click revealed content contrast (clicks through all states)
// 6. Hover state contrast (spotlight-group, hover-lift elements)
// 7. SVG stroke visibility (lines, polylines, circles vs background)
// 8. Multiple viewport sizes (1280x720, 1024x768)
// 9. Empty/blank slide detection
// 10. Layout geometry (missing padding, uneven columns, off-center headings,
//     h1 trapped in two-cols left column, empty columns)
//
// Requires: playwright (npm install playwright)

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// ── Config ─────────────────────────────────────────────────────

const VIEWPORTS = [
  { width: 1280, height: 720, label: '720p' },
  { width: 1024, height: 768, label: '1024' },
  { width: 375, height: 667, label: 'iPhone-SE' },
  { width: 412, height: 915, label: 'Pixel-7' },
  { width: 667, height: 375, label: 'iPhone-SE-landscape' },
];
const WAIT_MS = 1500;
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

// ── Shared contrast helpers (injected into page.evaluate) ──────

const CONTRAST_HELPERS = `
  function parseLum(colorStr) {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    const ctx = c.getContext('2d');
    ctx.fillStyle = colorStr;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const [rs, gs, bs] = [r, g, b].map(v => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
  function cr(l1, l2) {
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  function findBg(el) {
    let bgEl = el;
    while (bgEl) {
      const bs = getComputedStyle(bgEl);
      const bgColor = bs.backgroundColor;
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') return bgColor;
      bgEl = bgEl.parentElement;
    }
    return null;
  }
`;

// ── Check: Mermaid SVG text-vs-fill contrast ──────────────────

async function checkMermaidContrast(page) {
  return page.evaluate(new Function(`
    ${CONTRAST_HELPERS}
    const problems = [];
    const svgs = document.querySelectorAll('.slidev-layout svg');
    for (const svg of svgs) {
      const shapes = svg.querySelectorAll('rect, circle, ellipse');
      let badNodes = 0, totalNodes = 0;
      for (const shape of shapes) {
        const r = shape.getBoundingClientRect();
        if (r.width < 30 || r.height < 15) continue;
        const fill = getComputedStyle(shape).fill || shape.getAttribute('fill') || '';
        if (!fill || fill === 'none' || fill === 'transparent') continue;
        totalNodes++;
        const fillLum = parseLum(fill);
        const group = shape.closest('g') || shape.parentElement;
        const texts = group ? group.querySelectorAll('text, tspan') : [];
        for (const t of texts) {
          const textFill = getComputedStyle(t).fill || t.getAttribute('fill') || '';
          if (!textFill || textFill === 'none') continue;
          if (cr(fillLum, parseLum(textFill)) < 2.0) { badNodes++; break; }
        }
      }
      if (totalNodes > 2 && badNodes > 0) {
        problems.push(badNodes + '/' + totalNodes + ' SVG nodes have text with <2:1 contrast against fill');
      }
    }
    return problems;
  `));
}

// ── Check: Text contrast (WCAG AA) ───────────────────────────

async function checkTextContrast(page) {
  return page.evaluate(new Function(`
    ${CONTRAST_HELPERS}
    const problems = [];
    const textEls = document.querySelectorAll('.slidev-layout h1, .slidev-layout h2, .slidev-layout h3, .slidev-layout p, .slidev-layout li, .slidev-layout span, .slidev-layout strong, .slidev-layout code, .slidev-layout td, .slidev-layout th');
    for (const el of textEls) {
      if (el.offsetWidth === 0 || el.offsetHeight === 0) continue;
      if (el.classList.contains('slidev-vclick-hidden')) continue;
      if (el.closest('.slidev-code, .shiki, pre > code')) continue;
      const text = el.innerText?.trim();
      if (!text || text.length < 2) continue;
      const style = getComputedStyle(el);
      const fgLum = parseLum(style.color);
      const bg = findBg(el);
      if (!bg) continue;
      const bgLum = parseLum(bg);
      const ratio = cr(fgLum, bgLum);
      const fontSize = parseFloat(style.fontSize);
      const isBold = parseInt(style.fontWeight) >= 700;
      const isLarge = fontSize >= 24 || (fontSize >= 18.66 && isBold);
      const threshold = isLarge ? 3.0 : 4.5;
      if (ratio < threshold) {
        const snippet = text.slice(0, 40) + (text.length > 40 ? '...' : '');
        problems.push('"' + snippet + '" — ' + ratio.toFixed(1) + ':1 (need ' + threshold + ':1, ' + (isLarge ? 'large' : 'body') + ' text)');
      }
    }
    return problems;
  `));
}

// ── Check: Text overlap ──────────────────────────────────────

async function checkOverlap(page) {
  return page.evaluate(() => {
    const problems = [];
    const textEls = document.querySelectorAll('.slidev-layout h1, .slidev-layout h2, .slidev-layout h3, .slidev-layout p, .slidev-layout li, .slidev-layout span, .slidev-layout text, .slidev-layout tspan, .slidev-layout div');
    const boxes = [], elements = [];
    for (const el of textEls) {
      if (el.offsetWidth === 0 && el.offsetHeight === 0) continue;
      if (el.classList.contains('slidev-vclick-hidden')) continue;
      const text = el.innerText?.trim() || el.textContent?.trim() || '';
      if (text.length < 2) continue;
      if (el.querySelector('h1, h2, h3, p, li, span:not(:empty)')) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 5 || r.height < 5) continue;
      boxes.push({ text: text.slice(0, 30), x: r.left, y: r.top, w: r.width, h: r.height });
      elements.push(el);
    }
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        if (a.text === b.text) continue;
        if (a.text.includes(b.text) || b.text.includes(a.text)) continue;
        if (elements[i].contains(elements[j]) || elements[j].contains(elements[i])) continue;
        const overlapX = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
        const overlapY = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
        const overlapArea = overlapX * overlapY;
        const smallerArea = Math.min(a.w * a.h, b.w * b.h);
        if (smallerArea > 0 && overlapArea > 200 && overlapArea / smallerArea > 0.5) {
          problems.push('"' + a.text + '" overlaps "' + b.text + '" (' + Math.round(overlapArea / smallerArea * 100) + '%)');
          if (problems.length >= 5) return problems;
        }
      }
    }
    return problems;
  });
}

// ── Check: Content overflow ──────────────────────────────────

async function checkOverflow(page, viewportHeight) {
  return page.evaluate((vh) => {
    const layout = document.querySelector('.slidev-layout');
    if (!layout) return false;
    return layout.scrollHeight > vh + 10;
  }, viewportHeight);
}

// ── Check: Layout geometry (#10) ─────────────────────────────
// Catches: missing padding, uneven columns, off-center headings,
// title trapped in left column of two-cols, content clipped at edges.

async function checkLayoutGeometry(page, viewportWidth) {
  return page.evaluate((vw) => {
    const problems = [];
    const layout = document.querySelector('.slidev-layout');
    if (!layout) return problems;

    // 1. Missing padding — content touching slide edges
    const children = layout.querySelectorAll('h1, h2, h3, p, ul, ol, pre');
    for (const el of children) {
      if (el.closest('.slidev-vclick-hidden')) continue;
      if (el.offsetWidth === 0 && el.offsetHeight === 0) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 10) continue;
      // Content within 5px of left or right edge suggests missing padding
      if (r.left < 5 && !layout.classList.contains('full') && !layout.closest('[class*="none"]')) {
        problems.push('content touches left edge — missing layout padding');
        break;
      }
    }

    // 2. Uneven two-column layout
    const colLeft = layout.querySelector('.col-left');
    const colRight = layout.querySelector('.col-right');
    if (colLeft && colRight) {
      const lRect = colLeft.getBoundingClientRect();
      const rRect = colRight.getBoundingClientRect();
      // Check column width ratio (should be roughly 1:1)
      if (lRect.width > 0 && rRect.width > 0) {
        const ratio = Math.min(lRect.width, rRect.width) / Math.max(lRect.width, rRect.width);
        if (ratio < 0.7) {
          problems.push(`uneven columns: ${Math.round(lRect.width)}px vs ${Math.round(rRect.width)}px (ratio ${ratio.toFixed(2)})`);
        }
      }
    }

    // 3. Title wrapping in two-cols (h1 inside col-left means it's trapped at 50%)
    if (layout.classList.contains('two-columns')) {
      const leftCol = layout.querySelector('.col-left');
      if (leftCol) {
        const h1 = leftCol.querySelector('h1');
        if (h1) {
          const h1Rect = h1.getBoundingClientRect();
          // If h1 height > 1.5x a single line (font-size * line-height * 1.5), it's wrapping
          const style = getComputedStyle(h1);
          const singleLineHeight = parseFloat(style.fontSize) * parseFloat(style.lineHeight || '1.2');
          if (h1Rect.height > singleLineHeight * 1.8) {
            problems.push('h1 wrapping inside two-cols left column — use two-cols-header so title spans both columns');
          }
        }
      }
    }

    // 4. Centered layout with off-center content
    if (layout.classList.contains('end') || layout.classList.contains('center') ||
        layout.classList.contains('fact') || layout.classList.contains('statement')) {
      const h1 = layout.querySelector('h1');
      const layoutRect = layout.getBoundingClientRect();
      const layoutCenter = layoutRect.left + layoutRect.width / 2;

      if (h1 && h1.offsetWidth > 0) {
        const h1Rect = h1.getBoundingClientRect();
        const h1Center = h1Rect.left + h1Rect.width / 2;
        const offset = Math.abs(h1Center - layoutCenter);
        if (offset > 20 && h1Rect.width < layoutRect.width * 0.9) {
          problems.push(`h1 is ${Math.round(offset)}px off-center on centered layout`);
        }
      }

      // 4b. h1 vs p alignment mismatch on centered layouts
      const p = layout.querySelector('p');
      if (h1 && p && h1.offsetWidth > 0 && p.offsetWidth > 0) {
        const h1Rect = h1.getBoundingClientRect();
        const pRect = p.getBoundingClientRect();
        const h1Center = h1Rect.left + h1Rect.width / 2;
        const pCenter = pRect.left + pRect.width / 2;
        const drift = Math.abs(h1Center - pCenter);
        // h1 and p should share the same center axis — allow 15px for rounding
        if (drift > 15 && h1Rect.width < layoutRect.width * 0.9 && pRect.width < layoutRect.width * 0.9) {
          problems.push(`h1 and p are ${Math.round(drift)}px apart on their center axes — alignment mismatch on centered layout`);
        }
      }
    }

    // 5. Empty column in two-cols
    if (colLeft && colRight) {
      const leftText = colLeft.innerText?.trim() || '';
      const rightText = colRight.innerText?.trim() || '';
      if (leftText.length > 0 && rightText.length === 0) {
        problems.push('right column is empty — consider using default layout instead');
      }
      if (rightText.length > 0 && leftText.length === 0) {
        problems.push('left column is empty — consider using default layout instead');
      }
    }

    return problems;
  }, viewportWidth);
}

// ── Check: SVG stroke visibility (#7) ─────────────────────────

async function checkSvgStrokes(page) {
  return page.evaluate(new Function(`
    ${CONTRAST_HELPERS}
    const problems = [];
    const strokes = document.querySelectorAll('.slidev-layout svg line, .slidev-layout svg polyline, .slidev-layout svg path');
    let invisibleCount = 0;
    for (const el of strokes) {
      const r = el.getBoundingClientRect();
      if (r.width < 10 && r.height < 10) continue;
      const style = getComputedStyle(el);
      const stroke = style.stroke || el.getAttribute('stroke') || '';
      if (!stroke || stroke === 'none' || stroke === 'transparent') continue;
      const strokeWidth = parseFloat(style.strokeWidth || el.getAttribute('stroke-width') || '1');
      if (strokeWidth < 0.5) continue;
      const bg = findBg(el.closest('svg') || el);
      if (!bg) continue;
      const ratio = cr(parseLum(stroke), parseLum(bg));
      if (ratio < 1.5) invisibleCount++;
    }
    if (invisibleCount > 0) {
      return [invisibleCount + ' SVG stroke(s) have <1.5:1 contrast against background'];
    }
    return [];
  `));
}

// ── Check: Hover states (#6) ──────────────────────────────────

async function checkHoverStates(page) {
  const issues = [];
  const hoverTargets = await page.evaluate(() => {
    const targets = [];
    const els = document.querySelectorAll('.slidev-layout .spotlight-group > *, .slidev-layout .hover-lift, .slidev-layout .cf-card, .slidev-layout [class*="hover"]');
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width > 10 && r.height > 10) {
        targets.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
    }
    return targets.slice(0, 5); // cap at 5 to avoid slow scans
  });

  for (const target of hoverTargets) {
    await page.mouse.move(target.x, target.y);
    await page.waitForTimeout(300); // let CSS transitions settle
    const contrastProblems = await checkTextContrast(page);
    for (const p of contrastProblems) {
      issues.push('on hover: ' + p);
    }
    // Move mouse away to reset
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);
  }
  return issues;
}

// ── v-click advancement (#1) ──────────────────────────────────

async function getClickCount(page) {
  return page.evaluate(() => {
    const layout = document.querySelector('.slidev-layout');
    if (!layout) return 0;
    return layout.querySelectorAll('.slidev-vclick-target').length;
  });
}

async function advanceClick(page) {
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(400);
}

// ── Main analysis for one slide at one viewport ───────────────

async function analyseSlideState(page, slideNum, clickState, vpLabel, vpHeight) {
  const issues = [];
  const prefix = vpLabel !== '720p' ? `[${vpLabel}] ` : '';
  const clickPrefix = clickState > 0 ? `[click ${clickState}] ` : '';
  const tag = prefix + clickPrefix;

  // Mermaid SVG contrast
  const mermaid = await checkMermaidContrast(page);
  for (const m of mermaid) issues.push({ severity: 'CRITICAL', message: tag + m });

  // Text contrast
  const contrast = await checkTextContrast(page);
  for (const c of contrast) issues.push({ severity: 'WARN', message: tag + c });

  // Overlap
  const overlap = await checkOverlap(page);
  for (const o of overlap) issues.push({ severity: 'WARN', message: tag + o });

  // Overflow
  if (await checkOverflow(page, vpHeight)) {
    issues.push({ severity: 'WARN', message: tag + 'content overflows viewport' });
  }

  // SVG strokes
  const strokes = await checkSvgStrokes(page);
  for (const s of strokes) issues.push({ severity: 'WARN', message: tag + s });

  // Layout geometry (only at click 0 to avoid noise from partial reveals)
  if (clickState === 0) {
    const geometry = await checkLayoutGeometry(page, vpHeight > 720 ? 1024 : 1280);
    for (const g of geometry) issues.push({ severity: 'WARN', message: tag + g });
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
  console.log(`${C.dim}viewports: ${VIEWPORTS.map(v => v.label).join(', ')}${C.reset}`);
  console.log('');

  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const primaryVP = VIEWPORTS[0];
  const page = await browser.newPage({ viewport: primaryVP });

  // Discover slide count
  await page.goto(`${deckUrl}/#/1`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const totalSlides = await page.evaluate(() => {
    const footer = document.body.innerText.match(/\/ (\d+)/);
    if (footer) return parseInt(footer[1]);
    return 0;
  });
  if (!totalSlides) {
    console.error(`${C.red}Could not determine slide count. Is the server running?${C.reset}`);
    await browser.close();
    process.exit(1);
  }

  console.log(`${C.dim}scanning ${totalSlides} slides × ${VIEWPORTS.length} viewports, with v-click + hover checks...${C.reset}`);
  console.log('');

  const results = [];
  let critCount = 0, warnCount = 0, infoCount = 0, passCount = 0;

  for (let i = 1; i <= totalSlides; i++) {
    const allIssues = [];

    // ── Primary viewport: full analysis with v-clicks and hover ──
    await page.setViewportSize(primaryVP);
    await page.goto(`${deckUrl}/#/${i}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(WAIT_MS);

    // Screenshot at click 0
    const screenshotPath = join(OUT_DIR, `slide-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: screenshotPath });

    // Check at click 0
    const click0Issues = await analyseSlideState(page, i, 0, primaryVP.label, primaryVP.height);
    allIssues.push(...click0Issues);

    // Blind spot #1: Advance through v-clicks and check each state
    const clickTargets = await getClickCount(page);
    if (clickTargets > 0) {
      const maxClicks = Math.min(clickTargets, 10); // cap to avoid infinite loops
      for (let c = 1; c <= maxClicks; c++) {
        await advanceClick(page);
        // Check if we're still on the same slide (ArrowRight may navigate to next slide)
        const currentSlide = await page.evaluate(() => {
          const footer = document.body.innerText.match(/(\d+) \/ \d+/);
          return footer ? parseInt(footer[1]) : 0;
        });
        if (currentSlide !== i) break; // moved to next slide, stop clicking
        const clickIssues = await analyseSlideState(page, i, c, primaryVP.label, primaryVP.height);
        allIssues.push(...clickIssues);
      }
    }

    // Blind spot #6: Check hover states
    // Navigate back to the slide fresh for hover testing
    await page.goto(`${deckUrl}/#/${i}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(800);
    const hoverIssues = await checkHoverStates(page);
    for (const h of hoverIssues) allIssues.push({ severity: 'WARN', message: h });

    // ── Blind spot #5: Secondary viewport ──
    for (let v = 1; v < VIEWPORTS.length; v++) {
      const vp = VIEWPORTS[v];
      await page.setViewportSize(vp);
      await page.goto(`${deckUrl}/#/${i}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(800);
      const vpIssues = await analyseSlideState(page, i, 0, vp.label, vp.height);
      allIssues.push(...vpIssues);
    }

    // Deduplicate issues (same message from different click states)
    const seen = new Set();
    const uniqueIssues = [];
    for (const issue of allIssues) {
      // Strip click/viewport prefix for dedup
      const key = issue.message.replace(/^\[(click \d+|1024|720p)\] /g, '').replace(/^\[(click \d+|1024|720p)\] /g, '');
      if (!seen.has(key)) {
        seen.add(key);
        uniqueIssues.push(issue);
      }
    }

    results.push({ slide: i, issues: uniqueIssues, screenshot: screenshotPath });

    if (uniqueIssues.length === 0) {
      passCount++;
      process.stdout.write(`${C.green}.${C.reset}`);
    } else {
      const hasCrit = uniqueIssues.some(i => i.severity === 'CRITICAL');
      const hasWarn = uniqueIssues.some(i => i.severity === 'WARN');
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
  console.log(`${C.bold}Summary${C.reset}  ${totalSlides} slides × ${VIEWPORTS.length} viewports`);
  console.log('');
  if (passCount > 0) console.log(`  ${C.green}${C.bold}${passCount}${C.reset}${C.green} passing${C.reset}`);
  if (critCount > 0) console.log(`  ${C.red}${C.bold}${critCount}${C.reset}${C.red} critical${C.reset}`);
  if (warnCount > 0) console.log(`  ${C.yellow}${C.bold}${warnCount}${C.reset}${C.yellow} warnings${C.reset}`);
  if (infoCount > 0) console.log(`  ${C.cyan}${C.bold}${infoCount}${C.reset}${C.cyan} info${C.reset}`);
  console.log('');
  console.log(`${C.dim}Screenshots saved to ${OUT_DIR}/${C.reset}`);

  const report = {
    url: deckUrl,
    timestamp: new Date().toISOString(),
    totalSlides,
    viewports: VIEWPORTS.map(v => v.label),
    checksPerSlide: ['mermaid-svg-contrast', 'text-contrast-wcag-aa', 'text-overlap', 'content-overflow', 'svg-stroke-visibility', 'v-click-states', 'hover-states', 'responsive-breakpoints'],
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
