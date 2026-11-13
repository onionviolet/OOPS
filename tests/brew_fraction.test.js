import assert from 'node:assert/strict';
import test from 'node:test';
import {BREW_LAW, BREW_PUBLISHES, brewBalance, brewMethod} from '../src/brew_law.js';
import {defineSeparationLaw} from '../src/craft_process_separation.js';
import {brewDoseContents, brewMeasureQuantity, brewOriginsOf, brewStorageOf} from '../src/engine_brew_stock.js';
import {advanceEngineWorld, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';

const law = defineSeparationLaw({id: 'trial.fraction', revision: 1, constituents: {active: {}, 'active:spent': {}, grit: {particleSize: 10}, 'leaf:matrix': {}},
    costs: Object.fromEntries(['strain', 'decant', 'skim', 'distill', 'divide'].map(op => [op, {secondsPerVolume: 60, workPerVolume: 2}])),
    filmRetainPermille: 0, filmReleasePerVolume: 0, cleanWaterPerAmount: 1, cleanWorkPerAmount: 1});
const work = 'stock:filter-work';
const separator = (meshSize, capacity = 2) => ({material: 'glass', capacity, closure: 'open', condenserPermille: 0,
    meshSize, thermalMass: 1, heatTransfer: 1, accounts: {work}});
const ref = (kind, id) => ({kind, id});
const record = (engine, id) => engine.records.workings[id].record;
const contents = (engine, id) => brewDoseContents(engine.world.holders[id]);
const advance = (engine, at) => advanceEngineWorld(engine, at).engine;

function trial(meshSize, available = 4, shelfLife) {
    const config = {packs: ['a.mind'], shared: {quantities: [WORLD_QUANTITIES.stock]}, host: {laws: [BREW_LAW], things: {
        'vessel:press': {separator: separator(meshSize)},
        'vessel:second-press': {separator: separator(5)},
        'vessel:small-press': {separator: separator(5, 1)},
        'lot:leaf': {material: 'leaf', origin: 'garden', properties: {constituents: {active: 500, grit: 300}}},
        'lot:salt': {material: 'salt', properties: {constituents: {binder: 1000}}},
    }}};
    const place = 'bench';
    const thing = (id, kind, quantities = {}) => ({id, kind: 'thing', as: [kind], place, quantities});
    const engine = createEngineWorld({...config, holders: [{id: place, kind: 'place'},
        thing('press', 'vessel', {[work]: available}), thing('mixing-pot', 'vessel'),
        thing('second-press', 'vessel', {[work]: 4}), thing('small-press', 'vessel', {[work]: 4}),
        thing('leaf', 'lot', {[brewMeasureQuantity]: 20}), thing('salt', 'lot', {[brewMeasureQuantity]: 5}),
        thing('filtrate', 'flask'), thing('product', 'flask'), thing('cake', 'flask'), thing('spare', 'flask')]});
    const method = brewMethod({id: 'trial.filter', slots: [{id: 'leaf'}], process: [
        {op: 'strain', minutes: 2, options: {law, volume: 2, phases: {grit: 'suspended'}}},
        {op: 'pour', flask: 'filtrate', options: {index: 0, ...(shelfLife ? {shelfLife} : {})}},
        ...(meshSize === 5 ? [{op: 'divide', options: {doses: 1}}, {op: 'pour', flask: 'cake', options: {index: 1}}] : []),
    ]});
    const reload = state => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(state))), config);
    const pending = startEngineWorking(engine, {id: 'filter', law: BREW_LAW, method, bindings: {
        vessel: ref('vessel', 'press'), leaf: ref('lot', 'leaf'), filtrate: ref('flask', 'filtrate'),
        ...(meshSize === 5 ? {cake: ref('flask', 'cake')} : {})}});
    const separated = reload(advance(reload(advance(pending, 1)), 2));
    assert.deepEqual(serializeEngineWorld(separated), serializeEngineWorld(advance(pending, 2)));
    return {separated, reload};
}

test('a paid mesh separation makes a portable exact fraction that changes the next reaction after restore', () => {
    for (const mesh of [5, 20]) {
        const {separated, reload} = trial(mesh);
        const filtered = record(separated, 'filter');
        assert.equal(filtered.status, 'complete');
        assert.deepEqual(contents(separated, 'filtrate'), {active: 10, 'leaf:matrix': 4, ...(mesh === 20 ? {grit: 6} : {})});
        assert.deepEqual(contents(separated, 'cake'), mesh === 5 ? {grit: 6} : {});
        assert.equal(separated.world.holders.press.quantities[work], 0);
        assert.ok(brewBalance(filtered.facts).balanced);
        const method = brewMethod({id: 'trial.mix', slots: [{id: 'salt'}], process: [
            {op: 'admit-fraction', flask: 'filtrate', minutes: 1},
            {op: 'react', options: {reactions: [
                {id: 'grit-binds-first', priority: 1, reactants: {grit: 1, binder: 1}, products: {sludge: 2}},
                {id: 'active-binds', reactants: {active: 2, binder: 1}, products: {usable: 3}},
            ]}}, {op: 'divide', options: {doses: 1}}, {op: 'pour', options: {index: 0}},
        ]});
        const pending = startEngineWorking(separated, {id: 'mix', law: BREW_LAW, method, bindings: {
            vessel: ref('vessel', 'mixing-pot'), salt: ref('lot', 'salt'), filtrate: ref('flask', 'filtrate'), flask: ref('flask', 'product')}});
        const mixed = reload(advance(reload(pending), 3));
        assert.deepEqual(serializeEngineWorld(mixed), serializeEngineWorld(advance(pending, 3)));
        assert.equal(record(mixed, 'mix').status, 'complete');
        assert.deepEqual(contents(mixed, 'filtrate'), {});
        assert.deepEqual(contents(mixed, 'product'), mesh === 5 ? {usable: 15, 'leaf:matrix': 4} :
            {active: 10, grit: 1, sludge: 10, 'leaf:matrix': 4});
        assert.ok(brewBalance(record(mixed, 'mix').facts).balanced);
    }
});

test('a restored second filter reads the transferred volume, even after active material ages', () => {
    for (const shelfLife of [undefined, {life: 2, keep: ['grit']}]) {
        const {separated, reload} = trial(20, 4, shelfLife);
        const decant = startEngineWorking(separated, {id: 'decant', law: BREW_LAW,
            method: {id: 'trial.decant', revision: 1, law: BREW_LAW.ref, roles: {flask: 'flask', receiver: 'flask'},
                steps: [{op: 'decant-flask', minutes: 1, bindings: {flask: 'flask', receiver: 'receiver'}}]},
            bindings: {flask: ref('flask', 'filtrate'), receiver: ref('flask', 'spare')}});
        const decanted = reload(advance(reload(decant), 3));
        assert.deepEqual(serializeEngineWorld(decanted), serializeEngineWorld(advance(decant, 3)));
        assert.deepEqual(contents(decanted, 'filtrate'), {});
        assert.deepEqual(decanted.world.holders.filtrate.state, {});
        assert.deepEqual(brewOriginsOf(decanted.world.holders.spare), {active: 'garden', grit: 'garden', 'leaf:matrix': 'garden'});
        assert.deepEqual(brewStorageOf(decanted.world.holders.spare), brewStorageOf(separated.world.holders.filtrate));
        const method = {id: 'trial.filter-again', revision: 1, law: BREW_LAW.ref,
            roles: {vessel: 'vessel', source: 'flask', destination: 'flask'}, steps: [
                {op: 'admit-fraction', bindings: {vessel: 'vessel', flask: 'source'}, minutes: 1},
                {op: 'strain', bindings: {vessel: 'vessel'}, minutes: 2, options: {law}},
                {op: 'pour', bindings: {vessel: 'vessel', flask: 'destination'}, options: {index: 0}},
            ]};
        const start = vessel => startEngineWorking(decanted, {id: 'refilter', law: BREW_LAW, method, bindings: {
            vessel: ref('vessel', vessel), source: ref('flask', 'spare'), destination: ref('flask', 'product')}});
        const pending = start('second-press');
        const admitted = reload(advance(reload(pending), 4));
        assert.deepEqual(contents(admitted, 'spare'), {});
        assert.deepEqual(admitted.world.holders.spare.state, {});
        const filtered = reload(advance(admitted, 6));
        assert.deepEqual(serializeEngineWorld(filtered), serializeEngineWorld(advance(pending, 6)));
        const result = record(filtered, 'refilter');
        assert.equal(result.status, 'complete');
        assert.equal(result.facts.brew.doses[0].fraction.volume, 2);
        assert.deepEqual(result.facts.brew.fraction.constituents, [{id: 'grit', phase: 'suspended', amount: 6}]);
        assert.deepEqual(contents(filtered, 'product'), shelfLife ?
            {'active:spent': 10, 'leaf:matrix': 4} : {active: 10, 'leaf:matrix': 4});
        assert.deepEqual(brewBalance(result.facts), {admitted: 20, held: 6, released: 14, balanced: true});
        assert.equal(filtered.world.holders['second-press'].quantities[work], 0);

        const refused = advance(reload(start('small-press')), 6);
        const failed = record(refused, 'refilter');
        assert.equal(failed.receipts.at(-1).reason, 'filter-volume-unavailable');
        assert.equal(failed.facts.brew.fraction.volume, 2);
        assert.deepEqual(brewBalance(failed.facts), {admitted: 20, held: 20, released: 0, balanced: true});
        assert.deepEqual(contents(refused, 'product'), {});
        assert.equal(refused.world.holders['small-press'].quantities[work], 4);
    }
});

test('a restored partial decant preserves two re-admissible phase packets and both storage histories', () => {
    const {separated, reload} = trial(20, 4, {life: 8});
    const binding = {flask: ref('flask', 'filtrate'), receiver: ref('flask', 'spare')};
    const decant = startEngineWorking(separated, {id: 'decant-half', law: BREW_LAW, bindings: binding,
        method: {id: 'trial.decant-half', revision: 1, law: BREW_LAW.ref, roles: {flask: 'flask', receiver: 'flask'},
            steps: [{op: 'decant-flask', minutes: 1, bindings: {flask: 'flask', receiver: 'receiver'}, options: {volume: 1}}]}});
    const split = reload(advance(reload(decant), 3));
    assert.deepEqual(serializeEngineWorld(split), serializeEngineWorld(advance(decant, 3)));
    for (const flask of ['filtrate', 'spare']) {
        assert.deepEqual(contents(split, flask), {active: 5, grit: 3, 'leaf:matrix': 2});
        assert.deepEqual(brewStorageOf(split.world.holders[flask]), brewStorageOf(separated.world.holders.filtrate));
        const admitted = advance(reload(startEngineWorking(split, {id: 'admit-half', law: BREW_LAW,
            method: {id: 'trial.admit-half', revision: 1, law: BREW_LAW.ref, roles: {flask: 'flask', vessel: 'vessel'},
                steps: [{op: 'admit-fraction', minutes: 1, bindings: {flask: 'flask', vessel: 'vessel'}}]},
            bindings: {flask: ref('flask', flask), vessel: ref('vessel', 'mixing-pot')}})), 4);
        const {brew} = record(admitted, 'admit-half').facts;
        assert.equal(brew.fraction.volume, 1);
        assert.ok(brew.fraction.constituents.some(row => row.id === 'grit' && row.phase === 'suspended'));
        assert.deepEqual(contents(admitted, flask), {});
    }
    const refused = advance(reload(startEngineWorking(split, {id: 'decant-occupied', law: BREW_LAW,
        method: record(split, 'decant-half').method, bindings: binding})), 4);
    assert.equal(record(refused, 'decant-occupied').receipts.at(-1).reason, 'empty-flask-unavailable');
    for (const flask of ['filtrate', 'spare'])
        assert.deepEqual(contents(refused, flask), contents(split, flask));
    const blend = startEngineWorking(split, {id: 'blend-halves', law: BREW_LAW,
        method: {id: 'trial.blend-halves', revision: 1, law: BREW_LAW.ref,
            roles: {flask: 'flask', receiver: 'flask', vessel: 'vessel'}, steps: [
                {op: 'admit-fraction', minutes: 1, bindings: {vessel: 'vessel', flask: 'flask'}},
                {op: 'admit-fraction', minutes: 1, bindings: {vessel: 'vessel', flask: 'receiver'}},
            ]}, bindings: {...binding, vessel: ref('vessel', 'mixing-pot')}});
    const reunited = reload(advance(reload(advance(blend, 4)), 5));
    assert.deepEqual(serializeEngineWorld(reunited), serializeEngineWorld(advance(blend, 5)));
    const {facts} = record(reunited, 'blend-halves');
    assert.equal(facts.brew.fraction.volume, 2);
    assert.deepEqual(facts.brew.fraction.constituents.find(row => row.id === 'grit'),
        {id: 'grit', phase: 'suspended', amount: 5});
    assert.deepEqual(facts.brew.fraction.constituents.find(row => row.id === 'grit:spent'),
        {id: 'grit:spent', phase: 'suspended', amount: 1});
    assert.deepEqual(brewBalance(facts), {admitted: 20, held: 20, released: 0, balanced: true});
});

test('short filter work keeps the admitted batch and does not spend partial work or fill either receiver', () => {
    const {separated} = trial(5, 3);
    const failed = record(separated, 'filter');
    assert.equal(failed.receipts.at(-1).reason, 'filter-cost-unavailable');
    assert.deepEqual(brewBalance(failed.facts), {admitted: 20, held: 20, released: 0, balanced: true});
    assert.equal(separated.world.holders.press.quantities[work], 3);
    assert.deepEqual(contents(separated, 'filtrate'), {});
    assert.deepEqual(contents(separated, 'cake'), {});
});

test('paid distillation saves condensate, residue, and vapor separately across two runs of the condenser', () => {
    const distillation = defineSeparationLaw({...law, constituents: {...law.constituents, active: {volatilePerVolume: 3}},
        costs: {...law.costs, distill: {secondsPerVolume: 60, workPerVolume: 2, fuelPerVolume: 3}}});
    const fuel = 'stock:still-fuel';
    for (const [closure, efficiency, stock, expected] of [
        ['reflux', 600, 6, 3], ['reflux', 1000, 6, 6], ['reflux', 600, 2, null], ['open', 600, 6, null],
    ]) {
        const config = {packs: ['a.mind'], shared: {quantities: [WORLD_QUANTITIES.stock], effectKinds: BREW_PUBLISHES},
            host: {laws: [BREW_LAW], things: {'vessel:still': {separator: {...separator(5, 4), closure,
                condenserPermille: efficiency, accounts: {work, fuel}}},
            'lot:leaf': {material: 'leaf', properties: {constituents: {active: 500, grit: 300}}}}}};
        const place = 'bench';
        const thing = (id, kind, quantities = {}) => ({id, kind: 'thing', as: [kind], place, quantities});
        const engine = createEngineWorld({...config, holders: [{id: place, kind: 'place'},
            thing('still', 'vessel', {[work]: 4, [fuel]: stock}), thing('leaf', 'lot', {[brewMeasureQuantity]: 20}),
            thing('first-cup', 'flask'), thing('cup', 'flask')]});
        const method = brewMethod({id: 'trial.distill', slots: [{id: 'leaf'}], process: [
            {op: 'distill', minutes: 1, options: {law: distillation, volume: 4, takeVolume: 1, phases: {grit: 'suspended'}}},
            {op: 'pour', flask: 'first-cup', options: {index: 0}},
            {op: 'distill', minutes: 1, options: {law: distillation, takeVolume: 1}},
            {op: 'pour', options: {index: 1}},
        ]});
        const reload = state => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(state))), config);
        const started = startEngineWorking(engine, {id: 'distill', law: BREW_LAW, method, bindings: {
            vessel: ref('vessel', 'still'), leaf: ref('lot', 'leaf'), flask: ref('flask', 'cup'), 'first-cup': ref('flask', 'first-cup')}});
        const result = reload(advance(reload(advance(started, 1)), 2));
        assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(started, 2)));
        const run = record(result, 'distill');
        if (expected === null) {
            assert.equal(run.receipts.at(-1).reason, closure === 'open' ? 'condenser-unavailable' : 'filter-cost-unavailable');
            assert.deepEqual(brewBalance(run.facts), {admitted: 20, held: 20, released: 0, balanced: true});
            assert.equal(result.world.holders.still.quantities[fuel], stock);
            assert.deepEqual(contents(result, 'cup'), {});
            continue;
        }
        assert.equal(run.status, 'complete');
        assert.equal(result.world.holders.still.quantities[fuel], 0);
        assert.equal(result.world.holders.still.quantities[work], 0);
        assert.deepEqual(run.facts.brew.batch, {active: 4, grit: 6, 'leaf:matrix': 4});
        assert.equal(run.facts.brew.fraction.volume, 2);
        assert.equal(contents(result, 'first-cup').active + contents(result, 'cup').active, expected);
        assert.equal(run.facts.brew.doses[1].fraction.volume, 1);
        assert.deepEqual(brewBalance(run.facts), {admitted: 20, held: 14, released: 6, balanced: true});
        const vapor = result.world.chain.filter(event => event.kind === 'vapor.released');
        assert.equal(vapor.reduce((n, event) => n + event.detail.volume, 0), expected === 3 ? 1 : 0);
        assert.equal(vapor.flatMap(event => event.detail.constituents).reduce((n, row) => n + row.amount, 0), 6 - expected);
    }
});
