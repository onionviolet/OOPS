#!/usr/bin/env node
// The Tauri desktop app (N5): bundle, install, snapshot and launch.
//
//   node scripts/tauri/app.mjs bundle     release build → desktop-tauri/target/bundle/Yet Another Idle RPG.app
//   node scripts/tauri/app.mjs install    bundle, then copy to ~/Applications (replaces the previous copy)
//   node scripts/tauri/app.mjs snapshot   freeze the current page files into the app's builds (offered to an open game)
//   node scripts/tauri/app.mjs open       open the installed app
//
// Built with macOS tools only (sips, iconutil, codesign ad hoc); no Tauri CLI download.
// The app serves frozen builds from ~/Library/Application Support/local.yairpg.tauri,
// so it keeps working while this checkout changes.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const NAME = 'Yet Another Idle RPG';
const ID = 'local.yairpg.tauri';
const BIN = path.join(ROOT, 'desktop-tauri/target/release/yairpg-tauri');
const BUNDLE = path.join(ROOT, 'desktop-tauri/target/bundle', `${NAME}.app`);
const INSTALLED = path.join(os.homedir(), 'Applications', `${NAME}.app`);
const APP_DATA = path.join(os.homedir(), 'Library/Application Support', ID);
const run = (cmd, args, opts = {}) => String(execFileSync(cmd, args, {stdio: ['ignore', 'pipe', 'inherit'], ...opts}) ?? '').trim();
const version = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'desktop-tauri/tauri.conf.json'), 'utf8')).version;

function icon(target) {
    const src = path.join(ROOT, 'resources/img/oops-icon.png');
    const set = path.join(path.dirname(target), 'icon.iconset');
    fs.rmSync(set, {recursive: true, force: true});
    fs.mkdirSync(set, {recursive: true});
    for (const size of [16, 32, 128, 256, 512]) {
        run('sips', ['-z', String(size), String(size), src, '--out', path.join(set, `icon_${size}x${size}.png`)]);
        run('sips', ['-z', String(size * 2), String(size * 2), src, '--out', path.join(set, `icon_${size}x${size}@2x.png`)]);
    }
    run('iconutil', ['-c', 'icns', set, '-o', target]);
    fs.rmSync(set, {recursive: true, force: true});
}

function bundle() {
    run('cargo', ['build', '--release', '--offline', '--jobs', '4', '--manifest-path', path.join(ROOT, 'desktop-tauri/Cargo.toml')], {stdio: ['ignore', 'ignore', 'inherit']});
    fs.rmSync(BUNDLE, {recursive: true, force: true});
    const contents = path.join(BUNDLE, 'Contents');
    fs.mkdirSync(path.join(contents, 'MacOS'), {recursive: true});
    fs.mkdirSync(path.join(contents, 'Resources'), {recursive: true});
    fs.copyFileSync(BIN, path.join(contents, 'MacOS/yairpg-tauri'));
    fs.chmodSync(path.join(contents, 'MacOS/yairpg-tauri'), 0o755);
    icon(path.join(contents, 'Resources/icon.icns'));
    fs.writeFileSync(path.join(contents, 'Info.plist'), `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleName</key><string>${NAME}</string>
<key>CFBundleDisplayName</key><string>${NAME}</string>
<key>CFBundleIdentifier</key><string>${ID}</string>
<key>CFBundleExecutable</key><string>yairpg-tauri</string>
<key>CFBundleIconFile</key><string>icon</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleShortVersionString</key><string>${version()}</string>
<key>CFBundleVersion</key><string>${version()}</string>
<key>LSMinimumSystemVersion</key><string>14.0</string>
<key>LSApplicationCategoryType</key><string>public.app-category.role-playing-games</string>
<key>NSHighResolutionCapable</key><true/>
</dict></plist>
`);
    run('codesign', ['--force', '--sign', '-', '--timestamp=none', BUNDLE]);
    run('codesign', ['--verify', '--strict', BUNDLE]);
    const kb = Math.round(Number(run('du', ['-sk', BUNDLE]).split('\t')[0]));
    console.log(`Bundled ${path.relative(ROOT, BUNDLE)} (${(kb / 1024).toFixed(1)} MB, ad hoc signed)`);
}

function install() {
    bundle();
    fs.mkdirSync(path.dirname(INSTALLED), {recursive: true});
    fs.rmSync(INSTALLED, {recursive: true, force: true});
    fs.cpSync(BUNDLE, INSTALLED, {recursive: true, verbatimSymlinks: true});
    run('codesign', ['--verify', '--strict', INSTALLED]);
    console.log(`Installed ${INSTALLED}`);
    snapshot();
}

function snapshot() {
    console.log(run(process.execPath, [path.join(ROOT, 'desktop/snapshot.cjs'), '--from', ROOT], {env: {...process.env, YAIRPG_USER_DATA: APP_DATA}}));
}

const command = process.argv[2];
if (command === 'bundle') bundle();
else if (command === 'install') install();
else if (command === 'snapshot') snapshot();
else if (command === 'open') run('open', [INSTALLED]);
else { console.error('Usage: app.mjs bundle | install | snapshot | open'); process.exit(2); }
