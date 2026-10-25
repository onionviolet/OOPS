'use strict';
// Shared state for the desktop host modules: run mode, origin test, the window
// preferences every game window uses, and small helpers. Nothing here does work
// at load beyond reading the environment, so modules can require it freely.
const path = require('node:path');
const { BrowserWindow } = require('electron');
const { APP_ORIGIN } = require('./app_path.cjs');

const ROOT = path.resolve(__dirname, '..');

// Background runs never take the foreground (EL17, EL27): YAIRPG_HIDDEN=1 has
// no window or Dock icon, YAIRPG_INACTIVE=1 shows a window without focus and
// may sit in the Dock. Both mute audio, cancel page dialogs and save downloads
// to temp. The host never raises, focuses or bounces a window on its own.
const hidden = process.env.YAIRPG_HIDDEN === '1';
const background = hidden || process.env.YAIRPG_INACTIVE === '1';

const isAppUrl = url => url.startsWith(APP_ORIGIN + '/');

const webPreferences = {
    contextIsolation: true,
    sandbox: true,
    nodeIntegration: false,
    preload: path.join(__dirname, 'preload.cjs'),
    // Keeps the game clock running while minimized or covered, like a
    // foreground tab. Costs battery (DS6); set YAIRPG_THROTTLE=1 to allow it.
    backgroundThrottling: process.env.YAIRPG_THROTTLE === '1',
};

// Features a module offers the page. host-info returns this list so a newer
// preload can run against an older main process (a page reload re-reads the
// preload from disk, the main process keeps running).
const capabilities = [];

// Pop-out panel windows by panel name (desktop/popout_host.cjs fills it).
const popouts = new Map();
const mainWindow = () => BrowserWindow.getAllWindows()
    .find(w => !w.getParentWindow() && ![...popouts.values()].includes(w));

const withTimeout = (promise, ms) => Promise.race([promise, new Promise(resolve => setTimeout(() => resolve(null), ms))]);

module.exports = { ROOT, hidden, background, isAppUrl, webPreferences, capabilities, popouts, mainWindow, withTimeout };
