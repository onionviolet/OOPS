// Holds the Primordial credit slice and exposes the commands and view the panel reads. No DOM, no
// game imports: the domain passes the clock in (AR3/AR4). Absent in saves that never used it.
import * as R from './book_world_primordial_credit.js';

export function createPrimordialHost({now, onChange = () => {}}) {
    let state = R.fresh(), last = null;
    const set = next => { state = next; onChange(); };
    const settleNow = () => { const at = t(); if(at == null) return; const next = R.settle(state, at); if(next !== state) set(next); };
    const t = () => { const n = now(); return Number.isFinite(n) ? n : null; };
    return {
        request(itemId) {
            const at = t(); if(at == null) throw Error('The calendar is unavailable.');
            const out = R.request(state, itemId, at);
            if(out.ok) { last = {itemId, ok: true}; set(out.state); return {ok: true}; }
            last = {itemId, ok: false, reasons: out.reasons, shown: out.shown, routes: out.routes}; onChange(); return out;
        },
        // Contribution points buy from the treasure hall (DWF162). Refusals carry every reason and change nothing.
        buy(rowId) { settleNow(); const out = R.buy(state, rowId); last = out.ok ? last : {itemId: rowId, ok: false, hall: true, reasons: out.reasons, shown: [], routes: []}; if(out.ok) set(out.state); else onChange(); return out; },
        askHowCreditIsWeighed() { set(R.askHowCreditIsWeighed(state)); },
        startShift() {
            const at = t(); if(at == null) throw Error('The calendar is unavailable.');
            const out = R.startShift(R.settle(state, at), at);
            if(!out.ok) { settleNow(); throw Error(out.reason); }
            set(out.state);
        },
        // Called by the native game tick (registry tick): pays a finished mission. Display refreshes only on change.
        tick() { settleNow(); },
        repay(amount) { settleNow(); const at = t(); if(at == null) throw Error('The calendar is unavailable.'); const out = R.repay(state, amount, at); set(out.state); return out.paid; },
        view() {
            const at = t();
            return {now: at, cp: state.cp, shift: state.shift, shifts: state.shifts, lastShiftDay: state.lastShiftDay, task: R.TASK, loan: state.loan ? {...state.loan, ...(at == null ? {} : R.quantities(state.loan, at))} : null,
                held: structuredClone(state.held), knowsRule: state.knowsRule, firstExchangeUsed: state.firstExchangeUsed,
                bodyValue: state.knowsRule ? R.DIALS.bodyValue.value : null, last: structuredClone(last),
                ledger: at == null ? [] : R.ledgerOf(state, at).rows, items: Object.values(R.ITEMS), hall: {name: R.INSTITUTION.name, rows: R.storeRows(state), spent: state.store?.spent ?? 0, bought: structuredClone(state.store?.bought ?? {}), proposals: R.INSTITUTION.proposals}, dials: R.DIALS, carry: R.CARRY_ROWS};
        },
        save: () => R.isEmpty(state) ? undefined : structuredClone(state),
        validate: R.validateSlice,
        load(slice) { state = R.migrate(slice); last = null; onChange(); },
    };
}
