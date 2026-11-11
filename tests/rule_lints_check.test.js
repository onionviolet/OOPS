// Warning-first rule lints (FRC27): each lint flags a known bad snippet and passes a known good one.
import test from 'node:test';
import assert from 'node:assert/strict';
import {scanClock, scanPreset, scanWindow, newHits} from '../scripts/check_rule_lints.mjs';

test('TMR1 flags a day number computed from the raw clock, not durations or the day owner', () => {
    const bad = 'export const myDay = state => Math.floor((state.clock - state.start) / 1440) + 1;';
    assert.deepEqual(scanClock('src/new_world.js', bad).map(h => h.rule), ['TMR1']);
    assert.equal(scanClock('src/new_world.js', 'const termDay = Math.floor(minutes / (24 * 60));').length, 1);
    const good = [
        "import {dayIndex} from './world_day_index.js';",
        'const day = dayIndex({clock: state.clock, worldId});',
        'const days = Math.floor((endsAt - now) / 1440);',
        'const left = `due in ${Math.ceil((due - now) / 1440)} days`;',
    ].join('\n');
    assert.deepEqual(scanClock('src/new_world.js', good), []);
    assert.deepEqual(scanClock('src/world_day_index.js', bad), []);
    assert.deepEqual(scanClock('src/new_world.js', bad + ' // rule-lint: allow test fixture'), []);
});

test('WKR1 flags a branch on a preset id, not axis reads or null checks', () => {
    for (const bad of ["if (world.preset === 'cultivation') grow();", "switch (pack.preset) { case 'x': break; }",
        "const loop = axes.mind.source.startsWith('preset:loop');"])
        assert.deepEqual(scanPreset('src/reader.js', bad).map(h => h.rule), ['WKR1'], bad);
    const good = [
        "if (axes.power.value === 'ladder') climb();",
        'g.preset = [...g.slots];',
        'if (g.preset === null) return;',
    ].join('\n');
    assert.deepEqual(scanPreset('src/reader.js', good), []);
    assert.deepEqual(scanPreset('src/world_pack_loader.js', "if (v.pack.preset === 'x') ;"), []);
});

test('STY17 flags a window module with its own helpers, not one built on windowKit', () => {
    const bad = [
        "const local = name => `gu.window.${name}`;",
        "const done = name => ({fact: `completed.${local(name)}`, op: 'eq', value: true});",
    ].join('\n');
    assert.deepEqual(scanWindow('src/world_packs/book_new_window.js', bad).map(h => h.rule), ['STY17']);
    const good = [
        "import {windowKit} from '../window_chain.js';",
        "const kit = windowKit({prefix: 'gu.window'});",
        "const local = kit.local; const done = kit.done; const f = `completed.${local('x')}`;",
    ].join('\n');
    assert.deepEqual(scanWindow('src/world_packs/book_new_window.js', good), []);
    assert.deepEqual(scanWindow('src/plain.js', "const local = 1;"), []);
});

test('the baseline counts known hits, so only extra hits are new', () => {
    const hits = [{key: 'a'}, {key: 'a'}, {key: 'b'}];
    assert.deepEqual(newHits(hits, {a: 2, b: 1}), []);
    assert.deepEqual(newHits(hits, {a: 1}), [{key: 'a'}, {key: 'b'}]);
});
