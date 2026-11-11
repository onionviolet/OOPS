// Headless 1920x1080 evidence for ITM23 / FRC54 (item identity by the seat's own knowledge).
// Fresh test origin, rebuilt bundle, earned steps only: cross to Tingen as a Mandated Punisher
// probationer, report in at the docks, then buy and verify broker lots. Writes screenshots and a
// receipt to docs/representations/evidence/item_identity/. Usage: node scripts/capture_item_identity_evidence.mjs
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require = createRequire(import.meta.url);
const {launchChrome} = require('./ui_helpers.cjs');
const root = resolve(new URL('..', import.meta.url).pathname), out = resolve(root, 'docs/representations/evidence/item_identity');
const types = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2'};
const server = createServer(async (req, res) => {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    try { const data = await readFile(path); res.writeHead(200, {'content-type': types[extname(path)] || 'application/octet-stream'}).end(data); } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
await mkdir(out, {recursive: true});
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await launchChrome(), receipt = {bundle: createHash('sha256').update(await readFile(resolve(root, 'dist/bundle.js'))).digest('hex').slice(0, 12), viewport: '1920x1080', steps: []};
const note = (step, data) => { receipt.steps.push({step, ...data}); console.log(step, JSON.stringify(data).slice(0, 300)); };
const tab = async id => { await page.locator(`[data-workroom-tabs] [data-tab="${id}"]`).first().click(); await page.waitForTimeout(250); };
let page;
try {
    const context = await browser.newContext({viewport: {width: 1920, height: 1080}}), errors = []; page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/?test_hooks=1`);
    await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 60000});
    await page.locator('#loading_screen_play_button').click();
    if (await page.locator('#hero_creation_panel_confirmation').isVisible()) await page.locator('#hero_creation_panel_confirmation').click();
    await page.waitForTimeout(600);
    await page.selectOption('#workspace_navigation select[aria-label="Other known panels"]', 'lotm');
    await page.waitForTimeout(300);
    const click = async text => { await page.getByRole('button', {name: text}).first().click(); await page.waitForTimeout(250); };
    await click('Begin as a Mandated Punisher probationer');
    await click('Confirm and cross to Tingen');
    await page.waitForTimeout(500);
    await click("Report to the Punishers' duty officer");
    const custody = async name => {
        await tab('work');
        const lines = await page.locator('[data-broker-trade]').evaluateAll(ns => ns.map(n => ({text: n.textContent, reading: n.dataset.itemReading || ''})));
        const box = page.locator('[data-broker-trade]').first();
        if (await box.count()) await box.locator('xpath=..').screenshot({path: resolve(out, `${name}-custody.png`)});
        await tab('here');
        return lines;
    };
    const here = async text => { await page.locator('button', {hasText: text}).first().click(); await page.waitForTimeout(250); };
    await here('Pay 48 pence for a bundle of rare');
    note('paid for the hairs: the seller\'s word reads as a guess', {lines: await custody('1-paid')});
    await here('Verify a bundle of rare hairs');
    note('appraised: the guess was wrong', {lines: await custody('2-forged')});
    await here('Pay 36 pence for a dried black-spotted frog');
    await here('Verify a dried black-spotted frog');
    await here('Settle for a dried black-spotted frog');
    // The main inventory names the held frog through the same reading (item_views.js): its detail carries the appraiser's line.
    const row = page.locator('[data-character_item=\'{"id":"Dried black-spotted frog"}\']').first();
    await row.hover(); await page.waitForTimeout(400);
    const tip = await page.evaluate(() => [...document.querySelectorAll('.item_tooltip, #item_tooltip, [role="tooltip"]')].map(n => n.textContent).join(' | '));
    await page.screenshot({path: resolve(out, '3-inventory-screen.png')});
    note('frog held: main inventory reads the known identity', {row: await row.innerText(), appraisedLineInDetail: /appraiser judged it a genuine/.test(tip)});
    await here('Barter a dried black-spotted frog for a jar');
    note('ink in custody before checking', {lines: await custody('4-ink-guessed')});
    receipt.pageErrors = errors;
} finally {
    await writeFile(resolve(out, 'receipt.json'), JSON.stringify(receipt, null, 1) + '\n');
    await browser.close(); server.close();
}
