'use strict';
// Window guards: link and navigation policy, the window.prompt stand-in, and
// the hang and crash guard (EL46).
const { BrowserWindow, ipcMain, powerMonitor, shell } = require('electron');
const { APP_ORIGIN } = require('./app_path.cjs');
const { promptPage, PROMPT_RESULT } = require('./prompt_page.cjs');
const { RECOVER_PATH } = require('./recover_page.cjs');
const { background, isAppUrl, webPreferences } = require('./host_context.cjs');

function openOutside(url) {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
}

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

// Hang and crash guard (EL46). The game page keeps its own save in
// localStorage and is its only writer (AR3); the host only copies it to files
// (desktop/mirror_host.cjs) and writes localStorage back only when the player
// clicks Restore on the recovery page. A crash or a hang shows a recovery page
// on the same origin that reads the last save and reloads from it. A hang is a
// missed heartbeat: main pings, the preload answers, and a busy page answers
// neither. YAIRPG_HANG_MS sets how long to wait (default
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
    const every = Math.min(1000, Math.max(100, hangMs / 4));
    let lastTick = Date.now();
    const timer = setInterval(() => {
        // A late tick means the host itself stalled or the Mac slept; the
        // page had no chance to answer, so silence counts from now.
        const now = Date.now();
        const late = now - lastTick > every * 3;
        lastTick = now;
        if (late) beat();
        if (contents.isDestroyed() || contents.isCrashed() || stoppedForHang) return;
        const quiet = Date.now() - (heartbeats.get(id) || Date.now());
        if (quiet > hangMs && !promptOpen.has(id) && !contents.isDevToolsOpened()) {
            console.error(`[yairpg] no heartbeat for ${quiet} ms, stopping the renderer`);
            stoppedForHang = true;
            contents.forcefullyCrashRenderer();
            return;
        }
        contents.send('yairpg:ping');
    }, every);
    win.on('closed', () => { clearInterval(timer); heartbeats.delete(id); });
}

// Electron has no window.prompt; the game uses it to confirm reset and backup
// loads. The preload routes prompt() here and this shows a small modal.
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

// Sleep and lock pause everything; nobody missed a heartbeat.
function watchPower() {
    const rebeat = () => { for (const id of heartbeats.keys()) heartbeats.set(id, Date.now()); };
    powerMonitor.on('resume', rebeat);
    powerMonitor.on('unlock-screen', rebeat);
}

module.exports = { guardContents, guardRenderer, watchPower };
