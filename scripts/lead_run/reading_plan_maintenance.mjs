// Maintenance is deliberately separate from submit: stop/reload active local drivers
// before using this helper, retain remote batches, and never rewrite a sent plan.
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {estimateCost, requestsFromPlan} from './batch_lib.mjs';

export function checkReadingBudget({ceilingUsd, reservations}) {
    if (!Number.isFinite(ceilingUsd) || ceilingUsd <= 0) throw Error('positive finite reading budget required');
    const seen = new Set(); let cents = 0;
    for (const r of reservations) {
        if (!r.id || seen.has(r.id)) throw Error('each reservation needs a unique id');
        if (!Number.isFinite(r.capUsd) || r.capUsd < 0) throw Error('nonnegative finite reservation required');
        seen.add(r.id); cents += Math.ceil(r.capUsd * 100 - 1e-8);
    }
    const ceilingCents = Math.floor(ceilingUsd * 100 + 1e-8);
    if (cents > ceilingCents) throw Error(`reading reservations $${(cents / 100).toFixed(2)} exceed $${ceilingUsd}`);
    return {ceilingUsd, reservedUsd: cents / 100, unallocatedUsd: (ceilingCents - cents) / 100};
}

export function upgradeUnsubmitted(run, {root = '.', read = p => JSON.parse(readFileSync(p, 'utf8')), exists = existsSync, write = (p, v) => writeFileSync(p, JSON.stringify(v, null, 1) + '\n'), bound = p => estimateCost(requestsFromPlan(p), p.maxTokens, p.model)} = {}) {
    const pending = [], retained = [];
    for (const step of run.steps) for (const l of step.labels) {
        const file = resolve(root, l.plan), plan = read(file);
        if (exists(join(plan.outDir, `${plan.label}_receipt.json`)) || exists(join(plan.outDir, `${plan.label}_summary.json`))) {
            retained.push(plan.label); continue;
        }
        if (exists(join(plan.outDir, `${plan.label}_requests.jsonl`))) throw Error(`${plan.label}: request file without a receipt; resolve ambiguous submission before editing`);
        const next = {...plan, schemaVersion: '1.5', reading: {level: 'L1', relevance: ['reference', 'lead-trajectory'], review: 'not-reviewed', ...plan.reading}};
        const e = bound(next), cap = Math.ceil(e.usdBatch * 100 - 1e-8) / 100;
        if (e.requestsOverPromptCap || cap > l.cap) throw Error(`${plan.label}: schema upgrade exceeds its existing cap or prompt limit`);
        pending.push({file, plan: next});
    }
    // Preflight all candidates before mutating any. Callers still own driver exclusion.
    for (const p of pending) write(p.file, p.plan);
    return {upgraded: pending.map(p => p.plan.label), retained};
}
