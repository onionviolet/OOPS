#!/usr/bin/env node
// npm run test:changed: run only the test files a change can reach (FRC69).
// Usage: node scripts/test_changed.mjs [--base <ref>] [--files a,b] [--list] [--json] [--slow]
// Changed files = committed since the merge base with --base (default master) plus
// staged, unstaged and untracked edits. A test file is selected when
//   1. it is a changed test file itself,
//   2. it imports a changed file, directly or through other imports (esbuild parse,
//      the same parser check_architecture uses), or
//   3. a file in its import closure names a changed file by path (fs reads of
//      fixtures, src/main.js, docs, styles), or
//   4. it walks whole folders (readdir, globSync, cpSync) and a game file changed
//      (anything outside docs, scripts, tests, tools, desktop-tauri and prototypes).
// Named paths (loadNative('./src/x.js'), new URL('../build.js')) count as imports.
// Docs-only changes run the doc checks (check:rules, check:docs) plus any test that
// names a changed doc. package.json, the lockfile and node_modules run the full suite.
// The run goes through scripts/slot_run.mjs; the full suite stays the merge gate (AD36).
import {spawnSync, execFileSync} from 'node:child_process';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {importSpecs} from './check_architecture.mjs';
import {loadBudget} from './test_budget_reporter.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CODE = /\.(m|c)?js$/;
// A test that walks folders can see any game file; builds are followed through named paths.
const TREE_READER = /\breaddir(Sync)?\b|\bglobSync\b|\bcpSync\b/;
const FULL_SUITE_TRIGGERS = [/^package(-lock)?\.json$/, /^node_modules\//];

export function isDoc(file) {
    return file.startsWith('docs/') && !CODE.test(file) || /\.md$/i.test(file);
}

export function suiteFiles(dir = path.join(root, 'tests')) {
    return readdirSync(dir).filter(f => f.endsWith('.test.js')).sort().map(f => `tests/${f}`);
}

function git(args) {
    return execFileSync('git', args, {cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024}).split('\n').filter(Boolean);
}

export function changedFiles(base = 'master') {
    let since = [];
    try {
        const mb = git(['merge-base', base, 'HEAD'])[0];
        since = git(['diff', '--name-only', `${mb}...HEAD`]);
    } catch { /* no such base: working-tree changes only */ }
    return [...new Set([...since, ...git(['diff', '--name-only', 'HEAD']), ...git(['diff', '--name-only', '--cached']),
        ...git(['ls-files', '--others', '--exclude-standard'])])].sort();
}

// Import closure from the test files outward. Only files tests reach are parsed.
export async function reachGraph(tests, {cwd = root} = {}) {
    const graph = new Map(), unparsed = [];
    let frontier = tests.filter(f => existsSync(path.join(cwd, f)));
    const parse = async files => {
        try { return await importSpecs(files); } catch {
            if (files.length === 1) { unparsed.push(files[0]); return new Map([[files[0], []]]); }
            const mid = Math.ceil(files.length / 2);
            return new Map([...await parse(files.slice(0, mid)), ...await parse(files.slice(mid))]);
        }
    };
    const prev = process.cwd();
    process.chdir(cwd);
    try {
        while (frontier.length) {
            const specs = await parse(frontier);
            const next = new Set();
            for (const file of frontier) {
                const edges = [];
                for (const spec of specs.get(file) || []) {
                    if (!spec.startsWith('.')) continue;
                    const target = path.normalize(path.join(path.dirname(file), spec));
                    if (target.startsWith('..') || target.startsWith('node_modules/')) continue;
                    edges.push(target);
                    if (!graph.has(target) && !next.has(target) && CODE.test(target) && existsSync(target)) next.add(target);
                }
                // Named paths are edges too: loadNative('./src/x.js'), new URL('../src/main.js'), fixtures.
                for (const target of namedPaths(file)) if (!edges.includes(target)) {
                    edges.push(target);
                    if (!graph.has(target) && CODE.test(target)) next.add(target);
                }
                graph.set(file, edges);
            }
            for (const f of next) if (graph.has(f)) next.delete(f);
            frontier = [...next];
        }
    } finally { process.chdir(prev); }
    return {graph, unparsed};
}

// Comments name files without reading them (\"see styles/figure.css\"). Crude strip: a // after
// a colon or quote is kept so URLs and strings survive.
export function stripComments(text) {
    return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');
}

const PATH_LITERAL = /['"`]([^'"`\s$]*[\w-]+\.(?:m?js|cjs|json|css|md|html|ink|txt|jsonl))['"`]/g;
function namedPaths(file) {
    let text = '';
    try { text = stripComments(readFileSync(file, 'utf8')); } catch { return []; }
    const out = new Set();
    for (const [, lit] of text.matchAll(PATH_LITERAL)) {
        if (!lit.includes('/')) continue;
        for (const cand of [path.normalize(path.join(path.dirname(file), lit)), path.normalize(lit.replace(/^(\.\.?\/)+/, ''))])
            if (!cand.startsWith('..') && !cand.startsWith('node_modules/') && cand !== file && existsSync(cand)) { out.add(cand); break; }
    }
    return [...out];
}

function closureOf(start, graph, cache) {
    if (cache.has(start)) return cache.get(start);
    const seen = new Set(), stack = [start];
    while (stack.length) {
        const f = stack.pop();
        if (seen.has(f)) continue;
        seen.add(f);
        for (const n of graph.get(f) || []) stack.push(n);
    }
    cache.set(start, seen);
    return seen;
}

// Paths a file could use to name `target`: repo-relative, and relative to the file's folder.
function namesFor(file, target) {
    const rel = path.relative(path.dirname(file), target);
    return [...new Set([target, rel.replace(/^(\.\.\/)+/, '')].filter(n => n.includes('/') || n.includes('.')))];
}

// A whole path token: items.js is not named by combat_items.js or items.json.
function mentions(text, name) {
    for (let i = text.indexOf(name); i !== -1; i = text.indexOf(name, i + 1)) {
        const before = text[i - 1], after = text[i + name.length];
        if ((i === 0 || /[\s'"`(/]/.test(before)) && (after === undefined || !/[\w.-]/.test(after))) return true;
    }
    return false;
}

// Slow tier: a known dependency still selects a play-length test. Defer broad
// folder-walker matches to the full suite unless --slow is requested.
export function selectTests({changed, tests, graph, readText, slow = new Set()}) {
    const why = new Map(), add = (t, reason) => { if (!why.has(t)) why.set(t, []); why.get(t).push(reason); };
    const full = changed.filter(f => FULL_SUITE_TRIGGERS.some(re => re.test(f)));
    if (full.length) return {mode: 'full', why: new Map(tests.map(t => [t, [`${full[0]} changes every test`]])), docsOnly: false};
    const docsOnly = changed.length > 0 && changed.every(isDoc);
    // Folder readers and game builds see the game tree, not tooling, tests or docs.
    const nonDoc = changed.filter(f => !isDoc(f) && !/^(scripts|tests|tools|docs|desktop-tauri|prototypes|\.claude)\//.test(f));
    const changedSet = new Set(changed), cache = new Map(), texts = new Map();
    const text = f => { if (!texts.has(f)) texts.set(f, CODE.test(f) ? stripComments(readText(f) ?? '') : ''); return texts.get(f); };
    const namedBy = new Map();
    const named = f => {
        if (!namedBy.has(f)) namedBy.set(f, CODE.test(f) ? changed.filter(c => c !== f && namesFor(f, c).some(n => mentions(text(f), n))) : []);
        return namedBy.get(f);
    };
    for (const t of tests) {
        const closure = closureOf(t, graph, cache);
        if (changedSet.has(t)) add(t, 'changed test file');
        const done = new Set([t]);
        for (const c of changed) if (c !== t && closure.has(c)) { done.add(c); add(t, (graph.get(t) || []).includes(c) ? `imports or names ${c}` : `reaches ${c} through its imports`); }
        for (const f of closure) for (const c of named(f)) {
            if (done.has(c)) continue;
            done.add(c);
            add(t, `${f === t ? 'names' : `${f} names`} ${c}`);
        }
        if (nonDoc.length && !why.has(t)) {
            const reader = [...closure].find(f => f.startsWith('tests/') && TREE_READER.test(text(f)));
            if (reader) add(t, `walks folders (${reader === t ? 'this file' : reader}); ${nonDoc[0]}${nonDoc.length > 1 ? ` and ${nonDoc.length - 1} more` : ''} changed`);
        }
    }
    const deferred = new Map();
    for (const t of slow) {
        const reasons = why.get(t);
        if (!reasons?.every(r => r.startsWith('walks folders ('))) continue;
        deferred.set(t, reasons);
        why.delete(t);
    }
    return {mode: 'changed', why, docsOnly, deferred};
}

export function slowTier(budget) {
    return new Set(Object.entries(budget?.files || {}).filter(([, v]) => v.tier === 'slow').map(([f]) => f));
}

// A selection of at most a tenth of the suite may take the second heavy slot beside a full
// suite; anything larger queues for npm test's single slot, as the limiter intends.
export const smallSelection = (selected, total) => selected <= Math.max(1, Math.floor(total / 10));

function slotRun(command, {small = false} = {}) {
    const slots = small ? '2' : '1';
    console.log(`test:changed: ${small ? 'small selection, may use the second heavy slot' : 'large selection, queues for the single suite slot'}`);
    const r = spawnSync(process.execPath, [path.join(root, 'scripts/slot_run.mjs'), '--kind', 'suite', '--slots', slots,
        '--max-load', '12', '--load-wait', '300', '--', ...command], {cwd: root, stdio: 'inherit'});
    return r.status ?? 1;
}

async function main(argv) {
    const opt = {base: 'master', files: null, list: false, json: false, slow: false};
    for (let i = 0; i < argv.length; i += 1) {
        if (argv[i] === '--base') opt.base = argv[++i];
        else if (argv[i] === '--files') opt.files = argv[++i].split(',').filter(Boolean);
        else if (argv[i] === '--list') opt.list = true;
        else if (argv[i] === '--json') opt.json = true;
        else if (argv[i] === '--slow') opt.slow = true;
        else { console.error(`test_changed: unknown argument ${argv[i]}`); return 2; }
    }
    const changed = opt.files ?? changedFiles(opt.base);
    const tests = suiteFiles();
    const {graph, unparsed} = await reachGraph(tests);
    const readText = f => { try { return readFileSync(path.join(root, f), 'utf8'); } catch { return null; } };
    const slow = opt.slow ? new Set() : slowTier(loadBudget(path.join(root, 'tests/duration_budget.json')));
    const {mode, why, docsOnly, deferred = new Map()} = selectTests({changed, tests, graph, readText, slow});
    const selected = [...why.keys()].sort();
    if (opt.json) { console.log(JSON.stringify({changed, mode, docsOnly, unparsed, selected: Object.fromEntries(selected.map(t => [t, why.get(t)])), deferred: Object.fromEntries(deferred)}, null, 1)); return 0; }
    console.log(`test:changed: ${changed.length} changed file(s) since merge base with ${opt.base}${changed.length ? ':' : ''}`);
    for (const c of changed.slice(0, 30)) console.log(`  ${c}`);
    if (changed.length > 30) console.log(`  ... and ${changed.length - 30} more`);
    if (unparsed.length) console.log(`test:changed: could not parse ${unparsed.join(', ')}; their imports are not followed`);
    if (mode === 'full') console.log(`test:changed: ${why.get(tests[0])[0]}; running the full suite`);
    else {
        console.log(`test:changed: ${selected.length} of ${tests.length} test files selected${docsOnly ? ' (docs-only change: doc checks plus tests that name a changed doc)' : ''}`);
        for (const t of selected) console.log(`  ${t}: ${why.get(t).slice(0, 3).join('; ')}${why.get(t).length > 3 ? `; +${why.get(t).length - 3} more` : ''}`);
        if (deferred.size) console.log(`test:changed: ${deferred.size} slow-tier folder-walker match(es) left to the merge batch (--slow runs them): ${[...deferred.keys()].map(f => path.basename(f, '.test.js')).join(', ')}`);
    }
    if (opt.list) return 0;
    let status = 0;
    if (docsOnly) {
        for (const script of ['check:rules', 'check:docs']) {
            console.log(`test:changed: npm run ${script}`);
            const r = spawnSync('npm', ['run', '-s', script], {cwd: root, stdio: 'inherit'});
            status ||= r.status ?? 1;
        }
    }
    const run = ['node', '--test', '--test-concurrency=4', '--test-reporter=spec', '--test-reporter-destination=stdout',
        '--test-reporter=./scripts/test_budget_reporter.mjs', '--test-reporter-destination=stderr'];
    if (mode === 'full') return slotRun([...run, ...tests]) || status;
    if (!selected.length) { console.log('test:changed: no test file reaches these changes'); return status; }
    return slotRun([...run, ...selected], {small: smallSelection(selected.length, tests.length)}) || status;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = await main(process.argv.slice(2));
