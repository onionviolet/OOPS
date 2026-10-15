import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState, validateExpansionState} from '../src/expansion_engine.js';

const withSource = expiresAt => {
    const state = createExpansionState(7);
    state.actors.player.sources['fixture.source'] = {acquiredAt: 0, expiresAt, receiptId: 'fixture.receipt'};
    return state;
};

test('repeat validation still rejects a state mutated in place after it passed', () => {
    const state = withSource(null);
    assert.equal(validateExpansionState(state), state);
    state.sequence = -1;
    assert.throws(() => validateExpansionState(state), /clock or random state/);
});

test('repeat validation compares exact values, not their JSON form', () => {
    validateExpansionState(withSource(null));
    const infinite = withSource(Infinity);
    assert.equal(JSON.stringify(infinite), JSON.stringify(withSource(null)));
    assert.throws(() => validateExpansionState(infinite), /capability source/);
    const missing = withSource(null);
    missing.actors.player.sources['fixture.source'].receiptId = undefined;
    assert.throws(() => validateExpansionState(missing), /capability source/);
});

test('full validation and identical content give the same answer', () => {
    const state = withSource(5);
    assert.equal(validateExpansionState(state, undefined, {full: true}), state);
    const copy = structuredClone(state);
    assert.equal(validateExpansionState(copy), copy);
});
