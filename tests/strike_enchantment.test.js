import assert from 'node:assert/strict';
import test from 'node:test';
import {beginContest, defineContestLaw, restoreContest, runContest, serializeContest} from '../src/contest.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {crossHeatedLink, fireLiningConfig} from '../src/world_packs/fire_resistant_lining.js';
import {bindStrikeEnchantment, breakStrikeWeapon, giveStrikeWeapon, rechargeStrikeEnchantment, reinkFuelStrikeEnchantment, startStrikeAttunement,
    startStrikeEdgeInscription, STRIKE_EDGE_INK,
    startStrikeFuelLoading, startStrikeWeaponRepair, startStrikeWeaponService, STRIKE_ATTUNEMENT_STOCK, STRIKE_FUEL,
    STRIKE_REFERENCE_LOAD, STRIKE_REPAIR_LAW, STRIKE_REPAIR_MATERIAL, STRIKE_REPAIR_STOCK, STRIKE_SERVICE_YIELD,
    STRIKE_WEAR, strikeEnchantmentPorts, strikeEnchantmentShared,
    strikeWeaponWearPack, wearStrikeWeapon}
    from '../src/world_packs/strike_enchantment.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';
import {stepWorkshopContest, workshopContestResolvers} from '../src/world_packs/workshop_contest.js';

const config = {packs: ['c.contest', strikeWeaponWearPack.id], ownPacks: [strikeWeaponWearPack],
    shared: {quantities: [WORLD_QUANTITIES.stock], properties: [
    ...strikeEnchantmentShared.properties, ...fireLiningConfig.shared.properties,
]}, host: {laws: [STRIKE_REPAIR_LAW], ports: {stored: strikeEnchantmentPorts}}};
const bearer = 'smith', foe = 'rival', weapon = 'blade', id = 'strike-rune', place = 'yard';
const ink = 'stock:strike_ink';
const law = defineContestLaw({id: 'c.workshop-strike', revision: 1, moves: {
    strike: {resolver: 'strike', steps: [3], power: 20},
}});

function beginDuel(engine, actor = bearer, contestLaw = law) {
    const entrants = [bearer, foe].map(body => ({
        id: body, body, side: body, profile: {attack: 100, evasion: 1}, moves: [body === actor ? 'strike' : 'wait'],
    }));
    const site = engine.world.holders[actor].place;
    return beginContest(contestLaw, {id: 'bout', seed: 7, place: site, entrants, limits: {landed: 1}}, engine.world);
}

function duel(engine, actor = bearer) {
    const record = beginDuel(engine, actor);
    return {...engine, world: runContest(law, record, engine.rules, engine.world).world};
}

function setup() {
    return createEngineWorld({...config, links: [{id: 'pass', kind: 'heated-path', from: place, to: 'hall', cost: 2}], holders: [
        {id: place, kind: 'place'},
        {id: 'hall', kind: 'place'},
        ...[bearer, foe].map(id => ({id, kind: 'body', place, quantities: {vitality: 100, [ink]: 2}})),
        {id: weapon, kind: 'thing', place, as: ['weapon'], properties: {'workshop.held_by': bearer}},
    ]});
}
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const advance = (engine, at) => advanceEngineWorld(engine, at).engine;

test('a paid edge mark changes the original cut only while the exact blade is worn', t => {
    const cutLaw = defineContestLaw({id: 'workshop.edge_bout', revision: 1, resolvers: workshopContestResolvers, moves: {
        strike: {resolver: 'bladeCut', steps: [3], power: 20, damageTypes: {slashing: 1}},
    }});
    const ready = wearStrikeWeapon(applyEngineOps(setup(), [
        {op: 'carry', holder: bearer, quantity: STRIKE_EDGE_INK, amount: 2},
        {op: 'carry', holder: weapon, quantity: 'condition', amount: 100},
    ], 'fixture:passive-edge'), {weapon, bearer});
    const inscribe = (engine, id) => startStrikeEdgeInscription(engine, {id, weapon, bearer});
    const pending = inscribe(inscribe(ready, 'edge'), 'edge-again');
    const changedHands = giveStrikeWeapon(pending, {weapon, from: bearer, to: foe});
    assert.equal(advance(restore(changedHands), 3).world.holders[bearer].quantities[STRIKE_EDGE_INK], 2);
    const marked = advance(restore(advance(pending, 1)), 3);
    assert.equal(marked.records.workings.edge.record.status, 'complete');
    assert.equal(marked.records.workings['edge-again'].record.status, 'interrupted');
    assert.equal(marked.world.holders[bearer].quantities[STRIKE_EDGE_INK], 1);
    const settings = {defender: foe, startedAt: 3, ticksPerMinute: 1};
    const record = beginDuel(marked, bearer, cutLaw);
    let opening = {record, engine: marked};
    while (!opening.record.entrants[bearer].working)
        opening = stepWorkshopContest(cutLaw, opening.record, opening.engine, settings);
    const damage = engine => {
        let state = {record: restoreContest(cutLaw, serializeContest(opening.record)), engine: restore(engine)};
        while (!state.record.result) state = stepWorkshopContest(cutLaw, state.record, state.engine, settings);
        return 100 - state.engine.world.holders[foe].quantities.vitality;
    };
    const ordinary = damage(advance(ready, 3));
    const sharpened = damage(opening.engine);
    const worn = damage(applyEngineOps(opening.engine, [{op: 'set', holder: weapon, quantity: 'condition', amount: 50}],
        'fixture:worn-edge'));
    assert.ok(ordinary < worn && worn < sharpened);
    assert.equal(damage(wearStrikeWeapon(opening.engine, {bearer})), ordinary);
    t.diagnostic(`Cut damage at the matched draw: plain ${ordinary}, worn edge ${worn}, full edge ${sharpened}.`);
});

test('an equipped strike inscription spends charge on the actual target of its bearer’s saved blow', () => {
    const base = setup();
    const inscribe = engine => bindStrikeEnchantment(engine, {id, weapon, bearer, charge: 1, power: 5});
    const wear = engine => wearStrikeWeapon(engine, {weapon, bearer});
    const bound = wear(inscribe(base));
    const hit = duel(bound);
    const vitality = hit.world.holders[foe].quantities.vitality;
    assert.ok(vitality < 100);
    assert.equal(hit.records.stored[id].charge.now, 1);
    const fired = advance(restore(hit), 1);
    assert.deepEqual(serializeEngineWorld(fired), serializeEngineWorld(advance(hit, 1)));
    assert.equal(fired.world.holders[foe].quantities.vitality, vitality - 5);
    assert.equal(fired.records.stored[id].charge.now, 0);
    assert.equal(advance(restore(fired), 2).world.holders[foe].quantities.vitality, vitality - 5);
    assert.equal(advance(duel(fired), 2).records.stored[id].receipts.at(-1).reason, 'charge');

    const unrelated = advance(restore(duel(bound, foe)), 1);
    assert.equal(unrelated.records.stored[id].charge.now, 1);
    const retroactive = advance(wear(inscribe(duel(base))), 1);
    assert.equal(retroactive.world.holders[foe].quantities.vitality, vitality);
    assert.equal(retroactive.records.stored[id].charge.now, 1);
    const unequipped = wearStrikeWeapon(hit, {bearer});
    assert.equal(advance(restore(unequipped), 1).records.stored[id].charge.now, 1);
    const reequipped = advance(wear(unequipped), 1);
    assert.equal(reequipped.records.stored[id].charge.now, 1);
});

test('the exact weapon carries its stored charge through a crossing and fires at the destination', () => {
    const bound = bindStrikeEnchantment(setup(), {id, weapon, bearer, charge: 2, power: 5});
    const worn = wearStrikeWeapon(bound, {weapon, bearer});
    const cross = (engine, wearer) => {
        const result = crossHeatedLink(engine, {wearer, link: 'pass'});
        assert.equal(result.crossed, true);
        return result.engine;
    };
    const arrived = restore(cross(cross(worn, bearer), foe));
    assert.equal(arrived.world.holders[weapon].place, 'hall');
    assert.equal(arrived.records.stored[id].carrier, weapon);
    assert.equal(arrived.records.stored[id].charge.now, 2);

    const hit = duel(arrived);
    const fired = advance(restore(hit), 5);
    assert.deepEqual(serializeEngineWorld(fired), serializeEngineWorld(advance(hit, 5)));
    assert.equal(fired.world.holders[foe].quantities.vitality, hit.world.holders[foe].quantities.vitality - 5);
    assert.equal(fired.records.stored[id].charge.now, 1);

    const roundTrip = traveler => {
        const ops = [traveler, ...(traveler === bearer ? [weapon] : [])]
            .flatMap(holder => ['yard', 'hall'].map(to => ({op: 'move', holder, to})));
        return applyEngineOps(hit, ops, 'fixture:quick-round-trip');
    };
    for (const traveler of [bearer, foe]) {
        const cleared = advance(restore(roundTrip(traveler)), 5);
        assert.equal(cleared.records.stored[id].charge.now, 2);
        assert.equal(cleared.world.holders[foe].quantities.vitality, hit.world.holders[foe].quantities.vitality);
    }
});

test('a full-pulse inscription saves a short charge for later while a repeating mark spends it', () => {
    const ready = requiresFullPulse => wearStrikeWeapon(bindStrikeEnchantment(setup(), {
        id, weapon, bearer, charge: 4, per: 3, power: 9, requiresFullPulse, recharge: {quantity: ink, rate: 1},
    }), {weapon, bearer});
    const vitality = engine => engine.world.holders[foe].quantities.vitality;
    const charge = engine => engine.records.stored[id].charge.now;
    const shortHit = requiresFullPulse => {
        const first = duel(ready(requiresFullPulse));
        const fired = advance(restore(first), 1);
        assert.equal(vitality(first) - vitality(fired), 9);
        assert.equal(charge(fired), 1);
        return duel(fired);
    };
    const repeating = shortHit(false);
    const partial = advance(restore(repeating), 2);
    assert.equal(vitality(repeating) - vitality(partial), 3);
    assert.equal(charge(partial), 0);

    const held = shortHit(true);
    const dormant = advance(restore(held), 2);
    assert.deepEqual(serializeEngineWorld(dormant), serializeEngineWorld(advance(held, 2)));
    assert.equal(vitality(dormant), vitality(held));
    assert.equal(charge(dormant), 1);
    assert.equal(dormant.records.stored[id].receipts.at(-1).reason, 'charge');
    const refilled = rechargeStrikeEnchantment(restore(dormant), {id, bearer, amount: 2});
    assert.equal(refilled.world.holders[bearer].quantities[ink], 0);
    const quiet = advance(restore(refilled), 3);
    assert.equal(vitality(quiet), vitality(dormant));
    assert.equal(charge(quiet), 3);
    const fresh = duel(quiet);
    const full = advance(restore(fresh), 4);
    assert.equal(vitality(fresh) - vitality(full), 9);
    assert.equal(charge(full), 0);
});

test('a strike inscription spends physical fuel from the blade after a saved loading job and transfer', () => {
    const stock = applyEngineOps(setup(), [
        {op: 'carry', holder: weapon, quantity: STRIKE_FUEL, amount: 0},
        {op: 'carry', holder: bearer, quantity: STRIKE_FUEL, amount: 4},
    ], 'fixture:blade-fuel');
    const bound = bindStrikeEnchantment(stock, {id, weapon, bearer, per: 2, power: 8, fuelRate: 2, requiresFullPulse: true});
    const equipped = wearStrikeWeapon(bound, {weapon, bearer});
    const first = duel(equipped);
    const empty = advance(restore(first), 1);
    assert.equal(empty.world.holders[foe].quantities.vitality, first.world.holders[foe].quantities.vitality);
    assert.equal(empty.records.stored[id].receipts.at(-1).reason, 'charge');

    const load = (engine, job) => startStrikeFuelLoading(engine, {id: job, inscription: id, bearer, amount: 4});
    const loading = load(load(empty, 'load-fuel'), 'load-fuel-again');
    const givenEarly = giveStrikeWeapon(loading, {weapon, from: bearer, to: foe});
    const interrupted = advance(restore(givenEarly), 4);
    assert.equal(interrupted.records.workings['load-fuel'].record.status, 'interrupted');
    assert.equal(interrupted.world.holders[bearer].quantities[STRIKE_FUEL], 4);
    const loaded = advance(restore(advance(loading, 2)), 4);
    assert.deepEqual(serializeEngineWorld(loaded), serializeEngineWorld(advance(loading, 4)));
    assert.equal(loaded.records.workings['load-fuel-again'].record.status, 'interrupted');
    assert.equal(loaded.world.holders[bearer].quantities[STRIKE_FUEL], 0);
    assert.equal(loaded.world.holders[weapon].quantities[STRIKE_FUEL], 4);
    assert.equal(loaded.world.holders[foe].quantities.vitality, empty.world.holders[foe].quantities.vitality);

    const given = giveStrikeWeapon(restore(loaded), {weapon, from: bearer, to: foe});
    const fresh = duel(wearStrikeWeapon(given, {weapon, bearer: foe}), foe);
    const fired = advance(restore(fresh), 5);
    assert.equal(fresh.world.holders[bearer].quantities.vitality - fired.world.holders[bearer].quantities.vitality, 8);
    assert.equal(fired.world.holders[weapon].quantities[STRIKE_FUEL], 0);
    assert.equal(fired.records.stored[id].receipts.at(-1).cost, 4);
    const noFuel = duel(fired, foe);
    assert.equal(advance(restore(noFuel), 6).world.holders[bearer].quantities.vitality,
        noFuel.world.holders[bearer].quantities.vitality);
});

test('re-inking a repaired fuel-fed blade keeps its fuel and skips earlier blows', () => {
    const stock = applyEngineOps(setup(), [
        {op: 'carry', holder: weapon, quantity: STRIKE_FUEL, amount: 4},
        {op: 'carry', holder: bearer, quantity: STRIKE_REPAIR_STOCK, amount: 1},
    ], 'fixture:reink-fuel-blade');
    const bound = bindStrikeEnchantment(stock, {id, weapon, bearer, per: 2, power: 8, fuelRate: 2,
        requiresFullPulse: true, reink: {quantity: ink, price: 2}});
    const pending = duel(wearStrikeWeapon(bound, {weapon, bearer}));
    const broken = breakStrikeWeapon(restore(pending), {id, bearer});
    const reink = engine => reinkFuelStrikeEnchantment(engine, {id: 'relaid', previous: id, bearer});
    assert.throws(() => reink(broken), /repaired blade/);
    const repairing = startStrikeWeaponRepair(broken, {id: 'repair-fuel-blade', weapon, bearer});
    const repaired = advance(restore(advance(repairing, 1)), 3);
    const poor = applyEngineOps(repaired, [{op: 'add', holder: bearer, quantity: ink, amount: -1}], 'fixture:short-ink');
    assert.throws(() => reink(poor), /enough material/);
    const beforeReink = duel(repaired);
    const relaid = restore(reink(beforeReink));
    assert.equal(relaid.records.stored.relaid.relaidFrom, id);
    assert.equal(relaid.records.stored[id].status, 'broken');
    assert.equal(relaid.world.holders[weapon].quantities[STRIKE_FUEL], 4);
    assert.equal(relaid.world.holders[bearer].quantities[ink], 0);
    assert.throws(() => reinkFuelStrikeEnchantment(relaid, {id: 'duplicate', previous: id, bearer}), /repaired blade/);
    const quiet = advance(restore(relaid), 4);
    assert.equal(quiet.world.holders[foe].quantities.vitality, beforeReink.world.holders[foe].quantities.vitality);
    const fresh = duel(quiet);
    const fired = advance(restore(fresh), 5);
    assert.equal(fresh.world.holders[foe].quantities.vitality - fired.world.holders[foe].quantities.vitality, 8);
    assert.equal(fired.world.holders[weapon].quantities[STRIKE_FUEL], 0);
});

test('a strike inscription spares the marked target at its saved pulse without spending charge', () => {
    const ready = bindStrikeEnchantment(setup(), {id, weapon, bearer, charge: 1, power: 5, bypassMarks: ['truce']});
    const hit = duel(wearStrikeWeapon(ready, {weapon, bearer}));
    const vitality = hit.world.holders[foe].quantities.vitality;
    const mark = (engine, who, marks) => applyEngineOps(engine,
        [{op: 'property', holder: who, property: 'marks', value: marks}], 'fixture:truce-mark');
    const shielded = mark(hit, foe, ['truce']);
    const bypassed = advance(restore(shielded), 1);
    assert.deepEqual(serializeEngineWorld(bypassed), serializeEngineWorld(advance(shielded, 1)));
    assert.equal(bypassed.world.holders[foe].quantities.vitality, vitality);
    assert.equal(bypassed.records.stored[id].charge.now, 1);
    assert.equal(bypassed.records.stored[id].receipts.at(-1).reason, 'key');

    const bearerMarked = advance(restore(mark(hit, bearer, ['truce'])), 1);
    assert.equal(bearerMarked.world.holders[foe].quantities.vitality, vitality - 5);
    assert.equal(bearerMarked.records.stored[id].charge.now, 0);
    const unmarked = mark(bypassed, foe, []);
    const quiet = advance(restore(unmarked), 2);
    assert.equal(quiet.world.holders[foe].quantities.vitality, vitality);
    assert.equal(quiet.records.stored[id].charge.now, 1);
    const fresh = duel(quiet);
    const fired = advance(restore(fresh), 3);
    assert.equal(fired.world.holders[foe].quantities.vitality, fresh.world.holders[foe].quantities.vitality - 5);
    assert.equal(fired.records.stored[id].charge.now, 0);
});

test('transfer carries the charge, excludes old blows and lets the new bearer pay to recharge', () => {
    const bound = bindStrikeEnchantment(setup(), {id, weapon, bearer, charge: 1, power: 5, recharge: {quantity: ink, rate: 2}});
    const pending = duel(wearStrikeWeapon(bound, {weapon, bearer}));
    const given = giveStrikeWeapon(restore(pending), {weapon, from: bearer, to: foe});
    assert.equal(given.world.holders[bearer].properties['workshop.strike_weapon'], undefined);
    const equipped = wearStrikeWeapon(given, {weapon, bearer: foe});
    const afterOldBlow = advance(restore(equipped), 1);
    assert.equal(afterOldBlow.world.holders[foe].quantities.vitality, pending.world.holders[foe].quantities.vitality);
    assert.equal(afterOldBlow.records.stored[id].charge.now, 1);

    const hit = duel(afterOldBlow, foe);
    const fired = advance(restore(hit), 2);
    assert.equal(fired.world.holders[bearer].quantities.vitality, hit.world.holders[bearer].quantities.vitality - 5);
    assert.equal(fired.records.stored[id].charge.now, 0);
    assert.throws(() => rechargeStrikeEnchantment(fired, {id, bearer, amount: 1}), /hold the weapon/i);
    const recharged = restore(rechargeStrikeEnchantment(fired, {id, bearer: foe, amount: 1}));
    assert.equal(recharged.world.holders[foe].quantities[ink], 0);
    assert.equal(recharged.world.holders[bearer].quantities[ink], 2);
    const nextHit = duel(recharged, foe);
    const nextPulse = advance(restore(nextHit), 3);
    assert.equal(nextPulse.world.holders[bearer].quantities.vitality, nextHit.world.holders[bearer].quantities.vitality - 5);
    assert.equal(nextPulse.records.stored[id].charge.now, 0);
});

test('repair and paid renewal recover the strike mark without replaying an old blow', () => {
    const stock = applyEngineOps(setup(), [{op: 'carry', holder: bearer, quantity: STRIKE_REPAIR_STOCK, amount: 2}],
        'fixture:blade-repair-supply');
    const bound = bindStrikeEnchantment(stock, {id, weapon, bearer, charge: 2, power: 5,
        renew: {quantity: ink, price: 2}});
    const worn = wearStrikeWeapon(bound, {weapon, bearer});
    const spent = advance(duel(worn), 1);
    const pending = duel(spent);
    const broken = breakStrikeWeapon(restore(pending), {id, bearer});
    const vitality = engine => engine.world.holders[foe].quantities.vitality;
    const renew = engine => rechargeStrikeEnchantment(engine, {id, bearer, renew: true});
    const refused = renew(restore(broken));
    assert.equal(refused.records.stored[id].status, 'broken');
    assert.equal(refused.world.holders[bearer].quantities[ink], 2);
    const repair = (engine, job) => startStrikeWeaponRepair(engine, {id: job, weapon, bearer});
    const repairing = repair(repair(refused, 'repair'), 'repair-again');
    const given = giveStrikeWeapon(repairing, {weapon, from: bearer, to: foe});
    const interrupted = advance(restore(given), 4);
    assert.equal(interrupted.records.workings.repair.record.status, 'interrupted');
    assert.equal(interrupted.world.holders[bearer].quantities[STRIKE_REPAIR_STOCK], 2);

    const repaired = advance(restore(advance(repairing, 2)), 4);
    assert.deepEqual(serializeEngineWorld(repaired), serializeEngineWorld(advance(repairing, 4)));
    assert.equal(repaired.records.workings['repair-again'].record.status, 'interrupted');
    assert.equal(repaired.world.holders[bearer].quantities[STRIKE_REPAIR_STOCK], 1);
    assert.equal(repaired.records.stored[id].status, 'broken');
    assert.equal(vitality(repaired), vitality(pending));
    const renewed = renew(restore(repaired));
    assert.equal(renewed.world.holders[bearer].quantities[ink], 0);
    assert.equal(renewed.records.stored[id].charge.now, 2);
    const quiet = advance(restore(renewed), 5);
    assert.equal(vitality(quiet), vitality(pending));
    assert.equal(quiet.records.stored[id].charge.now, 2);
    const hit = duel(quiet);
    const fired = advance(restore(hit), 6);
    assert.equal(vitality(fired), vitality(hit) - 5);
    assert.equal(fired.records.stored[id].charge.now, 1);
});

test('a transferred personal inscription answers fresh blows after a saved paid retuning', () => {
    const stocked = applyEngineOps(setup(), [{op: 'carry', holder: foe, quantity: STRIKE_ATTUNEMENT_STOCK, amount: 2}],
        'fixture:retuning-ink');
    const bound = bindStrikeEnchantment(stocked, {id, weapon, bearer, charge: 2, power: 5, attuned: true});
    const ownerHit = duel(wearStrikeWeapon(bound, {weapon, bearer}));
    const ownerPulse = advance(restore(ownerHit), 1);
    assert.equal(ownerPulse.world.holders[foe].quantities.vitality, ownerHit.world.holders[foe].quantities.vitality - 5);
    const given = giveStrikeWeapon(restore(ownerPulse), {weapon, from: bearer, to: foe});
    const equipped = wearStrikeWeapon(given, {weapon, bearer: foe});
    const start = (engine, job) => startStrikeAttunement(engine, {id: job, inscription: id, bearer: foe});
    const pending = start(start(equipped, 'retune'), 'retune-again');
    const returned = giveStrikeWeapon(restore(pending), {weapon, from: foe, to: bearer});
    const interrupted = advance(returned, 4);
    assert.equal(interrupted.records.workings.retune.record.status, 'interrupted');
    assert.equal(interrupted.world.holders[foe].quantities[STRIKE_ATTUNEMENT_STOCK], 2);

    const untunedHit = duel(advance(restore(pending), 3), foe);
    const tuned = advance(restore(untunedHit), 4);
    assert.deepEqual(serializeEngineWorld(tuned), serializeEngineWorld(advance(untunedHit, 4)));
    assert.equal(tuned.records.workings.retune.record.status, 'complete');
    assert.equal(tuned.records.workings['retune-again'].record.status, 'interrupted');
    assert.equal(tuned.world.holders[foe].quantities[STRIKE_ATTUNEMENT_STOCK], 1);
    assert.equal(tuned.records.stored[id].charge.now, 1);
    assert.equal(tuned.world.holders[bearer].quantities.vitality, untunedHit.world.holders[bearer].quantities.vitality);
    const fresh = duel(restore(tuned), foe);
    const fired = advance(restore(fresh), 5);
    assert.equal(fired.world.holders[bearer].quantities.vitality, fresh.world.holders[bearer].quantities.vitality - 5);
    assert.equal(fired.records.stored[id].charge.now, 0);
});

test('servicing a worn blade prevents fracture without replacing or refilling its inscription', () => {
    const blade = applyEngineOps(setup(), [
        {op: 'carry', holder: weapon, quantity: 'condition', amount: 40},
        {op: 'property', holder: weapon, property: STRIKE_WEAR, value: 20},
        {op: 'carry', holder: bearer, quantity: STRIKE_REPAIR_STOCK, amount: 2},
    ], 'fixture:serviceable-blade');
    const worn = wearStrikeWeapon(bindStrikeEnchantment(blade, {id, weapon, bearer, charge: 2, power: 5}), {weapon, bearer});
    const first = advance(restore(duel(worn)), 1);
    assert.equal(first.world.holders[weapon].quantities.condition, 20);
    assert.equal(first.records.stored[id].charge.now, 1);
    const service = (engine, job) => startStrikeWeaponService(engine, {id: job, weapon, bearer});
    const pending = service(service(first, 'service'), 'service-again');
    const away = giveStrikeWeapon(pending, {weapon, from: bearer, to: foe});
    const stopped = advance(restore(away), 4);
    assert.equal(stopped.records.workings.service.record.status, 'interrupted');
    assert.equal(stopped.world.holders[bearer].quantities[STRIKE_REPAIR_STOCK], 2);
    const fixed = advance(restore(advance(pending, 2)), 4);
    assert.deepEqual(serializeEngineWorld(fixed), serializeEngineWorld(advance(pending, 4)));
    assert.equal(fixed.records.workings.service.record.status, 'complete');
    assert.equal(fixed.records.workings['service-again'].record.status, 'interrupted');
    assert.equal(fixed.world.holders[bearer].quantities[STRIKE_REPAIR_STOCK], 1);
    assert.deepEqual(fixed.records.stored, advance(first, 4).records.stored);

    const untreated = duel(advance(first, 4));
    const maintained = duel(fixed);
    assert.equal(maintained.world.holders[foe].quantities.vitality, untreated.world.holders[foe].quantities.vitality);
    const fractured = advance(restore(untreated), 5);
    const fired = advance(restore(maintained), 5);
    assert.equal(fractured.records.stored[id].status, 'broken');
    assert.equal(fractured.records.stored[id].charge.now, 1);
    assert.equal(fired.world.holders[weapon].quantities.condition, 80);
    assert.equal(fired.records.stored[id].charge.now, 0);
    assert.equal(fractured.world.holders[foe].quantities.vitality - fired.world.holders[foe].quantities.vitality, 5);
});

test('the exact repair lot controls how much wear the serviced blade can take', () => {
    const lot = (id, material, yieldPerUnit) => ({op: 'holder_add', value: {
        id, kind: 'thing', as: ['workshop_blade_service_lot'], place,
        quantities: {[STRIKE_REPAIR_STOCK]: 1},
        properties: {'workshop.held_by': bearer, [STRIKE_REPAIR_MATERIAL]: material, [STRIKE_SERVICE_YIELD]: yieldPerUnit},
    }});
    const ready = applyEngineOps(setup(), [
        {op: 'carry', holder: weapon, quantity: 'condition', amount: 10},
        {op: 'property', holder: weapon, property: STRIKE_WEAR, value: 20},
        {op: 'property', holder: weapon, property: STRIKE_REPAIR_MATERIAL, value: 'iron'},
        {op: 'carry', holder: bearer, quantity: STRIKE_REPAIR_STOCK, amount: 1},
        lot('soft-iron', 'iron', 5), lot('tempered-iron', 'iron', 25), lot('bronze', 'bronze', 50),
    ], 'fixture:measured-service-supplies');
    const engine = wearStrikeWeapon(bindStrikeEnchantment(ready, {id, weapon, bearer, charge: 1, power: 5}), {weapon, bearer});
    const service = (engine, supply, id = 'service') => startStrikeWeaponService(engine, {id, weapon, bearer, supply});
    const pending = service(engine, 'tempered-iron');
    const moved = applyEngineOps(pending, [{op: 'move', holder: 'tempered-iron', to: 'hall'}], 'fixture:move-repair-lot');
    for (const refused of [moved, service(engine, 'bronze'), service(engine)]) {
        const stopped = advance(restore(refused), 3);
        assert.equal(stopped.records.workings.service.record.status, 'interrupted');
        assert.equal(stopped.world.holders[weapon].quantities.condition, 10);
        for (const holder of [bearer, 'tempered-iron', 'bronze'])
            assert.equal(stopped.world.holders[holder].quantities[STRIKE_REPAIR_STOCK], 1);
    }
    const competing = service(pending, 'tempered-iron', 'service-again');
    const tempered = advance(restore(advance(competing, 1)), 3);
    assert.deepEqual(serializeEngineWorld(tempered), serializeEngineWorld(advance(competing, 3)));
    assert.equal(tempered.records.workings['service-again'].record.status, 'interrupted');
    const soft = advance(restore(service(engine, 'soft-iron')), 3);
    for (const [serviced, supply, condition, extra] of [[soft, 'soft-iron', 15, 0], [tempered, 'tempered-iron', 35, 5]]) {
        assert.equal(serviced.world.holders[weapon].quantities.condition, condition);
        assert.equal(serviced.world.holders[supply].quantities[STRIKE_REPAIR_STOCK], 0);
        assert.equal(serviced.records.stored[id].charge.now, 1);
        const blow = duel(serviced);
        const settled = advance(restore(blow), 4);
        assert.equal(blow.world.holders[foe].quantities.vitality - settled.world.holders[foe].quantities.vitality, extra);
        assert.equal(settled.records.stored[id].charge.now, extra ? 0 : 1);
    }
});

test('a saved contest blow wears the equipped blade and a fracture stops its pending pulse', () => {
    const make = condition => {
        const blade = applyEngineOps(setup(), [
            {op: 'carry', holder: weapon, quantity: 'condition', amount: condition},
            {op: 'property', holder: weapon, property: STRIKE_WEAR, value: 20},
            {op: 'carry', holder: bearer, quantity: STRIKE_REPAIR_STOCK, amount: 1},
        ], 'fixture:wearing-strike-blade');
        return wearStrikeWeapon(bindStrikeEnchantment(blade, {id, weapon, bearer, charge: 2, power: 5,
            renew: {quantity: ink, price: 2}}), {weapon, bearer});
    };
    const settings = {defender: foe, startedAt: 0, ticksPerMinute: 1};
    const finish = (state, step) => {
        while (!state.record.result) state = step(state);
        return state;
    };
    const blow = (engine, contestLaw = law) => {
        const step = ({record, engine}) => stepWorkshopContest(contestLaw, record, engine, settings);
        const pending = step(step({record: beginDuel(engine, bearer, contestLaw), engine}));
        assert.equal(pending.record.entrants[bearer].working.status, 'running');
        const resumed = finish({record: restoreContest(contestLaw, serializeContest(pending.record)), engine: restore(pending.engine)}, step);
        assert.deepEqual(serializeEngineWorld(resumed.engine), serializeEngineWorld(finish(pending, step).engine));
        return resumed.engine;
    };
    const sound = blow(make(21));
    const fractured = blow(make(20));
    const health = engine => engine.world.holders[foe].quantities.vitality;
    assert.equal(health(fractured), health(sound));
    assert.equal(sound.world.holders[weapon].quantities.condition, 1);
    assert.equal(fractured.world.holders[weapon].quantities.condition, 0);
    assert.equal(fractured.world.holders[weapon].properties.broken, true);
    assert.throws(() => rechargeStrikeEnchantment(fractured, {id, bearer, renew: true}), /repair the broken blade/i);
    const soundPulse = advance(restore(sound), 4);
    const quiet = advance(restore(fractured), 4);
    assert.equal(health(soundPulse), health(sound) - 5);
    assert.equal(health(quiet), health(fractured));
    assert.equal(quiet.records.stored[id].charge.now, 2);
    assert.equal(quiet.records.stored[id].status, 'broken');
    const unrelated = advance(duel(make(20), foe), 1);
    assert.equal(unrelated.world.holders[weapon].quantities.condition, 20);

    const repair = startStrikeWeaponRepair(quiet, {id: 'repair-worn', weapon, bearer});
    const fixed = advance(restore(repair), 7);
    assert.equal(fixed.world.holders[weapon].quantities.condition, 100);
    const renewed = rechargeStrikeEnchantment(fixed, {id, bearer, renew: true});
    const freshHit = duel(restore(renewed));
    assert.equal(freshHit.world.holders[weapon].quantities.condition, 80);
    assert.equal(health(advance(restore(freshHit), 8)), health(freshHit) - 5);

    const loadRated = applyEngineOps(make(20), [
        {op: 'property', holder: weapon, property: STRIKE_REFERENCE_LOAD, value: 20},
    ], 'fixture:load-rated-blade');
    const lightStrike = defineContestLaw({id: law.id, revision: law.revision, moves: {
        strike: {...law.moves.strike, power: 5},
    }});
    const lightBlow = blow(loadRated, lightStrike);
    const heavyBlow = blow(loadRated);
    const lightLoss = 100 - health(lightBlow), heavyLoss = 100 - health(heavyBlow);
    assert.ok(lightLoss > 0 && lightLoss < 20 && heavyLoss >= 20);
    assert.equal(lightBlow.world.holders[weapon].quantities.condition, 20 - lightLoss);
    assert.equal(heavyBlow.world.holders[weapon].quantities.condition, 0);
    assert.equal(health(advance(restore(lightBlow), 4)), health(lightBlow) - 5);
    assert.equal(health(advance(restore(heavyBlow), 4)), health(heavyBlow));
});
