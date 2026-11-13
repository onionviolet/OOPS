import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, engineReceipts, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {facetsOf} from '../src/kernel_identity.js';
import {readLineage, readQuantity, readTotals, resolveRef} from '../src/world_substrate.js';
import {bladeProperties, BLOOD_SACRIFICE_RITE, DONOR_WEAPON, DRAGON_FLASH, DRAGON_FLASH_AFTER, DRAGON_FLASH_BEFORE,
    dragonFlashHost, quoteDragonFlashUpgrade, RC_CELL_RHYTHM, runDragonFlashBout, startDragonFlashUpgrade, WEAPON_STOCK}
    from '../src/world_packs/paradise_dragon_flash.js';

const actor = 'su_xiao', place = 'paradise.private_room', rival = 'sparring_partner';
const receiver = 'su_xiao.dragon_flash', donor = 'su_xiao.tc_jack', spare = 'spare.tc_jack';
const request = {id: 'chapter196_feed', actor, receiver, donor, passive: RC_CELL_RHYTHM};
const bout = {id: 'paired_bout', seed: 2, place, actor, receiver, rival, limits: {landed: 2}};

function loadout({blood = true} = {}) {
    const body = (id, tags, properties = {}) => ({id, kind: 'body', place, tags, properties,
        quantities: {vitality: 100, stamina: 12}});
    const weapon = (id, model, passive, stats) => ({id, kind: 'thing', as: ['weapon'], place,
        quantities: {[WEAPON_STOCK]: 1}, properties: bladeProperties(model, actor, passive, stats)});
    const engine = createEngineWorld({...dragonFlashHost, holders: [{id: place, kind: 'place'},
        {id: 'paradise.storage', kind: 'place'}, body(actor, ['circulating_blood'], {'paradise.supreme_edge_blade': true}),
        body(rival, blood ? ['circulating_blood'] : ['machine'])]});
    return applyEngineOps(engine, [weapon(receiver, DRAGON_FLASH, RC_CELL_RHYTHM, DRAGON_FLASH_BEFORE),
        weapon(donor, DONOR_WEAPON, BLOOD_SACRIFICE_RITE), weapon(spare, DONOR_WEAPON, BLOOD_SACRIFICE_RITE)]
        .map(value => ({op: 'holder_add', value, lineage: {act: 'create'}})), 'chapter196:declared_loadout');
}

const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), dragonFlashHost);
const advance = (engine, time = 1) => advanceEngineWorld(engine, time).engine;
const withPassive = (engine, passive) => advance(startDragonFlashUpgrade(engine, {...request, passive}).engine);

function landings(engine) {
    const {record, engine: after} = runDragonFlashBout(engine, bout);
    const hits = after.world.chain.filter(row => row.kind === 'contest.blow' && row.detail.actor === actor);
    assert.ok(hits.length > 0);
    assert.ok(record.log.some(row => row.actor === rival && row.move === 'counter'));
    return {after, first: hits[0].detail.landed, record};
}

test('chapter 196 absorption retires the selected donor once and keeps Dragon Flash on the same identity across restore', () => {
    const base = loadout();
    const {quote, engine: pending} = startDragonFlashUpgrade(base, request);
    assert.equal(quote.ok, true);
    assert.deepEqual(quote.sacrifice, {id: donor, quantity: 1});
    assert.equal(readQuantity(pending.world, donor, WEAPON_STOCK), 1);
    assert.equal(engineReceipts(pending).length, 0);
    const settled = advance(pending, 3);
    const resumed = advance(advance(restore(pending)), 3);
    assert.deepEqual(serializeEngineWorld(resumed), serializeEngineWorld(settled));
    assert.equal(resolveRef(settled.world, {kind: 'weapon', id: receiver}), receiver);
    assert.deepEqual(facetsOf(settled.world.identity, receiver), facetsOf(base.world.identity, receiver));
    assert.equal(readQuantity(settled.world, receiver, WEAPON_STOCK), 1);
    assert.equal(readQuantity(settled.world, spare, WEAPON_STOCK), 1);
    assert.equal(readQuantity(settled.world, donor, WEAPON_STOCK), null);
    assert.deepEqual(facetsOf(settled.world.identity, donor), {});
    assert.equal(readLineage(settled.world, donor).filter(row => row.act === 'end').length, 1);
    assert.equal(readTotals(settled.world).rows['paradise.sacrificed'][WEAPON_STOCK], 1);
    assert.equal(readTotals(settled.world).total[WEAPON_STOCK], readTotals(base.world).total[WEAPON_STOCK]);
    assert.deepEqual(settled.world.holders[receiver].properties, bladeProperties(DRAGON_FLASH, actor, RC_CELL_RHYTHM, DRAGON_FLASH_AFTER));
    const [receipt] = engineReceipts(settled);
    assert.deepEqual(receipt.observed, {donor, receiver, passive: RC_CELL_RHYTHM});
    assert.deepEqual(serializeEngineWorld(advance(restore(settled), 3)), serializeEngineWorld(settled));
    assert.equal(quoteDragonFlashUpgrade(settled, {...request, id: 'repeat', donor: spare}).ok, false);
});

test('admission and settlement recheck the actual donor and do not debit a substitute or replace a passive on failure', () => {
    const base = loadout();
    const bad = startDragonFlashUpgrade(base, {...request, passive: 'unavailable'});
    assert.equal(bad.engine, base);
    assert.equal(bad.quote.ok, false);
    assert.equal(startDragonFlashUpgrade(base, {...request, donor: receiver}).quote.ok, false);
    const pending = startDragonFlashUpgrade(base, request).engine;
    const moved = applyEngineOps(pending, [{op: 'move', holder: donor, to: 'paradise.storage'}], 'fixture:put_donor_away');
    const failed = advance(restore(moved));
    assert.equal(engineReceipts(failed)[0].ok, false);
    assert.match(engineReceipts(failed)[0].reason, /separate donor blade/);
    assert.equal(readQuantity(failed.world, donor, WEAPON_STOCK), 1);
    assert.equal(readQuantity(failed.world, spare, WEAPON_STOCK), 1);
    assert.deepEqual(failed.world.holders[receiver], base.world.holders[receiver]);
    assert.equal(readTotals(failed.world).rows['paradise.sacrificed'], undefined);
});

test('overlapping requests can settle the same donor only once', () => {
    const pending = startDragonFlashUpgrade(loadout(), request).engine;
    const duplicate = startDragonFlashUpgrade(pending, {...request, id: 'second_feed', passive: BLOOD_SACRIFICE_RITE}).engine;
    const settled = advance(restore(duplicate));
    assert.deepEqual(engineReceipts(settled).map(row => row.ok), [true, false]);
    assert.equal(readTotals(settled.world).rows['paradise.sacrificed'][WEAPON_STOCK], 1);
    assert.equal(settled.world.holders[receiver].properties['paradise.passive'], RC_CELL_RHYTHM);
});

test('the retained passive changes real opposed combat on the same fixture and seed', () => {
    const base = loadout();
    const rhythm = landings(restore(withPassive(base, RC_CELL_RHYTHM)));
    const sacrifice = landings(restore(withPassive(base, BLOOD_SACRIFICE_RITE)));
    assert.ok(rhythm.first[0].amount > sacrifice.first[0].amount);
    assert.equal(rhythm.first.length, 1);
    assert.equal(sacrifice.first.length, 2);
    assert.ok(readQuantity(sacrifice.after.world, rival, 'vitality') < readQuantity(rhythm.after.world, rival, 'vitality'));
    assert.equal(readQuantity(rhythm.after.world, actor, 'stamina'), readQuantity(sacrifice.after.world, actor, 'stamina'));
    assert.deepEqual(serializeEngineWorld(restore(sacrifice.after)), serializeEngineWorld(sacrifice.after));

    const machine = loadout({blood: false});
    const withoutBlood = landings(withPassive(machine, BLOOD_SACRIFICE_RITE));
    const withStrength = landings(withPassive(machine, RC_CELL_RHYTHM));
    assert.deepEqual(withoutBlood.first, sacrifice.first.slice(0, 1));
    assert.ok(readQuantity(withStrength.after.world, rival, 'vitality') < readQuantity(withoutBlood.after.world, rival, 'vitality'));
});

test('an empty holder or incomplete attack range cannot enter a bout as Dragon Flash', () => {
    const engine = loadout();
    const depleted = applyEngineOps(engine, [{op: 'set', holder: receiver, quantity: WEAPON_STOCK, amount: 0}], 'fixture:unheld');
    assert.throws(() => runDragonFlashBout(depleted, bout), /Bring Dragon Flash/);
    const incomplete = applyEngineOps(engine, [{op: 'property', holder: receiver, property: 'paradise.attackMin', value: null}], 'fixture:unknown_range');
    assert.throws(() => runDragonFlashBout(incomplete, bout), /valid attack range/);
});
