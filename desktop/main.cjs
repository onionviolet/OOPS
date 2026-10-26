'use strict';
// Electron desktop host for the web build (AD39). The game itself stays a
// browser page: src/ never imports this, and the browser build is still the
// default and test target. The player's window serves a frozen snapshot of the
// built page (EL18); agent runs serve the working tree.
//
// This file is the composition root: process setup, the app:// protocol and the
// game window. Each concern lives in its own module:
//   host_context   run mode, origin test, shared window preferences
//   guard_host     link policy, window.prompt stand-in, hang and crash guard
//   build_host     what app:// serves, frozen builds
//   mirror_host    save mirror, backups and restore (save_mirror is the format)
//   presence_host  Dock badge and notifications
//   popout_host    pop-out panels
//   window_host    window size and position; app_menu is the native menu
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { app, BrowserWindow, Menu, protocol, net, session, ipcMain } = require('electron');
const { APP_SCHEME, APP_ORIGIN, resolveAppPath } = require('./app_path.cjs');
const { RECOVER_PATH, recoverPage } = require('./recover_page.cjs');
const { POPOUT_PATH, popoutPage } = require('./popout_page.cjs');
const { buildMenu } = require('./app_menu.cjs');
const appIcon = path.join(__dirname, '../resources/img/oops-icon.png');

// Test and spare-profile hook: a fresh userData is a fresh save origin. Set it
// before any module reads app.getPath('userData').
if (process.env.YAIRPG_USER_DATA) app.setPath('userData', path.resolve(process.env.YAIRPG_USER_DATA));

const { hidden, background, webPreferences, capabilities, mainWindow } = require('./host_context.cjs');
const { guardContents, guardRenderer, watchPower } = require('./guard_host.cjs');
const { serving, serveLog, startBuilds, announceBuild } = require('./build_host.cjs');
const { attachMirror, showBackups } = require('./mirror_host.cjs');
require('./presence_host.cjs');
const { openPopout, closePopouts } = require('./popout_host.cjs');
const { windowOptions, trackWindowState } = require('./window_host.cjs');

// Agent access, off by default. YAIRPG_CDP_PORT opens Chrome DevTools Protocol
// on localhost so Playwright MCP or chrome-devtools-mcp can attach (EL15).
// Any local process can then drive the app, so only set it on agent runs.
if (process.env.YAIRPG_CDP_PORT) {
    app.commandLine.appendSwitch('remote-debugging-address', '127.0.0.1');
    app.commandLine.appendSwitch('remote-debugging-port', process.env.YAIRPG_CDP_PORT);
}

// Web Locks guard tabs inside one process; a second app instance would share
// the same userData and could write the same save, so allow one per userData.
// A test or agent run with its own YAIRPG_USER_DATA runs beside the player's.
const primary = app.requestSingleInstanceLock({ background });
if (!primary) app.exit(0);
app.on('second-instance', (_event, _argv, _cwd, data) => {
    // A background launch that hit the player's save must not raise his window.
    if (background || data?.background) return;
    const win = mainWindow();
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
});

// Standard + secure gives a real origin: ES modules, localStorage, Web Locks,
// workers and fetch behave as on https.
protocol.registerSchemesAsPrivileged([{
    scheme: APP_SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true },
}]);

ipcMain.on('yairpg:host-info', event => {
    event.returnValue = { desktop: true, background, build: serving.id, capabilities: [...capabilities] };
});

const menuHandlers = {
    saveNow: () => { mainWindow()?.webContents.executeJavaScript('window.saveProgress && window.saveProgress()').catch(() => {}); },
    restoreBackup: () => { mainWindow()?.webContents.loadURL(`${APP_ORIGIN}${RECOVER_PATH}?reason=manual`); },
    popOutEvents: () => openPopout('events'),
    showBackups,
};

function createWindow() {
    const { base, state } = windowOptions();
    const win = new BrowserWindow({
        ...base,
        minWidth: 1366,
        minHeight: 768,
        backgroundColor: '#1b1b1b',
        title: 'YAIRPG',
        icon: appIcon,
        show: !background,
        webPreferences,
    });
    if (background && !hidden) win.once('ready-to-show', () => win.showInactive());
    guardRenderer(win);
    trackWindowState(win, state?.maximized === true);
    attachMirror(win);
    win.on('closed', closePopouts);
    win.loadURL(APP_ORIGIN + '/index.html');
    return win;
}

const page = html => new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });

if (primary) app.whenReady().then(() => {
    app.dock?.setIcon(appIcon);
    // Accessory apps never activate on macOS, which is the strongest guard.
    if (hidden && process.platform === 'darwin') {
        app.setActivationPolicy('accessory');
        app.dock?.hide();
    }

    watchPower();
    startBuilds();

    protocol.handle(APP_SCHEME, request => {
        const url = new URL(request.url);
        if (url.pathname === POPOUT_PATH) return page(popoutPage(url.searchParams.get('panel') || ''));
        if (url.pathname === RECOVER_PATH) return page(recoverPage(url.searchParams.get('reason') || 'crashed'));
        const root = serving.root;
        const file = resolveAppPath(root, request.url);
        if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
            serveLog?.misses.push(request.url);
            return new Response('Not found', { status: 404 });
        }
        serveLog?.served.push({ url: request.url, root });
        return net.fetch(pathToFileURL(file).toString());
    });

    app.on('web-contents-created', (_event, contents) => {
        guardContents(contents);
        // A reload keeps the notice until the player adopts the build.
        contents.on('did-finish-load', () => announceBuild(contents));
    });

    // Export uses an anchor download. Without a set path Electron asks where
    // to save; background runs and tests save to a folder instead.
    const downloadDir = process.env.YAIRPG_DOWNLOAD_DIR
        || (background ? path.join(app.getPath('temp'), 'yairpg-downloads') : null);
    session.defaultSession.on('will-download', (_e, item) => {
        if (!downloadDir) return;
        fs.mkdirSync(path.resolve(downloadDir), { recursive: true });
        item.setSavePath(path.join(path.resolve(downloadDir), item.getFilename()));
    });

    if (!background) Menu.setApplicationMenu(buildMenu(menuHandlers));
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => app.quit());
