// Oaths that enforce themselves (LR13; docs/KERNEL_WORKING_CONTRACT.md
// KW36-KW39). The Harry Potter Unbreakable Vow is the first canon case: a
// sworn term, and a price for breaking it that can be the vower's life. An
// oath is data. It is read as authority at settlement, so a step that breaks
// it settles with the oath's consequence attached (or, where a world's oath
// prevents rather than punishes, is refused). A sworn duty left undone is
// found at its deadline. The oath's state is derived from receipts; nothing
// here writes a save or kills anyone: the host publishes the effects.
// Names no world; imports only basics.
import {check, natural, object} from './basics.js';

export const OATH_SCHEMA = 'kernel.oath@1';
const id = value => typeof value === 'string' && /^[a-z][a-z0-9_.:/-]*$/i.test(value);

// A term matches a settling step by method id, operation and who fills which
// role: {method?, op?, roles?: {role: thingId}}. Every given field must match.
const methodId = method => typeof method === 'string' ? method : method?.id;
const matches = (match, step) => (match.method === undefined || match.method === methodId(step.method)) &&
    (match.op === undefined || match.op === step.op) &&
    Object.entries(match.roles ?? {}).every(([role, thingId]) => step.bindings?.[role]?.id === thingId);

// KW36. defineOath({id, vower, parties, terms, penalty, enforce, madeAt}).
// terms: [{id, kind: 'forbid', match}] or [{id, kind: 'require', match, by}]
// (by: the minute a sworn act must have settled). penalty: {effects, costs,
// cause}, applied once, the first time a term breaks. enforce: 'penalize'
// (the step happens and the price is paid, the canon Vow) or 'prevent' (a
// world whose oath stops the act; a dial, not a default).
export function defineOath({id: oathId, vower, parties = [], terms, penalty, enforce = 'penalize', madeAt}) {
    check(id(oathId) && id(vower) && Array.isArray(parties) && parties.every(id), 'An oath needs an id, a vower and parties.');
    check(Array.isArray(terms) && terms.length > 0 && natural(madeAt), 'An oath needs terms and the minute it was made.');
    for (const term of terms) {
        check(object(term) && id(term.id) && object(term.match) && ['forbid', 'require'].includes(term.kind),
            'Each term forbids or requires a matching act.');
        check(term.kind === 'forbid' || (natural(term.by) && term.by >= madeAt), 'A required act needs a deadline.');
    }
    check(object(penalty) && Array.isArray(penalty.effects) && (penalty.costs === undefined || Array.isArray(penalty.costs)) &&
        typeof penalty.cause === 'string' && penalty.cause.length > 0, 'An oath needs its price.');
    check(['penalize', 'prevent'].includes(enforce), 'An oath penalizes or prevents.');
    return Object.freeze({schema: OATH_SCHEMA, id: oathId, vower, parties: [...parties], terms: structuredClone(terms),
        penalty: structuredClone(penalty), enforce, madeAt});
}

// KW38. An oath is broken once a receipt carries its breach, or a sworn act
// came due undone (a row from dueOathBreaches the host published). Derived
// from those records, never stored as a flag.
export const oathBroken = (oath, receipts = [], breaches = []) =>
    receipts.some(row => row.truth?.breach?.oath === oath.id) || breaches.some(row => row.oath === oath.id);

// KW37. The authority port for a set of oaths, layered over another authority.
// A step that a forbid term matches, at or after the oath was made and while
// the oath holds, carries the price. `brokenBefore(oath, at)` lets the host say
// which oaths a past receipt already broke (the price is paid once).
export function oathAuthority(oaths, {inner, brokenBefore = () => false} = {}) {
    check(Array.isArray(oaths) && oaths.every(oath => oath?.schema === OATH_SCHEMA), 'Give oaths made with defineOath.');
    return request => {
        const base = inner ? inner(request) : {ok: true};
        if (!base.ok) return base;
        for (const oath of oaths) {
            if (request.at < oath.madeAt || brokenBefore(oath, request.at)) continue;
            const term = oath.terms.find(row => row.kind === 'forbid' && matches(row.match, request));
            if (!term) continue;
            const breach = {oath: oath.id, term: term.id, vower: oath.vower};
            const price = {costs: structuredClone(oath.penalty.costs ?? []), cause: oath.penalty.cause, breach};
            return oath.enforce === 'prevent'
                ? {ok: false, reason: 'oath-forbids', ...price}
                : {...base, ok: true, effects: [...(base.effects ?? []), ...structuredClone(oath.penalty.effects)], ...price};
        }
        return base;
    };
}

// KW39. A sworn act left undone breaks the oath at its deadline. receipts are
// the settled receipts of the vower's workings, each with its working's method
// id (or {id, revision}) and bindings ({method, bindings, ...receipt}). Returns the price rows due
// by `now`, each at the deadline, so one jump and many give the same answer.
export function dueOathBreaches(oaths, {now, receipts, breaches = []}) {
    check(natural(now) && Array.isArray(receipts), 'Check oaths at a whole minute against receipts.');
    const out = [];
    for (const oath of oaths) {
        if (oathBroken(oath, receipts, breaches)) continue;
        const due = oath.terms.filter(term => term.kind === 'require' && term.by <= now)
            .filter(term => !receipts.some(row => row.ok && row.at >= oath.madeAt && row.at <= term.by && matches(term.match, row)))
            .sort((a, b) => a.by - b.by || (a.id < b.id ? -1 : 1));
        if (!due.length) continue;
        const term = due[0];
        out.push({oath: oath.id, term: term.id, vower: oath.vower, at: term.by, cause: oath.penalty.cause,
            costs: structuredClone(oath.penalty.costs ?? []), effects: structuredClone(oath.penalty.effects)});
    }
    return out.sort((a, b) => a.at - b.at || (a.oath < b.oath ? -1 : 1));
}
