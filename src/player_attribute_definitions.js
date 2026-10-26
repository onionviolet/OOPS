// Player Attributes inspector rows: [id, label, group, unit]. Pure data moved out of
// display.js (architecture baseline) so gear dimensions and later rows have a home.
// The three defense rows after block strength are the gear stat dimensions
// (gear_dimensions.js, docs/EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md).
import {DAMAGE_TAKEN_FLOOR, CRIT_RESISTANCE_CAP} from "./gear_dimensions.js";
export {DAMAGE_TAKEN_FLOOR};
import {affixSourceRows as nativeAffixRows} from './gear_affixes.js';
import {gearWorkSourceRows} from './gear_work.js';
export const affixSourceRows = (equipment, stat) => [...nativeAffixRows(equipment, stat), ...gearWorkSourceRows(equipment, stat)]; // per-affix source rows for the inspector

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
    ['toughness','Gear toughness','defense','of 100'],
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
    toughness: 'Average toughness of the equipped gear materials, shown with each part and whether it is authored or derived from strength. Tougher and harder materials lose condition more slowly per landed hit; it is a wear rate, not extra defense. Not stored in saves.',
    crit_resistance: `Fraction of an attacker's critical chance removed. Padding under armor spreads impact. At most ${Math.round(CRIT_RESISTANCE_CAP * 100)}% is removed by default.`,
};

// Meaning shared by the full inspector, compact previews and original stat slots.
// Calculations remain in the read-only inspector projection, not in this copy.
export const ATTRIBUTE_DESCRIPTIONS = {
    strength: 'The strength behind your physical blows. More strength increases attack power.',
    agility: 'Your ability to move out of danger. More agility improves your evasion rating.',
    dexterity: 'Your control and precision. More dexterity improves your attack rating, helping you land blows.',
    intuition: 'Your sense for the flow of a fight. Helps you land attacks and evade incoming blows.',
    magic: 'Your magical potential. This value alone does not grant a spell or an attack.',
    attack_power: 'The force behind your attacks. Your strength and weapon shape its power; exhaustion weakens your blows. The damage that gets through also depends on your target.',
    attack_speed: 'How quickly you attack. A higher rate means less time between attacks; exhaustion slows you down.',
    attack_points: 'How well you place your blows. A higher attack rating helps you hit, but your chance depends on the target’s evasion.',
    attack_count: 'How many hits you attempt in each attack. This does not determine how many enemies you target.',
    crit_rate: 'How often your blows can become critical hits, dealing extra damage. A target’s critical resistance can reduce this chance.',
    crit_multiplier: 'How much damage a critical hit deals compared with an ordinary hit.',
    unarmed_power: 'The starting force of your bare-handed attacks. Strength and unarmed training help turn it into attack power.',
    armor_penetration: 'How much flat armor your landed blows can bypass. It does not bypass shields or every other form of protection.',
    defense: 'Protection that absorbs part of a landed blow. Even a well-armored fighter can take some damage.',
    evasion_points: 'How well you avoid incoming blows. A higher evasion rating helps you dodge, but the attacker’s accuracy matters too. A shield replaces dodging with blocking.',
    block_chance: 'How often you can catch an incoming attack on your shield. You need a shield equipped to block.',
    block_strength: 'How much damage your shield can absorb from a blocked hit. Stronger hits may still get through.',
    damage_taken: 'How much of a hit you suffer after flat defense. A lower multiplier means less damage.',
    min_damage_share: 'The portion of a hit that can get through even when your defense would absorb more. A smaller share means better protection against weak blows.',
    crit_resistance: 'Protection against critical hits. It reduces the attacker’s critical chance rather than the damage of an ordinary blow.',
    toughness: 'How well your equipped materials resist wear. Tougher gear loses condition more slowly when equipment durability is enabled.',
    health: 'How much harm you can still withstand. Losing all your health leaves you defeated.',
    max_health: 'How much health you can hold when fully recovered. Increasing this limit is different from healing.',
    health_regeneration_flat: 'Health you recover over time, in addition to recovery based on your maximum health.',
    health_regeneration_percent: 'Health recovery that grows with your maximum health. It is separate from fixed health recovery.',
    health_loss_flat: 'A health drain component. It contributes to health lost over time, rather than showing your overall recovery.',
    health_loss_percent: 'A health drain component measured against maximum health. This value does not show your overall recovery.',
    stamina: 'Your remaining energy for physical effort. Running out weakens your blows and slows your attacks.',
    max_stamina: 'How much stamina you can hold when rested. A larger reserve supports more effort before exhaustion.',
    stamina_regeneration_flat: 'Stamina you recover over time, in addition to recovery based on your maximum stamina.',
    stamina_regeneration_percent: 'Stamina recovery that grows with your maximum stamina. It is separate from fixed stamina recovery.',
    stamina_efficiency: 'How economically you spend stamina. A larger factor makes the same effort cost less stamina.',
    mana: 'Your current reserve of magical energy. Having mana does not by itself grant a way to spend it.',
    max_mana: 'How much magical energy you can hold. This capacity does not by itself grant an ability.',
    mana_regeneration_flat: 'Mana you recover over time, in addition to recovery based on your maximum mana.',
    mana_regeneration_percent: 'Mana recovery that grows with your maximum mana. It is separate from fixed mana recovery.',
    mana_efficiency: 'A measure intended for mana costs. It currently provides no verified mana-cost reduction.',
    cold_tolerance: 'How much further into the cold you can go before cold penalties begin.',
    heat_tolerance: 'A measure of tolerance to heat. It currently provides no active heat protection.',
    xp_all: 'How quickly you gain experience across personal learning and hero progression. Individual activities can add their own bonuses.',
    xp_hero: 'How quickly you gain hero experience. The activity awarding experience can add its own modifiers.',
    xp_all_skill: 'How quickly you gain skill experience. Individual skills and activities can have additional bonuses or requirements.',
};
