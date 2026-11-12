#!/usr/bin/env node
// Run the emergence harness (chat E). Usage:
//   node scripts/emergence_run.mjs [--case <id>|all] [--seed N] [--days N] [--mode jump|day|odd|reload|all] [--json]
// `--mode all` runs every mode and reports whether one jump, many steps and reloads agree.
import {runCase, runEquivalence, describeReport} from './emergence_harness.mjs';
import {EMERGENCE_CASES, PENDING_CHAINS} from './emergence_cases.mjs';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const which = opt('case', 'all'), seed = Number(opt('seed', 1)), mode = opt('mode', 'all'), json = args.includes('--json');
const days = opt('days') == null ? undefined : Number(opt('days'));
const ids = which === 'all' ? Object.keys(EMERGENCE_CASES) : [which];
const out = [];
let failed = false;
for (const id of ids) {
    const c = EMERGENCE_CASES[id];
    if (!c) throw new Error(`No emergence case ${id}. Cases: ${Object.keys(EMERGENCE_CASES).join(', ')}`);
    if (mode === 'all') {
        const eq = runEquivalence(c, {seed, days});
        out.push({case: id, sameWorld: eq.sameWorld, sameChains: eq.sameChains, cost: eq.cost, report: eq.runs.reload});
        if (!json) console.log(`${describeReport(eq.runs.reload)}\n  jump/day/odd/reload: same world ${eq.sameWorld}, same chains ${eq.sameChains}` +
            `\n  far cost (jump run): max ${eq.cost.maxSegmentsPerDay} segments/day, max ${eq.cost.maxMsPerDay} ms/day`);
        failed ||= !eq.sameWorld || !eq.sameChains;
    } else {
        const r = runCase(c, {seed, days, mode});
        out.push({case: id, report: r});
        if (!json) console.log(describeReport(r));
    }
}
if (json) console.log(JSON.stringify({runs: out, pending: PENDING_CHAINS}, null, 2));
else for (const p of PENDING_CHAINS) console.log(`pending ${p.id}: waits on ${p.waits.join('; ')}`);
process.exit(failed ? 1 : 0);
