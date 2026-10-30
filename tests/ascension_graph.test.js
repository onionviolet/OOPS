import test from 'node:test';
import assert from 'node:assert/strict';
import {definePath, pathView} from '../src/ascension_paths.js';
import {defineGraph, ladderToGraph, graphView} from '../src/ascension_graph.js';

const q = (id, fact, need = 1) => ({id, type: 'quota', label: id, fact, need});
const ladder = definePath({id: 'sample.line', world: 'sample.world', label: 'Line', shape: 'ladder', stages: [
    {id: 'a', label: 'A', crossings: [], grants: []},
    {id: 'b', label: 'B', crossings: [q('qb', 'fb', 2)], grants: ['B grant']},
    {id: 'c', label: 'C', crossings: [q('qc', 'fc')], grants: [], failure: {signs: 's', outcome: 'o'}}]});

test('a ladder embeds as a graph and agrees with pathView', () => {
    const g = ladderToGraph(ladder);
    for (const [pos, facts] of [[0, {fb: 1}], [0, {fb: 2}], [1, {}], [1, {fc: 1}]]) {
        const v = pathView(ladder, pos, facts), w = graphView(g, [ladder.stages[pos].id], facts);
        assert.equal(w.exits[0].ready, v.ready);
        assert.deepEqual(w.exits[0].crossings.map(c => c.met), v.crossings.map(c => c.met));
        assert.deepEqual(w.exits[0].failure, v.failure);
    }
});

const tree = defineGraph({id: 'sample.tree', world: 'sample.world', label: 'Tree', shape: 'tree', entries: ['root'],
    nodes: [{id: 'root', label: 'Root'}, {id: 'left', label: 'Left', grants: ['L']}, {id: 'right', label: 'Right', failure: {signs: 'split', outcome: 'ruin'}}],
    edges: [
        {id: 'go_left', kind: 'advance', from: 'root', to: 'left', crossings: [q('x', 'fx')]},
        {id: 'go_right', kind: 'advance', from: 'root', to: 'right', crossings: [q('y', 'fy')], lock: {dial: 'tight', reason: 'Few are taught this', fact: 'taught', need: true}},
        {id: 'mix_lr', kind: 'mix', from: 'left', to: 'right', crossings: [q('z', 'fz')], mix: {odds: 'poor', signs: 'two voices', outcome: 'a split self', aftermath: 'lingering echo'}},
        {id: 'back', kind: 'demote', from: 'left', to: 'root', costs: [{key: 'mastery', amount: -2}]}]});

test('branching, lock dial with a way through, mixing and no path', () => {
    const none = graphView(tree, [], {});
    assert.equal(none.state, 'none');
    assert.deepEqual(none.begin.map(b => b.id), ['root']);
    assert.deepEqual(none.exits, []);
    const root = graphView(tree, ['root'], {fx: 1, fy: 1});
    assert.equal(root.exits.length, 2);
    assert.equal(root.exits.find(e => e.id === 'go_left').ready, true);
    const right = root.exits.find(e => e.id === 'go_right');
    assert.equal(right.locked, true);
    assert.equal(right.ready, false);
    assert.equal(graphView(tree, ['root'], {fy: 1, taught: true}).exits.find(e => e.id === 'go_right').ready, true);
    const left = graphView(tree, ['left'], {fz: 1});
    const mix = left.exits.find(e => e.kind === 'mix');
    assert.equal(mix.ready, true);
    assert.equal(mix.mix.aftermath, 'lingering echo');
    assert.equal(graphView(tree, ['left', 'right'], {}).state, 'mixed');
    assert.deepEqual(left.exits.find(e => e.kind === 'demote').costs, [{key: 'mastery', amount: -2}]);
});

test('observer rule hides unknown nodes and authoring rejects bad graphs', () => {
    const v = graphView(tree, ['root'], {fx: 1}, {known: ['root']});
    assert.equal(v.exits[0].to, '???');
    assert.deepEqual(v.exits[0].crossings, []);
    assert.equal(v.exits[0].ready, false);
    const base = {id: 'sample.bad', world: 'sample.world', label: 'Bad', shape: 'tree', nodes: [{id: 'a', label: 'A'}, {id: 'b', label: 'B'}]};
    assert.throws(() => defineGraph({...base, edges: [{id: 'e', kind: 'advance', from: 'a', to: 'b'}]}), /needs crossings/);
    assert.throws(() => defineGraph({...base, edges: [{id: 'e', kind: 'mix', from: 'a', to: 'b', crossings: [q('x', 'f')]}]}), /mix/);
    assert.throws(() => defineGraph({...base, edges: [{id: 'e', kind: 'advance', from: 'a', to: 'b', crossings: [q('x', 'f')], lock: {dial: 'tight'}}]}), /lock/);
    assert.throws(() => defineGraph({...base, entries: ['zz'], edges: []}), /unknown entry/);
});
