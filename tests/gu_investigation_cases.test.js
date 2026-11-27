import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking} from '../src/engine_world.js';
import {viewWorking} from '../src/kernel_working.js';
import {coverageCase, investigationWorking} from '../src/world_packs/gu_investigation_cases.js';

const caseId = 'combined-investigation';
const fixture = () => coverageCase(caseId);
const spec = step => fixture().timeline.find(row => row.id === `cast-${step}`).working;
const start = (engine, step, overrides) => {
    const {id, ...inputs} = {...spec(step), ...overrides};
    return startEngineWorking(engine, {id, ...investigationWorking(inputs)});
};
const setup = ({world, engine}) => createEngineWorld({...world, ...engine});
const observe = ({records}, id) => viewWorking(records.workings[id].record).steps[0].observed;
const account = ({world}) => world.holders.keeper.quantities['energy:primeval'];

test('one charge per cast buys a wide sweep or a stronger single-subject reading', () => {
    const initial = setup(fixture());
    const sweeping = start(initial, 'sweep');
    assert.equal(account(sweeping), 9);
    const {engine: swept} = advanceEngineWorld(sweeping, 1);
    assert.deepEqual(observe(swept, 'sweep'), {mode: 'sweep', outcome: 'read', contacts: [
        {place: 'ford', channel: 'sight'}, {place: 'ridge', channel: 'spirit'},
    ]});
    assert.equal(account(swept), 6);

    const probing = start(swept, 'probe');
    const saved = JSON.parse(JSON.stringify(serializeEngineWorld(probing)));
    const restored = restoreEngineWorld(saved, {...fixture().engine, host: {laws: probing.host.laws}});
    const {engine: probed} = advanceEngineWorld(restored, 2);
    assert.deepEqual(serializeEngineWorld(probed), serializeEngineWorld(advanceEngineWorld(probing, 2).engine));
    assert.deepEqual(observe(probed, 'probe'), {mode: 'probe', outcome: 'read', contacts: [
        {place: 'ford', channel: 'spirit', cue: 'uneven-pulse'},
    ]});
    assert.equal(account(probed), 3);
    assert.equal(probed.world.holders.veiled.properties.gu_spirit_veil, 3);
});

test('a probe at sweep-only distance spends once and reports no contact', () => {
    const probing = start(setup(fixture()), 'probe', {subjects: ['distant']});
    const {engine} = advanceEngineWorld(probing, 1);
    assert.deepEqual(observe(engine, 'probe'), {mode: 'probe', outcome: 'read', contacts: []});
    assert.equal(account(engine), 6);
    assert.throws(() => investigationWorking({...spec('probe'), subjects: ['veiled', 'clear']}), /one distinct probe subject/);
});

test('losing control of the support before settlement yields paid recoil and no partial sight reading', () => {
    const cast = start(setup(fixture()), 'lost-support', {subjects: ['clear']});
    const moved = applyEngineOps(cast, [{op: 'move', holder: 'spirit-gu', to: 'ridge'}], 'test:support-loss');
    const {engine} = advanceEngineWorld(moved, 1);
    assert.deepEqual(observe(engine, 'lost-support'), {mode: 'probe', outcome: 'backlash', recoil: 1, contacts: []});
    assert.equal(account(engine), 6);
    assert.equal(engine.world.holders['sight-gu'].quantities.vitality, 2);
    assert.equal(engine.world.holders['spirit-gu'].quantities.vitality, 3);
    assert.equal(engine.records.workings['lost-support'].record.receipts[0].truth.costs.length, 1);
});

test('a replacement Gu fills the role and a rank shortfall cannot reduce the core below one', () => {
    const data = fixture();
    const support = data.world.holders.find(row => row.id === 'spirit-gu');
    data.world.holders.push({...support, id: 'replacement'});
    const {bindings} = spec('probe');
    const replacement = {...bindings, support: {kind: 'gu', id: 'replacement'}};
    const run = start(setup(data), 'probe', {bindings: replacement});
    assert.equal(observe(advanceEngineWorld(run, 1).engine, 'probe').contacts.length, 1);

    const altered = applyEngineOps(run, [
        {op: 'property', holder: 'replacement', property: 'gu_rank', value: 1},
        {op: 'set', holder: 'sight-gu', quantity: 'vitality', amount: 1},
    ], 'test:rank-shortfall');
    const {engine} = advanceEngineWorld(altered, 1);
    assert.deepEqual(observe(engine, 'probe'), {mode: 'probe', outcome: 'backlash', recoil: 0, contacts: []});
    assert.equal(engine.world.holders['sight-gu'].quantities.vitality, 1);
    assert.equal(account(engine), 6);
});
