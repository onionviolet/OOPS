import {frontierReactions, quoteParry, quoteRiposte} from "../combat_reactions.js";
import {domainRegistry} from '../domain_registry.js';
import {damageRecord,supportedHarvest} from '../harvest.js';
import {settleSkinCritical,settleSkinStamina} from '../skill_evolution.js';
import {effectiveCritChance} from '../gear_dimensions.js';
import {acquiredLootKeys} from '../gear_acquisition.js';
import {engineTimeout,clearEngineTimeout,engineNow} from '../simulation_clock.js';
import {combatHitText} from '../ui_polish.js';
import {drawNativeAttackBar, freezeNativeAttackBar} from '../combat_focus.js';
import {combatLogEvent} from '../combat_log.js';
import {STREAMS,gameOrdinal,gameKeyedRandom} from "../seeded_streams.js";
import {getElementalDefenseModifier} from '../absorb_e3/elemental_affinities.js';
import {typedStrike} from '../damage_types.js';
import {equipmentDurability as durability} from '../absorb_e2/durability.js';
import {accessoryDropModifier} from '../absorb_c1/accessories.js';
"use strict";

import {rollBaseCombatDamage,nextAttackTiming} from "../combat_math.js";
import {validateEncounterCombatProfile} from '../absorb_p23/combat_options/runtime.js';
import { config } from "../config.js";
import { character } from "../data/character.js";
import {quoteCounterTrait} from '../enemy_traits.js';
import { skills, weapon_type_to_skill } from "../data/skills.js";
import { log_message, update_displayed_health, update_displayed_stamina, update_stance_tooltip } from "../display.js";
import { enemy_tag_to_skill_mapping } from "../enemies.js";
import { item_templates } from "../items.js";
import {add_xp_to_character, add_xp_to_skill, change_stance, current_stance, finish_combat_round, game_stats, kill_target, kill_player, process_current_loot, tickrate, use_stamina} from "../main.js";
import {game_options, selected_stance,current_location} from "../runtime_state.js";
import { get_hit_chance } from "../misc.js";
import { do_onhit_animation, do_onstart_animation, do_effect_animation, fill_fighter_divs, remove_onhit_animation, update_displayed_health_of_fighter } from "../ui/combat_display.js";

let maximum_time_correction = 10;

// An attack cycle is 60 sub-ticks. Each sub-tick used to be its own engine timer that only
// moved the bar and the drift correction; the swing happens on the 60th. The same sub-tick
// arithmetic now runs in plain code, and only two timers are armed per cycle: one at the
// 59th sub-tick deadline (which arms the 60th exactly as before, so its timer id order and
// drift correction match) and the 60th, which swings. Bars animate from the same deadlines.
const SUBTICKS = 60;
let schedule_sequence = 0;
let running_final = null; // the cycle whose 60th sub-tick callback is executing

const subtick_interval = (actual_cooldown, rate) => actual_cooldown*1000/(60*rate);

/** The engine due time of sub-ticks from..59 when each fires on time, as engine timers did when stepped. */
function plan_subticks({from, alloc, state, actual_cooldown, rate}) {
    const dues = [], states = [];
    let {prev, acc, adj} = state, t = alloc;
    for(let k = from; k < SUBTICKS; k++) {
        const interval = subtick_interval(actual_cooldown, rate);
        const due = t + Math.max(0, interval - adj);
        const timing = nextAttackTiming(prev, due, interval, acc, maximum_time_correction/rate);
        prev = due; acc = timing.variance; adj = timing.adjustment; t = due;
        dues[k] = due; states[k] = {prev, acc, adj};
    }
    return {dues, states};
}

/** Whether old sub-tick k of cycle b was allocated, so ran, before sub-tick j of cycle a when both are due together. */
function allocated_earlier(b, k, a, j) {
    for(;;) {
        const alloc_b = k > b.from ? b.dues[k - 1] : b.alloc;
        const alloc_a = j > a.from ? a.dues[j - 1] : a.alloc;
        if(alloc_b !== alloc_a) return alloc_b < alloc_a;
        if(k <= b.from || j <= a.from) return b.seq < a.seq;
        k--; j--;
    }
}

/** Sub-ticks of a cycle that the old per-sub-tick timers would have run by engine time now. */
function fired_subticks(schedule, now) {
    if(schedule.prefinal_done) return SUBTICKS - 1;
    let fired = schedule.from - 1;
    for(let k = schedule.from; k < SUBTICKS; k++) {
        const due = schedule.dues[k];
        if(due > now) break;
        // A tie runs in timer allocation order; outside a swing every due timer has run.
        if(due === now && (k === SUBTICKS - 1 || running_final) && !(running_final && allocated_earlier(schedule, k, running_final, SUBTICKS))) break;
        fired = k;
    }
    return fired;
}

class Combat {

    #turns = {attackers:[], defenders:[]};
    #pendingLoops = {};
    #schedules = {};
    #resume;
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
        savedEncounter,
        combatOptions,
        nextCombatEvent,
        encounterProfile,
        encounterHooks,
        nativeExchangeHost,
    }) {
        this.attackers = attackers;
        this.defenders = defenders;
        this.attackers_ui_slot = attackers_ui_slot || document.getElementById(config.ui_element_for_hero_combat_display);
        this.defenders_ui_slot = defenders_ui_slot || document.getElementById(config.ui_element_for_enemy_display);
        this.is_special_combat = is_special_combat ?? false;
        this.show_stance_controls = show_stance_controls ?? !this.is_special_combat;
        this.is_ended = false;
        this.actionAdapter = actionAdapter;
        this.nativeExchangeHost = nativeExchangeHost;
        this.encounterHooks = encounterHooks;
        validateEncounterCombatProfile(encounterProfile);
        if(combatOptions && (this.is_special_combat || actionAdapter || typeof nextCombatEvent !== 'function')) {
            throw new Error('Tactics require normal native combat and a saved host event cursor.');
        }
        this.combatOptions = combatOptions;
        this.nextCombatEvent = nextCombatEvent;
        this.encounterProfile = encounterProfile ? {...encounterProfile} : undefined;
        this.rngKey = savedEncounter?.key || defenders[0]?.encounterKey || (actionAdapter ? null : `combat:${gameOrdinal(STREAMS.combat)}`);
        if(savedEncounter) {this.#turns=structuredClone(savedEncounter.turns);
            if(encounterHooks||!combatOptions||combatOptions.snapshot().phase==='active')this.#resume=structuredClone(savedEncounter.loops);}
    }

    snapshot(locationId) {
        if(this.is_special_combat || this.actionAdapter || this.is_ended) return null;
        return {schema:1,locationId,key:this.rngKey,turns:structuredClone(this.#turns),loops:structuredClone(Object.fromEntries(Object.entries(this.#loopsNow()).filter(([key])=>{const [side,index]=key.split(":");return this[side][index]?.is_alive;}))),
            enemies:this.defenders.map(e=>({template:e.templateKey || e.name,key:e.rngKey,stats:{...e.stats},full:{...e.getFullStats()},alive:e.is_alive,...(e.harvestDamage?{harvestDamage:structuredClone(e.harvestDamage)}:{})}))};
    }

    strikeCheckpoint() {
        return {turns:structuredClone(this.#turns),loops:structuredClone(this.#loopsNow()),ended:this.is_ended,options:this.combatOptions?.snapshot()};
    }
    restoreStrikeCheckpoint(s) {
        this.#turns=structuredClone(s.turns);this.#pendingLoops=structuredClone(s.loops);this.is_ended=s.ended;
        this.#settledTargets=new WeakSet([...this.attackers,...this.defenders].filter(f=>!f.is_alive));
        if(s.options)this.combatOptions.restore(s.options);
    }

    #startFighter(fighter_index,is_attacker) {
        const side=is_attacker ? "attackers" : "defenders",saved=this.#resume?.[`${side}:${fighter_index}`];
        if(saved && this[side][fighter_index].is_alive) {
            const opponents=is_attacker ? this.defenders : this.attackers;
            this.doAttackLoop({...saved,fighter_index,is_attacker,targets:saved.targets.map(i=>opponents[i]),is_new:false});
        } else this.setAttackLoop({fighter_index,is_attacker,base_cooldown:this.#data[side].attack_cooldowns[fighter_index]});
    }

    // The player's terms for this foe's kind in the original wilds (fight_terms.js frame 'original': Finish unless the player set
    // otherwise), and whether a pulled blow held. No terms service (headless rigs) means Finish, as before.
    #downTerms(target, random) {
        const read = typeof domainRegistry === 'undefined' ? null : domainRegistry.command('tempo_fight', 'termsFor'); // sandboxed rigs run without the registry
        const set = read ? read({tags: target.tags, frame: 'original'}) : null;
        let terms = set?.terms || 'finish', slipped = false;
        if(current_stance?.id === 'pulled') {
            slipped = random("restraint") < (set?.slip ?? .05);
            if(!slipped && terms === 'finish' && !set?.set) terms = 'spare'; // a pulled blow leaves them out cold unless you chose to finish
        }
        return {terms: slipped ? 'finish' : terms, slipped};
    }
    // Spared or out cold (PS38): the foe leaves the fight alive. You still won the exchange (experience, its own death hooks for
    // scripted unlocks), but there is no loot, no kill count and no kill for quests: nobody died.
    #leaveDown({fighter, target, is_attacker, target_index, target_count_xp_modifier, logEvent}) {
        target.on_death?.(fighter);
        log_message(`${target.name} is down. You leave ${target.tags?.human ? 'them' : 'it'} alive, as you meant to.`, "enemy_defeated", {combat: logEvent("defeat")});
        if(target.get_loot) add_xp_to_character(target.xp_value * target_count_xp_modifier, true);
        target.is_alive = false;
        update_displayed_health_of_fighter({fighter_index: target_index, is_attacker: !is_attacker});
        if(this.nativeExchangeHost&&this.defenders.every(e=>!e.is_alive))domainRegistry.command('combatReview','finish')?.({id:this.rngKey,outcome:'won'});
        this.clearAttackLoop({fighter_index: target_index, is_attacker: !is_attacker});
    }

    #random(side,index,targetIndex,decision) {
        return gameKeyedRandom(STREAMS.combat,JSON.stringify([this.rngKey,side,index,this.#turns[side][index]||0,targetIndex,decision]));
    }

    #setupDisplay() {
        fill_fighter_divs();
    }
    showPausedCombatOptions() {
        this.#setupDisplay();
        this.defenders.forEach((_,fighter_index)=>update_displayed_health_of_fighter({fighter_index,is_attacker:false}));
    }

    reset() {
        this.clearAllAttackLoops();
        this.clearUI();

        // Cleanup preserves persistent life; it never revives fighters.

    }

    end() {
        if(!this.is_special_combat&&this.nativeExchangeHost)domainRegistry.command('combatReview','finish')?.({id:this.rngKey,outcome:'withdrew'});
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
                this.#data[fighter_type].timers[i] = [engineNow(), engineNow()];
            }
        });

        for(let i = 0; i < this.defenders.length; i++) {
            if(game_options.do_enemy_onhit_animations) {
                do_onstart_animation({fighter_index: i, is_attacker: false});
            }
            this.#startFighter(i,false);
            update_displayed_health_of_fighter({fighter_index: i, is_attacker: false});
        }
        for(let i = 0; i < this.attackers.length; i++) {
            this.#startFighter(i,true);
            update_displayed_health_of_fighter({fighter_index: i, is_attacker: true});
        }
        if(this.encounterHooks)this.#resume=undefined;
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

        const side = is_attacker ? "attackers" : "defenders";
        this.#turns[side][fighter_index] = (this.#turns[side][fighter_index] || 0) + 1;
        let target_count = fighter.tags?.main_character && !this.is_special_combat ? (current_stance.target_count || 1) : 1;
        if(fighter.tags?.main_character && !this.is_special_combat) {
            if(target_count > 1 && current_stance.related_skill) {
                target_count = target_count + Math.round(target_count * fighter.getTotalSkillLevel(current_stance.related_skill)/skills[current_stance.related_skill].max_level);
            }

            if(current_stance.randomize_target_count) {
                target_count = Math.floor(this.#random(side,fighter_index,-1,"targets")*target_count) || 1;
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

        this.encounterHooks?.previewExchange?.({combat:this,fighter,is_attacker});
        let attack_power = fighter.getAttackPower();
        //do_character_attack_loop({base_cooldown, actual_cooldown, attack_power, targets, target_count});
        this.doAttackLoop({fighter_index, is_attacker, base_cooldown, actual_cooldown, attack_power, targets, target_count, is_new: true});
    }

    doAttackLoop({fighter_index, is_attacker, base_cooldown, actual_cooldown, attack_power, targets, target_count, is_new = false, count = 0}) {
        if(this.is_ended) { return; }

        const side=is_attacker ? "attackers" : "defenders", key=`${side}:${fighter_index}`;
        const fighter_data = is_attacker ? this.#data.attackers : this.#data.defenders;
        // Clearing first records where an interrupted cycle's drift correction stood, as its last sub-tick left it.
        this.clearAttackLoop({fighter_index, is_attacker});

        const entry = this.#pendingLoops[key] = {base_cooldown,actual_cooldown,attack_power,target_count,count,
            targets:targets.map(t=>(is_attacker ? this.defenders : this.attackers).indexOf(t))};

        if(is_new) {
            fighter_data.time_variance_acumulators[fighter_index] = 0;
            fighter_data.timer_adjustments[fighter_index] = 0;
        }

        const now = engineNow();
        const schedule = {seq: ++schedule_sequence, from: count + 1, alloc: now, entry, dues: [], states: [], prefinal_done: false,
            initial: {prev: fighter_data.timers[fighter_index][1], acc: fighter_data.time_variance_acumulators[fighter_index], adj: fighter_data.timer_adjustments[fighter_index]}};
        this.#schedules[key] = schedule;

        const final_subtick = () => {
            if(this.is_ended) { return; }
            const now=engineNow();
            const timing=nextAttackTiming(fighter_data.timers[fighter_index][1],now,subtick_interval(actual_cooldown, tickrate),
                fighter_data.time_variance_acumulators[fighter_index],maximum_time_correction/tickrate);
            fighter_data.timers[fighter_index][0]=now;
            fighter_data.timers[fighter_index][1]=now;
            fighter_data.time_variance_acumulators[fighter_index]=timing.variance;
            fighter_data.timer_adjustments[fighter_index]=timing.adjustment;
            if(this.#schedules[key] === schedule) delete this.#schedules[key];

            const outer = running_final;
            running_final = schedule;
            try {
                const resolve=()=>this.resolveExchange({fighter_index,is_attacker,targets,attack_power});
                const result=this.nativeExchangeHost?this.nativeExchangeHost(this,resolve):resolve();
                if(!result||result.paused||result.ended||this.is_ended)return;

                if((is_attacker ? this.defenders : this.attackers).filter(enemy => enemy.is_alive).length != 0) { //set next loop if there's still an enemy left;
                    this.setAttackLoop({fighter_index, base_cooldown, is_attacker});
                } else { //all enemies defeated, do relevant things and set new combat if applicable
                    if(this.is_special_combat) {
                        this.clearAllAttackLoops();
                    } else {
                        finish_combat_round(this.is_special_combat);
                    }
                }
            } finally {
                running_final = outer;
            }
        };
        const arm_final = () => {
            const delay = actual_cooldown*1000/(60*tickrate) - fighter_data.timer_adjustments[fighter_index];
            fighter_data.attack_loops[fighter_index] = engineTimeout(final_subtick, delay);
            this.#drawBar(is_attacker, fighter_index, (SUBTICKS - 1)/SUBTICKS, Math.max(0, delay), engineNow() + Math.max(0, delay));
        };

        if(schedule.from >= SUBTICKS) {
            arm_final();
            return;
        }
        Object.assign(schedule, plan_subticks({from: schedule.from, alloc: now, state: schedule.initial, actual_cooldown, rate: tickrate}));
        const prefinal_due = schedule.dues[SUBTICKS - 1];
        fighter_data.attack_loops[fighter_index] = engineTimeout(() => {
            if(this.is_ended) { return; }
            // Sub-ticks before the 59th ran on time; the 59th sees the real clock, as its own timer did.
            const now=engineNow(), before=SUBTICKS - 2 >= schedule.from ? schedule.states[SUBTICKS - 2] : schedule.initial;
            const timing=nextAttackTiming(before.prev,now,subtick_interval(actual_cooldown, tickrate),before.acc,maximum_time_correction/tickrate);
            fighter_data.timers[fighter_index][0]=now;
            fighter_data.timers[fighter_index][1]=now;
            fighter_data.time_variance_acumulators[fighter_index]=timing.variance;
            fighter_data.timer_adjustments[fighter_index]=timing.adjustment;
            schedule.prefinal_done = true;
            this.#pendingLoops[key] = entry;
            entry.count = SUBTICKS - 1;
            arm_final();
        }, prefinal_due - now);
        const finalInterval = subtick_interval(actual_cooldown, tickrate);
        const swingDue = prefinal_due + Math.max(0, finalInterval - schedule.states[SUBTICKS - 1].adj);
        this.#drawBar(is_attacker, fighter_index, count/SUBTICKS, prefinal_due - now + finalInterval, swingDue);
    }

    #drawBar(is_attacker, fighter_index, progress, remaining_ms, due) {
        drawNativeAttackBar(is_attacker ? this.attackers_ui_slot : this.defenders_ui_slot, fighter_index, progress, remaining_ms, due);
    }

    /** Pending loops as the old sub-tick timers left them, with each live cycle's sub-tick count at this moment. */
    #loopsNow() {
        const now = engineNow();
        return Object.fromEntries(Object.entries(this.#pendingLoops).map(([key, entry]) => {
            const schedule = this.#schedules[key];
            return [key, schedule?.entry === entry ? {...entry, count: fired_subticks(schedule, now)} : entry];
        }));
    }

    resolveExchange({fighter_index,is_attacker,targets,attack_power}) {
        if(!this.is_special_combat&&this.nativeExchangeHost)domainRegistry.command('combatReview','begin')?.({id:this.rngKey,place:current_location?.id||''});
        const fighter=(is_attacker?this.attackers:this.defenders)[fighter_index];
        delete this.#pendingLoops[`${is_attacker?'attackers':'defenders'}:${fighter_index}`];
        let leveled = false;
        if(this.encounterHooks?.admitExchange?.({combat:this,fighter,is_attacker,targets}) === false) {
            this.clearAllAttackLoops();return {paused:true,duplicate:true};
        }

        const tactic = fighter.tags?.main_character && this.combatOptions
            ? this.combatOptions.beforeExchange(this.nextCombatEvent(), {combat: this, fighter, targets}) : {kind: 'attack'};
        if(['paused', 'duplicate', 'escaped'].includes(tactic.kind)) {
            this.clearAllAttackLoops();
            return {paused:true};
        }
        this.encounterHooks?.beforeExchange?.({combat:this,fighter,is_attacker,targets});
        // Throw replaces this paid native swing, and goes through the same strike/defeat path.
        const exchangeTargets = tactic.kind === 'throw' ? targets.slice(0, 1) : targets;

        for(let i = 0; i < exchangeTargets.length; i++) {
            this.doCombatAction({fighter_index, is_attacker, target: exchangeTargets[i], attack_power: tactic.kind === 'throw' ? tactic.power : attack_power, target_count: exchangeTargets.length, attack_count: tactic.kind === 'throw' ? 1 : undefined});
            if(this.is_ended) return {ended:true};
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
            return {paused:true,victory};
        }

        return {victory};
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
        const side=is_attacker ? "attackers" : "defenders";
        const targetIndex=(is_attacker ? this.defenders : this.attackers).indexOf(target);
        const random=decision=>this.#random(side,fighter_index,targetIndex,decision);
        // R22: who did what to whom, snapshotted at emit time for the log (no RNG, no state change).
        const logEvent=(outcome,extra={})=>{const event=combatLogEvent(this,{fighter,fighterIndex:fighter_index,isAttacker:is_attacker,target,outcome,...extra});if(!this.is_special_combat&&this.nativeExchangeHost)domainRegistry.command('combatReview','observe')?.({id:this.rngKey,key:`${side}:${fighter_index}:${this.#turns[side][fighter_index]}:${targetIndex}:${outcome}`,event});return event;};
        const opponents = is_attacker ? this.defenders : this.attackers;
        const base_damage = attack_power;
        const opponent_count_xp_multiplier = this.is_special_combat? 1 : opponents.length**(1/3);
        const fighter_count_xp_multiplier = this.is_special_combat? 1 : fighters.length**(1/3);
        //xp mult for fighting multiple targets, up to x2 at 8 (assuming standard combat size, since it's technically uncapped)
        //based on raw opponent count instead of only on living ones, because Mik sometimes is a benevolent cat

        const target_count_xp_modifier = opponent_count_xp_multiplier/target_count;
        //penalty for xp from attacking, since multi-target attacks would be too powerful at farming xp otherwise
        
        const fighter_count_xp_modifier = fighter_count_xp_multiplier/fighters.length;

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

        const responses = [];
        for (const [holder, opponent, owner] of [[fighter, target, 'attacker'], [target, fighter, 'defender']]) {
            const trait = holder.counterTrait;
            if (trait?.owner !== owner) continue;
            const multiplier = quoteCounterTrait(trait, opponent.getFullStats());
            responses.push({trait, multiplier});
            if (trait.hook === 'on_strike') damage_modifier *= multiplier;
        }
        damages_dealt = rollBaseCombatDamage(base_damage,attack_count ?? fighter.getFullStats().attack_count,damage_modifier,(() => {let i=0;return ()=>random(`damage:${i++}`);})());


        if(target.hasShield()) {
            if(target.getFullStats().block_chance > random("block")) {//BLOCKED THE ATTACK

                if(!target.getEquipment()["off-hand"].tags["ignore_skill"]){
                    damages_dealt = damages_dealt.map(x => x*(1-target.getTotalSkillLevel("Shield blocking")/100));
                }
                
                if(!this.is_special_combat && target.tags.main_character) {
                    add_xp_to_skill({skill: skills["Shield blocking"], xp_to_add: fighter.xp_value*fighter_count_xp_modifier});
                }

                const blocked = target.getEquipment()["off-hand"].getShieldStrength() * (target.getEquipment()["off-hand"].tags.ignore_skill?1:target.getStats().total_multiplier.block_strength);

                if(blocked > damages_dealt[0]) {
                    log_message(target.name + " blocked an attack", (!this.is_special_combat && target.tags.main_character ? "hero_blocked" : "hero_missed"), {combat: logEvent("block")});
                    return; //damage fully blocked, nothing more can happen 
                } else {
                    damages_dealt = damages_dealt.map(val => Math.max(0,val-blocked));
                    partially_blocked = true;
                }
            } else if(!this.is_special_combat && target.tags.main_character){
                add_xp_to_skill({skill: skills["Shield blocking"], xp_to_add: fighter.xp_value*fighter_count_xp_modifier/2});
            }
        } else { // HAS NO SHIELD
            const hit_chance = 
                get_hit_chance(fighter.getFullStats().attack_points * hit_chance_modifier * (this.encounterHooks?.attackPointsMultiplier?.({combat:this,fighter,target}) ?? 1), target.getFullStats().agility * evasion_chance_modifier * Math.sqrt(target.getFullStats().intuition ?? 1));

            const xp_to_add = target.isWearingArmor() ? fighter.xp_value : fighter.xp_value * 1.5;

            if(hit_chance < random("evade")) { //EVADED ATTACK
                log_message(target.name + " evaded an attack", (!this.is_special_combat && fighter.tags.main_character ? "hero_missed" : "enemy_missed"), {combat: logEvent("miss")});

                if(!this.is_special_combat && target.tags.main_character) {
                    const xp_to_add = target.isWearingArmor() ? fighter.xp_value : fighter.xp_value * 1.5;
                    //50% more evasion xp if going without armor
                    add_xp_to_skill({skill: skills["Evasion"], xp_to_add: xp_to_add*fighter_count_xp_modifier});
                    const stats=target.getFullStats();
                    const growth=domainRegistry.command('skill_evolution','recovery')?.('Evasion','enemy-dodged',{},stats.max_stamina-stats.stamina);
                    if(growth){
                        stats.stamina+=growth.stamina;
                        update_displayed_stamina();
                        log_message(`${growth.name} restored ${growth.stamina} stamina after a dodge.`,'hero_attacked');
                    }
                }
                
                if (this.nativeExchangeHost && !this.is_special_combat && target.tags.main_character &&
                    quoteRiposte(target.getTotalSkillLevel("Evasion"), random("riposte"))) {
                    log_message("You counterattacked after the dodge.", "hero_attacked");
                    this.doCombatAction({fighter_index: targetIndex, is_attacker: !is_attacker, target: fighter,
                        attack_power: target.getAttackPower() * frontierReactions.counterPower, target_count: 1, attack_count: 1});
                }
                return; //damage fully evaded, nothing more can happen
            } else {
                if(!this.is_special_combat && target.tags.main_character){
                    add_xp_to_skill({skill: skills["Evasion"], xp_to_add: xp_to_add*fighter_count_xp_modifier/2});
                }
            }
        }

        if (this.nativeExchangeHost && !this.is_special_combat && target.tags.main_character) {
            const reaction = quoteParry(target.getTotalSkillLevel("Equilibrium"), random("parry"));
            if (reaction) {
                damages_dealt = damages_dealt.map(damage => damage * (1 - reaction.reduction));
                add_xp_to_skill({skill: skills["Equilibrium"], xp_to_add: fighter.xp_value * fighter_count_xp_modifier});
                log_message(`You parried the incoming blow, turning aside ${Math.round(reaction.reduction * 100)}% of its force.`, "hero_blocked");
            }
        }

        //if this point is reached, attack has successfully struck its target, possibly partially blocked on the way
        if(!this.is_special_combat&&durability.landedHit(fighter,target)) {
            const player=fighter.tags.main_character?fighter:target.tags.main_character?target:null;
            player?._equipItem(null);
        }

        if(!this.is_special_combat && fighter.tags.main_character) {
            const weapon = fighter.getEquipment().weapon;
            const skill_id = weapon ? weapon_type_to_skill[weapon.weapon_type] : "Unarmed";
            add_xp_to_skill({skill: skills[skill_id], xp_to_add: target.xp_value*target_count_xp_modifier});
        }

        for (const {trait, multiplier} of responses) {
            if (trait.hook === 'on_connectedstrike') damages_dealt = damages_dealt.map(value => value * multiplier);
            if (multiplier !== 1) log_message(trait.name + ' changed strike damage by ' +
                Math.round((multiplier - 1) * 100) + '%. ' + trait.counter, 'enemy_attacked');
        }
        game_stats.total_hits_taken += Number(!this.is_special_combat && !!target.tags.main_character);
        game_stats.total_hits_done += Number(!this.is_special_combat && !!fighter.tags.main_character);

        const armored = !!target.isWearingArmor();
        const skinUse = trigger => !this.is_special_combat && target.tags.main_character &&
            domainRegistry.command('skill_evolution','use')?.('Iron skin',trigger);
        const critical = effectiveCritChance(fighter.getFullStats().crit_rate, target.getFullStats().crit_resistance) > random("crit");
        const deflection = critical && skinUse('enemy-critical');
        let ordinary = damages_dealt;
        if(critical){
            damages_dealt = damages_dealt.map(val => val*fighter.getFullStats().crit_multiplier);
            critted = !deflection || armored;
            game_stats.total_crits_taken += Number(critted && !this.is_special_combat && !!target.tags.main_character);

            if(!this.is_special_combat && fighter.tags.main_character) {
                game_stats.total_crits_done++;
                add_xp_to_skill({skill: skills['Perception'], xp_to_add: 1/target_count});
            }
        }

        if(damages_dealt[0] > game_stats.strongest_hit) {
            game_stats.strongest_hit = damages_dealt[0];
        }

        if(!this.is_special_combat&&target.tags.main_character)defense_modifier+=getElementalDefenseModifier({enabled:game_options.elemental_affinities,attacker:fighter,equipment:target.getEquipment(),baseDamage:base_damage});
        if(!this.is_special_combat&&this.nativeExchangeHost){const charge=domainRegistry.command('pledges','resolvedCharge')?.({fighter,target});if(charge){damages_dealt=damages_dealt.map(n=>n*charge.multiplier);if(deflection)ordinary=ordinary.map(n=>n*charge.multiplier);}}
        const harvestHealth=target.getFullStats().health;
        // Damage types (damage_types.js): the attack's type mix against the defender's per-type protection; 1 when nothing is declared.
        const typed = typedStrike({fighter, target});
        let criticalReceipt;
        const settle_damage=deflection?(damage,mitigate)=>{
            criticalReceipt=settleSkinCritical(deflection,damage,mitigate(ordinary),armored);
            return criticalReceipt.damage;
        }:undefined;
        let {damage_taken, fainted} = target.takeDamage({damage_values: damages_dealt, defense_modifier, armor_penetration:fighter.getFullStats().armor_penetration??0, type_multiplier: typed.multiplier, give_skill_xp: (!this.is_special_combat && target.tags.main_character),settle_damage});
        if(criticalReceipt?.saved>0)log_message(armored?
            `${deflection.name} softened a critical that got through armor by ${criticalReceipt.saved} damage.`:
            `${deflection.name} turned a critical strike into an ordinary hit.`,'hero_attacked');

        const breathing = !fainted && skinUse('enemy-hit');
        if(breathing?.mode==='restore-stamina') {
            const stats = target.getFullStats();
            const restored = settleSkinStamina(breathing,{damage:damage_taken,raw:damages_dealt.reduce((sum,value)=>sum+value,0),
                armored,missing:stats.max_stamina-stats.stamina});
            if(restored>0) {
                stats.stamina += restored;
                update_displayed_stamina();
                log_message(armored?`${breathing.name} caught a hit that got through armor and restored ${restored} stamina.`:
                    `${breathing.name} caught the blow and restored ${restored} stamina.`,'hero_attacked');
            }
        }

        if(!this.is_special_combat&&this.nativeExchangeHost)domainRegistry.command('pledges','resolvedSiphon')?.({fighter,target,damage:Math.max(0,Math.min(damage_taken,harvestHealth-Math.max(0,target.getFullStats().health)))});

        if(!this.is_special_combat && fighter.tags.main_character && supportedHarvest(target.name)) {
            const weapon=fighter.getEquipment()?.weapon;
            const type=weapon?.weapon_type==='hammer'?'blunt':weapon?'cut':'physical';
            target.harvestDamage=damageRecord(target.harvestDamage,{health:harvestHealth,maxHealth:target.getFullStats().max_health,damage:damage_taken,critical:critted,type,hits:damages_dealt.length});
        }

        let callbackDraw=0;
        const damageMessage=target.on_damaged(fighter,()=>random(`on_damaged:${callbackDraw++}`));
        callbackDraw=0;
        const hitMessage=fighter.on_hit(target,()=>random(`on_hit:${callbackDraw++}`));
        if(damageMessage){
            const targetIndex=(is_attacker?this.defenders:this.attackers).indexOf(target);
            do_effect_animation({fighter_index:targetIndex,is_attacker:!is_attacker,message:damageMessage});
            log_message(damageMessage,"hero_attacked");
        }
        if(hitMessage){
            do_effect_animation({fighter_index,is_attacker,message:hitMessage});
            log_message(hitMessage,"hero_attacked");
        }

        if(!this.is_special_combat && target.tags.main_character) {
            
            if(!target.isWearingArmor()) {
                //no armor so either completely naked or in things with 0 def
                add_xp_to_skill({skill: skills["Iron skin"], xp_to_add: fighter.xp_value * target_count_xp_modifier});
            }

            add_xp_to_skill({skill: skills["Fortitude"], xp_to_add: (damage_taken**0.6)*target_count_xp_modifier});
        }

        // Native damage is physical and has no body-part roll. Do not invent one.
        const condt = (!this.is_special_combat && target.tags.main_character);
        log_message(combatHitText({target: target.name, damage: damage_taken,
            count: damages_dealt.length, critical: critted, blocked: partially_blocked, kind: typed.kind, note: typed.note}),
            condt ? (critted ? "hero_attacked_critically" : "hero_attacked")
                : (critted ? "enemy_attacked_critically" : "enemy_attacked"), {damageType: "physical", damageKind: typed.kind,
                combat: logEvent("hit", {amount: damage_taken, hits: damages_dealt.length, critical: critted, partial: partially_blocked, kind: typed.kind, note: typed.note})});

        if(game_options.do_enemy_onhit_animations) {
            do_onhit_animation({fighter_index: (is_attacker ? this.defenders : this.attackers).findIndex(x => x === target), is_attacker: !is_attacker});
        }

        const target_index = (is_attacker ? this.defenders : this.attackers).findIndex(x => x === target);

        if(fainted) {
            this.#settledTargets.add(target);
            if(target.tags.main_character) {
                if(!this.is_special_combat&&this.nativeExchangeHost)domainRegistry.command('combatReview','finish')?.({id:this.rngKey,outcome:'lost'});
                kill_player({is_combat: true});
                return;
            } else {
                // PS38 (proposal): a foe at zero is down, and the player's terms say what happens; Finish keeps today's YAIR exactly. Pulled
                // Blows (PS35) holds the blow, so the body is out cold unless the restraint slips; then the terms act on it. Scripted
                // encounters keep their own path.
                const down = fighter.tags.main_character && !this.is_special_combat && !this.encounterHooks ? this.#downTerms(target, random) : null;
                if(down && down.terms !== 'finish') {
                    this.#leaveDown({fighter, target, is_attacker, target_index, target_count_xp_modifier, down, logEvent});
                    return;
                }
                if(down?.slipped) log_message(`You could not hold that blow back.`, "enemy_defeated", {combat: logEvent("defeat")});
                const dropChanceModifier = this.encounterHooks?.planDefeat ? accessoryDropModifier(1/target_count**0.6667) * (this.encounterProfile?.dropChanceModifier ?? 1) : undefined;
                // Preflight before death hooks, defeat XP, loot and kill progress.
                const settlement = this.encounterHooks?.planDefeat?.({combat:this,fighter,target,dropChanceModifier});
                if(settlement?.duplicate) return;
                if(fighter.tags.main_character) {
                    const msg = target.on_death(fighter);
                    if (msg) {
                        do_effect_animation({fighter_index: (is_attacker ? this.defenders : this.attackers).findIndex(x => x === target), is_attacker: !is_attacker, message: msg});
                        log_message(msg, "hero_attacked");
                    }
                }

                log_message(target.name + " was defeated", "enemy_defeated", {combat: logEvent("defeat")});

                let observedDrops;
                if(!this.is_special_combat && fighter.tags.main_character && target.get_loot) {
                    add_xp_to_character(target.xp_value * target_count_xp_modifier, true);

                    let loot = settlement ? settlement.loot : target.get_loot({drop_chance_modifier: accessoryDropModifier(1/target_count**0.6667) * (this.encounterProfile?.dropChanceModifier ?? 1)});
                    observedDrops=loot.filter(row=>row.item_id).map(row=>({item_id:row.item_id,count:row.count}));
                    if(loot.length > 0) {
                        process_current_loot({loot_list: loot, is_combat: true});
                        loot = acquiredLootKeys(loot, item_templates);
                        character.addToInventory(loot);
                    }
                }
                
                kill_target({fighter_index, target_index, is_target_an_attacker: !is_attacker, observedDrops});
                if(!this.is_special_combat&&this.nativeExchangeHost&&this.defenders.every(e=>!e.is_alive))domainRegistry.command('combatReview','finish')?.({id:this.rngKey,outcome:'won'});
                this.encounterHooks?.afterDefeat?.({combat:this,fighter,target,settlement,dropChanceModifier});
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
        const fighter_data = is_attacker ? this.#data.attackers : this.#data.defenders;
        clearEngineTimeout(fighter_data.attack_loops[fighter_index]);
        const key = `${is_attacker ? "attackers" : "defenders"}:${fighter_index}`, schedule = this.#schedules[key];
        if(!schedule) return;
        delete this.#schedules[key];
        // Leave the count and drift correction where the last sub-tick that would have run put them.
        const fired = fired_subticks(schedule, engineNow());
        if(!schedule.prefinal_done && fired >= schedule.from) {
            const {prev, acc, adj} = schedule.states[fired];
            fighter_data.timers[fighter_index][0] = prev;
            fighter_data.timers[fighter_index][1] = prev;
            fighter_data.time_variance_acumulators[fighter_index] = acc;
            fighter_data.timer_adjustments[fighter_index] = adj;
        }
        if(this.#pendingLoops[key] === schedule.entry) schedule.entry.count = fired;
        freezeNativeAttackBar(is_attacker ? this.attackers_ui_slot : this.defenders_ui_slot, fighter_index);
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
