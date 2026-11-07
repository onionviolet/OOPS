#!/usr/bin/env node
// Tauri host harness (AD39, 2026-11-06). Runs the hidden Tauri host against
// synthetic fixtures, one variable per variant, and checks that a save
// survives a clean quit and a hard kill. Never uses the player's store.
//
//   cargo build --release --offline --manifest-path desktop-tauri/Cargo.toml
//   node scripts/tauri/harness.mjs [--variants base,wk-throttle,appnap,ephemeral,loopback,native-visibility,hang,crash,reset]
//        [--fixtures fresh,crowded] [--runs 1] [--seconds 20] [--no-durability]
//
// Output: work/tauri-harness/<stamp>/summary.json plus one report file per run.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {spawn, execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import os from 'node:os';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BIN = (() => { const i = process.argv.indexOf('--bin'); return i < 0 ? path.join(ROOT, 'desktop-tauri/target/release/yairpg-tauri') : path.resolve(process.argv[i + 1]); })();
const args = process.argv.slice(2);
const value = (name, fallback) => { const i = args.indexOf(name); return i < 0 ? fallback : args[i + 1]; };
const variants = value('--variants', 'base,wk-throttle,appnap,ephemeral,loopback,native-visibility,hang,crash,reset').split(',');
const fixtures = value('--fixtures', 'fresh,crowded').split(',');
const runs = Number(value('--runs', 1));
const idleMs = Number(value('--seconds', 20)) * 1000;
const durability = !args.includes('--no-durability');
const fixtureFile = value('--fixture-file', null);
const userDataOverride = value('--user-data', null);
const deadlineMs = Number(value('--deadline', 180)) * 1000;
if (!fs.existsSync(BIN)) { console.error('Build first: cargo build --release --offline --manifest-path desktop-tauri/Cargo.toml'); process.exit(2); }

const VARIANTS = {
    base: {},
    appnap: {env: {YAIRPG_APPNAP: '1'}},
    ephemeral: {env: {YAIRPG_EPHEMERAL: '1'}, ephemeral: true},
    loopback: {loopback: true},
    'native-visibility': {normalizeVisibility: false},
    'wk-throttle': {env: {YAIRPG_WK_THROTTLE: '1'}},
    // Recovery scenarios (N1/N2): mirror on, page frozen or its process killed.
    hang: {env: {YAIRPG_MIRROR: '1', YAIRPG_MIRROR_MS: '2000', YAIRPG_HANG_MS: '6000'}, recovery: 'loop'},
    reset: {recoveryLike: 'reset'},
    popout: {recoveryLike: 'popout'},
    // Save move: an Electron mirror snapshot planted as import-pending opens recovery; Restore boots it.
    import: {env: {YAIRPG_MIRROR: '1'}, recoveryLike: 'import'},
    // Visible, unfocused window that really paints (Weibao allowed this, Q2 2026-11-06). Not in the default list.
    visible: {visible: true, normalizeVisibility: false, env: {YAIRPG_INACTIVE: '1'}},
    // Adoption verify (scripts/tauri/adopt.mjs): serve the frozen build already in --user-data.
    'frozen-run': {env: {YAIRPG_FROZEN: '1'}},
    // N4: frozen snapshot served, a newer one offered mid-run and adopted on click.
    frozen: {env: {YAIRPG_FROZEN: '1', YAIRPG_BUILD_POLL_MS: '1000'}, recoveryLike: 'frozen'},
    crash: {env: {YAIRPG_MIRROR: '1', YAIRPG_MIRROR_MS: '2000'}, recovery: 'kill'},
    // O2: quit cleanly, delete the profile's WebKit data, relaunch; the host store must bring the save back.
    wipe: {recoveryLike: 'wipe'},
};
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const out = path.join(ROOT, 'work/tauri-harness', stamp);
fs.mkdirSync(out, {recursive: true});
const pageScript = fs.readFileSync(path.join(ROOT, 'scripts/tauri/harness_page.js'), 'utf8');

// Loopback variant: the same files over 127.0.0.1, like the Nov 6 prototype.
let reportFile = null;
let onEvent = null; // per-scenario hook, called with each new report line
const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/__harness/report') {
        let body = ''; req.on('data', c => body += c);
        req.on('end', () => { if (reportFile) fs.appendFileSync(reportFile, body + '\n'); res.writeHead(204, {'Access-Control-Allow-Origin': '*'}).end(); });
        return;
    }
    const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    if (rel.split('/').includes('..')) return res.writeHead(403).end();
    fs.readFile(path.join(ROOT, rel), (err, data) => {
        if (err) { if (reportFile) fs.appendFileSync(reportFile, JSON.stringify({type: 'miss', path: rel}) + '\n'); return res.writeHead(404).end(); }
        const ext = rel.split('.').pop();
        const types = {html: 'text/html', js: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', svg: 'image/svg+xml', woff2: 'font/woff2'};
        res.writeHead(200, {'Content-Type': types[ext] || 'application/octet-stream'}).end(data);
    });
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

// Each YAIRPG_USER_DATA path maps to one WebKit store (first 16 bytes of its
// SHA-256, as a UUID). Remove it once its runs are done so tests leave no data.
const STORES = path.join(os.homedir(), 'Library/WebKit/yairpg-tauri/WebsiteDataStore');
const dropStore = (profile, force = false) => {
    const h = crypto.createHash('sha256').update(profile).digest('hex').slice(0, 32);
    const id = `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
    if (args.includes('--keep-stores') && !force) return;
    fs.rmSync(path.join(STORES, id), {recursive: true, force: true});
};
const readLines = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return {type: 'unparsed', l}; } }) : [];

async function launch({name, variant, fixture, phase, exit, profile}) {
    const v = VARIANTS[variant];
    const report = path.join(out, `${name}.jsonl`);
    reportFile = report;
    const cfg = {phase, exit, idleMs, hang: v.recovery, restore: true, mirrorWaitMs: 5000, sample: args.includes('--sample') || args.includes('--profile'), profile: args.includes('--profile'), normalizeVisibility: v.normalizeVisibility ?? true,
        fixture: phase !== 'relaunch' ? JSON.parse(fs.readFileSync(fixtureFile || path.join(ROOT, 'tests/fixtures/perf', fixture + '.json'))) : null,
        report: v.loopback ? `http://127.0.0.1:${port}/__harness/report` : '/__harness/report'};
    const script = path.join(out, `${name}.page.js`);
    fs.writeFileSync(script, `window.__harness = ${JSON.stringify(cfg)};\n${pageScript}`);
    const env = {...process.env, ...(v.visible ? {} : {YAIRPG_HIDDEN: '1'}), YAIRPG_REPORT: report, YAIRPG_HARNESS_SCRIPT: script, ...(v.env || {})};
    if (!v.ephemeral) env.YAIRPG_USER_DATA = profile;
    if (v.loopback) env.YAIRPG_URL = `http://127.0.0.1:${port}/index.html`;
    const started = Date.now();
    const child = spawn(BIN, [], {env, stdio: ['ignore', 'pipe', 'pipe'], detached: true});
    const log = fs.createWriteStream(path.join(out, `${name}.log`));
    child.stdout.pipe(log); child.stderr.pipe(log);
    let exited = null;
    child.on('exit', (code, signal) => { exited = {code, signal, at: Date.now()}; });
    const result = {name, variant, fixture, phase, exit, pid: child.pid, started};
    while (Date.now() - started < deadlineMs) {
        await new Promise(r => setTimeout(r, 250));
        const lines = readLines(report);
        if (onEvent) for (const e of lines) onEvent(e);
        if (lines.some(e => e.type === 'done') || exited) break;
    }
    const events = readLines(report);
    result.events = events;
    result.timedOut = !events.some(e => e.type === 'done') && !exited;
    if (exit === 'clean' && !exited) {
        const until = Date.now() + 10000;
        while (!exited && Date.now() < until) await new Promise(r => setTimeout(r, 100));
        result.cleanExit = !!exited;
    }
    if (exit === 'kill' && !exited) await new Promise(r => setTimeout(r, 1000)); // save had a second to land
    if (!exited) { try { process.kill(-child.pid, 'SIGKILL'); } catch { /* gone */ } }
    while (!exited) await new Promise(r => setTimeout(r, 50));
    result.exitStatus = exited;
    return result;
}

const pct = (xs, p) => { if (!xs?.length) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const median = xs => pct(xs, 0.5);
function summarize(r) {
    const get = t => r.events.find(e => e.type === t);
    const ready = get('ready'), idle = get('idle'), saved = get('saved'), failed = get('failed');
    const errors = [...new Set(r.events.flatMap(e => e.errors || []))];
    return {
        name: r.name, variant: r.variant, fixture: r.fixture,
        unthrottled: r.events.find(e => e.type === 'host')?.unthrottled ?? null,
        launchToReadyS: ready ? +((ready.at - r.started) / 1000).toFixed(1) : null,
        domToReadyS: ready ? +((ready.readyMs - ready.domMs) / 1000).toFixed(1) : null,
        visibility: ready?.visibility ?? null,
        gameMinPerWallS: idle ? +((idle.clockEnd - idle.clockStart) / (idle.idleWallMs / 1000)).toFixed(2) : null,
        lagP95Ms: idle ? Math.round(pct(idle.lags, 0.95)) : null,
        lagMaxMs: idle ? Math.round(Math.max(...idle.lags)) : null,
        saveMedianMs: saved ? +median(saved.saveMs).toFixed(1) : null,
        misses: r.events.filter(e => e.type === 'miss').map(e => e.path),
        errors, failed: failed?.error ?? null, timedOut: r.timedOut,
        expected: saved ? {clock: saved.clock, name: saved.name} : null,
    };
}

const rows = [];
for (let run = 1; run <= runs; run++) for (const fixture of fixtures) for (const variant of variants) {
    const name = `${variant}-${fixture}-${run}`;
    const profile = userDataOverride ? path.resolve(userDataOverride) : path.join(out, 'profiles', name);
    if (VARIANTS[variant].recoveryLike === 'frozen') {
        // Snapshot A before launch; snapshot B (one changed file) once the game is up.
        const snap = (from) => execFileSync('node', [path.join(ROOT, 'scripts/tauri/snapshot.cjs'), '--from', from], {env: {...process.env, YAIRPG_USER_DATA: profile}}).toString().trim();
        fs.mkdirSync(profile, {recursive: true});
        const a = snap(ROOT);
        const altered = path.join(out, `${name}-tree`);
        onEvent = e => {
            if (e.type !== 'frozen-ready' || fs.existsSync(altered)) return;
            const pkg = (rel) => { const to = path.join(altered, rel); fs.mkdirSync(path.dirname(to), {recursive: true}); fs.cpSync(path.join(ROOT, rel), to, {recursive: true}); };
            for (const rel of ['index.html', 'style.css', 'favicon.ico', 'help.html', 'changelog.html', 'dist', 'src/game_version.js', 'styles', 'resources', 'assets', 'locales', 'stories', 'private_packs', 'package.json']) if (fs.existsSync(path.join(ROOT, rel))) pkg(rel);
            fs.appendFileSync(path.join(altered, 'help.html'), `\n<!-- harness ${stamp} -->\n`);
            snap(altered);
        };
        const r = await launch({name, variant, fixture, phase: 'frozen', exit: 'kill', profile});
        onEvent = null;
        const ready = r.events.find(e => e.type === 'frozen-ready'), adopted = r.events.find(e => e.type === 'adopted');
        const row = {name, variant, fixture, snapshotA: a.split(' ')[1], served: ready?.build?.serving ?? null, hostBuild: ready?.host ?? null,
            announced: r.events.find(e => e.announced)?.announced ?? null, adoptedServing: adopted?.build?.serving ?? null,
            switched: !!adopted && adopted.build.serving !== ready?.build?.serving && adopted.build.serving === r.events.find(e => e.announced)?.announced,
            saveKept: !!adopted && adopted.name === ready?.name && adopted.clock >= ready?.clock, timedOut: r.timedOut,
            misses: r.events.filter(e => e.type === 'miss').map(e => e.path), errors: [...new Set(r.events.flatMap(e => e.errors || []))]};
        fs.rmSync(altered, {recursive: true, force: true}); fs.rmSync(path.join(profile, 'builds'), {recursive: true, force: true});
        dropStore(profile);
        rows.push(row); console.log(JSON.stringify(row));
        continue;
    }
    if (VARIANTS[variant].recoveryLike === 'import') {
        const fixtureSave = JSON.parse(fs.readFileSync(fixtureFile || path.join(ROOT, 'tests/fixtures/perf', fixture + '.json')));
        const entries = {'save data': JSON.stringify(fixtureSave)};
        const {hashEntries} = (await import('node:module')).createRequire(import.meta.url)(path.join(ROOT, 'scripts/tauri/save_mirror.cjs'));
        const id = `20261027-232500-${hashEntries(entries).slice(0, 8)}`;
        const hist = path.join(profile, 'save-mirror/history');
        fs.mkdirSync(hist, {recursive: true});
        fs.writeFileSync(path.join(hist, `${id}.json.gz`), (await import('node:zlib')).gzipSync(JSON.stringify({schema: 1, savedAt: '2026-10-28T03:25:00.103Z', reason: 'from-electron', entries})));
        fs.writeFileSync(path.join(profile, 'save-mirror/import-pending'), '{}');
        const r = await launch({name, variant, fixture, phase: 'relaunch', exit: 'kill', profile});
        const recover = r.events.find(e => e.type === 'recover'), restored = r.events.find(e => e.type === 'restored');
        const row = {name, variant, fixture, recoverReason: recover?.reason ?? null, heading: recover?.heading ?? null, backups: recover?.backups ?? 0,
            restored: restored ? {name: restored.name, clock: restored.clock} : null,
            restoreKept: !!restored && restored.name === fixtureSave.character?.name, markerGone: !fs.existsSync(path.join(profile, 'save-mirror/import-pending')),
            timedOut: r.timedOut, errors: [...new Set(r.events.flatMap(e => e.errors || []))]};
        dropStore(profile);
        rows.push(row); console.log(JSON.stringify(row));
        continue;
    }
    if (VARIANTS[variant].recoveryLike === 'wipe') {
        const first = summarize(await launch({name, variant, fixture, phase: 'first', exit: 'clean', profile}));
        dropStore(profile, true);
        const again = await launch({name: name + '-after-wipe', variant, fixture, phase: 'relaunch', profile});
        const got = again.events.find(e => e.type === 'relaunched');
        const row = {name, variant, fixture, expected: first.expected, got: got ? {clock: got.clock, name: got.name} : null,
            storeFile: fs.existsSync(path.join(profile, 'storage/local.json')),
            wipeKept: !!got && !!first.expected && got.name === first.expected.name && got.clock >= first.expected.clock,
            timedOut: again.timedOut, errors: [...new Set([...first.errors, ...again.events.flatMap(e => e.errors || [])])]};
        dropStore(profile);
        rows.push(row); console.log(JSON.stringify(row));
        continue;
    }
    if (VARIANTS[variant].recoveryLike === 'popout') {
        const r = await launch({name, variant, fixture, phase: 'popout', exit: 'kill', profile});
        const att = r.events.find(e => e.type === 'attention-checked'), shown = r.events.filter(e => e.type === 'popout-shown');
        const row = {name, variant, fixture, attention: att?.attention ?? null, capabilities: att?.capabilities ?? null,
            popoutShown: shown.length, lastPopout: shown.at(-1) ?? null, timedOut: r.timedOut, errors: [...new Set(r.events.flatMap(e => e.errors || []))]};
        dropStore(profile);
        rows.push(row); console.log(JSON.stringify(row));
        continue;
    }
    if (VARIANTS[variant].recoveryLike === 'reset') {
        const r = await launch({name, variant, fixture, phase: 'reset', exit: 'kill', profile});
        const dialog = r.events.find(e => e.type === 'reset-dialog'), after = r.events.find(e => e.type === 'after-reset');
        const row = {name, variant, fixture, dialog: dialog ? {title: dialog.title, blockedWrong: dialog.blockedWrong, enabledRight: dialog.enabledRight} : null,
            clockBefore: dialog?.clockBefore ?? null, clockAfter: after?.clock ?? null, freshGame: !!after && after.clock < dialog?.clockBefore,
            timedOut: r.timedOut, errors: [...new Set(r.events.flatMap(e => e.errors || []))]};
        dropStore(profile);
        rows.push(row); console.log(JSON.stringify(row));
        continue;
    }
    if (VARIANTS[variant].recovery) {
        const r = await launch({name, variant, fixture, phase: 'hang', exit: 'kill', profile});
        const get = t => r.events.find(e => e.type === t);
        const saved = get('saved'), recover = get('recover'), restored = get('restored');
        const mirrorDir = path.join(profile, 'save-mirror');
        const row = {name, variant, fixture, kill: r.events.find(e => e.kill)?.kill ?? null, terminated: r.events.find(e => e.terminated)?.terminated ?? null,
            recoverReason: recover?.reason ?? null, backups: recover?.backups ?? 0,
            mirrorFiles: fs.existsSync(mirrorDir) ? [fs.existsSync(path.join(mirrorDir, 'latest.json')) && 'latest.json', ...(fs.existsSync(path.join(mirrorDir, 'history')) ? fs.readdirSync(path.join(mirrorDir, 'history')) : [])].filter(Boolean) : [],
            expected: saved ? {clock: saved.clock, name: saved.name} : null, restored: restored ? {clock: restored.clock, name: restored.name} : null,
            restoreKept: !!saved && !!restored && restored.name === saved.name && restored.clock >= saved.clock, timedOut: r.timedOut,
            errors: [...new Set(r.events.flatMap(e => e.errors || []))]};
        dropStore(profile);
        rows.push(row); console.log(JSON.stringify(row));
        continue;
    }
    const exit = VARIANTS[variant].ephemeral || VARIANTS[variant].loopback ? 'kill' : 'clean';
    const row = summarize(await launch({name, variant, fixture, phase: 'first', exit, profile}));
    if (durability && !VARIANTS[variant].ephemeral && !VARIANTS[variant].loopback && row.expected) {
        const again = await launch({name: name + '-relaunch-clean', variant, fixture, phase: 'relaunch', profile});
        const got = again.events.find(e => e.type === 'relaunched');
        row.cleanQuitKept = !!got && got.name === row.expected.name && got.clock >= row.expected.clock;
        row.cleanQuitGot = got ? {clock: got.clock, name: got.name} : null;
    }
    dropStore(profile);
    rows.push(row);
    console.log(JSON.stringify(row));
}
// Hard kill after Save: does the store keep a save the page wrote a second earlier?
if (durability && variants.includes('base')) {
    const profile = path.join(out, 'profiles', 'kill');
    const first = summarize(await launch({name: 'base-kill', variant: 'base', fixture: fixtures[0], phase: 'first', exit: 'kill', profile}));
    const again = await launch({name: 'base-kill-relaunch', variant: 'base', fixture: fixtures[0], phase: 'relaunch', profile});
    const got = again.events.find(e => e.type === 'relaunched');
    const row = {name: 'base-kill', expected: first.expected, got: got ? {clock: got.clock, name: got.name} : null,
        killKept: !!got && !!first.expected && got.name === first.expected.name && got.clock >= first.expected.clock};
    dropStore(profile);
    rows.push(row);
    console.log(JSON.stringify(row));
}
server.close();
fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify({stamp, bin: BIN, idleMs, rows}, null, 2));
console.log('summary:', path.relative(ROOT, path.join(out, 'summary.json')));
