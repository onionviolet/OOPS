import test from 'node:test';
import assert from 'node:assert/strict';
import {BREW_LAW, BREW_PUBLISHES, brewBalance, brewMethod, spillBatch} from '../src/brew_law.js';
import {beginWorking, restoreWorking, serializeWorking, settleWorking} from '../src/kernel_working.js';
import {advanceWorld, applyWorldOps, composeSubstrate, createWorld, explainEffect,
    readProvenance, readQuantity, restoreWorld, serializeWorld} from '../src/world_substrate.js';
import {WORLD_EFFECT_KINDS as K, WORLD_QUANTITIES as Q} from '../src/world_quantities.js';
import {createResidueFlowPack, residueQuantity} from '../src/world_substrate_packs/residue_flow.js';
import {fingerprint, overBudget, runEquivalence} from '../scripts/emergence_harness.mjs';

const source = 'washroom', field = 'downhill-field', other = 'other-field';
// A milli-unit fixture with one measured charge. The whole charge splits into
// active material and its unassigned matrix so both must survive the rinse.
const lot = {id: 'lot.herb', kind: 'lot', material: 'herb', amount: 1000, properties: {active: 600}};
// A rough vessel keeps 5% film. One dose isolates this from dose rounding;
// the minute to bottle and two to rinse let reload cut between those steps.
const vessel = {id: 'cauldron', kind: 'vessel', place: source, retainPermille: 50};
const method = brewMethod({id: 'fixture.field-rinse', slots: [{id: 'herb'}], process: [
    {op: 'divide', minutes: 1, options: {doses: 1}},
    {op: 'rinse', minutes: 2, options: {water: 500}}, // Half a fixture unit of carrier washes the film.
]});
const bindings = {vessel: {id: vessel.id, kind: vessel.kind}, herb: {id: lot.id, kind: lot.kind}};
const ports = {read: ref => ref.id === vessel.id ? vessel : ref.id === lot.id ? lot : null};
const initialWorking = () => beginWorking(BREW_LAW, method, {id: 'w.field-rinse', bindings, at: 0});
const settle = (record, now) => settleWorking(BREW_LAW, record, {now, ports});
const entries = {active: 30, 'herb:matrix': 20};
const active = 'residue:active';
const matrix = residueQuantity('herb:matrix');
const accounts = {[active]: 7, [matrix]: 0}; // An earlier pour left 7 active trace units in this soil.
const publishOps = effects => effects.filter(row => row.effect.op === 'publish').map(row => row.effect);
const cause = 'b.brew:w.field-rinse';

function fixture({to = field, quantities = accounts, vesselPlace = source} = {}) {
    const rules = composeSubstrate({packs: [
        {id: BREW_LAW.id, publishes: BREW_PUBLISHES},
        createResidueFlowPack({drains: [{from: source, to, reason: 'A gravity drain empties into the downhill soil.'}]}),
    ]});
    const world = createWorld(rules, {holders: [
        {id: source, kind: 'place'},
        {id: field, kind: 'place', quantities},
        {id: other, kind: 'place', quantities: {[active]: 0, [matrix]: 0}},
        {id: vessel.id, kind: 'thing', place: vesselPlace},
    ]});
    return {rules, world};
}

test('pc2: real brew film reaches the authored field with per-substance conservation and a cause chain', () => {
    const {rules, world} = fixture();
    const {record, effects} = settle(initialWorking(), 3);
    const [pour] = publishOps(effects);
    assert.equal(record.status, 'complete');
    assert.equal(pour.kind, K.water_poured.id);
    assert.equal(pour.place, source);
    assert.deepEqual(pour.detail.contents, entries);
    assert.deepEqual(record.facts.brew.out.waste, entries);
    assert.deepEqual(record.facts.brew.film, {});
    assert.ok(brewBalance(record.facts).balanced);

    const result = applyWorldOps(rules, advanceWorld(rules, world, 3).world, [pour], cause);
    const [root, ...children] = result.chain;
    assert.equal(root.cause, cause);
    assert.deepEqual(root.reactions, ['w.residue_flow:drain@washroom']);
    assert.equal(children.length, 2);
    for (const [substance, amount] of Object.entries(entries)) {
        const quantity = residueQuantity(substance);
        assert.equal(readQuantity(result, field, quantity) - readQuantity(world, field, quantity), amount);
        assert.equal(readQuantity(result, other, quantity), 0);
        assert.equal(readQuantity(result, source, quantity), null);
        assert.deepEqual(readProvenance(result, field, quantity), {'w.residue_flow:drain:washroom': amount});
        assert.equal(record.facts.brew.doses[0].contents[substance] + amount,
            substance === 'active' ? 600 : 400);
    }
    for (const child of children) {
        assert.equal(child.cause, root.seq);
        assert.deepEqual(explainEffect(result, child.seq).map(({kind, by, place, at}) => [kind, by, place, at]),
            [[K.water_poured.id, vessel.id, source, 3], ['effect.add', source, field, 3]]);
    }
    assert.notEqual(matrix, residueQuantity(matrix.slice('residue:'.length)));
});

test('pc2: only the configured source drains, and a bad receiver rejects the whole pour', () => {
    // Run the same brew from a vessel whose wash water has no authored drain.
    const otherPorts = {read: ref => ref.id === vessel.id ? {...vessel, place: other} : ports.read(ref)};
    const [otherPour] = publishOps(settleWorking(BREW_LAW, initialWorking(), {now: 3, ports: otherPorts}).effects);
    const {rules, world} = fixture({vesselPlace: other});
    const ignored = applyWorldOps(rules, world, [otherPour], cause);
    assert.deepEqual(ignored.holders, world.holders);
    assert.deepEqual(ignored.chain.map(row => [row.kind, row.place, row.reactions]), [[K.water_poured.id, other, []]]);

    const [pour] = publishOps(settle(initialWorking(), 3).effects);
    for (const [options, error] of [
        [{to: vessel.id}, /needs a place at cauldron/],
        [{to: 'absent-field'}, /needs a place at absent-field/],
        [{quantities: {[active]: 7}}, /no receiver/],
        [{quantities: {...accounts, [matrix]: Q.residue.max - 19}}, /insufficient capacity/],
    ]) {
        const failed = fixture(options);
        const before = serializeWorld(failed.world);
        assert.throws(() => applyWorldOps(failed.rules, failed.world, [pour], cause), error);
        assert.deepEqual(serializeWorld(failed.world), before);
    }
});

test('pc2: a spill uses the same drain and another pour sees its occupied capacity', () => {
    const admitted = settle(initialWorking(), 0).record;
    const {facts, effect} = spillBatch(admitted.facts, vessel);
    assert.deepEqual(facts.brew.out.spill, {active: 600, 'herb:matrix': 400});
    assert.ok(brewBalance(facts).balanced);

    // A nearly saturated soil account can take one spill but cannot take two.
    const {rules, world} = fixture({quantities: {...accounts, [matrix]: Q.residue.max - 400}});
    const landed = applyWorldOps(rules, world, [effect], cause);
    assert.equal(readQuantity(landed, field, active), accounts[active] + 600);
    assert.equal(readQuantity(landed, field, matrix), Q.residue.max);
    const before = serializeWorld(world);
    assert.throws(() => applyWorldOps(rules, world, [effect, effect], cause), /insufficient capacity/);
    assert.deepEqual(serializeWorld(world), before);
});

const roundTrip = value => JSON.parse(JSON.stringify(value));

test('pc2: a long settlement, minute steps and reloads agree on the working and field', () => {
    const {rules, world} = fixture();
    const oneDay = 1440; // A day away exercises far settlement without a new tick.
    const jump = settle(initialWorking(), oneDay);
    const [publication] = jump.effects.filter(row => row.effect.op === 'publish');
    const atPour = advanceWorld(rules, world, publication.at).world;
    const poured = applyWorldOps(rules, atPour, [publication.effect], cause);
    const expected = advanceWorld(rules, poured, oneDay).world;

    for (const reload of [false, true]) {
        let record = initialWorking();
        let stepped = world;
        for (let minute = 0; minute <= oneDay; minute++) {
            stepped = advanceWorld(rules, stepped, minute).world;
            const result = settle(record, minute);
            record = result.record;
            const ops = publishOps(result.effects);
            if (ops.length) stepped = applyWorldOps(rules, stepped, ops, cause);
            // Reload just before the rinse, then after the field has received it.
            if (reload && (minute === 2 || minute === 3)) {
                record = restoreWorking(BREW_LAW, roundTrip(serializeWorking(record)));
                stepped = restoreWorld(rules, roundTrip(serializeWorld(stepped)));
            }
        }
        assert.deepEqual(record, jump.record);
        assert.deepEqual(serializeWorld(stepped), serializeWorld(expected));
    }

    const eq = runEquivalence({id: 'pc2-field-fixture', days: 1, build: () => ({
        rules, world, schedule: [{at: publication.at, ops: [publication.effect], cause}],
    })});
    assert.ok(eq.sameWorld && eq.sameChains);
    assert.equal(eq.runs.jump.fingerprint, fingerprint(serializeWorld(expected)));
    assert.equal(eq.runs.jump.records, 3);
    assert.ok(eq.runs.jump.multiDomain.some(chain => chain.includes('water.poured') && chain.includes('w.residue_flow:drain')));
    // Far mode needs one segment on each side of the only external publication.
    assert.equal(eq.cost.maxSegmentsPerDay, 2);
    assert.deepEqual(overBudget(eq.runs.jump, {segmentsPerDay: 2}), []);
    assert.deepEqual(overBudget(eq.runs.jump, {segmentsPerDay: 1}), ['segments/day 2 > 1']);
});
