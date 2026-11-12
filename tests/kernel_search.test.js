// Bounded actor search (PR3, KW32-KW34) and grammar refs pinned in saves (PR2,
// KW31), over the G adapter's composed killer move.
import assert from 'node:assert/strict';
import test from 'node:test';

import {beginWorking, quoteWorking, restoreWorking, serializeWorking} from '../src/kernel_working.js';
import {composeWorking, defineComposition} from '../src/kernel_compose.js';
import {addIdentity, createIdentities, identityGrammar, restoreIdentities, serializeIdentities} from '../src/kernel_identity.js';
import {searchForActor} from '../src/kernel_search.js';
import {guBindings, guThings, pair, single, threeCore} from './kernel_adapters.mjs';
import {reader} from './kernel_contract_suite.mjs';

const pool = [['moon-blade', 'moonlight', 2], ['white-jade', 'white-jade', 1], ['stone-skin', 'stone-skin', 2], ['flame', 'fire', 3]];
const things = guThings(pool);
const move = composeWorking(threeCore, {lead: single, pair});
// Every ordered triple of distinct Gu from the pool, in a fixed order.
const candidates = pool.flatMap(([a]) => pool.flatMap(([b]) => pool.flatMap(([c]) =>
    new Set([a, b, c]).size === 3 ? [{...move, bindings: guBindings(a, b, c)}] : [])));
const base = {known: reader(things), knownFacts: {reserves: {player: {immortal: 6}}}, at: 0};
const spent = quote => quote.costs.reduce((n, row) => n + row.amount, 0);

test('the search stops at its trial budget, the same way every time', () => {
    assert.equal(candidates.length, 24);
    const small = searchForActor({...base, actor: 'player', candidates, budget: {trials: 5, steps: 999}});
    assert.deepEqual([small.visited, small.truncated, small.options.length + small.rejected.length], [5, true, 5]);
    assert.deepEqual(searchForActor({...base, actor: 'player', candidates, budget: {trials: 5, steps: 999}}), small);
    const full = searchForActor({...base, actor: 'player', candidates, budget: {trials: 99, steps: 999}});
    assert.deepEqual([full.visited, full.truncated], [24, false]);
});

test('settled steps are the time budget: two-step moves under a five-step budget try two', () => {
    const out = searchForActor({...base, actor: 'player', candidates, budget: {trials: 99, steps: 5}});
    assert.deepEqual([out.visited, out.steps, out.truncated], [2, 4, true]);
});

test('the goal keeps what meets it, and every rejection keeps its reason', () => {
    const cheap = searchForActor({...base, actor: 'player', candidates, budget: {trials: 99, steps: 999}, keep: q => spent(q) <= 5});
    assert.ok(cheap.options.length > 0 && cheap.options.every(row => spent(row.quote) <= 5));
    assert.ok(cheap.rejected.every(row => row.reasons.length === 1));
    assert.ok(cheap.rejected.some(row => row.reasons[0].cause === 'goal'));
    // Moves that cost more than the reserve are refused by the beat itself.
    assert.ok(cheap.rejected.some(row => row.reasons[0].cause === 'operation'));
    const first = searchForActor({...base, actor: 'player', candidates, budget: {trials: 99, steps: 999}, limit: 1});
    assert.equal(first.options.length, 1);
});

test('the player and an NPC run the same search; what an NPC does not know it cannot use (PR6)', () => {
    // Working ids name the attempt, so draws differ by attempt; with the same
    // ids and the same knowledge the two searches are identical.
    const named = candidates.map((row, i) => ({...row, id: `market.try.${i}`}));
    const run = actor => {
        const {actor: _, options, ...rest} = searchForActor({...base, actor, candidates: named, budget: {trials: 99, steps: 999}});
        return {...rest, options: options.map(({quote: {actor: __, ...quote}, ...row}) => ({...row, quote}))};
    };
    assert.deepEqual(run('npc.rival'), run('player'));
    const blind = (ref, at) => ref.id === 'flame' ? null : reader(things)(ref, at);
    const npc = searchForActor({...base, known: blind, actor: 'npc.rival', candidates, budget: {trials: 99, steps: 999}});
    const usesFlame = row => Object.values(candidates[row.candidate].bindings).some(ref => ref.id === 'flame');
    assert.ok(npc.options.every(row => !usesFlame(row)));
    assert.ok(npc.rejected.filter(usesFlame).every(row => row.reasons[0].cause === 'unknown'));
});

test('a generated move keeps its grammar ref through saves; a new grammar revision is a different move (PR2)', () => {
    const generated = {...pair, method: {...pair.method, grammar: 'gu.moves@1'}};
    const composition = defineComposition({...threeCore, id: 'killer-move.generated', grammar: 'gu.moves@1'});
    const v1 = composeWorking(composition, {lead: single, pair: generated});
    const v2 = composeWorking(defineComposition({...threeCore, id: 'killer-move.generated', grammar: 'gu.moves@2'}),
        {lead: single, pair: {...pair, method: {...pair.method, grammar: 'gu.moves@2'}}});
    assert.notEqual(v1.law.ref, v2.law.ref);
    const bindings = guBindings('moon-blade', 'white-jade', 'stone-skin');
    const record = beginWorking(v1.law, v1.method, {id: 'gen.1', bindings, facts: base.knownFacts, at: 0});
    const restored = restoreWorking(v1.law, JSON.parse(JSON.stringify(serializeWorking(record))));
    assert.equal(restored.method.grammar, 'gu.moves@1');
    assert.throws(() => restoreWorking(v2.law, serializeWorking(record)), /different law/);
    const quote = law => quoteWorking(law.law, law.method, {id: 'gen.1', bindings, facts: base.knownFacts, at: 0, ports: {read: reader(things)}});
    assert.notEqual(quote(v1).fingerprint, quote(v2).fingerprint);
    const reg = addIdentity(createIdentities(), {id: 'gu:gen-1', grammar: 'gu.kinds@3', at: 0, cause: 'generated',
        facets: {body: {owner: 'w.holder', key: 'gu:gen-1'}}});
    assert.equal(identityGrammar(restoreIdentities(serializeIdentities(reg)), 'gu:gen-1'), 'gu.kinds@3');
    assert.throws(() => addIdentity(createIdentities(), {id: 'x', grammar: 3, at: 0, cause: 'c', facets: {a: {owner: 'o', key: 'k'}}}), /grammar ref/);
});
