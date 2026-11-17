#!/usr/bin/env node
// PWC55: attach the item-bound power law (src/item_bound_law.js) to every ledger row typed
// `blocked:item-bound-power` whose own labelled effect sentence names a world account the law has and whose
// target is the holder (self, touched, bound). The sentence comes from the row's "Effect verb.object/target/time"
// label; the pattern from the row's own words; amounts are authored dials. Rows with no labelled sentence stay blocked.
//   node scripts/item_bound_ledgers.mjs          attach cases and write the computed state
//   node scripts/item_bound_ledgers.mjs --dry   count only
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runCase} from './coverage_report.mjs';
import {ITEM_BOUND_CASE_MODULE, canRunItemBound, itemBoundCaseId, itemBoundPatternOf} from '../src/item_bound_law.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'docs/coverage');
const dry = process.argv.includes('--dry');
const TIMES = {instant: 'instant', sustained: 'sustained', lasting: 'lasting', none: 'instant'};
const before = {}, after = {};
for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).sort()) {
    const lines = fs.readFileSync(path.join(dir, file), 'utf8').split('\n');
    let changed = false;
    const out = [];
    for (const line of lines) {
        let row;
        try { row = JSON.parse(line); } catch { out.push(line); continue; }
        const mine = row.case?.module === ITEM_BOUND_CASE_MODULE;
        if (row.state === 'blocked:item-bound-power') before[file] = (before[file] ?? 0) + 1;
        if (row.state !== 'blocked:item-bound-power' && !mine) { out.push(line); continue; }
        const m = row.note?.match(/Effect ([a-z]+)\.([a-z]+)\/([a-z]+)(?:\/([a-z]+))?/);
        const sentence = m && {verb: m[1], object: m[2], time: TIMES[m[4]] ?? 'instant'};
        if (!mine && !(sentence && ['self', 'touched', 'bound'].includes(m[3]) && canRunItemBound(sentence))) { out.push(line); continue; }
        const pattern = mine ? row.case.id.split('.').pop() : itemBoundPatternOf(row.note);
        const id = mine ? row.case.id : itemBoundCaseId(sentence, pattern);
        const next = {...row, case: {module: ITEM_BOUND_CASE_MODULE, id}};
        const result = await runCase(next);
        next.state = result.state;
        if (!mine) {
            next.mechanisms = [...new Set([...(row.mechanisms ?? []), 'item_bound_law'])];
            next.note = `${row.note.replace(/\s+$/, '')} Item-bound law (PWC55, proposal): the labelled sentence "${sentence.verb} ${sentence.object}" runs as a stored working on the item, pattern ${pattern} (default for the row's own words), and the holder's account changes as the pattern says; amounts are authored dials, the pattern is a reading of the row, agent-verified only.`;
        }
        if (!/^(expressed|runs)-/.test(next.state)) { console.error(`${file} ${row.id}: ${next.state} ${result.detail}`); out.push(line); continue; }
        after[file] = (after[file] ?? 0) + 1;
        changed = true;
        out.push(JSON.stringify(next));
    }
    if (changed && !dry) fs.writeFileSync(path.join(dir, file), out.join('\n'));
}
const sum = o => Object.values(o).reduce((a, b) => a + b, 0);
console.log(JSON.stringify({blockedBefore: sum(before), moved: sum(after), ledgers: Object.keys(after).length, perLedger: Object.fromEntries(Object.entries(after).map(([k, v]) => [k, `${before[k] ?? '(already attached)'} -> moved ${v}`]))}, null, 1));
