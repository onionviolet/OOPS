import assert from 'node:assert/strict';
import test from 'node:test';
import {readLineage} from '../src/world_substrate.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';
import {CELLAR_SPORES} from '../src/affliction_catalogue.js';
import {recordsOf} from '../src/knowledge_record.js';
import {beginContest, defineContestLaw, restoreContest, runContest, serializeContest} from '../src/contest.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {SPELL_EFFECT_LAW, spellEffectMethod} from '../src/spell_law.js';
import {appraiseLining, beginHeatedCrossing, crossHeatedLink, fireLiningConfig, forecastHeatedCrossing, forecastLiningFit, giveBreastplate, giveLiningNote, INSCRIPTION_STOCK, knownLiningResistance, placeRecoveredLining,
    lendBreastplate, liningTrialRecord, LINING_STOCK, quoteLiningCommission, readGearExposure, REPAIR_STOCK, returnBreastplate, SALVAGE_STOCK,
    salvageLooseLining, settleHeatExposure, startFireLining, startLiningDetachment, startLiningInscription,
    startLiningCommission, startLiningCopy, startLiningFromTrials, startLiningRecovery, startLiningRepair, startLiningReweave, wearBreastplate, WORKSHOP_COIN,
    startBreastplateRemoval, startLiningNote, startPaidLiningLesson, startReadingLiningNote, stepHeatedCrossing, teachLiningPair,
    surveyHeatedLink, wornBreastplateProfile} from '../src/world_packs/fire_resistant_lining.js';
import {stepWorkshopContest} from '../src/world_packs/workshop_contest.js';
import {FILTER_CAPACITY, FITTED_CARTRIDGE, PURGE_CHARGE, PURGE_SALTS, SPORE_CHARM_LAW, SPORE_CLEARANCE, SPORE_DOSE, SPORE_INTERVAL, SPORE_THRESHOLD,
    startSporeCharmWork, workshopSporePack} from '../src/world_packs/workshop_spore_hazard.js';
import {bindLightRing, breakLightRing, invokeLightRing, LIGHT_RING_HANDOFF_LAW, LIGHT_RING_REPAIR_LAW, lightRingShared,
    lightRingStoredPorts, lightRingWorkingPorts, rechargeLightRing, RING_RECALL_INK, RING_REPAIR_STOCK,
    startLightRingHandoff, startLightRingRecall, startLightRingRepair, WORKSHOP_LIGHT, workshopLightAt} from '../src/world_packs/workshop_light_ring.js';
import {appraiseWardCharge, attuneGearWard, BALANCE_THRESHOLD, bindGearWard, bindPreparedGearWard, breakWardCarrier, forecastWardCharge, forecastWardedHeatedCrossing, gearWardShared, giveGearWard, maintainGearWard,
    releaseCapturedForce, settleGearHit, startWardCarrierPreparation, startWardCarrierRepair, WARD_BINDING_STOCK, WARD_PREPARATION_LAW,
    startWardAssemblyHandoff, startWardInsertSwap, startWardMountRepair, startWardSocketWork, startWardWearWork,
    WARD_REPAIR_LAW, WARD_REPAIR_STOCK, WARD_SOCKET_LAW,
    stepWardedHeatedCrossing, WARD_MOUNT_REMAINING, WARD_MOUNT_STRENGTH, wearGearWard, workshopSpellImpact} from '../src/world_packs/gear_ward.js';

const config = {...fireLiningConfig, packs: ['c.contest', 'n.knowledge', workshopSporePack.id], ownPacks: [workshopSporePack],
    host: {laws: [...fireLiningConfig.host.laws, WARD_REPAIR_LAW, WARD_PREPARATION_LAW, WARD_SOCKET_LAW, SPELL_EFFECT_LAW,
        SPORE_CHARM_LAW, LIGHT_RING_REPAIR_LAW, LIGHT_RING_HANDOFF_LAW],
        ports: {...lightRingWorkingPorts, landImpact: workshopSpellImpact, stored: lightRingStoredPorts}}, shared: {
    quantities: [...new Set([...fireLiningConfig.shared.quantities, ...gearWardShared.quantities, WORLD_QUANTITIES.light])],
    properties: [...fireLiningConfig.shared.properties, ...gearWardShared.properties, ...lightRingShared.properties],
}};
const place = 'yard', wearer = 'wearer', attacker = 'attacker';
const plate = 'plate', lining = 'lining';
const request = {id: 'fit', wearer, armor: plate, lining};
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const advance = (engine, at) => advanceEngineWorld(engine, at).engine;

function workshop() {
    const body = id => ({id, kind: 'body', as: ['creature'], place, quantities: {vitality: 100, [INSCRIPTION_STOCK]: 10, [REPAIR_STOCK]: 1}});
    return createEngineWorld({...config, links: [{id: 'kiln-walk', kind: 'heated-path', from: place, to: 'hall', cost: 4}], holders: [
        {id: place, kind: 'place', quantities: {noise: 0}, properties: {'workshop.route_heat': 5}},
        {id: 'hall', kind: 'place', properties: {'workshop.route_heat': 5}}, body(wearer), body(attacker),
        {id: plate, kind: 'thing', as: ['breastplate'], place,
            properties: {'workshop.held_by': wearer, 'workshop.base_armor': 6, marks: ['lining-seams']}},
        {id: lining, kind: 'thing', as: ['heatproof_lining'], place, quantities: {[LINING_STOCK]: 1},
            properties: {'workshop.held_by': wearer, 'workshop.fire_resistance': 40, marks: ['matching-seams']}},
    ]});
}

const mixes = {cut: {slashing: 1}, fire: {fire: 1}, mixed: {slashing: 1, fire: 1}};
const law = defineContestLaw({id: 'c.workshop_spar', revision: 1,
    moves: Object.fromEntries(Object.entries(mixes).map(([id, damageTypes]) =>
        [id, {resolver: 'strike', steps: [3], power: 28, damageTypes}]))});

function hit(engine, move) {
    const before = engine.world.holders[wearer].quantities.vitality;
    const entrants = [
        {id: attacker, body: attacker, side: 'red', profile: {attack: 100}, moves: [move]},
        {id: wearer, body: wearer, side: 'blue', profile: {evasion: 1, ...wornBreastplateProfile(engine.world, wearer)}, moves: ['wait']},
    ];
    const record = beginContest(law, {id: 'matched-bout', seed: 7, place, entrants, limits: {landed: 1}}, engine.world);
    const run = runContest(law, record, engine.rules, engine.world);
    const blows = run.world.chain.filter(row => row.kind === 'contest.blow');
    assert.equal(blows.length, 1, JSON.stringify(run.record.result));
    const [harm] = blows[0].detail.landed;
    assert.deepEqual(harm, {verb: 'remove', object: 'vitality', amount: before - run.world.holders[wearer].quantities.vitality});
    return harm.amount;
}

const hits = engine => Object.fromEntries(Object.keys(mixes).map(move => [move, hit(engine, move)]));

test('the same plate, seed and hit change only the fire share while the fitted plate is worn', t => {
    const plain = wearBreastplate(workshop(), wearer, plate);
    const pending = startFireLining(plain, request);
    const enchanted = advance(pending, 3);
    assert.deepEqual(serializeEngineWorld(advance(restore(advance(pending, 1)), 3)), serializeEngineWorld(enchanted));
    assert.equal(enchanted.world.holders[lining].quantities[LINING_STOCK], 0);
    const receipt = enchanted.records.workings.fit.record.receipts[0];
    assert.equal(receipt.truth.paid.lines[0].paid[0].taken, 1);
    assert.deepEqual(receipt.observed, {armor: plate, lining});

    const bare = hits(advance(workshop(), 3)), before = hits(advance(plain, 3)), after = hits(restore(enchanted));
    assert.deepEqual(before, {cut: before.cut, fire: before.cut, mixed: before.cut});
    assert.equal(before.cut, bare.cut - 6);
    assert.deepEqual(after, {cut: before.cut, fire: Math.round(before.fire * .6), mixed: Math.round(before.mixed * .8)});
    assert.ok(after.fire < after.mixed && after.mixed < after.cut);
    const unequipped = restore(wearBreastplate(enchanted, wearer));
    assert.deepEqual(hits(unequipped), bare);
    assert.deepEqual(hits(restore(wearBreastplate(unequipped, wearer, plate))), after);
    t.diagnostic(JSON.stringify({bare, plain: before, lined: after, unequipped: hits(unequipped)}));
});

test('a charged ring lights a dark bench and makes its lining appraisable after restore', () => {
    const ring = 'ring', id = 'ring-glow';
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: place, quantity: WORKSHOP_LIGHT, amount: 0},
        {op: 'holder_add', value: {id: ring, kind: 'thing', as: ['light_ring'], place,
            properties: {'workshop.held_by': wearer}}},
    ], 'fixture:dark-bench');
    assert.throws(() => appraiseLining(ready, {observer: wearer, lining}), /more light/);
    const bound = bindLightRing(ready, {id, ring, bearer: wearer, charge: 1, grade: 2});
    assert.throws(() => invokeLightRing(bound, {id, bearer: attacker}), /hold the ring/i);
    const lit = invokeLightRing(restore(bound), {id, bearer: wearer});
    assert.equal(lit.world.holders[place].quantities[WORKSHOP_LIGHT], 2);
    assert.equal(lit.records.stored[id].charge.now, 0);
    assert.deepEqual(serializeEngineWorld(lit), serializeEngineWorld(invokeLightRing(bound, {id, bearer: wearer})));
    const appraisal = appraiseLining(restore(lit), {observer: wearer, lining});
    assert.equal(knownLiningResistance(appraisal.world, wearer, lining), 40);
    const empty = invokeLightRing(restore(appraisal), {id, bearer: wearer});
    assert.equal(empty.records.stored[id].receipts.at(-1).reason, 'charge');
    assert.equal(empty.world.holders[place].quantities[WORKSHOP_LIGHT], 2);

    const timed = bindLightRing(ready, {id, ring, bearer: wearer, charge: 2, grade: 2, minutes: 3});
    const invoke = engine => invokeLightRing(engine, {id, bearer: wearer});
    const glowing = invoke(restore(timed));
    assert.equal(workshopLightAt(glowing.world, place), 2);
    assert.throws(() => invoke(glowing), /still active/);
    const halfway = restore(advance(glowing, 2));
    const inspected = appraiseLining(halfway, {observer: wearer, lining});
    assert.equal(knownLiningResistance(inspected.world, wearer, lining), 40);
    const ambient = applyEngineOps(inspected, [{op: 'add', holder: place, quantity: WORKSHOP_LIGHT, amount: 1}], 'fixture:ambient-light');
    const dimmed = advance(restore(ambient), 3);
    assert.equal(workshopLightAt(dimmed.world, place), 1);
    assert.equal(knownLiningResistance(dimmed.world, wearer, lining), 40);
    const expired = advance(halfway, 3);
    assert.deepEqual(serializeEngineWorld(expired), serializeEngineWorld(advance(glowing, 3)));
    assert.equal(workshopLightAt(expired.world, place), 0);
    assert.throws(() => appraiseLining(expired, {observer: wearer, lining}), /more light/);
    const relit = invoke(restore(expired));
    assert.equal(workshopLightAt(relit.world, place), 2);
    assert.equal(relit.records.stored[id].charge.now, 0);

    const refillable = bindLightRing(ready, {id, ring, bearer: wearer, charge: 1, grade: 2, minutes: 3,
        recharge: {quantity: INSCRIPTION_STOCK, rate: 2}});
    const faded = advance(invoke(refillable), 3);
    const dormant = invoke(restore(faded));
    assert.equal(dormant.records.stored[id].status, 'dormant');
    assert.throws(() => appraiseLining(dormant, {observer: wearer, lining}), /more light/);
    const refill = engine => rechargeLightRing(engine, {id, bearer: wearer, amount: 1});
    assert.throws(() => rechargeLightRing(dormant, {id, bearer: attacker, amount: 1}), /hold the ring/i);
    const poor = applyEngineOps(dormant, [{op: 'add', holder: wearer, quantity: INSCRIPTION_STOCK, amount: -9}],
        'fixture:short-ring-price');
    const refused = refill(restore(poor));
    assert.equal(refused.records.stored[id].charge.now, 0);
    assert.equal(refused.records.stored[id].receipts.at(-1).reason, 'price');
    assert.equal(refused.world.holders[wearer].quantities[INSCRIPTION_STOCK], 1);
    const charged = refill(restore(dormant));
    assert.deepEqual(serializeEngineWorld(charged), serializeEngineWorld(refill(dormant)));
    assert.equal(charged.world.holders[wearer].quantities[INSCRIPTION_STOCK], 8);
    assert.equal(charged.records.stored[id].charge.now, 1);
    const topped = refill(charged);
    assert.equal(topped.world.holders[wearer].quantities[INSCRIPTION_STOCK], 8);
    const litAgain = invoke(restore(topped));
    assert.equal(knownLiningResistance(appraiseLining(litAgain, {observer: wearer, lining}).world, wearer, lining), 40);
    assert.equal(litAgain.records.stored[id].charge.now, 0);
    assert.equal(workshopLightAt(advance(restore(litAgain), 6).world, place), 0);
});

test('a portable glow ends on fracture and the repaired ring needs a paid renewal', () => {
    const ring = 'repair-ring', id = 'repair-glow';
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: place, quantity: WORKSHOP_LIGHT, amount: 0},
        {op: 'carry', holder: wearer, quantity: RING_REPAIR_STOCK, amount: 2},
        {op: 'holder_add', value: {id: ring, kind: 'thing', as: ['light_ring'], place,
            properties: {'workshop.held_by': wearer}}},
    ], 'fixture:repairable-light-ring');
    const bound = bindLightRing(ready, {id, ring, bearer: wearer, charge: 2, grade: 2, minutes: 8, portable: true,
        renew: {quantity: INSCRIPTION_STOCK, price: 2}});
    const invoke = engine => invokeLightRing(engine, {id, bearer: wearer});
    const broken = breakLightRing(restore(advance(invoke(bound), 1)), {id, bearer: wearer});
    assert.equal(broken.records.stored[id].status, 'broken');
    assert.equal(broken.records.stored[id].charge.now, 1);
    assert.equal(workshopLightAt(broken.world, place), 0);
    const renew = engine => rechargeLightRing(engine, {id, bearer: wearer, renew: true});
    assert.throws(() => renew(broken), /repair the ring/i);
    const repair = (engine, id) => startLightRingRepair(engine, {id, ring, bearer: wearer});
    const pending = repair(repair(broken, 'repair'), 'repair-again');
    const moved = applyEngineOps(pending, [{op: 'move', holder: ring, to: 'hall'}], 'fixture:remove-ring-from-bench');
    assert.equal(advance(restore(moved), 4).world.holders[wearer].quantities[RING_REPAIR_STOCK], 2);
    const fixed = advance(restore(advance(pending, 2)), 4);
    assert.deepEqual(serializeEngineWorld(fixed), serializeEngineWorld(advance(pending, 4)));
    assert.equal(fixed.records.workings['repair-again'].record.status, 'interrupted');
    assert.equal(fixed.world.holders[wearer].quantities[RING_REPAIR_STOCK], 1);
    assert.equal(workshopLightAt(fixed.world, place), 0);
    assert.equal(workshopLightAt(invoke(restore(fixed)).world, place), 0);
    const renewed = renew(restore(fixed));
    assert.equal(renewed.world.holders[wearer].quantities[INSCRIPTION_STOCK], 8);
    assert.equal(renewed.records.stored[id].charge.now, 2);
    const relit = invoke(restore(renewed));
    assert.equal(knownLiningResistance(appraiseLining(relit, {observer: wearer, lining}).world, wearer, lining), 40);
    assert.equal(workshopLightAt(advance(restore(relit), 8).world, place), 2);
    assert.equal(workshopLightAt(advance(restore(relit), 12).world, place), 0);
});

test('a ring checks ambient light on its saved cadence and lights a dark appraisal bench', () => {
    const ring = 'bench-ring', id = 'bench-watch';
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: place, quantity: WORKSHOP_LIGHT, amount: 2},
        {op: 'holder_add', value: {id: ring, kind: 'thing', as: ['light_ring'], place,
            properties: {'workshop.held_by': wearer}}},
    ], 'fixture:bench-watch');
    const bound = bindLightRing(ready, {id, ring, bearer: wearer, destination: place, darkAt: 0, minutes: 3,
        charge: 2, grade: 2});
    const bright = advance(restore(bound), 3);
    assert.equal(bright.records.stored[id].charge.now, 2);
    const dark = applyEngineOps(bright, [{op: 'set', holder: place, quantity: WORKSHOP_LIGHT, amount: 0}], 'fixture:darken-bench');
    assert.throws(() => appraiseLining(dark, {observer: wearer, lining}), /more light/);
    assert.throws(() => invokeLightRing(dark, {id, bearer: wearer}), /answers the light/);
    const before = advance(dark, 5);
    const lit = advance(restore(before), 6);
    assert.deepEqual(serializeEngineWorld(lit), serializeEngineWorld(advance(dark, 6)));
    assert.equal(lit.records.stored[id].charge.now, 1);
    assert.equal(workshopLightAt(lit.world, place), 2);
    assert.equal(knownLiningResistance(appraiseLining(lit, {observer: wearer, lining}).world, wearer, lining), 40);
    const daylight = applyEngineOps(lit, [{op: 'set', holder: place, quantity: WORKSHOP_LIGHT, amount: 1}],
        'fixture:daylight-returns');
    const ambientOnly = advance(restore(daylight), 9);
    assert.equal(ambientOnly.records.stored[id].charge.now, 1);
    assert.equal(workshopLightAt(ambientOnly.world, place), 1);
    const refreshed = advance(restore(lit), 9);
    assert.equal(refreshed.records.stored[id].charge.now, 0);
    assert.equal(workshopLightAt(refreshed.world, place), 2);
    const spent = advance(restore(refreshed), 12);
    assert.equal(workshopLightAt(spent.world, place), 0);
    assert.equal(spent.records.stored[id].receipts.at(-1).reason, 'charge');
});

test('automatic rings share the same bench and the backup spends charge when the primary runs out', () => {
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: place, quantity: WORKSHOP_LIGHT, amount: 0},
        ...['primary', 'backup'].map(id => ({op: 'holder_add', value: {id, kind: 'thing', as: ['light_ring'], place,
            properties: {'workshop.held_by': wearer}}})),
    ], 'fixture:paired-light-rings');
    const bind = (engine, id, ring) => bindLightRing(engine, {id, ring, bearer: wearer, destination: place,
        darkAt: 1, watchEffectiveLight: true, minutes: 3, charge: 1, grade: 2});
    const bound = bind(bind(ready, 'b-backup', 'backup'), 'a-primary', 'primary');
    const charge = (engine, id) => engine.records.stored[id].charge.now;
    const lit = advance(restore(advance(bound, 2)), 3);
    assert.equal(charge(lit, 'a-primary'), 0);
    assert.equal(charge(lit, 'b-backup'), 1);
    assert.equal(workshopLightAt(lit.world, place), 2);
    const backup = advance(restore(lit), 6);
    assert.deepEqual(serializeEngineWorld(backup), serializeEngineWorld(advance(bound, 6)));
    assert.equal(charge(backup, 'b-backup'), 0);
    assert.equal(workshopLightAt(backup.world, place), 2);
    assert.equal(knownLiningResistance(appraiseLining(backup, {observer: wearer, lining}).world, wearer, lining), 40);
    assert.equal(workshopLightAt(advance(restore(backup), 9).world, place), 0);

    const dropped = applyEngineOps(bound, [{op: 'property', holder: 'primary',
        property: 'workshop.held_by', value: null}], 'fixture:put-down-primary');
    const fallback = advance(restore(dropped), 3);
    assert.equal(charge(fallback, 'a-primary'), 1);
    assert.equal(charge(fallback, 'b-backup'), 0);
});

test('a keyed ring lights a linked bench only when the path admits the full pulse', () => {
    const ring = 'ring', id = 'linked-bench-glow';
    const ready = applyEngineOps(workshop(), [
        ...[place, 'hall'].map(holder => ({op: 'carry', holder, quantity: WORKSHOP_LIGHT, amount: 0})),
        {op: 'holder_add', value: {id: ring, kind: 'thing', as: ['light_ring'], place,
            properties: {'workshop.held_by': wearer}}},
        {op: 'link_set', id: 'kiln-walk', state: 'closed'},
    ], 'fixture:linked-bench');
    const spec = {id, ring, bearer: wearer, charge: 3, grade: 2, minutes: 3,
        command: 'light the bench', destination: 'hall', distanceCharge: 1};
    const bound = bindLightRing(ready, spec);
    const invoke = (engine, spoken = spec.command) => invokeLightRing(engine, {id, bearer: wearer, spoken});
    const last = engine => engine.records.stored[id].receipts.at(-1);
    const charge = engine => engine.records.stored[id].charge.now;
    const wrongWord = invoke(restore(bound), 'glow');
    assert.equal(last(wrongWord).reason, 'stimulus');
    const shut = invoke(restore(wrongWord));
    assert.equal(last(shut).reason, 'reach');
    assert.equal(charge(shut), 3);
    assert.equal(workshopLightAt(shut.world, 'hall'), 0);

    const open = engine => applyEngineOps(engine, [{op: 'link_set', id: 'kiln-walk', state: 'open'}],
        'fixture:open-bench-passage');
    const openPath = open(shut);
    const lit = invoke(restore(openPath));
    assert.deepEqual(serializeEngineWorld(lit), serializeEngineWorld(invoke(openPath)));
    assert.equal(last(lit).cost, 2);
    assert.equal(charge(lit), 1);
    assert.equal(workshopLightAt(lit.world, place), 0);
    assert.throws(() => appraiseLining(lit, {observer: wearer, lining}), /more light/);

    const atBench = applyEngineOps(restore(lit), [
        {op: 'move', holder: attacker, to: 'hall'}, {op: 'move', holder: lining, to: 'hall'},
    ], 'fixture:inspect-linked-bench');
    const inspected = appraiseLining(atBench, {observer: attacker, lining});
    assert.equal(knownLiningResistance(inspected.world, attacker, lining), 40);
    const expired = advance(restore(inspected), 3);
    assert.equal(workshopLightAt(expired.world, 'hall'), 0);
    const short = invoke(restore(expired));
    assert.equal(last(short).reason, 'charge');
    assert.equal(charge(short), 1);
    assert.equal(workshopLightAt(short.world, 'hall'), 0);

    const carried = crossHeatedLink(short, {wearer, link: 'kiln-walk'}).engine;
    const local = invoke(restore(carried));
    assert.equal(last(local).cost, 1);
    assert.equal(charge(local), 0);
    assert.equal(workshopLightAt(local.world, 'hall'), 2);
});

test('portable glow follows the exact ring across a heated path and fades at the original deadline', () => {
    const ring = 'ring', id = 'travel-glow';
    const ready = applyEngineOps(workshop(), [
        ...[place, 'hall'].map(holder => ({op: 'carry', holder, quantity: WORKSHOP_LIGHT, amount: 0})),
        {op: 'holder_add', value: {id: ring, kind: 'thing', as: ['light_ring'], place,
            properties: {'workshop.held_by': wearer}}},
    ], 'fixture:portable-glow');
    const bound = bindLightRing(ready, {id, ring, bearer: wearer, charge: 1, grade: 2, minutes: 6, portable: true});
    const glowing = invokeLightRing(bound, {id, bearer: wearer});
    assert.equal(workshopLightAt(glowing.world, place), 2);
    const route = {wearer, link: 'kiln-walk'};
    const arrived = crossHeatedLink(restore(glowing), route).engine;
    assert.deepEqual(serializeEngineWorld(arrived), serializeEngineWorld(crossHeatedLink(glowing, route).engine));
    assert.equal(arrived.world.holders[ring].place, 'hall');
    assert.equal(workshopLightAt(arrived.world, place), 0);
    assert.equal(workshopLightAt(arrived.world, 'hall'), 2);
    assert.equal(arrived.records.stored[id].charge.now, 0);
    assert.equal(knownLiningResistance(appraiseLining(restore(arrived), {observer: wearer, lining}).world, wearer, lining), 40);
    const faded = advance(restore(arrived), 6);
    assert.equal(workshopLightAt(faded.world, 'hall'), 0);
    assert.throws(() => appraiseLining(faded, {observer: wearer, lining}), /more light/);
});

test('a saved light-ring handoff carries its live glow and remaining charge to the recipient', () => {
    const ring = 'ring', id = 'shared-glow';
    const ready = applyEngineOps(workshop(), [
        ...[place, 'hall'].map(holder => ({op: 'carry', holder, quantity: WORKSHOP_LIGHT, amount: 0})),
        {op: 'holder_add', value: {id: ring, kind: 'thing', as: ['light_ring'], place,
            properties: {'workshop.held_by': wearer}}},
        {op: 'property', holder: lining, property: 'workshop.held_by', value: attacker},
    ], 'fixture:glowing-ring-handoff');
    const bound = bindLightRing(ready, {id, ring, bearer: wearer, charge: 2, grade: 2, minutes: 9, portable: true});
    const glowing = invokeLightRing(bound, {id, bearer: wearer});
    const give = (engine, id) => startLightRingHandoff(engine, {id, ring, from: wearer, to: attacker});
    const pending = give(give(glowing, 'give'), 'give-again');
    const away = applyEngineOps(pending, [{op: 'move', holder: attacker, to: 'hall'}], 'fixture:recipient-leaves-before-gift');
    const departed = advance(restore(away), 3);
    assert.equal(departed.records.workings.give.record.status, 'interrupted');
    assert.equal(departed.world.holders[ring].properties['workshop.held_by'], wearer);
    const given = advance(restore(advance(pending, 1)), 3);
    assert.deepEqual(serializeEngineWorld(given), serializeEngineWorld(advance(pending, 3)));
    assert.equal(given.records.workings.give.record.status, 'complete');
    assert.equal(given.records.workings['give-again'].record.status, 'interrupted');
    assert.throws(() => invokeLightRing(given, {id, bearer: wearer}), /hold the ring/i);
    const arrived = crossHeatedLink(restore(given), {wearer: attacker, link: 'kiln-walk'}).engine;
    assert.equal(arrived.world.holders[ring].place, 'hall');
    assert.equal(workshopLightAt(arrived.world, place), 0);
    assert.equal(workshopLightAt(arrived.world, 'hall'), 2);
    assert.equal(arrived.records.stored[id].charge.now, 1);
    assert.equal(knownLiningResistance(appraiseLining(restore(arrived), {observer: attacker, lining}).world, attacker, lining), 40);
    const faded = advance(restore(arrived), 9);
    assert.equal(workshopLightAt(faded.world, 'hall'), 0);
    const relit = invokeLightRing(restore(faded), {id, bearer: attacker});
    assert.equal(workshopLightAt(relit.world, 'hall'), 2);
    assert.equal(relit.records.stored[id].charge.now, 0);
});

test('a borrowed light ring returns to its lender with the charge left after appraisal', () => {
    const ring = 'loan-ring', id = 'loan-glow';
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: place, quantity: WORKSHOP_LIGHT, amount: 0},
        {op: 'holder_add', value: {id: ring, kind: 'thing', as: ['light_ring'], place,
            properties: {'workshop.held_by': wearer}}},
    ], 'fixture:loaned-ring');
    const bound = bindLightRing(ready, {id, ring, bearer: wearer, charge: 2, grade: 2, minutes: 6, portable: true});
    const pending = startLightRingHandoff(bound, {id: 'lend', ring, from: wearer, to: attacker, mode: 'loan'});
    const loaned = advance(restore(pending), 3);
    const used = invokeLightRing(loaned, {id, bearer: attacker});
    assert.equal(knownLiningResistance(appraiseLining(used, {observer: attacker, lining}).world, attacker, lining), 40);
    const gift = startLightRingHandoff(used, {id: 'borrower-gift', ring, from: attacker, to: wearer});
    const returnRing = (engine, job) =>
        startLightRingHandoff(engine, {id: job, ring, from: attacker, to: wearer, mode: 'return'});
    const returning = returnRing(returnRing(gift, 'return-ring'), 'return-ring-again');
    const moved = applyEngineOps(returning, [{op: 'move', holder: wearer, to: 'hall'}], 'fixture:lender-leaves');
    const interrupted = advance(restore(moved), 6);
    assert.equal(interrupted.records.workings['return-ring'].record.status, 'interrupted');
    assert.equal(interrupted.world.holders[ring].properties['workshop.held_by'], attacker);
    const returned = advance(restore(advance(returning, 4)), 6);
    assert.deepEqual(serializeEngineWorld(returned), serializeEngineWorld(advance(returning, 6)));
    assert.equal(returned.records.workings['borrower-gift'].record.status, 'interrupted');
    assert.equal(returned.records.workings['return-ring-again'].record.status, 'interrupted');
    assert.equal(returned.world.holders[ring].properties['workshop.held_by'], wearer);
    assert.equal(workshopLightAt(returned.world, place), 2);
    assert.equal(returned.records.stored[id].charge.now, 1);
    const expired = advance(restore(returned), 9);
    assert.equal(workshopLightAt(expired.world, place), 0);
    const lit = invokeLightRing(expired, {id, bearer: wearer});
    assert.equal(workshopLightAt(lit.world, place), 2);
    assert.equal(lit.records.stored[id].charge.now, 0);
});

test('an agreed ring recall returns its live glow and spends ink only over the quoted open path', () => {
    const ring = 'recall-ring', id = 'recall-glow';
    const ready = applyEngineOps(workshop(), [
        ...[place, 'hall'].map(holder => ({op: 'carry', holder, quantity: WORKSHOP_LIGHT, amount: 0})),
        {op: 'carry', holder: wearer, quantity: RING_RECALL_INK, amount: 2},
        {op: 'holder_add', value: {id: ring, kind: 'thing', as: ['light_ring'], place,
            properties: {'workshop.held_by': wearer}}},
    ], 'fixture:recallable-glow');
    const bound = bindLightRing(ready, {id, ring, bearer: wearer, charge: 2, grade: 2, minutes: 12, portable: true});
    const travelWithLoan = recall => {
        const loan = startLightRingHandoff(bound, {id: 'lend-ring', ring, from: wearer, to: attacker, mode: 'loan', recall});
        const borrowed = advance(restore(loan), 3);
        const remote = crossHeatedLink(borrowed, {wearer: attacker, link: 'kiln-walk'}).engine;
        return invokeLightRing(restore(remote), {id, bearer: attacker});
    };
    const start = (engine, id) => startLightRingRecall(engine, {id, ring, from: attacker, to: wearer});
    const remote = travelWithLoan(true);
    const at = remote.world.clock + 5;
    const noConsent = advance(restore(start(travelWithLoan(false), 'without-recall-term')), at);
    assert.equal(noConsent.records.workings['without-recall-term'].record.status, 'interrupted');
    assert.equal(noConsent.world.holders[wearer].quantities[RING_RECALL_INK], 2);
    const pending = start(start(remote, 'recall'), 'recall-again');
    const shut = applyEngineOps(pending, [{op: 'link_set', id: 'kiln-walk', state: 'closed'}], 'fixture:shut-recall-route');
    const blocked = advance(restore(shut), at);
    assert.equal(blocked.records.workings.recall.record.status, 'interrupted');
    assert.equal(blocked.world.holders[ring].place, 'hall');
    assert.equal(blocked.world.holders[wearer].quantities[RING_RECALL_INK], 2);
    const returned = advance(restore(advance(pending, at - 1)), at);
    assert.deepEqual(serializeEngineWorld(returned), serializeEngineWorld(advance(pending, at)));
    assert.equal(returned.records.workings.recall.record.status, 'complete');
    assert.equal(returned.records.workings['recall-again'].record.status, 'interrupted');
    assert.equal(returned.world.holders[wearer].quantities[RING_RECALL_INK], 1);
    assert.equal(returned.world.holders[attacker].place, 'hall');
    assert.equal(returned.world.holders[ring].place, place);
    assert.equal(returned.world.holders[ring].properties['workshop.held_by'], wearer);
    assert.equal(returned.records.stored[id].charge.now, 1);
    assert.equal(workshopLightAt(returned.world, 'hall'), 0);
    assert.equal(knownLiningResistance(appraiseLining(returned, {observer: wearer, lining}).world, wearer, lining), 40);
    assert.equal(workshopLightAt(advance(restore(returned), remote.world.clock + 12).world, place), 0);
});

test('a missing interface or a lining moved away before settlement leaves the plate plain and the stock unspent', () => {
    const plain = wearBreastplate(workshop(), wearer, plate);
    const badFit = applyEngineOps(plain, [{op: 'property', holder: lining, property: 'marks', value: []}], 'fixture:misfit');
    const misplaced = applyEngineOps(startFireLining(plain, request), [
        {op: 'move', holder: lining, to: 'hall'},
    ], 'fixture:move-lining');
    for (const pending of [startFireLining(badFit, request), misplaced]) {
        const stopped = advance(restore(pending), 3);
        assert.equal(stopped.records.workings.fit.record.status, 'interrupted');
        assert.equal(stopped.world.holders[lining].quantities[LINING_STOCK], 1);
        assert.deepEqual(wornBreastplateProfile(stopped.world, wearer), {armor: 6});
    }
});

test('competing fittings spend the exact lining once', () => {
    const pending = startFireLining(workshop(), request);
    const competing = startFireLining(pending, {...request, id: 'second-fit'});
    const settled = advance(restore(competing), 3);
    assert.deepEqual(Object.values(settled.records.workings).map(entry => entry.record.status), ['complete', 'interrupted']);
    assert.equal(settled.world.holders[lining].quantities[LINING_STOCK], 0);
});

test('a paid failed trial retains observations that its maker can use to compose a working pattern', () => {
    const blank = applyEngineOps(workshop(), [{op: 'property', holder: lining,
        property: 'workshop.fire_resistance', value: null}], 'fixture:blank');
    const compose = {id: 'combine', wearer, lining, effects: ['fire', 'heat']};
    const trial = (engine, id, pattern) => startLiningInscription(engine, {id, wearer, lining, pattern});
    assert.throws(() => startLiningFromTrials(blank, compose), /try the marks/i);
    const fire = advance(restore(trial(blank, 'trial-fire', ['weave', 'ember', 'veil'])), 3);
    assert.equal(fire.records.workings['trial-fire'].record.status, 'interrupted');
    assert.equal(fire.world.holders[lining].properties['workshop.fire_resistance'], undefined);
    assert.deepEqual(liningTrialRecord(fire, wearer).pairs.map(pair => pair.effect), ['fire', 'discord']);
    assert.throws(() => startLiningFromTrials(fire, compose), /try the marks/i);
    const heat = advance(restore(trial(fire, 'trial-heat', ['ember', 'veil', 'weave'])), 6);
    assert.equal(heat.records.workings['trial-heat'].record.status, 'interrupted');
    assert.equal(heat.world.holders[wearer].quantities[INSCRIPTION_STOCK], 4);
    assert.deepEqual(liningTrialRecord(heat, attacker).pairs, []);

    const pending = startLiningFromTrials(restore(heat), compose);
    const marked = advance(restore(pending), 9);
    assert.deepEqual(serializeEngineWorld(marked), serializeEngineWorld(advance(pending, 9)));
    assert.equal(marked.world.holders[wearer].quantities[INSCRIPTION_STOCK], 1);
    const worn = wearBreastplate(advance(startFireLining(marked, request), 12), wearer, plate);
    assert.deepEqual(hits(restore(worn)), {cut: 25, fire: 15, mixed: 20});
    assert.equal(settleHeatExposure(worn, {wearer, dose: 20}).damage, 16);
});

test('a taught rune pair survives restore and lets a student inscribe a different blank', () => {
    const studentBlank = 'student-lining';
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: lining, property: 'workshop.fire_resistance', value: null},
        {op: 'holder_add', value: {id: studentBlank, kind: 'thing', as: ['heatproof_lining'], place,
            quantities: {[LINING_STOCK]: 1}, properties: {'workshop.held_by': attacker, marks: ['matching-seams']}}},
    ], 'fixture:lesson');
    const teach = {teacher: wearer, student: attacker, effect: 'fire'};
    assert.throws(() => teachLiningPair(ready, teach), /observed that pair/);
    const tried = advance(startLiningInscription(ready, {id: 'failed-demo', wearer, lining,
        pattern: ['weave', 'ember', 'veil']}), 3);
    const away = applyEngineOps(tried, [{op: 'move', holder: attacker, to: 'hall'}], 'fixture:student-away');
    assert.throws(() => teachLiningPair(away, teach), /together/);
    const lesson = restore(teachLiningPair(restore(tried), teach));
    assert.deepEqual(liningTrialRecord(lesson, attacker).pairs, []);
    const [note] = Object.values(recordsOf(lesson.world, attacker));
    assert.equal(note.source.kind, 'instruction');
    assert.equal(note.source.by, wearer);
    const pending = startLiningFromTrials(lesson, {id: 'student-inscription', wearer: attacker, lining: studentBlank,
        effects: ['fire']});
    const inscribed = advance(restore(pending), 6);
    assert.equal(inscribed.world.holders[attacker].quantities[INSCRIPTION_STOCK], 8);
    assert.equal(inscribed.world.holders[wearer].quantities[INSCRIPTION_STOCK], 7);
    const given = giveBreastplate(inscribed, {from: wearer, to: attacker, armor: plate});
    const fitted = advance(startFireLining(given, {id: 'student-fit', wearer: attacker, armor: plate, lining: studentBlank}), 9);
    const returned = giveBreastplate(fitted, {from: attacker, to: wearer, armor: plate});
    assert.deepEqual(hits(restore(wearBreastplate(returned, wearer, plate))), {cut: 25, fire: 15, mixed: 20});
});

test('a paid written rune note travels and teaches its reader after restore', () => {
    const note = 'rune-page', studentBlank = 'student-lining';
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: lining, property: 'workshop.fire_resistance', value: null},
        {op: 'holder_add', value: {id: note, kind: 'thing', as: ['rune_note'], place,
            properties: {'workshop.held_by': wearer}}},
        {op: 'holder_add', value: {id: studentBlank, kind: 'thing', as: ['heatproof_lining'], place,
            quantities: {[LINING_STOCK]: 1}, properties: {'workshop.held_by': attacker, marks: ['matching-seams']}}},
    ], 'fixture:note');
    const tried = advance(startLiningInscription(ready, {id: 'trial', wearer, lining, pattern: ['weave', 'ember', 'veil']}), 3);
    const pending = startLiningNote(tried, {id: 'write', wearer, note, effect: 'fire'});
    const handoff = engine => giveLiningNote(engine, {note, from: wearer, to: attacker});
    const interrupted = advance(restore(handoff(pending)), 6);
    assert.equal(interrupted.records.workings.write.record.status, 'interrupted');
    assert.equal(interrupted.world.holders[wearer].quantities[INSCRIPTION_STOCK], 7);
    assert.deepEqual(recordsOf(interrupted.world, note), {});

    const written = advance(restore(pending), 6);
    assert.equal(written.world.holders[wearer].quantities[INSCRIPTION_STOCK], 6);
    const given = restore(handoff(written));
    assert.deepEqual(recordsOf(given.world, attacker), {});
    const reading = startReadingLiningNote(given, {id: 'read', wearer: attacker, note});
    const learned = advance(restore(reading), 9);
    assert.deepEqual(serializeEngineWorld(learned), serializeEngineWorld(advance(reading, 9)));
    const [lesson] = Object.values(recordsOf(learned.world, attacker));
    assert.equal(lesson.source.by, note);

    const compose = startLiningFromTrials(learned, {id: 'apply-note', wearer: attacker, lining: studentBlank, effects: ['fire']});
    const inscribed = advance(restore(compose), 12);
    assert.equal(inscribed.world.holders[attacker].quantities[INSCRIPTION_STOCK], 8);
    const studentPlate = giveBreastplate(inscribed, {from: wearer, to: attacker, armor: plate});
    const fitted = advance(startFireLining(studentPlate, {id: 'note-fit', wearer: attacker, armor: plate, lining: studentBlank}), 15);
    const returned = giveBreastplate(fitted, {from: attacker, to: wearer, armor: plate});
    assert.equal(hit(restore(wearBreastplate(returned, wearer, plate)), 'fire'), 15);
});

test('a paid lesson settles its fee and knowledge once after restore', () => {
    const studentBlank = 'student-lining';
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: lining, property: 'workshop.fire_resistance', value: null},
        {op: 'carry', holder: wearer, quantity: WORKSHOP_COIN, amount: 0},
        {op: 'carry', holder: attacker, quantity: WORKSHOP_COIN, amount: 2},
        {op: 'holder_add', value: {id: studentBlank, kind: 'thing', as: ['heatproof_lining'], place,
            quantities: {[LINING_STOCK]: 1}, properties: {'workshop.held_by': attacker, marks: ['matching-seams']}}},
    ], 'fixture:paid-lesson');
    const tried = advance(startLiningInscription(ready, {id: 'trial', wearer, lining, pattern: ['weave', 'ember', 'veil']}), 3);
    const book = (engine, id) => startPaidLiningLesson(engine, {id, teacher: wearer, student: attacker, effect: 'fire'});
    const pending = book(tried, 'lesson-a');
    const away = applyEngineOps(pending, [{op: 'move', holder: attacker, to: 'hall'}], 'fixture:leave-lesson');
    const cancelled = advance(restore(away), 6);
    const coins = engine => [attacker, wearer].map(body => engine.world.holders[body].quantities[WORKSHOP_COIN]);
    assert.deepEqual(coins(cancelled), [2, 0]);
    assert.deepEqual(recordsOf(cancelled.world, attacker), {});

    const competing = book(pending, 'lesson-b');
    const learned = advance(restore(advance(competing, 4)), 6);
    assert.deepEqual(serializeEngineWorld(learned), serializeEngineWorld(advance(competing, 6)));
    assert.deepEqual(coins(learned), [0, 2]);
    assert.equal(learned.records.workings['lesson-a'].record.status, 'complete');
    assert.equal(learned.records.workings['lesson-b'].record.status, 'interrupted');
    const [lesson] = Object.values(recordsOf(learned.world, attacker));
    assert.equal(lesson.source.by, wearer);

    const compose = startLiningFromTrials(learned, {id: 'apply-lesson', wearer: attacker, lining: studentBlank, effects: ['fire']});
    const inscribed = advance(restore(compose), 9);
    const studentPlate = giveBreastplate(inscribed, {from: wearer, to: attacker, armor: plate});
    const fitted = advance(startFireLining(studentPlate, {id: 'lesson-fit', wearer: attacker, armor: plate, lining: studentBlank}), 12);
    const returned = giveBreastplate(fitted, {from: attacker, to: wearer, armor: plate});
    assert.equal(hit(restore(wearBreastplate(returned, wearer, plate)), 'fire'), 15);
});

test('inscribe, fit, transfer, refit, repair and reclaim the actual parts across save and restore', () => {
    const newPart = 'replacement';
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: lining, quantity: 'condition', amount: 50},
        {op: 'holder_add', value: {id: newPart, kind: 'thing', as: ['heatproof_lining'], place,
            quantities: {[LINING_STOCK]: 1, condition: 100}, properties: {'workshop.held_by': wearer, marks: ['matching-seams']}}},
    ], 'fixture:parts');
    const failed = advance(startLiningInscription(ready, {id: 'discord', wearer, lining: newPart, pattern: ['veil', 'ember']}), 3);
    assert.equal(failed.records.workings.discord.record.status, 'interrupted');
    assert.equal(failed.world.holders[wearer].quantities[INSCRIPTION_STOCK], 8);
    assert.equal(failed.world.holders[newPart].properties['workshop.fire_resistance'], undefined);
    const inscribed = advance(restore(startLiningInscription(failed, {id: 'inscribe', wearer, lining: newPart, pattern: 'fireproof'})), 6);
    assert.equal(inscribed.world.holders[wearer].quantities[INSCRIPTION_STOCK], 5);
    const fitted = wearBreastplate(advance(startFireLining(inscribed, request), 9), wearer, plate);
    assert.deepEqual(wornBreastplateProfile(fitted.world, wearer), {armor: 6, defenseTypes: {fire: .8}});
    const pending = startFireLining(fitted, {...request, id: 'refit', lining: newPart, previous: lining});
    const replaced = advance(restore(pending), 12);
    assert.equal(replaced.world.holders[lining].quantities.condition, 50);
    assert.equal(replaced.world.holders[lining].quantities[LINING_STOCK], 1);
    assert.deepEqual(wornBreastplateProfile(replaced.world, wearer), {armor: 6, defenseTypes: {fire: .6}});
    assert.equal(settleHeatExposure(replaced, {wearer, dose: 20}).engine.world.holders[wearer].quantities.vitality, 84);

    const repaired = advance(startLiningRepair(replaced, {id: 'repair', wearer, lining}), 15);
    assert.equal(repaired.world.holders[wearer].quantities[REPAIR_STOCK], 0);
    assert.equal(repaired.world.holders[lining].quantities.condition, 75);
    const {engine: salvaged, result} = salvageLooseLining(repaired, {wearer, lining});
    assert.deepEqual(result, {reusable: 0, scrap: 1, loss: 0});
    assert.equal(salvaged.world.holders[wearer].quantities[SALVAGE_STOCK], 1);
    assert.throws(() => salvageLooseLining(restore(salvaged), {wearer, lining}), /loose lining/);

    const given = restore(giveBreastplate(salvaged, {from: wearer, to: attacker, armor: plate}));
    assert.deepEqual(wornBreastplateProfile(given.world, wearer), {});
    const worn = wearBreastplate(given, attacker, plate);
    assert.deepEqual(wornBreastplateProfile(worn.world, attacker), {armor: 6, defenseTypes: {fire: .6}});
    const detached = advance(startLiningDetachment(worn, {id: 'detach', wearer: attacker, armor: plate, lining: newPart}), 18);
    assert.deepEqual(wornBreastplateProfile(detached.world, attacker), {armor: 6});
    assert.equal(detached.world.holders[newPart].quantities[LINING_STOCK], 1);
    assert.equal(detached.world.holders[newPart].properties['workshop.held_by'], attacker);
});

test('preparing a ward carrier spends wire once and the finished preparation enables binding after restore', () => {
    const carrier = 'wire-shield';
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: wearer, quantity: WARD_BINDING_STOCK, amount: 2},
        {op: 'holder_add', value: {id: carrier, kind: 'thing', place, properties: {holder: wearer}}},
    ], 'fixture:ward-wire');
    const spec = {id: 'wire-ward', carrier, bearer: wearer, type: 'fire', phase: 'contact', charge: 4, per: 4};
    const prepare = (engine, id) => startWardCarrierPreparation(engine, {id, carrier, bearer: wearer});
    assert.throws(() => bindPreparedGearWard(ready, spec), /prepared carrier/i);
    const pending = prepare(ready, 'a-prepare');
    const moved = applyEngineOps(pending, [{op: 'move', holder: carrier, to: 'hall'}], 'fixture:carrier-moved');
    const stopped = advance(restore(moved), 3);
    assert.equal(stopped.records.workings['a-prepare'].record.status, 'interrupted');
    assert.equal(stopped.world.holders[wearer].quantities[WARD_BINDING_STOCK], 2);

    const competing = prepare(pending, 'b-prepare');
    const prepared = advance(restore(advance(competing, 1)), 3);
    assert.deepEqual(serializeEngineWorld(prepared), serializeEngineWorld(advance(competing, 3)));
    assert.equal(prepared.world.holders[wearer].quantities[WARD_BINDING_STOCK], 1);
    assert.equal(prepared.records.workings['b-prepare'].record.status, 'interrupted');
    const bound = bindPreparedGearWard(restore(prepared), spec);
    assert.throws(() => bindPreparedGearWard(bound, {...spec, id: 'second-binding'}), /prepared carrier/i);
    const worn = wearGearWard(bound, wearer, carrier);
    const impact = settleGearHit(restore(worn), {id: spec.id, wearer, packets: [{type: 'fire', phase: 'contact', amount: 7}]});
    assert.equal(impact.damage, 3);
    assert.equal(impact.engine.records.stored[spec.id].charge.now, 0);
});

test('a contact ward can keep a mixed blow below the threshold for losing balance', () => {
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: wearer, quantity: 'stamina', amount: 10},
        {op: 'holder_add', value: {id: 'shield', kind: 'thing', place, properties: {holder: wearer}}},
    ], 'fixture:impact-ward');
    const bound = bindGearWard(ready, {id: 'impact-ward', carrier: 'shield', bearer: wearer,
        type: 'bludgeoning', phase: 'contact', charge: 4, per: 4});
    const worn = wearGearWard(bound, wearer, 'shield');
    const request = {id: 'impact-ward', wearer, attacker, balanceThreshold: 5, packets: [
        {type: 'bludgeoning', phase: 'contact', amount: 7},
        {type: 'slashing', phase: 'contact', amount: 5},
    ]};
    const plain = settleGearHit(restore(bound), request);
    const protectedHit = settleGearHit(restore(worn), request);
    assert.deepEqual([plain.damage, protectedHit.damage], [12, 8]);
    assert.deepEqual(plain.balance, {impact: 7, staggered: true, staminaLost: 3});
    assert.deepEqual(protectedHit.balance, {impact: 3, staggered: false, staminaLost: 0});
    assert.equal(plain.engine.world.holders[wearer].quantities.stamina, 7);
    assert.equal(protectedHit.engine.records.stored['impact-ward'].charge.now, 0);
    const exhausted = settleGearHit(restore(protectedHit.engine), request);
    assert.equal(exhausted.engine.world.holders[wearer].quantities.stamina, 7);
    assert.deepEqual(exhausted.balance, plain.balance);
    const cut = settleGearHit(restore(worn), {...request, packets: [{type: 'slashing', phase: 'contact', amount: 12}]});
    assert.deepEqual(cut.balance, {impact: 0, staggered: false, staminaLost: 0});
    assert.equal(cut.engine.records.stored['impact-ward'].charge.now, 4);
});

test('a charged insert retains its pulse when refitted into a different bearer’s mount', () => {
    const insert = 'ward-insert', id = 'insert-ward', shield = 'shield', bracer = 'bracer';
    const ready = applyEngineOps(workshop(), [
        [insert, wearer, 'ward-tongue'], [shield, wearer, 'ward-recess'], [bracer, attacker, 'ward-recess'],
        ['wrong', wearer, 'round-recess'],
    ].map(([id, holder, socket]) => ({op: 'holder_add', value: {id, kind: 'thing', place,
        properties: {holder, 'workshop.ward_socket': socket}}})), 'fixture:ward-sockets');
    const bound = bindGearWard(ready, {id, carrier: insert, bearer: wearer, type: 'fire', phase: 'contact', charge: 8, per: 4});
    const work = (engine, id, mount, action, bearer = wearer) => startWardSocketWork(engine, {id, mount, insert, bearer, action});
    const hit = (engine, target = wearer) => settleGearHit(engine, {id, wearer: target,
        packets: [{type: 'fire', phase: 'contact', amount: 7}]});
    assert.throws(() => wearGearWard(bound, wearer, insert), /wear a ward carrier/i);
    const bad = advance(restore(work(bound, 'misfit', 'wrong', 'install')), 3);
    assert.equal(bad.records.workings.misfit.record.status, 'interrupted');
    const installing = work(bad, 'seat', shield, 'install');
    const installed = advance(restore(advance(installing, 4)), 6);
    assert.deepEqual(serializeEngineWorld(installed), serializeEngineWorld(advance(installing, 6)));
    assert.throws(() => giveGearWard(installed, {id, from: wearer, to: attacker}), /separate the ward insert/i);
    const first = hit(restore(wearGearWard(installed, wearer, shield)));
    assert.equal(first.damage, 3);
    const brokenMount = applyEngineOps(first.engine, [{op: 'property', holder: shield, property: 'broken', value: true}], 'fixture:break-mount');
    assert.equal(hit(restore(brokenMount)).damage, 7);
    assert.equal(hit(restore(brokenMount)).engine.records.stored[id].charge.now, 4);
    const detached = advance(restore(work(first.engine, 'remove', shield, 'detach')), 9);
    assert.equal(hit(detached).damage, 7);
    assert.equal(detached.records.stored[id].charge.now, 4);
    const given = giveGearWard(detached, {id, from: wearer, to: attacker});
    const refitted = advance(restore(work(given, 'refit', bracer, 'install', attacker)), 12);
    const equipped = wearGearWard(refitted, attacker, bracer);
    const second = hit(restore(equipped), attacker);
    assert.equal(second.damage, 3);
    assert.equal(second.engine.records.stored[id].charge.now, 0);
    assert.equal(second.engine.records.stored[id].carrier, insert);
    assert.equal(second.engine.records.stored[id].receipts.filter(receipt => receipt.status === 'fired').length, 2);
});

test('a timed handoff transfers the entire worn ward assembly and preserves its attunement', () => {
    const mount = 'shield', insert = 'ward-insert', id = 'personal-ward';
    const ready = applyEngineOps(workshop(), [[mount, 'ward-recess'], [insert, 'ward-tongue']]
        .map(([id, socket]) => ({op: 'holder_add', value: {id, kind: 'thing', place,
            properties: {holder: wearer, 'workshop.ward_socket': socket}}})), 'fixture:ward-assembly');
    const bound = bindGearWard(ready, {id, carrier: insert, bearer: wearer, type: 'fire', phase: 'contact',
        charge: 8, per: 4, attuned: true});
    const fit = startWardSocketWork(bound, {id: 'fit-ward', mount, insert, bearer: wearer, action: 'install'});
    const worn = wearGearWard(advance(fit, 3), wearer, mount);
    const hit = (engine, wearer) => settleGearHit(engine, {id, wearer, packets: [{type: 'fire', phase: 'contact', amount: 7}]});
    const first = hit(worn, wearer);
    assert.equal(first.damage, 3);
    const args = {mount, insert, from: wearer, to: attacker};
    const handoff = startWardAssemblyHandoff(first.engine, {id: 'gift', ...args});
    const pending = advance(handoff, 4);
    const absent = applyEngineOps(pending, [{op: 'move', holder: attacker, to: 'hall'}], 'fixture:absent-recipient');
    const interrupted = advance(restore(absent), 6);
    assert.equal(interrupted.records.workings.gift.record.status, 'interrupted');
    for (const part of [mount, insert]) assert.equal(interrupted.world.holders[part].properties.holder, wearer);
    assert.equal(interrupted.world.holders[wearer].properties['workshop.worn_ward'], mount);
    const detachedFirst = startWardAssemblyHandoff(startWardSocketWork(first.engine,
        {id: 'detach-first', mount, insert, bearer: wearer, action: 'detach'}), {id: 'gift', ...args});
    const separated = advance(restore(detachedFirst), 6);
    assert.equal(separated.records.workings.gift.record.status, 'interrupted');
    for (const part of [mount, insert]) assert.equal(separated.world.holders[part].properties.holder, wearer);

    const given = advance(restore(pending), 6);
    assert.deepEqual(serializeEngineWorld(given), serializeEngineWorld(advance(handoff, 6)));
    const {carrier, anchor, charge, receipts} = given.records.stored[id];
    assert.equal(carrier, insert);
    assert.equal(anchor, first.engine.records.stored[id].anchor);
    assert.deepEqual(charge, first.engine.records.stored[id].charge);
    assert.deepEqual(receipts, first.engine.records.stored[id].receipts);
    for (const part of [mount, insert]) assert.equal(given.world.holders[part].properties.holder, attacker);
    assert.equal(given.world.holders[wearer].properties['workshop.worn_ward'], undefined);
    const equipped = wearGearWard(given, attacker, mount);
    const before = hit(restore(equipped), attacker);
    assert.equal(before.damage, 7);
    assert.equal(before.engine.records.stored[id].charge.now, 4);
    const retuned = attuneGearWard(equipped, {id, bearer: attacker});
    const after = hit(restore(retuned), attacker);
    assert.equal(after.damage, 3);
    assert.equal(after.engine.records.stored[id].charge.now, 0);
});

test('a mounted ward loan returns the same parts with only the unspent charge', () => {
    const mount = 'shield', insert = 'ward-insert', id = 'shared-ward';
    const ready = applyEngineOps(workshop(), [[mount, 'ward-recess'], [insert, 'ward-tongue']]
        .map(([id, socket]) => ({op: 'holder_add', value: {id, kind: 'thing', place,
            properties: {holder: wearer, 'workshop.ward_socket': socket}}})), 'fixture:ward-loan');
    const bound = bindGearWard(ready, {id, carrier: insert, bearer: wearer, type: 'fire', phase: 'contact', charge: 8, per: 4});
    const installed = advance(startWardSocketWork(bound, {id: 'install', mount, insert, bearer: wearer, action: 'install'}), 3);
    const handoff = (engine, id, mode, from, to) => startWardAssemblyHandoff(engine, {id, mount, insert, from, to, mode});
    const loan = handoff(wearGearWard(installed, wearer, mount), 'loan', 'loan', wearer, attacker);
    const lent = advance(restore(advance(loan, 4)), 6);
    assert.deepEqual(serializeEngineWorld(lent), serializeEngineWorld(advance(loan, 6)));
    const hit = (engine, wearer) => settleGearHit(engine, {id, wearer, packets: [{type: 'fire', phase: 'contact', amount: 7}]});
    const used = hit(restore(wearGearWard(lent, attacker, mount)), attacker);
    assert.equal(used.damage, 3);
    assert.equal(used.engine.records.stored[id].charge.now, 4);
    const gifting = handoff(used.engine, 'gift', 'gift', attacker, wearer);
    const tryingDetach = startWardSocketWork(gifting, {id: 'detach', mount, insert, bearer: attacker, action: 'detach'});
    const refused = advance(restore(tryingDetach), 9);
    assert.equal(refused.records.workings.gift.record.status, 'interrupted');
    assert.equal(refused.records.workings.detach.record.status, 'interrupted');
    assert.equal(refused.world.holders[mount].properties['workshop.ward_insert'], insert);
    const returning = handoff(refused, 'return', 'return', attacker, wearer);
    const duplicate = handoff(returning, 'return-again', 'return', attacker, wearer);
    const returned = advance(restore(advance(duplicate, 10)), 12);
    assert.equal(returned.records.workings.return.record.status, 'complete');
    assert.equal(returned.records.workings['return-again'].record.status, 'interrupted');
    for (const part of [mount, insert]) {
        assert.equal(returned.world.holders[part].properties.holder, wearer);
        assert.equal(returned.world.holders[part].properties['workshop.ward_assembly_lender'], undefined);
    }
    assert.equal(returned.world.holders[attacker].properties['workshop.worn_ward'], undefined);
    const finalHit = hit(restore(wearGearWard(returned, wearer, mount)), wearer);
    assert.equal(finalHit.damage, 3);
    assert.equal(finalHit.engine.records.stored[id].charge.now, 0);
});

test('an actual worn ward absorbs only matching harm and credits the intercepted amount through restore', () => {
    const force = 'energy:captured_force';
    const carrier = applyEngineOps(workshop(), [{op: 'holder_add', value: {
        id: 'shield', kind: 'thing', place, properties: {holder: wearer}, quantities: {[force]: 0},
    }}], 'fixture:shield');
    const bound = bindGearWard(carrier, {id: 'ward', carrier: 'shield', bearer: wearer,
        type: 'fire', phase: 'contact', charge: 8, per: 4, conversion: force,
        recharge: {quantity: INSCRIPTION_STOCK, rate: 1}, attuned: true});
    const worn = wearGearWard(bound, wearer, 'shield');
    const request = {id: 'ward', wearer, packets: [
        {type: 'fire', phase: 'contact', amount: 7}, {type: 'slashing', phase: 'contact', amount: 5},
    ]};
    const unworn = settleGearHit(restore(bound), request);
    assert.equal(unworn.damage, 12);
    assert.equal(unworn.engine.records.stored.ward.charge.now, 8);
    const first = settleGearHit(restore(worn), request);
    assert.equal(first.absorbed, 4);
    assert.equal(first.damage, 8);
    assert.equal(first.engine.world.holders[wearer].quantities.vitality, 92);
    assert.equal(first.engine.world.holders[place].quantities.noise, 1);
    assert.equal(first.engine.world.holders.shield.quantities[force], 4);
    assert.equal(first.engine.records.stored.ward.charge.now, 4);
    const second = settleGearHit(restore(first.engine), request);
    const third = settleGearHit(restore(second.engine), request);
    assert.equal(second.damage, 8);
    assert.equal(third.damage, 12);
    assert.equal(third.engine.world.holders.shield.quantities[force], 8);
    assert.equal(third.engine.records.stored.ward.charge.now, 0);
    const release = engine => releaseCapturedForce(restore(engine), {id: 'ward', wearer, target: attacker, amount: 5});
    const released = release(third.engine);
    assert.equal(released.engine.world.holders.shield.quantities[force], 3);
    assert.equal(released.engine.world.holders[attacker].quantities.vitality, 95);
    const screened = applyEngineOps(third.engine, [{op: 'law_add', field: {id: 'force-screen', scope: attacker,
        kind: 'block', params: {verb: 'remove', object: 'vitality'}}}], 'fixture:force-screen');
    const stopped = release(screened);
    assert.equal(stopped.damage, 0);
    assert.deepEqual(serializeEngineWorld(stopped.engine), serializeEngineWorld(screened));

    const fitted = advance(startFireLining(third.engine, {id: 'fit-return-plate', wearer, armor: plate, lining}), 3);
    const lined = wearBreastplate(giveBreastplate(fitted, {from: wearer, to: attacker, armor: plate}), attacker, plate);
    assert.equal(release(lined).damage, 3);
    const receivingWard = 'receiving-ward';
    const stocked = applyEngineOps(lined, [{op: 'holder_add', value: {id: receivingWard, kind: 'thing', place,
        properties: {holder: attacker}, quantities: {[force]: 0}}}], 'fixture:receiving-ward');
    const defended = wearGearWard(bindGearWard(stocked, {id: receivingWard, carrier: receivingWard, bearer: attacker,
        type: 'fire', phase: 'contact', charge: 2, per: 2, conversion: force}), attacker, receivingWard);
    const intercepted = release(defended);
    assert.equal(intercepted.damage, 1);
    assert.equal(intercepted.engine.world.holders.shield.quantities[force], 3);
    assert.equal(intercepted.engine.world.holders[receivingWard].quantities[force], 2);
    assert.equal(intercepted.engine.records.stored[receivingWard].charge.now, 0);
    assert.deepEqual(serializeEngineWorld(intercepted.engine), serializeEngineWorld(restore(intercepted.engine)));
    assert.throws(() => releaseCapturedForce(restore(released.engine), {id: 'ward', wearer, target: attacker, amount: 5}), /stored force/);
    const recharged = maintainGearWard(restore(released.engine), {id: 'ward', bearer: wearer, amount: 4});
    assert.equal(recharged.world.holders[wearer].quantities[INSCRIPTION_STOCK], 6);
    assert.equal(settleGearHit(restore(recharged), request).damage, 8);
    const given = giveGearWard(recharged, {id: 'ward', from: wearer, to: attacker});
    assert.equal(given.world.holders[wearer].properties['workshop.worn_ward'], undefined);
    const newBearer = wearGearWard(restore(given), attacker, 'shield');
    assert.equal(settleGearHit(newBearer, {...request, wearer: attacker}).damage, 12);
    const attuned = attuneGearWard(newBearer, {id: 'ward', bearer: attacker});
    assert.equal(settleGearHit(restore(attuned), {...request, wearer: attacker}).damage, 8);
});

test('handing off a ward preserves its decay clock and the new owner can pay to recharge it', () => {
    const carrier = 'shield', id = 'fading-ward';
    const ready = applyEngineOps(workshop(), [{op: 'holder_add', value: {
        id: carrier, kind: 'thing', place, properties: {holder: wearer},
    }}], 'fixture:fading-shield');
    const bound = bindGearWard(ready, {id, carrier, bearer: wearer, type: 'fire', phase: 'contact',
        charge: 6, per: 4, decay: {every: 2, amount: 1}, recharge: {quantity: INSCRIPTION_STOCK, rate: 1}});
    const worn = wearGearWard(bound, wearer, carrier);
    const give = engine => giveGearWard(engine, {id, from: wearer, to: attacker});
    const far = applyEngineOps(worn, [{op: 'move', holder: attacker, to: 'hall'}], 'fixture:recipient-away');
    assert.throws(() => give(far), /together/);
    const given = restore(give(advance(worn, 3)));
    const equipped = wearGearWard(given, attacker, carrier);
    const hit = engine => settleGearHit(engine, {id, wearer: attacker, packets: [{type: 'fire', phase: 'contact', amount: 7}]});
    assert.equal(hit(advance(equipped, 5)).damage, 3);
    const faded = restore(advance(equipped, 6));
    const unguarded = hit(faded);
    assert.equal(unguarded.damage, 7);
    assert.equal(unguarded.engine.records.stored[id].receipts.length, 0);
    assert.throws(() => maintainGearWard(faded, {id, bearer: wearer, amount: 1}), /hold the carrier/i);
    const renewed = maintainGearWard(faded, {id, bearer: attacker, amount: 1});
    assert.equal(renewed.world.holders[attacker].quantities[INSCRIPTION_STOCK], 9);
    const after = hit(restore(renewed));
    assert.equal(after.damage, 3);
    assert.equal(after.engine.records.stored[id].charge.now, 0);
    assert.deepEqual(serializeEngineWorld(after.engine), serializeEngineWorld(hit(renewed).engine));
});

test('a physical copy keeps its own carrier and cost, and appraisal discloses only to its observer', () => {
    const source = 'marked', target = 'copy';
    const ready = applyEngineOps(workshop(), [source, target].map(id => ({op: 'holder_add', value: {
        id, kind: 'thing', as: ['heatproof_lining'], place, quantities: {[LINING_STOCK]: 1},
        properties: {'workshop.held_by': wearer, marks: ['matching-seams']},
    }})), 'fixture:blanks');
    const marked = advance(startLiningInscription(ready, {id: 'mark', wearer, lining: source, pattern: ['ember', 'weave']}), 3);
    const copied = advance(restore(startLiningCopy(marked, {id: 'copy', wearer, lining: target, source})), 6);
    assert.equal(copied.records.workings.copy.record.receipts[0].observed.source, source);
    assert.equal(copied.world.holders[wearer].quantities[INSCRIPTION_STOCK], 6);
    assert.deepEqual(copied.world.holders[source], marked.world.holders[source]);
    const checked = restore(appraiseLining(copied, {observer: attacker, lining: target}));
    assert.equal(knownLiningResistance(checked.world, attacker, target), 40);
    assert.equal(knownLiningResistance(checked.world, wearer, target), undefined);
    const worn = wearBreastplate(advance(startFireLining(checked, {...request, lining: target}), 9), wearer, plate);
    assert.equal(hit(worn, 'fire'), 15);
    assert.equal(settleHeatExposure(worn, {wearer, dose: 20}).damage, 20, 'the copied two-mark pattern has no insulation');
});

test('borrowed armor carries its installed lining through a hot route and returns intact', () => {
    const insulated = applyEngineOps(workshop(), [
        {op: 'property', holder: lining, property: 'workshop.heat_insulation', value: 20},
    ], 'fixture:insulation');
    const fitted = advance(startFireLining(insulated, request), 3);
    const lend = {from: wearer, to: attacker, armor: plate};
    const borrowed = restore(lendBreastplate(fitted, lend));
    assert.throws(() => giveBreastplate(borrowed, {from: attacker, to: wearer, armor: plate}), /lender/);
    const detach = startLiningDetachment(borrowed, {id: 'detach-borrowed', wearer: attacker, armor: plate, lining});
    assert.equal(advance(detach, 6).records.workings['detach-borrowed'].record.status, 'interrupted');

    const route = {wearer: attacker, link: 'kiln-walk'};
    const plain = crossHeatedLink(borrowed, route);
    const worn = wearBreastplate(borrowed, attacker, plate);
    const crossing = crossHeatedLink(restore(worn), route);
    assert.deepEqual([plain.damage, crossing.damage, crossing.crossed, crossing.engine.world.clock], [20, 16, true, 7]);
    assert.equal(crossing.engine.world.holders[attacker].quantities.vitality, 84);
    for (const id of [plate, lining, attacker]) assert.equal(crossing.engine.world.holders[id].place, 'hall');
    const closed = applyEngineOps(worn, [{op: 'link_set', id: route.link, state: 'closed'}], 'fixture:close');
    assert.throws(() => crossHeatedLink(closed, route), /open heated path/);

    const back = crossHeatedLink(restore(crossing.engine), route);
    const returned = restore(returnBreastplate(back.engine, {from: attacker, to: wearer, armor: plate}));
    assert.deepEqual(wornBreastplateProfile(returned.world, attacker), {});
    assert.deepEqual(wornBreastplateProfile(wearBreastplate(returned, wearer, plate).world, wearer),
        {armor: 6, defenseTypes: {fire: .6}});
    assert.equal(returned.world.holders[lining].quantities[LINING_STOCK], 0);
    assert.equal(returned.world.holders[plate].properties['workshop.lender'], undefined);
});

test('abrasion on a hot route wears the installed part and changes the next crossing after restore', () => {
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: lining, property: 'workshop.heat_insulation', value: 20},
        {op: 'carry', holder: lining, quantity: 'condition', amount: 100},
        {op: 'property', holder: 'hall', property: 'workshop.route_lining_wear', value: 50},
    ], 'fixture:abrasive-route');
    const fitted = wearBreastplate(advance(startFireLining(ready, request), 3), wearer, plate);
    const route = {wearer, link: 'kiln-walk'};
    const first = crossHeatedLink(fitted, route);
    assert.equal(first.damage, 16);
    assert.equal(first.engine.world.holders[lining].quantities.condition, 50);
    const back = crossHeatedLink(restore(first.engine), route);
    assert.equal(back.damage, 18);
    assert.deepEqual(wornBreastplateProfile(back.engine.world, wearer), {armor: 6, defenseTypes: {fire: .8}});
});

test('a crossing restored mid-route applies heat with the protection and conditions at each minute', () => {
    const ready = applyEngineOps(workshop(), [{op: 'property', holder: lining,
        property: 'workshop.heat_insulation', value: 20}], 'fixture:insulation');
    const worn = wearBreastplate(advance(startFireLining(ready, request), 3), wearer, plate);
    const route = {wearer, link: 'kiln-walk'};
    const begin = engine => ({engine, crossing: beginHeatedCrossing(engine, route)});
    const step = ({engine, crossing}) => stepHeatedCrossing(engine, crossing);
    const finish = state => {
        while (state.crossing) state = step(state);
        return state;
    };
    const forecast = engine => forecastHeatedCrossing(engine, route);
    assert.deepEqual(forecast(worn), {known: false});
    const scouted = restore(surveyHeatedLink(worn, route));
    assert.deepEqual(forecast(scouted), {known: false});
    const known = restore(appraiseLining(scouted, {observer: wearer, lining}));
    assert.deepEqual(forecast(known), {known: true, minutes: 4, dose: 20, damage: 16, routeObservedAt: 3, liningObservedAt: 3});
    assert.equal(finish(begin(known)).damage, forecast(known).damage);
    assert.deepEqual(forecast(finish(begin(known)).engine), {known: false});
    const stoked = applyEngineOps(advance(known, 4), [{op: 'property', holder: 'hall',
        property: 'workshop.route_heat', value: 10}], 'fixture:stoke-after-survey');
    assert.equal(forecast(stoked).damage, 16);
    const refreshed = restore(surveyHeatedLink(stoked, route));
    assert.equal(forecast(refreshed).routeObservedAt, 4);
    assert.equal(forecast(refreshed).damage, 32);
    assert.equal(finish(begin(refreshed)).damage, 32);
    assert.equal(finish(begin(worn)).damage, 16);
    const mild = applyEngineOps(worn, [{op: 'property', holder: 'hall',
        property: 'workshop.route_heat', value: 1}], 'fixture:mild-route');
    assert.equal(finish(begin(mild)).damage, 3);

    const pending = startBreastplateRemoval(worn, {id: 'route-removal', wearer, armor: plate});
    const midway = step(step(begin(pending)));
    assert.equal(midway.damage, 8);
    const resumed = {engine: restore(midway.engine), crossing: JSON.parse(JSON.stringify(midway.crossing))};
    const result = finish(resumed);
    assert.equal(result.crossed, true);
    assert.equal(result.damage, 18);
    assert.equal(result.engine.world.holders[wearer].quantities.vitality, 82);
    for (const id of [wearer, plate, lining]) assert.equal(result.engine.world.holders[id].place, 'hall');
    assert.deepEqual(serializeEngineWorld(result.engine), serializeEngineWorld(finish(begin(pending)).engine));

    const hotter = applyEngineOps(resumed.engine, [{op: 'property', holder: 'hall',
        property: 'workshop.route_heat', value: 10}], 'fixture:kiln-stoked');
    assert.equal(finish({...resumed, engine: hotter}).damage, 28);
    const closed = applyEngineOps(resumed.engine, [{op: 'link_set', id: route.link, state: 'closed'}], 'fixture:close');
    const stopped = step({...resumed, engine: closed});
    assert.equal(stopped.crossed, false);
    assert.equal(stopped.crossing, null);
    assert.equal(stopped.damage, 8);
    assert.equal(stopped.engine.world.holders[wearer].place, place);
});

test('an exposure ward spends its pulses on route heat and arrives with its exact mounted insert', () => {
    const id = 'heat-ward', mount = 'shield', insert = 'insert', force = 'energy:captured_heat';
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: lining, property: 'workshop.heat_insulation', value: 20},
        {op: 'holder_add', value: {id: mount, kind: 'thing', place,
            properties: {holder: wearer, 'workshop.ward_socket': 'ward-recess'}}},
        {op: 'holder_add', value: {id: insert, kind: 'thing', place,
            properties: {holder: wearer, 'workshop.ward_socket': 'ward-tongue'}, quantities: {[force]: 0}}},
    ], 'fixture:heat-ward');
    const lined = wearBreastplate(advance(startFireLining(ready, request), 3), wearer, plate);
    const fitted = advance(startWardSocketWork(lined, {id: 'seat', mount, insert, bearer: wearer, action: 'install'}), 6);
    const equip = (phase, decay) => wearGearWard(bindGearWard(fitted, {id, carrier: insert, bearer: wearer, type: 'fire', phase,
        charge: 8, per: 4, conversion: force, decay}), wearer, mount);
    const route = {wearer, link: 'kiln-walk'};
    const first = engine => stepWardedHeatedCrossing(engine, beginHeatedCrossing(engine, route));
    const finish = state => {
        while (state.crossing) state = stepWardedHeatedCrossing(state.engine, state.crossing);
        return state;
    };
    const control = finish(first(equip('contact')));
    assert.equal(control.damage, 16);
    assert.equal(control.engine.records.stored[id].charge.now, 8);

    const forecast = engine => forecastWardedHeatedCrossing(engine, {...route, id});
    const survey = engine => appraiseLining(surveyHeatedLink(engine, route), {observer: wearer, lining});
    const inspect = engine => restore(appraiseWardCharge(survey(engine), {id, observer: wearer}));
    const steady = survey(equip('exposure'));
    assert.deepEqual(forecast(steady), {known: false});
    const known = inspect(steady);
    assert.deepEqual(forecast(known), {known: true, minutes: 4, dose: 20, damage: 8,
        routeObservedAt: 6, liningObservedAt: 6, elapsed: 4, chargeSpent: 8, remaining: 0, wardObservedAt: 6});
    const fading = inspect(equip('exposure', {every: 2, amount: 1}));
    const faded = finish(first(fading));
    assert.equal(forecast(fading).damage, 12);
    assert.equal(forecast(fading).chargeSpent, 4);
    assert.equal(forecast(fading).remaining, 2);
    assert.equal(faded.damage, forecast(fading).damage);

    const started = first(equip('exposure'));
    assert.equal(started.damage, 0);
    assert.equal(started.engine.records.stored[id].charge.now, 4);
    const crossing = JSON.parse(JSON.stringify(started.crossing));
    const result = finish({engine: restore(started.engine), crossing});
    assert.equal(result.crossed, true);
    assert.equal(result.damage, 8);
    assert.equal(result.engine.records.stored[id].charge.now, 0);
    assert.equal(result.engine.world.holders[insert].quantities[force], 8);
    assert.equal(result.engine.world.holders[wearer].quantities.vitality, 92);
    for (const item of [wearer, mount, insert, plate, lining])
        assert.equal(result.engine.world.holders[item].place, 'hall');
    assert.deepEqual(serializeEngineWorld(result.engine), serializeEngineWorld(finish(started).engine));
    assert.deepEqual(serializeEngineWorld(restore(result.engine)), serializeEngineWorld(result.engine));

    const fragile = applyEngineOps(equip('exposure'), [{op: 'property', holder: mount,
        property: WARD_MOUNT_STRENGTH, value: 4}], 'fixture:fragile-mount');
    const broken = finish(first(fragile));
    assert.equal(forecast(inspect(fragile)).damage, broken.damage);
    assert.equal(broken.damage, 12);
    assert.equal(broken.engine.world.holders[mount].properties.broken, true);
    assert.equal(broken.engine.world.holders[insert].place, 'hall');
    assert.equal(broken.engine.records.stored[id].charge.now, 4);

    const closed = applyEngineOps(started.engine, [{op: 'link_set', id: route.link, state: 'closed'}], 'fixture:close');
    const stopped = finish({engine: restore(closed), crossing});
    assert.equal(stopped.crossed, false);
    assert.equal(stopped.engine.records.stored[id].charge.now, 4);
    for (const item of [wearer, mount, insert]) assert.equal(stopped.engine.world.holders[item].place, place);
});

test('reflection and conversion divide one intercepted hit and spend one charge across restore', () => {
    const force = 'energy:captured_force', carrier = 'shield';
    const ready = applyEngineOps(workshop(), [{op: 'holder_add', value: {
        id: carrier, kind: 'thing', place, properties: {holder: wearer}, quantities: {[force]: 0},
    }}], 'fixture:reflecting-shield');
    const ward = bindGearWard(ready, {id: 'mirror', carrier, bearer: wearer, type: 'fire', phase: 'contact',
        charge: 8, per: 4, conversion: force, reflectPercent: 50});
    const worn = wearGearWard(ward, wearer, carrier);
    const hit = {id: 'mirror', wearer, attacker, packets: [{type: 'fire', phase: 'contact', amount: 7}]};
    const first = settleGearHit(restore(worn), hit);
    assert.equal(first.absorbed, 4);
    assert.equal(first.reflected, 2);
    assert.equal(first.damage, 3);
    assert.equal(first.engine.world.holders[attacker].quantities.vitality, 98);
    assert.equal(first.engine.world.holders[carrier].quantities[force], 2);
    assert.equal(first.engine.records.stored.mirror.charge.now, 4);
    const outOfReach = applyEngineOps(restore(first.engine), [{op: 'move', holder: attacker, to: 'hall'}], 'fixture:attacker-leaves');
    const second = settleGearHit(outOfReach, hit);
    assert.equal(second.reflected, 0);
    assert.equal(second.engine.world.holders[attacker].quantities.vitality, 98);
    assert.equal(second.engine.world.holders[carrier].quantities[force], 6);
    assert.equal(second.engine.records.stored.mirror.charge.now, 0);
});

test('reflected fire meets the attacker’s fitted protection without feeding the ward twice', () => {
    const carrier = 'shield', id = 'reflector', force = 'energy:captured_force';
    const ready = applyEngineOps(workshop(), [{op: 'holder_add', value: {
        id: carrier, kind: 'thing', place, properties: {holder: wearer}, quantities: {[force]: 0},
    }}], 'fixture:reflector');
    const fitted = advance(startFireLining(ready, request), 3);
    const given = giveBreastplate(fitted, {from: wearer, to: attacker, armor: plate});
    const bound = bindGearWard(given, {id, carrier, bearer: wearer, type: 'fire', phase: 'contact',
        charge: 8, per: 8, conversion: force, reflectPercent: 50});
    const worn = wearGearWard(bound, wearer, carrier);
    const protectedAttacker = wearBreastplate(worn, attacker, plate);
    const hit = engine => settleGearHit(engine, {id, wearer, attacker, packets: [
        {type: 'fire', phase: 'contact', amount: 10}, {type: 'slashing', phase: 'contact', amount: 5},
    ]});
    const bare = hit(worn);
    const lined = hit(restore(protectedAttacker));
    assert.deepEqual([bare.redirected, bare.reflected, lined.redirected, lined.reflected], [4, 4, 4, 2]);
    for (const impact of [bare, lined]) {
        assert.equal(impact.damage, 7);
        assert.equal(impact.engine.records.stored[id].charge.now, 0);
        assert.equal(impact.engine.world.holders[carrier].quantities[force], 4);
    }
    assert.equal(lined.engine.world.holders[attacker].quantities.vitality, 98);
    assert.equal(lined.engine.world.holders[attacker].ledger.vitality['workshop:reflected-by:shield'], -2);
    assert.deepEqual(serializeEngineWorld(lined.engine), serializeEngineWorld(hit(protectedAttacker).engine));

    const counter = 'return-shield';
    const stocked = applyEngineOps(protectedAttacker, [{op: 'holder_add', value: {
        id: counter, kind: 'thing', place, properties: {holder: attacker}, quantities: {[force]: 0},
    }}], 'fixture:return-shield');
    const both = wearGearWard(bindGearWard(stocked, {id: counter, carrier: counter, bearer: attacker,
        type: 'fire', phase: 'contact', charge: 2, per: 1, conversion: force, reflectPercent: 100}), attacker, counter);
    const intercepted = hit(restore(both));
    assert.deepEqual([intercepted.redirected, intercepted.returnAbsorbed, intercepted.reflected, intercepted.damage], [4, 1, 1, 7]);
    assert.equal(intercepted.engine.world.holders[attacker].quantities.vitality, 99);
    assert.equal(intercepted.engine.world.holders[counter].quantities[force], 1);
    assert.equal(intercepted.engine.world.holders[carrier].quantities[force], 4);
    assert.equal(intercepted.engine.records.stored[counter].charge.now, 1);
    assert.equal(intercepted.engine.records.stored[id].charge.now, 0);
    assert.deepEqual(serializeEngineWorld(intercepted.engine), serializeEngineWorld(hit(both).engine));

    const screened = applyEngineOps(both, [{op: 'law_add', field: {id: 'return-screen', scope: attacker,
        kind: 'block', params: {verb: 'remove', object: 'vitality'}}}], 'fixture:return-screen');
    const stopped = hit(restore(screened));
    assert.deepEqual([stopped.redirected, stopped.returnAbsorbed, stopped.reflected, stopped.damage], [4, 0, 0, 7]);
    assert.equal(stopped.engine.world.holders[attacker].quantities.vitality, 100);
    assert.equal(stopped.engine.world.holders[counter].quantities[force], 0);
    assert.equal(stopped.engine.records.stored[counter].charge.now, 2);
    assert.equal(stopped.engine.world.holders[carrier].quantities[force], 4);
    assert.equal(stopped.engine.records.stored[id].charge.now, 0);
    assert.deepEqual(serializeEngineWorld(stopped.engine), serializeEngineWorld(hit(screened).engine));
});

test('a saved spell in flight meets the live lining and ward through the engine host', () => {
    const carrier = 'spell-shield', id = 'spell-ward';
    const ready = applyEngineOps(workshop(), [
        {op: 'holder_add', value: {id: carrier, kind: 'thing', place, properties: {holder: wearer}}},
        {op: 'holder_add', value: {id: 'wand', kind: 'thing', place, as: ['implement'], properties: {marks: [`grip:${attacker}`]}}},
    ], 'fixture:fire-cast');
    const fitted = advance(startFireLining(ready, request), 3);
    const worn = wearBreastplate(fitted, wearer, plate);
    const bound = bindGearWard(worn, {id, carrier, bearer: wearer, type: 'fire', phase: 'contact', charge: 8, per: 4});
    const start = (engine, damageType) => startEngineWorking(engine, {id: 'incoming-spell', payer: attacker,
        ...spellEffectMethod([{sentence: {verb: 'remove', object: 'vitality', target: 'creature', time: 'instant', carrier: 'wand'},
            target: {id: wearer}, grip: {caster: attacker, implement: 'wand'}, contact: {links: 0}, minutes: 1, flightMinutes: 2,
            details: {amount: 10, damageType}}])});
    const pending = advance(start(bound, 'fire'), 4);
    const equipped = wearGearWard(pending, wearer, carrier);
    const result = advance(restore(equipped), 6);
    const vitality = engine => engine.world.holders[wearer].quantities.vitality;
    assert.equal(vitality(result), 98);
    assert.equal(result.records.stored[id].charge.now, 4);
    assert.equal(vitality(advance(restore(pending), 6)), 94);
    assert.equal(vitality(advance(restore(wearBreastplate(pending, wearer)), 6)), 90);
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(equipped, 6)));
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(restore(result), 6)));

    const adjust = (engine, action) => startWardWearWork(engine, {id: 'adjust-ward', mount: carrier, bearer: wearer, action});
    const fitting = adjust(advance(start(bound, 'fire'), 3), 'wear');
    const fittingSaved = advance(fitting, 4);
    const protectedHit = advance(restore(fittingSaved), 6);
    assert.equal(vitality(protectedHit), 98);
    assert.equal(protectedHit.records.stored[id].charge.now, 4);
    assert.deepEqual(serializeEngineWorld(protectedHit), serializeEngineWorld(advance(fitting, 6)));
    const takenOff = adjust(advance(start(wearGearWard(bound, wearer, carrier), 'fire'), 3), 'unwear');
    const exposedHit = advance(restore(advance(takenOff, 4)), 6);
    assert.equal(vitality(exposedHit), 94);
    assert.equal(exposedHit.records.stored[id].charge.now, 8);
    assert.deepEqual(serializeEngineWorld(exposedHit), serializeEngineWorld(advance(takenOff, 6)));

    const handedOff = giveGearWard(fittingSaved, {id, from: wearer, to: attacker});
    const interrupted = advance(restore(handedOff), 6);
    assert.equal(interrupted.records.workings['adjust-ward'].record.status, 'interrupted');
    assert.equal(vitality(interrupted), 94);
    assert.equal(interrupted.records.stored[id].charge.now, 8);

    const cut = advance(restore(start(wearGearWard(bound, wearer, carrier), 'slashing')), 6);
    assert.equal(vitality(cut), 90);
    assert.equal(cut.records.stored[id].charge.now, 8);
    const screened = applyEngineOps(equipped, [{op: 'law_add', field: {id: 'screen', scope: wearer,
        kind: 'block', params: {verb: '*', object: 'spell-contact'}}}], 'fixture:screen');
    const stopped = advance(restore(screened), 6);
    assert.equal(vitality(stopped), 100);
    assert.equal(stopped.records.stored[id].charge.now, 8);
});

test('a saved ward swap changes which insert intercepts an incoming spell', () => {
    const mount = 'shield', insert = 'cut-insert', replacement = 'fire-insert';
    const ready = applyEngineOps(workshop(), [
        ...[[mount, 'ward-recess'], [insert, 'ward-tongue'], [replacement, 'ward-tongue']].map(([id, socket]) =>
            ({op: 'holder_add', value: {id, kind: 'thing', place, properties: {holder: wearer, 'workshop.ward_socket': socket}}})),
        {op: 'holder_add', value: {id: 'wand', kind: 'thing', place, as: ['implement'], properties: {marks: [`grip:${attacker}`]}}},
    ], 'fixture:ward-swap');
    const bind = (engine, carrier, type) => bindGearWard(engine, {id: carrier, carrier, bearer: wearer,
        type, phase: 'contact', charge: 8, per: 4});
    const bound = bind(bind(ready, insert, 'slashing'), replacement, 'fire');
    const fitted = advance(startWardSocketWork(bound, {id: 'fit-ward', mount, insert, bearer: wearer, action: 'install'}), 3);
    const worn = wearGearWard(fitted, wearer, mount);
    const casting = startEngineWorking(worn, {id: 'incoming', payer: attacker, ...spellEffectMethod([{
        sentence: {verb: 'remove', object: 'vitality', target: 'creature', time: 'instant', carrier: 'wand'},
        target: {id: wearer}, grip: {caster: attacker, implement: 'wand'}, contact: {links: 0}, minutes: 1, flightMinutes: 3,
        details: {amount: 7, damageType: 'fire'},
    }])});
    const swap = (engine, id) => startWardInsertSwap(engine, {id, mount, insert, replacement, bearer: wearer});
    const jobs = swap(swap(casting, 'swap'), 'swap-again');
    const inFlight = advance(jobs, 5);
    const stats = engine => [engine.world.holders[wearer].quantities.vitality,
        engine.records.stored[insert].charge.now, engine.records.stored[replacement].charge.now];
    const result = advance(restore(inFlight), 7);
    assert.deepEqual(stats(result), [97, 8, 4]);
    assert.equal(result.records.workings['swap-again'].record.status, 'interrupted');
    assert.equal(result.world.holders[mount].properties['workshop.ward_insert'], replacement);
    assert.equal(result.world.holders[insert].properties['workshop.ward_seated_in'], undefined);
    assert.equal(result.world.holders[insert].properties.holder, wearer);
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(jobs, 7)));
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(restore(result), 7)));

    const moved = applyEngineOps(inFlight, [{op: 'move', holder: replacement, to: 'hall'}], 'fixture:move-replacement');
    const misfit = applyEngineOps(inFlight, [{op: 'property', holder: replacement,
        property: 'workshop.ward_socket', value: 'round-tongue'}], 'fixture:wrong-fit');
    for (const interrupted of [moved, misfit]) {
        const failed = advance(restore(interrupted), 7);
        assert.deepEqual(stats(failed), [93, 8, 8]);
        assert.equal(failed.records.workings.swap.record.status, 'interrupted');
        assert.equal(failed.world.holders[mount].properties['workshop.ward_insert'], insert);
    }
});

test('an area spell checks the actual protection of each admitted target after restore', () => {
    const id = 'area-ward', carrier = 'shield';
    const ready = applyEngineOps(workshop(), [
        {op: 'holder_add', value: {id: carrier, kind: 'thing', place, properties: {holder: wearer}}},
        {op: 'holder_add', value: {id: 'sheltered', kind: 'body', place, quantities: {vitality: 100}}},
        {op: 'law_add', field: {id: 'screen', scope: 'sheltered', kind: 'block', params: {verb: 'remove', object: 'vitality'}}},
    ], 'fixture:area-targets');
    const areaConfig = {...config, host: {...config.host, things: {[`area:${place}`]: {}}}};
    const load = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), areaConfig);
    const lined = wearBreastplate(advance(startFireLining(ready, request), 3), wearer, plate);
    const bound = bindGearWard(lined, {id, carrier, bearer: wearer, type: 'fire', phase: 'contact', charge: 8, per: 4});
    const start = details => startEngineWorking(load(bound), {id: 'burst', ...spellEffectMethod([{
        sentence: {verb: 'remove', object: 'vitality', target: 'area', time: 'instant', carrier: 'wand'},
        target: {id: place}, minutes: 2, details: {target: {shape: 'present', place}, ...details},
    }])});
    const readyAt = advance(start({amount: 10, damageType: 'fire'}), 4);
    const equipped = wearGearWard(readyAt, wearer, carrier);
    const landed = advance(load(equipped), 5);
    const vitality = engine => [wearer, attacker, 'sheltered'].map(id => engine.world.holders[id].quantities.vitality);
    assert.deepEqual(vitality(landed), [98, 90, 100]);
    assert.equal(landed.records.stored[id].charge.now, 4);
    assert.deepEqual(vitality(advance(load(readyAt), 5)), [94, 90, 100]);
    assert.deepEqual(serializeEngineWorld(landed), serializeEngineWorld(advance(equipped, 5)));
    assert.deepEqual(serializeEngineWorld(landed), serializeEngineWorld(advance(load(landed), 5)));

    const mixed = damagePackets => {
        const pending = advance(start({amount: 12, damagePackets}), 4);
        const ready = wearGearWard(pending, wearer, carrier);
        const landed = advance(load(ready), 5);
        assert.deepEqual(serializeEngineWorld(landed), serializeEngineWorld(advance(ready, 5)));
        assert.deepEqual(serializeEngineWorld(landed), serializeEngineWorld(advance(load(landed), 5)));
        return landed;
    };
    const fire = {type: 'fire', phase: 'contact'};
    const cut = {type: 'slashing', phase: 'contact', amount: 5};
    const split = mixed([{...fire, amount: 1}, cut, {...fire, amount: 6}]);
    assert.deepEqual(vitality(split), [95, 88, 100]);
    assert.equal(split.records.stored[id].charge.now, 4);
    assert.deepEqual(vitality(mixed([{...fire, amount: 7}, cut])), vitality(split));

    const laterFire = mixed([{...fire, amount: 1}, cut, {...fire, phase: 'after', amount: 6}]);
    assert.deepEqual(vitality(laterFire), [91, 88, 100]);
    assert.equal(laterFire.records.stored[id].charge.now, 4);

    const invalid = mixed([{...fire, amount: 6}, cut]);
    assert.deepEqual(vitality(invalid), [88, 88, 100]);
    assert.equal(invalid.records.stored[id].charge.now, 8);
});

test('a ward charge appraisal forecasts contact on either side of a decay boundary', () => {
    const carrier = 'shield', id = 'fading-ward';
    const ready = applyEngineOps(workshop(), [
        {op: 'holder_add', value: {id: carrier, kind: 'thing', place, properties: {holder: wearer}}},
        {op: 'holder_add', value: {id: 'wand', kind: 'thing', place, as: ['implement'], properties: {marks: [`grip:${attacker}`]}}},
    ], 'fixture:fading-impact');
    const bound = bindGearWard(ready, {id, carrier, bearer: wearer, type: 'fire', phase: 'contact',
        charge: 6, per: 4, decay: {every: 2, amount: 1}, recharge: {quantity: INSCRIPTION_STOCK, rate: 1}});
    const worn = wearGearWard(bound, wearer, carrier);
    const forecast = (engine, at, observer = wearer, type = 'fire') =>
        forecastWardCharge(engine.world, {id, observer, at, type, phase: 'contact'});
    assert.deepEqual(forecast(worn, 5), {known: false});
    const seen = restore(appraiseWardCharge(advance(worn, 2), {id, observer: wearer}));
    assert.deepEqual(forecast(seen, 5, attacker), {known: false});
    assert.deepEqual(forecast(seen, 5), {known: true, observedAt: 2, remaining: 4, canPay: true});
    assert.equal(forecast(seen, 5, wearer, 'slashing').canPay, false);
    assert.deepEqual(forecast(seen, 6), {known: true, observedAt: 2, remaining: 3, canPay: false});
    assert.equal(seen.records.stored[id].receipts.length, 0);
    const spell = (engine, flightMinutes) => startEngineWorking(engine, {id: 'incoming', payer: attacker,
        ...spellEffectMethod([{sentence: {verb: 'remove', object: 'vitality', target: 'creature', time: 'instant', carrier: 'wand'},
            target: {id: wearer}, grip: {caster: attacker, implement: 'wand'}, contact: {links: 0}, minutes: 1, flightMinutes,
            details: {amount: 7, damageType: 'fire'}}])});
    const early = advance(restore(advance(spell(seen, 2), 4)), 5);
    const late = advance(restore(advance(spell(seen, 3), 4)), 6);
    assert.equal(early.world.holders[wearer].quantities.vitality, 97);
    assert.equal(early.records.stored[id].charge.now, 0);
    assert.equal(late.world.holders[wearer].quantities.vitality, 93);
    assert.equal(late.records.stored[id].receipts.length, 0);
    const refilled = maintainGearWard(late, {id, bearer: wearer, amount: 1});
    const rechecked = restore(appraiseWardCharge(refilled, {id, observer: wearer}));
    assert.equal(forecast(refilled, 6).canPay, false);
    assert.deepEqual(forecast(rechecked, 6), {known: true, observedAt: 6, remaining: 4, canPay: true});
});

test('a saved blunt spell can drain stamina at contact unless a live ward absorbs enough impact', () => {
    const carrier = 'spell-shield', id = 'impact-ward';
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: wearer, quantity: 'stamina', amount: 10},
        {op: 'property', holder: wearer, property: BALANCE_THRESHOLD, value: 5},
        {op: 'holder_add', value: {id: carrier, kind: 'thing', place, properties: {holder: wearer}}},
        {op: 'holder_add', value: {id: 'wand', kind: 'thing', place, as: ['implement'], properties: {marks: [`grip:${attacker}`]}}},
    ], 'fixture:blunt-cast');
    const bound = bindGearWard(ready, {id, carrier, bearer: wearer, type: 'bludgeoning', phase: 'contact', charge: 4, per: 4});
    const pending = startEngineWorking(bound, {id: 'incoming-impact', payer: attacker,
        ...spellEffectMethod([{sentence: {verb: 'remove', object: 'vitality', target: 'creature', time: 'instant', carrier: 'wand'},
            target: {id: wearer}, grip: {caster: attacker, implement: 'wand'}, contact: {links: 0}, minutes: 1, flightMinutes: 2,
            details: {amount: 7, damageType: 'bludgeoning'}}])});
    const inFlight = advance(pending, 1);
    const plain = advance(restore(inFlight), 3);
    const equipped = wearGearWard(inFlight, wearer, carrier);
    const warded = advance(restore(equipped), 3);
    const stats = engine => {
        const {vitality, stamina} = engine.world.holders[wearer].quantities;
        return [vitality, stamina, engine.records.stored[id].charge.now];
    };
    assert.deepEqual(stats(plain), [93, 7, 4]);
    assert.deepEqual(stats(warded), [97, 10, 0]);
    assert.deepEqual(serializeEngineWorld(warded), serializeEngineWorld(advance(equipped, 3)));
    assert.deepEqual(serializeEngineWorld(warded), serializeEngineWorld(advance(restore(warded), 3)));
});

test('a reflected blunt spell staggers the caster when enough contact force gets through', () => {
    const mirror = 'blunt-mirror', counter = 'blunt-counter';
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: attacker, quantity: 'stamina', amount: 10},
        {op: 'property', holder: attacker, property: BALANCE_THRESHOLD, value: 5},
        ...[[mirror, wearer], [counter, attacker]].map(([id, holder]) => ({
            op: 'holder_add', value: {id, kind: 'thing', place, properties: {holder}},
        })),
        {op: 'holder_add', value: {id: 'wand', kind: 'thing', place, as: ['implement'], properties: {marks: [`grip:${attacker}`]}}},
    ], 'fixture:blunt-reflection');
    const bind = (engine, id, bearer, per) => bindGearWard(engine, {id, carrier: id, bearer, type: 'bludgeoning',
        phase: 'contact', charge: per, per, reflectPercent: 100});
    const worn = wearGearWard(bind(bind(ready, mirror, wearer, 6), counter, attacker, 2), wearer, mirror);
    const pending = startEngineWorking(worn, {id: 'incoming', payer: attacker,
        ...spellEffectMethod([{sentence: {verb: 'remove', object: 'vitality', target: 'creature', time: 'instant', carrier: 'wand'},
            target: {id: wearer}, grip: {caster: attacker, implement: 'wand'}, contact: {links: 0}, minutes: 1, flightMinutes: 2,
            details: {amount: 7, damageType: 'bludgeoning'}}])});
    const inFlight = advance(pending, 1);
    const stats = engine => {
        const {vitality, stamina} = engine.world.holders[attacker].quantities;
        return [vitality, stamina, engine.world.holders[wearer].quantities.vitality, engine.records.stored[counter].charge.now];
    };
    assert.deepEqual(stats(advance(restore(inFlight), 3)), [94, 7, 99, 2]);
    const guarded = wearGearWard(inFlight, attacker, counter);
    const landed = advance(restore(guarded), 3);
    assert.deepEqual(stats(landed), [96, 10, 99, 0]);
    assert.deepEqual(serializeEngineWorld(landed), serializeEngineWorld(advance(guarded, 3)));
    assert.deepEqual(serializeEngineWorld(landed), serializeEngineWorld(advance(restore(landed), 3)));
});

test('a transferred ward can turn its captured force back into one paid pulse', () => {
    const force = 'energy:captured_force', carrier = 'shield', id = 'recycling-ward';
    const ready = applyEngineOps(workshop(), [{op: 'holder_add', value: {
        id: carrier, kind: 'thing', place, properties: {holder: wearer}, quantities: {[force]: 0},
    }}], 'fixture:recycling-ward');
    const spec = {id, carrier, bearer: wearer, type: 'fire', phase: 'contact', charge: 8, per: 4, conversion: force,
        reservoirCapacity: 8, recharge: {quantity: force, rate: 2, fromCarrier: true}};
    const bound = bindGearWard(ready, spec);
    const hit = (engine, who) => settleGearHit(restore(engine), {id, wearer: who,
        packets: [{type: 'fire', phase: 'contact', amount: 7}]});
    const first = hit(wearGearWard(bound, wearer, carrier), wearer);
    const second = hit(first.engine, wearer);
    const depleted = second.engine;
    assert.deepEqual([first.damage, second.damage, hit(depleted, wearer).damage], [3, 3, 7]);

    const given = giveGearWard(restore(depleted), {id, from: wearer, to: attacker});
    const received = wearGearWard(restore(given), attacker, carrier);
    const replenish = (engine, amount) => maintainGearWard(engine, {id, bearer: attacker, amount});
    assert.throws(() => maintainGearWard(received, {id, bearer: wearer, amount: 4}), /hold the carrier/i);
    const short = replenish(restore(received), 5);
    const accounts = engine => [engine.records.stored[id].charge.now, engine.world.holders[carrier].quantities[force]];
    assert.deepEqual(accounts(short), [0, 8]);
    assert.equal(short.records.stored[id].receipts.at(-1).reason, 'price');

    const recharged = replenish(restore(received), 4);
    assert.deepEqual(serializeEngineWorld(recharged), serializeEngineWorld(replenish(received, 4)));
    assert.deepEqual(accounts(recharged), [4, 0]);
    const {cost, added, by, operator} = restore(recharged).records.stored[id].receipts.at(-1);
    assert.deepEqual({cost, added, by, operator}, {cost: 8, added: 4, by: carrier, operator: attacker});
    const replay = hit(recharged, attacker);
    assert.equal(replay.damage, 3);
    assert.deepEqual(accounts(replay.engine), [0, 4]);
    assert.equal(hit(replay.engine, attacker).damage, 7);
});

test('a nearly full ward lets excess force through and releasing its reserve makes room', () => {
    const force = 'energy:captured_force', carrier = 'shield', id = 'small-reservoir';
    const ready = applyEngineOps(workshop(), [{op: 'holder_add', value: {
        id: carrier, kind: 'thing', place, properties: {holder: wearer}, quantities: {[force]: 4},
    }}], 'fixture:small-reservoir');
    const bound = bindGearWard(ready, {id, carrier, bearer: wearer, type: 'fire', phase: 'contact',
        charge: 8, per: 4, conversion: force, reservoirCapacity: 5, reflectPercent: 50});
    const worn = wearGearWard(bound, wearer, carrier);
    const hit = engine => settleGearHit(engine, {id, wearer, attacker, packets: [
        {type: 'fire', phase: 'contact', amount: 7}, {type: 'slashing', phase: 'contact', amount: 5},
    ]});
    const first = hit(restore(worn));
    assert.deepEqual([first.absorbed, first.reflected, first.damage], [2, 1, 10]);
    assert.equal(first.engine.world.holders[carrier].quantities[force], 5);
    assert.equal(first.engine.records.stored[id].charge.now, 4);

    const weakAttacker = applyEngineOps(worn, [
        {op: 'add', holder: carrier, quantity: force, amount: -1},
        {op: 'add', holder: attacker, quantity: 'vitality', amount: -99},
    ], 'fixture:weak-attacker');
    const limited = hit(weakAttacker);
    assert.deepEqual([limited.absorbed, limited.reflected, limited.damage], [3, 1, 9]);
    assert.equal(limited.engine.world.holders[carrier].quantities[force], 5);

    const full = hit(restore(first.engine));
    assert.equal(full.damage, 12);
    assert.equal(full.engine.records.stored[id].charge.now, 4);
    const vented = releaseCapturedForce(full.engine, {id, wearer, target: attacker, amount: 2});
    const replay = hit(restore(vented.engine));
    assert.deepEqual([replay.absorbed, replay.reflected, replay.damage], [4, 2, 8]);
    assert.equal(replay.engine.world.holders[carrier].quantities[force], 5);
    assert.equal(replay.engine.records.stored[id].charge.now, 0);
    assert.deepEqual(serializeEngineWorld(replay.engine), serializeEngineWorld(hit(vented.engine).engine));
});

test('two fitted layers act on remaining harm and travel with the plate as separate parts', () => {
    const insert = 'insert';
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: plate, property: 'marks', value: ['lining-seams', 'insert-pocket']},
        {op: 'holder_add', value: {id: insert, kind: 'thing', as: ['heatproof_lining'], place,
            quantities: {[LINING_STOCK]: 1, condition: 50},
            properties: {'workshop.held_by': wearer, 'workshop.fire_resistance': 40, marks: ['matching-insert']}}},
    ], 'fixture:layered-armor');
    const base = advance(startFireLining(ready, request), 3);
    const bad = advance(startFireLining(base, {...request, id: 'wrong-interface', lining, slot: 'insert'}), 6);
    assert.equal(bad.records.workings['wrong-interface'].record.status, 'interrupted');
    const pending = startFireLining(bad, {...request, id: 'insert', lining: insert, slot: 'insert'});
    const fitted = restore(advance(restore(pending), 9));
    const wearing = wearBreastplate(fitted, wearer, plate);
    assert.deepEqual(hits(wearing), {cut: 25, fire: 12, mixed: 18});

    const loan = lendBreastplate(wearing, {from: wearer, to: attacker, armor: plate});
    const borrowed = wearBreastplate(restore(loan), attacker, plate);
    const moved = crossHeatedLink(borrowed, {wearer: attacker, link: 'kiln-walk'}).engine;
    for (const part of [plate, lining, insert]) assert.equal(moved.world.holders[part].place, 'hall');

    const detached = restore(advance(startLiningDetachment(wearing,
        {...request, id: 'detach-insert', lining: insert, slot: 'insert'}), 12));
    assert.deepEqual(hits(detached), {cut: 25, fire: 15, mixed: 20});
    assert.equal(detached.world.holders[insert].quantities[LINING_STOCK], 1);
    assert.equal(detached.world.holders[insert].quantities.condition, 50);
    assert.equal(detached.world.holders[lining].quantities[LINING_STOCK], 0);
});

test('two valid opposite inscriptions interfere only while fitted together', () => {
    const insert = 'insert';
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: plate, property: 'marks', value: ['lining-seams', 'insert-pocket']},
        {op: 'holder_add', value: {id: insert, kind: 'thing', as: ['heatproof_lining'], place,
            quantities: {[LINING_STOCK]: 1, condition: 100},
            properties: {'workshop.held_by': wearer, marks: ['matching-insert']}}},
    ], 'fixture:counter-field');
    const worn = wearBreastplate(advance(startFireLining(ready, request), 3), wearer, plate);
    const fitInsert = (engine, pattern, expected) => {
        const engraved = advance(restore(startLiningInscription(engine, {id: 'etch', wearer, lining: insert, pattern})), 6);
        const forecast = (state, observer = wearer) => forecastLiningFit(state.world, {observer, armor: plate, lining: insert, slot: 'insert'});
        assert.deepEqual(forecast(engraved), {known: false});
        const first = appraiseLining(engraved, {observer: wearer, lining});
        assert.deepEqual(forecast(first), {known: false});
        const appraised = restore(appraiseLining(first, {observer: wearer, lining: insert}));
        assert.deepEqual(forecast(appraised), expected);
        const handedOver = applyEngineOps(giveBreastplate(appraised, {from: wearer, to: attacker, armor: plate}),
            [{op: 'property', holder: insert, property: 'workshop.held_by', value: attacker}], 'fixture:give-loose-insert');
        assert.deepEqual(forecast(restore(handedOver), attacker), {known: false});
        const checkedByRecipient = appraiseLining(appraiseLining(handedOver, {observer: attacker, lining}),
            {observer: attacker, lining: insert});
        assert.deepEqual(forecast(restore(checkedByRecipient), attacker), expected);
        assert.equal(appraised.world.holders[insert].quantities[LINING_STOCK], 1);
        const fitting = startFireLining(appraised, {...request, id: 'fit-insert', lining: insert, slot: 'insert'});
        const fitted = advance(restore(advance(fitting, 7)), 9);
        assert.deepEqual(serializeEngineWorld(fitted), serializeEngineWorld(advance(fitting, 9)));
        return fitted;
    };
    const aligned = fitInsert(worn, 'sparkproof', {known: true, fireMultiplier: .36, opposing: false});
    const opposed = fitInsert(worn, ['ember', 'mirror'], {known: true, fireMultiplier: 1, opposing: true});
    assert.deepEqual(hits(worn), {cut: 25, fire: 15, mixed: 20});
    assert.deepEqual(hits(aligned), {cut: 25, fire: 9, mixed: 17});
    assert.deepEqual(hits(opposed), {cut: 25, fire: 25, mixed: 25});
    const detached = advance(restore(startLiningDetachment(opposed, {...request, id: 'detach', slot: 'lining'})), 12);
    assert.deepEqual(hits(detached), hits(worn));
    assert.equal(detached.world.holders[lining].quantities[LINING_STOCK], 1);
});

test('a worn intact seal prevents the affliction owner from opening an inhaled poison track', () => {
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: lining, property: 'workshop.blocks_exposure', value: ['inhaled']},
        {op: 'carry', holder: lining, quantity: 'condition', amount: 100},
    ], 'fixture:sealed-liner');
    const fitted = advance(startFireLining(ready, request), 3);
    const inhaled = {wearer, via: 'inhaled', carries: ['spore cloud'], catalogue: [CELLAR_SPORES], total: 10, natural: 10};
    const [unprotected] = readGearExposure(fitted.world, inhaled);
    assert.equal(unprotected.track.id, 'cellar_spores');
    const worn = restore(wearBreastplate(fitted, wearer, plate));
    assert.deepEqual(readGearExposure(worn.world, inhaled), []);
    const tear = applyEngineOps(worn, [{op: 'add', holder: lining, quantity: 'condition', amount: -1}], 'fixture:torn-seal');
    assert.deepEqual(readGearExposure(restore(tear).world, inhaled), [unprotected]);
    assert.deepEqual(readGearExposure(restore(wearBreastplate(worn, wearer)).world, inhaled), [unprotected]);
});

test('an intact seal stops the destination spore hazard and a torn seal admits a saved poison track', () => {
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: 'hall', property: 'workshop.spore_cloud', value: true},
        {op: 'property', holder: wearer, property: 'workshop.fortitude', value: -20},
        {op: 'carry', holder: wearer, quantity: 'stamina', amount: 30},
        {op: 'carry', holder: lining, quantity: 'condition', amount: 100},
        {op: 'property', holder: lining, property: 'workshop.blocks_exposure', value: ['inhaled']},
    ], 'fixture:spore-route');
    const fitted = advance(startFireLining(ready, request), 3);
    const worn = wearBreastplate(fitted, wearer, plate);
    const torn = applyEngineOps(worn, [{op: 'add', holder: lining, quantity: 'condition', amount: -1}], 'fixture:tear');
    const arrive = engine => crossHeatedLink(engine, {wearer, link: 'kiln-walk'}).engine;
    const stamina = engine => engine.world.holders[wearer].quantities.stamina;
    const status = engine => engine.world.holders[wearer].state[workshopSporePack.id]?.track;
    const protectedArrival = arrive(worn);
    assert.equal(protectedArrival.world.holders[lining].place, 'hall');
    assert.equal(status(protectedArrival), undefined);
    assert.equal(stamina(advance(restore(protectedArrival), 27)), 30);

    const exposed = arrive(torn);
    assert.equal(status(exposed).id, 'cellar_spores');
    assert.equal(status(exposed).nextAt, 17);
    assert.equal(stamina(exposed), 25);
    const restored = advance(restore(exposed), 27);
    assert.equal(stamina(restored), 15);
    assert.equal(status(restored), null);
    assert.deepEqual(serializeEngineWorld(restored), serializeEngineWorld(advance(advance(exposed, 17), 27)));

    const lingering = applyEngineOps(worn, [{op: 'property', holder: 'hall',
        property: SPORE_INTERVAL, value: 4}], 'fixture:lingering-cloud');
    const sheltered = arrive(lingering);
    assert.equal(sheltered.world.holders[wearer].state[workshopSporePack.id].nextExposure, 11);
    assert.equal(stamina(advance(restore(sheltered), 11)), 30);
    const removing = startBreastplateRemoval(sheltered, {id: 'remove-seal', wearer, armor: plate});
    const unsealed = advance(removing, 10);
    const exposedInside = advance(restore(unsealed), 11);
    assert.equal(stamina(exposedInside), 25);
    assert.equal(status(exposedInside).nextAt, 21);
    assert.deepEqual(serializeEngineWorld(exposedInside), serializeEngineWorld(advance(removing, 11)));
    const escaped = applyEngineOps(unsealed, [{op: 'move', holder: wearer, to: place}], 'fixture:leave-cloud');
    assert.equal(stamina(advance(restore(escaped), 16)), 30);
    assert.equal(stamina(advance(restore(exposedInside), 15)), 25);
});

test('a charged filter stops inhalation until spent, then recharges after restore', () => {
    const charm = 'filter';
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: 'hall', property: 'workshop.spore_cloud', value: true},
        {op: 'property', holder: 'hall', property: SPORE_INTERVAL, value: 4},
        {op: 'property', holder: wearer, property: 'workshop.fortitude', value: -20},
        {op: 'carry', holder: wearer, quantity: 'stamina', amount: 30},
        {op: 'carry', holder: wearer, quantity: PURGE_SALTS, amount: 2},
        {op: 'holder_add', value: {id: charm, kind: 'thing', place, as: ['workshop_purge_charm'],
            properties: {'workshop.held_by': wearer}, quantities: {[PURGE_CHARGE]: 0}}},
    ], 'fixture:spore-filter');
    const start = (engine, id, action) => startSporeCharmWork(engine, {id, wearer, charm, action});
    const marked = advance(restore(start(ready, 'mark-filter', 'inscribe-filter')), 3);
    const worn = advance(start(marked, 'fit-filter', 'wear'), 6);
    const route = {wearer, link: 'kiln-walk'};
    const fittedSeal = advance(startFireLining(applyEngineOps(worn, [{op: 'property', holder: lining,
        property: 'workshop.blocks_exposure', value: ['inhaled']}], 'fixture:filter-with-seal'), request), 9);
    const sealedArrival = crossHeatedLink(wearBreastplate(fittedSeal, wearer, plate), route).engine;
    assert.equal(sealedArrival.world.holders[charm].quantities[PURGE_CHARGE], 1);
    const arrival = crossHeatedLink(restore(worn), route).engine;
    const stats = engine => [engine.world.holders[wearer].quantities.stamina,
        engine.world.holders[charm].quantities[PURGE_CHARGE]];
    assert.deepEqual(stats(arrival), [30, 0]);
    assert.equal(arrival.world.holders[charm].place, 'hall');
    assert.equal(arrival.world.holders[wearer].state[workshopSporePack.id].track, null);
    const uncharged = advance(restore(arrival), 14);
    assert.deepEqual(stats(uncharged), [25, 0]);
    const recharging = start(start(arrival, 'refill', 'recharge'), 'refill-again', 'recharge');
    const pending = advance(recharging, 12);
    const refreshed = advance(restore(pending), 14);
    assert.deepEqual(stats(refreshed), [30, 0]);
    assert.equal(refreshed.records.workings['refill-again'].record.status, 'interrupted');
    assert.equal(refreshed.world.holders[wearer].quantities[PURGE_SALTS], 0);
    assert.deepEqual(serializeEngineWorld(refreshed), serializeEngineWorld(advance(recharging, 14)));
    assert.deepEqual(stats(advance(restore(refreshed), 18)), [25, 0]);

    const measured = applyEngineOps(ready, [
        {op: 'property', holder: 'hall', property: SPORE_DOSE, value: 2},
        {op: 'property', holder: charm, property: FILTER_CAPACITY, value: 3},
    ], 'fixture:measured-filter');
    const filled = advance(start(advance(start(measured, 'measure-filter', 'inscribe-filter'), 3), 'wear-measured', 'wear'), 6);
    assert.deepEqual(stats(filled), [30, 3]);
    const partlySpent = crossHeatedLink(restore(filled), route).engine;
    assert.deepEqual(stats(partlySpent), [30, 1]);
    const overwhelmed = advance(restore(partlySpent), 14);
    assert.deepEqual(stats(overwhelmed), [25, 0]);
    assert.deepEqual(serializeEngineWorld(overwhelmed), serializeEngineWorld(advance(partlySpent, 14)));
    assert.equal(overwhelmed.world.holders[wearer].state[workshopSporePack.id].track.nextAt, 24);
    const refillMeasured = advance(start(overwhelmed, 'refill-measured', 'recharge'), 15);
    assert.deepEqual(stats(advance(restore(refillMeasured), 17)), [25, 3]);

    const cumulative = applyEngineOps(filled, [{op: 'property', holder: 'hall',
        property: SPORE_THRESHOLD, value: 4}], 'fixture:cumulative-cloud');
    const unfiltered = crossHeatedLink(advance(start(cumulative, 'remove-filter', 'remove'), 9), route).engine;
    assert.equal(unfiltered.world.holders[wearer].state[workshopSporePack.id].dose, 2);
    assert.deepEqual(stats(advance(restore(unfiltered), 17)), [25, 3]);
    const filtered = crossHeatedLink(cumulative, route).engine;
    const afterTwo = advance(restore(filtered), 14);
    assert.deepEqual(stats(afterTwo), [30, 0]);
    assert.equal(afterTwo.world.holders[wearer].state[workshopSporePack.id].dose, 1);
    const afterThree = advance(restore(afterTwo), 18);
    assert.deepEqual(stats(afterThree), [30, 0]);
    assert.equal(afterThree.world.holders[wearer].state[workshopSporePack.id].dose, 3);
    const sick = advance(restore(afterThree), 22);
    assert.deepEqual(stats(sick), [25, 0]);
    assert.equal(sick.world.holders[wearer].state[workshopSporePack.id].dose, 0);
    assert.deepEqual(serializeEngineWorld(sick), serializeEngineWorld(advance(filtered, 22)));
    const escaped = applyEngineOps(afterThree, [{op: 'move', holder: wearer, to: place}], 'fixture:leave-dose');
    assert.equal(escaped.world.holders[wearer].state[workshopSporePack.id].dose, undefined);
    assert.deepEqual(stats(advance(restore(escaped), 22)), [30, 0]);
    const portable = applyEngineOps(afterThree, [
        {op: 'property', holder: wearer, property: SPORE_CLEARANCE, value: 2},
        {op: 'holder_add', value: {id: 'second-cloud', kind: 'place',
            properties: {'workshop.spore_cloud': true, [SPORE_DOSE]: 2, [SPORE_THRESHOLD]: 4}}},
    ], 'fixture:second-cloud');
    const move = (engine, to) => applyEngineOps(engine, [{op: 'move', holder: wearer, to}], 'fixture:move-between-clouds');
    assert.deepEqual(stats(move(restore(portable), 'second-cloud')), [25, 0]);
    const cleanAir = move(portable, place);
    const breathing = advance(restore(cleanAir), 19);
    assert.equal(breathing.world.holders[wearer].state[workshopSporePack.id].dose, 3);
    const recovered = advance(restore(breathing), 22);
    assert.equal(recovered.world.holders[wearer].state[workshopSporePack.id].dose, 1);
    assert.deepEqual(serializeEngineWorld(recovered), serializeEngineWorld(advance(cleanAir, 22)));
    const entered = move(restore(recovered), 'second-cloud');
    assert.deepEqual(stats(entered), [30, 0]);
    assert.equal(entered.world.holders[wearer].state[workshopSporePack.id].dose, 3);
    assert.equal(entered.world.holders[wearer].state[workshopSporePack.id].nextClearance, undefined);
});

test('a saved cartridge refit changes the next exposure and preserves the removed cartridge', () => {
    const charm = 'filter-frame', small = 'small-cartridge', large = 'large-cartridge';
    const held = (id, kind, capacity) => ({op: 'holder_add', value: {id, kind: 'thing', place,
        as: [kind], properties: {'workshop.held_by': wearer, ...(capacity ? {[FILTER_CAPACITY]: capacity} : {})},
        quantities: {[PURGE_CHARGE]: 0}}});
    const ready = applyEngineOps(workshop(), [
        held(charm, 'workshop_purge_charm'), held(small, 'workshop_spore_cartridge', 1),
        held(large, 'workshop_spore_cartridge', 3),
        {op: 'carry', holder: wearer, quantity: 'stamina', amount: 30},
        {op: 'carry', holder: wearer, quantity: PURGE_SALTS, amount: 3},
        {op: 'property', holder: wearer, property: 'workshop.fortitude', value: -20},
        {op: 'property', holder: 'hall', property: 'workshop.spore_cloud', value: true},
        {op: 'property', holder: 'hall', property: SPORE_DOSE, value: 2},
    ], 'fixture:cartridge-filter');
    const start = (engine, action, bindings = {}, id = action) =>
        startSporeCharmWork(engine, {id, wearer, charm, action, ...bindings});
    const frame = advance(start(ready, 'inscribe-frame'), 3);
    const worn = advance(start(frame, 'wear'), 6);
    const filled = advance(start(start(worn, 'refill-cartridge', {cartridge: small}, 'fill-small'),
        'refill-cartridge', {cartridge: large}, 'fill-large'), 9);
    const first = advance(start(filled, 'fit-cartridge', {cartridge: small}), 12);
    const swap = start(first, 'swap-cartridge', {cartridge: large, previous: small});
    const loseCustody = engine => applyEngineOps(engine, [{op: 'property', holder: large,
        property: 'workshop.held_by', value: attacker}], 'fixture:lost-cartridge-custody');
    const blocked = advance(restore(loseCustody(swap)), 15);
    assert.equal(blocked.records.workings['swap-cartridge'].record.status, 'interrupted');
    assert.equal(blocked.world.holders[charm].properties[FITTED_CARTRIDGE], small);
    const competing = start(swap, 'swap-cartridge', {cartridge: large, previous: small}, 'swap-cartridge-again');
    const swapped = advance(restore(advance(competing, 13)), 15);
    assert.equal(swapped.records.workings['swap-cartridge-again'].record.status, 'interrupted');
    assert.deepEqual(serializeEngineWorld(swapped), serializeEngineWorld(advance(competing, 15)));
    const charge = (engine, part) => engine.world.holders[part].quantities[PURGE_CHARGE];
    const arrive = engine => crossHeatedLink(restore(engine), {wearer, link: 'kiln-walk'}).engine;
    const stamina = engine => engine.world.holders[wearer].quantities.stamina;
    assert.equal(stamina(arrive(advance(first, 15))), 25);
    const protectedArrival = arrive(swapped);
    assert.equal(stamina(protectedArrival), 30);
    assert.equal(charge(protectedArrival, small), 1);
    assert.equal(charge(protectedArrival, large), 1);
    assert.equal(protectedArrival.world.holders[large].place, 'hall');

    const detached = advance(start(swapped, 'detach-cartridge', {previous: large}), 18);
    assert.equal(detached.world.holders[charm].properties[FITTED_CARTRIDGE] ?? null, null);
    assert.equal(stamina(arrive(detached)), 25);
    assert.equal(charge(detached, large), 3);
    const refitted = advance(start(detached, 'fit-cartridge', {cartridge: small}, 'reuse-small'), 21);
    assert.equal(refitted.world.holders[charm].properties[FITTED_CARTRIDGE], small);
    assert.equal(charge(refitted, small), 1);
    const exposed = arrive(loseCustody(swapped));
    assert.equal(stamina(exposed), 25);
    assert.equal(charge(exposed, large), 3);

    const transferReady = applyEngineOps(swapped, [
        {op: 'carry', holder: attacker, quantity: 'stamina', amount: 30},
        {op: 'property', holder: attacker, property: 'workshop.fortitude', value: -20},
    ], 'fixture:receive-filter');
    const bareGift = advance(restore(start(detached, 'give-charm', {recipient: attacker})), 21);
    assert.equal(bareGift.world.holders[charm].properties['workshop.held_by'], attacker);
    assert.equal(bareGift.world.holders[large].properties['workshop.held_by'], wearer);
    const splitGift = start(transferReady, 'give-charm', {recipient: attacker});
    const giving = start(splitGift, 'give-fitted-filter', {recipient: attacker, cartridge: large});
    const competingGift = start(giving, 'give-fitted-filter', {recipient: attacker, cartridge: large}, 'repeat-gift');
    const given = advance(restore(advance(competingGift, 16)), 18);
    assert.deepEqual(serializeEngineWorld(given), serializeEngineWorld(advance(competingGift, 18)));
    for (const id of ['give-charm', 'repeat-gift'])
        assert.equal(given.records.workings[id].record.status, 'interrupted');
    for (const item of [charm, large])
        assert.equal(given.world.holders[item].properties['workshop.held_by'], attacker);
    assert.equal(charge(given, large), 3);
    assert.equal(given.world.holders[small].properties['workshop.held_by'], wearer);
    assert.equal(given.world.holders[wearer].properties['workshop.worn_purge_charm'], undefined);
    assert.equal(stamina(arrive(given)), 25);
    const receiverArrives = engine => crossHeatedLink(restore(engine), {wearer: attacker, link: 'kiln-walk'}).engine;
    assert.equal(receiverArrives(given).world.holders[attacker].quantities.stamina, 25);
    const wornGift = advance(start(given, 'wear', {wearer: attacker}, 'wear-gift'), 21);
    const protectedReceiver = receiverArrives(wornGift);
    assert.equal(protectedReceiver.world.holders[attacker].quantities.stamina, 30);
    assert.equal(protectedReceiver.world.holders[charm].properties[FITTED_CARTRIDGE], large);
    assert.equal(charge(protectedReceiver, large), 1);
    assert.equal(charge(protectedReceiver, small), 1);

    const loan = start(transferReady, 'give-fitted-filter', {recipient: attacker, cartridge: large, mode: 'loan'}, 'lend-filter');
    const borrowed = advance(restore(loan), 18);
    const borrower = {wearer: attacker};
    const use = advance(start(borrowed, 'wear', borrower, 'wear-loan'), 21);
    const tryDetach = start(use, 'detach-cartridge', {...borrower, previous: large}, 'borrower-detach');
    const tryGift = start(tryDetach, 'give-fitted-filter', {...borrower, recipient: wearer, cartridge: large}, 'borrower-gift');
    const readyToUse = advance(restore(tryGift), 24);
    for (const id of ['borrower-detach', 'borrower-gift'])
        assert.equal(readyToUse.records.workings[id].record.status, 'interrupted');
    const used = receiverArrives(readyToUse);
    assert.equal(used.world.holders[attacker].quantities.stamina, 30);
    assert.equal(charge(used, large), 1);

    const met = applyEngineOps(used, [{op: 'move', holder: wearer, to: 'hall'}], 'fixture:meet-lender');
    const returning = start(met, 'give-fitted-filter', {...borrower, recipient: wearer, cartridge: large, mode: 'return'}, 'return-filter');
    const away = applyEngineOps(returning, [{op: 'move', holder: wearer, to: place}], 'fixture:lender-leaves');
    const late = advance(restore(away), met.world.clock + 3);
    assert.equal(late.records.workings['return-filter'].record.status, 'interrupted');
    assert.equal(late.world.holders[large].properties['workshop.held_by'], attacker);
    const returned = advance(restore(advance(returning, met.world.clock + 1)), met.world.clock + 3);
    assert.deepEqual(serializeEngineWorld(returned), serializeEngineWorld(advance(returning, met.world.clock + 3)));
    for (const item of [charm, large])
        assert.equal(returned.world.holders[item].properties['workshop.held_by'], wearer);
    assert.equal(returned.world.holders[attacker].properties['workshop.worn_purge_charm'], undefined);
    assert.equal(returned.world.holders[charm].properties[FITTED_CARTRIDGE], large);
    assert.equal(charge(returned, large), 1);
    const service = advance(start(returned, 'detach-cartridge', {previous: large}, 'owner-detach'), returned.world.clock + 3);
    assert.equal(service.records.workings['owner-detach'].record.status, 'complete');
    assert.equal(charge(service, large), 1);
});

test('a charged charm treats established spores at their next check and can be recharged', () => {
    const charm = 'purge-charm';
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: 'hall', property: 'workshop.spore_cloud', value: true},
        {op: 'property', holder: wearer, property: 'workshop.fortitude', value: -20},
        {op: 'carry', holder: wearer, quantity: 'stamina', amount: 30},
        {op: 'carry', holder: wearer, quantity: PURGE_SALTS, amount: 2},
    ], 'fixture:spores');
    const arrived = crossHeatedLink(ready, {wearer, link: 'kiln-walk'}).engine;
    const exposed = applyEngineOps(arrived, [{op: 'holder_add', value: {id: charm, kind: 'thing', place: 'hall',
        as: ['workshop_purge_charm'], properties: {'workshop.held_by': wearer}, quantities: {[PURGE_CHARGE]: 0}}}], 'fixture:charm');
    const stats = engine => {
        const body = engine.world.holders[wearer];
        return [body.quantities.stamina, engine.world.holders[charm].quantities[PURGE_CHARGE], body.state[workshopSporePack.id]?.track];
    };
    const start = (engine, id, action) => startSporeCharmWork(engine, {id, wearer, charm, action});
    assert.equal(stats(exposed)[0], 25);
    assert.equal(stats(exposed)[2].nextAt, 14);
    const engraving = start(exposed, 'inscribe-charm', 'inscribe');
    const inscribed = advance(restore(advance(engraving, 5)), 7);
    assert.equal(inscribed.world.holders[wearer].quantities[PURGE_SALTS], 1);
    const worn = advance(start(inscribed, 'wear-charm', 'wear'), 10);
    assert.equal(stats(worn)[1], 1);
    const removed = advance(start(worn, 'remove-charm', 'remove'), 13);
    const untreated = advance(restore(removed), 14);
    assert.deepEqual(stats(untreated).slice(0, 2), [20, 1]);
    assert.equal(stats(untreated)[2].nextAt, 24);
    const treated = advance(restore(advance(worn, 13)), 14);
    assert.deepEqual(stats(treated), [25, 0, null]);
    assert.deepEqual(serializeEngineWorld(treated), serializeEngineWorld(advance(worn, 14)));
    assert.deepEqual(stats(advance(restore(treated), 24)), [25, 0, null]);

    const lingering = applyEngineOps(ready, [{op: 'property', holder: 'hall',
        property: SPORE_INTERVAL, value: 5}], 'fixture:lingering-purge');
    const inside = crossHeatedLink(lingering, {wearer, link: 'kiln-walk'}).engine;
    const supplied = applyEngineOps(inside, [{op: 'holder_add', value: exposed.world.holders[charm]}], 'fixture:bring-charm');
    const sealed = advance(start(advance(start(supplied, 'mark-purge', 'inscribe'), 7), 'fit-purge', 'wear'), 10);
    const cleared = advance(restore(sealed), 14);
    assert.deepEqual(stats(cleared), [25, 0, null]);
    const again = advance(restore(cleared), 19);
    assert.deepEqual(stats(again).slice(0, 2), [20, 0]);
    assert.equal(stats(again)[2].nextAt, 29);
    assert.deepEqual(serializeEngineWorld(again), serializeEngineWorld(advance(sealed, 19)));

    const recharge = start(start(treated, 'salt', 'recharge'), 'salt-again', 'recharge');
    const renewed = advance(restore(advance(recharge, 15)), 17);
    assert.equal(renewed.world.holders[wearer].quantities[PURGE_SALTS], 0);
    assert.equal(renewed.records.workings['salt-again'].record.status, 'interrupted');
    assert.equal(stats(renewed)[1], 1);
    const reexposed = applyEngineOps(renewed, [{op: 'move', holder: wearer, to: place},
        {op: 'move', holder: wearer, to: 'hall'}], 'fixture:reenter-spores');
    assert.deepEqual(stats(reexposed).slice(0, 2), [20, 1]);
    assert.deepEqual(stats(advance(restore(reexposed), 27)), [20, 0, null]);
});

test('a specialist finishes the exact commission after restore and receives the agreed fee once', () => {
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: lining, property: 'workshop.fire_resistance', value: null},
        {op: 'property', holder: attacker, property: 'marks', value: ['fireproof-inscriber']},
        {op: 'carry', holder: wearer, quantity: WORKSHOP_COIN, amount: 8},
        {op: 'carry', holder: attacker, quantity: WORKSHOP_COIN, amount: 2},
    ], 'fixture:commission-means');
    const order = {id: 'commission', wearer, lining, maker: attacker};
    const pending = startLiningCommission(ready, order);
    const absent = applyEngineOps(pending, [{op: 'move', holder: attacker, to: 'hall'}], 'fixture:maker-leaves');
    const failed = advance(restore(absent), 3);
    assert.equal(failed.records.workings.commission.record.status, 'interrupted');
    assert.equal(failed.world.holders[wearer].quantities[WORKSHOP_COIN], 8);
    assert.equal(failed.world.holders[attacker].quantities[INSCRIPTION_STOCK], 10);

    const competing = startLiningCommission(pending, {...order, id: 'second-order'});
    const completed = advance(restore(advance(competing, 1)), 3);
    assert.deepEqual(serializeEngineWorld(completed), serializeEngineWorld(advance(competing, 3)));
    assert.equal(completed.records.workings.commission.record.receipts[0].observed.lining, lining);
    assert.equal(completed.records.workings['second-order'].record.status, 'interrupted');
    assert.equal(completed.world.holders[wearer].quantities[WORKSHOP_COIN], 3);
    assert.equal(completed.world.holders[attacker].quantities[WORKSHOP_COIN], 7);
    assert.equal(completed.world.holders[attacker].quantities[INSCRIPTION_STOCK], 7);
    assert.equal(completed.world.holders[wearer].quantities[INSCRIPTION_STOCK], 10);
    const fitted = advance(startFireLining(completed, request), 6);
    const worn = wearBreastplate(restore(fitted), wearer, plate);
    assert.deepEqual(hits(worn), {cut: 25, fire: 15, mixed: 20});
    assert.equal(settleHeatExposure(worn, {wearer, dose: 20}).damage, 16);
});

test('a broken ward carrier needs a paid physical repair and a separate renewal before it catches harm again', () => {
    const carrier = 'shield', id = 'ward';
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: wearer, quantity: WARD_REPAIR_STOCK, amount: 1},
        {op: 'holder_add', value: {id: carrier, kind: 'thing', place, properties: {holder: wearer}}},
    ], 'fixture:repair-supplies');
    const bound = bindGearWard(ready, {id, carrier, bearer: wearer, type: 'fire', phase: 'contact',
        charge: 8, per: 4, renew: {quantity: INSCRIPTION_STOCK, price: 3}});
    const worn = wearGearWard(bound, wearer, carrier);
    const hit = {id, wearer, packets: [{type: 'fire', phase: 'contact', amount: 7}]};
    const first = settleGearHit(worn, hit);
    assert.equal(first.damage, 3);
    const broken = restore(breakWardCarrier(first.engine, {id, bearer: wearer}));
    assert.equal(broken.records.stored.ward.status, 'broken');
    assert.equal(settleGearHit(broken, hit).damage, 7);
    const early = maintainGearWard(broken, {id, bearer: wearer, renew: true});
    assert.equal(early.world.holders[wearer].quantities[INSCRIPTION_STOCK], 10);
    assert.equal(early.records.stored.ward.status, 'broken');

    const repair = {id: 'repair-ward', ward: id, bearer: wearer};
    const firstRepair = startWardCarrierRepair(early, repair);
    const pending = startWardCarrierRepair(firstRepair, {...repair, id: 'second-repair'});
    const repaired = advance(restore(advance(pending, 1)), 3);
    assert.deepEqual(serializeEngineWorld(repaired), serializeEngineWorld(advance(pending, 3)));
    assert.equal(repaired.world.holders[wearer].quantities[WARD_REPAIR_STOCK], 0);
    assert.equal(repaired.records.workings['second-repair'].record.status, 'interrupted');
    assert.equal(repaired.world.holders[carrier].properties.broken, undefined);
    assert.equal(settleGearHit(repaired, hit).damage, 7);

    const renewed = restore(maintainGearWard(repaired, {id, bearer: wearer, renew: true}));
    assert.equal(renewed.world.holders[wearer].quantities[INSCRIPTION_STOCK], 7);
    assert.equal(renewed.records.stored.ward.charge.now, 8);
    const final = settleGearHit(advance(renewed, 4), hit);
    assert.equal(final.damage, 3);
    assert.equal(final.engine.records.stored.ward.charge.now, 4);
});

test('repairing a borrowed mount restores the original insert’s remaining pulse', () => {
    const mount = 'shield', insert = 'ward-insert', id = 'mounted-ward';
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: attacker, quantity: WARD_REPAIR_STOCK, amount: 1},
        {op: 'carry', holder: wearer, quantity: WARD_REPAIR_STOCK, amount: 2},
        {op: 'holder_add', value: {id: 'wand', kind: 'thing', place, as: ['implement'], properties: {marks: [`grip:${attacker}`]}}},
        ...[[mount, 'ward-recess'], [insert, 'ward-tongue']].map(([id, socket]) => ({op: 'holder_add', value: {
            id, kind: 'thing', place, properties: {holder: wearer, 'workshop.ward_socket': socket,
                ...(id === mount ? {[WARD_MOUNT_STRENGTH]: 4} : {})},
        }})),
    ], 'fixture:repair-mounted-ward');
    const bound = bindGearWard(ready, {id, carrier: insert, bearer: wearer, type: 'fire', phase: 'contact', charge: 8, per: 4});
    const installed = advance(startWardSocketWork(bound, {id: 'install', mount, insert, bearer: wearer, action: 'install'}), 3);
    const hit = (engine, wearer) => settleGearHit(engine, {id, wearer, packets: [{type: 'fire', phase: 'contact', amount: 7}]});
    const equipped = wearGearWard(installed, wearer, mount);
    const cut = settleGearHit(restore(equipped), {id, wearer, packets: [{type: 'slashing', phase: 'contact', amount: 7}]});
    assert.equal(cut.engine.world.holders[mount].properties[WARD_MOUNT_REMAINING], undefined);
    const glance = engine => settleGearHit(restore(engine), {id, wearer, packets: [{type: 'fire', phase: 'contact', amount: 2}]});
    const glancing = glance(equipped);
    assert.equal(glancing.engine.world.holders[mount].properties[WARD_MOUNT_REMAINING], 2);
    assert.equal(glancing.engine.world.holders[mount].properties.broken, undefined);
    const service = (engine, id) => startWardMountRepair(engine, {id, mount, insert, bearer: wearer});
    const unnecessary = advance(restore(service(equipped, 'sound-mount')), 6);
    assert.equal(unnecessary.records.workings['sound-mount'].record.status, 'interrupted');
    assert.equal(unnecessary.world.holders[wearer].quantities[WARD_REPAIR_STOCK], 2);
    const maintenance = service(service(glancing.engine, 'service'), 'service-again');
    const serviced = advance(restore(advance(maintenance, 4)), 6);
    assert.deepEqual(serializeEngineWorld(serviced), serializeEngineWorld(advance(maintenance, 6)));
    assert.equal(serviced.records.workings['service-again'].record.status, 'interrupted');
    assert.equal(serviced.world.holders[wearer].quantities[WARD_REPAIR_STOCK], 1);
    assert.deepEqual(serviced.records.stored[id].charge, glancing.engine.records.stored[id].charge);
    assert.equal(glance(advance(glancing.engine, 6)).engine.world.holders[mount].properties.broken, true);
    const afterService = glance(serviced);
    assert.equal(afterService.engine.world.holders[mount].properties.broken, undefined);
    assert.equal(afterService.engine.world.holders[mount].properties[WARD_MOUNT_REMAINING], 2);
    const casting = startEngineWorking(equipped, {id: 'strike-mount', payer: attacker,
        ...spellEffectMethod([{sentence: {verb: 'remove', object: 'vitality', target: 'creature', time: 'instant', carrier: 'wand'},
            target: {id: wearer}, grip: {caster: attacker, implement: 'wand'}, contact: {links: 0}, minutes: 1, flightMinutes: 2,
            details: {amount: 7, damageType: 'fire'}}])});
    const broken = advance(restore(advance(casting, 4)), 6);
    assert.deepEqual(serializeEngineWorld(broken), serializeEngineWorld(advance(casting, 6)));
    assert.equal(broken.world.holders[wearer].quantities.vitality, 97);
    assert.equal(broken.world.holders[mount].properties[WARD_MOUNT_REMAINING], 0);
    assert.equal(broken.world.holders[mount].properties.broken, true);
    assert.equal(broken.world.holders[insert].properties.broken, undefined);
    assert.equal(broken.records.stored[id].status, 'armed');
    const lent = advance(startWardAssemblyHandoff(broken, {id: 'lend', mount, insert, from: wearer, to: attacker, mode: 'loan'}), 9);
    const worn = wearGearWard(lent, attacker, mount);
    assert.equal(hit(restore(worn), attacker).damage, 7);
    const repair = startWardMountRepair(worn, {id: 'rivet', mount, insert, bearer: attacker});
    const returnedFirst = startWardAssemblyHandoff(worn, {id: 'return-first', mount, insert, from: attacker, to: wearer, mode: 'return'});
    const competing = startWardMountRepair(returnedFirst, {id: 'rivet', mount, insert, bearer: attacker});
    const interrupted = advance(restore(advance(competing, 10)), 12);
    assert.equal(interrupted.records.workings.rivet.record.status, 'interrupted');
    assert.equal(interrupted.world.holders[attacker].quantities[WARD_REPAIR_STOCK], 1);
    assert.equal(interrupted.world.holders[mount].properties.broken, true);
    const repaired = advance(restore(advance(repair, 10)), 12);
    assert.deepEqual(serializeEngineWorld(repaired), serializeEngineWorld(advance(repair, 12)));
    assert.equal(repaired.world.holders[attacker].quantities[WARD_REPAIR_STOCK], 0);
    assert.equal(repaired.world.holders[mount].properties[WARD_MOUNT_REMAINING], undefined);
    assert.equal(repaired.records.stored[id].charge.now, 4);
    assert.equal(repaired.world.holders[mount].properties['workshop.ward_assembly_lender'], wearer);
    const recovered = advance(restore(startWardAssemblyHandoff(repaired,
        {id: 'return', mount, insert, from: attacker, to: wearer, mode: 'return'})), 15);
    const second = hit(restore(wearGearWard(recovered, wearer, mount)), wearer);
    assert.equal(second.damage, 3);
    assert.equal(second.engine.records.stored[id].charge.now, 0);
    assert.equal(second.engine.records.stored[id].carrier, insert);
    assert.equal(second.engine.world.holders[mount].properties.broken, true);
});

test('a commission selects the least costly qualifying protection and rechecks the requested result after restore', () => {
    const ready = applyEngineOps(workshop(), [
        {op: 'property', holder: lining, property: 'workshop.fire_resistance', value: null},
        {op: 'property', holder: attacker, property: 'marks', value: ['fireproof-inscriber']},
        {op: 'carry', holder: wearer, quantity: WORKSHOP_COIN, amount: 8},
        {op: 'carry', holder: attacker, quantity: WORKSHOP_COIN, amount: 0},
        {op: 'carry', holder: lining, quantity: 'condition', amount: 100},
    ], 'fixture:commission-offers');
    const order = {id: 'commission', wearer, lining, maker: attacker};
    const combat = {...order, demand: {fire: 40, maxFee: 3}};
    const both = {...order, demand: {fire: 40, heat: 20, maxFee: 5}};
    const before = serializeEngineWorld(ready);
    const basic = quoteLiningCommission(ready, combat);
    const full = quoteLiningCommission(ready, both);
    assert.deepEqual([basic.pattern, basic.fee, basic.protection], ['sparkproof', 3, {fire: 40, heat: 0}]);
    assert.deepEqual([full.pattern, full.fee, full.protection], ['fireproof', 5, {fire: 40, heat: 20}]);
    assert.equal(quoteLiningCommission(ready, {...both, demand: {...both.demand, maxFee: 4}}).ok, false);
    assert.deepEqual(serializeEngineWorld(ready), before);
    const scuff = engine => applyEngineOps(engine, [{op: 'add', holder: lining, quantity: 'condition', amount: -1}], 'fixture:scuff');
    const lenient = {...combat, demand: {...combat.demand, fire: 30}};
    const quote = quoteLiningCommission(ready, lenient);
    assert.throws(() => startLiningCommission(scuff(ready), {...lenient, fingerprint: quote.fingerprint}), /quote has changed/);
    const pending = startLiningCommission(ready, {...both, fingerprint: full.fingerprint});
    const failed = advance(restore(scuff(pending)), 3);
    assert.equal(failed.records.workings.commission.record.status, 'interrupted');
    assert.equal(failed.world.holders[wearer].quantities[WORKSHOP_COIN], 8);
    assert.equal(failed.world.holders[attacker].quantities[INSCRIPTION_STOCK], 10);

    for (const [terms, offer, heatDamage] of [[combat, basic, 20], [both, full, 16]]) {
        const job = startLiningCommission(ready, {...terms, fingerprint: offer.fingerprint});
        const made = advance(restore(job), 3);
        assert.equal(made.world.holders[attacker].quantities[WORKSHOP_COIN], offer.fee);
        const fitted = advance(startFireLining(made, request), 6);
        const worn = wearBreastplate(restore(fitted), wearer, plate);
        assert.equal(hit(worn, 'fire'), 15);
        assert.equal(settleHeatExposure(worn, {wearer, dose: 20}).damage, heatDamage);
    }
});

test('salvage feeds a paid replacement whose condition changes combat and heat after restore', () => {
    const wornOut = applyEngineOps(workshop(), [
        {op: 'carry', holder: lining, quantity: 'condition', amount: 0},
    ], 'fixture:worn-out-lining');
    const {engine: salvaged} = salvageLooseLining(wornOut, {wearer, lining});
    const pending = startLiningReweave(restore(salvaged), {id: 'reweave', wearer});
    const second = startLiningReweave(pending, {id: 'second-reweave', wearer});
    const made = advance(restore(advance(second, 1)), 3);
    assert.deepEqual(serializeEngineWorld(made), serializeEngineWorld(advance(second, 3)));
    assert.equal(made.world.holders[lining], undefined);
    assert.equal(made.world.holders[wearer].quantities[SALVAGE_STOCK], 0);
    assert.equal(made.world.holders[wearer].quantities[REPAIR_STOCK], 0);
    assert.equal(made.records.workings['second-reweave'].record.status, 'interrupted');
    const replacement = made.records.workings.reweave.record.receipts[0].observed.output;
    assert.equal(made.world.holders[replacement].quantities.condition, 75);
    assert.equal(made.world.holders[replacement].properties['workshop.fire_resistance'], undefined);
    const inscribed = advance(startLiningInscription(made,
        {id: 'mark-rewoven', wearer, lining: replacement, pattern: 'fireproof'}), 6);
    const fitted = advance(startFireLining(inscribed, {...request, lining: replacement}), 9);
    const worn = wearBreastplate(restore(fitted), wearer, plate);
    assert.equal(wornBreastplateProfile(worn.world, wearer).defenseTypes.fire, .7);
    assert.equal(hit(worn, 'fire'), 17);
    assert.equal(settleHeatExposure(worn, {wearer, dose: 20}).damage, 17);
});

test('an exact recovered cloth lot keeps its source and changes the finished lining after restore', () => {
    const scrap = 'dense-scrap';
    const source = applyEngineOps(workshop(), [
        {op: 'property', holder: lining, property: 'marks', value: ['matching-seams', 'dense-weave']},
        {op: 'property', holder: lining, property: 'workshop.fiber_insulation', value: 30},
        {op: 'carry', holder: lining, quantity: 'condition', amount: 30},
    ], 'fixture:dense-cloth');
    const {engine: recovered} = salvageLooseLining(source, {wearer, lining, scrapId: scrap});
    assert.deepEqual(readLineage(recovered.world, scrap)[0].parents, [lining]);
    const pending = startLiningReweave(recovered, {id: 'dense-reweave', wearer, scrap});
    const misplaced = applyEngineOps(pending, [{op: 'move', holder: scrap, to: 'hall'}], 'fixture:cloth-moved');
    const stopped = advance(restore(misplaced), 3);
    assert.equal(stopped.records.workings['dense-reweave'].record.status, 'interrupted');
    assert.equal(stopped.world.holders[scrap].quantities[SALVAGE_STOCK], 1);
    assert.equal(stopped.world.holders[wearer].quantities[REPAIR_STOCK], 1);

    const made = advance(restore(advance(pending, 1)), 3);
    assert.deepEqual(serializeEngineWorld(made), serializeEngineWorld(advance(pending, 3)));
    const replacement = made.records.workings['dense-reweave'].record.receipts[0].observed.output;
    assert.deepEqual(readLineage(made.world, replacement)[0].parents, [scrap]);
    assert.equal(made.world.holders[replacement].quantities.condition, 90);
    assert.equal(made.world.holders[scrap].quantities[SALVAGE_STOCK], 0);

    const plain = advance(startFireLining(made, {...request, lining: replacement}), 6);
    const plainWorn = restore(wearBreastplate(plain, wearer, plate));
    assert.equal(hit(plainWorn, 'fire'), 25);
    assert.equal(settleHeatExposure(plainWorn, {wearer, dose: 20}).damage, 15);

    const inscribed = advance(startLiningInscription(made,
        {id: 'mark-dense', wearer, lining: replacement, pattern: 'fireproof'}), 6);
    const fitted = advance(startFireLining(inscribed, {...request, lining: replacement}), 9);
    const worn = restore(wearBreastplate(fitted, wearer, plate));
    assert.equal(hit(worn, 'fire'), 16);
    assert.equal(settleHeatExposure(worn, {wearer, dose: 20}).damage, 12);
    assert.deepEqual(readLineage(worn.world, replacement)[0].parents, [scrap]);
    assert.deepEqual(readLineage(worn.world, scrap)[0].parents, [lining]);
});

test('blending two recovered lots preserves both sources and changes sustained heat after restore', () => {
    const scrap = 'dense-scrap', second = 'plain-scrap', plain = 'plain-liner';
    const source = applyEngineOps(workshop(), [
        {op: 'property', holder: lining, property: 'marks', value: ['matching-seams', 'dense-weave']},
        {op: 'property', holder: lining, property: 'workshop.fiber_insulation', value: 60},
        {op: 'carry', holder: lining, quantity: 'condition', amount: 30},
        {op: 'holder_add', value: {id: plain, kind: 'thing', as: ['heatproof_lining'], place,
            quantities: {[LINING_STOCK]: 1, condition: 30}, properties: {'workshop.held_by': wearer}}},
    ], 'fixture:blend-cloth');
    const first = salvageLooseLining(source, {wearer, lining, scrapId: scrap}).engine;
    const recovered = salvageLooseLining(first, {wearer, lining: plain, scrapId: second}).engine;
    assert.throws(() => startLiningReweave(recovered, {id: 'duplicate', wearer, scrap, second: scrap}), /distinct/);
    const pending = startLiningReweave(recovered, {id: 'blend', wearer, scrap, second});
    const moved = applyEngineOps(pending, [{op: 'move', holder: second, to: 'hall'}], 'fixture:second-moved');
    const stopped = advance(restore(moved), 3);
    assert.equal(stopped.records.workings.blend.record.status, 'interrupted');
    for (const lot of [scrap, second]) assert.equal(stopped.world.holders[lot].quantities[SALVAGE_STOCK], 1);
    assert.equal(stopped.world.holders[wearer].quantities[REPAIR_STOCK], 1);

    const made = advance(restore(advance(pending, 1)), 3);
    assert.deepEqual(serializeEngineWorld(made), serializeEngineWorld(advance(pending, 3)));
    const replacement = made.records.workings.blend.record.receipts[0].observed.output;
    assert.deepEqual(readLineage(made.world, replacement)[0].parents, [scrap, second]);
    for (const lot of [scrap, second]) assert.equal(made.world.holders[lot].quantities[SALVAGE_STOCK], 0);
    const fitted = advance(startFireLining(made, {...request, lining: replacement}), 6);
    const worn = restore(wearBreastplate(fitted, wearer, plate));
    assert.equal(settleHeatExposure(worn, {wearer, dose: 40}).damage, 30);
    assert.equal(hit(worn, 'fire'), 25);

    const weighted = engine => startLiningReweave(engine, {id: 'weighted', wearer, scrap, second, shares: [2, 1]});
    const short = advance(restore(weighted(recovered)), 3);
    assert.equal(short.records.workings.weighted.record.status, 'interrupted');
    assert.equal(short.world.holders[second].quantities[SALVAGE_STOCK], 1);
    assert.equal(short.world.holders[wearer].quantities[REPAIR_STOCK], 1);
    const stocked = applyEngineOps(recovered, [{op: 'add', holder: scrap, quantity: SALVAGE_STOCK, amount: 2}], 'fixture:larger-lot');
    const weightedPending = weighted(stocked);
    const weightedMade = advance(restore(advance(weightedPending, 1)), 3);
    assert.deepEqual(serializeEngineWorld(weightedMade), serializeEngineWorld(advance(weightedPending, 3)));
    const weightedLining = weightedMade.records.workings.weighted.record.receipts[0].observed.output;
    assert.deepEqual(readLineage(weightedMade.world, weightedLining)[0].parents, [scrap, second]);
    assert.equal(weightedMade.world.holders[scrap].quantities[SALVAGE_STOCK], 1);
    assert.equal(weightedMade.world.holders[second].quantities[SALVAGE_STOCK], 0);
    assert.equal(weightedMade.world.holders[weightedLining].quantities.condition, 85);
    const weightedFit = advance(startFireLining(weightedMade, {...request, lining: weightedLining}), 6);
    const weightedWorn = restore(wearBreastplate(weightedFit, wearer, plate));
    assert.equal(settleHeatExposure(weightedWorn, {wearer, dose: 40}).damage, 26);

    const detached = advance(startLiningDetachment(weightedWorn,
        {...request, id: 'unfit-weighted', lining: weightedLining}), 9);
    const recycled = 'recycled-blend';
    const recovery = salvageLooseLining(restore(detached), {wearer, lining: weightedLining, scrapId: recycled});
    assert.deepEqual(recovery.result, {reusable: 2, scrap: 1, loss: 0});
    assert.equal(recovery.engine.world.holders[weightedLining], undefined);
    assert.equal(recovery.engine.world.holders[recycled].quantities[SALVAGE_STOCK], 3);
    assert.deepEqual(readLineage(recovery.engine.world, recycled)[0].parents, [weightedLining]);

    const restocked = applyEngineOps(recovery.engine, [{op: 'add', holder: wearer, quantity: REPAIR_STOCK, amount: 1}], 'fixture:thread');
    const rewoven = advance(restore(startLiningReweave(restocked,
        {id: 'reuse-blend', wearer, scrap: recycled, second: scrap, shares: [2, 1]})), 12);
    const nextLining = rewoven.records.workings['reuse-blend'].record.receipts[0].observed.output;
    assert.equal(rewoven.world.holders[recycled].quantities[SALVAGE_STOCK], 1);
    assert.equal(rewoven.world.holders[nextLining].quantities.condition, 87);
    const refitted = advance(startFireLining(rewoven, {...request, id: 'refit-blend', lining: nextLining}), 15);
    assert.equal(settleHeatExposure(restore(refitted), {wearer, dose: 40}).damage, 24);
});

test('a borrower can mend an installed liner and return the improved assembly after restore', () => {
    const ready = applyEngineOps(workshop(), [
        {op: 'carry', holder: lining, quantity: 'condition', amount: 50},
        {op: 'property', holder: lining, property: 'workshop.heat_insulation', value: 20},
    ], 'fixture:worn-lining');
    const fitted = advance(startFireLining(ready, request), 3);
    const loan = lendBreastplate(fitted, {from: wearer, to: attacker, armor: plate});
    const borrowed = wearBreastplate(loan, attacker, plate);
    assert.equal(settleHeatExposure(borrowed, {wearer: attacker, dose: 20}).damage, 18);

    const repair = startLiningRepair(borrowed, {id: 'mend-loan', wearer: attacker, armor: plate, lining});
    const returnLoan = engine => returnBreastplate(engine, {from: attacker, to: wearer, armor: plate});
    const earlyReturn = advance(restore(returnLoan(repair)), 6);
    assert.equal(earlyReturn.records.workings['mend-loan'].record.status, 'interrupted');
    assert.equal(earlyReturn.world.holders[attacker].quantities[REPAIR_STOCK], 1);
    assert.equal(earlyReturn.world.holders[lining].quantities.condition, 50);

    const mended = advance(restore(advance(repair, 4)), 6);
    assert.deepEqual(serializeEngineWorld(mended), serializeEngineWorld(advance(repair, 6)));
    assert.equal(mended.world.holders[attacker].quantities[REPAIR_STOCK], 0);
    assert.equal(mended.world.holders[lining].quantities.condition, 75);
    assert.equal(mended.world.holders[lining].quantities[LINING_STOCK], 0);
    const returned = restore(wearBreastplate(returnLoan(mended), wearer, plate));
    assert.equal(returned.world.holders[plate].properties['workshop.fitted_lining'], lining);
    assert.equal(settleHeatExposure(returned, {wearer, dose: 20}).damage, 17);
    assert.equal(hit(returned, 'fire'), 17);
});

test('a timed armor removal changes the same mixed strike after restoring it in flight', () => {
    const fitted = advance(startFireLining(workshop(), request), 3);
    const worn = wearBreastplate(fitted, wearer, plate);
    const pending = startBreastplateRemoval(worn, {id: 'remove-plate', wearer, armor: plate});
    const settings = {defender: wearer, startedAt: 3, ticksPerMinute: 1};
    const begin = engine => beginContest(law, {id: 'matched-bout', seed: 7, place, entrants: [
        {id: attacker, body: attacker, side: 'red', profile: {attack: 100}, moves: ['mixed']},
        {id: wearer, body: wearer, side: 'blue', profile: {evasion: 1}, moves: ['wait']},
    ], limits: {landed: 1}}, engine.world);
    const ready = stepWorkshopContest(law, begin(pending), pending, settings);
    assert.equal(ready.record.entrants[attacker].working.status, 'running');
    assert.equal(ready.engine.world.holders[wearer].properties['workshop.worn_torso'], plate);
    const saved = restoreContest(law, serializeContest(ready.record));
    const finish = (record, engine) => {
        let state = {record, engine};
        while (!state.record.result) state = stepWorkshopContest(law, state.record, state.engine, settings);
        return state;
    };
    const removed = finish(saved, restore(ready.engine));
    const uninterrupted = finish(ready.record, ready.engine);
    assert.deepEqual(serializeEngineWorld(removed.engine), serializeEngineWorld(uninterrupted.engine));
    assert.deepEqual(removed.record, uninterrupted.record);
    const stillWorn = finish(saved, restore(worn));
    assert.equal(removed.engine.world.clock, 6);
    assert.equal(removed.engine.records.workings['remove-plate'].record.status, 'complete');
    assert.equal(removed.engine.world.holders[wearer].quantities.vitality, 69);
    assert.equal(stillWorn.engine.world.holders[wearer].quantities.vitality, 80);
    assert.equal(removed.engine.world.holders[plate].properties['workshop.fitted_lining'], lining);
});

test('recovering a generated inscription claims the existing part once and leaves its effect to appraisal and use', () => {
    const kiln = source => ({source, place: 'hall'});
    const start = workshop();
    const {id: found, engine: first} = placeRecoveredLining(start, kiln('kiln-a'));
    const {id: heatLiner, engine: cache} = placeRecoveredLining(first, kiln('kiln-e'));
    const reversed = placeRecoveredLining(placeRecoveredLining(start, kiln('kiln-e')).engine, kiln('kiln-a')).engine;
    assert.deepEqual(cache.world.holders[found], reversed.world.holders[found]);
    assert.deepEqual(cache.world.holders[heatLiner], reversed.world.holders[heatLiner]);
    const savedCache = restore(cache);
    assert.equal(placeRecoveredLining(savedCache, kiln('kiln-a')).engine, savedCache);
    const attempt = (engine, id, body) => startLiningRecovery(engine, {id, wearer: body, lining: found});
    const tooFar = advance(restore(attempt(cache, 'distant', wearer)), 3);
    assert.equal(tooFar.records.workings.distant.record.status, 'interrupted');
    assert.equal(tooFar.world.holders[found].properties['workshop.held_by'], undefined);

    const approach = (engine, body) => crossHeatedLink(engine, {wearer: body, link: 'kiln-walk'}).engine;
    const inReach = approach(approach(cache, wearer), attacker);
    const pending = attempt(attempt(inReach, 'a-recover', wearer), 'b-recover', attacker);
    const due = pending.world.clock + 3;
    const claimed = advance(restore(advance(pending, due - 2)), due);
    assert.deepEqual(serializeEngineWorld(claimed), serializeEngineWorld(advance(pending, due)));
    assert.equal(claimed.records.workings['a-recover'].record.status, 'complete');
    assert.equal(claimed.records.workings['b-recover'].record.status, 'interrupted');
    assert.equal(claimed.world.holders[found].properties['workshop.held_by'], wearer);
    assert.equal(claimed.world.holders[found].quantities[LINING_STOCK], 1);
    assert.equal(claimed.world.holders[wearer].quantities[INSCRIPTION_STOCK], 10);
    assert.equal(knownLiningResistance(claimed.world, wearer, found), undefined);
    const inspected = restore(appraiseLining(claimed, {observer: wearer, lining: found}));
    assert.equal(knownLiningResistance(inspected.world, wearer, found), 40);
    assert.equal(knownLiningResistance(inspected.world, attacker, found), undefined);

    const both = advance(startLiningRecovery(inspected, {id: 'recover-heat', wearer, lining: heatLiner}), due + 3);
    const atBench = approach(approach(both, wearer), attacker);
    assert.equal(atBench.world.holders[found].place, place);
    const fitted = advance(restore(startFireLining(atBench, {...request, lining: found})), atBench.world.clock + 3);
    const worn = wearBreastplate(fitted, wearer, plate);
    assert.deepEqual(hits(restore(worn)), {cut: 25, fire: 15, mixed: 20});
    assert.equal(worn.world.holders[plate].properties['workshop.fitted_lining'], found);
    assert.equal(settleHeatExposure(worn, {wearer, dose: 20}).damage, 20);

    const swapped = advance(restore(startFireLining(worn, {...request, id: 'swap', previous: found, lining: heatLiner})),
        worn.world.clock + 3);
    assert.deepEqual(hits(restore(swapped)), {cut: 25, fire: 25, mixed: 25});
    assert.equal(settleHeatExposure(swapped, {wearer, dose: 20}).damage, 16);
    const tattered = applyEngineOps(swapped, [{op: 'add', holder: found, quantity: 'condition', amount: -100}], 'fixture:wear');
    const retired = restore(salvageLooseLining(tattered, {wearer, lining: found}).engine);
    assert.equal(retired.world.holders[found], undefined);
    assert.equal(placeRecoveredLining(retired, kiln('kiln-a')).engine, retired);
});
