import test from 'node:test';
import assert from 'node:assert/strict';

// With animation frames available, a waiting panel's visibility (a forced style
// recalculation in the browser) is checked once per frame, not on every DOM change or
// render call, and a revealed panel still renders before that frame paints.
test('waiting panels recheck visibility once per animation frame', async () => {
    const saved = {MutationObserver: globalThis.MutationObserver, document: globalThis.document, requestAnimationFrame: globalThis.requestAnimationFrame};
    let observed = null, disconnected = 0;
    const frames = [];
    globalThis.MutationObserver = class {constructor(cb) {observed = cb;} observe() {} disconnect() {disconnected++;}};
    globalThis.document = {documentElement: {}};
    globalThis.requestAnimationFrame = cb => {frames.push(cb); return frames.length;};
    const runFrame = () => {const pending = frames.splice(0); for(const cb of pending) cb();};
    try {
        const {shownOrDeferred} = await import('../src/panel_reveal.js');
        let open = false, checks = 0, renders = 0;
        const shown = () => {checks++; return open;};
        const render = () => {renders++;};
        assert.equal(shownOrDeferred(render, shown), false);
        assert.equal(checks, 1);
        // Further render calls while waiting skip the check and share one frame request.
        for(let i = 0; i < 5; i++) assert.equal(shownOrDeferred(render, shown), false);
        assert.equal(checks, 1); assert.equal(frames.length, 1);
        // Unchanged attribute rewrites still wake nothing; real changes share the same frame.
        const target = {getAttribute: () => 'x'};
        observed([{type: 'attributes', target, attributeName: 'class', oldValue: 'x'}]);
        observed([{type: 'attributes', target, attributeName: 'class', oldValue: 'y'}]);
        observed([{type: 'childList'}]);
        assert.equal(frames.length, 1);
        runFrame();
        assert.equal(checks, 2); assert.equal(renders, 0);
        // A reveal the observer cannot see (a moved node) is caught by the next frame check.
        open = true;
        assert.equal(shownOrDeferred(render, shown), false);
        assert.equal(renders, 0);
        runFrame();
        assert.equal(renders, 1); assert.equal(disconnected, 1);
        // Once revealed, render calls check directly again.
        assert.equal(shownOrDeferred(render, shown), true);
        assert.equal(frames.length, 0);
    } finally {Object.assign(globalThis, saved);}
});
