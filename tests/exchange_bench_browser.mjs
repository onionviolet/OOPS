// Headless proof for the recarve exchange at the rune bench (not part of `npm test`). Usage: node tests/exchange_bench_browser.mjs
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = process.cwd(), out = 'docs/gm/dispatch/making-donor-2026-11-04/evidence/';
const types = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml'};
const server = createServer(async (req, res) => { try { const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname === '/' ? '/index.html' : new URL(req.url, 'http://x').pathname)); const b = await readFile(p); res.writeHead(200, {'content-type': types[path.extname(p)] ?? 'application/octet-stream'}); res.end(b); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const report = {origin, checks: [], runs: []}, errors = [];
const check = (label, value) => { assert.ok(value, label); report.checks.push(label); console.log('PASS ' + label); };
async function play(page) { await page.waitForTimeout(500); if(await page.locator('#loading_screen_play_button').isVisible()) await page.locator('#loading_screen_play_button').click(); await page.waitForTimeout(300); }
const encode = s => 'YAIR-UTF8-1:' + Buffer.from(s, 'utf8').toString('base64'), decode = t => JSON.parse(Buffer.from(t.trim().slice(12), 'base64').toString('utf8'));
async function openBench(page) { const b = page.locator('#rune_bench_panel'); if(!await b.isVisible()) await page.getByRole('combobox', {name: 'Other known panels'}).selectOption('rune-bench'); await page.waitForTimeout(200); return b; }
const preview = async page => (await page.locator('[data-rune-preview]').innerText());
const wood = async page => (await page.evaluate(() => window.simulationTestHooks.snapshot().inventories.person.main_character['{"id":"Rough wood log"}']?.count ?? 0));
try {
  for(const [w, h, px] of [[1920, 1080, 14], [1536, 864, 14], [1536, 864, 21]]) {
    const ctx = await browser.newContext({viewport: {width: w, height: h}, acceptDownloads: true}), page = await ctx.newPage();
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(origin + '?test_hooks=1', {waitUntil: 'domcontentloaded'}); await play(page);
    // Seed wood through a literal exported file, the same route a player's import takes.
    const dl = page.waitForEvent('download'); await page.locator('#save_to_file_button').click(); const file = out + `seed-${w}-${px}.txt`; await (await dl).saveAs(file);
    const save = decode(await readFile(file, 'utf8')); save.inventories.person.main_character['{"id":"Rough wood log"}'] = {count: 6}; await writeFile(file, encode(JSON.stringify(save)));
    await page.locator('#saved_file_input').setInputFiles(file); await page.waitForTimeout(2500); await play(page);
    await page.evaluate(n => { document.documentElement.style.fontSize = n + 'px'; }, px);
    check(`${w}x${px}: seeded 6 wood`, await wood(page) === 6);
    const bench = await openBench(page);
    for(const r of ['ember', 'gale', 'root']) await bench.locator(`[data-rune="${r}"]`).click();
    check(`${w}x${px}: first carve quotes full price, no release`, /3 wood needed/.test(await preview(page)) && !/Replacing/.test(await preview(page)));
    await bench.locator('[data-carve]').click(); await page.waitForTimeout(400);
    check(`${w}x${px}: first carve spends 3, stock 3`, await wood(page) === 3);
    for(const r of ['gale', 'tide']) await bench.locator(`[data-rune="${r}"]`).click();
    const q = await preview(page); console.log(q);
    check(`${w}x${px}: recarve preview shows worn tablet covers 2, spend 0`, /Replacing the worn tablet covers 2; spend 0/.test(q));
    await bench.locator('[data-carve]').click(); await page.waitForTimeout(400);
    check(`${w}x${px}: recarve spends no wood and mints none`, await wood(page) === 3);
    await page.screenshot({path: out + `bench-${w}-${px}.png`});
    // Persistence is unchanged (no new field): reload, then export and literal import keep the worn tablet and stock.
    await page.reload(); await play(page);
    const after = await page.evaluate(() => window.simulationTestHooks.snapshot());
    check(`${w}x${px}: reload keeps stock 3 and worn tablet gale>tide`, after.inventories.person.main_character['{"id":"Rough wood log"}'].count === 3 && JSON.stringify(after.pledges?.talisman?.runes) === '["gale","tide"]');
    const dl2 = page.waitForEvent('download'); await page.locator('#save_to_file_button').click(); const f2 = out + `export-${w}-${px}.txt`; await (await dl2).saveAs(f2);
    await page.locator('#saved_file_input').setInputFiles(f2); await page.waitForTimeout(2500); await play(page);
    const imp = await page.evaluate(() => window.simulationTestHooks.snapshot());
    check(`${w}x${px}: literal import keeps stock and tablet`, imp.inventories.person.main_character['{"id":"Rough wood log"}'].count === 3 && JSON.stringify(imp.pledges?.talisman?.runes) === '["gale","tide"]');
    await ctx.close();
  }
  check('no browser runtime errors', errors.length === 0);
} finally { report.errors = errors; await writeFile(out + 'browser.json', JSON.stringify(report, null, 2)); await browser.close(); server.close(); }
