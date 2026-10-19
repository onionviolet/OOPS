import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {DEFEAT_OUTCOMES, combatDefeat, defeatBinding, defeatState, publishDefeat, setDefeatState, validateDefeat} from '../src/defeat_domain.js';

// CBL1 (CBR2/CBR5): one publisher, typed outcome, separate cause, one record per actual outcome.
const cave = {id: 'Nearby cave'};
const fight = {defenders: [{name: 'Wolf rat', is_alive: true}, {name: 'Wolf rat', is_alive: true}, {name: 'Rat', is_alive: false}]};

test('publishes a typed outcome with its cause and counts by outcome', () => {
    setDefeatState(null);
    const record = publishDefeat(combatDefeat(cave, fight));
    assert.deepEqual(record, {outcome: 'unconscious', cause: {kind: 'combat', place: 'Nearby cave', by: ['Wolf rat']}}, 'only those still standing, named once');
    publishDefeat({outcome: 'escaped', cause: {kind: 'combat', place: null, by: []}});
    assert.deepEqual(defeatState().counts, {unconscious: 1, escaped: 1});
    assert.equal(defeatState().last.outcome, 'escaped');
    assert.ok(DEFEAT_OUTCOMES.includes('killed') && DEFEAT_OUTCOMES.includes('yielded'));
    assert.throws(() => publishDefeat({outcome: 'dead', cause: {kind: 'combat', by: []}}), /Unknown defeat outcome/);
    assert.throws(() => publishDefeat({cause: {kind: 'curse', by: []}}), /Invalid defeat cause/);
    assert.deepEqual(defeatState().counts, {unconscious: 1, escaped: 1}, 'refused publications change nothing');
});

test('a failed durable write undoes the publication; a transaction binding restores it', () => {
    setDefeatState(null);
    publishDefeat(combatDefeat(cave, fight));
    const before = structuredClone(defeatState());
    assert.throws(() => publishDefeat(combatDefeat(cave, fight), () => { assert.equal(defeatState().counts.unconscious, 2, 'the save is built with the record'); throw Error('storage full'); }), /storage full/);
    assert.deepEqual(defeatState(), before);
    const held = defeatBinding.get();
    publishDefeat(combatDefeat(cave, fight));
    defeatBinding.set(held);
    assert.deepEqual(defeatState(), before);
});

test('save slice round trip, old saves and malformed slices', () => {
    setDefeatState(null);
    assert.equal(domainRegistry.save({}).defeat, undefined, 'nothing recorded, nothing saved');
    domainRegistry.load({});
    assert.deepEqual(domainRegistry.project('defeat'), {schema: 1, counts: {}, last: null}, 'an old save starts an empty record');
    publishDefeat(combatDefeat(cave, fight));
    const envelope = domainRegistry.save({});
    domainRegistry.validate(envelope);
    setDefeatState(null);
    domainRegistry.load(JSON.parse(JSON.stringify(envelope)));
    assert.deepEqual(domainRegistry.project('defeat'), envelope.defeat);
    const good = envelope.defeat;
    for (const bad of [{...good, schema: 2}, {...good, counts: {dead: 1}}, {...good, counts: {unconscious: 0}}, {...good, last: null},
        {...good, last: {...good.last, outcome: 'escaped'}}, {...good, last: {...good.last, cause: {kind: 'combat', by: 'Wolf rat'}}},
        {...good, last: {...good.last, extra: 1}}])
        assert.throws(() => validateDefeat(bad), /Invalid|need/, JSON.stringify(bad));
});
