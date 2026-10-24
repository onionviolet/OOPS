import test from 'node:test';
import assert from 'node:assert/strict';
import {defineGate, evaluateGate, VAGUE_HINT} from '../src/progression_gates.js';
import {HERB_LESSON_GATE, herbLessonFacts} from '../src/reveal_chain.js';

const base = {id: 'test.bottleneck', kind: 'capacity', reason: 'The meridians cannot yet hold the next layer.',
    requires: {all: [
        {fact: 'foundation', op: 'gte', value: {dial: 'need'}, hint: 'Your foundation feels thin.'},
        {fact: 'sealed.law', op: 'eq', value: true, reason: 'Requires the sealed law.'}]},
    dials: {need: {default: 10}},
    routes: [{id: 'pill', reason: 'A breakthrough pill forces the channel open.', cost: 'Strain and impurity.'}]};

test('descriptors refuse gates without reason, costed route, known kind or known dial (GTR1, GTR4)', () => {
    assert.throws(() => defineGate({...base, reason: ''}), /reason/);
    assert.throws(() => defineGate({...base, routes: []}), /route/);
    assert.throws(() => defineGate({...base, routes: [{id: 'free', reason: 'x'}]}), /route/);
    assert.throws(() => defineGate({...base, kind: 'level'}), /kind/);
    assert.throws(() => defineGate({...base, dials: {}}), /Unknown dial/);
    assert.throws(() => defineGate({...base, closes: 'revocable'}), /closes it/);
    assert.throws(() => defineGate({...base, overflow: {policy: 'vanish', reason: 'x'}}), /overflow/);
    assert.ok(Object.isFrozen(defineGate(base)));
});

test('evaluation is a pure read and dials move the threshold (GTR14, GTR17)', () => {
    const gate = defineGate(base), facts = Object.freeze({foundation: 8, 'sealed.law': true});
    assert.equal(evaluateGate(gate, facts).met, false);
    assert.equal(evaluateGate(gate, facts, {dials: {need: 8}}).met, true);
    assert.equal(evaluateGate(gate, facts).dials.need, 10);
});

test('player view names only conditions the character knows; author reasons stay separate (GTR10)', () => {
    const gate = defineGate(base), facts = {foundation: 2, 'sealed.law': false};
    const blind = evaluateGate(gate, facts);
    assert.deepEqual(blind.shown, [VAGUE_HINT]);
    assert.ok(blind.authorReasons.includes('Requires the sealed law.'));
    const sensed = evaluateGate(gate, facts, {knows: f => f === 'foundation'});
    assert.deepEqual(sensed.shown, ['Your foundation feels thin.', VAGUE_HINT]);
    assert.ok(!sensed.shown.some(s => s.includes('sealed')));
    assert.deepEqual(evaluateGate(gate, {foundation: 20, 'sealed.law': true}).shown, []);
});

test('unknown facts stay unknown, and negated conditions report correctly', () => {
    const gate = defineGate({...base, requires: {not: {fact: 'banished', op: 'eq', value: true, hint: 'The sect barred you.'}}});
    assert.equal(evaluateGate(gate, {}).known, false);
    assert.deepEqual(evaluateGate(gate, {banished: true}, {knows: () => true}).shown, ['The sect barred you.']);
    assert.equal(evaluateGate(gate, {banished: false}).met, true);
});

test('herb lesson descriptor keeps its count and learned behaviour', () => {
    const row = n => ({item: {id: 'Golmoon leaf'}, count: n});
    assert.equal(evaluateGate(HERB_LESSON_GATE, herbLessonFacts({a: row(20)}, false)).met, true);
    assert.equal(evaluateGate(HERB_LESSON_GATE, herbLessonFacts({a: row(5)}, false), {dials: {count: 5}}).met, true);
    assert.equal(evaluateGate(HERB_LESSON_GATE, herbLessonFacts({a: row(20)}, true)).met, false);
});
