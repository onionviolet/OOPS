// Adapters from the game's own read models to the non-node figure forms (COV4, AD46). Each takes a projected view and
// returns a figure spec; no world's ids or names live here, the rows, groups and labels all come from the view.
import {carryGroups, thresholdScene} from './crossing_threshold.js';

const pct = v => `${Math.round(v * 100)}%`;

/** owedLedgerView() output -> a ledger table: who, what, kind, when, with the share of term left as a bar. */
export function owedTableFigure(view, {id = 'owed-table', title = 'Owed', size = 760} = {}) {
    const rows = view.rows.map(r => ({id: r.id, cells: [`${r.direction === 'owed' ? 'From' : 'To'} ${r.party}`, r.amountText, r.kindLabel, r.dueText],
        state: r.overdue ? 'strained' : undefined, ...(r.termLeft != null ? {bar: r.termLeft, barNote: `${pct(r.termLeft)} of term left`} : {})}));
    return {id, title, size, summary: view.summary || view.empty,
        tables: rows.length ? [{id: `${id}-rows`, label: 'Open accounts', columns: [{label: 'Who', weight: 1.2}, {label: 'What', weight: 1.1}, {label: 'Kind', weight: .9}, {label: 'When', weight: 1.6}], barLabel: 'Term', rows}] : [],
        notes: rows.some(r => r.state) ? [{state: 'strained', text: 'A marked row is late.'}] : [],
        legend: [{state: 'strained', label: 'late'}]};
}

const GROUP_STATE = {crosses: 'done', held: 'empty', pauses: 'strained', far: 'pending'};

/** crossing_threshold view -> a threshold card: header, stakes, then the answers grouped by what happens to them. */
export function thresholdCardFigure(view, {size = 760} = {}) {
    const scene = thresholdScene(view), h = scene.header;
    const groups = carryGroups(view).map(g => ({id: g.id, label: g.label, state: g.id === 'pauses' && g.label === 'Ends here' ? 'broken' : GROUP_STATE[g.id],
        rows: g.rows.map(r => ({label: r.question, text: r.answer}))}));
    return {id: `threshold-${view.id}`, title: [h.lead, h.place, h.title].filter(Boolean).join(' · '), size, summary: h.time || undefined,
        cards: [{id: `${view.id}-card`, label: [h.lead, h.title].filter(Boolean).join(' '), summary: scene.stakes, groups}],
        notes: scene.options.filter(o => o.blocked).map(o => ({state: 'strained', text: `${o.label} unavailable: ${o.blocked}`})),
        legend: [{state: 'done', label: 'goes with you'}, {state: 'empty', label: 'stays behind'}, {state: 'strained', label: 'pauses'}, {state: 'broken', label: 'ends'}, {state: 'pending', label: 'waits on the far side'}]};
}
