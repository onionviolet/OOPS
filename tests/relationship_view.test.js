import test from 'node:test';
import assert from 'node:assert/strict';
import {relationshipView, relationshipFacts, RELATIONSHIP_READ_RULES} from '../src/relationship_view.js';
import {evaluateRule} from '../src/rules.js';
import {createChronicle, relationshipChange} from '../src/chronicle.js';

const memory = (cause, at = 1, text = 'An actual meeting.') => ({cause, at, text});
const edge = (axes = {}, memories = []) => ({axes, memories});
const fixture = () => ({
    simulation: {relationships: {
        player: {villageElder: edge({trust: 150, respect: -125}, [memory('shared', 2)]),
            partner: edge({familiarity: 0})},
        villageElder: {player: edge({trust: -3}, [memory('other-direction', 1)])},
    }},
    chronicle: {relationships: {villageElder: {axes: {trust: 2, respect: 3},
        ties: {archiveDuty: true, grievance: false, role: 'acquaintance', owed: -2},
        memories: [{id: 'shared', at: 2, text: 'A chronicle meeting.'}]}}},
});
const freeze = value => {
    if (value && typeof value === 'object') {
        Object.values(value).forEach(freeze);
        Object.freeze(value);
    }
    return value;
};

test('one shape keeps both axis meanings, typed ties and source presence', () => {
    const view = relationshipView(fixture());
    assert.equal(view.scope, 'authoritative');
    assert.deepEqual(view.relationships.villageElder.axes, {
        simulation: {trust: 150, respect: -125}, chronicle: {trust: 2, respect: 3},
    });
    assert.deepEqual(view.relationships.villageElder.sources, {simulation: true, chronicle: true});
    assert.deepEqual(view.relationships.villageElder.ties.chronicle,
        {archiveDuty: true, grievance: false, role: 'acquaintance', owed: -2});
    assert.deepEqual(view.relationships.partner.axes.chronicle, {});
});

test('directed edges never borrow or reverse the other actor opinion', () => {
    const view = relationshipView(fixture(), 'villageElder');
    assert.deepEqual(Object.keys(view.relationships), ['player']);
    assert.deepEqual(view.relationships.player.axes, {simulation: {trust: -3}, chronicle: {}});
    assert.deepEqual(view.relationships.player.ties.chronicle, {});
    assert.equal(relationshipFacts(view, 'player')['relationship.simulation.axis.trust'], -3);
    assert.equal(relationshipFacts(view, 'villageElder')['relationship.chronicle.present'], false);
});

test('chronicle binding may name another actual life owner, never all viewers', () => {
    const state = fixture();
    const owner = relationshipView(state, 'heir.actual', {chronicleOwnerId: 'heir.actual'});
    assert.equal(owner.relationships.villageElder.sources.chronicle, true);
    assert.equal(owner.relationships.villageElder.sources.simulation, false);
    assert.equal(relationshipView(state, 'player', {chronicleOwnerId: 'heir.actual'})
        .relationships.villageElder.sources.chronicle, false);
});

test('missing owners, targets and axes remain unknown rather than neutral', () => {
    for (const state of [{}, {simulation: null, chronicle: null},
        {simulation: {relationships: {}}, chronicle: {relationships: {}}}]) {
        const viewer = relationshipView(state);
        assert.deepEqual(viewer.relationships, {});
        const facts = relationshipFacts(viewer, 'nobody');
        assert.deepEqual(facts, {'relationship.simulation.present': false, 'relationship.chronicle.present': false});
        const result = evaluateRule({fact: 'relationship.simulation.axis.trust', op: 'gte', value: 0}, facts);
        assert.equal(result.known, false);
        assert.equal(result.met, false);
    }
    const facts = relationshipFacts(relationshipView(fixture()), 'partner');
    assert.equal(facts['relationship.simulation.axis.familiarity'], 0);
    assert.equal(Object.hasOwn(facts, 'relationship.simulation.axis.trust'), false);
});

test('flat facts preserve zero, negative, false, string and number values for rules', () => {
    const facts = relationshipFacts(relationshipView(fixture()), 'villageElder');
    for (const rule of [
        {fact: 'relationship.simulation.axis.trust', op: 'gte', value: 120},
        {fact: 'relationship.simulation.axis.respect', op: 'lte', value: -120},
        {fact: 'relationship.chronicle.axis.trust', op: 'eq', value: 2},
        {fact: 'relationship.chronicle.tie.archiveDuty', op: 'eq', value: true},
        {fact: 'relationship.chronicle.tie.grievance', op: 'eq', value: false},
        {fact: 'relationship.chronicle.tie.role', op: 'eq', value: 'acquaintance'},
        {fact: 'relationship.chronicle.tie.owed', op: 'lte', value: -1},
    ]) assert.deepEqual(evaluateRule(rule, facts), {met: true, known: true, reasons: []});
    assert.equal(Object.hasOwn(facts, 'relationship.trust'), false);
    assert.equal(Object.hasOwn(facts, 'relationship.willing'), false);
    assert.equal(facts['relationship.simulation.memoryCount'], 1);
    assert.equal(facts['relationship.chronicle.memoryCount'], 1);
});

test('same source names never imply combined axes or legacy reputation conversion', () => {
    const state = fixture();
    state.character = {reputation: {Village: 900}};
    const facts = relationshipFacts(relationshipView(state), 'villageElder');
    assert.equal(facts['relationship.simulation.axis.trust'], 150);
    assert.equal(facts['relationship.chronicle.axis.trust'], 2);
    assert.equal(Object.keys(facts).some(id => id.includes('reputation')), false);
});

test('memories retain duplicates, source identity, chronology and source order at equal times', () => {
    const state = fixture();
    state.simulation.relationships.player.villageElder.memories.push(memory('shared', 2, 'Second effect.'), memory('earlier', 1));
    const memories = relationshipView(state).relationships.villageElder.memories;
    assert.deepEqual(memories.map(m => [m.source, m.index, m.id]), [
        ['simulation', 2, 'earlier'], ['simulation', 0, 'shared'],
        ['simulation', 1, 'shared'], ['chronicle', 0, 'shared'],
    ]);
    assert.equal(memories[2].text, 'Second effect.');
});

test('each store keeps its own 32 retained memories without global retrimming', () => {
    const state = fixture();
    state.simulation.relationships.player.villageElder.memories = Array.from({length: 32}, (_, i) => memory(`sim:${i}`, i));
    state.chronicle.relationships.villageElder.memories = Array.from({length: 32}, (_, i) => ({id: `c:${i}`, at: i, text: 'Retained.'}));
    const view = relationshipView(state);
    assert.equal(view.relationships.villageElder.memories.length, 64);
    assert.equal(relationshipFacts(view, 'villageElder')['relationship.chronicle.memoryCount'], 32);
});

test('frozen inputs and mutable outputs remain independent in both directions', () => {
    const state = fixture(), before = structuredClone(state), viewer = relationshipView(freeze(state));
    const r = viewer.relationships.villageElder;
    r.axes.simulation.trust = 0;
    r.axes.chronicle.trust = 0;
    r.ties.chronicle.archiveDuty = false;
    r.memories[0].text = 'Altered output.';
    assert.deepEqual(state, before);
    const writable = fixture(), snapshot = relationshipView(writable);
    writable.simulation.relationships.player.villageElder.axes.trust = -4;
    assert.equal(snapshot.relationships.villageElder.axes.simulation.trust, 150);
});

test('JSON roundtrip and repeated reads preserve the same projection and facts', () => {
    const state = fixture(), first = relationshipView(state);
    assert.deepEqual(relationshipView(JSON.parse(JSON.stringify(state))), first);
    assert.deepEqual(relationshipFacts(JSON.parse(JSON.stringify(first)), 'villageElder'),
        relationshipFacts(first, 'villageElder'));
    assert.deepEqual(relationshipView(state), first);
});

test('real chronicle writer saturation is preserved while simulation values are unclamped', () => {
    const c = createChronicle(0, {year: 1, month: 1, day: 1, hour: 0, minute: 0, day_count: 0});
    relationshipChange(c, 'villageElder', {id: 'positive', axes: {trust: 1000}, text: 'Positive.'}, 1);
    relationshipChange(c, 'villageElder', {id: 'negative', axes: {respect: -1000}, text: 'Negative.'}, 2);
    const state = fixture(); state.chronicle = c;
    state.simulation.relationships.player.villageElder.axes.trust = Number.MAX_SAFE_INTEGER;
    const r = relationshipView(state).relationships.villageElder;
    assert.equal(r.axes.chronicle.trust, 100);
    assert.equal(r.axes.chronicle.respect, -100);
    assert.equal(r.axes.simulation.trust, Number.MAX_SAFE_INTEGER);
    assert.equal(RELATIONSHIP_READ_RULES.simulation.writerClamps, false);
    assert.equal(RELATIONSHIP_READ_RULES.chronicle.writerClamps, true);
});

test('invalid finite bounds and tie types fail without repairing the input', () => {
    for (const value of [Infinity, NaN, '1', Number.MAX_SAFE_INTEGER + 1]) {
        const state = fixture(); state.simulation.relationships.player.villageElder.axes.trust = value;
        assert.throws(() => relationshipView(state), /simulation relationship axis/);
        assert.equal(Object.is(state.simulation.relationships.player.villageElder.axes.trust, value), true);
    }
    for (const value of [101, -101, Infinity]) {
        const state = fixture(); state.chronicle.relationships.villageElder.axes.trust = value;
        assert.throws(() => relationshipView(state), /chronicle relationship axis/);
    }
    for (const value of [null, [], {}, Infinity]) {
        const state = fixture(); state.chronicle.relationships.villageElder.ties.role = value;
        assert.throws(() => relationshipView(state), /relationship tie/);
    }
});

test('malformed memory shapes and excess retention fail visibly', () => {
    for (const memories of [null, [null], [memory('valid', -1)], [{cause: 'valid', at: 1}],
        Array.from({length: 33}, (_, i) => memory(`cause:${i}`))]) {
        const state = fixture(); state.simulation.relationships.player.villageElder.memories = memories;
        assert.throws(() => relationshipView(state), /relationship memor/);
    }
});

test('unsafe keys, invalid owners and mismatched fact directions are rejected', () => {
    for (const viewer of ['__proto__', 'constructor', 'prototype', '', 12]) {
        assert.throws(() => relationshipView({}, viewer), /viewer/);
    }
    for (const state of [null, [], {simulation: []}, {simulation: {relationships: {player: null}}},
        {chronicle: {relationships: []}}, {simulation: {relationships: {player: {target: null}}}}]) {
        assert.throws(() => relationshipView(state));
    }
    const state = JSON.parse('{"simulation":{"relationships":{"player":{"__proto__":{"axes":{},"memories":[]}}}}}');
    assert.throws(() => relationshipView(state), /target/);
    const viewer = relationshipView(fixture());
    assert.throws(() => relationshipFacts(viewer, '__proto__'), /context/);
    viewer.relationships.villageElder.viewerId = 'someoneElse';
    assert.throws(() => relationshipFacts(viewer, 'villageElder'), /direction mismatch/);
});

test('open axis names and typed ties remain extensible without fixed social categories', () => {
    const state = fixture();
    state.simulation.relationships.player.partner.axes['custom:clan.trust'] = -0.5;
    state.chronicle.relationships.villageElder.ties['office:seat'] = 'scribe';
    assert.equal(relationshipFacts(relationshipView(state), 'partner')['relationship.simulation.axis.custom:clan.trust'], -0.5);
    assert.equal(relationshipFacts(relationshipView(state), 'villageElder')['relationship.chronicle.tie.office:seat'], 'scribe');
});
