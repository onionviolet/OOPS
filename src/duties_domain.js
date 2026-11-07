// FD8: recurring duties as a saved shared domain. Owns the optional top-level key `duties` (slice `duties@1`, see
// recurring_duties.js and SAVES 6e). Imports no world (AR3/AR4): a world registers a duty set through registerDutySet and
// supplies its own reader for "is this life enrolled" and "what minute is it". Absent or foreign slice loads fresh.
import {registerDomain} from './domain_registry.js';
import {freshDuties, migrateDuties, validateDuties, attendDuty, settleMisses, settleDues, dutyRows, answerMisses, setPolicy, policyOf, escalationOf, policyWords, DUTIES_FAMILY} from './recurring_duties.js';
import {dutyState} from './world_rhythm.js';
const sets = new Map();
let slice = freshDuties();
// set = {defs, state?: () => any, active: (state) => boolean, minute: (state) => number,
//        purse?: {balance: (state) => number, pay: (amount, paid, state) => void}}  (purse is needed only by defs with `dues`; pay throws when it cannot)
export function registerDutySet(id, set) {
    if(typeof id !== 'string' || !id || !Array.isArray(set?.defs) || typeof set.active !== 'function' || typeof set.minute !== 'function') throw Error('Invalid duty set.');
    sets.set(id, Object.freeze({...set, defs: Object.freeze([...set.defs])}));
}
// Active sets with their current minute; a set whose reader throws is skipped, never a reason to stop the clock.
function live() {
    const out = [];
    for(const set of sets.values()) {
        try { const st = set.state?.(); if(set.active(st)) out.push({defs: set.defs, minute: set.minute(st), purse: set.purse, st}); } catch { /* world not ready */ }
    }
    return out;
}
const empty = s => !Object.keys(s.lastDone).length && !Object.keys(s.missed).length && !Object.keys(s.closed).length && !Object.keys(s.policy).length && !Object.keys(s.late).length;
function tick() {
    for(const {defs, minute, purse, st} of live()) {
        if(!(Number.isInteger(minute) && minute >= 0)) continue;
        slice = settleMisses(slice, defs.filter(d => !d.dues), minute).slice;
        const dues = defs.filter(d => d.dues);
        if(!dues.length || !purse) continue;
        // OB4: the standing order runs on the clock, no click. Commit the new slice before the debit so the one save the debit makes
        // carries both; if the host cannot take the coins now (read-only tab, not ready) roll back and settle on a later tick.
        const before = slice;
        try {
            const r = settleDues(slice, dues, minute, purse.balance(st));
            slice = r.slice;
            if(r.total > 0) purse.pay(r.total, r.paid, st);
        } catch { slice = before; }
    }
}
function setOrder({dutyId, policy} = {}) {
    for(const {defs} of live()) {
        if(!defs.some(d => d.id === dutyId)) continue;
        slice = setPolicy(slice, defs, dutyId, policy);
        return project();
    }
    throw Error('That duty is not yours to set right now.');
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
            if(s.status === 'due' || s.status === 'late' || missed) {
                const item = {id: d.id, why: d.why, open: s.open && !d.dues, status: s.status, shutsIn: s.remaining, reason: s.open ? '' : s.reason, missed};
                if(d.policy) { // a standing order: the choice, the choices, and where the escalation stands (state, not a draw)
                    const policy = policyOf(slice, d);
                    Object.assign(item, {standing: true, policy, policyLabel: policyWords(policy), policies: (d.policy.allowed ?? ['pay_on_time', 'pay_late', 'skip']).map(id => ({id, label: policyWords(id)})),
                        escalation: escalationOf(d, missed)?.line ?? ''});
                }
                items.push(item);
            }
        }
    }
    return {rows, items, enrolled: sets.length > 0};
}
registerDomain({id: 'duties', deps: [], initialState: freshDuties,
    save: () => empty(slice) ? undefined : structuredClone(slice), // an untouched life writes no key: older saves stay byte-identical
    validate: s => { if(s != null && s.family === DUTIES_FAMILY) validateDuties(s); },
    migrate: migrateDuties,
    load: s => { slice = migrateDuties(s); },
    tick, projection: project, commands: {attend, setOrder}});
