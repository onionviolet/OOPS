// Oaths that enforce themselves (LR13, KW35-KW39). The Unbreakable Vow pattern:
// the vower can still act, and breaking the oath carries a lethal price that
// the actor's own quote shows. Canon shape (HBP, Spinner's End: a vow to watch
// over and protect a named boy, with a bonder); the forbid term and all
// minutes are authored for the test.
import assert from 'node:assert/strict';
import test from 'node:test';

import {beginWorking, defineWorkingLaw, quoteForActor, quoteWorking, settleWorking} from '../src/kernel_working.js';
import {defineOath, dueOathBreaches, oathAuthority, oathBroken} from '../src/kernel_oath.js';
import {range, reader} from './kernel_contract_suite.mjs';

const law = defineWorkingLaw({id: 'kernel.test.oath-acts', revision: 1, operations: {
    tell: {roles: {speaker: 'actor', secret: 'secret', listener: 'actor'}, minutes: 2,
        settle: ({bound}) => ({ok: true, effects: [{kind: 'told', secret: bound.secret.id, to: bound.listener.id}]})},
    watch: {roles: {guard: 'actor', ward: 'actor'}, minutes: 10, settle: () => ({ok: true, effects: [{kind: 'watched'}]})},
}});
const tell = {id: 'tell', revision: 1, law: law.ref, roles: {speaker: 'actor', secret: 'secret', listener: 'actor'},
    steps: [{op: 'tell', bindings: {speaker: 'speaker', secret: 'secret', listener: 'listener'}}]};
const watch = {id: 'watch-over', revision: 1, law: law.ref, roles: {guard: 'actor', ward: 'actor'},
    steps: [{op: 'watch', bindings: {guard: 'guard', ward: 'ward'}}]};
const things = {snape: {kind: 'actor', id: 'snape'}, draco: {kind: 'actor', id: 'draco'}, rival: {kind: 'actor', id: 'rival'},
    plan: {kind: 'secret', id: 'plan'}};
const ports = {read: reader(things)};
const death = {kind: 'death', target: 'snape', cause: 'oath'};
const vow = (enforce = 'penalize') => defineOath({id: 'vow.spinners-end', vower: 'snape', parties: ['narcissa', 'bellatrix'],
    madeAt: 10, enforce, penalty: {effects: [death], costs: [{kind: 'life', holder: 'snape', amount: 'all'}], cause: 'oath-broken'},
    terms: [
        {id: 'protect', kind: 'require', match: {method: 'watch-over', roles: {guard: 'snape', ward: 'draco'}}, by: 200},
        {id: 'keep-secret', kind: 'forbid', match: {method: 'tell', roles: {speaker: 'snape', secret: 'plan'}}},
    ]});
const telling = {speaker: {kind: 'actor', id: 'snape'}, secret: {kind: 'secret', id: 'plan'}, listener: {kind: 'actor', id: 'rival'}};

test('breaking a forbid term settles the act and attaches the lethal price', () => {
    const authority = oathAuthority([vow()]);
    const {record, effects} = settleWorking(law, beginWorking(law, tell, {id: 'snape.tells', bindings: telling, at: 20}), {now: 99, ports: {...ports, authority}});
    assert.equal(record.status, 'complete');
    assert.deepEqual(effects.map(row => row.effect), [{kind: 'told', secret: 'plan', to: 'rival'}, death]);
    assert.deepEqual(record.receipts[0].truth.breach, {oath: 'vow.spinners-end', term: 'keep-secret', vower: 'snape'});
    assert.equal(record.receipts[0].truth.cause, 'oath-broken');
    assert.equal(oathBroken(vow(), record.receipts), true);
});

test("the vower's own quote shows the price; one who does not know of the oath sees none", () => {
    const knows = quoteForActor(law, tell, {id: 'snape.tells', actor: 'snape', bindings: telling, at: 20, known: reader(things),
        believedAuthority: oathAuthority([vow()])});
    assert.equal(knows.eligible, true, 'the vower can still choose to break it');
    assert.deepEqual(knows.costs, [{kind: 'life', holder: 'snape', amount: 'all'}]);
    assert.deepEqual(knows.cause, ['oath-broken']);
    assert.deepEqual(knows.effects.at(-1), death);
    const unaware = quoteForActor(law, tell, {id: 'snape.tells', actor: 'npc.planner', bindings: telling, at: 20, known: reader(things)});
    assert.deepEqual(unaware.costs, []);
    assert.notEqual(unaware.fingerprint, knows.fingerprint);
});

test('the price is paid once, only after the oath was made, and other authority still decides first', () => {
    const oath = vow();
    const first = settleWorking(law, beginWorking(law, tell, {id: 'tell.1', bindings: telling, at: 20}), {now: 99, ports: {...ports, authority: oathAuthority([oath])}});
    const brokenBefore = (o, at) => first.record.receipts.some(row => row.truth.breach?.oath === o.id && row.at < at);
    const second = settleWorking(law, beginWorking(law, tell, {id: 'tell.2', bindings: telling, at: 40}),
        {now: 99, ports: {...ports, authority: oathAuthority([oath], {brokenBefore})}});
    assert.deepEqual(second.effects.map(row => row.effect.kind), ['told']);
    const early = settleWorking(law, beginWorking(law, tell, {id: 'tell.0', bindings: telling, at: 0}), {now: 99, ports: {...ports, authority: oathAuthority([oath])}});
    assert.deepEqual(early.effects.map(row => row.effect.kind), ['told'], 'told before the vow was made');
    const closed = oathAuthority([oath], {inner: () => ({ok: false, reason: 'not-permitted'})});
    const refused = settleWorking(law, beginWorking(law, tell, {id: 'tell.3', bindings: telling, at: 20}), {now: 99, ports: {...ports, authority: closed}});
    assert.deepEqual([refused.record.status, refused.record.receipts[0].reason], ['interrupted', 'not-permitted']);
});

test('a world whose oath prevents rather than punishes refuses the act (dial)', () => {
    const {record, effects} = settleWorking(law, beginWorking(law, tell, {id: 'tell.p', bindings: telling, at: 20}),
        {now: 99, ports: {...ports, authority: oathAuthority([vow('prevent')])}});
    assert.deepEqual([record.status, record.receipts[0].cause, record.receipts[0].reason], ['interrupted', 'authority', 'oath-forbids']);
    assert.equal(effects.length, 0);
    assert.equal(record.receipts[0].truth.breach.oath, 'vow.spinners-end');
});

test('a sworn act left undone breaks the oath at its deadline, the same in one jump or many', () => {
    const oath = vow();
    const guarding = {guard: {kind: 'actor', id: 'snape'}, ward: {kind: 'actor', id: 'draco'}};
    const watched = settleWorking(law, beginWorking(law, watch, {id: 'watch.1', bindings: guarding, at: 50}), {now: 99, ports}).record;
    const rows = record => record.receipts.map(row => ({...row, method: record.method.id, bindings: record.bindings}));
    assert.deepEqual(dueOathBreaches([oath], {now: 500, receipts: rows(watched)}), []);
    assert.deepEqual(dueOathBreaches([oath], {now: 199, receipts: []}), []);
    const due = dueOathBreaches([oath], {now: 500, receipts: []});
    assert.deepEqual(due.map(({oath: o, term, at, effects}) => [o, term, at, effects]), [['vow.spinners-end', 'protect', 200, [death]]]);
    assert.deepEqual(range(200, 500, 50).map(now => dueOathBreaches([oath], {now, receipts: []})).at(-1), due);
    assert.deepEqual(dueOathBreaches([oath], {now: 900, receipts: [], breaches: due}), [], 'paid once');
    const late = settleWorking(law, beginWorking(law, watch, {id: 'watch.late', bindings: guarding, at: 195}), {now: 999, ports}).record;
    assert.equal(dueOathBreaches([oath], {now: 500, receipts: rows(late)}).length, 1, 'finished at 205, after the deadline');
});

test('the oath price joins the fingerprint, so a quote made before the vow is stale after it', () => {
    const before = quoteWorking(law, tell, {id: 'tell.fp', bindings: telling, at: 20, ports});
    const after = quoteWorking(law, tell, {id: 'tell.fp', bindings: telling, at: 20, ports: {...ports, authority: oathAuthority([vow()])}});
    assert.notEqual(before.fingerprint, after.fingerprint);
    assert.throws(() => defineOath({id: 'x', vower: 'a', madeAt: 0, terms: [{id: 't', kind: 'require', match: {}}],
        penalty: {effects: [], cause: 'c'}}), /deadline/);
});
