#!/usr/bin/env node
// Coupling map (PC35, packet P1.5). For every W quantity and effect kind: which
// substrate packs write or publish it and which read or hear it, grouped by the
// domain letter of the pack id (`b.brew_steam` is domain b; no prefix is `?`).
//   node scripts/coupling_map.mjs [--json]
// Declarations (`reads`, `writes`, `publishes`, `hears`) come from the pack's own
// object literal. Reads and writes found in the pack's file text but missing from
// its declaration are added and marked `undeclared`. Static and best effort.
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {WORLD_QUANTITIES as Q, WORLD_PROPERTIES as P, WORLD_EFFECT_KINDS as K} from '../src/world_quantities.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rel = p => relative(ROOT, p).split('\\').join('/');
const read = p => readFileSync(p, 'utf8');
const stripComments = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[\s;{}(),])\/\/[^\n]*/g, '$1');
function walk(dir, out = []) {
    for (const name of readdirSync(dir).sort()) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.m?js$/.test(name)) out.push(p);
    }
    return out;
}

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
const splitList = body => {
    const out = []; let depth = 0, cur = '';
    for (const ch of body) {
        if ('([{'.includes(ch)) depth++;
        if (')]}'.includes(ch)) depth--;
        if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur);
    return out;
};
// Array literal after `key:` starting near `from`; spread or computed lists give {expr}.
function arrayAfter(text, key, from, to) {
    const m = new RegExp(`\\b${key}:\\s*`, 'g'); m.lastIndex = from;
    const hit = m.exec(text);
    if (!hit || hit.index > to) return null;
    let i = hit.index + hit[0].length;
    if (text[i] !== '[') return {computed: text.slice(i, i + 60).split(/[,\n]/)[0]};
    let depth = 0, j = i;
    for (; j < text.length; j++) { if (text[j] === '[') depth++; if (text[j] === ']' && --depth === 0) break; }
    return {items: splitList(text.slice(i + 1, j))};
}

const family = name => name.split(':')[0];
const QUANT = new Set(Object.keys(Q)), PROP = new Set(Object.keys(P));

export function discoverPacks() {
    const packs = [];
    for (const file of walk(join(ROOT, 'src'))) {
        const text = stripComments(read(file)), resolve1 = resolver(text);
        const packRe = /\bid:\s*('([a-z])\.([a-z0-9_]+)'|[A-Z][A-Z0-9_]+)\s*,\s*revision:/g;
        const found = [...text.matchAll(packRe)];
        for (const m of found) {
            let id = m[2] ? `${m[2]}.${m[3]}` : resolve1(m[1]);
            if (!id || !/^[a-z]\.[a-z0-9_]+$/.test(id)) continue;
            const end = Math.min(text.length, m.index + 1500);
            if (!/\b(?:laws|reactors|quantities):/.test(text.slice(m.index, end))) continue;
            const decl = {};
            const unresolved = [];
            for (const key of ['reads', 'writes', 'publishes', 'hears']) {
                const arr = arrayAfter(text, key, m.index, end);
                decl[key] = [];
                if (!arr) continue;
                if (arr.computed) {
                    // `names` style: a const array of string literals in the same file; anything else stays unresolved.
                    const lit = text.match(new RegExp(`\\bconst\\s+${arr.computed.trim()}\\s*=\\s*(\\[[^\\n]*\\])`))?.[1];
                    const names = lit ? [...lit.matchAll(/'([^']+)'/g)].map(x => x[1]) : [];
                    if (names.length) decl[key].push(...names); else unresolved.push(`${key}: ${arr.computed}`);
                    continue;
                }
                for (const item of arr.items) {
                    const name = resolve1(item);
                    if (name) decl[key].push(name); else unresolved.push(`${key}: ${item.trim().slice(0, 40)}`);
                }
            }
            packs.push({id, domain: id[0], file: rel(file), decl, unresolved, text, sharedFile: found.length > 1});
        }
    }
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

export function buildMap() {
    const packs = discoverPacks(), main = reachableFrom(join(ROOT, 'src/main.js'));
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
        const typeOf = n => QUANT.has(family(n)) ? 'quantity' : 'property';
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
