// C2 (TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27, K3/E1/E8): ambient shop stock as a pure keyed draw.
// Every draw is unitDecision(root(worldSeed), 'market', [shopId, dayIndex, group, item, decision]), so
// stock depends only on (world seed, shop id, dayIndex, template): no cursor, no receipt, no save field.
// Pass dayIndex from src/world_day_index.js. Callers resolve start_conditions first and pass the
// template already filtered; item objects stay with the caller (rows are plain ids and numbers).
import {createStreams, unitDecision, STREAMS} from './seeded_streams.js';
import {check, natural} from './basics.js';

export function keyedUnitFor(worldSeed, stream, key, draw = 0) {
    return unitDecision(createStreams(worldSeed), stream, JSON.stringify(key), draw).value;
}

// template: [{items:[{item_name, chance, count:[n] | [lo,hi], quality?:[lo,hi]}]}] (trader inventory_templates shape).
// Returns [{group, index, item_name, count, quality?}] in template order.
export function keyedShopStock({worldSeed, shopId, dayIndex, template}) {
    check(typeof shopId === 'string' && shopId.length > 0, 'Invalid shop id.');
    check(natural(dayIndex) && dayIndex > 0, 'Invalid day index.');
    check(Array.isArray(template), 'Invalid stock template.');
    const root = createStreams(worldSeed);
    const u = (i, j, decision) => unitDecision(root, STREAMS.market, JSON.stringify([shopId, dayIndex, i, j, decision])).value;
    const rows = [];
    template.forEach((group, i) => group.items.forEach((spec, j) => {
        if (!(spec.chance > u(i, j, 'presence'))) return;
        const [lo, hi = lo] = spec.count;
        const row = {group: i, index: j, item_name: spec.item_name,
            count: spec.count.length === 1 ? lo : Math.round(u(i, j, 'count') * (hi - lo) + lo)};
        if (spec.quality) row.quality = Math.round(u(i, j, 'quality') * (spec.quality[1] - spec.quality[0]) + spec.quality[0]);
        rows.push(row);
    }));
    return rows;
}
