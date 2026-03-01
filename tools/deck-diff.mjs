#!/usr/bin/env node

// deck-diff.mjs — Visual regression comparison between two directories of slide screenshots.
//
// Usage:
//   node deck-diff.mjs --left _compare/reference --right _compare/local
//   node deck-diff.mjs --left _preview/vaders --right _preview/sumi-e --left-label "Vaders" --right-label "Sumi-e"
//   node deck-diff.mjs --left _compare/reference --right _compare/local --threshold 0.05
//
// Outputs:
//   _diff/index.html          — HTML report with side-by-side comparison
//   _diff/diff-slide-01.png   — Per-slide diff images
//
// Exit code 1 if any slide similarity is below 80%.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, basename, resolve } from 'path';
import { execSync } from 'child_process';
import { createRequire } from 'module';
import { parseArgs } from 'util';

// ---------------------------------------------------------------------------
// Dependency check — ensure pngjs and pixelmatch are available.
// Uses createRequire to probe without polluting the ESM module cache.
// If deps were missing and installed, re-execs this script so Node can
// resolve the freshly-installed packages cleanly.
// ---------------------------------------------------------------------------
const require = createRequire(import.meta.url);

function ensureDeps() {
  const missing = [];
  try { require.resolve('pngjs'); } catch { missing.push('pngjs'); }
  try { require.resolve('pixelmatch'); } catch { missing.push('pixelmatch'); }

  if (missing.length > 0) {
    console.log(`Installing missing dependencies: ${missing.join(', ')}...`);
    try {
      execSync(`npm install --save-dev ${missing.join(' ')}`, {
        cwd: join(import.meta.dirname, '..'),
        stdio: 'inherit',
      });
      console.log('Dependencies installed. Re-launching...\n');
    } catch (err) {
      console.error('Failed to install dependencies. Please run manually:');
      console.error(`  npm install --save-dev ${missing.join(' ')}`);
      process.exit(1);
    }
    // Re-exec so Node resolves the newly-installed packages from scratch.
    const result = execSync(
      `node ${process.argv.slice(1).map(a => JSON.stringify(a)).join(' ')}`,
      { cwd: process.cwd(), stdio: 'inherit' },
    );
    process.exit(0);
  }
}

ensureDeps();

// ---------------------------------------------------------------------------
// CLI arguments
// ---------------------------------------------------------------------------
const { values: args } = parseArgs({
  options: {
    left:         { type: 'string' },
    right:        { type: 'string' },
    'left-label': { type: 'string', default: 'Left' },
    'right-label':{ type: 'string', default: 'Right' },
    threshold:    { type: 'string', default: '0.1' },
    output:       { type: 'string', default: '_diff' },
    help:         { type: 'boolean', default: false },
  },
  strict: true,
});

if (args.help || !args.left || !args.right) {
  console.log(`
deck-diff.mjs — Visual regression comparison tool

Usage:
  node deck-diff.mjs --left <dir> --right <dir> [options]

Required:
  --left <dir>          Directory containing left-side slide PNGs
  --right <dir>         Directory containing right-side slide PNGs

Options:
  --left-label <name>   Label for left side in the report (default: "Left")
  --right-label <name>  Label for right side in the report (default: "Right")
  --threshold <0-1>     Pixel difference tolerance (default: 0.1)
  --output <dir>        Output directory (default: _diff)
  --help                Show this help message

Examples:
  node deck-diff.mjs --left _compare/reference --right _compare/local
  node deck-diff.mjs --left _preview/vaders --right _preview/sumi-e \\
       --left-label "Vaders" --right-label "Sumi-e" --threshold 0.05
`);
  process.exit(args.help ? 0 : 1);
}

const LEFT_DIR      = resolve(args.left);
const RIGHT_DIR     = resolve(args.right);
const LEFT_LABEL    = args['left-label'];
const RIGHT_LABEL   = args['right-label'];
const THRESHOLD     = parseFloat(args.threshold);
const OUT_DIR       = resolve(args.output);

// ---------------------------------------------------------------------------
// Now safe to import — deps are guaranteed to be installed
// ---------------------------------------------------------------------------
const { PNG } = await import('pngjs');
const pixelmatch = (await import('pixelmatch')).default;

// ---------------------------------------------------------------------------
// Validate inputs
// ---------------------------------------------------------------------------
if (!existsSync(LEFT_DIR)) {
  console.error(`Left directory does not exist: ${LEFT_DIR}`);
  process.exit(1);
}
if (!existsSync(RIGHT_DIR)) {
  console.error(`Right directory does not exist: ${RIGHT_DIR}`);
  process.exit(1);
}

if (THRESHOLD < 0 || THRESHOLD > 1 || isNaN(THRESHOLD)) {
  console.error(`Threshold must be between 0 and 1, got: ${args.threshold}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Discover slide PNGs
// ---------------------------------------------------------------------------
const SLIDE_RE = /^slide-\d+\.png$/;

function listSlides(dir) {
  return readdirSync(dir)
    .filter(f => SLIDE_RE.test(f))
    .sort();
}

const leftSlides  = listSlides(LEFT_DIR);
const rightSlides = listSlides(RIGHT_DIR);

const allSlideNames = [...new Set([...leftSlides, ...rightSlides])].sort();

if (allSlideNames.length === 0) {
  console.error('No slide-NN.png files found in either directory.');
  process.exit(1);
}

const onlyInLeft  = leftSlides.filter(f => !rightSlides.includes(f));
const onlyInRight = rightSlides.filter(f => !leftSlides.includes(f));
const matched     = leftSlides.filter(f => rightSlides.includes(f));

console.log(`Left:  ${LEFT_DIR} (${leftSlides.length} slides)`);
console.log(`Right: ${RIGHT_DIR} (${rightSlides.length} slides)`);
console.log(`Matched: ${matched.length}  |  Only left: ${onlyInLeft.length}  |  Only right: ${onlyInRight.length}\n`);

// ---------------------------------------------------------------------------
// Prepare output directory
// ---------------------------------------------------------------------------
mkdirSync(OUT_DIR, { recursive: true });

// Copy source images into the output directory for the HTML report
const leftOutDir  = join(OUT_DIR, 'left');
const rightOutDir = join(OUT_DIR, 'right');
mkdirSync(leftOutDir, { recursive: true });
mkdirSync(rightOutDir, { recursive: true });

for (const f of leftSlides) {
  writeFileSync(join(leftOutDir, f), readFileSync(join(LEFT_DIR, f)));
}
for (const f of rightSlides) {
  writeFileSync(join(rightOutDir, f), readFileSync(join(RIGHT_DIR, f)));
}

// ---------------------------------------------------------------------------
// Compare matched slides
// ---------------------------------------------------------------------------

/** Read a PNG file and return a pngjs PNG object with RGBA data. */
function readPng(filePath) {
  const buffer = readFileSync(filePath);
  return PNG.sync.read(buffer);
}

/**
 * Compare two PNG files. Returns { diffPng, similarity, diffPixels, totalPixels }.
 * If images have different dimensions, the smaller one is padded (treated as mismatched pixels).
 */
function compareSlides(leftPath, rightPath) {
  const imgL = readPng(leftPath);
  const imgR = readPng(rightPath);

  // Use the larger dimensions as the canvas
  const width  = Math.max(imgL.width, imgR.width);
  const height = Math.max(imgL.height, imgR.height);

  // Expand images to the same dimensions if needed (pad with transparent black)
  const expandToSize = (img, w, h) => {
    if (img.width === w && img.height === h) return img.data;
    const buf = Buffer.alloc(w * h * 4, 0);
    for (let y = 0; y < img.height; y++) {
      const srcOffset = y * img.width * 4;
      const dstOffset = y * w * 4;
      img.data.copy(buf, dstOffset, srcOffset, srcOffset + img.width * 4);
    }
    return buf;
  };

  const dataL = expandToSize(imgL, width, height);
  const dataR = expandToSize(imgR, width, height);

  const diffPng = new PNG({ width, height });
  const totalPixels = width * height;

  const diffPixels = pixelmatch(dataL, dataR, diffPng.data, width, height, {
    threshold: THRESHOLD,
    alpha: 0.3,               // dim identical pixels to 30% opacity
    diffColor: [255, 0, 255], // magenta for different pixels
    diffColorAlt: [200, 0, 200],
    aaColor: [255, 255, 0],   // yellow for anti-aliased pixels
    includeAA: false,
  });

  const matchingPixels = totalPixels - diffPixels;
  const similarity = (matchingPixels / totalPixels) * 100;

  return { diffPng, similarity, diffPixels, totalPixels };
}

/** Results for each slide. */
const results = [];
let hasFailure = false;

for (const filename of allSlideNames) {
  const inLeft  = leftSlides.includes(filename);
  const inRight = rightSlides.includes(filename);

  if (inLeft && inRight) {
    // Matched pair — compare
    const leftPath  = join(LEFT_DIR, filename);
    const rightPath = join(RIGHT_DIR, filename);

    const { diffPng, similarity, diffPixels, totalPixels } = compareSlides(leftPath, rightPath);

    // Write diff image
    const diffFilename = `diff-${filename}`;
    const diffBuffer = PNG.sync.write(diffPng);
    writeFileSync(join(OUT_DIR, diffFilename), diffBuffer);

    const simStr = similarity.toFixed(2);
    const tag = similarity >= 95 ? 'OK' : similarity >= 80 ? 'WARN' : 'FAIL';
    console.log(`  ${filename}  ${simStr}% similar  [${tag}]  (${diffPixels.toLocaleString()} / ${totalPixels.toLocaleString()} pixels differ)`);

    if (similarity < 80) hasFailure = true;

    results.push({
      filename,
      status: 'matched',
      similarity,
      diffPixels,
      totalPixels,
      diffFilename,
    });
  } else {
    // Unmatched slide
    const side = inLeft ? 'left' : 'right';
    const label = inLeft ? LEFT_LABEL : RIGHT_LABEL;
    console.log(`  ${filename}  only in ${side} (${label})`);
    hasFailure = true;

    results.push({
      filename,
      status: `only-${side}`,
      similarity: 0,
      diffPixels: 0,
      totalPixels: 0,
      diffFilename: null,
    });
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
const matchedResults = results.filter(r => r.status === 'matched');
const avgSimilarity = matchedResults.length > 0
  ? matchedResults.reduce((sum, r) => sum + r.similarity, 0) / matchedResults.length
  : 0;

console.log(`\nOverall average similarity: ${avgSimilarity.toFixed(2)}%`);

// ---------------------------------------------------------------------------
// Generate HTML report
// ---------------------------------------------------------------------------
function similarityColor(sim) {
  if (sim >= 95) return '#4caf50'; // green
  if (sim >= 80) return '#ff9800'; // yellow/orange
  return '#f44336';                // red
}

function generateReport() {
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const avgColor = similarityColor(avgSimilarity);

  let slideRows = '';

  for (const r of results) {
    const num = r.filename.replace('slide-', '').replace('.png', '');

    if (r.status === 'matched') {
      const simColor = similarityColor(r.similarity);
      slideRows += `
    <div class="slide-section">
      <div class="slide-header">
        <span class="slide-num">Slide ${parseInt(num, 10)}</span>
        <span class="similarity" style="color: ${simColor}">
          ${r.similarity.toFixed(1)}% similar
        </span>
        <span class="diff-count">${r.diffPixels.toLocaleString()} pixels differ</span>
      </div>
      <div class="triple">
        <div class="col">
          <div class="col-label">${LEFT_LABEL}</div>
          <img src="left/${r.filename}" alt="${LEFT_LABEL} slide ${num}" onclick="showFullscreen(this)">
        </div>
        <div class="col">
          <div class="col-label">Diff</div>
          <img src="${r.diffFilename}" alt="Diff slide ${num}" onclick="showFullscreen(this)">
        </div>
        <div class="col">
          <div class="col-label">${RIGHT_LABEL}</div>
          <img src="right/${r.filename}" alt="${RIGHT_LABEL} slide ${num}" onclick="showFullscreen(this)">
        </div>
      </div>
    </div>`;
    } else {
      const side = r.status === 'only-left' ? 'left' : 'right';
      const label = side === 'left' ? LEFT_LABEL : RIGHT_LABEL;
      const otherLabel = side === 'left' ? RIGHT_LABEL : LEFT_LABEL;

      slideRows += `
    <div class="slide-section unmatched">
      <div class="slide-header">
        <span class="slide-num">Slide ${parseInt(num, 10)}</span>
        <span class="similarity" style="color: #f44336">Only in ${label}</span>
      </div>
      <div class="triple">
        <div class="col">
          <div class="col-label">${LEFT_LABEL}</div>
          ${side === 'left'
            ? `<img src="left/${r.filename}" alt="${LEFT_LABEL} slide ${num}" onclick="showFullscreen(this)">`
            : `<div class="empty">No slide</div>`}
        </div>
        <div class="col">
          <div class="col-label">Diff</div>
          <div class="empty">N/A</div>
        </div>
        <div class="col">
          <div class="col-label">${RIGHT_LABEL}</div>
          ${side === 'right'
            ? `<img src="right/${r.filename}" alt="${RIGHT_LABEL} slide ${num}" onclick="showFullscreen(this)">`
            : `<div class="empty">No slide</div>`}
        </div>
      </div>
    </div>`;
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deck Diff: ${LEFT_LABEL} vs ${RIGHT_LABEL}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0d1117;
      color: #e6edf3;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      padding: 2rem;
      line-height: 1.5;
    }
    h1 {
      text-align: center;
      font-size: 1.6rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .meta {
      text-align: center;
      color: #8b949e;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }
    .summary {
      text-align: center;
      font-size: 1.1rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }
    .summary .avg {
      font-size: 1.5rem;
      font-weight: 700;
    }
    .summary .stats {
      color: #8b949e;
      font-size: 0.85rem;
      margin-top: 0.4rem;
    }
    .slide-section {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      overflow: hidden;
    }
    .slide-section.unmatched {
      border-color: #f4433650;
    }
    .slide-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #30363d;
      background: #0d1117;
    }
    .slide-num {
      font-weight: 600;
      font-size: 0.9rem;
    }
    .similarity {
      font-weight: 700;
      font-size: 0.9rem;
    }
    .diff-count {
      color: #8b949e;
      font-size: 0.8rem;
      margin-left: auto;
    }
    .triple {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.5rem;
      padding: 0.75rem;
    }
    .col {
      display: flex;
      flex-direction: column;
    }
    .col-label {
      font-size: 0.7rem;
      color: #8b949e;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.3rem;
      text-align: center;
    }
    .col img {
      width: 100%;
      border-radius: 4px;
      border: 1px solid #30363d;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .col img:hover {
      border-color: #58a6ff;
    }
    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 16/9;
      background: #0d1117;
      border-radius: 4px;
      border: 1px dashed #30363d;
      color: #484f58;
      font-size: 0.8rem;
    }

    /* Fullscreen overlay */
    #overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.92);
      z-index: 1000;
      cursor: zoom-out;
      justify-content: center;
      align-items: center;
    }
    #overlay.active {
      display: flex;
    }
    #overlay img {
      max-width: 95vw;
      max-height: 95vh;
      border-radius: 8px;
      box-shadow: 0 0 40px rgba(0,0,0,0.5);
    }

    /* Legend */
    .legend {
      text-align: center;
      color: #8b949e;
      font-size: 0.75rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #30363d;
    }
    .legend span {
      margin: 0 0.75rem;
    }
    .legend .swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin-right: 4px;
      vertical-align: middle;
    }
  </style>
</head>
<body>
  <h1>Deck Diff</h1>
  <div class="meta">
    ${LEFT_LABEL} vs ${RIGHT_LABEL} &mdash; ${timestamp}
    &mdash; threshold: ${THRESHOLD}
  </div>

  <div class="summary">
    <div class="avg" style="color: ${avgColor}">
      ${avgSimilarity.toFixed(1)}% average similarity
    </div>
    <div class="stats">
      ${matched.length} matched slides
      ${onlyInLeft.length > 0 ? ` &middot; ${onlyInLeft.length} only in ${LEFT_LABEL}` : ''}
      ${onlyInRight.length > 0 ? ` &middot; ${onlyInRight.length} only in ${RIGHT_LABEL}` : ''}
    </div>
  </div>

  ${slideRows}

  <div class="legend">
    <span><span class="swatch" style="background: #ff00ff"></span> Different pixels (magenta)</span>
    <span><span class="swatch" style="background: #888"></span> Identical pixels (dimmed)</span>
    <span><span class="swatch" style="background: #4caf50"></span> &ge;95% similar</span>
    <span><span class="swatch" style="background: #ff9800"></span> 80-95% similar</span>
    <span><span class="swatch" style="background: #f44336"></span> &lt;80% similar</span>
  </div>

  <div id="overlay" onclick="hideFullscreen()">
    <img id="overlay-img" src="" alt="Fullscreen view">
  </div>

  <script>
    function showFullscreen(el) {
      const overlay = document.getElementById('overlay');
      const img = document.getElementById('overlay-img');
      img.src = el.src;
      img.alt = el.alt;
      overlay.classList.add('active');
    }
    function hideFullscreen() {
      document.getElementById('overlay').classList.remove('active');
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideFullscreen();
    });
  </script>
</body>
</html>`;

  writeFileSync(join(OUT_DIR, 'index.html'), html);
  console.log(`\nReport: ${join(OUT_DIR, 'index.html')}`);
}

generateReport();

// ---------------------------------------------------------------------------
// Exit
// ---------------------------------------------------------------------------
if (hasFailure) {
  console.log('\nFAILED: One or more slides below 80% similarity or unmatched.');
  process.exit(1);
} else {
  console.log('\nPASSED: All slides are at least 80% similar.');
}
