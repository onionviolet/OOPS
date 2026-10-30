// Volume 1 consumer proxies over merged read rows. No source prose is emitted.
// node scripts/lead_run/coverage_ledger.mjs [--merged dir] [--game file|dir ...] [--out json] [--summary]
// node scripts/lead_run/coverage_ledger.mjs --volumes all [--merged dir] [--out json]   (per-volume counts, ids new in each volume)
import {readFileSync, writeFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const DEFAULT_MERGED = 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged';
const volumeOne = shard => !/^lotm[2-8]c\d+m?$/.test(shard);
export const volumeOf = shard => Number(/^lotm([2-8])c\d+m?$/.exec(shard)?.[1] ?? 1);
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const stated = value => typeof value === 'string' && value.trim() !== '' && !/^(?:unstated|not stated)$/i.test(value.trim());

/** Pure projection: counts and ranked missing metadata, never row prose. */
export function buildLedger({registry = [], extras = [], scenes = [], corpus = ''}) {
    const text = Array.isArray(corpus) ? corpus.join('\n') : corpus;
    const ids = new Set(text.match(/(?<![a-z0-9._-])lotm\.[a-z0-9_]+\.[a-z0-9._-]*[a-z0-9](?![a-z0-9._-])/g) || []);
    const beats = new Set(text.match(/lr\.lotm\.[a-z0-9_]+\.\d+/g) || []);
    const locators = new Set(text.match(/zh 第\d+章 p\d+/g) || []);
    const counts = {}, missing = {};
    const ensure = kind => { counts[kind] ||= {total: 0, consumed: 0, missing: 0}; missing[kind] ||= []; };
    for (const kind of ['people', 'places', 'routines', 'services', 'prices', 'dated events', 'customs', 'opening hours', 'people_other']) ensure(kind);
    counts.services.priced = 0;
    const add = (kind, row, consumed, entity = false) => {
        ensure(kind);
        counts[kind].total++;
        counts[kind][consumed ? 'consumed' : 'missing']++;
        if (consumed) return;
        const rows = entity ? (row.rows ?? 1) : 1, touchedByLead = !!row.touchedByLead;
        missing[kind].push({id: row.id ?? row.beat ?? null, locator: row.locator ?? row.firstMention ?? null,
            shard: row.shard ?? row.shards?.find(volumeOne) ?? null, rows, touchedByLead,
            score: (touchedByLead ? 3 : 0) + Math.log2((1 + rows) || 1) + (row.label === 'S' ? 1 : row.label === 'T' ? 0.5 : 0)});
    };
    for (const row of registry) {
        if (!row.shards?.some(volumeOne)) continue;
        const kind = row.kind === 'person' ? 'people' : ['place', 'organization'].includes(row.kind) ? 'places' : row.kind === 'price' ? 'prices' : null;
        if (kind) add(kind, row, ids.has(row.id), true);
    }
    const routines = new Set();
    for (const row of extras) {
        if (!volumeOne(row.shard)) continue;
        if (row.extra === 'people') {
            for (const routine of row.routine || []) {
                const key = JSON.stringify([row.id, routine.locator ?? null]);
                if (routines.has(key)) continue;
                routines.add(key);
                add('routines', {...row, ...routine, id: row.id}, locators.has(routine.locator));
            }
        } else if (row.extra === 'rules') {
            add(`rules.${row.kind || 'other'}`, row, ids.has(row.id) || locators.has(row.locator) || (row.steps || []).some(step => locators.has(step.locator)));
        } else if (row.extra === 'services') {
            add('services', row, locators.has(row.locator));
            if (stated(row.price)) counts.services.priced++;
        } else if (row.extra === 'news') {
            add('dated events', row, locators.has(row.locator));
        } else if (row.extra === 'places') {
            if (stated(row.hours)) add('opening hours', row, locators.has(row.locator));
        } else if (row.extra) {
            add(row.extra, row, locators.has(row.locator));
        }
    }
    for (const row of scenes) {
        if (volumeOne(row.shard) && (stated(row.date?.value) || row.dateRef?.absolute != null)) {
            // A scene has no independent locator proxy: only its beat id counts.
            add('dated events', {beat: row.beat, shard: row.shard, label: row.label, touchedByLead: row.touchedByLead}, beats.has(row.beat));
        }
    }
    for (const rows of Object.values(missing)) rows.sort((a, b) => b.score - a.score || compare(a.id ?? '', b.id ?? '') || compare(a.locator ?? '', b.locator ?? '') || compare(a.shard ?? '', b.shard ?? ''));
    const sorted = obj => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => compare(a, b)));
    return {generatedFrom: {volume: 1, consumerProxy: 'whole id token or volume 1 locator'}, counts: sorted(counts), missing: sorted(missing)};
}

/** Per-volume mechanism-grain counts. Ids only; never row prose. A row's volume comes from its shard; an id is new in the lowest volume that holds it. */
export function buildVolumeLedger({registry = [], extras = []}) {
    const bump = (obj, key, n = 1) => { obj[key] = (obj[key] || 0) + n; };
    const volumes = {};
    const vol = n => volumes[n] ||= {extras: {}, rules: {}, registry: {}, newIds: {}, newIdList: {}};
    const firstSeen = new Map();
    const note = (id, kind, n) => {
        if (!id || (firstSeen.has(id) && firstSeen.get(id).n <= n)) return;
        firstSeen.set(id, {n, kind});
    };
    for (const row of registry) {
        const ns = (row.shards || []).map(volumeOf);
        for (const n of new Set(ns)) bump(vol(n).registry, row.kind || 'other');
        if (ns.length) note(row.id, row.kind || 'other', Math.min(...ns));
    }
    for (const row of extras) {
        const n = volumeOf(row.shard), v = vol(n);
        bump(v.extras, row.extra || 'other');
        if (row.extra === 'rules') {
            bump(v.rules, row.kind || 'other');
            note(row.id, 'rules.' + (row.kind || 'other'), n);
        }
    }
    for (const [id, {n, kind}] of firstSeen) { bump(vol(n).newIds, kind); (vol(n).newIdList[kind] ||= []).push(id); }
    const sorted = obj => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => compare(a, b)));
    return {volumes: sorted(Object.fromEntries(Object.entries(volumes).map(([n, v]) =>
        [n, {extras: sorted(v.extras), rules: sorted(v.rules), registry: sorted(v.registry), newIds: sorted(v.newIds),
            newIdList: sorted(Object.fromEntries(Object.entries(v.newIdList).map(([k, ids]) => [k, ids.sort(compare)])))}])))};
}

const readJsonl = path => readFileSync(path, 'utf8').split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
const filesAt = path => statSync(path).isDirectory()
    ? readdirSync(path, {withFileTypes: true}).sort((a, b) => compare(a.name, b.name)).flatMap(entry => entry.isSymbolicLink() ? [] : filesAt(join(path, entry.name))) : [path];

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    try {
        const args = process.argv.slice(2), game = [];
        let merged = DEFAULT_MERGED, out, volumes;
        for (let i = 0; i < args.length; i++) {
            const flag = args[i];
            if (flag === '--summary') continue;
            if (!['--merged', '--game', '--out', '--volumes'].includes(flag) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Invalid argument: ${flag}`);
            const value = args[++i];
            if (flag === '--merged') merged = value;
            else if (flag === '--out') out = value;
            else if (flag === '--volumes') { if (value !== 'all') throw new Error(`Invalid --volumes: ${value}`); volumes = value; }
            else game.push(value);
        }
        if (volumes) {
            const result = buildVolumeLedger({registry: readJsonl(join(merged, 'registry.jsonl')), extras: readJsonl(join(merged, 'extras.jsonl'))});
            if (out) writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
            for (const [n, v] of Object.entries(result.volumes)) {
                const line = obj => Object.entries(obj).map(([k, c]) => `${k} ${c}`).join(', ');
                console.log(`volume ${n}\n  extras: ${line(v.extras)}\n  rules: ${line(v.rules)}\n  registry: ${line(v.registry)}\n  new ids: ${line(v.newIds)}`);
            }
            process.exit(0);
        }
        const defaults = ['private_packs/lotm-cast/cast.json', 'private_packs/lotm-ingredients/ingredients.json',
            ...readdirSync('src').filter(name => /^book_world_lotm_.*\.js$/.test(name)).sort().map(name => join('src', name)),
            ...readdirSync('src').filter(name => /^lotm_.*_rows\.js$/.test(name)).sort().map(name => join('src', name)), 'src/cast_schedule.js'];
        const gameFiles = [...new Set((game.length ? game : defaults).flatMap(filesAt))];
        const ledger = buildLedger({registry: readJsonl(join(merged, 'registry.jsonl')), extras: readJsonl(join(merged, 'extras.jsonl')),
            scenes: readJsonl(join(merged, 'scenes.jsonl')), corpus: gameFiles.map(path => readFileSync(path, 'utf8'))});
        ledger.generatedFrom = {...ledger.generatedFrom, merged, game: gameFiles};
        if (out) writeFileSync(out, JSON.stringify(ledger, null, 2) + '\n');
        console.log('kind                 total consumed     pct');
        for (const [kind, count] of Object.entries(ledger.counts)) {
            const pct = count.total ? (100 * count.consumed / count.total).toFixed(1) : '0.0';
            console.log(`${kind.padEnd(20)} ${String(count.total).padStart(5)} ${String(count.consumed).padStart(8)} ${pct.padStart(6)}%`);
        }
        console.log(`services with stated price: ${ledger.counts.services.priced}`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
