'use strict';
// Pop-out panels (A3): host windows that only show projections the game page
// sends (src/host.js). They never boot the game, so the page stays the one
// state owner. Opened from the View menu, never by the host on its own.
const { BrowserWindow, ipcMain } = require('electron');
const { APP_ORIGIN } = require('./app_path.cjs');
const { POPOUT_PATH, cleanProjection } = require('./popout_page.cjs');
const { background, isAppUrl, webPreferences, capabilities, popouts } = require('./host_context.cjs');

capabilities.push('projection');

const projections = new Map();   // panel -> last cleaned payload

ipcMain.on('yairpg:projection', (event, name, data) => {
    if ([...popouts.values()].some(w => !w.isDestroyed() && w.webContents.id === event.sender.id)) return;
    if (!isAppUrl(event.sender.getURL())) return;
    const clean = cleanProjection(name, data);
    if (!clean) return;
    projections.set(name, clean);
    const win = popouts.get(name);
    if (win && !win.isDestroyed()) win.webContents.send('yairpg:projection', name, clean);
});
ipcMain.handle('yairpg:projection-latest', (_event, name) => projections.get(name) || null);

function openPopout(panel) {
    const existing = popouts.get(panel);
    if (existing && !existing.isDestroyed()) { if (existing.isMinimized()) existing.restore(); existing.show(); existing.focus(); return existing; }
    const win = new BrowserWindow({
        width: 480, height: 720, minWidth: 320, minHeight: 320, backgroundColor: '#1b1b1b',
        title: 'YAIRPG: world events', show: !background, webPreferences,
    });
    popouts.set(panel, win);
    win.on('closed', () => popouts.delete(panel));
    win.loadURL(`${APP_ORIGIN}${POPOUT_PATH}?panel=${encodeURIComponent(panel)}`);
    return win;
}
globalThis.yairpgOpenPopout = openPopout;   // test hook

// A pop-out never outlives the game window.
function closePopouts() { for (const p of popouts.values()) if (!p.isDestroyed()) p.close(); }

module.exports = { openPopout, closePopouts };
