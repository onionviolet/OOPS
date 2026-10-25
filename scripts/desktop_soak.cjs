// A2 natural-clock soak. The Chrome bot (scripts/playtest) steps time with test
// hooks, which only exist on localhost; this runs the real Electron app at its
// own pace for a while and samples what only the desktop host can show: does
// the game clock keep ticking while hidden (EL35), how fast, does memory grow,
// does the mirror keep writing, and does anything log an error. Hidden window,
// fresh userData, never touches the player's save. Output is REPORT.md (counts
// and numbers only, no save or game text) plus trace.json in the out folder.
// Run `npm run build` first.
// Usage: node scripts/desktop_soak.cjs [--seconds 120] [--every 10] [--out dir]
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

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-soak-'));

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



const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback; };
const SECONDS = Number(arg('seconds', 120));
const EVERY = Number(arg('every', 10));
const OUT = path.resolve(arg('out', path.join(work, 'out')));

(async () => {
    fs.mkdirSync(OUT, { recursive: true });
    const userData = path.join(work, 'userData');
    const app = await _electron.launch({
        executablePath: require(path.join(ROOT, 'node_modules/electron')), args: [ROOT], cwd: ROOT,
        env: { ...process.env, YAIRPG_HIDDEN: '1', YAIRPG_MIRROR: '1', YAIRPG_MIRROR_MS: '5000', YAIRPG_USER_DATA: userData },
    });
    const samples = [];
    try {
        await app.firstWindow();
        await app.evaluate(({ BrowserWindow }) => {
            globalThis.__soakErrors = [];
            BrowserWindow.getAllWindows()[0].webContents.on('console-message', (event, ...rest) => {
                const level = event.level ?? rest[0];
                const message = event.message ?? rest[1];
                if (level === 'error' || level === 3) globalThis.__soakErrors.push(String(message).slice(0, 200));
            });
        });
        await play(app);
        const started = Date.now();
        const clock = async () => {
            const raw = await rawSave(app);
            return raw ? minutes(JSON.parse(raw)['current time']) : null;
        };
        while (Date.now() - started < SECONDS * 1000) {
            const metrics = await app.evaluate(({ app: a }) => a.getAppMetrics().map(m => ({ type: m.type, mb: Math.round(m.memory.workingSetSize / 1024) })));
            const heap = await js(app, 'performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null');
            const errors = await app.evaluate(() => globalThis.__soakErrors.length);
            samples.push({
                t: Math.round((Date.now() - started) / 1000), clockMinute: await clock(), heapMb: heap, errors,
                rendererMb: Math.max(0, ...metrics.filter(m => m.type === 'Tab').map(m => m.mb)),
                mirrorFiles: fs.existsSync(path.join(userData, 'save-mirror/history')) ? fs.readdirSync(path.join(userData, 'save-mirror/history')).length : 0,
            });
            await new Promise(r => setTimeout(r, EVERY * 1000));
        }
        const errorText = await app.evaluate(() => globalThis.__soakErrors);
        fs.writeFileSync(path.join(OUT, 'trace.json'), JSON.stringify({ samples, errorText }, null, 1));
        const clocks = samples.map(s => s.clockMinute).filter(c => c != null);
        const advanced = clocks.length ? clocks.at(-1) - clocks[0] : 0;
        const monotonic = clocks.every((c, i) => i === 0 || c >= clocks[i - 1]);
        const span = samples.at(-1).t - samples[0].t || 1;
        const heapStart = samples[0].heapMb, heapEnd = samples.at(-1).heapMb;
        const verdicts = [
            ['clock advanced while hidden', advanced > 0],
            ['clock never went backward', monotonic],
            ['no console errors', errorText.length === 0],
            ['mirror kept writing', samples.at(-1).mirrorFiles >= 1],
            ['renderer memory growth under 150 MB', samples.at(-1).rendererMb - samples[0].rendererMb < 150],
        ];
        const report = [
            '# Desktop soak', '', `Natural pace, hidden window, ${span} s sampled every ${EVERY} s.`, '',
            '| Check | Result |', '| --- | --- |', ...verdicts.map(([n, ok]) => `| ${n} | ${ok ? 'pass' : 'FAIL'} |`), '',
            `- Game minutes advanced: ${advanced} (${(advanced / span).toFixed(2)} per wall second)`,
            `- JS heap MB: ${heapStart} -> ${heapEnd}; renderer working set MB: ${samples[0].rendererMb} -> ${samples.at(-1).rendererMb}`,
            `- Console errors: ${errorText.length} (text in trace.json, which is not committed)`,
            `- Mirror history files: ${samples.at(-1).mirrorFiles}`, '',
        ].join('\n');
        fs.writeFileSync(path.join(OUT, 'REPORT.md'), report);
        console.log(report);
        if (verdicts.some(([, ok]) => !ok)) process.exitCode = 1;
    } finally { await app.close().catch(() => {}); }
})().catch(e => { console.error('FAIL', e); process.exit(1); });
