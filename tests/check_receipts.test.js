import test from 'node:test';
import assert from 'node:assert/strict';
import {lintReceipt} from '../scripts/check_receipts.mjs';

test('receipt front matter accepts a valid block and reports malformed fields with file and line', () => {
  const good = [
    '# Lane receipt', '', '```receipt',
    `build: ${'a'.repeat(64)}`, 'route: fixture(start-save)', 'state: browser-verified',
    'viewport: 1920x1080 desktop', 'persistence: checked', 'tests: 4 focused passing',
    'review: diff-scoped', 'surface: game panel', '```',
  ].join('\n');
  assert.deepEqual(lintReceipt('docs/gm/dispatch/lane-2026-10-27/RECEIPT.md', good), []);

  const bad = ['```receipt', 'build: n/a', 'route: made-up', 'state: browser-verified',
    'viewport:', 'persistence: maybe', 'tests:', 'review: someday', '```'].join('\n');
  const failures = lintReceipt('docs/gm/dispatch/lane-2026-10-27/RECEIPT.md', bad);
  assert.ok(failures.length >= 6);
  assert.ok(failures.every(f => f.file.endsWith('RECEIPT.md') && Number.isInteger(f.line) && f.reason));
  assert.ok(failures.some(f => f.line === 2 && /real build SHA-256/.test(f.reason)));
  assert.ok(failures.some(f => f.line === 3 && /route/.test(f.reason)));
});
