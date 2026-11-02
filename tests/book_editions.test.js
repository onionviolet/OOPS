import test from 'node:test';
import assert from 'node:assert/strict';
import {alignChapter, chooseEdition} from '../scripts/lead_run/align_editions.mjs';

const rows = (prefix, values) => values.map((text, i) => ({id: `${prefix}${i+1}`, p: i+1, text}));

test('paragraph alignment keeps a merged source paragraph as one 2:1 group', () => {
    const zh = rows('z', ['abcdefghij', 'klmnopqrst']);
    const en = rows('e', ['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopq']);
    const result = alignChapter(zh, en);
    assert.equal(result.path.length, 1);
    assert.deepEqual(result.path[0].zh.map(x => x.id), ['z1', 'z2']);
    assert.deepEqual(result.path[0].en.map(x => x.id), ['e1']);
});

test('one long source paragraph maps to many translated paragraphs without gaps', () => {
    const zh = rows('z', ['a'.repeat(100), 'b'.repeat(10)]);
    const en = rows('e', Array.from({length: 11}, () => 'word '.repeat(7)));
    const result = alignChapter(zh, en);
    assert.equal(result.score.gapParagraphs, 0);
    const group = result.path.find(g => g.zh.some(p => p.id === 'z1'));
    assert.deepEqual(group.zh.map(p => p.id), ['z1']);
    assert.equal(group.en.length, 10);
    assert.equal(result.lowScore, false);
});

test('missing preferred chapter falls through to the next available edition', () => {
    const picked = chooseEdition({official: undefined, oldtl: [{p: 1}], original: [{p: 1}]});
    assert.equal(picked.edition, 'oldtl');
});

test('chapter outside the configured length band is flagged below the floor', () => {
    const zh = rows('z', ['short']);
    const en = rows('e', ['x'.repeat(80)]);
    const result = alignChapter(zh, en);
    assert.equal(result.score.lowScore, true);
    assert.equal(result.score.englishPerChineseChar > result.score.floor.englishPerChineseChar[1], true);
});
