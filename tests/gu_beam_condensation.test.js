import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking} from '../src/engine_world.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {beamDemonstration, quietBeamDemonstration, condensedBeamWorking, GU_BEAM_LAW as law, guBeamCondensationPack,
    stagedQuietBeamWorking, startBeamCondensation, witnessedQuietBeamWorking} from '../src/world_packs/gu_beam_condensation.js';
import {GU_CONTROL_PROPERTIES} from '../src/world_packs/gu_first_control.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';
import {readLineage} from '../src/world_substrate.js';

const fuel = 'energy:primeval.rank1', petals = 'stock:moon-orchid-petals', stone = 'stock:primeval_stone';
const config = {ownPacks: [guBeamCondensationPack], packs: ['l.living_body', guBeamCondensationPack.id], host: {laws: [law]},
    shared: {quantities: sharedQuantities(['energy', 'stock', 'noise']), properties: [...sharedProperties(['alive']), ...GU_CONTROL_PROPERTIES,
        {id: 'gu_rank', type: 'level', min: 1}]}};
const gu = (id, kind) => ({...guBodyHolder({id: kind, needs: 'gu'}, {id, place: 'bench', satiety: 24}),
    properties: {alive: true, gu_kind: kind, gu_keeper: 'keeper', gu_controller: 'keeper'}});
function setup() {
    return createEngineWorld({...config, holders: [
        ...['bench', 'rest', 'outside'].map(id => ({id, kind: 'place', ...(id === 'bench' && {quantities: {noise: 5}})})),
        {id: 'keeper', kind: 'body', as: ['operator'], place: 'bench',
            properties: {alive: true}, quantities: {[fuel]: 12, [petals]: 2, [stone]: 1}},
        ...[['trial-beam', 1], ['second-beam', 1], ['heavy-beam', 2]].map(([id, load]) =>
            ({id, kind: 'thing', place: 'bench', properties: {gu_beam_load: load}})),
        gu('jade', 'white-jade'), gu('moon', 'moonlight'), gu('net', 'silk-catch'),
    ]});
}
const advance = (engine, to) => advanceEngineWorld(engine, to).engine;
const restore = engine => restoreEngineWorld(serializeEngineWorld(engine), config);
const holder = (engine, id) => engine.world.holders[id];
const purse = engine => holder(engine, 'keeper').quantities;
function run(engine, id, method, ids) {
    return startEngineWorking(engine, {id, law, method, bindings: Object.fromEntries(Object.entries(method.roles)
        .map(([role, kind]) => [role, {kind, id: ids[role]}]))});
}
const demo = (engine, method = beamDemonstration) => run(engine, 'demo', method, {
    operator: 'keeper', beam: 'trial-beam', rest: 'rest', brace: 'jade', blade: 'moon', catch: 'net',
});
const condense = engine => startBeamCondensation(engine, {id: 'shape', operator: 'keeper', site: 'bench'});
const cast = (engine, beam) => run(engine, beam, condensedBeamWorking, {operator: 'keeper', beam, rest: 'rest', specimen: 'shape.gu'});

test('a measured demonstration yields a living Beam Catch Gu with its own limit and cost', () => {
    const demonstrated = advance(demo(setup()), 1);
    assert.equal(holder(demonstrated, 'trial-beam').place, 'rest');
    assert.equal(purse(demonstrated)[fuel], 6);
    const shaped = advance(condense(demonstrated), 2);
    assert.equal(purse(shaped)[petals], 0);
    assert.equal(purse(shaped)[stone], 0);
    const made = advance(restore(shaped), 17);
    assert.deepEqual(serializeEngineWorld(made), serializeEngineWorld(advance(shaped, 17)));
    assert.equal(holder(made, 'shape.gu').properties.gu_kind, 'beam-catch');
    assert.equal(holder(made, 'shape.gu').properties.gu_rank, 1);
    assert.equal(readLineage(made.world, 'shape.gu').at(-1).note, 'Demonstration: demo');
    const lowered = advance(cast(made, 'second-beam'), 18);
    assert.equal(holder(lowered, 'second-beam').place, 'rest');
    assert.equal(purse(lowered)[fuel], 4);

    const overloaded = advance(cast(lowered, 'heavy-beam'), 19);
    assert.equal(holder(overloaded, 'heavy-beam').place, 'bench');
    assert.equal(purse(overloaded)[fuel], 2);
    const hungry = advance(cast(advance(made, 28), 'second-beam'), 29);
    assert.equal(hungry.records.workings['second-beam'].record.receipts[0].reason, 'needs feeding');
    assert.equal(purse(hungry)[fuel], 6);
    assert.equal(holder(hungry, 'second-beam').place, 'bench');
});

test('a blocked demonstration cannot supply a recipe and leaving during development keeps the shaping price spent', () => {
    const warded = applyEngineOps(setup(), [{op: 'law_add', field: {id: 'hold', kind: 'block', scope: 'trial-beam',
        params: {verb: 'move', object: 'position'}}}], 'fixture:ward');
    const failed = advance(condense(advance(demo(warded), 1)), 2);
    assert.equal(holder(failed, 'trial-beam').place, 'bench');
    assert.equal(purse(failed)[fuel], 6);
    assert.equal(purse(failed)[petals], 2);
    assert.equal(failed.records.workings.shape.record.status, 'interrupted');

    const shaped = advance(condense(advance(demo(setup()), 1)), 2);
    const left = applyEngineOps(shaped, [{op: 'move', holder: 'keeper', to: 'outside'}], 'fixture:left');
    const stopped = advance(restore(left), 17);
    assert.equal(stopped.records.workings.shape.record.status, 'interrupted');
    assert.equal(purse(stopped)[petals], 0);
    assert.equal(holder(stopped, 'shape.gu'), undefined);
});

test('both measured outputs condense into one living Gu and land from one paid cast', () => {
    const noise = engine => holder(engine, 'bench').quantities.noise;
    const demonstrated = advance(demo(setup(), quietBeamDemonstration), 1);
    assert.equal(holder(demonstrated, 'trial-beam').place, 'rest');
    assert.equal(noise(demonstrated), 3);
    const shaped = advance(condense(demonstrated), 2);
    const made = advance(restore(shaped), 17);
    assert.deepEqual(serializeEngineWorld(made), serializeEngineWorld(advance(shaped, 17)));
    assert.equal(holder(made, 'shape.gu').properties.gu_beam_quiet, 2);
    const lowered = advance(cast(made, 'second-beam'), 18);
    assert.equal(holder(lowered, 'second-beam').place, 'rest');
    assert.equal(noise(lowered), 1);
    assert.equal(purse(lowered)[fuel], 4);

    const staged = engine => run(engine, 'staged', stagedQuietBeamWorking, {
        operator: 'keeper', beam: 'second-beam', rest: 'rest', specimen: 'shape.gu',
    });
    const loweredFirst = advance(staged(made), 18);
    assert.equal(holder(loweredFirst, 'second-beam').place, 'rest');
    assert.equal(noise(loweredFirst), 3);
    assert.equal(purse(loweredFirst)[fuel], 4);
    const quieted = advance(restore(loweredFirst), 19);
    assert.deepEqual(serializeEngineWorld(quieted), serializeEngineWorld(advance(staged(made), 19)));
    assert.equal(noise(quieted), 1);
    assert.equal(purse(quieted)[fuel], 3);

    const pinned = applyEngineOps(made, [{op: 'law_add', field: {id: 'beam-pin', kind: 'block', scope: 'second-beam',
        params: {verb: 'move', object: 'position'}}}], 'fixture:pin-beam');
    const blocked = advance(restore(advance(staged(pinned), 18)), 19);
    assert.equal(holder(blocked, 'second-beam').place, 'bench');
    assert.equal(noise(blocked), 3);
    assert.equal(purse(blocked)[fuel], 4);
    assert.equal(blocked.records.workings.staged.record.receipts.at(-1).reason, 'The beam did not reach its rest.');
    const unfunded = applyEngineOps(loweredFirst, [{op: 'set', holder: 'keeper', quantity: fuel, amount: 0}], 'fixture:spent');
    const stopped = advance(restore(unfunded), 19);
    assert.equal(holder(stopped, 'second-beam').place, 'rest');
    assert.equal(noise(stopped), 3);
    assert.equal(stopped.records.workings.staged.record.status, 'interrupted');

    const witnessed = engine => run(engine, 'witnessed', witnessedQuietBeamWorking, {
        operator: 'keeper', beam: 'second-beam', rest: 'rest', specimen: 'shape.gu',
    });
    const ownMove = advance(witnessed(made), 18);
    const ownQuiet = advance(restore(ownMove), 19);
    assert.deepEqual(serializeEngineWorld(ownQuiet), serializeEngineWorld(advance(witnessed(made), 19)));
    assert.equal(noise(ownQuiet), 1);
    assert.equal(purse(ownQuiet)[fuel], 3);
    const substituted = engine => applyEngineOps(advance(engine, 18), [
        {op: 'move', holder: 'second-beam', to: 'rest'},
    ], 'fixture:other-actor-moves-beam');
    const otherMove = advance(restore(substituted(witnessed(pinned))), 19);
    assert.equal(holder(otherMove, 'second-beam').place, 'rest');
    assert.equal(noise(otherMove), 3);
    assert.equal(purse(otherMove)[fuel], 4);
    assert.equal(otherMove.records.workings.witnessed.record.receipts.at(-1).reason, 'This cast did not lower the beam.');
    assert.equal(noise(advance(restore(substituted(staged(pinned))), 19)), 1);

    const warded = applyEngineOps(setup(), [{op: 'law_add', field: {id: 'noise-ward', kind: 'block', scope: 'bench',
        params: {verb: 'remove', object: 'noise'}}}], 'fixture:noise-ward');
    const partial = advance(demo(warded, quietBeamDemonstration), 1);
    assert.equal(holder(partial, 'trial-beam').place, 'rest');
    assert.equal(noise(partial), 5);
    const refused = advance(condense(partial), 2);
    assert.equal(refused.records.workings.shape.record.status, 'interrupted');
    assert.equal(purse(refused)[petals], 2);
    assert.equal(purse(refused)[fuel], 6);
});
