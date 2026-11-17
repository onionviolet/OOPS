#!/usr/bin/env node
// Blocked-slug cleanup (PWC59, no model calls). Reads docs/coverage/blocked_slugs.json and rewrites row states in
// docs/coverage/*.jsonl: `needs-<input>` becomes blocked:needs-material with the input in the row field `needs`, and the
// named near-duplicate slugs fold into one (the old slug goes in `was`). Rows that already use a canonical slug are
// byte-identical afterwards. A slug outside the map is reported, never guessed.
//   node scripts/slug_normalize.mjs --check   exit 1 when a row would change or a slug is outside the map
//   node scripts/slug_normalize.mjs --apply   rewrite the ledgers
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COVERAGE = 'docs/coverage';
export const MAP_FILE = `${COVERAGE}/blocked_slugs.json`;
export const readMap = (file = path.join(root, MAP_FILE)) => JSON.parse(fs.readFileSync(file, 'utf8'));

/** The row after normalising, or null when it is already canonical or not blocked. Unknown slugs return {unknown}. */
export function normalizeRow(row, map) {
    const m = /^blocked:(.+)$/.exec(row.state ?? '');
    if (!m) return null;
    const slug = m[1];
    const fold = map.fold[slug];
    if (fold) return {...row, state: `blocked:${fold.to}`, was: slug};
    for (const [prefix, rule] of Object.entries(map.foldPrefix))
        if (slug.startsWith(prefix) && slug !== rule.to) return {...row, state: `blocked:${rule.to}`, [rule.field]: slug.slice(prefix.length).replace(/-/g, ' ')};
    if (map.canonical.includes(slug) || row.reason) return null;
    return {unknown: slug};
}

/** The row with its slug folded to the canonical one (PWC59); builders that write ledgers call this so a rebuild matches the committed rows. */
export const canonicalRow = (row, map = readMap()) => { const n = normalizeRow(row, map); return n && !n.unknown ? n : row; };

/** Normalise one ledger's text; returns {text, changed, unknown}. Untouched lines keep their exact bytes. */
export function normalizeText(text, map) {
    let changed = 0;
    const unknown = [];
    const out = text.split('\n').map(line => {
        if (!line.trim()) return line;
        const next = normalizeRow(JSON.parse(line), map);
        if (!next) return line;
        if (next.unknown) { unknown.push(next.unknown); return line; }
        changed++;
        return JSON.stringify(next);
    });
    return {text: out.join('\n'), changed, unknown};
}

export const ledgerFiles = (dir = path.join(root, COVERAGE)) => fs.readdirSync(dir).filter(f => f.endsWith('.jsonl') && f !== 'worlds.jsonl').sort();

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const apply = process.argv.includes('--apply'), map = readMap();
    let changed = 0;
    const unknown = {};
    for (const f of ledgerFiles()) {
        const file = path.join(root, COVERAGE, f), r = normalizeText(fs.readFileSync(file, 'utf8'), map);
        changed += r.changed;
        for (const s of r.unknown) unknown[s] = (unknown[s] ?? 0) + 1;
        if (apply && r.changed) fs.writeFileSync(file, r.text);
    }
    const unk = Object.keys(unknown);
    console.log(`${apply ? 'rewrote' : 'would rewrite'} ${changed} rows${unk.length ? `; slugs outside the map: ${unk.map(s => `${s} (${unknown[s]})`).join(', ')}` : ''}`);
    if (!apply && (changed || unk.length)) process.exit(1);
}
