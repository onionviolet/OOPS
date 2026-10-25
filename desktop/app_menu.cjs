'use strict';
// Native app menu (A7). A custom menu replaces Electron's default, so the
// standard roles stay: without them copy, paste and Cmd+Q stop working.
// Accelerators take keys before the page does; the game's own shortcuts use
// bare letters, Alt/F6 and Ctrl/Cmd+K, so the items here avoid those.
const { Menu } = require('electron');

// handlers: { saveNow, restoreBackup, showBackups, popOutEvents }
function buildMenu(handlers) {
    const mac = process.platform === 'darwin';
    return Menu.buildFromTemplate([
        ...(mac ? [{ role: 'appMenu' }] : []),
        {
            label: 'File',
            submenu: [
                { label: 'Save now', accelerator: 'CmdOrCtrl+S', click: handlers.saveNow },
                { type: 'separator' },
                { label: 'Restore a backup...', click: handlers.restoreBackup },
                { label: 'Show backups folder', click: handlers.showBackups },
                { type: 'separator' },
                mac ? { role: 'close' } : { role: 'quit' },
            ],
        },
        { role: 'editMenu' },
        {
            label: 'View',
            submenu: [
                { label: 'Pop out world events', accelerator: 'CmdOrCtrl+Shift+E', click: handlers.popOutEvents },
                { type: 'separator' },
                { role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        { role: 'windowMenu' },
    ]);
}

module.exports = { buildMenu };
