import test from 'node:test';
import {mkdtemp, cp, readdir, symlink, writeFile, readFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createHash} from 'node:crypto';

// Copy mutable inputs; symlink dependencies. No private pack, user profile or
// localStorage is read. Only this scratch copy receives the prepared host hunk.
test('real Save, reload, Export and literal Import retain episodes, hearsay and a folded impression', {timeout: 300000}, async t => {
    const exec = promisify(execFile), root = process.cwd(), dir = await mkdtemp(join(tmpdir(), 'yairpg-mr1-save-'));
    t.after(() => rm(dir, {recursive: true, force: true}));
    for (const name of ['src', 'scripts']) await cp(join(root, name), join(dir, name), {recursive: true});
    for (const entry of await readdir(root, {withFileTypes: true})) {
        if (!['.git', 'src', 'scripts', 'private_packs', '.lane-builds'].includes(entry.name))
            await symlink(join(root, entry.name), join(dir, entry.name), entry.isDirectory() ? 'dir' : 'file');
    }
    const patch = 'docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR1_INTEGRATION.patch';
    let integrated = true;
    try { await exec('git', ['apply', '-R', '--check', join(root, patch)], {cwd: root}); } catch { integrated = false; }
    if (!integrated) await exec('git', ['apply', join(root, patch)], {cwd: dir});
    const arch = await exec(process.execPath, ['scripts/check_architecture.mjs'], {cwd: dir, timeout: 60000, maxBuffer: 1024 * 1024});
    t.diagnostic('Prepared integration architecture: ' + arch.stdout.trim());
    const main = join(dir, 'src/main.js');
    await writeFile(main, (await readFile(main, 'utf8')) + `
export const mr1Validate = save => validateSaveEnvelope(save, game_version);
export const mr1Install = memory => domainRegistry.load({...JSON.parse(create_save()), memory});
`);
    await exec(process.execPath, ['build.js'], {cwd: dir, env: {...process.env, BUILD_OUT: join(dir, 'candidate')}, timeout: 60000, maxBuffer: 1024 * 1024});
    t.diagnostic('Disposable build SHA-256: ' + createHash('sha256').update(await readFile(join(dir, 'candidate/dist/bundle.js'))).digest('hex'));
    const worker = join(dir, 'mr1-save-worker.mjs');
    await writeFile(worker, `
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
import {freshMemory, remember, tellMemory, episode, decodeMemory, recallMemory} from './src/person_memory.js';
import {calendarMinutes} from './src/world_rhythm.js';
const g = await boot(null, {seed: 37, heroName: null});
try {
 let saved = await g.save();
 const day = Math.floor(calendarMinutes(saved['current time']) / 1440);
 assert.deepEqual(saved.memory, freshMemory());
 const old = structuredClone(saved); delete old.memory;
 g.module.mr1Validate(old); await g.importFile('YAIR-UTF8-1:' + Buffer.from(JSON.stringify(old)).toString('base64'));
 assert.deepEqual((await g.save()).memory, freshMemory(), 'absent slice loads empty');
 const record = episode({kind:'helped',about:'person.b',fact:'fact.a',source:'saw',certainty:90,feeling:40,day}, day);
 let memory = freshMemory();
 for(let i = 0; i < 45; i++) memory = remember(memory, 'person.a', {...record, fact:'fact.' + i}, day);
 const told = tellMemory(record, 'person.a', day);
 memory = remember(memory, 'person.c', told, day);
 g.module.mr1Install(memory);
 saved = await g.save(); assert.deepEqual(saved.memory, memory);
 const read = () => decodeMemory(saved.memory, day);
 assert.ok(read()['person.a'].some(e => e.kind === 'impression'));
 assert.deepEqual(read()['person.c'][0], told);
 const recall = () => recallMemory({holder:'person.c',memory:read()['person.c'][0],cue:{id:'cue.face',person:true,place:false,topic:false},period:{day},day,drawAddress:{root:37,worldId:'fixture.world',lifeId:'fixture.life',gameTime:day*1440,eventId:'fixture.recall'}});
 const next = recall();
 const future = structuredClone(saved); future.memory.holders['person.c'][0][6] = day + 1;
 assert.throws(() => g.module.mr1Validate(future), /future day/);
 const kind = structuredClone(saved); kind.memory.holders['person.c'][0][0] = 99;
 assert.throws(() => g.module.mr1Validate(kind), /tuple/);
 await g.reload(); saved = await g.save(); assert.deepEqual(saved.memory, memory); assert.deepEqual(recall(), next);
 const exported = await g.exportFile();
 await g.importFile(exported); saved = await g.save();
 assert.deepEqual(saved.memory, memory); assert.deepEqual(recall(), next);
 assert.equal(g.internals.foundationSaveBlocked, false); assert.deepEqual(g.errors, []);
} finally { g.close(); }
`);
    try { await exec(process.execPath, [worker], {cwd: dir, timeout: 270000, maxBuffer: 1024 * 1024}); }
    catch (error) { throw Error(`${error.message}\n${error.stdout ?? ''}\n${error.stderr ?? ''}`); }
});
