import test from 'node:test';
import assert from 'node:assert/strict';
import {digestWorld} from '../prototypes/world-atlas/reader-findings.mjs';

const fill = {id: 'w.fill.market', for: 'w.scene.market', kind: 'daily-life', what: 'A proposed market routine',
    status: 'authored-proposal', layer: 'period', basis: ['w.item.ticket', 'en b1 c1 p2'],
    respects: ['w.rule.market', 'A quiet street', 'Daylight', 'The existing route'], replaceableBy: 'A later sourced account', confidence: 'low'};

test('authored fills preserve the actual provenance contract and their reader slices', () => {
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', fills: [fill]}, {prefix: 'b', fills: [fill]}]});
    assert.equal(d.fillsTotal, 1);
    assert.deepEqual(d.fills[0], {...fill, shards: ['a', 'b']});
    assert.equal(d.counts.fills.rows, 2);
});

test('materially distinct fill variants retain their own origins under one unique fill', () => {
    const changed = {...fill, what: 'A different proposed routine', basis: ['en b1 c2 p3'], layer: 'invented'};
    const d = digestWorld({world: 'w', shards: [
        {prefix: 'a', fills: [fill]}, {prefix: 'b', fills: [changed]},
        {prefix: 'c', fills: [changed]}, {prefix: 'd', fills: [fill]},
    ]});
    assert.equal(d.fillsTotal, 1);
    assert.equal(d.counts.fills.distinct, 1);
    assert.equal(d.counts.fills.rows, 4);
    assert.deepEqual(d.fills[0].shards, ['a', 'b', 'c', 'd']);
    assert.equal(d.fills[0].variants.length, 2);
    assert.deepEqual(d.fills[0].variants[0], {...fill, shards: ['a', 'd']});
    assert.deepEqual(d.fills[0].variants[1], {...changed, shards: ['b', 'c']});
});

test('each provenance field contributes to fill variant identity', () => {
    for (const [field, value] of Object.entries({for: 'w.scene.other', what: 'Different proposal', layer: 'implied',
        status: 'different-recorded-status', basis: ['Another basis'], respects: ['Another limit'], replaceableBy: 'Another replacement', confidence: 'high'})) {
        const d = digestWorld({world: 'w', shards: [{prefix: 'a', fills: [fill, {...fill, [field]: value}]}]});
        assert.equal(d.fills[0].variants.length, 2, field);
        assert.equal(d.fillsTotal, 1, field);
    }
});

test('deduplicated notes retain all valid locators, subjects and evidence labels', () => {
    const d = digestWorld({world: 'w', shards: [
        {prefix: 'a', other: {rules: [{what: 'A market closes at dusk', about: ['w.place.market'], label: 'S', locator: 'en b1 c1 p2'}]}},
        {prefix: 'b', other: {texture: [{what: 'A market closes at dusk', about: ['w.person.keeper'], label: 'T', locator: 'en b1 c2 p3'}]}},
    ]});
    assert.equal(d.notes.length, 1);
    assert.deepEqual(d.notes[0].about, ['w.place.market', 'w.person.keeper']);
    assert.deepEqual(d.notes[0].sources, [
        {pass: 'rules', label: 'S', locator: 'en b1 c1 p2', shard: 'a'},
        {pass: 'texture', label: 'T', locator: 'en b1 c2 p3', shard: 'b'},
    ]);
});

test('sealed targets and indirect provenance references stay out regardless of row order', () => {
    for (const field of ['for', 'replaceableBy', 'basis', 'respects']) {
        const value = field === 'basis' || field === 'respects' ? ['w.person.secret'] : 'w.person.secret';
        const d = digestWorld({world: 'w', shards: [{prefix: 'a', fills: [{...fill, [field]: value}],
            other: {rules: [{what: 'Secret loose fact', about: ['w.person.secret'], locator: 'en b1 c1 p2'}]}},
        {prefix: 'b', census: [{id: 'w.person.secret', kind: 'person', sealed: ['S1']}]}]});
        assert.equal(d.fills.length, 0);
        assert.equal(d.notes.length, 0);
    }
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', fills: [fill]},
        {prefix: 'b', fills: [{...fill, sealed: ['S1']}]}]});
    assert.equal(d.fills.length, 0);
});

test('private paths and malformed locators are omitted; older fills remain readable', () => {
    const d = digestWorld({world: 'w', shards: [{prefix: 'a',
        fills: [{...fill, basis: ['C:\\Users\\owner\\private\\notes.json', 'file:///private/source', 'en b1 c1 p2'], replaceableBy: '/Users/owner/private/source'},
            {id: 'w.fill.older', what: 'An older proposed bridge', layer: 'invented'}],
        other: {rules: [{what: 'A loose fact', locator: '/private/source.txt'}]},
    }]});
    assert.deepEqual(d.fills[0].basis, ['en b1 c1 p2']);
    assert.equal(d.fills[0].replaceableBy, null);
    assert.equal(d.notes[0].locator, null);
    assert.equal(d.fills[1].status, null);
    assert.deepEqual(d.fills[1].basis, []);
    assert.doesNotMatch(JSON.stringify(d.fills), /Users|file:\/\/|source\.txt/);
});

test('every safe note and fill remains available beyond the former digest limits', () => {
    const fills = Array.from({length: 2001}, (_, n) => ({id: 'w.fill.' + n, what: 'Proposal ' + n}));
    const notes = Array.from({length: 3001}, (_, n) => ({what: 'Note ' + n + ' has its own wording', locator: 'en b1 c1 p2'}));
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', fills, other: {rules: notes}}]});
    assert.equal(d.fills.length, 2001);
    assert.equal(d.notes.length, 3001);
    assert.equal(d.notes.at(-1).what, notes.at(-1).what);
});
