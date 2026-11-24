import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

function readLedger(file) {
    const url = new URL(`../docs/coverage/${file}.jsonl`, import.meta.url);
    return readFileSync(url, 'utf8').trimEnd().split('\n').map(line => JSON.parse(line));
}

test('Gu move slot observations can be read by the atlas without private sources', () => {
    const moves = new Set(readLedger('gu_moves').map(row => row.id));
    const kinds = new Set(readLedger('gu_kinds').map(row => row.id));
    const slots = readLedger('evidence/gu_move_slots');
    const keys = new Set();
    const fields = ['gu', 'locator', 'move', 'name', 'order', 'orderStated', 'resolution', 'role', 'tier', 'variant'];

    assert.ok(slots.length > 0);
    for (const [index, slot] of slots.entries()) {
        const at = `gu_move_slots.jsonl:${index + 1}`;
        assert.ok(!Object.hasOwn(slot, 'text'), at);
        assert.deepEqual(Object.keys(slot).sort(), fields, at);
        assert.ok(moves.has(slot.move), at);
        assert.ok(slot.variant === null || /^[a-z0-9]+(?:[-@][a-z0-9]+)*$/.test(slot.variant), at);
        assert.ok(['core', 'support', 'unnamed'].includes(slot.role), at);
        assert.ok(typeof slot.name === 'string' && slot.name.trim() === slot.name && slot.name.length > 0, at);
        assert.ok(['chapter', 'wiki', 'community'].includes(slot.tier), at);
        assert.match(slot.locator, /^(?:ri:ch[1-9]\d*:p[1-9]\d*|wiki:[^#\n]+#[^\n]+)$/, at);
        if (slot.tier === 'chapter') assert.match(slot.locator, /^ri:ch/, at);
        if (slot.tier === 'wiki') assert.match(slot.locator, /^wiki:/, at);
        assert.ok(['exact', 'alias', 'unresolved', 'collision'].includes(slot.resolution), at);
        if (['exact', 'alias'].includes(slot.resolution)) {
            assert.ok(kinds.has(slot.gu), at);
        } else {
            assert.equal(slot.gu, null, at);
        }
        if (slot.role === 'unnamed') assert.equal(slot.gu, null, at);
        assert.equal(typeof slot.orderStated, 'boolean', at);
        if (slot.orderStated) {
            assert.ok(Number.isSafeInteger(slot.order) && slot.order > 0, at);
        } else {
            assert.equal(slot.order, null, at);
        }

        const key = JSON.stringify([slot.move, slot.variant, slot.role, slot.name, slot.locator]);
        assert.ok(!keys.has(key), at);
        keys.add(key);
    }
});

test('the two Myriad Self leads retain the chapter 1561 recipe and its open group', () => {
    const slots = readLedger('evidence/gu_move_slots');
    for (const move of ['lead:myriad-self', 'lead:myriad_self_(killer_move)']) {
        const recipe = slots.filter(slot => slot.move === move && slot.variant === 'myriad-self@ch1561');
        assert.deepEqual(recipe.filter(slot => slot.role === 'core').map(slot => slot.name).sort(),
            ['Cleanse Soul', 'Pulling Mountain', 'Pulling Water', 'Self Strength']);
        assert.equal(recipe.filter(slot => slot.role === 'support').length, 14);
        assert.equal(recipe.filter(slot => slot.role === 'unnamed').length, 1);
        assert.ok(recipe.every(slot => slot.locator === 'ri:ch1561:p13' && !slot.orderStated));
    }
});
