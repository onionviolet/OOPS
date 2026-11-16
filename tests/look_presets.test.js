// PS266/PS278: presets bundle look and feel choices; accessibility choices ride the look registry.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {PRESETS, presetFor} from '../src/ui/look_presets.js';
import {LOOK_OPTIONS, lookSheet} from '../src/ui/variant.js';

test('Classic is every default; each preset is recognised; any hand change reads as Custom', () => {
    const look = Object.fromEntries(LOOK_OPTIONS.map(o => [`panel.look.${o.id}`, o.default]));
    assert.equal(look['panel.look.preset'], 'classic');
    for (const [k, v] of Object.entries(PRESETS.classic)) if (k.startsWith('panel.look.')) assert.equal(look[k], v, k);
    for (const name of Object.keys(PRESETS)) assert.equal(presetFor({...PRESETS[name]}), name);
    assert.equal(presetFor({...PRESETS.calm, 'panel.look.text': 'large'}), 'custom');
});

test('text size, motion and density are look options whose sheets exist, and every preset member is a real choice', () => {
    for (const id of ['preset', 'text', 'motion', 'density']) assert(LOOK_OPTIONS.some(o => o.id === id), id);
    assert.equal(lookSheet(LOOK_OPTIONS.find(o => o.id === 'motion'), 'reduce'), '');
    for (const o of LOOK_OPTIONS) for (const [v] of o.choices) if (lookSheet(o, v)) assert(existsSync(new URL(`../${lookSheet(o, v)}`, import.meta.url)));
    for (const values of Object.values(PRESETS)) for (const [k, v] of Object.entries(values)) {
        if (!k.startsWith('panel.look.')) continue;
        const o = LOOK_OPTIONS.find(x => `panel.look.${x.id}` === k);
        assert(o?.choices.some(([c]) => c === v), `${k}=${v}`);
    }
});

test('Look shows Preset first and folds the single choices under Customize, open only for Custom (PS295)', async () => {
    const {createDom} = await import('../scripts/headless/dom.mjs');
    const {foldLookGroup} = await import('../src/ui/look_presets.js');
    const dom = createDom();
    const row = (id, value) => `<div class="display-setting-row"><label>${id}</label><select id="display-setting-panel.look.${id}"><option value="${value}" selected>${value}</option></select></div>`;
    dom.loadHTML(`<html><body><details class="display-group" data-panel-settings="look"><summary>Look</summary><div class="display-setting-row"><label>preset</label><select id="display-setting-panel.look.preset"><option value="classic" selected>classic</option><option value="custom">custom</option></select></div>${row('text', 'normal')}${row('motion', 'full')}${row('rows', 'bordered')}</details></body></html>`);
    const doc = dom.document, group = doc.querySelector('.display-group');
    assert.equal(foldLookGroup(doc), true);
    const order = () => [...group.children].map(c => c.tagName.toLowerCase() === 'summary' ? 'summary' : c.className);
    assert.deepEqual(order(), ['summary', 'display-setting-row', 'look-customize']);
    const fold = group.querySelector('.look-customize');
    assert.equal(fold.querySelectorAll('.display-setting-row').length, 3);
    assert.equal(fold.open, false, 'closed while a named preset is chosen');
    foldLookGroup(doc);
    assert.deepEqual(order(), ['summary', 'display-setting-row', 'look-customize'], 'running again changes nothing');
    assert.equal(group.querySelectorAll('.look-customize').length, 1);
    doc.getElementById('display-setting-panel.look.preset').value = 'custom';
    foldLookGroup(doc);
    assert.equal(fold.open, true, 'Custom opens the fold');
    assert.equal(foldLookGroup(createDom().document), false, 'no Look group yet: nothing to fold');
});
