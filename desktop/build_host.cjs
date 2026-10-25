'use strict';
// What app://yairpg serves, and frozen builds (EL18).
const path = require('node:path');
const fs = require('node:fs');
const { app, BrowserWindow, ipcMain } = require('electron');
const { makeSnapshot, readPointer, writePointer, snapshotRoot, buildsDir } = require('./snapshot.cjs');
const { ROOT, hidden } = require('./host_context.cjs');

// What app://yairpg serves (EL18). YAIRPG_ROOT always serves that folder live.
// Hidden runs serve the working tree so checks test it, unless YAIRPG_FROZEN=1
// asks for the player's frozen path. Everything else serves a snapshot.
const liveRoot = process.env.YAIRPG_ROOT ? path.resolve(process.env.YAIRPG_ROOT)
    : (hidden && process.env.YAIRPG_FROZEN !== '1' ? ROOT : null);
const serving = { id: liveRoot ? 'live' : null, root: liveRoot, announced: null };
// Test hook: YAIRPG_SERVE_LOG=1 records which root served each request and
// which paths were missing, for app.evaluate in scripts/desktop_*.cjs.
const serveLog = process.env.YAIRPG_SERVE_LOG === '1' ? (globalThis.yairpgServeLog = { served: [], misses: [] }) : null;
globalThis.yairpgServing = () => ({ ...serving });

// Frozen builds: serve the newest snapshot at launch (making one from the
// working tree on first run), then tell open pages when a newer one appears.
// The page asks to adopt it; the host never reloads on its own.
function startFrozenBuilds() {
    const userData = app.getPath('userData');
    let id = readPointer(userData, 'latest.json');
    if (!id) id = makeSnapshot(ROOT, userData).id;
    serving.id = id;
    serving.root = snapshotRoot(userData, id);
    writePointer(userData, 'current.json', id);

    const latestFile = path.join(buildsDir(userData), 'latest.json');
    const poll = Number(process.env.YAIRPG_BUILD_POLL_MS) || 3000;
    fs.watchFile(latestFile, { interval: poll }, () => {
        const latest = readPointer(userData, 'latest.json');
        if (!latest || latest === serving.id || latest === serving.announced) return;
        serving.announced = latest;
        for (const win of BrowserWindow.getAllWindows()) announceBuild(win.webContents);
    });

    ipcMain.handle('yairpg:adopt-build', event => {
        const next = serving.announced;
        if (!next || readPointer(userData, 'latest.json') !== next) return false;
        serving.id = next;
        serving.root = snapshotRoot(userData, next);
        serving.announced = null;
        writePointer(userData, 'current.json', next);
        event.sender.reloadIgnoringCache();
        return true;
    });
}

function announceBuild(contents) {
    if (serving.announced && !contents.isDestroyed()) contents.send('yairpg:build-ready', { id: serving.announced, serving: serving.id });
}

// A live root has nothing to adopt; a frozen one starts the snapshot watcher.
function startBuilds() {
    if (!serving.root) startFrozenBuilds();
    else ipcMain.handle('yairpg:adopt-build', () => false);
}

module.exports = { serving, serveLog, startBuilds, announceBuild };
