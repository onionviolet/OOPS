import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

import {compileGuCoupledBeat} from '../src/gu_coupled_working.js';
import {asBoundGu, guMethods} from '../src/gu_working_law.js';
import {composeWorking, defineComposition} from '../src/kernel_compose.js';
import {beginQuotedWorking, beginWorking, quoteForActor, quoteWorking, restoreWorking, serializeWorking,
    settleWorking} from '../src/kernel_working.js';
import {icebladeStormBeat} from '../src/world_packs/gu_coupled_move_rows.js';

const operator = {id: 'keeper', kind: 'operator'};
const place = {id: 'trial-yard', kind: 'place'};
const specimen = (id, kind) => asBoundGu({id, kind, rank: 1, alive: true, fedThrough: 13, holder: operator.id});
const ref = ({id, kind}) => ({id, kind});
const charge = amount => ({quantity: 'essence.primeval', holder: operator.id, amount});
const reserve = amount => ({keeper: {primeval: amount}});

// A second, synthetic use of the same compiler. It has two roles and no
// spatial scope. Its earlier receipt lets us check shared reserves on refusal.
const screenBeat = {
    id: 'screen-test', revision: 1, minutes: 1,
    participants: [
        {id: 'first', kind: 'white-jade', fuel: 'primeval', cost: 1},
        {id: 'second', kind: 'moonlight', fuel: 'primeval', cost: 1},
    ],
    effect: {kind: 'screen-test'},
};

function composeStorm(stormRow = icebladeStormBeat) {
    const screen = compileGuCoupledBeat(screenBeat);
    const storm = compileGuCoupledBeat(stormRow);
    const roles = {...screen.method.roles, ...storm.method.roles};
    const slots = Object.entries({screen, storm}).map(([name, {method}]) => ({
        name, needs: method.roles, bindings: method.steps[0].bindings, facts: 'shared',
    }));
    return composeWorking(defineComposition({id: 'trial.coupled', revision: 1, roles, slots}), {screen, storm});
}

function fixture(amount = 10) {
    const things = {
        operator, place,
        blade: specimen('loan-ice', 'ice-blade'),
        swirl: specimen('loan-swirl', 'swirl'),
        wind: specimen('loan-wind', 'fierce-wind'),
        first: specimen('loan-jade', 'white-jade'),
        second: specimen('loan-moon', 'moonlight'),
    };
    const request = {
        id: 'trial.cast', at: 10, facts: {reserves: reserve(amount)},
        bindings: Object.fromEntries(Object.entries(things).map(([role, thing]) => [role, ref(thing)])),
        ports: {read: ref => Object.values(things).find(thing => thing.id === ref.id)},
    };
    return {things, request};
}

const screenIntent = {kind: 'screen-test'};
const stormIntent = {kind: 'iceblade-storm', attack: true, defense: true, freezesGround: true, moving: true,
    scope: {place: 'trial-yard', radius: 3}};

test('ch. 167 exact roles settle one combined, scoped intent at the quoted deadline', () => {
    const evidence = JSON.parse(readFileSync(new URL('../docs/research/gu-identity-evidence.json', import.meta.url), 'utf8'));
    const source = evidence.moves.find(row => row.id === 'iceblade-storm');
    assert.deepEqual(icebladeStormBeat.participants.map(({id, kind}) => ({id, kind})),
        source.roles.map(({id, kind}) => ({id, kind})));
    for (const {kind} of source.roles) assert.equal(guMethods(kind).activate, undefined);

    const {law, method} = composeStorm();
    const {request} = fixture();
    const quote = quoteWorking(law, method, request);
    assert.equal(quote.ok, true);
    assert.deepEqual(quote.deadlines, [11, 13]);
    assert.deepEqual(quote.costs, [1, 1, 2, 1, 2].map(charge));
    assert.deepEqual(quote.effects, [screenIntent, stormIntent]);
    assert.deepEqual(request.facts.reserves, reserve(10));

    const {stale, record} = beginQuotedWorking(law, method, {...request, fingerprint: quote.fingerprint});
    assert.equal(stale, false);
    const mid = settleWorking(law, record, {now: 12, ports: request.ports});
    assert.equal(mid.record.status, 'running');
    assert.deepEqual(mid.record.facts.reserves, reserve(8));
    assert.deepEqual(mid.effects.map(row => row.effect), [screenIntent]);
    const done = settleWorking(law, mid.record, {now: 13, ports: request.ports});
    assert.equal(done.record.status, 'complete');
    assert.deepEqual(done.record.facts, quote.facts);
    assert.deepEqual(done.record.facts.reserves, reserve(3));
    assert.deepEqual(done.record.receipts[1].bindings,
        {operator: 'keeper', place: 'trial-yard', blade: 'loan-ice', swirl: 'loan-swirl', wind: 'loan-wind'});
    assert.deepEqual(done.record.receipts[1].truth.costs, [2, 1, 2].map(charge));
    assert.deepEqual(done.effects, [{working: 'trial.cast', step: 1, at: 13, effect: stormIntent}]);
});

test('the final participant cannot partially spend a short beat or undo the earlier paid beat', () => {
    const {law, method} = composeStorm();
    const {request} = fixture(6);
    const quote = quoteWorking(law, method, request);
    assert.equal(quote.ok, false);
    assert.equal(quote.failedStep, 1);
    assert.equal(quote.reason, 'needs more essence');
    assert.deepEqual(quote.costs, [charge(1), charge(1)]);
    assert.deepEqual(quote.facts.reserves, reserve(4));

    const run = settleWorking(law, beginWorking(law, method, request), {now: 13, ports: request.ports});
    assert.equal(run.record.status, 'interrupted');
    assert.equal(run.record.cursor, 1);
    assert.deepEqual(run.record.facts, quote.facts);
    assert.deepEqual(run.record.receipts[1].truth, {facts: {}, effects: []});
    assert.deepEqual(run.effects.map(row => row.effect), [screenIntent]);
});

test('live reads refuse missing, lent, substituted or unfed Gu and a missing place at the storm deadline', () => {
    const {law, method} = composeStorm();
    for (const [scenario, reason, role] of [
        ['missing-gu', 'role-unavailable', 'wind'],
        ['lent', 'gu-not-held', undefined],
        ['substituted', 'wrong-gu-kind', undefined],
        ['unfed', 'needs feeding', undefined],
        ['missing-place', 'role-unavailable', 'place'],
    ]) {
        const {request, things} = fixture();
        const quote = quoteWorking(law, method, request);
        assert.equal(quote.ok, true);
        const {record} = beginQuotedWorking(law, method, {...request, fingerprint: quote.fingerprint});
        const mid = settleWorking(law, record, {now: 11, ports: request.ports});
        const ports = {read(ref, at) {
            if (at === 13 && scenario === 'missing-place' && ref.id === place.id) return null;
            const thing = request.ports.read(ref, at);
            if (at !== 13 || ref.id !== things.wind.id) return thing;
            if (scenario === 'missing-gu') return null;
            if (scenario === 'lent') return {...thing, holder: 'other'};
            if (scenario === 'unfed') return {...thing, fedThrough: 12};
            return {...thing, guKind: 'swirl'};
        }};
        const run = settleWorking(law, mid.record, {now: 13, ports});
        const refusal = run.record.receipts.at(-1);
        assert.equal(run.record.status, 'interrupted', scenario);
        assert.equal(refusal.reason, reason, scenario);
        assert.equal(refusal.role, role, scenario);
        assert.deepEqual(refusal.truth, {facts: {}, effects: []}, scenario);
        assert.deepEqual(run.effects, [], scenario);
        assert.deepEqual(run.record.facts.reserves, reserve(8), scenario);
    }
});

test('one held specimen cannot fill two roles in a coupled beat', () => {
    const {law, method} = composeStorm();
    const {request} = fixture();
    const quote = quoteWorking(law, method, {...request, bindings: {...request.bindings, wind: request.bindings.swirl}});
    assert.equal(quote.ok, false);
    assert.equal(quote.reason, 'duplicate-gu');
    assert.deepEqual(quote.facts.reserves, reserve(8));
    assert.deepEqual(quote.effects, [screenIntent]);
});

test('K refuses stale funding and quotes an unknown constituent without reading live truth', () => {
    const {law, method} = composeStorm();
    const {request, things} = fixture();
    const quote = quoteWorking(law, method, request);
    const changed = beginQuotedWorking(law, method, {...request, facts: {reserves: reserve(6)}, fingerprint: quote.fingerprint});
    assert.equal(changed.stale, true);
    assert.equal(changed.record, undefined);
    const actorQuote = quoteForActor(law, method, {...request, actor: operator.id, knownFacts: request.facts,
        known: (ref, at) => ref.id === things.wind.id ? null : request.ports.read(ref, at)});
    assert.equal(actorQuote.eligible, false);
    assert.deepEqual(actorQuote.reasons, [{step: null, role: 'wind', cause: 'unknown', reason: 'role-unknown'}]);
    assert.deepEqual(actorQuote.effects, []);
    assert.deepEqual(actorQuote.costs, []);
});

test('mid-working JSON restore preserves the paid step, deadline and one combined output', () => {
    const {law, method} = composeStorm();
    const {request} = fixture();
    const quote = quoteWorking(law, method, request);
    const {record} = beginQuotedWorking(law, method, {...request, fingerprint: quote.fingerprint});
    const mid = settleWorking(law, record, {now: 12, ports: request.ports});
    const saved = serializeWorking(mid.record);
    const reloaded = composeStorm();
    const restored = restoreWorking(reloaded.law, saved);
    const resumed = settleWorking(reloaded.law, restored, {now: 30, ports: request.ports});
    const uninterrupted = settleWorking(law, record, {now: 30, ports: request.ports});
    assert.equal(resumed.record.status, 'complete');
    assert.deepEqual(resumed.effects.map(row => row.effect), [stormIntent]);
    assert.deepEqual(resumed.record, uninterrupted.record);
    assert.deepEqual([...mid.effects, ...resumed.effects], uninterrupted.effects);
    assert.equal(restored.fingerprint, quote.fingerprint);
    assert.deepEqual(settleWorking(reloaded.law, resumed.record, {now: 31, ports: request.ports}).effects, []);
    assert.throws(() => restoreWorking(composeStorm({...icebladeStormBeat, revision: 2}).law, saved), /different law/);
});
