import test from 'node:test';
import assert from 'node:assert/strict';
import {careRecord, applyCare, careLabel, validateCareRecord} from '../src/care_access.js';
import {storyletEvents, feverCare} from '../src/storylet_content.js';
import {moneyNativeKey as money} from '../src/content_kit.js';

const fever = () => storyletEvents.find(e => e.id === 'village.child_has_fever');

test('fever healer route through care_access yields the same label, effects and costs as before', () => {
    const healer = fever().responses.find(r => r.id === 'healer');
    assert.deepEqual(healer, {id: 'healer', label: 'Send for the healer · 6 coins',
        effects: [{type: 'fact', scope: 'actor', key: 'storylet.fever.treated', value: true},
            {type: 'relationship', target: 'storylet.neighbor', axis: 'trust', amount: 2, text: 'Sent for the healer.'}],
        costs: [money(-6)]});
    assert.deepEqual(fever().responses.map(r => r.id), ['healer', 'help', 'pass']);
    assert.deepEqual(validateCareRecord(feverCare), []);
});

test('a rank-gated care record refuses a character below rank, says why, and leaves everything unchanged', () => {
    const rec = careRecord({provider: 'field surgeon', who: 'player', gate: {kind: 'rank', min: 3}, cost: 0, restores: ['hp.restored']});
    const character = Object.freeze({rank: 1}), before = structuredClone(character);
    const r = applyCare(rec, character, {moneyCost: money});
    assert.equal(r.ok, false); assert.match(r.reason, /field surgeon.*rank 3.*you have 1/);
    assert.deepEqual([r.effects, r.costs], [[], []]); assert.deepEqual(character, before);
    assert.equal(applyCare(rec, {rank: 3}, {moneyCost: money}).ok, true);
});

test('doesNotRestore is surfaced and not applied', () => {
    const rec = careRecord({provider: 'mechanic', who: 'player', gate: {kind: 'favor', min: 1}, cost: 0, duration: 180,
        restores: ['arm.working'], doesNotRestore: ['arm.feeling']});
    const r = applyCare(rec, {favor: 2}, {moneyCost: money});
    assert.deepEqual(r.notRestored, ['arm.feeling']); assert.equal(r.duration, 180);
    assert.deepEqual(r.effects.map(e => e.key), ['arm.working']);
});

test('invalid records are rejected and a free price care shows no coin label', () => {
    assert.throws(() => careRecord({provider: 'x', who: 'p', cost: -1}), /cost/);
    assert.throws(() => careRecord({provider: 'x', who: 'p', cost: 0, gate: {kind: 'rank'}}), /min/);
    assert.equal(careLabel('Rest', careRecord({provider: 'x', who: 'p', cost: 0})), 'Rest');
});

test('a price gate with a known purse refuses a short purse and leaves state alone', () => {
    const rec = careRecord({provider: 'healer', who: 'player', cost: 8, restores: ['x']});
    const r = applyCare(rec, {money: 3}, {moneyCost: money});
    assert.deepEqual([r.ok, r.effects, r.costs], [false, [], []]);
    assert.match(r.reason, /8 coins.*3/);
    assert.equal(applyCare(rec, {money: 8}, {moneyCost: money}).ok, true);
});

test('Village aging treatment routes through care_access: unmet gate changes nothing, met gate keeps prior effects', async () => {
    const {freshAging, stepAging, treat, severityOf, CHRONIC, DAY, TREAT_SEASON} = await import('../src/aging_contact.js');
    let s = freshAging(), clock = 44 * 365 * DAY;
    for (let age = 44; age < 66; age++) {
        s = stepAging(s, {age, clock, minutes: 365 * DAY, worldId: 'base.frontier', inVillage: false}).state; clock += 365 * DAY;
    }
    const joints = CHRONIC[0], c = s.conditions.joints, sev = severityOf(joints, c);
    assert.ok(sev >= 1, 'fixture needs a condition to treat');
    const snapshot = JSON.stringify(s);
    assert.throws(() => treat(s, 'joints', clock, 1), /A course of care costs \d+ coins/);
    assert.equal(JSON.stringify(s), snapshot, 'refusal leaves the character record unchanged');
    const r = treat(s, 'joints', clock, 500);
    assert.equal(r.cost, 8 * (sev + 1));
    assert.equal(r.state.conditions.joints.treatedUntil, clock + TREAT_SEASON);
    assert.equal(severityOf(joints, r.state.conditions.joints), sev - 1);
    assert.equal(r.state.conditions.joints.diagnosed, true);
});

test('credit gate: full purse takes no coins, writes one owed row; limit refuses a second visit; old save unchanged', async () => {
    const {writeObligation, createObligations, validateObligations} = await import('../src/obligations_ledger.js');
    const rec = careRecord({provider: 'healer', who: 'player', gate: {kind: 'credit', min: 10, known: 24}, cost: 8, restores: ['x']});
    const r = applyCare(rec, {money: 500, owed: 0, now: 100}, {moneyCost: money});
    assert.equal(r.ok, true); assert.deepEqual(r.costs, []);
    assert.deepEqual(r.obligation, {id: 'care:healer:100', kind: 'coin', debtor: 'player', creditor: 'healer', amount: 8,
        why: 'Care from the healer, owed', source: 'care_access', since: 100, eases: 0, carries: true});
    let ledger = writeObligation(createObligations(), r.obligation);
    assert.equal(ledger.rows.length, 1);
    const snapshot = JSON.stringify(ledger);
    const second = applyCare(rec, {money: 500, owed: 8, now: 200}, {moneyCost: money});
    assert.equal(second.ok, false); assert.match(second.reason, /10 coins for a stranger.*owe 8.*8 more/);
    assert.deepEqual([second.effects, second.costs, second.obligation], [[], [], undefined]);
    assert.equal(JSON.stringify(ledger), snapshot);
    const known = applyCare(rec, {owed: 8, known: true, now: 200}, {moneyCost: money});
    assert.equal(known.ok, true);
    assert.equal(validateObligations(writeObligation(ledger, known.obligation)).rows.length, 2);
    assert.throws(() => careRecord({provider: 'x', who: 'p', cost: 1, gate: {kind: 'credit', min: 10, known: 5}}), /known/);
    // A save that never held a credit row is just an empty or absent ledger: nothing is written or invented.
    assert.deepEqual(createObligations().rows, []);
    assert.equal(applyCare(careRecord({provider: 'healer', who: 'p', cost: 6, restores: ['x']}), {money: 6}, {moneyCost: money}).obligation, undefined);
});
