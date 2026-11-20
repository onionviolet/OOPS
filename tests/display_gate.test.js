// Display gate (O21, docs/audits/ARCHITECTURE_AND_SAVE_REVIEW_2026-11-15.md round 4).
import test from 'node:test';
import assert from 'node:assert/strict';
import {createDisplayGate, setText} from '../src/display_gate.js';

function harness() {
    let t = 0, callback = null;
    class FakeObserver {constructor(cb) {callback = cb;} observe() {} disconnect() {}}
    const shows = [];
    const gate = createDisplayGate({}, {hiddenEvery: 3000, now: () => t, Observer: FakeObserver, onShow: () => shows.push(t)});
    return {gate, shows, at: ms => {t = ms;}, see: on => callback([{isIntersecting: on}])};
}

test('on screen or unknown, every redraw runs', () => {
    const h = harness();
    assert.equal(h.gate.due(1), true); // unknown before the first observation
    h.see(true);
    for(let i = 0; i < 5; i++) assert.equal(h.gate.due(1), true);
    assert.equal(createDisplayGate({}, {Observer: undefined}).due(1), true, 'no observer: never gated');
});

test('off screen, a redraw waits for a key change, a reopen or the slow fallback', () => {
    const h = harness();
    h.see(false); h.gate.due(1);
    h.at(1000); assert.equal(h.gate.due(1), false, 'time alone, inside the fallback');
    assert.equal(h.gate.due(2), true, 'a command changed the key');
    h.at(2000); assert.equal(h.gate.due(2), false);
    assert.equal(h.gate.due(2, true), true, 'a forced redraw runs');
    h.at(2500); h.gate.reopen(); assert.equal(h.gate.due(2), true, 'a layout change reopens');
    h.at(5600); assert.equal(h.gate.due(2), true, 'the slow fallback still reveals a panel that time alone changed');
});

test('coming back on screen redraws at once', () => {
    const h = harness();
    h.see(false); h.gate.due(1);
    h.at(100); h.see(true);
    assert.deepEqual(h.shows, [100]);
    assert.equal(h.gate.due(1), true);
});

test('setText writes only a changed text', () => {
    let writes = 0, value = 'a';
    const el = {get textContent() {return value;}, set textContent(v) {writes++; value = v;}};
    setText(el, 'a'); assert.equal(writes, 0);
    setText(el, 'b'); assert.equal(writes, 1); assert.equal(value, 'b');
});
