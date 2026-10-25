// A1 save mirror: snapshots, gap, retention, guards. A7 window bounds.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createMirror, hasSave } = require('../desktop/save_mirror.cjs');
const { clampBounds, readState, writeState } = require('../desktop/window_state.cjs');

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

const displays = [{ workArea: { x: 0, y: 25, width: 1920, height: 1055 } }, { workArea: { x: 1920, y: 0, width: 1440, height: 900 } }];

test('window bounds stay on a connected display', () => {
    assert.deepEqual(clampBounds({ x: 100, y: 100, width: 1600, height: 900 }, displays), { x: 100, y: 100, width: 1600, height: 900 });
    assert.equal(clampBounds({ x: 5000, y: 100, width: 1600, height: 900 }, displays), null, 'unplugged monitor');
    assert.equal(clampBounds({ x: 1, y: 1, width: NaN, height: 900 }, displays), null);
    const hanging = clampBounds({ x: 1700, y: 700, width: 1600, height: 900 }, [displays[0]]);
    assert.ok(hanging.x + hanging.width <= 1920 && hanging.y + hanging.height <= 1080, 'pulled back inside');
    const tiny = clampBounds({ x: 0, y: 25, width: 800, height: 500 }, displays);
    assert.deepEqual([tiny.width, tiny.height], [1366, 768], 'raised to the minimum when the display allows');
});

test('window state round-trips and a missing or broken file reads as none', () => {
    const dir = tmp();
    assert.equal(readState(dir), null);
    writeState(dir, { bounds: { x: 1, y: 2, width: 3, height: 4 }, maximized: true });
    assert.equal(readState(dir).maximized, true);
    fs.writeFileSync(path.join(dir, 'window-state.json'), '{bad');
    assert.equal(readState(dir), null);
});
