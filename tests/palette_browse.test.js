import test from 'node:test';
import assert from 'node:assert/strict';
import {rankEntries, browseEntries} from '../src/command_palette.js';
import {projectKnownThings} from '../src/known_things.js';

const rows = (group, n) => Array.from({length: n}, (_, i) => ({label: `${group} ${i}`, group}));

test('an empty palette query shows actions here and navigation before a long Known list', () => {
    const entries = [...rows('Known', 300), ...rows('Items', 3), ...rows('Panels', 15), ...rows('Go to', 14), ...rows('Here', 5)];
    const shown = rankEntries(entries, '');
    assert.equal(shown.length, 38);
    assert.deepEqual(shown.slice(0, 5).map(e => e.group), Array(5).fill('Here'));
    assert.equal(shown[5].group, 'Go to');
    const counts = shown.reduce((m, e) => ({...m, [e.group]: (m[e.group] || 0) + 1}), {});
    assert.equal(counts.Here, 5); assert.equal(counts['Go to'], 10); assert.equal(counts.Panels, 10); assert.equal(counts.Items, 3);
    assert.equal(counts.Known, 10);
    // Each group stays contiguous so the dialog draws one heading per group.
    const order = shown.map(e => e.group).filter((g, i, all) => g !== all[i - 1]);
    assert.equal(new Set(order).size, order.length);
});

test('typing still finds a Known row that browsing leaves out', () => {
    const entries = [...rows('Here', 2), ...rows('Known', 60)];
    assert.equal(browseEntries(entries).filter(e => e.group === 'Known').length, 10);
    assert.deepEqual(rankEntries(entries, 'known 55').map(e => e.label), ['Known 55']);
});

test('places that share a name and parent list once in Known things', () => {
    const places = [{id: 'a1', name: 'Practice yard', detail: 'Region'}, {id: 'a2', name: 'Practice yard', detail: 'Region'}, {id: 'b', name: 'Practice yard', detail: 'In Fort'}];
    assert.deepEqual(projectKnownThings({places}).places.map(p => p.key), ['place:a1', 'place:b']);
});
