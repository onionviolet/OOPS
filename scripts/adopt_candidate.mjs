// MDL16 adopt a new build into the normal Electron app, in three steps that
// stop before the swap, plus a first-load measurement (MDL15).
//
//   node scripts/adopt_candidate.mjs prepare --commit <sha>
//   node scripts/adopt_candidate.mjs verify
//   node scripts/adopt_candidate.mjs measure
//   node scripts/adopt_candidate.mjs swap --yes [--label <name>]   (needs Weibao's explicit yes)
//
// prepare  scratch worktree of the commit, snapshot into a scratch profile,
//          file list compared with the player's current snapshot.
// verify   hidden frozen Electron on a COPY of the player's profile; never
//          writes the real one and never prints save contents.
// measure  hidden launch on a fresh profile: first paint, workspace, size, DOM.
// swap     closed app only: verified backup, then snapshot and pointers.
//
// Scratch state lives in <tmp>/yairpg-adopt/ (state.json, worktree/, candidate/).
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORK = process.env.YAIRPG_ADOPT_WORK || path.join(os.tmpdir(), 'yairpg-adopt');
const STATE = path.join(WORK, 'state.json');
const CODEX_PLAYWRIGHT = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const PROFILE_NAME = 'oops-progression-simulator';
// Caches the app rebuilds itself; copying them only costs time.
const CACHE_DIRS = new Set(['Cache', 'Code Cache', 'GPUCache', 'DawnGraphiteCache', 'DawnWebGPUCache', 'GraphiteDawnCache', 'GrShaderCache', 'ShaderCache']);

// ---- pure parts (tests/adopt_candidate.test.js) ----

export function parseArgs(argv) {
    const [command, ...rest] = argv;
    const opts = { command: command || '', commit: null, yes: false, label: null };
    for (let i = 0; i < rest.length; i++) {
        const a = rest[i];
        if (a === '--yes') opts.yes = true;
        else if (a === '--commit' || a === '--label') {
            const value = rest[++i];
            if (!value || value.startsWith('--')) throw new Error(`${a} needs a value`);
            opts[a.slice(2)] = value;
        } else throw new Error(`Unknown argument ${a}`);
    }
    if (!['prepare', 'verify', 'measure', 'swap'].includes(opts.command)) throw new Error('Usage: adopt_candidate.mjs prepare --commit <sha> | verify | measure | swap --yes [--label <name>]');
    if (opts.command === 'prepare' && !opts.commit) throw new Error('prepare needs --commit <sha>');
    if (opts.label && !/^[A-Za-z0-9._-]+$/.test(opts.label)) throw new Error('--label may only use letters, digits, . _ -');
    return opts;
}

// Files the player's current snapshot has that the candidate lacks (missing)
// and the reverse (added).
export function diffFiles(current, candidate) {
    const have = new Set(candidate);
    const had = new Set(current);
    return {
        missing: [...had].filter(f => !have.has(f)).sort(),
        added: [...have].filter(f => !had.has(f)).sort(),
    };
}

// Lines of `ps -axo pid=,command=` that look like the player's app. Helper
// processes carry the profile folder in --user-data-dir; the main process is
// Electron on the primary checkout. Lane worktrees and temp-dir runs use their
// own YAIRPG_USER_DATA and do not count.
export function findRunning(psLines, { selfPid = process.pid } = {}) {
    return psLines.filter(line => {
        const m = line.trim().match(/^(\d+)\s+(.*)$/);
        if (!m || Number(m[1]) === selfPid) return false;
        const cmd = m[2];
        if (/adopt_candidate\.mjs/.test(cmd)) return false;
        if (cmd.includes(PROFILE_NAME) && /electron|oops/i.test(cmd)) return !/yairpg-adopt|yairpg-desktop|yairpg-frozen/.test(cmd);
        return /electron/i.test(cmd) && /\/yet-another-idle-rpg(\s|$|\/(desktop|Electron))/i.test(cmd) && !cmd.includes('/.claude/worktrees/');
    });
}

export const sha256File = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

export function listTree(dir) {
    const out = [];
    const walk = rel => {
        for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
            const child = rel ? `${rel}/${e.name}` : e.name;
            if (e.isDirectory()) walk(child);
            else if (e.isFile()) out.push(child);
        }
    };
    walk('');
    return out.sort();
}

// `<sha256>  ./<path>` lines, one per file, sorted: the same shape as the
// earlier receipts' normal-profile-before.sha256.
export function writeManifest(dir, manifestFile) {
    const lines = listTree(dir).map(rel => `${sha256File(path.join(dir, rel))}  ./${rel}`);
    fs.writeFileSync(manifestFile, lines.join('\n') + '\n');
    return lines.length;
}

export function readManifest(manifestFile) {
    const map = new Map();
    for (const line of fs.readFileSync(manifestFile, 'utf8').split('\n')) {
        const m = line.match(/^([0-9a-f]{64}) {2}\.\/(.+)$/);
        if (m) map.set(m[2], m[1]);
    }
    return map;
}

// Problems comparing a directory with a manifest. `ignore` skips paths
// (for example builds/ after a swap).
export function checkAgainstManifest(dir, manifestFile, { ignore = () => false } = {}) {
    const expected = readManifest(manifestFile);
    const problems = [];
    const actual = new Set(listTree(dir).filter(rel => !ignore(rel)));
    for (const [rel, hash] of expected) {
        if (ignore(rel)) continue;
        if (!actual.has(rel)) problems.push(`missing ${rel}`);
        else if (sha256File(path.join(dir, rel)) !== hash) problems.push(`differs ${rel}`);
    }
    for (const rel of actual) if (!expected.has(rel)) problems.push(`extra ${rel}`);
    return { count: expected.size, problems };
}

// ---- helpers ----

const log = (...a) => console.log(...a);
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

function mainCheckout() {
    if (process.env.YAIRPG_MAIN) return path.resolve(process.env.YAIRPG_MAIN);
    const common = git(ROOT, 'rev-parse', '--path-format=absolute', '--git-common-dir');
    return path.dirname(common);
}

function loadSnapshot(root) {
    return require(path.join(root, 'desktop/snapshot.cjs'));
}

function loadState() {
    try { return JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch { throw new Error('No prepared candidate. Run prepare --commit <sha> first.'); }
}

function loadPlaywright() {
    for (const id of [process.env.YAIRPG_PLAYWRIGHT, 'playwright', CODEX_PLAYWRIGHT].filter(Boolean)) {
        try { return require(id); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
    }
    throw new Error('Playwright not found. Set YAIRPG_PLAYWRIGHT to its module path.');
}

const playerProfile = () => loadSnapshot(ROOT).defaultUserData(ROOT);
const copyProfile = (from, to) => fs.cpSync(from, to, { recursive: true, filter: src => !CACHE_DIRS.has(path.basename(src)) });
const dateStamp = () => { const d = new Date(); const p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };

function installCandidate(state, userData) {
    const { buildsDir, writePointer } = loadSnapshot(state.worktree);
    const target = path.join(buildsDir(userData), state.id);
    fs.mkdirSync(buildsDir(userData), { recursive: true });
    if (!fs.existsSync(path.join(target, 'index.html'))) {
        const temp = path.join(buildsDir(userData), `.tmp-${state.id}-${process.pid}`);
        fs.rmSync(temp, { recursive: true, force: true });
        fs.cpSync(state.snapshotDir, temp, { recursive: true });
        fs.renameSync(temp, target);
    }
    writePointer(userData, 'latest.json', state.id, { files: state.files.length });
    writePointer(userData, 'current.json', state.id);
    return target;
}

async function launchHidden(state, userData, extraEnv = {}) {
    const { _electron } = loadPlaywright();
    const app = await _electron.launch({
        executablePath: require(path.join(state.worktree, 'node_modules/electron')),
        args: [state.worktree],
        cwd: state.worktree,
        env: {
            ...process.env, YAIRPG_HIDDEN: '1', YAIRPG_FROZEN: '1', YAIRPG_SERVE_LOG: '1', YAIRPG_MIRROR: '0',
            YAIRPG_USER_DATA: userData, YAIRPG_DOWNLOAD_DIR: path.join(path.dirname(userData), 'downloads'), ...extraEnv,
        },
    });
    const page = await app.firstWindow();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    return { app, page, errors };
}

async function play(page) {
    await page.locator('#loading_screen_play_button:not(.none_display)').click({ timeout: 30000 });
    const confirm = page.locator('#hero_creation_panel_confirmation');
    const village = page.locator('#location_actions_div .location_choice_dropdown').first();
    await Promise.race([
        confirm.waitFor({ state: 'visible', timeout: 30000 }),
        village.waitFor({ state: 'visible', timeout: 30000 }),
    ]);
    if (await confirm.isVisible().catch(() => false)) await confirm.click();
    await village.waitFor({ state: 'visible', timeout: 30000 });
}

// Non-content facts only: whether a save exists and how long it is.
const saveFacts = page => page.evaluate(() => {
    const raw = localStorage.getItem('save data');
    return { hasSave: !!raw, saveBytes: raw ? raw.length : 0 };
});

// ---- commands ----

function prepare(opts) {
    const main = mainCheckout();
    const sha = git(ROOT, 'rev-parse', '--verify', `${opts.commit}^{commit}`);
    const worktree = path.join(WORK, 'worktree');
    if (fs.existsSync(WORK)) {
        try { git(main, 'worktree', 'remove', '--force', worktree); } catch { /* not registered */ }
        fs.rmSync(WORK, { recursive: true, force: true });
        git(main, 'worktree', 'prune');
    }
    fs.mkdirSync(WORK, { recursive: true });
    git(main, 'worktree', 'add', '--detach', worktree, sha);

    // Gitignored inputs a snapshot needs, linked from the main checkout.
    const links = ['node_modules', 'private_packs', 'resources/fonts/private'];
    for (const rel of links) {
        const from = path.join(main, rel);
        if (!fs.existsSync(from)) { log(`note: ${rel} not found in ${main}; skipped`); continue; }
        fs.mkdirSync(path.dirname(path.join(worktree, rel)), { recursive: true });
        fs.rmSync(path.join(worktree, rel), { recursive: true, force: true });
        fs.symlinkSync(from, path.join(worktree, rel));
    }
    log(`Building ${sha.slice(0, 9)} in ${worktree}`);
    execFileSync(process.execPath, ['build.js'], { cwd: worktree, stdio: ['ignore', 'ignore', 'inherit'] });

    const candidateData = path.join(WORK, 'candidate');
    const snap = loadSnapshot(worktree);
    const made = snap.makeSnapshot(worktree, candidateData);
    const files = listTree(made.root);

    const profile = playerProfile();
    const currentId = snap.readPointer(profile, 'current.json');
    const diff = currentId ? diffFiles(listTree(snap.snapshotRoot(profile, currentId)), files) : { missing: [], added: files };
    const state = { sha, worktree, main, id: made.id, snapshotDir: made.root, files, previous: { current: currentId, latest: snap.readPointer(profile, 'latest.json') }, preparedAt: new Date().toISOString() };
    fs.writeFileSync(STATE, JSON.stringify(state, null, 1));

    log(`Candidate ${made.id} (${files.length} files), commit ${sha}`);
    log(`Player's current snapshot: ${currentId || 'none'}`);
    log(`Missing from candidate (${diff.missing.length}):${diff.missing.length ? '\n  ' + diff.missing.join('\n  ') : ' none'}`);
    log(`Added by candidate (${diff.added.length}):${diff.added.length ? '\n  ' + diff.added.slice(0, 60).join('\n  ') + (diff.added.length > 60 ? `\n  ... ${diff.added.length - 60} more` : '') : ' none'}`);
    log('Next: verify');
}

async function verify() {
    const state = loadState();
    const profile = playerProfile();
    if (findRunning(psLines()).length) log('warning: the player\'s app looks open; the copy may be torn');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-adopt-verify-'));
    const userData = path.join(dir, 'userData');
    const report = { candidate: state.id, commit: state.sha };
    try {
        copyProfile(profile, userData);
        installCandidate(state, userData);
        const { app, page, errors } = await launchHidden(state, userData);
        try {
            report.servedBuildId = (await app.evaluate(() => globalThis.yairpgServing())).id;
            report.url = page.url();
            report.saveBefore = await saveFacts(page);
            await play(page);
            await page.waitForTimeout(2000);
            await page.locator('#save_button').click();
            report.saveAfterSave = await saveFacts(page);
            await page.reload();
            await play(page);
            report.saveAfterReload = await saveFacts(page);
            const log_ = await app.evaluate(() => globalThis.yairpgServeLog);
            report.missingFiles = log_.misses;
            report.pageErrors = errors;
        } finally {
            await app.close();
        }
        report.result = report.servedBuildId === state.id && !report.pageErrors.length && !report.missingFiles.length && report.saveAfterReload.hasSave ? 'PASS' : 'FAIL';
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
    report.profileCopyDeleted = true;
    log(JSON.stringify(report, null, 1));
    if (report.result !== 'PASS') process.exitCode = 1;
}

async function measure() {
    const state = loadState();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-adopt-measure-'));
    const userData = path.join(dir, 'userData');
    const report = { candidate: state.id, commit: state.sha };
    try {
        installCandidate(state, userData);
        const { app, page, errors } = await launchHidden(state, userData);
        try {
            // Records the first 4 ms poll in which the PLAY button is shown.
            // Installed before a reload so it sees the whole load (cache warm).
            await page.addInitScript(() => {
                const t = window.__adoptTimes = {};
                const shown = el => !!el && el.getClientRects().length > 0 && !el.classList.contains('none_display');
                const tick = () => {
                    if (!t.play && shown(document.getElementById('loading_screen_play_button'))) t.play = performance.now();
                    if (!t.play) setTimeout(tick, 4);
                };
                tick();
            });
            await page.reload();
            const playButton = page.locator('#loading_screen_play_button:not(.none_display)');
            await playButton.waitFor({ timeout: 30000 });
            await page.waitForTimeout(300);
            report.firstContentfulPaintMs = await page.evaluate(() => Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? -1));
            await page.evaluate(() => { window.__adoptTimes.clicked = performance.now(); });
            await playButton.click();
            const confirm = page.locator('#hero_creation_panel_confirmation');
            const village = page.locator('#location_actions_div .location_choice_dropdown').first();
            await Promise.race([confirm.waitFor({ state: 'visible', timeout: 30000 }), village.waitFor({ state: 'visible', timeout: 30000 })]);
            if (await confirm.isVisible().catch(() => false)) await confirm.click();
            await village.waitFor({ state: 'visible', timeout: 30000 });
            const t = await page.evaluate(() => ({ ...window.__adoptTimes, workspace: performance.now() }));
            report.playScreenMs = Math.round(t.play);
            report.workspaceAfterPlayMs = Math.round(t.workspace - t.clicked);
            report.note = 'Fresh profile; times are from a reload with the cache warm, ms from navigation start (play) or from the PLAY click (workspace, includes hero creation, one confirm click and a few ms of tool latency).';
            report.domNodesAfterPlay = await page.evaluate(() => document.querySelectorAll('*').length);
            report.pageErrors = errors;
        } finally {
            await app.close();
        }
        const bundle = path.join(state.snapshotDir, 'dist/bundle.js');
        report.bundleBytes = fs.statSync(bundle).size;
        report.snapshotFiles = state.files.length;
        report.snapshotBytes = state.files.reduce((n, f) => n + fs.statSync(path.join(state.snapshotDir, f)).size, 0);
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
    log(JSON.stringify(report, null, 1));
}

const psLines = () => execFileSync('ps', ['-axo', 'pid=,command='], { encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n').filter(Boolean);

function swap(opts) {
    if (!opts.yes) throw new Error('swap changes the player\'s app. It needs Weibao\'s explicit yes: rerun with --yes after he says so.');
    const state = loadState();
    const running = findRunning(psLines());
    if (running.length) throw new Error(`Refusing to swap: the app looks open.\n  ${running.slice(0, 5).map(l => l.trim().slice(0, 160)).join('\n  ')}\nQuit it, then rerun.`);
    const profile = playerProfile();
    if (!fs.existsSync(profile)) throw new Error(`No profile at ${profile}`);
    const snap = loadSnapshot(state.worktree);
    const label = opts.label || `adopt-${state.id}`;
    const backupRoot = path.join(os.homedir(), '.codex/reconciliation-backups', `${dateStamp()}-${label}`);
    const backup = path.join(backupRoot, 'normal-profile-before');
    const manifest = path.join(backupRoot, 'normal-profile-before.sha256');
    if (fs.existsSync(backup)) throw new Error(`Backup already exists at ${backup}; pick another --label.`);

    fs.mkdirSync(backupRoot, { recursive: true });
    fs.cpSync(profile, backup, { recursive: true, preserveTimestamps: true });
    const count = writeManifest(backup, manifest);
    const source = checkAgainstManifest(profile, manifest);
    if (source.problems.length) throw new Error(`Backup does not match the profile (${source.problems.length}); nothing was changed:\n  ${source.problems.slice(0, 10).join('\n  ')}`);
    log(`Backup: ${count} files SHA-256 verified in ${backup}`);

    const before = { current: snap.readPointer(profile, 'current.json'), latest: snap.readPointer(profile, 'latest.json') };
    const target = installCandidate(state, profile);
    const isBuilds = rel => rel === 'builds' || rel.startsWith('builds/');
    const after = checkAgainstManifest(profile, manifest, { ignore: isBuilds });
    const installed = listTree(target);
    const sameFiles = installed.length === state.files.length && state.files.every(f => installed.includes(f) && sha256File(path.join(target, f)) === sha256File(path.join(state.snapshotDir, f)));
    log(`Non-builds files vs backup: ${after.problems.length ? 'MISMATCH\n  ' + after.problems.slice(0, 10).join('\n  ') : `all ${after.count - [...readManifest(manifest).keys()].filter(isBuilds).length} match`}`);
    log(`Installed ${state.id}: ${installed.length} files, ${sameFiles ? 'byte-identical to the verified candidate' : 'DIFFERS from the verified candidate'}`);
    log(`Pointers: current ${before.current} -> ${state.id}, latest ${before.latest} -> ${state.id}`);
    log('Rollback (app closed):');
    log(`  Previous snapshot ${before.current} stays in builds/ unless pruned. Point current.json and latest.json at it:`);
    log(`    node -e "const s=require('${path.join(state.worktree, 'desktop/snapshot.cjs')}');const u='${profile}';s.writePointer(u,'latest.json','${before.current}');s.writePointer(u,'current.json','${before.current}')"`);
    log(`  Full restore: replace builds/ and every other changed file from ${backup} (manifest ${manifest}).`);
    if (after.problems.length || !sameFiles) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
        const opts = parseArgs(process.argv.slice(2));
        if (opts.command === 'prepare') prepare(opts);
        else if (opts.command === 'verify') await verify();
        else if (opts.command === 'measure') await measure();
        else swap(opts);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}
