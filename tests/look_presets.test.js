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
