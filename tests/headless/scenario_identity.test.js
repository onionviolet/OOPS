import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir, mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {scenarioSourceIdentity} from '../../scripts/headless/scenario.mjs';

test('scenario identity changes when nested source or enabled optional pack bytes change', async t => {
    const root = await mkdtemp(join(tmpdir(), 'yairpg-scenario-identity-'));
    t.after(() => rm(root, {force:true, recursive:true}));
    for (const dir of ['src/worlds/deep', 'locales', 'stories', 'styles', 'scripts/headless', 'private_packs/one/nested', 'private_packs/cast']) {
        await mkdir(join(root, dir), {recursive:true});
    }
    const write = (path, text) => writeFile(join(root, path), text);
    await Promise.all(['index.html','style.css','package.json','package-lock.json','build.js'].map(path => write(path, '')));
    await write('src/worlds/deep/rules.js', 'export const cost = 1;');
    await write('private_packs/manifest.json', '{"packs":["one/pack.json","missing/pack.json"],"supplements":["cast/cast.json","cast/absent.json"]}');
    await write('private_packs/one/pack.json', '{}');
    await write('private_packs/one/nested/rules.json', '{"cost":1}');
    await write('private_packs/cast/cast.json', '{"cast":1}');
    const identity = () => scenarioSourceIdentity(root, {privatePacks:true});
    const initial = await identity();
    assert.deepEqual(await identity(), initial);
    await write('src/worlds/deep/rules.js', 'export const cost = 2;');
    const nested = await identity();
    assert.notEqual(nested.sourceSha256, initial.sourceSha256);
    await write('private_packs/one/nested/rules.json', '{"cost":2}');
    const pack = await identity();
    assert.notEqual(pack.sourceSha256, nested.sourceSha256);
    await write('private_packs/cast/cast.json', '{"cast":2}');
    assert.notEqual((await identity()).sourceSha256, pack.sourceSha256);
    assert.equal((await identity()).inputFiles, initial.inputFiles);
});


test('scenario identity follows imported document bytes through native paths with spaces and a hash', async t => {
    const root = await mkdtemp(join(tmpdir(), 'oops scenario # '));
    t.after(() => rm(root, {force:true, recursive:true}));
    for (const dir of ['src/deep', 'docs', 'locales', 'stories', 'styles', 'scripts/headless']) await mkdir(join(root, dir), {recursive:true});
    for (const file of ['index.html','style.css','package.json','package-lock.json','build.js']) await writeFile(join(root, file), '');
    await writeFile(join(root, 'src/deep/consumer.js'), "import rule from '../../docs/rule.json';");
    await writeFile(join(root, 'docs/rule.json'), '{"cost":1}');
    const before = await scenarioSourceIdentity(root);
    await writeFile(join(root, 'docs/rule.json'), '{"cost":2}');
    const after = await scenarioSourceIdentity(root);
    assert.notEqual(before.sourceSha256, after.sourceSha256);
    assert.equal(before.inputFiles, after.inputFiles);
});
