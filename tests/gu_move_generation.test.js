import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNicheArchive, worldLaws} from '../src/effect_checks.js';
import {defineEffectGrammar} from '../src/effect_grammar.js';
import {generateGuMoves, settleGeneratedGuMove} from '../src/gu_move_generation.js';
import {asBoundGu} from '../src/gu_working_law.js';
import {thawValue} from '../src/procedural_grammar.js';

const {moves} = JSON.parse(readFileSync(new URL('../docs/research/gu-identity-evidence.json', import.meta.url)));
const fireSet = moves.find(row => row.id === 'xiao-yan-fire-set');
const parts = {verb: 'add', object: 'heat', target: 'touched', time: 'instant', carrier: 'gu', cost: 'essence-primeval', limits: []};
const fitted = defineEffectGrammar({world: 'generation-bench', carriers: {gu: ['essence-primeval']}});
const world = {
    fitted, canonParts: [parts], canonMoves: [fireSet.roles.map(role => role.kind)], laws: worldLaws([parts]),
    priceQuantity: 'essence.primeval',
    curve: {base: 1, perPoint: 1, fitted: false, reason: 'authored bench price'},
    words: {verb: {add: 'Raise'}, object: {heat: 'the heat'}, target: {touched: 'on contact'},
        time: {instant: 'at once'}, carrier: {gu: 'through Gu'}, cost: {'essence-primeval': 'using primeval essence'}},
    project: effect => effect.kind === 'flame' ? {parts, fit: effect.magnitude} : null,
};
const cause = {kind: 'practice', id: 'bench:kiln'};
const novelty = {level: 3, cause: 'Try amplifying a flame on a smaller reserve.'};
const primevalCost = amount => ({quantity: 'essence.primeval', holder: 'keeper', amount});
const benchMove = results => results.find(row => row.recipe.roles.length === 3);

function bench() {
    const operator = {kind: 'operator', id: 'keeper'};
    const specimens = [
        ['core', 'red-fire'], ['size', 'enlarge'], ['economy', 'fire-source'],
        ['unlearned', 'duplicate'], ['other-holder', 'enlarge', 'neighbor'], ['unheld', 'enlarge'],
        ['outside-path', 'moonlight'],
    ];
    const things = Object.fromEntries(specimens.map(([id, kind, holder = operator.id]) =>
        [id, asBoundGu({id, kind, holder, rank: 1, fedThrough: 100, alive: true})]));
    things[operator.id] = operator;
    return {id: 'kiln', operator, path: 'fire', effect: 'flame', cause, novelty, world, at: 0,
        facts: {reserves: {keeper: {primeval: 10}}, day: 1},
        held: specimens.map(([id]) => id).filter(id => id !== 'unheld'),
        known: ['red-fire', 'enlarge', 'fire-source', 'moonlight'],
        ports: {read: ref => Object.hasOwn(things, ref.id) ? things[ref.id] : null}};
}

test('a new fire composition settles on K and freezes its cause and grammar in a niche', () => {
    const inputs = bench();
    const archive = createNicheArchive();
    const generated = generateGuMoves(inputs);
    const move = benchMove(generated.results);
    assert.equal(move.pass, true);
    assert.deepEqual(move.recipe.roles.map(role => role.kind), ['fire-source', 'enlarge', 'red-fire']);
    assert.notDeepEqual(move.recipe.roles.map(role => role.kind), world.canonMoves[0]);
    assert.deepEqual(move.checks.map(({id, pass}) => [id, pass]),
        [['runs', true], ['pays', true], ['allows', true], ['explains', true]]);
    assert.equal(move.checks[1].price, 4);
    assert.deepEqual(move.preview.costs, [1, 1, 3].map(primevalCost));
    assert.deepEqual(move.preview.effects, [{kind: 'flame', magnitude: 2, count: 1, source: 'core'}]);
    assert.deepEqual(archive.niches, {});

    const weaker = generated.results.find(row => row.recipe.roles[0].kind === 'fire-source' && row.recipe.roles.length === 2);
    const done = settleGeneratedGuMove(move, {...inputs, archive});
    assert.equal(done.ok, true);
    assert.equal(done.record.status, 'complete');
    assert.equal(done.record.method.grammar, fitted.ref);
    assert.deepEqual(done.record.receipts.map(row => row.op), ['cast.0/activate', 'cast.1/activate', 'cast.2/activate']);
    assert.deepEqual(done.costs, move.preview.costs);
    assert.deepEqual(done.effects.map(row => row.effect), move.preview.effects);
    assert.equal(done.record.facts.reserves.keeper.primeval, 5);
    assert.equal(inputs.facts.reserves.keeper.primeval, 10);
    assert.deepEqual(archive.niches, {});
    assert.deepEqual(done.archiveReceipt, {niche: 'add|heat|gu', accepted: true, replaced: null, reason: 'new niche'});

    const restored = JSON.parse(JSON.stringify(done.archive));
    assert.deepEqual(restored, done.archive);
    const saved = restored.niches['add|heat|gu'];
    assert.equal(saved.grammar, fitted.ref);
    assert.equal(saved.law, done.record.law);
    assert.deepEqual(saved.recipe, move.recipe);
    assert.deepEqual(saved.cause, cause);
    assert.deepEqual(saved.novelty, novelty);
    assert.equal(saved.explanation, 'Raise the heat on contact at once through Gu using primeval essence');
    const thawed = thawValue(saved.sentence, {[fitted.ref]: fitted});
    assert.equal(thawed.receipt.stillValid, true);
    assert.deepEqual(thawed.value.parts, parts);
    assert.deepEqual(thawed.value.cause, cause);
    const tie = settleGeneratedGuMove(move, {...inputs, archive: restored});
    assert.equal(tie.ok, true);
    assert.equal(tie.archiveReceipt.accepted, false);
    assert.equal(tie.archive, restored);
    const first = settleGeneratedGuMove(weaker, {...inputs, archive});
    assert.equal(first.archiveReceipt.accepted, true);
    const upgrade = settleGeneratedGuMove(move, {...inputs, archive: first.archive});
    assert.equal(upgrade.archiveReceipt.replaced, weaker.recipe.id);
    assert.deepEqual(upgrade.archive, restored);
});

test('search order repeats across inventory order and the trial limit caps both enumeration and quotes', () => {
    const inputs = bench();
    const result = generateGuMoves(inputs);
    const kinds = row => row.recipe.roles.map(role => role.kind);
    assert.deepEqual(result.budget, {trialLimit: 200, evaluated: 4, quoted: 4, truncated: false});
    assert.deepEqual(result.results.map(kinds), [
        ['red-fire'], ['fire-source', 'red-fire'], ['enlarge', 'red-fire'], ['fire-source', 'enlarge', 'red-fire'],
    ]);
    assert.equal(result.results[0].reason, 'no-composition');
    assert.deepEqual(generateGuMoves({...inputs, held: [...inputs.held].reverse()}), result);
    const capped = generateGuMoves({...inputs, trialLimit: 2});
    assert.deepEqual(capped.budget, {trialLimit: 2, evaluated: 2, quoted: 2, truncated: true});
    assert.deepEqual(capped.results, result.results.slice(0, 2));
    assert.deepEqual(generateGuMoves({...inputs, effect: 'damage'}).results, []);
});

test('forbidden, underpriced, unmapped and underfunded workings do not enter the archive', () => {
    const inputs = bench();
    const archive = createNicheArchive();
    const forbidden = {...world, forbid: [{law: 'add|quantity', reason: 'The dry roof would catch.'}]};
    const blocked = benchMove(generateGuMoves({...inputs, world: forbidden}).results);
    assert.equal(blocked.pass, false);
    assert.match(blocked.checks.find(row => row.id === 'allows').reason, /dry roof/);
    assert.deepEqual(settleGeneratedGuMove(blocked, {...inputs, world: forbidden, archive}),
        {ok: false, reason: 'effect-check-failed', archive});

    const excepted = {...forbidden, forbid: [{...forbidden.forbid[0], exception: {reason: 'Wet the rafters', cost: 'a pail'}}]};
    const unpaid = benchMove(generateGuMoves({...inputs, world: excepted}).results);
    assert.equal(unpaid.checks.find(row => row.id === 'allows').reason, 'exception-cost-unsettled');

    const preview = benchMove(generateGuMoves(inputs).results);
    const changed = settleGeneratedGuMove(preview, {...inputs, world: forbidden, archive});
    assert.equal(changed.ok, false);
    assert.equal(changed.archive, archive);
    const underpriced = benchMove(generateGuMoves({...inputs, world: {...world, priceQuantity: 'essence.immortal'}}).results);
    assert.match(underpriced.checks.find(row => row.id === 'pays').reason, /underpriced: 0 below 4/);
    const unmapped = benchMove(generateGuMoves({...inputs, world: {...world, project: () => null}}).results);
    assert.equal(unmapped.reason, 'effect-projection-unknown');

    const poor = {...inputs, facts: {reserves: {keeper: {primeval: 3}}}};
    assert.deepEqual(generateGuMoves(poor), {results: [], reason: 'no-funded-binding',
        budget: {trialLimit: 200, evaluated: 4, quoted: 0, truncated: false}});
    assert.deepEqual(settleGeneratedGuMove(preview, {...poor, archive}), {ok: false, reason: 'stale-quote', archive});
});

test('a real interruption retains its paid step and never promotes the forecast to the archive', () => {
    const inputs = bench();
    const archive = createNicheArchive();
    const move = benchMove(generateGuMoves(inputs).results);
    const ports = {...inputs.ports, authority: ({fingerprint, step}) =>
        fingerprint && step === 1 ? {ok: false, reason: 'bench-closed'} : {ok: true}};
    const done = settleGeneratedGuMove(move, {...inputs, archive, ports});
    assert.equal(done.ok, false);
    assert.equal(done.reason, 'bench-closed');
    assert.equal(done.record.status, 'interrupted');
    assert.deepEqual(done.costs, [primevalCost(1)]);
    assert.equal(done.record.facts.reserves.keeper.primeval, 9);
    assert.deepEqual(done.effects, []);
    assert.equal(done.archive, archive);
});

test('a complete settlement with extra effects cannot validate the preview', () => {
    const inputs = bench();
    const archive = createNicheArchive();
    const move = benchMove(generateGuMoves(inputs).results);
    const ports = {...inputs.ports, authority: ({fingerprint, step}) =>
        fingerprint && step === 2 ? {ok: true, effects: [{kind: 'roof-smoke'}]} : {ok: true}};
    const done = settleGeneratedGuMove(move, {...inputs, archive, ports});
    assert.equal(done.ok, false);
    assert.equal(done.reason, 'settlement-mismatch');
    assert.equal(done.record.status, 'complete');
    assert.deepEqual(done.costs, move.preview.costs);
    assert.deepEqual(done.effects.map(row => row.effect.kind), ['flame', 'roof-smoke']);
    assert.equal(done.archive, archive);
});
