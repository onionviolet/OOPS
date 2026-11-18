#!/usr/bin/env node
// PSA25 / PSA34: a `runs-*` state is computed, never typed. A row typed `runs-*` that carries no `case` is
// rewritten to `catalogued` and keeps its old label in `typed`, so nothing is lost and the change can be undone
// (set state back to the `typed` value). Builders pass their output rows through `demoteTypedRuns`, so a rebuild
// equals the committed ledger. The CLI rewrites ledgers in place:
//   node scripts/typed_runs.mjs [--dry] [ledger.jsonl ...]     (default: every docs/coverage/*.jsonl)
//   node scripts/typed_runs.mjs --undo [ledger.jsonl ...]      restore each `typed` label (reversal)
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {reachableFrom} from './reachable.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Idempotent: a row with a case, a non-runs state or an existing `typed` label comes back unchanged. */
export function demoteTypedRuns(row) {
    if (!/^runs-/.test(row.state ?? '') || row.case) return row;
    return {...row, state: 'catalogued', typed: row.state};
}
export const demoteRows = rows => rows.map(demoteTypedRuns);

// PSA24 follow-up: with packs wired, a case module the game reaches makes its row run, not merely express. A builder's
// typed `expressed-*` or `runs-*` follows reachability of the row's case module, so a rebuild matches what the runner
// computes. Inline cases and rows with no module keep their state.
let reached = null;
const reachedSet = () => (reached ??= reachableFrom());
export function liftReachable(row, reachable = reachedSet()) {
    const m = /^(expressed|runs)-(canon|authored|derived)$/.exec(row.state ?? '');
    if (!m || typeof row.case?.module !== 'string') return row;
    const want = `${reachable.has(path.resolve(root, row.case.module)) ? 'runs' : 'expressed'}-${m[2]}`;
    return want === row.state ? row : {...row, state: want};
}
/** Builders call this on every output row: lift by reachability, then demote typed runs with no case. */
// A runs row must name the test that runs it. Where a case module has one test that runs every case in it, a lifted
// row without a `test` takes that one (default; a row's own `test` always wins).
const MODULE_TEST = {'src/world_packs/brew_coverage_cases.js': 'tests/hp_potion_case_scenes.test.js'};
const nameTest = row => /^runs-/.test(row.state ?? '') && !row.test && MODULE_TEST[row.case?.module] ? {...row, test: MODULE_TEST[row.case.module]} : row;
export const settleState = row => demoteTypedRuns(nameTest(liftReachable(row)));
/** The reverse: the typed label back into `state` (only rows that were demoted). */
export function restoreTyped(row) {
    if (row.state !== 'catalogued' || typeof row.typed !== 'string') return row;
    const {typed, ...rest} = row;
    return {...rest, state: typed};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2), dry = args.includes('--dry'), undo = args.includes('--undo');
    const files = args.filter(a => a.endsWith('.jsonl')).map(f => path.resolve(f));
    if (!files.length) for (const f of fs.readdirSync(path.join(root, 'docs/coverage'))) if (f.endsWith('.jsonl')) files.push(path.join(root, 'docs/coverage', f));
    let n = 0;
    for (const file of files) {
        const text = fs.readFileSync(file, 'utf8');
        let changed = 0;
        const out = text.split('\n').map(line => {
            if (!line.trim()) return line;
            const row = JSON.parse(line), next = (undo ? restoreTyped : settleState)(row);
            if (next === row) return line;
            changed++;
            return JSON.stringify(next);
        }).join('\n');
        if (changed) { n += changed; console.log(`${path.basename(file)}: ${changed} rows`); if (!dry) fs.writeFileSync(file, out); }
    }
    console.log(`${undo ? 'restored' : 'demoted'} ${n} rows${dry ? ' (dry)' : ''}`);
}
