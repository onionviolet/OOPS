import test from 'node:test';
import assert from 'node:assert/strict';
import {withWorking, markWorking, takeWorking, resumeWorking, showWorkingNote, hideWorkingNote} from '../src/working_state.js';
import {createDom} from '../scripts/headless/dom.mjs';

const memory = (fail = false) => { const m = new Map(); return {getItem: k => { if (fail) throw Error('blocked'); return m.has(k) ? m.get(k) : null; }, setItem: (k, v) => { if (fail) throw Error('blocked'); m.set(k, v); }, removeItem: k => { if (fail) throw Error('blocked'); m.delete(k); }}; };
const control = () => { const attrs = new Map(); return {disabled: false, setAttribute: (k, v) => attrs.set(k, v), removeAttribute: k => attrs.delete(k), attrs}; };
const textLine = () => ({textContent: '', dataset: {}, setAttribute() {}});

test('a second activation while working runs nothing, and the control returns after success', async () => {
    const button = control(), line = textLine(); let runs = 0, release;
    const first = withWorking({button, line, label: 'Starting…'}, () => { runs++; return new Promise(r => { release = r; }); });
    assert.equal(button.disabled, true); assert.equal(button.attrs.get('aria-busy'), 'true'); assert.equal(line.textContent, 'Starting…');
    assert.equal(await withWorking({button, line, label: 'again'}, () => { runs++; }), undefined);
    release('done'); assert.equal(await first, 'done');
    assert.equal(runs, 1); assert.equal(button.disabled, false); assert.equal(button.attrs.has('aria-busy'), false);
});

test('a failed action restores the control, reports and rethrows', async () => {
    const button = control(), seen = [];
    await assert.rejects(withWorking({button, label: 'x', onFail: e => seen.push(e.message)}, async () => { throw Error('The current save is kept.'); }), /save is kept/);
    assert.deepEqual(seen, ['The current save is kept.']); assert.equal(button.disabled, false);
});

test('the reload note is read once, expires after two minutes and survives blocked storage', () => {
    const storage = memory();
    markWorking('Entering your new life…', storage, 1000);
    assert.equal(takeWorking(storage, 5000), 'Entering your new life…');
    assert.equal(takeWorking(storage, 5000), null);
    markWorking('old', storage, 0); assert.equal(takeWorking(storage, 3 * 60 * 1000), null);
    assert.doesNotThrow(() => markWorking('x', memory(true))); assert.equal(takeWorking(memory(true)), null);
});

test('the loading screen repeats the note and presses Play only when the load is clean', () => {
    for (const [statusClass, pressed] of [['loading_screen_status_good', 1], ['loading_screen_status_errors', 0], ['loading_screen_status_warnings', 0]]) {
        const dom = createDom(); dom.loadHTML(`<html><body><div id="loading_screen"><div id="loading_screen_loading_progress"></div><div id="loading_screen_status" class="${statusClass}"></div><div id="loading_screen_play_button" class="none_display"></div></div></body></html>`);
        const document = dom.document;
        const play = document.getElementById('loading_screen_play_button'); let clicks = 0; play.click = () => { clicks++; };
        play.classList.remove('none_display');
        const storage = memory(); markWorking('Entering your new life…', storage);
        assert.equal(resumeWorking({doc: document, storage, observe: true}), 'Entering your new life…');
        assert.equal(document.getElementById('loading_screen_working').textContent, 'Entering your new life…');
        assert.equal(clicks, pressed, statusClass);
    }
});

test('the page note shows and clears', () => {
    const dom = createDom(); dom.loadHTML('<html><body></body></html>'); const document = dom.document;
    showWorkingNote('Starting…', document);
    assert.equal(document.getElementById('working_note').textContent, 'Starting…');
    hideWorkingNote(document); assert.equal(document.getElementById('working_note'), null);
});
