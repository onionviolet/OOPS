// Brew law on the kernel working (chat B phase 2a). Conservation regressions
// BRC1, BRC2, BRC7, BRC8 and BRC10 at the law level, the LOTM formula rows as
// data, and the Seer canon test against the scene module it will replace.
import test from 'node:test';
import assert from 'node:assert/strict';
import {beginWorking, interruptWorking, quoteWorking, restoreWorking, serializeWorking, settleWorking} from '../src/kernel_working.js';
import {BREW_LAW, BREW_PUBLISHES, ageDose, brewBalance, brewMethod, spillBatch, unfinishedBatch} from '../src/brew_law.js';
import {LOTM_BREW_ROWS, lotmBrewRow, lotmDoseReading, lotmLots, parseLotmAmount} from '../src/world_packs/lotm_brew_pack.js';
import {brewSeer} from '../src/lotm_seer_brew.js';
import {THERMAL_REVISION, quoteThermalBatch} from '../src/craft_process_thermal.js';
import {brewBatchState, createBrewSteamPack} from '../src/world_substrate_packs/brew_steam.js';
import {advanceWorld, applyWorldOps, composeSubstrate, createWorld} from '../src/world_substrate.js';

const vessel = (extra = {}) => ({kind: 'vessel', id: 'cauldron', place: 'workroom', retainPermille: 0, closure: 'open', ...extra});
const bindingsFor = (row, lots, v = vessel()) => ({vessel: {kind: 'vessel', id: v.id}, ...Object.fromEntries(Object.entries(lots).map(([k, lot]) => [k, {kind: 'lot', id: lot.id}]))});
const portsFor = (lots, v = vessel()) => {
    const things = {[v.id]: v, ...Object.fromEntries(Object.values(lots).map(l => [l.id, l]))};
    return {read: ref => things[ref.id] ?? null};
};
function brewRow(row, measures = {}, {now} = {}) {
    const lots = lotmLots(row, measures);
    const record = beginWorking(BREW_LAW, row.method, {id: `w.${row.id}`, bindings: bindingsFor(row, lots), at: 0});
    return settleWorking(BREW_LAW, record, {now: now ?? record.deadlines.at(-1), ports: portsFor(lots)});
}

test('LOTM quantities parse into amounts with a stated source', () => {
    assert.deepEqual(parseLotmAmount('10 ml'), {amount: 10000, unit: 'ml', source: 'stated'});
    assert.deepEqual(parseLotmAmount('5 drops'), {amount: 5000, unit: 'drop', source: 'stated'});
    assert.equal(parseLotmAmount('pair').amount, 2000);
    assert.equal(parseLotmAmount('all').source, 'whole');
    assert.equal(parseLotmAmount(null, 3).amount, 3000);
    assert.equal(parseLotmAmount('a large amount').source, 'unparsed');
});

test('Seer equivalence test: the formula row on the shared law matches the scene module', () => {
    const row = lotmBrewRow('fool_9');
    const cases = [{blood: 10, crystal: 48}, {blood: 11, crystal: 48}, {blood: 10, crystal: 50}, {blood: 10, crystal: 40}, {blood: 12, crystal: 50}];
    for (const {blood, crystal} of cases) {
        const old = brewSeer({'Lavos Squid blood': blood, 'Star Crystal': crystal}).outputs;
        const {record} = brewRow(row, {m1: blood * 1000, m2: crystal * 1000});
        const reading = lotmDoseReading(row, record.facts.brew.doses[0]);
        assert.equal(reading.power, old.beyonder?.seer ?? 0, `power at ${blood} ml, ${crystal} g`);
        assert.equal(reading.hazard, old.spirit?.madness ?? 0, `hazard at ${blood} ml, ${crystal} g`);
        assert.ok(brewBalance(record.facts).balanced);
    }
});

test('every known LOTM formula runs as data: full dose at formula, balanced ledger', () => {
    assert.equal(LOTM_BREW_ROWS.length, 46);
    assert.equal(LOTM_BREW_ROWS.filter(r => r.offered).length, 23);
    for (const row of LOTM_BREW_ROWS) {
        const {record} = brewRow(row);
        assert.equal(record.status, 'complete', row.id);
        const reading = lotmDoseReading(row, record.facts.brew.doses[0]);
        assert.equal(reading.fullDosePermille, 1000, row.id);
        assert.equal(reading.hazard, 0, row.id);
        assert.ok(brewBalance(record.facts).balanced, row.id);
    }
});

test('a short main measure weakens the dose; an over measure of a single main harms', () => {
    const seer = lotmBrewRow('fool_9');
    const short = lotmDoseReading(seer, brewRow(seer, {m1: 9000}).record.facts.brew.doses[0]);
    assert.ok(short.fullDosePermille < 1000 && short.hazard === 0);
    const single = LOTM_BREW_ROWS.find(r => r.slots.filter(s => s.role === 'main').length === 1);
    const main = single.slots.find(s => s.role === 'main');
    const over = lotmDoseReading(single, brewRow(single, {[main.id]: main.amount * 2}).record.facts.brew.doses[0]);
    assert.equal(over.fullDosePermille, 1000);
    assert.ok(over.hazard > 0);
});

test('BRC7: an interrupted brew keeps its settled steps and its matter, and partitions in time', () => {
    const row = lotmBrewRow('fool_9');
    const lots = lotmLots(row);
    const record = beginWorking(BREW_LAW, row.method, {id: 'w.seer', bindings: bindingsFor(row, lots), at: 0});
    const ports = portsFor(lots);
    const end = record.deadlines.at(-1);
    const jump = settleWorking(BREW_LAW, record, {now: end, ports}).record;
    let stepped = record;
    for (let t = 0; t <= end; t++) stepped = settleWorking(BREW_LAW, stepped, {now: t, ports}).record;
    assert.deepEqual(stepped, jump);
    // Stop after the admissions (minute 0) but before the binding settles.
    const early = settleWorking(BREW_LAW, record, {now: 0, ports}).record;
    const stopped = interruptWorking(early, {at: 30, reason: 'The keeper left the room.'});
    const left = unfinishedBatch(stopped);
    assert.equal(left.status, 'interrupted');
    assert.equal(left.settledSteps, row.slots.length);
    assert.ok(left.balance.balanced && left.balance.admitted > 0 && left.balance.held === left.balance.admitted);
    const restored = restoreWorking(BREW_LAW, JSON.parse(JSON.stringify(serializeWorking(stopped))));
    assert.deepEqual(unfinishedBatch(restored), left);
});

const thermal = {law: {revision: THERMAL_REVISION, ambient: 20, extraction: {min: 45, max: 80, seconds: 30}, degradation: {above: 85, seconds: 20}},
    load: {mass: 4, volume: 4, specificHeat: 2, containment: 1},
    maker: {tools: ['brazier'], competence: 4, workCapacity: 1000, fuelStock: 10000, heater: {maxTemperature: 150, maxConductance: 20, fuelPerSecond: 0.25}},
    program: {startTemperature: 20, sourceTemperature: 75, targetTemperature: 65, holdSeconds: 900, heaterTool: 'brazier', agitationTool: 'paddle', requiredCompetence: 2}};
const heatOptions = {...thermal, active: 'active', extract: 'extract', degraded: 'degraded', solvent: 'water', vaporPerMinute: 100};
const herbLots = () => ({herb: {kind: 'lot', id: 'lot.herb', material: 'herb', amount: 1000, properties: {active: 600}},
    water: {kind: 'lot', id: 'lot.water', material: 'water', amount: 5000, properties: {water: 1000}}});
const herbVessel = (closure = 'open') => vessel({closure, retainPermille: 50, thermal: {capacity: 100, surfaceArea: 2, heatTransfer: 1, thermalMass: 4, containment: 2}});
const herbBindings = {vessel: {kind: 'vessel', id: 'cauldron'}, herb: {kind: 'lot', id: 'lot.herb'}, water: {kind: 'lot', id: 'lot.water'}};
const herbMethod = (heats = [10], tail = true) => brewMethod({id: 'test.herb', slots: [{id: 'herb'}, {id: 'water'}], process: [
    ...heats.map(minutes => ({op: 'heat', minutes, options: heatOptions})),
    ...(tail ? [{op: 'divide', minutes: 1, options: {doses: 3}}, {op: 'rinse', minutes: 2, options: {water: 500}}] : [])]});
const runHerb = (method, v = herbVessel(), lots = herbLots()) =>
    settleWorking(BREW_LAW, beginWorking(BREW_LAW, method, {id: 'w.herb', bindings: herbBindings, at: 0}), {now: 999, ports: portsFor(lots, v)});

test('BRC1, BRC2, BRC8: heat, vapor and rinse water leave into the place and the ledger balances', () => {
    const {record: done, effects} = runHerb(herbMethod());
    assert.equal(done.status, 'complete');
    const l = done.facts.brew;
    assert.ok(l.batch.extract === undefined && l.doses.length === 3 && l.doses[0].contents.extract > 0);
    const litMinutes = Math.ceil(l.fuel / thermal.maker.heater.fuelPerSecond / 60 - 1e-9);
    assert.ok(litMinutes > 0);
    assert.equal(l.out.vapor.water, litMinutes * heatOptions.vaporPerMinute, 'vapor comes from the lit minutes');
    const kinds = effects.map(e => e.effect.kind ?? e.effect.op);
    assert.deepEqual(kinds, ['debit', 'debit', 'heat.released', 'vapor.released', 'water.poured']);
    const rinse = effects.find(e => e.effect.kind === 'water.poured').effect;
    assert.deepEqual(rinse.detail.contents, l.out.waste);
    assert.deepEqual(l.film, {});
    assert.ok(brewBalance(done.facts).balanced);
    // The published effects are accepted by a real W v0 place as cause-chain
    // records. No W quantity holds vapor or waste water yet (request to W).
    const rules = composeSubstrate({packs: [{id: 'b.brew', quantities: [], laws: [], reactors: [], publishes: BREW_PUBLISHES}]});
    let world = createWorld(rules, {holders: [{id: 'workroom', kind: 'place'}, {id: 'cauldron', kind: 'thing', place: 'workroom'}]});
    world = applyWorldOps(rules, world, effects.filter(e => e.effect.op === 'publish').map(e => e.effect), 'b.brew:w.herb');
    assert.deepEqual(world.chain.map(row => row.kind), ['heat.released', 'vapor.released', 'water.poured']);
    const sealed = runHerb(herbMethod(), herbVessel('sealed')).record;
    assert.deepEqual(sealed.facts.brew.out.vapor, {});
    assert.ok(brewBalance(sealed.facts).balanced);
});

test('BRC8: two heat steps compose like one, and residence decides the split', () => {
    const one = runHerb(herbMethod([10], false)).record.facts.brew;
    const two = runHerb(herbMethod([4, 6], false)).record.facts.brew;
    assert.deepEqual(two.batch, one.batch);
    assert.equal(two.fuel, one.fuel);
    const short = runHerb(herbMethod([1], false)).record.facts.brew;
    assert.ok((short.batch.active ?? 0) > (one.batch.active ?? 0), 'a shorter heat leaves more unextracted');
    for (const l of [one, two, short]) assert.ok(brewBalance({brew: l}).balanced);
});

test('BRC8: a burner that ran out is relit by a paid resume that keeps earlier residence', () => {
    const shortBurn = {...heatOptions, program: {...thermal.program, holdSeconds: 60}};
    const method = steps => brewMethod({id: 'test.relight', slots: [{id: 'herb'}, {id: 'water'}],
        process: steps.map(minutes => ({op: 'heat', minutes, options: shortBurn}))});
    const once = runHerb(method([6])).record.facts.brew;
    const twice = runHerb(method([3, 3])).record.facts.brew;
    assert.ok(twice.fuel > once.fuel, 'the second step relit the burner');
    assert.ok(twice.heat.thermal.extractionSeconds > once.heat.thermal.extractionSeconds, 'residence carried across the relight');
    assert.ok(brewBalance({brew: twice}).balanced);
});

test('BRC8: a late addition does not inherit the heat earlier material had', () => {
    const lots = {...herbLots(), late: {kind: 'lot', id: 'lot.late', material: 'herb', amount: 1000, properties: {active: 600}}};
    const method = brewMethod({id: 'test.late', slots: [{id: 'herb'}, {id: 'water'}], process: [{op: 'heat', minutes: 8, options: heatOptions}]});
    method.roles.late = 'lot';
    method.steps.push({op: 'admit', bindings: {vessel: 'vessel', lot: 'late'}, minutes: 0}, {op: 'heat', bindings: {vessel: 'vessel'}, minutes: 2, options: heatOptions});
    const {record} = settleWorking(BREW_LAW, beginWorking(BREW_LAW, method, {id: 'w.late', bindings: {...herbBindings, late: {kind: 'lot', id: 'lot.late'}}, at: 0}),
        {now: 999, ports: portsFor(lots, herbVessel())});
    const [early, late] = record.facts.brew.portions.filter(p => p.id === 'active');
    assert.ok(early.applied.usable + early.applied.degraded > late.applied.usable + late.applied.degraded);
    assert.ok(late.baseline.extractionSeconds > 0);
    assert.ok(brewBalance(record.facts).balanced);
});

test('one thermal state: in a world, the brew steam holder drives both humidity and the batch', () => {
    const law = thermal.law;
    const thermalVessel = herbVessel().thermal;
    const q = quoteThermalBatch({law, vessel: thermalVessel, load: thermal.load, maker: thermal.maker, program: thermal.program});
    const steam = createBrewSteamPack({thermalLaw: law, steamPerMinute: 1});
    const rules = composeSubstrate({packs: [steam]});
    let world = createWorld(rules, {clock: 0, holders: [{id: 'workroom', kind: 'place', quantities: {humidity: 10}},
        {id: 'batch', kind: 'thing', place: 'workroom', tags: ['brew.batch'], state: {'b.brew_steam': brewBatchState(law, q)}}]});
    const lots = herbLots();
    const byId = Object.fromEntries(Object.values(lots).map(lot => [lot.id, lot]));
    const reader = () => ({read: ref => ref.kind === 'vessel'
        ? {...herbVessel(), thermalState: world.holders.batch.state['b.brew_steam'].thermal} : byId[ref.id]});
    let record = beginWorking(BREW_LAW, herbMethod([20], false), {id: 'w.world', bindings: herbBindings, at: 0});
    for (const t of record.deadlines) {
        world = advanceWorld(rules, world, t).world;
        record = settleWorking(BREW_LAW, record, {now: t, ports: reader()}).record;
    }
    const l = record.facts.brew;
    const litMinutes = Math.ceil(l.fuel / thermal.maker.heater.fuelPerSecond / 60 - 1e-9);
    assert.equal(world.holders.workroom.quantities.humidity - 10, Math.min(90, litMinutes), 'humidity from the same lit minutes');
    assert.equal(l.out.vapor.water, litMinutes * heatOptions.vaporPerMinute, 'and the batch lost water for those minutes');
    assert.deepEqual(l.heat.thermal, world.holders.batch.state['b.brew_steam'].thermal);
    assert.ok(brewBalance(record.facts).balanced);
});

test('a spill moves the batch out into the place; a quote keeps nothing', () => {
    const row = lotmBrewRow('fool_9');
    const lots = lotmLots(row);
    const early = settleWorking(BREW_LAW, beginWorking(BREW_LAW, row.method, {id: 'w.spill', bindings: bindingsFor(row, lots), at: 0}),
        {now: 0, ports: portsFor(lots)}).record;
    const {facts, effect} = spillBatch(early.facts, vessel());
    assert.equal(effect.kind, 'water.poured');
    assert.equal(effect.detail.what, 'spill');
    assert.deepEqual(facts.brew.batch, {});
    assert.ok(brewBalance(facts).balanced && brewBalance(facts).released === brewBalance(facts).admitted);
    const q = quoteWorking(BREW_LAW, row.method, {id: 'w.q', bindings: bindingsFor(row, lots), at: 0, ports: portsFor(lots)});
    assert.equal(q.ok, true);
    assert.equal(lotmDoseReading(row, q.facts.brew.doses[0]).fullDosePermille, 1000);
});

test('a lot that is gone at its step interrupts the brew without losing what was admitted', () => {
    const row = lotmBrewRow('fool_9');
    const lots = lotmLots(row);
    const record = beginWorking(BREW_LAW, row.method, {id: 'w.gone', bindings: bindingsFor(row, lots), at: 0});
    const ports = {read: ref => ref.id === lots.m2.id ? null : portsFor(lots).read(ref)};
    const {record: done} = settleWorking(BREW_LAW, record, {now: 999, ports});
    assert.equal(done.status, 'interrupted');
    assert.equal(done.receipts.at(-1).cause, 'binding');
    assert.ok(brewBalance(done.facts).balanced);
    assert.equal(brewBalance(done.facts).admitted, lots.m1.amount);
});

// PTD depth on the law itself: one small method, run against chosen lots and vessels.
function runSteps(steps, lots, v = vessel(), id = 'w.ptd') {
    const method = {id: 'ptd', revision: 1, law: BREW_LAW.ref, roles: {vessel: 'vessel', ...Object.fromEntries(Object.keys(lots).map(k => [k, 'lot']))}, steps};
    const record = beginWorking(BREW_LAW, method, {id, bindings: bindingsFor(null, lots, v), at: 0});
    return settleWorking(BREW_LAW, record, {now: record.deadlines.at(-1), ports: portsFor(lots, v)}).record;
}
const at = {vessel: 'vessel'};

test('PTD2: a perishable the spoilage owner knows loses its spent share before it goes in', () => {
    const herb = days => ({herb: {kind: 'lot', id: 'lot.herb', material: 'fluxweed', amount: 100, properties: {sap: 600},
        key: JSON.stringify({id: 'book.hp.ing.fluxweed'}), spent: days * 1440}});
    const brew = days => runSteps([{op: 'admit', bindings: {...at, lot: 'herb'}}], herb(days));
    const fresh = brew(0), aged = brew(3.5), gone = brew(8);
    assert.equal(fresh.facts.brew.batch.sap, 60);
    assert.equal(aged.facts.brew.batch.sap, 30, 'half its seven-day life spent');
    assert.equal(aged.facts.brew.out.retained['sap:spent'], 30);
    assert.equal(gone.facts.brew.batch.sap ?? 0, 0, 'spoiled: nothing active goes in');
    for (const r of [fresh, aged, gone]) assert.ok(brewBalance(r.facts).balanced);
});

test('PTD4: a vessel film from an earlier brew comes back once, balanced, and the vessel is told to clear it', () => {
    const lots = {a: {kind: 'lot', id: 'lot.a', material: 'water', amount: 50, properties: {}},
        b: {kind: 'lot', id: 'lot.b', material: 'salt', amount: 10, properties: {salt: 1000}}};
    const v = vessel({films: [{id: 'old:residue', amount: 3}]});
    const r = runSteps([{op: 'admit', bindings: {...at, lot: 'a'}}, {op: 'admit', bindings: {...at, lot: 'b'}}], lots, v);
    assert.equal(r.facts.brew.batch['old:residue'], 3);
    assert.equal(r.facts.brew.in['vessel:cauldron'], 3);
    assert.ok(brewBalance(r.facts).balanced);
    const clears = r.receipts.flatMap(x => x.truth?.effects ?? []).filter(e => e.op === 'clear-films');
    assert.deepEqual(clears, [{op: 'clear-films', holder: 'cauldron', amount: 3}]);
});

test('PTD6: batch variation by address: two batches differ, the same batch repeats, totals still conserved', () => {
    const lots = {a: {kind: 'lot', id: 'lot.a', material: 'a', amount: 1000, properties: {x: 500, y: 500}}};
    const steps = [{op: 'admit', bindings: {...at, lot: 'a'}},
        {op: 'react', bindings: at, options: {variationPermille: 400, reactions: [{id: 'xy', reactants: {x: 1, y: 1}, products: {z: 2}}]}}];
    const z = id => runSteps(steps, lots, vessel(), id).facts.brew.batch.z ?? 0;
    const seen = new Set(['w.b1', 'w.b2', 'w.b3', 'w.b4'].map(z));
    assert.ok(seen.size > 1, `addresses give different extents: ${[...seen]}`);
    assert.equal(z('w.b1'), z('w.b1'));
    assert.ok(brewBalance(runSteps(steps, lots, vessel(), 'w.b2').facts).balanced);
});

test('PTD8: a finished dose ages through the spoilage owner or a stated life, and nothing vanishes', () => {
    const dose = {id: 'd1', contents: {sap: 60, 'water:matrix': 40}};
    const total = d => Object.values(d.contents).reduce((n, a) => n + a, 0);
    const known = ageDose(dose, {key: JSON.stringify({id: 'book.hp.ing.fluxweed'}), spent: 4 * 1440});
    assert.deepEqual(known.dose.contents, {sap: 26, 'sap:spent': 34, 'water:matrix': 40});
    assert.equal(known.state, 'turning');
    const dial = ageDose(dose, {life: 1000, spent: 2000});
    assert.equal(dial.dose.contents.sap ?? 0, 0);
    assert.equal(dial.state, 'spoiled');
    for (const d of [known.dose, dial.dose]) assert.equal(total(d), 100);
});
