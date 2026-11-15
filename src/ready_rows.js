// What can I do now (UI direction D, adopted by Weibao 2026-11-14; play surface PS57). Each feature reports its own rows
// through one interface and the hub on Here lists them across features: ready first, then near with the gap named, then
// a count of the rest. A feature computes its rows from its own readiness (the recipe row's status, a life's eligible
// actions, a Gu's meal window); this module only collects and orders them, so there is one authority per fact (AR3).
//
// A source: registerReady({id, label, rows: () => Row[]}). Row: {
//   id        stable within the source
//   label     what the player would do, in their words ("Make Sinew string", "Feed the Moonglow Gu")
//   state     'ready' (can be done now) | 'near' (one named thing short) | 'rest' (further off; counted, not listed)
//   gap       for near rows: what is short, as the player would fetch it ("needs 2 Moon Orchid petals; you have 0")
//   detail    optional short fact after the label (time, cost, "turning, about 1 day")
//   urgent    optional: a near or ready row that loses something if left (a hungry Gu, food about to turn)
//   open()    optional: show the place where it is done (the panel, the bench)
//   act()     optional: do it from the hub (only for rows whose own panel would do it in one press)
//   uses      optional: item or resource names the row consumes or needs, which PS55 "Next" lines read
// }
// A source that throws or returns junk shows nothing; it never breaks Here.
const sources = new Map();
const STATES = ['ready', 'near', 'rest'];

export function registerReady(source) {
    if (!source || typeof source.id !== 'string' || typeof source.rows !== 'function') throw Error('A ready source needs an id and a rows() reader.');
    sources.set(source.id, source);
    return () => { if (sources.get(source.id) === source) sources.delete(source.id); };
}
export const readySources = () => [...sources.values()];

const clean = row => row && typeof row.label === 'string' && row.label.trim() && STATES.includes(row.state);
// Pure: order rows across sources. Ready first, urgent before the rest within a state; near rows keep their gap.
// Within one state and urgency, a source's own order is kept (its panel already sorted them).
export function orderReady(rowsBySource) {
    const out = [];
    for (const [sourceId, rows, label] of rowsBySource) for (const [i, row] of (rows || []).entries()) if (clean(row)) out.push({...row, source: sourceId, sourceLabel: label, key: `${sourceId}:${row.id ?? i}`, at: out.length});
    const rank = r => STATES.indexOf(r.state) * 2 + (r.urgent ? 0 : 1);
    out.sort((a, b) => rank(a) - rank(b) || a.at - b.at);
    // One act, one row: two sources naming the same act (a hungry Gu's Feed row and the life panel's own Feed button) merge.
    // The row placed first wins; it takes the other's act, open and detail when it lacks them, and its urgency.
    const kept = new Map();
    for (const r of out) {
        const k = r.label.split(' · ')[0].trim().toLowerCase(), first = kept.get(k);
        if (!first) { kept.set(k, r); continue; }
        first.urgent = first.urgent || r.urgent;
        for (const f of ['act', 'open', 'detail', 'gap']) if (!first[f] && r[f] && (f !== 'gap' || first.state === 'near')) first[f] = r[f];
        first.uses = [...new Set([...(first.uses || []), ...(r.uses || [])])];
    }
    return [...kept.values()];
}
export function collectReady() {
    const lists = [];
    for (const s of sources.values()) { let rows = []; try { rows = s.rows() || []; } catch { rows = []; } lists.push([s.id, Array.isArray(rows) ? rows : [], s.label || s.id]); }
    return orderReady(lists);
}
export function readyCounts(rows = collectReady()) {
    return {ready: rows.filter(r => r.state === 'ready').length, near: rows.filter(r => r.state === 'near').length, rest: rows.filter(r => r.state === 'rest').length};
}
// PS55: rows that use any of the named things (what was just gained), ready ones first. A result line reads this to say
// what can be done next with what it gave.
export function readyUsing(names, rows = collectReady()) {
    const want = new Set((names || []).map(n => String(n).toLowerCase()));
    if (!want.size) return [];
    return rows.filter(r => r.state !== 'rest' && (r.uses || []).some(u => want.has(String(u).toLowerCase())));
}
