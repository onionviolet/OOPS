import test from 'node:test';
import assert from 'node:assert/strict';
import {quoteParry, quoteRiposte} from '../src/combat_reactions.js';
test('training widens the reaction window, both defenses work at level zero', () => {
    assert.equal(quoteParry(0, .1).reduction, .25);
    assert.equal(quoteParry(0, .2), null);
    assert.equal(quoteParry(25, .2).reduction, .25);
    assert.equal(quoteRiposte(0, .1), true);
    assert.equal(quoteRiposte(100, .5), false);
});
