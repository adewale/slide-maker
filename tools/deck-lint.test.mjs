// Unit tests for deck-lint rule functions. Run: npm test  (node --test)
//
// Each rule gets a should-fire and a should-pass case. Several pin behaviour that
// earlier fixes introduced (mermaid blocks exempt from the code-length cap, exempt
// layouts for Sources:, flat-colour-only flash-bang measurement).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  checkFlashBang, checkMermaidSyntax, checkOverflow, checkSlop, colorToHex, contrastRatio,
  countMermaidNodes, extractSources, slideNeedsSources,
} from './deck-lint.mjs';

const bullets = (n) => Array.from({ length: n }, (_, i) => `- point ${i + 1}`).join('\n');
const fence = (lang, n) => ['```' + lang, ...Array.from({ length: n }, (_, i) => `line ${i + 1}`), '```'].join('\n');

test('checkOverflow: 8 bullets warn, 7 do not', () => {
  assert.equal(checkOverflow(bullets(7)).length, 0);
  const w = checkOverflow(bullets(8));
  assert.equal(w.length, 1);
  assert.match(w[0], /bullet list has 8 items/);
});

test('checkOverflow: a 9-line code block warns, 8 lines do not', () => {
  assert.deepEqual(checkOverflow(fence('ts', 8)), []);
  assert.match(checkOverflow(fence('ts', 9))[0], /code block has 9 lines/);
});

test('checkOverflow: long mermaid blocks are exempt from the code-length cap', () => {
  assert.deepEqual(checkOverflow(fence('mermaid', 30)), []);
});

test('checkFlashBang: a near-black cover cutting to a cream deck warns', () => {
  const md = ['---', "background: '#111111'", 'layout: cover', '---', '', '# Cover', '', '---', '', '# Content', ''].join('\n');
  const w = checkFlashBang(md, '#f5f0e6');
  assert.equal(w.length, 1);
  assert.match(w[0], /flash-bang: slide 1 \(#111111\) to slide 2 \(#f5f0e6\)/);
});

test('checkFlashBang: slides that inherit the deck background do not warn', () => {
  const md = ['---', 'layout: cover', '---', '', '# Cover', '', '---', '', '# Content', ''].join('\n');
  assert.deepEqual(checkFlashBang(md, '#f5f0e6'), []);
});

test('checkFlashBang: image backgrounds are not statically measurable (no warning)', () => {
  const md = ['---', 'background: https://example.com/night.jpg', 'layout: cover', '---', '', '# Cover', '', '---', '', '# Content', ''].join('\n');
  assert.deepEqual(checkFlashBang(md, '#f5f0e6'), []);
  assert.equal(colorToHex('https://example.com/night.jpg'), null);
});

test('contrastRatio: WCAG extremes', () => {
  assert.equal(Math.round(contrastRatio('#000000', '#ffffff')), 21);
  assert.equal(contrastRatio('#777777', '#777777'), 1);
});

test('countMermaidNodes: counts flowchart nodes, skips other diagram types', () => {
  assert.equal(countMermaidNodes('flowchart LR\n  A --> B\n  B --> C'), 3);
  assert.equal(countMermaidNodes('sequenceDiagram\n  Alice->>Bob: hi'), 0);
});

test('checkMermaidSyntax: unquoted "/" in a node id warns; quoted label does not', () => {
  const nodeIdWarnings = (code) => checkMermaidSyntax(code, 3).filter((w) => /Mermaid node ID/.test(w));
  assert.match(nodeIdWarnings('flowchart LR\n  api/v1 --> db')[0], /node ID "api\/v1" contains "\/"/);
  assert.deepEqual(nodeIdWarnings('flowchart LR\n  api["api/v1"] --> db'), []);
});

test('checkMermaidSyntax: an unstyled flowchart warns about missing style and linkStyle', () => {
  const w = checkMermaidSyntax('flowchart LR\n  a --> b', 3).join('\n');
  assert.match(w, /no style\/classDef/);
  assert.match(w, /missing linkStyle default/);
});

test('slideNeedsSources: presenter notes need sources, cover/section/end are exempt', () => {
  assert.equal(slideNeedsSources('layout: default', '# Claim\n<!-- notes -->'), true);
  assert.equal(slideNeedsSources('layout: cover', '# Title\n<!-- notes -->'), false);
  assert.equal(slideNeedsSources('layout: default', '# No notes'), false);
});

test('extractSources: reads "- " items after Sources: in a comment', () => {
  const body = '# Slide\n<!--\nSpeaker notes.\nSources:\n- https://example.com/a\n- file:README.md\n-->';
  assert.deepEqual(extractSources(body), ['https://example.com/a', 'file:README.md']);
  assert.deepEqual(extractSources('# Slide\n<!-- just notes -->'), []);
});

test('checkSlop: overused font warns unless the preset owns it as brand identity', () => {
  const dir = mkdtempSync(join(tmpdir(), 'deck-lint-test-'));
  try {
    mkdirSync(join(dir, 'styles'));
    writeFileSync(join(dir, 'styles', 'tokens.css'), ':root { --deck-bg: #fafafa; --deck-fg: #1a1a1a; }');
    const md = '---\nfonts:\n  sans: Inter\n---\n\n# Hi\n';
    assert.match(checkSlop(dir, md).join('\n'), /sans font "Inter" is an overused/);
    writeFileSync(join(dir, 'deck.spec.md'), 'style-preset: cloudflare\n');
    assert.deepEqual(checkSlop(dir, md), []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
