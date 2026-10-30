// Dated character sheets (WA50): a pure read model over sheet objects. Sheets are data (private pack); this module never reads files or holds plot text.
// Chapter refs are 'bN:CH' (volume, chapter; chapters restart per volume). Docs: docs/gm/dispatch/sonnet-wave-2026-10-30/L8_CHARACTER_SHEET_SCHEMA.md
export const LIST_FIELDS = ['identities', 'affiliation', 'power', 'abilities', 'stats', 'skills', 'held', 'money', 'condition', 'outcomes', 'routine'];
export const STAT_AXES = ['might', 'speed', 'resilience', 'mind', 'perception', 'lore', 'influence', 'wealth'];

/** 'b5:12' -> sortable number; null for anything else. */
export function chapterRank(ref) {
    const m = /^b(\d+):(\d+)$/.exec(String(ref ?? ''));
    return m ? Number(m[1]) * 100000 + Number(m[2]) : null;
}

/** Locator string -> 'bN:CH'. Forms: 'zh 第N章 pP' (b1), 'zh bV 第N章 pP', 'en bV cN pP' (sibling books). Null when none matches. */
export function refOfLocator(loc) {
    const s = String(loc ?? ''), m = /\bb(\d+) c(\d+)\b/.exec(s) ?? /(?:\bb(\d+) )?第(\d+)章/.exec(s);
    return m ? `b${m[1] ?? 1}:${m[2]}` : null;
}

/** Is the entry in force at `at`? An open `to` means still true; `to` is exclusive. */
export function inForce(entry, at) {
    const from = chapterRank(entry.from), to = entry.to == null ? Infinity : chapterRank(entry.to);
    return from !== null && from <= at && at < to;
}

/** Gates open when every gate id is in `openGates`; an entry without a gate is always open. */
export const gateOpen = (entry, openGates) => !entry.gate || openGates.has(entry.gate);

/** Persona ids ('persona.<slug>', L11) the person holds as of a chapter; standing is read elsewhere (standingOf), never stored here. */
function personaIdsAsOf(sheet, at, open) {
    const held = new Set((sheet.identities ?? []).filter(e => e.v?.persona && inForce(e, at) && gateOpen(e, open)).map(e => e.v.persona));
    return (sheet.personaIds ?? []).filter(id => held.has(id));
}

/**
 * The sheet as of a chapter. Per list field, entries in force and not gated shut, split by view:
 * `actual` (default) and `shown` are what the person is and displays; `believed` entries stay apart with their observer.
 * `hidden` counts the gated entries withheld, never their content.
 */
export function sheetAsOf(sheet, chapterRef, {openGates = []} = {}) {
    const at = chapterRank(chapterRef);
    if (!sheet || at === null) return null;
    const open = openGates instanceof Set ? openGates : new Set(openGates);
    const out = {id: sheet.id, tier: sheet.tier, asOf: chapterRef, hidden: 0, personaIds: personaIdsAsOf(sheet, at, open)};
    for (const field of LIST_FIELDS) {
        const live = (sheet[field] ?? []).filter(e => inForce(e, at));
        const shut = live.filter(e => !gateOpen(e, open));
        out.hidden += shut.length;
        const shown = live.filter(e => gateOpen(e, open));
        out[field] = {
            actual: shown.filter(e => (e.view ?? 'actual') === 'actual'),
            shown: shown.filter(e => e.view === 'shown'),
            believed: shown.filter(e => e.view === 'believed'),
        };
    }
    return out;
}

/** The band for one axis as of a chapter (latest actual entry), or null. */
export function bandAsOf(sheet, axis, chapterRef, opts) {
    const stats = sheetAsOf(sheet, chapterRef, opts)?.stats.actual.filter(e => e.v?.axis === axis) ?? [];
    return stats.length ? stats[stats.length - 1].v.band : null;
}

/** Check one stated outcome against the bands. expect: {kind:'beats'|'loses_to', vs:{axis:band}}, {kind:'money_at_least', amount} (purse), or {price_at_least} (any money entry). */
export function reproduces(sheet, outcome, opts) {
    const at = outcome.from, e = outcome.expect ?? {};
    if (e.price_at_least !== undefined) {   // some money entry in force (any view or kind) reaches the price
        return (sheetAsOf(sheet, at, opts)?.money ?? {}).actual?.concat(sheetAsOf(sheet, at, opts).money.shown, sheetAsOf(sheet, at, opts).money.believed)
            .some(m => (m.v?.amount ?? 0) >= e.price_at_least) ?? false;
    }
    if (e.kind === 'money_at_least') {
        const total = (sheetAsOf(sheet, at, opts)?.money.actual ?? []).filter(m => m.v?.kind === 'purse').reduce((sum, m) => sum + (m.v.amount ?? 0), 0);
        return total >= e.amount;
    }
    const axes = Object.keys(e.vs ?? {});
    if (!axes.length) return null;
    const mine = axes.map(a => bandAsOf(sheet, a, at, opts));
    if (mine.some(b => b === null)) return null;
    const margin = axes.reduce((s, a, i) => s + (mine[i] - e.vs[a]), 0);
    return e.kind === 'beats' ? margin > 0 : e.kind === 'loses_to' ? margin < 0 : null;
}
