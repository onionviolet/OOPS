// How a run uses the machine (scripts/test_plan.mjs) and what a push gate runs (scripts/push_gate.mjs).
import test from 'node:test';
import assert from 'node:assert/strict';
import {commandBatches, commandLengthBound, concurrencyFor, longestFirst, MIN_CONCURRENCY, nodeTestArgs, suitePhases, WINDOWS_NATIVE_INTEGRATION_FILES} from '../scripts/test_plan.mjs';
import {runTestLane, runSuitePhases} from '../scripts/test_suite.mjs';
import {suiteFiles} from '../scripts/test_changed.mjs';
import {EventEmitter} from 'node:events';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {planGate, idleVerdict} from '../scripts/push_gate.mjs';
import {contentionScale, lastRunFile} from '../scripts/test_budget_reporter.mjs';

test('concurrency follows the free cores, never below the floor, and the env dial wins', () => {
    assert.equal(concurrencyFor({cores: 18, load: 0.5, env: {}}), 17);
    assert.equal(concurrencyFor({cores: 18, load: 0, env: {}}), 18);
    assert.equal(concurrencyFor({cores: 18, load: 16.2, env: {}}), MIN_CONCURRENCY);
    assert.equal(concurrencyFor({cores: 18, load: 40, env: {}}), MIN_CONCURRENCY);
    assert.equal(concurrencyFor({cores: 18, load: 0, env: {YAIRPG_TEST_CONCURRENCY: '6'}}), 6);
});

test('the slowest known files start first; unknown files keep their order', () => {
    assert.deepEqual(longestFirst(['a', 'b', 'c', 'd'], {c: 90, a: 5}), ['c', 'a', 'b', 'd']);
    assert.deepEqual(longestFirst(['x', 'y'], {}), ['x', 'y']);
});

test('a push gate runs the reached tests, the full suite for wide paths or --full, and check:flow only for visible changes', () => {
    assert.deepEqual(planGate(['src/lotm_be_acting.js', 'docs/x.md']), {tests: 'changed', why: 'the files this push can reach', flow: true});
    assert.equal(planGate(['docs/x.md', 'scripts/aspect_pilot.mjs']).flow, false);
    for (const wide of ['package.json', 'build.js', 'src/main.js', 'src/save_files.js', 'scripts/headless/runner.mjs', 'tests/fixtures/a.mjs'])
        assert.equal(planGate([wide]).tests, 'full', wide);
    assert.equal(planGate(['docs/x.md'], {full: true}).tests, 'full');
});

test('budget limits stretch with the files run at once, from none at four to double at sixteen', () => {
    assert.deepEqual([4, 1, 13, 16, 18].map(contentionScale), [1, 1, 1.75, 2, 2]);
});

test('shardFiles balances files by known duration and loses none', async () => {
    const {shardFiles} = await import('../scripts/test_plan.mjs');
    const known = {a: 10, b: 9, c: 4, d: 3, e: 2};
    const groups = shardFiles(['a', 'b', 'c', 'd', 'e'], 2, known);
    assert.deepEqual(groups, [['a', 'd', 'e'], ['b', 'c']]);
    assert.deepEqual(shardFiles(['x', 'y'], 4).flat().sort(), ['x', 'y']);
});

test('the crowded idle ceiling fails only when every sample is over it', () => {
    assert.equal(idleVerdict([101, 100], 78).over, true);
    assert.equal(idleVerdict([101, 66], 78).over, false, 'a noisy first run is retried and the quiet one passes');
    assert.equal(idleVerdict([66], 78).over, false);
    assert.equal(idleVerdict([], 78).over, false);
});

test('Windows commands fit the OS ceiling without losing or repeating any suite file', () => {
    const files = suiteFiles();
    for (const concurrency of [1, 4, 18]) {
        const batches = commandBatches(files, {platform: 'win32', concurrency});
        assert.ok(batches.length > 1, 'the real suite reproduces the command length problem');
        assert.deepEqual(batches.flat(), files);
        assert.equal(new Set(batches.flat()).size, files.length);
        for (const batch of batches) assert.ok(commandLengthBound(nodeTestArgs(batch, {concurrency})) <= 30000);
    }
    const awkward = ['tests/space and "quote".test.js', 'tests/trailing\\'];
    assert.deepEqual(commandBatches(awkward, {platform: 'win32'}).flat(), awkward);
    assert.throws(() => commandBatches(['x'.repeat(20000)], {platform: 'win32'}), /exceeds/);
    assert.deepEqual(commandBatches(files, {platform: 'linux'}), [files]);
});

test('serial batches retain their lane concurrency and continue after spawn and test failures', async () => {
    let active = 0, maximum = 0;
    const seen = [], environments = [], output = [];
    const spawnChild = (_exe, args, options) => {
        seen.push(args); environments.push(options.env);
        if (seen.length === 1) throw new Error('spawn failed');
        const child = new EventEmitter();
        child.stdout = new EventEmitter(); child.stderr = new EventEmitter();
        maximum = Math.max(maximum, ++active);
        setImmediate(() => {
            child.stderr.emit('data', 'visible failure');
            if (seen.length === 2) child.emit('error', new Error('async spawn failed'));
            --active; child.emit('close', seen.length === 2 ? null : seen.length === 3 ? 1 : 0);
        });
        return child;
    };
    const results = await runTestLane([['a'], ['b'], ['c'], ['d']], {concurrency: 1, lane: 0, tmp: tmpdir(), spawnChild, output: s => output.push(s)});
    assert.deepEqual(results.map(r => r.code), [1, 1, 1, 0]);
    assert.equal(maximum, 1);
    assert.ok(seen.every(args => args.includes('--test-concurrency=1')));
    assert.ok(seen.every(args => args.includes('--test-reporter=./scripts/test_budget_reporter.mjs')));
    assert.ok(environments.every(env => env.YAIRPG_TEST_CONCURRENCY_USED === '1'));
    assert.equal(new Set(results.map(r => r.durations)).size, 4);
    assert.match(output.join(''), /spawn failed/);
    assert.match(output.join(''), /visible failure/);
    assert.match(output.join(''), /async spawn failed/);
});

test('real Node test failure in an exclusive phase survives a later passing parallel phase', async () => {
    const tmp = mkdtempSync(path.join(tmpdir(), 'yairpg-batch-test-'));
    try {
        const failing = path.join(tmp, 'fail.test.cjs'), passing = path.join(tmp, 'pass.test.cjs');
        writeFileSync(failing, "require('node:test')('fails', () => { throw Error('batch failure'); });");
        writeFileSync(passing, "require('node:test')('passes', () => {});");
        const phases=suitePhases([failing,passing],{platform:'win32',concurrency:2,exclusiveFiles:[failing]});
        const results = await runSuitePhases(phases, {tmp,
            spawnChild: (exe, args, options) => {
                const env = {...options.env};
                delete env.NODE_TEST_CONTEXT;
                const reporter = '--test-reporter=./scripts/test_budget_reporter.mjs';
                return spawn(exe, args.map(arg => arg === reporter ? `--test-reporter=${pathToFileURL(path.resolve('scripts/test_budget_reporter.mjs')).href}` : arg), {...options, cwd: tmp, env});
            }, output: () => {}});
        assert.deepEqual(results.map(r => r.code), [1, 0]);
        assert.equal(results.every(r => r.code === 0), false);
    } finally {
        rmSync(lastRunFile(tmp), {force: true});
        rmSync(tmp, {recursive: true, force: true});
    }
});

test('Windows full-suite phase accounting retains every file once with quiet native compilers first', () => {
    const files=suiteFiles(),known={'tests/cast_body_adapter.test.js':200,'tests/cast_ability_adapter.test.js':150};
    const phases=suitePhases(files,{platform:'win32',concurrency:18,shards:4,known});
    assert.equal(phases.length,2);
    const [heavy,parallel]=phases;
    assert.equal(heavy.lanes.length,1);assert.equal(heavy.lanes[0].concurrency,1);
    assert.deepEqual(heavy.lanes[0].batches.slice(0,2),[['tests/cast_body_adapter.test.js'],['tests/cast_ability_adapter.test.js']]);
    assert.deepEqual(heavy.lanes[0].batches.flat().sort(),[...WINDOWS_NATIVE_INTEGRATION_FILES].sort());
    for (const file of ['tests/currency_subunits_save.test.js','tests/lotm_money_save.test.js','tests/continuity_check.test.js'])
        assert.equal(heavy.lanes[0].batches.flat().filter(candidate=>candidate===file).length,1,file);
    assert.ok(heavy.lanes[0].batches.every(batch=>batch.length===1));
    assert.equal(parallel.lanes.reduce((sum,l)=>sum+l.concurrency,0),18);
    const all=phases.flatMap(p=>p.lanes.flatMap(l=>l.batches.flat()));
    assert.deepEqual([...all].sort(),[...files].sort());assert.equal(new Set(all).size,files.length);
    for(const phase of phases)for(const lane of phase.lanes)for(const batch of lane.batches)
        assert.ok(commandLengthBound(nodeTestArgs(batch,{concurrency:lane.concurrency}))<=30000);
    assert.equal(suitePhases(files,{platform:'linux',concurrency:18,shards:4,known}).length,1);
    assert.equal(suitePhases(files,{platform:'darwin',concurrency:18,shards:4,known}).length,1);
    for (const platform of ['linux','darwin']) {
        const phases=suitePhases(files,{platform,concurrency:18,shards:4,known});
        assert.equal(phases[0].name,'parallel tests');
        assert.equal(phases.flatMap(p=>p.lanes.flatMap(l=>l.batches.flat())).filter(file=>WINDOWS_NATIVE_INTEGRATION_FILES.includes(file)).length,WINDOWS_NATIVE_INTEGRATION_FILES.length);
    }
    assert.equal(suitePhases(['tests/fast.test.js'],{platform:'win32',concurrency:4})[0].lanes[0].concurrency,4);
    assert.deepEqual(suitePhases([],{platform:'win32',concurrency:4}),[]);
});

test('Windows isolation matches native separators, retains LPT estimates and guards long paths in both phases', () => {
    const files=['tests\\cast_body_adapter.test.js','tests/cast_ability_adapter.test.js','tests/ordinary.test.js'];
    const phases=suitePhases(files,{platform:'win32',concurrency:8,shards:3,
        known:{'tests/cast_body_adapter.test.js':200,'tests/cast_ability_adapter.test.js':100}});
    assert.deepEqual(phases[0].lanes[0].batches,[[files[0]],[files[1]]]);
    const huge='tests/'+ 'x'.repeat(20000)+'.test.js';
    for(const exclusiveFiles of [[],[huge]])assert.throws(()=>suitePhases([huge],{platform:'win32',exclusiveFiles}),/exceeds/);
    const short=['tests/a.test.js','tests/b.test.js','tests/c.test.js','tests/d.test.js'];
    const limit=commandLengthBound(nodeTestArgs([short[0]],{concurrency:1}));
    const bounded=suitePhases(short,{platform:'win32',concurrency:1,limit,exclusiveFiles:[short[0]]});
    assert.deepEqual(bounded.flatMap(p=>p.lanes.flatMap(l=>l.batches.flat())),short);
    assert.ok(bounded[1].lanes[0].batches.length>1,'ordinary phase still batches Windows command lines');
});

test('the phase barrier prevents ordinary overlap and collects failure without omitting later files', async () => {
    let active=0,max=0;const events=[];
    const spawnChild=(_exe,args)=>{
        const file=args.at(-1),child=new EventEmitter();child.stdout=new EventEmitter();child.stderr=new EventEmitter();
        events.push('start:'+file);max=Math.max(max,++active);
        assert.ok(file.startsWith('heavy')?active===1:events.includes('close:heavy-b'),'ordinary work waits for the last heavy close');
        setImmediate(()=>{events.push('close:'+file);active--;child.emit('close',file==='heavy-a'?1:0);});return child;
    };
    const phases=suitePhases(['fast-a','heavy-a','fast-b','heavy-b'],{platform:'win32',concurrency:2,shards:2,exclusiveFiles:['heavy-a','heavy-b']});
    const results=await runSuitePhases(phases,{tmp:tmpdir(),spawnChild,output:()=>{}});
    assert.equal(max,2,'fast lanes remain parallel');
    assert.deepEqual(events.slice(0,4),['start:heavy-a','close:heavy-a','start:heavy-b','close:heavy-b']);
    assert.deepEqual(results.map(r=>r.code),[1,0,0,0]);
    assert.equal(new Set(results.map(r=>r.durations)).size,4,'phase/lane batch reports never collide');
});
