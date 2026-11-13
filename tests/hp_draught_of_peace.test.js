import assert from 'node:assert/strict';
import test from 'node:test';
import {BREW_LAW, BREW_PUBLISHES, brewBalance} from '../src/brew_law.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {brewDoseContents, brewDoseQuantity, brewFilmQuantity, brewMeasureQuantity} from '../src/engine_brew_stock.js';
import {defineWorkingLaw} from '../src/kernel_working.js';
import {draughtOfPeaceDose, draughtOfPeaceMethod} from '../src/world_packs/hp_brew_pack.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';
import {residueQuantity} from '../src/world_substrate_packs/residue_flow.js';
import {resumeBrewPour} from '../src/engine_brew_resume.js';

const add = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});
const credit = (holder, part, amount) => Object.hasOwn(holder.quantities, brewDoseQuantity(part))
    ? add(holder.holder, brewDoseQuantity(part), amount)
    : {op: 'carry', holder: holder.holder, quantity: brewDoseQuantity(part), amount};

const doseRoles = {flask: 'flask', recipient: 'body'};
const law = defineWorkingLaw({id: 'fixture.peace.serve', revision: 1, operations: {
    administer: {roles: doseRoles, minutes: 2, settle({bound: {flask, recipient}}) {
        if (flask.place !== recipient.place) return {ok: false, reason: 'flask-out-of-reach'};
        const contents = brewDoseContents(flask);
        if (!Object.keys(contents).length) return {ok: false, reason: 'empty-flask'};
        const effects = Object.entries(contents).flatMap(([part, amount]) => [
            add(flask.holder, brewDoseQuantity(part), -amount), credit(recipient, part, amount),
        ]);
        const outcome = draughtOfPeaceDose(contents);
        if (outcome) effects.push({
            sentence: {verb: outcome.verb, object: 'mind', time: 'sustained', target: 'touched', carrier: 'potion'},
            details: {place: recipient.place, target: {shape: 'holder', id: recipient.holder},
                mind: outcome.mind, minutes: outcome.minutes},
        });
        return {ok: true, effects, observed: {served: Object.values(contents).reduce((sum, n) => sum + n, 0)}};
    }},
}});

const config = {
    packs: ['a.mind'], shared: {quantities: [WORLD_QUANTITIES.stock], effectKinds: BREW_PUBLISHES},
    host: {laws: [BREW_LAW, law], things: {
        'vessel:cauldron': {closure: 'open', thermal: {capacity: 10, surfaceArea: 2, heatTransfer: 1, thermalMass: 1}},
        'lot:base': {material: 'base', properties: {constituents: {'peace-base': 1000}}},
        'lot:moonstone': {material: 'moonstone', properties: {constituents: {'powdered-moonstone': 1000}}},
        'lot:syrup': {material: 'syrup', properties: {constituents: {'hellebore-syrup': 1000}}},
    }},
};
const ref = (kind, id = kind) => ({kind, id});
const flask = ref('flask');
const recipient = ref('body', 'recipient');
function startBrew({syrupDrops = 2, syrupStock = 6, strokes = 'LLL', film = 0, retainPermille = 0,
    pourMinutes = 0, repeatPour = false} = {}) {
    const lot = (id, amount) => ({id, kind: 'thing', as: ['lot'], place: 'bench', quantities: {[brewMeasureQuantity]: amount}});
    const brewConfig = {...config, host: {...config.host, things: {...config.host.things,
        'vessel:cauldron': {...config.host.things['vessel:cauldron'], retainPermille},
    }}};
    const engine = createEngineWorld({...brewConfig, holders: [
        {id: 'bench', kind: 'place'}, {id: 'store', kind: 'place'},
        lot('base', 60), lot('moonstone', 6), lot('syrup', syrupStock),
        {id: 'cauldron', kind: 'thing', as: ['vessel'], place: 'bench',
            quantities: film ? {[brewFilmQuantity('old:matrix')]: film} : {}},
        {id: 'flask', kind: 'thing', as: ['flask'], place: 'bench'},
        {id: 'recipient', kind: 'body', place: 'bench', properties: {mind_awake: true, mind_mood: 10}},
    ]});
    const method = draughtOfPeaceMethod({moonstone: 6, syrupDrops});
    method.steps.at(-1).minutes = pourMinutes;
    if (repeatPour) method.steps.push({...method.steps.at(-1), minutes: 1});
    method.steps.find(step => step.op === 'stir').options.strokes = strokes;
    return startEngineWorking(engine, {id: 'brew', law: BREW_LAW, method, bindings: {
        vessel: ref('vessel', 'cauldron'), base: ref('lot', 'base'), moonstone: ref('lot', 'moonstone'), flask,
        ...(syrupDrops > 0 ? {syrup: ref('lot', 'syrup')} : {}),
    }});
}

const advance = (engine, to) => {
    const result = advanceEngineWorld(engine, to);
    assert.equal(result.pending, false);
    return result.engine;
};
const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))),
    {...config, host: {...config.host, things: engine.host.things}});
const record = (engine, id) => engine.records.workings[id].record;
const contents = (engine, id) => brewDoseContents(engine.world.holders[id]);
const measure = (engine, id) => engine.world.holders[id].quantities[brewMeasureQuantity];
const mind = engine => engine.world.holders.recipient.properties;
const drink = (engine, id = 'drink') => startEngineWorking(engine, {id, law, bindings: {flask, recipient},
    method: {id: 'serve.peace', revision: 1, law: law.ref, roles: doseRoles,
        steps: [{op: 'administer', bindings: {flask: 'flask', recipient: 'recipient'}}]}});

test('PC19: the staged Draught of Peace serves calm, while omission and excess have different outcomes', () => {
    for (const {syrupDrops, strokes, active, awake, mood} of [
        {syrupDrops: 2, active: 6, awake: true, mood: 16},
        {syrupDrops: 0, active: 0, awake: true, mood: 10},
        {syrupDrops: 2, strokes: 'LLR', active: 0, awake: true, mood: 10},
        {syrupDrops: 4, active: 12, awake: false, mood: 10},
    ]) {
        const brewed = advance(startBrew({syrupDrops, strokes}), 9);
        const batch = record(brewed, 'brew');
        assert.equal(batch.status, 'complete');
        const heated = batch.receipts.find(r => r.op === 'heat');
        const stirred = batch.receipts.find(r => r.op === 'stir');
        assert.equal(heated.at - stirred.at, 7);
        assert.equal(heated.truth.facts.brew.heat.thermal.elapsedSeconds, 420);
        if (syrupDrops) assert.equal(batch.receipts.find(r => r.bindings.lot === 'syrup').at, heated.at);
        assert.deepEqual(batch.receipts.find(r => r.op === 'react').observed.cues, active ? ['Light silver vapour'] : []);
        const serving = contents(brewed, 'flask');
        assert.deepEqual(serving, batch.facts.brew.doses[0].contents);
        assert.equal(serving['peace-active'] ?? 0, active);
        const admitted = 66 + syrupDrops;
        assert.deepEqual(brewBalance(batch.facts), {admitted, held: 0, released: admitted, balanced: true});
        assert.equal(measure(brewed, 'base'), 0);
        assert.equal(measure(brewed, 'moonstone'), 0);
        assert.equal(measure(brewed, 'syrup'), 6 - syrupDrops);

        const served = advance(reload(drink(reload(brewed))), 11);
        assert.equal(record(served, 'drink').status, 'complete');
        assert.equal(record(served, 'drink').receipts[0].observed.served, admitted);
        assert.deepEqual(contents(served, 'flask'), {});
        assert.deepEqual(contents(served, 'recipient'), serving);
        assert.deepEqual(mind(served), {mind_awake: awake, mind_mood: mood});
        if (active) {
            const lapse = awake ? 15 : 23;
            assert.deepEqual(mind(advance(reload(served), lapse - 1)), mind(served));
            assert.deepEqual(mind(advance(reload(served), lapse)), {mind_awake: true, mind_mood: 10});
        }
    }
});

test('PC95: one engine save survives simmer, pending delivery and effect expiry without replaying stock', () => {
    const direct = advance(drink(advance(startBrew({syrupDrops: 4}), 9)), 24);
    let stepped = startBrew({syrupDrops: 4});
    for (let minute = 1; minute <= 24; minute++) {
        stepped = reload(advance(stepped, minute));
        if (minute === 9) stepped = reload(drink(stepped));
    }
    assert.deepEqual(serializeEngineWorld(stepped), serializeEngineWorld(direct));
    const second = advance(drink(stepped, 'second'), 26);
    assert.equal(record(second, 'second').receipts[0].reason, 'empty-flask');
    assert.deepEqual(contents(second, 'recipient'), contents(stepped, 'recipient'));
});

test('PC95: missing late stock and lost reach leave earlier settled matter where it was', () => {
    const short = advance(reload(advance(startBrew({syrupStock: 1}), 4)), 9);
    const failed = record(short, 'brew');
    assert.equal(failed.status, 'interrupted');
    assert.equal(failed.receipts.at(-1).op, 'admit');
    assert.deepEqual(brewBalance(failed.facts), {admitted: 66, held: 66, released: 0, balanced: true});
    assert.equal(measure(short, 'syrup'), 1);
    assert.deepEqual(contents(short, 'flask'), {});
    assert.deepEqual(serializeEngineWorld(reload(short)), serializeEngineWorld(short));

    const ready = advance(startBrew(), 9);
    const pending = drink(ready);
    const moved = applyEngineOps(advance(pending, 10), [{op: 'move', holder: 'flask', to: 'store'}], 'put-away');
    const interrupted = advance(reload(moved), 11);
    assert.equal(record(interrupted, 'drink').status, 'interrupted');
    assert.equal(record(interrupted, 'drink').receipts[0].reason, 'flask-out-of-reach');
    assert.deepEqual(contents(interrupted, 'flask'), contents(ready, 'flask'));
    assert.deepEqual(contents(interrupted, 'recipient'), {});
    assert.deepEqual(mind(interrupted), mind(ready));
});

test('PC95: the engine clears prior lining, saves the division receipt, and pours it once', () => {
    const lining = brewFilmQuantity('old:matrix');
    const start = startBrew({film: 4, retainPermille: 500, pourMinutes: 1, repeatPour: true});
    assert.equal(start.world.holders.cauldron.quantities[lining], 0);
    assert.equal(record(start, 'brew').facts.brew.batch['old:matrix'], 4);
    assert.equal(record(start, 'brew').facts.brew.in['vessel:cauldron'], 4);
    const divided = reload(advance(start, 9));
    assert.equal(record(divided, 'brew').facts.brew.film['old:matrix'], 2);
    assert.deepEqual(contents(divided, 'flask'), {});

    const moved = applyEngineOps(divided, [{op: 'move', holder: 'flask', to: 'store'}], 'put-away');
    const blocked = advance(reload(moved), 10);
    const blockedBatch = record(blocked, 'brew');
    assert.equal(blockedBatch.receipts.at(-1).reason, 'flask-out-of-reach');
    assert.deepEqual(contents(blocked, 'flask'), {});
    assert.equal(blockedBatch.facts.brew.doses[0].pouredTo, undefined);
    assert.equal(blockedBatch.facts.brew.film['old:matrix'], 2);

    const poured = reload(advance(divided, 10));
    assert.equal(poured.world.holders.cauldron.quantities[lining], 2);
    assert.equal(contents(poured, 'flask')['old:matrix'], 2);
    const batch = record(poured, 'brew');
    assert.deepEqual(batch.facts.brew.film, {});
    assert.equal(batch.facts.brew.out.lining['old:matrix'], 2);
    assert.deepEqual(batch.facts.brew.doses[0], {index: 0, contents: contents(poured, 'flask'), pouredTo: 'flask'});
    assert.deepEqual(brewBalance(batch.facts), {admitted: 72, held: 0, released: 72, balanced: true});
    const replay = advance(poured, 11);
    assert.equal(record(replay, 'brew').receipts.at(-1).reason, 'serving-unavailable');
    assert.deepEqual(replay.world.holders, poured.world.holders);

    const next = startEngineWorking(replay, {id: 'next-brew', law: BREW_LAW,
        method: {id: 'next', revision: 1, law: BREW_LAW.ref, roles: {vessel: 'vessel', lot: 'lot'},
            steps: [{op: 'admit', bindings: {vessel: 'vessel', lot: 'lot'}, options: {amount: 1}}]},
        bindings: {vessel: ref('vessel', 'cauldron'), lot: ref('lot', 'syrup')}});
    const nextBrew = record(next, 'next-brew');
    assert.equal(nextBrew.facts.brew.batch['old:matrix'], 2);
    assert.equal(next.world.holders.cauldron.quantities[lining], 0);
    assert.equal(measure(next, 'syrup'), 3);
    assert.ok(brewBalance(nextBrew.facts).balanced);
});

test('a restored interrupted pour can transfer its batch once without replaying settled work', () => {
    const start = startBrew({film: 4, retainPermille: 500, pourMinutes: 1});
    const divided = advance(start, 9);
    const away = applyEngineOps(divided, [{op: 'move', holder: 'flask', to: 'store'}], 'put-away');
    const blocked = reload(advance(away, 10));
    const original = record(blocked, 'brew');
    assert.equal(original.receipts.at(-1).reason, 'flask-out-of-reach');

    const waiting = reload(resumeBrewPour(blocked, {from: 'brew', id: 'retry-away'}));
    const missed = reload(advance(waiting, 11));
    assert.equal(record(missed, 'retry-away').receipts.at(-1).reason, 'flask-out-of-reach');
    assert.throws(() => resumeBrewPour(missed, {from: 'brew', id: 'duplicate'}), /already has a continuation/);
    const returned = applyEngineOps(missed, [{op: 'move', holder: 'flask', to: 'bench'}], 'bring-back');
    const pending = resumeBrewPour(returned, {from: 'retry-away', id: 'retry'});
    const poured = reload(advance(reload(pending), 12));
    assert.deepEqual(serializeEngineWorld(poured), serializeEngineWorld(advance(pending, 12)));
    assert.deepEqual(record(poured, 'brew'), original);
    assert.deepEqual(record(poured, 'retry').receipts.map(row => row.op), ['pour']);
    assert.deepEqual(brewBalance(record(poured, 'retry').facts), brewBalance(record(advance(divided, 10), 'brew').facts));
    const uninterrupted = advance(divided, 10);
    for (const [id, holder] of Object.entries(poured.world.holders))
        assert.deepEqual(holder.quantities, uninterrupted.world.holders[id].quantities);
    assert.equal(poured.world.holders.flask.place, 'bench');
    assert.equal(contents(poured, 'flask')['old:matrix'], 2);
    assert.throws(() => resumeBrewPour(poured, {from: 'retry-away', id: 'duplicate-again'}), /already has a continuation/);
});

test('a separate saved rinse removes physical lining and its drain receives the residue once', () => {
    const film = brewFilmQuantity('old:matrix');
    const residue = residueQuantity('old:matrix');
    const rinseConfig = {...config, packs: ['w.residue_flow']};
    const world = createEngineWorld({...rinseConfig, holders: [
        {id: 'bench', kind: 'place'}, {id: 'drain', kind: 'place', quantities: {[residue]: 0}},
        {id: 'cauldron', kind: 'thing', as: ['vessel'], place: 'bench', quantities: {[film]: 4}},
    ], links: [{id: 'wash-drain', kind: 'water', from: 'bench', to: 'drain', oneWay: true}]});
    const reloadRinse = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), rinseConfig);
    const rinse = (engine, id) => startEngineWorking(engine, {id, law: BREW_LAW,
        method: {id: 'bench.rinse', revision: 1, law: BREW_LAW.ref, roles: {vessel: 'vessel'},
            steps: [{op: 'rinse', bindings: {vessel: 'vessel'}, minutes: 2}]},
        bindings: {vessel: ref('vessel', 'cauldron')}});
    const running = rinse(world, 'wash');
    assert.equal(running.world.holders.cauldron.quantities[film], 4);
    const washed = reloadRinse(advance(reloadRinse(advance(running, 1)), 2));
    assert.deepEqual(serializeEngineWorld(washed), serializeEngineWorld(advance(running, 2)));
    assert.equal(washed.world.holders.cauldron.quantities[film], 0);
    assert.equal(washed.world.holders.drain.quantities[residue], 4);
    assert.deepEqual(brewBalance(record(washed, 'wash').facts), {admitted: 4, held: 0, released: 4, balanced: true});
    const repeated = advance(rinse(washed, 'wash-again'), 4);
    assert.equal(repeated.world.holders.drain.quantities[residue], 4);
    assert.equal(record(repeated, 'wash-again').receipts[0].observed.washed, 0);
});

test('paid rinse conserves solvent and prevents the remaining film from entering the next brew', () => {
    const film = brewFilmQuantity('old:matrix');
    const residue = residueQuantity('old:matrix');
    const water = residueQuantity('water');
    const account = 'stock:rinse-water';
    const rinseConfig = {...config, packs: ['w.residue_flow']};
    const world = createEngineWorld({...rinseConfig, holders: [
        {id: 'bench', kind: 'place'}, {id: 'drain', kind: 'place', quantities: {[residue]: 0, [water]: 0}},
        {id: 'cauldron', kind: 'thing', as: ['vessel'], place: 'bench', quantities: {[film]: 4, [account]: 5}},
        {id: 'syrup', kind: 'thing', as: ['lot'], place: 'bench', quantities: {[brewMeasureQuantity]: 1}},
    ], links: [{id: 'wash-drain', kind: 'water', from: 'bench', to: 'drain', oneWay: true}]});
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), rinseConfig);
    const vessel = ref('vessel', 'cauldron');
    const running = startEngineWorking(world, {id: 'wash', law: BREW_LAW, bindings: {vessel},
        method: {id: 'bench.wash', revision: 1, law: BREW_LAW.ref, roles: {vessel: 'vessel'},
            steps: [{op: 'rinse', bindings: {vessel: 'vessel'}, minutes: 2,
                options: {solvent: {account, part: 'water', amount: 5}}}]}});
    const midpoint = advance(running, 1);
    const washed = reload(advance(reload(midpoint), 2));
    assert.deepEqual(serializeEngineWorld(washed), serializeEngineWorld(advance(running, 2)));
    assert.deepEqual(washed.world.holders.drain.quantities, {[residue]: 4, [water]: 5});
    assert.deepEqual(washed.world.holders.cauldron.quantities, {[film]: 0, [account]: 0});
    assert.deepEqual(brewBalance(record(washed, 'wash').facts), {admitted: 9, held: 0, released: 9, balanced: true});

    const shortened = applyEngineOps(midpoint, [add('cauldron', account, -1)], 'borrow-wash-water');
    const failed = advance(reload(shortened), 2);
    assert.equal(record(failed, 'wash').receipts.at(-1).reason, 'rinse-solvent-unavailable');
    assert.deepEqual(failed.world.holders.cauldron.quantities, {[film]: 4, [account]: 4});
    assert.deepEqual(failed.world.holders.drain.quantities, {[residue]: 0, [water]: 0});

    const admit = engine => startEngineWorking(engine, {id: 'next', law: BREW_LAW, bindings: {vessel, lot: ref('lot', 'syrup')},
        method: {id: 'bench.next', revision: 1, law: BREW_LAW.ref, roles: {vessel: 'vessel', lot: 'lot'},
            steps: [{op: 'admit', bindings: {vessel: 'vessel', lot: 'lot'}}]}});
    assert.equal(record(admit(washed), 'next').facts.brew.batch['old:matrix'], undefined);
    assert.equal(record(admit(failed), 'next').facts.brew.batch['old:matrix'], 4);
});
