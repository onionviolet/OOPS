// Save parts (S0/S1, docs/audits/ARCHITECTURE_AND_SAVE_REVIEW_2026-11-15.md round 3).
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {HAND_SAVE_KEYS, splitSave, joinSave, changedParts, unownedKeys, partHash} from '../src/save_parts.js';

const fixture = name => readFileSync(new URL(`./fixtures/perf/${name}.json`, import.meta.url), 'utf8');

test('parts join back to the exact bytes of every perf fixture', () => {
    for(const name of ['fresh', 'mid', 'crowded']) {
        const text = fixture(name), split = splitSave(JSON.parse(text));
        assert.equal(JSON.stringify(joinSave(split)), text, name);
        if(name === 'crowded') assert.ok(Object.keys(split.parts).some(p => p === 'expansion.simulation/claims'), 'simulation splits per table');
    }
});

test('a change shows up in its own part and no other', () => {
    const save = JSON.parse(fixture('crowded')), before = splitSave(save).manifest;
    save.expansion.simulation.log.push({at: 1, text: 'x'});
    save['current time'].minute++;
    assert.deepEqual(changedParts(before, splitSave(save).manifest).sort(), ['current time', 'expansion.simulation/log']);
    assert.equal(changedParts(before, before).length, 0);
    assert.notEqual(partHash('ab'), partHash('ba'));
});

test('a missing part fails the join instead of loading a partial save', () => {
    const split = splitSave(JSON.parse(fixture('mid')));
    delete split.parts.quests;
    assert.throws(() => joinSave(split), /Missing save part: quests/);
});

test('every key create_save writes by hand has a declared owner', () => {
    const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
    const start = main.indexOf('function create_save('), end = main.indexOf('\n}', start);
    assert.ok(start > 0 && end > start, 'create_save found');
    const keys = new Set([...main.slice(start, end).matchAll(/save_data(?:\.([A-Za-z_0-9]+)|\["([^"]+)"\])\s*=(?!=)/g)].map(m => m[1] ?? m[2]));
    assert.ok(keys.size > 60, `scan found ${keys.size} keys`);
    assert.deepEqual(unownedKeys(Object.fromEntries([...keys].map(k => [k, 1]))), [],
        'A new top-level save key belongs in a registry domain; a hand key needs an owner in src/save_parts.js');
    const renames = Object.values(HAND_SAVE_KEYS).map(v => v.rename).filter(Boolean);
    assert.equal(new Set(renames).size, renames.length, 'proposed names are unique');
    for(const name of renames) assert.ok(!Object.hasOwn(HAND_SAVE_KEYS, name), `${name} would collide with a current key`);
});
