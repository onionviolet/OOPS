'use strict';
// Desktop presence (A4). The page reports how many leads wait (src/host.js).
// The Dock badge follows the count. A notification appears only when the count
// rises, the window is not focused, and at most once a minute; clicking it is
// the only thing that brings the window forward (EL32). Background runs show
// nothing. globalThis.yairpgAttention is the test hook.
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const { background, isAppUrl, capabilities } = require('./host_context.cjs');

capabilities.push('attention');

const attention = globalThis.yairpgAttention = { count: 0, label: '', notified: 0, lastAt: 0 };
ipcMain.on('yairpg:attention', (event, count, label) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win || win.getParentWindow() || !isAppUrl(event.sender.getURL())) return;
    const rose = count > attention.count;
    attention.count = count;
    attention.label = label;
    if (background) return;
    app.dock?.setBadge(count > 0 ? String(count) : '');
    if (!rose || win.isFocused() || Date.now() - attention.lastAt < 60000 || !Notification.isSupported()) return;
    attention.lastAt = Date.now();
    attention.notified += 1;
    const note = new Notification({ title: 'YAIRPG', body: label || 'Something is waiting.', silent: true });
    note.on('click', () => { if (win.isDestroyed()) return; if (win.isMinimized()) win.restore(); win.show(); win.focus(); });
    note.show();
});

module.exports = { attention };
