import test from 'node:test';
import assert from 'node:assert/strict';
import {defineGrammar, fitGrammar, assemble} from '../src/procedural_grammar.js';
import {searchParts, previewValue, backwardCanonTest} from '../src/grammar_search.js';
import {searchEffectsForGoal, knowledgeFrom} from '../src/effect_checks.js';
import {effectWorlds} from '../scripts/grammar_canon_effects.mjs';

// A toy dish: base, method given base, extras; the name is derived.
const dish = defineGrammar({id: 'toy.dish', revision: 1,
    slots: [{id: 'base', type: 'one', values: ['grain', 'root', 'fish']}, {id: 'method', type: 'one', values: ['boil', 'roast', 'raw'], given: 'base'},
        {id: 'extras', type: 'set', values: ['salt', 'herb'], min: 0, max: 2}],
    rules: [{id: 'warm', kind: 'derive', reads: ['method'], default: 'Boiled and roasted dishes are warm.', reason: 'Test.', run: ({parts}) => ({warm: parts.method !== 'raw'})},
        {id: 'raw-grain', kind: 'check', reads: ['base', 'method'], default: 'Grain is not eaten raw.', reason: 'Test.', run: ({parts}) => parts.base === 'grain' && parts.method === 'raw' ? {reason: 'raw grain'} : null}],
    fallback: {id: 'toy.f', parts: {base: 'grain', method: 'boil', extras: []}}});
const fitted = fitGrammar(dish, [
    {id: 'a', parts: {base: 'grain', method: 'boil', extras: ['salt']}}, {id: 'b', parts: {base: 'root', method: 'roast', extras: []}},
    {id: 'c', parts: {base: 'fish', method: 'raw', extras: ['herb']}}, {id: 'd', parts: {base: 'grain', method: 'boil', extras: []}}]);

test('backward search finds the canon route and the others the rules allow (RV2, PFP28)', () => {
    const out = searchParts(fitted, {want: {derived: {warm: true}}, answers: 10, canon: [assemble(fitted, {base: 'grain', method: 'boil', extras: []}).value],
        identity: v => `${v.parts.base}/${v.parts.method}/${v.parts.extras.join('+')}`});
    assert.ok(out.answers.length > 1);
    assert.ok(out.answers.every(a => a.value.derived.warm));
    assert.equal(out.answers[0].canon, true);
    assert.ok(out.answers.some(a => a.parts.base === 'root'));
});

test('a search reports what the actor lacks and which rules refused (RV4)', () => {
    const lacking = searchParts(fitted, {want: {parts: {base: 'fish'}}, pool: {base: ['grain', 'root']}});
    assert.deepEqual(lacking.gaps, [{kind: 'lacks-part', slot: 'base', values: ['fish'], reason: 'not known or owned'}]);
    const refused = searchParts(fitted, {want: {parts: {base: 'grain', method: 'raw'}}});
    assert.equal(refused.answers.length, 0);
    assert.equal(refused.gaps[0].rule, 'raw-grain');
});

test('search stays inside its trial budget (PR3)', () => {
    const out = searchParts(fitted, {want: {derived: {warm: true}}, answers: 50, budget: {trials: 2}});
    assert.equal(out.tried, 2);
    assert.equal(out.truncated, true);
    assert.throws(() => searchParts(fitted, {budget: {trials: 0}}), /budget/);
});

test('previews show unknown parts as unknown and what reads them as uncertain (PM2)', () => {
    const value = assemble(fitted, {base: 'fish', method: 'raw', extras: ['herb']}).value;
    const seen = previewValue(fitted, value, {base: true, extras: ['herb']});
    assert.deepEqual(seen.parts.method, {unknown: true});
    assert.deepEqual(seen.parts.base, {value: 'fish'});
    assert.deepEqual(seen.derived.warm, {uncertain: true, expected: null});
    assert.deepEqual(previewValue(fitted, value, {base: true, method: true, extras: true}).derived.warm, {value: false});
});

test('nested slots search over the child things an actor holds (GL3)', () => {
    const role = defineGrammar({id: 'toy.role', revision: 1, slots: [{id: 'role', type: 'one', open: true}, {id: 'kind', type: 'one', open: true}],
        fallback: {id: 'toy.role.f', parts: {role: 'core', kind: 'moon'}}});
    const move = defineGrammar({id: 'toy.move', revision: 1, slots: [{id: 'roles', type: 'parts', grammar: role, min: 1, max: 3}],
        rules: [{id: 'one-core', kind: 'check', reads: ['roles'], default: 'A move has one core.', reason: 'Test.',
            run: ({parts}) => parts.roles.filter(r => r.role === 'core').length === 1 ? null : {reason: 'core count'}}],
        fallback: {id: 'toy.move.f', parts: {roles: [{role: 'core', kind: 'moon'}]}}});
    const f = fitGrammar(move, [{id: 'm1', parts: {roles: [{role: 'core', kind: 'moon'}, {role: 'support', kind: 'light'}]}}]);
    const held = [{role: 'core', kind: 'moon'}, {role: 'support', kind: 'light'}, {role: 'core', kind: 'fire'}];
    const out = searchParts(f, {pool: {roles: held}, answers: 10, accept: v => v.parts.roles.length >= 2});
    assert.ok(out.answers.length >= 2);
    assert.ok(out.answers.every(a => a.parts.roles.filter(r => r.role === 'core').length === 1));
    assert.throws(() => searchParts(f, {}), /pool of child things/);
});

test('backward canon test and a stated goal on the two worlds (RV2, PM3)', async () => {
    const [gu, hp] = await effectWorlds();
    const id = v => JSON.stringify([...['verb', 'object', 'target', 'time', 'carrier', 'cost'].map(k => v.parts[k]), [...(v.parts.limits ?? [])].sort()]);
    for (const w of [gu, hp]) {
        const r = backwardCanonTest(w.fitted, w.canon.map(c => c.parts), {fix: ['verb', 'object', 'target', 'time'], identity: id});
        assert.ok(r.rate >= 0.8, `${w.id} ${r.rate}`);
        assert.ok(r.alternativesPerTarget > 1);
    }
    const seen = gu.canon.filter(c => ['gu:stealth-scales', 'gu:moonlight', 'gu:earth-communication-ear-grass', 'gu:white-jade'].includes(c.id));
    const knows = knowledgeFrom(seen.map(c => c.parts));
    delete knows.target; delete knows.time;
    const actor = {knows, owns: {carrier: ['gu'], cost: ['essence-primeval']}};
    const camp = searchEffectsForGoal(gu.fitted, {verb: 'conceal', object: 'information', target: 'area'}, {actor, world: gu.checks});
    assert.ok(camp.answers.length > 0);
    assert.ok(camp.answers.every(a => a.checks.every(c => c.pass) && a.parts.cost === 'essence-primeval'));
    assert.deepEqual(camp.answers[0].preview.parts.time, {unknown: true});
    const law = searchEffectsForGoal(gu.fitted, {verb: 'alter', object: 'law', target: 'area'}, {actor, world: gu.checks});
    assert.equal(law.gaps[0].kind, 'lacks-part');
});
