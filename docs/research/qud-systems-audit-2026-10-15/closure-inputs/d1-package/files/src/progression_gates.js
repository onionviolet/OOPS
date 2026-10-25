// Shared progression gate descriptors (GTR1–GTR20, proposal 2026-10-23).
// A gate is data over rules.js: what it reads, its dial, in-world reason and the
// costed routes around it. Evaluation is a pure read; opening stays with the
// caller's staged transaction (native_unlock_transaction, process_rewards).
import {evaluateRule} from './rules.js';

export const GATE_KINDS = Object.freeze(['capacity', 'knowledge', 'credential', 'resource', 'maturation',
    'world state', 'social', 'law', 'presentation']);
export const GATE_CLOSES = Object.freeze(['persist', 'revocable']);
export const OVERFLOW_POLICIES = Object.freeze(['lost', 'banked', 'converted', 'spill', 'pressure']);
export const VAGUE_HINT = 'Something is still missing.';

const text = v => typeof v === 'string' && v.length > 0;
const object = v => v && typeof v === 'object' && !Array.isArray(v);
function fail(id, message) { throw new Error(`Gate ${id || '?'}: ${message}`); }

// Negated leaves are wrapped so a missing-condition check reads them inverted.
function leaves(rule, out = [], negated = false) {
    if (rule.all || rule.any) for (const child of rule.all || rule.any) leaves(child, out, negated);
    else if (rule.not) leaves(rule.not, out, !negated);
    else out.push(negated ? {not: rule, fact: rule.fact, hint: rule.hint} : rule);
    return out;
}
// Leaf values may name a dial ({dial: 'count'}); everything else passes through.
function resolveDials(rule, dials) {
    if (rule.all || rule.any) return {...rule, [rule.all ? 'all' : 'any']: (rule.all || rule.any).map(r => resolveDials(r, dials))};
    if (rule.not) return {...rule, not: resolveDials(rule.not, dials)};
    if (!object(rule.value)) return rule;
    if (!Object.hasOwn(dials, rule.value.dial)) throw new Error(`Unknown dial ${rule.value.dial}.`);
    return {...rule, value: dials[rule.value.dial]};
}

// GTR1/GTR4: every gate states its reason and at least one costed route around it.
export function defineGate(d) {
    if (!object(d) || !text(d.id)) fail(d?.id, 'needs an id.');
    if (!GATE_KINDS.includes(d.kind)) fail(d.id, `kind must be one of ${GATE_KINDS.join(', ')}.`);
    if (!object(d.requires)) fail(d.id, 'needs a requires rule.');
    if (!text(d.reason)) fail(d.id, 'needs an in-world reason.');
    if (!Array.isArray(d.routes) || !d.routes.length || !d.routes.every(r => text(r?.id) && text(r.reason) && text(r.cost)))
        fail(d.id, 'needs at least one route with id, reason and cost.');
    if (!GATE_CLOSES.includes(d.closes ?? 'persist')) fail(d.id, 'closes must be persist or revocable.');
    if (d.closes === 'revocable' && !text(d.closeReason)) fail(d.id, 'a revocable gate states what closes it.');
    if (d.overflow !== undefined && !(object(d.overflow) && OVERFLOW_POLICIES.includes(d.overflow.policy) && text(d.overflow.reason)))
        fail(d.id, 'overflow needs a policy and reason.');
    const dials = {};
    for (const [name, dial] of Object.entries(d.dials || {})) {
        if (!object(dial) || !Number.isFinite(dial.default)) fail(d.id, `dial ${name} needs a finite default.`);
        dials[name] = dial.default;
    }
    resolveDials(d.requires, dials); // Throws on unknown dials before any caller sees the gate.
    for (const leaf of leaves(d.requires)) if (leaf.hint !== undefined && !text(leaf.hint)) fail(d.id, 'hint must be text.');
    return Object.freeze(structuredClone({...d, closes: d.closes ?? 'persist'}));
}

// GTR9/GTR14: pure read over caller-owned facts. GTR10: author reasons stay
// author-only; the player view names a missing condition only when the caller
// says the character knows that fact, otherwise one vague line.
export function evaluateGate(gate, facts, {dials = {}, knows = () => false} = {}) {
    const values = Object.fromEntries(Object.entries(gate.dials || {}).map(([k, v]) => [k, dials[k] ?? v.default]));
    const rule = resolveDials(gate.requires, values);
    const result = evaluateRule(rule, facts);
    let shown = [];
    if (!result.met) {
        const missing = leaves(rule).filter(leaf => !evaluateRule(leaf, facts).met);
        shown = missing.filter(leaf => leaf.hint && knows(leaf.fact)).map(leaf => leaf.hint);
        if (shown.length < missing.length) shown.push(VAGUE_HINT);
        shown = [...new Set(shown)];
    }
    return {id: gate.id, kind: gate.kind, met: result.met, known: result.known, dials: values,
        authorReasons: result.reasons, shown};
}
