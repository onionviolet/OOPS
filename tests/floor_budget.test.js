import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {budgetViolations} = require('../scripts/floor/budgets.cjs');

test('floor budgets report each measured metric above its configured maximum', () => {
    assert.deepEqual(budgetViolations({wait349Ms: 3100, saveBytes: 120}, {wait349Ms: 3000, saveBytes: 120}), ['wait349Ms: 3100 exceeds budget 3000']);
});

test('floor budgets name absent measurements and reject invalid limits', () => {
    assert.deepEqual(budgetViolations({}, {packLoadMs: 10}), ['packLoadMs: receipt value is missing or not finite']);
    assert.throws(() => budgetViolations({}, {packLoadMs: Infinity}), /finite number/);
});
