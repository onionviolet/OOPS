import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking} from '../src/engine_world.js';
import {APERTURE_LAW, aperturePool, readAperture} from '../src/gu_aperture.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {guAbility} from '../src/gu_working_law.js';
import {GU_AWAKENING_LAW, GU_AWAKENING_PROPERTIES, guAwakenedMoonblade,
    guAwakeningWorking} from '../src/world_packs/gu_awakening_working.js';
import {GU_CONTROL_PROPERTIES} from '../src/world_packs/gu_first_control.js';
import {createGuAperturePack} from '../src/world_substrate_packs/gu_aperture.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';

const aperture = createGuAperturePack();
const config = {ownPacks: [aperture], packs: [aperture.id, 'l.living_body'], host: {laws: [GU_AWAKENING_LAW]},
    shared: {properties: [...sharedProperties(['alive']), ...GU_AWAKENING_PROPERTIES, ...GU_CONTROL_PROPERTIES],
        quantities: sharedQuantities(['vitality'])}};
const initial = aperturePool(1, 'initial');
const gu = (id, place, properties) => ({...guBodyHolder({id, needs: 'gu'}, {id, place, satiety: 30}),
    properties: {alive: true, gu_kind: id, ...properties}});
const novice = (id, aptitude, stride) => ({id, kind: 'body', as: ['operator'], place: 'bank',
    quantities: {'stock:primeval_stone': 2}, properties: {alive: true, gu_native_aptitude: aptitude, gu_hope_stride: stride}});

function setup() {
    return createEngineWorld({...config, holders: [
        {id: 'bank', kind: 'place'},
        {id: 'field', kind: 'place', properties: {gu_crossing_bank: 'bank', gu_crossing_open: true, gu_walkable_steps: 50}},
        novice('novice', 44, 27), novice('other', 18, 8),
        gu('hope', 'field'), gu('moonlight', 'field', {gu_keeper: 'novice', gu_controller: 'novice'}),
        {id: 'target', kind: 'body', as: ['creature'], place: 'field', properties: {alive: true}, quantities: {vitality: 20}},
    ]});
}

function start(engine, id, method, ids) {
    const bindings = Object.fromEntries(Object.entries(method.roles).map(([role, kind]) => [role, {kind, id: ids[role]}]));
    return startEngineWorking(engine, {id, law: GU_AWAKENING_LAW, method, bindings});
}
const ceremony = (engine, candidate = 'novice', id = 'rite') => start(engine, id, guAwakeningWorking,
    {candidate, bank: 'bank', field: 'field', hope: 'hope'});
const blade = (engine, id = 'blade') => start(engine, id, guAwakenedMoonblade,
    {operator: 'novice', specimen: 'moonlight', target: 'target'});
const restore = engine => restoreEngineWorld(serializeEngineWorld(engine), config);
function advance(engine, to) {
    const result = advanceEngineWorld(engine, to);
    assert.equal(result.pending, false);
    return result.engine;
}
const holder = (engine, id = 'novice') => engine.world.holders[id];
const outcome = (engine, id = 'rite') => engine.records.workings[id].record;

test('awakening opens an aperture on the original body and its sea pays for Moonblade', () => {
    const pending = ceremony(setup());
    const crossing = advance(pending, 2);
    assert.equal(holder(crossing).place, 'field');
    assert.equal(initial in holder(crossing).quantities, false);
    const premature = advance(blade(crossing, 'early-blade'), 3);
    assert.equal(outcome(premature, 'early-blade').status, 'interrupted');
    assert.equal(holder(premature, 'target').quantities.vitality, 20);

    const open = advance(restore(crossing), 5);
    assert.deepEqual(serializeEngineWorld(open), serializeEngineWorld(advance(pending, 5)));
    assert.deepEqual(outcome(open).receipts.at(-1).observed, {result: 'opened', grade: 'C', steps: 27});
    const sea = readAperture(holder(open));
    assert.equal(sea.capacity, 264_000);
    assert.equal(sea.stones, 2);
    assert.equal(sea.total, sea.capacity);
    const cast = advance(blade(open), 6);
    assert.equal(outcome(cast, 'blade').status, 'complete');
    assert.equal(holder(cast, 'target').quantities.vitality, 19);
    assert.equal(readAperture(holder(cast)).free, sea.capacity - guAbility('moonlight').cost * APERTURE_LAW.measure);
    assert.equal(readAperture(holder(advance(cast, 7))).free, readAperture(holder(cast)).free + sea.recoveryPerMinute);
});

test('leaving, losing the Hope Gu, or losing access to the full field stops a pending rite', () => {
    const before = advance(ceremony(setup()), 2);
    const changes = [{op: 'move', holder: 'novice', to: 'bank'}, {op: 'move', holder: 'hope', to: 'bank'},
        {op: 'property', holder: 'field', property: 'gu_walkable_steps', value: 12}];
    for (const change of changes) {
        const after = advance(restore(applyEngineOps(before, [change], 'fixture:change')), 5);
        assert.equal(outcome(after).status, 'interrupted');
        assert.equal(initial in holder(after).quantities, false);
    }
});

test('crossing depends on access and a low response can finish the ceremony without opening', () => {
    const pending = ceremony(setup());
    const closed = applyEngineOps(pending, [{op: 'property', holder: 'field', property: 'gu_crossing_open', value: false}], 'fixture:closed');
    const denied = advance(closed, 5);
    assert.equal(outcome(denied).status, 'interrupted');
    assert.equal(holder(denied).place, 'bank');
    const other = advance(ceremony(pending, 'other', 'other-rite'), 5);
    assert.deepEqual(outcome(other, 'other-rite').receipts.at(-1).observed, {result: 'unopened', steps: 8});
    assert.equal(initial in holder(other, 'other').quantities, false);
    assert.equal(readAperture(holder(other)).grade, 'C');
});

test('returning to the bank cannot reopen the first aperture or refill the sea', () => {
    const spent = advance(blade(advance(ceremony(setup()), 5)), 6);
    const bank = applyEngineOps(spent, [{op: 'move', holder: 'novice', to: 'bank'}], 'fixture:return');
    const repeated = advance(ceremony(bank, 'novice', 'repeat'), 11);
    assert.equal(outcome(repeated, 'repeat').status, 'interrupted');
    assert.equal(holder(repeated).place, 'bank');
    assert.deepEqual(readAperture(holder(repeated)), readAperture(holder(advance(bank, 11))));
});
