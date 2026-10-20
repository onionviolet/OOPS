import test from "node:test";
import assert from "node:assert/strict";
import {applyEquipmentStats} from "../src/equipment_stats.js";

test("shared equipment aggregation retains dimensions, affixes, and skill bonuses by source", () => {
    const levelable = {
        stats: {
            flat: {equipment: {}, affixes: {}},
            multiplier: {equipment: {}, affixes: {}},
        },
        bonus_skill_levels: {flat: {equipment: {}}},
    };
    const item = {
        affixes: [{id: "armor.hardened", v: 0.072, s: "mechanism"}],
        getDefense: () => 12,
        getStats: () => ({damage_taken: {multiplier: 0.963}, cold_tolerance: {flat: 1}}),
        getBonusSkillLevels: () => ({"Iron skin": 2}),
    };

    applyEquipmentStats(levelable, {torso: item});

    assert.equal(levelable.stats.flat.equipment.defense, 12);
    assert.equal(levelable.stats.flat.equipment.cold_tolerance, 1);
    assert.equal(levelable.stats.multiplier.equipment.damage_taken, 0.963);
    assert.equal(levelable.stats.multiplier.affixes.min_damage_share, 0.928);
    assert.equal(levelable.bonus_skill_levels.flat.equipment["Iron skin"], 2);
});
