import test from 'node:test';
import assert from 'node:assert/strict';
import {readProfileState, beginAttempt, enemySpecification, planExchange, planSettlement,
    previewExchange, finishAttempt, statsForLevel, createTrainingEnemy, createTrainingZone, PROFILE, AREA_ID, WORLD_ID} from '../src/absorb_p23/encounter_profiles/profile.js';
const context = {worldId: WORLD_ID, locationId: AREA_ID, nativeEligible: true};
const begin = seed => beginAttempt(undefined, {...context, seed});
const settle = (state, extra = {}) => planSettlement(state, {...context,
    eventId: `p23.reed-circle:${state.pending.attempt}:kill`, rank: state.pending.level, defeated: true, ...extra});
test('old save absence is inert and strict schemas reject unknown or malformed state', () => {
    assert.deepEqual(readProfileState(undefined), {schema: 1, nextAttempt: 1, completed: 0, pending: null});
    for (const value of [null, [], {schema: 2}, {...readProfileState(), foreign: true}, {...readProfileState(), nextAttempt: Infinity}])
        assert.throws(() => readProfileState(value));
});
test('saved seeds reproduce all authored bands across two hundred attempts', () => {
    const levels = new Set();
    for (let seed = 0; seed < 200; seed++) {
        const state = begin(seed), spec = enemySpecification(state); levels.add(state.pending.level);
        assert.deepEqual(enemySpecification(readProfileState(JSON.parse(JSON.stringify(state)))), spec);
        for (const [key, [lo, hi]] of Object.entries(PROFILE.stats)) assert.ok(spec.stats[key] >= lo && spec.stats[key] <= hi);
    }
    assert.deepEqual([...levels].sort(), [1, 2, 3]);
});
test('level scaling retains native stat names and no shared template mutation', () => {
    const before = JSON.stringify(PROFILE);
    class Enemy {constructor(spec) {this.spec = spec; spec.stats.health = 0; spec.loot_list.push({});}}
    createTrainingEnemy(begin(3), Enemy);
    assert.equal(JSON.stringify(PROFILE), before);
    assert.equal(enemySpecification(begin(3)).loot_list.length, 0);
    assert.deepEqual(statsForLevel(1), {health: 24, attack: 3, agility: 6, dexterity: 6, intuition: 4, magic: 0, defense: 1, attack_speed: 0.7, attack_count: 1});
});
test('native admission rejects before mutation and cannot reroll a pending encounter', () => {
    const state = begin(4), before = JSON.stringify(state);
    assert.throws(() => beginAttempt(state, {...context, seed: 6}));
    assert.throws(() => beginAttempt(undefined, {...context, worldId: 'base.frontier', seed: 6}));
    assert.throws(() => planExchange(state, {...context, nativeEligible: false, stanceId: 'normal'}));
    assert.equal(JSON.stringify(state), before);
});
test('Reed sweep is probability gated and defensive counter prevents target status', () => {
    let seen = false, ordinary = false;
    for (let seed = 0; seed < 30; seed++) {
        const a = planExchange(begin(seed), {...context, stanceId: 'normal'});
        const b = planExchange(begin(seed), {...context, stanceId: 'defensive'});
        assert.equal(a.move, b.move);
        if (a.move) {seen = true; assert.equal(a.status.remainingExchanges, 1); assert.equal(b.countered, true); assert.equal(b.status, null);}
        else {ordinary = true; assert.equal(a.status, null);}
    }
    assert.ok(seen && ordinary);
});
test('exchange cursor and one-exchange status survive export/import without reroll', () => {
    let state = begin(2);
    for (let i = 0; i < 12; i++) {
        const restored = readProfileState(JSON.parse(JSON.stringify(state)));
        const options = {...context, stanceId: i % 2 ? 'defensive' : 'normal'};
        const a = planExchange(state, options), b = planExchange(restored, options);
        assert.deepEqual(a, b); state = a.state;
    }
    assert.equal(state.pending.exchange, 12);
});
test('area rank and native luck modifier affect a single deterministic draw', () => {
    let drops = 0;
    for (let seed = 0; seed < 60; seed++) {
        const state = begin(seed), a = settle(state), b = settle(state);
        assert.deepEqual(a, b);
        assert.equal(a.chance, 0.2 * (1 + (state.pending.level - 1) * 0.25));
        if (a.loot.length) drops++;
        assert.deepEqual(settle(state, {dropChanceModifier: 100}).loot, [{item_id: PROFILE.drop.item_id, count: 1}]);
        assert.deepEqual(settle(state, {dropChanceModifier: 0}).loot, []);
    }
    assert.ok(drops > 0 && drops < 60);
});
test('settlement state suppresses duplicate publication including after restore', () => {
    const first = settle(begin(0), {dropChanceModifier: 100});
    const duplicate = settle(readProfileState(JSON.parse(JSON.stringify(first.state))));
    assert.equal(duplicate.duplicate, true); assert.deepEqual(duplicate.loot, []);
    assert.equal(first.duplicate, false); assert.equal(first.loot.length, 1);
});
test('wrong event, rank, absent kill and nonfinite modifiers reject without changes', () => {
    const state = begin(0), before = JSON.stringify(state);
    for (const extra of [{eventId: 'foreign'}, {rank: 9}, {defeated: false}, {dropChanceModifier: NaN}, {dropChanceModifier: -1}]) assert.throws(() => settle(state, extra));
    assert.equal(JSON.stringify(state), before);
});
test('repeat ladder has new occurrence IDs and no lifetime cap; old events fail', () => {
    let state = readProfileState();
    for (let i = 0; i < 20; i++) {
        state = beginAttempt(state, {...context, seed: i});
        if (i) assert.throws(() => settle(state, {eventId: 'p23.reed-circle:1:kill'}));
        state = finishAttempt(settle(state).state, context);
    }
    assert.equal(state.completed, 20); assert.equal(state.nextAttempt, 21); assert.equal(state.pending, null);
});
test('abandon pays no drop/completion and retires the occurrence', () => {
    const state = begin(1); assert.throws(() => finishAttempt(state, context));
    const left = finishAttempt(state, {...context, abandon: true});
    assert.equal(left.completed, 0); assert.equal(left.nextAttempt, 2);
    assert.throws(() => settle(left));
});
test('native zone contract is optional, one group and repeatable with dojo parent', () => {
    class CombatZone {constructor(spec) {Object.assign(this, spec);}}
    const zone = createTrainingZone({CombatZone, parentLocation: {id: 'Proto23 Dojo lobby'}});
    assert.equal(zone.id, AREA_ID); assert.equal(zone.is_challenge, false); assert.equal(zone.enemy_stat_variation, 0);
    assert.deepEqual(zone.enemy_group_size, [1, 1]); assert.throws(() => createTrainingZone({CombatZone, parentLocation: {id: 'Village'}}));
});

test('intent preview is stable without cursor mutation and resolution reads live counter', () => {
    for (let seed = 0; seed < 20; seed++) {
        const state = begin(seed), before = JSON.stringify(state);
        const preview = previewExchange(state, context);
        assert.deepEqual(previewExchange(state, context), preview);
        const resolved = planExchange(state, {...context, stanceId: 'defensive'});
        assert.equal(preview.move, resolved.move);
        assert.equal(resolved.status, null);
        assert.equal(JSON.stringify(state), before);
    }
});
