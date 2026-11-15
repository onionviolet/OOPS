// PS120/PS129: Ready marks land on each row's verb (the row's own, then its source's); a row whose verb is not drawn stays in Ready now.
import test from 'node:test';
import assert from 'node:assert/strict';
import {orderReady} from '../src/ready_rows.js';
import {verbMarks, unmarkedRows, rowVerb} from '../src/ui/verb_marks.js';

const rows = orderReady([
    ['crafting', [{id: 'a', label: 'Make Sinew string', state: 'near', gap: 'needs sinew'}, {id: 'b', label: 'Make Flax string', state: 'ready'}], 'Crafting'],
    ['life-day', [{id: 'feed', label: 'Feed the Moonglow Gu', state: 'ready', verb: 'feed'}, {id: 'ask', label: 'Ask the elder', state: 'near', gap: 'evening'}], 'Your day', 'talk'],
]);

test('the row\'s own verb wins, then its source\'s, then the old source map', () => {
    assert.deepEqual(rows.map(rowVerb), ['craft', 'feed', 'craft', 'talk']);
});

test('marks count ready then close per verb drawn in the action list', () => {
    assert.deepEqual(verbMarks(rows), {craft: {text: '1 ready · 1 close', state: 'ready'}, talk: {text: '1 close', state: 'near'}});
});

test('a row whose verb has no row on screen stays in Ready now (PS129)', () => {
    const left = unmarkedRows(rows, new Set(['craft', 'talk']));
    assert.deepEqual(left.map(r => r.label), ['Feed the Moonglow Gu']);
    assert.equal(unmarkedRows(rows, new Set()).length, rows.length);
});
