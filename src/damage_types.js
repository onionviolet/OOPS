// Damage and protection types for native combat (docs/COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md, round 3).
// Idea absorbed from OneMoreGuy's combat-modifiers commit: an attack is a weighted mix of types, a defender
// has a per-type multiplier, and the hit is scaled by the weights. Only the mechanism is taken.
//
// Order of layers in a native hit (AR3: each is one authority):
//   roll -> block/evade -> crit -> elemental affinity (flat defense, absorb_e3, optional) -> flat defense and chip floor
//   -> THIS module's scalar (mix weight x defender multiplier) -> damage_taken stat.
// The scalar is applied after the percent layer and is linear, so it equals splitting the strike by type.
//
// Defaults (a dial, not a law): an attack with no declared mix is all "physical", the untyped bucket; a defender
// multiplier is 1 unless declared. So undeclared content, saves and every other battle engine behave as before.
// Nothing here is saved: enemy declarations live in enemy data, weapon family comes from the weapon's components,
// armor protection from the item's name. No draws are made.
import {damageTypes} from './effect_dsl.js';

export const PHYSICAL = 'physical';
export const DAMAGE_TYPES = Object.freeze([PHYSICAL, ...damageTypes]);
const KNOWN = new Set(DAMAGE_TYPES);

// Proposal values (agent-authored, adjustable). Weapon family -> how the head actually bites.
export const WEAPON_MIX = Object.freeze({
    sword: {slashing: .7, piercing: .3}, axe: {slashing: .6, bludgeoning: .4}, dagger: {piercing: .7, slashing: .3},
    spear: {piercing: 1}, hammer: {bludgeoning: 1},
});
export const UNARMED_MIX = Object.freeze({bludgeoning: 1});

// Proposal values. Worn protection is the fraction of that type's damage turned away per piece, summed over pieces and
// capped (dial). Matched by the item's id or external component name, like the elemental affinity table.
export const ARMOR_PROTECTION = Object.freeze([
    [/chainmail/i, {slashing: .08, piercing: .04}],
    [/turtleshell|turtle shell/i, {slashing: .06, piercing: .06, bludgeoning: .03}],
    [/alligator/i, {slashing: .05, piercing: .05}],
    [/hide|pelt|leather/i, {slashing: .03, bludgeoning: .02}],
]);
export const PROTECTION_CAP = .5;   // reasons: stacking four pieces must not make a type irrelevant
export const WEAKNESS_CAP = 3;      // multiplier ceiling for a declared weakness
const WORN_SLOTS = new Set(['head', 'torso', 'arms', 'legs', 'feet', 'cape']);

// Normalise a weight map to weights summing to 1. Unknown types, non-positive and non-finite weights drop out.
export function normalizeMix(mix) {
    if (!mix || typeof mix !== 'object') return null;
    const entries = Object.entries(mix).filter(([t, w]) => KNOWN.has(t) && Number.isFinite(w) && w > 0);
    const total = entries.reduce((s, [, w]) => s + w, 0);
    return total > 0 ? Object.fromEntries(entries.map(([t, w]) => [t, w / total])) : null;
}

// Declared multipliers (>1 weak, <1 resists, 0 immune). Bad entries drop out so a typo cannot disable a hit.
export function normalizeMultipliers(mods) {
    if (!mods || typeof mods !== 'object') return {};
    return Object.fromEntries(Object.entries(mods).filter(([t, m]) => KNOWN.has(t) && Number.isFinite(m) && m >= 0)
        .map(([t, m]) => [t, Math.min(m, WEAKNESS_CAP)]));
}

export function attackMix(fighter) {
    const declared = normalizeMix(fighter?.attack_types);
    if (declared) return declared;
    if (fighter?.tags?.main_character) {
        const weapon = fighter.getEquipment?.()?.weapon;
        return normalizeMix(weapon ? WEAPON_MIX[weapon.weapon_type] : UNARMED_MIX) || {[PHYSICAL]: 1};
    }
    return {[PHYSICAL]: 1};
}

export function itemProtection(item) {
    if (!item) return {};
    if (item.protection_types) return normalizeMultipliers(item.protection_types);
    const key = `${item.id ?? ''} ${item.components?.external ?? ''}`;
    const row = ARMOR_PROTECTION.find(([re]) => re.test(key));
    return row ? row[1] : {};
}

export function wornProtection(equipment = {}) {
    const total = {}, seen = new Set();
    for (const [slot, item] of Object.entries(equipment || {})) {
        if (!WORN_SLOTS.has(slot) || !item || item.equip_slot !== slot || seen.has(item)) continue;
        seen.add(item);
        for (const [type, share] of Object.entries(itemProtection(item))) total[type] = Math.min(PROTECTION_CAP, (total[type] || 0) + share);
    }
    return total;
}

// The defender's per-type multiplier map: the player's from worn pieces, anyone else's from declared data.
export function defenseMultipliers(target) {
    if (target?.tags?.main_character) {
        return Object.fromEntries(Object.entries(wornProtection(target.getEquipment?.())).map(([t, p]) => [t, 1 - p]));
    }
    return normalizeMultipliers(target?.defense_types);
}

export function typeMultiplier(mix, multipliers) {
    return Object.entries(mix).reduce((sum, [t, w]) => sum + w * (multipliers[t] ?? 1), 0);
}

const dominant = mix => Object.entries(mix).sort((a, b) => b[1] - a[1])[0][0];
export const attackKind = fighter => dominant(attackMix(fighter));
// A change under this share is applied but not announced, so a 1% cape bonus does not clutter the log.
const NOTE_THRESHOLD = .05;

/** One strike's typed result: {multiplier, kind, note}. kind is the heaviest attack type; note is '' when the
 * defender's modifiers did not change the hit (the log then reads as before). */
export function typedStrike({fighter, target}) {
    const mix = attackMix(fighter), mods = defenseMultipliers(target), multiplier = typeMultiplier(mix, mods);
    const kind = dominant(mix);
    const note = Math.abs(multiplier - 1) < NOTE_THRESHOLD ? '' : multiplier < 1 ? (multiplier === 0 ? 'no effect' : 'resisted') : 'weak spot';
    return {multiplier, kind, note};
}

/** Plain words for a tooltip: what an enemy hits with and what it takes extra or less of. */
export function describeDeclared({attack_types, defense_types} = {}) {
    const mix = normalizeMix(attack_types), mods = normalizeMultipliers(defense_types);
    const attack = mix ? Object.entries(mix).sort((a, b) => b[1] - a[1]).map(([t, w]) => `${Math.round(w * 100)}% ${t}`).join(', ') : '';
    const defense = Object.entries(mods).filter(([, m]) => m !== 1).map(([t, m]) => `${t} x${Math.round(m * 100) / 100}`).join(', ');
    return {attack, defense};
}
