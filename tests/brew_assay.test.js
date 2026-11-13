import assert from 'node:assert/strict';
import test from 'node:test';
import {BREW_ASSAY_LAW, brewAssayMethod, brewLotAssayMethod, brewStripQuantity} from '../src/brew_assay.js';
import {BREW_LAW, brewBalance} from '../src/brew_law.js';
import {BREW_DOSE_LAW, brewDoseMethod} from '../src/brew_dose_delivery.js';
import {generateObservedBrewWorking} from '../src/brew_generation.js';
import {brewDoseContents, brewDoseQuantity, brewLotRevision, brewMeasureQuantity} from '../src/engine_brew_stock.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {recordsOf, viewRecord} from '../src/knowledge_record.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';

test('a selective assay spends its strip and records a bounded observation for its observer across restore', () => {
    const active = brewDoseQuantity('active');
    const impurity = brewDoseQuantity('impurity');
    const config = {packs: ['a.mind', 'n.knowledge'], shared: {quantities: [WORLD_QUANTITIES.stock],
        properties: [{id: 'assay_parts', type: 'set'}]}, host: {laws: [BREW_ASSAY_LAW]}};
    const engine = createEngineWorld({...config, holders: [
        {id: 'bench', kind: 'place'}, {id: 'store', kind: 'place'},
        {id: 'bottle', kind: 'thing', as: ['flask'], place: 'bench', quantities: {[active]: 7, [impurity]: 5}},
        {id: 'kit', kind: 'thing', as: ['instrument'], place: 'bench', quantities: {[brewStripQuantity]: 1}, properties: {assay_parts: ['active']}},
        ...['brewer', 'visitor'].map(id => ({id, kind: 'body', place: 'bench', properties: {mind_awake: true, mind_memory: []}})),
    ]});
    const reload = state => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(state))), config);
    const start = (world, id, part) => startEngineWorking(world, {law: BREW_ASSAY_LAW, id,
        method: brewAssayMethod({id, part, resolution: 3}),
        bindings: {flask: {kind: 'flask', id: 'bottle'}, instrument: {kind: 'instrument', id: 'kit'}, observer: {kind: 'body', id: 'brewer'}}});
    const advance = (world, at) => advanceEngineWorld(world, at).engine;
    const reading = start(engine, 'active-reading', 'active');
    const result = reload(advance(reload(advance(reading, 1)), 2));
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(reading, 2)));
    const {stamp, ...observed} = result.records.workings['active-reading'].record.receipts[0].observed;
    assert.match(stamp, /^[a-f0-9]{16}$/);
    assert.deepEqual(observed, {part: 'active', atLeast: 6, below: 9, flask: 'bottle', observer: 'brewer', total: 12});
    const known = recordsOf(result.world, 'brewer');
    assert.deepEqual(Object.keys(known), ['active-reading']);
    assert.equal(viewRecord(known['active-reading']).believed.value, 6);
    assert.deepEqual(recordsOf(result.world, 'visitor'), {});
    assert.equal(result.world.holders.kit.quantities[brewStripQuantity], 0);
    assert.deepEqual(result.world.holders.bottle.quantities, {[active]: 7, [impurity]: 5});

    const rerun = advance(start(result, 'repeat', 'active'), 4);
    assert.equal(rerun.records.workings.repeat.record.receipts[0].reason, 'assay-strip-unavailable');
    const wrong = advance(start(engine, 'wrong', 'impurity'), 2);
    assert.equal(wrong.records.workings.wrong.record.receipts[0].reason, 'instrument-cannot-read-constituent');
    assert.equal(wrong.world.holders.kit.quantities[brewStripQuantity], 1);
    const moved = applyEngineOps(reading, [{op: 'move', holder: 'bottle', to: 'store'}], 'take-away');
    const refused = advance(reload(moved), 2);
    assert.equal(refused.records.workings['active-reading'].record.receipts[0].reason, 'assay-out-of-reach');
    assert.deepEqual(recordsOf(refused.world, 'brewer'), {});
});

test('ingredient assays enable only the observer to plan from saved lower bounds and live stock', () => {
    const inputs = {moss: {brightSap: 750}, salt: {stabilizer: 500}, hidden: {brightSap: 1000}};
    const config = {packs: ['a.mind'], shared: {quantities: [WORLD_QUANTITIES.stock], properties: [
        {id: 'assay_parts', type: 'set'}, {id: 'assay_resolution', type: 'level', min: 1, max: 1000},
        {id: brewLotRevision, type: 'label'},
    ]}, host: {laws: [BREW_LAW, BREW_ASSAY_LAW, BREW_DOSE_LAW], things: Object.fromEntries(Object.entries(inputs)
        .map(([id, constituents]) => [`lot:${id}`, {material: id, properties: {constituents}}]))}};
    const place = 'bench';
    const start = createEngineWorld({...config, holders: [
        {id: place, kind: 'place'},
        ...Object.keys(inputs).map(id => ({id, kind: 'thing', as: ['lot'], place, quantities: {[brewMeasureQuantity]: 16}})),
        {id: 'kit', kind: 'thing', as: ['instrument'], place, quantities: {[brewStripQuantity]: 2},
            properties: {assay_parts: ['brightSap', 'stabilizer'], assay_resolution: 200}},
        {id: 'pot', kind: 'thing', as: ['vessel'], place}, {id: 'cup', kind: 'thing', as: ['flask'], place},
        ...['brewer', 'visitor'].map(id => ({id, kind: 'body', place, properties: {mind_awake: true, mind_mood: 10}})),
    ]});
    const reload = (engine, hostConfig = config) => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), hostConfig);
    const advance = (engine, to) => advanceEngineWorld(engine, to).engine;
    const assay = (engine, lot, part, resolution = 200) => startEngineWorking(engine, {id: `assay-${lot}`, law: BREW_ASSAY_LAW,
        method: brewLotAssayMethod({id: `assay-${lot}`, part, resolution}),
        bindings: {lot: {kind: 'lot', id: lot}, instrument: {kind: 'instrument', id: 'kit'}, observer: {kind: 'body', id: 'brewer'}}});
    const plan = (engine, observer = 'brewer') => generateObservedBrewWorking(engine, {observer, id: 'measured-infusion',
        vessel: 'pot', flask: 'cup', extent: 3, reaction: {id: 'bind-bright', reactants: {brightSap: 2, stabilizer: 1}, products: {bright: 3}}});
    assert.equal(plan(start), null);
    const tooFine = advance(assay(start, 'moss', 'brightSap', 100), 2);
    assert.equal(tooFine.records.workings['assay-moss'].record.receipts[0].reason, 'assay-resolution-unavailable');
    assert.equal(tooFine.world.holders.kit.quantities[brewStripQuantity], 2);
    const one = reload(advance(reload(assay(start, 'moss', 'brightSap')), 2));
    assert.equal(plan(one), null);
    const measured = reload(advance(reload(assay(one, 'salt', 'stabilizer')), 4));
    assert.equal(plan(measured, 'visitor'), null);
    const candidate = plan(measured);
    assert.deepEqual([candidate.bindings['input-1'].id, candidate.bindings['input-2'].id], ['moss', 'salt']);
    assert.deepEqual(candidate.method.steps.slice(0, 2).map(step => step.options.amount), [10, 8]);
    assert.equal(measured.world.holders.kit.quantities[brewStripQuantity], 0);
    const replacement = {...config, host: {...config.host, things: {...config.host.things,
        'lot:moss': {material: 'moss', properties: {constituents: {brightSap: 200}}},
    }}};
    const replaced = reload(applyEngineOps(measured, [
        {op: 'property', holder: 'moss', property: brewLotRevision, value: 'new-composition'},
    ], 'replace-lot'), replacement);
    assert.equal(plan(replaced), null);
    const refused = advance(startEngineWorking(replaced, {id: 'stale-brew', law: BREW_LAW, ...candidate}), 9);
    assert.equal(refused.records.workings['stale-brew'].record.receipts.at(-1).reason, 'ingredient-composition-changed');
    assert.equal(refused.world.holders.moss.quantities[brewMeasureQuantity], 16);
    const pending = startEngineWorking(measured, {id: 'brew', law: BREW_LAW, ...candidate});
    const bottled = reload(advance(reload(advance(pending, 5)), 9));
    assert.deepEqual(serializeEngineWorld(bottled), serializeEngineWorld(advance(pending, 9)));
    assert.deepEqual(brewDoseContents(bottled.world.holders.cup), {brightSap: 1, stabilizer: 1, bright: 9, 'moss:matrix': 3, 'salt:matrix': 4});
    assert.deepEqual(brewBalance(bottled.records.workings.brew.record.facts), {admitted: 18, held: 0, released: 18, balanced: true});
    assert.equal(plan(bottled), null, 'remaining moss cannot supply a second measured batch');
    const serving = startEngineWorking(bottled, {id: 'serve', law: BREW_DOSE_LAW,
        method: brewDoseMethod({id: 'serve', route: 'oral', responses: [{part: 'bright', minimum: 9,
            sentence: {verb: 'transform', object: 'mind', time: 'sustained'}, details: {minutes: 3, mind: {faculty: 'mood', amount: 9}}}]}),
        bindings: {flask: {kind: 'flask', id: 'cup'}, recipient: {kind: 'body', id: 'brewer'}}});
    const served = reload(advance(reload(serving), 11));
    assert.equal(served.world.holders.brewer.properties.mind_mood, 19);
    assert.deepEqual(brewDoseContents(served.world.holders.cup), {});
    assert.equal(advance(served, 14).world.holders.brewer.properties.mind_mood, 10);
});
