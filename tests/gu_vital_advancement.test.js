import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking} from '../src/engine_world.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {EARTH_QI, GREEN_GRAPE, HEAVEN_QI} from '../src/world_packs/gu_ascension_working.js';
import {GU_CONTROL_PROPERTIES} from '../src/world_packs/gu_first_control.js';
import {GU_VITAL_ADVANCEMENT_LAW as law, guVitalAdvancementPack, vitalAdvancementWorking,
    vitalRestorationWorking} from '../src/world_packs/gu_vital_advancement.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';

const config = {ownPacks: [guVitalAdvancementPack], packs: ['l.living_body', guVitalAdvancementPack.id], host: {laws: [law]},
    shared: {quantities: sharedQuantities(['energy', 'vitality']), properties: [
        ...sharedProperties(['alive']), ...GU_CONTROL_PROPERTIES, {id: 'gu_rank', type: 'level', min: 1}, {id: 'injured', type: 'flag'},
    ]}};
const kind = 'man-as-before';
function setup({steady = true, occupied = false} = {}) {
    return createEngineWorld({...config, holders: [
        {id: 'aperture', kind: 'place', quantities: {[HEAVEN_QI]: 2, [EARTH_QI]: 2}, properties: {gu_quench_steady: steady}},
        {id: 'outside', kind: 'place'},
        {id: 'master', kind: 'body', as: ['operator'], place: 'aperture', properties: {alive: true}, quantities: {[GREEN_GRAPE]: 2}},
        {id: 'patient', kind: 'body', as: ['creature'], place: 'aperture',
            properties: {alive: true, gu_prior_vitality: 10}, quantities: {vitality: 7}},
        {...guBodyHolder({id: kind, needs: 'gu'}, {id: 'vital', place: 'aperture', satiety: 20}),
            properties: {alive: true, gu_kind: kind, gu_rank: 5, gu_keeper: 'master', gu_controller: 'master', gu_vital_master: 'master'}},
        ...(occupied ? [{id: 'incumbent', kind: 'body', place: 'outside', properties: {alive: true, gu_kind: kind, gu_rank: 6}}] : []),
    ], lawFields: occupied ? [{id: 'gu.unique.man-as-before', kind: 'gu.unique.man-as-before',
        scope: 'world', params: {specimen: 'incumbent'}}] : []});
}
const advance = (engine, at) => {
    const result = advanceEngineWorld(engine, at);
    assert.equal(result.pending, false);
    return result.engine;
};
const restore = engine => restoreEngineWorld(serializeEngineWorld(engine), config);
const holder = (engine, id) => engine.world.holders[id];
const vital = engine => holder(engine, 'vital');
const qi = engine => [HEAVEN_QI, EARTH_QI].map(key => holder(engine, 'aperture').quantities[key]);
function start(engine, id, method, targetRole, target) {
    return startEngineWorking(engine, {id, law, method, bindings: {
        operator: {kind: 'operator', id: 'master'}, specimen: {kind: 'gu', id: 'vital'},
        [targetRole]: {kind: method.roles[targetRole], id: target},
    }});
}
const raise = (engine, id = 'raise') => start(engine, id, vitalAdvancementWorking, 'site', 'aperture');
const heal = (engine, id) => start(engine, id, vitalRestorationWorking, 'patient', 'patient');

test('the same bonded specimen advances through restore and pays for a new restoration', () => {
    const initial = setup();
    const early = advance(heal(initial, 'early'), 1);
    assert.equal(early.records.workings.early.record.status, 'interrupted');
    assert.equal(holder(early, 'master').quantities[GREEN_GRAPE], 2);
    const queued = raise(initial);
    const cocoon = advance(queued, 1);
    assert.deepEqual(qi(cocoon), [1, 2]);
    assert.equal(vital(cocoon).properties.gu_rank, 5);
    const advanced = advance(restore(cocoon), 3);
    assert.deepEqual(serializeEngineWorld(advanced), serializeEngineWorld(advance(queued, 3)));
    assert.deepEqual(qi(advanced), [1, 1]);
    assert.equal(vital(advanced).properties.gu_rank, 6);
    assert.equal(vital(advanced).properties.gu_vital_master, 'master');
    assert.equal(vital(advanced).properties.gu_controller, 'master');
    assert.equal(vital(advanced).quantities.satiety, 17);
    assert.equal(advanced.world.laws[0].params.specimen, 'vital');
    const recovered = advance(restore(heal(advanced, 'after')), 4);
    assert.equal(holder(recovered, 'patient').quantities.vitality, 10);
    assert.equal(holder(recovered, 'master').quantities[GREEN_GRAPE], 1);
});

test('control failure spends the qi and injures the vital Gu while its master lives', () => {
    const failed = advance(restore(advance(raise(setup({steady: false})), 1)), 3);
    assert.deepEqual(qi(failed), [1, 1]);
    assert.equal(vital(failed).properties.gu_rank, 5);
    assert.equal(vital(failed).properties.alive, true);
    assert.equal(vital(failed).properties.injured, true);
    assert.equal(vital(failed).properties.gu_vital_master, 'master');
    assert.equal(failed.world.laws.length, 0);
    assert.ok(failed.world.chain.some(row => row.kind === 'gu.vital-advanced' && row.detail?.cause === 'control'));
});

test('a living incumbent blocks the new claim, and loss of custody blocks the final debit', () => {
    const occupied = advance(raise(setup({occupied: true})), 3);
    assert.equal(vital(occupied).properties.gu_rank, 5);
    assert.equal(occupied.world.laws[0].params.specimen, 'incumbent');
    assert.deepEqual(qi(occupied), [1, 1]);
    const prepared = advance(raise(setup()), 1);
    const lost = applyEngineOps(prepared, [{op: 'property', holder: 'vital', property: 'gu_keeper', value: 'another'}], 'fixture:loss');
    const refused = advance(restore(lost), 3);
    assert.equal(refused.records.workings.raise.record.status, 'interrupted');
    assert.deepEqual(qi(refused), [1, 2]);
});

test('two cocoon orders cannot commit the same precursor, and quenching rechecks live qi', () => {
    const prepared = advance(raise(raise(setup()), 'second'), 1);
    assert.deepEqual(qi(prepared), [1, 2]);
    assert.equal(prepared.records.workings.second.record.status, 'interrupted');
    const drained = applyEngineOps(prepared, [{op: 'set', holder: 'aperture', quantity: EARTH_QI, amount: 0}], 'fixture:drained');
    const refused = advance(restore(drained), 3);
    assert.equal(refused.records.workings.raise.record.status, 'interrupted');
    assert.deepEqual(qi(refused), [1, 0]);
    assert.equal(vital(refused).properties.gu_rank, 5);
});
