// Weapon and armor riders (PFA6, AFW14/AFW19/AFW25/AFW-L2 proposal,
// 2026-11-04): what a property adds when a blow lands, and what armor takes
// away. Pure: the caller rolls, applies damage and owns the bleed or condition
// a rider names. A rider works by its trigger and its target's real kind
// (AD38), not by the weapon's name. Calibration: Pathfinder 1e weapon and armor
// special abilities (OGL), paraphrased; rusting lives in material_corrosion.js.

export const TRIGGERS = Object.freeze(['hit', 'crit']);

export function defineRider(r) {
    if (!r?.id || !TRIGGERS.includes(r.trigger)) throw Error(`A rider needs an id and a trigger (${TRIGGERS.join(', ')}).`);
    if (!Array.isArray(r.effects) || !r.effects.length) throw Error(`${r.id}: a rider needs effects.`);
    return Object.freeze({against: null, ...r, effects: Object.freeze(r.effects.map(e => Object.freeze({...e})))});
}

// The riders a blow sets off. `blow` is {crit}; a crit also counts as a hit.
// `against` is a list of creature kinds; a rider with one applies only when the
// target really is that kind. Returns [{rider, effects}].
export function ridersFor(riders, {crit = false} = {}, target = {}) {
    const kinds = new Set(target.kinds ?? []);
    return riders.filter(r => (r.trigger === 'hit' || crit) && (!r.against || r.against.some(k => kinds.has(k))))
        .map(r => ({rider: r.id, effects: r.effects}));
}

// Fortification: armor that can turn a critical into an ordinary hit. The caller
// draws `roll` in [0, 1); returns whether the crit stands.
export function critStands(armor, roll) {
    const chance = Math.max(0, Math.min(1, armor?.fortification ?? 0));
    return !(roll < chance);
}

export const FLAMING = defineRider({id: 'flaming', trigger: 'hit', effects: [{damage: '1d6', type: 'fire'}], source: 'Pathfinder 1e flaming (OGL)'});
export const WOUNDING = defineRider({id: 'wounding', trigger: 'hit', effects: [{condition: 'bleed', value: 1}], source: 'Pathfinder 1e wounding (OGL)'});
export const FLAMING_BURST = defineRider({id: 'flaming_burst', trigger: 'crit', effects: [{damage: '1d10', type: 'fire'}], source: 'Pathfinder 1e flaming burst (OGL)'});
export const baneAgainst = kind => defineRider({id: `bane:${kind}`, trigger: 'hit', against: [kind],
    effects: [{bonus: 2, to: 'attack'}, {damage: '2d6'}], source: 'Pathfinder 1e bane (OGL)'});
export const FORTIFICATION = Object.freeze({light: 0.25, moderate: 0.5, heavy: 0.75});
