import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {decorateActionComponents} from '../src/ui_components.js';
import {quotedActionList} from '../src/ui/panel_sections.js';

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

test('quoted action groups keep unavailable alternatives and one shared reason without allowing activation', () => {
    const saved=globalThis.document,dom=createDom();dom.loadHTML('<body></body>');globalThis.document=dom.document;
    try {
        const activations=[],root=quotedActionList([{id:'ready',label:'Repair now',enabled:true},{id:'current',label:'Current method',enabled:false,active:true},{id:'a',label:'Fit a kit',enabled:false,reason:'Study first.'},{id:'b',label:'Cut a lining',enabled:false,reason:'Study first.'}],{id:'test-work',activate:id=>activations.push(id)});
        document.body.append(root);
        const buttons=[...root.querySelectorAll('button')];
        assert.equal(root.querySelectorAll('details').length,1);
        assert.equal(root.querySelector('details').open,false);
        for(const b of buttons){b.click();if(b.disabled)assert.equal(document.getElementById(b.getAttribute('aria-describedby')).textContent,'Study first.');}
        assert.deepEqual(activations,['ready']);assert.equal(buttons.length,4);
        const current=buttons.find(b=>b.dataset.quotedAction==='current');current.focus();assert.equal(document.activeElement,current);assert.equal(current.getAttribute('aria-disabled'),'true');assert.equal(current.getAttribute('aria-pressed'),'true');
    } finally {globalThis.document=saved;}
});
