'use strict';
// Save mirror wiring (A1): polls the page's storage into files, takes a final
// snapshot on close, and serves the recovery page's backup list and restore.
// The file format and retention live in desktop/save_mirror.cjs.
const path = require('node:path');
const fs = require('node:fs');
const { app, ipcMain, shell } = require('electron');
const { RECOVER_PATH } = require('./recover_page.cjs');
const { createMirror, READ_STORAGE_SOURCE } = require('./save_mirror.cjs');
const { background, isAppUrl, withTimeout, capabilities } = require('./host_context.cjs');

// Save mirror (A1). Background runs mirror only when YAIRPG_MIRROR=1, so agent
// checks leave no files unless they test this. YAIRPG_MIRROR=0 turns it off.
// YAIRPG_MIRROR_MS sets the poll gap (default 30 s).
const mirrorOn = process.env.YAIRPG_MIRROR === '1' || (!background && process.env.YAIRPG_MIRROR !== '0');
const mirror = mirrorOn ? createMirror(path.join(app.getPath('userData'), 'save-mirror')) : null;
const mirrorGapMs = Number(process.env.YAIRPG_MIRROR_MS) || 30000;
const mirrorSkipUrl = url => !isAppUrl(url) || new URL(url).pathname === RECOVER_PATH;

if (mirror) capabilities.push('mirror');

// Reads the page's storage. saveFirst asks the game to save through its own
// saveProgress before reading (quit and the menu); a hung page just times out.
async function readEntries(contents, { saveFirst = false, timeoutMs = 4000 } = {}) {
    if (contents.isDestroyed() || contents.isCrashed() || contents.isLoading() || mirrorSkipUrl(contents.getURL())) return null;
    const source = saveFirst
        ? `(() => { try { window.saveProgress && window.saveProgress(); } catch {} return ${READ_STORAGE_SOURCE}; })()`
        : READ_STORAGE_SOURCE;
    try { return await withTimeout(contents.executeJavaScript(source), timeoutMs); } catch { return null; }
}

let mirrorBusy = false;
async function mirrorWindow(win, options = {}) {
    // A poll yields to a read in flight; a quit read always runs.
    if (!mirror || (mirrorBusy && options.reason === 'poll') || win.isDestroyed()) return;
    if (options.reason === 'poll') mirrorBusy = true;
    try {
        const entries = await readEntries(win.webContents, options);
        if (entries) mirror.record(entries, options);
    } catch (error) {
        console.warn('[yairpg] save mirror failed:', error.message);
    } finally { if (options.reason === 'poll') mirrorBusy = false; }
}

ipcMain.handle('yairpg:mirror-list', () => (mirror ? mirror.list() : []));
// Restore only from the recovery page, on the player's click. The current
// state is kept as a snapshot first, so a restore can itself be undone.
ipcMain.handle('yairpg:mirror-restore', async (event, id) => {
    if (!mirror || typeof id !== 'string') return false;
    const frame = event.senderFrame;
    if (!frame || !isAppUrl(frame.url) || new URL(frame.url).pathname !== RECOVER_PATH) return false;
    const snapshot = mirror.read(id);
    const current = await withTimeout(event.sender.executeJavaScript(READ_STORAGE_SOURCE), 4000);
    if (current) mirror.record(current, { reason: 'pre-restore', force: true });
    await event.sender.executeJavaScript(
        `(() => { const e = ${JSON.stringify(snapshot.entries)}; localStorage.clear(); for (const k of Object.keys(e)) localStorage.setItem(k, e[k]); return true; })()`);
    return true;
});

// Polls the window's storage into the mirror, and on close takes a final
// snapshot first: save through the game, copy, then close for real. The read
// is time-limited so a hung page can never block quitting.
function attachMirror(win) {
    if (!mirror) return;
    const timer = setInterval(() => mirrorWindow(win, { reason: 'poll' }), mirrorGapMs);
    win.on('closed', () => clearInterval(timer));
    let finishing = false;
    win.on('close', event => {
        if (finishing) return;
        finishing = true;
        event.preventDefault();
        mirrorWindow(win, { reason: 'close', saveFirst: true, force: true, timeoutMs: 1500 })
            .finally(() => { if (!win.isDestroyed()) win.close(); });
    });
}

function showBackups() {
    if (!mirror) return;
    fs.mkdirSync(mirror.dir, { recursive: true });
    shell.openPath(mirror.dir);
}

module.exports = { attachMirror, showBackups };
