// Composed workings (SC6, KW18-KW21). G and S are the first two consumers,
// through adapters kept here so their files stay with their owners:
// resolveGuActivation for killer-move beats, and S's spellDraftCommands for
// combined spells over the real Hogwarts and Cyoria rules.
import assert from 'node:assert/strict';
import test from 'node:test';

import {beginWorking, defineWorkingLaw, quoteWorking, restoreWorking, serializeWorking, settleWorking, viewWorking} from '../src/kernel_working.js';
import {composeWorking, composedPart, defineComposition, fillsSlot} from '../src/kernel_compose.js';
import {resolveGuActivation} from '../src/gu_activation.js';
import {runGuProcedure, strengthReversingProcedure as reversal} from '../src/gu_procedures.js';
import {spellDictionary} from '../src/spell_dictionary.js';
import {cyoriaSpellRules, hogwartsSpellRules} from '../src/spell_world_rules.js';
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
    const swapped = {...pair, method: {...pair.method, revision: 2}};
    const b = composeWorking(threeCore, {lead: single, pair: swapped});
    const record = beginWorking(a.law, a.method, {id: 'move.saved', bindings: guBindings('eat-strength', 'pulling-mountain', 'pulling-water'),
        facts: {reserves: {player: {immortal: 6}}}, at: 0});
    assert.equal(restoreWorking(a.law, serializeWorking(record)).law, a.law.ref);
    assert.throws(() => restoreWorking(b.law, serializeWorking(record)), /different law/);
});

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
