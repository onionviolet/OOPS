// Original modest preparation proposal inspired by Proto23's affinity idea.
// This is an adapter to native armor mitigation, not a second damage engine.
export const ELEMENTAL_OPTION = 'elemental_affinities';
export const ELEMENTAL_DEFAULT = false;
export const ELEMENTAL_SETTING_DESCRIPTION = 'Elemental preparation (optional): matching worn protection adds defense against an encountered attack affinity. Off by default to preserve the inherited combat pacing.';
const ELEMENTS = ['air', 'earth', 'water'];
const SLOTS = new Set(['head', 'torso', 'arms', 'legs', 'feet', 'cape']);
const PER_PIECE = 0.04;
const CAP = 0.12;

// Native ordinary encounters only. Other enemies retain physical attacks.
// Aquatic is an authored native tag; its water overlay is an original proposal,
// not a claim that the inherited creatures cast elemental spells.
const EARTH_ATTACKS = new Set(['Boar', 'Angry mountain goat', 'Angry-looking mountain goat']);
const AIR_ATTACKS = new Set(['Huge dragonfly', 'Dragonfly queen']);
const AIR_GEAR = new Set(['Rat pelt cape', 'Wolf pelt cape', 'Goat hide cape']);
const WATER_GEAR = new Set(['Batrachian cape', 'Alligator armor', 'Alligator helmet', 'Alligator armored pants']);
const EARTH_GEAR = new Set(['Boar hide cape', 'Bear hide cape', 'Iron chainmail armor', 'Iron chainmail helmet', 'Iron chainmail pants', 'Steel chainmail armor', 'Steel chainmail helmet', 'Steel chainmail pants', 'Turtleshell platemail armor', 'Turtleshell platemail helmet', 'Turtleshell platemail pants']);
const EARTH_COMPONENTS = new Set(['Iron chainmail vest', 'Iron chainmail helmet armor', 'Iron chainmail greaves', 'Steel chainmail vest', 'Steel chainmail helmet armor', 'Steel chainmail greaves', 'Turtleshell chestplate armor', 'Turtleshell helmet armor', 'Turtleshell greaves']);
const WATER_COMPONENTS = new Set(['Alligator chestplate armor', 'Alligator helmet armor', 'Alligator greaves']);

export function normalizeElementalOption(value) { return value === true; }

function hasTag(subject, tag) {
    return Array.isArray(subject?.tags) ? subject.tags.includes(tag) : subject?.tags?.[tag] === true;
}

export function getAttackAffinity(attacker) {
    if (!attacker || hasTag(attacker, 'main_character')) return 'physical';
    const id = attacker.id || attacker.name;
    if (EARTH_ATTACKS.has(id)) return 'earth';
    if (AIR_ATTACKS.has(id)) return 'air';
    if (hasTag(attacker, 'aquatic')) return 'water';
    return 'physical';
}

export function getItemAffinities(item) {
    if (!item) return [];
    const id = item.id;
    const external = item.components?.external;
    return ELEMENTS.filter(element => {
        if (hasTag(item, `affinity:${element}`)) return true;
        if (element === 'air') return AIR_GEAR.has(id);
        if (element === 'earth') return EARTH_GEAR.has(id) || EARTH_COMPONENTS.has(external);
        return WATER_GEAR.has(id) || WATER_COMPONENTS.has(external);
    });
}

export function getEquipmentAffinities(equipment = {}) {
    const result = {air: 0, earth: 0, water: 0};
    const counted = new Set();
    for (const [slot, item] of Object.entries(equipment || {})) {
        // Inventory copies, tools and job-custody kit never count as worn armor.
        if (!SLOTS.has(slot) || !item || item.equip_slot !== slot || counted.has(item)) continue;
        counted.add(item);
        for (const affinity of getItemAffinities(item)) {
            result[affinity] = Math.min(CAP, Math.round((result[affinity] + PER_PIECE) * 100) / 100);
        }
    }
    return result;
}

/** Add this value to native defense_modifier immediately before takeDamage.
 * Use Combat's already-derived base_damage so multi-hit and crit remain native.
 */
export function getElementalDefenseModifier({enabled, attacker, equipment, baseDamage = 0} = {}) {
    if (!normalizeElementalOption(enabled) || !Number.isFinite(baseDamage) || baseDamage <= 0) return 0;
    const affinity = getAttackAffinity(attacker);
    return baseDamage * (getEquipmentAffinities(equipment)[affinity] || 0);
}

/** Caller supplies ONLY current enemies or known bestiary entries. No registry read.
 * Rows contain plain text; render with textContent, never innerHTML.
 */
export function describeElementalPreparation({enabled, equipment, encounteredEnemies = []} = {}) {
    const active = normalizeElementalOption(enabled);
    const protection = getEquipmentAffinities(equipment);
    const rows = [];
    const seen = new Set();
    for (const enemy of encounteredEnemies) {
        if (!enemy || typeof enemy.name !== 'string' || seen.has(enemy.name)) continue;
        seen.add(enemy.name);
        const affinity = getAttackAffinity(enemy);
        const fraction = active ? (protection[affinity] || 0) : 0;
        rows.push({name: enemy.name, affinity, defenseFraction: fraction,
            text: `${enemy.name}: ${affinity} attack preparation; ${Math.round(fraction * 100)}% of base attack added as defense per hit.`});
    }
    return {enabled: active, protection, rows, text: active
        ? `Worn preparation: ${ELEMENTS.map(e => `${e} ${Math.round(protection[e] * 100)}%`).join(', ')}. Each matching piece adds 4% of base attack as defense per hit, capped at 12%; native armor and minimum damage still apply.`
        : 'Elemental preparation is off. Inherited damage and armor apply.'};
}
