#!/usr/bin/env node
// Coupling map (PC35, packet P1.5). For every W quantity and effect kind: which
// substrate packs write or publish it and which read or hear it, grouped by the
// domain letter of the pack id (`b.brew_steam` is domain b; no prefix is `?`).
//   node scripts/coupling_map.mjs [--json]
// Declarations (`reads`, `writes`, `publishes`, `hears`) are read from the packs
// themselves: every pack registered in src/engine_world.js is created and its
// object is read, so a list a pack computes counts the same as one it spells out.
// A pack that needs caller settings is created from SAMPLE_SETTINGS; settings can
// add declarations (a market's goods), so another world passes its own to buildMap.
// Reads and writes found in the pack's file text but missing from its declaration
// are still added and marked `undeclared`; that part is static and best effort.
import {existsSync, readFileSync, statSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {WORLD_QUANTITIES as Q, WORLD_PROPERTIES as P, WORLD_EFFECT_KINDS as K} from '../src/world_quantities.js';
import {ENGINE_PACKS} from '../src/engine_world.js';
import {THERMAL_REVISION} from '../src/craft_process_thermal.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rel = p => relative(ROOT, p).split('\\').join('/');
const read = p => readFileSync(p, 'utf8');
const stripComments = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[\s;{}(),])\/\/[^\n]*/g, '$1');
// Duplicate of the walk in scripts/compression_report.mjs; replace both with scripts/reachable.mjs later.
function reachableFrom(entry) {
    const seen = new Set(), queue = [resolve(entry)];
    const re = /(?:\bfrom\s*|\bimport\s*\(?\s*)['"](\.{1,2}\/[^'"]+)['"]/g;
    while (queue.length) {
        const file = queue.pop();
        if (seen.has(file) || !existsSync(file)) continue;
        seen.add(file);
        for (const m of stripComments(read(file)).matchAll(re)) {
            const target = resolve(dirname(file), m[1]);
            for (const c of [target, `${target}.js`, `${target}.mjs`, join(target, 'index.js')]) {
                if (existsSync(c) && statSync(c).isFile()) { queue.push(c); break; }
            }
        }
    }
    return seen;
}

// Resolve one expression from a declaration list to a name, or null.
function resolver(text) {
    const consts = new Map();
    for (const m of text.matchAll(/\bconst\s+(\w+)\s*=\s*([^;]+);/g)) consts.set(m[1], m[2].trim());
    const objectId = body => body.match(/^\{[^}]*?\bid:\s*'([^']+)'/)?.[1] ?? null;
    const resolveExpr = (expr, depth = 0) => {
        expr = expr.trim();
        if (depth > 4 || !expr) return null;
        let m;
        if ((m = expr.match(/^['"`]([^'"`$]+)['"`]$/))) return m[1];
        if ((m = expr.match(/^(?:Q|WORLD_QUANTITIES)\.(\w+)\.id$/))) return Q[m[1]]?.id ?? null;
        if ((m = expr.match(/^(?:P|WORLD_PROPERTIES)\.(\w+)\.id$/))) return P[m[1]]?.id ?? null;
        if ((m = expr.match(/^(?:K|WORLD_EFFECT_KINDS)\.(\w+)\.id$/))) return K[m[1]]?.id ?? null;
        if ((m = expr.match(/^(\w+)\.id$/)) && consts.has(m[1])) { const v = consts.get(m[1]); return objectId(v) ?? resolveExpr(`${v}.id`, depth + 1); }
        if ((m = expr.match(/^(\w+)\.effect\.kind$/)) && consts.has(m[1])) return consts.get(m[1]).match(/effect:\s*\{\s*kind:\s*'([^']+)'/)?.[1] ?? null;
        if (/^\w+$/.test(expr) && consts.has(expr)) return resolveExpr(consts.get(expr), depth + 1);
        return null;
    };
    return resolveExpr;
}
const family = name => name.split(':')[0];
const QUANT = new Set(Object.keys(Q)), PROP = new Set(Object.keys(P));

// One row per pack that takes settings: the engine world's mixed valley
// (tests/engine_world.test.js). They are sample world numbers for this report.
export const SAMPLE_SETTINGS = Object.freeze({
    'b.brew_steam': {thermalLaw: {revision: THERMAL_REVISION, ambient: 20, extraction: {min: 45, max: 80, seconds: 30}, degradation: {above: 85, seconds: 20}},
        steamPerMinute: 4, humidityFinish: {activeAmount: 100, maxHumidity: 95, dampResiduePercent: 50}},
    'l.shell_regulator': {delay: 2, draft: 9, recharge: 7, closeBelow: 47, openAbove: 60, startleMinutes: 15},
    'g.brew_regulator': {room: 'workshop', outside: 'yard', vent: 'vent'},
    'w.residue_flow': {drains: [{from: 'workshop', to: 'field', reason: 'Gravity carries wash water downhill.'}]},
    'l.living_residue': {plots: [{field: 'field', crop: 'clover', forage: 'stock:clover', concentration: 'uniform-per-deposit', residues: [
        {substance: 'active', quantity: 'residue:active', uptakePermille: 500, intakeReason: 'Trace in an eaten portion passes into tissue.',
            dose: {threshold: 5, amount: 2, kind: 'irritation', reason: 'Five trace units in one meal irritate this grazer.'}}]}]},
    'l.colony_light': {profiles: [{members: 'stock:starlight-firefly', light: 'light:star', gradePerMember: {dark: 12, daylit: 0}}]},
    'l.forage_attraction': {profiles: [{light: 'light:star', minimum: 8, interval: 10}], maxNeighbors: 2, connections: [{from: 'ridge', to: 'hill', open: true}]},
    'm.market': {goods: ['bread'], inputs: ['flour']},
});

// Which file a registered pack comes from: the import of its factory in the registry module.
function packFiles() {
    const registry = join(ROOT, 'src/engine_world.js'), text = stripComments(read(registry)), files = new Map();
    for (const m of text.matchAll(/\bimport\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g))
        for (const name of m[1].split(',')) files.set(name.trim().split(/\s+as\s+/).pop(), rel(resolve(dirname(registry), m[2])));
    return files;
}

export function discoverPacks(settings = SAMPLE_SETTINGS) {
    const files = packFiles(), packs = [];
    for (const entry of ENGINE_PACKS) {
        const file = files.get(entry.create.name) ?? 'src/engine_world.js', unresolved = [];
        const decl = {reads: [], writes: [], publishes: [], hears: []};
        let made = null;
        try { made = entry.create(settings[entry.id]); } catch (error) { unresolved.push(`not created: ${error.message}`); }
        for (const key of Object.keys(decl)) for (const name of made?.[key] ?? []) {
            if (typeof name === 'string') decl[key].push(name); else unresolved.push(`${key}: ${String(name).slice(0, 40)}`);
        }
        packs.push({id: entry.id, domain: entry.domain, file, decl, unresolved, text: stripComments(read(join(ROOT, file))),
            quantities: (made?.quantities ?? []).map(q => q.id), properties: (made?.properties ?? []).map(q => q.id)});
    }
    for (const pack of packs) pack.sharedFile = packs.filter(other => other.file === pack.file).length > 1;
    return packs;
}

// Best-effort static detection of what a pack's file touches without declaring it.
function detect(pack) {
    const resolve1 = resolver(pack.text), reads = new Set(), writes = new Set(), publishes = new Set();
    const known = n => n && (QUANT.has(family(n)) || PROP.has(n));
    for (const m of pack.text.matchAll(/\.(?:amount|has|readQuantity|property)\(\s*[^,()]+,\s*([^,)]+)\)/g)) {
        const n = resolve1(m[1]); if (known(n)) reads.add(n);
    }
    for (const line of pack.text.split('\n')) {
        const m = line.match(/\bquantity:\s*([^,}]+)/);
        if (!m) continue;
        const n = resolve1(m[1]); if (!known(n)) continue;
        if (/\bop:\s*'(?:lt|lte|gt|gte|eq)'/.test(line)) reads.add(n);
        else if (/\bperMinute\b|\bop:\s*'(?:set|add)'/.test(line)) writes.add(n);
    }
    for (const m of pack.text.matchAll(/op:\s*'publish',\s*kind:\s*([^,}]+)/g)) {
        const n = resolve1(m[1]); if (n) publishes.add(n);
    }
    return {reads, writes, publishes};
}

export function buildMap(settings = SAMPLE_SETTINGS) {
    const packs = discoverPacks(settings), main = reachableFrom(join(ROOT, 'src/main.js'));
    // A name is a quantity when the shared vocabulary or any loaded pack declares it as one.
    const quantities = new Set([...QUANT, ...packs.flatMap(p => p.quantities)]);
    const rows = new Map(); // key: `quantity:name` or `effect:name`
    const row = (type, name) => {
        const key = `${type}:${name}`;
        if (!rows.has(key)) rows.set(key, {type, name, writers: new Map(), readers: new Map()});
        return rows.get(key);
    };
    const put = (map, pack, how) => { const prior = map.get(pack.id); map.set(pack.id, {pack: pack.id, domain: pack.domain, how: prior?.how === 'declared' ? 'declared' : how}); };
    const info = [];
    for (const pack of packs) {
        const d = pack.decl, det = pack.sharedFile ? {reads: new Set(), writes: new Set(), publishes: new Set()} : detect(pack);
        const typeOf = n => quantities.has(family(n)) ? 'quantity' : 'property';
        const declaredRead = new Set([...d.reads, ...d.writes]), declaredWrite = new Set(d.writes);
        for (const n of d.writes) put(row(typeOf(n), family(n) === n ? n : family(n)).writers, pack, 'declared');
        for (const n of d.reads) put(row(typeOf(n), family(n)).readers, pack, 'declared');
        for (const n of d.publishes) put(row('effect', n).writers, pack, 'declared');
        for (const n of d.hears) put(row('effect', n).readers, pack, 'declared');
        const undeclared = [];
        for (const n of det.reads) if (!declaredRead.has(n) && ![...declaredRead].some(x => family(x) === family(n))) { put(row(typeOf(n), family(n)).readers, pack, 'undeclared'); undeclared.push(`reads ${n}`); }
        for (const n of det.writes) if (!declaredWrite.has(n) && ![...declaredWrite].some(x => family(x) === family(n))) { put(row(typeOf(n), family(n)).writers, pack, 'undeclared'); undeclared.push(`writes ${n}`); }
        for (const n of det.publishes) if (!d.publishes.includes(n)) { put(row('effect', n).writers, pack, 'undeclared'); undeclared.push(`publishes ${n}`); }
        info.push({pack: pack.id, domain: pack.domain, file: pack.file, reachableFromMain: main.has(join(ROOT, pack.file)),
            undeclared, unresolved: pack.unresolved, sharedFile: pack.sharedFile});
    }
    const list = [...rows.values()].map(r => ({type: r.type, name: r.name, writers: [...r.writers.values()], readers: [...r.readers.values()]}))
        .sort((a, b) => (a.type + a.name).localeCompare(b.type + b.name));
    const crossDomain = r => r.writers.some(w => r.readers.some(x => x.domain !== w.domain));
    // A pack's own read of what it writes is not a reader for the unread-writes list.
    const readByOther = r => r.writers.some(w => r.readers.some(x => x.pack !== w.pack));
    return {
        packs: info,
        couplings: list.filter(crossDomain),
        writesNothingReads: list.filter(r => r.writers.length && !readByOther(r)),
        readsNothingWrites: list.filter(r => r.readers.length && !r.writers.length),
    };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const map = buildMap();
    if (process.argv.includes('--json')) { console.log(JSON.stringify(map, null, 2)); process.exit(0); }
    const tag = a => `${a.pack}${a.how === 'undeclared' ? ' (undeclared)' : ''}`;
    const show = (title, rows) => {
        console.log(`\n${title} (${rows.length})`);
        for (const r of rows) console.log(`  ${r.type} ${r.name}: writes [${r.writers.map(tag).join(', ') || '-'}] reads [${r.readers.map(tag).join(', ') || '-'}]`);
    };
    console.log(`Coupling map (PC35): ${map.packs.length} packs`);
    for (const p of map.packs) console.log(`  ${p.pack} [${p.domain === '?' ? '?' : p.domain}] ${p.file} ${p.reachableFromMain ? 'reachable' : 'NOT reachable'} from src/main.js` +
        `${p.undeclared.length ? `; undeclared: ${p.undeclared.join(', ')}` : ''}${p.unresolved.length ? `; unresolved: ${p.unresolved.join(', ')}` : ''}${p.sharedFile ? '; shared file, no detection' : ''}`);
    show('Couplings across domains', map.couplings);
    show('Writes nothing reads', map.writesNothingReads);
    show('Reads nothing writes', map.readsNothingWrites);
}
