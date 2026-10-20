// EL18 frozen player builds: snapshot folders, pointers and pruning.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const { makeSnapshot, readPointer, writePointer, buildsDir } = createRequire(import.meta.url)('../desktop/snapshot.cjs');

function fakeRoot() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-snap-src-'));
    const put = (rel, text) => { fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); fs.writeFileSync(path.join(root, rel), text); };
    put('index.html', '<script src="dist/bundle.js"></script>');
    put('dist/bundle.js', 'one');
    put('src/game_version.js', 'const game_version = "v9";');
    put('src/main.js', 'not served');
    put('styles/a.css', 'a{}');
    put('private_packs/manifest.json', JSON.stringify({ schema: 1, packs: ['p1/pack.json'] }));
    put('private_packs/p1/pack.json', '{}');
    put('private_packs/unlisted/pack.json', '{}');
    return { root, put };
}

test('copies page files and listed packs, keyed by content', () => {
    const { root, put } = fakeRoot();
    const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-snap-ud-'));
    const a = makeSnapshot(root, userData);
    assert.match(a.id, /^v9-[0-9a-f]{12}$/);
    assert.equal(readPointer(userData, 'latest.json'), a.id);
    for (const rel of ['index.html', 'dist/bundle.js', 'styles/a.css', 'src/game_version.js', 'private_packs/p1/pack.json']) {
        assert.ok(fs.existsSync(path.join(a.root, rel)), rel);
    }
    assert.ok(!fs.existsSync(path.join(a.root, 'src/main.js')));
    assert.ok(!fs.existsSync(path.join(a.root, 'private_packs/unlisted')));
    assert.equal(makeSnapshot(root, userData).id, a.id, 'unchanged files reuse the id');
    put('styles/a.css', 'b{}');
    assert.notEqual(makeSnapshot(root, userData).id, a.id, 'any served file changes the id');
});

test('pointers never name a folder outside builds, and pruning keeps current', () => {
    const { root, put } = fakeRoot();
    const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-snap-ud-'));
    const first = makeSnapshot(root, userData);
    writePointer(userData, 'current.json', first.id);
    for (let i = 0; i < 5; i++) { put('dist/bundle.js', `build ${i}`); makeSnapshot(root, userData); }
    assert.ok(fs.existsSync(first.root), 'current survives pruning');
    const kept = fs.readdirSync(buildsDir(userData)).filter(n => !n.endsWith('.json'));
    assert.ok(kept.length <= 3, kept.join());
    writePointer(userData, 'latest.json', '../escape');
    assert.equal(readPointer(userData, 'latest.json'), null);
    fs.writeFileSync(path.join(buildsDir(userData), 'latest.json'), '{torn');
    assert.equal(readPointer(userData, 'latest.json'), null);
});
