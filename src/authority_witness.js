// F2 (LARGER_FOUNDATIONS): a witness is a knownness reader over known-target facts whose observer belongs to an authority. World-neutral; no state, no save key.
// It adds no seen-by set: observers already write what they saw into simulation.knowledge[observer] (known_target_facts.js), and an informer or a wanted
// notice is a later transfer between two authorities' readers, not new state. ACR9: the row says what the observer believes, never the true fact.
//  registerWitnessBelonging(authorityId, fn) -> fn(state, observerId) -> null | {weight, label?, reason}
//    weight   how far this observer's word reaches the authority (a constable 1, a clerk who files reports 2); > 0, or the observer is not counted.
//    reason   why the word reaches it (required; the dial is {weight, reason}, as in the society sheet).
//    Belonging is derived from data the world already owns: a person record with an institution, faction or post, or a position row. None is wired today.
//  Each observer adds one row (`witness:<observer>`), dated by the latest observation he recorded; the authority's half-life fades it.
import {registerKnownness, identityOf} from './authority.js';
import {knownTargetFacts} from './known_target_facts.js';

const DAY = 24 * 60, text = v => typeof v === 'string' && v.trim() !== '';
const belongings = new Map();
const believed = v => ['string', 'number', 'boolean'].includes(typeof v) ? String(v) : '';
function witnessRows(authorityId, state, ctx) {
    const identity = identityOf(ctx), rows = [];
    for(const observer of Object.keys(state?.simulation?.knowledge ?? {})) {
        if(observer === identity) continue; // your own sight of yourself is not a witness
        let b = null; for(const read of belongings.get(authorityId) ?? []) { try { b = read(state, observer); } catch { b = null; } if(b) break; }
        if(!(b && Number.isFinite(b.weight) && b.weight > 0 && text(b.reason))) continue; // no belonging, no word that reaches this authority
        const facts = Object.entries(knownTargetFacts(state, observer, identity));
        if(!facts.length) continue;
        const latest = facts.reduce((m, [, f]) => Number.isFinite(f.at) ? Math.max(m, f.at) : m, -Infinity);
        const [, last] = facts.filter(([, f]) => !Number.isFinite(latest) || f.at === latest).pop(), said = believed(last.value);
        const who = text(b.label) ? b.label : observer;
        rows.push({id: `witness:${observer}`, weight: b.weight, ...(Number.isFinite(latest) ? {at: Math.floor(latest / DAY)} : {}),
            text: said ? `${who} saw you and noted: ${said}.` : `${who} saw you.`});
    }
    return rows;
}
export function registerWitnessBelonging(authorityId, fn) {
    if(!text(authorityId) || typeof fn !== 'function') throw Error('A witness belonging needs an authority id and a reader.');
    if(!belongings.has(authorityId)) { belongings.set(authorityId, []); registerKnownness(authorityId, (state, ctx) => witnessRows(authorityId, state, ctx)); }
    belongings.get(authorityId).push(fn);
}
