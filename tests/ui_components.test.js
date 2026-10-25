import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {decorateActionComponents} from '../src/ui_components.js';

test('disabled reasons preserve subject descriptions and follow a moved action without orphan notes', () => {
    const saved = {document:globalThis.document, MutationObserver:globalThis.MutationObserver};
    const dom = createDom(); dom.loadHTML('<body><section id="root"><p id="cost">Costs 2 coins.</p><div id="first"></div><div id="second"></div></section></body>');
    globalThis.document = dom.document;
    globalThis.MutationObserver = class {observe() {} disconnect() {}};
    let decoration;
    try {
        const root = document.getElementById('root'), first = document.getElementById('first'), second = document.getElementById('second');
        const b = document.createElement('button'); b.disabled = true; b.title = 'Bring a hammer.';
        b.setAttribute('aria-describedby', 'cost'); first.append(b);
        decoration = decorateActionComponents(root);
        const note = root.querySelector('.ui-disabled-reason');
        assert.deepEqual(b.getAttribute('aria-describedby').split(/\s+/), ['cost', note.id]);
        second.append(b); decoration.refresh();
        assert.equal(note.parentNode, second); assert.equal(b.nextSibling, note);
        b.disabled = false; decoration.refresh();
        assert.equal(b.getAttribute('aria-describedby'), 'cost'); assert(note.hidden);
        const borrowed = decorateActionComponents(second);
        borrowed.refresh(); decoration.refresh();
        assert.equal(root.querySelectorAll('.ui-disabled-reason').length, 1);
        borrowed.destroy();
        b.disabled = true; b.dataset.disabledReason = 'Choose a workpiece.'; decoration.refresh();
        assert.equal(note.textContent, 'Choose a workpiece.');
        assert.equal(b.getAttribute('aria-describedby').split(/\s+/).length, 2);
        b.remove(); decoration.refresh(); assert(!root.querySelector('.ui-disabled-reason'));
    } finally {decoration?.destroy(); Object.assign(globalThis, saved);}
});
