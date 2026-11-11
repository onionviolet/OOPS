import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createDom} from '../scripts/headless/dom.mjs';
import {mountNativeControls,selectionButtons} from '../src/ui/native_controls.js';

test('index.html controls are buttons, and tabs and filters state their pressed state (UR130, UR108)',()=>{
    const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
    assert.doesNotMatch(html,/<div\b[^>]*\bonclick\s*=/i);
    const dom=createDom();dom.loadHTML(html);
    const tabs=selectionButtons(dom.document);
    assert.ok(tabs.length>=40,'tabs, filters and sorts are found');
    assert.ok(!tabs.some(b=>b.id==='save_button'),'plain commands carry no pressed state');
    mountNativeControls(dom.document);
    const all=dom.document.getElementById('inventory_show_all'),gear=dom.document.getElementById('inventory_show_equipment');
    assert.equal(all.getAttribute('aria-pressed'),'true');assert.equal(gear.getAttribute('aria-pressed'),'false');
    all.classList.remove('active_selection_button');gear.classList.add('active_selection_button');
    mountNativeControls(dom.document); // the headless DOM has no MutationObserver; the browser proof covers the live sync
    assert.equal(all.getAttribute('aria-pressed'),'false');assert.equal(gear.getAttribute('aria-pressed'),'true');
});

test('PX50: a press outside a modal sheet cancels and closes it; a press inside or a no-dismiss sheet does not', async () => {
    const {mountLightDismiss} = await import('../src/ui/native_controls.js');
    let handler;
    const doc = {addEventListener: (type, fn) => { handler = fn; }, removeEventListener() {}, defaultView: {Event: class { constructor(type, o) { this.type = type; this.cancelable = o.cancelable; } }}};
    const sheet = (attrs = {}) => ({tagName: 'DIALOG', open: true, closed: 0, events: [], matches: () => true, hasAttribute: n => n in attrs,
        getBoundingClientRect: () => ({left: 100, right: 300, top: 100, bottom: 300}), dispatchEvent(e) { this.events.push(e.type); return true; }, close() { this.closed++; }});
    mountLightDismiss(doc);
    const press = (target, x, y) => { let stopped = false; handler({target, clientX: x, clientY: y, preventDefault() {}, stopPropagation() { stopped = true; }}); return stopped; };
    const a = sheet();
    assert.equal(press(a, 10, 10), true); assert.deepEqual([a.events, a.closed], [['cancel'], 1]);
    const b = sheet(); press(b, 200, 200); assert.equal(b.closed, 0, 'inside the sheet');
    const c = sheet({'data-no-light-dismiss': ''}); press(c, 10, 10); assert.equal(c.closed, 0, 'opted out');
});
