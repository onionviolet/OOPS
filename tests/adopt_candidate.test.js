// MDL16 adopt_candidate.mjs: the pure parts. The Electron routes are run by hand.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs, diffFiles, findRunning, writeManifest, readManifest, checkAgainstManifest } from '../scripts/adopt_candidate.mjs';

test('parses each command and rejects bad input', () => {
    assert.deepEqual(parseArgs(['prepare', '--commit', 'abc123']), { command: 'prepare', commit: 'abc123', yes: false, label: null });
    assert.equal(parseArgs(['swap', '--yes', '--label', 'luminous-adopt']).label, 'luminous-adopt');
    assert.equal(parseArgs(['swap']).yes, false);
    assert.equal(parseArgs(['verify']).command, 'verify');
    assert.throws(() => parseArgs(['prepare']), /--commit/);
    assert.throws(() => parseArgs(['prepare', '--commit']), /needs a value/);
    assert.throws(() => parseArgs(['swap', '--label', '../x']), /letters/);
    assert.throws(() => parseArgs(['deploy']), /Usage/);
    assert.throws(() => parseArgs(['verify', '--force']), /Unknown/);
});

test('file diff names missing and added files', () => {
    assert.deepEqual(diffFiles(['a', 'b', 'c/x.json'], ['b', 'd', 'a']), { missing: ['c/x.json'], added: ['d'] });
    assert.deepEqual(diffFiles(['a'], ['a']), { missing: [], added: [] });
});

test('not-running guard sees the player app and ignores lane runs and itself', () => {
    const player = [
        '  101 /Users/w/code/yet-another-idle-rpg/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron /Users/w/code/yet-another-idle-rpg',
        '  102 /x/Electron Helper --type=renderer --user-data-dir=/Users/w/Library/Application Support/oops-progression-simulator',
    ];
    const other = [
        '  201 /Applications/Claude.app/Contents/MacOS/Claude',
        '  202 /x/Electron --app /Users/w/code/yet-another-idle-rpg/.claude/worktrees/agent-1',
        '  203 /x/Electron Helper --user-data-dir=/tmp/yairpg-adopt-verify-1/userData/oops-progression-simulator',
        '  300 node scripts/adopt_candidate.mjs swap --yes oops-progression-simulator Electron',
    ];
    assert.equal(findRunning(other).length, 0);
    assert.equal(findRunning([...other, ...player]).length, 2);
    assert.equal(findRunning(player, { selfPid: 101 }).length, 1);
});

function profile() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-adopt-test-'));
    const put = (rel, text) => { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.writeFileSync(path.join(dir, rel), text); };
    put('Local Storage/leveldb/000003.log', 'save bytes');
    put('window-state.json', '{}');
    put('builds/current.json', '{"id":"old"}');
    return { dir, put };
}

test('backup manifest verifies a copy and catches a changed, missing or extra file', () => {
    const { dir } = profile();
    const backup = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-adopt-test-b-'));
    fs.cpSync(dir, backup, { recursive: true });
    const manifest = `${backup}.sha256`;
    assert.equal(writeManifest(backup, manifest), 3);
    assert.equal(readManifest(manifest).size, 3);
    assert.deepEqual(checkAgainstManifest(dir, manifest).problems, []);

    fs.writeFileSync(path.join(dir, 'window-state.json'), '{"x":1}');
    fs.rmSync(path.join(dir, 'Local Storage/leveldb/000003.log'));
    fs.writeFileSync(path.join(dir, 'new.txt'), 'n');
    assert.deepEqual(checkAgainstManifest(dir, manifest).problems.sort(), ['differs window-state.json', 'extra new.txt', 'missing Local Storage/leveldb/000003.log']);
});

test('after a swap only builds/ may differ from the backup', () => {
    const { dir, put } = profile();
    const manifest = `${dir}.sha256`;
    writeManifest(dir, manifest);
    put('builds/current.json', '{"id":"new"}');
    put('builds/new/index.html', '<html>');
    const isBuilds = rel => rel.startsWith('builds/');
    assert.deepEqual(checkAgainstManifest(dir, manifest, { ignore: isBuilds }).problems, []);
    assert.ok(checkAgainstManifest(dir, manifest).problems.length > 0);
    put('window-state.json', '{"moved":true}');
    assert.deepEqual(checkAgainstManifest(dir, manifest, { ignore: isBuilds }).problems, ['differs window-state.json']);
});
