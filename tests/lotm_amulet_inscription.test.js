import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {readMaterialLineage} from '../src/material_lineage.js';
import {boundAmuletMinute, MARKED_TRIAL_SILVER, TINGEN_TRIAL_BLANK} from '../src/lotm_amulet_crafting.js';
import {checkTingenAmulet, startTingenInscription, TINGEN_SILVER, TINGEN_SPIRITUALITY,
    tingenInscriptionConfig} from '../src/world_packs/lotm_amulet_inscription.js';

const maker = 'klein', wearer = 'recipient', silver = 'silver-piece', knife = 'engraving-knife', desk = 'office';
const other = 'hall';
const config = {...tingenInscriptionConfig, packs: ['n.knowledge']};
const start = (engine, id) => startTingenInscription(engine, {id, maker, silver, knife, desk});
const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
const roundtrip = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const keyOf = engine => engine.world.holders[silver].properties['tingen.item_key'];
const energyOf = engine => engine.world.holders[maker].quantities[TINGEN_SPIRITUALITY];
const record = (engine, id) => engine.records.workings[id].record;
const move = (engine, holder, to) => applyEngineOps(engine, [{op: 'move', holder, to}], 'fixture:move');

function workshop(spirituality = 2) {
    return createEngineWorld({...config, drawRoot: 13, holders: [
        {id: desk, kind: 'place', properties: {'tingen.engraving_desk': true}},
        {id: other, kind: 'place'},
        {id: maker, kind: 'body', place: desk, quantities: {[TINGEN_SPIRITUALITY]: spirituality}},
        {id: wearer, kind: 'body', place: other},
        {id: knife, kind: 'thing', place: desk, as: ['tingen.knife'], properties: {'tingen.held_by': maker}},
        {id: silver, kind: 'thing', place: desk, as: ['tingen.silver'], quantities: {[TINGEN_SILVER]: 1},
            properties: {'tingen.held_by': maker, 'tingen.item_key': TINGEN_TRIAL_BLANK}},
    ]});
}

function loseKnife(engine) {
    return move(advance(engine, 4), knife, other);
}

function giveSilver(engine) {
    return applyEngineOps(move(engine, silver, other), [
        {op: 'property', holder: silver, property: 'tingen.held_by', value: wearer},
    ], 'fixture:give-silver');
}

test('the knife leaves after the first face; restoring and finishing the same silver changes an actual mishap', () => {
    const working = start(workshop(), 'carve');
    const marked = loseKnife(working);
    const interrupted = advance(roundtrip(marked), 10);
    assert.deepEqual(serializeEngineWorld(interrupted), serializeEngineWorld(advance(marked, 10)));
    assert.equal(record(interrupted, 'carve').status, 'interrupted');
    assert.match(record(interrupted, 'carve').receipts[1].reason, /engraving knife/);
    const markedKey = keyOf(marked);
    assert.equal(JSON.parse(markedKey).id, JSON.parse(MARKED_TRIAL_SILVER).id);
    assert.equal(keyOf(interrupted), markedKey);
    assert.equal(readMaterialLineage(markedKey).history[0].inputs[0].item_key, TINGEN_TRIAL_BLANK);
    assert.equal(energyOf(interrupted), 2);

    const rework = start(move(roundtrip(interrupted), knife, desk), 'finish');
    const completed = advance(roundtrip(advance(rework, 13)), 16);
    const minuteSteps = [11, 12, 13, 14, 15, 16].reduce(advance, rework);
    assert.deepEqual(serializeEngineWorld(completed), serializeEngineWorld(minuteSteps));
    assert.equal(record(completed, 'finish').status, 'complete');
    assert.equal(record(completed, 'finish').receipts[0].truth.paid.status, 'paid');
    assert.equal(record(completed, 'finish').receipts[0].truth.paid.lines[0].paid[0].taken, 1);
    assert.equal(energyOf(advance(completed, 17)), 1);
    assert.throws(() => start(completed, 'finish-again'), /unfinished/);
    const itemKey = keyOf(completed);
    assert.equal(boundAmuletMinute(itemKey), 16);
    assert.equal(readMaterialLineage(itemKey).history[0].inputs[0].item_key, markedKey);
    assert.equal(completed.world.holders[silver].quantities[TINGEN_SILVER], 1);

    const finished = roundtrip(giveSilver(completed));
    const unfinished = roundtrip(giveSilver(advance(interrupted, 16)));
    const incident = {kind: 'ordinary-avoidable', id: 'loose-step', target: 11};
    const check = (engine, amulet) => checkTingenAmulet(engine, {wearer, amulet, incident}).result;
    const raw = check(finished).raw;
    assert.ok(raw < 20);
    incident.target = raw + 1;
    assert.equal(check(unfinished, silver).bonus, 0);
    assert.equal(check(unfinished, silver).success, false);
    assert.equal(check(finished, silver).raw, raw);
    assert.equal(check(finished, silver).bonus, 2);
    assert.equal(check(finished, silver).success, true);
    assert.equal(check(finished).success, false);
    assert.equal(keyOf(finished), itemKey);
});

test('binding rechecks current spirituality and leaves marked silver available after a shortfall', () => {
    const marked = advance(start(workshop(1), 'carve'), 4);
    const short = applyEngineOps(marked, [
        {op: 'add', holder: maker, quantity: TINGEN_SPIRITUALITY, amount: -1},
    ], 'fixture:spend-spirituality');
    const stopped = advance(short, 10);
    assert.equal(record(stopped, 'carve').status, 'interrupted');
    assert.match(record(stopped, 'carve').receipts[1].reason, /too little spirituality/);
    assert.equal(keyOf(stopped), keyOf(marked));
    assert.equal(energyOf(stopped), 0);
    assert.equal(boundAmuletMinute(keyOf(stopped)), undefined);
});

test('competing attempts on the same marked silver only finish and pay once', () => {
    const marked = advance(start(workshop(), 'carve'), 4);
    const parallel = start(marked, 'also-finish');
    const settled = advance(roundtrip(parallel), 10);
    assert.deepEqual([record(settled, 'also-finish').status, record(settled, 'carve').status], ['complete', 'interrupted']);
    assert.equal(energyOf(settled), 1);
    assert.equal(settled.world.holders[silver].quantities[TINGEN_SILVER], 1);
});
