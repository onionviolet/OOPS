import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {mountUiExtras} from '../src/ui_extras.js';
import {registerPaletteSource, unregisterPaletteSource} from '../src/command_palette.js';

test('malformed optional entries are isolated through Find and Ctrl+K while native navigation survives', () => {
    const previous = globalThis.document, previousWindow = globalThis.window, dom = createDom();
    dom.loadHTML('<html><body><nav id="nav"><button id="native-control">Inventory</button></nav></body></html>');
    const fakeWindow = new dom.classes.EventTarget();
    dom.setWindow(fakeWindow); globalThis.window = fakeWindow;
    globalThis.document = dom.document;
    registerPaletteSource('malformed-optional-test', () => [
        {label: null, group: 'Optional', run() {}},
        {label: 'Healthy optional result', group: 'Optional', run() {}},
    ]);
    let extras;
    try {
        const nav = dom.document.getElementById('nav');
        extras = mountUiExtras({nav, openPanel() {}});
        assert.doesNotThrow(() => extras.findButton.click());
        assert.equal(dom.document.getElementById('command_palette').open, true, 'the neighboring palette still renders');
        assert.equal(dom.document.querySelector('#command_palette_list [role="option"] span').textContent, 'Healthy optional result');
        extras.palette.close();
        const key = new dom.classes.KeyboardEvent('keydown', {key: 'k', ctrlKey: true, bubbles: true});
        assert.doesNotThrow(() => dom.document.dispatchEvent(key), 'Ctrl+K opens through the same collector');
        const input = dom.document.querySelector('#command_palette input');
        input.value = 'healthy';
        assert.doesNotThrow(() => input.dispatchEvent(new dom.classes.Event('input')), 'search ranking never sees the null label');
        assert.equal(dom.document.querySelector('#command_palette_list [role="option"] span').textContent, 'Healthy optional result');
        assert.equal(dom.document.getElementById('native-control').textContent, 'Inventory');
        assert.equal(dom.document.getElementById('native-control').isConnected, true);
    } finally {
        extras?.destroy(); unregisterPaletteSource('malformed-optional-test'); globalThis.document = previous; globalThis.window = previousWindow;
    }
});
