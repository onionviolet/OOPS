// Headless 1920x1080 evidence for the Study panel (docs/representations/RESEARCH.md).
// Fresh test origin, rebuilt bundle. Usage: node scripts/capture_research_evidence.mjs
import {createServer} from 'node:http';
import {readFile, writeFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require = createRequire(import.meta.url);
const {launchChrome} = require('./ui_helpers.cjs');
const root = resolve(new URL('..', import.meta.url).pathname), out = resolve(root, 'docs/representations/evidence/research');
const types = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2'};
const server = createServer(async (req, res) => {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    try { const data = await readFile(path); res.writeHead(200, {'content-type': types[extname(path)] || 'application/octet-stream'}).end(data); } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await launchChrome(), receipt = {bundle: createHash('sha256').update(await readFile(resolve(root, 'dist/bundle.js'))).digest('hex').slice(0, 12), viewport: '1920x1080', steps: []};
const note = (step, data) => { receipt.steps.push({step, ...data}); console.log(step, JSON.stringify(data).slice(0, 400)); };
const {createFieldFixture, fieldCommand, fieldAdvance} = await import('./field_fixtures.mjs');
const {LEVER_PRACTICE_BRACE: brace} = await import('../src/lever_practice_supply.js');
const ask = (p, id) => fieldCommand(p, `field.lp1.${id}`, 'Village', {targetId: 'oldCraftsman'});
// Named fixtures (DEV SEEDED expansion states from the field fixture, not earned in this browser run).
const checked = fieldAdvance(ask(ask(createFieldFixture(), 'demonstrate'), 'hand'), 6);
const midPractice = (() => { let p = ask(ask(checked, 'return'), 'explain'); p.gameplay.player.inventory[brace] = 1; return fieldAdvance(ask(p, 'practice'), 2); })();
const finished = fieldAdvance(midPractice, 1);
const fixtures = {'checked-evidence': ask(checked, 'return'), 'explained': ask(ask(checked, 'return'), 'explain'), 'finished': finished};

async function boot(page, expansion) {
    await page.goto(`${base}/?test_hooks=1`);
    await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 60000});
    await page.locator('#loading_screen_play_button').click();
    if (await page.locator('#hero_creation_panel_confirmation').isVisible()) await page.locator('#hero_creation_panel_confirmation').click();
    await page.waitForTimeout(800);
    if (expansion) {
        await page.evaluate(exp => { saveProgress(); const save = JSON.parse(localStorage.getItem('save data')); save.expansion = exp; localStorage.setItem('save data', JSON.stringify(save)); }, expansion);
        await page.reload(); await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 60000}); await page.locator('#loading_screen_play_button').click(); await page.waitForTimeout(1000);
    }
}
async function openStudy(page, name) {
    await page.getByRole('button', {name: 'Find', exact: true}).click(); await page.keyboard.type('Study'); await page.waitForTimeout(300); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
    const panel = page.locator('#research_panel');
    note(`${name}: panel`, {visible: await panel.isVisible()});
    if (!await panel.isVisible()) return null;
    await page.screenshot({path: resolve(out, `${name}-screen.png`)});
    await panel.screenshot({path: resolve(out, `${name}-panel.png`)});
    const text = await panel.innerText(); await writeFile(resolve(out, `${name}.txt`), text + '\n');
    note(`${name}: text`, {head: text.slice(0, 200)});
    return text;
}
try {
    const errors = [];
    for (const [name, expansion] of [['fresh-life', null], ...Object.entries(fixtures)]) {
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}}), page = await context.newPage();
        page.on('pageerror', e => errors.push(`${name}: ${e.message}`));
        await boot(page, expansion ? JSON.parse(JSON.stringify(expansion.state)) : null);
        await openStudy(page, name);
        if (name === 'explained') { await page.locator('#research_panel details.research-map > summary').click().catch(() => {}); await page.waitForTimeout(300); await page.locator('#research_panel').screenshot({path: resolve(out, 'explained-map.png')}); }
        await context.close();
    }
    {
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}}), page = await context.newPage();
        page.on('pageerror', e => errors.push(`gallery: ${e.message}`));
        await page.goto(`${base}/figure-gallery.html`); await page.waitForTimeout(800);
        for (const id of ['research-map-frontier.lever', 'research-ladder-frontier.lever']) {
            const section = page.locator(`[data-fixture="${id}"]`); await section.scrollIntoViewIfNeeded(); await section.screenshot({path: resolve(out, `gallery-${id.replace('frontier.', '')}.png`)});
            note(`gallery ${id}`, {text: (await section.locator('.fig-text').first().innerText()).slice(0, 300)});
        }
        await context.close();
    }
    note('errors', {errors});
} finally { await browser.close(); server.close(); await writeFile(resolve(out, 'receipt.json'), JSON.stringify(receipt, null, 1)); }
