// Headless 1920x1080 evidence for the Journal Knows tab (docs/representations/KNOWLEDGE.md).
// Fresh test origin, rebuilt bundle. Writes screenshots and text forms to
// docs/representations/evidence/knowledge/. Usage: node scripts/capture_knowledge_evidence.mjs
import {createServer} from 'node:http';
import {readFile, writeFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require = createRequire(import.meta.url);
const {launchChrome} = require('./ui_helpers.cjs');
const root = resolve(new URL('..', import.meta.url).pathname), out = resolve(root, 'docs/representations/evidence/knowledge');
const types = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2'};
const server = createServer(async (req, res) => {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    try { const data = await readFile(path); res.writeHead(200, {'content-type': types[extname(path)] || 'application/octet-stream'}).end(data); } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await launchChrome(), receipt = {bundle: createHash('sha256').update(await readFile(resolve(root, 'dist/bundle.js'))).digest('hex').slice(0, 12), viewport: '1920x1080', steps: []};
const note = (step, data) => { receipt.steps.push({step, ...data}); console.log(step, JSON.stringify(data).slice(0, 300)); };
async function knows(page, name) {
    // The shell's top nav names every Journal tab (UR42); Knows is its own route.
    await page.locator('button[data-route-id="records:knows"]').click();
    await page.waitForTimeout(400);
    const text = await page.locator('#knows_box_div').innerText();
    await page.locator('#knows_box_div').screenshot({path: resolve(out, `${name}-cases.png`)});
    await page.locator('#knows_box_div').getByRole('button', {name: 'List', exact: true}).click();
    await page.waitForTimeout(200);
    await page.locator('#knows_box_div').screenshot({path: resolve(out, `${name}-list.png`)});
    await page.screenshot({path: resolve(out, `${name}-screen.png`)});
    let board = '';
    if (await page.getByRole('button', {name: 'Board', exact: true}).count()) {
        await page.locator('#knows_box_div').getByRole('button', {name: 'Board', exact: true}).click();
        await page.waitForTimeout(200);
        board = await page.locator('#knows_box_div .knows-board').evaluate(n => n.dataset.text || '');
        await page.locator('#knows_box_div').screenshot({path: resolve(out, `${name}-board.png`)});
    }
    await page.locator('#knows_box_div').getByRole('button', {name: 'Cases', exact: true}).click();
    await writeFile(resolve(out, `${name}.txt`), `${text}\n\n--- board text form ---\n${board}\n`);
    return {text, board};
}
try {
    const context = await browser.newContext({viewport: {width: 1920, height: 1080}}), page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/?test_hooks=1`);
    await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 60000});
    await page.locator('#loading_screen_play_button').click();
    if (await page.locator('#hero_creation_panel_confirmation').isVisible()) await page.locator('#hero_creation_panel_confirmation').click();
    await page.waitForTimeout(600);
    // Earned step: meeting the village elder discovers the Journal on a fresh life (main.js records gate).
    note('journal hidden before meeting the elder', {visible: await page.locator('#journal_div').isVisible()});
    const actions = page.locator('#location_actions_div');
    await actions.getByText('Talk to someone', {exact: false}).first().click(); await actions.getByText('Talk to village elder', {exact: false}).first().click();
    const hello = actions.locator('.dialogue_textline[data-textline="hello"]');
    await hello.waitFor({state: 'visible'}); await hello.evaluate(n => n.click()); await hello.waitFor({state: 'detached'});
    await page.evaluate(() => end_dialogue()); await page.evaluate(() => advanceTicks(3)); await page.waitForTimeout(500);
    note('met the elder', {journalVisible: await page.locator('#journal_div').isVisible()});
    note('fresh-life', await knows(page, 'fresh-life'));
    // Named prerequisite fixture (as tests/person_memory_route.test.js and village_route.mjs): unlock the
    // craftsman meeting, normally earned after the rats. Then real clicks: meet him, ask about his habits.
    await page.evaluate(() => { saveProgress(); const save = JSON.parse(localStorage.getItem('save data')); save.availabilities.dialogue.oldCraftsman = 1; localStorage.setItem('save data', JSON.stringify(save)); });
    await page.reload(); await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 60000}); await page.locator('#loading_screen_play_button').click(); await page.waitForTimeout(800);
    // A reload can keep the Journal in the center; the center's own Here tab brings the actions back.
    const here = page.getByRole('button', {name: 'Here', exact: true});
    if (!(await actions.isVisible())) { for (const b of await here.all()) if (await b.isVisible()) { await b.click(); break; } await page.waitForTimeout(400); }
    const craftsman = actions.getByText('Talk to old craftsman', {exact: false}).first();
    for (let i = 0; i < 3 && !(await craftsman.isVisible()); i++) { await actions.getByText('Talk to someone', {exact: false}).first().click(); await page.waitForTimeout(500); }
    await craftsman.click();
    const meet = actions.locator('.dialogue_textline[data-textline="hello"]');
    await meet.waitFor({state: 'visible'}); await meet.evaluate(n => n.click()); await meet.waitFor({state: 'detached'});
    await page.evaluate(() => end_dialogue()); await page.evaluate(() => advanceTicks(2)); await page.waitForTimeout(400);
    await page.locator('button[data-route-id="records:notebook"]').click(); await page.waitForTimeout(300);
    await page.locator('#notebook_tab_people').click().catch(() => {});
    await page.evaluate(() => { const d = document.getElementById('simulation_panel'); if (d) d.open = true; });
    // The village simulation is opt-in: the player's own "Follow local people and work" choice.
    const follow = page.getByRole('button', {name: 'Follow local people and work', exact: true});
    note('follow control', {count: await follow.count()});
    if (await follow.count()) { await follow.first().evaluate(n => n.click()); await page.waitForTimeout(300); }
    const ask = page.locator('[data-simulation="village.working_habits"]');
    note('working habits control', {count: await ask.count(), disabled: await ask.first().isDisabled().catch(() => null)});
    await ask.first().evaluate(n => n.click()); await page.evaluate(() => advanceTicks(2)); await page.waitForTimeout(400);
    note('saved knowledge', await page.evaluate(() => Object.keys(simulationTestHooks.snapshot().expansion?.simulation?.knowledge?.player || {})));
    await page.waitForTimeout(1500);
    note('knows nav badge', await page.locator('button[data-route-id="records:knows"]').evaluate(b => ({newCount: b.dataset.newCount || '0', label: b.getAttribute('aria-label') || b.textContent})));
    note('asked-craftsman', await knows(page, 'asked-craftsman'));
    note('page-errors', {errors});
    // Gallery: the named fixture through the real adapter, both themes.
    const gallery = await context.newPage();
    await gallery.goto(`${base}/figure-gallery.html`);
    const section = gallery.locator('[data-fixture="knows-harbor-bell"]');
    await section.waitFor({timeout: 20000});
    await section.screenshot({path: resolve(out, 'gallery-fixture.png')});
    const galleryText = await section.locator('.fig-text, pre, [class*="text"]').first().innerText().catch(() => '');
    await writeFile(resolve(out, 'gallery-fixture.txt'), galleryText);
    note('gallery', {chars: galleryText.length});
    await writeFile(resolve(out, 'receipt.json'), JSON.stringify(receipt, null, 1) + '\n');
} finally { await browser.close(); server.close(); }
