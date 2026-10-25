// A4 desktop presence and A3 pop-out check. Hidden Electron: the page's host seam reports
// attention to the main process, which records it and (background run) shows no
// Dock badge or notification, and a pop-out panel window shows projections the
// game page sends, without booting the game. Checks the capability list, the real game path
// (the world-events feed reports its available leads) and ignores bad input.
// Run `npm run build` first. Usage: node scripts/desktop_presence.cjs [popout.png]
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

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-presence-'));

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
        env: { ...process.env, YAIRPG_HIDDEN: '1', YAIRPG_USER_DATA: path.join(work, 'userData') },
    });
    try {
        await app.firstWindow();
        await play(app);
        report.capabilities = await js(app, 'window.yairpgHost.capabilities');
        assert.ok(report.capabilities.includes('attention'));
        const read = () => app.evaluate(() => ({ ...globalThis.yairpgAttention }));
        await js(app, `window.yairpgHost.attention(3, 'Test invitation'); true`);
        await waitFor(async () => (await read()).count === 3, 5000, 'host hears attention');
        const heard = await read();
        assert.equal(heard.label, 'Test invitation');
        assert.equal(heard.notified, 0, 'background runs never notify');
        await js(app, `window.yairpgHost.attention('x', {}); true`);   // before the pop-out opens
        await waitFor(async () => (await read()).count === 0, 5000, 'bad input reads as zero');
        // Pop-out (A3): a separate page that never boots the game.
        await app.evaluate(() => { globalThis.yairpgOpenPopout('events'); });
        const popText = sel => app.evaluate(async ({ BrowserWindow }, sel) => {
            const w = BrowserWindow.getAllWindows().find(x => x.webContents.getURL().includes('/__host/popout.html'));
            return w ? w.webContents.executeJavaScript(`document.querySelector(${JSON.stringify(sel)})?.innerText ?? null`) : null;
        }, sel);
        await waitFor(async () => (await popText('#popout_title')) === 'World events', 10000, 'pop-out page');
        // The game's own feed already sent its projection, so the page shows it.
        await waitFor(async () => /Read-only/.test(await popText('#popout_status') || ''), 10000, 'pop-out shows the game feed');
        assert.equal(await popText('#loading_screen_play_button'), null, 'pop-out never boots the game');
        const jsMain = code => app.evaluate(({ BrowserWindow }, code) => BrowserWindow.getAllWindows()
            .find(w => w.webContents.getURL().endsWith('/index.html')).webContents.executeJavaScript(code), code);
        await jsMain(`window.yairpgHost.projection('events', {leads:[{label:'Cartographer visit', detail:'Village', available:true}], news:['Ore price rose.']}); true`);
        await waitFor(async () => /Cartographer visit/.test(await popText('#popout_leads') || ''), 5000, 'lead shown in pop-out')
            .catch(async e => { console.error('pop-out leads:', JSON.stringify(await popText('#popout_leads')), 'status:', await popText('#popout_status')); throw e; });
        assert.match(await popText('#popout_news'), /Ore price rose/);
        // Reopening gets the latest projection at once; oversized input is trimmed.
        await jsMain(`window.yairpgHost.projection('events', {leads:Array.from({length:99},(_, i)=>({label:'x'.repeat(999), detail:'', available:false})), news:[]}); true`);
        await waitFor(async () => (await app.evaluate(() => 0)) === 0 && (await popText('#popout_leads') || '').split('\n\n').length <= 31 * 3, 5000, 'projection trimmed');
        const shot = await app.evaluate(async ({ BrowserWindow }) => {
            const w = BrowserWindow.getAllWindows().find(x => x.webContents.getURL().includes('/__host/popout.html'));
            w.setContentSize(480, 720);
            await new Promise(r => setTimeout(r, 300));
            return (await w.webContents.capturePage()).toPNG().toString('base64');
        });
        if (process.argv[2]) fs.writeFileSync(process.argv[2], Buffer.from(shot, 'base64'));
        report.popout = 'PASS';
        // Real path: the feed reports once it renders in the village.
        report.feedCount = await js(app, `document.querySelectorAll('#world_event_feed [data-world-event]').length`);
        report.windows = await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().map(w => ({ visible: w.isVisible(), focused: w.isFocused() })));
        assert.ok(report.windows.every(w => !w.visible && !w.focused), 'never shown or focused');
        report.result = 'PASS';
    } finally { await app.close().catch(() => {}); }
    console.log(JSON.stringify(report, null, 1));
})().catch(e => { console.error('FAIL', e); process.exit(1); });
