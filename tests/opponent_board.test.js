import test from 'node:test';
import assert from 'node:assert/strict';
import {projectNativeOpponents, letterFor, factText, healthText, healthFill, knowledgeOf, encounterCaption, kindHue, KIND_HUES} from '../src/opponent_board.js';
import {boardLayout, LAYOUT_SPEC} from '../src/layout_spec.js';

const row = (i, hp = '19/20 hp') => ({id: `defender_${i}_div`, name: 'Starving wolf rat', hp, healthProgress: 95, attackProgress: 40,
    facts: [{label: 'Attack', value: '4 dmg'}, {label: 'Defense', value: '???'}]});

test('native rows project to the public shape with stable letters and inherited readout marks', () => {
    const board = projectNativeOpponents([row(0), row(1, '0/20 hp'), row(2, 'Health not yet available')], {groupsLeft: '15 / 15', clears: 'Clears: [0]'});
    assert.deepEqual(board.opponents.map(o => o.letter), ['A', 'B', 'C']);
    assert.equal(board.opponents[0].facts[0].knowledge, 'native');
    assert.equal(board.opponents[0].facts[1].knowledge, 'unknown');
    assert.equal(board.opponents[1].defeated, true);
    assert.equal(healthText(board.opponents[1]), 'Defeated');
    assert.equal(healthFill(board.opponents[1]), 0);
    assert.equal(board.opponents[2].health.knowledge, 'unknown');
    assert.equal(healthText(board.opponents[2]), '??? hp');
    assert.equal(healthFill(board.opponents[2]), null);
    assert.equal(encounterCaption(board), '3 opponents · inspect · 1 defeated · 15 / 15 groups left · Clears: [0]');
    assert.deepEqual([25, 26, 27, 51, 52].map(letterFor), ['Z', 'AA', 'AB', 'AZ', 'BA']);
});

test('missing knowledge never reads as known (NX22)', () => {
    assert.equal(factText({label: 'Attack', value: '4 dmg'}), '???');
    assert.equal(factText({label: 'Attack', value: '4 dmg', knowledge: 'unknown'}), '???');
    assert.equal(factText({label: 'Attack', value: '3–5 dmg', knowledge: 'partial'}), '~3–5 dmg');
    assert.equal(factText({label: 'Attack', value: '4 dmg', knowledge: 'known'}), '4 dmg');
    const bare = {name: 'Wolf', health: {text: '5/8 hp', progress: 62}, facts: [{label: 'Attack', value: '4 dmg'}]};
    assert.equal(healthText(bare), '??? hp');
    assert.equal(healthFill(bare), null);
    assert.equal(knowledgeOf(bare), 'unknown');
    assert.equal(knowledgeOf({health: {knowledge: 'known'}, facts: [{knowledge: 'known'}, {knowledge: 'unknown'}]}), 'partial');
});

test('board layout follows the count bands and never narrows columns below their minimum', () => {
    const at = (count, widthEm, groups) => boardLayout({count, widthEm, groups});
    assert.deepEqual([1, 3, 4, 5, 8, 9, 20].map(n => at(n, 40, Array(n).fill(1)).layout), ['single', 'rows', 'rows', 'grid', 'grid', 'dense', 'dense']);
    assert.equal(at(8, 40, Array(8).fill(1)).columns, 2);
    assert.equal(at(8, 21, Array(8).fill(1)).columns, 1, 'narrow: more rows, not smaller text (R2)');
    assert.equal(at(9, 50, Array(9).fill(1)).columns, 3);
    assert.equal(at(20, 22, Array(20).fill(1)).visibleRows, LAYOUT_SPEC.opponentBoard.maxVisibleRows);
});

test('repeated names group from five opponents, keeping one cell per opponent (UX17)', () => {
    assert.equal(boardLayout({count: 3, widthEm: 21, groups: [3]}).grouped, false, 'small fights keep full rows');
    const nine = boardLayout({count: 9, widthEm: 21.7, groups: [9]});
    assert.equal(nine.grouped, true);
    assert.equal(nine.columns, 3);
    assert.equal(nine.visibleRows, 4, 'one label and three rows');
    const mixed = boardLayout({count: 8, widthEm: 21.7, groups: [3, 3, 2]});
    assert.equal(mixed.visibleRows, 6);
    assert.equal(boardLayout({count: 8, widthEm: 40, groups: Array(8).fill(1)}).grouped, false, 'all different names are not grouped');
});

test('the engine lane projection (schema 1) maps onto the board shape', async () => {
    const {fromCombatOpponentsProjection} = await import('../src/opponent_board.js');
    const board = fromCombatOpponentsProjection({schema: 1, active: true, disclosure: 'native-legacy', count: 2, alive: 1, opponents: [
        {slot: 'opponent-1', index: 0, name: 'Starving wolf rat', defeated: false, health: {current: 19, max: 20, fraction: 0.95}, facts: [{id: 'attack', label: 'Attack', known: true, value: '4 dmg', number: 4}, {id: 'defense', label: 'Defense', known: false}]},
        {slot: 'opponent-2', index: 1, name: 'Starving wolf rat', defeated: true, health: {current: 0, max: 20, fraction: 0}, facts: []}]});
    assert.deepEqual(board.opponents.map(o => [o.id, o.letter, healthText(o)]), [['opponent-1', 'A', '19/20 hp'], ['opponent-2', 'B', 'Defeated']]);
    assert.deepEqual(board.opponents[0].facts.map(factText), ['4 dmg', '???']);
    assert.equal(fromCombatOpponentsProjection({schema: 1, active: false, opponents: []}).opponents.length, 0);
});

test('R22b: a tall slot stacks the board in one column; a short one keeps R20 bands', () => {
    // 8 mixed opponents, 3 kinds: 8 rows plus 3 group labels.
    const tall = boardLayout({count: 8, widthEm: 28, heightEm: 30, groups: [3, 3, 2]});
    assert.equal(tall.columns, 1); assert.equal(tall.visibleRows, 11); assert.equal(tall.stacked, true);
    const short = boardLayout({count: 8, widthEm: 28, heightEm: 12, groups: [3, 3, 2]});
    assert.ok(short.columns > 1, 'not every row fits: columns as in R20');
    assert.ok(short.visibleRows <= Math.floor(12 / LAYOUT_SPEC.opponentBoard.rowEm), 'visible rows follow the slot');
    const r20 = boardLayout({count: 8, widthEm: 28, groups: [3, 3, 2]});
    assert.equal(r20.columns, 3, 'no height: R20 grouped columns'); assert.equal(r20.visibleRows, 6, 'three labels and one row per group at three columns');
});

test('R22b: kind hues follow first appearance in slot order and agree for board and log', () => {
    const names = ['Starving wolf rat', 'Wolf rat', 'Elite wolf rat', 'Starving wolf rat', 'Wolf rat'];
    assert.deepEqual(names.map(n => kindHue(names, n)), [0, 1, 2, 0, 1]);
    assert.equal(kindHue(names, 'Boar'), null);
    const many = Array.from({length: KIND_HUES + 1}, (_, i) => `Kind ${i}`);
    assert.equal(kindHue(many, `Kind ${KIND_HUES}`), 0, 'hues repeat past the set; letters still tell them apart');
});
