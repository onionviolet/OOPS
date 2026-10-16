// Engine simulation fuzzer runner (wave D).
//   node scripts/simfuzz/run.mjs [--seeds 50] [--steps 2000] [--workers 4] [--from 0]
//        [--out <results.jsonl>] [--fresh] [--report <dir>] [--no-report]
//        [--repro <seed> --stop-at <step>]   (rerun one seed to a step, with a trace)
//        [--report-only]                     (rebuild the report from the JSONL)
// Seed s uses policy POLICIES[s % 3] and fixture FIXTURES[floor(s / 3) % 3].
// Every third seed runs twice to check that a seed gives the same final hash.
// Seeds run in child processes (default 4, the host is shared with other lanes),
// so each result carries its own CPU-seconds. Each finished seed is appended to
// the JSONL at once; a rerun with the same --out skips seeds already there, so an
// interrupted run resumes. Invariant failures are findings in the report, not exit codes.
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import {fork} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import * as H from './harness.mjs';

const SELF = fileURLToPath(import.meta.url);
export const COVERAGE_SEEDS = [0, 4, 8];
const sweepFor = s => COVERAGE_SEEDS.includes(s) ? 'ends' : 'none';

function args() {
    const a = process.argv.slice(2), o = {};
    for (let i = 0; i < a.length; i++) {
        if (!a[i].startsWith('--')) continue;
        const k = a[i].slice(2), v = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true;
        o[k] = v;
    }
    return o;
}

export async function runPool({jobs, workers, onResult = () => {}}) {
    // Longest first: crowded and mid seeds are slower than fresh ones.
    const weight = j => ({crowded: 3, mid: 2, fresh: 1})[H.fixtureForSeed(j.seed)];
    jobs = [...jobs].sort((a, b) => weight(b) - weight(a) || a.seed - b.seed);
    const results = [];
    if (!jobs.length) return results;
    await new Promise((resolve, reject) => {
        let live = 0, next = 0;
        for (let i = 0; i < Math.min(workers, jobs.length); i++) {
            const child = fork(SELF, [], {env: {...process.env, SIMFUZZ_CHILD: '1'}, stdio: ['ignore', 'inherit', 'inherit', 'ipc']});
            live++;
            const feed = () => child.send(next < jobs.length ? jobs[next++] : null);
            child.on('message', m => { if (!m.ready) { results.push(m); onResult(m, results.length, jobs.length); } feed(); });
            child.on('error', reject);
            child.on('exit', code => { if (code) reject(new Error(`simfuzz child exited ${code}`)); else if (--live === 0) resolve(); });
        }
    });
    return results;
}

const keyOf = r => `${r.seed}:${r.rerun ? 1 : 0}:${r.stepsAsked}`;
function readJsonl(file) {
    if (!fs.existsSync(file)) return [];
    return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
}

async function main() {
    const o = args();
    const seeds = +(o.seeds ?? 50), steps = +(o.steps ?? 2000), from = +(o.from ?? 0);
    const workers = +(o.workers ?? 4);
    const reportDir = o['no-report'] ? null : path.resolve(H.ROOT, o.report || 'docs/gm/dispatch/engine-perf-2026-10-14/simfuzz');
    const out = path.resolve(o.out || path.join(os.tmpdir(), `yairpg-simfuzz-${seeds}x${steps}-from${from}.jsonl`));
    if (o.repro != null) {
        const E = await H.loadEngine(), catalog = H.buildCatalog(E);
        const seed = +o.repro;
        const r = H.runSeed(E, catalog, {seed, steps: +(o['stop-at'] || steps), sweep: sweepFor(seed), trace: true});
        console.log(r.events.join('\n'));
        for (const f of r.failures) console.log(`FAIL step ${f.step} ${f.kind} [${f.action}] ${f.detail}`);
        console.log(`final hash ${r.finalHash} clock ${r.finalClock} seq ${r.finalSequence}`);
        return;
    }
    if (o.fresh && fs.existsSync(out)) fs.rmSync(out);
    const jobs = [];
    for (let s = from; s < from + seeds; s++) jobs.push({seed: s, steps, sweep: sweepFor(s)});
    for (let s = from; s < from + seeds; s += 3) jobs.push({seed: s, steps, sweep: sweepFor(s), rerun: true});
    const done = new Map(readJsonl(out).map(r => [keyOf(r), r]));
    const todo = o['report-only'] ? [] : jobs.filter(j => !done.has(keyOf({...j, stepsAsked: j.steps})));
    const t0 = Date.now(), loadStart = os.loadavg().map(x => x.toFixed(0)).join(' / ');
    console.log(`simfuzz: ${seeds} seeds x ${steps} steps, ${workers} workers, ${done.size} already in ${out}, ${todo.length} to run`);
    await runPool({jobs: todo, workers, onResult: (m, i, n) => {
        fs.appendFileSync(out, JSON.stringify(m) + '\n');
        console.log(`[${i}/${n}] seed ${m.seed}${m.rerun ? ' (rerun)' : ''} ${m.policy}/${m.fixture} ${m.ms} ms wall, ${m.cpuSeconds} cpu-s, commits ${m.commits}, fails ${m.failures?.length ?? 0}${m.harnessError ? ' HARNESS ERROR' : ''}`);
    }});
    const wall = Date.now() - t0;
    const results = [...new Map(readJsonl(out).map(r => [keyOf(r), r])).values()].filter(r => r.stepsAsked === steps && r.seed >= from && r.seed < from + seeds);
    console.log(`done in ${(wall / 1000).toFixed(1)} s (this invocation); ${results.length} results`);
    if (reportDir) {
        const {writeReport} = await import('./report.mjs');
        const files = await writeReport({results, seeds, steps, workers, wall, from, dir: reportDir, loadStart, jsonl: out});
        console.log('report:', files.join(', '));
    }
    const broken = results.filter(r => r.harnessError);
    if (broken.length) { for (const r of broken) console.error(r.harnessError); process.exitCode = 2; }
}

// Dispatch last: main() uses the helpers above.
if (process.env.SIMFUZZ_CHILD) {
    const E = await H.loadEngine();
    const catalog = H.buildCatalog(E);
    process.on('message', job => {
        if (job === null) process.exit(0);
        const t = Date.now(), cpu = process.cpuUsage();
        let out;
        try { out = H.summarize(H.runSeed(E, catalog, job)); }
        catch (e) { out = {seed: job.seed, harnessError: e.stack}; }
        const used = process.cpuUsage(cpu);
        process.send({...out, ms: Date.now() - t, cpuSeconds: +((used.user + used.system) / 1e6).toFixed(1), rerun: !!job.rerun, stepsAsked: job.steps});
    });
    process.send({ready: true});
} else await main();
