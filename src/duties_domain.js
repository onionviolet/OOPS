// FD8: recurring duties as a saved shared domain. Owns the optional top-level key `duties` (slice `duties@1`, see
// recurring_duties.js and SAVES 6e). Imports no world (AR3/AR4): a world registers a duty set through registerDutySet and
// supplies its own reader for "is this life enrolled" and "what minute is it". Absent or foreign slice loads fresh.
import {registerDomain} from './domain_registry.js';
import {freshDuties, migrateDuties, validateDuties, attendDuty, settleMisses, dutyRows, answerMisses, DUTIES_FAMILY} from './recurring_duties.js';
import {dutyState} from './world_rhythm.js';
const sets = new Map();
let slice = freshDuties();
// set = {defs, state?: () => any, active: (state) => boolean, minute: (state) => number}
export function registerDutySet(id, set) {
    if(typeof id !== 'string' || !id || !Array.isArray(set?.defs) || typeof set.active !== 'function' || typeof set.minute !== 'function') throw Error('Invalid duty set.');
    sets.set(id, Object.freeze({...set, defs: Object.freeze([...set.defs])}));
}
// Active sets with their current minute; a set whose reader throws is skipped, never a reason to stop the clock.
function live() {
    const out = [];
    for(const set of sets.values()) {
        try { const st = set.state?.(); if(set.active(st)) out.push({defs: set.defs, minute: set.minute(st)}); } catch { /* world not ready */ }
    }
    return out;
}
const empty = s => !Object.keys(s.lastDone).length && !Object.keys(s.missed).length && !Object.keys(s.closed).length;
function tick() {
    for(const {defs, minute} of live()) if(Number.isInteger(minute) && minute >= 0) slice = settleMisses(slice, defs, minute).slice;
}
function attend({dutyId} = {}) {
    for(const {defs, minute} of live()) {
        if(!defs.some(d => d.id === dutyId)) continue;
        slice = settleMisses(slice, defs, minute).slice;
        slice = answerMisses(attendDuty(slice, defs, dutyId, minute), dutyId); // throws the duty's own reason when the window is shut
        return project();
    }
    throw Error('That duty is not yours to keep right now.');
}
// rows are the shared-ledger rows; items add what the panel needs (open, minutes left, missed) per def, in words-ready form.
function project() {
    const sets = live(), rows = [], items = [];
    for(const {defs, minute} of sets) {
        rows.push(...dutyRows(slice, defs, minute));
        for(const d of defs) {
            const s = dutyState(d.schedule, minute, slice.lastDone[d.id]), missed = slice.missed[d.id] ?? 0;
            if(s.status === 'due' || s.status === 'late' || missed) items.push({id: d.id, why: d.why, open: s.open, status: s.status, shutsIn: s.remaining, reason: s.open ? '' : s.reason, missed});
        }
    }
    return {rows, items, enrolled: sets.length > 0};
}
registerDomain({id: 'duties', deps: [], initialState: freshDuties,
    save: () => empty(slice) ? undefined : structuredClone(slice), // an untouched life writes no key: older saves stay byte-identical
    validate: s => { if(s != null && s.family === DUTIES_FAMILY) validateDuties(s); },
    migrate: migrateDuties,
    load: s => { slice = migrateDuties(s); },
    tick, projection: project, commands: {attend}});
