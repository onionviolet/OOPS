// Composed workings (SC6, KW18-KW21). G and S are the first two consumers,
// through adapters kept here so their files stay with their owners:
// resolveGuActivation for killer-move beats, and S's spellDraftCommands for
// combined spells over the real Hogwarts and Cyoria rules.
import assert from 'node:assert/strict';
import test from 'node:test';

import {beginWorking, defineWorkingLaw, nextWorkingDeadline, quoteWorking, restoreWorking, serializeWorking, settleWorking, viewWorking} from '../src/kernel_working.js';
import {composeWorking, composedPart, defineComposition, fillsSlot} from '../src/kernel_compose.js';
import {resolveGuActivation} from '../src/gu_activation.js';
import {runGuProcedure, strengthReversingProcedure as reversal} from '../src/gu_procedures.js';
import {spellDictionary} from '../src/spell_dictionary.js';
import {cyoriaSpellRules, hogwartsSpellRules} from '../src/spell_world_rules.js';
import {HP_SPELL_ROWS} from '../src/spell_pack_hogwarts.js';
import {sharedEffect} from '../src/spell_effects.js';
import {spellEffectMethod} from '../src/spell_law.js';
import {advanceWorld, substratePort} from '../src/world_substrate.js';
import {restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {advanceStoredWorkings, restoreStored, serializeStored, storeWorking} from '../src/stored_working.js';
import {landEffect} from '../src/effect_host.js';
import {config, engine, expected, harm, n, rowSpecs} from './fixtures/stored_workings/rows.mjs';
import {reader, runWorkingContract} from './kernel_contract_suite.mjs';

import {beat, castSlot, composedGuConsumer, composedSpellConsumer, draftStep, guBindings, guLaw, guThings, hpBindings, hpCombined, hpComposed, hpDraft, hpThings, nativeIds, pair, reversalThings, single, spellLaw, stage, threeCore} from './kernel_adapters.mjs';

for (const make of [composedGuConsumer, composedSpellConsumer]) runWorkingContract(make());

// ---- Parity with the unchanged owners ------------------------------------
const runMove = (law, method, bindings, things, immortal) => settleWorking(law,
    beginWorking(law, method, {id: 'move.trial', bindings, facts: {reserves: {player: {immortal}}}, at: 0}), {now: 99, ports: {read: reader(things)}});
const wholeRecipe = immortal => {
    const available = reversal.roles.map(({id, kind}, index) => ({operator: 'player', gu: {id, kind, rank: 6, fedThrough: 100_000},
        ability: {fuel: 'immortal', cost: index + 1}}));
    const binding = Object.fromEntries(reversal.roles.map(({id}) => [id, {id, operator: 'player'}]));
    return runGuProcedure({recipe: {...reversal, completion: undefined}, binding, available,
        stock: {'supplementary-mortal-gu': 330_000}, reserves: {player: {immortal}}, day: 0});
};

test('a composed move spends what the whole recipe spends, and a two-Gu beat stays all or nothing', () => {
    const {law, method} = composeWorking(threeCore, {lead: single, pair});
    const bindings = guBindings('eat-strength', 'pulling-mountain', 'pulling-water');
    const full = runMove(law, method, bindings, reversalThings, 6);
    assert.equal(full.record.status, 'complete');
    assert.deepEqual(full.record.facts.reserves, wholeRecipe(6).remaining);
    // Enough for Pulling Mountain but not Pulling Water: the beat fails whole.
    const short = runMove(law, method, bindings, reversalThings, 4);
    assert.equal(wholeRecipe(4).outcome, 'interrupted');
    assert.equal(short.record.status, 'interrupted');
    assert.deepEqual(short.record.facts.reserves, wholeRecipe(4).remaining);
    assert.deepEqual(short.record.facts.reserves, {player: {immortal: 3}});
    // Splitting the beat into two parts would spend Mountain alone, which is
    // not what the book's simultaneous beat does; that is why a filler stays one part.
    const split = defineComposition({id: 'killer-move.split', revision: 1, roles: threeCore.roles, slots: [
        {name: 'lead', needs: single.method.roles, bindings: {operator: 'operator', core: 'a'}, facts: 'shared'},
        {name: 'b', needs: single.method.roles, bindings: {operator: 'operator', core: 'b'}, facts: 'shared', minutes: 1},
        {name: 'c', needs: single.method.roles, bindings: {operator: 'operator', core: 'c'}, facts: 'shared', minutes: 0},
    ]});
    const splitRun = composeWorking(split, {lead: single, b: single, c: single});
    assert.deepEqual(runMove(splitRun.law, splitRun.method, bindings, reversalThings, 4).record.facts.reserves, {player: {immortal: 1}});
});

test('a killer move from Gu the book never paired runs on the same rules (NV2)', () => {
    const {law, method} = composeWorking(threeCore, {lead: single, pair});
    const things = guThings([['moon-blade', 'moonlight', 2], ['white-jade', 'white-jade', 1], ['stone-skin', 'stone-skin', 2]]);
    const bindings = guBindings('moon-blade', 'white-jade', 'stone-skin');
    const quote = quoteWorking(law, method, {id: 'move.new', bindings, facts: {reserves: {player: {immortal: 5}}}, at: 0, ports: {read: reader(things)}});
    assert.equal(quote.ok, true);
    assert.deepEqual(quote.costs.map(row => row.amount), [2, 1, 2]);
    assert.deepEqual(quote.facts.reserves, {player: {immortal: 0}});
    assert.deepEqual(viewWorking(runMove(law, method, bindings, things, 5).record).steps.map(row => composedPart(row.op)), ['lead', 'pair']);
});

test('combined spells cast the same native commands as the spell owner, in both worlds', () => {
    const hp = hpComposed();
    const hpRun = settleWorking(hp.law, beginWorking(hp.law, hp.method, {id: 'cast.hp', bindings: hpBindings, at: 0}), {now: 9, ports: {read: reader(hpThings)}});
    assert.deepEqual(hpRun.effects.map(row => row.effect.id), nativeIds(hpDraft, hogwartsSpellRules));
    const {filler} = spellLaw(cyoriaSpellRules);
    const parts = ['mol.torch', 'mol.direct_light', 'mol.oblique', 'mol.oblique'];
    const mol = composeWorking(defineComposition({id: 'spell.combined.mol-slate', revision: 1, roles: {slate: 'place'},
        slots: parts.map((method, index) => castSlot(`cast${index}`, method, {area: 'slate'}))}),
    Object.fromEntries(parts.map((method, index) => [`cast${index}`, filler(method)])));
    const slate = {slate: {kind: 'place', id: 'slate'}};
    const molRun = settleWorking(mol.law, beginWorking(mol.law, mol.method, {id: 'cast.mol', bindings: slate, at: 0}), {now: 9, ports: {read: reader(slate)}});
    const molDraft = parts.map(method => draftStep(method, {area: 'slate'}));
    assert.deepEqual(molRun.effects.map(row => row.effect.id), nativeIds(molDraft, cyoriaSpellRules));
    assert.equal(molRun.effects.length, 4, 'repeated casts stay separate steps');
});

// ---- Composition rules ---------------------------------------------------
test('fillers must bind the slot interface; a restore with other fillers is refused', () => {
    assert.equal(fillsSlot(threeCore.slots[1], single), false);
    assert.throws(() => composeWorking(threeCore, {lead: single, pair: single}), /does not bind/);
    assert.throws(() => composeWorking(threeCore, {lead: single}), /does not bind/);
    assert.throws(() => defineComposition({...threeCore, slots: [{...threeCore.slots[0], facts: undefined}]}), /shared or its own/);
    assert.throws(() => defineComposition({...threeCore, slots: [{...threeCore.slots[0], bindings: {operator: 'a', core: 'a'}}]}), /another kind/);
    const a = composeWorking(threeCore, {lead: single, pair});
    assert.equal(a.law.ref, 'killer-move.three-core@1[lead=kernel.test.gu-activation@1:activate-one@1,pair=kernel.test.gu-activation@1:activate-together@1]');
    const swapped = {...pair, method: {...pair.method, revision: 2}};
    const b = composeWorking(threeCore, {lead: single, pair: swapped});
    const record = beginWorking(a.law, a.method, {id: 'move.saved', bindings: guBindings('eat-strength', 'pulling-mountain', 'pulling-water'),
        facts: {reserves: {player: {immortal: 6}}}, at: 0});
    assert.equal(restoreWorking(a.law, serializeWorking(record)).law, a.law.ref);
    assert.throws(() => restoreWorking(b.law, serializeWorking(record)), /different law/);
});

// TG1 / SW11. Reuse the stored family calibration for the clock, duration,
// upkeep and probe. The Gu pairing and spell upkeep are fixture proposals.
const heldSpec = rowSpecs.held[0];
const durations = n.strikeTimes.map((at, i) => at - (n.strikeTimes[i - 1] ?? n.start));
const roundTrip = value => JSON.parse(JSON.stringify(value));

function techniqueHold() {
    const bindings = guBindings('moon-blade', 'stone-skin', 'white-jade');
    const things = guThings([['moon-blade', 'moonlight', n.per], ['stone-skin', 'stone-skin', n.per]]);
    const lead = {...single, method: {...single.method, id: 'activate-twice',
        steps: durations.map(minutes => ({...single.method.steps[0], minutes}))}};
    return {
        id: 'technique.held-support', bindings: {operator: bindings.operator, a: bindings.a, b: bindings.b},
        fillers: {support: single, lead},
        supportRoles: {operator: 'operator', core: 'b'}, leadRoles: {operator: 'operator', core: 'a'},
        facts: {reserves: {player: {immortal: n.energy}}},
        read: () => reader(things),
        describeHold({bindings: bound}) {
            assert.equal(bound.core.id, 'stone-skin');
            assert.equal(bound.operator.id, 'player');
            return heldSpec;
        },
        probe: true,
    };
}

function spellHold() {
    const shield = HP_SPELL_ROWS.find(row => row.id === 'shield').truth;
    const support = spellEffectMethod([{sentence: shield, target: {id: heldSpec.carrier}}], {id: 'protego'});
    const lead = spellEffectMethod(durations.map(minutes => ({...harm, sentence: {...harm.sentence, target: 'body'},
        target: {id: heldSpec.carrier}, minutes})),
        {id: 'ward.probe'});
    // Author the fixture as JSON data, omitting the spell adapter's unused
    // optional massLimit property before comparing the live and restored records.
    lead.method = roundTrip(lead.method);
    return {
        id: 'spell.combined.ward', bindings: {caster: support.bindings.t0, subject: lead.bindings.t0},
        fillers: {support, lead},
        supportRoles: {t0: 'caster'}, leadRoles: {t0: 'subject', t1: 'subject'},
        read: substratePort,
        describeHold({method, bindings: bound}) {
            return {...heldSpec, carrier: bound.t0.id, effects: [{...heldSpec.effects[0], sentence: method.steps[0].options.sentence}]};
        },
    };
}

function runHeld(make, stops, reload = false) {
    const fixture = make();
    const {fillers, bindings} = fixture;
    const composition = defineComposition({id: fixture.id, revision: 1,
        roles: Object.fromEntries(Object.entries(bindings).map(([role, ref]) => [role, ref.kind])),
        slots: [
            {name: 'support', hold: true, facts: 'shared', needs: fillers.support.method.roles, bindings: fixture.supportRoles},
            {name: 'lead', facts: 'shared', needs: fillers.lead.method.roles, bindings: fixture.leadRoles},
        ]});
    const composed = composeWorking(composition, fillers);
    let current = engine();
    let working = beginWorking(composed.law, composed.method, {id: 'held.trial', at: current.world.clock, bindings, facts: fixture.facts});
    let records = composed.storeHeld(working, {describeHold: fixture.describeHold, storeWorking, by: heldSpec.carrier});
    assert.equal(records.length, 1);
    assert.equal(records[0].mode, 'held');
    assert.equal(records[0].watch.next, n.start + n.heldPulse);
    assert.deepEqual(working.deadlines, n.strikeTimes);
    assert.ok(Object.keys(composed.law.operations).every(op => composedPart(op) === 'lead'));
    const ordinary = composeWorking(defineComposition({...composition, slots: [{...composition.slots[0], hold: false}, composition.slots[1]]}), fillers);
    assert.throws(() => restoreWorking(ordinary.law, serializeWorking(working)), /different law/);

    const hits = [];
    const advance = (world, to) => {
        let at = nextWorkingDeadline(working);
        while (at !== null && at <= to) {
            world = advanceWorld(current.rules, world, at).world;
            const settled = settleWorking(composed.law, working, {now: world.clock, ports: {read: fixture.read(world)}});
            working = settled.record;
            const effects = fixture.probe ? [harm] : settled.effects.map(row => row.effect);
            for (const effect of effects) {
                const landed = landEffect(current.rules, world, effect, {cause: 'held-probe', by: 'visitor'});
                hits.push({at: world.clock, outcomes: landed.outcomes});
                world = landed.world;
            }
            at = nextWorkingDeadline(working);
        }
        return advanceWorld(current.rules, world, to).world;
    };
    for (const to of stops) {
        const out = advanceStoredWorkings({rules: current.rules, world: current.world, records, to, advance, read: sharedEffect});
        current = {...current, world: out.world};
        records = out.records;
        if (reload) {
            current = restoreEngineWorld(roundTrip(serializeEngineWorld(current)), config);
            records = records.map(record => restoreStored(roundTrip(serializeStored(record))));
            working = restoreWorking(composed.law, roundTrip(serializeWorking(working)));
        }
    }
    return {world: serializeEngineWorld(current).world, working, records, hits};
}

for (const [name, make] of [['technique support', techniqueHold], ['combined spell ward', spellHold]]) {
    test(`${name}: a held slot protects an ordinary beat, charges upkeep and lapses on the same clock`, () => {
        const jump = runHeld(make, [n.end]);
        assert.deepEqual(runHeld(make, n.parts), jump);
        assert.deepEqual(runHeld(make, [n.reload, n.end], true), jump);
        const {world, working, records: [held], hits} = jump;
        assert.equal(working.status, 'complete');
        assert.deepEqual(working.receipts.map(row => [composedPart(row.op), row.at]), n.strikeTimes.map(at => ['lead', at]));
        assert.deepEqual(hits.map(hit => hit.at), n.strikeTimes);
        assert.equal(hits[0].outcomes[0].blocked.length, 1);
        assert.equal(hits[1].outcomes[0].applied.length, 1);
        assert.equal(world.holders.person.quantities.vitality, expected.heldVitality);
        assert.equal(world.holders.person.quantities['energy:stamina'], 0);
        assert.equal(world.laws.length, 0);
        assert.equal(held.status, 'dormant');
        assert.equal(held.receipts.reduce((sum, row) => sum + row.cost, 0), expected.heldPaid);
        const lapse = held.receipts.find(row => row.status === 'dormant');
        assert.deepEqual([lapse.at, lapse.reason, lapse.cost], [expected.heldLapse, 'charge', 0]);
        if (name === 'technique support') {
            assert.deepEqual(working.receipts.flatMap(row => row.truth.costs.map(cost => cost.amount)), durations.map(() => n.per));
            assert.equal(working.facts.reserves.player.immortal, 0);
        }
    });
}

test('shared facts are a choice: shared slots meet in one table, own slots keep theirs', () => {
    const law = defineWorkingLaw({id: 'kernel.test.count', revision: 1, operations: {
        add: {roles: {maker: 'actor'}, minutes: 1, settle: ({facts, options}) => ({ok: true, facts: {count: (facts.count ?? 0) + options.by}})},
    }});
    const adder = by => ({law, method: {id: `add-${by}`, revision: 1, law: law.ref, roles: {maker: 'actor'},
        steps: [{op: 'add', bindings: {maker: 'maker'}, options: {by}}]}});
    const run = facts => {
        const composition = defineComposition({id: `count.${facts}`, revision: 1, roles: {maker: 'actor'}, slots: ['x', 'y'].map(name =>
            ({name, needs: {maker: 'actor'}, bindings: {maker: 'maker'}, facts}))});
        const {law: composed, method} = composeWorking(composition, {x: adder(2), y: adder(5)});
        return settleWorking(composed, beginWorking(composed, method, {id: 'count.run', bindings: {maker: {kind: 'actor', id: 'player'}}, at: 0}), {now: 9}).record.facts;
    };
    assert.deepEqual(run('shared'), {count: 7});
    assert.deepEqual(run('own'), {'part:x': {count: 2}, 'part:y': {count: 5}});
});

test('a composition can fill a slot with another composed working', () => {
    const move = composeWorking(threeCore, {lead: single, pair});
    const opening = defineComposition({id: 'killer-move.opening', revision: 1, roles: {...threeCore.roles, d: 'gu'}, slots: [
        {name: 'move', needs: threeCore.roles, bindings: {operator: 'operator', a: 'a', b: 'b', c: 'c'}, facts: 'shared'},
        {name: 'follow', needs: single.method.roles, bindings: {operator: 'operator', core: 'd'}, facts: 'shared'},
    ]});
    const {law, method} = composeWorking(opening, {move, follow: single});
    const things = {...reversalThings, ...guThings([['moon-blade', 'moonlight', 2]])};
    const bindings = {...guBindings('eat-strength', 'pulling-mountain', 'pulling-water'), d: {kind: 'gu', id: 'moon-blade'}};
    const {record} = settleWorking(law, beginWorking(law, method, {id: 'opening.run', bindings, facts: {reserves: {player: {immortal: 8}}}, at: 0}),
        {now: 9, ports: {read: reader(things)}});
    assert.equal(record.status, 'complete');
    assert.deepEqual(record.facts.reserves, {player: {immortal: 0}});
    assert.deepEqual(record.receipts.map(row => row.op), ['move/lead/beat-1', 'move/pair/beat-2', 'follow/beat-1']);
});

test('nested held supports map their roles and restore alongside ordinary beats without double charge', () => {
    const fixture = techniqueHold();
    const roles = Object.fromEntries(Object.entries(fixture.bindings).map(([role, ref]) => [role, ref.kind]));
    const move = composeWorking(defineComposition({id: 'technique.nested-support', revision: 1, roles, slots: [
        {name: 'support', hold: true, facts: 'shared', needs: single.method.roles, bindings: fixture.supportRoles},
        {name: 'lead', facts: 'shared', needs: single.method.roles, bindings: fixture.leadRoles, minutes: durations[0]},
    ]}), {support: single, lead: single});
    const slots = [
        {name: 'first', facts: 'shared', needs: roles, bindings: {operator: 'operator', a: 'a', b: 'b'}},
        {name: 'second', facts: 'shared', needs: roles, bindings: {operator: 'operator', a: 'b', b: 'a'}, minutes: durations[1]},
    ];
    const {law, method, storeHeld} = composeWorking(defineComposition({id: 'technique.nested-pair', revision: 1, roles, slots}),
        {first: move, second: move});
    const seen = [];
    const timing = {pace: ({through}) => ({through, course: []})};
    const initial = beginWorking(law, method, {id: 'nested.trial', at: n.start, bindings: fixture.bindings,
        facts: fixture.facts, paceRole: 'operator', ports: timing});
    const stored = storeHeld(initial, {storeWorking, by: heldSpec.carrier, ports: timing, describeHold({slot, method, bindings, at}) {
        seen.push([slot, bindings.operator.id, bindings.core.id]);
        assert.deepEqual(method, single.method);
        assert.equal(at, n.start);
        const [guard] = heldSpec.effects;
        const target = {shape: 'holder', id: heldSpec.carrier};
        return {...heldSpec, effects: [{...guard, details: {...guard.details, target, field: `nested.guard.${slot.replaceAll('/', '.')}`}}]};
    }});
    assert.deepEqual(seen, [['first/support', 'player', 'stone-skin'], ['second/support', 'player', 'moon-blade']]);
    assert.deepEqual(stored.map(record => record.id), ['nested.trial/hold/first%2Fsupport', 'nested.trial/hold/second%2Fsupport']);
    assert.deepEqual(initial.deadlines, n.strikeTimes);

    const run = (stops, reload = false) => {
        let current = engine();
        let working = initial;
        let records = stored;
        const advance = (world, to) => {
            world = advanceWorld(current.rules, world, to).world;
            working = settleWorking(law, working, {now: world.clock, ports: {read: fixture.read(world), ...timing}}).record;
            return world;
        };
        for (const to of stops) {
            const out = advanceStoredWorkings({rules: current.rules, world: current.world, records, to, advance, read: sharedEffect});
            current = {...current, world: out.world};
            records = out.records;
            if (reload) {
                current = restoreEngineWorld(roundTrip(serializeEngineWorld(current)), config);
                records = records.map(record => restoreStored(roundTrip(serializeStored(record))));
                working = restoreWorking(law, roundTrip(serializeWorking(working)), {ports: timing});
            }
        }
        return {world: serializeEngineWorld(current).world, working, records};
    };
    const result = run([n.end]);
    assert.deepEqual(run(n.parts), result);
    assert.deepEqual(run([n.reload, n.end], true), result);
    assert.equal(result.working.status, 'complete');
    assert.deepEqual(result.working.receipts.map(row => [row.op, row.at]),
        [['first/lead/beat-1', n.strikeTimes[0]], ['second/lead/beat-1', n.strikeTimes[1]]]);
    assert.deepEqual(result.working.receipts.flatMap(row => row.truth.costs.map(cost => cost.amount)), [n.per, n.per]);
    assert.equal(result.working.facts.reserves.player.immortal, 0);
    assert.equal(result.world.holders.person.quantities['energy:stamina'], 0);
    for (const record of result.records) {
        assert.equal(record.status, 'dormant');
        assert.deepEqual(record.receipts.filter(row => row.cost > 0).map(row => [row.at, row.cost]), [[n.start + n.heldPulse, n.per]]);
        assert.equal(record.receipts.find(row => row.status === 'dormant').reason, 'charge');
    }
});
