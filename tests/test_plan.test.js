// How a run uses the machine (scripts/test_plan.mjs) and what a push gate runs (scripts/push_gate.mjs).
import test from 'node:test';
import assert from 'node:assert/strict';
import {concurrencyFor, longestFirst, MIN_CONCURRENCY} from '../scripts/test_plan.mjs';
import {planGate, idleVerdict} from '../scripts/push_gate.mjs';
import {contentionScale} from '../scripts/test_budget_reporter.mjs';

test('concurrency follows the free cores, never below the floor, and the env dial wins', () => {
    assert.equal(concurrencyFor({cores: 18, load: 0.5, env: {}}), 17);
    assert.equal(concurrencyFor({cores: 18, load: 0, env: {}}), 18);
    assert.equal(concurrencyFor({cores: 18, load: 16.2, env: {}}), MIN_CONCURRENCY);
    assert.equal(concurrencyFor({cores: 18, load: 40, env: {}}), MIN_CONCURRENCY);
    assert.equal(concurrencyFor({cores: 18, load: 0, env: {YAIRPG_TEST_CONCURRENCY: '6'}}), 6);
});

test('the slowest known files start first; unknown files keep their order', () => {
    assert.deepEqual(longestFirst(['a', 'b', 'c', 'd'], {c: 90, a: 5}), ['c', 'a', 'b', 'd']);
    assert.deepEqual(longestFirst(['x', 'y'], {}), ['x', 'y']);
});

test('a push gate runs the reached tests, the full suite for wide paths or --full, and check:flow only for visible changes', () => {
    assert.deepEqual(planGate(['src/lotm_be_acting.js', 'docs/x.md']), {tests: 'changed', why: 'the files this push can reach', flow: true});
    assert.equal(planGate(['docs/x.md', 'scripts/aspect_pilot.mjs']).flow, false);
    for (const wide of ['package.json', 'build.js', 'src/main.js', 'src/save_files.js', 'scripts/headless/runner.mjs', 'tests/fixtures/a.mjs'])
        assert.equal(planGate([wide]).tests, 'full', wide);
    assert.equal(planGate(['docs/x.md'], {full: true}).tests, 'full');
});

test('budget limits stretch with the files run at once, from none at four to double at sixteen', () => {
    assert.deepEqual([4, 1, 13, 16, 18].map(contentionScale), [1, 1, 1.75, 2, 2]);
});

test('shardFiles balances files by known duration and loses none', async () => {
    const {shardFiles} = await import('../scripts/test_plan.mjs');
    const known = {a: 10, b: 9, c: 4, d: 3, e: 2};
    const groups = shardFiles(['a', 'b', 'c', 'd', 'e'], 2, known);
    assert.deepEqual(groups, [['a', 'd', 'e'], ['b', 'c']]);
    assert.deepEqual(shardFiles(['x', 'y'], 4).flat().sort(), ['x', 'y']);
});

test('the crowded idle ceiling fails only when every sample is over it', () => {
    assert.equal(idleVerdict([101, 100], 78).over, true);
    assert.equal(idleVerdict([101, 66], 78).over, false, 'a noisy first run is retried and the quiet one passes');
    assert.equal(idleVerdict([66], 78).over, false);
    assert.equal(idleVerdict([], 78).over, false);
});
