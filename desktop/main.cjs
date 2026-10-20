'use strict';
// Electron desktop host for the web build (AD39). The game itself stays a
// browser page: src/ never imports this, and the browser build is still the
// default and test target. The player's window serves a frozen snapshot of the
// built page (EL18, desktop/snapshot.cjs); agent runs serve the working tree.
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { app, BrowserWindow, protocol, net, shell, screen, session, ipcMain } = require('electron');
const { APP_SCHEME, APP_ORIGIN, resolveAppPath } = require('./app_path.cjs');
const { promptPage, PROMPT_RESULT } = require('./prompt_page.cjs');
const { RECOVER_PATH, recoverPage } = require('./recover_page.cjs');
const { makeSnapshot, readPointer, writePointer, snapshotRoot, buildsDir } = require('./snapshot.cjs');

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
ipcMain.on('yairpg:host-info', event => { event.returnValue = { desktop: true, background, build: serving.id }; });
// YAIRPG_DIALOGS=1 lets a background test open the prompt off screen and answer it.
const backgroundDialogs = background && process.env.YAIRPG_DIALOGS === '1';
ipcMain.on('yairpg:prompt', (event, message, initial) => {
    if (background && !backgroundDialogs) { event.returnValue = null; return; }
    // The sync prompt blocks the page, so the hang guard waits it out.
    const senderId = event.sender.id;
    promptOpen.add(senderId);
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
        promptOpen.delete(senderId);
        heartbeats.set(senderId, Date.now());
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

// Hang and crash guard (EL46). The game page keeps its own save in
// localStorage; the host never writes it (AR3). A crash or a hang shows a
// recovery page on the same origin that reads the last save and reloads from
// it. A hang is a missed heartbeat: main pings, the preload answers, and a
// busy page answers neither. YAIRPG_HANG_MS sets how long to wait (default
// 30 s). The guard never shows, raises or focuses a window (EL32).
const hangMs = Number(process.env.YAIRPG_HANG_MS) || 30000;
const heartbeats = new Map();
const promptOpen = new Set();
ipcMain.on('yairpg:pong', event => heartbeats.set(event.sender.id, Date.now()));

function guardRenderer(win) {
    const contents = win.webContents;
    const id = contents.id;
    let stoppedForHang = false;
    const beat = () => heartbeats.set(id, Date.now());
    beat();
    contents.on('did-start-loading', beat);
    contents.on('dom-ready', beat);
    contents.on('unresponsive', () => console.warn('[yairpg] renderer unresponsive'));
    contents.on('render-process-gone', (_event, details) => {
        if (details.reason === 'clean-exit') return;
        const reason = stoppedForHang ? 'hung' : details.reason === 'oom' ? 'oom' : 'crashed';
        stoppedForHang = false;
        console.error(`[yairpg] renderer gone: ${details.reason} (exit ${details.exitCode}), showing recovery`);
        setImmediate(() => {
            if (win.isDestroyed() || contents.isDestroyed()) return;
            beat();
            contents.loadURL(`${APP_ORIGIN}${RECOVER_PATH}?reason=${encodeURIComponent(reason)}`);
        });
    });
    const timer = setInterval(() => {
        if (contents.isDestroyed() || contents.isCrashed() || stoppedForHang) return;
        const quiet = Date.now() - (heartbeats.get(id) || Date.now());
        if (quiet > hangMs && !promptOpen.has(id) && !contents.isDevToolsOpened()) {
            console.error(`[yairpg] no heartbeat for ${quiet} ms, stopping the renderer`);
            stoppedForHang = true;
            contents.forcefullyCrashRenderer();
            return;
        }
        contents.send('yairpg:ping');
    }, Math.min(1000, Math.max(100, hangMs / 4)));
    win.on('closed', () => { clearInterval(timer); heartbeats.delete(id); });
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
        show: !background,
        webPreferences,
    });
    if (background && !hidden) win.once('ready-to-show', () => win.showInactive());
    guardRenderer(win);
    win.loadURL(APP_ORIGIN + '/index.html');
    return win;
}

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

if (primary) app.whenReady().then(() => {
    // Accessory apps never activate on macOS, which is the strongest guard.
    if (hidden && process.platform === 'darwin') {
        app.setActivationPolicy('accessory');
        app.dock?.hide();
    }

    if (!serving.root) startFrozenBuilds();
    else ipcMain.handle('yairpg:adopt-build', () => false);

    protocol.handle(APP_SCHEME, request => {
        const url = new URL(request.url);
        if (url.pathname === RECOVER_PATH) {
            return new Response(recoverPage(url.searchParams.get('reason') || 'crashed'), { headers: { 'content-type': 'text/html; charset=utf-8' } });
        }
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

    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => app.quit());
