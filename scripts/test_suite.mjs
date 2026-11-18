#!/usr/bin/env node
// npm test: every tests/*.test.js, slowest first, as many at once as the machine has free cores (scripts/test_plan.mjs).
// npm test wraps this in scripts/slot_run.mjs, so one full suite runs at a time machine-wide.
//   YAIRPG_TEST_SHARDS=N (or --shards N)  split the files into N balanced groups, each its own `node --test` process
//   with its share of the cores. Same files, same limiter slot, same total concurrency; one runner process per group
//   instead of one runner collecting events from every file. Output is printed per shard when it finishes.
import {spawn, spawnSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {concurrencyFor, knownDurations, nodeTestArgs, shardFiles} from './test_plan.mjs';
import {suiteFiles} from './test_changed.mjs';
import {lastRunFile} from './test_budget_reporter.mjs';

const argv = process.argv.slice(2);
const flag = argv.indexOf('--shards');
const shards = Math.max(1, Number(flag >= 0 ? argv[flag + 1] : process.env.YAIRPG_TEST_SHARDS) || 1);
const concurrency = concurrencyFor();
const files = suiteFiles();

if (shards === 1) {
    console.error(`test suite: ${concurrency} files at once (free cores now; YAIRPG_TEST_CONCURRENCY=N sets it)`);
    const r = spawnSync(process.execPath, nodeTestArgs(files, {concurrency}), {stdio: 'inherit'});
    process.exitCode = r.status ?? 1;
} else {
    const groups = shardFiles(files, shards, knownDurations()).filter(g => g.length);
    const each = Math.max(1, Math.ceil(concurrency / groups.length));
    console.error(`test suite: ${groups.length} shards, ${each} files at once in each (${each * groups.length} total; YAIRPG_TEST_CONCURRENCY=N sets the total)`);
    const tmp = mkdtempSync(path.join(tmpdir(), 'yairpg-shards-'));
    const started = Date.now();
    const runs = groups.map((group, i) => new Promise(resolve => {
        const durations = path.join(tmp, `shard-${i}.json`);
        const child = spawn(process.execPath, nodeTestArgs(group, {concurrency: each}),
            {stdio: ['ignore', 'pipe', 'pipe'], env: {...process.env, YAIRPG_TEST_DURATIONS: durations}});
        let out = '';
        child.stdout.on('data', d => { out += d; });
        child.stderr.on('data', d => { out += d; });
        child.on('close', code => {
            process.stdout.write(`\n── shard ${i + 1}/${groups.length}: ${group.length} files, exit ${code}, ${Math.round((Date.now() - started) / 1000)}s ──\n${out}`);
            resolve({code: code ?? 1, durations});
        });
    }));
    const done = await Promise.all(runs);
    // Each shard's reporter wrote the checkout's last-run file for its own files; put the whole run back (LPT order and budgets read it).
    const merged = {files: {}};
    for (const {durations} of done) {
        try { const r = JSON.parse(readFileSync(durations, 'utf8')); Object.assign(merged, {at: r.at, load1: r.load1, concurrency: r.concurrency}); Object.assign(merged.files, r.files); } catch { /* shard reported nothing */ }
    }
    merged.full = Object.keys(merged.files).length >= files.length * 0.9;
    try { const f = lastRunFile(process.cwd()); mkdirSync(path.dirname(f), {recursive: true}); writeFileSync(f, JSON.stringify(merged, null, 1)); } catch { /* best effort */ }
    rmSync(tmp, {recursive: true, force: true});
    console.error(`test suite: ${groups.length} shards finished in ${Math.round((Date.now() - started) / 1000)}s`);
    process.exitCode = done.every(d => d.code === 0) ? 0 : 1;
}
