import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {shardIndex, locatorsOf, rowsFor, idsForTopic, cite} from '../scripts/lead_run/cite_paragraphs.mjs';

// Invented fixture text, not source prose.
const dir = mkdtempSync(join(tmpdir(), 'cite-'));
writeFileSync(join(dir, 'shard_a_ch001-002.txt'), '=== 第1章 甲\np1: 一。\np2: 二。\np3: 三。\n=== 第2章 乙\np1: 四。\n');
writeFileSync(join(dir, 'shard_b_ch002-002.txt'), '=== 第2章 乙\np1: 重复。\np2: 五。\n');
const merged = {
    registry: [{id: 't.person.ann', label: 'Ann', aliases: ['Annie'], zh: '安', firstMention: 'zh 第1章 p2', whereabouts: [{locator: 'zh 第2章 p1'}]}, {id: 't.place.inn', label: 'Inn', aliases: []}],
    scenes: [{beat: 'b1', place: 't.place.inn', present: ['t.person.ann'], evidence: [{locator: 'zh 第1章 p3'}], options: [{locator: 'zh 第2章 p2'}]}, {beat: 'b2', place: 'x', present: [], evidence: [{locator: 'zh 第1章 p1'}]}],
    extras: [{extra: 'rules', id: 't.craft.x', inputs: [{item: 't.person.ann', locator: 'zh 第9章 p9'}]}],
};

test('index keeps the first edition of an overlapping paragraph; locators are found anywhere in a row', () => {
    const idx = shardIndex(dir);
    assert.equal(idx.get('2:1'), '四。');
    assert.equal(idx.get('2:2'), '五。');
    assert.deepEqual(locatorsOf({a: 'zh 第1章 p2', b: [{c: 'zh 第2章 p1 and zh 第1章 p2'}]}), ['1:2', '2:1']);
});

test('rows for an id: registry, scenes naming it, extras mentioning it; topic matches labels and aliases', () => {
    const r = rowsFor(merged, ['t.person.ann']);
    assert.deepEqual([r.registry.length, r.scenes.length, r.extras.length], [1, 1, 1]);
    assert.deepEqual(idsForTopic(merged.registry, /annie/i), ['t.person.ann']);
});

test('cite returns cited paragraphs with context, deduplicated, and reports missing ones', () => {
    const r = cite({merged, index: shardIndex(dir), ids: ['t.person.ann'], context: 1});
    const keys = r.paragraphs.map(p => `${p.ch}:${p.p}`);
    assert.equal(new Set(keys).size, keys.length);
    assert.ok(r.paragraphs.find(p => p.ch === 1 && p.p === 2).cited);
    assert.ok(keys.includes('1:1'), 'context neighbour included');
    assert.deepEqual(r.missing, ['9:9']);
    assert.equal(cite({merged, index: shardIndex(dir), ids: ['t.person.ann'], max: 1}).paragraphs.length, 1);
});
