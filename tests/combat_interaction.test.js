import test from 'node:test';
import assert from 'node:assert/strict';
import {HANDOVER_LABEL, HANDOVER_TEXT, captureTempoFocus, restoreTempoFocus, newTempoLines} from '../src/ui/tempo_interaction.js';
import {TEMPO_MOVES} from '../src/tempo_fight.js';

test('cautious handover describes its actual non-attacking choices and withdrawal risk', () => {
    assert.doesNotMatch(HANDOVER_LABEL + HANDOVER_TEXT, /safe/i);
    assert.match(HANDOVER_TEXT, /brace, tend or back away/);
    assert.match(HANDOVER_TEXT, /does not attack/);
    assert.match(HANDOVER_TEXT, /fail.*free blow/);
    assert.match(TEMPO_MOVES.withdraw.text, /free blow/);
    assert.match(TEMPO_MOVES.yield.text, /refuse/);
    assert.match(TEMPO_MOVES.guard.text, /next blow/);
});

test('redraw restores the same live combat control, or a status when it is gone or disabled', () => {
    let focused;
    const doc = {activeElement: null};
    const button = (key, value, disabled = false) => ({dataset: {[key]: value}, disabled, focus(options) {focused = {target: this, options};}});
    const old = button('fightOption', 'jab'); doc.activeElement = old;
    let buttons = [];
    const host = {ownerDocument: doc, contains: node => node === old, querySelectorAll: () => buttons};
    const status = {focus(options) {focused = {target: this, options};}};
    const previous = captureTempoFocus(host, ['fightOption', 'fightAim']);
    const replacement = button('fightOption', 'jab'); buttons = [replacement];
    restoreTempoFocus(host, previous, status);
    assert.deepEqual(focused, {target: replacement, options: {preventScroll: true}});
    buttons = [button('fightOption', 'jab', true)];
    restoreTempoFocus(host, previous, status);
    assert.equal(focused.target, status);
    buttons = [];
    restoreTempoFocus(host, previous, status);
    assert.equal(focused.target, status);
    doc.activeElement = {};
    focused = null;
    restoreTempoFocus(host, captureTempoFocus(host, ['fightOption']), status);
    assert.equal(focused, null, 'a redraw does not steal focus from outside the fight');
});

test('fight feedback includes both the refused move and its opponent response when the log rolls', () => {
    const previous = ['older', 'Mara misses.', 'You brace.'];
    const current = ['Mara misses.', 'You brace.', 'You offer to yield, but it is refused.', 'Mara misses.'];
    assert.deepEqual(newTempoLines(previous, current), ['You offer to yield, but it is refused.', 'Mara misses.']);
    assert.deepEqual(newTempoLines(current, current), []);
});
