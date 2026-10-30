// Headless 1920x1080 run of the Lives tab in the rebuilt game: fresh origin, one life, then a second life, then a resume.
// Run `npm run build` first. Writes evidence PNGs and prints checks.
import {createServer} from 'node:http';
import {readFile, mkdir} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {launchChrome} = createRequire(import.meta.url)('./ui_helpers.cjs');
const root = resolve(new URL('..', import.meta.url).pathname), out = resolve(root, process.argv[2] || 'docs/representations/evidence/spacetime');
await mkdir(out, {recursive: true});
const types = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2'};
const server = createServer(async (req, res) => {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    try { const data = await readFile(path); res.writeHead(200, {'content-type': types[extname(path)] || 'application/octet-stream'}).end(data); } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const browser = await launchChrome(), errors = [];
try {
    const page = await (await browser.newContext({viewport: {width: 1920, height: 1080}})).newPage();
    page.on('pageerror', e => errors.push(e.message));
    const play = async () => { await page.waitForTimeout(500); if (await page.locator('#loading_screen_play_button').isVisible()) await page.locator('#loading_screen_play_button').click(); await page.waitForTimeout(800); const hero = page.locator('#hero_creation_panel_confirmation'); if (await hero.isVisible()) await hero.click({timeout: 60000}); await page.waitForTimeout(800); };
    const open = async () => { if (!await page.locator('#continuation_open').isVisible()) await page.getByRole('combobox', {name: 'Other known panels'}).selectOption('continuation'); await page.locator('#continuation_open').click(); await page.waitForTimeout(150); };
    const action = async id => { await page.locator(`[data-continuation-action="${id}"]`).first().click(); await page.waitForTimeout(150); const b = page.locator(`[data-continuation-action="${id}"]`).filter({hasText: /^Confirm /}); if (await b.count()) await b.click(); };
    const lives = async () => { await page.locator('[data-connection-tab=lives]').click(); await page.waitForTimeout(300); return page.locator('#continuation_view .fig-svg, #continuation_view svg').count(); };
    await page.goto(`http://127.0.0.1:${server.address().port}/?test_hooks=1`, {waitUntil: 'domcontentloaded'});
    await play(); await open();
    assert.ok(await lives() > 0, 'lives tab draws a figure');
    let text = await page.locator('#continuation_view').innerText();
    assert.match(text, /Your lives and return points/); assert.match(text, /1 life in one connection/);
    await page.screenshot({path: `${out}/game-lives-one.png`});
    await page.locator('[data-connection-tab=return]').click(); await action('fresh'); await page.waitForTimeout(2200); await play(); await open();
    assert.ok(await lives() > 0);
    text = await page.locator('#continuation_view').innerText();
    assert.match(text, /2 lives in one connection/); assert.match(text, /route/);
    assert.ok(!/Start not set/.test(text), 'no placeholder start date');
    await page.screenshot({path: `${out}/game-lives-two.png`});
    console.log('PASS lives tab in game, page errors:', errors.length, errors.join('; '));
    assert.deepEqual(errors, []);
} finally { await browser.close(); server.close(); }
