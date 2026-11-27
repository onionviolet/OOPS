import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, lstat, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {linkFixtureInput, linkFixtureInputSync} from './helpers/fixture_fs.mjs';

test('disposable fixture links work without elevated privileges and cleanup preserves the source', async () => {
    const base = await mkdtemp(join(tmpdir(), 'oops-fixture-links-'));
    try {
        const source = join(base, 'source'), target = join(base, 'fixture');
        await mkdir(source); await mkdir(target);
        await writeFile(join(source, 'input.txt'), 'immutable input');
        await linkFixtureInput(source, join(target, 'directory'), 'dir');
        await linkFixtureInput(join(source, 'input.txt'), join(target, 'file.txt'), 'file');
        linkFixtureInputSync(source, join(target, 'sync-directory'), 'dir');
        linkFixtureInputSync(join(source, 'input.txt'), join(target, 'sync-file.txt'), 'file');
        assert.equal(await readFile(join(target, 'directory', 'input.txt'), 'utf8'), 'immutable input');
        assert.equal(await readFile(join(target, 'file.txt'), 'utf8'), 'immutable input');
        assert.equal(await readFile(join(target, 'sync-directory', 'input.txt'), 'utf8'), 'immutable input');
        assert.equal(await readFile(join(target, 'sync-file.txt'), 'utf8'), 'immutable input');
        assert.equal((await lstat(join(target, 'directory'))).isSymbolicLink(), true, 'directory uses a junction on Windows');
        assert.equal((await lstat(join(target, 'file.txt'))).isSymbolicLink(), process.platform !== 'win32', 'file input uses an independent Windows copy');
        await rm(target, {recursive: true});
        assert.equal(await readFile(join(source, 'input.txt'), 'utf8'), 'immutable input');
    } finally {await rm(base, {recursive: true, force: true});}
});
