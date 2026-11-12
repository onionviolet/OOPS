// One descent graph on the identity registry (DG1-DG7, PFP33, BX3;
// docs/KERNEL_WORKING_CONTRACT.md KW40-KW45). Bodies, things, knowledge,
// institutions and places record where they came from as typed edges between
// identity ids, each edge stored descendant to ancestor. Each owner writes its
// own edge kind; a bloodline is a query, not a system. Only observed
// ancestors are stored: an ancestor nobody has seen is not an edge, and
// queries report how much of an ancestry is unknown instead of guessing.
// Imports only basics; reads the registry it is given.
import {check, natural, object} from './basics.js';

export const DESCENT_SCHEMA = 'kernel.descent@1';
const id = value => typeof value === 'string' && /^[a-z][a-z0-9_.:/-]*$/i.test(value);

// KW40. The edge kinds and who writes each (the plan's owners, by chat
// letter). `ordered` kinds follow time one way, so they cannot loop.
export const DESCENT_KINDS = Object.freeze({
    'born-of': {writers: ['l'], ordered: true, means: 'biological parent'},
    'made-from': {writers: ['f'], ordered: true, means: 'material or part'},
    'refined-from': {writers: ['f', 'g', 'b'], ordered: true, means: 'made out of another, or a move refined into a thing'},
    'taught-by': {writers: ['n'], ordered: false, means: 'learned from'},
    'forked-from': {writers: ['p'], ordered: true, means: 'variant of'},
    'inherited-by': {writers: ['m', 'r'], ordered: false, means: 'received from a previous holder', via: true},
    'founded-by': {writers: ['m'], ordered: false, means: 'founded by'},
});

export const createDescent = (kinds = DESCENT_KINDS) => ({schema: DESCENT_SCHEMA, kinds: Object.keys(kinds), edges: []});

const kindOf = (kinds, kind) => kinds[kind];
function reaches(edges, kind, from, target) {
    const seen = new Set();
    const stack = [from];
    while (stack.length) {
        const node = stack.pop();
        if (node === target) return true;
        if (seen.has(node)) continue;
        seen.add(node);
        for (const edge of edges) if (edge.kind === kind && edge.from === node) stack.push(edge.to);
    }
    return false;
}

// KW41. addDescent(graph, registry, {kind, from, to, at, writer, via?, cause}).
// Both ends must be identities the registry already holds (observed things);
// the writer must own the kind; an ordered kind may not loop; `via` names what
// passed for inherited-by (an estate, a Gu, a characteristic).
export function addDescent(graph, registry, edge, kinds = DESCENT_KINDS) {
    check(graph?.schema === DESCENT_SCHEMA && Array.isArray(graph.edges), 'Unsupported descent graph.');
    const def = kindOf(kinds, edge?.kind);
    check(def, 'Unknown descent kind.');
    check(def.writers.includes(edge.writer), `Only ${def.writers.join(' or ')} writes ${edge.kind} edges.`);
    for (const end of [edge.from, edge.to]) check(id(end) && Object.hasOwn(registry?.entries ?? {}, end), 'Both ends of a descent edge are observed identities.');
    check(edge.from !== edge.to && natural(edge.at) && typeof edge.cause === 'string' && edge.cause.length > 0, 'A descent edge needs two ends, a time and a cause.');
    check(edge.via === undefined || (def.via && id(edge.via) && Object.hasOwn(registry.entries, edge.via)), 'Only inherited-by edges name what passed.');
    check(!graph.edges.some(row => row.kind === edge.kind && row.from === edge.from && row.to === edge.to && row.via === edge.via),
        'That descent edge is already recorded.');
    if (def.ordered) check(!reaches(graph.edges, edge.kind, edge.to, edge.from), `A ${edge.kind} line cannot loop.`);
    const row = {kind: edge.kind, from: edge.from, to: edge.to, at: edge.at, writer: edge.writer, cause: edge.cause,
        ...(edge.via ? {via: edge.via} : {})};
    return {...graph, edges: [...graph.edges, row]};
}

// KW42. Walk toward ancestors (or descendants) along the given kinds, breadth
// first, in a fixed order (depth, then id), up to a depth dial.
function walk(graph, start, {kinds, depth = 12, up = true}) {
    const allowed = new Set(kinds ?? Object.keys(DESCENT_KINDS));
    const out = [];
    const seen = new Set([start]);
    let frontier = [start];
    for (let level = 1; level <= depth && frontier.length; level += 1) {
        const next = [];
        for (const node of frontier) {
            const edges = graph.edges.filter(edge => allowed.has(edge.kind) && (up ? edge.from === node : edge.to === node));
            for (const edge of edges) {
                const other = up ? edge.to : edge.from;
                if (seen.has(other)) continue;
                seen.add(other);
                next.push(other);
                out.push({id: other, kind: edge.kind, depth: level, via: up ? node : other});
            }
        }
        frontier = next.sort();
    }
    return out.sort((a, b) => a.depth - b.depth || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
export const ancestors = (graph, start, options = {}) => walk(graph, start, {...options, up: true});
export const descendants = (graph, start, options = {}) => walk(graph, start, {...options, up: false});
export const descendsFrom = (graph, start, ancestor, {kinds = ['born-of'], depth = 64} = {}) =>
    ancestors(graph, start, {kinds, depth}).some(row => row.id === ancestor);

// KW43. A bloodline: the observed born-of ancestors, plus what rides with the
// line (BL6): things the line's members passed on by inheritance, and the
// teaching among them.
export function bloodline(graph, start, {depth = 12} = {}) {
    const line = ancestors(graph, start, {kinds: ['born-of'], depth});
    const members = new Set([start, ...line.map(row => row.id)]);
    const holdings = graph.edges.filter(edge => edge.kind === 'inherited-by' && members.has(edge.from) && members.has(edge.to))
        .map(({from, to, via, at}) => ({heir: from, from: to, thing: via ?? null, at}));
    const teaching = graph.edges.filter(edge => edge.kind === 'taught-by' && members.has(edge.from) && members.has(edge.to))
        .map(({from, to, at}) => ({learner: from, teacher: to, at}));
    return {id: start, ancestors: line, holdings, teaching};
}

// KW44. Purity as a computed share along born-of (BL3). judge(id) answers
// true, false or null (not known) for a founder. Each observed parent carries
// an equal share of its child; a parent slot nobody observed (`expected`
// parents per world, default 2) and a founder judged null count as unknown,
// so the answer is {matching, unknown}, never a guess.
export function purity(graph, start, judge, {expected = 2, depth = 8} = {}) {
    check(typeof judge === 'function' && natural(expected) && expected > 0, 'Purity needs a judge and an expected parent count.');
    let matching = 0;
    let unknown = 0;
    const visit = (node, weight, level) => {
        const parents = [...new Set(graph.edges.filter(edge => edge.kind === 'born-of' && edge.from === node).map(edge => edge.to))].sort();
        if (!parents.length || level >= depth) {
            const verdict = judge(node);
            if (verdict === true) matching += weight;
            else if (verdict !== false) unknown += weight;
            return;
        }
        const slots = Math.max(expected, parents.length);
        for (const parent of parents) visit(parent, weight / slots, level + 1);
        unknown += weight * (slots - parents.length) / slots;
    };
    visit(start, 1, 0);
    return {matching, unknown, other: Math.max(0, 1 - matching - unknown)};
}

// KW45. One versioned save beside the identity registry.
export function validateDescent(graph, registry, kinds = DESCENT_KINDS) {
    check(object(graph) && graph.schema === DESCENT_SCHEMA && Array.isArray(graph.edges), 'Unsupported descent graph.');
    let rebuilt = createDescent(kinds);
    for (const edge of graph.edges) rebuilt = addDescent(rebuilt, registry, edge, kinds);
    return graph;
}
export const serializeDescent = graph => JSON.parse(JSON.stringify(graph));
export const restoreDescent = (raw, registry, kinds = DESCENT_KINDS) => validateDescent(structuredClone(raw), registry, kinds);
