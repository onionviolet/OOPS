#!/usr/bin/env node
// Applies the chapter tier (scripts/chapter_effect_tier.mjs, PWC27) to the committed ledgers in place, for the ledgers whose builders
// need private replies this checkout may not hold. Idempotent: only `blocked:effect-unknown` rows with a chapter sentence change, and
// the builders apply the same function on a rebuild. Usage: node scripts/chapter_effect_fold.mjs [--check]
import {readFileSync, writeFileSync} from 'node:fs';
import {foldChapterEffect} from './chapter_effect_tier.mjs';

const labels = JSON.parse(readFileSync(new URL('../docs/coverage/chapter_tier_labels.json', import.meta.url), 'utf8')).effect_unknown.ledgers;
let changed = 0;
for (const ledger of Object.keys(labels)) {
    const file = new URL(`../docs/coverage/${ledger}.jsonl`, import.meta.url);
    const rows = readFileSync(file, 'utf8').trim().split('\n').map(l => JSON.parse(l));
    const next = rows.map(r => foldChapterEffect(ledger, r));
    const n = next.filter((r, i) => r !== rows[i]).length;
    changed += n;
    if (n && !process.argv.includes('--check')) writeFileSync(file, next.map(r => JSON.stringify(r)).join('\n') + '\n');
    console.log(`${ledger}: ${n} rows folded`);
}
if (process.argv.includes('--check') && changed) { console.error(`${changed} rows not folded; run node scripts/chapter_effect_fold.mjs`); process.exit(1); }
