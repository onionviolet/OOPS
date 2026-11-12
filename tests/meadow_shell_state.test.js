import assert from 'node:assert/strict';
import test from 'node:test';
import {enrollMeadowShell, planMeadowShell, projectMeadowShell, validateMeadowShell} from '../src/meadow_shell_state.js';
import {meadowShellFightSpec} from '../src/meadow_shell_combat.js';
import {defenceAt} from '../src/tempo_location.js';

const hay = '{"id":"Meadow hay"}';
const cloth = '{"id":"Wool cloth"}';
const action = (state, name, clock, inventory = {}) => planMeadowShell(state, name, {clock, inventory});
const profile = body => ({stats: body, attackPower: body.attack, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5});
const helpers = {me: profile({attack: 4}), vitals: {health: 30, max_health: 30, stamina: 30, max_stamina: 30},
    enemyProfile: profile};

test('linkage and a saved delay change humidity, care and the actual combat defense profile of one creature', () => {
    const rescued = enrollMeadowShell(100);
    const fed = action(rescued, 'feed_shell', 100, {[hay]: 1});
    assert.deepEqual(fed.items, [{key: hay, amount: -1}]);
    assert.throws(() => action(fed.state, 'fit_inlet', 100), /Wool cloth/);
    const fitted = action(fed.state, 'fit_inlet', 100, {[cloth]: 1});
    assert.deepEqual(fitted.items, [{key: cloth, amount: -1}]);
    const dry = projectMeadowShell(fitted.state, 102);
    assert.deepEqual(dry.state.regulator.pending, {position: 'closed', at: 104});
    const loaded = validateMeadowShell(JSON.parse(JSON.stringify(dry.state)), 102);
    const wet = projectMeadowShell(loaded, 111);
    assert.deepEqual(wet, projectMeadowShell(fitted.state, 111));
    assert.equal(dry.condition.injury.remaining, 3);
    assert.equal(wet.condition.injury.remaining, 0);
    assert.equal(wet.state.work, 1);
    assert.equal(projectMeadowShell(fed.state, 111).state.work, 0);
    assert.equal(projectMeadowShell(fed.state, 111).condition.injury.remaining, 3);
    const a = meadowShellFightSpec(dry, helpers).fighters[1];
    const b = meadowShellFightSpec(wet, helpers).fighters[1];
    assert.equal(a.id, b.id);
    assert.equal(defenceAt(a.profile, 'torso').total, 6);
    assert.equal(defenceAt(b.profile, 'torso').total, 1);
    assert.equal(b.profile.attackPower, 3);
});

test('manual shelter changes a paid care interval and earns a finite ordinary task output', () => {
    const rescued = enrollMeadowShell(100);
    const fed = action(rescued, 'feed_shell', 100, {[hay]: 1}).state;
    assert.throws(() => action(fed, 'collect_driftwood', 108), /has not gathered/);
    const closed = action(fed, 'close_inlet', 100).state;
    const work = projectMeadowShell(closed, 108);
    assert.equal(work.condition.canWork, true);
    assert.equal(work.state.work, 4);
    const collected = action(work.state, 'collect_driftwood', 108);
    assert.deepEqual(collected.items, [{key: '{"id":"Rough wood log"}', amount: 1}]);
    assert.throws(() => action(collected.state, 'collect_driftwood', 108), /has not gathered/);
});

test('a linked inlet keeps cycling across partitioned time and reports bounded catch-up', () => {
    const state = action(enrollMeadowShell(100), 'fit_inlet', 100, {[cloth]: 1}).state;
    let current = state;
    let switches = 0;
    for (let clock = 101; clock <= 140; clock++) {
        const next = projectMeadowShell(current, clock).state;
        if (next.regulator.inlet !== current.regulator.inlet) switches++;
        current = next;
    }
    assert.ok(switches >= 4);
    assert.deepEqual(current, projectMeadowShell(state, 140).state);
    const capped = projectMeadowShell(current, 300);
    assert.equal(capped.state.regulator.clock, 204);
    assert.equal(capped.pending, true);
    assert.equal(action(capped.state, 'check_shell', 300).state.regulator.clock, 268);
});
