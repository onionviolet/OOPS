// Hazard resistance facets (leaf, pure). One tolerance owner (BHX4/BHN7): the
// existing 'Poison resistance' skill. A facet is a way that skill also divides a
// hazard's numeric effect (cold, wet) and grows from real exposure. It adds no
// skill, no saved key and no sick state (BHC18 default off): a hazard is an
// effect with a number, divided like poison.
export const OWNER_SKILL = 'Poison resistance';
const SKILL_MAX_LEVEL = 30, SKILL_MAX_COEFFICIENT = 10; // mirror skills.js; a test pins them

// weight: share of the skill coefficient the facet applies (dial, below 1: the
// body learns poison faster than weather). xpPerMinute: XP per exposed minute at
// level 0. halfLevel: level at which that rate halves. levelCap: the facet stops
// training the owner skill at this level (dial; poison itself is not capped).
export const FACETS = Object.freeze({
    cold: Object.freeze({facet: 'cold', tag: 'cold_hazard', hazards: Object.freeze(['Wet', 'Cold', 'Very cold', 'Freezing', 'Hypothermia']),
        weight: .5, xpPerMinute: .1, halfLevel: 8, levelCap: 12}),
});

const num = (x, d = 0) => Number.isFinite(x) ? x : d;
export function facetRow(facet, dial = {}) {
    const row = FACETS[facet];
    if (!row || dial.off === true) return null;
    return {...row, weight: Math.min(.99, Math.max(0, num(dial.weight, row.weight))), levelCap: Math.max(0, num(dial.levelCap, row.levelCap))};
}
export const facetForTags = tags => Object.values(FACETS).find(f => tags?.[f.tag]) || null;

// Divisor for a hazard effect, from the owner skill's own coefficient. Floored
// at 1, so a hazard is never amplified, reduced below zero or turned into healing.
export function facetDivisor(skillCoefficient, facet, dial) {
    const row = facetRow(facet, dial);
    if (!row) return 1;
    return Math.max(1, 1 + (num(skillCoefficient, 1) - 1) * row.weight);
}
// Same divisor from a bare owner-skill level (the skill's own curve).
export function resistanceCoefficient(level, facet, dial) {
    const lv = Math.min(SKILL_MAX_LEVEL, Math.max(0, num(level)));
    return facetDivisor(Math.pow(SKILL_MAX_COEFFICIENT, lv / SKILL_MAX_LEVEL), facet, dial);
}
// Owner-skill XP for played minutes of exposure: diminishing with level, zero at
// the cap, zero for unknown facets, off worlds or non-positive minutes.
export function exposureGain(facet, minutes, level, dial) {
    const row = facetRow(facet, dial), m = num(minutes), lv = Math.max(0, num(level));
    if (!row || m <= 0 || lv >= row.levelCap) return 0;
    return m * row.xpPerMinute / (1 + lv / row.halfLevel);
}
