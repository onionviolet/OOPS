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

test('UIV1: a disabled reason is a Tab stop, and a row that already prints it gets no duplicate note', () => {
    const saved = {document:globalThis.document, MutationObserver:globalThis.MutationObserver};
    const dom = createDom(); dom.loadHTML('<body><section id="root"><div id="plain"></div><div id="printed"></div></section></body>');
    globalThis.document = dom.document;
    globalThis.MutationObserver = class {observe() {} disconnect() {}};
    let decoration;
    try {
        const plain = document.getElementById('plain'), printed = document.getElementById('printed');
        const a = document.createElement('button'); a.disabled = true; a.title = 'Earn merit first.'; plain.append(a);
        const b = document.createElement('button'); b.disabled = true; b.title = 'Brew a dose first.';
        const text = document.createElement('span'); text.textContent = 'Brew a dose first.'; printed.append(b, text);
        decoration = decorateActionComponents(document.getElementById('root'));
        const note = plain.querySelector('.ui-disabled-reason');
        assert.equal(note.textContent, 'Earn merit first.'); assert.equal(note.tabIndex, 0);
        assert.equal(a.getAttribute('aria-describedby'), note.id);
        assert(printed.querySelector('.ui-disabled-reason').hidden, 'no second copy beside printed text');
        assert.equal(b.getAttribute('aria-describedby'), text.id); assert.equal(text.tabIndex, 0);
        a.disabled = false; b.disabled = false; decoration.refresh();
        assert(note.hidden); assert(!note.hasAttribute('tabindex')); assert(!a.hasAttribute('aria-describedby'));
        assert(!text.hasAttribute('tabindex'), 'borrowed row text leaves the Tab order once enabled');
        assert(!b.hasAttribute('aria-describedby'));
        // A button that borrowed another button's note must not strip that note's Tab stop when it moves on.
        const c = document.createElement('button'); c.disabled = true; c.title = 'Earn merit first.'; a.disabled = true; plain.append(c); decoration.refresh();
        assert.equal(c.getAttribute('aria-describedby'), note.id, 'shares the identical note');
        c.title = 'Wait for dawn.'; decoration.refresh();
        assert.equal(note.tabIndex, 0, "the first button's reason keeps its Tab stop");
        const longer = document.createElement('p'); longer.textContent = 'Earn merit first. Then ask again.'; const d = document.createElement('button'); d.disabled = true; d.title = 'Earn merit first.';
        const row = document.createElement('div'); row.append(d, longer); document.getElementById('root').append(row); decoration.refresh();
        assert(!longer.hasAttribute('tabindex'), 'a longer paragraph that merely contains the reason is not borrowed');
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

test('disabled reasons stay linear on a panel with thousands of disabled buttons', () => {
    // 2026-10-29: the workshop area held about 2,000 disabled buttons in one container, and a
    // per-button scan of every sibling made each pass quadratic; at about 30 passes a second the
    // page froze. Growth from 200 to 2,000 buttons must look linear (about 10x), not quadratic (100x).
    const saved = {document:globalThis.document, MutationObserver:globalThis.MutationObserver};
    const pass = count => {
        const dom = createDom(); dom.loadHTML('<body><section id="root"><div id="many"></div></section></body>');
        globalThis.document = dom.document;
        const many = document.getElementById('many');
        for (let i = 0; i < count; i++) { const b = document.createElement('button'); b.disabled = true; b.title = `Reason ${i}.`; many.append(b); }
        const decoration = decorateActionComponents(document.getElementById('root'));
        const times = [0, 1, 2].map(() => { const started = performance.now(); decoration.refresh(); return performance.now() - started; }).sort((x, y) => x - y);
        const visible = [...many.querySelectorAll('.ui-disabled-reason')].filter(n => !n.hidden);
        assert.equal(visible.length, count, 'one visible note per distinct reason');
        for (const b of many.querySelectorAll('button')) assert.equal(document.getElementById(b.getAttribute('aria-describedby')).textContent, b.title);
        decoration.destroy(); return times[1];
    };
    try {
        globalThis.MutationObserver = class {observe() {} disconnect() {}};
        const small = pass(200), large = pass(2000);
        assert.ok(large < Math.max(small, 0.5) * 40, `200 buttons ${small.toFixed(1)} ms, 2000 buttons ${large.toFixed(1)} ms`);
    } finally {Object.assign(globalThis, saved);}
});
