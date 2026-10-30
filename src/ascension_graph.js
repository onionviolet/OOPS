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
export const edgeKinds = Object.freeze(['advance', 'mix', 'demote', 'swap', 'learn']);
export const nodeKinds = Object.freeze(['state', 'rung', 'realm', 'substage', 'subject', 'skill', 'power', 'rank', 'collection']);
export const axes = Object.freeze(['path', 'skill', 'knowledge', 'stat', 'gear', 'standing', 'wealth']);
export const metricTypes = Object.freeze(['fill', 'quota', 'grade', 'standing', 'capacity', 'mastery']);
const numbersIn = Object.freeze(['exact', 'felt-words', 'none']);
const visibleTo = Object.freeze(['none', 'insignia', 'sensed', 'status']);
const outcomes = Object.freeze(['loss_of_control', 'demotion', 'death', 'no_effect']);
const bases = Object.freeze(['stated', 'inferred', 'real']);
// Knowledge ladder (0 unaware .. 5 odds and real numbers): what an observer may read of a node or edge.
export const KNOWLEDGE = Object.freeze({unaware: 0, exists: 1, name: 2, benefits: 3, costs: 4, odds: 5});
const level = v => Number.isInteger(v) && v >= 0 && v <= 5;
function validateMetric(m, where) {
    check(m.axis === undefined || axes.includes(m.axis), `Invalid axis at ${where}.`);
    check(object(m) && id(m.id) && metricTypes.includes(m.type) && numbersIn.includes(m.numbersInWorld ?? 'exact'), `Invalid metric at ${where}.`);
    check(m.persistsAcrossReset === undefined || typeof m.persistsAcrossReset === 'boolean', `Invalid persistsAcrossReset at ${where}.${m.id}.`);
    if (m.type === 'grade' || m.type === 'mastery') check(Array.isArray(m.scale) && m.scale.length > 1 && m.scale.every(text), `Metric ${where}.${m.id} needs an ordered scale.`);
    if (m.type === 'quota') check(text(m.unit), `Metric ${where}.${m.id} needs a unit.`);
}
export const lockDials = Object.freeze(['narrow', 'tight', 'sealed']);

export function defineGraph(desc) {
    check(object(desc) && id(desc.id) && id(desc.world) && text(desc.label) && pathShapes.includes(desc.shape), 'Invalid ascension graph.');
    const {nodes, edges, entries = []} = desc;
    check(desc.selfKnowledge === undefined || ['numbers', 'felt', 'sealed'].includes(desc.selfKnowledge), `Invalid selfKnowledge on ${desc.id}.`);
    check(desc.competitive === undefined || typeof desc.competitive === 'boolean', `Invalid competitive flag on ${desc.id}.`);
    check(Array.isArray(nodes) && nodes.length > 0 && Array.isArray(edges) && Array.isArray(entries), `Graph ${desc.id} needs nodes, edges and entries.`);
    const ids = new Set();
    for (const n of nodes) {
        check(object(n) && id(n.id) && text(n.label) && Array.isArray(n.grants ?? []) && (n.grants ?? []).every(text), `Invalid node in ${desc.id}.`);
        check(!ids.has(n.id), `Duplicate node ${n.id}.`);
        check(n.axis === undefined || axes.includes(n.axis), `Invalid axis on ${n.id}.`);
        check(n.kind === undefined || nodeKinds.includes(n.kind), `Invalid node kind on ${n.id}.`);
        check(n.system === undefined || id(n.system), `Invalid system on ${n.id}.`);
        check(n.tier === undefined || natural(n.tier), `Invalid tier on ${n.id}.`);
        check(n.substage === undefined || text(n.substage), `Invalid substage on ${n.id}.`);
        check(n.knowledge === undefined || level(n.knowledge), `Invalid knowledge on ${n.id}.`);
        check(n.visibleToOthers === undefined || visibleTo.includes(n.visibleToOthers), `Invalid visibility on ${n.id}.`);
        (n.metrics ?? []).forEach(m => validateMetric(m, n.id));
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
        check(e.locksOthers === undefined || ['keeps', 'locks', 'dial'].includes(e.locksOthers), `Edge ${where} has a bad locksOthers.`);
        check(e.odds === undefined || (object(e.odds) && bases.includes(e.odds.basis) && (e.odds.value === undefined || text(e.odds.value) || Number.isFinite(e.odds.value))), `Edge ${where} has bad odds.`);
        check(e.outcome === undefined || outcomes.includes(e.outcome), `Edge ${where} has a bad outcome.`);
        check(e.trail === undefined || typeof e.trail === 'boolean', `Edge ${where} has a bad trail flag.`);
        check(e.knowledge === undefined || level(e.knowledge), `Edge ${where} has bad knowledge.`);
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

// Observer-safe view. `at` is the node ids held now (empty = no path, several = mixed). Two ways to limit the observer:
// `known` (node ids that may be named, others read '???') and `knowledge` ({id: 0..5} for nodes and edges, default the row's own
// `knowledge`, else 5). Levels: 0 unaware (not shown), 1 exists ('???'), 2 name, 3 + grants, 4 + crossings, costs, failure, 5 + odds and mix text.
export function graphView(graph, at = [], facts = {}, {known, knowledge = {}, trail = []} = {}) {
    check(object(facts) && Array.isArray(at), `Invalid view on ${graph.id}.`);
    const node = Object.fromEntries(graph.nodes.map(n => [n.id, n]));
    check(at.every(a => node[a]), `Unknown position on ${graph.id}.`);
    const nodeLevel = nid => at.includes(nid) ? 5 : known && !known.includes(nid) ? 1 : knowledge[nid] ?? node[nid].knowledge ?? 5;
    const name = nid => nodeLevel(nid) >= 2 ? node[nid].label : '???';
    const exits = graph.edges.filter(e => at.includes(e.from)).map(e => edgeView(e, node, facts, Math.min(knowledge[e.id] ?? e.knowledge ?? 5, nodeLevel(e.to)), name))
        .filter(x => x.level > 0);
    return {path: graph.id, world: graph.world, label: graph.label, state: at.length === 0 ? 'none' : at.length === 1 ? 'on' : 'mixed',
        selfKnowledge: graph.selfKnowledge ?? 'numbers', competitive: graph.competitive === true,
        at: at.map(a => ({id: a, label: node[a].label, kind: node[a].kind ?? 'state', system: node[a].system ?? null, tier: node[a].tier ?? null,
            substage: node[a].substage ?? null, grants: [...(node[a].grants ?? [])], metrics: (node[a].metrics ?? []).map(m => ({...m}))})),
        begin: at.length === 0 ? graph.entries.map(s => ({id: s, label: name(s)})) : [], exits, trail: trail.map(t => ({...t}))};
}

function edgeView(e, node, facts, level, name) {
    const costs = level >= 4, odds = level >= 5;
    const crossings = costs ? (e.crossings ?? []).map(c => ({id: c.id, type: c.type, label: c.label, need: c.need, met: crossingMet(c, facts), irreversible: c.irreversible === true})) : [];
    const lock = e.lock && level >= 2 ? {dial: e.lock.dial, reason: e.lock.reason, throughMet: e.lock.fact === undefined ? false : crossingMet({need: e.lock.need, fact: e.lock.fact}, facts)} : null;
    const locked = !!e.lock && !(e.lock.fact !== undefined && crossingMet({need: e.lock.need, fact: e.lock.fact}, facts));
    const ready = costs && !locked && (e.crossings ?? []).every(c => crossingMet(c, facts));
    return {id: e.id, kind: e.kind, level, to: level >= 2 ? name(e.to) : '???', toId: level >= 2 ? e.to : null, crossings, lock, locked: level >= 2 && locked, ready,
        grants: level >= 3 ? [...(node[e.to].grants ?? [])] : [], locksOthers: costs ? e.locksOthers ?? 'keeps' : null,
        mix: odds && e.mix ? {...e.mix} : null, odds: odds && e.odds ? {...e.odds} : null, outcome: costs ? e.outcome ?? null : null,
        failure: costs && node[e.to].failure ? {...node[e.to].failure} : null, costs: costs ? (e.costs ?? []).map(c => ({...c})) : []};
}

// The marker moves along an edge and the history keeps the trail with a cause (also on a demote). The from node is left unless the edge
// is a mix. A swap, or locksOthers 'locks', also gives up other held nodes of the target's system; 'keeps' (default) and 'dial' leave them.
export function moveAlong(graph, state, edgeId, {cause = '', at: stamp} = {}) {
    const e = graph.edges.find(x => x.id === edgeId), node = Object.fromEntries(graph.nodes.map(n => [n.id, n]));
    check(e && state.at.includes(e.from), `Edge ${edgeId} does not leave a held node.`);
    const sys = node[e.to].system;
    const dropsSystem = e.kind === 'swap' || e.locksOthers === 'locks';
    const keep = n => (n !== e.from || e.kind === 'mix') && !(dropsSystem && sys !== undefined && node[n].system === sys);
    const at = [...state.at.filter(keep), ...(state.at.includes(e.to) ? [] : [e.to])];
    return {at, trail: [...(state.trail ?? []), {from: e.from, to: e.to, edge: e.id, kind: e.kind, cause, ...(stamp === undefined ? {} : {at: stamp})}]};
}

// "What improved since": derived from the trail and from metric changes the host supplies, never stored (AD46). A step along any edge
// except a demote counts at its target node; `metricChanges` is [{node, metric, at, delta}] and counts when delta > 0. Each item
// carries its axis (metric, else node, else 'path') so a digest can group by path, skill, knowledge, stat, gear, standing or wealth.
export function improvements(graph, {trail = [], metricChanges = []} = {}, since = 0) {
    const node = Object.fromEntries(graph.nodes.map(n => [n.id, n]));
    const fromTrail = trail.filter(t => t.kind !== 'demote' && Number.isFinite(t.at) && t.at >= since)
        .map(t => ({axis: node[t.to].axis ?? 'path', id: t.to, label: node[t.to].label, at: t.at, via: t.kind}));
    const fromMetrics = metricChanges.filter(c => node[c.node] && c.delta > 0 && c.at >= since).map(c => {
        const m = (node[c.node].metrics ?? []).find(x => x.id === c.metric);
        check(m, `Unknown metric ${c.node}.${c.metric}.`);
        return {axis: m.axis ?? node[c.node].axis ?? 'path', id: `${c.node}.${c.metric}`, label: node[c.node].label, at: c.at, via: 'metric'};
    });
    return [...fromTrail, ...fromMetrics].sort((a, b) => a.at - b.at);
}
