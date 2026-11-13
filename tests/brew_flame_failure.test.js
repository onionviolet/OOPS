import assert from 'node:assert/strict';
import test from 'node:test';
import {BREW_LAW, BREW_PUBLISHES, brewBalance} from '../src/brew_law.js';
import {brewMeasureQuantity} from '../src/engine_brew_stock.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';
import {cureForBoilsTrial} from '../src/world_packs/hp_brew_pack.js';
import {residueQuantity} from '../src/world_substrate_packs/residue_flow.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';

test('Cure for Boils: equal heat at quill addition, different flame contact and a conserved spill after restore', () => {
    const results = [];
    for (const [lift, tooCold] of [[false, false], [true, false], [false, true]]) {
        const {lots, method} = cureForBoilsTrial({lift, splash: true});
        if (tooCold) method.steps.find(step => step.op === 'react').options.reactions[0].minTemperature = 76;
        const safe = lift || tooCold;
        const residue = Object.fromEntries(['acid', 'cure', 'nettles:matrix', 'fangs:matrix', 'slugs:matrix', 'quills:matrix']
            .map(part => [residueQuantity(part), 0]));
        const config = {packs: ['w.residue_flow', 'l.living_body'], shared: {quantities: [WORLD_QUANTITIES.stock, WORLD_QUANTITIES.condition],
            effectKinds: BREW_PUBLISHES}, host: {laws: [BREW_LAW], things: {
            'vessel:pot': {thermal: {capacity: 10, surfaceArea: 2, heatTransfer: 1, thermalMass: 1}},
            ...Object.fromEntries(Object.values(lots).map(lot => [`lot:${lot.id}`, {material: lot.material, properties: {constituents: lot.properties}}])),
        }}};
        const holders = [{id: 'bench', kind: 'place'}, {id: 'hall', kind: 'place'}, {id: 'drain', kind: 'place', quantities: residue},
            {id: 'pot', kind: 'thing', as: ['vessel'], place: 'bench', quantities: {condition: 100}},
            ...['pupil', 'bystander'].map(id => ({id, kind: 'body', place: 'bench', tags: ['living.body'], quantities: {satiety: 0},
                state: {'l.living_body': livingBodyState({species: 'human', rate: 0})}})),
            ...Object.values(lots).map(lot => ({id: lot.id, kind: 'thing', as: ['lot'], place: 'bench', quantities: {[brewMeasureQuantity]: lot.amount}}))];
        const engine = createEngineWorld({...config, holders, links: [{id: 'runoff', kind: 'water', from: 'bench', to: 'drain', oneWay: true}]});
        const run = startEngineWorking(engine, {id: 'trial', law: BREW_LAW, method, bindings: {vessel: {id: 'pot', kind: 'vessel'}, target: {id: 'pupil', kind: 'body'},
            ...Object.fromEntries(Object.keys(lots).map(id => [id, {id, kind: 'lot'}]))}});
        const advance = (state, minute) => advanceEngineWorld(state, minute).engine;
        const save = serializeEngineWorld;
        const reload = state => restoreEngineWorld(JSON.parse(JSON.stringify(save(state))), config);
        assert.equal(run.world.holders.quills.quantities[brewMeasureQuantity], 1000);
        const done = reload(advance(reload(advance(run, 1)), 2));
        assert.deepEqual(save(done), save(advance(run, 2)));
        const {record} = done.records.workings.trial;
        assert.equal(record.status, 'complete');
        assert.equal(record.facts.brew.fuel, 30);
        assert.equal(done.world.holders.quills.quantities[brewMeasureQuantity], 0);
        assert.equal(done.world.holders.pot.quantities.condition, safe ? 100 : 0);
        assert.equal(done.world.holders.drain.quantities[residueQuantity('acid')], safe ? 0 : 900);
        assert.equal(Object.values(done.world.holders.drain.quantities).reduce((n, amount) => n + amount, 0), safe ? 0 : 3600);
        const harm = (world, id) => world.world.holders[id].state['l.living_body'].inbox;
        const touched = done.world.chain.find(row => row.kind === 'brew.spill-contact');
        assert.equal(Object.values(touched?.detail.contents ?? {}).reduce((n, amount) => n + amount, 0), safe ? 0 : 400);
        assert.deepEqual(harm(done, 'pupil'), safe ? [] : [{at: 2, kind: 'corrosive-spill', amount: 100, by: 'pot'}]);
        assert.deepEqual(harm(done, 'bystander'), []);
        assert.deepEqual(harm(advance(reload(done), 3), 'pupil'), harm(done, 'pupil'));
        if (!safe) {
            const moved = applyEngineOps(advance(run, 1), [{op: 'move', holder: 'pupil', to: 'hall'}], 'step-away');
            const escaped = advance(reload(moved), 2);
            assert.deepEqual(harm(escaped, 'pupil'), []);
            assert.equal(escaped.world.holders.drain.quantities[residueQuantity('acid')], 1000);
        }
        assert.deepEqual(brewBalance(record.facts), {admitted: 4000, held: safe ? 4000 : 0, released: safe ? 0 : 4000, balanced: true});
        const observed = record.receipts.find(row => row.op === 'react').observed;
        assert.deepEqual(observed.cues, safe ? [] : ['Green fumes']);
        results.push(observed.flame);
    }
    assert.deepEqual(results, [{active: true, temperature: 75}, {active: false, temperature: 75}, {active: true, temperature: 75}]);
});
