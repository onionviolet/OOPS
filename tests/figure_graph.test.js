import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure, validateFigureSpec} from '../src/ui/figure.js';
import {layers, layoutGraph, withLayout} from '../src/ui/figure_graph.js';

const nodes = ids => ids.map(id => ({id, label: id, state: 'pending'}));
const edge = (from, to, extra = {}) => ({from, to, kind: 'leads to', ...extra});

test('layers: a node sits below its deepest parent, and a cycle is cut rather than looped', () => {
    const d = layers(nodes(['a', 'b', 'c', 'd']), [edge('a', 'b'), edge('a', 'c'), edge('b', 'd'), edge('c', 'd'), edge('d', 'a')]);
    assert.equal(d.get('a'), 0);
    assert.equal(d.get('b'), d.get('c'));
    assert.ok(d.get('d') > d.get('b'));
    assert.doesNotThrow(() => layers(nodes(['x', 'y']), [edge('x', 'y'), edge('y', 'x')]));
});

test('every shape places every node within the figure, and the form follows the shape', () => {
    const ns = nodes(['root', 'left', 'right', 'leaf']), es = [edge('root', 'left'), edge('root', 'right'), edge('left', 'leaf'), edge('right', 'leaf')];
    for (const shape of ['chain', 'tree', 'wheel', 'web', 'list', 'unknown-shape']) {
        const at = layoutGraph(shape, ns, es);
        assert.equal(at.size, 4, shape);
        for (const [x, y] of at.values()) assert.ok(Math.abs(x) <= 1 && Math.abs(y) <= 1, shape);
    }
    const tree = layoutGraph('tree', ns, es);
    assert.ok(tree.get('root')[1] > tree.get('left')[1] && tree.get('left')[1] > tree.get('leaf')[1], 'the tree climbs from the root');
    assert.notEqual(tree.get('left')[0], tree.get('right')[0], 'siblings spread across the layer');
    const chain = layoutGraph('chain', ns);
    assert.ok(chain.get('root')[1] > chain.get('leaf')[1], 'a chain climbs from its first node');
    assert.deepEqual(layoutGraph('web', ns, es).get('left') !== undefined, true);
    assert.deepEqual(layoutGraph('unknown-shape', ns, es), layoutGraph('list', ns, es), 'an unknown shape is a list, never a guess');
});

test('withLayout gives a valid figure that draws every node and edge with its text, and keeps hand-placed nodes', () => {
    const spec = withLayout({id: 'g', title: 'Branching path', nodes: [{id: 'a', label: 'Start', state: 'done'}, {id: 'b', label: 'Left', state: 'current'}, {id: 'c', label: 'Right', state: 'guessed', at: [.5, .5]}],
        edges: [{from: 'a', to: 'b', kind: 'leads to', state: 'done'}, {from: 'a', to: 'c', kind: 'leads to', state: 'guessed', label: 'mixing may end badly'}]}, 'tree');
    validateFigureSpec(spec);
    assert.deepEqual(spec.nodes[2].at, [.5, .5]);
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    const {text} = renderFigure(dom.document.getElementById('host'), spec, {text: true});
    assert.match(text, /Start/); assert.match(text, /mixing may end badly/);
});
