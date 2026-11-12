#!/usr/bin/env node
// Compression ledger (PC12, packet P1.3). Counts rows C1-C6 from the tree.
//   node scripts/compression_report.mjs                  print table and comparison, exit 0
//   node scripts/compression_report.mjs --write-baseline write scripts/compression_baseline.json
//   node scripts/compression_report.mjs --check          exit 1 when a row moved the wrong way
// C1-C5 may only fall; C6 may only rise. Counts read file contents (call sites,
// imports), never file names alone, except C2 which is a file count by design.
import {existsSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// --baseline <path> reads another baseline file, so a test never rewrites the tracked one.
const baselineArg = process.argv.indexOf('--baseline');
const BASELINE = baselineArg > 0 ? process.argv[baselineArg + 1] : join(ROOT, 'scripts/compression_baseline.json');
const rel = p => relative(ROOT, p).split('\\').join('/');

function walk(dir, out = []) {
    for (const name of readdirSync(dir).sort()) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.(m?js)$/.test(name)) out.push(p);
    }
    return out;
}
const read = p => readFileSync(p, 'utf8');
// Drop comments so a mention in prose is not a call site. Line comments only
// count when they start at a token boundary, so "http://" in a string survives.
const stripComments = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[\s;{}(),])\/\/[^\n]*/g, '$1');

// TODO: replace this walk with scripts/reachable.mjs once that module lands.
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

export function measure() {
    const srcFiles = walk(join(ROOT, 'src'));
    const text = new Map(srcFiles.map(f => [f, stripComments(read(f))]));
    const reachable = reachableFrom(join(ROOT, 'src/main.js'));

    // C1: call sites in file contents.
    const callers = name => {
        const def = new RegExp(`(?:function\\s*\\*?\\s*|(?:const|let|var)\\s+)${name}\\b`);
        const call = new RegExp(`(?<![\\w$.])${name}\\s*\\(`, 'g');
        const defs = [], calling = [];
        for (const [f, s] of text) {
            if (def.test(s)) defs.push(rel(f));
            const uses = [...s.matchAll(call)].filter(m => !/(?:function\s*\*?\s*)$/.test(s.slice(Math.max(0, m.index - 20), m.index)));
            if (uses.length && !def.test(s)) calling.push(rel(f));
        }
        return {defs, calling};
    };
    const gu = callers('resolveGuActivation'), step = callers('runGuStep');
    const C1 = {value: gu.calling.length, definition: gu.defs, reachable: gu.calling.filter(f => reachable.has(join(ROOT, f))).length,
        runGuStepFiles: step.calling.length, runGuStepDefinition: step.defs};

    // C2: module counts.
    const names = dir => readdirSync(join(ROOT, dir)).filter(n => n.endsWith('.js'));
    const keeper = names('src').filter(n => /^gu_keeper/.test(n)), book = names('src/world_packs').filter(n => /^book_gu_keeper/.test(n));
    const C2 = {value: keeper.length + book.length, keeper: keeper.length, bookKeeper: book.length};

    // C3: parallel working shapes still imported.
    const shapes = ['craft_working', 'spell_working', 'creature_methods', 'gu_procedures', 'method_program'];
    const imports = {};
    for (const shape of shapes) {
        const self = join(ROOT, 'src', `${shape}.js`);
        const re = new RegExp(`(?:from\\s*|import\\s*\\(?\\s*)['"][^'"]*\\/${shape}(?:\\.js)?['"]`);
        imports[shape] = [...text].filter(([f, s]) => f !== self && re.test(s)).map(([f]) => rel(f));
    }
    const C3 = {value: shapes.filter(s => imports[s].length > 0).length, importers: Object.fromEntries(shapes.map(s => [s, imports[s].length]))};

    // C4: vocabularies still emitted.
    const count = (file, re) => existsSync(join(ROOT, file)) ? (stripComments(read(join(ROOT, file))).match(re) ?? []).length : 0;
    const wOpFiles = [...text].filter(([, s]) => /\bop:\s*'(?:set|add|publish|state|move|property)'/.test(s)).length;
    const evidence = {
        guFamilyEffects: count('src/gu_catalogue.js', /effect:\s*\{\s*kind:/g) + count('src/gu_working_law.js', /\bkind:\s*['`]/g),
        spellLabels: count('src/spell_law.js', /['"`]spell\.[a-z$]/g),
        wOps: wOpFiles,
        pSentences: ['src/effect_grammar.js', 'src/spell_grammar.js', 'src/world_effects.js'].reduce((n, f) => n + count(f, /\bsentence/gi), 0),
    };
    const C4 = {value: Object.values(evidence).filter(n => n > 0).length, evidence};

    // C5: world grammars and labellers living in tests/fixtures.
    const fx = read(join(ROOT, 'tests/fixtures/procedural_grammar/effect_worlds.mjs'));
    const grammars = [...fx.matchAll(/^export const (\w+)\s*=\s*(?:define\w*|withIdentity)\(/gm)].map(m => m[1]);
    const labellers = [...fx.matchAll(/^export function (label\w+)/gm)].map(m => m[1]);
    const C5 = {value: grammars.length + labellers.length, grammars, labellers};

    // C6: P, W-effects and K-search modules reachable from src/main.js.
    const mods = ['procedural_grammar', 'effect_grammar', 'effect_checks', 'world_effects', 'grammar_search', 'kernel_search', 'spell_grammar'];
    const C6 = {value: mods.filter(m => reachable.has(join(ROOT, 'src', `${m}.js`))).length, of: mods.length,
        reachable: mods.filter(m => reachable.has(join(ROOT, 'src', `${m}.js`)))};
    return {C1, C2, C3, C4, C5, C6};
}

const HAND = {C1: 37, C2: 65, C3: 5, C4: 4, C5: 2, C6: 0};
const values = r => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v.value]));

export function compare(now, base) {
    const bad = [];
    for (const k of ['C1', 'C2', 'C3', 'C4', 'C5']) if (now[k] > base[k]) bad.push(`${k} rose from ${base[k]} to ${now[k]}`);
    if (now.C6 < base.C6) bad.push(`C6 fell from ${base.C6} to ${now.C6}`);
    return bad;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const argv = process.argv.slice(2), r = measure(), now = values(r);
    const base = existsSync(BASELINE) ? JSON.parse(read(BASELINE)).values : null;
    if (argv.includes('--write-baseline')) {
        writeFileSync(BASELINE, `${JSON.stringify({note: 'PC12 compression baseline. C1-C5 may only fall, C6 may only rise. Rewrite with --write-baseline.', values: now}, null, 2)}\n`);
        console.log(`Wrote ${rel(BASELINE)}`);
    }
    const row = (k, label, detail) => console.log(`${k}  ${String(now[k]).padStart(3)}${k === 'C6' ? ` of ${r.C6.of}` : '     '}  base ${base ? String(base[k]).padStart(3) : '  -'}  hand ${HAND[k]}  ${label}  ${detail}`);
    console.log('Compression ledger (PC12)');
    row('C1', 'files calling resolveGuActivation(', `(def: ${r.C1.definition.join(', ') || 'none'}; ${r.C1.reachable} reachable from main; ${r.C1.runGuStepFiles} files call runGuStep()`);
    row('C2', 'gu_keeper modules', `(${r.C2.keeper} src + ${r.C2.bookKeeper} world_packs)`);
    row('C3', 'parallel working shapes with importers', `(${Object.entries(r.C3.importers).map(([s, n]) => `${s} ${n}`).join(', ')})`);
    row('C4', 'effect vocabularies in use', `(evidence ${Object.entries(r.C4.evidence).map(([s, n]) => `${s}=${n}`).join(', ')})`);
    row('C5', 'fixture world grammars and labellers', `(${[...r.C5.grammars, ...r.C5.labellers].join(', ')})`);
    row('C6', 'P/W-effects/K-search modules reachable', `(${r.C6.reachable.join(', ') || 'none'})`);
    const bad = base ? compare(now, base) : [];
    console.log(base ? (bad.length ? `Moved the wrong way: ${bad.join('; ')}` : 'Baseline holds.') : 'No baseline file; run --write-baseline.');
    if (argv.includes('--check') && bad.length) process.exit(1);
}
