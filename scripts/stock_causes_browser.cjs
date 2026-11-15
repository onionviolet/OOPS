// PS161 conditional trader stock at 1920x1080 from a fresh origin, headless. Run after a build:
//   python3 -m http.server 19761 --bind 127.0.0.1 &  YAIRPG_PORT=19761 node scripts/stock_causes_browser.cjs
// Setup (fixture, not proof): standing in the Slums, then the Gang hideout's 30 groups marked beaten. Played: Quill's first
// shelf and his standing line about the gang, Quill's news that the steel comes with the next load,
// a save and reload (the shelf itself still reads "not yet"), four days on, the steel on the shelf and his fresh line.
const fs = require('node:fs'), assert = require('node:assert/strict');
const {runBrowser} = require('./ui_helpers.cjs');
const {startFresh} = require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url = `http://127.0.0.1:${process.env.YAIRPG_PORT || 19761}/?test_hooks=1`, evidence = process.env.YAIRPG_PROOF_DIR || 'docs/representations/evidence/economy';
const say = m => console.log(m); fs.mkdirSync(evidence, {recursive: true});
runBrowser(async browser => {
    const errors = [], context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    await context.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}));
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if(m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    const boot = async () => { await page.waitForFunction(() => window.simulationTestHooks); await page.evaluate(() => simulationTestHooks.pause()); await startFresh(page);
        await page.waitForFunction(() => { const s = simulationTestHooks.saveStatus(); return s.ownsSave && !s.restoring && !s.writeBlocked; }, null, {timeout: 15000}); };
    const snap = () => page.evaluate(() => simulationTestHooks.snapshot());
    const reseed = async edit => { const s = await snap(); edit(s); await page.evaluate(x => localStorage.setItem('save data', JSON.stringify(x)), s); await page.reload(); await boot(); };
    const greeting = async () => (await page.locator('#trade_greeting').innerText()).replace(/\s+/g, ' ');
    const open = async () => { await page.evaluate(() => window.startTrade('suspiciousTrader')); await page.locator('#trade_greeting:not([hidden])').waitFor({timeout: 8000}); };
    const steel = s => Object.keys(s.inventories.trader.suspiciousTrader ?? {}).filter(k => /Steel chainmail/.test(k)).length;

    await page.goto(url); await boot(); say('fresh life');
    await reseed(s => {
        for(const id of ['Town outskirts', 'Slums', 'Gang hideout']) s.availabilities.location[id] |= 1;
        s['current location'] = 'Slums';
    });

    // 1. Before the clear: Quill's shelf, and while the gang holds, his line about where the good blades go.
    await open();
    const before = await greeting(); say(`before: ${before}`);
    assert.match(before, /hideout lot take their cut/);
    assert.equal(steel(await snap()), 0, 'no steel mail while the gang holds');
    await page.evaluate(() => window.exitTrade());

    // 2. The clear itself is fixture setup (a test hero does not survive 30 thug groups; the fight is not this change):
    // the save records 30 groups beaten, the count the stock condition reads.
    await reseed(s => { s.locations['Gang hideout'] = {...s.locations['Gang hideout'], enemy_groups_killed: 30}; });
    const cleared = await snap(); say(`cleared (fixture): ${cleared.locations['Gang hideout'].enemy_groups_killed} groups`);

    // 3. The news arrives before the cart: he names when the steel comes.
    await open();
    const coming = await greeting(); say(`after clear: ${coming}`);
    assert.match(coming, /steel mail and the better blades come with the next load, (tomorrow|in \d days)/);
    assert.equal(steel(await snap()), 0, 'the shelf has not changed yet');
    await page.screenshot({path: `${evidence}/stock-causes-coming-1920.png`});
    await page.evaluate(() => window.exitTrade());

    // 4. Save and reload: the memory is gone, and the shelf itself still says "not yet".
    await page.evaluate(() => window.saveProgress()); await page.reload(); await boot();
    await open(); const reloaded = await greeting(); say(`after reload: ${reloaded}`);
    assert.match(reloaded, /next load/);
    await page.evaluate(() => window.exitTrade());

    // 5. Four days on, the cart has come: steel on the shelf, and he says it reached him.
    await reseed(s => { s['current time'].day_count += 4; });
    await open();
    const fresh = await greeting(), after = await snap(); say(`next cart: ${fresh} (${steel(after)} steel mail rows)`);
    assert.ok(steel(after) > 0, 'steel mail on the shelf');
    assert.match(fresh, /Steel mail on the rack/);
    await page.screenshot({path: `${evidence}/stock-causes-fresh-1920.png`});
    assert.deepEqual(errors, []);
    say('PS161 stock causes: passed');
});
