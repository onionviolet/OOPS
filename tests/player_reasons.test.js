import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {createDom} from '../scripts/headless/dom.mjs';
import {decorateActionComponents} from '../src/ui_components.js';
import {splitReasons, playerReasonText, unreachable, UNMET_REASON, DEV_REASONS} from '../src/player_reasons.js';

// Weibao 2026-10-30: "This command belongs to another world" is meaningless and detracts from the game (UR73, UR82).
test('engine reasons sort into dev text, a place and player text', () => {
    const joined = `${UNMET_REASON} This command belongs to another world. Return to Shack. That participant is unavailable.`;
    assert.deepEqual(splitReasons(joined), {player: ['That participant is unavailable.'], dev: [UNMET_REASON, 'This command belongs to another world.'], place: 'Shack'});
    assert.equal(playerReasonText(joined), 'That participant is unavailable. Return to Shack.');
    assert.equal(unreachable(joined), true);
    assert.equal(unreachable(['Commission the craftsman first.']), false);
});

test('the shared decorator never prints engine reasons to the player', () => {
    const saved = {document: globalThis.document, MutationObserver: globalThis.MutationObserver};
    const dom = createDom(); dom.loadHTML('<body><section id="root"></section></body>');
    globalThis.document = dom.document; globalThis.MutationObserver = class {observe() {} disconnect() {}};
    try {
        const root = document.getElementById('root');
        const only = document.createElement('button'); only.disabled = true; only.title = `${UNMET_REASON} This command belongs to another world.`;
        const mixed = document.createElement('button'); mixed.disabled = true; mixed.title = `${UNMET_REASON} Bring a hammer.`;
        root.append(only, mixed); decorateActionComponents(root);
        const shown = [...root.querySelectorAll('.ui-disabled-reason')].filter(n => !n.hidden).map(n => n.textContent);
        assert.deepEqual(shown, ['Bring a hammer.']);
    } finally { Object.assign(globalThis, saved); }
});

// Recurrence guard: a new engine refusal written as an inline literal must join DEV_REASONS or be player text.
// Any "belongs to another world/actor/body/record" refusal in src/ is engine text and has to be registered here.
// "belongs to another owner" stays player text: who owns a site is something the player can act on.
test('every "belongs to another" refusal in src is registered as dev text', () => {
    const found = new Set();
    for(const f of readdirSync('src', {recursive: true})) if(String(f).endsWith('.js'))
        for(const m of readFileSync(`src/${f}`, 'utf8').matchAll(/["'`](This [^"'`$]*belongs to another (?:world|actor|actor role|body|actual record)[^"'`$]*\.)["'`]/g)) found.add(m[1]);
    assert.deepEqual([...found].filter(r => !DEV_REASONS.has(r)), []);
});
