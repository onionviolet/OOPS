// Organization overview in the Market courtyard panel at 1920×1080 from a fresh origin, headless. After `npm run build`:
//   python3 -m http.server 19641 --bind 127.0.0.1 &  YAIRPG_PORT=19641 node scripts/organization_overview_browser.cjs
// Journey: fresh life → Village → open the courtyard (earned step: the free charter visit) → the panel is its own module (not in Location actions).
const fs = require('node:fs'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const {runBrowser} = require('./ui_helpers.cjs');
const {startFresh} = require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url = `http://127.0.0.1:${process.env.YAIRPG_PORT || 19641}/?test_hooks=1`, evidence = 'docs/representations/evidence/organizations';
fs.mkdirSync(evidence, {recursive: true});
const bundle = crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex').slice(0, 12);
runBrowser(async browser => {
    const errors = [], context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    await context.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}));
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if(m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    await page.goto(url); await page.waitForFunction(() => window.simulationTestHooks); await page.evaluate(() => simulationTestHooks.pause()); await startFresh(page);
    await page.waitForFunction(() => { const s = simulationTestHooks.saveStatus(); return s.ownsSave && !s.restoring && !s.writeBlocked; }, null, {timeout: 15000});
    console.log('bundle', bundle);
    const info = await page.evaluate(() => { const p = document.getElementById('management_panel'); return {inLocation: !!p.closest('#location_actions_div')}; });
    assert.equal(info.inLocation, false, 'panel must not live in Location actions (UR8)');
    await page.getByRole('combobox', {name: 'Other known panels'}).selectOption('management');
    const panel = page.locator('#management_panel');
    const fits = async label => { const m = await page.evaluate(() => ({v: document.scrollingElement.scrollHeight - innerHeight, h: document.scrollingElement.scrollWidth - innerWidth})); assert.ok(m.v <= 0 && m.h <= 0, `${label}: page scrolls ${JSON.stringify(m)}`); };
    await fits('charter'); await page.screenshot({path: `${evidence}/courtyard-charter-1920.png`});
    const press = async name => { await panel.evaluate(n => n.querySelectorAll('details.expedition_card').forEach(d => { d.open = true; })); const b = panel.getByRole('button', {name}).first(); await b.waitFor({state: 'visible', timeout: 5000}); await b.click(); };
    await press(/Visit the market courtyard/);
    const overview = panel.locator('.organization-overview');
    await overview.waitFor({state: 'visible'});
    const idle = await overview.innerText();
    assert.match(idle, /Market courtyard, a household business\. 4 people\./); assert.match(idle, /Nothing is running/); assert.match(idle, /Village standing: Stranger/);
    await fits('idle'); await page.screenshot({path: `${evidence}/courtyard-idle-1920.png`}); console.log('idle:', idle.replace(/\s+/g, ' ').slice(0, 220));
    for (let i = 0; i < 2; i++) await press(/Buy one Rough wood log/);
    await press(/Accept Bram.s ordinary crate order/);
    await page.waitForFunction(() => /1 job under way/.test(document.querySelector('.organization-overview')?.innerText || ''));
    await panel.locator('.organization-table button', {hasText: 'Bram'}).click();
    const busy = await overview.innerText();
    assert.match(busy, /played minutes? left/); assert.match(busy, /Accept Bram/);
    await fits('running'); await page.screenshot({path: `${evidence}/courtyard-running-1920.png`}); console.log('running:', busy.replace(/\s+/g, ' ').slice(0, 400));
    fs.writeFileSync(`${evidence}/overview-text-form.txt`, `Idle:\n${idle}\n\nRunning:\n${busy}\n`);
    console.log('errors', JSON.stringify(errors));
});
