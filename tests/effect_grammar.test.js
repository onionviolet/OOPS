import test from 'node:test';
import assert from 'node:assert/strict';
import {assemble} from '../src/procedural_grammar.js';
import {lowerEffect, defineEffectGrammar, effectKind} from '../src/effect_grammar.js';
import {proposeEffects, checkEffect, keepSpread, fitCostCurve, priceOf} from '../src/effect_checks.js';
import {runEffects, effectWorlds} from '../scripts/grammar_canon_effects.mjs';

const sentence = {verb: 'move', object: 'position', target: 'bound', time: 'sustained', carrier: 'spoken-spell', cost: 'stamina', limits: ['mass']};
const cause = {kind: 'pressure', id: 'test:siege'};

test('the effect grammar judges sentences by what the verb can change (PFP22, EF2)', async () => {
    const [, hp] = await effectWorlds();
    assert.equal(assemble(hp.grammar, sentence).ok, true);
    const bad = assemble(hp.grammar, {...sentence, verb: 'end', object: 'position'});
    assert.equal(bad.receipt.violations[0].rule, 'verb-object');
    assert.equal(assemble(hp.grammar, {...sentence, cost: 'essence-primeval'}).ok, false);
    const open = defineEffectGrammar({world: 't', carriers: {'spoken-spell': ['stamina']}, dials: {anyCost: true}});
    assert.equal(open.ref, 'effect.t@1');
});

test('sentences lower onto W ops; undeclared quantities become requests for W (SB3, WSC2)', () => {
    assert.deepEqual(lowerEffect({verb: 'add', object: 'moisture'}), {ops: [{op: 'add', quantity: 'humidity', sign: 1}], needs: []});
    assert.deepEqual(lowerEffect({verb: 'add', object: 'light'}), {ops: [{op: 'publish', kind: 'effect.add.light'}], needs: ['light']});
    assert.deepEqual(lowerEffect({verb: 'alter', object: 'law'}).ops, [{op: 'law_add', field: 'law'}]);
    assert.equal(effectKind('sense', 'information'), 'effect.sense.information');
});

test('the canon test runs on two worlds and lists what each is missing (EF1)', async () => {
    const out = await runEffects();
    assert.deepEqual([out.canon.gu.rebuild.passed, out.canon.gu.rebuild.tested], [55, 57]);
    assert.deepEqual([out.canon.hogwarts.rebuild.passed, out.canon.hogwarts.rebuild.tested], [85, 109]);
    assert.ok(out.canon.gu.missingRules.some(f => f.rule === 'verb-object' && f.examples.includes('gu:year-gu')));
    assert.ok(out.canon.hogwarts.missingRules.some(f => f.rule === 'family'));
    for (const world of ['gu', 'hogwarts']) assert.ok(out.canon[world].inference.verb.rate > out.canon[world].inference.verb.baseline);
    // One grammar connects the worlds: most of each world's sentences use a law the other has.
    assert.ok(out.transfer.every(t => t.rate > 0.5));
});

test('proposals need a cause and a novelty cause; composition goes to K (PFP19, PFP24, SC6)', async () => {
    const [gu, hp] = await effectWorlds();
    const opts = {root: 1, address: 'test:p', cause, novelty: {level: 1, cause: 'test inventor'}, count: 5};
    assert.deepEqual(proposeEffects(gu.fitted, gu.canon, opts), proposeEffects(gu.fitted, gu.canon, opts));
    assert.throws(() => proposeEffects(gu.fitted, gu.canon, {...opts, cause: undefined}), /cause/);
    assert.throws(() => proposeEffects(gu.fitted, gu.canon, {...opts, novelty: {level: 1}}), /novelty/);
    assert.throws(() => proposeEffects(gu.fitted, gu.canon, {...opts, novelty: {level: 3, cause: 'x'}}), /chat K/);
    const near = proposeEffects(gu.fitted, gu.canon, {...opts, novelty: {level: 0, cause: 'teacher'}});
    assert.ok(near.every(c => c.origin.changed.length <= 1));
    const moved = proposeEffects(gu.fitted, gu.canon, {...opts, novelty: {level: 2, cause: 'traveller'}, transferFrom: hp.canon});
    assert.ok(moved.every(c => c.origin.canon.startsWith('hp:') && c.parts.carrier === 'gu'));
});

test('the four checks name the missing law, price, exception or word', async () => {
    const [, hp] = await effectWorlds();
    const base = {id: 'c', parts: sentence};
    assert.equal(checkEffect(hp.fitted, base, hp.checks).pass, true);
    const noLaw = checkEffect(hp.fitted, {id: 'c', parts: {...sentence, verb: 'copy', object: 'working'}}, hp.checks);
    assert.equal(noLaw.checks.find(c => c.id === 'runs').pass, hp.checks.laws.has('copy|working'));
    const cheap = checkEffect(hp.fitted, {...base, amount: 0}, hp.checks);
    assert.match(cheap.checks.find(c => c.id === 'pays').reason, /underpriced/);
    const law = {id: 'c', parts: {...sentence, verb: 'alter', object: 'law'}};
    const world = {...hp.checks, laws: new Set([...hp.checks.laws, 'alter|law'])};
    assert.match(checkEffect(hp.fitted, law, world).checks.find(c => c.id === 'allows').reason, /forbidden/);
    const excepted = {...world, forbid: [{...world.forbid[0], exception: {reason: 'a founder bound the castle', cost: 'a life'}}]};
    assert.equal(checkEffect(hp.fitted, law, excepted).checks.find(c => c.id === 'allows').pass, true);
    const mute = checkEffect(hp.fitted, base, {...hp.checks, words: {}});
    assert.match(mute.checks.find(c => c.id === 'explains').reason, /no world words/);
});

test('pricing follows one curve and the kept set is a spread (checks 2 and 5)', () => {
    const curve = fitCostCurve([1, 2, 3, 4].map(n => ({parts: {target: 'self', time: n > 2 ? 'sustained' : 'instant', limits: []}, amount: n})));
    assert.equal(curve.fitted, true);
    assert.ok(priceOf(curve, {target: 'area', time: 'lasting', limits: []}) > priceOf(curve, {target: 'self', time: 'instant', limits: ['mass', 'ward']}));
    const cands = ['a', 'b', 'c', 'd'].map((id, i) => ({id, parts: {...sentence, verb: i < 3 ? 'move' : 'sense', object: i < 3 ? 'position' : 'information'}}));
    const kept = keepSpread(cands, [sentence], {k: 2});
    assert.deepEqual(new Set(kept.kept.map(c => c.parts.verb)), new Set(['move', 'sense']));
});
