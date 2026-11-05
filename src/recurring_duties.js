// FD8: save-backed recurring duties on the shared obligations ledger. Owns the namespaced slice 'duties@1'
// ({lastDone: {dutyId: cycle}, missed: {dutyId: count}}); a world supplies defs {id, schedule, debtor, creditor, why, source}.
// Rows are derived, not stored, so the ledger never drifts from the slice. Pure: the host passes the minute.
import {dutyState, lastClosedCycle, validateSchedule} from './world_rhythm.js';
import {createObligations, writeObligation, obligation} from './obligations_ledger.js';
export const DUTIES_FAMILY = 'duties@1';
const nat = n => Number.isInteger(n) && n >= 0;
export const freshDuties = () => ({family: DUTIES_FAMILY, lastDone: {}, missed: {}, closed: {}});
// A save without the slice (or an unreadable one) loads as fresh: older saves keep working, nothing is owed retroactively.
export function migrateDuties(slice) {
    if(!slice || slice.family !== DUTIES_FAMILY) return freshDuties();
    const clean = o => Object.fromEntries(Object.entries(o && typeof o === 'object' ? o : {}).filter(([k, v]) => k && nat(v)));
    return {family: DUTIES_FAMILY, lastDone: clean(slice.lastDone), missed: clean(slice.missed), closed: clean(slice.closed)};
}
export function validateDuties(slice) {
    if(slice?.family !== DUTIES_FAMILY) throw Error('Duties: wrong family.');
    return slice;
}
const find = (defs, id) => defs.find(d => d.id === id) ?? (() => { throw Error(`Unknown duty ${id}.`); })();
// Attend the duty this cycle; throws when its window is not open (the caller's act decides what that costs).
export function attendDuty(slice, defs, id, minute) {
    const d = find(defs, id), s = dutyState(d.schedule, minute, slice.lastDone[id]);
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
// Ledger rows for the owed panel: one duty row per def that is due or has unanswered misses. `since` is the window's opening minute.
export function dutyRows(slice, defs, minute) {
    let ledger = createObligations();
    for(const d of defs) {
        const s = dutyState(d.schedule, minute, slice.lastDone[d.id]), m = slice.missed[d.id] ?? 0;
        if(s.status !== 'due' && s.status !== 'late' && !m) continue;
        const note = m ? ` Missed ${m} time${m === 1 ? '' : 's'}.` : '';
        ledger = writeObligation(ledger, obligation({id: `duty:${d.id}`, kind: 'duty', debtor: d.debtor, creditor: d.creditor, amount: 1,
            why: `${d.why}${s.status === 'late' ? ' The window has shut for this round.' : ''}${note}`, source: d.source, since: s.cycle * d.schedule.period + d.schedule.opens, carries: false}));
    }
    return ledger.rows;
}
// A miss is answered (apologised for, made up) by the world's own act; this clears the count.
export const answerMisses = (slice, id) => ({...slice, missed: {...slice.missed, [id]: 0}});
