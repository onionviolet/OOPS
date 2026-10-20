'use strict';
// Electron desktop host for the web build (AD39). The game itself stays a
// browser page: src/ never imports this, and the browser build is still the
// default and test target. Run `npm run build` first; this serves dist/ as is.
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { app, BrowserWindow, protocol, net, shell, screen, session, ipcMain } = require('electron');
const { APP_SCHEME, APP_ORIGIN, resolveAppPath } = require('./app_path.cjs');
const { promptPage, PROMPT_RESULT } = require('./prompt_page.cjs');

const ROOT = path.resolve(__dirname, '..');

// Test and spare-profile hook: a fresh userData is a fresh save origin.
if (process.env.YAIRPG_USER_DATA) app.setPath('userData', path.resolve(process.env.YAIRPG_USER_DATA));

// Agent access, off by default. YAIRPG_CDP_PORT opens Chrome DevTools Protocol
// on localhost so Playwright MCP or chrome-devtools-mcp can attach (EL15).
// Any local process can then drive the app, so only set it on agent runs.
if (process.env.YAIRPG_CDP_PORT) {
    app.commandLine.appendSwitch('remote-debugging-address', '127.0.0.1');
    app.commandLine.appendSwitch('remote-debugging-port', process.env.YAIRPG_CDP_PORT);
}

// Background runs never take the foreground (EL17, EL27): YAIRPG_HIDDEN=1 has
// no window or Dock icon, YAIRPG_INACTIVE=1 shows a window without focus and
// may sit in the Dock. Both mute audio, cancel page dialogs and save downloads
// to temp. The host never raises, focuses or bounces a window on its own.
const hidden = process.env.YAIRPG_HIDDEN === '1';
const background = hidden || process.env.YAIRPG_INACTIVE === '1';

// Web Locks guard tabs inside one process; a second app instance would share
// the same userData and could write the same save, so allow one per userData.
// A test or agent run with its own YAIRPG_USER_DATA runs beside the player's.
const primary = app.requestSingleInstanceLock({ background });
if (!primary) app.exit(0);
app.on('second-instance', (_event, _argv, _cwd, data) => {
    // A background launch that hit the player's save must not raise his window.
    if (background || data?.background) return;
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
    preload: path.join(__dirname, 'preload.cjs'),
    // Keeps the game clock running while minimized or covered, like a
    // foreground tab. Costs battery (DS6); set YAIRPG_THROTTLE=1 to allow it.
    backgroundThrottling: process.env.YAIRPG_THROTTLE === '1',
};

function guardContents(contents) {
    if (background) contents.setAudioMuted(true);
    contents.setWindowOpenHandler(({ url }) => {
        if (isAppUrl(url)) return { action: 'allow', overrideBrowserWindowOptions: { show: !background, webPreferences } };
        if (!background) openOutside(url);
        return { action: 'deny' };
    });
    contents.on('will-navigate', (event, url) => {
        if (isAppUrl(url)) return;
        event.preventDefault();
        if (!background) openOutside(url);
    });
}

// Electron has no window.prompt; the game uses it to confirm reset and backup
// loads. The preload routes prompt() here and this shows a small modal.
ipcMain.on('yairpg:host-info', event => { event.returnValue = { desktop: true, background }; });
// YAIRPG_DIALOGS=1 lets a background test open the prompt off screen and answer it.
const backgroundDialogs = background && process.env.YAIRPG_DIALOGS === '1';
ipcMain.on('yairpg:prompt', (event, message, initial) => {
    if (background && !backgroundDialogs) { event.returnValue = null; return; }
    const parent = BrowserWindow.fromWebContents(event.sender) || undefined;
    const win = new BrowserWindow({
        parent, modal: !!parent, width: 520, height: 230, resizable: false, minimizable: false,
        maximizable: false, title: 'YAIRPG', backgroundColor: '#1b1b1b', show: !background,
        webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false },
    });
    let answered = false;
    const answer = value => {
        if (answered) return;
        answered = true;
        event.returnValue = value;
        if (!win.isDestroyed()) win.close();
    };
    win.on('page-title-updated', (e, title) => {
        if (!title.startsWith(PROMPT_RESULT)) return;
        e.preventDefault();
        answer(JSON.parse(title.slice(PROMPT_RESULT.length)));
    });
    win.on('closed', () => answer(null));
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(promptPage(message, initial)));
});

function createWindow() {
    const { workAreaSize } = screen.getPrimaryDisplay();
    const win = new BrowserWindow({
        width: Math.min(1920, workAreaSize.width),
        height: Math.min(1080, workAreaSize.height),
        minWidth: 1366,
        minHeight: 768,
        backgroundColor: '#1b1b1b',
        title: 'YAIRPG',
        show: !background,
        webPreferences,
    });
    if (background && !hidden) win.once('ready-to-show', () => win.showInactive());
    win.loadURL(APP_ORIGIN + '/index.html');
    return win;
}

if (primary) app.whenReady().then(() => {
    // Accessory apps never activate on macOS, which is the strongest guard.
    if (hidden && process.platform === 'darwin') {
        app.setActivationPolicy('accessory');
        app.dock?.hide();
    }

    protocol.handle(APP_SCHEME, request => {
        const file = resolveAppPath(ROOT, request.url);
        if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
            return new Response('Not found', { status: 404 });
        }
        return net.fetch(pathToFileURL(file).toString());
    });

    app.on('web-contents-created', (_event, contents) => guardContents(contents));

    // Export uses an anchor download. Without a set path Electron asks where
    // to save; background runs and tests save to a folder instead.
    const downloadDir = process.env.YAIRPG_DOWNLOAD_DIR
        || (background ? path.join(app.getPath('temp'), 'yairpg-downloads') : null);
    session.defaultSession.on('will-download', (_e, item) => {
        if (!downloadDir) return;
        fs.mkdirSync(path.resolve(downloadDir), { recursive: true });
        item.setSavePath(path.join(path.resolve(downloadDir), item.getFilename()));
    });

    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => app.quit());
