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
