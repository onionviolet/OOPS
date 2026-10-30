import test from 'node:test';
import assert from 'node:assert/strict';
import {checkKey, passiveValue, playerCheckView, stratifiedChance} from '../src/check_keys.js';

const base = {subject: 'actor:companion-7', method: 'listen-at-door', tool: null,
    helpers: ['actor:friend-2'], period: {clock: 'world', day: 12},
    targetState: {door: 'closed', suspicion: 1}, attemptState: {effort: 2, fatigue: 1}};

test('check keys are stable for the same non-lead attempt and change with real factors', () => {
    const key = checkKey(base);
    assert.equal(checkKey({...base, helpers: [...base.helpers].reverse()}), key);
    assert.notEqual(checkKey({...base, method: 'search-with-lamp'}), key);
    assert.notEqual(checkKey({...base, period: {clock: 'world', day: 13}}), key);
    assert.notEqual(checkKey({...base, attemptState: {effort: 3, fatigue: 2}}), key);
});

test('passive values are stable arithmetic and require integer world inputs', () => {
    assert.equal(passiveValue(11, -2), 9);
    assert.equal(passiveValue(11, -2), 9);
    assert.throws(() => passiveValue(11, 0.5), /integer/);
});

test('stratified batch keeps a 30 percent rate near target and refuses budget exhaustion', () => {
    const results = stratifiedChance(91, 'farm:plot-2:day-8', 0.3, 100);
    assert.equal(results.length, 100);
    assert.ok(Math.abs(results.filter(Boolean).length - 30) <= 2);
    assert.ok(results.slice(30).some(Boolean) && !results.slice(0, 30).every(Boolean), 'successes are spread, not front-loaded');
    assert.deepEqual(stratifiedChance(91, 'farm:plot-2:day-8', 0.3, 100), results);
    assert.throws(() => stratifiedChance(91, 'farm:plot-2:day-8', 0.3, 513), /budget/);
});

test('player projection hides both failed reads and absent facts identically', () => {
    assert.deepEqual(playerCheckView({success: false, factPresent: true}), {status: 'unrevealed'});
    assert.deepEqual(playerCheckView({success: false, factPresent: false}), {status: 'unrevealed'});
    assert.deepEqual(playerCheckView({success: true, factPresent: false}), {status: 'unrevealed'});
    assert.deepEqual(playerCheckView({success: true, factPresent: true}), {status: 'found'});
});
