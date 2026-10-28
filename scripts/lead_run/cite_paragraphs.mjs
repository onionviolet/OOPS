// Implementer's bridge from rows to the source (READINESS_AND_SCOPE section 12): for ids or a topic, print every cited paragraph from the private shards.
//   node scripts/lead_run/cite_paragraphs.mjs <privateDir> (--id <id> ... | --topic <regex>) [--merged <dir>] [--context N] [--max N]
// Reads the merge output (registry, scenes, extras) and the private shard files. Prints source text: local reading only, never commit or paste it elsewhere.
import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseShard} from './lint_lead_run.mjs';
import {locatorsIn} from './world_profiles.mjs';

const readJsonl = p => existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l)) : [];

/** "book:ch:p" -> paragraph text over every shard file (book 0 for Chinese volume 1; first file wins where two editions overlap). */
export function shardIndex(privateDir) {
    const index = new Map();
    for (const f of readdirSync(privateDir).filter(f => /^shard_.*\.txt$/.test(f)).sort()) {
        const map = parseShard(readFileSync(join(privateDir, f), 'utf8')), book = map.book || 0;   // Chinese volume 1 is book 0; later volumes carry `| book V`
        for (const [k, v] of map) if (!index.has(`${book}:${k}`)) index.set(`${book}:${k}`, v);
    }
    return index;
}

/** Every locator string anywhere inside a row, as "ch:p" keys in order of first appearance. */
export function locatorsOf(row) {
    const out = [];
    const walk = v => {
        if (typeof v === 'string') for (const m of locatorsIn(v)) { const k = `${m.book}:${m.ch}:${m.p}`; if (!out.includes(k)) out.push(k); }
        else if (Array.isArray(v)) v.forEach(walk);
        else if (v && typeof v === 'object') Object.values(v).forEach(walk);
    };
    walk(row);
    return out;
}

/** Rows that cite each id: its registry row, scenes that name it, extra-pass rows that mention it. */
export function rowsFor(merged, ids) {
    const want = new Set(ids), mentions = v => JSON.stringify(v).match(/"([a-z]+(?:\.[a-z0-9-]+){2,})"/g)?.some(s => want.has(s.slice(1, -1))) ?? false;
    return {
        registry: merged.registry.filter(r => want.has(r.id)),
        scenes: merged.scenes.filter(s => mentions({place: s.place, present: s.present, touched: s.touched, options: s.options, pov: s.pov})),
        extras: merged.extras.filter(mentions),
    };
}

/** Ids whose label, aliases or id match a topic regex (the topic route when no id is known yet). */
export function idsForTopic(registry, re) {
    return registry.filter(r => re.test(r.id) || re.test(r.label || '') || (r.aliases || []).some(a => re.test(a)) || re.test(r.zh || '')).map(r => r.id);
}

/** Cited paragraphs, grouped by source row, with `context` neighbours on each side. Missing paragraphs are reported, not skipped silently. */
export function cite({merged, index, ids, context = 0, max = 60}) {
    const rows = rowsFor(merged, ids), out = [], seen = new Set(), missing = [];
    const add = (from, keys) => {
        for (const k of keys) {
            if (out.length >= max) return;
            const [book, ch, p] = k.split(':').map(Number);
            for (let q = p - context; q <= p + context; q++) {
                const key = `${book}:${ch}:${q}`;
                if (seen.has(key)) continue;
                if (!index.has(key)) { if (q === p) missing.push(key); continue; }
                seen.add(key);
                out.push({from, book, ch, p: q, cited: q === p, text: index.get(key)});
            }
        }
    };
    for (const r of rows.registry) add(r.id, locatorsOf({firstMention: r.firstMention, whereabouts: r.whereabouts}));
    for (const s of rows.scenes) add(s.beat, locatorsOf(s.evidence || []).concat(locatorsOf(s.options || [])));
    for (const x of rows.extras) add(`${x.extra}:${x.id || x.what || x.place || '?'}`, locatorsOf(x));
    return {ids, counts: {registry: rows.registry.length, scenes: rows.scenes.length, extras: rows.extras.length, paragraphs: out.length, missing: missing.length}, paragraphs: out, missing};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const a = process.argv.slice(2), all = n => a.flatMap((x, i) => x === n ? [a[i + 1]] : []), flag = (n, d) => all(n)[0] ?? d;
    const dir = a[0];
    if (!dir || dir.startsWith('--') || (!all('--id').length && !flag('--topic'))) { console.error('usage: cite_paragraphs.mjs <privateDir> (--id id ... | --topic regex) [--merged dir] [--context N] [--max N]'); process.exit(2); }
    const m = flag('--merged', join(dir, 'merged'));
    const merged = {registry: readJsonl(join(m, 'registry.jsonl')), scenes: readJsonl(join(m, 'scenes.jsonl')), extras: readJsonl(join(m, 'extras.jsonl'))};
    if (!merged.registry.length) { console.error(`no registry in ${m}; run merge_shards.mjs first`); process.exit(1); }
    const ids = flag('--topic') ? idsForTopic(merged.registry, new RegExp(flag('--topic'), 'i')) : all('--id');
    const r = cite({merged, index: shardIndex(dir), ids, context: Number(flag('--context', 0)), max: Number(flag('--max', 60))});
    console.log(`# ${ids.length} ids; ${JSON.stringify(r.counts)}\n`);
    let last = null;
    for (const p of r.paragraphs) { if (p.from !== last) { console.log(`\n## ${p.from}`); last = p.from; } console.log(`${p.cited ? '*' : ' '} [${p.ch} p${p.p}] ${p.text}`); }
    if (r.missing.length) console.log(`\nmissing paragraphs (no shard file holds them): ${r.missing.join(', ')}`);
}
