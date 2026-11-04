// H8 price causes at 1920×1080 from a fresh origin, headless. Run after `npm run build` with a static server on YAIRPG_PORT:
//   python3 -m http.server 19641 --bind 127.0.0.1 &  YAIRPG_PORT=19641 node scripts/price_causes_browser.cjs
// Journey: fresh life; a pity cause (saved) tags the Village quote with its why; a shut-street fear cause refuses the shop with
// its reason; a missed gutter-crews term, settled by the real tick, writes a fear row that the Standing panel lists; all survive reload.
const fs = require('node:fs'), assert = require('node:assert/strict');
const {runBrowser} = require('./ui_helpers.cjs');
const {startFresh} = require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url = `http://127.0.0.1:${process.env.YAIRPG_PORT || 19641}/?test_hooks=1`, evidence = process.env.YAIRPG_PROOF_DIR || 'docs/representations/evidence/economy';
const say = m => console.log(m); fs.mkdirSync(evidence, {recursive: true});
const row = (kind, extra = {}) => ({kind, region: 'Village', sell: kind === 'pity' ? 1.05 : 0.94, buy: kind === 'pity' ? 0.95 : 1.06, closes: false, until: 1e9, since: 0,
    why: kind === 'pity' ? 'You were robbed on the road and word got round.' : 'Word of your missed term got round.', detail: 'fixture', source: 'fixture', ...extra});
runBrowser(async browser => {
    const errors = [], context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    await context.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}));
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if(m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    const boot = async () => { await page.waitForFunction(() => window.simulationTestHooks); await page.evaluate(() => simulationTestHooks.pause()); await startFresh(page);
        await page.waitForFunction(() => { const s = simulationTestHooks.saveStatus(); return s.ownsSave && !s.restoring && !s.writeBlocked; }, null, {timeout: 15000}); };
    const reseed = async edit => { const s = await page.evaluate(() => simulationTestHooks.snapshot()); s.economy_standing ||= null; edit(s);
        await page.evaluate(x => localStorage.setItem('save data', JSON.stringify(x)), s); await page.reload(); await boot(); };
    const fresh = () => ({schema: 1, standing: {}, loans: {}, ledger: {family: 'obligations@1', rows: []}, memory: {}, rumours: [], insurance: null, claims: [], traffic: {}, deeds: [], rumourDay: -1, causes: []});
    await page.goto(url); await boot(); say('fresh life');
    const base = await page.evaluate(() => { const s = simulationTestHooks.snapshot(); return s.economy_standing; }); say(`fresh economy_standing slice: ${JSON.stringify(base)?.slice(0, 80)}`);

    await reseed(s => { s.economy_standing = {...fresh(), causes: [row('pity')]}; });
    const kept = await page.evaluate(() => simulationTestHooks.snapshot().economy_standing.causes);
    assert.equal(kept.length, 1, 'pity row survives save and reload');
    await page.evaluate(() => window.startTrade('villageTrader'));
    const box = page.locator('#economy_standing_terms');
    await box.waitFor({state: 'attached'}); await page.locator('#trade_quote_details summary').click().catch(() => {});
    const text = await box.innerText();
    assert.match(text, /Pity \(fixture\), \d+ d left: selling \+5%, buying −5%/); assert.match(text, /Why: You were robbed on the road/);
    await page.screenshot({path: `${evidence}/price-causes-pity-1920.png`}); say(`pity quote: ${text.replace(/\s+/g, ' ').slice(0, 160)}`);
    await page.evaluate(() => window.exitTrade());

    await reseed(s => { s.economy_standing = {...fresh(), causes: [row('fear', {closes: true})]}; });
    await page.evaluate(() => window.startTrade('villageTrader'));
    assert.equal(await page.evaluate(() => window.is_in_trade?.() ?? document.getElementById('trade_div')?.offsetParent !== null), false, 'shop stays shut');
    await page.waitForFunction(() => /The shop is shut to you\. Word of your missed term got round\. It reopens in \d+ day/.test(document.body.innerText));
    await page.screenshot({path: `${evidence}/price-causes-shut-1920.png`}); say('shut street: refused with its reason');

    // Real tick path: a gutter-crews term long missed. The tick settles it and writes the fear row.
    await reseed(s => { s.economy_standing = {...fresh(), loans: {gutter_crews: {principal: 6, rate: 0.36, takenAt: 0, accruedFrom: 0, due: 0, missed: false}},
        ledger: {family: 'obligations@1', rows: [{id: 'credit:gutter_crews', kind: 'coin', debtor: 'player', creditor: 'gutter_crews', amount: 6, why: 'Borrowed from the Gutter Crews', source: 'economy_standing', since: 0, eases: 0, carries: true}]}}; });
    const clock = await page.evaluate(() => simulationTestHooks.clock()); say(`clock ${clock}`);
    await page.evaluate(() => window.advanceTicks(5, {render: true}));
    await page.getByRole('combobox', {name: 'Other known panels'}).selectOption('economy_standing');
    const causes = page.locator('#economy_standing_panel [data-price-cause="fear"]');
    await causes.waitFor({state: 'attached', timeout: 15000});
    await page.locator('#economy_standing_panel [data-section="price-causes"] summary').click();
    const fearText = await causes.innerText(); assert.match(fearText, /Fear in Slums \(Gutter Crews\): selling −6%, buying \+6%, shop shut/);
    await page.screenshot({path: `${evidence}/price-causes-panel-1920.png`}); say(`tick: ${fearText.replace(/\s+/g, ' ').slice(0, 140)}`);
    assert.equal((await page.evaluate(() => simulationTestHooks.snapshot().economy_standing.causes.map(c => c.kind))).join(), 'fear');
    await page.reload(); await boot();
    assert.equal((await page.evaluate(() => simulationTestHooks.snapshot().economy_standing.causes.length)), 1, 'fear row persists across reload');
    assert.deepEqual(errors, []); say('PASS');
}).catch(e => { console.error(e); process.exitCode = 1; });
