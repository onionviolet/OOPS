import test from 'node:test';
import assert from 'node:assert/strict';
import {definePath, pathView} from '../src/ascension_paths.js';
import {defineGraph, ladderToGraph, graphView, moveAlong, improvements} from '../src/ascension_graph.js';

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

const field = defineGraph({id: 'sample.field', world: 'sample.world', label: 'Field', shape: 'field', selfKnowledge: 'felt', competitive: true, entries: [],
    nodes: [
        {id: 'math1', label: 'Maths I', kind: 'subject', system: 'subjects', tier: 1, knowledge: 5, metrics: [{id: 'grade', type: 'grade', scale: ['C', 'B', 'A'], numbersInWorld: 'exact'}]},
        {id: 'math2', label: 'Maths II', kind: 'subject', system: 'subjects', tier: 2, knowledge: 4},
        {id: 'art', label: 'Artifice', kind: 'skill', system: 'crafts', visibleToOthers: 'insignia', metrics: [{id: 'hours', type: 'quota', unit: 'hours', persistsAcrossReset: true, numbersInWorld: 'felt-words'}]},
        {id: 'hidden', label: 'Hidden', kind: 'power', knowledge: 0}],
    edges: [
        {id: 'learn_m2', kind: 'learn', from: 'math1', to: 'math2', crossings: [q('study', 'hours', 3)], knowledge: 4, locksOthers: 'dial', odds: {basis: 'inferred', value: 'likely'}, outcome: 'no_effect'},
        {id: 'swap_art', kind: 'swap', from: 'math1', to: 'art', crossings: [q('apprentice', 'master')], odds: {basis: 'real', value: 0.4}, outcome: 'demotion', trail: true},
        {id: 'to_hidden', kind: 'advance', from: 'math1', to: 'hidden', crossings: [q('h', 'fh')]}]});

test('node and edge fields: knowledge levels gate the view, no path is valid', () => {
    const v = graphView(field, ['math1'], {hours: 3});
    assert.equal(v.selfKnowledge, 'felt');
    assert.equal(v.competitive, true);
    assert.equal(v.at[0].metrics[0].type, 'grade');
    assert.equal(v.exits.some(e => e.id === 'to_hidden'), false); // level 0: unaware
    const learn = v.exits.find(e => e.id === 'learn_m2');
    assert.equal(learn.to, 'Maths II');
    assert.equal(learn.ready, true);
    assert.equal(learn.odds, null); // level 4: costs, but not odds
    assert.deepEqual(graphView(field, ['math1'], {hours: 3}, {knowledge: {math2: 2}}).exits.find(e => e.id === 'learn_m2').crossings, []); // name only
    const swap = v.exits.find(e => e.id === 'swap_art');
    assert.deepEqual(swap.odds, {basis: 'real', value: 0.4});
    assert.equal(graphView(field, ['math1'], {}, {knowledge: {swap_art: 1}}).exits.find(e => e.id === 'swap_art').to, 'Artifice'.replace(/.*/, '???'));
    assert.equal(graphView(field, []).state, 'none');
});

test('moves keep a trail; a swap gives up the target system, a mix keeps both', () => {
    const s0 = {at: ['math1'], trail: []};
    const s1 = moveAlong(field, s0, 'learn_m2', {cause: 'term finished'});
    assert.deepEqual(s1.at, ['math2']);
    assert.deepEqual(s1.trail.map(t => t.cause), ['term finished']);
    assert.throws(() => moveAlong(field, s1, 'swap_art'), /does not leave/);
    const m = moveAlong(tree, {at: ['left']}, 'mix_lr', {cause: 'mixed'});
    assert.deepEqual(m.at.sort(), ['left', 'right']);
    assert.throws(() => defineGraph({id: 'sample.bad2', world: 'sample.world', label: 'B', shape: 'field', nodes: [{id: 'a', label: 'A', metrics: [{id: 'g', type: 'grade'}]}], edges: []}), /scale/);
});

test('axes and a derived improvements digest', () => {
    const g = defineGraph({id: 'sample.axes', world: 'sample.world', label: 'Axes', shape: 'field', entries: [],
        nodes: [{id: 'a', label: 'A', axis: 'skill', metrics: [{id: 'm', type: 'fill', axis: 'stat'}]}, {id: 'b', label: 'B', axis: 'gear'}, {id: 'c', label: 'C'}],
        edges: [{id: 'ab', kind: 'learn', from: 'a', to: 'b', crossings: [q('x', 'f')]}, {id: 'bc', kind: 'advance', from: 'b', to: 'c', crossings: [q('y', 'f')]}, {id: 'ca', kind: 'demote', from: 'c', to: 'a'}]});
    let s = moveAlong(g, {at: ['a']}, 'ab', {at: 10});
    s = moveAlong(g, s, 'bc', {at: 20});
    s = moveAlong(g, s, 'ca', {at: 30});
    const d = improvements(g, {trail: s.trail, metricChanges: [{node: 'a', metric: 'm', at: 25, delta: 0.2}, {node: 'a', metric: 'm', at: 26, delta: -1}]}, 15);
    assert.deepEqual(d.map(x => [x.axis, x.id]), [['path', 'c'], ['stat', 'a.m']]);
    assert.equal(improvements(g, {trail: s.trail}, 0).length, 2); // the demote does not count
    assert.throws(() => defineGraph({id: 'sample.bad3', world: 'sample.world', label: 'B', shape: 'field', nodes: [{id: 'a', label: 'A', axis: 'mood'}], edges: []}), /axis/);
});
