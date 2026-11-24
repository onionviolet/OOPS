// What the batch readers found, per world, deduplicated: census entities (items, creatures, groups, gods,
// documents, prices...), rules (crafts, potions, rites, spells, abilities, laws), and texture rows (services,
// customs, news). One canonical file per shard and pass, the same choice the library uses (merged `m_` census
// and scenes; plain then Luna prefix), so re-reads, m13 passes and A/B runs never count twice.
// Ids, labels, kinds, counts and one locator per row; census notes and step prose stay out.
//   node prototypes/world-atlas/reader-findings.mjs [--out-dir work/atlas-snapshot/readers]
// Prints the coverage matrix as JSON; with --out-dir also writes one digest per world.
import {existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
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
    {id: 'ties', label: 'People pass (routines, ties, knowledge)', people: true},
    {id: 'notes', label: '"Other" rows', other: true},
    {id: 'fills', label: 'Fills (authored proposals)', fills: true},
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
// Some census rows put the evidence letter (S shown, T told, I inferred) in `label`; that is not a name.
const realLabel = l => l && !/^[STIP]$/.test(String(l).trim()) ? l : null;
const labelFromId = id => id.split(/[.~]/).at(-1).replace(/-/g, ' ').replace(/^./, c => c.toUpperCase());

// Pure fold over rows already read, so a test can check deduplication without files.
// input: {world, shards: [{prefix, census: [], rules: [], texture: {services: [], customs: [], news: []}, scenes: n}]}
export function digestWorld({world, shards, makingFill = []}) {
    const entities = new Map(), rules = new Map(), life = [], people = new Map(), places = new Map(), notes = [], fills = new Map();
    const noteSeen = new Set();
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
                if (e.fallback && realLabel(r.label)) {e.label = short(r.label, 80); e.fallback = false;}
                if (r.touchedByLead) e.lead = true;
                for (const w of r.whereabouts || []) if (w.place && e.places.length < 6 && !e.places.includes(w.place)) e.places.push(short(w.place, 60));
            } else entities.set(r.id, {id: r.id, label: short(realLabel(r.label) || labelFromId(r.id), 80), fallback: !realLabel(r.label), kind: r.kind, col, first: r.firstMention || null, lead: !!r.touchedByLead,
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
            rules.set(r.id, {id: r.id, name: short(realLabel(r.name) || labelFromId(r.id), 80), kind: r.kind || 'other', col, worldKind: r.worldKind ? short(r.worldKind, 40) : null,
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
        // People pass: routines, ties and what each person knows, folded per person id.
        for (const r of s.people || []) {
            if (!r.id) continue;
            counts.ties.rows++;
            const p = people.get(r.id) || people.set(r.id, {routine: [], relations: new Map(), knows: 0}).get(r.id);
            for (const x of arr(r.routine)) if (p.routine.length < 8 && x.what && !p.routine.some(y => slug(y.what) === slug(x.what))) p.routine.push({what: short(x.what, 100), place: x.place || null, days: x.days && x.days !== 'unstated' ? short(x.days, 30) : null});
            for (const x of arr(r.relations)) if (x.with && !p.relations.has(x.with)) p.relations.set(x.with, {with: x.with, kind: short(x.kind, 60), attitude: x.attitude ? short(x.attitude, 30) : null});
            p.knows += arr(r.knows).length;
        }
        // Places pass: what a place lets you do, its hours and access.
        for (const r of s.places || []) {
            if (!r.id) continue;
            const p = places.get(r.id) || places.set(r.id, {affordances: [], hours: null, access: []}).get(r.id);
            if (r.hours && r.hours !== 'unstated') p.hours ||= short(r.hours, 60);
            for (const a of arr(r.access)) if (a && a !== 'unstated' && p.access.length < 3 && !p.access.includes(a)) p.access.push(short(a, 80));
            for (const a of arr(r.affordances)) if (a?.what && p.affordances.length < 10 && !p.affordances.some(y => slug(y.what) === slug(a.what))) p.affordances.push({class: a.class || 'other', what: short(a.what, 100)});
        }
        // "Other" rows from the rules, people and texture passes: loose facts tied to ids by `about`.
        for (const [pass, rows] of Object.entries(s.other || {})) for (const r of rows) {
            if (!r.what) continue;
            counts.notes.rows++;
            const k = slug(r.what);
            if (noteSeen.has(k)) continue;
            noteSeen.add(k);
            notes.push({pass, what: short(r.what), about: arr(r.about).slice(0, 4), label: r.label || null, locator: r.locator || null});
        }
        // Fills: authored proposals for gaps (invented or implied), never source facts.
        for (const r of s.fills || []) {
            if (!r.id) continue;
            counts.fills.rows++;
            if (!fills.has(r.id)) fills.set(r.id, {id: r.id, kind: r.kind || null, what: short(r.what), layer: r.layer || null, confidence: r.confidence || null, respects: arr(r.respects).slice(0, 3)});
        }
        counts.scenes.rows += s.scenes || 0;
    }
    // Agent-filled inputs and products (work from the readers' own steps), applied before the census join so they match too.
    for (const f of makingFill) {
        const r = rules.get(f.id);
        if (!r) continue;
        for (const [k, list] of [['inputs', f.inputs], ['products', f.products]]) for (const v of arr(list)) {
            const x = {...itemRef(world, v), qty: null, unit: null, role: v?.role || null, fill: v?.confidence || f.confidence || 'implied'};
            if (x.id.split('~')[1] !== '' && !r[k].some(y => y.id === x.id)) r[k].push(x);
        }
        if (f.outcome) r.outcome = short(f.outcome, 100);
        r.filled = true;
    }
    for (const [id, p] of people) {const e = entities.get(id); if (e) Object.assign(e, {routine: p.routine, relations: [...p.relations.values()].slice(0, 10), knows: p.knows});}
    for (const [id, p] of places) {const e = entities.get(id); if (e) Object.assign(e, p);}
    const noteCount = new Map();
    for (const n of notes) for (const id of n.about) noteCount.set(id, (noteCount.get(id) || 0) + 1);
    for (const [id, n] of noteCount) {const e = entities.get(id); if (e) e.notes = n;}
    counts.ties.distinct = people.size; counts.notes.distinct = notes.length; counts.fills.distinct = fills.size;
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
        entities: [...entities.values()].map(e => ({...e, seen: e.shards.length, shards: undefined, fallback: undefined})).sort((a, b) => b.seen - a.seen || a.label.localeCompare(b.label)),
        rules: [...rules.values()].sort(byShards).map(r => ({...r, seen: r.shards.length, shards: undefined})), life,
        notes: notes.slice(0, 3000), notesTotal: notes.length, fills: [...fills.values()].slice(0, 2000), fillsTotal: fills.size};
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
// Agent fill of missing recipe inputs and products, kept beside the world's private reader rows (gitignored).
export const FILL_DIR = world => join(root, 'work/atlas-fill', world);
function readMakingFill(world) {
    const dir = FILL_DIR(world);
    return existsSync(dir) ? readdirSync(dir).filter(f => /^making_fill.*\.jsonl$/.test(f)).flatMap(f => readRows(join(dir, f))) : [];
}
const lineCount = file => file && existsSync(file) ? readFileSync(file, 'utf8').split('\n').filter(l => l.trim()).length : 0;

export function readFindings({registry = join(root, REGISTRY), onRules = null} = {}) {
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
            if (onRules && rules.length) onRules(book.world, s.prefix, rules);
            const texture = {services: readRows(at('texture', 'services')), customs: readRows(at('texture', 'customs')), news: readRows(at('texture', 'news'))};
            const scenes = lineCount(at('scenes'));
            const people = readRows(at('people', 'people')), places = readRows(at('texture', 'places'));
            const other = {rules: readRows(at('rules', 'other')), people: readRows(at('people', 'other')), texture: readRows(at('texture', 'other'))};
            const fillFile = [`${s.prefix}m_fills.jsonl`, `${s.prefix}_fills.jsonl`, `${s.prefix}L_fills.jsonl`].find(f => files.has(f));
            const fills = fillFile ? readRows(join(dir, fillFile)) : [];
            if (census.length || rules.length || scenes || people.length || Object.values(texture).some(r => r.length)) {w.shards.push({prefix: s.prefix, census, rules, texture, scenes, people, places, other, fills}); if (!s.extra) w.registryRead++;}
        }
    }
    return [...worlds].map(([world, w]) => ({...digestWorld({world, shards: w.shards, makingFill: readMakingFill(world)}), keys: w.keys, planned: w.planned, registryRead: w.registryRead, extraSlices: w.shards.length - w.registryRead}));
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
        for (const d of digests) {
            const file = join(outDir, d.world + '.json');
            const temporary = file + '.' + process.pid + '.tmp';
            writeFileSync(temporary, JSON.stringify(d));
            renameSync(temporary, file);
        }
    }
    process.stdout.write(JSON.stringify(findingsMatrix(digests)));
}
