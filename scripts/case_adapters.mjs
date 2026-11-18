// Adapters from the four efforts that feed ledger rows (PSA21, PSA26). Each reads or emits the shared shape of
// docs/coverage/CASE_SHAPE.md and nothing else: a row is {id, state, case?, derived?}, runner output is
// {state, detail, basis, confidence}. They only transform data; no ledger is written here.
import {runRow} from './case_runner.mjs';

/** Pass runner (PWC18, label_runner.mjs): the rows a label pass still owes a case, as runPass items. */
export const passItems = (rows, user) => rows.filter(r => !r.case).map(r => ({id: r.id, user: user(r)}));

/** Pass runner replies ({id: {reply, usage}}) to ledger rows, one per reply, through a pass's own `caseOf(reply, row)` (data or null). */
export function passRows(rows, replies, caseOf) {
    return rows.filter(r => replies[r.id]?.reply).map(r => {
        const data = caseOf(replies[r.id].reply, r);
        return data ? {...r, case: {id: r.id, data}} : {...r, state: r.state.startsWith('runs-') || r.state.startsWith('expressed-') ? 'catalogued' : r.state};
    });
}

/** Field fill (PWC60, docs/coverage/fields/<slug>.jsonl: {id, ledger, f, r?}): a row whose required fields are confirmed gets the
 *  law's case; any unknown required field leaves it catalogued (the fill is review-only until both readers agree). */
export function fieldRow(fill, {required, caseOf, base = {}}) {
    const ready = required.every(k => fill.f?.[k]);
    return {id: fill.id, source: base.source ?? fill.ledger, state: 'catalogued', mechanisms: base.mechanisms ?? [],
        ...(ready ? {case: {id: fill.id, data: caseOf(fill.f)}} : {})};
}

/** Rule search (gu_rank_search.json `final.by`): one runner-output row per rule, derivation confidence as a column (PSA28). */
export const searchOutputRows = (result, prefix = 'gu.rank.search') =>
    Object.entries(result.final.by).map(([rule, s]) => ({id: `${prefix}:${rule}`, state: 'catalogued', detail: 'rule search fold 5, scored once',
        basis: 'derived', confidence: {exact: s.n ? Math.round(1000 * s.exact / s.n) / 1000 : null, withinBand: s.n ? Math.round(1000 * s.within1 / s.n) / 1000 : null, n: s.n, verdict: null}}));

/** Derivation (derivation_rules_backtest.mjs): run rows and read each rule's confidence from the same function. */
export const runRows = (rows, opts) => Promise.all(rows.map(r => runRow(r, opts)));
