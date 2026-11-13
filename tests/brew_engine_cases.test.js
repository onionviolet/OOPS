import assert from 'node:assert/strict';
import test from 'node:test';
import {BREW_LAW, brewBalance, brewMethod} from '../src/brew_law.js';
import {generateBrewWorking} from '../src/brew_generation.js';
import {brewDoseContents, brewDoseQuantity, brewMeasureQuantity, brewOriginsOf} from '../src/engine_brew_stock.js';
import {BREW_DOSE_LAW, brewDoseMethod} from '../src/brew_dose_delivery.js';
import {advanceEngineWorld, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {defineWorkingLaw} from '../src/kernel_working.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';
import {draughtOfLivingDeathRecipe} from '../src/world_packs/hp_brew_pack.js';
import {identifiedLotmDoseReading, lotmBrewRow, lotmDoseReading, lotmLots} from '../src/world_packs/lotm_brew_pack.js';
import {brewSeer} from '../src/lotm_seer_brew.js';

const ref = (kind, id = kind) => ({kind, id});
const flask = ref('flask');
const recipient = ref('body', 'recipient');
const seer = lotmBrewRow('fool_9');
const roles = {flask: 'flask', recipient: 'body'};
const oralLaw = defineWorkingLaw({id: 'fixture.brew.oral', revision: 1, operations: {
    drink: {roles, minutes: 2, settle({bound: {flask, recipient}, options}) {
        if (!flask.place || flask.place !== recipient.place) return {ok: false, reason: 'flask-out-of-reach'};
        const contents = brewDoseContents(flask);
        if (!Object.keys(contents).length) return {ok: false, reason: 'empty-flask'};
        const effects = Object.entries(contents).flatMap(([part, amount]) => {
            const quantity = brewDoseQuantity(part);
            return [{op: 'add', holder: flask.holder, quantity, amount: -amount},
                {op: 'carry', holder: recipient.holder, quantity, amount}];
        });
        const reading = options.kind === 'seer' ? lotmDoseReading(seer, {contents}) :
            options.kind === 'brightening' ? {bright: contents.bright ?? 0} : {settled: contents.settled ?? 0};
        const amount = reading.hazard ?? reading.bright ?? reading.settled;
        if (amount) {
            const sleep = options.kind === 'living-death';
            effects.push({sentence: {verb: sleep ? 'bind' : 'transform', object: 'mind', time: 'sustained', target: 'touched'},
                details: {place: recipient.place, target: {shape: 'holder', id: recipient.holder},
                    minutes: amount, mind: sleep ? {faculty: 'awareness'} :
                        {faculty: options.kind === 'brightening' ? 'mood' : 'confusion', amount}}});
        }
        return {ok: true, effects, observed: reading};
    }},
}});

const addFlask = method => ({...method, roles: {...method.roles, flask: 'flask'}, steps: [...method.steps,
    {op: 'pour', bindings: {vessel: 'vessel', flask: 'flask'}, minutes: 1, options: {index: 0}}]});
const readRecord = (engine, id) => engine.records.workings[id].record;
const held = (engine, id) => brewDoseContents(engine.world.holders[id]);
const mind = engine => engine.world.holders.recipient.properties;
const advance = (engine, to) => {
    const result = advanceEngineWorld(engine, to);
    assert.equal(result.pending, false);
    return result.engine;
};

function bench(lots, vessel = {id: 'cauldron'}) {
    const config = {packs: ['a.mind'], shared: {quantities: [WORLD_QUANTITIES.stock]}, host: {
        laws: [BREW_LAW, oralLaw], things: {
            [`vessel:${vessel.id}`]: vessel,
            ...Object.fromEntries(Object.values(lots).map(({id, properties, ...data}) =>
                [`lot:${id}`, {...data, properties: {constituents: properties}}])),
        },
    }};
    const holders = [
        {id: 'bench', kind: 'place'},
        {id: vessel.id, kind: 'thing', as: ['vessel'], place: 'bench'},
        ...Object.values(lots).map(({id, amount}) => ({id, kind: 'thing', as: ['lot'], place: 'bench', quantities: {[brewMeasureQuantity]: amount}})),
        {id: flask.id, kind: 'thing', as: ['flask'], place: 'bench'},
        {id: recipient.id, kind: 'body', place: 'bench', properties: {mind_awake: true, mind_confusion: 0, mind_mood: 10}},
    ];
    return {engine: createEngineWorld({...config, holders}), config,
        bindings: {vessel: ref('vessel', vessel.id), flask,
            ...Object.fromEntries(Object.entries(lots).map(([role, lot]) => [role, ref('lot', lot.id)]))}};
}

test('restored recovery checks live lot age before debiting an assayed draw', () => {
    const {engine, config, bindings} = bench({
        herb: {id: 'herb', material: 'herb', amount: 5, properties: {sap: 1000}, spent: 1438, storageSince: 0,
            ageing: {constituent: 'sap', perDay: 3}},
    });
    const method = brewMethod({id: 'trial.spent-recovery', slots: [{id: 'herb', amount: 5, minutes: 2,
        recoverSpent: ['sap:spent'], minimumContents: {'sap:spent': 3}}], process: []});
    const pending = startEngineWorking(engine, {id: 'brew', law: BREW_LAW, method,
        bindings: {vessel: bindings.vessel, herb: bindings.herb}});
    const saved = JSON.parse(JSON.stringify(serializeEngineWorld(advance(pending, 1))));
    const normal = advance(restoreEngineWorld(saved, config), 2);
    assert.equal(readRecord(normal, 'brew').facts.brew.batch['sap:spent'], 3);
    assert.equal(normal.world.holders.herb.quantities[brewMeasureQuantity], 0);
    assert.ok(brewBalance(readRecord(normal, 'brew').facts).balanced);

    const cooler = {...config, host: {...config.host, ports: {
        readThing: ref => ref.id === 'herb' ? {storageRate: 0.5} : null,
    }}};
    const stale = advance(restoreEngineWorld(saved, cooler), 2);
    assert.equal(readRecord(stale, 'brew').receipts.at(-1).reason, 'ingredient-below-assayed-minimum');
    assert.equal(stale.world.holders.herb.quantities[brewMeasureQuantity], 5);
});

function roundTripBrew({engine, config, bindings}, method) {
    const reload = state => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(state))), config);
    const start = startEngineWorking(engine, {id: 'brew', law: BREW_LAW, method, bindings});
    const deadline = readRecord(start, 'brew').deadlines.at(-1);
    const direct = advance(start, deadline);
    let restored = reload(start);
    for (let minute = 1; minute <= deadline; minute++) restored = reload(advance(restored, minute));
    assert.deepEqual(serializeEngineWorld(restored), serializeEngineWorld(direct));
    const batch = readRecord(restored, 'brew');
    assert.equal(batch.status, 'complete');
    assert.ok(brewBalance(batch.facts).balanced);
    assert.deepEqual(batch.facts.brew.doses[0].contents, held(restored, 'flask'));
    return {engine: restored, reload, deadline};
}

function serve({engine, reload, deadline}, kind) {
    const pending = startEngineWorking(engine, {id: 'drink', law: oralLaw, bindings: {flask, recipient},
        method: {id: 'drink', revision: 1, law: oralLaw.ref, roles,
            steps: [{op: 'drink', bindings: {flask: 'flask', recipient: 'recipient'}, options: {kind}}]}});
    const served = reload(advance(reload(pending), deadline + 2));
    assert.equal(readRecord(served, 'drink').status, 'complete');
    assert.deepEqual(held(served, 'flask'), {});
    assert.deepEqual(held(served, 'recipient'), held(engine, 'flask'));
    return served;
}

test('a saved serving carries formula identity from actual reaction to the measured receipt', () => {
    const lots = lotmLots(seer, {m1: 11000, m2: 48000});
    for (const identity of ['fool_9', 'other_9', null]) {
        const method = addFlask(structuredClone(seer.method));
        const reaction = method.steps.find(step => step.op === 'react').options.reactions[0];
        if (identity === null) delete reaction.productOrigins;
        else reaction.productOrigins.potency = identity;
        const {engine, deadline} = roundTripBrew(bench(lots), method);
        assert.deepEqual(brewOriginsOf(engine.world.holders.flask), identity ? {potency: identity} : undefined);
        const pending = startEngineWorking(engine, {id: 'measured', law: BREW_DOSE_LAW, bindings: {flask, recipient},
            method: brewDoseMethod({id: 'trial.identified-seer', route: 'oral',
                amount: Object.values(held(engine, 'flask')).reduce((sum, n) => sum + n, 0) / 2})});
        const config = {packs: ['a.mind'], shared: {quantities: [WORLD_QUANTITIES.stock]},
            host: pending.host};
        const restore = world => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(world))), config);
        const served = restore(advance(restore(pending), deadline + 2));
        assert.deepEqual(serializeEngineWorld(served), serializeEngineWorld(advance(pending, deadline + 2)));
        const dose = readRecord(served, 'measured').receipts[0].observed;
        assert.equal(dose.contents.potency, 28800);
        assert.equal(dose.origins?.potency, identity ?? undefined);
        assert.deepEqual(identifiedLotmDoseReading(seer, dose), identity === seer.id ? lotmDoseReading(seer, dose) : null);
        assert.deepEqual(brewOriginsOf(served.world.holders.flask), identity ? {potency: identity} : undefined);
        const remainder = startEngineWorking(served, {id: 'remainder', law: BREW_DOSE_LAW, bindings: {flask, recipient},
            method: brewDoseMethod({id: 'trial.identified-seer', route: 'oral'})});
        const empty = restore(advance(restore(remainder), deadline + 4));
        assert.deepEqual(held(empty, flask.id), {});
        assert.equal(brewOriginsOf(empty.world.holders.flask), undefined);
    }
});

test('Draught of Living Death: canon preparation and authored sleep run through stock, flask, and mind', () => {
    for (const [strokes, settled] of [['LLLLLLLR', 8], ['', 0]]) {
        const {lots, vessel, method} = draughtOfLivingDeathRecipe({preparation: 'crush', beanUnits: 12, precursor: 6,
            carrier: 94, strokes, storage: {days: 0, vessel: 'sealed'}});
        const brew = roundTripBrew(bench(lots, vessel), addFlask({...method, steps: [...method.steps,
            {op: 'divide', bindings: {vessel: 'vessel'}, minutes: 1, options: {doses: 1}}]}));
        const batch = readRecord(brew.engine, 'brew');
        assert.equal(batch.facts.brew.out.retained.bean, 4);
        assert.deepEqual(batch.receipts.find(r => r.op === 'react').observed.cues, ['Lilac']);
        assert.deepEqual(batch.receipts.find(r => r.op === 'stir').observed.cues, settled ? ['Pale pink'] : []);
        assert.equal(held(brew.engine, 'flask').settled ?? 0, settled);
        for (const lot of Object.values(lots)) assert.equal(brew.engine.world.holders[lot.id].quantities[brewMeasureQuantity], 0);
        const served = serve(brew, 'living-death');
        assert.equal(mind(served).mind_awake, !settled);
        if (settled) assert.equal(mind(advance(brew.reload(served), served.world.clock + settled - 1)).mind_awake, false);
        assert.equal(mind(advance(brew.reload(served), served.world.clock + settled)).mind_awake, true);
    }
});

test('Seer: measured stock and bottled power/hazard match the existing reader across engine restore', () => {
    for (const [blood, crystal, power, hazard] of [[10, 48, 57, 0], [11, 48, 57, 1]]) {
        const lots = lotmLots(seer, {m1: blood * 1000, m2: crystal * 1000});
        const brew = roundTripBrew(bench(lots), addFlask(seer.method));
        for (const lot of Object.values(lots)) assert.equal(brew.engine.world.holders[lot.id].quantities[brewMeasureQuantity], 0);
        const old = brewSeer({'Lavos Squid blood': blood, 'Star Crystal': crystal}).outputs;
        const served = serve(brew, 'seer');
        assert.deepEqual([power, hazard], [old.beyonder?.seer ?? 0, old.spirit?.madness ?? 0]);
        const reading = readRecord(served, 'drink').receipts[0].observed;
        assert.deepEqual([reading.power, reading.hazard], [power, hazard]);
        assert.equal(mind(served).mind_confusion, hazard);
        assert.equal(mind(advance(brew.reload(served), served.world.clock + hazard)).mind_confusion, 0);
    }
});

test('an original brightening infusion is generated from assayed properties and survives restore without regeneration', () => {
    const reaction = {id: 'fix-brightness', reactants: {brightSap: 2, stabilizer: 1}, products: {bright: 3}};
    const materials = [
        {id: 'reed', amount: 16, properties: {brightSap: 500}},
        {id: 'moss', amount: 16, properties: {brightSap: 1000}},
        {id: 'salt', amount: 10, properties: {stabilizer: 500}},
        {id: 'wax', amount: 2, properties: {stabilizer: 1000}},
    ].map(lot => ({...lot, material: lot.id}));
    const generate = lots => generateBrewWorking({id: 'trial.brightening', reaction, extent: 3, lots,
        vessel: 'cauldron', flask: 'flask'});
    const plan = generate(materials);
    assert.deepEqual(generate(materials.toReversed()), plan);
    assert.deepEqual(Object.values(plan.bindings).filter(b => b.kind === 'lot').map(b => b.id), ['moss', 'salt']);
    assert.equal(generate(materials.filter(lot => lot.id !== 'salt')), null);
    assert.throws(() => generateBrewWorking({id: 'trial.capped', reaction: {...reaction, limit: 2}, extent: 3,
        lots: materials, vessel: 'cauldron', flask: 'flask'}), /unrestricted reaction extent/);
    const substitute = generate(materials.filter(lot => lot.id !== 'moss'));
    assert.deepEqual(substitute.bindings['input-1'], ref('lot', 'reed'));
    assert.equal(substitute.method.steps[0].options.amount, 12);

    for (const [working, expected, remaining] of [
        [plan, {bright: 9, 'salt:matrix': 3}, {moss: 10, reed: 16}],
        [substitute, {bright: 9, 'salt:matrix': 3, 'reed:matrix': 6}, {moss: 16, reed: 4}],
    ]) {
        const initial = bench(Object.fromEntries(materials.map(lot => [lot.id, lot])));
        const brew = roundTripBrew({...initial, bindings: working.bindings}, working.method);
        assert.deepEqual(held(brew.engine, 'flask'), expected);
        const record = readRecord(brew.engine, 'brew');
        assert.deepEqual(record.method, working.method);
        assert.deepEqual(record.bindings, working.bindings);
        assert.deepEqual(record.facts.reactions, [{reaction: 'fix-brightness', extent: 3}]);
        for (const [id, amount] of Object.entries({...remaining, salt: 4, wax: 2}))
            assert.equal(brew.engine.world.holders[id].quantities[brewMeasureQuantity], amount);
        const served = serve(brew, 'brightening');
        assert.equal(mind(served).mind_mood, 19);
        assert.equal(mind(advance(brew.reload(served), served.world.clock + 9)).mind_mood, 10);
    }
});
