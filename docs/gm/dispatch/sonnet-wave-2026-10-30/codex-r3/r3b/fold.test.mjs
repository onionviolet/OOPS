import test from 'node:test';
import assert from 'node:assert/strict';
import {overlayRepairs} from '../c1/fold.mjs';
import {overlayAnswers} from '../c5/repair.mjs';
const input = ['a', 'b', 'c'].map(slug => ({slug, occurrences: [{id: 'fixture', locator: 'fixture p1'}]}));
const inventory = new Map(input.map(r => [r.slug, r]));
const group = slug => ({canonical: slug, members: [{slug, evidence: [{id: 'fixture', locator: 'fixture p1'}]}], reason: 'Synthetic source claim.'});
test('C1 repairs replace unread coverage and preserve pending and old rows', () => {
    const got = overlayRepairs([group('a')], ['b', 'c'], [
        {input: [input[1]], rows: [group('b'), {unread: []}], lane: 'b1'},
        {input: [input[2]], rows: null, lane: 'b2'},
    ], inventory);
    assert.equal(got.groups.length, 2);
    assert.deepEqual(got.unread, ['c']);
    assert.equal(got.pending, 1);
    assert.throws(() => overlayRepairs([group('a')], ['b'], [{input: [input[0]], rows: null}], inventory), /repair slug/);
    assert.throws(() => overlayRepairs([], ['b'], [
        {input: [input[1]], rows: null}, {input: [input[1]], rows: null},
    ], inventory), /repair slug/);
});
const entries = [{id: 'a'}, {id: 'b'}, {id: 'c'}];
test('C5 repairs translate new local n to original stable IDs once', () => {
    const got = overlayAnswers(entries, new Map([[1, 'OTH']]), {unread: ['b', 'c']}, [
        {entries: [{id: 'c'}, {id: 'b'}], text: '1\tACT\n{"unread":["b"]}\n'},
    ]);
    assert.deepEqual([...got.answers], [[1, 'OTH'], [3, 'ACT']]);
    assert.deepEqual(got.meta.unread, ['b']);
    assert.equal(got.pending, 0);
    const pending = overlayAnswers(entries, new Map([[1, 'OTH']]), {unread: []}, [{entries: [{id: 'b'}, {id: 'c'}], text: null}]);
    assert.deepEqual(pending.meta.unread, ['b','c']);
    assert.equal(pending.pending, 1);
});
test('C5 rejects duplicate, silent, foreign, overlapping and unjustified repair labels', () => {
    const call = (text, e = [{id: 'b'}]) => overlayAnswers(entries, new Map([[1, 'OTH']]), {unread: ['b', 'c']}, [{entries: e, text}]);
    assert.throws(() => call('1\tACT\n1\tACT\n{"unread":[]}'), /Duplicate repair n/);
    assert.throws(() => call('{"unread":[]}'), /Silently missing/);
    assert.throws(() => call('2\tACT\n{"unread":[]}'), /Foreign repair n/);
    assert.throws(() => call('1\tACT\n{"unread":["b"]}'), /labelled and unread/);
    assert.throws(() => call('1\tNEW:new-family\n{"unread":[]}'), /NEW needs reason/);
    assert.throws(() => call(null, [{id: 'a'}]), /original label/);
    assert.throws(() => call(null, [{id: 'b'}, {id: 'b'}]), /duplicate repair ID/);
});
