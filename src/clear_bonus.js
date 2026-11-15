// PS160 (round 16, proposal; Discord F5): clearing a place can roll a bonus, and a bonus can hold a rarer one that
// rolls only when the first one hits. Pure: the caller passes the place's `clear_bonus` rows and a keyed draw, and
// hands each hit's rewards to the ordinary reward path (process_rewards), so a bonus is never a second reward system.
//
// Row: {id, label, chance, hint?: 'public', rewards: {money?, items?, ...}, then?: [rows]}.
// Default (DU40 over PS130): every row shows its odds as "about 1 in N"; a row the character has not seen hides only its
// name ("???"), and a row under an unseen one stays wholly "???". Dial: `hint: 'public'` on a row says the place itself is known for it (the field's farmers, the gang's
// stash). Reason: the clear is honest about extra luck without spoiling what the luck holds.

const odds = chance => chance >= 1 ? 'always' : `about 1 in ${Math.max(2, Math.round(1 / chance))}`;

/** Roll the rows depth first: a row's `then` rolls only when the row itself hit. Returns [{row, depth}]. */
export function rollClearBonus(rows = [], draw, path = []) {
    const hits = [];
    for(const row of rows) {
        if(!(row.chance > 0) || !(draw([...path, row.id].join('/')) < row.chance)) continue;
        hits.push({row, depth: path.length});
        hits.push(...rollClearBonus(row.then ?? [], draw, [...path, row.id]));
    }
    return hits;
}

/** The Reports line for a hit, marked as a chance bonus with its odds. */
export function clearBonusMessage({row, depth}) {
    return `${depth ? 'Rarer bonus' : 'Clear bonus'} (${odds(row.chance)}${depth ? ', after the first' : ''}): ${row.label}.`;
}

/** A row is known when the place is known for it, or the character has held what it gives. */
export function bonusKnown(row, knownItems = {}) {
    if(row.hint === 'public') return true;
    const items = (row.rewards?.items ?? []).map(e => typeof e === 'string' ? e : e.item);
    return items.length > 0 && items.every(id => (knownItems[id]?.number ?? 0) > 0);
}

/** The location box's clause: "sometimes: a farmer's thanks (about 1 in 3) · rarer: something not yet seen (about 1 in 5)". Empty when the place has none.
 *  An unseen bonus is named in words, not a "???" mark (UR142), and keeps its odds (DU40). */
const UNSEEN = 'something not yet seen';
export function clearBonusText(rows = [], knownItems = {}) {
    const parts = [];
    const walk = (list, depth) => {
        for(const row of list) {
            const known = bonusKnown(row, knownItems);
            parts.push(`${depth ? 'rarer' : 'sometimes'}: ${known ? row.label : UNSEEN} (${odds(row.chance)})`);
            if(known) walk(row.then ?? [], depth + 1);
            else if(row.then?.length) parts.push(`rarer: ${UNSEEN}`);
        }
    };
    walk(rows, 0);
    return parts.length ? ` · ${parts.join(' · ')}` : '';
}

/** The reward objects for one clear's bonus hits, each carrying its Reports line, for the ordinary reward path. */
export function clearBonusRewards(rows = [], draw) {
    return rollClearBonus(rows, draw).map(hit => ({...hit.row.rewards, messages: [clearBonusMessage(hit)]}));
}
