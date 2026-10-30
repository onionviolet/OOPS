// Headless 1920x1080 fresh-player walk for docs/audits/UI_CAPABILITY_GAPS_2026-10-30.md.
// Plays the Village start, then the Tingen lead's start, recording screenshots and
// a five-second-test fact sheet per checkpoint. Rebuilt bundle, fresh test origin.
// Usage: node scripts/capture_capability_gaps.mjs [outDir]
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require = createRequire(import.meta.url);
const {launchChrome} = require('./ui_helpers.cjs');
const root = resolve(new URL('..', import.meta.url).pathname);
const out = resolve(root, process.argv[2] || 'docs/audits/evidence/capability-gaps-2026-10-30/before');
await mkdir(out, {recursive: true});
const types = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2'};
const server = createServer(async (req, res) => {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    try { res.writeHead(200, {'content-type': types[extname(path)] || 'application/octet-stream'}).end(await readFile(path)); } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await launchChrome();
const receipt = {bundle: createHash('sha256').update(await readFile(resolve(root, 'dist/bundle.js'))).digest('hex').slice(0, 12), viewport: '1920x1080', steps: []};
const note = (step, data) => { receipt.steps.push({step, ...data}); console.log(step, JSON.stringify(data).slice(0, 400)); };
// Facts a player could read in five seconds without scrolling the page.
const facts = page => page.evaluate(() => {
    const vis = n => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(n).visibility !== 'hidden'; };
    const text = sel => [...document.querySelectorAll(sel)].filter(vis).map(n => n.innerText.trim()).filter(Boolean);
    const panelSelect = [...document.querySelectorAll('select')].find(s => /All panels/.test(s.textContent));
    return {
        nextStep: text('[class*="next-step"], [data-next-step], .next-step').slice(0, 2),
        buttons: [...document.querySelectorAll('button')].filter(vis).length,
        panelSelectOptions: panelSelect ? panelSelect.options.length : null,
        hasPanelSearch: !!document.querySelector('input[type="search"], input[placeholder*="ind"], [aria-label*="Find panel"]'),
        actionsText: (document.getElementById('location_actions_div')?.innerText || '').slice(0, 300),
        reportsLatest: (document.getElementById('message_log')?.innerText || '').split('\n').filter(Boolean).slice(0, 6),
        bodyChars: document.body.innerText.length,
        docScrollH: document.documentElement.scrollHeight,
    };
});
const shot = async (page, name, extra = {}) => {
    await page.screenshot({path: resolve(out, `${name}.png`)});
    note(name, {...(await facts(page)), ...extra});
};
const start = async page => {
    await page.goto(`${base}/?test_hooks=1`);
    await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 60000});
    await page.locator('#loading_screen_play_button').click();
    if (await page.locator('#hero_creation_panel_confirmation').isVisible()) await page.locator('#hero_creation_panel_confirmation').click();
    await page.waitForTimeout(700);
};
try {
    const context = await browser.newContext({viewport: {width: 1920, height: 1080}}), page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await start(page);
    await shot(page, 'v01-first-screen');
    const actions = page.locator('#location_actions_div');
    // Keyboard: does "?" or Ctrl+K open a command/help surface?
    await page.keyboard.press('Shift+Slash'); await page.waitForTimeout(300);
    await shot(page, 'v02-after-question-mark');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Control+k'); await page.waitForTimeout(300);
    await shot(page, 'v03-after-ctrl-k', {palette: await page.evaluate(() => [...document.querySelectorAll('#command_palette_list li')].filter(li => li.getAttribute('role') === 'presentation').map(li => li.textContent))});
    await page.keyboard.press('Escape');
    await actions.getByText('Talk to someone', {exact: false}).first().click(); await page.waitForTimeout(300);
    await shot(page, 'v04-talk-menu');
    await actions.getByText('Talk to village elder', {exact: false}).first().click(); await page.waitForTimeout(300);
    await shot(page, 'v05-elder-dialogue');
    const hello = actions.locator('.dialogue_textline[data-textline="hello"]');
    await hello.waitFor({state: 'visible'}); await hello.evaluate(n => n.click()); await hello.waitFor({state: 'detached'});
    await page.evaluate(() => end_dialogue()); await page.evaluate(() => advanceTicks(3)); await page.waitForTimeout(500);
    await shot(page, 'v06-after-elder');
    await actions.getByText('Find work', {exact: false}).first().click().catch(() => {}); await page.waitForTimeout(300);
    await shot(page, 'v07-find-work');
    // A rival-able refusal: try an action that cannot run and read the reason.
    await page.locator('#nav-more, select').first().isVisible().catch(() => {});
    await page.evaluate(() => advanceTicks(60)); await page.waitForTimeout(500);
    await shot(page, 'v08-after-an-hour');
    // Tingen lead.
    const context2 = await browser.newContext({viewport: {width: 1920, height: 1080}}), lead = await context2.newPage();
    lead.on('pageerror', e => errors.push(e.message));
    await start(lead);
    await lead.locator('#location_actions_div').getByText('Cross to another world', {exact: false}).first().click(); await lead.waitForTimeout(500);
    await shot(lead, 't01-world-entry');
    await lead.getByRole('button', {name: /Be Klein Moretti/}).first().click(); await lead.waitForTimeout(400);
    await shot(lead, 't02-lead-confirm');
    const t0 = Date.now(); await lead.getByRole('button', {name: 'Start this new life'}).click();
    await lead.waitForFunction(() => /Moretti/.test(document.getElementById('location_name_span')?.innerText || ''), null, {timeout: 30000}); await lead.waitForTimeout(500);
    note('life start duration ms', {ms: Date.now() - t0});
    await shot(lead, 't03-lead-first-screen');
    for (let i = 1; i <= 3; i++) { await lead.evaluate(() => advanceTicks(60)); await lead.waitForTimeout(500); await shot(lead, `t0${3 + i}-lead-hour-${i}`); }
    note('page-errors', {errors});
    await writeFile(resolve(out, 'receipt.json'), JSON.stringify(receipt, null, 1) + '\n');
} finally { await browser.close(); server.close(); }
