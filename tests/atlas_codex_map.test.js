import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {projectBlockerMap, DEFAULT_BLOCKERS, MAX_BLOCKERS, MAX_EDGES} from '../prototypes/world-atlas/codex-map.mjs';

test('blocker projection combines ledger reach and sizes nodes by row count', () => {
    const graph = projectBlockerMap([
        {ledger: 'a', blockers: [{slug: 'runner', rows: 8}, {slug: 'read', rows: 2}]},
        {ledger: 'b', blockers: [{slug: 'runner', rows: 3}]},
    ]);
    assert.equal(graph.totalBlockers, 2);
    assert.deepEqual(graph.edges.map(e => [e.ledger, e.slug, e.rows]), [['a', 'read', 2], ['a', 'runner', 8], ['b', 'runner', 3]]);
    assert.equal(graph.blockers.find(b => b.slug === 'runner').rows, 11);
    assert.ok(graph.nodes.find(n => n.id === 'blocker:runner').w > graph.nodes.find(n => n.id === 'blocker:read').w);
    assert.ok(graph.nodes.find(n => n.id === 'ledger:a').w > graph.nodes.find(n => n.id === 'ledger:b').w);
});

test('blocker and edge caps leave only connected nodes', () => {
    const one = [{ledger: 'a', blockers: Array.from({length: 100}, (_, i) => ({slug: `s${String(i).padStart(3, '0')}`, rows: 100 - i}))}];
    assert.equal(projectBlockerMap(one).blockers.length, DEFAULT_BLOCKERS);
    assert.equal(projectBlockerMap(one, {limit: 999}).blockers.length, MAX_BLOCKERS);
    const many = Array.from({length: 10}, (_, i) => ({ledger: `l${i}`, blockers: one[0].blockers}));
    const graph = projectBlockerMap(many, {limit: MAX_BLOCKERS});
    assert.equal(graph.edges.length, MAX_EDGES);
    assert.equal(graph.omittedEdges, 300);
    assert.ok(graph.nodes.every(node => graph.edges.some(e => e.from === node.id || e.to === node.id)));
    assert.deepEqual(projectBlockerMap([]).nodes, []);
});

test('ladder maps fresh, stale, missing and case-less receipts to Fold states', async () => {
    // codex-views imports browser routes. Replace only those imports to load its pure state function in Node.
    const source = await readFile(new URL('../prototypes/world-atlas/codex-views.mjs', import.meta.url), 'utf8');
    const pure = source.replace(/^import .*;\n/gm, '');
    const {ladderFoldState} = await import(`data:text/javascript,${encodeURIComponent(pure)}`);
    assert.equal(ladderFoldState(1, 'runs'), 'known');
    assert.equal(ladderFoldState(1, null), 'unknown');
    assert.equal(ladderFoldState(2, {state: 'current'}, true), 'known');
    assert.equal(ladderFoldState(2, {state: 'stale'}, true), 'estimated');
    assert.equal(ladderFoldState(3, {state: 'row-changed'}, true), 'estimated');
    assert.equal(ladderFoldState(4, null, true), 'unknown');
    assert.equal(ladderFoldState(2, {state: 'current'}, false), 'empty');
});
