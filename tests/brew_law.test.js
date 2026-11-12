// Brew law on the kernel working (chat B phase 2a). Conservation regressions
// BRC1, BRC2, BRC7, BRC8 and BRC10 at the law level, the LOTM formula rows as
// data, and the Seer canon test against the scene module it will replace.
import test from 'node:test';
import assert from 'node:assert/strict';
import {beginWorking, interruptWorking, quoteWorking, restoreWorking, serializeWorking, settleWorking} from '../src/kernel_working.js';
import {BREW_LAW, brewBalance, brewMethod, spillBatch, unfinishedBatch} from '../src/brew_law.js';
import {LOTM_BREW_ROWS, lotmBrewRow, lotmDoseReading, lotmLots, parseLotmAmount} from '../src/world_packs/lotm_brew_pack.js';
import {brewSeer} from '../src/lotm_seer_brew.js';
import {THERMAL_REVISION} from '../src/craft_process_thermal.js';
import {applyWorldOps, composeSubstrate, createWorld} from '../src/world_substrate.js';

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

test('Seer canon test: the formula row on the shared law matches the scene module', () => {
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
    assert.equal(LOTM_BREW_ROWS.length, 43);
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
    program: {startTemperature: 20, sourceTemperature: 140, targetTemperature: 100, holdSeconds: 30, heaterTool: 'brazier', agitationTool: 'paddle', requiredCompetence: 2}};
const herbMethod = closure => {
    const lots = {herb: {kind: 'lot', id: 'lot.herb', material: 'herb', amount: 1000, properties: {active: 600}},
        water: {kind: 'lot', id: 'lot.water', material: 'water', amount: 5000, properties: {water: 1000}}};
    const v = vessel({closure, retainPermille: 50, thermal: {capacity: 100, surfaceArea: 2, heatTransfer: 1, thermalMass: 4, containment: 2}});
    const method = brewMethod({id: 'test.herb', slots: [{id: 'herb'}, {id: 'water'}], process: [
        {op: 'heat', minutes: 10, options: {...thermal, seconds: 90, active: 'active', extract: 'extract', degraded: 'degraded', evaporate: {constituent: 'water', amount: 1200}}},
        {op: 'divide', minutes: 1, options: {doses: 3}}, {op: 'rinse', minutes: 2, options: {water: 500}}]});
    return {lots, v, method, bindings: {vessel: {kind: 'vessel', id: v.id}, herb: {kind: 'lot', id: 'lot.herb'}, water: {kind: 'lot', id: 'lot.water'}}};
};

test('BRC1, BRC2, BRC8: heat, vapor and rinse water leave into the place and the ledger balances', () => {
    const {lots, v, method, bindings} = herbMethod('open');
    const record = beginWorking(BREW_LAW, method, {id: 'w.herb', bindings, at: 0});
    const {record: done, effects} = settleWorking(BREW_LAW, record, {now: 100, ports: portsFor(lots, v)});
    assert.equal(done.status, 'complete');
    const l = done.facts.brew;
    assert.ok(l.batch.extract === undefined && l.doses.length === 3 && l.doses[0].contents.extract > 0);
    assert.ok(l.doses.some(d => d.contents.degraded > 0), 'the hot pulse degrades some extract');
    assert.equal(l.out.vapor.water, 1200);
    assert.ok(l.fuel > 0);
    const kinds = effects.map(e => e.effect.kind ?? e.effect.op);
    assert.deepEqual(kinds, ['debit', 'debit', 'heat_released', 'vapor', 'rinse_water']);
    const rinse = effects.find(e => e.effect.kind === 'rinse_water').effect;
    assert.deepEqual(rinse.detail.contents, l.out.waste);
    assert.deepEqual(l.film, {});
    assert.ok(brewBalance(done.facts).balanced);
    // The published effects land in a real world place (W v0) with no B-to-W join code.
    const rules = composeSubstrate({packs: [{id: 'b.brew', quantities: [], laws: [], reactors: []}]});
    let world = createWorld(rules, {holders: [{id: 'workroom', kind: 'place'}, {id: 'cauldron', kind: 'thing', place: 'workroom'}]});
    world = applyWorldOps(rules, world, effects.filter(e => e.effect.op === 'publish').map(e => e.effect), 'b.brew:w.herb');
    assert.deepEqual(world.chain.map(row => row.kind), ['heat_released', 'vapor', 'rinse_water']);
    // A sealed vessel keeps its water.
    const sealed = herbMethod('sealed');
    const s = settleWorking(BREW_LAW, beginWorking(BREW_LAW, sealed.method, {id: 'w.sealed', bindings: sealed.bindings, at: 0}),
        {now: 100, ports: portsFor(sealed.lots, sealed.v)}).record;
    assert.deepEqual(s.facts.brew.out.vapor, {});
    assert.ok(brewBalance(s.facts).balanced);
});

test('a spill moves the batch out into the place; a quote keeps nothing', () => {
    const row = lotmBrewRow('fool_9');
    const lots = lotmLots(row);
    const early = settleWorking(BREW_LAW, beginWorking(BREW_LAW, row.method, {id: 'w.spill', bindings: bindingsFor(row, lots), at: 0}),
        {now: 0, ports: portsFor(lots)}).record;
    const {facts, effect} = spillBatch(early.facts, vessel());
    assert.equal(effect.kind, 'spill');
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
