#!/usr/bin/env node
// gate-check.mjs — the two-sided fixture gate (Lessons 11 + 14).
//
// A gate needs testing from both directions:
//   • PRECISION (should-pass): known-good decks must lint CLEAN. A new warning
//     here is a false positive — exactly the mermaid-overflow and src-include
//     bugs we hit. This side guards against the gate getting too aggressive.
//   • RECALL (should-catch): each adversarial deck (evals/adversarial/*) embodies
//     a real defect and must be caught by SOME gate. The static linter is allowed
//     to miss it IF the deck declares a rendered/judge catcher (intended.txt /
//     caught_by) — but a defect caught by NOTHING is an open hole.
//
// Usage:  node tools/gate-check.mjs [--json <path>] [--record] [--trend]
//   --record   append this run's per-deck warning counts to evals/gate-history.jsonl
//   --trend    show gallery-wide lint drift over time, then exit (Lesson 12 for
//              the static gate: watch the warning distribution, not one run)
// Exits non-zero if precision is broken (a clean deck warned) or a defect is
// caught by no gate at all.

import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { execSync } from 'node:child_process';

const C = { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', magenta: '\x1b[35m', cyan: '\x1b[36m' };
const CHECK = `${C.green}✓${C.reset}`, CROSS = `${C.red}✗${C.reset}`, DOT = `${C.yellow}○${C.reset}`;
const toolsDir = resolve(import.meta.dirname || '.');
const repoRoot = resolve(toolsDir, '..');
const HISTORY = 'evals/gate-history.jsonl';

// Friendly deck label: bare-numeric fixture dirs become "fixtures/0".
const label = (d) => /^\d+$/.test(basename(d)) ? `${basename(dirname(d))}/${basename(d)}` : basename(d);

function discover(dir) {
  const abs = join(repoRoot, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs, { withFileTypes: true })
    .filter(e => e.isDirectory() && existsSync(join(abs, e.name, 'slides.md')))
    .map(e => join(abs, e.name));
}

// deck-lint resolves CLI paths relative to tools/, so pass absolute paths.
function lint(deckDir) {
  let out = '';
  try { out = execSync(`node ${join(toolsDir, 'deck-lint.mjs')} ${deckDir}`, { cwd: repoRoot, encoding: 'utf-8' }); }
  catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  const clean = out.replace(/\x1b\[[0-9;]*m/g, '');
  const flagged = /\b(WARN|FAIL)\b/.test(clean) || /[○✗]/.test(clean);
  const findings = clean.split('\n').filter(l => /[○✗]/.test(l)).map(l => l.replace(/^\s*[○✗]\s*/, '').trim());
  return { flagged, findings };
}

function showTrend(limit = 10) {
  const p = join(repoRoot, HISTORY);
  if (!existsSync(p)) { console.log(`${C.dim}no gate history yet — run with --record first${C.reset}`); return; }
  const recs = readFileSync(p, 'utf-8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const recent = recs.slice(-limit);
  console.log(`${C.bold}${C.magenta}gate-trend${C.reset}  ${C.dim}last ${recent.length} of ${recs.length} run(s)${C.reset}\n`);
  console.log(`  ${C.dim}${'when'.padEnd(20)} ${'clean'.padStart(6)} ${'warned'.padStart(7)} ${'warnΣ'.padStart(6)}${C.reset}`);
  for (const r of recent) {
    console.log(`  ${r.when.slice(0, 19).replace('T', ' ').padEnd(20)} ${String(r.clean).padStart(6)} ${String(r.warned).padStart(7)} ${String(r.totalWarnings).padStart(6)}`);
  }
  console.log('');
  if (recent.length >= 2) {
    const a = recent[recent.length - 2], b = recent[recent.length - 1];
    const dw = b.totalWarnings - a.totalWarnings;
    if (Math.abs(dw) >= 1) console.log(`  ${DOT} ${C.yellow}gallery warnings moved ${dw > 0 ? '+' : ''}${dw} (${a.totalWarnings}→${b.totalWarnings}) — investigate which check or deck changed${C.reset}`);
    else console.log(`  ${CHECK} no drift in gallery warning count`);
  }
}

function main() {
  if (process.argv.includes('--trend')) { showTrend(); return; }
  const json = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
  const record = process.argv.includes('--record');

  // should-pass: deliverable gallery decks only. (evals/fixtures are minimal
  // eval *inputs* graded by assertions, not full deliverables — they
  // intentionally omit global-bottom.vue etc., so they don't belong in a
  // "must lint clean" set. Lesson 14: categorize honestly, don't weaken checks.)
  const shouldPass = [...discover('examples'), ...discover('generated-decks')];
  // should-catch: adversarial decks, each with an intended defect
  const shouldCatch = discover('evals/adversarial');

  console.log(`${C.bold}${C.magenta}gate-check${C.reset}  ${C.dim}precision: ${shouldPass.length} should-pass · recall: ${shouldCatch.length} adversarial${C.reset}\n`);

  // ── PRECISION ──
  console.log(`${C.bold}precision (should-pass → lint clean)${C.reset}`);
  const falsePositives = [];
  let totalWarnings = 0, warnedDecks = 0;
  for (const d of shouldPass) {
    const { flagged, findings } = lint(d);
    if (flagged) { warnedDecks++; totalWarnings += findings.length; falsePositives.push({ deck: label(d), findings }); console.log(`  ${CROSS} ${label(d)} ${C.red}— warned (false positive)${C.reset}`); for (const f of findings.slice(0, 3)) console.log(`     ${C.dim}${f}${C.reset}`); }
    else console.log(`  ${CHECK} ${C.dim}${label(d)}${C.reset}`);
  }

  // ── RECALL ──
  console.log(`\n${C.bold}recall (adversarial → caught by some gate)${C.reset}`);
  const uncaught = [];
  for (const d of shouldCatch) {
    const { flagged } = lint(d);
    const intended = existsSync(join(d, 'intended.txt')) ? readFileSync(join(d, 'intended.txt'), 'utf-8').trim() : '';
    const declaresOtherGate = /caught by|pixel-audit|render-gate|judge|held-out|holdout/i.test(intended);
    if (flagged) console.log(`  ${CHECK} ${label(d)} ${C.dim}— caught by static deck-lint${C.reset}`);
    else if (declaresOtherGate) console.log(`  ${DOT} ${C.yellow}${label(d)}${C.reset} ${C.dim}— slips static; covered by rendered/judge${C.reset}`);
    else { uncaught.push(label(d)); console.log(`  ${CROSS} ${C.red}${label(d)} — caught by NO gate (open hole)${C.reset}`); }
  }

  // ── verdict ──
  console.log('');
  const broken = falsePositives.length + uncaught.length;
  if (falsePositives.length) console.log(`  ${CROSS} ${C.red}${falsePositives.length} precision regression(s): ${falsePositives.map(f => f.deck).join(', ')}${C.reset}`);
  if (uncaught.length) console.log(`  ${CROSS} ${C.red}${uncaught.length} defect(s) caught by no gate: ${uncaught.join(', ')}${C.reset}`);
  if (!broken) console.log(`  ${CHECK} ${C.green}gate sound: ${shouldPass.length} clean decks pass, every adversarial defect is covered${C.reset}`);

  if (record) {
    const rec = { when: new Date().toISOString(), clean: shouldPass.length - warnedDecks, warned: warnedDecks, totalWarnings, uncaught: uncaught.length };
    const hp = join(repoRoot, HISTORY); mkdirSync(dirname(hp), { recursive: true });
    appendFileSync(hp, JSON.stringify(rec) + '\n');
    console.log(`  ${C.dim}appended to ${HISTORY} — drift: node tools/gate-check.mjs --trend${C.reset}`);
  }
  if (json) {
    const out = resolve(repoRoot, json); mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify({ when: new Date().toISOString(), totalWarnings, warnedDecks, falsePositives, uncaught, shouldPass: shouldPass.map(label), shouldCatch: shouldCatch.map(label) }, null, 2));
    console.log(`  ${C.dim}report → ${json}${C.reset}`);
  }
  process.exit(broken ? 1 : 0);
}

main();
