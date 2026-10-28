import test from 'node:test';
import assert from 'node:assert/strict';
import {groupBySize, ncxChapterMembers, bookShards, passDone} from '../scripts/lead_run/make_book_plans.mjs';

test('size grouping: consecutive chapters up to the target and chapter cap; an oversized chapter stands alone', () => {
    const chs = [3, 3, 3, 9, 1, 1, 1].map((n, i) => ({ch: i + 1, n}));
    assert.deepEqual(groupBySize(chs, c => c.n, {target: 6, max: 2}).map(g => g.map(c => c.ch)), [[1, 2], [3], [4], [5, 6], [7]]);
});

test('NCX chapters: `Chapter N: Title` labels in order, anchors dropped, duplicates keep the first', () => {
    const nav = (n, t, src) => `<navPoint id="x${n}"><navLabel><text>Chapter ${n}: ${t}</text></navLabel><content src="${src}"/></navPoint>`;
    const ncx = `<navMap><navPoint><navLabel><text>Table of Contents</text></navLabel><content src="toc.html"/></navPoint>${nav(1, 'A', 'a/p-0.html#c1')}${nav(2, 'B', 'a/p-1.html')}${nav(2, 'B', 'index.html')}</navMap>`;
    assert.deepEqual(ncxChapterMembers(ncx), [{ch: 1, title: 'A', member: 'a/p-0.html'}, {ch: 2, title: 'B', member: 'a/p-1.html'}]);
});

test('book shards: 3- and 4-digit chapters, unique beat bases per book, done passes skipped', () => {
    const files = ['shard_x2_b2_ch001-002.txt', 'shard_x2_b2_ch999-1000.txt', 'shard_x2_b2_ch1001-1002.txt', 'shard_x20_b2_ch001-002.txt', 'index_x2_b2_ch001-002.json'];
    const s = bookShards({key: 'x2', book: 2}, files);
    assert.deepEqual(s.map(x => x.prefix), ['x2c001', 'x2c999', 'x2c1001']);
    assert.deepEqual(s.map(x => x.base), ['200101', '299901', '2100101']);
    assert.equal(bookShards({key: 'x1', book: 1}, ['shard_x1_b1_ch001-002.txt'])[0].base, '00101');
    const have = new Set(['x2c001m_census.jsonl', 'x2c001_rules_other.jsonl', 'x2c001_places.jsonl']);
    assert.ok(passDone('census', 'x2c001', have));
    assert.ok(!passDone('scenes', 'x2c001', have));
    assert.ok(passDone('rules', 'x2c001', have));
    assert.ok(passDone('texture', 'x2c001', have));
    assert.ok(!passDone('people', 'x2c001', have));
});
