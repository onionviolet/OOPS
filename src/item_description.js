// Structured description clauses (G6, parity audit 2026-10-23). An item description is a base plus
// ordered clauses, each with a kind, so modifiers, history and a name's story assemble in a fixed
// order instead of being appended to one string. Pure leaf: imports nothing.
//
// Kinds, in reading order: base, name, modifier, relic, history. Unknown kinds sort last, so a newer
// build's clause still shows. A clause is {kind, text, source?}; `source` lets one owner replace
// only its own clause (a re-applied history line must not stack).
export const CLAUSE_ORDER = Object.freeze(['base', 'name', 'modifier', 'relic', 'history']);
const rank = kind => { const i = CLAUSE_ORDER.indexOf(kind); return i < 0 ? CLAUSE_ORDER.length : i; };

export function normalizeClauses(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(c => c && typeof c.kind === 'string' && typeof c.text === 'string' && c.text.trim())
        .map(c => ({kind: c.kind, text: c.text.trim(), ...(typeof c.source === 'string' ? {source: c.source} : {})}));
}

export function assembleDescription(clauses) {
    return normalizeClauses(clauses).map((c, i) => ({c, i})).sort((a, b) => rank(a.c.kind) - rank(b.c.kind) || a.i - b.i)
        .map(({c}) => /[.!?)\]]$/.test(c.text) ? c.text : `${c.text}.`).join(' ');
}

// Adds or replaces (by kind+source) clauses on an item and refreshes item.description. The first call
// captures the item's existing description as the base clause, so earlier plain text is preserved.
export function addDescriptionClauses(item, clauses) {
    if (!item.descriptionClauses) item.descriptionClauses = normalizeClauses([{kind: 'base', text: item.description || ''}]);
    for (const next of normalizeClauses(clauses)) {
        const at = next.source ? item.descriptionClauses.findIndex(c => c.kind === next.kind && c.source === next.source) : -1;
        if (at >= 0) item.descriptionClauses[at] = next; else item.descriptionClauses.push(next);
    }
    item.description = assembleDescription(item.descriptionClauses);
    return item;
}
