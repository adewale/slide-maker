#!/usr/bin/env node
// pixel-audit.mjs — the rendered-pixel counterpart to deck-lint's static checks.
//
// deck-lint's flash-bang/contrast checks read Markdown + tokens, so they're
// blind to what actually reaches the screen: background images, gradients, and
// theme/layout-driven cover/section backgrounds. This tool measures the real
// thing — per-slide luminance from rendered screenshots — and flags flash-bang
// brightness jumps between adjacent slides.
//
// Input: a directory of per-slide PNGs named slide-NN.png (the layout written
// by tools/screenshot-audit.mjs, default /tmp/slide-audit). Produce them with:
//   node tools/screenshot-audit.mjs <deckDir>        # writes /tmp/slide-audit
//   node tools/pixel-audit.mjs /tmp/slide-audit
//
// Usage:
//   node tools/pixel-audit.mjs <screenshots-dir> [--threshold 0.5] [--json <path>]
//
// Exits non-zero if any flash-bang is found.

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { PNG } from 'pngjs';

const C = { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', magenta: '\x1b[35m' };
const CHECK = `${C.green}✓${C.reset}`;
const DOT = `${C.yellow}○${C.reset}`;

const DEFAULT_THRESHOLD = 0.5; // matches deck-lint's FLASHBANG_LUMA_DELTA

function srgbToLinear(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

// Average WCAG relative luminance over a sample of opaque pixels.
function averageLuminance(png) {
  const total = png.width * png.height;
  const step = Math.max(1, Math.floor(total / 20000)); // cap at ~20k samples
  let sum = 0, n = 0;
  for (let p = 0; p < total; p += step) {
    const i = p * 4;
    const a = png.data[i + 3];
    if (a === 0) continue;
    sum += 0.2126 * srgbToLinear(png.data[i]) + 0.7152 * srgbToLinear(png.data[i + 1]) + 0.0722 * srgbToLinear(png.data[i + 2]);
    n++;
  }
  return n ? sum / n : 0.5;
}

function parseArgs(argv) {
  const opts = { dir: null, threshold: DEFAULT_THRESHOLD, json: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--threshold') opts.threshold = Number(argv[++i]);
    else if (a === '--json') opts.json = argv[++i];
    else if (a === '-h' || a === '--help') opts.help = true;
    else if (!opts.dir) opts.dir = a;
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.dir) {
    console.log('usage: node tools/pixel-audit.mjs <screenshots-dir> [--threshold 0.5] [--json <path>]');
    process.exit(opts.help ? 0 : 2);
  }
  const dir = resolve(opts.dir);
  if (!existsSync(dir)) {
    console.error(`${C.red}screenshots dir not found: ${dir}${C.reset}`);
    console.error(`${C.dim}render first: node tools/screenshot-audit.mjs <deckDir>${C.reset}`);
    process.exit(2);
  }

  const files = readdirSync(dir).filter(f => /^slide-\d+\.png$/.test(f)).sort();
  if (files.length === 0) {
    console.error(`${C.red}no slide-NN.png files in ${dir}${C.reset}`);
    process.exit(2);
  }

  console.log(`${C.bold}${C.magenta}pixel-audit${C.reset}  ${C.dim}${files.length} slide(s), flash-bang threshold ${opts.threshold} rel-luminance${C.reset}\n`);

  const slides = files.map(f => {
    const png = PNG.sync.read(readFileSync(join(dir, f)));
    return { file: f, luminance: averageLuminance(png) };
  });

  const flashBangs = [];
  for (let i = 1; i < slides.length; i++) {
    const delta = Math.abs(slides[i].luminance - slides[i - 1].luminance);
    if (delta >= opts.threshold) flashBangs.push({ from: slides[i - 1].file, to: slides[i].file, delta });
  }

  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const jump = i > 0 ? Math.abs(s.luminance - slides[i - 1].luminance) : 0;
    const mark = jump >= opts.threshold ? `${C.red}↯ +${jump.toFixed(2)} flash-bang${C.reset}` : i > 0 ? `${C.dim}Δ${jump.toFixed(2)}${C.reset}` : '';
    console.log(`  ${s.file}  ${C.dim}luma ${s.luminance.toFixed(3)}${C.reset}  ${mark}`);
  }

  console.log('');
  if (flashBangs.length === 0) {
    console.log(`  ${CHECK} no flash-bang brightness jumps between adjacent slides`);
  } else {
    for (const fb of flashBangs) {
      console.log(`  ${DOT} ${C.yellow}flash-bang: ${fb.from} → ${fb.to} jumps ${fb.delta.toFixed(2)} (>= ${opts.threshold})${C.reset}`);
    }
  }

  if (opts.json) {
    const out = resolve(opts.json);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify({ when: new Date().toISOString(), threshold: opts.threshold, slides, flashBangs }, null, 2));
    console.log(`\n${C.dim}report written to ${opts.json}${C.reset}`);
  }

  process.exit(flashBangs.length ? 1 : 0);
}

main();
