import test from 'node:test';
import assert from 'node:assert/strict';
import {quoteCounterTrait, traitHooks} from '../src/enemy_traits.js';
import {counterTraits} from '../src/data/enemy_counter_traits.js';
test('all five frontier traits scale their response and name the counter', () => {
    for (const row of Object.values(counterTraits)) {
        assert.ok(traitHooks.includes(row.hook) && row.counter);
        const low = quoteCounterTrait(row, {[row.stat]:1});
        const high = quoteCounterTrait(row, {[row.stat]:100});
        assert.notEqual(low, high);
        assert.ok(low > 0 && high > 0);
    }
    assert.equal(quoteCounterTrait(counterTraits.seam, {defense:0}), 1.18);
});
