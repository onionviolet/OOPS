import test from 'node:test';
import assert from 'node:assert/strict';
import {descriptionFindings} from '../scripts/check_descriptions.mjs';

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
