import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const goods = JSON.parse(readFileSync(new URL('../src/data/pf1/goods.json', import.meta.url), 'utf8'));
const FIELDS = ['category', 'id', 'name', 'priceGp', 'source', 'weightLb'];

test('PF1 goods table: parses, ids are unique and the table is large enough to calibrate against', () => {
    assert.ok(Array.isArray(goods) && goods.length > 500);
    assert.equal(new Set(goods.map(g => g.id)).size, goods.length);
    assert.ok(goods.every(g => /^pf1\.goods\.[a-z0-9-]+$/.test(g.id)));
    assert.deepEqual(goods.map(g => g.id), goods.map(g => g.id).sort());
});

test('PF1 goods table: every price is a finite non-negative number and weights are numbers or null', () => {
    for(const g of goods) {
        assert.ok(Number.isFinite(g.priceGp) && g.priceGp >= 0, g.id);
        assert.ok(g.weightLb === null || Number.isFinite(g.weightLb) && g.weightLb >= 0, g.id);
    }
});

test('PF1 goods table: only names, numbers and product codes, so prose cannot leak in', () => {
    for(const g of goods) {
        assert.deepEqual(Object.keys(g).sort(), FIELDS, g.id);
        assert.ok(typeof g.name === 'string' && g.name.length < 80 && !/[<>]/.test(g.name), g.id);
        assert.ok(g.source === null || /^[A-Z0-9-]{3,16}$/.test(g.source), g.id);
    }
});
