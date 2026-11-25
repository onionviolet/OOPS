#!/usr/bin/env node
// W23-M dry run. Ledger writes belong to the coordinator, one law at a time.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isTest} from './law_defaults.mjs';
import {runCase} from './coverage_report.mjs';
import {MIND_BINDING_CASE_MODULE, mindBindingBlocker, mindBindingCaseId} from '../src/mind_binding_law.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const label = /Effect ([a-z]+)\.([a-z]+)\/([a-z]+)(?:\/([a-z]+))?/;
const reasons = {};
let all = 0, heldOut = 0, take = 0, heldOutTake = 0;
const cache = new Map();
for (const name of fs.readdirSync(path.join(root, 'docs/coverage')).filter(n => n.endsWith('.jsonl')).sort()) {
    const lines = fs.readFileSync(path.join(root, 'docs/coverage', name), 'utf8').split('\n').filter(Boolean);
    for (const line of lines) {
        const row = JSON.parse(line);
        if (row.state !== 'blocked:mind-binding') continue;
        all++;
        const test = isTest(row.id);
        if (test) heldOut++;
        const m = row.note?.match(label);
        const sentence = m ? {verb: m[1], object: m[2], target: m[3], time: m[4]} : null;
        let why = mindBindingBlocker(sentence, row.note);
        if (!why) {
            const id = mindBindingCaseId(sentence.time);
            if (!cache.has(id)) cache.set(id, await runCase({...row, case: {module: MIND_BINDING_CASE_MODULE, id}}));
            const result = cache.get(id);
            if (!/^(expressed|runs)-/.test(result.state)) why = `${result.state}: ${result.detail}`;
        }
        if (why) reasons[why] = (reasons[why] ?? 0) + 1;
        else {take++; if (test) heldOutTake++;}
    }
}
console.log(JSON.stringify({blockedBefore: all, heldOut, take, heldOutTake,
    takeShare: Number((take / all).toFixed(3)), heldOutTakeShare: Number((heldOutTake / heldOut).toFixed(3)),
    meets25PercentFloor: take / all >= .25 && heldOutTake / heldOut >= .25,
    blockedReasons: Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 12)}, null, 2));
