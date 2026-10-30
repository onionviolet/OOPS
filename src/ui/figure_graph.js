// Generic graph layouts for the figure primitive (G5): the form follows the shape of the path. A world's adapter names the shape; nothing
// here knows a world. Every function returns node positions `at: [x, y]` within -1..1 (what figure.js nodes take), so any session's nodes
// and edges draw through the one renderer and keep their text form. Shapes:
//   chain  nodes in a column, first at the bottom (a ladder drawn as nodes)
//   tree   layered: a node sits one layer above its deepest parent; siblings spread across the layer, alternate ones nudged down when a layer is crowded (a branching path or a DAG)
//   wheel  nodes on a ring (a wheel of states, a cycle)
//   web    nodes on an outer ring with the most-connected node in the centre (a field of links)
//   list   no path: a plain column, no ordering implied
const MARGIN = .84;
const spread = (n, i) => n === 1 ? 0 : -MARGIN + 2 * MARGIN * i / (n - 1);

/** Edges without back edges: a depth-first walk from the roots (the first node when there is none) drops any edge that points to an ancestor. */
function acyclic(nodes, edges) {
    const ids = new Set(nodes.map(n => n.id)), out = new Map(nodes.map(n => [n.id, []]));
    for (const e of edges) if (ids.has(e.from) && ids.has(e.to) && e.from !== e.to) out.get(e.from).push(e);
    const hasParent = new Set(edges.filter(e => ids.has(e.from) && e.from !== e.to).map(e => e.to));
    const roots = nodes.filter(n => !hasParent.has(n.id)).map(n => n.id);
    const state = new Map(), keep = [];
    const walk = id => { state.set(id, 1); for (const e of out.get(id)) { if (state.get(e.to) === 1) continue; keep.push(e); if (!state.has(e.to)) walk(e.to); } state.set(id, 2); };
    for (const id of roots.length ? roots : [nodes[0]?.id]) if (id !== undefined && !state.has(id)) walk(id);
    for (const n of nodes) if (!state.has(n.id)) walk(n.id);
    return keep;
}

/** Layer index per node: longest distance from a root along the edges that remain once cycles are cut. */
export function layers(nodes, edges) {
    const parents = new Map(nodes.map(n => [n.id, []]));
    for (const e of acyclic(nodes, edges)) parents.get(e.to).push(e.from);
    const depth = new Map();
    const visit = id => { if (!depth.has(id)) depth.set(id, parents.get(id).length ? 1 + Math.max(...parents.get(id).map(visit)) : 0); return depth.get(id); };
    nodes.forEach(n => visit(n.id));
    return depth;
}

/** Order nodes inside each layer by the mean position of their parents (fewer crossings), keeping input order for ties. */
function orderLayers(nodes, edges, depth) {
    const byLayer = [];
    nodes.forEach(n => (byLayer[depth.get(n.id)] ??= []).push(n.id));
    const index = new Map();
    byLayer.forEach(layer => layer.forEach((id, i) => index.set(id, i)));
    for (let l = 1; l < byLayer.length; l++) {
        const mean = id => { const ps = edges.filter(e => e.to === id && depth.get(e.from) < l).map(e => index.get(e.from)); return ps.length ? ps.reduce((a, b) => a + b, 0) / ps.length : index.get(id); };
        byLayer[l].sort((a, b) => mean(a) - mean(b) || index.get(a) - index.get(b));
        byLayer[l].forEach((id, i) => index.set(id, i));
    }
    return byLayer;
}

/** shape: 'chain' | 'tree' | 'wheel' | 'web' | 'list'. Returns Map id -> [x, y]. Unknown shapes fall back to a list: never a guess at structure. */
export function layoutGraph(shape, nodes, edges = []) {
    const at = new Map(), n = nodes.length;
    // SVG y grows downward: +MARGIN is the bottom, so the first layer and the first chain node sit lowest and the path climbs.
    const rise = (count, i) => count === 1 ? 0 : MARGIN - 2 * MARGIN * i / (count - 1);
    if (shape === 'tree') {
        const byLayer = orderLayers(nodes, edges, layers(nodes, edges));
        byLayer.forEach((layer, l) => layer.forEach((id, i) => at.set(id, [spread(layer.length, i), rise(byLayer.length, l) + (layer.length > 3 && i % 2 ? .14 : 0)])));
    } else if (shape === 'wheel' || shape === 'web') {
        const hub = shape === 'web' && n > 2 ? nodes.map(m => [m.id, edges.filter(e => e.from === m.id || e.to === m.id).length]).sort((a, b) => b[1] - a[1])[0][0] : null;
        const rim = nodes.filter(m => m.id !== hub);
        rim.forEach((m, i) => { const a = -Math.PI / 2 + 2 * Math.PI * i / rim.length; at.set(m.id, [MARGIN * Math.cos(a), MARGIN * Math.sin(a)]); });
        if (hub) at.set(hub, [0, 0]);
    } else if (shape === 'chain') {
        nodes.forEach((m, i) => at.set(m.id, [0, rise(n, i)]));
    } else {
        nodes.forEach((m, i) => at.set(m.id, [-.5, spread(n, i)]));
    }
    return at;
}

/** Put the layout on a spec's nodes (returns a copy; a node that already has `at` or a ring keeps it). */
export function withLayout(spec, shape) {
    const placed = layoutGraph(shape, spec.nodes ?? [], spec.edges ?? []);
    return {...spec, nodes: (spec.nodes ?? []).map(node => node.at !== undefined || node.ring !== undefined ? node : {...node, at: placed.get(node.id)})};
}
