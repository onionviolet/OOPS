// AD39 desktop host smoke: launch the Electron app on a fresh userData,
// play, save, reload, quit and relaunch, Export to a file, Import it back.
// Natural-pace time (test hooks are localhost only). Run `npm run build` first.
// Usage: node scripts/desktop_smoke.cjs [screenshot.png]
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

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-desktop-'));
const userData = path.join(work, 'userData');
const downloads = path.join(work, 'downloads');
fs.mkdirSync(downloads);

const minutes = t => t && (((t.year * 12 + t.month) * 31 + t.day) * 24 + t.hour) * 60 + t.minute;
const readSave = page => page.evaluate(() => JSON.parse(localStorage.getItem('save data')));

async function launch() {
    const app = await _electron.launch({
        executablePath: require(path.join(ROOT, 'node_modules/electron')),
        args: [ROOT],
        cwd: ROOT,
        // Hidden by default so a check never covers the player's window; YAIRPG_SHOW=1 to watch.
        env: { YAIRPG_HIDDEN: process.env.YAIRPG_SHOW === '1' ? '0' : '1', ...process.env, YAIRPG_USER_DATA: userData, YAIRPG_DOWNLOAD_DIR: downloads },
    });
    const page = await app.firstWindow();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    return { app, page, errors };
}

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

async function saveNow(page) {
    await page.locator('#save_button').click();
    return readSave(page);
}

(async () => {
    const report = { work };
    let { app, page, errors } = await launch();
    try {
        report.url = page.url();
        assert.equal(report.url, 'app://yairpg/index.html');
        report.viewport = await page.evaluate(() => [innerWidth, innerHeight]);
        await play(page);
        await page.waitForTimeout(4000);
        const first = await saveNow(page);
        assert.ok(first?.global_flags?.is_hero_created, 'hero created and saved');
        report.firstMinute = minutes(first['current time']);

        await page.reload();
        await play(page);
        await page.waitForTimeout(3000);
        const afterReload = await saveNow(page);
        report.reloadMinute = minutes(afterReload['current time']);
        assert.ok(report.reloadMinute > report.firstMinute, 'clock kept going after reload');
        assert.deepEqual(errors, [], 'no page errors in first session');
    } finally {
        await app.close();
    }

    ({ app, page, errors } = await launch());
    try {
        const kept = await readSave(page);
        assert.ok(kept, 'save survived a full quit and relaunch');
        report.relaunchMinute = minutes(kept['current time']);
        assert.ok(report.relaunchMinute >= report.reloadMinute);
        await play(page);
        await page.waitForTimeout(3000);
        const before = await saveNow(page);

        await page.locator('#save_to_file_button').click();
        let exported;
        for (let i = 0; i < 50 && !exported; i++) {
            await page.waitForTimeout(200);
            exported = fs.readdirSync(downloads).find(f => f.endsWith('.txt'));
        }
        assert.ok(exported, 'Export wrote a file');
        report.exported = exported;
        const bytes = fs.readFileSync(path.join(downloads, exported));

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
            page.locator('#saved_file_input').setInputFiles({ name: exported, mimeType: 'text/plain', buffer: bytes }),
        ]);
        await play(page);
        const imported = await saveNow(page);
        report.importMinute = minutes(imported['current time']);
        assert.ok(imported.global_flags?.is_hero_created);
        assert.ok(report.importMinute >= minutes(before['current time']), 'import restored the exported clock');

        if (process.argv[2]) await page.screenshot({ path: process.argv[2] });
        assert.deepEqual(errors, [], 'no page errors in second session');
        report.result = 'PASS';
    } finally {
        await app.close();
    }
    console.log(JSON.stringify(report, null, 1));
})().catch(e => { console.error('FAIL', e); process.exit(1); });
