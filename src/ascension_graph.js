// L10: ascension as a graph (Weibao 2026-10-30, "maybe tree for all of them?"). Nodes are states a character can be in; edges are
// the crossings between them. A ladder is the special case of a line of advance edges (`ladderToGraph`), so every existing
// descriptor stays valid and unchanged. Pure leaf, no state, no save slice (AR3, AR12).
//   advance  the ordinary step; several advance edges leaving one node is a branch
//   mix      taking up a node while holding another: a world's mechanism with odds, signs, outcome and aftermath, never a ban
//   demote   a fall back
// A lock is a dial with a reason and an optional way through, not an absolute: { dial: 'narrow'|'tight'|'sealed', reason, fact?, need? }.
// "No path" is a valid state (`at: []`): `entries` lists where a life may begin, and may be empty.
import {check, deepFreeze, natural, object} from './basics.js';
import {validateCrossing, crossingMet, pathShapes} from './ascension_paths.js';

const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.-]*$/.test(v);
const text = v => typeof v === 'string' && v.length > 0;
export const edgeKinds = Object.freeze(['advance', 'mix', 'demote']);
export const lockDials = Object.freeze(['narrow', 'tight', 'sealed']);

export function defineGraph(desc) {
    check(object(desc) && id(desc.id) && id(desc.world) && text(desc.label) && pathShapes.includes(desc.shape), 'Invalid ascension graph.');
    const {nodes, edges, entries = []} = desc;
    check(Array.isArray(nodes) && nodes.length > 0 && Array.isArray(edges) && Array.isArray(entries), `Graph ${desc.id} needs nodes, edges and entries.`);
    const ids = new Set();
    for (const n of nodes) {
        check(object(n) && id(n.id) && text(n.label) && Array.isArray(n.grants ?? []) && (n.grants ?? []).every(text), `Invalid node in ${desc.id}.`);
        check(!ids.has(n.id), `Duplicate node ${n.id}.`);
        ids.add(n.id);
        check(n.failure === undefined || (object(n.failure) && text(n.failure.signs) && text(n.failure.outcome)), `Invalid failure on ${n.id}.`);
    }
    check(entries.every(e => ids.has(e)), `Graph ${desc.id} has an unknown entry.`);
    const eids = new Set();
    for (const e of edges) {
        const where = `${desc.id}.${e?.id}`;
        check(object(e) && id(e.id) && !eids.has(e.id) && edgeKinds.includes(e.kind) && ids.has(e.from) && ids.has(e.to) && e.from !== e.to, `Invalid edge ${where}.`);
        eids.add(e.id);
        (e.crossings ?? []).forEach(c => validateCrossing(c, where));
        check(e.kind === 'demote' || (e.crossings ?? []).length > 0, `Edge ${where} needs crossings.`);
        if (e.lock !== undefined) {
            check(object(e.lock) && lockDials.includes(e.lock.dial) && text(e.lock.reason), `Edge ${where} lock needs a dial and a reason.`);
            check((e.lock.fact === undefined) === (e.lock.need === undefined) && (e.lock.need === undefined || e.lock.need === true || natural(e.lock.need)), `Edge ${where} lock way-through is malformed.`);
        }
        check((e.kind === 'mix') === (e.mix !== undefined), `Edge ${where}: only a mix edge carries a mix, and every mix edge carries one.`);
        if (e.mix) check(object(e.mix) && ['odds', 'signs', 'outcome', 'aftermath'].every(k => text(e.mix[k])), `Edge ${where} mix needs odds, signs, outcome and aftermath.`);
        check((e.costs ?? []).every(c => object(c) && text(c.key) && Number.isFinite(c.amount)), `Edge ${where} has a bad cost.`);
    }
    return deepFreeze(structuredClone({...desc, entries, edges}));
}

// A ladder path (definePath) as a graph: stage i -> node, one advance edge per stage with that stage's crossings.
export function ladderToGraph(path) {
    return defineGraph({id: path.id, world: path.world, label: path.label, shape: path.shape, entries: [path.stages[0].id],
        nodes: path.stages.map(s => ({id: s.id, label: s.label, grants: s.grants, ...(s.failure ? {failure: s.failure} : {})})),
        edges: path.stages.slice(1).map((s, i) => ({id: `to_${s.id}`, kind: 'advance', from: path.stages[i].id, to: s.id, crossings: s.crossings}))});
}

// Observer-safe view. `at` is the node ids held now (empty = no path, several = mixed). `known` is a set of node ids the observer can
// name; any other node reads '???' and its edge shows nothing of its crossings, grants or failure (ABR19). Omit `known` to name all.
export function graphView(graph, at = [], facts = {}, {known} = {}) {
    check(object(facts) && Array.isArray(at), `Invalid view on ${graph.id}.`);
    const node = Object.fromEntries(graph.nodes.map(n => [n.id, n]));
    check(at.every(a => node[a]), `Unknown position on ${graph.id}.`);
    const name = nid => !known || known.includes(nid) || at.includes(nid) ? node[nid].label : '???';
    const open = nid => !known || known.includes(nid) || at.includes(nid);
    const starts = at.length === 0 ? graph.entries : null;
    const exits = graph.edges.filter(e => at.includes(e.from))
        .map(e => edgeView(e, node, facts, open(e.to), name));
    return {path: graph.id, world: graph.world, label: graph.label, state: at.length === 0 ? 'none' : at.length === 1 ? 'on' : 'mixed',
        at: at.map(a => ({id: a, label: node[a].label, grants: [...(node[a].grants ?? [])]})),
        begin: starts ? starts.map(s => ({id: s, label: name(s)})) : [], exits};
}

function edgeView(e, node, facts, seen, name) {
    const crossings = seen ? (e.crossings ?? []).map(c => ({id: c.id, type: c.type, label: c.label, need: c.need, met: crossingMet(c, facts), irreversible: c.irreversible === true})) : [];
    const lock = e.lock ? {dial: e.lock.dial, reason: e.lock.reason, throughMet: e.lock.fact === undefined ? false : crossingMet({need: e.lock.need, fact: e.lock.fact}, facts)} : null;
    const locked = lock !== null && !lock.throughMet;
    const ready = seen && !locked && crossings.every(c => c.met);
    return {id: e.id, kind: e.kind, to: name(e.to), toId: seen ? e.to : null, crossings, lock, locked, ready,
        mix: seen && e.mix ? {...e.mix} : null, failure: seen && node[e.to].failure ? {...node[e.to].failure} : null,
        costs: seen ? (e.costs ?? []).map(c => ({...c})) : []};
}
