#!/usr/bin/env node
// leakage-lint.mjs — in-repo prompt/assertion leakage lint for the shared
// benchmark manifest (evals/shared-benchmark.json).
//
// Why this exists: the upstream Skill Eval Harness ships a prompt/assertion
// leakage lint, but installing it requires cloning an external repo over the
// network — unavailable in sandboxed/CI runs here. This is a faithful in-repo
// reimplementation of the core check so it can run in `npm run` and CI without
// that dependency (LESSONS_LEARNED #17: wire the gate in, don't leave it loose).
//
// What it flags: an assertion "leaks" when one of its literal match values
// appears verbatim (word-boundary, case-insensitive) in the case PROMPT. The
// model sees the prompt, so such an assertion can pass by parroting the prompt
// rather than demonstrating the behavior — a Goodhart hole.
//
// Exit code: 1 if any UNEXPECTED leak is found, 0 otherwise. Accepted leaks
// (domain/remediation vocabulary in contains_all coverage checks, where naming
// the term IS the graded behavior) are listed explicitly below with a reason.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const MANIFEST = resolve(here, '..', 'evals', 'shared-benchmark.json')

// Structural / tooling vocabulary that describes the SHAPE of any correct
// answer (every valid deck emits these). Matching them is legitimate and not
// answer-revealing, so they never count as a leak.
const STRUCTURAL = new Set([
  'slides.md', 'deck.spec.md', 'deck.spec', 'slidev', 'styles', 'tokens.css',
  'theme.css', 'index.css', 'global-bottom.vue', 'global-top.vue', 'layout',
  'layout:', 'frontmatter', 'src:', 'src', 'src/', 'transition', '---', '```',
  '<!--', 'index.html', 'serve.json', 'deck-lint', 'deck-lint.mjs',
])

// Intentional, documented exceptions: contains_all coverage checks where the
// graded behavior is precisely that the skill names the domain risks /
// remediation, so overlap with the prompt is inherent and acceptable.
const ACCEPTED = new Map([
  ['neg-render-gate::cover-rendered-risks',
    'contains_all coverage: the skill must enumerate the rendered risks (flash-bang/contrast/overflow) the static gate misses; naming them is the behavior.'],
  ['neg-hardcoded-colors::require-tokenized-scoped-style',
    'contains_all remediation: the skill must counter-propose var(--deck-*) tokens in a scoped block even though the user forbade them; the tokens are the fix.'],
])

const lower = (s) => (Array.isArray(s) ? s.join(' ') : (s ?? '')).toLowerCase()
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function leaks() {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
  const found = []
  for (const c of manifest.cases ?? []) {
    if (!c.prompt) continue // holdout/holdback prompts are supplied privately
    const prompt = lower(c.prompt)
    for (const a of c.assertions ?? []) {
      const values = a.values ?? (a.value != null ? [a.value] : [])
      for (const v of values) {
        const tok = String(v).toLowerCase()
        if (STRUCTURAL.has(tok)) continue
        const re = new RegExp(`(^|[^a-z0-9])${esc(tok)}([^a-z0-9]|$)`)
        if (re.test(prompt)) found.push({ id: c.id, assertion: a.name, type: a.type, value: v })
      }
    }
  }
  return found
}

const found = leaks()
const unexpected = found.filter((f) => !ACCEPTED.has(`${f.id}::${f.assertion}`))
const accepted = found.filter((f) => ACCEPTED.has(`${f.id}::${f.assertion}`))

console.log('leakage-lint — evals/shared-benchmark.json\n')
if (unexpected.length === 0) {
  console.log(`✓ no unexpected prompt-echo leaks`)
} else {
  console.log(`✗ ${unexpected.length} unexpected prompt-echo leak(s):`)
  for (const f of unexpected) console.log(`    [${f.id}] ${f.assertion} (${f.type}) → "${f.value}"`)
}
if (accepted.length) {
  console.log(`\n${accepted.length} accepted (documented) leak(s):`)
  const seen = new Set()
  for (const f of accepted) {
    const key = `${f.id}::${f.assertion}`
    if (!seen.has(key)) { seen.add(key); console.log(`    ${key} — ${ACCEPTED.get(key)}`) }
  }
}
console.log('')
process.exit(unexpected.length === 0 ? 0 : 1)
