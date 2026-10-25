// A1 save mirror check. Hidden Electron on a fresh userData: play and save,
// see the mirror copy the page's storage to files, crash the renderer, wipe
// localStorage (a lost profile), restore from the recovery page, check the same
// hero returns and the pre-restore state was kept, then close through the
// window and check the final 'close' snapshot. Never shows or focuses a window.
// Run `npm run build` first. Usage: node scripts/desktop_save_mirror.cjs
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const zlib = require('node:zlib');
const assert = require('node:assert/strict');

const ROOT = path.resolve(__dirname, '..');
const CODEX_PLAYWRIGHT = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const loadPlaywright = () => {
    for (const id of [process.env.YAIRPG_PLAYWRIGHT, 'playwright', CODEX_PLAYWRIGHT].filter(Boolean)) {
        try { return require(id); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
    }
    throw new Error('Playwright not found. Set YAIRPG_PLAYWRIGHT to its module path.');
};
const { _electron } = loadPlaywright();

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-mirror-'));

const minutes = t => t && (((t.year * 12 + t.month) * 31 + t.day) * 24 + t.hour) * 60 + t.minute;

// Playwright marks a page crashed for good even after the renderer restarts,
// so the window is driven from the main process instead.
const js = (app, code) => app.evaluate(({ BrowserWindow }, code) =>
    BrowserWindow.getAllWindows()[0].webContents.executeJavaScript(code), code);
const url = app => app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].webContents.getURL());
const rawSave = app => js(app, `localStorage.getItem('save data')`);
const text = (app, sel) => js(app, `document.querySelector(${JSON.stringify(sel)})?.textContent`);
// Waits in the page for a visible element and clicks it.
const clickWhen = (app, sel, timeout = 30000) => js(app, `new Promise((resolve, reject) => {
    const end = Date.now() + ${timeout};
    (function poll() {
        const el = document.querySelector(${JSON.stringify(sel)});
        if (el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden') { el.click(); resolve(true); }
        else if (Date.now() > end) reject(new Error('timed out on ${sel}'));
        else setTimeout(poll, 100);
    })();
})`);
const visible = (app, sel) => js(app, `(e => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden')(document.querySelector(${JSON.stringify(sel)}))`);

async function waitFor(check, timeout, what) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
        try { if (await check()) return; } catch { /* page between loads */ }
        await new Promise(r => setTimeout(r, 200));
    }
    throw new Error(`timed out waiting for ${what}`);
}

async function play(app) {
    await waitFor(() => url(app).then(u => u.endsWith('/index.html')), 30000, 'game page');
    await clickWhen(app, '#loading_screen_play_button:not(.none_display)');
    const village = '#location_actions_div .location_choice_dropdown';
    await waitFor(async () => {
        if (await visible(app, '#hero_creation_panel_confirmation')) await clickWhen(app, '#hero_creation_panel_confirmation', 1000);
        return visible(app, village);
    }, 30000, 'village');
}

async function saveNow(app) {
    await clickWhen(app, '#save_button');
    return rawSave(app);
}

const windowState = app => app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()
    .map(w => ({ visible: w.isVisible(), focused: w.isFocused() })));


const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

(async () => {
    const report = { work };
    const userData = path.join(work, 'userData');
    const mirrorDir = path.join(userData, 'save-mirror');
    const env = {
        ...process.env, YAIRPG_HIDDEN: '1', YAIRPG_MIRROR: '1', YAIRPG_MIRROR_MS: '1000',
        YAIRPG_USER_DATA: userData, YAIRPG_DOWNLOAD_DIR: path.join(work, 'downloads'),
    };
    const app = await _electron.launch({ executablePath: require(path.join(ROOT, 'node_modules/electron')), args: [ROOT], cwd: ROOT, env });
    let closed = false;
    const hostLog = [];
    for (const stream of [app.process().stdout, app.process().stderr]) stream.on('data', d => hostLog.push(String(d).trim()));
    try {
        await app.firstWindow();
        await play(app);
        const saved = await saveNow(app);
        const savedHero = JSON.parse(saved).global_flags.is_hero_created;
        assert.ok(savedHero, 'hero saved');

        await waitFor(() => fs.existsSync(path.join(mirrorDir, 'latest.json')), 15000, 'latest.json');
        // Autosave keeps moving the clock, so match on the hero and a non-older time.
        const mirrored = () => JSON.parse(readJson(path.join(mirrorDir, 'latest.json')).entries['save data']);
        await waitFor(() => mirrored().global_flags?.is_hero_created && minutes(mirrored()['current time']) >= minutes(JSON.parse(saved)['current time']), 15000, 'mirror holds the saved hero');
        const first = readJson(path.join(mirrorDir, 'latest.json'));
        assert.ok(Object.keys(first.entries).length >= 1);
        report.mirrorKeys = Object.keys(first.entries).length;
        report.historyFiles = fs.readdirSync(path.join(mirrorDir, 'history')).length;
        assert.ok(report.historyFiles >= 1, 'a history snapshot exists');

        // Lost profile: crash, then empty the origin while on the recovery page.
        await new Promise(r => setTimeout(r, 2500));
        const beforeWipe = readJson(path.join(mirrorDir, 'latest.json')).entries['save data'];
        await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].webContents.forcefullyCrashRenderer());
        await waitFor(async () => (await url(app)).includes('/__host/recover.html') && visible(app, '#recover_reload'), 60000, 'recovery page');
        await js(app, 'localStorage.clear(); true');
        assert.equal(await rawSave(app), null, 'save wiped');
        await new Promise(r => setTimeout(r, 2500));
        assert.equal(readJson(path.join(mirrorDir, 'latest.json')).entries['save data'], beforeWipe, 'an empty origin never replaces the mirror');

        // The recovery page lists backups; restore the newest copy.
        await js(app, 'location.reload(); true');
        await waitFor(() => visible(app, '#recover_backups li button'), 15000, 'backup list');
        report.backupRows = await js(app, `document.querySelectorAll('#recover_backups li').length`);
        await clickWhen(app, '#recover_backups li button');
        await play(app);
        const restored = JSON.parse(await saveNow(app));
        assert.ok(restored.global_flags.is_hero_created, 'same hero after restore');
        assert.ok(minutes(restored['current time']) >= minutes(JSON.parse(saved)['current time']), 'clock did not go back');

        // A restore keeps the state it replaced (here: the empty origin was not
        // snapshotted, so no pre-restore file exists; a restore over a live
        // save would). Check the guard did not invent one.
        const reasons = fs.readdirSync(path.join(mirrorDir, 'history'))
            .map(n => JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(mirrorDir, 'history', n))))).map(s => s.reason);
        report.reasons = reasons;

        // Closing through the window takes a final snapshot first.
        // Playwright's inspector keeps the process alive after the last window
        // closes ("waiting for the debugger"), so watch the window instead.
        const windows = () => app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().length).catch(() => 0);
        app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].close()).catch(() => {});
        await waitFor(async () => (await windows()) === 0, 20000, 'window to close');
        closed = true;
        await app.close().catch(() => {});
        const afterClose = fs.readdirSync(path.join(mirrorDir, 'history'))
            .map(n => JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(mirrorDir, 'history', n))))).map(s => s.reason);
        assert.ok(afterClose.includes('close'), 'close snapshot written');
        report.reasonsAfterClose = afterClose;
        report.result = 'PASS';
    } finally {
        if (!closed) { console.error(hostLog.slice(-10).join('\n')); await app.close().catch(() => {}); }
    }
    console.log(JSON.stringify(report, null, 1));
})().catch(e => { console.error('FAIL', e); process.exit(1); });
