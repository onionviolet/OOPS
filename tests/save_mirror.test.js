// A1 save mirror: snapshots, gap, retention, guards. A7 window bounds.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createMirror, hasSave } = require('../scripts/tauri/save_mirror.cjs');

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-mirror-'));
const entries = (n, extra = {}) => ({ 'save data': JSON.stringify({ n }), ...extra });

test('empty or unparseable storage never becomes a snapshot', () => {
    const mirror = createMirror(tmp());
    assert.equal(hasSave({}), false);
    assert.equal(hasSave({ 'save data': 'null' }), false);
    assert.equal(hasSave({ 'save data': '{oops' }), false);
    assert.deepEqual(mirror.record({ other: 'x' }), { skipped: 'no-save' });
    assert.deepEqual(mirror.list(), []);
});

test('unchanged storage is skipped, a change replaces latest and the history gap holds', () => {
    let t = Date.parse('2026-10-23T10:00:00');
    const dir = tmp();
    const mirror = createMirror(dir, { now: () => t });
    assert.deepEqual(mirror.record(entries(1)), { wrote: true, history: true });
    assert.deepEqual(mirror.record(entries(1)), { skipped: 'unchanged' });
    t += 60_000;
    assert.deepEqual(mirror.record(entries(2)), { wrote: true, history: false }, 'inside the gap: latest only');
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'latest.json'), 'utf8')).entries['save data'], '{"n":2}');
    t += 5 * 60_000;
    assert.equal(mirror.record(entries(3)).history, true);
    assert.equal(mirror.list().length, 3, 'latest plus two history files');
});

test('a snapshot round-trips every key and a fresh mirror resumes from latest', () => {
    const dir = tmp();
    const first = createMirror(dir);
    first.record(entries(7, { 'yairpg.opening.v1': '3', world: 'a b' }), { force: true });
    const second = createMirror(dir);
    assert.deepEqual(second.record(entries(7, { 'yairpg.opening.v1': '3', world: 'a b' })), { skipped: 'unchanged' });
    const id = second.list().find(item => item.id !== 'latest').id;
    assert.deepEqual(second.read(id).entries, entries(7, { 'yairpg.opening.v1': '3', world: 'a b' }));
    assert.throws(() => second.read('../latest'), /bad snapshot id/);
});

test('retention keeps the newest files and one per recent day', () => {
    let t = Date.parse('2026-10-01T09:00:00');
    const dir = tmp();
    const mirror = createMirror(dir, { now: () => t, keepRecent: 3, days: 2, minGapMs: 0 });
    for (let i = 0; i < 4; i++) { mirror.record(entries(i), { force: true }); t += 3600_000; }   // day 1, four files
    t = Date.parse('2026-10-02T09:00:00');
    for (let i = 10; i < 16; i++) { mirror.record(entries(i), { force: true }); t += 3600_000; } // day 2, six files
    const ids = mirror.list().filter(item => item.id !== 'latest').map(item => item.id);
    assert.equal(ids.filter(id => id.startsWith('20261002')).length >= 3, true);
    assert.equal(ids.filter(id => id.startsWith('20261001')).length, 1, 'one survivor from the older day');
    assert.ok(ids.length <= 4);
});

