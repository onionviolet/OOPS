#!/usr/bin/env node
// Regenerate every generated output that is computed from tracked inputs, in dependency order (merge friction, 2026-11-18).
//   node scripts/regen_generated.mjs [--all] [--list]   run the steps (--all adds the slow ones) in this checkout (cwd), printing each step's seconds
// The merge queue runs this in its scratch tree after merging, and takes the queue side for a conflicted file in
// REGENERABLE (it is rewritten here from the merged inputs), then folds the result into the merge commit. A step that
// edits ledgers in place (settle, form, item-bound) is not listed in REGENERABLE: a conflict there is a real one.
// Order is the dependency order: builders and settle first, then the derivation rule scores (they read builder outputs and
// the ledgers read their scores and versions), then the B ledgers, then the worlds ledger, then the coverage report.
// The bundle (dist/, index.html) is rebuilt by the queue's own build check right after.
// Never add `gu_generator.mjs ledger` here: it calls a paid model.
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

export const STEPS = [
    {name: 'capability-runs barrel', cmd: ['scripts/gen_capability_runs.mjs'], writes: ['src/capability_runs/index.js']},
    {name: 'hp spells', cmd: ['scripts/spell_coverage.mjs'], writes: ['docs/coverage/hp_spells.jsonl']},
    {name: 'creatures', cmd: ['scripts/coverage_creatures.mjs'], writes: ['docs/coverage/creatures.jsonl']},
    {name: 'worm powers', cmd: ['scripts/worm_power_ledger.mjs'], writes: ['docs/coverage/worm_powers.jsonl']},
    {name: 'form transformation cases (in place)', cmd: ['scripts/form_transformation_ledgers.mjs'], writes: []},
    {name: 'item-bound cases (in place)', cmd: ['scripts/item_bound_ledgers.mjs'], writes: [], slow: true},
    {name: 'settle typed runs (in place)', cmd: ['scripts/typed_runs.mjs'], writes: []},
    {name: 'derivation rule scores', cmd: ['scripts/derivation_rules_backtest.mjs'], writes: ['docs/coverage/derivation_rules.json']},
    {name: 'B ledgers', cmd: ['scripts/b_coverage_ledgers.mjs'],
        writes: ['docs/coverage/hp_potions.jsonl', 'docs/coverage/hp_ingredients.jsonl', 'docs/coverage/lotm_potions.jsonl']},
    {name: 'worlds ledger', cmd: ['scripts/worlds_ledger.mjs'], writes: ['docs/coverage/worlds.jsonl']},
    {name: 'coverage report', cmd: ['scripts/coverage_report.mjs'], writes: ['docs/coverage/README.md']},
    {name: 'systems by world', cmd: ['scripts/cross_world_coverage.mjs'], writes: ['prototypes/progress-atlas/2026-11-07-systems-by-world.html']},
];

/** Files the queue may take from its own side on a conflict, because a step above rewrites them from the merged inputs. */
export const REGENERABLE = STEPS.flatMap(s => s.writes);

// slow steps (item-bound cases: 50 s on a quiet machine, many minutes under load) run only with all: true / --all
export function regenerate(cwd, {log = () => {}, steps = STEPS, all = false} = {}) {
    const results = [];
    for (const s of steps.filter(x => all || !x.slow)) {
        const started = Date.now();
        // A tree without the step's script (an older branch, a fixture repo) has nothing to regenerate there.
        if (!existsSync(join(cwd, s.cmd[0]))) { results.push({name: s.name, status: 0, seconds: 0, skipped: true}); log(`  regen ${s.name}: skipped (no ${s.cmd[0]})`); continue; }
        const r = spawnSync(process.execPath, s.cmd, {cwd, encoding: 'utf8', maxBuffer: 1 << 28});
        const res = {name: s.name, status: r.status, seconds: Math.round((Date.now() - started) / 1000)};
        if (r.status !== 0) res.error = `${r.stdout || ''}${r.stderr || ''}`.trim().split('\n').slice(-8).join('\n');
        results.push(res);
        log(`  regen ${s.name}: ${r.status === 0 ? 'ok' : `FAIL (exit ${r.status})`} ${res.seconds}s`);
        if (r.status !== 0) break;
    }
    return results;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    if (process.argv.includes('--list')) { for (const s of STEPS) console.log(`${s.name}: node ${s.cmd.join(' ')}`); process.exit(0); }
    const res = regenerate(process.cwd(), {log: console.log, all: process.argv.includes('--all')});
    process.exit(res.every(r => r.status === 0) ? 0 : 1);
}
