// Several ladders for one character, and a picker that shows only what the character has heard of (ABILITIES.md Round 6; USER_VISION
// "Abilities: no hardcoded path"). Pure and path-neutral: an entry is a "ladder view" (ability_ladder_figure.js header) plus where it
// comes from. No world, pathway or system id is named here; the host and each world's adapter supply them, and a test keeps it so.
import {ladderFigureSpec} from './ability_ladder_figure.js';

/** Where an ability comes from, in the order a character reads them. A world may add kinds; unknown kinds sort last. */
export const ABILITY_SOURCES = Object.freeze(['rung', 'learned', 'item', 'contract', 'cheat']);
const SOURCE_WORD = {rung: 'Your rung', learned: 'Learned', item: 'Carried', contract: 'By contract', cheat: 'By a gift you cannot explain'};
const rank = source => { const i = ABILITY_SOURCES.indexOf(source); return i < 0 ? ABILITY_SOURCES.length : i; };

/**
 * entries: [{system, source, view, events?, felt?, planned?, abilities?}] where system is the words a world uses for the kind of ladder
 * ("Potion sequence", "Realm", "Spell school"), source one of ABILITY_SOURCES (or a world's own), view a ladder view.
 * Returns groups [{system, ladders: [{source, sourceWord, id, spec}]}], in first-seen system order, sources in reading order.
 * Only the first ladder of the first group is drawn full size; the rest are compact (several ladders at once stay readable).
 */
export function groupLadders(entries) {
    const bySystem = new Map();
    entries.forEach((entry, i) => {
        const list = bySystem.get(entry.system) ?? bySystem.set(entry.system, []).get(entry.system);
        list.push({...entry, order: i});
    });
    let first = true;
    return [...bySystem].map(([system, list]) => ({system, ladders: list.sort((a, b) => rank(a.source) - rank(b.source) || a.order - b.order).map(entry => {
        const spec = ladderFigureSpec(entry.view, {...(first ? {} : {layout: 'compact'}), felt: entry.felt, planned: entry.planned, abilities: entry.abilities, events: entry.events,
            id: `ladders-${entry.view.path}-${entry.source}`});
        first = false;
        return {source: entry.source, sourceWord: SOURCE_WORD[entry.source] ?? entry.source, id: entry.view.path, spec};
    })}));
}

/**
 * The path picker and compare. entries: [{view, heard: bool}]. A path the character has not heard of is not listed at all; a heard-of path
 * lists only the rungs its view names, with unnamed rungs collapsed to one "Not yet known". Never says how many paths exist.
 */
export function pathPicker(entries) {
    return entries.filter(e => e.heard).map(({view}) => {
        const rungs = [];
        for (const rung of view.ladder) {
            const named = rung.label !== '???';
            if (!named && rungs.length && rungs[rungs.length - 1].unknown) continue;
            rungs.push(named ? {label: rung.label, reached: rung.reached} : {label: 'Not yet known', unknown: true, reached: false});
        }
        return {id: view.path, label: view.label, standing: view.stage, rungs};
    });
}

/** The picker as plain lines (UR37). */
export function pathPickerText(rows) {
    if (!rows.length) return 'No paths known yet.';
    return rows.map(r => `${r.label}: ${r.rungs.map(g => g.label).join(' > ')}. You stand on ${r.standing}.`).join('\n');
}

/**
 * The character-sheet glance: one short line per system the character holds, each in that system's own words (the entry's `words`, supplied by the
 * world's adapter), capped at `limit` and then "and N more". Returns the lines; the sheet draws them.
 */
export function systemGlance(entries, {limit = 3} = {}) {
    const lines = entries.map(e => `${e.system}: ${e.words}`);
    return lines.length > limit ? [...lines.slice(0, limit), `and ${lines.length - limit} more`] : lines;
}

/** A path-less set of powers as a list grouped by where each comes from: [{source, sourceWord, items: [label]}], in reading order, empty groups omitted. */
export function sourceList(items) {
    const bySource = new Map();
    for (const item of items) (bySource.get(item.source) ?? bySource.set(item.source, []).get(item.source)).push(item.label);
    return [...bySource].sort((a, b) => rank(a[0]) - rank(b[0])).map(([source, labels]) => ({source, sourceWord: SOURCE_WORD[source] ?? source, items: labels}));
}
