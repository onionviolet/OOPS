"use strict";

import { addAffixesToStats } from "./gear_affixes.js";

// One equipment-to-stats path for people and creatures. The item owns its
// dimensions and affixes; the wearer owns the resulting equipment source rows.
export function applyEquipmentStats(levelable, equipment = {}) {
    levelable.stats.flat.equipment = {};
    levelable.stats.multiplier.equipment = {};
    levelable.bonus_skill_levels.flat.equipment = {};
    levelable.stats.flat.affixes = {};
    levelable.stats.multiplier.affixes = {};

    Object.values(equipment).forEach(item => {
        if (!item) return;

        if (item.getDefense) {
            levelable.stats.flat.equipment.defense = (levelable.stats.flat.equipment.defense || 0) + item.getDefense();
        }
        addAffixesToStats(levelable.stats, item.affixes);

        const stats = item.getStats?.() || {};
        Object.entries(stats).forEach(([stat, value]) => {
            if (value.flat) {
                levelable.stats.flat.equipment[stat] = (levelable.stats.flat.equipment[stat] || 0) + value.flat;
            }
            if (value.multiplier != null) {
                levelable.stats.multiplier.equipment[stat] = (levelable.stats.multiplier.equipment[stat] ?? 1) * value.multiplier;
            }
        });

        const bonuses = item.getBonusSkillLevels?.() || {};
        Object.entries(bonuses).forEach(([bonus, value]) => {
            if (value) {
                levelable.bonus_skill_levels.flat.equipment[bonus] = (levelable.bonus_skill_levels.flat.equipment[bonus] || 0) + value;
            }
        });
    });
}
