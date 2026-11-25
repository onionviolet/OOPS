#!/usr/bin/env node
// Atlas ladder receipts. Manifest in a play test's leading comments:
//   // @ladder {"keys":["gu_kinds:vitality-leaf"],"scope":"workshop demo",
//   // @ladder  "route":"capability-run","checks":{"saveReload":true,"exportImport":true,"browser":false},
//   // @ladder  "watch":["src/world_packs/effects_workshop.js"]}
// One JSON object may span consecutive @ladder lines. A passing test proves only declared checks.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {DEFAULT_ENTRY, importsOf, walkFrom, srcFiles} from './reachable.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = 'docs/coverage/evidence/ladder';
const rel = file => path.relative(ROOT, file).split(path.sep).join('/');
const sha1 = bytes => crypto.createHash('sha1').update(bytes).digest('hex');
const hashFile = (file, root = ROOT) => sha1(fs.readFileSync(path.resolve(root, file)));
const now = () => new Date().toISOString();
function tree(root = ROOT) {
    const git = args => spawnSync('git', args, {cwd: root, encoding: 'utf8'}).stdout.trim();
    return {commit: git(['rev-parse', 'HEAD']), dirty: Boolean(git(['status', '--porcelain']))};
}
function write(name, value, root = ROOT) {
    const dir = path.join(root, OUT);
    fs.mkdirSync(dir, {recursive: true});
    fs.writeFileSync(path.join(dir, name), JSON.stringify(value, null, 2) + '\n');
}
export function receiptState(receipt, root = ROOT) {
    return Object.entries(receipt.watch ?? {}).every(([file, hash]) => {
        const full = path.resolve(root, file);
        return full.startsWith(root + path.sep) && fs.existsSync(full) && hashFile(file, root) === hash;
    }) ? 'current' : 'stale';
}
export function ledgerRows(root = ROOT) {
    const dir = path.join(root, 'docs/coverage');
    const rows = [];
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl') && !['worlds.jsonl', 'interaction_oracle.jsonl'].includes(f)).sort()) {
        const ledger = file.slice(0, -6), lines = fs.readFileSync(path.join(dir, file), 'utf8').split('\n');
        lines.forEach(line => { if (line.trim()) { const row = JSON.parse(line); rows.push({key: `${ledger}:${row.id}`, row, line, ledgerFile: `docs/coverage/${file}`}); } });
    }
    return rows;
}
export function rowReach(row, modules) {
    if (!row.case?.module) return {status: 'no case module'};
    return modules[row.case.module] ?? {status: 'not recorded here'};
}
function resolved(from, spec) {
    if (!spec.startsWith('.')) return null;
    const base = path.resolve(path.dirname(from), spec);
    return [base, `${base}.js`, `${base}.mjs`, path.join(base, 'index.js')]
        .find(f => fs.existsSync(f) && fs.statSync(f).isFile()) ?? null;
}
// Shortest static-import path, independently reconstructed from importsOf.
export function importChains(entry, targets) {
    const queue = [path.resolve(entry)], parent = new Map([[path.resolve(entry), null]]);
    for (let i = 0; i < queue.length; i++) {
        const file = queue[i];
        for (const spec of importsOf(fs.readFileSync(file, 'utf8')).specs) {
            const next = resolved(file, spec);
            if (next && !parent.has(next)) { parent.set(next, file); queue.push(next); }
        }
    }
    const out = {};
    for (const target of targets) {
        const full = path.resolve(target);
        if (!parent.has(full)) { out[full] = null; continue; }
        const chain = [];
        for (let at = full; at; at = parent.get(at)) chain.unshift(at);
        out[full] = chain;
    }
    return out;
}
export function consumerCallsCase(chain, caseId, root = ROOT, {singleRow = false} = {}) {
    if (!chain) return false;
    // A static signal only. False means the chain contains no direct call; true does not prove play.
    // For a module that serves exactly one row, the direct importer calling a function it imports from it counts (the Lotus
    // workshop act calls lotusLanding). A shared module (the Gu grammar serves 16 rows) never counts this way: calling the
    // grammar is not calling any one row's case.
    if (singleRow && chain.length >= 2) {
        const importer = path.resolve(root, chain.at(-2)), target = path.resolve(root, chain.at(-1));
        const source = fs.readFileSync(importer, 'utf8');
        for (const m of source.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g)) {
            if (resolved(importer, m[2]) !== target) continue;
            const names = m[1].split(',').map(s => s.trim().split(/\s+as\s+/).pop()).filter(Boolean);
            const body = source.replace(m[0], '');
            if (names.some(n => new RegExp(`\\b${n.replace(/[$]/g, '\\$')}\\s*\\(`).test(body))) return true;
        }
    }
    return chain.slice(0, -1).some(file => {
        const source = fs.readFileSync(path.resolve(root, file), 'utf8');
        return /\b(?:coverageCase|runCase|runCaseData)\s*\(/.test(source.replace(/\bfunction\s+(?:coverageCase|runCase|runCaseData)\s*\(/g, '')) ||
            (caseId && source.includes(caseId) && /\b(?:landEffect|startEngineWorking)\s*\(/.test(source));
    });
}
export function buildReach({root = ROOT, entry = DEFAULT_ENTRY, rows = ledgerRows(root)} = {}) {
    const start = Date.now(), walk = walkFrom(entry);
    const relative = file => path.relative(root, file).split(path.sep).join('/');
    const modules = [...new Set(rows.map(x => x.row.case?.module).filter(Boolean))].sort();
    const chains = importChains(entry, modules.map(m => path.resolve(root, m)));
    const watch = {};
    // All src files are watched: this also invalidates a negative verdict after a new import.
    for (const file of srcFiles(path.join(root, 'src'))) watch[relative(file)] = hashFile(file, root);
    for (const x of rows) watch[x.ledgerFile] = hashFile(x.ledgerFile, root);
    for (const script of ['scripts/ladder_receipts.mjs', 'scripts/reachable.mjs']) if (fs.existsSync(path.join(root, script))) watch[script] = hashFile(script, root);
    const mapped = Object.fromEntries(modules.map(module => {
        const chain = chains[path.resolve(root, module)];
        return [module, {reachable: walk.reachable.has(path.resolve(root, module)),
            via: chain?.map(relative) ?? null,
            consumerCallsCase: chain ? (own => own.some(x => consumerCallsCase(chain, x.row.case.id, root, {singleRow: own.length === 1})))(rows.filter(x => x.row.case?.module === module)) : false}];
    }));
    return {schema: 1, rung: 'module-reachability', entry: relative(entry),
        producer: {command: 'node scripts/ladder_receipts.mjs reach', ms: Date.now() - start},
        tree: tree(root), at: now(), watch,
        walk: {reachableCount: walk.reachable.size, computedImports: walk.computedImports.map(x => ({...x, file: relative(x.file)})),
            unresolved: walk.unresolved.map(x => ({...x, file: relative(x.file)}))},
        modules: mapped, rows: Object.fromEntries(rows.filter(x => x.row.case?.module).map(x => [x.key,
            {module: x.row.case.module, rowSha1: sha1(x.line)}])),
        noCaseModuleCount: rows.filter(x => !x.row.case?.module).length};
}
export function parsePlayManifest(source) {
    const lines = source.split('\n').filter(line => /^\s*\/\/ @ladder /.test(line)).map(line => line.replace(/^\s*\/\/ @ladder /, ''));
    if (!lines.length) return null;
    const manifest = JSON.parse(lines.join(''));
    if (!Array.isArray(manifest.keys) || !manifest.keys.length || !manifest.keys.every(x => /^[^:]+:.+$/.test(x))) throw Error('manifest requires ledger-scoped keys');
    if (!['workshop demo', 'headless', 'ordinary play', 'browser'].includes(manifest.scope)) throw Error('manifest requires scope');
    if (!['capability-run', 'fixture', 'ordinary-play', 'earned-save', 'browser'].includes(manifest.route)) throw Error('manifest requires route');
    for (const key of ['engineRestore', 'saveReload', 'exportImport', 'browser'])
        if (manifest.checks?.[key] !== undefined && typeof manifest.checks[key] !== 'boolean') throw Error(`manifest ${key} must be boolean`);
    if (manifest.watch && (!Array.isArray(manifest.watch) || !manifest.watch.every(x => typeof x === 'string'))) throw Error('manifest watch must be paths');
    return manifest;
}
function play(files, root = ROOT) {
    const rows = new Map(ledgerRows(root).map(x => [x.key, x]));
    const previous = path.join(root, OUT, 'play.json');
    const receipts = fs.existsSync(previous) ? JSON.parse(fs.readFileSync(previous, 'utf8')).receipts ?? [] : [];
    let missing = 0;
    for (const file of files) {
        const full = path.resolve(root, file);
        if (!full.startsWith(root + path.sep) || !fs.existsSync(full)) throw Error(`test not found: ${file}`);
        const manifest = parsePlayManifest(fs.readFileSync(full, 'utf8'));
        const command = `node --test ${file}`;
        const start = Date.now();
        const result = spawnSync(process.execPath, ['--test', file], {cwd: root, encoding: 'utf8', timeout: 300000});
        const ms = Date.now() - start;
        console.log(`${command}: exit ${result.status ?? 'signal'}; ${ms} ms`);
        console.log((result.stdout ?? '').trim().split('\n').slice(-7).join('\n'));
        if (result.stderr) console.error(result.stderr.slice(-2000));
        if (result.status !== 0) throw Error(`${command} failed`);
        if (!manifest) { missing++; console.log(`${file}: no @ladder manifest; no row proof recorded`); continue; }
        for (const key of manifest.keys) if (!rows.has(key)) throw Error(`unknown ledger key ${key}`);
        const watch = {};
        for (const watched of [file, 'scripts/ladder_receipts.mjs', ...manifest.watch ?? [], ...manifest.keys.map(k => rows.get(k).ledgerFile)]) watch[watched] = hashFile(watched, root);
        for (const source of srcFiles(path.join(root, 'src'))) watch[rel(source)] = hashFile(source, root);
        const receipt = {schema: 1, keys: manifest.keys, scope: manifest.scope, route: manifest.route,
            playerAction: true, persistence: {engineRestore: manifest.checks?.engineRestore ?? false,
                saveReload: manifest.checks?.saveReload ?? false, exportImport: manifest.checks?.exportImport ?? false,
                browser: manifest.checks?.browser ?? false},
            producer: {command, exit: result.status, ms}, tree: tree(root), at: now(), watch,
            rowSha1: Object.fromEntries(manifest.keys.map(k => [k, sha1(rows.get(k).line)]))};
        const i = receipts.findIndex(x => x.producer.command === command);
        if (i >= 0) receipts[i] = receipt; else receipts.push(receipt);
    }
    write('play.json', {schema: 1, receipts}, root);
    console.log(`play receipts: ${receipts.length}; tests without manifest: ${missing}`);
}
async function engine(root = ROOT) {
    const {runCase} = await import('./case_runner.mjs');
    const rows = ledgerRows(root).filter(x => x.row.case?.module);
    const reachable = walkFrom().reachable, entries = [];
    const start = Date.now();
    for (const x of rows) {
        const module = await import(pathToFileURL(path.resolve(root, x.row.case.module)).href);
        const data = module.coverageCase(x.row.case.id);
        if (!data?.timeline?.some(step => step.restore === true)) continue;
        const outcome = await runCase(x.row, {reachable});
        entries.push({key: x.key, engineRestore: !outcome.state.startsWith('blocked:') && outcome.state !== 'blocked',
            state: outcome.state, case: x.row.case, rowSha1: sha1(x.line)});
    }
    const watch = {};
    for (const x of rows) { watch[x.ledgerFile] = hashFile(x.ledgerFile, root); watch[x.row.case.module] = hashFile(x.row.case.module, root); }
    for (const source of srcFiles(path.join(root, 'src'))) watch[rel(source)] = hashFile(source, root);
    for (const script of ['scripts/ladder_receipts.mjs', 'scripts/case_runner.mjs', 'scripts/reachable.mjs']) watch[script] = hashFile(script, root);
    write('engine.json', {schema: 1, rung: 'persistence', entries, producer: {command: 'node scripts/ladder_receipts.mjs engine', ms: Date.now() - start}, tree: tree(root), at: now(), watch}, root);
    console.log(`engine restore entries: ${entries.length}; ${Date.now() - start} ms`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [cmd, ...args] = process.argv.slice(2);
    try {
        if (cmd === 'reach') { const receipt = buildReach(); write('reachability.json', receipt);
            console.log(`reach rows: ${Object.keys(receipt.rows).length}; modules: ${Object.keys(receipt.modules).length}; no case: ${receipt.noCaseModuleCount}; ${receipt.producer.ms} ms`); }
        else if (cmd === 'play') play(args.length ? args : fs.readdirSync(path.join(ROOT, 'tests')).filter(f => f.endsWith('_play.test.js')).sort()
            .map(f => `tests/${f}`).filter(f => /^\s*\/\/ @ladder /m.test(fs.readFileSync(path.join(ROOT, f), 'utf8'))));
        else if (cmd === 'engine') await engine();
        else throw Error('usage: ladder_receipts.mjs reach|play [test files...]|engine');
    } catch (error) { console.error(error.stack ?? error); process.exitCode = 1; }
}
