import test from 'node:test';
import assert from 'node:assert/strict';
import {budgetReport, overBudget, tighten} from '../scripts/test_budget_reporter.mjs';

test('files over the default or their labelled budget are listed as warnings, slowest first', () => {
    const budget = {default_ms: 10000, files: {'tests/plays.test.js': {ms: 60000, why: 'plays the game'}}};
    const durations = new Map([['tests/a.test.js', 12000], ['tests/b.test.js', 25000], ['tests/plays.test.js', 50000], ['tests/c.test.js', 900]]);
    assert.deepEqual(overBudget(durations, budget).map(r => r.file), ['tests/b.test.js', 'tests/a.test.js']);
    const report = budgetReport(durations, budget);
    assert.match(report, /slowest files plays\.test\.js 50\.0s, b\.test\.js 25\.0s/);
    assert.match(report, /2 file\(s\) over budget \(warning only/);
    assert.equal(budgetReport(new Map(), budget), '');
});

test('the budget only ratchets down: faster labelled files tighten, files back under default lose their entry', () => {
    const budget = {default_ms: 20000, suite_sum_ms: 100000, files: {
        'tests/a.test.js': {ms: 120000, tier: 'slow', why: 'plays'}, 'tests/b.test.js': {ms: 40000, tier: 'slow', why: 'plays'},
        'tests/c.test.js': {ms: 40000, tier: 'slow', why: 'plays'}}};
    const durations = new Map([['tests/a.test.js', 30000], ['tests/b.test.js', 8000], ['tests/c.test.js', 35000]]);
    const {budget: next, changes} = tighten(budget, durations, {full: true});
    assert.equal(next.files['tests/a.test.js'].ms, 60000);
    assert.equal(next.files['tests/b.test.js'], undefined);
    assert.equal(next.files['tests/c.test.js'].ms, 40000, 'a slower run never raises a budget');
    assert.equal(next.suite_sum_ms, 73000);
    assert.equal(changes.length, 3);
    assert.equal(budget.files['tests/a.test.js'].ms, 120000, 'input untouched');
    assert.match(budgetReport(new Map([['tests/x.test.js', 130000]]), budget, {full: true}), /30% over the profiled 100\.0s; re-profile/);
});
