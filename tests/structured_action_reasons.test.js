import test from 'node:test';
import assert from 'node:assert/strict';
import {structuredActionReasons, STRUCTURED_ACTION_REASONS} from '../src/structured_action_reasons.js';
import {UNMET_REASON, NEUTRAL_REASON} from '../src/player_reasons.js';

test('a table entry replaces the engine fallback and keeps other reasons', () => {
    const out = structuredActionReasons({id: 'book.ss.trial.treat'}, ['Carried stock: 0 / 1 x Salve required.', UNMET_REASON], {});
    assert.deepEqual(out, ['Carried stock: 0 / 1 x Salve required.', 'You have no injury to treat.']);
});

test('without a table entry the first unmet authored leaf reason shows', () => {
    const requires = {all: [{fact: 'a', op: 'eq', value: true}, {any: [{fact: 'b', op: 'eq', value: true, reason: 'First: one.'}, {fact: 'c', op: 'eq', value: true, reason: 'First: one.'}]}]};
    assert.deepEqual(structuredActionReasons({id: 'x.y', requires}, [UNMET_REASON], {a: true, b: false, c: false}), ['First: one.']);
});

test('no authored reason leaves the fallback for the shared decorator', () => {
    assert.deepEqual(structuredActionReasons({id: 'x.y', requires: {fact: 'a', op: 'eq', value: true}}, [UNMET_REASON], {a: false}), [UNMET_REASON]);
});

test('table text is player words, never the engine fallback or the neutral line', () => {
    for(const text of Object.values(STRUCTURED_ACTION_REASONS)) {
        assert.ok(text.length < 100 && text !== UNMET_REASON && text !== NEUTRAL_REASON && !/ -- |—/.test(text));
    }
});

test('a sequenced act names the next scene and counts the ones after it', () => {
    const step = (id, text) => ({any: [{fact: id, op: 'eq', value: true, reason: `First: ${text}.`}]});
    const requires = {all: [step('a', 'Get up'), step('b', 'Cook'), step('c', 'Wait')]};
    assert.deepEqual(structuredActionReasons({id: 'x.y', requires}, [UNMET_REASON], {a: false, b: false, c: false}), ['First: Get up. 2 more scenes come before this.']);
    assert.deepEqual(structuredActionReasons({id: 'x.y', requires}, [UNMET_REASON], {a: true, b: false, c: false}), ['First: Cook. One more scene comes before this.']);
    assert.deepEqual(structuredActionReasons({id: 'x.y', requires}, [UNMET_REASON], {a: true, b: true, c: false}), ['First: Wait.']);
});
