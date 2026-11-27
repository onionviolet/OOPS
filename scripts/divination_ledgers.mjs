#!/usr/bin/env node
// Wave 23: attach the divination law (src/divination_law.js) to rows typed `blocked:divination` whose labelled sentence is a reading.
//   node scripts/divination_ledgers.mjs           dry run, writes nothing
//   node scripts/divination_ledgers.mjs --write   write the computed state (coordinator, one law at a time)
// Ledgers rebuilt from a sidecar pass through attachDivinationRows after the build (their rebuild tests do the same).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runCase} from './coverage_report.mjs';
import {isTest} from './law_defaults.mjs';
import {DIVINATION_CASE_MODULE, divinationBlocker, divinationCaseId} from '../src/divination_law.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const label = /Effect ([a-z]+)\.([a-z]+)\/([a-z]+)(?:\/([a-z]+))?/;
const memo = new Map(); // a case id runs once: the state is the case's, not the row's
const sentenceOf = row => {const m = row.note?.match(label); return m && {verb: m[1], object: m[2], target: m[3], time: m[4]};};

/** One row through the law: the attached row when the law takes it, otherwise null (a row already on the law is rerun, so a rebuild matches). */
export async function attachDivination(row) {
    const mine = row.case?.module === DIVINATION_CASE_MODULE;
    if (row.state !== 'blocked:divination' && !mine) return null;
    const sentence = sentenceOf(row);
    if (!sentence || divinationBlocker(sentence)) return null;
    const id = divinationCaseId(sentence);
    const next = {...row, case: {module: DIVINATION_CASE_MODULE, id}};
    if (!memo.has(id)) memo.set(id, await runCase(next));
    const result = memo.get(id);
    next.state = result.state;
    if (!mine) {
        next.mechanisms = [...new Set([...(row.mechanisms ?? []), 'divination_law'])];
        next.note = `${row.note.replace(/\s+$/, '')} Divination law (Wave 23, proposal): the stated reading runs as a divination working that publishes information to the observer; reliability, cost and clock are authored dials, agent-verified only.`;
    }
    if (!/^(expressed|runs)-/.test(next.state)) return {skipped: `${row.id}: ${next.state} ${result.detail}`};
    return next;
}
export async function attachDivinationRows(rows) {
    const out = [];
    for (const row of rows) { const next = await attachDivination(row); out.push(next && !next.skipped ? next : row); }
    return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    const write = process.argv.includes('--write'), dir = path.join(root, 'docs/coverage');
    // The same exclusions as form_transformation_ledgers.mjs: these ledgers keep every row classified by their own builders.
    const own = new Set(['lotm_artifacts', 'hp_objects', 'ri_treasures', 'hp_creatures', 'lotm_powers', 'mother_of_learning_artifacts', 'circle_of_inevitability_artifacts', 'fated_villain_artifacts', 'legendary_mechanic_artifacts', 'speedrunning_multiverse_artifacts', 'shadow_slave_artifacts', 'regressors_tale_artifacts', 'shadow_slave_creatures', 'shadow_slave_echoes', 'gu_kinds', 'gu_moves'].map(n => `${n}.jsonl`));
    const tally = {};
    let rows = 0, labelled = 0, taken = 0, heldOut = 0, heldOutTaken = 0;
    const perLedger = {};
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl') && !['worlds.jsonl', 'interaction_oracle.jsonl'].includes(f)).sort()) {
        const out = [];
        let changed = false;
        for (const line of fs.readFileSync(path.join(dir, file), 'utf8').split('\n')) {
            let row;
            try { row = JSON.parse(line); } catch { out.push(line); continue; }
            const counted = row.state === 'blocked:divination';
            if (counted) { rows++; if (sentenceOf(row)) labelled++; if (isTest(row.id)) heldOut++; }
            const next = own.has(file) ? null : await attachDivination(row);
            if (!next || next.skipped) {
                if (counted) { const why = own.has(file) ? 'ledger kept by its own builder' : next?.skipped ? next.skipped.split(': ').slice(1).join(': ') : (sentenceOf(row) ? divinationBlocker(sentenceOf(row)) : 'no stated effect sentence'); tally[why] = (tally[why] ?? 0) + 1; }
                out.push(line); continue;
            }
            if (counted) { taken++; if (isTest(row.id)) heldOutTaken++; }
            perLedger[file] = (perLedger[file] ?? 0) + 1; changed = true;
            out.push(JSON.stringify(next));
        }
        if (changed && write) fs.writeFileSync(path.join(dir, file), out.join('\n'));
    }
    console.log(JSON.stringify({mode: write ? 'write' : 'dry-run', rows, labelled, taken, takePercent: +(100 * taken / rows).toFixed(1),
        heldOut: {rows: heldOut, taken: heldOutTaken, takePercent: +(100 * heldOutTaken / heldOut).toFixed(1)}, distinctCases: memo.size,
        ledgers: Object.keys(perLedger).length, blockedReasons: Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 8)}, null, 2));
}
