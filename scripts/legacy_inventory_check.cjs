// Registered P00 counters add empty owner bags on old-save load, never stock.
// Compare every other path exactly, including future unexpected additions.
const assert = require('node:assert/strict');
module.exports = function checkLegacyInventories(actual, expected) {
  const normalized = structuredClone(actual);
  for (const category of ['person', 'trader']) {
    for (const id of ['p23.study.tonic_counter', 'p23.mistglass.keeper']) {
      if (!Object.hasOwn(expected[category] || {}, id)) {
        assert.deepEqual(normalized[category]?.[id], {}, `${category}/${id}: additive empty owner only`);
        delete normalized[category][id];
      }
    }
  }
  assert.deepEqual(normalized, expected, 'legacy inventories');
};
