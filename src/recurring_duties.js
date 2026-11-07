// FD8: save-backed recurring duties on the shared obligations ledger. Owns the namespaced slice 'duties@1'
// ({lastDone: {dutyId: cycle}, missed: {dutyId: count}}); a world supplies defs {id, schedule, debtor, creditor, why, source}.
// Rows are derived, not stored, so the ledger never drifts from the slice. Pure: the host passes the minute.
import {dutyState, lastClosedCycle, validateSchedule} from './world_rhythm.js';
import {createObligations, writeObligation, obligation} from './obligations_ledger.js';
export const DUTIES_FAMILY = 'duties@1';
const nat = n => Number.isInteger(n) && n >= 0;
// policy: the player's standing order per duty id (only a chosen one is stored); late: cycles whose payment a pay_late order has deferred.
export const freshDuties = () => ({family: DUTIES_FAMILY, lastDone: {}, missed: {}, closed: {}, policy: {}, late: {}});
export const POLICIES = Object.freeze(['pay_on_time', 'pay_late', 'skip']);
const POLICY_WORDS = Object.freeze({pay_on_time: 'pay on time', pay_late: 'pay a week late', skip: 'skip it'});
// A save without the slice (or an unreadable one) loads as fresh: older saves keep working, nothing is owed retroactively.
export function migrateDuties(slice) {
    if(!slice || slice.family !== DUTIES_FAMILY) return freshDuties();
    const clean = o => Object.fromEntries(Object.entries(o && typeof o === 'object' ? o : {}).filter(([k, v]) => k && nat(v)));
    const policy = Object.fromEntries(Object.entries(slice.policy && typeof slice.policy === 'object' ? slice.policy : {}).filter(([k, v]) => k && POLICIES.includes(v)));
    return {family: DUTIES_FAMILY, lastDone: clean(slice.lastDone), missed: clean(slice.missed), closed: clean(slice.closed), policy, late: clean(slice.late)};
}
export function validateDuties(slice) {
    if(slice?.family !== DUTIES_FAMILY) throw Error('Duties: wrong family.');
    return slice;
}
const find = (defs, id) => defs.find(d => d.id === id) ?? (() => { throw Error(`Unknown duty ${id}.`); })();
// Attend the duty this cycle; throws when its window is not open (the caller's act decides what that costs).
export function attendDuty(slice, defs, id, minute) {
    const d = find(defs, id);
    if(d.dues) throw Error('That is paid by your standing order, not by hand.');
    const s = dutyState(d.schedule, minute, slice.lastDone[id]);
    if(!s.open) throw Error(s.reason || 'Not open.');
    return {...slice, lastDone: {...slice.lastDone, [id]: s.cycle}};
}
// Count cycles whose window shut unattended, once each: `closed` is the first cycle not yet accounted. Returns {slice, newMisses:{id:n}}.
export function settleMisses(slice, defs, minute) {
    const missed = {...slice.missed}, closed = {...slice.closed}, newMisses = {};
    for(const d of defs) {
        validateSchedule(d.schedule);
        const upTo = lastClosedCycle(d.schedule, minute), from = closed[d.id] ?? upTo + 1;
        if(upTo < from) { closed[d.id] = from; continue; }
        const attended = slice.lastDone[d.id] != null && slice.lastDone[d.id] >= from && slice.lastDone[d.id] <= upTo ? 1 : 0;
        const n = upTo - from + 1 - attended;
        if(n > 0) { missed[d.id] = (missed[d.id] ?? 0) + n; newMisses[d.id] = n; }
        closed[d.id] = upTo + 1;
    }
    return {slice: {...slice, missed, closed}, newMisses};
}
// A duty set that is inactive (holidays, before the life is at school) owes nothing for that stretch: close its cycles without counting,
// so they are not charged as misses when the set becomes active again. Only a def already tracked (`closed` set) moves.
export function skipInactive(slice, defs, minute) {
    const closed = {...slice.closed};
    let moved = false;
    for(const d of defs) {
        if(closed[d.id] == null) continue;
        validateSchedule(d.schedule);
        const next = lastClosedCycle(d.schedule, minute) + 1;
        if(next > closed[d.id]) { closed[d.id] = next; moved = true; }
    }
    return moved ? {...slice, closed} : slice;
}
// ---- Dues with a standing order (OB1/OB2/OB4). A def may carry `policy` {default, allowed?, reason} and `dues` {amount (pence), basis,
// payer text, lateCycles (dial), steps:[{atMisses, kind, line}] (dial)}. Defs without `dues` never reach this path (settleMisses is untouched).
export const policyOf = (slice, d) => {
    const p = slice.policy?.[d.id], allowed = d.policy?.allowed ?? POLICIES;
    return POLICIES.includes(p) && allowed.includes(p) ? p : d.policy?.default ?? 'pay_on_time';
};
export function setPolicy(slice, defs, id, value) {
    const d = find(defs, id);
    if(!d.policy) throw Error('That duty has no standing order.');
    if(!POLICIES.includes(value) || !(d.policy.allowed ?? POLICIES).includes(value)) throw Error('That is not a choice for this duty.');
    return {...slice, policy: {...slice.policy, [id]: value}};
}
// Escalation is state: the highest step whose miss count has been reached. No draw, no clock; grace is the steps' own thresholds.
export const escalationOf = (d, missed) => (d.dues?.steps ?? []).filter(s => missed >= s.atMisses).at(-1) ?? null;
// Close every unaccounted cycle of each dues def, once. `balance` is what the purse holds; payments are totalled so the host debits once,
// atomically (the caller commits the returned slice only when that debit lands). Returns {slice, total, paid:[{id,cycle,amount}], newMisses}.
export function settleDues(slice, defs, minute, balance) {
    const missed = {...slice.missed}, closed = {...slice.closed}, late = {...slice.late}, newMisses = {}, paid = [];
    let bal = balance, total = 0;
    for(const d of defs) {
        if(!d.dues) continue;
        validateSchedule(d.schedule);
        const upTo = lastClosedCycle(d.schedule, minute), from = closed[d.id] ?? upTo + 1, amt = d.dues.amount, grace = d.dues.lateCycles ?? 1;
        if(upTo < from) { closed[d.id] = from; continue; }
        const miss = () => { missed[d.id] = (missed[d.id] ?? 0) + 1; newMisses[d.id] = (newMisses[d.id] ?? 0) + 1; };
        const take = c => { if(!(bal >= amt)) return false; bal -= amt; total += amt; paid.push({id: d.id, cycle: c, amount: amt}); return true; };
        // Paying a cycle also clears one old miss when the purse can carry it: back rent first, a forgiving landlady (ECR21).
        const settle = c => { if(!take(c)) { miss(); return; } if((missed[d.id] ?? 0) > 0 && take(c)) missed[d.id]--; };
        for(let c = from; c <= upTo; c++) {
            if(slice.lastDone[d.id] === c) continue;
            const pol = policyOf(slice, d);
            if(pol === 'pay_late') {
                if((late[d.id] ?? 0) >= grace) { settle(c); late[d.id]--; }
                late[d.id] = (late[d.id] ?? 0) + 1;
                continue;
            }
            while((late[d.id] ?? 0) > 0) { if(pol === 'skip') miss(); else settle(c); late[d.id]--; }
            if(pol === 'skip') miss(); else settle(c);
        }
        closed[d.id] = upTo + 1;
    }
    return {slice: {...slice, missed, closed, late}, total, paid, newMisses};
}
// Ledger rows for the owed panel: one duty row per def that is due or has unanswered misses. `since` is the window's opening minute.
export function dutyRows(slice, defs, minute) {
    let ledger = createObligations();
    for(const d of defs) {
        const s = dutyState(d.schedule, minute, slice.lastDone[d.id]), m = slice.missed[d.id] ?? 0;
        if(s.status !== 'due' && s.status !== 'late' && !m) continue;
        const esc = escalationOf(d, m), standing = d.dues ? ` Standing order: ${POLICY_WORDS[policyOf(slice, d)]}.` : '';
        const note = `${standing}${m ? ` Missed ${m} time${m === 1 ? '' : 's'}.` : ''}${esc ? ` ${esc.line}` : ''}`;
        ledger = writeObligation(ledger, obligation({id: `duty:${d.id}`, kind: 'duty', debtor: d.debtor, creditor: d.creditor, amount: 1,
            why: `${d.why}${s.status === 'late' ? ' The window has shut for this round.' : ''}${note}`, source: d.source, since: s.cycle * d.schedule.period + d.schedule.opens, carries: false}));
    }
    return ledger.rows;
}
// A miss is answered (apologised for, made up) by the world's own act; this clears the count.
export const policyWords = id => POLICY_WORDS[id];
export const answerMisses = (slice, id) => ({...slice, missed: {...slice.missed, [id]: 0}});
