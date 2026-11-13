import assert from 'node:assert/strict';
import test from 'node:test';
import {BREW_LAW, BREW_PUBLISHES, brewBalance, brewMethod} from '../src/brew_law.js';
import {defineSeparationLaw} from '../src/craft_process_separation.js';
import {brewMeasureQuantity} from '../src/engine_brew_stock.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {createBrewVaporPack} from '../src/world_substrate_packs/brew_vapor.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';

test('saved distillation delivers a finite room-local vapor dose to the body inbox', () => {
    const vapor = createBrewVaporPack({constituents: {irritant: {harm: 'vapor-irritation'}}, uptakePermille: 500});
    const law = defineSeparationLaw({id: 'trial.vapor', revision: 1, constituents: {irritant: {volatilePerVolume: 10}},
        costs: Object.fromEntries(['strain', 'decant', 'skim', 'distill', 'divide'].map(op => [op, {secondsPerVolume: 60, workPerVolume: 1}])),
        filmRetainPermille: 0, filmReleasePerVolume: 0, cleanWaterPerAmount: 1, cleanWorkPerAmount: 1});
    const config = {ownPacks: [vapor], packs: ['b.vapor', 'l.living_body'],
        shared: {quantities: [WORLD_QUANTITIES.stock], effectKinds: BREW_PUBLISHES}, host: {laws: [BREW_LAW], things: {
            'vessel:still': {separator: {material: 'glass', capacity: 3, closure: 'reflux', condenserPermille: 0,
                meshSize: 0, thermalMass: 1, heatTransfer: 1}},
            'lot:lot': {material: 'irritant', properties: {constituents: {irritant: 1000}}},
        }}};
    const body = (id, place, sealed = false) => ({id, place, kind: 'body',
        tags: ['living.body', 'breathes.air', ...(sealed ? ['breath.sealed'] : [])], quantities: {satiety: 0},
        state: {'l.living_body': livingBodyState({species: 'human', rate: 0})}});
    const engine = createEngineWorld({...config, holders: [
        {id: 'bench', kind: 'place'}, {id: 'hall', kind: 'place'},
        {id: 'still', kind: 'thing', as: ['vessel'], place: 'bench'},
        {id: 'lot', kind: 'thing', as: ['lot'], place: 'bench', quantities: {[brewMeasureQuantity]: 20}},
        body('brewer', 'bench'), body('helper', 'bench'), body('protected', 'bench', true), body('visitor', 'hall'),
    ]});
    const method = brewMethod({id: 'trial.vapor', slots: [{id: 'lot'}], process: [
        {op: 'distill', minutes: 2, options: {law, volume: 2}},
    ]});
    const pending = startEngineWorking(engine, {id: 'brew', law: BREW_LAW, method,
        bindings: {vessel: {kind: 'vessel', id: 'still'}, lot: {kind: 'lot', id: 'lot'}}});
    const advance = (state, to) => advanceEngineWorld(state, to).engine;
    const reload = state => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(state))), config);
    const inbox = (state, id) => state.world.holders[id].state['l.living_body'].inbox.map(row => row.amount);
    const mid = advance(pending, 1);
    const settled = reload(advance(reload(mid), 2));
    assert.deepEqual(serializeEngineWorld(settled), serializeEngineWorld(advance(pending, 2)));
    assert.deepEqual(inbox(settled, 'brewer'), [5]);
    assert.deepEqual(inbox(settled, 'helper'), [5]);
    assert.deepEqual(inbox(settled, 'protected'), []);
    assert.deepEqual(inbox(settled, 'visitor'), []);
    const released = settled.world.chain.find(row => row.kind === 'vapor.released');
    const allocation = settled.world.chain.filter(row => row.cause === released.seq &&
        ['brew.vapor-exposure', 'brew.vapor-unabsorbed'].includes(row.kind));
    assert.deepEqual(allocation.map(row => row.detail.amount), [5, 5, 10]);
    assert.deepEqual(brewBalance(settled.records.workings.brew.record.facts), {admitted: 20, held: 0, released: 20, balanced: true});
    assert.deepEqual(inbox(advance(reload(settled), 3), 'brewer'), [5]);

    const left = applyEngineOps(mid, [{op: 'move', holder: 'helper', to: 'hall'}], 'step-out');
    const after = advance(reload(left), 2);
    assert.deepEqual(inbox(after, 'brewer'), [10]);
    assert.deepEqual(inbox(after, 'helper'), []);

    const emptyBench = applyEngineOps(left, [{op: 'move', holder: 'brewer', to: 'hall'}], 'clear-bench');
    const vented = advance(reload(emptyBench), 2);
    assert.deepEqual(inbox(vented, 'brewer'), []);
    assert.equal(vented.world.chain.find(row => row.kind === 'brew.vapor-unabsorbed').detail.amount, 20);
});
