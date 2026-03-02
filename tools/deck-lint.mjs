#!/usr/bin/env node

// deck-lint.mjs — Structural validator for Slidev deck directories
// Usage:  node deck-lint.mjs [deck1] [deck2] ...
//         node deck-lint.mjs            (scans all subdirs with slides.md)

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, basename, resolve } from 'path';

// ── Terminal colours ──────────────────────────────────────────────

const C = process.stdout.isTTY
  ? {
      reset:   '\x1b[0m',
      bold:    '\x1b[1m',
      dim:     '\x1b[2m',
      red:     '\x1b[31m',
      green:   '\x1b[32m',
      yellow:  '\x1b[33m',
      cyan:    '\x1b[36m',
      magenta: '\x1b[35m',
      white:   '\x1b[37m',
      bgRed:   '\x1b[41m',
      bgGreen: '\x1b[42m',
      bgYellow:'\x1b[43m',
    }
  : Object.fromEntries(
      ['reset','bold','dim','red','green','yellow','cyan','magenta','white','bgRed','bgGreen','bgYellow']
        .map(k => [k, ''])
    );

const PASS = `${C.bgGreen}${C.bold}${C.white} PASS ${C.reset}`;
const WARN = `${C.bgYellow}${C.bold}${C.white} WARN ${C.reset}`;
const FAIL = `${C.bgRed}${C.bold}${C.white} FAIL ${C.reset}`;

const CHECK  = `${C.green}\u2713${C.reset}`;
const CROSS  = `${C.red}\u2717${C.reset}`;
const BULLET = `${C.yellow}\u25CB${C.reset}`;

// ── Constants ─────────────────────────────────────────────────────

const REQUIRED_FILES = [
  'slides.md',
  'styles/index.css',
  'styles/tokens.css',
  'styles/theme.css',
];

const REQUIRED_TOKENS_DEFAULT = ['--deck-bg', '--deck-fg', '--deck-accent', '--deck-muted'];
const REQUIRED_TOKENS_THEMED = ['--deck-fg'];
const THEMED_THEMES = ['seriph', 'apple-basic'];
const REQUIRED_TOKENS = [
];

const REQUIRED_FM_FIELDS = ['theme', 'colorSchema', 'fonts'];
const OPTIONAL_FM_FIELDS = ['transition', 'layout', 'title'];

const REQUIRED_THEME_SELECTORS = [
  '.slidev-layout',
  '.slidev-vclick-target',
  '.slidev-vclick-hidden',
];

const BULLET_OVERFLOW_THRESHOLD = 7;
const CODE_OVERFLOW_THRESHOLD = 8;

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Parse YAML frontmatter from markdown.
 * Returns an object with extracted key/value pairs.
 * This is a minimal parser — handles the subset used in Slidev frontmatter.
 */
function parseFrontmatter(md) {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};
  let currentKey = null;
  let currentIndent = 0;
  let nestedObj = null;

  for (const line of yaml.split('\n')) {
    // Skip blank lines and comments
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.length - line.trimStart().length;
    const trimmed = line.trim();

    // Nested key: value under a parent
    if (indent > 0 && currentKey && nestedObj !== null) {
      const kvMatch = trimmed.match(/^([^:]+):\s*(.+)$/);
      if (kvMatch) {
        nestedObj[kvMatch[1].trim()] = kvMatch[2].trim();
      }
      continue;
    }

    // Top-level key: value
    const topMatch = trimmed.match(/^([^:]+):\s*(.*)$/);
    if (topMatch) {
      const key = topMatch[1].trim();
      const val = topMatch[2].trim();
      if (val === '' || val === undefined) {
        // Start of nested object
        currentKey = key;
        nestedObj = {};
        result[key] = nestedObj;
        currentIndent = indent;
      } else {
        result[key] = val;
        currentKey = key;
        nestedObj = null;
      }
    }
  }

  return result;
}

/**
 * Extract CSS custom property names from :root blocks in a CSS file.
 */
function extractRootTokens(css) {
  const tokens = [];
  // Match all :root { ... } blocks
  const rootBlocks = css.matchAll(/:root\s*\{([^}]+)\}/g);
  for (const block of rootBlocks) {
    const body = block[1];
    const props = body.matchAll(/(--[\w-]+)\s*:/g);
    for (const prop of props) {
      tokens.push(prop[1]);
    }
  }
  return tokens;
}

/**
 * Extract var(--xxx) references from CSS content.
 */
function extractVarReferences(css) {
  const refs = new Set();
  const matches = css.matchAll(/var\((--[\w-]+)[,)]/g);
  for (const m of matches) {
    refs.add(m[1]);
  }
  return refs;
}

/**
 * Extract @import paths from CSS content.
 */
function extractImports(css) {
  const imports = [];
  const matches = css.matchAll(/@import\s+['"]([^'"]+)['"]/g);
  for (const m of matches) {
    imports.push(m[1]);
  }
  return imports;
}

/**
 * Check if a CSS string contains a selector (approximate match).
 */
function hasSelector(css, selector) {
  // Escape dots for regex, allow anything before the opening brace
  const escaped = selector.replace(/\./g, '\\.').replace(/\s+/g, '\\s+');
  const re = new RegExp(`(^|[},\\s])${escaped}(\\s|,|\\.|\\{)`, 'm');
  return re.test(css);
}

/**
 * Split slides.md into individual slides by --- delimiters.
 * Returns array of { index, frontmatter, body }.
 */
function splitSlides(md) {
  // Remove the document-level frontmatter first
  const fmMatch = md.match(/^---\r?\n[\s\S]*?\r?\n---/);
  const afterFm = fmMatch ? md.slice(fmMatch[0].length) : md;

  const slides = [];
  // Split on horizontal rules (---) that act as slide separators
  // Slidev uses --- optionally followed by per-slide frontmatter
  const parts = afterFm.split(/\n---\s*\n/);

  for (let i = 0; i < parts.length; i++) {
    const raw = parts[i].trim();
    if (!raw) continue;

    // Check if this part starts with per-slide frontmatter
    let body = raw;
    let fm = null;
    const perSlideMatch = raw.match(/^([^#\-*`<\n][\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
    if (perSlideMatch) {
      fm = perSlideMatch[1].trim();
      body = perSlideMatch[2].trim();
    } else {
      // Could also be just frontmatter with --- at end
      const fmOnly = raw.match(/^([^#\-*`<\n][\s\S]*?)\r?\n---\s*$/);
      if (fmOnly) {
        fm = fmOnly[1].trim();
        body = '';
      }
    }

    slides.push({ index: i + 2, frontmatter: fm, body }); // +2: slide 1 is the cover
  }

  return slides;
}

/**
 * Scan a slide body for overflow issues:
 * - Bullet lists with more than N items
 * - Code blocks with more than M lines
 */
function checkOverflow(md) {
  const warnings = [];

  // ── Bullet list overflow ──
  // Find contiguous runs of lines starting with - or * (possibly inside <v-clicks>)
  const lines = md.split('\n');
  let bulletRun = 0;
  let bulletStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/^[-*]\s+/.test(trimmed)) {
      if (bulletRun === 0) bulletStart = i + 1;
      bulletRun++;
    } else {
      if (bulletRun > BULLET_OVERFLOW_THRESHOLD) {
        warnings.push(
          `bullet list has ${bulletRun} items (>${BULLET_OVERFLOW_THRESHOLD}) near line ${bulletStart}`
        );
      }
      bulletRun = 0;
    }
  }
  // Trailing run
  if (bulletRun > BULLET_OVERFLOW_THRESHOLD) {
    warnings.push(
      `bullet list has ${bulletRun} items (>${BULLET_OVERFLOW_THRESHOLD}) near line ${bulletStart}`
    );
  }

  // ── Code block overflow ──
  const codeBlocks = md.matchAll(/```[\s\S]*?```/g);
  for (const block of codeBlocks) {
    const blockLines = block[0].split('\n');
    // Subtract the opening and closing ``` lines
    const codeLines = blockLines.length - 2;
    if (codeLines > CODE_OVERFLOW_THRESHOLD) {
      // Find approximate line number in the original
      const offset = md.indexOf(block[0]);
      const lineNo = md.slice(0, offset).split('\n').length;
      warnings.push(
        `code block has ${codeLines} lines (>${CODE_OVERFLOW_THRESHOLD}) near line ${lineNo}`
      );
    }
  }

  return warnings;
}

// ── Deck Linter ───────────────────────────────────────────────────

function lintDeck(deckDir) {
  const name = basename(deckDir);
  const errors = [];
  const warns = [];
  const info = [];

  // ─── 1. Required files ───────────────────────────────────────

  const missingFiles = [];
  const presentFiles = [];

  for (const relPath of REQUIRED_FILES) {
    const full = join(deckDir, relPath);
    if (!existsSync(full)) {
      missingFiles.push(relPath);
      errors.push(`missing required file: ${relPath}`);
    } else {
      presentFiles.push(relPath);
    }
  }

  // Check for optional deck.spec.md
  if (existsSync(join(deckDir, 'deck.spec.md'))) {
    info.push('deck.spec.md present');
  } else {
    warns.push('deck.spec.md not found (optional but recommended)');
  }

  // Early exit if critical files are missing
  if (!existsSync(join(deckDir, 'slides.md'))) {
    return { name, errors, warns, info };
  }

  // ─── 2. styles/index.css imports ─────────────────────────────

  if (existsSync(join(deckDir, 'styles/index.css'))) {
    const indexCss = readFileSync(join(deckDir, 'styles/index.css'), 'utf-8');
    const imports = extractImports(indexCss);
    const importPaths = imports.map(p => p.replace(/^\.\//, ''));

    if (!importPaths.includes('tokens.css')) {
      errors.push('styles/index.css does not @import tokens.css');
    } else {
      info.push('index.css imports tokens.css');
    }

    if (!importPaths.includes('theme.css')) {
      errors.push('styles/index.css does not @import theme.css');
    } else {
      info.push('index.css imports theme.css');
    }

    // If transitions.css exists, it should be imported
    const hasTransitionsFile = existsSync(join(deckDir, 'styles/transitions.css'));
    const importsTransitions = importPaths.includes('transitions.css');

    if (hasTransitionsFile && !importsTransitions) {
      warns.push('styles/transitions.css exists but is not imported in index.css');
    }
    if (hasTransitionsFile && importsTransitions) {
      info.push('index.css imports transitions.css');
    }
  }

  // ─── 3. Frontmatter validation ──────────────────────────────

  const slidesMd = readFileSync(join(deckDir, 'slides.md'), 'utf-8');
  const fm = parseFrontmatter(slidesMd);

  if (!fm) {
    errors.push('slides.md has no YAML frontmatter');
  } else {
    const FONTS_OPTIONAL_THEMES = ['seriph', 'apple-basic'];
    for (const field of REQUIRED_FM_FIELDS) {
      if (fm[field] === undefined || fm[field] === '') {
        if (field === 'theme') {
          warns.push(`frontmatter: "${field}" field missing (will use default)`);
        } else if (field === 'fonts' && FONTS_OPTIONAL_THEMES.includes(fm.theme)) {
          info.push(`frontmatter: fonts omitted (native fonts for ${fm.theme})`);
        } else {
          warns.push(`frontmatter: "${field}" field missing`);
        }
      } else {
        info.push(`frontmatter: ${field} = ${typeof fm[field] === 'object' ? JSON.stringify(fm[field]) : fm[field]}`);
      }
    }

    // Check optional fields for information
    for (const field of OPTIONAL_FM_FIELDS) {
      if (fm[field]) {
        info.push(`frontmatter: ${field} = ${fm[field]}`);
      }
    }
  }

  // ─── 4. Token extraction and validation ─────────────────────

  if (existsSync(join(deckDir, 'styles/tokens.css'))) {
    const tokensCss = readFileSync(join(deckDir, 'styles/tokens.css'), 'utf-8');
    const tokens = extractRootTokens(tokensCss);

    if (tokens.length === 0) {
      errors.push('styles/tokens.css has no :root custom properties');
    } else {
      info.push(`tokens.css defines ${tokens.length} custom properties`);
    }

    // Check required tokens (theme-aware)
    const reqTokens = THEMED_THEMES.includes(fm?.theme)
      ? REQUIRED_TOKENS_THEMED
      : REQUIRED_TOKENS_DEFAULT;
    for (const req of reqTokens) {
      if (!tokens.includes(req)) {
        errors.push(`missing required token: ${req}`);
      }
    }

    // ─── 5. Token usage across deck files ─────────────────────

    // Collect var() references from all relevant files in the deck
    const usedVars = new Set();

    // Helper: read a file and collect its var(--*) references
    function collectVarRefs(filePath) {
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf-8');
        for (const v of extractVarReferences(content)) usedVars.add(v);
        return content;
      }
      return null;
    }

    // Helper: scan a directory for files matching extensions and collect refs
    function collectVarRefsFromDir(dirPath, extensions) {
      if (!existsSync(dirPath)) return;
      try {
        const entries = readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          if (!entry.isFile()) continue;
          if (extensions.some(ext => entry.name.endsWith(ext))) {
            collectVarRefs(join(dirPath, entry.name));
          }
        }
      } catch { /* skip unreadable dirs */ }
    }

    // styles/theme.css (also used for selector checks below)
    const themeCss = collectVarRefs(join(deckDir, 'styles/theme.css'));

    // Other style files
    collectVarRefs(join(deckDir, 'styles/index.css'));
    collectVarRefs(join(deckDir, 'styles/transitions.css'));

    // Top-level Vue files
    collectVarRefs(join(deckDir, 'global-top.vue'));
    collectVarRefs(join(deckDir, 'global-bottom.vue'));

    // slides.md may contain inline <style> blocks
    collectVarRefs(join(deckDir, 'slides.md'));

    // components/*.vue and layouts/*.vue
    collectVarRefsFromDir(join(deckDir, 'components'), ['.vue', '.css']);
    collectVarRefsFromDir(join(deckDir, 'layouts'), ['.vue', '.css']);

    // Any other .vue or .css files at the deck root
    collectVarRefsFromDir(deckDir, ['.vue', '.css']);

    const unreferenced = tokens.filter(t => !usedVars.has(t));
    if (unreferenced.length > 0) {
      for (const t of unreferenced) {
        warns.push(`token ${t} defined in tokens.css but not referenced in any deck file`);
      }
    }

    const allReferenced = tokens.filter(t => usedVars.has(t));
    if (allReferenced.length > 0) {
      info.push(`${allReferenced.length}/${tokens.length} declared tokens are referenced`);
    }

    // ─── 6. Required theme selectors ──────────────────────────

    if (themeCss) {
      for (const sel of REQUIRED_THEME_SELECTORS) {
        if (!hasSelector(themeCss, sel)) {
          warns.push(`theme.css missing expected selector: ${sel}`);
        }
      }
    }
  }

  // ─── 7. Slide overflow checks ───────────────────────────────

  // Check the whole file for code block overflow, and per-slide for bullets
  const slides = splitSlides(slidesMd);

  // Also check the first slide (cover) body
  const coverMatch = slidesMd.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*?)(?=\n---\s*\n|$)/);
  if (coverMatch) {
    const coverOverflow = checkOverflow(coverMatch[1]);
    for (const w of coverOverflow) {
      warns.push(`slide 1 (cover): ${w}`);
    }
  }

  for (const slide of slides) {
    const fullContent = (slide.frontmatter || '') + '\n' + slide.body;
    const overflowWarns = checkOverflow(fullContent);
    for (const w of overflowWarns) {
      warns.push(`slide ${slide.index}: ${w}`);
    }
  }

  // ─── 8. Token bypass detection in scoped styles ────────────────

  // Extract all <style scoped> blocks from slides.md
  const scopedBlocks = [...slidesMd.matchAll(/<style\s+scoped\s*>([\s\S]*?)<\/style>/g)];

  if (scopedBlocks.length > 0) {
    // Rule 1: Token bypass — hardcoded hex/rgb in background or color properties
    // Only match standalone "background" and "color" properties, not border-color etc.
    let bypassCount = 0;
    for (const block of scopedBlocks) {
      const css = block[1];
      const offset = slidesMd.slice(0, block.index).split('\n').length;
      const lines = css.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip comment lines
        if (/^\s*\/[/*]/.test(line)) continue;
        // Match only standalone background or color (not border-color, outline-color, etc.)
        const propMatch = line.match(/(?:^|[{;\s])(background|color)\s*:\s*(.+)/i);
        if (!propMatch) continue;
        // Ensure we didn't match a hyphenated prefix (e.g., border-color, background-color)
        const matchStart = line.indexOf(propMatch[0]);
        if (matchStart > 0 && line[matchStart] !== '{' && line[matchStart] !== ';' && !/\s/.test(line[matchStart])) {
          // Could be part of a longer property name — check char before match
          const charBefore = line[matchStart - 1];
          if (charBefore === '-') continue;
        }
        const value = propMatch[2];
        // Skip if the value contains var() references (mixed usage is acceptable)
        if (/var\(/.test(value)) continue;
        // Check for literal hex (#xxx, #xxxxxx, #xxxxxxxx)
        if (/#[0-9a-fA-F]{3,8}\b/.test(value)) {
          warns.push(`token bypass: hardcoded hex in scoped style near line ${offset + i + 1} — use var(--deck-*) instead`);
          bypassCount++;
        }
        // Check for literal rgb/rgba — skip decorative tints (background with opacity < 0.2)
        if (/rgba?\s*\(/.test(value)) {
          const prop = propMatch[1].toLowerCase();
          const opacityMatch = value.match(/rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/);
          if (prop === 'background' && opacityMatch && parseFloat(opacityMatch[1]) < 0.2) {
            // Decorative tint on background — not a palette bypass
            continue;
          }
          warns.push(`token bypass: hardcoded rgb in scoped style near line ${offset + i + 1} — use var(--deck-*) instead`);
          bypassCount++;
        }
      }
    }
    if (bypassCount > 0) {
      info.push(`${bypassCount} token bypass warning(s) in scoped styles`);
    }

    // Rule 2: Low-opacity contrast check (text color properties only)
    const colorSchema = fm?.colorSchema || 'dark';
    const opacityThreshold = colorSchema === 'light' ? 0.6 : 0.5;
    for (const block of scopedBlocks) {
      const css = block[1];
      const offset = slidesMd.slice(0, block.index).split('\n').length;
      // Split CSS into individual declarations for accurate property matching
      const declarations = css.replace(/\{/g, ';\n').replace(/\}/g, ';\n').split(';');
      let lineAccum = 0;
      for (const decl of declarations) {
        const trimmed = decl.trim();
        lineAccum += (decl.match(/\n/g) || []).length;
        // Only check standalone "color:" declarations (not border-color, background, etc.)
        const colorMatch = trimmed.match(/^color\s*:\s*(.+)/i);
        if (!colorMatch) continue;
        const value = colorMatch[1];
        const rgbaMatches = [...value.matchAll(/rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/g)];
        for (const m of rgbaMatches) {
          const opacity = parseFloat(m[1]);
          if (opacity < opacityThreshold) {
            warns.push(`low-opacity rgba (${opacity}) near line ${offset + lineAccum + 1} may fail WCAG AA contrast (${colorSchema} scheme threshold: ${opacityThreshold})`);
          }
        }
      }
    }

    // Rule 3: Palette consistency — too many distinct hardcoded backgrounds
    const bgColors = new Set();
    for (const block of scopedBlocks) {
      const css = block[1];
      const bgMatches = [...css.matchAll(/background\s*:\s*(#[0-9a-fA-F]{3,8})/gi)];
      for (const m of bgMatches) {
        bgColors.add(m[1].toLowerCase());
      }
    }
    if (bgColors.size > 3) {
      warns.push(`palette drift: ${bgColors.size} distinct hardcoded background colors across scoped styles (max 3 recommended) — use token variants instead`);
    }
  }

  return { name, errors, warns, info };
}

// ── Deck Discovery ────────────────────────────────────────────────

function discoverDecks(rootDir) {
  const decks = [];

  // Check the root directory itself
  if (existsSync(join(rootDir, 'slides.md'))) {
    decks.push(rootDir);
  }

  // Scan subdirectories
  let entries;
  try {
    entries = readdirSync(rootDir, { withFileTypes: true });
  } catch {
    return decks;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    // Skip hidden dirs, node_modules, build outputs, templates
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
    if (['node_modules', 'templates'].includes(entry.name)) continue;

    const subDir = join(rootDir, entry.name);
    if (existsSync(join(subDir, 'slides.md'))) {
      decks.push(subDir);
    }
  }

  return decks;
}

// ── Report Output ─────────────────────────────────────────────────

function printReport(result) {
  const { name, errors, warns, info } = result;

  // Determine overall status
  let status;
  if (errors.length > 0) {
    status = FAIL;
  } else if (warns.length > 0) {
    status = WARN;
  } else {
    status = PASS;
  }

  console.log('');
  console.log(`${status} ${C.bold}${C.cyan}${name}${C.reset}`);
  console.log(`${C.dim}${'─'.repeat(50)}${C.reset}`);

  if (errors.length > 0) {
    for (const e of errors) {
      console.log(`  ${CROSS} ${C.red}${e}${C.reset}`);
    }
  }

  if (warns.length > 0) {
    for (const w of warns) {
      console.log(`  ${BULLET} ${C.yellow}${w}${C.reset}`);
    }
  }

  if (info.length > 0) {
    for (const i of info) {
      console.log(`  ${CHECK} ${C.dim}${i}${C.reset}`);
    }
  }
}

function printSummary(results) {
  const total = results.length;
  const passing = results.filter(r => r.errors.length === 0 && r.warns.length === 0).length;
  const warning = results.filter(r => r.errors.length === 0 && r.warns.length > 0).length;
  const failing = results.filter(r => r.errors.length > 0).length;

  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarns = results.reduce((sum, r) => sum + r.warns.length, 0);

  console.log('');
  console.log(`${C.bold}${'═'.repeat(50)}${C.reset}`);
  console.log(`${C.bold}Summary${C.reset}  ${total} deck${total !== 1 ? 's' : ''} scanned`);
  console.log('');

  if (passing > 0) {
    console.log(`  ${C.green}${C.bold}${passing}${C.reset}${C.green} passing${C.reset}`);
  }
  if (warning > 0) {
    console.log(`  ${C.yellow}${C.bold}${warning}${C.reset}${C.yellow} with warnings${C.reset} ${C.dim}(${totalWarns} total)${C.reset}`);
  }
  if (failing > 0) {
    console.log(`  ${C.red}${C.bold}${failing}${C.reset}${C.red} failing${C.reset} ${C.dim}(${totalErrors} errors)${C.reset}`);
  }

  console.log('');
}

// ── Main ──────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const toolsDir = resolve(import.meta.dirname || '.');
  const examplesDir = resolve(toolsDir, '..', 'examples');

  let deckDirs;

  if (args.length > 0) {
    // Explicit deck directories supplied
    deckDirs = args.map(arg => {
      const resolved = resolve(toolsDir, arg);
      if (!existsSync(resolved)) {
        console.error(`${C.red}Error: "${arg}" does not exist${C.reset}`);
        process.exit(1);
      }
      return resolved;
    });
  } else {
    // Auto-discover all decks in examples/
    deckDirs = discoverDecks(examplesDir);
    if (deckDirs.length === 0) {
      console.error(`${C.red}No decks found (no subdirectories with slides.md)${C.reset}`);
      process.exit(1);
    }
  }

  console.log(`${C.bold}${C.magenta}deck-lint${C.reset}  ${C.dim}Slidev deck structural validator${C.reset}`);
  console.log(`${C.dim}scanning ${deckDirs.length} deck${deckDirs.length !== 1 ? 's' : ''}...${C.reset}`);

  const results = [];

  for (const dir of deckDirs) {
    results.push(lintDeck(dir));
  }

  // Sort: failing first, then warnings, then passing
  results.sort((a, b) => {
    const scoreA = a.errors.length > 0 ? 0 : a.warns.length > 0 ? 1 : 2;
    const scoreB = b.errors.length > 0 ? 0 : b.warns.length > 0 ? 1 : 2;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return a.name.localeCompare(b.name);
  });

  for (const result of results) {
    printReport(result);
  }

  printSummary(results);

  // Exit code: 1 if any failures, 0 otherwise
  const hasFailures = results.some(r => r.errors.length > 0);
  process.exit(hasFailures ? 1 : 0);
}

main();
