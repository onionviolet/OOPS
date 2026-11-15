// D1 (SFC10, drafts 2026-11-15, "build both"): Klein's work day as rows under the Find work verb and one "Pay and debts"
// ledger. Both read book_world_lotm_wage.js wageView, the single owner of the pay facts (AR3); nothing here writes. Rent and
// a shift act have no mechanism yet, so they are not drawn (the draft's rent row waits for one).
import {wageView, wageWords, WAGE_DIALS} from './book_world_lotm_wage.js';
import {formatDuration} from './number_format.js';

// Ready rows (ready_rows.js shape). Drawing pay is ready when a week has closed; before the first draw it is ready too
// (the terms are his to accept); otherwise it rests with the time to the next week.
export function lotmWorkRows(state, {collect, open} = {}) {
    const v = wageView(state);
    if (!v) return [];
    const base = {id: 'lotm-wage', label: 'Draw the weekly pay', verb: 'work', open};
    if (!v.started) return [{...base, state: 'ready', detail: `${wageWords(v.weeklyPence)} a week from Mrs. Orianna; open to start`}];
    if (v.owedWeeks) return [{...base, state: 'ready', act: collect,
        detail: `${wageWords(v.net)} for ${v.owedWeeks === 1 ? 'one week' : `${v.owedWeeks} weeks`}${v.kept ? `, ${wageWords(v.kept)} kept against the advance` : ''}`}];
    return [{...base, state: 'rest', gap: `next pay in ${formatDuration(v.nextIn)}`, detail: `next pay in ${formatDuration(v.nextIn)}`}];
}

// The ledger: one row per week from the first draw until the advance is cleared (or one past the last closed week),
// with what Mrs. Orianna pays, what she keeps and what is still owed after that week. Status: paid, owed (closed, not
// drawn), next (the week running now), ahead.
export function wageLedger(v, dials = WAGE_DIALS) {
    if (!v) return {rows: [], weekly: null, advanceLeft: 0, started: false};
    const weekly = dials.weeklyPence.value, half = weekly * dials.keptShare.value, advance = v.advance ? dials.advancePence.value : 0;
    const clearWeeks = half > 0 ? Math.ceil(advance / half) : 0, closed = v.started ? v.closed : 0, paid = v.started ? v.paid : 0;
    const last = Math.min(52, Math.max(clearWeeks, closed + 1));
    const rows = [];
    for (let w = 1; w <= last; w++) {
        const kept = Math.max(0, Math.min(half, advance - (w - 1) * half));
        const status = !v.started ? 'ahead' : w <= paid ? 'paid' : w <= closed ? 'owed' : w === closed + 1 ? 'next' : 'ahead';
        rows.push({week: w, paid: weekly - kept, kept, advanceLeft: Math.max(0, advance - w * half), status});
    }
    return {rows, weekly, advanceLeft: v.advanceLeft, started: v.started, owed: v.started ? v.net : 0};
}

const STATUS_WORD = {paid: 'drawn', owed: 'owed now', next: 'this week', ahead: ''};
/** The ledger as a small table: Week · You get · Kept · Advance left, with each week's state in words. */
export function renderPayLedger(doc, ledger, words = wageWords) {
    const wrap = doc.createElement('section');
    wrap.className = 'pay-ledger';
    wrap.dataset.payLedger = '';
    const head = doc.createElement('p');
    head.className = 'pay-ledger__head';
    head.textContent = `Pay and debts · ${words(ledger.weekly)} a week${ledger.advanceLeft ? ` · advance left ${words(ledger.advanceLeft)}` : ' · no advance owed'}`;
    wrap.append(head);
    const table = doc.createElement('table');
    const tr = cells => { const row = doc.createElement('tr'); for (const [tag, text] of cells) { const c = doc.createElement(tag); c.textContent = text; row.append(c); } return row; };
    table.append(tr([['th', 'Week'], ['th', 'You get'], ['th', 'Kept'], ['th', 'Advance left'], ['th', '']]));
    for (const r of ledger.rows) {
        const row = tr([['td', String(r.week)], ['td', words(r.paid)], ['td', r.kept ? words(r.kept) : '–'], ['td', r.advanceLeft ? words(r.advanceLeft) : 'clear'], ['td', STATUS_WORD[r.status]]]);
        row.dataset.status = r.status;
        table.append(row);
    }
    wrap.append(table);
    if (!ledger.started) { const p = doc.createElement('p'); p.textContent = 'Weeks count from your first draw.'; wrap.append(p); }
    return wrap;
}

// The ledger as a Journal page beside Quests and Data (UI cohesion's box tabs, 5c9592b37). It shows while Klein has a
// contract and redraws only when the numbers change; `read` gives the expansion state.
export function mountPayLedgerTab({registerBoxTab, read}) {
    if (typeof document === 'undefined') return () => {};
    const node = document.createElement('section');
    node.className = 'pay-ledger-page';
    let key = '';
    const when = () => {
        const v = wageView(read());
        if (!v) return false;
        const ledger = wageLedger(v), next = JSON.stringify(ledger);
        if (next !== key) { key = next; node.replaceChildren(renderPayLedger(document, ledger)); }
        return true;
    };
    return registerBoxTab({box: 'journal', id: 'pay', label: 'Pay', node, when});
}
