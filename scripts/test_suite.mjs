#!/usr/bin/env node
// npm test: every tests/*.test.js, slowest first, as many at once as the machine has free cores (scripts/test_plan.mjs).
// npm test wraps this in scripts/slot_run.mjs, so one full suite runs at a time machine-wide.
// On Windows, source-qualified native compiler/fixture files finish serially before the parallel phase.
//   YAIRPG_TEST_SHARDS=N (or --shards N)  split the files into N balanced groups, each its own `node --test` process
//   with its share of the cores. Same files, same limiter slot, same total concurrency; one runner process per group
//   instead of one runner collecting events from every file. Output is printed per shard when it finishes.
import {spawn, spawnSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {concurrencyFor, knownDurations, nodeTestArgs, suitePhases} from './test_plan.mjs';
import {suiteFiles} from './test_changed.mjs';
import {lastRunFile} from './test_budget_reporter.mjs';

/** A lane owns its slots until all commands finish; batches within it are serial. */
export async function runTestLane(batches, {concurrency, lane, tmp, spawnChild = spawn, output = text => process.stdout.write(text)} = {}) {
    const results = [];
    for (const [i, files] of batches.entries()) {
        const durations = path.join(tmp, `shard-${lane}-batch-${i}.json`);
        const result = await new Promise(resolve => {
            let out = '';
            const finish = code => resolve({code: code ?? 1, durations});
            let child;
            try {
                child = spawnChild(process.execPath, nodeTestArgs(files, {concurrency}),
                    {stdio: ['ignore', 'pipe', 'pipe'], env: {...process.env, YAIRPG_TEST_DURATIONS: durations}});
            } catch (error) {
                output(`test suite: ${error.message}\n`); finish(1); return;
            }
            child.stdout.on('data', d => { out += d; });
            child.stderr.on('data', d => { out += d; });
            child.on('error', error => { out += `test suite: ${error.message}\n`; });
            child.on('close', code => {
                output(`\n── shard ${lane + 1}, batch ${i + 1}/${batches.length}: ${files.length} files, exit ${code} ──\n${out}`);
                finish(code);
            });
        });
        results.push(result);
    }
    return results;
}

/** Await every child close in a phase before admitting the next phase. */
export async function runSuitePhases(phases, options = {}) {
    const done = [];
    let lane = 0;
    for (const phase of phases) {
        const output = options.output ?? (text => process.stdout.write(text));
        output(`test suite: ${phase.name}; ${phase.lanes.length} lanes, ${phase.lanes.map(l => l.concurrency).join(', ')} slots\n`);
        const runs = phase.lanes.map(plan => runTestLane(plan.batches, {...options, concurrency: plan.concurrency, lane: lane++}));
        done.push(...(await Promise.all(runs)).flat());
    }
    return done;
}

export async function main(argv = process.argv.slice(2)) {
const flag = argv.indexOf('--shards');
const concurrency = concurrencyFor();
const requestedShards = Number(flag >= 0 ? argv[flag + 1] : process.env.YAIRPG_TEST_SHARDS);
const shards = Math.min(concurrency, Math.max(1, Math.floor(requestedShards) || 1));
const files = suiteFiles();
const phases = suitePhases(files, {concurrency, shards, known: knownDurations()});

if (phases.length === 1 && phases[0].lanes.length === 1 && phases[0].lanes[0].batches.length === 1) {
    const lane = phases[0].lanes[0];
    console.error(`test suite: ${lane.concurrency} files at once (${phases[0].name}; YAIRPG_TEST_CONCURRENCY=N sets parallel slots)`);
    const r = spawnSync(process.execPath, nodeTestArgs(lane.batches[0], {concurrency: lane.concurrency}), {stdio: 'inherit'});
    process.exitCode = r.status ?? 1;
} else {
    const commands = phases.flatMap(p => p.lanes.flatMap(l => l.batches));
    console.error(`test suite: ${phases.length} phases, ${commands.length} commands (${concurrency} parallel slots; YAIRPG_TEST_CONCURRENCY=N sets the total)`);
    const tmp = mkdtempSync(path.join(tmpdir(), 'yairpg-shards-'));
    const started = Date.now();
    const done = await runSuitePhases(phases, {tmp});
    // Each shard's reporter wrote the checkout's last-run file for its own files; put the whole run back (LPT order and budgets read it).
    const merged = {concurrency, files: {}};
    for (const {durations} of done) {
        try { const r = JSON.parse(readFileSync(durations, 'utf8')); Object.assign(merged, {at: r.at, load1: r.load1}); Object.assign(merged.files, r.files); } catch { /* shard reported nothing */ }
    }
    merged.full = Object.keys(merged.files).length >= files.length * 0.9;
    try { const f = lastRunFile(process.cwd()); mkdirSync(path.dirname(f), {recursive: true}); writeFileSync(f, JSON.stringify(merged, null, 1)); } catch { /* best effort */ }
    rmSync(tmp, {recursive: true, force: true});
    console.error(`test suite: ${phases.length} phases finished in ${Math.round((Date.now() - started) / 1000)}s`);
    process.exitCode = done.every(d => d.code === 0) ? 0 : 1;
}
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
