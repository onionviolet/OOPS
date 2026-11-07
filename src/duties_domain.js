// FD8: recurring duties as a saved shared domain. Owns the optional top-level key `duties` (slice `duties@1`, see
// recurring_duties.js and SAVES 6e). Imports no world (AR3/AR4): a world registers a duty set through registerDutySet and
// supplies its own reader for "is this life enrolled" and "what minute is it". Absent or foreign slice loads fresh.
import {registerDomain} from './domain_registry.js';
import {freshDuties, migrateDuties, validateDuties, attendDuty, settleMisses, settleDues, skipInactive, dutyRows, answerMisses, setPolicy, policyOf, escalationOf, policyWords, policyOption, allowedOf, duesDials, planSeizure, applySeizure, DUTIES_FAMILY} from './recurring_duties.js';
import {authorityOver} from './authority.js';
import {dutyState} from './world_rhythm.js';
const sets = new Map();
let slice = freshDuties();
// set = {defs, state?: () => any, active: (state) => boolean, minute: (state) => number,
//        purse?: {balance: (state) => number, pay: (amount, paid, state) => void}}  (purse is needed only by defs with `dues`; pay throws when it cannot)
//        draw?: (key, state) => [0,1)   a world's seeded draw for disputes and bribes (default: a stable hash of the key)
//        place?: (state) => string      where the player is, for defs that name an `authority` (OB8)
//        seize?: {present: (state) => bool, goods: (state) => [{key,name,value,qty,equipped?,quest?}], take: (picks, plan, state) => void}   (OB2: goods are only taken while present)
export function registerDutySet(id, set) {
    if(typeof id !== 'string' || !id || !Array.isArray(set?.defs) || typeof set.active !== 'function' || typeof set.minute !== 'function') throw Error('Invalid duty set.');
    sets.set(id, Object.freeze({...set, defs: Object.freeze([...set.defs])}));
}
// OB6: inputs for the digest's weekly money line, from live sets that declare `money: {world, fmt?, paidLabel?}`. Read-only.
export function dutyMoneyInputs(owed = []) {
    const out = [];
    for(const set of sets.values()) {
        if(!set.money) continue;
        try { if(set.active(set.state?.())) out.push({world: set.money.world, defs: set.defs, slice, owed, fmt: set.money.fmt, paidLabel: set.money.paidLabel}); } catch { /* world not ready */ }
    }
    return out;
}
const owed = (d, set, st) => {
    if(!d.authority) return true;
    const a = authorityOver(st, {world: d.authority, place: d.place ?? set.place?.(st), registered: d.registered === true});
    return !!(a.claimant && a.knows && a.reach);
};
// Active sets with their current minute; a set whose reader throws is skipped, never a reason to stop the clock.
function live() {
    const out = [];
    for(const set of sets.values()) {
        try {
            const st = set.state?.();
            if(!set.active(st)) continue;
            // OB8: a def that names an authority owes nothing where no claimant knows the player and reaches the place; its weeks close unaccounted.
            const split = {defs: [], idle: []};
            for(const d of set.defs) (owed(d, set, st) ? split.defs : split.idle).push(d);
            out.push({...split, all: set.defs, minute: set.minute(st), purse: set.purse, set, st});
        } catch { /* world not ready */ }
    }
    return out;
}
const empty = s => ['lastDone', 'missed', 'closed', 'policy', 'late', 'short', 'dispute', 'last'].every(k => !Object.keys(s[k] ?? {}).length);
// Registered sets that are not live right now: their clock is read when it can be, and the stretch is closed unaccounted.
function skipIdle(liveSets) {
    for(const set of sets.values()) {
        if(liveSets.some(l => l.all === set.defs)) continue;
        try { const minute = set.minute(set.state?.()); if(Number.isInteger(minute) && minute >= 0) slice = skipInactive(slice, set.defs, minute); } catch { /* clock unreadable: nothing to skip */ }
    }
}
function tick() {
    const liveSets = live();
    skipIdle(liveSets);
    for(const {defs, idle, minute, purse, set, st} of liveSets) {
        if(!(Number.isInteger(minute) && minute >= 0)) continue;
        if(idle.length) slice = skipInactive(slice, idle, minute);
        slice = settleMisses(slice, defs.filter(d => !d.dues), minute).slice;
        const dues = defs.filter(d => d.dues);
        if(!dues.length || !purse) continue;
        // OB4: the standing order runs on the clock, no click. Commit the new slice before the debit so the one save the debit makes
        // carries both; if the host cannot take the coins now (read-only tab, not ready) roll back and settle on a later tick.
        const before = slice;
        try {
            const r = settleDues(slice, dues, minute, purse.balance(st), set.draw ? key => set.draw(key, st) : undefined);
            slice = r.slice;
            if(r.total > 0) purse.pay(r.total, r.paid, st);
        } catch { slice = before; continue; }
        seize(dues, set, minute, st);
    }
}
// OB2: goods are taken only while the player is present; away, the arrears wait (the projection says so). The slice is committed only if the take lands.
function seize(dues, set, minute, st) {
    if(!set.seize) return;
    for(const d of dues) {
        const n = slice.missed[d.id] ?? 0;
        if(!(n >= duesDials(d).seizure.atMisses)) continue;
        try {
            if(!set.seize.present(st)) continue;
            const plan = planSeizure(d, n, set.seize.goods(st));
            if(!plan) continue;
            const before = slice;
            slice = applySeizure(slice, d, plan, minute);
            try { set.seize.take(plan.picks, plan, st); } catch { slice = before; }
        } catch { /* world not ready: it waits */ }
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
// OB10: pay the back rent in one go, from the purse, because the player chose to (a fight's end, or a knock answered). Never runs on the clock.
// Returns {missed, amount, paid}; short purse or no seam pays nothing and leaves the count alone. The count clears only if the debit lands.
function settleArrears({dutyId} = {}) {
    for(const {defs, purse, st} of live()) {
        const d = defs.find(x => x.id === dutyId && x.dues);
        if(!d) continue;
        const missed = slice.missed[dutyId] ?? 0, amount = missed * d.dues.amount;
        if(!missed || !purse || !(purse.balance(st) >= amount)) return {missed, amount, paid: false};
        const before = slice;
        slice = answerMisses(slice, dutyId);
        try { purse.pay(amount, Array.from({length: missed}, () => ({id: dutyId, cycle: null, amount: d.dues.amount})), st); } catch(error) { slice = before; throw error; }
        return {missed, amount, paid: true};
    }
    throw Error('That duty has no arrears to settle right now.');
}
// rows are the shared-ledger rows; items add what the panel needs (open, minutes left, missed) per def, in words-ready form.
function project() {
    const sets = live(), rows = [], items = [];
    for(const {defs, minute, set, st} of sets) {
        rows.push(...dutyRows(slice, defs, minute));
        for(const d of defs) {
            const s = dutyState(d.schedule, minute, slice.lastDone[d.id]), missed = slice.missed[d.id] ?? 0;
            if(s.status === 'due' || s.status === 'late' || missed) {
                const item = {id: d.id, why: d.why, open: s.open && !d.dues, status: s.status, shutsIn: s.remaining, reason: s.open ? '' : s.reason, missed};
                if(d.policy) { // a standing order: the choice, the choices, and where the escalation stands (state, not a draw)
                    const policy = policyOf(slice, d);
                    Object.assign(item, {standing: true, policy, policyLabel: policyWords(policy), policies: allowedOf(d).map(id => ({id, label: policyOption(d, id)})),
                        escalation: escalationOf(d, missed)?.line ?? ''});
                    const k = duesDials(d), held = slice.dispute?.[d.id], ev = slice.last?.[d.id];
                    if(held) item.dispute = {...held};
                    if(ev) item.last = {...ev};
                    if(set.seize && d.dues && missed >= k.seizure.atMisses) { // derived: waiting is a state, not a stored flag
                        let here = false; try { here = set.seize.present(st) === true; } catch { here = false; }
                        if(!here) item.seizureWaiting = `${k.seizure.who ?? 'The creditor'} will take goods worth ${missed} ${missed === 1 ? 'week' : 'weeks'} of arrears when you are back.`;
                    }
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
    tick, projection: project, commands: {attend, setOrder, settleArrears}});
