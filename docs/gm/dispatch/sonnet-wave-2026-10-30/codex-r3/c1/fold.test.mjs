import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSlice} from './fold.mjs';

const input = ['near_fire', 'fire_at_hand', 'rain'].map(slug => ({slug,
    occurrences: [{id: 'fixture.ability', locator: 'fixture p1'}]}));
const inventory = new Map(input.map(x => [x.slug, x]));
const member = slug => ({slug, evidence: [{id: 'fixture.ability', locator: 'fixture p1'}]});
const group = {canonical: 'near_fire', members: [member('near_fire'), member('fire_at_hand')], reason: 'Synthetic equivalent fire proximity states.'};

test('fold validates a reviewed cluster and explicit unread remainder', () => {
    const r = validateSlice(input, [group, {unread: ['rain']}], inventory);
    assert.equal(r.covered.size, 3);
    assert.equal(r.groups.length, 1);
    assert.deepEqual(r.unread, ['rain']);
});

test('fold rejects missing, duplicate, foreign and falsely cited members', () => {
    assert.throws(() => validateSlice(input, [group], inventory), /unread/);
    assert.throws(() => validateSlice(input, [group, {unread: []}], inventory), /Missing.*rain/);
    assert.throws(() => validateSlice(input, [group, {unread: ['rain', 'rain']}], inventory), /duplicate/);
    assert.throws(() => validateSlice(input, [group, {unread: ['foreign']}], inventory), /Foreign/);
    const wrong = structuredClone(group);
    wrong.members[0].evidence[0].locator = 'unread p9';
    assert.throws(() => validateSlice(input, [wrong, {unread: ['rain']}], inventory), /Unmatched/);
    wrong.members[0].evidence = [];
    assert.throws(() => validateSlice(input, [wrong, {unread: ['rain']}], inventory), /No read evidence/);
});
