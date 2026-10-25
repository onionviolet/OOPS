// The numbers the native combat view shows for one fighter, computed once. The native renderer formats
// its text from this and the opponent projection publishes it; neither reads anything else. Dependencies
// are injected so this module imports nothing and adds no import cycle.
const pct = value => Math.min(100, Math.max(0, Math.round(100 * value)));
export function fighterReadout(combat, {fighter_index, is_attacker}, {skills, tagSkills, hitChance}) {
    const full_stats = combat.attackers[0].getFullStats(); //ends up ignored if there's more than 1 attacker
    const fighters = (is_attacker ? combat.attackers : combat.defenders);
    const fighter = fighters[fighter_index];
    const fighter_stats = fighter.getFullStats();
    const opponents = (is_attacker ? combat.defenders : combat.attackers);
    const includes_player = opponents.filter(op => op.tags.main_character).length > 0;

    let disp_speed;
    const attack_speed = fighter_stats.attack_speed;
    if(attack_speed > 20) {
        disp_speed = Math.round(attack_speed);
    } else if (attack_speed > 2) {
        disp_speed = Math.round(attack_speed*10)/10;
    } else {
        disp_speed = Math.round(attack_speed*100)/100;
    }

    let hit_chance_modifier = fighters.filter(enemy => enemy.is_alive).length**(-1/4); // down to ~ 60% if there's full 8 enemies
    let evasion_chance_modifier = fighters.filter(enemy => enemy.is_alive).length**(-1/3); //down to .5 if there's full 8 enemies (multiple attackers make it harder to evade attacks)
    if(includes_player && !is_attacker) {
        Object.keys(fighter.tags).forEach(enemy_tag => {
            if(tagSkills[enemy_tag]) {
                for(let i = 0; i < tagSkills[enemy_tag].length; i++) {
                    const skill = skills[tagSkills[enemy_tag][i]];
                    const {modifier_to_hit_chance, modifier_to_evasion} = skill.get_stat_modifiers();
                    hit_chance_modifier *= modifier_to_hit_chance || 1;
                    evasion_chance_modifier *= modifier_to_evasion || 1;
                }
            }
        });
    }
    const evasion_chance = 1 - hitChance(full_stats.attack_points*hit_chance_modifier, fighter.getFullStats().evasion_points);
    let hit_chance = hitChance(fighter.getFullStats().attack_points, full_stats.evasion_points*evasion_chance_modifier);
    if(fighter.getEquipment()["off-hand"]?.offhand_type === "shield") { //has shield
        hit_chance = 1;
    }
    const health = fighter.getFullStats().health, max_health = fighter.getFullStats().max_health;
    return {
        name: fighter.name, defeated: !fighter.is_alive, main: !!fighter.tags.main_character,
        health: {current: Math.ceil(health), max: Math.ceil(max_health), bar: Math.max(0, 100*health/max_health)},
        attack: {power: Math.round(fighter_stats.attack_power), count: fighter_stats.attack_count},
        speed: disp_speed,
        // The native view switches on the size of this fighter's opposing side.
        solo: opponents.length == 1, opposingShield: opponents.length == 1 && opponents[0].hasShield(),
        hitPct: pct(hit_chance), attackPoints: Math.round(fighter.getFullStats().attack_points),
        shield: fighter.hasShield(), block: Math.round(fighter.getBlockStrength()),
        evadePct: pct(evasion_chance), evasionPoints: Math.round(fighter.getFullStats().evasion_points),
        defense: fighter_stats.defense,
        ...(fighter.tags.main_character?{armorPenetration:fighter_stats.armor_penetration??0,protection:{damageTaken:fighter_stats.damage_taken??1,minDamageShare:fighter_stats.min_damage_share??.05,critResistance:fighter_stats.crit_resistance??0,blockChance:fighter_stats.block_chance??0}}:{}),
        youHitPct: !is_attacker && includes_player && opponents.length === 1 ? pct(1-evasion_chance) : null,
    };
}
