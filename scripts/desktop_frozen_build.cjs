// EL18 frozen player build check. Hidden Electron on a fresh userData with
// YAIRPG_FROZEN=1 (the player's path). Snapshots a temp copy of the page
// files, plays, sweeps every same-origin reference for 404s, then "rebuilds"
// the temp copy (never the shared dist/) and checks that the open game and a
// reload keep the old bundle until the notice's Save and reload adopts the new one.
// Run `npm run build` first. Usage: node scripts/desktop_frozen_build.cjs [notice.png]
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { listFiles, makeSnapshot, readPointer, snapshotRoot } = require('../desktop/snapshot.cjs');

const ROOT = path.resolve(__dirname, '..');
const CODEX_PLAYWRIGHT = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const loadPlaywright = () => {
    for (const id of [process.env.YAIRPG_PLAYWRIGHT, 'playwright', CODEX_PLAYWRIGHT].filter(Boolean)) {
        try { return require(id); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
    }
    throw new Error('Playwright not found. Set YAIRPG_PLAYWRIGHT to its module path.');
};
const { _electron } = loadPlaywright();

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-frozen-'));
const userData = path.join(work, 'userData');
const source = path.join(work, 'source');
const MARKER = '//yairpg-frozen-test-rebuild';

const minutes = t => t && (((t.year * 12 + t.month) * 31 + t.day) * 24 + t.hour) * 60 + t.minute;
const readSave = page => page.evaluate(() => JSON.parse(localStorage.getItem('save data')));

async function play(page) {
    await page.locator('#loading_screen_play_button:not(.none_display)').click({ timeout: 30000 });
    const confirm = page.locator('#hero_creation_panel_confirmation');
    const village = page.locator('#location_actions_div .location_choice_dropdown').first();
    await Promise.race([
        confirm.waitFor({ state: 'visible', timeout: 30000 }),
        village.waitFor({ state: 'visible', timeout: 30000 }),
    ]);
    if (await confirm.isVisible().catch(() => false)) await confirm.click();
    await village.waitFor({ state: 'visible', timeout: 30000 });
}

// Same-origin files named by the HTML pages and stylesheets, as app paths.
function referencedPaths(root) {
    const refs = new Set();
    const add = (from, ref) => {
        ref = ref.trim().replace(/\\/g, '/').replace(/[?#].*$/, '');
        if (!ref || /^(https?:|data:|mailto:|#|\/\/)/i.test(ref)) return;
        refs.add(path.posix.normalize(path.posix.join(path.posix.dirname(from), ref)));
    };
    for (const page of ['index.html', 'help.html', 'changelog.html']) {
        const html = fs.readFileSync(path.join(root, page), 'utf8');
        for (const m of html.matchAll(/(?:src|href)\s*=\s*"([^"]+)"/g)) add(page, m[1]);
    }
    for (const css of listFiles(root).filter(f => f.endsWith('.css'))) {
        const text = fs.readFileSync(path.join(root, css), 'utf8');
        for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) add(css, m[1]);
    }
    return [...refs].sort();
}

const bundleText = page => page.evaluate(() => fetch('dist/bundle.js', { cache: 'no-store' }).then(r => r.text()));
const serveLog = app => app.evaluate(() => globalThis.yairpgServeLog);
const clearLog = app => app.evaluate(() => { globalThis.yairpgServeLog.served.length = 0; globalThis.yairpgServeLog.misses.length = 0; });
const bundleRoots = log => [...new Set(log.served.filter(s => new URL(s.url).pathname === '/dist/bundle.js').map(s => s.root))];

(async () => {
    const report = { work };
    // A temp copy stands in for the repo, so the "rebuild" never touches dist/.
    for (const rel of listFiles(ROOT)) {
        fs.mkdirSync(path.dirname(path.join(source, rel)), { recursive: true });
        fs.copyFileSync(path.join(ROOT, rel), path.join(source, rel));
    }
    const first = makeSnapshot(source, userData);
    report.first = first.id;

    const app = await _electron.launch({
        executablePath: require(path.join(ROOT, 'node_modules/electron')),
        args: [ROOT],
        cwd: ROOT,
        env: {
            ...process.env, YAIRPG_HIDDEN: '1', YAIRPG_FROZEN: '1', YAIRPG_SERVE_LOG: '1',
            YAIRPG_BUILD_POLL_MS: '300', YAIRPG_USER_DATA: userData,
            YAIRPG_DOWNLOAD_DIR: path.join(work, 'downloads'),
        },
    });
    try {
        const page = await app.firstWindow();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
        assert.equal(page.url(), 'app://yairpg/index.html', 'origin unchanged');
        assert.equal((await app.evaluate(() => globalThis.yairpgServing())).id, first.id, 'serves the snapshot');
        assert.equal(await page.evaluate(() => window.yairpgHost.build), first.id);

        await play(page);
        await page.waitForTimeout(3000);
        await page.locator('#save_button').click();
        const before = await readSave(page);
        assert.ok(before?.global_flags?.is_hero_created, 'hero created and saved');

        // Nothing the page loaded, or names in its HTML and CSS, is missing.
        const refs = referencedPaths(first.root);
        const failed = await page.evaluate(paths => Promise.all(paths.map(p =>
            fetch(p, { cache: 'no-store' }).then(r => (r.ok ? null : `${p} ${r.status}`), e => `${p} ${e.message}`))), refs);
        report.referencesChecked = refs.length;
        assert.deepEqual(failed.filter(Boolean), [], 'every referenced file is in the snapshot');
        let log = await serveLog(app);
        assert.deepEqual(log.misses, [], 'no 404s while booting and playing');
        assert.deepEqual(bundleRoots(log), [first.root]);
        assert.ok(!(await bundleText(page)).includes(MARKER));

        // Rebuild during play: a new bundle and index version in the source copy.
        fs.appendFileSync(path.join(source, 'dist/bundle.js'), `\n${MARKER}\n`);
        const index = path.join(source, 'index.html');
        fs.writeFileSync(index, fs.readFileSync(index, 'utf8').replace(/dist\/bundle\.js\?version=[^&"]+/, 'dist/bundle.js?version=frozen-test'));
        const second = makeSnapshot(source, userData);
        report.second = second.id;
        assert.notEqual(second.id, first.id);

        const notice = page.locator('#yairpg_host_build_notice');
        await notice.waitFor({ state: 'visible', timeout: 10000 });
        assert.ok(!(await bundleText(page)).includes(MARKER), 'open game still serves the old bundle');
        if (process.argv[2]) {
            await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setContentSize(1920, 1080));
            await page.waitForTimeout(500);
            await page.screenshot({ path: process.argv[2] });
        }

        // A plain reload keeps the frozen build and offers it again.
        await clearLog(app);
        await page.reload();
        await play(page);
        // The reload may take the bundle from cache; a no-store fetch reaches the host.
        assert.ok(!(await bundleText(page)).includes(MARKER));
        log = await serveLog(app);
        assert.deepEqual(bundleRoots(log), [first.root], 'reload still serves the old snapshot');
        assert.deepEqual([...new Set(log.served.map(e => e.root))], [first.root], 'every reload request came from the old snapshot');
        assert.ok(!(await page.evaluate(() => document.querySelector('script[src*="bundle.js"]').src)).includes('frozen-test'));
        await notice.waitFor({ state: 'visible', timeout: 10000 });
        assert.equal(readPointer(userData, 'current.json'), first.id);

        // Adopting saves, switches the root and reloads.
        await clearLog(app);
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
            page.locator('#yairpg_host_build_reload').click(),
        ]);
        await play(page);
        assert.ok((await bundleText(page)).includes(MARKER));
        log = await serveLog(app);
        assert.deepEqual(bundleRoots(log), [snapshotRoot(userData, second.id)], 'adopted snapshot serves the new bundle');
        assert.deepEqual([...new Set(log.served.map(e => e.root))], [snapshotRoot(userData, second.id)]);
        assert.ok((await page.evaluate(() => document.querySelector('script[src*="bundle.js"]').src)).includes('frozen-test'));
        assert.equal(readPointer(userData, 'current.json'), second.id);
        assert.equal(await notice.count(), 0, 'no notice once adopted');
        const after = await readSave(page);
        assert.ok(after?.global_flags?.is_hero_created, 'save kept across adoption');
        assert.ok(minutes(after['current time']) >= minutes(before['current time']));
        assert.deepEqual(log.misses, []);
        assert.deepEqual(errors, [], 'no page errors');
        report.result = 'PASS';
    } finally {
        await app.close();
    }
    console.log(JSON.stringify(report, null, 1));
})().catch(e => { console.error('FAIL', e); process.exit(1); });
