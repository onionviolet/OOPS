// Headless floor for the world_packs slice (SAVES 2026-11-04): reveal in life A, cross to a fresh life B,
// reveal more, return to A, then Save, reload, Export file, literal Import. Fresh origin per run.
// Run: BUILD_OUT=<dir> npm run build; node tests/world_pack_state_browser.mjs <BUILD_OUT> <outDir>
import {createRequire} from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const {launchChrome} = require('../scripts/ui_helpers.cjs');
const [root, out] = [path.resolve(process.argv[2]), path.resolve(process.argv[3])];
const types = {'.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml'};
const server = http.createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname), file = path.join(root, p === '/' ? 'index.html' : p);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end(); }
    res.setHeader('content-type', types[path.extname(file)] || 'application/octet-stream'); fs.createReadStream(file).pipe(res);
}).listen(0, '127.0.0.1');
await new Promise(r => server.on('listening', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await launchChrome(), page = await (await browser.newContext({viewport: {width: 1920, height: 1080}, acceptDownloads: true})).newPage();
const errors = [], checks = [];
page.on('pageerror', e => errors.push(e.message));
const ok = (label, v) => { assert.ok(v, label); checks.push(label); console.log('PASS ' + label); };
const play = async () => { await page.waitForTimeout(500); if (await page.locator('#loading_screen_play_button').isVisible()) await page.locator('#loading_screen_play_button').click(); if (await page.locator('#hero_creation_panel_confirmation').isVisible()) await page.locator('#hero_creation_panel_confirmation').click(); await page.waitForTimeout(800); };
const open = async () => { if (!await page.locator('#continuation_open').isVisible()) await page.getByRole('combobox', {name: 'Other known panels'}).selectOption('continuation'); await page.locator('#continuation_open').click(); await page.waitForTimeout(150); };
const action = async id => { await page.locator(`[data-continuation-action="${id}"]`).first().click(); await page.waitForTimeout(150); const b = page.locator(`[data-continuation-action="${id}"]`).filter({hasText: /^Confirm /}); if (await b.count()) await b.click(); };
const people = async () => page.evaluate(() => { const v = window.simulationTestHooks.command('world_packs', 'view'); return Object.keys(v.saves?.sections['book.mol']?.delta.instances['book.mol.main']?.people || {}).sort(); });
const snap = () => page.evaluate(() => window.simulationTestHooks.snapshot());
const reveal = id => page.evaluate(id => window.simulationTestHooks.command('world_packs', 'reveal', 'book.mol', 'book.mol.main', id), id);
const BOTH = ['book.mol.ilsa', 'book.mol.imaya'];
try {
    await page.goto(`${origin}/?test_hooks=1`, {waitUntil: 'domcontentloaded'}); await play();
    ok('fresh life writes no world_packs key', !Object.hasOwn(await snap(), 'world_packs'));
    await open(); await page.locator('[data-connection-tab=research]').click(); await action('study'); await page.waitForTimeout(1800);
    await page.evaluate(() => window.advanceTicks(12, {render: true})); await page.waitForTimeout(600); await action('set'); await page.waitForTimeout(1600);
    await reveal('book.mol.imaya');
    await page.evaluate(() => window.advanceTicks(7, {render: true}));
    await page.locator('[data-connection-tab=return]').click(); await action('fresh'); await page.waitForTimeout(2200); await play();
    let s = await snap(); ok('crossed to a fresh life B', s.continuation.active === 'life-2');
    ok('B carries the world history revealed in A', (await people()).join() === 'book.mol.imaya');
    await reveal('book.mol.ilsa');
    await open(); await page.locator('[data-connection-tab=return]').click(); await action('resume:life-1'); await page.waitForTimeout(2000); await play();
    s = await snap(); ok('returned to A', s.continuation.active === 'life-1');
    ok('return keeps the history written in B (no stale copy)', (await people()).join() === BOTH.join() && s.world_packs.sections['book.mol'].delta.instances['book.mol.main'].people['book.mol.ilsa']);
    await page.locator('#save_button').click(); await page.waitForTimeout(300);
    const savedSlice = JSON.stringify((await snap()).world_packs);
    await page.reload({waitUntil: 'domcontentloaded'}); await play();
    ok('reload keeps both revealed people, identical slice', (await people()).join() === BOTH.join() && JSON.stringify((await snap()).world_packs) === savedSlice);
    const dl = page.waitForEvent('download'); await page.locator('#save_to_file_button').click(); const exp = path.join(out, 'world-pack-export.txt'); await (await dl).saveAs(exp);
    await page.evaluate(() => localStorage.clear()); await page.reload({waitUntil: 'domcontentloaded'}); await play();
    ok('cleared origin has no world_packs state', (await people()).length === 0);
    await page.locator('#saved_file_input').setInputFiles(exp); await page.waitForTimeout(2200); await play();
    ok('literal Import restores both people, identical slice', (await people()).join() === BOTH.join() && JSON.stringify((await snap()).world_packs) === savedSlice);
    ok('no page errors', errors.length === 0);
} finally {
    fs.writeFileSync(path.join(out, 'world-pack-browser.json'), JSON.stringify({origin, checks, errors}, null, 2));
    await browser.close(); server.close();
}
