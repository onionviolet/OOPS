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
