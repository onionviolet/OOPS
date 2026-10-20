// Gear stat dimensions (ESD1-ESD6, docs/EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md).
// Pure data and math, no state. Armor parts get these through the existing
// component_stats path: equipment adds flat and multiplier entries per stat,
// the person totals them as (base + flats) x multipliers with sources kept per category.
//
//   damage_taken      multiplier layer on hits after flat defense; below 1 means less damage.
//   min_damage_share  multiplier on the share of a hit that always gets through (base 5%);
//                     hard shells shrug off chip damage when defense outweighs the hit.
//   crit_resistance   flat fraction of an attacker's crit chance removed; padding spreads impact.
//
// Defaults, dials and reasons (nothing here is an absolute):
//   DAMAGE_TAKEN_FLOOR      0.5   stacked reductions stop short of halving a hit, so no kit makes
//                                 fights meaningless; a world can lower it with an in-world reason.
//   CRIT_RESISTANCE_CAP     0.75  at most three quarters of crit chance is removed; a world or item
//                                 can lift it (a charm that makes criticals impossible, at a cost).
//   BASE_MIN_DAMAGE_SHARE   0.05  the original chip floor from the combat math.

export const DAMAGE_TAKEN_FLOOR = 0.5;
export const CRIT_RESISTANCE_CAP = 0.75;
export const BASE_MIN_DAMAGE_SHARE = 0.05;

const REDUCTION_STATS = new Set(["damage_taken", "min_damage_share"]);

export const isReductionStat = stat => REDUCTION_STATS.has(stat);

const round = (value, places) => Math.round(value * 10 ** places) / 10 ** places;

// Hard outer parts: more material, harder material and higher tier all reduce more.
// partCount is the number of material units in the part (chestplate 5, helmet 3).
export function shellDimensions({tier, strength, partCount}) {
    const hardness = strength / 100;
    return {
        damage_taken: {multiplier: round(Math.max(0.8, 1 - 0.0025 * tier * partCount * hardness), 3)},
        min_damage_share: {multiplier: round(Math.max(0.8, 1 - 0.02 * partCount * hardness), 3)},
    };
}

// Soft inner parts: thicker padding (more material, warmer fill, higher tier) removes more crit chance.
export function paddingDimensions({tier, warmth, partCount}) {
    const padding = (warmth || 100) / 100;
    return {crit_resistance: {flat: round(0.01 * tier ** 0.6 * partCount * padding, 3)}};
}

// Rarity makes reductions stronger, never weaker (item rarity multipliers are above 1).
export function scaleReduction(multiplier, rarityMultiplier) {
    return round(Math.max(0, 1 - (1 - multiplier) * rarityMultiplier ** 0.33), 3);
}

export function effectiveDamageTaken(multiplier, floor = DAMAGE_TAKEN_FLOOR) {
    return Math.max(floor, multiplier ?? 1);
}

export function effectiveCritChance(critRate, resistance = 0, cap = CRIT_RESISTANCE_CAP) {
    return critRate * (1 - Math.min(Math.max(resistance, 0), cap));
}

// Toughness (GDP15, slice L1): how much a material bends and absorbs a blow before it chips or cracks.
// Hardness (strength/100) resists scratching and denting; toughness resists chipping and fracture.
// Authored per material as `toughness` next to strength; absent, it is derived from strength.
//
//   DEFAULT_TOUGHNESS: 130 - 0.6 * strength, clamped 20..120. Rigid, hard materials (strong metals)
//     default lower because stiffness trades against shatter resistance: strength 60 gives 94,
//     100 gives 70, 200 gives 20. Soft or fibrous materials (wood, leather, cloth) land high.
//     A material can override it with an in-world reason (a quenched blade can be hard and brittle,
//     a folded one hard and tough).
//   WEAR_SCALE_RANGE 0.5..2: wear per hit is divided by the mean of hardness and toughness
//     (relative to the reference 100 strength / 70 toughness material, scale 1), so no material
//     is immune and none wears more than twice as fast as the reference.
export const REFERENCE_RESISTANCE = 0.85;
export const WEAR_SCALE_RANGE = Object.freeze({min: 0.5, max: 2});

export function materialToughness({strength, toughness}) {
    if (Number.isFinite(toughness)) return {value: toughness, source: "authored"};
    const derived = Math.min(120, Math.max(20, 130 - 0.6 * (Number.isFinite(strength) ? strength : 100)));
    return {value: round(derived, 1), source: "derived from strength"};
}

export function wearScale({strength, toughness}) {
    const resistance = 0.5 * (strength / 100) + 0.5 * (toughness / 100);
    return round(Math.min(WEAR_SCALE_RANGE.max, Math.max(WEAR_SCALE_RANGE.min, REFERENCE_RESISTANCE / resistance)), 3);
}
