// What the batch readers found, per world, deduplicated: census entities (items, creatures, groups, gods,
// documents, prices...), rules (crafts, potions, rites, spells, abilities, laws), and texture rows (services,
// customs, news). One canonical file per shard and pass, the same choice the library uses (merged `m_` census
// and scenes; plain then Luna prefix), so re-reads, m13 passes and A/B runs never count twice.
// Ids, labels, kinds, counts and one locator per row; census notes and step prose stay out.
//   node prototypes/world-atlas/reader-findings.mjs [--out-dir work/atlas-snapshot/readers]
// Prints the coverage matrix as JSON; with --out-dir also writes one digest per world.
import {existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bookShards} from '../../scripts/lead_run/make_book_plans.mjs';
import {chosenFile, REGISTRY} from './library-reading.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
// Matrix columns: what a reader row is about. `census` kinds map to columns; rule kinds split making from the rest.
export const COLUMNS = [
    {id: 'people', label: 'People', census: ['person']},
    {id: 'places', label: 'Places', census: ['place']},
    {id: 'items', label: 'Items and materials', census: ['item']},
    {id: 'creatures', label: 'Creatures', census: ['creature']},
    {id: 'groups', label: 'Groups and gods', census: ['organization', 'org', 'deity']},
    {id: 'documents', label: 'Documents and languages', census: ['document', 'language']},
    {id: 'money', label: 'Prices and measures', census: ['price', 'measure']},
    {id: 'time', label: 'Clocks, calendars, events', census: ['clock', 'calendar', 'event']},
    {id: 'making', label: 'Making (craft, potion, rite, spell)', rules: ['craft', 'potion', 'rite', 'spell']},
    {id: 'abilities', label: 'Abilities', rules: ['ability']},
    {id: 'order', label: 'Laws, customs, institutions', rules: ['law', 'custom', 'institution', 'other', 'reset']},
    {id: 'life', label: 'Services, customs, news', texture: ['services', 'customs', 'news']},
    {id: 'scenes', label: 'Scenes', scenes: true},
];
export const MAKING_KINDS = ['craft', 'potion', 'rite', 'spell'];
const CENSUS_KIND = new Map(COLUMNS.flatMap(c => (c.census || []).map(k => [k, c.id])));
const RULE_KIND = new Map(COLUMNS.flatMap(c => (c.rules || []).map(k => [k, c.id])));

const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const arr = x => Array.isArray(x) ? x : x ? [x] : [];
const short = (s, n = 160) => {s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s;};
// An input or product names a census id ("lotm.item.silver-sheet") or plain words ("silver hunter bullet").
export function itemRef(world, v) {
    const raw = typeof v === 'string' ? v : v?.item ?? v?.id ?? v?.what ?? '';
    if (/^[a-z0-9]+\.[a-z-]+\.[\w-]+$/i.test(raw)) return {id: raw, label: null};
    return {id: `${world}.item~${slug(raw)}`, label: short(raw, 80)};
}
const labelFromId = id => id.split(/[.~]/).at(-1).replace(/-/g, ' ').replace(/^./, c => c.toUpperCase());

// Pure fold over rows already read, so a test can check deduplication without files.
// input: {world, shards: [{prefix, census: [], rules: [], texture: {services: [], customs: [], news: []}, scenes: n}]}
export function digestWorld({world, shards}) {
    const entities = new Map(), rules = new Map(), life = [];
    const counts = Object.fromEntries(COLUMNS.map(c => [c.id, {rows: 0, distinct: 0}]));
    const lifeSeen = new Set();
    for (const s of shards) {
        for (const r of s.census || []) {
            const col = CENSUS_KIND.get(r.kind);
            if (!col || !r.id) continue;
            counts[col].rows++;
            const e = entities.get(r.id);
            if (e) {
                if (!e.shards.includes(s.prefix)) e.shards.push(s.prefix);
                if (r.touchedByLead) e.lead = true;
                for (const w of r.whereabouts || []) if (w.place && e.places.length < 6 && !e.places.includes(w.place)) e.places.push(short(w.place, 60));
            } else entities.set(r.id, {id: r.id, label: short(r.label || labelFromId(r.id), 80), kind: r.kind, col, first: r.firstMention || null, lead: !!r.touchedByLead,
                aliases: arr(r.aliases).slice(0, 4).map(a => short(a, 40)), places: arr(r.whereabouts).map(w => w.place).filter(Boolean).slice(0, 6).map(p => short(p, 60)), shards: [s.prefix]});
        }
        for (const r of s.rules || []) {
            const col = RULE_KIND.get(r.kind) || 'order';
            if (!r.id) continue;
            counts[col].rows++;
            const refs = list => arr(list).filter(v => itemRef(world, v).id.split('~')[1] !== '').map(v => ({...itemRef(world, v), qty: v?.qty ?? null, unit: v?.unit ? short(v.unit, 20) : null, role: v?.role || null}));
            const prev = rules.get(r.id);
            if (prev) {
                if (!prev.shards.includes(s.prefix)) prev.shards.push(s.prefix);
                for (const [k, list] of [['inputs', refs(r.inputs)], ['products', refs(r.products)]]) for (const x of list) if (!prev[k].some(y => y.id === x.id)) prev[k].push(x);
                continue;
            }
            rules.set(r.id, {id: r.id, name: short(r.name || labelFromId(r.id), 80), kind: r.kind || 'other', col, worldKind: r.worldKind ? short(r.worldKind, 40) : null,
                inputs: refs(r.inputs), products: refs(r.products),
                costs: arr(r.costs).filter(c => c.amount != null).slice(0, 6).map(c => ({amount: c.amount, unit: short(c.unit, 20)})),
                minutes: r.minutes ?? null, ritual: !!r.ritual?.needed, steps: arr(r.steps).length, who: arr(r.who).length, locator: r.locator || null, shards: [s.prefix]});
        }
        for (const [key, rows] of Object.entries(s.texture || {})) for (const r of rows) {
            counts.life.rows++;
            const k = key + '|' + slug(r.what);
            if (lifeSeen.has(k)) continue;
            lifeSeen.add(k);
            life.push({kind: key, what: short(r.what), at: r.place || r.applies || r.scope || null, locator: r.locator || null});
        }
        counts.scenes.rows += s.scenes || 0;
    }
    for (const e of entities.values()) counts[e.col].distinct++;
    for (const r of rules.values()) counts[r.col].distinct++;
    counts.life.distinct = life.length;
    counts.scenes.distinct = counts.scenes.rows;
    // Join rule items to census labels; ids the census never named stay, marked unmatched.
    const byName = new Map();
    for (const e of entities.values()) for (const n of [e.label, ...e.aliases]) {const k = slug(n); if (k && !byName.has(k)) byName.set(k, e.id);}
    for (const r of rules.values()) for (const x of [...r.inputs, ...r.products]) {
        if (!entities.has(x.id)) {
            // Plain words, or an id the census spelled differently: try the census label, then the id's own tail.
            const tail = x.id.split(/[.~]/).at(-1), hit = byName.get(slug(x.label || '')) || byName.get(tail);
            if (hit) x.id = hit;
        }
        const e = entities.get(x.id);
        x.label = e?.label || x.label || labelFromId(x.id);
        x.matched = !!e;
    }
    const byShards = (a, b) => b.shards.length - a.shards.length || a.label?.localeCompare?.(b.label);
    return {world, shards: shards.length, counts,
        entities: [...entities.values()].map(e => ({...e, seen: e.shards.length, shards: undefined})).sort((a, b) => b.seen - a.seen || a.label.localeCompare(b.label)),
        rules: [...rules.values()].sort(byShards).map(r => ({...r, seen: r.shards.length, shards: undefined})), life};
}

const readRows = file => {
    if (!file || !existsSync(file)) return [];
    const out = [];
    for (const line of readFileSync(file, 'utf8').split('\n')) {
        if (!line.trim()) continue;
        try {out.push(JSON.parse(line));} catch {/* a torn line in a partial file: skip */}
    }
    return out;
};
const lineCount = file => file && existsSync(file) ? readFileSync(file, 'utf8').split('\n').filter(l => l.trim()).length : 0;

export function readFindings({registry = join(root, REGISTRY)} = {}) {
    const books = JSON.parse(readFileSync(registry, 'utf8')).books;
    const worlds = new Map(), dirsDone = new Set();
    for (const book of books) {
        const dir = join(root, book.dir), names = existsSync(dir) ? readdirSync(dir) : [], files = new Set(names);
        const shards = bookShards(book, names);
        const w = worlds.get(book.world) || worlds.set(book.world, {keys: [], shards: [], planned: 0, extra: 0, registryRead: 0}).get(book.world);
        w.keys.push(book.key);
        w.planned += shards.length;
        // Lead-run slices read before the registry existed (LOTM's b4s42, c5s12, w6s3...): base stems only, so
        // reruns (x2), probes and model trials stay out. Ids dedupe any overlap with registry shards.
        if (!dirsDone.has(dir)) {
            dirsDone.add(dir);
            // One stem per slice number: LOTM's b and c families re-read the same chapters (b4s42 and c4s42 are both ch121-123).
            const covered = new Set(books.filter(b => join(root, b.dir) === dir).map(b => b.key)), bySlice = new Map();
            for (const n of names.sort()) {
                const m = /^(([a-z])\d+s(\d+))m_census\.jsonl$/.exec(n);
                if (!m || [...covered].some(k => m[1].startsWith(k + 'c'))) continue;
                if (!bySlice.has(m[3])) bySlice.set(m[3], m[1]);
            }
            for (const prefix of bySlice.values()) {shards.push({prefix, extra: true}); w.extra++;}
        }
        for (const s of shards) {
            const at = (pass, key) => {const f = chosenFile(files, s.prefix, pass, key); return f ? join(dir, f) : null;};
            const census = readRows(at('census')), rules = readRows(at('rules', 'rules'));
            const texture = {services: readRows(at('texture', 'services')), customs: readRows(at('texture', 'customs')), news: readRows(at('texture', 'news'))};
            const scenes = lineCount(at('scenes'));
            if (census.length || rules.length || scenes || Object.values(texture).some(r => r.length)) {w.shards.push({prefix: s.prefix, census, rules, texture, scenes}); if (!s.extra) w.registryRead++;}
        }
    }
    return [...worlds].map(([world, w]) => ({...digestWorld({world, shards: w.shards}), keys: w.keys, planned: w.planned, registryRead: w.registryRead, extraSlices: w.shards.length - w.registryRead}));
}

// The matrix the snapshot keeps: counts only. Digests are written per world for the Things and Making views.
export function findingsMatrix(digests) {
    return {columns: COLUMNS.map(({id, label}) => ({id, label})),
        worlds: digests.map(d => ({world: d.world, keys: d.keys, planned: d.planned, extraSlices: d.extraSlices || 0, registryRead: d.registryRead ?? d.shards, read: d.shards, counts: d.counts,
            making: d.rules.filter(r => MAKING_KINDS.includes(r.kind)).length}))};
}

if (import.meta.main) {
    const i = process.argv.indexOf('--out-dir'), outDir = i > 0 ? process.argv[i + 1] : null;
    const digests = readFindings();
    if (outDir) {
        mkdirSync(outDir, {recursive: true});
        for (const d of digests) writeFileSync(join(outDir, d.world + '.json'), JSON.stringify(d));
    }
    process.stdout.write(JSON.stringify(findingsMatrix(digests)));
}
