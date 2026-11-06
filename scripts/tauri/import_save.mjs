#!/usr/bin/env node
// Bring the Electron app's newest save into the Tauri app as a backup (N9 save move).
// Copies, never moves: the Electron profile and its mirror stay untouched. The
// next Tauri launch opens the recovery page with the copy listed; the save
// changes host only when the player clicks Restore there.
//
//   node scripts/tauri/import_save.mjs            (dry run: shows what would be copied)
//   node scripts/tauri/import_save.mjs --yes
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);
const {hashEntries, hasSave} = require(path.join(ROOT, 'desktop/save_mirror.cjs'));
const {defaultUserData} = require(path.join(ROOT, 'desktop/snapshot.cjs'));
const from = path.join(defaultUserData(ROOT), 'save-mirror/latest.json');
const mirror = path.join(os.homedir(), 'Library/Application Support/local.yairpg.tauri/save-mirror');

const snapshot = JSON.parse(fs.readFileSync(from, 'utf8'));
if (snapshot.schema !== 1 || !hasSave(snapshot.entries)) { console.error(`No usable save in ${from}`); process.exit(2); }
const hash = hashEntries(snapshot.entries);
const at = new Date(snapshot.savedAt);
const pad = n => String(n).padStart(2, '0');
const id = `${at.getFullYear()}${pad(at.getMonth() + 1)}${pad(at.getDate())}-${pad(at.getHours())}${pad(at.getMinutes())}${pad(at.getSeconds())}-${hash.slice(0, 8)}`;
const target = path.join(mirror, 'history', `${id}.json.gz`);
console.log(`Electron save: saved ${snapshot.savedAt} (${snapshot.reason}), ${Object.keys(snapshot.entries).length} storage keys.`);
console.log(`Would copy to ${target} and open the Tauri recovery page on next launch.`);
if (!process.argv.includes('--yes')) { console.log('Dry run. Add --yes to copy.'); process.exit(0); }
fs.mkdirSync(path.dirname(target), {recursive: true});
const copy = {...snapshot, reason: 'from-electron'};
const temp = `${target}.${process.pid}.tmp`;
fs.writeFileSync(temp, zlib.gzipSync(JSON.stringify(copy)));
fs.renameSync(temp, target);
fs.writeFileSync(path.join(mirror, 'import-pending'), JSON.stringify({id, from, at: new Date().toISOString()}));
console.log(`Copied. Open the Tauri app and click Restore next to "${at.toLocaleString()} (from-electron)".`);
