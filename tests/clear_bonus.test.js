import test from 'node:test';
import assert from 'node:assert/strict';
import {rollClearBonus, clearBonusMessage, clearBonusText, bonusKnown} from '../src/clear_bonus.js';

const rows = [{id: 'stash', label: "the gang's stash", chance: 0.3, hint: 'public', rewards: {money: 150},
    then: [{id: 'box', label: 'a locked strongbox', chance: 0.25, rewards: {items: [{item: 'Steel chainmail helmet'}]}}]}];

test('PS160: a nested bonus rolls only when its parent hits, each under its own key', () => {
    const seen = [];
    const draws = (values) => key => { seen.push(key); return values[key] ?? 0.99; };
    assert.deepEqual(rollClearBonus(rows, draws({})), [], 'a miss on the stash rolls nothing inside it');
    assert.deepEqual(seen, ['stash']);
    const hits = rollClearBonus(rows, draws({stash: 0.1, 'stash/box': 0.1}));
    assert.deepEqual(hits.map(h => [h.row.id, h.depth]), [['stash', 0], ['box', 1]]);
    assert.deepEqual(rollClearBonus(rows, draws({stash: 0.1})).map(h => h.row.id), ['stash']);
});

test('PS160: Reports mark a bonus as chance, with its odds and depth', () => {
    assert.equal(clearBonusMessage({row: rows[0], depth: 0}), "Clear bonus (about 1 in 3): the gang's stash.");
    assert.equal(clearBonusMessage({row: rows[0].then[0], depth: 1}), 'Rarer bonus (about 1 in 4, after the first): a locked strongbox.');
});

test('PS160: the location line names a known bonus and keeps an unseen rarer one as "?"', () => {
    assert.equal(clearBonusText([], {}), '');
    assert.equal(clearBonusText(rows, {}), " · sometimes: the gang's stash (about 1 in 3) · rarer: ?");
    const held = {'Steel chainmail helmet': {number: 1}};
    assert.ok(bonusKnown(rows[0].then[0], held));
    assert.equal(clearBonusText(rows, held), " · sometimes: the gang's stash (about 1 in 3) · rarer: a locked strongbox (about 1 in 4)");
    const hidden = [{...rows[0], hint: undefined}];
    assert.equal(clearBonusText(hidden, {}), ' · sometimes: ? · rarer: ?', 'an unannounced bonus with no items held stays unknown');
});

test('PS160: each hit becomes an ordinary reward object carrying its Reports line', async () => {
    const {clearBonusRewards} = await import('../src/clear_bonus.js');
    assert.deepEqual(clearBonusRewards(rows, key => key === 'stash' ? 0.1 : 0.9), [{money: 150, messages: ["Clear bonus (about 1 in 3): the gang's stash."]}]);
    assert.deepEqual(clearBonusRewards(undefined, () => 0), []);
});
