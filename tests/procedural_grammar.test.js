import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {defineGrammar, fitGrammar, overlayGrammar, assemble, generate, inferSlot, canonTest, predictSlot, freezeValue, thawValue} from '../src/procedural_grammar.js';
import {guKindGrammar, guKindGrammarV2, guKindGrammarV3, labelGuRow, compareGuKind, guKindIdentity} from './fixtures/procedural_grammar/gu_kind_grammar.mjs';

const slice = JSON.parse(fs.readFileSync(new URL('./fixtures/procedural_grammar/gu_kind_slice.json', import.meta.url))).rows;
const labelled = slice.map(r => ({id: r.id, ...labelGuRow(r)})).filter(r => r.parts);
const cause = {kind: 'place', id: 'test:hill'};

// A domain-free toy grammar: a dish from a base, extras and a cooking method.
const toy = defineGrammar({
    id: 'toy.dish', revision: 1,
    slots: [
        {id: 'base', type: 'one', values: ['grain', 'root', 'fish']},
        {id: 'method', type: 'one', values: ['boil', 'roast', 'raw'], given: 'base'},
        {id: 'extras', type: 'set', values: ['salt', 'herb', 'fat'], min: 0, max: 2},
    ],
    rules: [
        {id: 'label', kind: 'derive', default: 'Method then base.', reason: 'Test naming.', run: ({parts}) => ({name: `${parts.method} ${parts.base}`})},
        {id: 'raw-grain', kind: 'check', default: 'Grain is not eaten raw.', reason: 'Raw grain does not digest.', dial: 'rawGrain',
            run: ({parts, dials}) => parts.base === 'grain' && parts.method === 'raw' && !dials.rawGrain ? {reason: 'raw grain'} : null},
    ],
    fallback: {id: 'toy.porridge', parts: {base: 'grain', method: 'boil', extras: []}},
});
const toyRows = [
    {id: 'a', parts: {base: 'grain', method: 'boil', extras: ['salt']}},
    {id: 'b', parts: {base: 'grain', method: 'boil', extras: []}},
    {id: 'c', parts: {base: 'root', method: 'roast', extras: ['fat', 'salt']}},
    {id: 'd', parts: {base: 'fish', method: 'raw', extras: ['herb']}},
];

test('a grammar declares slots, reasoned rules and a named fallback', () => {
    assert.throws(() => defineGrammar({...toy.spec, fallback: undefined}), /fallback/);
    assert.throws(() => defineGrammar({...toy.spec, rules: [{id: 'x', kind: 'check', run: () => null}]}), /default and a reason/);
    assert.throws(() => defineGrammar({...toy.spec, slots: [{id: 'm', type: 'one', values: ['a'], given: 'later'}]}), /declared earlier/);
    assert.equal(toy.ref, 'toy.dish@1');
});

test('assembly runs the same rules for any parts and names each failure', () => {
    const ok = assemble(toy, {base: 'root', method: 'roast', extras: ['salt']});
    assert.equal(ok.ok, true);
    assert.equal(ok.value.derived.name, 'roast root');
    const bad = assemble(toy, {base: 'stone', method: 'raw', extras: ['salt', 'herb', 'fat']});
    assert.deepEqual(bad.receipt.violations.map(v => v.kind).sort(), ['too-many-parts', 'unknown-part']);
    const raw = assemble(toy, {base: 'grain', method: 'raw', extras: []});
    assert.equal(raw.receipt.violations[0].rule, 'raw-grain');
    // The dial opens it without a code change (AD5).
    assert.equal(assemble(defineGrammar({...toy.spec, dials: {rawGrain: true}}), {base: 'grain', method: 'raw', extras: []}).ok, true);
});

test('fit gives integer weights with reasons, conditioned where declared', () => {
    const fitted = fitGrammar(toy, toyRows);
    assert.deepEqual(fitted.weights.base.marginal.grain, {value: 'grain', weight: 2, reason: 'corpus 2/4'});
    assert.equal(fitted.weights.method.given.grain.boil, 2);
    assert.equal(fitted.support.extras.maxSize, 2);
    assert.equal(fitGrammar(toy, toyRows, {smoothing: 1}).weights.base.marginal.fish.weight, 2);
    // Open slots flag novel parts instead of rejecting them.
    const open = defineGrammar({...toy.spec, slots: [...toy.spec.slots, {id: 'garnish', type: 'tokens', open: true, min: 0}]});
    const flagged = assemble(fitGrammar(open, toyRows.map(r => ({...r, parts: {...r.parts, garnish: ['cress']}}))),
        {base: 'root', method: 'roast', extras: [], garnish: ['moss']});
    assert.equal(flagged.ok, true);
    assert.deepEqual(flagged.receipt.flags.map(f => f.kind), ['novel-part']);
});

test('an overlay records its departure from the source fit (PFP18)', () => {
    const fitted = fitGrammar(toy, toyRows);
    const coastal = overlayGrammar(fitted, {id: 'coast', reason: 'The coast eats fish daily.', reweight: {base: {fish: 9}}});
    assert.deepEqual(coastal.overlays[0].departures, [{slot: 'base', value: 'fish', from: 1, to: 9}]);
    assert.throws(() => overlayGrammar(fitted, {id: 'x', reweight: {}}), /reason/);
});

test('generation is addressed, caused, budgeted and falls back by name (GR1, GR2, GR6, GR11, PFP19)', () => {
    const fitted = fitGrammar(toy, toyRows);
    const one = generate(fitted, {root: 7, address: 'test:dish', cause});
    assert.deepEqual(generate(fitted, {root: 7, address: 'test:dish', cause}).value, one.value);
    assert.equal(one.value.cause, cause);
    assert.ok(one.receipt.picks.every(p => Number.isInteger(p.total)));
    assert.throws(() => generate(fitted, {root: 7, address: 'test:dish'}), /cause/);
    assert.throws(() => generate(defineGrammar({...fitted.spec, weights: fitted.weights, support: fitted.support, budget: {maxDraws: 1}}),
        {root: 7, address: 'test:dish', cause}), /budget/);
    const fallback = generate(fitted, {root: 7, address: 'test:dish', cause, validate: () => false, maxAttempts: 3});
    assert.equal(fallback.receipt.fallbackId, 'toy.porridge');
    assert.equal(fallback.value.derived.name, 'boil grain');
    const names = new Set(Array.from({length: 40}, (_, i) => generate(fitted, {root: 7, address: `test:dish:${i}`, cause}).value.derived.name));
    assert.ok(names.size > 1);
    assert.ok(![...names].includes('raw grain'));
});

test('a frozen generated thing reassembles to the same value after save and reload (GR3, GR16)', () => {
    const fitted = fitGrammar(guKindGrammarV2, labelled);
    const out = generate(fitted, {root: 11, address: 'test:freeze', cause});
    const saved = JSON.parse(JSON.stringify(out.value));
    assert.deepEqual(assemble(fitted, saved.parts).value.derived, out.value.derived);
    assert.equal(saved.grammar, 'proof.gu-kind@2');
});

test('golden snapshots and a seed sweep hold for the proof grammar (GR16)', () => {
    const fitted = fitGrammar(guKindGrammarV2, labelled);
    const golden = [1, 2, 3].map(root => generate(fitted, {root, address: 'test:golden', cause}).value.derived.name);
    assert.deepEqual(golden, ['Ghost Rock Gu', 'Dog Beast Travel Immortal Gu', 'Emotion Zombie']);
    for (let root = 0; root < 60; root++) {
        const out = generate(fitted, {root, address: 'test:sweep', cause});
        assert.ok(out.value.parts.rank.length >= 1 && out.value.parts.path.length >= 1 && out.value.parts.role.length >= 1);
        assert.equal(out.receipt.fallbackUsed, false);
    }
});

test('inference reads a hidden part from the parts conditioned on it', () => {
    const fitted = fitGrammar(toy, toyRows);
    assert.equal(inferSlot(fitted, {method: 'roast'}, 'base').best, 'root');
    assert.equal(inferSlot(fitted, {method: 'raw'}, 'base').best, 'fish');
});

test('the canon test rebuilds held-out Gu kinds and lists what v1 is missing', () => {
    const run = grammar => canonTest(grammar, slice, {label: labelGuRow, compare: compareGuKind, identity: guKindIdentity, infer: ['path', 'role'], pairs: [['path', 'role']]});
    const v1 = run(guKindGrammar), v2 = run(guKindGrammarV2);
    assert.equal(v1.corpus.labelled, 120);
    assert.equal(v1.corpus.unlabelled, 20);
    assert.equal(v1.rebuild.passed, 87);
    const kinds = new Set(v1.missingRules.map(f => `${f.kind}:${f.rule ?? f.slot}`));
    for (const k of ['derive-mismatch:immortal-title', 'rule-reject:band-coherent', 'unknown-part:path']) assert.ok(kinds.has(k), k);
    assert.equal(v2.rebuild.rate, 1);
    assert.deepEqual(v2.missingRules, []);
    assert.equal(v2.range.inside, v2.range.generated);
    for (const share of Object.values(v2.range.shares)) assert.ok(share.distance <= 0.4);
    // Path and role are drawn separately, so the joint check can miss: it measures drift, not a gate (AD56).
    const pair = v2.range.pairs['path+role'];
    assert.equal(pair.items, 200);
    assert.ok(pair.unseenItems > 0 && pair.supportedRate < 1);
    // Name parts carry real signal about the hidden path, above the majority guess.
    assert.ok(v2.inference.path.rate > v2.inference.path.baseline);
    assert.deepEqual(canonTest(guKindGrammarV2, slice, {label: labelGuRow, compare: compareGuKind, identity: guKindIdentity}), canonTest(guKindGrammarV2, slice, {label: labelGuRow, compare: compareGuKind, identity: guKindIdentity}));
});

test('joint and chained conditioning keep generated combinations inside the source (GL5, GL1)', () => {
    const joint = defineGrammar({id: 'toy.joint', revision: 1,
        slots: [{id: 'a', type: 'one', values: ['x', 'y']}, {id: 'b', type: 'one', values: ['p', 'q']}, {id: 'c', type: 'one', values: ['m', 'n'], given: ['a', 'b']}],
        fallback: {id: 'toy.joint.f', parts: {a: 'x', b: 'p', c: 'm'}}});
    const rows = [{id: '1', parts: {a: 'x', b: 'p', c: 'm'}}, {id: '2', parts: {a: 'x', b: 'q', c: 'n'}}, {id: '3', parts: {a: 'y', b: 'p', c: 'n'}}];
    const fitted = fitGrammar(joint, rows);
    assert.deepEqual(fitted.weights.c.given['["x","p"]'], {m: 1});
    assert.equal(predictSlot(fitted, {a: 'x', b: 'p'}, 'c').best, 'm');
    assert.equal(predictSlot(fitted, {a: 'x', b: 'q'}, 'c').best, 'n');
    // An unseen combination backs off to each given alone.
    assert.match(predictSlot(fitted, {a: 'y', b: 'q'}, 'c').ranked[0].reason, /backed off/);
    assert.throws(() => defineGrammar({...joint.spec, slots: [{id: 'c', type: 'one', values: ['m'], given: ['zz']}]}), /declared earlier/);
    const v3 = canonTest(guKindGrammarV3, slice, {label: labelGuRow, compare: compareGuKind, pairs: [['path', 'role'], ['rank', 'path']], infer: ['path']});
    const v2 = canonTest(guKindGrammarV2, slice, {label: labelGuRow, compare: compareGuKind, pairs: [['path', 'role'], ['rank', 'path']]});
    for (const pair of ['path+role', 'rank+path']) {
        assert.ok(v3.range.pairs[pair].supportedRate >= 0.8, pair);
        assert.ok(v3.range.pairs[pair].supportedRate > v2.range.pairs[pair].supportedRate, pair);
    }
    assert.equal(v3.rebuild.rate, 1);
    assert.ok(v3.inference.path.rate > v3.inference.path.baseline);
});

test('a frozen value keeps its grammar ref and is not re-derived by a newer revision (PR2)', () => {
    const fitted = fitGrammar(guKindGrammarV2, labelled);
    const out = generate(fitted, {root: 5, address: 'test:pr2', cause});
    const frozen = JSON.parse(JSON.stringify(freezeValue(out.value)));
    assert.equal(frozen.grammar, 'proof.gu-kind@2');
    const thawed = thawValue(frozen, {'proof.gu-kind@2': fitted});
    assert.deepEqual(thawed.value.derived, out.value.derived);
    assert.equal(thawed.receipt.stillValid, true);
    // Only revision 3 loaded: the stored value comes back as seen, flagged as not re-checked.
    const later = thawValue(frozen, {'proof.gu-kind@3': fitGrammar(guKindGrammarV3, labelled)});
    assert.deepEqual(later.value.derived, out.value.derived);
    assert.equal(later.receipt.pinnedLoaded, false);
    assert.throws(() => thawValue({grammar: 'x'}), /frozen/);
});

test('nested parts assemble, fit and generate through a child grammar (GL6)', () => {
    const step = defineGrammar({id: 'toy.step', revision: 1,
        slots: [{id: 'op', type: 'one', values: ['crush', 'stir', 'heat']}, {id: 'input', type: 'one', open: true, given: 'op'}],
        fallback: {id: 'toy.step.f', parts: {op: 'stir', input: 'water'}}});
    const recipe = defineGrammar({id: 'toy.recipe', revision: 1, slots: [{id: 'steps', type: 'parts', grammar: step, min: 1, max: 4}],
        rules: [{id: 'heat-last', kind: 'check', default: 'Heat comes after the inputs are prepared.', reason: 'Test order rule.',
            run: ({parts}) => parts.steps.findIndex(s => s.op === 'heat') === 0 && parts.steps.length > 1 ? {reason: 'heat first'} : null}],
        fallback: {id: 'toy.recipe.f', parts: {steps: [{op: 'stir', input: 'water'}]}}});
    assert.throws(() => defineGrammar({...recipe.spec, slots: [{id: 'steps', type: 'parts'}]}), /child grammar/);
    const rows = [{id: 'r1', parts: {steps: [{op: 'crush', input: 'fang'}, {op: 'heat', input: 'water'}]}},
        {id: 'r2', parts: {steps: [{op: 'stir', input: 'water'}, {op: 'crush', input: 'nettle'}, {op: 'heat', input: 'water'}]}}];
    const fitted = fitGrammar(recipe, rows);
    assert.equal(fitted.weights.steps.child.weights.input.given.crush.fang, 1);
    const bad = assemble(fitted, {steps: [{op: 'boil', input: 'x'}, {op: 'heat', input: 'y'}]});
    assert.deepEqual(bad.receipt.violations.map(v => v.slot), ['steps[0].op']);
    assert.equal(assemble(fitted, {steps: [{op: 'heat', input: 'x'}, {op: 'stir', input: 'y'}]}).receipt.violations[0].rule, 'heat-last');
    const a = generate(fitted, {root: 9, address: 'test:gl6', cause});
    assert.deepEqual(generate(fitted, {root: 9, address: 'test:gl6', cause}).value, a.value);
    assert.ok(a.value.parts.steps.length >= 2 && a.value.parts.steps.every(s => ['crush', 'stir', 'heat'].includes(s.op)));
    assert.ok(a.receipt.picks.some(p => p.slot.startsWith('steps[0].')));
    assert.deepEqual(overlayGrammar(fitted, {id: 'o', reason: 'test', reweight: {}}).weights.steps.child, fitted.weights.steps.child);
});
