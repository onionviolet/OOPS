// Item card model (ITEMS.md, proposal): one read of an item and the thing it would replace.
// Pure data in, plain object out. Truth comes from the item readers and equipmentComparison;
// nothing here parses display text (AD6-AD8). Every row carries words for its direction (UR37).
import {equipmentComparison} from './equipment_comparison.js';

// Neutral stand-in for an empty slot, so "nothing worn" compares through the same readers.
const emptySlot = slot => ({equip_slot: slot, name: 'Empty slot', quality: undefined, getName: () => 'Empty slot',
    getAttack: () => 0, getDefense: () => 0, getShieldStrength: () => 0, getStats: () => ({})});

const REDUCTIONS = new Set(['damage_taken', 'min_damage_share']);
const pretty = id => String(id).replaceAll('_', ' ').replace(/^./, c => c.toUpperCase());
const sign = n => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n)}`;

// Appraisal levels follow MEANS_AND_APPRAISAL AP0-AP9. What each level lets a reader see of an item:
const SEES = {
    AP0: new Set(['name', 'kind']),
    AP1: new Set(['name', 'kind', 'slot']),
    AP2: new Set(['name', 'kind', 'slot', 'band']),
    AP3: new Set(['name', 'kind', 'slot', 'band', 'quality', 'stats', 'value']),
    AP7: new Set(['name', 'kind', 'slot', 'band', 'quality', 'stats', 'value', 'provenance', 'condition']),
};
export const APPRAISAL_LEVELS = Object.freeze(Object.keys(SEES));
// Without an appraisal route in play the item is read in hand: everything its readers expose.
export const IN_HAND = 'AP7';

function statRows(item, baseline, quality, hasWorn) {
    if (item.tags?.structuredEquipment || baseline.tags?.structuredEquipment)
        return {note: 'This equipment is worn through body fit, coverage and condition. Compare it in the worn-equipment view.', rows: []};
    const cmp = equipmentComparison(item, baseline, {quality});
    if (!cmp) return {rows: []};
    if (cmp.unsupported) return {note: cmp.unsupported, rows: []};
    // Assembly inputs (part quality, tier) matter to crafting, not to wearing; the text form keeps them.
    return {rows: cmp.rows.filter(r => !/assembly input|^Part /.test(r.label)).map(r => {
        const [value] = r.values, [delta] = r.deltas, multiplier = r.kind === 'multiplier';
        const lower = REDUCTIONS.has(r.id);
        const direction = delta === 0 ? 'same' : (delta > 0) !== lower ? 'better' : 'worse';
        return {id: r.id, label: pretty(r.label), unit: multiplier ? '×' : '', value, baseline: r.baseline, delta, direction, lowerIsBetter: lower,
            words: delta === 0 ? (hasWorn ? 'same as worn' : 'no change') : `${sign(delta)} ${direction === 'better' ? (hasWorn ? 'better' : 'gained') : (hasWorn ? 'worse' : 'lost')}${lower ? ' (lower takes less damage)' : ''}`};
    })};
}

// item: a live item object. worn: the item in the same slot, or null. info: what the caller knows about it
// ({rarity, wearFactor, count, level, hidden, valueText}) so this module imports no game core.
export function itemCardModel(item, worn = null, info = {}) {
    if (!item?.equip_slot) return null;
    const level = SEES[info.level] ? info.level : IN_HAND, sees = SEES[level];
    const baseline = worn || emptySlot(item.equip_slot);
    const quality = Number.isFinite(item.quality) ? item.quality : null;
    const stats = statRows(item, baseline, quality ?? undefined, !!worn);
    const gw = item.gearwork;
    const trail = [];
    for (const h of gw?.history || []) trail.push({kind: 'work', text: `${pretty(h.action)}${h.maker ? ` by ${h.maker === 'oldCraftsman' ? 'old craftsman' : h.maker}` : ''}${h.location ? `, ${h.location}` : ''}`});
    for (const [role, part] of Object.entries(gw?.roles || {})) trail.push({kind: 'part', text: `${role}: ${part.name}${part.grade != null ? `, lot grade ${part.grade}` : ''}`});
    const wear = Number.isFinite(info.wearFactor) ? info.wearFactor : null;
    const model = {
        name: item.getName(), slot: item.equip_slot, level, count: info.count ?? 1,
        // A hidden facet is one the reader cannot see yet: it shows as unknown, never as zero.
        facets: Object.fromEntries(['band', 'quality', 'stats', 'value', 'provenance', 'condition'].map(f => [f, sees.has(f) ? 'known' : 'unknown'])),
        quality, band: info.rarity ?? null,
        worn: worn ? {name: worn.getName?.() || worn.name, quality: Number.isFinite(worn.quality) ? worn.quality : null} : null,
        rows: stats.rows, note: stats.note || null,
        condition: wear == null ? null : {factor: wear, text: wear >= .99 ? 'sound' : wear >= .7 ? 'worn' : wear >= .4 ? 'badly worn' : 'nearly spent'},
        trail, trailRecorded: trail.length > 0,
        value: info.valueText ?? null,
    };
    return model;
}
