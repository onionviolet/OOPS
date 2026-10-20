// P2 proof helper: boot a rebuilt bundle on a fresh origin at 1920x1080, play the
// same first beats, then save, reload, Export and Import through the real UI and print
// a normalized digest. Run it against the baseline and the pack-installed builds and
// compare the digests. Usage: node scripts/mol_pack_roundtrip_browser.cjs <url> <out.json>
const fs = require('node:fs'), crypto = require('node:crypto');
const {launchChrome} = require('./ui_helpers.cjs');
const [url, out] = process.argv.slice(2);
// Per-run noise only: save timestamps, journey UUIDs and the random seeds. Everything else must match across builds.
const NOISE = /^(saved_at|last_rewarded_export|rng|root|time|timestamp|savedAt)$/;
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
const strip = (v) => JSON.parse(JSON.stringify(v, (k, x) => NOISE.test(k) ? undefined : typeof x === 'string' ? x.replace(UUID, 'UUID') : x));
const digest = (v) => crypto.createHash('sha256').update(JSON.stringify(strip(v))).digest('hex');
(async () => {
    const browser = await launchChrome(), result = {errors: []};
    try {
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}, acceptDownloads: true});
        const page = await context.newPage(); page.setDefaultTimeout(15000);
        page.on('pageerror', e => result.errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') result.errors.push(m.text()); });
        await page.goto(url); await page.getByText('PLAY', {exact: true}).click();
        if (await page.getByText('Confirm', {exact: true}).isVisible().catch(() => false)) await page.getByText('Confirm', {exact: true}).click();
        await page.getByRole('button', {name: 'Talk to someone'}).click(); await page.locator('[data-dialogue="villageElder"]').click();
        await page.locator('[data-textline="hello"]').click(); await page.evaluate(() => window.end_dialogue());
        const read = () => page.evaluate(() => { window.saveProgress(); return JSON.parse(localStorage.getItem('save data')); });
        const first = await read(); result.keys = Object.keys(first).sort(); result.first = digest(first); fs.writeFileSync(out.replace(/\.json$/, '.save.json'), JSON.stringify(first));
        await page.reload(); await page.getByText('PLAY', {exact: true}).click();
        result.afterReload = digest(await read());
        const [download] = await Promise.all([page.waitForEvent('download'), page.evaluate(() => { window.saveToFile(); })]);
        const file = await download.path(); result.exportBytes = fs.statSync(file).size;
        await page.locator('#saved_file_input').setInputFiles(file); await page.waitForTimeout(1500);
        if (await page.getByText('PLAY', {exact: true}).isVisible().catch(() => false)) await page.getByText('PLAY', {exact: true}).click();
        result.afterImport = digest(await read());
        await page.screenshot({path: out.replace(/\.json$/, '.png')});
    } finally { await browser.close(); }
    fs.writeFileSync(out, JSON.stringify(result, null, 1)); console.log(JSON.stringify(result));
})().catch(e => { console.error(e); process.exit(1); });
