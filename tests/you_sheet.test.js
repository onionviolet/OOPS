import test from 'node:test';
import assert from 'node:assert/strict';
import {youSheetView} from '../src/you_sheet.js';
import {observerView} from '../src/observer_view.js';
import {LAYOUT_SPEC} from '../src/layout_spec.js';

const observer = observerView({});
const snapshot = {level: 3, stats: {strength: 12, agility: 8.5, dexterity: 10, intuition: 10, magic: 0}, titles: ['Rat catcher'], quest: {text: 'Win a round.'}};
const section = (view, id) => view.sections.find(s => s.id === id);

test('a fresh life shows native stats exactly and no status window', () => {
    const view = youSheetView(snapshot, observer, null);
    assert.equal(view.self, true);
    assert.deepEqual(section(view, 'stats').rows.map(r => [r.label, r.text, r.state]),
        [['Strength', '12', 'known'], ['Agility', '8.5', 'known'], ['Dexterity', '10', 'known'], ['Intuition', '10', 'known'], ['Magic', '0', 'known']]);
    assert.equal(section(view, 'standing'), undefined);
    assert.equal(view.reads.some(r => r.means === 'status-window'), false);
    assert.equal(view.sections.some(s => s.rows.some(r => r.id === 'unread')), false);
});

test('the status window is a read the sheet gains once awakened', () => {
    const view = youSheetView(snapshot, observer, {points: 2});
    assert.equal(view.reads.some(r => r.means === 'status-window'), true);
    assert.deepEqual(section(view, 'standing').rows.map(r => [r.label, r.text]), [['System points', '2'], ['System quest', 'Win a round.']]);
    // Scoped to standing, so it never changes how the stats rows are credited.
    assert.equal(section(view, 'stats').rows.every(r => r.basis === 'Your own sense of yourself'), true);
});

test('the old status-window panel id stays in the You box so a saved layout still opens it', () => {
    assert.ok(LAYOUT_SPEC.boxes.you.panels.includes('status-window'));
});
