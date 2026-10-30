// Typed ability rows from the whole-book merge (GM26, L10). Free: no model calls; Luna lanes (Codex) classify, this script prepares and validates.
//   node scripts/lead_run/ability_typing.mjs prep   --merged <dir> --out <dir> [--volumes 2,3] [--chunk 80]
//   node scripts/lead_run/ability_typing.mjs ingest --in <dir> --merged <dir> --out <typed.json> --volume N
// prep writes <out>/in_vN_kK.json: [{id, name, items:[{k, t, l, src}]}] for each unique ability rules id (kind 'ability'), deduped items.
// A Luna lane answers <out>/out_vN_kK.tsv, one line per item: id<TAB>itemKey<TAB>ROLE<TAB>slug<TAB>number<TAB>unit
//   ROLE: COND (a state that must hold) | BLOCK (a named state that cancels it) | RANGE | DUR | COUNT | COST (a stated spend) | NOTE (no mechanism) | DUP:<itemKey>
//   slug: snake_case state name (COND and BLOCK only, else empty). number and unit only for RANGE, DUR, COUNT, COST; empty otherwise.
// ingest joins answers to inputs and writes typed rows (conditions, blockers, stated numbers, locators); items without an answer are reported, never guessed.
import {readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROLES = new Set(['COND', 'BLOCK', 'RANGE', 'DUR', 'COUNT', 'COST', 'NOTE']);
const volumeOf = shard => Number(/^lotm([2-8])c/.exec(shard)?.[1] ?? 1);
const readJsonl = path => readFileSync(path, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l));
const textOf = t => typeof t === 'string' ? t : t?.what ?? t?.trigger ?? JSON.stringify(t);
const clip = (s, n = 150) => s.length > n ? s.slice(0, n - 1) + '…' : s;
const SOURCES = {conditions: 'c', limits: 'l', costs: 'k', consequences: 'q'};

/** Unique ability ids of one volume with their deduped items. */
export function abilityInputs(extras, volume) {
    const byId = new Map();
    for (const row of extras) {
        if (row.extra !== 'rules' || row.kind !== 'ability' || !row.id || volumeOf(row.shard) !== volume) continue;
        const entry = byId.get(row.id) ?? {id: row.id, name: row.name ?? '', items: [], seen: new Set()};
        for (const [src, tag] of Object.entries(SOURCES)) for (const t of row[src] ?? []) {
            const text = clip(textOf(t));
            if (!text || entry.seen.has(src + text) || entry.items.length >= 14) continue;
            entry.seen.add(src + text);
            entry.items.push({k: `${tag}${entry.items.length}`, t: text, l: t?.locator ?? row.locator ?? '', src});
        }
        byId.set(row.id, entry);
    }
    return [...byId.values()].filter(e => e.items.length).map(({seen, ...e}) => e).sort((a, b) => a.id < b.id ? -1 : 1);
}

/** Parse an answer file into Map(`${id}\t${k}` -> {role, slug, number, unit, dup}). Later duplicates ignored and counted. */
export function parseAnswer(text) {
    const answers = new Map();
    let ignored = 0, malformed = 0;
    for (const line of text.split('\n')) {
        if (!line.trim()) continue;
        const [id, k, role, slug = '', number = '', unit = ''] = line.split('\t');
        const dup = /^DUP:(\S+)$/.exec(role ?? '')?.[1];
        if (!id || !k || !(ROLES.has(role) || dup) || (['COND', 'BLOCK'].includes(role) && !/^[a-z][a-z0-9_]{1,48}$/.test(slug)) || (number !== '' && !Number.isFinite(Number(number)))) {malformed++; continue;}
        const key = `${id}\t${k}`;
        if (answers.has(key)) {ignored++; continue;}
        answers.set(key, {role: dup ? 'DUP' : role, dup: dup ?? null, slug, number: number === '' ? null : Number(number), unit});
    }
    return {answers, ignored, malformed};
}

/** Typed rows from inputs and answers. Rows keep the cited locator of each item. */
export function typeRows(inputs, answers) {
    const rows = [], missing = [];
    for (const e of inputs) {
        const row = {id: e.id, name: e.name, conditions: [], blockers: [], stated: [], costs: [], notes: 0};
        for (const item of e.items) {
            const a = answers.get(`${e.id}\t${item.k}`);
            if (!a) {missing.push(`${e.id}\t${item.k}`); continue;}
            if (a.role === 'COND') row.conditions.push({label: item.t, fact: `actor.lotm.${a.slug}`, locator: item.l});
            else if (a.role === 'BLOCK') row.blockers.push({label: item.t, fact: `actor.lotm.${a.slug}`, locator: item.l});
            else if (['RANGE', 'DUR', 'COUNT'].includes(a.role)) row.stated.push({kind: a.role.toLowerCase(), value: a.number, unit: a.unit, label: item.t, locator: item.l});
            else if (a.role === 'COST') row.costs.push({label: item.t, value: a.number, unit: a.unit, locator: item.l});
            else row.notes++;
        }
        rows.push(row);
    }
    return {rows, missing};
}

const arg = (args, flag, d) => {const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : d;};
async function main(args) {
    const [cmd] = args;
    const merged = arg(args, '--merged');
    if (cmd === 'prep') {
        const out = arg(args, '--out'), chunk = Number(arg(args, '--chunk', 80)), vols = arg(args, '--volumes', '2,3,4,5,6,7,8').split(',').map(Number);
        mkdirSync(out, {recursive: true});
        const extras = readJsonl(join(merged, 'extras.jsonl'));
        for (const v of vols) {
            const inputs = abilityInputs(extras, v), n = Math.ceil(inputs.length / chunk);
            for (let i = 0; i < n; i++) writeFileSync(join(out, `in_v${v}_k${i + 1}.json`), JSON.stringify(inputs.slice(i * chunk, (i + 1) * chunk)));
            console.log(`v${v}: ${inputs.length} ids, ${inputs.reduce((s, e) => s + e.items.length, 0)} items, ${n} chunks`);
        }
    } else if (cmd === 'ingest') {
        const dir = arg(args, '--in'), v = Number(arg(args, '--volume')), outFile = arg(args, '--out');
        const files = readdirSync(dir).filter(f => new RegExp(`^in_v${v}_k\\d+\\.json$`).test(f)).sort();
        const rows = []; let missing = 0, malformed = 0, absent = [];
        for (const f of files) {
            const ans = f.replace('in_', 'out_').replace('.json', '.tsv');
            if (!existsSync(join(dir, ans))) {absent.push(ans); continue;}
            const parsed = parseAnswer(readFileSync(join(dir, ans), 'utf8'));
            const typed = typeRows(JSON.parse(readFileSync(join(dir, f), 'utf8')), parsed.answers);
            rows.push(...typed.rows); missing += typed.missing.length; malformed += parsed.malformed;
        }
        writeFileSync(outFile, JSON.stringify({volume: v, rows}, null, 1));
        const c = k => rows.reduce((s, r) => s + r[k].length, 0);
        console.log(`v${v}: ${rows.length} typed rows; conditions ${c('conditions')}, blockers ${c('blockers')}, stated ${c('stated')}, costs ${c('costs')}; missing answers ${missing}, malformed lines ${malformed}, chunks without an answer ${absent.length}`);
    } else console.log('usage: ability_typing.mjs prep|ingest ...');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await main(process.argv.slice(2));
