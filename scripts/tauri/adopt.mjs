#!/usr/bin/env node
// Adopt a commit into the normal Tauri app (MDL16 for the Tauri host, N4).
// Same three steps as the retired Electron adopt_candidate.mjs; only the last touches the
// player's app folder, and never the save itself.
//
//   node scripts/tauri/adopt.mjs prepare --commit <sha>   scratch worktree, build, snapshot
//   node scripts/tauri/adopt.mjs verify                   hidden frozen Tauri on a scratch folder,
//                                                         seeded with a COPY of the player's newest mirrored save
//   node scripts/tauri/adopt.mjs swap --yes               install the snapshot as the app's latest build;
//                                                         an open game offers "Save and reload", a closed one starts on it
//
// Scratch: work/tauri-adopt/. Player folder: ~/Library/Application Support/local.yairpg.tauri.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WORK = path.join(ROOT, 'work/tauri-adopt');
const STATE = path.join(WORK, 'state.json');
const APP_DATA = path.join(os.homedir(), 'Library/Application Support/local.yairpg.tauri');
const require = createRequire(import.meta.url);
const snap = require(path.join(ROOT, 'scripts/tauri/snapshot.cjs'));
const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const git = (cwd, ...a) => execFileSync('git', a, {cwd}).toString().trim();
const log = (...a) => console.log(...a);
const listTree = dir => {
    const out = [];
    const walk = rel => { for (const e of fs.readdirSync(path.join(dir, rel), {withFileTypes: true})) { const r = rel ? `${rel}/${e.name}` : e.name; if (e.isDirectory()) walk(r); else out.push(r); } };
    walk('');
    return out.sort();
};

function prepare() {
    const commit = opt('--commit') || 'HEAD';
    const sha = git(ROOT, 'rev-parse', '--verify', `${commit}^{commit}`);
    const worktree = path.join(WORK, 'worktree');
    if (fs.existsSync(WORK)) {
        try { git(ROOT, 'worktree', 'remove', '--force', worktree); } catch { /* not registered */ }
        fs.rmSync(WORK, {recursive: true, force: true});
        git(ROOT, 'worktree', 'prune');
    }
    fs.mkdirSync(WORK, {recursive: true});
    git(ROOT, 'worktree', 'add', '--detach', worktree, sha);
    for (const rel of ['node_modules', 'private_packs', 'resources/fonts/private']) {
        const from = path.join(ROOT, rel);
        if (!fs.existsSync(from)) continue;
        fs.mkdirSync(path.dirname(path.join(worktree, rel)), {recursive: true});
        fs.rmSync(path.join(worktree, rel), {recursive: true, force: true});
        fs.symlinkSync(from, path.join(worktree, rel));
    }
    log(`Building ${sha.slice(0, 9)} in ${path.relative(ROOT, worktree)}`);
    execFileSync(process.execPath, ['build.js'], {cwd: worktree, stdio: ['ignore', 'ignore', 'inherit']});
    const candidate = path.join(WORK, 'candidate');
    const made = snap.makeSnapshot(worktree, candidate);
    const current = snap.readPointer(APP_DATA, 'current.json');
    const files = listTree(made.root);
    const old = current ? listTree(snap.snapshotRoot(APP_DATA, current)) : [];
    const missing = old.filter(f => !files.includes(f)), added = files.filter(f => !old.includes(f));
    fs.writeFileSync(STATE, JSON.stringify({sha, worktree, id: made.id, candidate, snapshotDir: made.root, files: files.length, current, preparedAt: new Date().toISOString()}, null, 1));
    log(`Candidate ${made.id} (${files.length} files). App's current build: ${current || 'none'}`);
    log(`Missing from candidate: ${missing.length ? missing.slice(0, 40).join(', ') : 'none'}`);
    log(`Added by candidate: ${added.length}${current ? '' : ' (no current build to compare)'}`);
    log('Next: verify');
}

function newestSave() {
    // Tauri mirror first, then the Electron one; a copy, never the original.
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    for (const dir of [path.join(APP_DATA, 'save-mirror'), path.join(snap.defaultUserData(ROOT), 'save-mirror')]) {
        try {
            const latest = JSON.parse(fs.readFileSync(path.join(dir, 'latest.json'), 'utf8'));
            const raw = latest.entries?.['save data'];
            if (raw) return {save: JSON.parse(raw), from: dir.includes('local.yairpg.tauri') ? 'tauri mirror' : `electron mirror (${pkg.productName || pkg.name})`, savedAt: latest.savedAt};
        } catch { /* none here */ }
    }
    return null;
}

function verify() {
    const state = JSON.parse(fs.readFileSync(STATE, 'utf8'));
    const userData = path.join(WORK, 'verify');
    fs.rmSync(userData, {recursive: true, force: true});
    fs.cpSync(state.candidate, userData, {recursive: true});
    const found = newestSave();
    const fixtureArgs = [];
    if (found) {
        const file = path.join(WORK, 'player-save-copy.json');
        fs.writeFileSync(file, JSON.stringify(found.save), {mode: 0o600});
        fixtureArgs.push('--fixture-file', file);
        log(`Seeding a copy of the newest save from the ${found.from} (saved ${found.savedAt}).`);
    } else log('No mirrored player save found; verifying with the crowded perf fixture.');
    const out = execFileSync(process.execPath, [path.join(ROOT, 'scripts/tauri/harness.mjs'), '--variants', 'frozen-run', '--fixtures', 'crowded',
        '--seconds', '10', '--user-data', userData, ...fixtureArgs], {encoding: 'utf8'});
    fs.rmSync(path.join(WORK, 'player-save-copy.json'), {force: true});
    const row = JSON.parse(out.split('\n').find(l => l.startsWith('{"name":"frozen-run')));
    const served = snap.readPointer(userData, 'current.json');
    // Facts only: no save contents leave the run.
    const facts = {build: served, expectedBuild: state.id, launchToReadyS: row.launchToReadyS, gameMinPerWallS: row.gameMinPerWallS,
        misses: row.misses, errors: row.errors, failed: row.failed, saveKeptAcrossQuit: row.cleanQuitKept};
    fs.writeFileSync(path.join(WORK, 'verify.json'), JSON.stringify(facts, null, 1));
    const ok = served === state.id && !row.failed && !row.errors.length && !row.misses.length && row.cleanQuitKept;
    log(JSON.stringify(facts));
    log(ok ? 'PASS. Next: swap --yes (needs Weibao\'s yes).' : 'FAIL: do not swap.');
    if (!ok) process.exitCode = 1;
}

function swap() {
    if (!args.includes('--yes')) { console.error('swap needs --yes (Weibao\'s explicit approval).'); process.exit(2); }
    const state = JSON.parse(fs.readFileSync(STATE, 'utf8'));
    const verified = JSON.parse(fs.readFileSync(path.join(WORK, 'verify.json'), 'utf8'));
    if (verified.build !== state.id) { console.error('verify did not pass for this candidate.'); process.exit(2); }
    const target = path.join(APP_DATA, 'builds', state.id);
    fs.mkdirSync(path.join(APP_DATA, 'builds'), {recursive: true});
    if (!fs.existsSync(path.join(target, 'index.html'))) {
        const temp = path.join(APP_DATA, 'builds', `.tmp-${state.id}-${process.pid}`);
        fs.rmSync(temp, {recursive: true, force: true});
        fs.cpSync(state.snapshotDir, temp, {recursive: true});
        fs.renameSync(temp, target);
    }
    const before = snap.readPointer(APP_DATA, 'current.json');
    snap.writePointer(APP_DATA, 'latest.json', state.id, {files: state.files, commit: state.sha});
    log(`Installed ${state.id} as the app's latest build (commit ${state.sha.slice(0, 9)}).`);
    log('An open game shows "New build ready"; a closed one starts on it next launch.');
    if (before) log(`Rollback: node -e "require('./scripts/tauri/snapshot.cjs').writePointer(process.argv[1],'latest.json',process.argv[2])" "${APP_DATA}" ${before}`);
}

const command = args[0];
if (command === 'prepare') prepare();
else if (command === 'verify') verify();
else if (command === 'swap') swap();
else { console.error('Usage: adopt.mjs prepare --commit <sha> | verify | swap --yes'); process.exit(2); }
