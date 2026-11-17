// Alias table (PWC48): canon Gu that two sources name twice are one row; the repeat is a not-a-thing:alias row pointing at the kept one.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const load = f => JSON.parse(readFileSync(new URL(`../docs/coverage/${f}`, import.meta.url), 'utf8'));
const table = load('ri_aliases.json'), pairs = load('ri_alias_pairs.json');
const kinds = readFileSync(new URL('../docs/coverage/gu_kinds.jsonl', import.meta.url), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const byId = new Map(kinds.map(r => [r.id, r]));

test('every merged group names a kept row and alias rows that point at it', () => {
    assert.ok(table.groups.length > 50);
    for (const g of table.groups) {
        const keep = byId.get(g.keepRow);
        assert.ok(keep && !keep.state.startsWith('not-a-thing'), `${g.keepRow} is a live row`);
        for (const d of g.drop) assert.equal(byId.get(d)?.state, 'not-a-thing:alias', d);
    }
    assert.equal(kinds.filter(r => r.state === 'not-a-thing:alias').length, table.groups.reduce((n, g) => n + g.drop.length, 0));
});

test('the table carries the pinyin map, translation words and judged pairs with their readers', () => {
    assert.ok(table.pinyin.some(p => p.pinyin === 'jun' && p.zh === '钧'));
    assert.ok(table.synonyms.some(([a, b]) => a === 'wine' && b === 'liquor'));
    for (const p of pairs.pairs) {
        assert.ok(['same', 'variant', 'different'].includes(p.verdict));
        assert.ok(p.readers.luna || p.readers.haiku, 'a reader answered');
        if (p.readers.luna !== p.readers.haiku) assert.ok(p.basis.includes('disagree'), 'a split goes to Sol or is labelled');
    }
});

test('two chapter-checked rows are never merged', () => {
    const checked = new Set(kinds.filter(r => /(^|; )ch\d+/.test(r.source.split('; ').slice(-1)[0]) || /; ch\d+/.test(r.source)).map(r => r.id));
    for (const g of table.groups) assert.ok(!(checked.has(g.keep) && g.drop.some(d => checked.has(d))), g.keep);
});
