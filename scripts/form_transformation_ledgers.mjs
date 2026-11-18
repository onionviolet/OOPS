#!/usr/bin/env node
// PSA28: attach the form-transformation law (src/form_transformation_law.js) to every ledger row typed
// `blocked:form-transformation` whose own effect sentence is a form change (label transform.form or alter.form, or a confirmed
// body-or-species, looks-only, size or abilities-only change when the row has no label). Target and reversal come from the
// row's label and the confirmed fill (docs/coverage/fields/form-transformation.jsonl), else the frozen dials of law_defaults.mjs.
// Rows the fill reads as not a form change, rows over an area and rows with no stated sentence stay blocked.
//   node scripts/form_transformation_ledgers.mjs          attach cases and write the computed state
//   node scripts/form_transformation_ledgers.mjs --dry    count only
// Ledgers rebuilt from a sidecar pass through attachFormRows after the build (their rebuild tests do the same).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runCase} from './coverage_report.mjs';
import {FORM_CASE_MODULE} from '../src/form_transformation_law.js';
import {compose, factsOf, FROZEN_DIALS} from './law_defaults.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let fills;
const ran = new Map(); // a case id runs once: the state is the case's, not the row's
const fillOf = id => (fills ??= Object.fromEntries(fs.readFileSync(path.join(root, 'docs/coverage/fields/form-transformation.jsonl'), 'utf8').split('\n').filter(Boolean)
    .map(l => JSON.parse(l)).filter(r => r.kind === 'row').map(r => [r.id, r])))[id];

/** One row through the law: the attached row when the law takes it, otherwise null (a row already on the law is rerun, so a rebuild matches). */
export async function attachForm(row) {
    const mine = row.case?.module === FORM_CASE_MODULE;
    if (row.state !== 'blocked:form-transformation' && !mine) return null;
    const c = compose('form-transformation', factsOf('form-transformation', {id: row.id, ledger: '', text: row.note}, fillOf(row.id)), FROZEN_DIALS['form-transformation']);
    if (!c.case) return null;
    const next = {...row, case: {module: FORM_CASE_MODULE, id: c.case}};
    if (!ran.has(c.case)) ran.set(c.case, await runCase(next));
    const result = ran.get(c.case);
    next.state = result.state;
    if (!mine) {
        const [reversal, target] = c.case.replace(/^form:/, '').split('.');
        next.mechanisms = [...new Set([...(row.mechanisms ?? []), 'form_transformation_law'])];
        next.note = `${row.note.replace(/\s+$/, '')} Form-transformation law (PSA28, proposal): the stated form change runs as a stored transform.form on its ${target}, reversal ${reversal} (${c.prov.reversal === 'default' ? 'a default dial, not stated by the row' : `from the row's ${c.prov.reversal}`}); the new label and the clock are authored dials, agent-verified only.`;
    }
    if (!/^(expressed|runs)-/.test(next.state)) return {skipped: `${row.id}: ${next.state} ${result.detail}`};
    return next;
}

export async function attachFormRows(rows) {
    const out = [];
    for (const row of rows) { const next = await attachForm(row); out.push(next && !next.skipped ? next : row); }
    return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    const dir = path.join(root, 'docs/coverage'), dry = process.argv.includes('--dry');
    let before = 0, moved = 0;
    const perLedger = {};
    // The artifact and next-cell ledgers keep every row classified by their own builders (artifact_ledgers.test.js, next_cells.test.js), so the law leaves them alone.
    const own = new Set(['lotm_artifacts', 'hp_objects', 'ri_treasures', 'hp_creatures', 'lotm_powers', 'mother_of_learning_artifacts', 'circle_of_inevitability_artifacts', 'fated_villain_artifacts', 'legendary_mechanic_artifacts', 'speedrunning_multiverse_artifacts', 'shadow_slave_artifacts', 'regressors_tale_artifacts', 'shadow_slave_creatures', 'shadow_slave_echoes'].map(n => `${n}.jsonl`));
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl') && !own.has(f)).sort()) {
        const out = [];
        let changed = false;
        for (const line of fs.readFileSync(path.join(dir, file), 'utf8').split('\n')) {
            let row;
            try { row = JSON.parse(line); } catch { out.push(line); continue; }
            if (row.state === 'blocked:form-transformation') before++;
            const next = await attachForm(row);
            if (!next) { out.push(line); continue; }
            if (next.skipped) { console.error(`${file} ${next.skipped}`); out.push(line); continue; }
            moved++; perLedger[file] = (perLedger[file] ?? 0) + 1; changed = true;
            out.push(JSON.stringify(next));
        }
        if (changed && !dry) fs.writeFileSync(path.join(dir, file), out.join('\n'));
    }
    console.log(JSON.stringify({blockedBefore: before, moved, ledgers: Object.keys(perLedger).length}, null, 1));
}
