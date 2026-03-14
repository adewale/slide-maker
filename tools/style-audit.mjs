#!/usr/bin/env node

// style-audit.mjs — CSS-in-build verifier for Slidev decks
// Verifies that source CSS tokens and theme selectors survive the build pipeline.
//
// Usage:
//   ./style-audit.mjs                  # audit all built decks
//   ./style-audit.mjs cloudflare tufte # audit specific decks

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

// ── ANSI helpers ──────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';

const ok = (msg) => console.log(`  ${GREEN}✓${RESET} ${msg}`);
const fail = (msg) => console.log(`  ${RED}✗${RESET} ${msg}`);
const warn = (msg) => console.log(`  ${YELLOW}!${RESET} ${msg}`);
const heading = (msg) => console.log(`\n${BOLD}${CYAN}${msg}${RESET}`);
const divider = () => console.log(`${DIM}${'─'.repeat(60)}${RESET}`);

// ── Root paths ────────────────────────────────────────────────────────────────

const TOOLS_DIR = new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const REPO_ROOT = join(TOOLS_DIR, '..');
const EXAMPLES_DIR = join(REPO_ROOT, 'examples');
const DECKS_DIR = join(REPO_ROOT, 'decks');
const BUILD_DIR = join(EXAMPLES_DIR, '_build');

// ── CSS parsing helpers ───────────────────────────────────────────────────────

/**
 * Extract CSS custom property declarations from a :root block.
 * Returns an array of { name, value } objects.
 */
function extractTokens(css) {
  const tokens = [];
  // Match --property: value patterns inside :root { ... }
  const rootBlockRe = /:root\s*\{([^}]+)\}/gs;
  let rootMatch;
  while ((rootMatch = rootBlockRe.exec(css)) !== null) {
    const body = rootMatch[1];
    const propRe = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let propMatch;
    while ((propMatch = propRe.exec(body)) !== null) {
      tokens.push({
        name: propMatch[1].trim(),
        value: propMatch[2].trim(),
      });
    }
  }
  return tokens;
}

/**
 * Extract class selectors from CSS source.
 * Returns an array of unique selector strings like ".slidev-layout", ".cf-card".
 */
function extractClassSelectors(css) {
  const selectors = new Set();
  // Match class selectors — handles compound selectors like .slidev-layout.cover
  const re = /(\.[a-zA-Z_][\w-]*)/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    selectors.add(m[1]);
  }
  return [...selectors];
}

/**
 * Normalize a CSS value so minified and pretty-printed forms both match.
 *  - Collapses whitespace around commas and parens
 *  - Strips leading zeros from decimals: 0.6 -> .6
 * "rgba(82, 16, 0, 0.6)" -> "rgba(82,16,0,.6)"
 */
function normalizeCSS(str) {
  return str
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ',')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\b0+(\.\d+)/g, '$1');  // 0.6 -> .6
}

/**
 * Extract color-like literal values from token values.
 * Returns hex colors and rgb/rgba function calls.
 */
function extractColorValues(tokens) {
  const colors = [];
  for (const t of tokens) {
    const val = t.value;
    // Hex colors
    if (/^#[0-9a-fA-F]{3,8}$/.test(val)) {
      colors.push({ token: t.name, color: val.toLowerCase() });
    }
    // rgba(...) / rgb(...)
    const rgbMatch = val.match(/^(rgba?\([^)]+\))$/);
    if (rgbMatch) {
      colors.push({ token: t.name, color: normalizeCSS(rgbMatch[1]) });
    }
  }
  return colors;
}

// ── Build CSS loader ──────────────────────────────────────────────────────────

/**
 * Read and concatenate all CSS files from a build assets directory.
 */
function loadBuildCSS(assetsDir) {
  if (!existsSync(assetsDir)) return '';
  const files = readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
  return files
    .map((f) => {
      try {
        return readFileSync(join(assetsDir, f), 'utf-8');
      } catch {
        return '';
      }
    })
    .join('\n');
}

// ── Deck discovery ────────────────────────────────────────────────────────────

function discoverDecks() {
  if (!existsSync(BUILD_DIR)) {
    console.error(`${RED}Build directory not found: ${BUILD_DIR}${RESET}`);
    process.exit(1);
  }
  return readdirSync(BUILD_DIR).filter((name) => {
    const full = join(BUILD_DIR, name);
    return statSync(full).isDirectory() && name !== 'index.html';
  });
}

// ── Build-name to source-dir mapping ─────────────────────────────────────────

const BUILD_TO_SOURCE = { 'slide-maker': 'demo' };

// ── Audit one deck ────────────────────────────────────────────────────────────

function auditDeck(deckName) {
  const sourceName = BUILD_TO_SOURCE[deckName] || deckName;
  // Core decks live in examples/, local decks in decks/
  const examplesPath = join(EXAMPLES_DIR, sourceName);
  const decksPath = join(DECKS_DIR, sourceName);
  const sourceDir = existsSync(examplesPath) ? examplesPath : decksPath;
  const tokensPath = join(sourceDir, 'styles', 'tokens.css');
  const themePath = join(sourceDir, 'styles', 'theme.css');
  const buildAssetsDir = join(BUILD_DIR, deckName, 'assets');

  heading(`Deck: ${deckName}`);
  divider();

  // ── Preflight checks ─────────────────────────────────────────────────────

  if (!existsSync(sourceDir) || !statSync(sourceDir).isDirectory()) {
    fail(`Source directory not found: ${sourceDir}`);
    return { tokens: 0, tokensFound: 0, selectors: 0, selectorsFound: 0, colors: 0, colorsFound: 0, hasMissing: true };
  }

  if (!existsSync(tokensPath)) {
    fail(`tokens.css not found: ${tokensPath}`);
    return { tokens: 0, tokensFound: 0, selectors: 0, selectorsFound: 0, colors: 0, colorsFound: 0, hasMissing: true };
  }

  if (!existsSync(themePath)) {
    warn(`theme.css not found: ${themePath} (skipping selector checks)`);
  }

  if (!existsSync(buildAssetsDir)) {
    fail(`Build assets not found: ${buildAssetsDir}`);
    return { tokens: 0, tokensFound: 0, selectors: 0, selectorsFound: 0, colors: 0, colorsFound: 0, hasMissing: true };
  }

  // ── Load sources ──────────────────────────────────────────────────────────

  const tokensCSS = readFileSync(tokensPath, 'utf-8');
  const themeCSS = existsSync(themePath) ? readFileSync(themePath, 'utf-8') : '';
  const buildCSS = loadBuildCSS(buildAssetsDir);

  if (!buildCSS.length) {
    fail('No CSS content found in build assets');
    return { tokens: 0, tokensFound: 0, selectors: 0, selectorsFound: 0, colors: 0, colorsFound: 0, hasMissing: true };
  }

  const buildCSSLower = buildCSS.toLowerCase();
  const buildCSSNormalized = normalizeCSS(buildCSSLower);

  // ── 1. Token variable audit ───────────────────────────────────────────────

  const tokens = extractTokens(tokensCSS);
  let tokensFound = 0;

  console.log(`\n  ${BOLD}CSS Custom Properties${RESET} (${tokens.length} tokens)`);

  for (const token of tokens) {
    const defPattern = token.name + ':';              // --deck-bg:
    const refPattern = `var(${token.name})`;          // var(--deck-bg)
    const refPatternFallback = `var(${token.name},`;  // var(--deck-bg, ...)

    const hasDef = buildCSS.includes(defPattern);
    const hasRef = buildCSS.includes(refPattern) || buildCSS.includes(refPatternFallback);

    if (hasDef || hasRef) {
      tokensFound++;
      const where = [];
      if (hasDef) where.push('definition');
      if (hasRef) where.push('reference');
      ok(`${token.name}: ${DIM}${token.value}${RESET} ${DIM}(${where.join(' + ')})${RESET}`);
    } else {
      fail(`${token.name}: ${DIM}${token.value}${RESET} ${RED}— not found in build${RESET}`);
    }
  }

  // ── 2. Theme selector audit ───────────────────────────────────────────────

  // Focus on key Slidev and deck-specific selectors
  const KEY_SELECTOR_PREFIXES = [
    '.slidev-layout',
    '.slidev-vclick',
    '.cf-',
  ];

  const allSelectors = themeCSS ? extractClassSelectors(themeCSS) : [];

  // Filter to key selectors only — avoids noise from generic h1, p, etc.
  const keySelectors = allSelectors.filter((s) =>
    KEY_SELECTOR_PREFIXES.some((prefix) => s.startsWith(prefix))
  );

  let selectorsFound = 0;

  if (keySelectors.length) {
    console.log(`\n  ${BOLD}Theme Selectors${RESET} (${keySelectors.length} key selectors)`);

    for (const sel of keySelectors) {
      // In minified CSS the selector appears without spaces around { or with combined selectors
      if (buildCSS.includes(sel)) {
        selectorsFound++;
        ok(`${sel}`);
      } else {
        fail(`${sel} ${RED}— not found in build${RESET}`);
      }
    }
  }

  // ── 3. Color value audit ──────────────────────────────────────────────────

  const colors = extractColorValues(tokens);
  let colorsFound = 0;

  if (colors.length) {
    console.log(`\n  ${BOLD}Color Values${RESET} (${colors.length} literal colors)`);

    for (const c of colors) {
      // Check case-insensitively; use normalized form for rgba/rgb values
      const needle = c.color.toLowerCase();
      if (buildCSSLower.includes(needle) || buildCSSNormalized.includes(needle)) {
        colorsFound++;
        ok(`${c.color} ${DIM}(from ${c.token})${RESET}`);
      } else {
        fail(`${c.color} ${DIM}(from ${c.token})${RESET} ${RED}— not found in build${RESET}`);
      }
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────

  const hasMissing =
    tokensFound < tokens.length ||
    selectorsFound < keySelectors.length ||
    colorsFound < colors.length;

  console.log('');
  divider();

  const tokenStatus = tokensFound === tokens.length ? GREEN : RED;
  const selectorStatus = selectorsFound === keySelectors.length ? GREEN : RED;
  const colorStatus = colorsFound === colors.length ? GREEN : RED;

  console.log(`  Tokens:    ${tokenStatus}${tokensFound}/${tokens.length}${RESET}`);
  console.log(`  Selectors: ${selectorStatus}${selectorsFound}/${keySelectors.length}${RESET}`);
  console.log(`  Colors:    ${colorStatus}${colorsFound}/${colors.length}${RESET}`);

  if (!hasMissing) {
    console.log(`\n  ${GREEN}${BOLD}All checks passed.${RESET}`);
  } else {
    console.log(`\n  ${RED}${BOLD}Some checks failed — styles may be missing from the build.${RESET}`);
  }

  return {
    tokens: tokens.length,
    tokensFound,
    selectors: keySelectors.length,
    selectorsFound,
    colors: colors.length,
    colorsFound,
    hasMissing,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  // Help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${BOLD}style-audit.mjs${RESET} — CSS-in-build verifier for Slidev decks

${BOLD}Usage:${RESET}
  ./style-audit.mjs                     Audit all built decks
  ./style-audit.mjs <deck> [<deck>...]  Audit specific decks

${BOLD}What it checks:${RESET}
  1. CSS custom properties from styles/tokens.css appear in the build
     (both --var-name: definitions and var(--var-name) references)
  2. Key theme selectors from styles/theme.css appear in the build
     (.slidev-layout, .slidev-vclick-*, .cf-*, etc.)
  3. Literal color values from tokens appear in the build
     (#hex codes, rgb/rgba values)

${BOLD}Exit codes:${RESET}
  0  All decks passed
  1  One or more decks have missing styles
`);
    process.exit(0);
  }

  console.log(`\n${BOLD}╔══════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}║            CSS-in-Build Style Audit                     ║${RESET}`);
  console.log(`${BOLD}╚══════════════════════════════════════════════════════════╝${RESET}`);

  const decks = args.length > 0 ? args : discoverDecks();

  if (decks.length === 0) {
    console.error(`${RED}No decks found to audit.${RESET}`);
    process.exit(1);
  }

  console.log(`${DIM}Auditing ${decks.length} deck(s): ${decks.join(', ')}${RESET}`);

  let anyFailed = false;
  const results = [];

  for (const deck of decks) {
    const result = auditDeck(deck);
    results.push({ deck, ...result });
    if (result.hasMissing) anyFailed = true;
  }

  // ── Grand summary ───────────────────────────────────────────────────────

  if (decks.length > 1) {
    heading('Grand Summary');
    divider();

    const totalTokens = results.reduce((s, r) => s + r.tokens, 0);
    const totalTokensFound = results.reduce((s, r) => s + r.tokensFound, 0);
    const totalSelectors = results.reduce((s, r) => s + r.selectors, 0);
    const totalSelectorsFound = results.reduce((s, r) => s + r.selectorsFound, 0);
    const totalColors = results.reduce((s, r) => s + r.colors, 0);
    const totalColorsFound = results.reduce((s, r) => s + r.colorsFound, 0);

    for (const r of results) {
      const icon = r.hasMissing ? `${RED}FAIL${RESET}` : `${GREEN}PASS${RESET}`;
      console.log(`  ${icon}  ${r.deck}`);
    }

    console.log('');
    console.log(`  Total tokens:    ${totalTokensFound}/${totalTokens}`);
    console.log(`  Total selectors: ${totalSelectorsFound}/${totalSelectors}`);
    console.log(`  Total colors:    ${totalColorsFound}/${totalColors}`);
  }

  console.log('');

  if (anyFailed) {
    console.log(`${RED}${BOLD}Audit failed — some styles are missing from the build.${RESET}\n`);
    process.exit(1);
  } else {
    console.log(`${GREEN}${BOLD}Audit passed — all styles verified in build output.${RESET}\n`);
    process.exit(0);
  }
}

main();
