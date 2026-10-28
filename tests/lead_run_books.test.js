import test from 'node:test';
import assert from 'node:assert/strict';
import {groupBySize, ncxChapterMembers, bookShards, passDone} from '../scripts/lead_run/make_book_plans.mjs';
import {textChapters, shardText} from '../scripts/lead_run/prepare_shard.mjs';
import {htmlBlocks, epubSpine, blockChapters, BOOK_TAIL} from '../scripts/lead_run/prepare_shard_en.mjs';

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

test('spine reader: reading order from the OPF spine, hrefs resolved against the OPF folder, no NCX or nav needed', () => {
    const files = {
        'META-INF/container.xml': '<rootfile full-path="OEBPS/content.opf"/>',
        'OEBPS/content.opf': '<manifest><item id="b" href="page%202.html"/><item id="a" href="page-1.html"/><item id="c" href="gone.html"/></manifest><spine><itemref idref="a"/><itemref idref="b"/><itemref idref="zz"/></spine>',
    };
    assert.deepEqual(epubSpine(m => files[m]), ['OEBPS/page-1.html', 'OEBPS/page 2.html']);
});

test('html blocks: paragraphs and headings in order; innermost divs when a file has no paragraphs', () => {
    assert.deepEqual(htmlBlocks('<h1><a><span>Chapter 4: Ash</span></a></h1><p>One &amp; two.</p><p> </p><p>Three.</p>'), ['Chapter 4: Ash', 'One & two.', 'Three.']);
    assert.deepEqual(htmlBlocks('<div><div><font>Chapter 1: Dusk</font></div><div><span>Half a </span><span>line.</span></div></div>'), ['Chapter 1: Dusk', 'Half a line.']);
});

test('block chapters: heading variants, a contents list keeps the prose copy, the book tail is dropped', () => {
    const blocks = ['Chapter 1: Dusk', 'Chapter 2: Dawn', 'Chapter 3 Noon', 'Chapter: 4 Night',
        'Chapter 1: Dusk', 'First light.', 'Second line.', 'Chapter 2: Dawn', 'Birds.',
        'Chapter 3 Noon', 'Sun.', 'Chapter: 4 Night', 'Stars.', 'END OF BOOK ONE', 'Special thanks to my patrons', 'Ada, Bo, Cy'];
    const chs = blockChapters(blocks, BOOK_TAIL);
    assert.deepEqual(chs.map(c => [c.ch, c.title, c.paragraphs.length]), [[1, 'Dusk', 2], [2, 'Dawn', 1], [3, 'Noon', 1], [4, 'Night', 1]]);
    assert.ok(blockChapters(['Chapter 9: X', 'The chapter 9 of it was long and a sentence that is far too long to be a heading in any edition at all, said Ada, to nobody.'])[0].paragraphs.length === 1);
});

test('captured Chinese chapters: renumbered title, mirror notice and a repeated title line dropped, text escaped, shard header and paragraphs kept', () => {
    const chs = textChapters([
        {n: 2, title: '第二章 夜雨', text: '第二章 夜雨\u2003\u2003（由於緩存原因，請用戶直接瀏覽器訪問 某站，觀看最快的章節更新）\n他說：「甲 & 乙」\n\n第二行<br>\u2003\u2003（由於緩存原因，請用戶直接瀏覽器訪問 某站，觀看最快的章節更新）'},
        {n: 1, title: '', text: '開頭'},
    ]);
    assert.deepEqual(chs.map(c => [c.n, c.title]), [[1, '第1章'], [2, '第2章 夜雨']]);
    const {text, index} = shardText(chs);
    assert.equal(text, '=== 第1章 | member text:0001\np1: 開頭\n=== 第2章 夜雨 | member text:0002\np1: 他說：「甲 & 乙」\np2: 第二行<br>');
    assert.deepEqual(index.map(i => i.paragraphs), [1, 2]);
});
