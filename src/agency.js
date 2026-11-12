// Agency contract v0 (docs/AGENCY_CONTRACT.md, AGC1-AGC12). How any actor, a
// person, a creature, a Gu or a process, picks a working from what it wants,
// what it knows and what it can bind. Every candidate is quoted through the
// kernel's own quote (KW4) with the actor's knowledge as the reader, which is
// the same call the player's quote makes (PFP11, SPR26). The score is a sum of
// labelled terms, and the two strongest become the cause line (SPR32, PFP13).
// Pure: no world names, no saves, no unseeded draws. Consumers supply wants,
// needs readers and candidates as data.
import {check, natural, object} from './basics.js';
import {quoteWorking} from './kernel_working.js';
import {address, drawFraction} from './gen_kit.js';

export const AGENCY_CONTRACT_VERSION = '0.1';

const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:/-]*$/i.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
const unit = v => Number.isFinite(v) && v >= 0 && v <= 1;
const round = v => Math.round(v * 1e6) / 1e6;

// AGC1, AGC2. An agent is data: weighted wants and three dials.
// thrift weighs a candidate's cost; latitude lets a temperament take a near-best
// option by keyed draw; novelty and pressureAt open invention under pressure (NV4).
export function defineAgent({id: agentId, revision, label, wants, thrift = 0, latitude = 0, novelty = 0, pressureAt = 0}) {
    check(id(agentId) && natural(revision) && typeof label === 'string' && label.length > 0, 'An agent needs an id, a revision and a label.');
    check(object(wants) && Object.keys(wants).length > 0, `${agentId} needs at least one want.`);
    for (const [want, row] of Object.entries(wants)) check(id(want) && object(row) && unit(row.weight), `${agentId} want ${want} needs a weight between 0 and 1.`);
    check(Number.isFinite(thrift) && thrift >= 0 && Number.isFinite(latitude) && latitude >= 0 && unit(novelty) && Number.isFinite(pressureAt),
        `${agentId} has an invalid dial.`);
    return Object.freeze({id: agentId, revision, label, wants: Object.freeze(structuredClone(wants)), thrift, latitude, novelty, pressureAt});
}

// AGC3. The one quote. The player and every other actor call this, so what an
// NPC weighs is what the player would be shown for the same bindings and the
// same knowledge. `knows(ref, at)` returns the thing as this actor believes it.
// Settlement later reads the truth, so a wrong belief shows up as an interrupted
// step with a reason (KW4), never a hidden one.
export function actorQuote(law, method, {id: workingId, bindings, at, knows, authority, facts = {}}) {
    const ports = {};
    if (knows) ports.read = knows;
    if (authority) ports.authority = authority;
    return quoteWorking(law, method, {id: workingId, bindings, at, facts, ports});
}

// AGC4. Needs are live readings, each an urgency 0-1 with the reason the actor
// would give. They come from the actor's body (L), its place (W) and what it
// knows, never from a stored mood meter (MND5).
function checkNeeds(agent, needs) {
    check(object(needs), `${agent.id} needs a reading of its needs.`);
    for (const [want, row] of Object.entries(needs)) {
        check(Object.hasOwn(agent.wants, want), `${agent.id} has no want ${want}.`);
        check(object(row) && unit(row.urgency) && (row.urgency === 0 || typeof row.why === 'string'), `${agent.id} need ${want} needs an urgency and a reason.`);
    }
}

// AGC5. A candidate is data: a working (law, method, bindings) and how its quote
// serves each want. serves(quote) -> {want: gain}, gains -1 to 1 (a risk is a
// negative gain). cost(quote) -> a non-negative number the agent's thrift weighs;
// costWhy(quote) says it in words. bias is the authored priority, kept as one
// more labelled term so priority-only controllers keep their order.
function checkCandidate(c) {
    check(object(c) && id(c.id) && typeof c.label === 'string' && c.law && object(c.method) && object(c.bindings) &&
        typeof c.serves === 'function', 'A candidate needs an id, a label, a working and what it serves.');
}

function scoreCandidate(agent, needs, c, quote) {
    const gains = c.serves(quote) ?? {};
    check(object(gains), `${c.id} must say what it serves.`);
    const terms = [];
    for (const [want, gain] of Object.entries(gains)) {
        check(Object.hasOwn(agent.wants, want) && Number.isFinite(gain) && gain >= -1 && gain <= 1, `${c.id} serves an unknown want or an invalid gain.`);
        const need = needs[want];
        const value = round(agent.wants[want].weight * (need?.urgency ?? 0) * gain);
        if (value) terms.push({want, value, why: gain < 0 && c.riskWhy ? c.riskWhy(quote, want) : need.why});
    }
    const cost = c.cost ? c.cost(quote) : 0;
    check(Number.isFinite(cost) && cost >= 0, `${c.id} has an invalid cost.`);
    if (agent.thrift && cost) terms.push({want: 'cost', value: round(-agent.thrift * cost), why: c.costWhy ? c.costWhy(quote) : 'it costs too much'});
    if (c.bias) terms.push({want: 'habit', value: round(c.bias), why: 'it is the usual work'});
    terms.sort((a, b) => b.value - a.value || (a.want < b.want ? -1 : 1));
    return {score: round(terms.reduce((n, t) => n + t.value, 0)), terms};
}

// The strongest want leads when the chosen working does not serve it: the line
// then says why the working that would have served it dropped out.
function causeLine(agent, needs, row, passed) {
    const strongest = Object.entries(needs).map(([w, n]) => ({w, v: agent.wants[w].weight * n.urgency}))
        .sort((a, b) => b.v - a.v || (a.w < b.w ? -1 : 1))[0];
    const unserved = strongest?.v > 0 && !row.terms.some(t => t.want === strongest.w && t.value > 0) && passed.length;
    const lead = unserved ? [`${needs[strongest.w].why}, but ${passed[0].reason.replace(/\.$/, '').replace(/^[A-Z]/, c => c.toLowerCase())}`] : [];
    const pulls = [...lead, ...row.terms.filter(t => t.value > 0).map(t => t.why)].slice(0, 2);
    const pushes = row.terms.filter(t => t.value < 0).slice(-1).map(t => t.why);
    let line = `${agent.label} ${row.label}`;
    if (pulls.length) line += `: ${pulls.join('; ')}`;
    else if (passed.length) line += `: ${passed[0].reason.replace(/\.$/, '').replace(/^[A-Z]/, c => c.toLowerCase())}`;
    if (pushes.length && pulls.length) line += `, though ${pushes[0]}`;
    return `${line}.`;
}

// AGC6-AGC8. Quote every candidate with the actor's knowledge, drop the ones
// whose quote fails (keeping the reason), score the rest, and pick the best.
// Ties keep candidate order. Under pressure (the strongest want pulls at least
// pressureAt and nothing eligible serves it) an agent with novelty asks
// `invent` for one new candidate;
// it goes through the same quote and score, so generated means runnable (PFP16).
// actor is the instance (a holder id); it defaults to the agent's id, and keys
// quote ids, the latitude draw and invention so two actors sharing one profile
// choose independently. root (optional) keys the latitude draw at
// address(agency.choice, actor, at).
export function chooseWorking({agent, actor = agent.id, needs, candidates, at, knows, authority, facts, root, invent}) {
    check(id(actor), 'Choose for a named actor.');
    check(natural(at) && Array.isArray(candidates), 'Choose at a whole minute from a list of candidates.');
    checkNeeds(agent, needs);
    const seen = new Set();
    const rate = (c, invented = false) => {
        checkCandidate(c);
        check(!seen.has(c.id), `Candidate ${c.id} is listed twice.`);
        seen.add(c.id);
        const quote = actorQuote(c.law, c.method, {id: `${actor}/${c.id}/${at}`, bindings: c.bindings, at, knows, authority, facts});
        if (!quote.ok) return {id: c.id, label: c.label, ok: false, reason: quote.reason, failedStep: quote.failedStep, quote, invented};
        return {id: c.id, label: c.label, ok: true, quote, invented, ...scoreCandidate(agent, needs, c, quote)};
    };
    const scored = candidates.map(c => rate(c));
    let eligible = scored.filter(r => r.ok);
    const best = () => eligible.reduce((a, r) => (!a || r.score > a.score ? r : a), null);
    let top = best(), pressure = null, invented = null;
    // Pressure: the strongest want pulls at least pressureAt and no eligible
    // candidate serves it (no positive term for that want).
    const want = Object.entries(needs).map(([w, n]) => ({w, v: agent.wants[w].weight * n.urgency, why: n.why}))
        .sort((a, b) => b.v - a.v || (a.w < b.w ? -1 : 1))[0];
    const unserved = want && want.v > 0 && want.v >= agent.pressureAt && !eligible.some(r => r.terms.some(t => t.want === want.w && t.value > 0));
    if (agent.novelty > 0 && invent && unserved) {
        pressure = {kind: 'pressure', id: `${actor}:${want.w}`, want: want.w, why: want.why};
        const made = invent({agent, actor, needs, at, cause: pressure, existing: scored.map(r => r.id)});
        if (made) {
            const row = rate(made, true);
            scored.push(row);
            if (row.ok) { invented = row.id; eligible = scored.filter(r => r.ok); top = best(); }
        }
    }
    if (top && agent.latitude > 0 && root !== undefined) {
        const pool = eligible.filter(r => r.score >= top.score - agent.latitude);
        if (pool.length > 1) top = pool[Math.min(pool.length - 1, Math.floor(drawFraction(root, address('agency.choice', actor, at)) * pool.length))];
    }
    const passed = scored.filter(r => !r.ok).map(({id: cid, reason}) => ({id: cid, reason}));
    return {agent: agent.id, actor, at, choice: top?.id ?? null, label: top?.label ?? null, score: top?.score ?? null,
        quote: top?.quote ?? null, cause: top ? {line: causeLine(agent, needs, top, passed), terms: top.terms} : null,
        passed, pressure, invented,
        scored: scored.map(({quote, ...row}) => row)};
}

// AGC9. Banded readings, so a choice changes only when an input crosses a band
// edge. A world substrate law declares the edges as watches, which is what lets
// far places settle an agent's choice in few segments with the same totals as
// minute-by-minute play (PFP12, SPR28, WSC5).
export function bandOf(value, edges) {
    check(Number.isFinite(value) && Array.isArray(edges), 'A band needs a value and its edges.');
    let band = 0;
    for (const edge of edges) if (value >= edge) band++;
    return band;
}
export function bandWatches(holder, quantity, edges) {
    return edges.map(value => ({holder, quantity, op: 'gte', value}));
}

// AGC10. The receipt an actor keeps of its own recent choices, bounded per
// holder (SPR30): newest last, oldest dropped. Reports and inspectors read it.
export const CHOICE_RING = 8;
export function recordChoice(ring, choice) {
    const row = {at: choice.at, chose: choice.choice, cause: choice.cause?.line ?? null, ...(choice.invented ? {invented: choice.invented} : {})};
    return [...(ring ?? []), row].slice(-CHOICE_RING);
}
