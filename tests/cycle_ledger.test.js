import test from 'node:test';
import assert from 'node:assert/strict';
import {loadLedger} from '../scripts/cycle_ledger.mjs';

test('cycle ledger groups every baseline edge exactly once', async () => {
  const {baseline, groups} = await loadLedger();
  const groupedEdges = groups.flatMap(group => group.edges);
  assert.equal(groupedEdges.length, baseline.cycleEdges.length);
  assert.deepEqual([...groupedEdges].sort(), [...baseline.cycleEdges].sort());
  assert.equal(new Set(groupedEdges).size, groupedEdges.length);
});
