import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderKitPage, kitFeatures, KIT_VOCABULARY} from '../src/ui/kit.js';
import '../src/ui/discord_kit_features.js';

test('PS292: the round 16 features draw on the kit page through kit forms, in kit states only', () => {
    const ids = ['clear-bonus', 'stock-news', 'practice-cause', 'drop-rate-cause'];
    for(const id of ids) {
        const f = kitFeatures().find(x => x.id === id);
        assert.ok(f, id);
        for(const state of Object.keys(f.samples)) assert.ok(KIT_VOCABULARY.states.includes(state), `${id}: ${state} is a kit state`);
    }
    const previous = globalThis.document, dom = createDom(); dom.loadHTML('<html><body><main id="kit"></main></body></html>'); globalThis.document = dom.document;
    try {
        const host = renderKitPage(document.getElementById('kit'));
        for(const id of ids) {
            const line = host.querySelector(`[data-kit-feature="${id}"]`);
            assert.ok(line.querySelectorAll('.kit-row').length >= 2, `${id} draws its rows through kitRow`);
        }
        assert.match(host.querySelector('[data-kit-feature="practice-cause"]').textContent, /your armour takes the hits it learns from/);
    } finally { globalThis.document = previous; }
});
