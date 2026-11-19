// Lanes add a file, never a shared line (merge friction, 2026-11-18): derivation rule sources and capability runs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {barrel} from '../scripts/gen_capability_runs.mjs';
import {ruleSources} from '../scripts/derivation_rules_backtest.mjs';
import {CAPABILITY_RUNS} from '../src/capability_runs/index.js';

test('the capability-runs barrel is what the folder generates (run node scripts/gen_capability_runs.mjs)', () => {
    assert.equal(readFileSync(new URL('../src/capability_runs/index.js', import.meta.url), 'utf8'), barrel());
});

test('every capability run descriptor names an id, an order and a run', () => {
    const ids = CAPABILITY_RUNS.map(d => d.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const d of CAPABILITY_RUNS) {
        assert.equal(typeof d.id, 'string');
        assert.ok(Number.isFinite(d.order), `${d.id} needs an order`);
        for (const k of ['create', 'act', 'view', 'restore']) assert.equal(typeof d.run[k], 'function', `${d.id}.${k}`);
    }
});

test('derivation rule sources load in order, then file name', async () => {
    const src = await ruleSources();
    assert.ok(src.length >= 4);
    for (let i = 1; i < src.length; i++) assert.ok(src[i - 1].order < src[i].order || (src[i - 1].order === src[i].order && src[i - 1].f < src[i].f));
});
