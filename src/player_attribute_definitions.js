// Player Attributes inspector rows: [id, label, group, unit]. Pure data moved out of
// display.js (architecture baseline) so gear dimensions and later rows have a home.
// The three defense rows after block strength are the gear stat dimensions
// (gear_dimensions.js, docs/EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md).
import {DAMAGE_TAKEN_FLOOR, CRIT_RESISTANCE_CAP} from "./gear_dimensions.js";
export {DAMAGE_TAKEN_FLOOR};
export {affixSourceRows} from "./gear_affixes.js"; // per-affix source rows for the inspector

export const playerAttributeDefinitions = [
    ['strength','Strength','primary','points'],
    ['agility','Agility','primary','points'],
    ['dexterity','Dexterity','primary','points'],
    ['intuition','Intuition','primary','points'],
    ['magic','Magic','primary','points'],
    ['attack_power','Attack power','offense','damage'],
    ['attack_speed','Attack speed','offense','/s'],
    ['attack_points','Attack rating','offense','AP'],
    ['attack_count','Hits per attack','offense','hits'],
    ['crit_rate','Critical chance','offense','%'],
    ['crit_multiplier','Critical damage','offense','×'],
    ['unarmed_power','Unarmed base power','offense','damage'],
    ['armor_penetration','Armor penetration','offense','points'],
    ['defense','Defense','defense','points'],
    ['evasion_points','Evasion rating','defense','EP'],
    ['block_chance','Block chance','defense','%'],
    ['block_strength','Shield block strength','defense','damage'],
    ['damage_taken','Damage taken','defense','×'],
    ['min_damage_share','Minimum share of a hit','defense','%'],
    ['crit_resistance','Critical resistance','defense','%'],
    ['health','Current health','health','hp'],
    ['max_health','Maximum health','health','hp'],
    ['health_regeneration_flat','Health recovery','health','hp/s'],
    ['health_regeneration_percent','Health recovery from maximum','health','% max hp/s'],
    ['health_loss_flat','Health loss component','health','hp/s'],
    ['health_loss_percent','Health percentage loss component','health','% max hp/s'],
    ['stamina','Current stamina','stamina','stamina'],
    ['max_stamina','Maximum stamina','stamina','stamina'],
    ['stamina_regeneration_flat','Stamina recovery','stamina','stamina/s'],
    ['stamina_regeneration_percent','Stamina recovery from maximum','stamina','% max stamina/s'],
    ['stamina_efficiency','Stamina efficiency','stamina','×'],
    ['mana','Current mana','mana','mana'],
    ['max_mana','Maximum mana','mana','mana'],
    ['mana_regeneration_flat','Mana recovery','mana','mana/s'],
    ['mana_regeneration_percent','Mana recovery from maximum','mana','% max mana/s'],
    ['mana_efficiency','Mana efficiency','mana','×'],
    ['cold_tolerance','Cold tolerance','environment','°C difference'],
    ['heat_tolerance','Heat tolerance','environment','°C difference'],
];

// Stats the inspector shows as percentages.
export const PERCENT_ATTRIBUTES = new Set(['crit_rate', 'block_chance', 'crit_resistance', 'min_damage_share']);

// Explanations for the gear dimensions; spread into the inspector's formula notes.
export const GEAR_DIMENSION_NOTES = {
    damage_taken: `Multiplier on each hit after flat defense, so ×0.9 means 10% less damage. Stacked reductions stop at ×${DAMAGE_TAKEN_FLOOR} by default. The shown value already includes that floor, with a Default floor row when it applies.`,
    min_damage_share: 'Share of a hit that always gets through when defense would absorb more. The base is 5%; hard outer armor parts multiply it down, so heavy plate shrugs off more of a weak hit. A damage of at least 1 still applies to small hits.',
    crit_resistance: `Fraction of an attacker's critical chance removed. Padding under armor spreads impact. At most ${Math.round(CRIT_RESISTANCE_CAP * 100)}% is removed by default.`,
};
