// How a test run uses the machine (Weibao 2026-11-16: "allow 18 core parallelization").
// concurrencyFor: files run at once, sized to the cores the machine has free right now. Default: every core
// minus the 1-minute load, at least MIN_CONCURRENCY; YAIRPG_TEST_CONCURRENCY=N sets it outright. Reason: a quiet
// machine finishes a suite two to three times sooner, and a busy one (another suite, a build, a reader) keeps
// its share, because the load average already counts that work.
// longestFirst: start the slowest files first (longest-processing-time scheduling), from this checkout's last
// recorded run, then the budget's per-file entries, then the default. Reason: with many workers the run ends when
// the last slow file ends, so a slow file started late sets the wall time.
import {readFileSync} from 'node:fs';
import {availableParallelism, loadavg} from 'node:os';
import path from 'node:path';
import {lastRunFile, loadBudget} from './test_budget_reporter.mjs';

export const MIN_CONCURRENCY = 4;

/** Pure: how many test files to run at once. */
export function concurrencyFor({cores = availableParallelism(), load = loadavg()[0], env = process.env} = {}) {
    const forced = Number(env.YAIRPG_TEST_CONCURRENCY);
    if (Number.isInteger(forced) && forced >= 1) return forced;
    return Math.max(MIN_CONCURRENCY, Math.min(cores, Math.floor(cores - load)));
}

/** Pure: files ordered slowest first by the known durations (ms by file); unknown files keep their order after known ones of the same estimate. */
export function longestFirst(files, known = {}, fallbackMs = 0) {
    const est = f => known[f] ?? fallbackMs;
    return files.map((f, i) => [f, i]).sort((a, b) => est(b[0]) - est(a[0]) || a[1] - b[1]).map(([f]) => f);
}

/** The duration estimates for a checkout: budget entries under the last recorded run. */
export function knownDurations(cwd = process.cwd()) {
    const budget = loadBudget(path.join(cwd, 'tests/duration_budget.json'));
    const known = Object.fromEntries(Object.entries(budget.files || {}).map(([f, v]) => [f, v.ms / 2]));
    try { Object.assign(known, JSON.parse(readFileSync(lastRunFile(cwd), 'utf8')).files); } catch { /* no run recorded here yet */ }
    return known;
}

/** The node --test arguments both npm test and test:changed use. */
export function nodeTestArgs(files, {concurrency = concurrencyFor(), cwd = process.cwd()} = {}) {
    process.env.YAIRPG_TEST_CONCURRENCY_USED = String(concurrency); // the budget reporter stretches limits by it
    return ['--test', `--test-concurrency=${concurrency}`, '--test-reporter=spec', '--test-reporter-destination=stdout',
        '--test-reporter=./scripts/test_budget_reporter.mjs', '--test-reporter-destination=stderr',
        ...longestFirst(files, knownDurations(cwd))];
}

/** Pure: split files into n groups balanced by known duration (longest first onto the lightest group), each group slowest first. */
export function shardFiles(files, n, known = {}, fallbackMs = 1000) {
    const groups = Array.from({length: n}, () => ({files: [], ms: 0}));
    for (const f of longestFirst(files, known, fallbackMs)) {
        const g = groups.reduce((a, b) => (b.ms < a.ms ? b : a));
        g.files.push(f); g.ms += known[f] ?? fallbackMs;
    }
    return groups.map(g => g.files);
}
