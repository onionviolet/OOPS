import test from 'node:test';
import assert from 'node:assert/strict';
import {compareRows} from '../src/ui/start_compare.js';

const pr = (key, money, owe) => ({key, label: `Begin as ${key}`, answers: [['Memories', 'x'], ['Money and items', money], ...(owe ? [['What you owe', owe]] : [])]});

test('starts compare on money and what is owed, one row each, in the host order', () => {
    const t = compareRows([pr('a', '2 pounds', 'a probation'), pr('b', '5 left', 'a term')]);
    assert.deepEqual(t.columns, ['Money and items', 'What you owe']);
    assert.deepEqual(t.rows.map(r => [r.label, ...r.cells]), [['as a', '2 pounds', 'a probation'], ['as b', '5 left', 'a term']]);
});

test('a column no start answers is left out and a single start needs no comparison', () => {
    assert.deepEqual(compareRows([pr('a', '1'), pr('b', '2')]).columns, ['Money and items']);
    assert.deepEqual(compareRows([pr('a', '1')]), {columns: [], rows: []});
    assert.deepEqual(compareRows([{key: 'a', label: 'a', answers: []}, pr('b', '2')]).rows, []);
});
