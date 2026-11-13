import assert from 'node:assert/strict';
import test from 'node:test';
import {BREW_DOSE_LAW, brewDoseMethod} from '../src/brew_dose_delivery.js';
import {BREW_ASSAY_LAW, brewAssayMethod, brewStripQuantity} from '../src/brew_assay.js';
import {BREW_LAW, brewBalance, brewMethod} from '../src/brew_law.js';
import {brewDoseContents, brewDoseQuantity, brewMeasureQuantity, brewStorageOf} from '../src/engine_brew_stock.js';
import {advanceEngineWorld, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../src/world_quantities.js';
import {CREATURE_FORM_PACK, creatureForm} from '../src/creature_evolution.js';

test('an assay, two partial servings and re-admission read the same bottle age', () => {
    const config = {packs: ['a.mind', 'n.knowledge'], shared: {quantities: [WORLD_QUANTITIES.stock],
        properties: [{id: 'assay_parts', type: 'set'}]}, host: {laws: [BREW_LAW, BREW_ASSAY_LAW, BREW_DOSE_LAW],
        things: {'lot:extract': {material: 'extract', properties: {constituents: {active: 1000}}}}}};
    const world = createEngineWorld({...config, holders: [
        {id: 'bench', kind: 'place'},
        {id: 'pot', kind: 'thing', place: 'bench', as: ['vessel']},
        {id: 'extract', kind: 'thing', place: 'bench', as: ['lot'], quantities: {[brewMeasureQuantity]: 12}},
        {id: 'flask', kind: 'thing', place: 'bench', as: ['flask']},
        {id: 'kit', kind: 'thing', place: 'bench', as: ['instrument'],
            properties: {assay_parts: ['active']}, quantities: {[brewStripQuantity]: 1}},
        {id: 'patient', kind: 'body', place: 'bench', properties: {mind_awake: true}},
    ]});
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const ref = (kind, id) => ({kind, id});
    const vessel = ref('vessel', 'pot'), flask = ref('flask', 'flask'), patient = ref('body', 'patient');
    const bottled = reload(advance(startEngineWorking(world, {id: 'brew', law: BREW_LAW,
        method: brewMethod({id: 'brew', slots: [{id: 'extract'}], process: [
            {op: 'divide', minutes: 1, options: {doses: 1}},
            {op: 'pour', options: {index: 0, shelfLife: {life: 8}}},
        ]}), bindings: {vessel, flask, extract: ref('lot', 'extract')}}), 1));
    const measured = advance(startEngineWorking(bottled, {id: 'assay', law: BREW_ASSAY_LAW,
        method: brewAssayMethod({id: 'assay', part: 'active', resolution: 1}),
        bindings: {flask, observer: patient, instrument: ref('instrument', 'kit')}}), 3);
    const {part, atLeast, below} = measured.records.workings.assay.record.receipts[0].observed;
    assert.deepEqual({part, atLeast, below}, {part: 'active', atLeast: 9, below: 10});
    assert.deepEqual(brewDoseContents(measured.world.holders.flask), {active: 12});
    const serve = (state, id) => startEngineWorking(state, {id, law: BREW_DOSE_LAW,
        method: brewDoseMethod({id, amount: 4, route: 'oral'}), bindings: {flask, recipient: patient}});
    const pending = serve(measured, 'first');
    const first = reload(advance(reload(pending), 5));
    assert.deepEqual(serializeEngineWorld(first), serializeEngineWorld(advance(pending, 5)));
    assert.deepEqual(brewDoseContents(first.world.holders.patient), {active: 2, 'active:spent': 2});
    assert.equal(brewStorageOf(first.world.holders.flask).bottledAt, 1);
    const second = reload(advance(reload(serve(first, 'second')), 7));
    assert.deepEqual(brewDoseContents(second.world.holders.patient), {active: 3, 'active:spent': 5});
    const readmitted = advance(reload(startEngineWorking(second, {id: 'recover', law: BREW_LAW,
        method: {id: 'recover', revision: 1, law: BREW_LAW.ref, roles: {vessel: 'vessel', flask: 'flask'},
            steps: [{op: 'admit-fraction', bindings: {vessel: 'vessel', flask: 'flask'}, minutes: 2}]},
        bindings: {vessel, flask}})), 9);
    const {facts} = readmitted.records.workings.recover.record;
    assert.deepEqual(facts.brew.batch, {'active:spent': 4});
    assert.deepEqual(brewBalance(facts), {admitted: 4, held: 4, released: 0, balanced: true});
    assert.deepEqual(brewDoseContents(readmitted.world.holders.flask), {});
    assert.equal(brewStorageOf(readmitted.world.holders.flask), undefined);
});

test('measured portions conserve each constituent and the modeled oral response reads the delivered share', () => {
    const active = brewDoseQuantity('active');
    const matrix = brewDoseQuantity('matrix');
    const config = {packs: ['a.mind'], shared: {quantities: [WORLD_QUANTITIES.stock]}, host: {laws: [BREW_DOSE_LAW]}};
    const engine = createEngineWorld({...config, holders: [
        {id: 'bench', kind: 'place'},
        {id: 'bottle', kind: 'thing', as: ['flask'], place: 'bench', quantities: {[active]: 7, [matrix]: 5}},
        {id: 'patient', kind: 'body', place: 'bench', properties: {mind_awake: true, mind_mood: 10}},
    ]});
    const responses = [{part: 'active', route: 'oral', minimum: 4,
        sentence: {verb: 'transform', object: 'mind', time: 'sustained'}, details: {minutes: 3, mind: {faculty: 'mood', amount: 2}}}];
    const reload = state => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(state))), config);
    const start = (state, id, amount, route = 'oral') => startEngineWorking(state, {law: BREW_DOSE_LAW, id,
        method: brewDoseMethod({id, amount, route, responses}),
        bindings: {flask: {kind: 'flask', id: 'bottle'}, recipient: {kind: 'body', id: 'patient'}}});
    const advance = (world, at) => advanceEngineWorld(world, at).engine;
    const give = (world, id, amount, route) => reload(advance(reload(start(world, id, amount, route)), world.world.clock + 2));
    const first = give(engine, 'first', 6);
    assert.deepEqual(serializeEngineWorld(first), serializeEngineWorld(advance(start(engine, 'first', 6), 2)));
    assert.deepEqual(first.world.holders.patient.quantities, {[active]: 4, [matrix]: 2});
    assert.deepEqual(first.world.holders.bottle.quantities, {[active]: 3, [matrix]: 3});
    assert.equal(first.world.holders.patient.properties.mind_mood, 12);
    const second = give(advance(first, 5), 'second', 6);
    assert.deepEqual(second.world.holders.patient.quantities, {[active]: 7, [matrix]: 5});
    assert.deepEqual(second.world.holders.bottle.quantities, {[active]: 0, [matrix]: 0});
    assert.equal(second.world.holders.patient.properties.mind_mood, 10);

    const wrong = give(engine, 'wrong-route', 6, 'topical');
    assert.deepEqual(wrong.world.holders.patient.quantities, first.world.holders.patient.quantities);
    assert.equal(wrong.world.holders.patient.properties.mind_mood, 10);
    const tooMuch = give(engine, 'too-much', 13);
    assert.equal(tooMuch.records.workings['too-much'].record.receipts[0].reason, 'serving-measure-unavailable');
    assert.deepEqual(tooMuch.world.holders, engine.world.holders);
});

test('a restored potion form yields to a higher-priority layer and then expires to the base form', () => {
    const sample = brewDoseQuantity('sample:donor');
    const config = {packs: ['l.creature_form'], ownPacks: [CREATURE_FORM_PACK],
        shared: {quantities: [WORLD_QUANTITIES.stock], properties: [WORLD_PROPERTIES.form]}, host: {laws: [BREW_DOSE_LAW]}};
    const world = createEngineWorld({...config, holders: [
        {id: 'bench', kind: 'place'},
        {id: 'bottle', kind: 'thing', as: ['flask'], place: 'bench', quantities: {[sample]: 1}},
        {id: 'patient', kind: 'body', place: 'bench',
            properties: {form: 'original', 'temporary-form-layers': ['other|3|5']}},
    ]});
    const method = brewDoseMethod({id: 'form-dose', route: 'oral', responses: [
        {part: 'sample:donor', minimum: 1, temporaryForm: {form: 'donor', minutes: 6, priority: 2}},
    ]});
    const pending = startEngineWorking(world, {id: 'serve', law: BREW_DOSE_LAW, method,
        bindings: {flask: {kind: 'flask', id: 'bottle'}, recipient: {kind: 'body', id: 'patient'}}});
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const served = reload(advance(reload(pending), 2));
    const effective = engine => creatureForm(engine.world.holders.patient, engine.world.clock);
    assert.equal(effective(served), 'other');
    assert.equal(effective(reload(advance(served, 5))), 'donor');
    assert.equal(effective(advance(served, 7)), 'donor');
    const recovered = reload(advance(served, 8));
    assert.equal(effective(recovered), 'original');
    assert.deepEqual(serializeEngineWorld(recovered), serializeEngineWorld(advance(pending, 8)));
    assert.equal(recovered.world.holders.bottle.quantities[sample], 0);
    assert.equal(recovered.world.holders.patient.quantities[sample], 1);
});

test('a measured antidote shares finite relief across recipient burdens and restores partial treatment', () => {
    const remedy = brewDoseQuantity('joint');
    const first = 'poison:fast', second = 'poison:slow';
    const config = {packs: ['a.mind'], shared: {quantities: [WORLD_QUANTITIES.stock,
        {id: 'poison', keyed: true, unit: 'burden', min: 0, max: 20}]}, host: {laws: [BREW_DOSE_LAW]}};
    const engine = createEngineWorld({...config, holders: [
        {id: 'bench', kind: 'place'},
        {id: 'bottle', kind: 'thing', as: ['flask'], place: 'bench', quantities: {[remedy]: 12}},
        {id: 'patient', kind: 'body', place: 'bench', quantities: {[first]: 1, [second]: 4}},
        {id: 'healthy', kind: 'body', place: 'bench', quantities: {[first]: 0, [second]: 0}},
    ]});
    const rows = [first, second].map(quantity => ({quantity, part: 'joint', per: 3, reason: 'The same combined remedy serves both burdens.'}));
    const reload = state => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(state))), config);
    const advance = (world, at) => advanceEngineWorld(world, at).engine;
    const start = (state, id, {route = 'oral', pairs = rows, patient = 'patient'} = {}) => startEngineWorking(state, {
        law: BREW_DOSE_LAW, id, method: brewDoseMethod({id, amount: 6, route, treatment: {route: 'oral', pairs}}),
        bindings: {flask: {kind: 'flask', id: 'bottle'}, recipient: {kind: 'body', id: patient}},
    });
    const held = (world, id = 'patient') => world.world.holders[id].quantities;
    const pending = start(engine, 'first');
    const partial = reload(advance(reload(advance(pending, 1)), 2));
    assert.deepEqual(serializeEngineWorld(partial), serializeEngineWorld(advance(pending, 2)));
    assert.deepEqual(held(partial), {[first]: 0, [second]: 3, [remedy]: 6});
    assert.deepEqual(held(partial, 'bottle'), {[remedy]: 6});
    assert.deepEqual(held(advance(reload(partial), 3)), held(partial));
    const again = advance(reload(start(partial, 'again')), 4);
    assert.deepEqual(held(again), {[first]: 0, [second]: 1, [remedy]: 12});
    assert.deepEqual(held(again, 'bottle'), {[remedy]: 0});

    const reversed = advance(reload(start(engine, 'reverse', {pairs: rows.toReversed()})), 2);
    assert.deepEqual(held(reversed), {[first]: 1, [second]: 2, [remedy]: 6});
    const topical = advance(reload(start(engine, 'topical', {route: 'topical'})), 2);
    assert.deepEqual(held(topical), {[first]: 1, [second]: 4, [remedy]: 6});
    const absent = advance(reload(start(engine, 'healthy', {patient: 'healthy'})), 2);
    assert.deepEqual(held(absent, 'healthy'), {[first]: 0, [second]: 0, [remedy]: 6});
    assert.deepEqual(held(absent), held(engine));
});
