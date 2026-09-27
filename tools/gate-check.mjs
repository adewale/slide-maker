#!/usr/bin/env node
// gate-check.mjs — the two-sided fixture gate (Lessons 11 + 14).
//
// A gate needs testing from both directions:
//   • PRECISION (should-pass): known-good decks must lint CLEAN. A new warning
//     here is a false positive — exactly the mermaid-overflow and src-include
//     bugs we hit. This side guards against the gate getting too aggressive.
//   • RECALL (should-catch): each adversarial deck (evals/adversarial/*) embodies
//     a real defect and must be caught by SOME gate. The static linter is allowed
//     to miss it IF the deck declares another catcher in intended.txt ("Caught by:").
//     A declaration is not a catch, so each deck gets one of these labels:
//       caught (deck-lint)          static lint flagged it — executed here
//       caught (<tool>, executed)   --run-catchers built the deck and ran the
//                                   declared rendered catcher, and it fired
//       declared, unverified        the declared catcher was NOT run: an LLM
//                                   judge/held-out rubric (never run here), or a
//                                   rendered catcher without --run-catchers
//       NOT caught                  no catcher, or the executed catcher missed it
//
// Usage:  node tools/gate-check.mjs [--run-catchers] [--json <path>] [--record] [--trend]
//   --run-catchers  build each statically-missed adversarial deck and run its
//                   declared rendered catcher (pixel-audit / render-gate); needs
//                   Chromium. LLM-judge catchers are never run here.
//   --record   append this run's per-deck warning counts to evals/gate-history.jsonl
//   --trend    show gallery-wide lint drift over time, then exit (Lesson 12 for
//              the static gate: watch the warning distribution, not one run)
// Exits 1 if precision is broken (a clean deck warned), a defect has no catcher,
// or an executed catcher missed its defect; 2 if a catcher could not run.
// "declared, unverified" does not fail, but it is reported as exactly that.

import { existsSync, readFileSync, readdirSync, mkdirSync, mkdtempSync, rmSync, writeFileSync, appendFileSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync, spawnSync } from 'node:child_process';

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

// The catcher an adversarial deck declares in intended.txt ("Caught by: ...").
function declaredCatcher(intended) {
  const m = intended.match(/caught by:?\s*([\s\S]+)$/i);
  const text = (m ? m[1] : intended).trim();
  if (/pixel-audit/i.test(text)) return { kind: 'rendered', tool: 'pixel-audit', text };
  if (/render-gate/i.test(text)) return { kind: 'rendered', tool: 'render-gate', text };
  if (/judge|held-out|holdout/i.test(text)) return { kind: 'judge', tool: 'LLM judge / held-out rubric', text };
  return null;
}

class CatcherError extends Error {}

function run(cmd, args, opts) {
  const r = spawnSync(cmd, args, { encoding: 'utf-8', ...opts });
  if (r.error) throw new CatcherError(`${cmd} ${args[0]}: ${r.error.message}`);
  return r;
}

// Build the deck the way tools/build.py does (base /<name>/), render it with
// render-gate, then run the declared tool on the rendered screenshots.
// Returns true if the catcher fired, false if it ran and missed.
function runRenderedCatcher(deckDir, tool) {
  const name = basename(deckDir);
  const work = mkdtempSync(join(tmpdir(), `gate-check-${name}-`));
  try {
    const dist = join(work, name), shots = join(work, 'shots');
    const build = run('npx', ['slidev', 'build', '--base', `/${name}/`, '--out', dist], { cwd: deckDir });
    if (build.status !== 0) throw new CatcherError(`slidev build failed (exit ${build.status}): ${(build.stderr || build.stdout).trim().split('\n').slice(-3).join(' | ')}`);
    const gate = run('node', [join(toolsDir, 'render-gate.mjs'), dist, '--name', name, '--shots', shots], { cwd: repoRoot });
    if (gate.status !== 0 && gate.status !== 1) throw new CatcherError(`render-gate could not run (exit ${gate.status}): ${gate.stderr.trim().split('\n').pop()}`);
    if (tool === 'render-gate') return gate.status === 1;
    const audit = run('node', [join(toolsDir, 'pixel-audit.mjs'), join(shots, 'desktop')], { cwd: repoRoot });
    if (audit.status !== 0 && audit.status !== 1) throw new CatcherError(`pixel-audit could not run (exit ${audit.status}): ${audit.stderr.trim().split('\n').pop()}`);
    return audit.status === 1;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
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
  const runCatchers = process.argv.includes('--run-catchers');

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
  console.log(`\n${C.bold}recall (adversarial → caught by an executed gate?)${C.reset}`);
  const uncaught = [], unverified = [], verified = [], catcherErrors = [], recall = [];
  for (const d of shouldCatch) {
    const { flagged } = lint(d);
    const intended = existsSync(join(d, 'intended.txt')) ? readFileSync(join(d, 'intended.txt'), 'utf-8').trim() : '';
    const catcher = declaredCatcher(intended);
    const deck = label(d);
    if (flagged) {
      verified.push(deck); recall.push({ deck, status: 'caught', by: 'deck-lint' });
      console.log(`  ${CHECK} ${deck} ${C.dim}— caught (deck-lint)${C.reset}`);
    } else if (!catcher) {
      uncaught.push(deck); recall.push({ deck, status: 'not-caught', by: null });
      console.log(`  ${CROSS} ${C.red}${deck} — NOT caught: slips deck-lint and declares no other catcher${C.reset}`);
    } else if (catcher.kind === 'rendered' && runCatchers) {
      try {
        if (runRenderedCatcher(d, catcher.tool)) {
          verified.push(deck); recall.push({ deck, status: 'caught', by: `${catcher.tool} (executed)` });
          console.log(`  ${CHECK} ${deck} ${C.dim}— caught (${catcher.tool}, executed on the rendered deck)${C.reset}`);
        } else {
          uncaught.push(deck); recall.push({ deck, status: 'not-caught', by: `${catcher.tool} (executed, missed)` });
          console.log(`  ${CROSS} ${C.red}${deck} — NOT caught: declared catcher ${catcher.tool} ran and missed it${C.reset}`);
        }
      } catch (e) {
        if (!(e instanceof CatcherError)) throw e;
        catcherErrors.push(deck); recall.push({ deck, status: 'error', by: catcher.tool, error: e.message });
        console.log(`  ${CROSS} ${C.red}${deck} — catcher ${catcher.tool} could not run: ${e.message}${C.reset}`);
      }
    } else {
      const why = catcher.kind === 'judge' ? 'not run in CI' : 'run with --run-catchers';
      unverified.push(deck); recall.push({ deck, status: 'declared-unverified', by: catcher.tool });
      console.log(`  ${DOT} ${C.yellow}${deck}${C.reset} ${C.dim}— declared, unverified: ${catcher.tool} (${why})${C.reset}`);
    }
  }

  // ── verdict ──
  console.log('');
  const broken = falsePositives.length + uncaught.length;
  if (falsePositives.length) console.log(`  ${CROSS} ${C.red}${falsePositives.length} precision regression(s): ${falsePositives.map(f => f.deck).join(', ')}${C.reset}`);
  if (uncaught.length) console.log(`  ${CROSS} ${C.red}${uncaught.length} defect(s) not caught: ${uncaught.join(', ')}${C.reset}`);
  if (catcherErrors.length) console.log(`  ${CROSS} ${C.red}${catcherErrors.length} catcher(s) could not run: ${catcherErrors.join(', ')}${C.reset}`);
  if (!falsePositives.length) console.log(`  ${CHECK} precision: ${shouldPass.length} clean decks lint clean`);
  console.log(`  ${verified.length === shouldCatch.length ? CHECK : DOT} recall: ${verified.length}/${shouldCatch.length} adversarial defects caught by an executed gate; ${unverified.length} declared, unverified${unverified.length ? ` (${unverified.join(', ')})` : ''}`);

  if (record) {
    const rec = { when: new Date().toISOString(), clean: shouldPass.length - warnedDecks, warned: warnedDecks, totalWarnings, uncaught: uncaught.length, verified: verified.length, unverified: unverified.length };
    const hp = join(repoRoot, HISTORY); mkdirSync(dirname(hp), { recursive: true });
    appendFileSync(hp, JSON.stringify(rec) + '\n');
    console.log(`  ${C.dim}appended to ${HISTORY} — drift: node tools/gate-check.mjs --trend${C.reset}`);
  }
  if (json) {
    const out = resolve(repoRoot, json); mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify({ when: new Date().toISOString(), totalWarnings, warnedDecks, falsePositives, uncaught, recall, shouldPass: shouldPass.map(label), shouldCatch: shouldCatch.map(label) }, null, 2));
    console.log(`  ${C.dim}report → ${json}${C.reset}`);
  }
  process.exit(broken ? 1 : catcherErrors.length ? 2 : 0);
}

main();
