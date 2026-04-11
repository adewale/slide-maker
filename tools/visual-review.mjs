#!/usr/bin/env node

// visual-review.mjs — AI-powered visual quality review for Slidev decks
//
// Uses agent-browser to capture screenshots, then sends them to Claude
// for visual assessment of things pixel-based tests cannot catch.
//
// Usage:
//   node visual-review.mjs <base-url> [deck-name]
//   node visual-review.mjs http://localhost:3030
//   node visual-review.mjs http://localhost:3000 vaders
//
// Requires: ANTHROPIC_API_KEY env var, agent-browser installed
//
// Checks per slide:
//   1. Mermaid diagrams rendered (not raw syntax or blank)
//   2. Visual hierarchy (headings visually larger than body)
//   3. Font loading (distinctive fonts, not system fallback)
//   4. Layout balance and alignment
//   5. Text readability beyond contrast ratios
//   6. Overall visual quality
//
// Cross-slide checks:
//   7. Heading position consistency
//   8. Color palette consistency
//   9. Slide-to-slide visual rhythm

import { execSync } from 'child_process';
import { mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

// ── Config ─────────────────────────────────────────────────────

const OUT_DIR = '/tmp/visual-review';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 1024;
const WAIT_MS = 2000;

// ── Terminal colours ──────────────────────────────────────────

const isTTY = process.stdout.isTTY;
const C = isTTY
  ? { reset: '\x1b[0m', bold: '\x1b[1m', red: '\x1b[31m', green: '\x1b[32m',
      yellow: '\x1b[33m', cyan: '\x1b[36m', dim: '\x1b[2m', magenta: '\x1b[35m',
      bgRed: '\x1b[41m', bgGreen: '\x1b[42m', bgYellow: '\x1b[43m', white: '\x1b[37m' }
  : Object.fromEntries(['reset','bold','red','green','yellow','cyan','dim','magenta','bgRed','bgGreen','bgYellow','white'].map(k=>[k,'']));

const PASS = `${C.bgGreen}${C.bold}${C.white} PASS ${C.reset}`;
const WARN = `${C.bgYellow}${C.bold}${C.white} WARN ${C.reset}`;
const FAIL = `${C.bgRed}${C.bold}${C.white} FAIL ${C.reset}`;

// ── Helpers ───────────────────────────────────────────────────

function ab(cmd) {
  try {
    return execSync(`agent-browser ${cmd}`, {
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'pipe'],
    }).toString().trim();
  } catch (e) {
    return e.stdout?.toString().trim() || e.message;
  }
}

function imageToBase64(path) {
  return readFileSync(path).toString('base64');
}

async function callClaude(systemPrompt, userContent) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

// ── Per-slide visual review ───────────────────────────────────

const SLIDE_SYSTEM_PROMPT = `You are a visual quality reviewer for Slidev presentation slides. You are shown a screenshot of one slide.

Evaluate these specific checks and respond in EXACTLY this JSON format (no markdown, no explanation outside the JSON):

{
  "verdict": "pass" | "warn" | "fail",
  "checks": {
    "mermaid": "pass" | "warn" | "fail" | "n/a",
    "hierarchy": "pass" | "warn" | "fail",
    "fonts": "pass" | "warn" | "fail",
    "layout": "pass" | "warn" | "fail",
    "readability": "pass" | "warn" | "fail"
  },
  "issues": ["list of specific issues found, empty if all pass"]
}

Check definitions:
- mermaid: If a diagram is visible, is it properly rendered (not raw code, not blank, not clipped)? "n/a" if no diagram.
- hierarchy: Do headings look visually larger and more prominent than body text? Is there clear size/weight distinction?
- fonts: Do fonts look like distinctive/loaded web fonts (not generic system-ui/Arial/Times)? Section/cover slides may use display fonts.
- layout: Is content well-balanced? No awkward whitespace, no content crammed to one side, no visual misalignment?
- readability: Is all text clearly readable? No text too small, no text lost against background, no text running into edges?

verdict: "fail" if any check fails, "warn" if any warns but none fail, "pass" if all pass or n/a.`;

async function reviewSlide(slideNum, screenshotPath) {
  const b64 = imageToBase64(screenshotPath);

  const userContent = [
    {
      type: 'image',
      source: { type: 'base64', media_type: 'image/png', data: b64 },
    },
    {
      type: 'text',
      text: `This is slide ${slideNum} of a Slidev presentation. Review it visually.`,
    },
  ];

  const raw = await callClaude(SLIDE_SYSTEM_PROMPT, userContent);

  // Parse JSON from response (handle markdown code blocks if Claude wraps it)
  const jsonStr = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    return JSON.parse(jsonStr);
  } catch {
    return { verdict: 'warn', checks: {}, issues: [`Could not parse review: ${raw.slice(0, 100)}`] };
  }
}

// ── Cross-slide consistency review ────────────────────────────

const CONSISTENCY_SYSTEM_PROMPT = `You are reviewing a set of slide screenshots from the same Slidev presentation for visual consistency.

Evaluate these cross-slide checks and respond in EXACTLY this JSON format:

{
  "verdict": "pass" | "warn" | "fail",
  "checks": {
    "heading_position": "pass" | "warn" | "fail",
    "color_consistency": "pass" | "warn" | "fail",
    "visual_rhythm": "pass" | "warn" | "fail"
  },
  "issues": ["list of specific issues found, empty if all pass"]
}

Check definitions:
- heading_position: Do headings appear at a consistent vertical position across content slides? (Section/cover/end slides are exempt.)
- color_consistency: Is the color palette consistent? Same accent color, same background, same text color across all slides?
- visual_rhythm: Is there variety in slide types (not all identical layouts)? Do section dividers break up content slides?

verdict: "fail" if any check fails, "warn" if any warns, "pass" if all pass.`;

async function reviewConsistency(screenshotPaths) {
  // Send up to 6 evenly-spaced slides for consistency check
  const step = Math.max(1, Math.floor(screenshotPaths.length / 6));
  const sample = screenshotPaths.filter((_, i) => i % step === 0).slice(0, 6);

  const userContent = [];
  for (let i = 0; i < sample.length; i++) {
    const b64 = imageToBase64(sample[i].path);
    userContent.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/png', data: b64 },
    });
    userContent.push({
      type: 'text',
      text: `Slide ${sample[i].num}`,
    });
  }
  userContent.push({
    type: 'text',
    text: 'Review these slides for cross-slide visual consistency.',
  });

  const raw = await callClaude(CONSISTENCY_SYSTEM_PROMPT, userContent);
  const jsonStr = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    return JSON.parse(jsonStr);
  } catch {
    return { verdict: 'warn', checks: {}, issues: [`Could not parse review: ${raw.slice(0, 100)}`] };
  }
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log('Usage: node visual-review.mjs <base-url> [deck-name]');
    console.log('');
    console.log('Requires: ANTHROPIC_API_KEY env var, agent-browser installed');
    console.log('');
    console.log('Examples:');
    console.log('  node visual-review.mjs http://localhost:3030');
    console.log('  node visual-review.mjs http://localhost:3000 vaders');
    process.exit(0);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(`${C.red}Error: ANTHROPIC_API_KEY not set${C.reset}`);
    console.error('Set it: export ANTHROPIC_API_KEY=sk-ant-...');
    process.exit(1);
  }

  // Check agent-browser
  try {
    execSync('which agent-browser', { stdio: 'pipe' });
  } catch {
    console.error(`${C.red}Error: agent-browser not found. Install: npm install -g agent-browser${C.reset}`);
    process.exit(1);
  }

  const baseUrl = args[0].replace(/\/$/, '');
  const deckName = args[1] || '';
  const deckUrl = deckName ? `${baseUrl}/${deckName}` : baseUrl;

  console.log(`${C.bold}${C.magenta}visual-review${C.reset}  ${C.dim}AI-powered visual quality review${C.reset}`);
  console.log(`${C.dim}target: ${deckUrl}${C.reset}`);
  console.log(`${C.dim}model: ${MODEL}${C.reset}`);
  console.log('');

  mkdirSync(OUT_DIR, { recursive: true });

  // Open browser in incognito mode to avoid stale sessions
  ab('close --all');
  await new Promise(r => setTimeout(r, 500));
  ab(`open "${deckUrl}/#/1" --incognito`);
  await new Promise(r => setTimeout(r, 4000)); // SPA needs time to hydrate

  // Discover slide count via DOM evaluation
  let totalSlides = 0;

  // Read the "N / M" footer text from the rendered page
  const countStr = ab(`eval "document.body.innerText.match(/(\\\\d+)\\\\s*\\\\/\\\\s*(\\\\d+)/)?.[2] || '0'"`);
  totalSlides = parseInt(countStr) || 0;

  if (!totalSlides) {
    // Fall back to slides/count endpoint
    try {
      const countRes = await fetch(`${deckUrl}/slides/count`);
      if (countRes.ok) totalSlides = parseInt((await countRes.text()).trim());
    } catch {}
  }

  // Last resort: try --slide-count arg or default
  if (!totalSlides) {
    const countArg = args.find(a => a.startsWith('--slides='));
    if (countArg) totalSlides = parseInt(countArg.split('=')[1]);
  }

  if (!totalSlides) {
    console.error(`${C.red}Could not determine slide count. Pass --slides=N or check the server at ${deckUrl}${C.reset}`);
    try { ab('close'); } catch {}
    process.exit(1);
  }

  console.log(`${C.dim}reviewing ${totalSlides} slides + cross-slide consistency...${C.reset}`);
  console.log('');

  // Capture all screenshots (navigate via hash — same session, no reload)
  const screenshots = [];
  for (let i = 1; i <= totalSlides; i++) {
    ab(`open "${deckUrl}/#/${i}" --incognito`);
    await new Promise(r => setTimeout(r, i === 1 ? 4000 : WAIT_MS));

    const path = join(OUT_DIR, `slide-${String(i).padStart(2, '0')}.png`);
    ab(`screenshot ${path}`);
    screenshots.push({ num: i, path });
    process.stdout.write(`${C.dim}  captured slide ${i}/${totalSlides}\r${C.reset}`);
  }
  console.log(`${C.dim}  captured ${totalSlides} slides${' '.repeat(20)}${C.reset}`);
  console.log('');

  // Close browser
  ab('close');

  // Review each slide
  let failCount = 0, warnCount = 0, passCount = 0;
  const slideResults = [];

  for (const { num, path } of screenshots) {
    process.stdout.write(`${C.dim}  reviewing slide ${num}/${totalSlides}...\r${C.reset}`);
    try {
      const result = await reviewSlide(num, path);
      slideResults.push({ num, ...result });

      const tag = result.verdict === 'fail' ? FAIL : result.verdict === 'warn' ? WARN : PASS;
      if (result.verdict === 'fail') failCount++;
      else if (result.verdict === 'warn') warnCount++;
      else passCount++;

      if (result.issues && result.issues.length > 0) {
        console.log(`${tag} slide ${num}`);
        for (const issue of result.issues) {
          const bullet = result.verdict === 'fail' ? `  ${C.red}\u2717${C.reset}` : `  ${C.yellow}\u25CB${C.reset}`;
          console.log(`${bullet} ${issue}`);
        }
      } else {
        console.log(`${tag} slide ${num}`);
      }
    } catch (e) {
      console.log(`${FAIL} slide ${num}: ${e.message}`);
      failCount++;
      slideResults.push({ num, verdict: 'fail', issues: [e.message] });
    }
  }

  console.log('');

  // Cross-slide consistency review
  console.log(`${C.dim}reviewing cross-slide consistency...${C.reset}`);
  try {
    const consistency = await reviewConsistency(screenshots);
    const tag = consistency.verdict === 'fail' ? FAIL : consistency.verdict === 'warn' ? WARN : PASS;
    console.log(`${tag} cross-slide consistency`);
    if (consistency.issues && consistency.issues.length > 0) {
      for (const issue of consistency.issues) {
        const bullet = consistency.verdict === 'fail' ? `  ${C.red}\u2717${C.reset}` : `  ${C.yellow}\u25CB${C.reset}`;
        console.log(`${bullet} ${issue}`);
      }
    }
    if (consistency.checks) {
      for (const [check, result] of Object.entries(consistency.checks)) {
        if (result !== 'pass') {
          console.log(`  ${C.dim}${check}: ${result}${C.reset}`);
        }
      }
    }
  } catch (e) {
    console.log(`${FAIL} consistency: ${e.message}`);
  }

  // Summary
  console.log('');
  console.log(`${C.bold}${'='.repeat(50)}${C.reset}`);
  console.log(`${C.bold}Summary${C.reset}  ${totalSlides} slides reviewed`);
  console.log('');
  if (passCount > 0) console.log(`  ${C.green}${C.bold}${passCount}${C.reset}${C.green} passing${C.reset}`);
  if (warnCount > 0) console.log(`  ${C.yellow}${C.bold}${warnCount}${C.reset}${C.yellow} warnings${C.reset}`);
  if (failCount > 0) console.log(`  ${C.red}${C.bold}${failCount}${C.reset}${C.red} failing${C.reset}`);
  console.log('');

  // Save JSON report
  const report = {
    url: deckUrl,
    model: MODEL,
    timestamp: new Date().toISOString(),
    slides: slideResults,
    totalSlides,
    passCount,
    warnCount,
    failCount,
  };
  const reportPath = join(OUT_DIR, 'report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`${C.dim}Report: ${reportPath}${C.reset}`);
  console.log(`${C.dim}Screenshots: ${OUT_DIR}/${C.reset}`);

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch(e => {
  console.error(`${C.red}Fatal: ${e.message}${C.reset}`);
  try { ab('close'); } catch {}
  process.exit(1);
});
