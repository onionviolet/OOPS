// Opponent card on the sheet projection (CHARACTER_SHEET.md step 16, UR36). A combat target's facts are
// read through the same characterSheetView a person met elsewhere is, at the means the fight gives, so
// two surfaces showing the same person at the same means show identical rows. Pure; no DOM, no state.
import {characterSheetView} from './character_sheet.js';

// What a fight shows: exact figures for the numbers its readout publishes, nothing else (no names or powers).
export const COMBAT_READ = Object.freeze({means: 'combat', label: 'What the fight shows', level: 3, precision: 3, scope: ['stats']});
const NUMBER = /^(-?\d+(?:\.\d+)?)\s*(.*)$/;
const slug = label => String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-');

// Facts ({label, value text}) as sheet stat rows. A value with no leading number has no band to read, so it is not a stat.
export function statRowsFromFacts(facts = []) {
    return facts.flatMap(fact => {
        const m = NUMBER.exec(String(fact.value ?? '').trim());
        return m ? [{id: slug(fact.label), label: fact.label, value: Number(m[1]), unit: m[2], exactText: String(fact.value).trim()}] : [];
    });
}

// Rows for a subject at the given reads, as {label, text, state} in the sheet's own order.
export function statRowsAt(stats, observer, reads = [COMBAT_READ]) {
    const view = characterSheetView({id: 'opponent', name: '', stats}, observer, reads);
    return view.sections.find(section => section.id === 'stats')?.rows.filter(row => row.id !== 'unread' && row.id !== 'overall') ?? [];
}

// The card's facts, keeping their order and their source's knowledge mark. A fact the sheet shows exactly keeps `knowledge`;
// a banded one reads partial; one it cannot read, or never had a number, passes through as the source gave it.
export function opponentFacts(facts = [], observer, reads = [COMBAT_READ]) {
    const rows = new Map(statRowsAt(statRowsFromFacts(facts), observer, reads).map(row => [row.label, row]));
    return facts.map(fact => {
        const row = rows.get(fact.label);
        if(!row || fact.knowledge === 'unknown') return fact;
        return {...fact, value: row.text, knowledge: row.state === 'known' ? fact.knowledge : 'partial'};
    });
}
