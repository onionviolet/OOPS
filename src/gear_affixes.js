// Gear affixes (ESD3, ESD4, ESD10, ESD12-ESD14; docs/EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md, L3).
// An affix is a data record with a stable ID; there is no logic in strings. Structure follows the
// idea of Apotheosis affix data (gear class, operation, range per rarity, weight, exclusive set),
// every name and number here is native. Pure: no state, no item imports.
//
// Record fields
//   id          stable ID, saved on items; never rename, add a new one instead
//   gearClass   which classes of gear can carry it (only "armor" is populated so far)
//   stat        the stat key it changes in stats.flat / stats.multiplier (same keys as the Attributes view)
//   operation   "flat" adds to the stat; "percent" is a fraction of it (multiplier 1 + v, or 1 - v for
//               reduction stats such as damage_taken, so a bigger roll always means a better item)
//   range       [min, max] at common rarity; RARITY_RANGE_SCALE widens it up the existing rarity ladder
//   weight      relative chance when drawing at random
//   exclusive   affixes sharing a set never roll together (null = none)
//   tags        read by world rules (heat, cold, physical, ...)
//   cause       default source = a mechanism: {part, property, from, to}. When the named part's property
//               reaches `from`, the item has this affix, and the value sits between min and max by how far
//               the property is towards `to`. No dice involved.
//
// Defaults, dials and reasons (nothing here is an absolute):
//   AFFIX_COUNT_BY_RARITY  how many random affixes a rarity may carry; a world can raise or lower it with
//                          a reason (a cursed forge that stamps every piece, a hearth-world where gear is plain).
//   RARITY_RANGE_SCALE     how far a rarity widens a range; rarity makes every affix better, never worse.
//   WORLD_AFFIX_DIALS      per-world: random rolls on or off. Mechanism affixes follow the item's parts.
//   Rolls resolve once at craft or drop time and are saved with the item (never per tick, never on load).

const round = (value, places = 3) => Math.round(value * 10 ** places) / 10 ** places;

export const AFFIX_COUNT_BY_RARITY = Object.freeze({trash: 0, common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythical: 5});
export const RARITY_RANGE_SCALE = Object.freeze({trash: 1, common: 1, uncommon: 1.2, rare: 1.5, epic: 1.9, legendary: 2.4, mythical: 3});
export const DEFAULT_AFFIX_DIAL = Object.freeze({randomRolls: true});
export const WORLD_AFFIX_DIALS = Object.freeze({'base.frontier': DEFAULT_AFFIX_DIAL});

const REDUCTION_AFFIX_STATS = new Set(['damage_taken', 'min_damage_share']);

export const AFFIXES = Object.freeze([
    {id: 'armor.reinforced', name: 'Reinforced', gearClass: ['armor'], stat: 'defense', operation: 'flat', range: [1, 3],
        weight: 10, exclusive: null, tags: ['physical']},
    {id: 'armor.padded', name: 'Padded', gearClass: ['armor'], stat: 'damage_taken', operation: 'percent', range: [0.01, 0.03],
        weight: 8, exclusive: 'mitigation', tags: ['physical'],
        cause: {part: 'internal', property: 'component_tier', from: 3, to: 6}},
    {id: 'armor.hardened', name: 'Hardened', gearClass: ['armor'], stat: 'min_damage_share', operation: 'percent', range: [0.03, 0.08],
        weight: 8, exclusive: 'mitigation', tags: ['physical'],
        cause: {part: 'external', property: 'component_tier', from: 3, to: 6}},
    {id: 'armor.cushioned', name: 'Cushioned', gearClass: ['armor'], stat: 'crit_resistance', operation: 'flat', range: [0.01, 0.03],
        weight: 8, exclusive: null, tags: ['physical']},
    {id: 'armor.nimble', name: 'Nimble', gearClass: ['armor'], stat: 'agility', operation: 'percent', range: [0.01, 0.03],
        weight: 7, exclusive: 'mobility', tags: ['motion']},
    {id: 'armor.lightweight', name: 'Lightweight', gearClass: ['armor'], stat: 'stamina_efficiency', operation: 'percent', range: [0.02, 0.05],
        weight: 7, exclusive: 'mobility', tags: ['motion']},
    {id: 'armor.vital', name: 'Vital', gearClass: ['armor'], stat: 'max_health', operation: 'percent', range: [0.02, 0.05],
        weight: 6, exclusive: null, tags: ['body']},
    {id: 'armor.insulated', name: 'Insulated', gearClass: ['armor'], stat: 'cold_tolerance', operation: 'flat', range: [1, 3],
        weight: 6, exclusive: 'climate', tags: ['cold']},
]);

const BY_ID = new Map(AFFIXES.map(a => [a.id, a]));
export const getAffix = id => BY_ID.get(id) || null;
export const isReductionAffix = affix => REDUCTION_AFFIX_STATS.has(affix.stat);

export function affixRange(affix, rarity) {
    const scale = RARITY_RANGE_SCALE[rarity] ?? 1;
    return [round(affix.range[0] * scale), round(affix.range[1] * scale)];
}

export const rarityAffixCount = (rarity, counts = AFFIX_COUNT_BY_RARITY) => counts[rarity] ?? 0;

// Mechanism: the affix follows from what the part is made of. parts = {internal:{component_tier}, external:{...}}.
export function mechanismAffixes(parts, rarity, gearClass = 'armor') {
    const out = [];
    for (const affix of AFFIXES) {
        const cause = affix.cause;
        if (!cause || !affix.gearClass.includes(gearClass)) continue;
        const value = parts?.[cause.part]?.[cause.property];
        if (!Number.isFinite(value) || value < cause.from) continue;
        const t = Math.min(1, (value - cause.from) / Math.max(1e-9, cause.to - cause.from));
        const [min, max] = affixRange(affix, rarity);
        out.push({id: affix.id, v: round(min + (max - min) * t), s: 'mechanism'});
    }
    return out;
}

// Random rolls. `random` is injected (a seeded draw in the game, a fixed list in tests), called
// in a fixed order: one draw per pick, one for the value. Exclusive sets already used are skipped.
export function rollAffixes({rarity, gearClass = 'armor', random, dial = DEFAULT_AFFIX_DIAL, counts = AFFIX_COUNT_BY_RARITY, taken = []}) {
    if (!dial.randomRolls) return [];
    const picked = [...taken];
    const chosen = [];
    const target = rarityAffixCount(rarity, counts);
    const usedSets = () => new Set(picked.map(p => getAffix(p.id)?.exclusive).filter(Boolean));
    while (chosen.length < target) {
        const sets = usedSets();
        const pool = AFFIXES.filter(a => a.gearClass.includes(gearClass) && !picked.some(p => p.id === a.id) && !(a.exclusive && sets.has(a.exclusive)));
        if (!pool.length) break;
        let remaining = random() * pool.reduce((sum, a) => sum + a.weight, 0);
        let affix = pool[pool.length - 1];
        for (const candidate of pool) {
            remaining -= candidate.weight;
            if (remaining < 0) { affix = candidate; break; }
        }
        const [min, max] = affixRange(affix, rarity);
        const entry = {id: affix.id, v: round(min + (max - min) * random()), s: 'roll'};
        chosen.push(entry);
        picked.push(entry);
    }
    return chosen;
}

// Default path at craft or drop time: mechanism first (it is not capped by the rarity ladder), then
// random rolls fill up to the rarity's count minus what mechanism already gave.
export function createAffixes({parts, rarity, random, dial = DEFAULT_AFFIX_DIAL, counts = AFFIX_COUNT_BY_RARITY, gearClass = 'armor'}) {
    const mechanism = mechanismAffixes(parts, rarity, gearClass);
    // two mechanism affixes from one exclusive set keep only the stronger one (same rule as random ones)
    const strongest = [...mechanism].sort((a, b) => b.v / affixRange(getAffix(b.id), rarity)[1] - a.v / affixRange(getAffix(a.id), rarity)[1]);
    const used = new Set();
    const kept = strongest.filter(m => {
        const set = getAffix(m.id).exclusive;
        if (!set) return true;
        if (used.has(set)) return false;
        used.add(set);
        return true;
    });
    const room = Math.max(0, rarityAffixCount(rarity, counts) - kept.length);
    const rolled = rollAffixes({rarity, gearClass, random, dial, counts: {[rarity]: room}, taken: kept});
    return normalizeAffixes([...kept, ...rolled], gearClass);
}

// Canonical saved form: known IDs only, one per exclusive set, values clamped to the widest range,
// sorted by id with 3 decimals so a key built after load equals the key that was saved. Unknown or
// out-of-range entries are dropped or clamped, never thrown, so an import is never lost to them.
export function normalizeAffixes(list, gearClass = 'armor') {
    if (!Array.isArray(list)) return [];
    const seen = new Set(), sets = new Set(), out = [];
    for (const entry of list) {
        const affix = getAffix(entry?.id);
        if (!affix || !affix.gearClass.includes(gearClass) || seen.has(affix.id) || !Number.isFinite(entry.v)) continue;
        if (affix.exclusive && sets.has(affix.exclusive)) continue;
        seen.add(affix.id);
        if (affix.exclusive) sets.add(affix.exclusive);
        const [, widest] = affixRange(affix, 'mythical');
        out.push({id: affix.id, v: round(Math.min(Math.max(entry.v, 0), widest)), s: entry.s === 'mechanism' ? 'mechanism' : 'roll'});
    }
    return out.sort((a, b) => a.id < b.id ? -1 : 1);
}

// Totals for one saved affix: {stat, flat?} or {stat, multiplier}.
export function affixEffect(entry) {
    const affix = getAffix(entry.id);
    if (!affix) return null;
    if (affix.operation === 'flat') return {stat: affix.stat, flat: entry.v};
    return {stat: affix.stat, multiplier: round(isReductionAffix(affix) ? 1 - entry.v : 1 + entry.v)};
}

// Adds an item's affixes into the person's stat categories (reset by the caller on every recompute).
export function addAffixesToStats(stats, affixes) {
    for (const entry of affixes || []) {
        const effect = affixEffect(entry);
        if (!effect) continue;
        if (effect.flat) stats.flat.affixes[effect.stat] = (stats.flat.affixes[effect.stat] || 0) + effect.flat;
        if (effect.multiplier) stats.multiplier.affixes[effect.stat] = (stats.multiplier.affixes[effect.stat] || 1) * effect.multiplier;
    }
}

// Attributes inspector rows, one per affix on the stat, each naming its affix, item and cause.
export function affixSourceRows(equipment, stat) {
    const rows = [];
    for (const item of Object.values(equipment || {})) {
        for (const entry of item?.affixes || []) {
            const effect = affixEffect(entry), affix = getAffix(entry.id);
            if (!effect || effect.stat !== stat) continue;
            const cause = entry.s === 'mechanism' ? 'from its parts' : 'rolled';
            rows.push({label: `Affix ${affix.name} (${item.getName?.() ?? item.name}, ${cause})`, flat: effect.flat ?? 0, multiplier: effect.multiplier ?? 1});
        }
    }
    return rows;
}

// Crafting commit: one key per distinct (quality, affixes) so stacks never merge different rolls.
export function affixedCraftEntries({parsedKey, crafted, rarityOf, partsOf, random, dial}) {
    const groups = new Map();
    for (const [quality, count] of Object.entries(crafted)) {
        for (let i = 0; i < count; i++) {
            const affixes = parsedKey.components?.internal
                ? createAffixes({parts: partsOf(parsedKey.components), rarity: rarityOf(Number(quality)), random, dial})
                : [];
            const key = JSON.stringify({...parsedKey, quality: Number(quality), ...(affixes.length ? {affixes} : {})});
            groups.set(key, (groups.get(key) || 0) + 1);
        }
    }
    return [...groups].map(([item_key, count]) => ({item_key, count}));
}
