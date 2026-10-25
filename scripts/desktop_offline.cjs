// A5 offline check. Hidden Electron serving the frozen snapshot path
// (YAIRPG_FROZEN=1), with every non-app request cancelled: the icon font must
// still load from the app's own files and nothing may reach the network.
// Run `npm run build` first. Usage: node scripts/desktop_offline.cjs
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

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-offline-'));

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


(async () => {
    const report = { work };
    const app = await _electron.launch({
        executablePath: require(path.join(ROOT, 'node_modules/electron')), args: [ROOT], cwd: ROOT,
        env: { ...process.env, YAIRPG_HIDDEN: '1', YAIRPG_FROZEN: '1', YAIRPG_USER_DATA: path.join(work, 'userData') },
    });
    try {
        await app.evaluate(({ session }) => {
            globalThis.__external = [];
            session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
                const external = /^https?:/i.test(details.url);
                if (external) globalThis.__external.push(details.url);
                callback({ cancel: external });
            });
        });
        await app.firstWindow();
        await play(app);
        report.fontStatus = await js(app, `(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.family.includes('Material Icons')).map(f => f.status); })()`);
        assert.ok(report.fontStatus.includes('loaded'), 'Material Icons loaded without network');
        // A ligature name renders as one glyph, so the element is narrow, not a word wide.
        report.iconWidth = await js(app, `(() => { const e = document.querySelector('.material-icons'); if (!e) return null; return Math.round(e.getBoundingClientRect().width); })()`);
        if (report.iconWidth != null) assert.ok(report.iconWidth < 60, 'icon renders as a glyph');
        report.external = await app.evaluate(() => globalThis.__external);
        assert.deepEqual(report.external, [], 'no request left the app');
        report.serving = await app.evaluate(() => globalThis.yairpgServing().id);
        report.result = 'PASS';
    } finally { await app.close().catch(() => {}); }
    console.log(JSON.stringify(report, null, 1));
})().catch(e => { console.error('FAIL', e); process.exit(1); });
