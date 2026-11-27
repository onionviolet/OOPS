// Batch reading state per reading key: which passes have a plan, an estimate, a submitted batch (receipt) and a collected summary.
// Reads plan JSON and the receipt/summary/estimate files beside each plan's outDir. Labels, counts and dollars only.
import {readFileSync, readdirSync, existsSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
export const PLANS = 'docs/gm/dispatch/batch-reading-2026-10-27/plans';
const json = p => {try {return JSON.parse(readFileSync(p, 'utf8'));} catch {return null;}};

export function readBatches(keys) {
    const dir = join(root, PLANS);
    const byKey = new Map(keys.map(k => [k, {key: k, plans: 0, estimated: 0, submitted: 0, collected: 0, usdEstimate: 0, latestCollectedAt: 0, passes: {}, runs: []}]));
    const keyOf = label => [...byKey.keys()].filter(k => label === k || label.startsWith(k + '-') || label.startsWith(k + '_')).sort((a, b) => b.length - a.length)[0];
    const outFiles = new Map();
    for (const name of readdirSync(dir).filter(n => n.endsWith('.json') && n !== 'books.json')) {
        const plan = json(join(dir, name));
        if (!plan?.label || !plan.outDir) {
            if (plan?.approval && Array.isArray(plan.steps)) for (const s of plan.steps) for (const l of s.labels || []) {
                const k = keyOf(String(l.plan || '').split('/').pop().replace(/\.json$/, '').replace(/_/g, '-'));
                if (k) byKey.get(k).runs.push({file: name, approval: plan.approval, cap: l.cap ?? null});
            }
            continue;
        }
        const k = keyOf(plan.label);
        if (!k) continue;
        const row = byKey.get(k);
        if (!outFiles.has(plan.outDir)) outFiles.set(plan.outDir, existsSync(plan.outDir) ? new Set(readdirSync(plan.outDir)) : new Set());
        const files = outFiles.get(plan.outDir);
        const has = s => files.has(`${plan.label}_${s}.json`);
        const est = has('estimate') && json(join(plan.outDir, `${plan.label}_estimate.json`));
        const state = has('summary') ? 'collected' : has('receipt') ? 'submitted' : est ? 'estimated' : 'planned';
        row.plans++;
        if (est) {row.estimated++; row.usdEstimate += Number(est.usdBatch) || 0;}
        if (state === 'submitted' || state === 'collected') row.submitted++;
        if (state === 'collected') {
            row.collected++;
            const stamp = statSync(join(plan.outDir, plan.label + '_summary.json'), {throwIfNoEntry: false})?.mtimeMs ?? 0;
            row.latestCollectedAt = Math.max(row.latestCollectedAt, stamp);
        }
        const pass = plan.pass || 'unknown', p = row.passes[pass] ||= {planned: 0, estimated: 0, submitted: 0, collected: 0};
        p.planned++; if (est) p.estimated++; if (state !== 'planned' && state !== 'estimated') p.submitted++; if (state === 'collected') p.collected++;
    }
    for (const r of byKey.values()) {r.usdEstimate = Math.round(r.usdEstimate * 100) / 100; r.runs = r.runs.slice(0, 8);}
    return [...byKey.values()];
}

// What a reading request turns into on the batch side: the plan command (writes plan files only) and the dry-run estimate command.
export function batchCommands(keys) {
    const list = keys.join(',');
    return {
        plan: `node scripts/lead_run/make_book_plans.mjs --keys ${list}`,
        dryRun: `for p in ${PLANS}/{${list}}_*.json; do node scripts/lead_run/batch_submit.mjs --plan "$p" --dry-run; done`,
        note: 'Plans and dry runs send nothing. A live batch needs Weibao\'s go and a --max-usd cap (AU7).',
    };
}

if (import.meta.main) {
    const books = json(join(root, PLANS, 'books.json'));
    const keys = (books?.books || books || []).map(b => b.key).filter(Boolean);
    process.stdout.write(JSON.stringify(readBatches(keys)));
}
