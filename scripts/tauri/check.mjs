#!/usr/bin/env node
// `npm run check:tauri`: the hidden Tauri host checks (N5), which replaced
// the Electron `check:desktop` suite. Runs the harness scenarios once on the fresh fixture
// and asserts each one. Build first: `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
execFileSync('cargo', ['build', '--release', '--offline', '--jobs', '4', '--manifest-path', path.join(ROOT, 'desktop-tauri/Cargo.toml')], {stdio: ['ignore', 'ignore', 'inherit']});
const out = execFileSync(process.execPath, [path.join(ROOT, 'scripts/tauri/harness.mjs'), '--variants', 'base,hang,crash,reset,frozen,popout,import,wipe', '--fixtures', 'fresh', '--seconds', '4'], {encoding: 'utf8'});
const summary = JSON.parse(fs.readFileSync(path.join(ROOT, out.match(/summary: (.+)$/m)[1]), 'utf8'));
const row = name => summary.rows.find(r => r.name === name) || {};
const clean = r => !r.timedOut && !r.failed && !(r.errors || []).length && !(r.misses || []).length;
const checks = [
    ['tauri_smoke', () => { const r = row('base-fresh-1'); return clean(r) && r.launchToReadyS > 0 && r.gameMinPerWallS > 0.5; }],
    ['tauri_quit_save', () => row('base-fresh-1').cleanQuitKept === true && row('base-kill').killKept === true],
    ['tauri_save_mirror', () => ['hang-fresh-1', 'crash-fresh-1'].every(n => row(n).mirrorFiles?.includes('latest.json') && row(n).mirrorFiles.length >= 2)],
    ['tauri_hang_guard', () => { const r = row('hang-fresh-1'); return r.recoverReason === 'hung' && r.backups >= 1 && r.restoreKept; }],
    ['tauri_crash_guard', () => { const r = row('crash-fresh-1'); return r.recoverReason === 'crashed' && r.backups >= 1 && r.restoreKept; }],
    ['tauri_reset_dialog', () => { const r = row('reset-fresh-1'); return r.dialog?.blockedWrong && r.dialog?.enabledRight && r.freshGame; }],
    ['tauri_presence_popout', () => { const r = row('popout-fresh-1'); return r.attention?.count === 2 && r.attention.notified === false && r.capabilities?.includes('projection') && r.popoutShown >= 1 && !r.errors.length; }],
    ['tauri_save_import', () => { const r = row('import-fresh-1'); return r.recoverReason === 'import' && r.backups >= 1 && r.restoreKept && r.markerGone; }],
    ['tauri_store_wipe', () => { const r = row('wipe-fresh-1'); return r.wipeKept && r.storeFile && !r.errors.length; }],
    ['tauri_frozen_build', () => { const r = row('frozen-fresh-1'); return clean(r) && r.switched && r.saveKept; }],
];
let failed = 0;
for (const [name, ok] of checks) {
    const pass = (() => { try { return !!ok(); } catch { return false; } })();
    if (!pass) failed++;
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}`);
}
if (failed) { console.log(`Details: ${out.match(/summary: (.+)$/m)[1]}`); process.exit(1); }
