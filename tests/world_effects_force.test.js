import test from 'node:test';
import assert from 'node:assert/strict';
import {landEffect} from '../src/effect_host.js';
import {FORCE_QUANTITY} from '../src/force_effects.js';
import {applyEffect} from '../src/world_effects.js';
import {composeSubstrate, createWorld, readQuantity, restoreWorld, serializeWorld} from '../src/world_substrate.js';
import {WORLD_QUANTITIES as Q} from '../src/world_quantities.js';

const worldRules = (force = []) => composeSubstrate({packs: [{id: 'fixture'}], quantities: [...force, Q.vitality, Q.condition]});
const rules = worldRules([FORCE_QUANTITY]);
const target = id => ({shape: 'holder', id});
const land = (world, verb, details, r = rules) =>
    landEffect(r, world, {sentence: {verb, object: 'force', time: 'instant'}, details}, {cause: 'force-test'});
const start = createWorld(rules, {holders: [
    {id: 'hall', kind: 'place', quantities: {force: 0}},
    {id: 'lifter', kind: 'body', place: 'hall', quantities: {force: 2, vitality: 20}},
    {id: 'spring', kind: 'thing', place: 'hall', quantities: {force: 0, condition: 80}},
    {id: 'bystander', kind: 'body', place: 'hall', quantities: {vitality: 20}},
]});

test('one force pulse loads a body, a thing and a place that carry force', () => {
    const landed = land(start, 'add', {target: {shape: 'place', place: 'hall'}, amount: 5});
    assert.equal(landed.status, 'landed');
    assert.deepEqual(landed.outcomes[0].applied.map(({target, amount}) => [target, amount]),
        [['hall', 5], ['lifter', 5], ['spring', 5]]);
    assert.deepEqual(landed.outcomes[0].skipped, [{target: 'bystander', reason: 'not-carried'}]);
    assert.deepEqual(['hall', 'lifter', 'spring'].map(id => readQuantity(landed.world, id, 'force')), [5, 7, 5]);
    assert.equal(readQuantity(landed.world, 'lifter', 'vitality'), 20);
    assert.equal(readQuantity(landed.world, 'spring', 'condition'), 80);
    assert.equal(landed.world.holders.spring.place, 'hall');
    assert.equal(readQuantity(start, 'lifter', 'force'), 2);
});

test('altering and releasing ambient force change an existing ward threshold', () => {
    const atHall = {target: target('hall')};
    const warded = applyEffect(rules, start, {verb: 'block', ...atHall, field: 'pressure-ward',
        params: {verb: 'remove', object: 'vitality', threshold: {quantity: 'force', minimum: 5}}}, 'ward').world;
    const loaded = land(warded, 'add', {...atHall, amount: 7}).world;
    const strike = world => applyEffect(rules, world,
        {verb: 'remove', object: 'vitality', target: target('lifter'), amount: 3}, 'hit');

    assert.deepEqual(strike(loaded).outcome.blocked, [{target: 'lifter', by: 'pressure-ward'}]);
    const reduced = land(loaded, 'alter', {...atHall, delta: -3});
    assert.equal(readQuantity(reduced.world, 'hall', 'force'), 4);
    assert.equal(readQuantity(strike(reduced.world).world, 'lifter', 'vitality'), 17);
    const raised = land(reduced.world, 'alter', {...atHall, delta: 2}).world;
    assert.equal(readQuantity(raised, 'hall', 'force'), 6);
    const locked = applyEffect(rules, raised, {verb: 'block', ...atHall, field: 'release-lock',
        params: {verb: 'alter', object: 'force'}}, 'ward').world;
    assert.deepEqual(land(locked, 'alter', {...atHall, delta: -3}).outcomes[0].blocked,
        [{target: 'hall', by: 'release-lock'}]);
    const released = land(raised, 'remove', {...atHall, amount: 20});
    assert.equal(released.outcomes[0].applied[0].amount, -6);
    assert.equal(readQuantity(released.world, 'hall', 'force'), 0);
    assert.equal(land(released.world, 'remove', {...atHall, amount: 1}).status, 'idle');
    assert.throws(() => land(loaded, 'alter', {...atHall, amount: 1}), /signed whole delta/);
});

test('force uses the existing save format and tolerates worlds without an account', () => {
    const legacyRules = worldRules();
    const legacy = createWorld(legacyRules, {holders: [{id: 'hall', kind: 'place'}]});
    const save = world => JSON.parse(JSON.stringify(serializeWorld(world)));
    const restored = restoreWorld(rules, save(legacy));
    assert.equal(readQuantity(restored, 'hall', 'force'), null);
    assert.deepEqual(land(restored, 'add', {target: target('hall'), amount: 3}).outcomes[0].skipped,
        [{target: 'hall', reason: 'not-carried'}]);
    const unloaded = land(legacy, 'add', {target: target('hall')}, legacyRules);
    assert.equal(unloaded.status, 'idle');
    assert.equal(unloaded.world, legacy);
    const loaded = land(start, 'add', {target: target('spring'), amount: 8}).world;
    assert.equal(readQuantity(restoreWorld(rules, save(loaded)), 'spring', 'force'), 8);
});
