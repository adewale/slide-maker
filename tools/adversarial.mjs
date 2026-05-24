#!/usr/bin/env node
// adversarial.mjs — self-generating adversarial evals (#2 from the blog audit).
//
// The eval suite only tests failures we already imagined. This closes that loop:
// have agents author decks specifically designed to SLIP PAST the current gate
// while embodying a real defect. Any deck that passes clean is a "false pass" —
// a genuine blind spot to harden the checks against or canonicalize into the
// suite.
//
//   node tools/adversarial.mjs --emit <path>     # write authoring tasks
//   <orchestrating agent dispatches one sub-agent per blind spot to author
//    a deck under evals/adversarial/<slug>/ that passes deck-lint clean>
//   node tools/adversarial.mjs --screen [dir]    # screen them; report slips
//
// A "slipped" deck (deck-lint passes it clean) is the actionable finding.

import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { execSync } from 'node:child_process';

const C = { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', magenta: '\x1b[35m', cyan: '\x1b[36m' };
const toolsDir = resolve(import.meta.dirname || '.');
const repoRoot = resolve(toolsDir, '..');
const ADVERSARIAL_DIR = 'evals/adversarial';

// Blind spots the current static gate is known to miss. Each becomes an
// authoring task: build a deck that embodies the defect yet passes deck-lint.
const BLIND_SPOTS = [
  {
    slug: 'image-flashbang',
    targets: 'deck-lint flash-bang check (static, flat-color only)',
    intended_defect: 'A near-black cover followed by a near-white content slide, where the cover darkness comes from a per-slide `background:` IMAGE (or gradient), not a flat token color. The audience gets flash-banged; deck-lint cannot see image luminance.',
    authoring_hint: 'Use `background: <image-url>` frontmatter on a dark cover, then a normal light deck-bg slide next. Keep --deck-bg light so the static check sees no jump.',
    caught_by: 'tools/pixel-audit.mjs on rendered screenshots',
  },
  {
    slug: 'sanctioned-font-slop',
    targets: 'deck-lint slop font check + the visual rubric',
    intended_defect: 'Uses a preset-sanctioned font (e.g. Source Sans 3) so the font check passes, but is otherwise pure slop: an identical icon+heading+text card grid on every slide, a hero-metric cliche, flat type hierarchy, zero transitions variety.',
    authoring_hint: 'Valid tokens, sanctioned fonts, WCAG-passing contrast — but monotonous layout and no progressive reveal. The static checks pass; only judgment catches it.',
    caught_by: 'the LLM judge (visual rubric + held-out criteria)',
  },
  {
    slug: 'assertion-gaming',
    targets: 'deterministic string-match assertions',
    intended_defect: 'Contains the exact literal strings the assertions look for (e.g. "build.sh", a v-click tag) without any real substance behind them — keyword-stuffed to pass.',
    authoring_hint: 'Drop the trigger tokens into otherwise empty slides. Deterministic contains-checks pass; the deck says nothing.',
    caught_by: 'the held-out "memorability"/"compression" criteria',
  },
  {
    slug: 'unsourced-claims',
    targets: 'content quality (no static check exists)',
    intended_defect: 'Confident, specific-sounding but fabricated numbers ("3.2x faster", "cut latency 87%") presented as fact with no citation or provenance.',
    authoring_hint: 'Make the numbers concrete and unsourced. Nothing static flags them.',
    caught_by: 'the held-out "numerical integrity"/"skeptic test" criteria',
  },
];

function emit(outPath) {
  const doc = {
    skill: 'slide-maker',
    when: new Date().toISOString(),
    goal: 'Author decks that pass `node tools/deck-lint.mjs <dir>` CLEAN while embodying the intended defect. A clean pass proves the blind spot is real.',
    output_convention: `${ADVERSARIAL_DIR}/<slug>/ with deck.spec.md, slides.md, styles/{tokens,theme,index}.css, and intended.txt (one line: the defect this deck embodies)`,
    deck_template: 'Model structure on examples/demo. A deck must contain ALL deck-lint required files or it fails for the wrong reason: slides.md, styles/index.css, styles/tokens.css, styles/theme.css, global-bottom.vue, setup/mermaid-renderer.ts — copy global-bottom.vue and setup/mermaid-renderer.ts VERBATIM from examples/demo. styles/index.css must @import tokens.css and theme.css. Headmatter needs theme/colorSchema/fonts. tokens.css needs --deck-bg/-fg/-accent/-muted with WCAG AA contrast (fg:bg >= 4.5:1, accent:bg >= 4.5:1). Use var(--deck-*) tokens, never hardcoded hex inside <style scoped>.',
    blind_spots: BLIND_SPOTS,
    how_to_respond: `Dispatch one sub-agent per blind_spot. Each authors a complete deck under ${ADVERSARIAL_DIR}/<slug>/, writes intended.txt, and verifies it passes \`node tools/deck-lint.mjs ${ADVERSARIAL_DIR}/<slug>\` clean (iterate until it does — a deck that fails lint is not adversarial, it is just broken). Then screen all of them: node tools/adversarial.mjs --screen`,
  };
  const out = resolve(repoRoot, outPath);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(doc, null, 2));
  console.log(`${C.cyan}adversarial tasks written to ${outPath}${C.reset} ${C.dim}(${BLIND_SPOTS.length} blind spot(s))${C.reset}`);
  console.log(`${C.dim}dispatch one authoring sub-agent per blind_spot, then: node tools/adversarial.mjs --screen${C.reset}`);
}

function screen(dirArg) {
  const dir = resolve(repoRoot, dirArg || ADVERSARIAL_DIR);
  if (!existsSync(dir)) { console.error(`${C.red}no adversarial decks at ${dir} — emit + author first${C.reset}`); process.exit(2); }
  const decks = readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory() && existsSync(join(dir, e.name, 'slides.md')))
    .map(e => join(dir, e.name));
  if (!decks.length) { console.error(`${C.red}no decks with slides.md under ${dir}${C.reset}`); process.exit(2); }

  console.log(`${C.bold}${C.magenta}adversarial-screen${C.reset}  ${C.dim}${decks.length} deck(s)${C.reset}\n`);
  const slipped = [];
  for (const deck of decks) {
    const intended = existsSync(join(deck, 'intended.txt')) ? readFileSync(join(deck, 'intended.txt'), 'utf-8').trim() : '(no intended.txt)';
    let out = '';
    try { out = execSync(`node ${join(toolsDir, 'deck-lint.mjs')} ${deck}`, { cwd: repoRoot, encoding: 'utf-8' }); }
    catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
    const clean = out.replace(/\x1b\[[0-9;]*m/g, '');
    const caught = /\b(WARN|FAIL)\b/.test(clean) || /[○✗]/.test(clean);
    const status = caught ? `${C.green}caught${C.reset}` : `${C.red}${C.bold}SLIPPED${C.reset}`;
    console.log(`  ${status}  ${C.cyan}${basename(deck)}${C.reset} ${C.dim}— ${intended}${C.reset}`);
    if (!caught) slipped.push(basename(deck));
  }

  console.log('');
  if (slipped.length) {
    console.log(`  ${C.yellow}${C.bold}${slipped.length} false pass(es)${C.reset} ${C.yellow}— blind spots confirmed: ${slipped.join(', ')}${C.reset}`);
    console.log(`  ${C.dim}harden the checks (e.g. run pixel-audit / the LLM judge) or canonicalize these into evals.json${C.reset}`);
  } else {
    console.log(`  ${C.green}✓ every adversarial deck was caught by the static gate${C.reset}`);
  }
  process.exit(slipped.length ? 1 : 0);
}


function main() {
  const argv = process.argv.slice(2);
  const i = argv.indexOf('--emit');
  if (i !== -1) return emit(argv[i + 1] || join(ADVERSARIAL_DIR, 'tasks.json'));
  if (argv.includes('--screen')) {
    const si = argv.indexOf('--screen');
    return screen(argv[si + 1] && !argv[si + 1].startsWith('--') ? argv[si + 1] : null);
  }
  console.log('usage: node tools/adversarial.mjs --emit <path> | --screen [dir]');
  process.exit(2);
}

main();
