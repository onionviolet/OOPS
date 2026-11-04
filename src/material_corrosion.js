// Material corrosion: rust and its cousins as damage to materials, separate
// from wound contamination (AD38, AD51 proposal, 2026-11-03). Pure: the
// caller owns draws, the item records and how condition maps to durability.
// Calibration point: the d20 "rusting" weapon property and its rust-touch
// spell (Pathfinder 1e, OGL); worlds choose their own numbers.

// What corrodes is a material fact, not an item label. A world can extend this.
export const CORRODES = Object.freeze({
    rust: Object.freeze(['iron', 'steel', 'cold iron', 'iron alloy', 'wrought iron', 'cast iron']),
    tarnish: Object.freeze(['silver', 'copper', 'bronze', 'brass']),
    rot: Object.freeze(['wood', 'leather', 'hide', 'cloth', 'rope']),
});

export const corrodes = (agent, item) => !!item && !item.magic && !item.immuneTo?.includes(agent)
    && (CORRODES[agent] ?? []).includes(item.material);

// Apply one corrosion touch to an item record {material, kind, protection?,
// maxProtection?, condition (0..100), magic?}. `amount` is the drawn strength
// (1d6 protection for armor at the calibration point). Returns a new record
// and what happened; the item is never mutated.
export function corrode(agent, item, {amount}) {
    if (!corrodes(agent, item)) return {item, changed: false, reason: item?.magic ? 'magic' : 'material'};
    const next = {...item};
    if (item.kind === 'armor' || item.kind === 'shield') {
        const lost = Math.min(item.protection ?? 0, amount);
        next.protection = (item.protection ?? 0) - lost;
        // Condition follows the protection the corrosion has eaten.
        const max = item.maxProtection || item.protection || 1;
        next.condition = Math.min(item.condition ?? 100, Math.round(100 * next.protection / max));
        return {item: next, changed: lost > 0, protectionLost: lost, destroyed: next.protection === 0};
    }
    // Weapons, tools and loose objects small enough for one touch crumble.
    next.condition = 0;
    return {item: next, changed: true, destroyed: true};
}

// Creatures made of a corrodible material take damage instead (3d6 + caster
// level, the bonus capped at 15, at the calibration point).
export const corrosionDamage = ({dice, level = 0, cap = 15}) => dice + Math.min(level, cap);

// A weapon property that trades a confirmed critical's extra damage for a
// corrosion touch. The wielder chooses; the property's own weapon is immune.
export function defineCorrodingProperty(p) {
    return Object.freeze({id: p.id, agent: p.agent ?? 'rust', trigger: p.trigger ?? 'critical',
        replacesCritBonus: p.replacesCritBonus ?? true, selfImmune: p.selfImmune ?? true,
        unattendedObjects: p.unattendedObjects ?? false, label: p.label, description: p.description});
}

export function critOptions(property, {normalDamage, critDamage, target}) {
    const options = [{id: 'damage', damage: critDamage}];
    const pieces = (target?.gear ?? []).filter(g => corrodes(property.agent, g));
    if (target?.material && CORRODES[property.agent]?.includes(target.material)) options.push({id: 'creature', damage: normalDamage, corrodeCreature: true});
    for (const g of pieces) options.push({id: `gear:${g.id}`, damage: property.replacesCritBonus ? normalDamage : critDamage, corrodeGear: g.id});
    if (target?.unattended && !property.unattendedObjects) return [{id: 'damage', damage: critDamage}];
    return options;
}
