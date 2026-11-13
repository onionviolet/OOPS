// Test duration budget (FRC70). Warns, never fails.
// As a node --test reporter (npm test and test:changed add it beside spec, on stderr) it prints
// the five slowest files, files over their budget, labelled files that now run well under it,
// and a re-profile warning when a full suite's total file time is 25% past the profiled baseline.
// Budgets live in tests/duration_budget.json: default_ms for every file; per-file entries
// {ms, tier: 'slow', why} for files that are slow because they play the game (test:changed
// leaves those to the merge batch unless their own imports changed); suite_sum_ms for the
// re-profile trigger. Each run's durations are kept in the OS temp folder for this checkout
// (YAIRPG_TEST_DURATIONS=<file.json> writes a copy elsewhere).
// As a command, the budget ratchets down like the check:arch growth baseline:
//   node scripts/test_budget_reporter.mjs              show the last run against the budget
//   node scripts/test_budget_reporter.mjs --tighten    lower entries and suite_sum_ms to it (never raises)
import {mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadavg, tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export const BUDGET_FILE = 'tests/duration_budget.json';
const HEADROOM = 2, STEP = 10000, REPROFILE_OVER = 1.25;

export function loadBudget(file = path.join(process.cwd(), BUDGET_FILE)) {
    try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return {default_ms: 20000, files: {}}; }
}

export const lastRunFile = (cwd = process.cwd()) =>
    path.join(tmpdir(), 'yairpg-test-durations', `${createHash('sha256').update(cwd).digest('hex').slice(0, 16)}.json`);

export function overBudget(durations, budget) {
    return [...durations].map(([file, ms]) => ({file, ms, limit: budget.files?.[file]?.ms ?? budget.default_ms}))
        .filter(r => r.ms > r.limit).sort((a, b) => b.ms - a.ms);
}

// The budget a labelled file would get from this run: HEADROOM x its time, in 10 s steps.
// null means it no longer needs an entry.
const fitted = (ms, budget) => ms * HEADROOM <= budget.default_ms ? null : Math.ceil(ms * HEADROOM / STEP) * STEP;

export function tighten(budget, durations, {full = false} = {}) {
    const next = structuredClone(budget), changes = [];
    for (const [file, entry] of Object.entries(budget.files || {})) {
        if (!durations.has(file)) continue;
        const want = fitted(durations.get(file), budget);
        if (want === null) { delete next.files[file]; changes.push(`${file}: entry removed (${secs(durations.get(file))})`); }
        else if (want < entry.ms) { next.files[file].ms = want; changes.push(`${file}: ${secs(entry.ms)} -> ${secs(want)}`); }
    }
    const sum = [...durations.values()].reduce((a, b) => a + b, 0);
    if (full && budget.suite_sum_ms && sum < budget.suite_sum_ms) { next.suite_sum_ms = Math.round(sum); changes.push(`suite_sum_ms: ${secs(budget.suite_sum_ms)} -> ${secs(sum)}`); }
    return {budget: next, changes};
}

const secs = ms => `${(ms / 1000).toFixed(1)}s`;

export function budgetReport(durations, budget, {full = false} = {}) {
    if (!durations.size) return '';
    const over = overBudget(durations, budget), lines = [];
    const slowest = [...durations].sort((a, b) => b[1] - a[1]).slice(0, 5);
    lines.push(`test budget: slowest files ${slowest.map(([f, ms]) => `${path.basename(f)} ${secs(ms)}`).join(', ')}`);
    if (over.length) {
        lines.push(`test budget: ${over.length} file(s) over budget (warning only; speed up the setup, or label real play in ${BUDGET_FILE}):`);
        for (const r of over) lines.push(`  ${r.file} ${secs(r.ms)} > ${secs(r.limit)}`);
    }
    const loose = tighten(budget, durations).changes;
    if (loose.length) lines.push(`test budget: ${loose.length} labelled file(s) now run well under budget; ratchet with npm run test:budget -- --tighten`);
    const sum = [...durations.values()].reduce((a, b) => a + b, 0);
    if (full && budget.suite_sum_ms && sum > budget.suite_sum_ms * REPROFILE_OVER)
        lines.push(`test budget: total file time ${secs(sum)} is ${Math.round((sum / budget.suite_sum_ms - 1) * 100)}% over the profiled ${secs(budget.suite_sum_ms)}; re-profile (docs/audits/TEST_SPEED_2026-11-10.md)`);
    return lines.join('\n') + '\n';
}

function writeRun(file, run) {
    try { mkdirSync(path.dirname(file), {recursive: true}); writeFileSync(file, JSON.stringify(run, null, 1)); } catch { /* best effort */ }
}

export default async function* budgetReporter(source) {
    const durations = new Map(), cwd = process.cwd();
    for await (const event of source) {
        // With process isolation each file reports one top-level completion named by its path.
        if (event.type !== 'test:complete' || event.data.nesting !== 0 || !event.data.file) continue;
        const rel = path.relative(cwd, event.data.file);
        if (event.data.name === rel) durations.set(rel, event.data.details?.duration_ms ?? 0);
    }
    const budget = loadBudget();
    let total = 0;
    try { total = readdirSync(path.join(cwd, 'tests')).filter(f => f.endsWith('.test.js')).length; } catch { /* no suite here */ }
    const full = total > 0 && durations.size >= total * 0.9;
    const run = {at: new Date().toISOString(), load1: loadavg()[0], full, files: Object.fromEntries([...durations].sort((a, b) => b[1] - a[1]))};
    writeRun(lastRunFile(cwd), run);
    if (process.env.YAIRPG_TEST_DURATIONS) writeRun(process.env.YAIRPG_TEST_DURATIONS, run);
    yield budgetReport(durations, budget, {full});
}

function main(argv) {
    let run;
    try { run = JSON.parse(readFileSync(argv.find(a => a.endsWith('.json')) ?? lastRunFile(), 'utf8')); } catch {
        console.log('test budget: no recorded run for this checkout yet; run npm test or npm run test:changed first');
        return 0;
    }
    const durations = new Map(Object.entries(run.files)), budget = loadBudget();
    console.log(`test budget: last run ${run.at}, ${durations.size} files, load ${run.load1?.toFixed?.(1) ?? '?'}${run.full ? ', full suite' : ''}`);
    process.stdout.write(budgetReport(durations, budget, {full: run.full}));
    const {budget: next, changes} = tighten(budget, durations, {full: run.full});
    if (!argv.includes('--tighten')) { if (changes.length) console.log(`test budget: --tighten would apply ${changes.length} change(s)`); return 0; }
    for (const c of changes) console.log(`  ${c}`);
    if (changes.length) writeFileSync(path.join(process.cwd(), BUDGET_FILE), JSON.stringify(next, null, 1) + '\n');
    console.log(`test budget: ${changes.length} change(s) written to ${BUDGET_FILE}`);
    return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = main(process.argv.slice(2));
