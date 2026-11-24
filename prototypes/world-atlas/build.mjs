// One batch build for every atlas projection. Writes a dated snapshot the server reads, so a reading wave,
// a lead run or a progress-atlas run can refresh the atlas with one command at its end.
//   node prototypes/world-atlas/build.mjs [--out work/atlas-snapshot/snapshot.json]
// Prints a one-line JSON summary (counts per part, seconds per part, failures). Exit 1 if a required part fails.
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {readLibrary} from './library-reading.mjs';
import {readBatches} from './batch-status.mjs';
import {buildCodex} from './codex.mjs';
import {buildCheats} from './cheats.mjs';
import {buildChanges} from './changelog.mjs';

const here = fileURLToPath(new URL('.', import.meta.url)), root = join(here, '..', '..');
export const SNAPSHOT = process.env.ATLAS_SNAPSHOT || join(root, 'work/atlas-snapshot/snapshot.json');
export const READERS = join(dirname(SNAPSHOT), 'readers');
const run = (file, args = []) => JSON.parse(execFileSync(process.execPath, [join(here, file), ...args], {cwd: root, encoding: 'utf8', maxBuffer: 256e6, stdio: ['ignore', 'pipe', 'pipe']}));
const readJson = p => JSON.parse(readFileSync(p, 'utf8'));
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// Source games: each place is "absorbed" when the current game registers a place of the same id or name, else "source only".
function joinSource(src, registered, group) {
    if (!src) return null;
    const ids = new Set(registered.map(r => r.id)), names = new Map(registered.filter(r => !group || r.group === group).map(r => [norm(r.label), r.id]));
    for (const p of src.places) {
        const match = ids.has(p.id) ? p.id : names.get(norm(p.label)) || null;
        p.state = match ? 'absorbed' : 'source';
        p.gameId = match;
    }
    const gameOnly = group ? registered.filter(r => r.group === group && !src.places.some(p => p.gameId === r.id)).map(r => ({id: r.id, label: r.label})) : [];
    return {...src, gameOnly};
}
function sourceGame(name, file, privateJson) {
    try {return run(file);} catch (e) {
        if (existsSync(privateJson)) return {...readJson(privateJson), stale: 'extractor failed; read the last extracted copy: ' + e.message.split('\n')[0]};
        return null;
    }
}
export function latestProgress(dir = join(root, 'docs/reports')) {
    const files = readdirSync(dir).filter(f => /^progress-atlas-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
    return files.length ? {file: 'docs/reports/' + files.at(-1), ...readJson(join(dir, files.at(-1)))} : null;
}

export function latestBatchCollection(rows) {
    return rows.reduce((latest, row) => Math.max(latest, row.latestCollectedAt), 0);
}

export function buildSnapshot(out = SNAPSHOT) {
    const latestCollectedAt = latestBatchCollection(readBatches(readLibrary().keys.map(k => k.key)));
    const dirty = Boolean(execFileSync('git', ['status', '--porcelain', '--untracked-files=normal'], {cwd: root, encoding: 'utf8'}).trim());
    const timings = {}, failures = [];
    const part = (name, fn, required = false) => {
        const t = Date.now();
        try {const v = fn(); timings[name] = (Date.now() - t) / 1000; return v;} catch (e) {
            failures.push({part: name, required, error: e.message.split('\n')[0]});
            timings[name] = (Date.now() - t) / 1000;
            return null;
        }
    };
    const books = part('books', () => run('cast-places.mjs'), true) || {};
    const native = part('native', () => run('native-map.mjs'), true) || {frontier: [], others: []};
    const registered = [...native.frontier.map(r => ({id: r.id, label: r.label, group: 'Village'})), ...native.others];
    const sources = {
        yair: part('yair', () => joinSource(run('source-yair.mjs'), registered, null)),
        proto23: part('proto23', () => joinSource(sourceGame('proto23', 'source-proto23.mjs', join(root, 'private/atlas-sources/proto23/proto23.json')), registered, 'Proto23 reference')),
        arkivia: part('arkivia', () => joinSource(sourceGame('arkivia', 'source-arkivia.mjs', join(root, 'private/atlas-sources/arkivia/arkivia.json')), [], null)), // ideas absorbed, no places
    };
    // OOPS-added places: registered now, absent upstream.
    if (sources.yair) {
        const up = new Set(sources.yair.places.map(p => p.id));
        sources.yair.added = native.frontier.filter(r => !up.has(r.id)).map(r => ({id: r.id, label: r.label}));
    }
    const mechanics = part('mechanics', () => run('mechanics.mjs'));
    const progress = part('progress', () => latestProgress());
    // Reader findings: the matrix rides in the snapshot; one digest per world goes beside it for the Things and Making views.
    const findings = part('findings', () => run('reader-findings.mjs', ['--out-dir', join(dirname(out), 'readers')]));
    const recipes = part('recipes', () => run('game-recipes.mjs'));
    const gameMaking = part('gameMaking', () => run('game-making.mjs'));
    const codex = part('codex', () => buildCodex()); // aggregates only; row pages are served on demand (C1)
    const cheats = part('cheats', () => buildCheats()); // summary and top candidates only; rows are served on demand
    const head = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim();
    const changes = part('changes', () => buildChanges({commit: head, codex, cheats, existing: readSnapshot(out)?.changes ?? null}));
    const snapshot = {builtAt: new Date().toISOString(), commit: execFileSync('git', ['rev-parse', '--short', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim(),
        dirty, latestCollectedAt, timings, failures, books, frontier: native.frontier, others: native.others, sources, mechanics, progress, findings, recipes, gameMaking, codex, cheats, changes};
    return snapshot;
}

export function readSnapshot(file = SNAPSHOT) {return existsSync(file) ? readJson(file) : null;}

if (import.meta.main) {
    const i = process.argv.indexOf('--out'), out = i > 0 ? process.argv[i + 1] : SNAPSHOT;
    const s = buildSnapshot(out);
    if (!s.failures.some(f => f.required)) {
        mkdirSync(dirname(out), {recursive: true});
        const temporary = out + '.' + process.pid + '.tmp';
        writeFileSync(temporary, JSON.stringify(s));
        renameSync(temporary, out);
    }
    const count = v => v ? v.places?.length ?? v.length ?? Object.keys(v).length : 0;
    console.log(JSON.stringify({out, commit: s.commit, books: Object.fromEntries(Object.entries(s.books).map(([k, v]) => [k, v.places.length])),
        village: s.frontier.length, others: s.others.length, sources: Object.fromEntries(Object.entries(s.sources).map(([k, v]) => [k, count(v)])),
        mechanics: s.mechanics?.mechanics.length ?? 0, progress: s.progress?.snapshot ?? null, findings: s.findings?.worlds.filter(w => w.read).length ?? 0, recipes: s.recipes?.recipes.length ?? 0, gameMaking: s.gameMaking?.rows.length ?? 0, codex: s.codex?.ledgers.length ?? 0, cheats: s.cheats?.counts ?? null, changes: s.changes?.previous ? s.changes.previous.commit : null, timings: s.timings, failures: s.failures}));
    if (s.failures.some(f => f.required)) process.exit(1);
}
