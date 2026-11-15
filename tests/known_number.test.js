// PS130: one renderer for numbers the life may not know.
import test from 'node:test';
import assert from 'node:assert/strict';
import {knownNumber} from '../src/ui/known_number.js';

test('known numbers are plain, guesses take ~, ranges take a dash, unknowns are ?', () => {
    assert.equal(knownNumber(12), '12');
    assert.equal(knownNumber(0.97), '1');
    assert.equal(knownNumber(0.97, {digits: 2}), '0.97');
    assert.equal(knownNumber(12, {known: false}), '~12');
    assert.equal(knownNumber(null, {low: 14, high: 10}), '10–14');
    assert.equal(knownNumber(undefined, {low: 12, high: 12}), '~12');
    assert.equal(knownNumber(undefined), '?');
    assert.equal(knownNumber(NaN, {known: true}), '?');
});
