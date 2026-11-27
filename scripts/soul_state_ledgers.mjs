#!/usr/bin/env node
// W23-S. Default is read-only. The coordinator alone may run --write.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runCase} from './coverage_report.mjs';
import {isTest} from './law_defaults.mjs';
import {SOUL_CASE_MODULE, soulBlocker, soulCaseId} from '../src/soul_state_law.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'docs/coverage');
const label = /Effect ([a-z]+)\.([a-z]+)\/([a-z]+)(?:\/([a-z]+))?/;
const own = new Set(['lotm_artifacts', 'hp_objects', 'ri_treasures', 'hp_creatures', 'lotm_powers',
    'mother_of_learning_artifacts', 'circle_of_inevitability_artifacts', 'fated_villain_artifacts',
    'legendary_mechanic_artifacts', 'speedrunning_multiverse_artifacts', 'shadow_slave_artifacts',
    'regressors_tale_artifacts', 'shadow_slave_creatures', 'shadow_slave_echoes'].map(x => `${x}.jsonl`));
const ran = new Map();

export async function attachSoul(row) {
    if (row.state !== 'blocked:soul-state') return {reason: 'not this blocker'};
    const m = row.note?.match(label);
    if (!m) return {reason: 'no stated effect sentence'};
    const sentence = {verb: m[1], object: m[2], time: m[4]};
    const blocker = soulBlocker(sentence);
    if (blocker) return {reason: blocker};
    // A line, cone or area needs target geometry; this law follows one soul.
    if (['line', 'cone', 'area', 'marked'].includes(m[3])) return {reason: `target ${m[3]} needs selection or geometry`};
    const id = soulCaseId(sentence.verb, sentence.time);
    const next = {...row, case: {module: SOUL_CASE_MODULE, id}};
    if (!ran.has(id)) ran.set(id, await runCase(next, {reachable: new Set()}));
    const result = ran.get(id);
    if (!/^expressed-/.test(result.state)) return {reason: `${result.state}: ${result.detail}`};
    next.state = result.state;
    next.mechanisms = [...new Set([...(row.mechanisms ?? []), 'soul_state_law'])];
    next.note = `${row.note?.trimEnd() ?? ''} Soul-state law (W23-S, proposal): a distinct soul holder changes place, body bond or form through a stored working; the starting form, destination and trigger are authored dials, agent-verified only.`;
    return {row: next};
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    if (process.argv.some(arg => arg.startsWith('--') && arg !== '--write')) throw Error('Only --write is supported; the default is dry-run.');
    const write = process.argv.includes('--write');
    const stats = {mode: write ? 'write' : 'dry-run', blockedBefore: 0, heldOut: 0, moved: 0, heldOutMoved: 0,
        ledgers: 0, reasons: {}};
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).sort()) {
        const lines = fs.readFileSync(path.join(dir, file), 'utf8').split('\n');
        let changed = false;
        for (let i = 0; i < lines.length; i++) {
            let row;
            try { row = JSON.parse(lines[i]); } catch { continue; }
            if (row.state !== 'blocked:soul-state') continue;
            stats.blockedBefore++;
            const held = isTest(row.id);
            if (held) stats.heldOut++;
            const outcome = await attachSoul(row);
            if (!outcome.row) {stats.reasons[outcome.reason] = (stats.reasons[outcome.reason] ?? 0) + 1; continue;}
            stats.moved++;
            if (held) stats.heldOutMoved++;
            changed = true;
            if (write && !own.has(file)) lines[i] = JSON.stringify(outcome.row);
        }
        if (changed) {
            stats.ledgers++;
            if (write && !own.has(file)) fs.writeFileSync(path.join(dir, file), lines.join('\n'));
        }
    }
    stats.take = stats.moved / stats.blockedBefore;
    stats.heldOutTake = stats.heldOutMoved / stats.heldOut;
    stats.topReasons = Object.entries(stats.reasons).sort((a, b) => b[1] - a[1]).slice(0, 10);
    delete stats.reasons;
    console.log(JSON.stringify(stats, null, 2));
}
