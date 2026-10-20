// EL46 hang and crash guard check. Hidden Electron on a fresh userData:
// play and save, force a renderer crash, then a busy-loop hang, and check that
// each lands on the recovery page with the save byte-for-byte intact, reloads
// into the same hero, and never shows or focuses the window.
// Run `npm run build` first. Usage: node scripts/desktop_crash_guard.cjs [recover.png]
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
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

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-guard-'));
const HANG_MS = 4000;

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

async function recoverFrom(app, label, cause, report) {
    const before = await saveNow(app);
    assert.ok(JSON.parse(before)?.global_flags?.is_hero_created, `${label}: hero saved`);
    const started = Date.now();
    await cause();
    await waitFor(async () => (await url(app)).includes('/__host/recover.html') && visible(app, '#recover_reload'), 60000, `${label} recovery page`);
    report[`${label}RecoverMs`] = Date.now() - started;
    report[`${label}Reason`] = await text(app, '#recover_reason');
    report[`${label}SaveLine`] = await text(app, '#recover_save');
    assert.equal(new URL(await url(app)).searchParams.get('reason'), label === 'hang' ? 'hung' : 'crashed');
    assert.equal(await rawSave(app), before, `${label}: save untouched by the crash`);
    if (label === 'hang' && process.argv[2]) {
        const png = await app.evaluate(async ({ BrowserWindow }) => {
            const win = BrowserWindow.getAllWindows()[0];
            win.setContentSize(1920, 1080);
            await new Promise(r => setTimeout(r, 300));
            return (await win.webContents.capturePage()).toPNG().toString('base64');
        });
        fs.writeFileSync(process.argv[2], Buffer.from(png, 'base64'));
    }
    await clickWhen(app, '#recover_reload');
    await play(app);
    const after = JSON.parse(await saveNow(app));
    assert.ok(after?.global_flags?.is_hero_created, `${label}: same hero after recovery`);
    assert.ok(minutes(after['current time']) >= minutes(JSON.parse(before)['current time']), `${label}: clock did not go back`);
}

(async () => {
    const report = { work };
    const app = await _electron.launch({
        executablePath: require(path.join(ROOT, 'node_modules/electron')),
        args: [ROOT],
        cwd: ROOT,
        env: {
            ...process.env, YAIRPG_HIDDEN: '1', YAIRPG_HANG_MS: String(HANG_MS),
            YAIRPG_USER_DATA: path.join(work, 'userData'), YAIRPG_DOWNLOAD_DIR: path.join(work, 'downloads'),
        },
    });
    try {
        await app.firstWindow();
        await play(app);
        await new Promise(r => setTimeout(r, 3000));

        // Healthy play longer than the hang limit is not mistaken for a hang.
        await new Promise(r => setTimeout(r, HANG_MS * 2));
        assert.ok((await url(app)).endsWith('/index.html'), 'no false hang while playing');

        await recoverFrom(app, 'crash', () => app.evaluate(({ BrowserWindow }) =>
            BrowserWindow.getAllWindows()[0].webContents.forcefullyCrashRenderer()), report);
        await recoverFrom(app, 'hang', () => js(app, 'setTimeout(() => { for (;;) { /* hang */ } }, 0); true'), report);

        report.windows = await windowState(app);
        assert.ok(report.windows.every(w => !w.visible && !w.focused), 'never shown or focused');
        report.result = 'PASS';
    } finally {
        await app.close();
    }
    console.log(JSON.stringify(report, null, 1));
})().catch(e => { console.error('FAIL', e); process.exit(1); });
