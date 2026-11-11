// Regional staple prices at 1920×1080 from a fresh origin, headless (XWR17, ECR3-ECR5, ECR15). Run after `npm run build`:
//   python3 -m http.server 19711 --bind 127.0.0.1 &  YAIRPG_PORT=19711 node scripts/regional_prices_browser.cjs
// Journey (named fixture: Forest road unlocked, 400 coins, and a bad week for Slums bread, so its shelf is nearly bare):
// read Dunstan's shelf and why, buy bread, walk Village to Slums (540 real minutes), see Quill's price and why, sell, check
// conserved totals, walk back and read the remembered Slums price, save, reload and import.
const fs = require('node:fs'), assert = require('node:assert/strict');
const {runBrowser} = require('./ui_helpers.cjs');
const {startFresh} = require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url = `http://127.0.0.1:${process.env.YAIRPG_PORT || 19711}/?test_hooks=1`, evidence = process.env.YAIRPG_PROOF_DIR || 'docs/representations/evidence/economy';
const say = m => console.log(m); fs.mkdirSync(evidence, {recursive: true});
const key = id => JSON.stringify({id}), STALE = key('Stale bread'), FRESH = key('Fresh bread');
runBrowser(async browser => {
    const errors = [], context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    await context.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}));
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if(m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    const boot = async () => { await page.waitForFunction(() => window.simulationTestHooks); await page.evaluate(() => simulationTestHooks.pause()); await startFresh(page);
        await page.waitForFunction(() => { const s = simulationTestHooks.saveStatus(); return s.ownsSave && !s.restoring && !s.writeBlocked; }, null, {timeout: 15000}); };
    const snap = () => page.evaluate(() => simulationTestHooks.snapshot());
    const reseed = async edit => { const s = await snap(); edit(s); await page.evaluate(x => localStorage.setItem('save data', JSON.stringify(x)), s); await page.reload(); await boot(); };
    const go = async id => { await page.evaluate(id => window.change_location({location_id: id}), id); await page.waitForFunction(id => simulationTestHooks.snapshot()['current location'] === id, id); };
    const shelf = (s, vendor, k) => s.inventories.trader[vendor]?.[k]?.count ?? 0, held = (s, k) => s.inventories.person.main_character[k]?.count ?? 0;
    const total = (s, k) => shelf(s, 'villageTrader', k) + shelf(s, 'suspiciousTrader', k) + held(s, k);
    const notes = async () => (await page.locator('#trade_price_notes').innerText()).replace(/\s+/g, ' ');
    const open = async vendor => { await page.evaluate(v => window.startTrade(v), vendor); await page.locator('#trade_price_notes:not([hidden])').waitFor({timeout: 8000}); };
    const clock = () => page.evaluate(() => simulationTestHooks.clock());

    await page.goto(url); await boot(); say('fresh life');
    await reseed(s => {
        s.availabilities.location['Forest road'] |= 1; s.character.money = 400;
        s.inventories.trader.villageTrader = {[STALE]: {count: 10}, [FRESH]: {count: 5}, [key('Coal')]: {count: 12}};
        s.inventories.trader.suspiciousTrader = {[STALE]: {count: 1}, [key('Coal')]: {count: 35}};
        for(const v of ['villageTrader', 'suspiciousTrader']) s.npcs[v].trader.last_refresh = 0;
    });
    const start = await snap(), t0 = await clock();
    const base = {stale: total(start, STALE), fresh: total(start, FRESH)};

    // 1. Dunstan's shelf says what bread costs and why.
    await open('villageTrader');
    const village = await notes(); say(`village: ${village.slice(0, 170)}`);
    assert.match(village, /Stale bread: (cheap|ordinary price|dear)/); assert.match(village, /The farms are close/);
    const villageBuy = Number(/Stale bread: [^.]*\. You pay (\d+)/.exec(village)[1]);
    for(const [k, n] of [[STALE, 4], [FRESH, 3]]) await page.evaluate(x => window.add_to_buying_list(x), {item_key: k, count: n});
    await page.screenshot({path: `${evidence}/regional-prices-village-1920.png`});
    await page.evaluate(() => window.accept_trade()); await page.evaluate(() => window.exitTrade());
    const bought = await snap();
    assert.equal(held(bought, STALE) - held(start, STALE), 4); assert.equal(held(bought, FRESH) - held(start, FRESH), 3);
    assert.equal(shelf(bought, 'villageTrader', STALE), 6, 'what you buy leaves the seller\'s stock');
    const spent = start.character.money - bought.character.money; assert.ok(spent > 0); say(`bought 4 stale + 3 fresh bread for ${spent} coins (first stale at ${villageBuy})`);

    // 2. The road is real time: 540 minutes through the Forest road and the town gate.
    await go('Forest road'); await go('Town outskirts'); await go('Slums');
    const t1 = await clock(); assert.equal(t1 - t0, 540, 'the walk costs 540 minutes');

    // 3. Quill's shelf is bare: bread is dear here, and the keeper says why.
    await open('suspiciousTrader');
    const slums = await notes(); say(`slums: ${slums.slice(0, 260)}`);
    assert.match(slums, /Stale bread: dear here/); assert.match(slums, /Only 1 left|None on the shelf/); assert.match(slums, /little grain inside the walls/);
    const slumsBid = Number(/Stale bread: [^.]*\. You pay \d+, he pays (\d+)/.exec(slums)[1]);
    assert.ok(slumsBid > villageBuy, `Quill pays ${slumsBid} for what cost ${villageBuy}: the route pays`);
    for(const [k, n] of [[STALE, 4], [FRESH, 3]]) await page.evaluate(x => window.add_to_selling_list(x), {item_key: k, count: n});
    await page.screenshot({path: `${evidence}/regional-prices-slums-1920.png`});
    await page.evaluate(() => window.accept_trade());
    const sold = await snap();
    const earned = sold.character.money - bought.character.money; say(`sold for ${earned} coins against ${spent} spent`);
    assert.ok(earned > spent, 'buying cheap and selling dear paid');
    assert.equal(shelf(sold, 'suspiciousTrader', STALE), 5, 'what you sell enters the buyer\'s stock');
    assert.equal(total(sold, STALE), base.stale, 'bread is conserved across the two shelves and your pack');
    assert.equal(total(sold, FRESH), base.fresh);
    const after = await notes(); say(`slums after: ${after.slice(0, 200)}`);
    const slumsBuyAfter = Number(/Stale bread: [^.]*\. You pay (\d+)/.exec(after)[1]);
    const slumsBuyBefore = Number(/Stale bread: [^.]*\. You pay (\d+)/.exec(slums)[1]);
    assert.ok(slumsBuyAfter < slumsBuyBefore, 'the glut you sold in makes Slums bread cheaper');
    await page.evaluate(() => window.exitTrade());

    // 4. Save and reload keep both shelves; the walk home brings the Slums price back as something remembered, not live.
    await page.evaluate(() => window.saveProgress()); await page.reload(); await boot();
    const kept = await snap(); assert.equal(shelf(kept, 'suspiciousTrader', STALE), 5); assert.equal(shelf(kept, 'villageTrader', STALE), 6);
    await go('Town outskirts'); await go('Forest road'); await go('Village');
    await open('villageTrader');
    const home = await notes(); say(`home: ${home.slice(-190)}`);
    assert.match(home, /Stale bread in the Slums: \d+ coins when you last saw it, (today|yesterday|\d+ days ago)/);
    assert.equal(shelf(await snap(), 'villageTrader', STALE), 6, 'the village shelf is where you left it (one cart not yet due)');
    await page.screenshot({path: `${evidence}/regional-prices-home-1920.png`});
    assert.deepEqual(errors, []); say('PASS');
}).catch(e => { console.error(e); process.exitCode = 1; });
