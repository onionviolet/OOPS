// Requirement read model for a path's ladder (book UI wave Round 13, R1-R5). Pure and world-neutral: it names no world, pathway or
// system, holds no state and saves nothing (AR3, AR12, LSD440). Each edge's crossings (ascension_paths.js types) are mapped to seven
// requirement families; an authored `defs` table adds what the crossing types cannot say (a scarce token, a condition, the ways a
// requirement can be met, what a shortfall costs). Facts, knowledge and the actions the character knows come in from the owners.
//
//   graph      defineGraph() result (ladderToGraph() for a ladder)
//   held       node ids the character holds now
//   facts      {factKey: boolean|number}, the owners' facts that crossings and locks name
//   knowledge  {id: 0..5} for nodes and edges (ascension_graph KNOWLEDGE); default the row's own, else 5
//   actions    {actionId: {label, eligible, reason?, minutes?}} the actions the character can see now (their owners' views).
//              A route whose action is absent is not one the character knows of, and is not listed.
//   defs       {byCrossing: {crossingId: {family?, provenance?, level?, routes?, short?}}, extras: {edgeId: [requirement]}}
//
// Knownness per line (one mapping, tested): level 0 hidden; 1 'unknown' (a requirement exists, nothing more); 2-3 'partial' (2: only its
// family; 3: its name; no amounts or ways); 4-5 'known' (amounts, ways, what a shortfall does). Level 5 also shows odds the edge carries.
import {crossingMet} from './ascension_paths.js';
import {KNOWLEDGE} from './ascension_graph.js';

export const FAMILIES = Object.freeze(['method', 'materials', 'readiness', 'procedure', 'token', 'standing', 'condition']);
export const FAMILY_WORD = Object.freeze({method: 'Method', materials: 'Materials', readiness: 'Readiness', procedure: 'Procedure', token: 'Scarce token', standing: 'Standing', condition: 'Condition'});
// Existing crossing types onto the families. A token and a condition have no crossing type: a def's `family` or an extra names them.
export const CROSSING_FAMILY = Object.freeze({insight: 'method', ingest: 'materials', consume: 'materials', quota: 'readiness', digest: 'readiness', bodyPoint: 'readiness', trial: 'procedure', structure: 'procedure', recognition: 'standing'});
export const PROVENANCE = Object.freeze(['canon', 'canon-derived', 'fill', 'emergent']);
export const ROUTE_KINDS = Object.freeze(['study', 'divination', 'teacher', 'purchase', 'theft', 'inference', 'gather', 'hunt', 'craft', 'trade', 'allotment', 'practice', 'time', 'prepare', 'inherit', 'grant', 'win', 'take', 'service', 'reputation', 'exam', 'rest', 'cure', 'move']);

const knownness = level => level >= 4 ? 'known' : level >= 2 ? 'partial' : 'unknown';
const isNum = v => Number.isFinite(v);
const lineLevel = (edgeLevel, def) => Math.min(edgeLevel, def?.level ?? 5);

function lineOf(base, edgeLevel, def, actions) {
    const level = lineLevel(edgeLevel, def), kind = knownness(level);
    const family = def?.family ?? base.family;
    const out = {id: base.id, family, familyWord: FAMILY_WORD[family], level, knownness: kind, provenance: def?.provenance ?? 'fill', met: base.met, irreversible: base.irreversible === true};
    if (kind === 'unknown') return {...out, label: 'A requirement you do not know yet', met: null, routes: [], ifShort: null, need: null, have: null};
    // Level 2 knows only that a requirement of this family exists; level 3 knows what it is called; neither knows amounts or ways.
    out.label = level === 2 ? `A ${FAMILY_WORD[family].toLowerCase()} requirement; its terms are not known yet` : base.label;
    if (kind === 'partial') return {...out, met: null, routes: [], ifShort: null, need: null, have: null};
    const counted = isNum(base.need);
    return {...out, need: counted ? base.need : true, have: counted ? base.have : base.met,
        routes: (def?.routes ?? []).filter(r => actions?.[r.action]).map(r => {
            const a = actions[r.action];
            return {kind: r.kind, label: r.label ?? a.label, action: r.action, available: a.eligible === true, reason: a.eligible === true ? null : a.reason ?? null, minutes: isNum(a.minutes) ? a.minutes : null};
        }),
        ifShort: def?.short ? {...def.short} : null};
}

function edgeLines(graph, edge, level, facts, defs, actions) {
    const byC = defs?.byCrossing ?? {};
    const lines = (edge.crossings ?? []).map(c => lineOf({id: c.id, family: CROSSING_FAMILY[c.type], label: c.label, need: c.need,
        have: c.need === true ? facts[c.fact] === true : isNum(facts[c.fact]) ? facts[c.fact] : 0, met: crossingMet(c, facts), irreversible: c.irreversible}, level, byC[c.id], actions));
    for (const x of defs?.extras?.[edge.id] ?? []) {
        const met = crossingMet({need: x.need ?? true, fact: x.fact}, facts);
        lines.push(lineOf({id: x.id, family: x.family, label: x.label, need: x.need ?? true, have: x.need === undefined || x.need === true ? met : isNum(facts[x.fact]) ? facts[x.fact] : 0, met}, Math.min(level, x.level ?? 5), x, actions));
    }
    // A lock is a condition with a reason and, when the world gives one, a way through (a fact that opens it).
    if (edge.lock && level >= 2) {
        const through = edge.lock.fact !== undefined && crossingMet({need: edge.lock.need, fact: edge.lock.fact}, facts);
        lines.push(lineOf({id: `${edge.id}.lock`, family: 'condition', label: edge.lock.reason, need: true, met: through}, level, {provenance: defs?.byCrossing?.[`${edge.id}.lock`]?.provenance}, actions));
    }
    return lines;
}

/** The ordered next steps (R4): unmet known requirements, blocking first, each with the route the character can use now, else one it knows. */
function stepsOf(lines) {
    return lines.filter(l => l.knownness === 'known' && l.met === false).map(l => {
        const now = l.routes.find(r => r.available), route = now ?? l.routes[0] ?? null;
        return {requirement: l.id, family: l.family, label: l.label, route, text: route
            ? `${l.label}: ${route.label}${route.available ? '' : route.reason ? ` (${route.reason})` : ' (not available now)'}`
            : `${l.label}: no way to meet this is known yet`,
            quote: route?.minutes != null ? {minutes: route.minutes} : null};
    });
}

/**
 * Builds the card's ladder. `order` is the rung order from the entry (a ladder graph: follow the advance edges from the first entry);
 * rungs the character has crossed show no requirements, the rung ahead shows them at the knowledge the character has, and rungs
 * further ahead show at most that they exist (level capped at 'partial') unless knowledge says more.
 */
export function requirementLadder(graph, {held = [], facts = {}, knowledge = {}, actions = {}, defs = {}} = {}) {
    const node = Object.fromEntries(graph.nodes.map(n => [n.id, n]));
    const chain = [graph.entries[0]];
    while (true) {
        const e = graph.edges.find(x => x.kind === 'advance' && x.from === chain[chain.length - 1] && !chain.includes(x.to));
        if (!e) break;
        chain.push(e.to);
    }
    const heldAt = chain.reduce((top, id, i) => held.includes(id) ? i : top, -1);
    const nodeLevel = id => held.includes(id) ? 5 : knowledge[id] ?? node[id].knowledge ?? 5;
    const rungs = chain.map((id, i) => {
        const n = node[id], state = i <= heldAt ? (i === heldAt ? 'held' : 'crossed') : i === heldAt + 1 ? 'next' : 'ahead';
        const rung = {id, label: nodeLevel(id) >= 2 ? n.label : '???', state, level: nodeLevel(id), grants: nodeLevel(id) >= 3 ? [...(n.grants ?? [])] : [], requirements: [], ifShort: null, blocked: null};
        const edge = graph.edges.find(e => e.kind === 'advance' && e.to === id && e.from === chain[i - 1]);
        if (!edge || state === 'held' || state === 'crossed') return rung;
        const explicit = knowledge[edge.id] ?? edge.knowledge;
        const level = Math.min(state === 'next' ? explicit ?? 5 : explicit ?? 2, nodeLevel(id), 3 + (state === 'next' ? 2 : 0));
        if (level < 1 || nodeLevel(id) < 2) return rung;
        // A rung past the next one that the character knows only by name lists one locked line, not the shape of what it needs.
        rung.requirements = state === 'ahead' && level < 3 ? [{id: `${edge.id}.hidden`, family: 'condition', familyWord: FAMILY_WORD.condition, level: 1, knownness: 'unknown', provenance: 'fill', met: null, irreversible: false,
            label: 'What this rung needs is not known yet', routes: [], ifShort: null, need: null, have: null}] : edgeLines(graph, edge, level, facts, defs, actions);
        if (level >= 4 && n.failure) rung.ifShort = {...n.failure};
        const lock = edge.lock && level >= 2 ? rung.requirements.find(r => r.id === `${edge.id}.lock`) : null;
        rung.blocked = lock && lock.met === false ? lock.label : null;
        rung.ready = state === 'next' && level >= 4 && rung.requirements.length > 0 && rung.requirements.every(r => r.met === true);
        return rung;
    });
    const next = rungs.find(r => r.state === 'next');
    return {path: graph.id, label: graph.label, held: heldAt >= 0 ? rungs[heldAt].label : null, rungs, nextSteps: next ? stepsOf(next.requirements) : [],
        knowledgeLevels: KNOWLEDGE};
}

/** The facts a view already holds, keyed by the fact names the next rung's crossings use: lets a host with a pathView hand over its numbers without a second fact table. */
export function factsFromView(path, view) {
    const next = path.stages[view.position + 1], facts = {};
    for (const c of next?.crossings ?? []) { const v = view.crossings.find(x => x.id === c.id); if (v) facts[c.fact] = c.need === true ? v.met : v.have; }
    return facts;
}
