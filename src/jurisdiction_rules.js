// World-neutral statutes that differ by jurisdiction (GM23). A statute row is typed by act, the places that enforce it, a penalty, an
// enforcer and the evidence it needs. rulingFor answers one act in one place: the same act gives different rulings in two places.
// Strictness is a per-region dial (default, dial and reason: it changes how much evidence suffices). Pure; no save (AR3, AR12).
import {check, natural, object, deepFreeze} from './basics.js';
const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
export function defineStatutes(rows) {
    check(Array.isArray(rows), 'Invalid statutes.');
    const seen = new Set();
    for(const r of rows) {
        check(object(r) && id(r.id) && !seen.has(r.id) && id(r.act) && Array.isArray(r.places) && r.places.length > 0 && r.places.every(id), `Invalid statute ${r?.id}.`);
        check(object(r.penalty) && typeof r.penalty.kind === 'string' && r.penalty.kind && typeof r.penalty.text === 'string' && (r.penalty.amount === undefined || natural(r.penalty.amount)), `Invalid penalty on ${r.id}.`);
        check(typeof r.enforcer === 'string' && r.enforcer && object(r.evidence) && Array.isArray(r.evidence.needs) && r.evidence.needs.every(x => typeof x === 'string' && x), `Invalid enforcement on ${r.id}.`);
        check((r.exemptions || []).every(e => object(e) && id(e.when) && typeof e.text === 'string' && e.text), `Invalid exemption on ${r.id}.`);
        seen.add(r.id);
    }
    return deepFreeze(structuredClone(rows));
}
/** ctx: {evidence: [kinds in hand], strictness (default 1), flags: [exemption ids that hold]}. */
export function rulingFor(table, act, place, {evidence = [], strictness = 1, flags = []} = {}) {
    const row = table.find(r => r.act === act && r.places.includes(place));
    if(!row) return {act, place, covered: false, lawful: true, penalty: null, enforcer: null, needs: [], why: 'No statute here covers this act.'};
    const exempt = (row.exemptions || []).find(e => flags.includes(e.when));
    if(exempt) return {act, place, covered: true, statute: row.id, lawful: true, penalty: null, enforcer: row.enforcer, needs: [], why: exempt.text};
    // Strictness 2 accepts one item fewer; below 1 asks for one more. Never fewer than one item when the row names any.
    const base = row.evidence.needs, want = base.length ? Math.max(1, base.length - Math.round(strictness - 1)) : 0;
    const have = base.filter(k => evidence.includes(k)), enough = have.length >= want;
    return {act, place, covered: true, statute: row.id, lawful: false, enforcer: row.enforcer, penalty: enough ? {...row.penalty} : null,
        needs: base.filter(k => !evidence.includes(k)), proven: enough,
        why: enough ? `${row.enforcer} can act: ${row.penalty.text}` : `${row.enforcer} lacks proof; it needs ${want} of: ${base.join(', ')}.`};
}
