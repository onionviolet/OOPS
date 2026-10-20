'use strict';
// Electron desktop host for the web build (AD39). The game itself stays a
// browser page: src/ never imports this, and the browser build is still the
// default and test target. Run `npm run build` first; this serves dist/ as is.
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { app, BrowserWindow, protocol, net, shell, screen, session } = require('electron');
const { APP_SCHEME, APP_ORIGIN, resolveAppPath } = require('./app_path.cjs');

const ROOT = path.resolve(__dirname, '..');

// Test and spare-profile hook: a fresh userData is a fresh save origin.
if (process.env.YAIRPG_USER_DATA) app.setPath('userData', path.resolve(process.env.YAIRPG_USER_DATA));

// Web Locks guard tabs inside one process; a second app instance would share
// the same userData and could write the same save, so allow only one.
// Agent access, off by default. YAIRPG_CDP_PORT opens Chrome DevTools Protocol
// on localhost so Playwright MCP or chrome-devtools-mcp can attach (EL15).
// Any local process can then drive the app, so only set it on agent runs.
if (process.env.YAIRPG_CDP_PORT) {
    app.commandLine.appendSwitch('remote-debugging-address', '127.0.0.1');
    app.commandLine.appendSwitch('remote-debugging-port', process.env.YAIRPG_CDP_PORT);
}
// Agent and test runs can stay off screen so they never take focus (EL17).
const hidden = process.env.YAIRPG_HIDDEN === '1';

// The lock is keyed by userData, so a test or agent run with its own
// YAIRPG_USER_DATA can run beside the player's app.
const primary = app.requestSingleInstanceLock();
if (!primary) app.exit(0);
app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
});

// Standard + secure gives a real origin: ES modules, localStorage, Web Locks,
// workers and fetch behave as on https.
protocol.registerSchemesAsPrivileged([{
    scheme: APP_SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true },
}]);

function isAppUrl(url) { return url.startsWith(APP_ORIGIN + '/'); }

function openOutside(url) {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
}

const webPreferences = {
    contextIsolation: true,
    sandbox: true,
    nodeIntegration: false,
    // Keeps the game clock running while minimized or covered, like a
    // foreground tab. Costs battery (DS6); set YAIRPG_THROTTLE=1 to allow it.
    backgroundThrottling: process.env.YAIRPG_THROTTLE === '1',
};

function guardContents(contents) {
    contents.setWindowOpenHandler(({ url }) => {
        if (isAppUrl(url)) return { action: 'allow', overrideBrowserWindowOptions: { webPreferences } };
        openOutside(url);
        return { action: 'deny' };
    });
    contents.on('will-navigate', (event, url) => {
        if (isAppUrl(url)) return;
        event.preventDefault();
        openOutside(url);
    });
}

function createWindow() {
    const { workAreaSize } = screen.getPrimaryDisplay();
    const win = new BrowserWindow({
        width: Math.min(1920, workAreaSize.width),
        height: Math.min(1080, workAreaSize.height),
        minWidth: 1366,
        minHeight: 768,
        backgroundColor: '#1b1b1b',
        title: 'YAIRPG',
        show: !hidden,
        webPreferences,
    });
    win.loadURL(APP_ORIGIN + '/index.html');
    return win;
}

if (primary) app.whenReady().then(() => {
    protocol.handle(APP_SCHEME, request => {
        const file = resolveAppPath(ROOT, request.url);
        if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
            return new Response('Not found', { status: 404 });
        }
        return net.fetch(pathToFileURL(file).toString());
    });

    app.on('web-contents-created', (_event, contents) => guardContents(contents));

    // Export uses an anchor download. Without a set path Electron asks where
    // to save; tests point YAIRPG_DOWNLOAD_DIR at a scratch folder instead.
    session.defaultSession.on('will-download', (_e, item) => {
        if (process.env.YAIRPG_DOWNLOAD_DIR) {
            item.setSavePath(path.join(path.resolve(process.env.YAIRPG_DOWNLOAD_DIR), item.getFilename()));
        }
    });

    if (hidden && app.dock) app.dock.hide();
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => app.quit());
