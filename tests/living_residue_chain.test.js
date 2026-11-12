import test from 'node:test';
import assert from 'node:assert/strict';
import {BREW_LAW, BREW_PUBLISHES, brewBalance, brewMethod} from '../src/brew_law.js';
import {beginWorking, restoreWorking, serializeWorking, settleWorking} from '../src/kernel_working.js';
import {advanceWorld, applyWorldOps, composeSubstrate, createWorld, explainEffect,
    readProvenance, readQuantity, restoreWorld, serializeWorld} from '../src/world_substrate.js';
import {applyEffect} from '../src/world_effects.js';
import {WORLD_QUANTITIES as Q} from '../src/world_quantities.js';
import {createResidueFlowPack, residueQuantity} from '../src/world_substrate_packs/residue_flow.js';
import {createLivingBodyPack, livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {createLivingResiduePack, grazeOp} from '../src/world_substrate_packs/living_residue.js';
import {fingerprint, overBudget, runEquivalence} from '../scripts/emergence_harness.mjs';

const source = 'washroom', field = 'field', other = 'other-field', crop = 'clover', body = 'ewe';
const lot = {id: 'lot.herb', kind: 'lot', material: 'herb', amount: 1000, properties: {active: 600}};
const vessel = {id: 'cauldron', kind: 'vessel', place: source, retainPermille: 50};
const method = brewMethod({id: 'fixture.clover-rinse', slots: [{id: 'herb'}], process: [
    {op: 'divide', minutes: 1, options: {doses: 1}},
    {op: 'rinse', minutes: 2, options: {water: 500}},
]});
const bindings = {vessel: {id: vessel.id, kind: vessel.kind}, herb: {id: lot.id, kind: lot.kind}};
const ports = {read: ref => ({[lot.id]: lot, [vessel.id]: vessel})[ref.id]};
const start = () => beginWorking(BREW_LAW, method, {id: 'w.clover-rinse', bindings, at: 0});
const settle = (record, now) => settleWorking(BREW_LAW, record, {now, ports});
const publications = effects => effects.filter(({effect}) => effect.op === 'publish');
const active = residueQuantity('active'), matrix = residueQuantity('herb:matrix'), forage = 'stock:clover';
const meal = overrides => grazeOp({place: field, crop, body, portions: 2, ...overrides});
const eat = (rules, world, overrides) => applyWorldOps(rules, world, [meal(overrides)], 'fixture.graze');
const dose = {threshold: 5, amount: 2, kind: 'irritation', reason: 'Five trace units in one meal irritate this grazer.'};
const roundTrip = value => JSON.parse(JSON.stringify(value));

function fixture({withCrop = true, withBody = true, cropPlace = field, bodyPlace = field, stock = 4,
    bodyTrace = 0, response = dose} = {}) {
    const rules = composeSubstrate({packs: [
        {id: BREW_LAW.id, publishes: BREW_PUBLISHES},
        createResidueFlowPack({drains: [{from: source, to: field, reason: 'Gravity carries wash water downhill.'}]}),
        createLivingBodyPack(),
        createLivingResiduePack({plots: [{field, crop, forage, concentration: 'uniform-per-deposit', residues: [
            {substance: 'active', quantity: active, uptakePermille: 500,
                intakeReason: 'Trace in an eaten portion passes into tissue in this fixture.', dose: response},
        ]}]}),
    ]});
    const world = createWorld(rules, {holders: [
        {id: source, kind: 'place'},
        {id: field, kind: 'place', quantities: {[active]: 7, [matrix]: 0}},
        {id: other, kind: 'place', quantities: {[active]: 3, [matrix]: 0}},
        {id: vessel.id, kind: 'thing', place: source},
        ...(withCrop ? [{id: crop, kind: 'thing', place: cropPlace, quantities: {[forage]: stock, [active]: 0, [matrix]: 1}}] : []),
        ...(withBody ? [{id: body, kind: 'body', place: bodyPlace, tags: ['living.body'],
            quantities: {[active]: bodyTrace, [matrix]: 2, satiety: 8},
            state: {'l.living_body': livingBodyState({species: 'sheep', rate: 1})}}] : []),
    ]});
    return {rules, world};
}

const inbox = world => world.holders[body].state['l.living_body'].inbox;
const amounts = world => [field, crop, body].map(id => readQuantity(world, id, active));
const rinse = () => publications(settle(start(), 3).effects)[0].effect;
const pour = (rules, world, op = rinse()) => applyWorldOps(rules, world, [op], 'b.brew:w.clover-rinse');

test('pc2: a real rinse supplies the crop, and an explicit meal moves that trace into sheep tissue', () => {
    const {rules, world} = fixture();
    const {record, effects} = settle(start(), 3);
    const [publication] = publications(effects);
    assert.equal(publication.at, 3);
    assert.deepEqual(publication.effect.detail.contents, {active: 30, 'herb:matrix': 20});
    assert.ok(brewBalance(record.facts).balanced);
    const rinsed = pour(rules, advanceWorld(rules, world, 3).world, publication.effect);
    assert.deepEqual(amounts(rinsed), [22, 15, 0]);
    assert.equal(readQuantity(rinsed, crop, forage), 4);
    assert.deepEqual(inbox(rinsed), []);
    const grazed = eat(rules, advanceWorld(rules, rinsed, 4).world);
    assert.deepEqual(amounts(grazed), [22, 8, 7]);
    assert.equal(readQuantity(grazed, crop, forage), 2);
    assert.equal(readQuantity(grazed, body, 'satiety'), 4);
    assert.deepEqual(inbox(grazed), [{at: 4, kind: 'irritation', amount: 2, by: crop}]);
    assert.deepEqual([field, crop, body].map(id => readQuantity(grazed, id, matrix)), [20, 1, 2]);
    assert.equal(readQuantity(grazed, other, active), 3);
    assert.equal(amounts(grazed).reduce((sum, amount) => sum + amount, 0) + record.facts.brew.doses[0].contents.active, 607);
    assert.equal(readQuantity(grazed, field, matrix) + record.facts.brew.doses[0].contents['herb:matrix'], 400);

    const [water, deposit, otherDeposit, uptake, action, fed, harm] = grazed.chain;
    assert.deepEqual(grazed.chain.map(row => [row.kind, row.cause]), [
        ['water.poured', 'b.brew:w.clover-rinse'],
        ['effect.add', water.seq], ['effect.add', water.seq], ['living.crop_uptake', deposit.seq],
        ['living.graze', 'fixture.graze'], ['living.grazed', action.seq], ['living.harm', action.seq],
    ]);
    assert.equal(water.by, vessel.id);
    assert.deepEqual(otherDeposit.reactions, []);
    assert.deepEqual(explainEffect(grazed, uptake.seq).map(row => row.seq), [water.seq, deposit.seq, uptake.seq]);
    assert.deepEqual(explainEffect(grazed, harm.seq).map(row => row.seq), [action.seq, harm.seq]);
    assert.deepEqual(harm.reactions, ['l.living_body:harm-inbox@ewe']);
    assert.equal(fed.by, crop);
    const depositSource = `l.living_residue:deposit:${deposit.seq}`;
    const mealSource = `l.living_residue:graze:${action.seq}:deposit:${deposit.seq}`;
    assert.equal(readProvenance(grazed, field, active)[depositSource], -15);
    assert.equal(readProvenance(grazed, crop, active)[depositSource], 15);
    assert.equal(readProvenance(grazed, crop, active)[mealSource], -7);
    assert.deepEqual(readProvenance(grazed, body, active), {[mealSource]: 7});
});

test('pc2: absence, distance, exhausted stock and insufficient tissue capacity leave the meal unapplied', () => {
    for (const [options, fieldTrace] of [
        [{withCrop: false}, 37], [{cropPlace: other}, 37], [{stock: 0}, 37],
        [{withBody: false}, 22], [{bodyPlace: other}, 22], [{stock: 1}, 22],
        [{bodyTrace: Q.residue.max - 6}, 22],
    ]) {
        const {rules, world} = fixture(options);
        const rinsed = pour(rules, world);
        assert.equal(readQuantity(rinsed, field, active), fieldTrace);
        const grazed = eat(rules, rinsed);
        assert.deepEqual(grazed.holders, rinsed.holders);
        assert.deepEqual(grazed.chain.slice(rinsed.chain.length).map(({kind, reactions}) => [kind, reactions]), [['living.graze', []]]);
    }
    const {rules, world} = fixture();
    const rinsed = pour(rules, world);
    assert.deepEqual(eat(rules, rinsed, {place: other}).holders, rinsed.holders);
    const emptied = eat(rules, rinsed, {portions: 4});
    assert.deepEqual(amounts(emptied), [22, 0, 15]);
    assert.equal(readQuantity(emptied, crop, forage), 0);
    assert.deepEqual(eat(rules, emptied).holders, emptied.holders);
});

test('pc2: generic additions and other events do not induce uptake, and harm needs an authored meal dose', () => {
    const {rules, world} = fixture();
    const generic = applyEffect(rules, world, {verb: 'add', object: active, amount: 30,
        target: {shape: 'holder', id: field}, by: source}, 'fixture.generic-add').world;
    assert.deepEqual(amounts(generic), [37, 0, 0]);
    const [op] = generic.chain;
    assert.deepEqual(op.reactions, []);
    const unrelated = applyWorldOps(rules, generic, [{op: 'publish', kind: 'water.poured', place: other,
        detail: rinse().detail}], 'fixture.unrouted-pour');
    assert.deepEqual(unrelated.holders, generic.holders);
    const lightMeal = eat(rules, pour(rules, world), {portions: 1});
    assert.deepEqual(amounts(lightMeal), [22, 12, 3]);
    assert.deepEqual(inbox(lightMeal), []);
    const noHarm = fixture({response: null});
    const fed = eat(noHarm.rules, pour(noHarm.rules, noHarm.world));
    assert.deepEqual(amounts(fed), [22, 8, 7]);
    assert.deepEqual(inbox(fed), []);
    assert.throws(() => fixture({response: {...dose, reason: ''}}), /needs a dose threshold, amount, kind and reason/);
});

test('pc2: separate deposits keep separate provenance through rounding, repeat meals and reload', () => {
    const {rules, world} = fixture();
    const op = rinse();
    const rinsed = pour(rules, pour(rules, world, op), op);
    const first = eat(rules, rinsed);
    assert.deepEqual(amounts(first), [37, 16, 14]);
    const restored = restoreWorld(rules, serializeWorld(first));
    const last = eat(rules, restored);
    assert.deepEqual(amounts(last), [37, 0, 30]);
    assert.equal(readQuantity(last, crop, forage), 0);
    assert.equal(readQuantity(last, field, matrix), 40);
    const deposits = rinsed.chain.filter(row => row.reactions.includes('l.living_residue:uptake@field'));
    const grazes = last.chain.filter(row => row.kind === 'living.graze');
    const trace = readProvenance(last, body, active);
    assert.equal(deposits.length, 2);
    assert.deepEqual(trace, Object.fromEntries(grazes.flatMap((action, i) => deposits.map(deposit =>
        [`l.living_residue:graze:${action.seq}:deposit:${deposit.seq}`, i === 0 ? 7 : 8]))));
});

test('pc2: timed jumps, minute steps and JSON restores agree on amounts, inbox and cause edges', t => {
    const {rules, world} = fixture();
    const day = 1440;
    const jump = settle(start(), day);
    const [publication] = publications(jump.effects);
    const atRinse = pour(rules, advanceWorld(rules, world, publication.at).world, publication.effect);
    const expected = advanceWorld(rules, eat(rules, advanceWorld(rules, atRinse, 5).world), day).world;
    let record = start(), stepped = world;
    for (let minute = 0; minute <= day; minute++) {
        stepped = advanceWorld(rules, stepped, minute).world;
        const result = settle(record, minute);
        record = result.record;
        for (const {effect} of publications(result.effects)) stepped = pour(rules, stepped, effect);
        if (minute === 5) stepped = eat(rules, stepped);
        if ([2, 3, 5].includes(minute)) {
            record = restoreWorking(BREW_LAW, roundTrip(serializeWorking(record)));
            stepped = restoreWorld(rules, roundTrip(serializeWorld(stepped)));
        }
    }
    assert.deepEqual(record, jump.record);
    assert.deepEqual(serializeWorld(stepped), serializeWorld(expected));
    assert.equal(readQuantity(expected, body, 'satiety'), 0);
    assert.equal(expected.chain.at(-1).kind, 'living.hungry');

    const equivalence = runEquivalence({id: 'pc2-living-residue', days: 1, build: () => ({
        rules, world, schedule: [
            {at: publication.at, ops: [publication.effect], cause: 'b.brew:w.clover-rinse'},
            {at: 5, ops: [meal()], cause: 'fixture.graze'},
        ],
    })});
    assert.ok(equivalence.sameWorld && equivalence.sameChains);
    assert.equal(equivalence.runs.jump.fingerprint, fingerprint(serializeWorld(expected)));
    assert.ok(equivalence.runs.jump.multiDomain.some(chain => chain.includes('water.poured') && chain.includes('living.crop_uptake')));
    t.diagnostic(`Far settlement: ${equivalence.cost.maxSegmentsPerDay} segments/day, ${equivalence.cost.maxMsPerDay.toFixed(3)} ms/day.`);
    assert.deepEqual(overBudget(equivalence.runs.jump, {segmentsPerDay: 4}), []);
    assert.deepEqual(overBudget(equivalence.runs.jump, {segmentsPerDay: 3}), ['segments/day 4 > 3']);
});
