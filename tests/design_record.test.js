// Design record (E3, PC97): one view over five native shapes. Each example is a
// real record its own law already runs: a sheep from the lifecycle, a brew pack
// row, a spellbook case sentence, a Gu move role record and the steel process
// method. World numbers stay in those packs and in this fixture.
import test from 'node:test';
import assert from 'node:assert/strict';
import {copyDesign, designKinds, designPart, editPart, partsCoupledTo, readDesign, writeDesign} from '../src/design_record.js';
import {acquireCreature, restoreCreatureLifecycle, settleCohortStock} from '../src/creature_lifecycle.js';
import {expressGenes, foundingBreeding, inheritGenes, validateBreeding, validateGenes} from '../src/heredity.js';
import {livingGenome, livingKindRegistry} from '../src/living_kinds.js';
import {beginWorking, quoteWorking, settleWorking} from '../src/kernel_working.js';
import {BREW_LAW, brewBalance} from '../src/brew_law.js';
import {lotmBrewRow, lotmDoseReading, lotmLots} from '../src/world_packs/lotm_brew_pack.js';
import {applySentence, assembleEffect} from '../src/effect_grammar.js';
import {coverageCase, hpEffects} from '../src/world_packs/hp_effect_pack.js';
import {advanceWorld, composeSubstrate, createWorld, readQuantity} from '../src/world_substrate.js';
import {WORLD_QUANTITIES as WQ, WORLD_PROPERTIES as WP} from '../src/world_quantities.js';
import {compileGuMove} from '../src/gu_move_roles.js';
import {asBoundGu, guRef} from '../src/gu_working_law.js';
import {defineComposition} from '../src/kernel_compose.js';
import {PROCESS_LAW, processMethod, projectProcess} from '../src/process_law.js';
import {applyLoad} from '../src/load_law.js';
import {applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {steelPack, loadPack} from './fixtures/process_craft_packs.js';

// --- Five native examples and how each native law runs one.

// Creature: a ewe acquired through the lifecycle; her heritable fields are the design.
const sheep = livingGenome(livingKindRegistry(), 'sheep');
function ewe() {
    const pen = {id: 'pen', capacity: 8, supportedSpecies: ['sheep']};
    let s = restoreCreatureLifecycle();
    s = settleCohortStock(s, {revision: s.revision, id: 'market', species: 'sheep', habitat: pen, delta: 1});
    const got = acquireCreature(s, {revision: s.revision, cohortId: 'market', destination: pen, keeper: 'player', clock: 0, genome: sheep,
        genes: {fleece: ['F', 'f'], coat: ['D', 'd'], winter: ['w', 'w'], vigor: ['V', 'v']},
        breeding: foundingBreeding(sheep, {root: 'design-bench', at: 'ewe'})});
    const {genes, breeding} = got.state.individuals[got.id];
    return {genes, breeding};
}
const cold = {mature: true, environment: {cold: 2}};
function runCreature(native) {
    validateGenes(sheep, native.genes);
    validateBreeding(sheep, native.breeding);
    return expressGenes(sheep, native.genes, cold);
}

// Potion: the Seer formula row on the shared brew law.
const seer = lotmBrewRow('fool_9');
function runRecipe(row, measures = {}) {
    const lots = lotmLots(row, measures), vessel = {kind: 'vessel', id: 'cauldron', place: 'workroom', retainPermille: 0, closure: 'open'};
    const things = {[vessel.id]: vessel, ...Object.fromEntries(Object.values(lots).map(l => [l.id, l]))};
    const bindings = {vessel: {kind: 'vessel', id: vessel.id}, ...Object.fromEntries(Object.entries(lots).map(([k, lot]) => [k, {kind: 'lot', id: lot.id}]))};
    const record = beginWorking(BREW_LAW, row.method, {id: `w.${row.id}`, bindings, at: 0});
    const done = settleWorking(BREW_LAW, record, {now: record.deadlines.at(-1), ports: {read: ref => things[ref.id] ?? null}}).record;
    assert.equal(done.status, 'complete');
    assert.ok(brewBalance(done.facts).balanced);
    return {doses: done.facts.brew.doses.length, ...lotmDoseReading(row, done.facts.brew.doses[0])};
}

// Spell: the shield case sentence from the spellbook pack, run in its own scene.
const shield = coverageCase('shield');
const rules = composeSubstrate({packs: [{id: 'w.vocabulary', quantities: Object.values(WQ), properties: Object.values(WP)}]});
function runSpell(sentence, {cutAfter = 5} = {}) {
    const built = assembleEffect(hpEffects, sentence);
    const scene = structuredClone(shield.world);
    scene.holders.find(h => h.id === 'caster').quantities = {vitality: 10};
    const cast = applySentence(rules, createWorld(rules, scene), sentence, shield.details, {keys: shield.keys, cause: 'design-bench:shield'});
    const later = advanceWorld(rules, cast.world, cutAfter).world;
    const cut = applySentence(rules, later, {verb: 'remove', object: 'vitality'}, {target: {shape: 'holder', id: 'caster'}, amount: 4}, {cause: 'design-bench:cut'});
    return {ok: built.ok, violations: built.receipt.violations, scope: built.value.derived.scope, counters: built.value.derived.counters,
        vitalityAfterLateCut: readQuantity(cut.world, 'caster', 'vitality')};
}

// Move: the supported fire attack's role record (ids and kinds as in
// docs/research/gu-identity-evidence.json, move xiao-yan-fire-set, chapter 275).
const fireSet = {id: 'xiao-yan-fire-set', roles: [{id: 'attack', kind: 'red-fire'}, {id: 'count', kind: 'duplicate'},
    {id: 'size', kind: 'enlarge'}, {id: 'economy', kind: 'fire-source'}]};
function runMove(record, {lacking = []} = {}) {
    const operator = {kind: 'operator', id: 'keeper'}, things = {[operator.id]: operator}, bindings = {operator};
    for (const {id, kind} of record.roles.filter(role => role.kind && !lacking.includes(role.kind))) {
        things[id] = asBoundGu({id, kind, rank: 1, fedThrough: 100, alive: true, holder: operator.id});
        bindings[id] = guRef(id);
    }
    const args = {id: 'design-bench', at: 0, bindings, facts: {reserves: {keeper: {primeval: 10}}},
        ports: {read: ref => Object.hasOwn(things, ref.id) ? things[ref.id] : null}};
    const compiled = compileGuMove(record, args);
    if (!compiled.ok) return {ok: false, requirements: compiled.requirements};
    const quote = quoteWorking(compiled.law, compiled.method, {...args, bindings: compiled.bindings});
    return {ok: quote.ok, effects: quote.effects.map(({kind, count, magnitude}) => ({kind, count, magnitude})),
        spent: 10 - quote.facts.reserves.keeper.primeval};
}

// Made thing: forge, quench and temper a steel sample. Process law keeps the
// method input and the starting piece apart; this blueprint holds both.
const S = steelPack.steps;
const blade = {id: steelPack.id, revision: steelPack.revision, steps: [S.heat, S.forge, S.quench, S.temper],
    rows: steelPack.rows, projection: steelPack.projection, piece: steelPack.piece};
function runMade(native) {
    const method = processMethod(native);
    const things = {piece: native.piece, ...steelPack.media, ...steelPack.tools};
    const bindings = Object.fromEntries(Object.keys(method.roles).map(role => [role, {kind: things[role].kind, id: things[role].id}]));
    const ports = {read: ref => Object.values(things).find(thing => thing.kind === ref.kind && thing.id === ref.id)};
    const record = beginWorking(PROCESS_LAW, method, {id: 'design-bench.blade', bindings, at: 0});
    const done = settleWorking(PROCESS_LAW, record, {now: record.deadlines.at(-1), ports}).record;
    assert.equal(done.status, 'complete');
    const properties = projectProcess(done.facts, native.projection);
    return {properties, load: applyLoad({properties}, loadPack.load, loadPack.thresholds)};
}

const examples = {
    creature: {native: ewe(), options: {id: 'ewe', context: {genome: sheep}}, run: runCreature},
    recipe: {native: seer, run: runRecipe},
    spell: {native: shield.sentence, options: {id: 'shield'}, run: runSpell},
    move: {native: fireSet, run: runMove},
    made: {native: blade, run: runMade},
};
const design = kind => readDesign(kind, examples[kind].native, examples[kind].options);

test('1. native -> design -> native is identical for one real example of each of the five', () => {
    for (const [kind, {native}] of Object.entries(examples)) {
        const d = design(kind);
        assert.ok(d.parts.length > 0, kind);
        assert.equal(new Set(d.parts.map(part => part.id)).size, d.parts.length, `${kind}: part ids are addresses`);
        assert.deepEqual(writeDesign(d), native, kind);
        // A design is plain data: it survives a save and writes back the same record.
        assert.deepEqual(writeDesign(JSON.parse(JSON.stringify(d))), JSON.parse(JSON.stringify(native)), `${kind} after a save`);
    }
    // A composition definition (kernel_compose) reads the same way and its own validator takes it back.
    const composition = defineComposition({id: 'bench.pair', revision: 1, roles: {a: 'gu', b: 'gu', operator: 'operator'}, slots: [
        {name: 'first', needs: {gu: 'gu', operator: 'operator'}, bindings: {gu: 'a', operator: 'operator'}, facts: 'shared'},
        {name: 'second', needs: {gu: 'gu', operator: 'operator'}, bindings: {gu: 'b', operator: 'operator'}, facts: 'own', minutes: 1}]});
    assert.deepEqual(defineComposition(writeDesign(readDesign('composition', composition))), composition);
    assert.deepEqual(designKinds(), ['creature', 'recipe', 'spell', 'move', 'composition', 'made']);
});

test('parts carry an address, a role, a value and what they couple to', () => {
    const winter = designPart(design('creature'), 'gene:winter');
    assert.deepEqual(winter, {id: 'gene:winter', role: 'locus', value: ['w', 'w'], couples: ['trait:winter coat', 'quantity:cold']});
    const recipe = design('recipe');
    assert.equal(designPart(recipe, 'slot:m2').role, 'main');
    // The binder slot and the react step meet at the constituent the slot carries.
    assert.deepEqual(partsCoupledTo(recipe, 'constituent:bind_m2').map(part => `${part.id} ${part.role}`), ['slot:m2 main', 'step:7 react']);
    assert.deepEqual(designPart(design('spell'), 'slot:time'), {id: 'slot:time', role: 'time', value: 'sustained', couples: ['derived:scope']});
    assert.deepEqual(designPart(design('move'), 'role:size').couples, ['kind:enlarge']);
    const made = design('made');
    assert.deepEqual(designPart(made, 'step:3'), {id: 'step:3', role: 'hold', value: S.temper, couples: ['medium:oven']});
    assert.deepEqual(partsCoupledTo(made, 'share:tempered').map(part => part.id),
        ['row:heat-tempered', 'row:temper', 'property:hardness', 'property:toughness', 'share:tempered']);
});

// One operator, written once (editPart), aimed at one part of each kind.
const edits = {
    creature: ['gene:winter', () => ['W', 'w']],
    recipe: ['slot:m2', slot => ({...slot, material: 'Clouded Star Crystal', properties: {bind_m2: 600}})],
    spell: ['slot:time', 'lasting'],
    move: ['role:size', role => ({...role, kind: 'duplicate'})],
    made: ['step:3', step => ({...step, minutes: 4})],
};

test('2. one "edit one part" operator changes all five, and each native law gives a different valid outcome', t => {
    const seen = {};
    for (const [kind, [partId, change]] of Object.entries(edits)) {
        const {run} = examples[kind], before = design(kind);
        const {design: edited, receipt} = editPart(before, partId, change);
        assert.equal(receipt.op, 'edit');
        assert.deepEqual(receipt.before, designPart(before, partId).value, kind);
        assert.notDeepEqual(receipt.after, receipt.before, kind);
        // One part changed; every other part and the source design are untouched.
        assert.deepEqual(edited.parts.filter(part => part.id !== partId), before.parts.filter(part => part.id !== partId), kind);
        assert.deepEqual(writeDesign(before), examples[kind].native, kind);
        seen[kind] = {was: run(examples[kind].native), now: run(writeDesign(edited))};
        assert.notDeepEqual(seen[kind].now, seen[kind].was, `${kind}: the native law sees the edit`);
    }
    // Sheep gene: the winter coat now shows where the cold calls for it.
    assert.equal(seen.creature.was.winter.shows, 'absent');
    assert.equal(seen.creature.now.winter.shows, 'full');
    // Potion ingredient: a weaker binder brews a complete, balanced, weaker dose, and
    // the charge it leaves unbound is the price (a fault, not a refusal).
    assert.deepEqual([seen.recipe.was.fullDosePermille, seen.recipe.was.hazard], [1000, 0]);
    assert.ok(seen.recipe.now.fullDosePermille < 1000 && seen.recipe.now.power > 0 && seen.recipe.now.hazard > 0);
    // Spell duration: the grammar accepts it at a higher scope (the curve its price
    // reads), and the guard still stands when the original has run out.
    assert.equal(seen.spell.now.ok, true);
    assert.equal(seen.spell.now.scope, seen.spell.was.scope + 1);
    assert.deepEqual([seen.spell.was.vitalityAfterLateCut, seen.spell.now.vitalityAfterLateCut], [6, 10]);
    // Move support: a second count support in place of the size support. The move
    // still runs; the size is lost, the doubled support does not stack under the Gu
    // law as it stands, and its essence is spent all the same (the price of a poor edit).
    assert.deepEqual(seen.move.was, {ok: true, effects: [{kind: 'flame', count: 2, magnitude: 2}], spent: 6});
    assert.deepEqual(seen.move.now, {ok: true, effects: [{kind: 'flame', count: 2, magnitude: 1}], spent: 6});
    // Blade temper: a short temper leaves a harder, less tough blade that breaks under the load the first one held.
    assert.ok(seen.made.now.properties.hardness > seen.made.was.properties.hardness);
    assert.equal(seen.made.was.load.held, true);
    assert.equal(seen.made.now.load.broke, true);
    t.diagnostic(JSON.stringify(seen));
});

test('the same operator reaches a reach slot, a recipe step and a material, and a missed address changes nothing', () => {
    // Reach: wider reach is accepted and priced by scope. Who is hit still comes from the
    // cast's own target detail, so the world outcome is the same (a gap named in the doc).
    const wide = runSpell(writeDesign(editPart(design('spell'), 'slot:target', 'area').design)), self = runSpell(shield.sentence);
    assert.equal(wide.ok, true);
    assert.equal(wide.scope, self.scope + 3);
    // Recipe step: pour two doses instead of one.
    const recipe = design('recipe'), pour = recipe.parts.find(part => part.role === 'divide');
    const two = runRecipe(writeDesign(editPart(recipe, pour.id, step => ({...step, options: {...step.options, doses: 2}})).design));
    assert.equal(two.doses, 2);
    assert.ok(two.fullDosePermille < 1000);
    // Material: coarser starting stock gives a less tough blade from the same process.
    const coarse = runMade(writeDesign(editPart(design('made'), 'scalar:grain', 18).design));
    assert.ok(coarse.properties.toughness < runMade(blade).properties.toughness);
    // An unsuitable value is not refused here: the native law answers it. A cost the
    // carrier cannot pay comes back from the grammar as a named violation.
    const unpaid = runSpell(writeDesign(editPart(design('spell'), 'slot:cost', 'essence-primeval').design));
    assert.equal(unpaid.ok, false);
    assert.ok(unpaid.violations.some(v => v.rule === 'carrier-cost'));
    const before = design('move'), miss = editPart(before, 'role:absent', {kind: 'moonlight'});
    assert.equal(miss.design, before);
    assert.deepEqual(miss.receipt, {op: 'edit', design: 'xiao-yan-fire-set', part: 'role:absent', missed: true});
});

test('3. one "copy" operator duplicates a design, and the copy shares the original\'s weakness', () => {
    // What each original is weak to, in its own law's terms.
    const stress = {
        creature: native => runCreature(native).winter,                       // no winter coat in the cold
        recipe: native => runRecipe(native, {m1: 12000}),                      // an over measure of the charged main
        spell: native => runSpell(native, {cutAfter: 0}).counters,             // the verbs that answer it
        move: native => runMove(native, {lacking: ['fire-source']}),           // it needs its economy support
        made: native => runMade({...native, steps: native.steps.slice(0, 3)}), // untempered, it breaks
    };
    for (const kind of Object.keys(examples)) {
        const original = design(kind);
        const {design: copy, receipt} = copyDesign(original, {id: `${original.id}.copy`});
        assert.deepEqual(receipt, {op: 'copy', design: `${original.id}.copy`, from: original.id, parts: original.parts.length});
        assert.equal(copy.from, original.id);
        assert.deepEqual(copy.parts, original.parts, kind);
        assert.notEqual(copy.parts, original.parts);
        assert.deepEqual(stress[kind](writeDesign(copy)), stress[kind](examples[kind].native), `${kind}: same weakness`);
        // The copy is its own design: editing it leaves the original as it was.
        const [partId, change] = edits[kind];
        editPart(copy, partId, change);
        assert.deepEqual(writeDesign(original), examples[kind].native, kind);
    }
    assert.equal(stress.creature(examples.creature.native).shows, 'absent');
    assert.ok(stress.recipe(seer).hazard > 0);
    assert.deepEqual(stress.spell(shield.sentence), ['end', 'remove']);
    assert.deepEqual(stress.move(fireSet).requirements.map(r => `${r.role} ${r.reason}`), ['economy missing-binding']);
    assert.equal(stress.made(blade).load.broke, true);

    // PC97's contrast: a cloned pen is one weakness wide; a bred pen is not. Ten
    // clones of the ewe all lack the winter coat; lambs by a ram who carries it vary.
    const clones = Array.from({length: 10}, (_, i) => writeDesign(copyDesign(design('creature'), {id: `clone:${i}`}).design));
    assert.ok(clones.every(native => runCreature(native).winter.shows === 'absent'));
    const ram = {fleece: ['f', 'f'], coat: ['d', 'd'], winter: ['W', 'w'], vigor: ['V', 'V']};
    const lambs = Array.from({length: 10}, (_, i) => inheritGenes(sheep, ram, examples.creature.native.genes, {root: 'design-bench', at: `lamb:${i}`}).genes);
    const coated = lambs.filter(genes => expressGenes(sheep, genes, cold).winter.shows === 'full').length;
    assert.ok(coated > 0 && coated < 10, `${coated} of 10 lambs have the coat`);
});

test('4. in the engine world: a design kept on a holder is edited by one op, and a save and restore keeps the edit', () => {
    // The holder keeps its native record as state under one key (a fixture choice; who
    // owns that key is a hot-file question for the fold). No pack reads it; the sky pack is loaded since a world needs one.
    const KEY = 'design.native';
    const held = (engine, id) => engine.world.holders[id].state[KEY];
    let engine = createEngineWorld({packs: ['w.sky'], clock: 0, holders: [{id: 'pen', kind: 'place'},
        {id: 'ewe', kind: 'body', place: 'pen'}, {id: 'blade', kind: 'thing', place: 'pen'}]});
    engine = applyEngineOps(engine, [{op: 'state', holder: 'ewe', pack: KEY, value: examples.creature.native},
        {op: 'state', holder: 'blade', pack: KEY, value: blade}], 'design-bench:found');
    const kindOf = {ewe: 'creature', blade: 'made'};
    for (const [holder, kind] of Object.entries(kindOf)) {
        const [partId, change] = edits[kind];
        const {design: edited, receipt} = editPart(readDesign(kind, held(engine, holder), examples[kind].options), partId, change);
        engine = applyEngineOps(engine, [{op: 'state', holder, pack: KEY, value: writeDesign(edited)}], `design-bench:edit:${receipt.part}`);
    }
    // A clone is a new holder with a copy of the design.
    const clone = copyDesign(readDesign('creature', held(engine, 'ewe')), {id: 'ewe.clone'}).design;
    engine = applyEngineOps(engine, [{op: 'holder_add', value: {id: 'ewe.clone', kind: 'body', place: 'pen'}},
        {op: 'state', holder: 'ewe.clone', pack: KEY, value: writeDesign(clone)}], 'design-bench:copy');
    const saved = JSON.parse(JSON.stringify(serializeEngineWorld(engine)));
    const reloaded = restoreEngineWorld(saved);
    assert.deepEqual(serializeEngineWorld(reloaded), saved);
    assert.equal(runCreature(held(reloaded, 'ewe')).winter.shows, 'full');
    assert.deepEqual(held(reloaded, 'ewe.clone'), held(reloaded, 'ewe'));
    assert.equal(runMade(held(reloaded, 'blade')).load.broke, true);
    // A state op leaves no row in the cause chain: an operator that should be traceable
    // in the world has to publish an effect too (left to the operators lane).
    assert.equal(reloaded.world.chain.length, 0);
});
