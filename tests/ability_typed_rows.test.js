import test from 'node:test';
import assert from 'node:assert/strict';
import {recordFromTyped, hasMechanism} from '../src/ability_typed_rows.js';
import {defineAbilityRecords, abilityView} from '../src/ability_records.js';

const typed = {id: 'x.ability.flame-jump', name: 'Flame jump', notes: 2,
    conditions: [{label: 'Fire at hand', fact: 'actor.lotm.fire_at_hand', locator: 'l1'}, {label: 'A fire is near', fact: 'actor.lotm.fire_at_hand', locator: 'l2'}],
    blockers: [{label: 'Heavy rain', fact: 'actor.lotm.heavy_rain', locator: 'l3'}],
    stated: [{kind: 'range', value: 1000, unit: 'm', label: 'Range nearly 1000 m', locator: 'l4'}], costs: []};

test('a typed row becomes a record that compiles, dedupes states, keeps numbers and admits what it does not state', () => {
    const rec = recordFromTyped(typed, {sourceId: 'x.sp.source'});
    assert.equal(rec.key, 'flame_jump');
    assert.equal(rec.conditions.length, 1);
    assert.deepEqual(rec.unstated, ['effect (a generic marker stands in)', 'cost amount']);
    const {cards} = defineAbilityRecords([rec], {prefix: 'x.sp', world: {id: 'x.world'}});
    const v = abilityView(cards.flame_jump, {facts: {'actor.lotm.fire_at_hand': true, 'actor.lotm.heavy_rain': true}});
    assert.deepEqual(v.refusedBy, ['blocked by Heavy rain']);
    assert.deepEqual(v.stated, [{kind: 'range', value: 1000, unit: 'm', label: 'Range nearly 1000 m'}]);
    assert.equal(abilityView(cards.flame_jump, {facts: {'actor.lotm.fire_at_hand': true, 'actor.lotm.heavy_rain': false}}).ready, true);
});

test('a row with only notes has no mechanism', () => {
    assert.equal(hasMechanism({conditions: [], blockers: [], stated: [], costs: [], notes: 3}), false);
    assert.equal(hasMechanism(typed), true);
});
