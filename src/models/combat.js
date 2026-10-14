import {getElementalDefenseModifier} from '../absorb_e3/elemental_affinities.js';
import {equipmentDurability as durability} from '../absorb_e2/durability.js';
import {accessoryDropModifier} from '../absorb_c1/accessories.js';
"use strict";

import {rollBaseCombatDamage,nextAttackTiming} from "../combat_math.js";
import {validateEncounterCombatProfile} from '../absorb_p23/combat_options/runtime.js';
import { config } from "../config.js";
import { character } from "../data/character.js";
import { skills } from "../data/skills.js";
import { log_message, update_displayed_health, update_stance_tooltip } from "../display.js";
import { enemy_tag_to_skill_mapping } from "../enemies.js";
import { item_templates } from "../items.js";
import { add_xp_to_character, add_xp_to_skill, change_stance, current_stance, finish_combat_round, game_options, game_stats, kill_target, kill_player, process_current_loot, selected_stance, tickrate, use_stamina } from "../main.js";
import { get_hit_chance } from "../misc.js";
import { do_onhit_animation, do_onstart_animation, fill_fighter_divs, remove_onhit_animation, update_attack_bar, update_displayed_health_of_fighter } from "../ui/combat_display.js";

let maximum_time_correction = 10;

class Combat {

    #settledTargets = new WeakSet();

    #data = {
        defenders: {
            attack_loops: [],
            attack_cooldowns: [],
            time_variance_acumulators: [],
            timer_adjustments: [],
            timers: [],
        },
        attackers: {
            attack_loops: [],
            attack_cooldowns: [],
            time_variance_acumulators: [],
            timer_adjustments: [],
            timers: [],
        }
    }

    constructor({
        attackers = [], //in standard case, player
        defenders = [], //in standard case, enemies
        attackers_ui_slot, //this is expected to have no pre-existing children, otherwise they might get deleted
        defenders_ui_slot, //this is expected to have no pre-existing children, otherwise they might get deleted
        is_special_combat, //true -> skips loot, rewards, location progress, etc (esp since it might not even involve player)
        show_stance_controls, //generally just ignore it let it be auto set
        actionAdapter,
        combatOptions,
        nextCombatEvent,
        encounterProfile,
    }) {
        this.attackers = attackers;
        this.defenders = defenders;
        this.attackers_ui_slot = attackers_ui_slot || document.getElementById(config.ui_element_for_hero_combat_display);
        this.defenders_ui_slot = defenders_ui_slot || document.getElementById(config.ui_element_for_enemy_display);
        this.is_special_combat = is_special_combat ?? false;
        this.show_stance_controls = show_stance_controls ?? !this.is_special_combat;
        this.is_ended = false;
        this.actionAdapter = actionAdapter;
        validateEncounterCombatProfile(encounterProfile);
        if(combatOptions && (this.is_special_combat || actionAdapter || typeof nextCombatEvent !== 'function')) {
            throw new Error('Tactics require normal native combat and a saved host event cursor.');
        }
        this.combatOptions = combatOptions;
        this.nextCombatEvent = nextCombatEvent;
        this.encounterProfile = encounterProfile ? {...encounterProfile} : undefined;
    }

    #setupDisplay() {
        fill_fighter_divs();
    }

    reset() {
        this.clearAllAttackLoops();
        this.clearUI();

        // Cleanup preserves persistent life; it never revives fighters.

    }

    end() {
        this.is_ended = true;
        this.reset();
    }

    clearUI() {
        for(let i = 0; i < this.defenders.length; i++) {
            remove_onhit_animation({fighter_index: i, is_attacker: false});
        }
        for(let i = 0; i < this.attackers.length; i++) {
            remove_onhit_animation({fighter_index: i, is_attacker: true});
        }

        if(this.attackers_ui_slot) {
            
            if(!this.is_special_combat) {
                while(this.attackers_ui_slot.children.length > 1) {
                    this.attackers_ui_slot.removeChild(this.attackers_ui_slot.lastChild);
                }
            } else {
                this.attackers_ui_slot.replaceChildren();
            }
        }
        if(this.defenders_ui_slot) this.defenders_ui_slot.replaceChildren();
    }

    start() {
        if(this.combatOptions && this.combatOptions.snapshot().phase !== 'active') return;
        this.#setupDisplay();

        this.#data.attackers.attack_cooldowns = this.attackers.map(x => 1/x.getFullStats().attack_speed);
        this.#data.defenders.attack_cooldowns = this.defenders.map(x => 1/x.getFullStats().attack_speed);

        let fastest_cooldown = [... this.#data.attackers.attack_cooldowns, ... this.#data.defenders.attack_cooldowns].sort((a,b) => a - b)[0];

        //scale all attacks to be not faster than 1 per second
        const cooldown_multiplier = fastest_cooldown < 1 ? 1/fastest_cooldown : 1;
        Object.keys(this.#data).forEach(fighter_type => {
            for(let i = 0; i < this.#data[fighter_type].attack_cooldowns.length; i++) {
                this.#data[fighter_type].attack_cooldowns[i] *= cooldown_multiplier;
                this.#data[fighter_type].time_variance_acumulators[i] = 0;
                this.#data[fighter_type].timer_adjustments[i] = 0;
                this.#data[fighter_type].timers[i] = [Date.now(), Date.now()];
            }
        });

        for(let i = 0; i < this.defenders.length; i++) {
            if(game_options.do_enemy_onhit_animations) {
                do_onstart_animation({fighter_index: i, is_attacker: false});
            }
            this.setAttackLoop({fighter_index: i, is_attacker: false, base_cooldown: this.#data.defenders.attack_cooldowns[i]});
            update_displayed_health_of_fighter({fighter_index: i, is_attacker: false});
        }
        for(let i = 0; i < this.attackers.length; i++) {
            this.setAttackLoop({fighter_index: i, is_attacker: true, base_cooldown: this.#data.attackers.attack_cooldowns[i]});
            update_displayed_health_of_fighter({fighter_index: i, is_attacker: true});
        }
    }

    /**
     * 
     * @param {*} data
     * @param {Boolean} data.is_attacker - false equals it being a defender
     * @returns 
     */
    setAttackLoop({fighter_index, base_cooldown, is_attacker, skip_persistence_xp_for_stance_change}) {
        if(this.is_ended || this.combatOptions && this.combatOptions.snapshot().phase !== 'active') return;
        this.clearAttackLoop({fighter_index, is_attacker});

        const fighter = is_attacker ? this.attackers[fighter_index] : this.defenders[fighter_index];

        if(!fighter?.is_alive) return;

        //tries to switch stance back to the one that was actually selected if there's enough stamina, otherwise tries to switch stance to "normal" if not enough stamina
        if(fighter.tags?.main_character && !this.is_special_combat) {
            if(fighter.getFullStats().stamina >= (selected_stance.stamina_cost / fighter.getFullStats().stamina_efficiency)){ 
                if(selected_stance.id !== current_stance.id) {
                    change_stance({stance_id: selected_stance.id});
                    return;
                }
            } else if(current_stance.id !== "normal") {
                change_stance({stance_id: "normal", is_temporary: true});
                return;
            }
        }

        let target_count = 1;
        if(fighter.tags?.main_character && !this.is_special_combat) {
            if(target_count > 1 && current_stance.related_skill) {
                target_count = target_count + Math.round(target_count * fighter.getTotalSkillLevel(current_stance.related_skill)/skills[current_stance.related_skill].max_level);
            }

            if(current_stance.randomize_target_count) {
                target_count = Math.floor(Math.random()*target_count) || 1;
            }
        }

        let targets = [];
        let alive_targets = (is_attacker ? this.defenders : this.attackers).filter(x => x.is_alive).slice(-target_count);

        while(alive_targets.length>0) {
            targets.push(alive_targets.pop());
        }

        let actual_cooldown = base_cooldown;

        if(fighter.tags?.main_character && !this.is_special_combat) {
            use_stamina({stamina_to_use: current_stance.stamina_cost, skip_persistence_xp_for_stance_change});
            actual_cooldown = base_cooldown / fighter.getStaminaMultiplier();
        }

        let attack_power = fighter.getAttackPower();
        //do_character_attack_loop({base_cooldown, actual_cooldown, attack_power, targets, target_count});
        this.doAttackLoop({fighter_index, is_attacker, base_cooldown, actual_cooldown, attack_power, targets, target_count, is_new: true});
    }

    doAttackLoop({fighter_index, is_attacker, base_cooldown, actual_cooldown, attack_power, targets, target_count, is_new = false, count = 0}) {
        if(this.is_ended) { return; }

        const fighter = is_attacker ? this.attackers[fighter_index] : this.defenders[fighter_index];

        update_attack_bar({fighter_index, is_attacker, progress: count/60});

        const fighter_data = is_attacker ? this.#data.attackers : this.#data.defenders;

        if(is_new) {
            fighter_data.time_variance_acumulators[fighter_index] = 0;
            fighter_data.timer_adjustments[fighter_index] = 0;
        }

        this.clearAttackLoop({fighter_index, is_attacker});
        fighter_data.attack_loops[fighter_index] = setTimeout(() => {
            if(this.is_ended) { return; }
            const now=Date.now();
            const timing=nextAttackTiming(fighter_data.timers[fighter_index][1],now,actual_cooldown*1000/(60*tickrate),
                fighter_data.time_variance_acumulators[fighter_index],maximum_time_correction/tickrate);
            fighter_data.timers[fighter_index][0]=now;
            fighter_data.timers[fighter_index][1]=now;
            fighter_data.time_variance_acumulators[fighter_index]=timing.variance;
            fighter_data.timer_adjustments[fighter_index]=timing.adjustment;

            update_attack_bar({fighter_index, is_attacker, progress: count/60});
            count++;
            if(count >= 60) {
                count = 0;
                let leveled = false;

                const tactic = fighter.tags?.main_character && this.combatOptions
                    ? this.combatOptions.beforeExchange(this.nextCombatEvent(), {combat: this, fighter, targets}) : {kind: 'attack'};
                if(['paused', 'duplicate', 'escaped'].includes(tactic.kind)) {
                    this.clearAllAttackLoops();
                    return;
                }
                // Throw replaces this paid native swing, and goes through the same strike/defeat path.
                const exchangeTargets = tactic.kind === 'throw' ? targets.slice(0, 1) : targets;

                for(let i = 0; i < exchangeTargets.length; i++) {
                    this.doCombatAction({fighter_index, is_attacker, target: exchangeTargets[i], attack_power: tactic.kind === 'throw' ? tactic.power : attack_power, target_count: exchangeTargets.length, attack_count: tactic.kind === 'throw' ? 1 : undefined});
                    if(this.is_ended) return;
                }

                if(tactic.kind !== 'throw' && !this.is_special_combat && fighter.tags?.main_character && current_stance.related_skill) {
                    leveled = add_xp_to_skill({skill: skills[current_stance.related_skill], xp_to_add: targets.reduce((sum,enemy)=>sum+enemy.xp_value,0)/targets.length});
                    
                    if(leveled) {
                        update_stance_tooltip(current_stance);
                        fighter.updateStatsAndDisplay();
                    }
                }

                const victory = (is_attacker ? this.defenders : this.attackers).every(enemy => !enemy.is_alive);
                if(fighter.tags?.main_character && this.combatOptions?.afterExchange({victory})) {
                    this.clearAllAttackLoops();
                    return;
                }

                if((is_attacker ? this.defenders : this.attackers).filter(enemy => enemy.is_alive).length != 0) { //set next loop if there's still an enemy left;
                    this.setAttackLoop({fighter_index, base_cooldown, is_attacker});
                } else { //all enemies defeated, do relevant things and set new combat if applicable
                    if(this.is_special_combat) {
                        this.clearAllAttackLoops();
                    } else {
                        finish_combat_round(this.is_special_combat);             
                    }
                }
            } else {
                this.doAttackLoop({fighter_index, is_attacker, base_cooldown, actual_cooldown, attack_power, targets, target_count, count, is_new: false});
            }

        }, actual_cooldown*1000/(60*tickrate) - fighter_data.timer_adjustments[fighter_index]);
    }

    /**
     * @description performs a combat action, launched for a singular opponent (in fight against multiple with multi-target stance, gets launched separately for each target)
     * @param {Object} data
     * @param {Number} data.fighter_index
     * @param {Boolean} data.is_attacker
     * @param {Object} data.target
     * @param {Number} data.attack_power
     * @param {Number} data.target_count only used for xp calculations (if applicable)
     */
    doCombatAction({fighter_index, is_attacker, target, attack_power, target_count, attack_count}) {
        if(this.is_ended || !target?.is_alive || this.#settledTargets.has(target)) return;
        if(this.actionAdapter) {
            this.actionAdapter({fighter:(is_attacker ? this.attackers : this.defenders)[fighter_index],target,is_attacker,attack_power});
            return;
        }

        const fighters = is_attacker ? this.attackers : this.defenders;
        const fighter = fighters[fighter_index];
        const opponents = is_attacker ? this.defenders : this.attackers;
        const base_damage = attack_power;
        const opponent_count_xp_multiplier = this.is_special_combat? 1 : opponents.length**(1/3);
        const fighter_count_xp_multiplier = this.is_special_combat? 1 : fighters.length**(1/3);
        //xp mult for fighting multiple targets, up to x2 at 8 (assuming standard combat size, since it's technically uncapped)
        //based on raw opponent count instead of only on living ones, because Mik sometimes is a benevolent cat

        const target_count_xp_modifier = opponent_count_xp_multiplier/target_count;
        const fighter_count_xp_modifier = fighter_count_xp_multiplier/fighters.length;
        //with penalty for xp from attacking, since multi-target attacks would be too powerful at farming xp otherwise

        let evasion_chance_modifier = fighters.filter(x => x.is_alive).length**(-1/3); //down to .5 if there's full 8 enemies (multiple attackers make it harder to evade attacks)
        let defense_modifier = 0;

        let hit_chance_modifier = opponents.filter(x => x.is_alive).length**(-1/4); // down to ~ 60% if there's full 8 enemies
        let damage_modifier = 1;

        if(!this.is_special_combat) {
            if(fighter.tags.main_character){
                add_xp_to_skill({skill: skills["Combat"], xp_to_add: target.xp_value*target_count_xp_modifier});
                Object.keys(target.tags).forEach(tag => {
                    if(enemy_tag_to_skill_mapping[tag]) {
                        for(let i = 0; i < enemy_tag_to_skill_mapping[tag].length; i++) {
                            const skill = skills[enemy_tag_to_skill_mapping[tag][i]];

                            add_xp_to_skill({skill, xp_to_add: target.xp_value*target_count_xp_modifier});

                            const {modifier_to_damage, modifier_to_hit_chance} = skill.get_stat_modifiers();

                            hit_chance_modifier *= modifier_to_hit_chance || 1;
                            damage_modifier *= modifier_to_damage || 1;
                        }
                    }
                });
            } else if(target.tags.main_character){
                Object.keys(fighter.tags).forEach(tag => {
                    if(enemy_tag_to_skill_mapping[tag]) {
                        for(let i = 0; i < enemy_tag_to_skill_mapping[tag].length; i++) {
                            const skill = skills[enemy_tag_to_skill_mapping[tag][i]];

                            add_xp_to_skill({skill, xp_to_add: fighter.xp_value*fighter_count_xp_modifier});

                            const {modifier_to_evasion, modifier_to_defense} = skill.get_stat_modifiers();
                            
                            evasion_chance_modifier *= modifier_to_evasion || 1;
                            defense_modifier += modifier_to_defense || 0;
                        }
                    }
                });
            }
        }

        let damages_dealt = [];

        let critted = false;

        let partially_blocked = false; //only used for combat info in message log

        damages_dealt = rollBaseCombatDamage(base_damage,attack_count ?? fighter.getFullStats().attack_count,damage_modifier);


        if(target.hasShield()) {
            if(target.getFullStats().block_chance > Math.random()) {//BLOCKED THE ATTACK

                if(!target.getEquipment()["off-hand"].tags["ignore_skill"]){
                    damages_dealt = damages_dealt.map(x => x*(1-target.getTotalSkillLevel("Shield blocking")/100));
                }
                
                if(!this.is_special_combat && target.tags.main_character) {
                    add_xp_to_skill({skill: skills["Shield blocking"], xp_to_add: fighter.xp_value*target_count_xp_modifier});
                }

                const blocked = target.getEquipment()["off-hand"].getShieldStrength() * (target.getEquipment()["off-hand"].tags.ignore_skill?1:target.getStats().total_multiplier.block_strength);

                if(blocked > damages_dealt[0]) {
                    log_message(target.name + " blocked an attack", (!this.is_special_combat && target.tags.main_character ? "hero_blocked" : "hero_missed"));
                    return; //damage fully blocked, nothing more can happen 
                } else {
                    damages_dealt = damages_dealt.map(val => Math.max(0,val-blocked));
                    partially_blocked = true;
                }
            } else if(!this.is_special_combat && target.tags.main_character){
                add_xp_to_skill({skill: skills["Shield blocking"], xp_to_add: fighter.xp_value*target_count_xp_modifier/2});
            }
        } else { // HAS NO SHIELD
            const hit_chance = 
                get_hit_chance(fighter.getFullStats().attack_points * hit_chance_modifier, target.getFullStats().agility * evasion_chance_modifier * Math.sqrt(target.getFullStats().intuition ?? 1));

            const xp_to_add = target.isWearingArmor() ? fighter.xp_value : fighter.xp_value * 1.5;

            if(hit_chance < Math.random()) { //EVADED ATTACK
                log_message(target.name + " evaded an attack", (!this.is_special_combat && fighter.tags.main_character ? "hero_missed" : "enemy_missed"));

                if(!this.is_special_combat && target.tags.main_character) {
                    const xp_to_add = target.isWearingArmor() ? fighter.xp_value : fighter.xp_value * 1.5;
                    //50% more evasion xp if going without armor
                    add_xp_to_skill({skill: skills["Evasion"], xp_to_add: xp_to_add*fighter_count_xp_modifier});
                }
                
                return; //damage fully evaded, nothing more can happen
            } else {
                if(!this.is_special_combat && target.tags.main_character){
                    add_xp_to_skill({skill: skills["Evasion"], xp_to_add: xp_to_add*target_count_xp_modifier/2});
                }
            }
        }

        //if this point is reached, attack has successfully struck its target, possibly partially blocked on the way
        if(!this.is_special_combat&&durability.landedHit(fighter,target)) {
            const player=fighter.tags.main_character?fighter:target.tags.main_character?target:null;
            player?._equipItem(null);
        }

        game_stats.total_hits_taken += Number(!this.is_special_combat && !!target.tags.main_character);
        game_stats.total_hits_done += Number(!this.is_special_combat && !!fighter.tags.main_character);

        if(fighter.getFullStats().crit_rate > Math.random()){
            damages_dealt = damages_dealt.map(val => val*fighter.getFullStats().crit_multiplier);
            critted = true;
            game_stats.total_crits_taken += Number(!this.is_special_combat && !!target.tags.main_character);

            if(!this.is_special_combat && fighter.tags.main_character) {
                game_stats.total_crits_done++;
                add_xp_to_skill({skill: skills['Perception'], xp_to_add: 1/target_count});
            }
        }

        if(damages_dealt[0] > game_stats.strongest_hit) {
            game_stats.strongest_hit = damages_dealt[0];
        }

        if(!this.is_special_combat&&target.tags.main_character)defense_modifier+=getElementalDefenseModifier({enabled:game_options.elemental_affinities,attacker:fighter,equipment:target.getEquipment(),baseDamage:base_damage});
        let {damage_taken, fainted} = target.takeDamage({damage_values: damages_dealt, defense_modifier, give_skill_xp: (!this.is_special_combat && target.tags.main_character)});

        target.on_damaged(fighter);
        fighter.on_hit(target);

        if(!this.is_special_combat && target.tags.main_character) {
            
            if(!target.isWearingArmor()) {
                //no armor so either completely naked or in things with 0 def
                add_xp_to_skill({skill: skills["Iron skin"], xp_to_add: fighter.xp_value * target_count_xp_modifier});
            }

            add_xp_to_skill({skill: skills["Fortitude"], xp_to_add: (damage_taken**0.6)*target_count_xp_modifier});
        }

        const hit_count_msg = damages_dealt.length > 1?` x${damages_dealt.length}`:"";
        const condt = (!this.is_special_combat && target.tags.main_character);
        if(critted) {
            if(partially_blocked) {
                log_message(target.name + " partially blocked, was critically hit" + hit_count_msg + " for " + Math.ceil(10*damage_taken)/10 + " dmg", condt?"hero_attacked_critically":"enemy_attacked_critically");
            } 
            else {
                log_message(target.name + " was critically hit" + hit_count_msg + " for " + Math.ceil(10*damage_taken)/10 + " dmg", condt?"hero_attacked_critically":"enemy_attacked_critically");
            }
        } else {
            if(partially_blocked) {
                log_message(target.name + " partially blocked, was hit" + hit_count_msg + " for " + Math.ceil(10*damage_taken)/10 + " dmg", condt?"hero_attacked":"enemy_attacked");
            }
            else {
                log_message(target.name + " was hit" + hit_count_msg + " for " + Math.ceil(10*damage_taken)/10 + " dmg", condt?"hero_attacked":"enemy_attacked");
            }
        }

        if(game_options.do_enemy_onhit_animations) {
            do_onhit_animation({fighter_index: (is_attacker ? this.defenders : this.attackers).findIndex(x => x === target), is_attacker: !is_attacker});
        }

        const target_index = (is_attacker ? this.defenders : this.attackers).findIndex(x => x === target);

        if(fainted) {
            this.#settledTargets.add(target);
            if(target.tags.main_character) {
                kill_player({is_combat: true});
                return;
            } else {
                if(fighter.tags.main_character) {
                    target.on_death(fighter);
                }

                log_message(target.name + " was defeated", "enemy_defeated");

                if(!this.is_special_combat && fighter.tags.main_character && target.get_loot) {
                    add_xp_to_character(target.xp_value * target_count_xp_modifier, true);

                    let loot = target.get_loot({drop_chance_modifier: accessoryDropModifier(1/target_count**0.6667) * (this.encounterProfile?.dropChanceModifier ?? 1)});
                    if(loot.length > 0) {
                        process_current_loot({loot_list: loot, is_combat: true});
                        loot = loot.map(x => {return {item_key: item_templates[x.item_id].getInventoryKey(), count: x.count}});
                        character.addToInventory(loot);
                    }
                }
                
                kill_target({fighter_index, target_index, is_target_an_attacker: !is_attacker});
                this.clearAttackLoop({fighter_index: target_index, is_attacker: !is_attacker});
            }
        } else {
            if(!this.is_special_combat && target.tags.main_character) {
                update_displayed_health();
                update_displayed_health_of_fighter({fighter_index: target_index, is_attacker: !is_attacker});
            } else {
                update_displayed_health_of_fighter({fighter_index: target_index, is_attacker: !is_attacker});
            }
        }
    }

    clearAllAttackLoops() {
        for(let i = 0; i < this.attackers.length; i++) {
            this.clearAttackLoop({fighter_index: i, is_attacker: true});
        }
        for(let i = 0; i < this.defenders.length; i++) {
            this.clearAttackLoop({fighter_index: i});
        }
    }

    resumeCombatOptions() {
        if(this.is_ended) return false;
        const phase = this.combatOptions?.resume();
        if(!phase) return false;
        if(phase === 'encounter-break') finish_combat_round(this.is_special_combat);
        else this.start();
        return true;
    }

    clearAttackLoop({fighter_index, is_attacker}) {
        clearTimeout(
            (is_attacker ? this.#data.attackers : this.#data.defenders).attack_loops[fighter_index]
        );
    }

    /**
     * @description Recalculates attack speeds; resets attack loop for hero (if present), rescales for other fighters
     * @param {*} skip_persistence_xp_for_stance_change 
     * @returns 
     */
    resetCombatLoops(skip_persistence_xp_for_stance_change) {
        if(this.is_special_combat) {
            return;
        }


        let fastest_cooldown = [... this.#data.attackers.attack_cooldowns, ... this.#data.defenders.attack_cooldowns].sort((a,b) => a - b)[0];

        //scale all attacks to be not faster than 1 per second
        const cooldown_multiplier = fastest_cooldown < 1 ? 1/fastest_cooldown : 1;
            
        Object.keys(this.#data).forEach(fighter_type => {
            for(let i = 0; i < this.#data[fighter_type].attack_cooldowns.length; i++) {
                
                if(fighter_type === "attackers" && this.attackers[i].tags.main_character) {
                    this.setAttackLoop({fighter_index: i, is_attacker: true, base_cooldown: this.#data.attackers.attack_cooldowns[i], skip_persistence_xp_for_stance_change})
                }
                this.#data[fighter_type].attack_cooldowns[i] *= cooldown_multiplier;
            }
        });
    }

}

export default Combat;
