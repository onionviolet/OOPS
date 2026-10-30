import test from 'node:test';
import assert from 'node:assert/strict';
import {descriptionFindings, playerStringFindings} from '../scripts/check_descriptions.mjs';

test('description lint accepts explanatory prose and flags mechanical failures', () => {
  const passing = {
    id: 'fixture.good',
    description: 'This brace keeps a loaded crate square while you carry it.',
  };
  const failing = {
    id: 'fixture.bad',
    description: 'TODO 2 + 3',
  };

  assert.deepEqual(descriptionFindings(passing, new Set(['fixture.good'])), []);
  assert.deepEqual(descriptionFindings(failing, new Set(['fixture.bad'])), [
    'under-20-chars',
    'placeholder-marker',
  ]);
  assert.deepEqual(descriptionFindings({id: 'fixture.formula', description: '2 + 3 × 4'}, new Set()), ['under-20-chars', 'formula-only']);
});

test('description lint flags empty and short text', () => {
  assert.deepEqual(descriptionFindings({id: 'fixture.missing'}, new Set()), ['missing-description-needs-review']);
  assert.deepEqual(descriptionFindings({id: 'fixture.empty', description: ''}, new Set()), ['empty', 'under-20-chars']);
  assert.deepEqual(descriptionFindings({id: 'fixture.short', description: 'A short note.'}, new Set()), ['under-20-chars']);
});

test('player-string lint flags proposal qualifiers on values but not feature titles (UR73, UR2)', () => {
  const source = [
    "cmd('a', `Watch · 60 min · earns ${pay} merit (a proposal)`);",
    "node('p', 'Assignments and prices are proposals; standing is separate.');",
    "summary.textContent = 'Combat options (proposal)';",
    "// a comment that says (a proposal) is ignored",
  ].join('\n');
  assert.deepEqual(playerStringFindings(source, 'x.js').map(row => [row.line, row.label]), [
    [1, '(a proposal)'],
    [2, 'are proposals'],
  ]);
  assert.deepEqual(descriptionFindings({id: 'f', description: 'Sell the herb to the broker for six pence (a proposal).'}, new Set()), ['status-label']);
});
