import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createCombatOptions, validateCombatOptions, validateEncounterCombatProfile} from '../src/absorb_p23/combat_options/runtime.js';
import {rollBaseCombatDamage, nextAttackTiming, get_hit_chance, mitigateCombatDamage} from '../src/combat_math.js';

function setup(state) {
    const inventory = {'P23 throwing stone': 3, 'P23 smoke pellet': 2, 'P23 scent pouch': 2};
    const calls = [];
    const host = {
        preflight: () => true,
        consumeItem: ({itemId}) => inventory[itemId] > 0 ? (--inventory[itemId], true) : false,
        escape: e => calls.push(['escape', e.awardKill]),
        offerEncounter: () => calls.push(['opportunity']),
    };
    return {runtime: createCombatOptions({state, host}), inventory, calls, host};
}

test('old saves absent; unsupported or malformed tactics reject before host mutation', () => {
    validateCombatOptions(undefined);
    const s = setup();
    for(const state of [{schema: 8}, {...s.runtime.snapshot(), selected: 'secret'}, {...s.runtime.snapshot(), lastEvent: -1}, {...s.runtime.snapshot(), extra: true}]) {
        assert.throws(() => createCombatOptions({state, host: s.host}));
    }
    assert.equal(s.inventory['P23 throwing stone'], 3);
});
test('paid throw can repeat with distinct native events, duplicate is inert', () => {
    const s = setup(); s.runtime.select('throw');
    assert.equal(s.runtime.beforeExchange(1, {}).kind, 'throw');
    s.runtime.select('throw');
    assert.equal(s.runtime.beforeExchange(1, {}).kind, 'duplicate');
    assert.equal(s.runtime.beforeExchange(2, {}).kind, 'throw');
    assert.equal(s.inventory['P23 throwing stone'], 1);
});
test('missing ammo and denied custody preserve selected tactic and inventory', () => {
    const s = setup(); s.runtime.select('throw'); s.host.preflight = () => false;
    assert.equal(s.runtime.beforeExchange(1, {}).blocked, 'throw');
    assert.equal(s.inventory['P23 throwing stone'], 3);
    s.host.preflight = () => true; s.inventory['P23 throwing stone'] = 0;
    assert.equal(s.runtime.beforeExchange(2, {}).kind, 'attack');
    assert.equal(s.runtime.snapshot().selected, 'throw');
});
test('smoke pays a real item and calls escape without any kill reward; no replay', () => {
    const s = setup(); s.runtime.select('smoke');
    assert.equal(s.runtime.beforeExchange(1, {}).kind, 'escaped');
    assert.deepEqual(s.calls, [['escape', false]]);
    assert.equal(s.runtime.beforeExchange(2, {}).kind, 'paused');
    assert.equal(s.inventory['P23 smoke pellet'], 1);
    assert.equal(s.runtime.resume(), null);
});
test('lure offers one authored opportunity per payment, can repeat, never pays a kill', () => {
    const s = setup();
    assert.equal(s.runtime.lure(1, {profileId: 'training'}), true);
    assert.equal(s.runtime.lure(1, {}), false);
    assert.equal(s.runtime.lure(2, {}), true);
    assert.deepEqual(s.calls, [['opportunity'], ['opportunity']]);
    assert.equal(s.inventory['P23 scent pouch'], 0);
});
test('pending tactic, break request and paused phase survive exact JSON export/import', () => {
    const s = setup(); s.runtime.select('throw'); s.runtime.requestBreak();
    const restored = setup(JSON.parse(JSON.stringify(s.runtime.snapshot()))).runtime;
    assert.deepEqual(restored.snapshot(), s.runtime.snapshot());
    assert.equal(restored.afterExchange({victory: false}), true);
    const paused = setup(JSON.parse(JSON.stringify(restored.snapshot()))).runtime;
    assert.equal(paused.beforeExchange(3, {}).kind, 'paused');
    assert.equal(paused.resume(), 'exchange-break');
    assert.equal(paused.resume(), null);
});
test('victory break resumes the pending native round once', () => {
    const s = setup(); s.runtime.requestBreak();
    assert.equal(s.runtime.afterExchange({victory: true}), true);
    assert.equal(s.runtime.resume(), 'encounter-break');
    assert.equal(s.runtime.resume(), null);
});
test('noncombat throwing training pays again per occurrence and uses native XP host', () => {
    const s = setup(); s.host.trainThrow = e => s.calls.push(['training', e.xp]);
    assert.equal(s.runtime.trainThrow(1, {}), true);
    assert.equal(s.runtime.trainThrow(1, {}), false);
    assert.equal(s.runtime.trainThrow(2, {}), true);
    assert.equal(s.inventory['P23 throwing stone'], 1);
    assert.deepEqual(s.calls, [['training', 1], ['training', 1]]);
});
test('P16 drop profile is optional and validates before mutation', () => {
    validateEncounterCombatProfile(undefined);
    validateEncounterCombatProfile({id: 'training.rung', dropChanceModifier: 1.2});
    for(const dropChanceModifier of [-1, Infinity, NaN, 101]) assert.throws(() => validateEncounterCombatProfile({id: 'training', dropChanceModifier}));
    assert.throws(() => validateEncounterCombatProfile({id: 'training', dropChanceModifier: 1, enemy: 'hidden'}));
});

// Execute the actual Combat methods with isolated host/display bindings. This is
// native SOURCE coverage, deliberately not a claim of browser gameplay.
function native(draw = 0, defense = 0, hp = 30, runtime, speeds = [1, 1]) {
    const calls = {xp: 0, loot: 0, kills: 0, rounds: 0, timers: [], delays: []};
    const stats = {attack_count: 3, attack_points: 10, agility: 10, intuition: 1, crit_rate: 0, crit_multiplier: 1.3, attack_speed: 1, stamina: 10, stamina_efficiency: 1};
    const actor = (main) => ({name: main ? 'Hero' : 'Target', tags: {main_character: main}, is_alive: true, xp_value: 1,
        getFullStats: () => ({...stats, attack_speed: speeds[main ? 0 : 1]}), getAttackPower: () => 5, getStaminaMultiplier: () => 1, hasShield: () => false,
        isWearingArmor: () => defense > 0, getEquipment: () => ({}), on_damaged() {}, on_hit() {}, on_death() {},
        takeDamage({damage_values}) {const damage_taken = mitigateCombatDamage(damage_values, defense); hp -= damage_taken; return {damage_taken, fainted: hp <= 0};},
        get_loot: () => (calls.loot++, []),
    });
    const hero = actor(true), target = actor(false);
    const context = {Math: Object.assign(Object.create(Math), {random: () => draw}), Date, structuredClone, validateEncounterCombatProfile,
        rollBaseCombatDamage: (...args) => rollBaseCombatDamage(...args, () => draw), nextAttackTiming, get_hit_chance,
        config: {}, document: {getElementById: () => null}, character: {addToInventory() {}}, skills: {Combat: {}}, enemy_tag_to_skill_mapping: {}, item_templates: {},
        game_options: {}, game_stats: {total_hits_taken: 0, total_hits_done: 0, total_crits_taken: 0, total_crits_done: 0, strongest_hit: 0},
        durability: {landedHit: () => false}, accessoryDropModifier: x => x, getElementalDefenseModifier: () => 0,
        add_xp_to_character: () => calls.xp++, add_xp_to_skill: () => false,
        kill_target: () => { calls.kills++; target.is_alive = false; }, kill_player() {},
        finish_combat_round: () => calls.rounds++, selected_stance: {id: 'normal', stamina_cost: 1}, current_stance: {id: 'normal', stamina_cost: 1},
        change_stance() {}, tickrate: 1, use_stamina() {}, setTimeout: (cb, delay) => (calls.delays.push(delay), calls.timers.push(cb), calls.timers.length), clearTimeout() {},
    };
    for(const k of ['log_message','update_displayed_health','update_stance_tooltip','process_current_loot','do_onhit_animation','do_onstart_animation','fill_fighter_divs','remove_onhit_animation','update_attack_bar','update_displayed_health_of_fighter']) context[k] = () => {};
    let source = fs.readFileSync(new URL('../src/models/combat.js', import.meta.url), 'utf8').replace(/^import .*;\n/gm, '').replace('export default Combat;', 'globalThis.NativeCombat = Combat;');
    vm.runInNewContext(source, context);
    const combat = new context.NativeCombat({attackers: [hero], defenders: [target], combatOptions: runtime, nextCombatEvent: () => 1});
    const strike = () => combat.doCombatAction({fighter_index: 0, is_attacker: true, target, attack_power: 5, target_count: 1, attack_count: 1});
    const exchange = () => {combat.start(); calls.timers = []; combat.doAttackLoop({fighter_index: 0, is_attacker: true, base_cooldown: 1, actual_cooldown: 1, attack_power: 50, targets: [target], target_count: 1, count: 59}); calls.timers.at(-1)();};
    return {calls, combat, strike, exchange, health: () => hp};
}
test('actual native strike hits armor with single projectile, misses with native hit roll', () => {
    const hit = native(0, 4); hit.strike(); assert.equal(hit.health(), 28);
    const miss = native(.99); miss.strike(); assert.equal(miss.health(), 30);
});
test('actual native defeat awards once, duplicate dead target does not repay', () => {
    const n = native(0, 0, 1); n.strike(); n.strike();
    assert.equal(n.calls.kills, 1); assert.equal(n.calls.xp, 1); assert.equal(n.calls.loot, 1);
});
test('actual cooldown exchange consumes ammo, then break prevents scheduling another swing', () => {
    const s = setup(); s.runtime.select('throw'); s.runtime.requestBreak();
    const n = native(0, 4, 30, s.runtime); n.exchange();
    assert.equal(s.inventory['P23 throwing stone'], 2); assert.equal(n.health(), 28);
    assert.equal(s.runtime.snapshot().phase, 'exchange-break'); assert.equal(n.calls.timers.length, 1);
});
test('actual smoke exchange never invokes native damage or loot settlement', () => {
    const s = setup(); s.runtime.select('smoke'); const n = native(0, 0, 1, s.runtime); n.exchange();
    assert.equal(n.health(), 1); assert.equal(n.calls.kills, 0); assert.equal(n.calls.xp, 0); assert.equal(n.calls.loot, 0); assert.equal(n.calls.rounds, 0);
});
test('actual victory break keeps next encounter pending until one explicit resume', () => {
    const s = setup(); s.runtime.select('throw'); s.runtime.requestBreak(); const n = native(0, 0, 1, s.runtime); n.exchange();
    assert.equal(n.calls.kills, 1); assert.equal(n.calls.rounds, 0);
    assert.equal(n.combat.resumeCombatOptions(), true); assert.equal(n.combat.resumeCombatOptions(), false); assert.equal(n.calls.rounds, 1);
});
test('R51 native independent cooldowns retain a 4:1 speed ratio without a burst engine', () => {
    const n = native(0, 0, 30, undefined, [4, 1]); n.combat.start();
    assert.equal(n.calls.delays[0] / n.calls.delays[1], 4);
    assert.equal(n.calls.delays[1], 1000 / 60);
});
