import test from 'node:test';
import assert from 'node:assert/strict';
import {stackBonuses} from '../src/bonus_stacking.js';

const b = (value, type, source, stat = 'attack') => ({stat, value, type, source});

test('two morale bonuses give the higher one', () => {
    const r = stackBonuses([b(2, 'morale', 'bless'), b(4, 'morale', 'heroism')]).attack;
    assert.equal(r.total, 4);
});
test('morale plus luck add', () => {
    assert.equal(stackBonuses([b(2, 'morale', 'a'), b(1, 'luck', 'b')]).attack.total, 3);
});
test('untyped, dodge and circumstance add', () => {
    assert.equal(stackBonuses([b(1, 'untyped', 'a'), b(2, undefined, 'b')]).attack.total, 3);
    assert.equal(stackBonuses([b(1, 'dodge', 'a'), b(1, 'dodge', 'b'), b(1, 'circumstance', 'c'), b(1, 'circumstance', 'd')]).attack.total, 4);
});
test('a caller table making morale add changes the result', () => {
    const r = stackBonuses([b(2, 'morale', 'a'), b(4, 'morale', 'b')], {stacking: {morale: 'add'}}).attack;
    assert.equal(r.total, 6);
    assert.equal(r.suppressed.length, 0);
});
test('suppressed lists the loser and its winner, whichever comes first', () => {
    const lo = b(2, 'morale', 'bless'), hi = b(4, 'morale', 'heroism');
    for (const list of [[lo, hi], [hi, lo]]) {
        const r = stackBonuses(list).attack;
        assert.equal(r.suppressed.length, 1);
        assert.equal(r.suppressed[0].bonus.source, 'bless');
        assert.equal(r.suppressed[0].by.source, 'heroism');
    }
});
test('typed penalties keep the largest magnitude, untyped add, bonus and penalty of one type coexist', () => {
    assert.equal(stackBonuses([b(-2, 'morale', 'a'), b(-5, 'morale', 'b')]).attack.total, -5);
    assert.equal(stackBonuses([b(-2, 'untyped', 'a'), b(-5, 'untyped', 'b')]).attack.total, -7);
    assert.equal(stackBonuses([b(3, 'morale', 'a'), b(-2, 'morale', 'b')]).attack.total, 1);
});
test('stats are independent and bad input throws', () => {
    const r = stackBonuses([b(2, 'morale', 'a', 'attack'), b(2, 'morale', 'b', 'damage')]);
    assert.equal(r.attack.total + r.damage.total, 4);
    assert.throws(() => stackBonuses([{stat: 'x', value: NaN}]));
    assert.throws(() => stackBonuses([b(1, 'x', 'a')], {stacking: {x: 'sum'}}));
});
