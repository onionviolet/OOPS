import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// PROJECT.md is the current-state summary. It regrew from a short summary into
// a 2,200-line dated log twice, so the shape is enforced here, not in prose.
const project = readFileSync(fileURLToPath(new URL('../PROJECT.md', import.meta.url)), 'utf8');
const MAX_LINES = 200;

test('PROJECT.md stays a short current-state summary', () => {
  const lines = project.split('\n').length;
  assert.ok(lines <= MAX_LINES,
    `PROJECT.md has ${lines} lines (cap ${MAX_LINES}). Replace stale lines and move history to docs/gm/PROJECT_LOG_2026-10-29.md.`);
});

test('PROJECT.md has no dated section headings', () => {
  const dated = project.split('\n').filter((line) => /^##\s.*\b20\d\d-\d\d-\d\d\b/.test(line));
  assert.deepEqual(dated, [],
    'Dated "## ..., YYYY-MM-DD" sections belong in the project log; update the existing current-state section instead.');
});
