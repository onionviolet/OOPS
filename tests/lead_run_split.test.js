import test from 'node:test';
import assert from 'node:assert/strict';
import {splitChapters, headerChapter} from '../scripts/lead_run/make_split_retry.mjs';

test('split retry: a two-chapter shard splits at chapter headers and keeps each header', () => {
    const text = '=== 第47章 甲 | book 2 | member a\np1: 一\np2: 二\n=== 第48章 乙 | book 2 | member b\np1: 三\n';
    const chunks = splitChapters(text);
    assert.equal(chunks.length, 2);
    assert.deepEqual(chunks.map(headerChapter), [47, 48]);
    assert.match(chunks[1], /^=== 第48章[^\n]*\np1: 三\n$/);
    assert.equal(headerChapter('=== Chapter 12: Title | book 1'), 12);
});
