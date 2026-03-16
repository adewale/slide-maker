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
  'global-bottom.vue',
  'setup/mermaid-renderer.ts',
];

const REQUIRED_TOKENS_DEFAULT = ['--deck-bg', '--deck-fg', '--deck-accent', '--deck-muted'];
// All themes need all 4 tokens — Beautiful Mermaid reads --deck-bg and --deck-muted
// for auto-theming regardless of which Slidev theme is in use
const REQUIRED_TOKENS_THEMED = ['--deck-bg', '--deck-fg', '--deck-accent', '--deck-muted'];
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

/**
 * Parse Mermaid options from the fenced code block annotation.
 * E.g., " {theme: 'dark', scale: 0.65}" → { theme: 'dark', scale: 0.65 }
 */
function parseMermaidOptions(annotation) {
  const opts = {};
  const themeMatch = annotation.match(/theme\s*:\s*['"]?([^'",}\s]+)['"]?/);
  if (themeMatch) opts.theme = themeMatch[1];
  const scaleMatch = annotation.match(/scale\s*:\s*([\d.]+)/);
  if (scaleMatch) opts.scale = parseFloat(scaleMatch[1]);
  return opts;
}

/**
 * Count approximate node count in a Mermaid graph/flowchart diagram.
 * Returns 0 for non-flowchart types (skipping the node-count check).
 */
function countMermaidNodes(code) {
  const lines = code.split('\n');
  const firstLine = lines.find(l => l.trim())?.trim() || '';
  const type = firstLine.split(/[\s{]/)[0].toLowerCase();
  if (type !== 'graph' && type !== 'flowchart') return 0;

  const nodeIds = new Set();
  const SKIP_RE = /^(%%|style\s|classDef\s|class\s|click\s|linkStyle\s|subgraph\s|end$)/;
  const KEYWORDS = new Set(['subgraph', 'end', 'direction', 'TB', 'TD', 'BT', 'RL', 'LR']);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || SKIP_RE.test(trimmed)) continue;
    if (/^(graph|flowchart)\s/i.test(trimmed)) continue;
    const stripped = trimmed
      .replace(/\["[^"]*"\]/g, '').replace(/\("[^"]*"\)/g, '')
      .replace(/\{"[^"]*"\}/g, '').replace(/\|[^|]*\|/g, '');
    for (const m of stripped.matchAll(/\b([A-Za-z]\w*)\b/g)) {
      if (!KEYWORDS.has(m[1])) nodeIds.add(m[1]);
    }
  }
  return nodeIds.size;
}

/**
 * Parse a hex color string to [r, g, b] in 0-255 range.
 * Handles #rgb, #rrggbb, #rrggbbaa.
 */
function parseHex(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (hex.length < 6) return null;
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

/**
 * WCAG 2.1 relative luminance of a hex color.
 * Uses the sRGB linearization formula, not the naive weighted average.
 * Returns 0 (black) to 1 (white).
 */
function relativeLuminance(hex) {
  const rgb = parseHex(hex);
  if (!rgb) return 0.5;
  const [r, g, b] = rgb.map(c => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * WCAG 2.1 contrast ratio between two hex colors.
 * Returns a value >= 1. Higher is more contrast.
 * WCAG AA requires 4.5:1 for normal text, 3:1 for large text.
 */
function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Backward-compatible luminance (used by existing fill/text contrast heuristic).
 */
function hexLuminance(hex) {
  const rgb = parseHex(hex);
  if (!rgb) return 0.5;
  return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
}

/**
 * Format a contrast ratio for display: "4.5:1"
 */
function formatRatio(ratio) {
  return `${ratio.toFixed(1)}:1`;
}

/**
 * Validate Mermaid diagram syntax for common issues that cause rendering failures.
 * Returns an array of warning strings.
 */
function checkMermaidSyntax(code, slideIndex) {
  const warnings = [];
  const lines = code.split('\n');

  // Detect diagram type from first non-empty line
  const firstLine = lines.find(l => l.trim())?.trim() || '';
  const diagramType = firstLine.split(/[\s{]/)[0].toLowerCase();

  // ── Unquoted special characters in node IDs ──
  // Mermaid node IDs with / | \ < > break parsing unless quoted in ["..."]
  // Note: & is valid Mermaid syntax (parallel connections), so we don't flag it
  const BREAKING_CHARS = /[/\\|<>]/;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    // Skip non-content lines
    if (!trimmed || trimmed.startsWith('%%') || trimmed.startsWith('style ') ||
        trimmed.startsWith('class ') || trimmed.startsWith('classDef ') ||
        trimmed.startsWith('click ') || trimmed.startsWith('linkStyle ')) continue;
    // Skip the diagram type declaration line
    if (i === lines.indexOf(lines.find(l => l.trim()))) continue;

    // Strip quoted node labels ["..."], ("..."), {"..."} — these are safe
    const withoutQuoted = trimmed
      .replace(/\["[^"]*"\]/g, '___Q___')
      .replace(/\("[^"]*"\)/g, '___Q___')
      .replace(/\{"[^"]*"\}/g, '___Q___');

    // Strip edge labels |text| — valid Mermaid link label syntax
    const withoutEdgeLabels = withoutQuoted.replace(/\|[^|]*\|/g, '');

    // Also strip arrow syntax (-->, ---, -.-, ==>)
    const withoutArrows = withoutEdgeLabels.replace(/[-=.]+>/g, ' ').replace(/[-=.]{2,}/g, ' ');

    // Check remaining text for node IDs containing breaking characters
    // Match word tokens that look like node IDs
    const tokens = withoutArrows.split(/\s+/).filter(t => t.length > 0 && t !== '___Q___');
    for (const token of tokens) {
      // Strip trailing brackets
      const id = token.replace(/[\[({}\])]+$/, '').replace(/^[\[({}\])]+/, '');
      if (id && BREAKING_CHARS.test(id)) {
        warnings.push(`slide ${slideIndex}: Mermaid node ID "${id}" contains "${id.match(BREAKING_CHARS)[0]}" — wrap in ["..."] to prevent parse errors`);
      }
    }
  }

  // ── Unbalanced brackets in node labels ──
  const bracketPairs = [['[', ']'], ['(', ')'], ['{', '}']];
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || trimmed.startsWith('%%') || trimmed.startsWith('style ') ||
        trimmed.startsWith('classDef ') || trimmed.startsWith('class ')) continue;
    for (const [open, close] of bracketPairs) {
      const openCount = (trimmed.match(new RegExp('\\' + open, 'g')) || []).length;
      const closeCount = (trimmed.match(new RegExp('\\' + close, 'g')) || []).length;
      if (openCount !== closeCount && openCount > 0) {
        warnings.push(`slide ${slideIndex}: Mermaid syntax — unbalanced "${open}${close}" on line: ${trimmed.slice(0, 60)}`);
      }
    }
  }

  // ── Mindmap-specific syntax issues ──
  // Mindmaps use indentation-based trees, not flowchart bracket notation ["..."]
  if (diagramType === 'mindmap') {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (!trimmed || trimmed.startsWith('%%')) continue;
      if (i === lines.indexOf(lines.find(l => l.trim()))) continue; // skip diagram type line
      if (/\["[^"]*"\]/.test(trimmed)) {
        warnings.push(`slide ${slideIndex}: Mermaid mindmap uses flowchart bracket syntax ["..."] — mindmaps only support plain text, (rounded), ((cloud)), or [square] node shapes`);
        break; // one warning per diagram is enough
      }
    }
  }

  // ── Emoji in node labels ──
  const EMOJI_RE = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/u;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || trimmed.startsWith('%%')) continue;
    if (EMOJI_RE.test(trimmed)) {
      warnings.push(`slide ${slideIndex}: Mermaid diagram contains emoji — use plain text in node labels`);
      break;
    }
  }

  // ── Style/classDef: explicit color + contrast ──
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const styleMatch = trimmed.match(/^(style|classDef)\s+(\S+)\s+(.*)/);
    if (!styleMatch) continue;
    const [, directive, name, props] = styleMatch;
    const hasFill = /(?:^|[,\s])fill\s*:/.test(props);
    const hasColor = /(?:^|[,\s])color\s*:/.test(props);

    if (hasFill && !hasColor) {
      warnings.push(`slide ${slideIndex}: Mermaid ${directive} "${name}" has fill but no explicit color — text may be invisible`);
      continue;
    }

    if (hasFill && hasColor) {
      const fillHex = props.match(/(?:^|[,\s])fill\s*:\s*(#[0-9a-fA-F]{3,8})/)?.[1];
      const colorHex = props.match(/(?:^|[,\s])color\s*:\s*(#[0-9a-fA-F]{3,8})/)?.[1];
      if (fillHex && colorHex) {
        const ratio = contrastRatio(fillHex, colorHex);
        if (ratio < 3.0) {
          warnings.push(`slide ${slideIndex}: Mermaid node "${name}" — ${colorHex} on ${fillHex} = ${formatRatio(ratio)} (WCAG AA needs 3:1 for large text)`);
        }
      }
    }
  }

  // ── Unstyled nodes in flowcharts ──
  // Mermaid default colors are unreliable — nodes without explicit styling
  // often render as invisible blobs, especially with theme: 'dark'
  if (diagramType === 'graph' || diagramType === 'flowchart') {
    const hasStyleDirective = lines.some(l => /^\s*(style|classDef)\s/.test(l));
    const nodeCount = countMermaidNodes(code);
    if (nodeCount > 0 && !hasStyleDirective) {
      warnings.push(`slide ${slideIndex}: Mermaid flowchart has ${nodeCount} nodes but no style/classDef — nodes may be unreadable (add explicit fill and color)`);
    }

    // ── CRAP Contrast: linkStyle default required ──
    const hasLinkStyle = lines.some(l => /^\s*linkStyle\s+(default|[\d])/.test(l));
    if (nodeCount > 1 && !hasLinkStyle) {
      warnings.push(`slide ${slideIndex}: Mermaid flowchart missing linkStyle default — arrow lines may be invisible on the slide background`);
    }

    // ── Edge labels produce black boxes on all backgrounds ──
    const hasEdgeLabels = lines.some(l => /-->\|/.test(l) || /-->\s*\|/.test(l) || /-\.->\|/.test(l));
    if (hasEdgeLabels) {
      warnings.push(`slide ${slideIndex}: Mermaid flowchart uses edge labels (-->|text|) — these render as unthemeable black boxes. Remove labels and explain flow in body text.`);
    }

    // ── CRAP Contrast: classDef assignment completeness ──
    // Every defined classDef must be assigned to at least one node
    const classDefNames = new Set();
    const assignedClasses = new Set();
    for (const line of lines) {
      const cdMatch = line.trim().match(/^classDef\s+(\S+)\s/);
      if (cdMatch) classDefNames.add(cdMatch[1]);
      const assignMatch = line.trim().match(/^class\s+(.+?)\s+(\S+)\s*$/);
      if (assignMatch) assignedClasses.add(assignMatch[2]);
    }
    for (const cd of classDefNames) {
      if (!assignedClasses.has(cd)) {
        warnings.push(`slide ${slideIndex}: Mermaid classDef "${cd}" defined but never assigned to any node`);
      }
    }
  }

  // ── Non-flowchart types on dark backgrounds ──
  const DARK_UNSAFE_TYPES = ['sequencediagram', 'statediagram', 'statediagram-v2', 'classdiagram', 'erdiagram'];
  if (DARK_UNSAFE_TYPES.includes(diagramType)) {
    // Mark for caller to check against colorSchema
    warnings.push(`__DARK_CHECK__:slide ${slideIndex}: Mermaid ${diagramType} — unreadable on dark backgrounds (Beautiful Mermaid auto-theming fails). Convert to flowchart or use only on light-bg decks.`);
  }

  // ── Missing diagram type ──
  const KNOWN_TYPES = [
    'graph', 'flowchart', 'sequencediagram', 'classdiagram', 'statediagram',
    'statediagram-v2', 'erdiagram', 'gantt', 'pie', 'journey', 'gitgraph',
    'mindmap', 'timeline', 'quadrantchart', 'xychart-beta', 'block-beta',
    'sankey-beta', 'packet-beta',
  ];
  if (!KNOWN_TYPES.includes(diagramType)) {
    warnings.push(`slide ${slideIndex}: Mermaid diagram type "${diagramType}" not recognized — may fail to render`);
  }

  return warnings;
}

/**
 * Extract Sources: blocks from HTML comments in a slide body.
 * Returns array of source strings (e.g., "https://..." or "file:...").
 */
function extractSources(body) {
  const sources = [];
  const commentBlocks = [...body.matchAll(/<!--([\s\S]*?)-->/g)];
  for (const block of commentBlocks) {
    const comment = block[1];
    // Find the Sources: section within the comment
    const sourcesMatch = comment.match(/Sources:\s*\n([\s\S]*?)$/i);
    if (!sourcesMatch) continue;
    const lines = sourcesMatch[1].split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        sources.push(trimmed.slice(2).trim());
      }
    }
  }
  return sources;
}

/**
 * Determine whether a slide needs Sources: citations.
 * Exempt layouts (cover, section, end) return false.
 * Slides with presenter notes (HTML comments) return true.
 */
function slideNeedsSources(fm, body) {
  const fmStr = fm || '';
  // Exempt layouts
  if (/layout\s*:\s*(cover|section|end)\b/i.test(fmStr)) return false;
  // Check for HTML comments (presenter notes)
  if (/<!--[\s\S]*?-->/.test(body)) return true;
  return false;
}

const WAR_STORY_KEYWORDS = /\b(broke|failed|bug|incident|crashed|retreated|regressed|outage|mistake|wrong|disaster|emergency|panic|surprise|surprised|unexpected|2\.3\s*GB)\b/i;

// High-signal terms for internal consistency checking
const CONSISTENCY_TERMS = ['unicode', 'ascii', 'emoji', 'gpu', 'stateless', 'stateful'];

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

    // ─── 4b. Token contrast verification (WCAG AA) ──────────

    // Extract token hex values from the CSS
    function extractTokenValue(css, tokenName) {
      const re = new RegExp(`${tokenName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*([^;]+);`);
      const m = css.match(re);
      if (!m) return null;
      const val = m[1].trim();
      // Only check hex colors — skip rgba, var() references, font families
      if (/^#[0-9a-fA-F]{3,8}$/.test(val)) return val;
      return null;
    }

    const bgHex = extractTokenValue(tokensCss, '--deck-bg');
    const fgHex = extractTokenValue(tokensCss, '--deck-fg');
    const accentHex = extractTokenValue(tokensCss, '--deck-accent');

    if (bgHex && fgHex) {
      const ratio = contrastRatio(bgHex, fgHex);
      if (ratio < 4.5) {
        errors.push(`WCAG AA fail: --deck-fg (${fgHex}) on --deck-bg (${bgHex}) = ${formatRatio(ratio)} (need 4.5:1)`);
      } else {
        info.push(`contrast --deck-fg on --deck-bg: ${formatRatio(ratio)}`);
      }
    }

    if (bgHex && accentHex) {
      const ratio = contrastRatio(bgHex, accentHex);
      if (ratio < 3.0) {
        errors.push(`WCAG AA fail: --deck-accent (${accentHex}) on --deck-bg (${bgHex}) = ${formatRatio(ratio)} (need 3:1 for large text)`);
      } else if (ratio < 4.5) {
        warns.push(`WCAG AA marginal: --deck-accent (${accentHex}) on --deck-bg (${bgHex}) = ${formatRatio(ratio)} (passes 3:1 for large text, fails 4.5:1 for body)`);
      } else {
        info.push(`contrast --deck-accent on --deck-bg: ${formatRatio(ratio)}`);
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

    // Required tokens are always consumed (Beautiful Mermaid reads --deck-bg,
    // --deck-fg, --deck-accent, --deck-muted via getComputedStyle at runtime)
    // so only warn about unreferenced non-required tokens.
    const requiredSet = new Set(REQUIRED_TOKENS_DEFAULT);
    const unreferenced = tokens.filter(t => !usedVars.has(t) && !requiredSet.has(t));
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

      // ── CRAP Alignment: cover layout must set explicit alignment ──
      if (hasSelector(themeCss, '.slidev-layout.cover') || /\.slidev-layout\.cover\b/.test(themeCss)) {
        const coverBlock = themeCss.match(/\.slidev-layout\.cover\s*\{([^}]+)\}/);
        if (coverBlock) {
          const coverProps = coverBlock[1];
          if (!/align-items\s*:/.test(coverProps)) {
            warns.push('CRAP alignment: .slidev-layout.cover missing align-items — cover text alignment may conflict with theme defaults');
          }
          if (!/text-align\s*:/.test(coverProps)) {
            warns.push('CRAP alignment: .slidev-layout.cover missing text-align — cover text alignment may conflict with theme defaults');
          }
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

  // ─── 9. Closing slide check ──────────────────────────────────────

  if (slides.length > 0) {
    const lastSlide = slides[slides.length - 1];
    const lastFm = lastSlide.frontmatter || '';
    const lastBody = lastSlide.body || '';
    const isEndLayout = /layout\s*:\s*end/i.test(lastFm);
    const hasCodeBlock = /```/.test(lastBody);
    if (isEndLayout && hasCodeBlock) {
      warns.push('closing slide contains install command — should echo opening question/metaphor instead');
    }
  }

  // ─── 10. v-click density check ─────────────────────────────────

  const contentSlides = slides.filter(s => {
    const fm = s.frontmatter || '';
    return !/layout\s*:\s*(cover|end)/i.test(fm);
  });

  if (contentSlides.length > 0) {
    const vclickSlides = contentSlides.filter(s => {
      const full = (s.frontmatter || '') + '\n' + s.body;
      return /v-click|<v-clicks>/.test(full);
    });
    const density = vclickSlides.length / contentSlides.length;
    if (density > 0.5) {
      warns.push(`v-click density ${Math.round(density * 100)}% — consider whether all reveals serve rhetorical purpose`);
    }
  }

  // ─── 11. Mermaid annotation check ──────────────────────────────

  for (const slide of slides) {
    const body = slide.body || '';
    if (/```mermaid/.test(body)) {
      // Check if there's meaningful text after the mermaid block
      const afterMermaid = body.replace(/```mermaid[\s\S]*?```/g, '').trim();
      // Remove HTML tags, frontmatter-like lines, and blank lines
      const meaningfulText = afterMermaid
        .replace(/<[^>]+>/g, '')
        .replace(/^(layout|transition|class)\s*:.*/gm, '')
        .replace(/^<!--[\s\S]*?-->/gm, '')
        .trim();
      if (meaningfulText.length < 10) {
        warns.push(`slide ${slide.index}: Mermaid diagram without insight annotation — add explanation of what to notice`);
      }
    }
  }

  // ─── 12. Mermaid syntax and options validation ─────────────────────

  for (const slide of slides) {
    const body = slide.body || '';
    const mermaidBlocks = [...body.matchAll(/```mermaid([^\n]*)\n([\s\S]*?)```/g)];
    for (const block of mermaidBlocks) {
      const annotation = block[1];
      const code = block[2];

      // Content syntax checks
      const mermaidIssues = checkMermaidSyntax(code, slide.index);
      const colorSchema = fm?.colorSchema || 'dark';
      const isDark = colorSchema === 'dark';
      for (const issue of mermaidIssues) {
        // __DARK_CHECK__ issues only apply to dark-bg decks
        if (issue.startsWith('__DARK_CHECK__:')) {
          if (isDark) {
            warns.push(issue.replace('__DARK_CHECK__:', ''));
          }
        } else {
          warns.push(issue);
        }
      }

      // Options: theme and scale must be explicit
      const opts = parseMermaidOptions(annotation);
      if (!opts.theme) {
        warns.push(`slide ${slide.index}: Mermaid diagram missing explicit theme — add {theme: 'base'} or {theme: 'neutral'}`);
      }
      if (opts.scale == null) {
        warns.push(`slide ${slide.index}: Mermaid diagram missing explicit scale — add {scale: 0.85}`);
      }

      // Node count vs scale (flowcharts only)
      if (opts.scale != null) {
        const nodeCount = countMermaidNodes(code);
        if (nodeCount >= 6 && opts.scale > 0.8) {
          warns.push(`slide ${slide.index}: Mermaid diagram has ${nodeCount} nodes at scale ${opts.scale} — consider scale 0.7–0.8 for 6+ nodes`);
        }
      }
    }
  }

  // ─── 13. Source citation coverage ──────────────────────────────

  for (const slide of slides) {
    const body = slide.body || '';
    const fm = slide.frontmatter || '';
    if (slideNeedsSources(fm, body)) {
      const sources = extractSources(body);
      if (sources.length === 0) {
        warns.push(`slide ${slide.index}: has presenter notes but no Sources: block`);
      } else {
        // Validate format: entries must start with https:// or file:
        for (const src of sources) {
          if (!src.startsWith('https://') && !src.startsWith('file:')) {
            warns.push(`slide ${slide.index}: source "${src.slice(0, 50)}" must start with https:// or file:`);
          }
        }
      }
    }
  }

  // Also check cover slide (slide 1) — only if it has notes and isn't exempt
  if (coverMatch) {
    const coverBody = coverMatch[1];
    if (/<!--[\s\S]*?-->/.test(coverBody)) {
      const coverSources = extractSources(coverBody);
      // Cover is exempt unless subtitle is factual — we warn gently
      // Skip cover check by default (exempt layout)
    }
  }

  // ─── 14. War story sourcing ──────────────────────────────────

  for (const slide of slides) {
    const body = slide.body || '';
    const fm = slide.frontmatter || '';
    const fullContent = fm + '\n' + body;

    // Check if slide has war-story keywords in notes
    const commentBlocks = [...body.matchAll(/<!--([\s\S]*?)-->/g)];
    for (const block of commentBlocks) {
      const noteText = block[1];
      // Strip the Sources: section from the note text before checking keywords
      const noteWithoutSources = noteText.replace(/Sources:\s*\n[\s\S]*$/i, '');
      if (WAR_STORY_KEYWORDS.test(noteWithoutSources)) {
        const sources = extractSources(body);
        if (sources.length === 0) {
          warns.push(`slide ${slide.index}: war-story language in notes but no source citations`);
        }
      }
    }

    // Also check slide body text for war-story keywords
    const bodyWithoutComments = body.replace(/<!--[\s\S]*?-->/g, '');
    if (WAR_STORY_KEYWORDS.test(bodyWithoutComments)) {
      const sources = extractSources(body);
      if (sources.length === 0) {
        warns.push(`slide ${slide.index}: war-story language in slide body but no source citations`);
      }
    }
  }

  // ─── 15. Broken HTML comments (nested -->) ─────────────────────

  for (const slide of slides) {
    const body = slide.body || '';
    // Strip fenced code blocks before counting — --> inside ```...``` is safe
    const withoutCode = body.replace(/```[\s\S]*?```/g, '');
    const openCount = (withoutCode.match(/<!--/g) || []).length;
    const closeCount = (withoutCode.match(/-->/g) || []).length;
    if (closeCount > openCount) {
      warns.push(`slide ${slide.index}: HTML comment contains literal '-->' which breaks Slidev's comment parser — remove or encode the inner arrow`);
    }
  }

  // ─── 16. Internal consistency ────────────────────────────────

  // Build a map of term usage: { term: [{ slide, positive, negative }] }
  const termUsage = {};
  for (const term of CONSISTENCY_TERMS) {
    termUsage[term] = [];
  }

  for (const slide of slides) {
    const body = slide.body || '';
    const bodyWithoutComments = body.replace(/<!--[\s\S]*?-->/g, '');
    const bodyLower = bodyWithoutComments.toLowerCase();

    for (const term of CONSISTENCY_TERMS) {
      if (!bodyLower.includes(term)) continue;

      // Check for negation patterns
      const negationRe = new RegExp(`\\b(no|without|zero|never|not|non-?)\\s+${term}\\b`, 'i');
      const positiveRe = new RegExp(`\\b${term}\\b`, 'i');

      const isNegated = negationRe.test(bodyWithoutComments);
      const isPositive = positiveRe.test(bodyWithoutComments) && !isNegated;

      if (isNegated || isPositive) {
        termUsage[term].push({
          slide: slide.index,
          negative: isNegated,
          positive: isPositive,
        });
      }
    }
  }

  // Flag contradictions
  for (const term of CONSISTENCY_TERMS) {
    const usages = termUsage[term];
    const negatives = usages.filter(u => u.negative);
    const positives = usages.filter(u => u.positive);

    if (negatives.length > 0 && positives.length > 0) {
      const negSlides = negatives.map(u => u.slide).join(', ');
      const posSlides = positives.map(u => u.slide).join(', ');
      warns.push(`internal contradiction: slide ${negSlides} negates "${term}" but slide ${posSlides} uses it positively`);
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
  const repoRoot = resolve(toolsDir, '..');
  const examplesDir = resolve(repoRoot, 'examples');
  const decksDir = resolve(repoRoot, 'decks');

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
    // Auto-discover decks in both examples/ (core) and decks/ (local)
    const coreDirs = discoverDecks(examplesDir);
    const localDirs = existsSync(decksDir) ? discoverDecks(decksDir) : [];
    deckDirs = [...coreDirs, ...localDirs];
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
