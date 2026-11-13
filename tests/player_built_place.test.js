import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {building as B, builtPlaceConfig, quoteBuilding, startBuilding, surveyBuildPosition} from '../src/world_packs/player_built_place.js';

const bank = 'keeper-yard.bank';
const terrace = 'keeper-yard.terrace';
const annex = 'keeper-yard.annex';
const water = 'keeper-yard.water';
const actor = 'keeper-yard.builder';
const members = 'stock:firefly';
const glow = 'light:star';
const config = {
    ...builtPlaceConfig,
    packs: ['building.conditions', 'l.colony_light'],
    settings: {'l.colony_light': {profiles: [{members, light: glow, gradePerMember: {dark: 12, daylit: 0}}]}},
};

function yard(at, plan, {timber = 8, cloth = 3} = {}) {
    const position = (id, {owner = actor, exposed = false, support = 2, adjoining} = {}) => ({
        id, kind: 'place', tags: ['building.position'], detail: 'far',
        quantities: {daylight: 1, rain: 1, [glow]: 0},
        properties: {...(owner ? {[B.tenure]: owner} : {}), [B.sun]: true, [B.exposure]: exposed,
            [B.support]: support, ...(adjoining ? {[B.adjoining]: adjoining} : {})},
    });
    return createEngineWorld({...config, holders: [
        position(bank, {exposed: true}), position(terrace), position(annex, {owner: null, support: 1, adjoining: terrace}),
        {id: water, kind: 'place', quantities: {[B.water]: 2}},
        {id: actor, kind: 'body', place: at,
            quantities: {[B.timber]: timber, [B.cloth]: cloth, [B.wet]: 1, [B.dry]: 0, [B.water]: 0}},
        {id: 'frame', kind: 'thing', as: ['building.fitting'], place: at, properties: {[B.design]: plan},
            quantities: {condition: 0, [B.wet]: 0, [B.dry]: 0}},
        ...[bank, terrace].map(place => ({id: `${place}.flies`, kind: 'cohort', place, tags: ['colony.light'],
            quantities: {[members]: 2}, count: 2})),
    ], links: [
        {id: 'bank-water', kind: 'path', from: bank, to: water, cost: 2},
        {id: 'terrace-bank', kind: 'path', from: terrace, to: bank, cost: 6},
    ]});
}

const save = serializeEngineWorld;
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
function advance(engine, minutes) {
    const result = advanceEngineWorld(engine, engine.world.clock + minutes);
    assert.equal(result.pending, false);
    return result.engine;
}
const amount = (engine, holder, quantity) => engine.world.holders[holder].quantities[quantity];
const request = (id, action, position, other = {}) => ({id, action, actor, position, fitting: 'frame', ...other});
function finish(engine, action) {
    const quote = quoteBuilding(engine, action);
    assert.equal(quote.eligible, true, quote.reason);
    return advance(startBuilding(engine, action), quote.minutes);
}

test('the same shade design takes different work at two suitable sites and changes the local colony glow', () => {
    const plan = 'shade-v1';
    for (const [position, other, minutes, haul] of [[bank, terrace, 8, 2], [terrace, bank, 6, 8]]) {
        const engine = yard(position, plan);
        assert.deepEqual(surveyBuildPosition(engine.world, actor, position, water), {
            permitted: true, accessMinutes: 0, supplyMinutes: haul, exposed: position === bank, daylight: 1, support: 2,
        });
        const order = request('first-frame', 'build', position, {plan});
        assert.deepEqual(quoteBuilding(engine, order), {eligible: true, minutes, costs: [
            {payer: actor, quantity: B.timber, amount: 2}, {payer: actor, quantity: B.cloth, amount: 1},
        ]});
        const pending = advance(startBuilding(engine, order), 3);
        assert.equal(amount(pending, actor, B.timber), 8);
        assert.equal(amount(pending, position, glow), 0);
        const complete = advance(pending, minutes - 3);
        assert.deepEqual(save(advance(restore(pending), minutes - 3)), save(complete));
        assert.equal(amount(complete, actor, B.timber), 6);
        assert.equal(amount(complete, actor, B.cloth), 2);
        const settled = advance(complete, 1);
        assert.equal(amount(settled, position, glow), 24);
        assert.equal(amount(settled, other, glow), 0);
        assert.equal(settled.world.holders[`${position}.flies`].count, 2);
    }
});

test('the bank saves twelve minutes on the same water haul and the terrace still receives real stock', () => {
    for (const [position, minutes] of [[bank, 5], [terrace, 17]]) {
        const engine = yard(position, 'shade-v1');
        const order = request('water', 'haul', position, {source: water});
        assert.equal(quoteBuilding(engine, order).minutes, minutes);
        const pending = advance(startBuilding(engine, order), minutes - 1);
        assert.equal(amount(pending, actor, B.water), 0);
        const delivered = advance(restore(pending), 1);
        assert.equal(amount(delivered, actor, B.water), 1);
        assert.equal(amount(delivered, water, B.water), 1);
    }
    const closed = applyEngineOps(yard(terrace, 'shade-v1'), [
        {op: 'link_set', id: 'terrace-bank', oneWay: true},
    ], 'fixture:one-way-slope');
    assert.match(quoteBuilding(closed, request('no-return', 'haul', terrace, {source: water})).reason, /round trip/);
});

test('a shortage, changed tenure or occupied position cannot spend the same construction twice', () => {
    const plan = 'shade-v1';
    const order = request('frame-one', 'build', bank, {plan});
    const short = yard(bank, plan, {cloth: 0});
    assert.match(quoteBuilding(short, order).reason, /bill of materials/);
    assert.throws(() => startBuilding(short, order), /bill of materials/);
    assert.equal(amount(short, actor, B.timber), 8);
    const open = yard(bank, plan);
    const changed = applyEngineOps(startBuilding(open, order), [
        {op: 'property', holder: bank, property: B.tenure, value: null},
    ], 'fixture:permission-withdrawn');
    const stopped = advance(restore(changed), 8);
    assert.equal(stopped.records.workings['frame-one'].record.status, 'interrupted');
    assert.equal(amount(stopped, actor, B.timber), 8);
    assert.equal(amount(stopped, 'frame', 'condition'), 0);
    const competing = startBuilding(startBuilding(open, order), {...order, id: 'frame-two'});
    const built = advance(restore(competing), 8);
    assert.equal(built.records.workings['frame-one'].record.status, 'complete');
    assert.equal(built.records.workings['frame-two'].record.status, 'interrupted');
    assert.equal(amount(built, actor, B.timber), 6);
});

test('exposed shade wears, an occupied position blocks a move, and paid repair restores the same local use', () => {
    const order = request('shade', 'build', bank, {plan: 'shade-v1'});
    const built = finish(yard(bank, 'shade-v1'), order);
    const worn = advance(restore(built), 61);
    let stepped = built;
    for (let i = 0; i < 61; i++) stepped = advance(i === 30 ? restore(stepped) : stepped, 1);
    assert.deepEqual(save(stepped), save(worn));
    assert.equal(amount(worn, 'frame', 'condition'), 39);
    assert.equal(amount(worn, bank, glow), 0);
    const move = request('move', 'relocate', bank, {destination: terrace});
    const occupied = applyEngineOps(worn, [
        {op: 'property', holder: terrace, property: B.slot, value: 'another-frame'},
    ], 'fixture:occupied');
    assert.match(quoteBuilding(occupied, move).reason, /occupied/);
    const repaired = finish(worn, request('mend', 'repair', bank));
    assert.equal(amount(repaired, actor, B.timber), 5);
    const lit = advance(repaired, 1);
    assert.equal(amount(lit, bank, glow), 24);
    const moved = advance(finish(lit, move), 1);
    assert.equal(moved.world.holders.frame.place, terrace);
    assert.equal(amount(moved, bank, glow), 0);
    assert.equal(amount(moved, terrace, glow), 24);
});

test('a paid annex opens a path, and the relocated rack dries its existing lot under cover', () => {
    const built = finish(yard(terrace, 'rack-v1'), request('rack', 'build', terrace, {plan: 'rack-v1'}));
    const extension = request('annex', 'annex', terrace, {destination: annex});
    const move = request('move-rack', 'relocate', terrace, {destination: annex});
    assert.equal(surveyBuildPosition(built.world, actor, annex, water).accessMinutes, null);
    assert.match(quoteBuilding(built, move).reason, /Open a path/);
    const pending = advance(startBuilding(built, extension), 2);
    assert.equal(surveyBuildPosition(pending.world, actor, annex, water).permitted, false);
    const expanded = advance(restore(pending), 3);
    assert.deepEqual(save(expanded), save(advance(pending, 3)));
    assert.equal(amount(expanded, actor, B.timber), 5);
    assert.deepEqual(surveyBuildPosition(expanded.world, actor, annex, water), {
        permitted: true, accessMinutes: 2, supplyMinutes: 10, exposed: false, daylight: 1, support: 1,
    });
    const named = finish(expanded, request('name-rack', 'rename', terrace, {name: ' Reed rack '}));
    const loaded = finish(named, request('load-rack', 'load', terrace));
    assert.equal(amount(loaded, actor, B.wet), 0);
    const placed = finish(loaded, move);
    assert.equal(placed.world.holders.frame.properties[B.name], 'Reed rack');
    assert.equal(amount(placed, 'frame', B.wet), 1);
    assert.match(quoteBuilding(placed, request('old-rack', 'dry', terrace)).reason, /at this position/);
    const dried = finish(restore(placed), request('dry-reeds', 'dry', annex));
    assert.equal(amount(dried, 'frame', B.wet), 0);
    assert.equal(amount(dried, 'frame', B.dry), 1);
    const collected = finish(dried, request('collect', 'collect', annex));
    assert.equal(amount(collected, 'frame', B.dry), 0);
    assert.equal(amount(collected, actor, B.dry), 1);
    const exposedRack = finish(yard(bank, 'rack-v1'), request('bank-rack', 'build', bank, {plan: 'rack-v1'}));
    assert.match(quoteBuilding(exposedRack, request('wet-rack', 'dry', bank)).reason, /under cover/);
    const loadedRack = finish(exposedRack, request('load-bank-rack', 'load', bank));
    const shelteredRack = finish(loadedRack, request('shelter-rack', 'relocate', bank, {destination: terrace}));
    assert.equal(amount(finish(shelteredRack, request('dry-in-cover', 'dry', terrace)), 'frame', B.dry), 1);
});

test('a recorded design survives restore, while reuse needs local supports and fresh materials', () => {
    const plan = 'shade-v1';
    const first = finish(yard(terrace, plan), request('first', 'build', terrace, {plan}));
    const withNotebook = applyEngineOps(first, [{op: 'holder_add', value: {
        id: 'notebook', kind: 'thing', as: ['building.notebook'], place: terrace, properties: {[B.tenure]: actor},
    }}], 'fixture:notebook');
    const recorded = finish(withNotebook, request('record', 'record', terrace, {notebook: 'notebook'}));
    const restored = restore(recorded);
    const savedPlan = restored.world.holders.notebook.properties[B.recordedPlan];
    assert.equal(savedPlan, plan);
    const expanded = finish(restored, request('annex', 'annex', terrace, {destination: annex}));
    const atAnnex = applyEngineOps(expanded, [
        {op: 'move', holder: actor, to: annex},
        {op: 'holder_add', value: {id: 'copy', kind: 'thing', as: ['building.fitting'], place: annex,
            quantities: {condition: 0}, properties: {[B.design]: savedPlan}}},
    ], 'fixture:carry-unfinished-frame');
    const copy = request('reuse', 'build', annex, {fitting: 'copy', plan: savedPlan});
    assert.match(quoteBuilding(atAnnex, copy).reason, /firmer supports/);
    assert.equal(amount(atAnnex, actor, B.timber), 5);
    const braced = finish(atAnnex, request('brace-annex', 'brace', annex));
    const reused = advance(finish(braced, copy), 1);
    assert.equal(amount(reused, actor, B.timber), 2);
    assert.equal(amount(reused, actor, B.cloth), 1);
    assert.equal(amount(reused, annex, 'daylight'), 0);
    const removed = applyEngineOps(reused, [{op: 'property', holder: annex, property: B.brace, value: null}], 'fixture:remove-brace');
    assert.equal(amount(advance(restore(removed), 1), annex, 'daylight'), 1);
    assert.equal(amount(reused, terrace, 'daylight'), 0);
});
