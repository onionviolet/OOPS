// The sandboxed preload cannot require local files, so channel names are plain
// strings on both sides. This keeps them paired after the host split.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(import.meta.dirname, '../desktop');
const read = name => fs.readFileSync(path.join(dir, name), 'utf8');
const channels = text => new Set([...text.matchAll(/'(yairpg:[a-z-]+)'/g)].map(m => m[1]));

test('every preload channel has a host module on the other end, and the reverse', () => {
    const preload = channels(read('preload.cjs'));
    const host = new Set();
    for (const name of fs.readdirSync(dir).filter(n => n.endsWith('.cjs') && n !== 'preload.cjs')) {
        for (const c of channels(read(name))) host.add(c);
    }
    assert.deepEqual([...preload].filter(c => !host.has(c)), [], 'preload channel with no host handler');
    assert.deepEqual([...host].filter(c => !preload.has(c)), [], 'host channel the preload never uses');
    assert.ok(preload.size >= 10);
});

test('main.cjs stays a composition root', () => {
    const main = read('main.cjs');
    assert.ok(main.split('\n').length < 160, 'move new concerns into a host module');
    assert.doesNotMatch(main, /ipcMain\.(on|handle)\('yairpg:(?!host-info)/, 'feature IPC belongs in its module');
});
