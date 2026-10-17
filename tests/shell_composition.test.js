import test from 'node:test';
import assert from 'node:assert/strict';
import { topRowHeight } from '../src/shell_composition.js';

test('top row follows You when idle and ignores long place prose', () => {
    assert.equal(topRowHeight({player: 300, focus: 900, combat: false, board: 688, fontSize: 14}), 306);
});

test('in a fight the taller of You and the opponent cards sets the top row', () => {
    assert.equal(topRowHeight({player: 300, focus: 380, combat: true, board: 688, fontSize: 14}), 386);
});

test('the bottom row keeps eleven text lines and the top row at most 62% of the board', () => {
    // 21px text on a 688px board: 688 - 231 = 457 is above 62% (426.56), so 62% wins.
    assert.equal(topRowHeight({player: 900, focus: 0, combat: false, board: 688, fontSize: 21}), 427);
    assert.equal(topRowHeight({player: 900, focus: 0, combat: false, board: 500, fontSize: 21}), 269);
});

test('a nearly empty You still gets ten text lines', () => {
    assert.equal(topRowHeight({player: 20, focus: 0, combat: false, board: 688, fontSize: 14}), 140);
});

test('companions: idle shows Journal (R21: Skills off by Weibao\'s word), a fight shows Skills only, undiscovered stay out', async () => {
    const { companionsFor } = await import('../src/shell_composition.js');
    assert.deepEqual(companionsFor({combat: false, available: ['local-actions', 'records', 'skills']}), ['records']);
    assert.deepEqual(companionsFor({combat: true, available: ['records', 'skills']}), ['skills']);
    assert.deepEqual(companionsFor({combat: false, available: ['skills']}), []);
    assert.deepEqual(companionsFor({combat: true, available: ['records']}), []);
});

test('rows that yield grow the top row only up to the R14 default', () => {
    // 14px: cap is max(240, 245) = 245 (55% of 688 is 378.4).
    assert.equal(topRowHeight({player: 200, elastic: 100, focus: 0, combat: false, board: 688, fontSize: 14}), 251);
    assert.equal(topRowHeight({player: 200, elastic: 30, focus: 0, combat: false, board: 688, fontSize: 14}), 236);
    // Core content above the cap still counts in full.
    assert.equal(topRowHeight({player: 300, elastic: 100, focus: 0, combat: false, board: 688, fontSize: 14}), 306);
});

test('on a tall screen yielding rows may use 38% of the viewport, as the R14 default did', () => {
    assert.equal(topRowHeight({player: 300, elastic: 400, focus: 0, combat: false, board: 1348, fontSize: 21, viewport: 1440}), 553);
});

test('R21 control box and bar helpers', async () => {
    const {controlBoxLabel} = await import('../src/ui/control_box.js');
    const {inventoryLabel, reportsLabel, foldCategory} = await import('../src/shell_control_boxes.js');
    const {overflowFrom} = await import('../src/game_bar.js');
    assert.equal(controlBoxLabel([{text: 'a', isDefault: true}], 'All'), 'All');
    assert.equal(inventoryLabel({folded: false, category: 'all', categoryCount: '21', search: '', shown: '21', sort: 'Name', ascending: true}), 'Name ↑');
    assert.equal(inventoryLabel({folded: true, category: 'usable', categoryCount: '9', search: 'br', shown: '2', sort: 'Value', ascending: false}), 'Use 9 · "br" 2 · Value ↓', 'every non-default choice is named (CB4)');
    assert.equal(reportsLabel({enabled: 6, total: 6, follow: 'hold', combatStopped: false}), 'All reports');
    assert.equal(reportsLabel({enabled: 4, total: 6, follow: 'always', combatStopped: true}), '4/6 kinds · Follow always · Combat off');
    assert.equal(foldCategory(340, 21), true); assert.equal(foldCategory(500, 21), false); assert.equal(foldCategory(340, 14), false);
    assert.equal(overflowFrom([50, 50, 50], 120), 2); assert.equal(overflowFrom([50, 50], 200), 2);
});
