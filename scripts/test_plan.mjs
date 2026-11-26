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

// CreateProcess allows 32,767 UTF-16 code units including the terminator.
// Quoting can double backslashes and escape quotes; this bound also includes
// the executable, spaces and terminator. Leave room below the OS ceiling.
export const WINDOWS_TEST_COMMAND_LIMIT = 30000;
export function commandLengthBound(args, executable = process.execPath) {
    return [executable, ...args].reduce((n, arg) => n + String(arg).length * 2 + 3, 1);
}

/** Split a lane into serial commands, retaining order and every input occurrence. */
export function commandBatches(files, {concurrency = concurrencyFor(), platform = process.platform,
    limit = WINDOWS_TEST_COMMAND_LIMIT, executable = process.execPath, cwd = process.cwd()} = {}) {
    if (platform !== 'win32') return [files];
    const fixed = commandLengthBound(nodeTestArgs([], {concurrency, cwd}), executable);
    const batches = [];
    let batch = [], length = fixed;
    for (const file of files) {
        const extra = String(file).length * 2 + 3;
        if (fixed + extra > limit) throw new Error(`Test path exceeds the Windows command limit: ${file}`);
        if (batch.length && length + extra > limit) {
            batches.push(batch); batch = []; length = fixed;
        }
        batch.push(file); length += extra;
    }
    if (batch.length) batches.push(batch);
    return batches;
}

// Windows resource-isolation group. The cast files compile disposable live trees
// and run repeated native boot/import workers. The currency and LOTM money files
// do the same for Save/reload/Export/Import; continuity_check has a measured
// five-second whole-tree scan threshold. Under concurrent load, native child
// processes were SIGTERMed and the timed scan exceeded its unchanged threshold;
// the controlled four-slot replay passed all three. Keep assertions, deadlines,
// non-Windows scheduling and ordinary-test parallelism unchanged. The exported
// constant keeps its historical name for callers. Cast evidence:
// docs/gm/dispatch/play-surface-2026-11-14/WINDOWS_NATIVE_CAST_ACCEPTANCE_2026-11-25.md.
export const WINDOWS_NATIVE_INTEGRATION_FILES = Object.freeze([
    'tests/cast_exchange_adapter.test.js', 'tests/cast_inference_adapter.test.js',
    'tests/cast_divination_adapter.test.js', 'tests/cast_making_adapter.test.js',
    'tests/cast_ability_adapter.test.js', 'tests/cast_body_adapter.test.js',
    'tests/cast_journeys.test.js',
    'tests/currency_subunits_save.test.js', 'tests/lotm_money_save.test.js',
    'tests/continuity_check.test.js',
]);

/** Full-suite phase barrier: Windows native compilers run alone, then ordinary parallel shards. */
export function suitePhases(files, {platform = process.platform, concurrency = concurrencyFor(), shards = 1,
    known = {}, exclusiveFiles = WINDOWS_NATIVE_INTEGRATION_FILES, ...batchOptions} = {}) {
    const normalize = f => f.replaceAll('\\', '/');
    const estimates = Object.fromEntries(files.map(f => [f, known[f] ?? known[normalize(f)]]));
    const exclusive = new Set(platform === 'win32' ? exclusiveFiles.map(normalize) : []);
    const heavy = longestFirst(files.filter(f => exclusive.has(normalize(f))), estimates);
    const ordinary = files.filter(f => !exclusive.has(normalize(f)));
    const phases = [];
    if (heavy.length) phases.push({name: 'Windows resource isolation (exclusive)', lanes: [{concurrency: 1,
        // One result per file makes progress and failure visible, without overlap.
        batches: heavy.flatMap(f => commandBatches([f], {...batchOptions, platform, concurrency: 1})),
    }]});
    if (ordinary.length) {
        const count = Math.min(concurrency, Math.max(1, Math.floor(shards) || 1));
        const groups = (count === 1 ? [longestFirst(ordinary, estimates)] : shardFiles(ordinary, count, estimates)).filter(g => g.length);
        const perShard = Math.floor(concurrency / groups.length), remainder = concurrency % groups.length;
        phases.push({name: 'parallel tests', lanes: groups.map((group, i) => {
            const slots = perShard + Number(i < remainder);
            return {concurrency: slots, batches: commandBatches(group, {...batchOptions, platform, concurrency: slots})};
        })});
    }
    return phases;
}
