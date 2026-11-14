import test from 'node:test';
import assert from 'node:assert/strict';
import {formatDecimal, formatPercent, formatMultiplier, formatRatio, formatDuration, moneyParts, formatMoneyText} from '../src/number_format.js';

test('one format per quantity (UR117, element audit UIC102)', () => {
    assert.equal(formatPercent(0.05), '5%');
    assert.equal(formatPercent(0.125), '12.5%');
    assert.equal(formatMultiplier(1.3), '×1.3');
    assert.equal(formatDecimal(31.623, 1), '31.6');
    assert.equal(formatRatio(0, 10, 'xp'), '0/10 xp');
    assert.equal(formatDuration(45), '45 min');
    assert.equal(formatDuration(60), '1 h');
    assert.equal(formatDuration(90), '1 h 30 min');
    assert.equal(formatDuration(1440 * 2 + 180), '2 days 3 h');
});

test('money text matches the purse denominations', () => {
    assert.deepEqual(moneyParts(104), [[10, 'C'], [4, 'W']]);
    assert.equal(formatMoneyText(104), '10C 4W');
    assert.equal(formatMoneyText(104, {denominations: false}), '104 coins');
    assert.equal(formatMoneyText(1), '1W');
    assert.equal(formatMoneyText(0), 'nothing');
    assert.equal(formatMoneyText(123456), '1G 23S 45C 6W');
    assert.equal(formatMoneyText(-30), '-3C');
});

test('formatGlance rounds for a list and keeps one of a thing singular (UIC148)', async () => {
    const {formatGlance} = await import('../src/number_format.js');
    assert.equal(formatGlance(31.623, 'AP'), '31.6 AP');
    assert.equal(formatGlance(1.234, 'damage'), '1.23 damage');
    assert.equal(formatGlance(1, 'points'), '1 point');
    assert.equal(formatGlance(1, 'hits'), '1 hit');
    assert.equal(formatGlance(12, 'points'), '12 points');
    assert.equal(formatGlance(0, 'hp/s'), '0 hp/s');
    assert.equal(formatGlance(NaN, 'AP'), '?');
});

test('shortOfText names how many materials a recipe lacks (UIC172)', async () => {
    const {shortOfText} = await import('../src/crafting_visibility.js');
    assert.equal(shortOfText([{missing: true}, {missing: false}, {missing: false}]), '1 material short');
    assert.equal(shortOfText([{missing: true}, {missing: true}, {missing: false}]), '2 of 3 materials short');
});
