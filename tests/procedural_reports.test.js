// Procedural reports (PC12 compression ledger, PC35 coupling map; packets P1.3 and P1.5).
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {compare, measure} from '../scripts/compression_report.mjs';
import {buildMap} from '../scripts/coupling_map.mjs';
import {ENGINE_PACKS} from '../src/engine_world.js';

const run = (script, ...args) => spawnSync(process.execPath, [`scripts/${script}`, ...args], {encoding: 'utf8'});

test('compression report counts call sites in file contents, not file names', () => {
    const {C1, C2, C6} = measure();
    assert.deepEqual(C1.definition, ['src/gu_activation.js']);
    assert.ok(C1.value >= 1 && !C1.definition.includes('x'));
    // A file name count would give the number of gu_* files; the call-site count differs from it.
    assert.notEqual(C1.value, C2.value);
    assert.equal(C6.of, 7);
});

test('compression check fails when the baseline is stricter than the tree', () => {
    const now = Object.fromEntries(Object.entries(measure()).map(([k, v]) => [k, v.value]));
    assert.deepEqual(compare(now, now), []);
    assert.match(compare(now, {...now, C1: now.C1 - 1}).join(), /C1 rose/);
    assert.match(compare(now, {...now, C6: now.C6 + 1}).join(), /C6 fell/);
    // End to end: a stricter baseline, read from a temp file, makes --check exit 1.
    const real = JSON.parse(readFileSync('scripts/compression_baseline.json', 'utf8'));
    const file = join(mkdtempSync(join(tmpdir(), 'compression-')), 'baseline.json');
    writeFileSync(file, JSON.stringify({values: {...real.values, C2: 1}}));
    assert.equal(run('compression_report.mjs', '--check', '--baseline', file).status, 1);
    assert.equal(run('compression_report.mjs', '--check').status, 0);
});

test('coupling map finds the humidity coupling between brewing and the shell regulator', () => {
    const map = buildMap();
    const humidity = map.couplings.find(r => r.type === 'quantity' && r.name === 'humidity');
    assert.ok(humidity, 'humidity is a cross-domain coupling');
    assert.ok(humidity.writers.some(w => w.pack === 'b.brew_steam') && humidity.writers.some(w => w.pack === 'l.shell_regulator'));
    assert.ok(humidity.readers.some(w => w.pack === 'b.brew_steam') && humidity.readers.some(w => w.pack === 'l.shell_regulator'));
    for (const key of ['couplings', 'writesNothingReads', 'readsNothingWrites', 'packs']) assert.ok(Array.isArray(map[key]));
});

test('coupling map reads declarations from the registered packs, computed lists included', () => {
    const map = buildMap();
    assert.deepEqual(map.packs.map(p => p.pack), ENGINE_PACKS.map(p => p.id), 'one row per registered pack, and no row for a method id such as a.cross');
    assert.deepEqual(map.packs.filter(p => p.unresolved.length).map(p => p.pack), []);
    // Three packs whose lists are built in code: the sky's publishes, the market's goods, the contest's quantities.
    const row = (type, name) => [...map.couplings, ...map.writesNothingReads, ...map.readsNothingWrites].find(r => r.type === type && r.name === name);
    const daylight = map.couplings.find(r => r.type === 'effect' && r.name === 'sky.daylight');
    assert.deepEqual([daylight.writers.map(w => w.pack), daylight.readers.map(w => w.pack)], [['w.sky'], ['l.colony_light']]);
    assert.deepEqual(row('quantity', 'vitality').writers.map(w => w.pack), ['c.contest']);
    assert.deepEqual(row('quantity', 'coin').writers.map(w => w.pack), ['m.market']);
    assert.equal(row('quantity', 'satiety').writers.length, 2, 'satiety is a quantity because a loaded pack declares it as one');
    assert.equal(map.couplings.length, 7);
    // A pack that needs settings and gets none is listed with the reason, not dropped.
    const bare = buildMap({});
    assert.equal(bare.packs.length, ENGINE_PACKS.length);
    assert.match(bare.packs.find(p => p.pack === 'm.market').unresolved.join(), /^not created: /);
});

test('both scripts run and exit 0 in default mode', () => {
    for (const [script, args] of [['compression_report.mjs', []], ['coupling_map.mjs', []], ['coupling_map.mjs', ['--json']]]) {
        const r = run(script, ...args);
        assert.equal(r.status, 0, r.stderr);
    }
    assert.ok(JSON.parse(run('coupling_map.mjs', '--json').stdout).packs.length > 0);
});
