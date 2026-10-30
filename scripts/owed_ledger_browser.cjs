// Ledger → Owed (LTU6) at 1920×1080 from a fresh origin, headless. Run after `npm run build` with a static server on YAIRPG_PORT:
//   python3 -m http.server 19631 --bind 127.0.0.1 &  YAIRPG_PORT=19631 node scripts/owed_ledger_browser.cjs
// Journey: fresh life → Ledger route → Owed empty text; earned step: Standing and ledger → Borrow 10 from the Market Circle → Owed row with
// its date and inspector; named fixture `owed-seeded` (save edited through the snapshot hook): overdue loan, second lender and a claim.
const fs = require('node:fs'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const {runBrowser} = require('./ui_helpers.cjs');
const {startFresh} = require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url = `http://127.0.0.1:${process.env.YAIRPG_PORT || 19631}/?test_hooks=1`, evidence = 'docs/representations/evidence/economy';
const DAY = 1440, say = m => console.log(m);
fs.mkdirSync(evidence, {recursive: true});
const bundle = crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex').slice(0, 12);

runBrowser(async browser => {
    const errors = [], [w, h] = [1920, 1080];
    const context = await browser.newContext({viewport: {width: w, height: h}});
    await context.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}));
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if(m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    const missing = []; page.on('response', r => { if(r.status() >= 400) missing.push(r.url().replace(/^https?:\/\/[^/]+/, '')); });
    const panel = page.locator('#work_ledger_panel');
    const boot = async () => { await page.waitForFunction(() => window.simulationTestHooks); await page.evaluate(() => simulationTestHooks.pause()); await startFresh(page);
        await page.waitForFunction(() => { const s = simulationTestHooks.saveStatus(); return s.ownsSave && !s.restoring && !s.writeBlocked; }, null, {timeout: 15000}); };
    const openLedger = async tab => {
        await page.locator('#workspace_navigation button', {hasText: /^Ledger$/}).first().click();
        if(!await panel.evaluate(n => n.open)) await panel.locator('summary').first().click();
        await panel.locator(`[data-ledger-tab="${tab}"]`).click();
    };
    const fits = async label => {
        const m = await page.evaluate(() => { const r = document.getElementById('work_ledger_panel').getBoundingClientRect();
            return {scroll: document.scrollingElement.scrollHeight - innerHeight, hscroll: document.scrollingElement.scrollWidth - innerWidth, top: r.top, bottom: r.bottom, left: r.left, right: r.right}; });
        assert.ok(m.scroll <= 0 && m.hscroll <= 0, `${label}: page scrolls ${JSON.stringify(m)}`);
        assert.ok(m.top >= 0 && m.left >= 0 && m.right <= w && m.top < h, `${label}: panel outside the viewport ${JSON.stringify(m)}`);
        const disabled = await page.$$eval('#work_ledger_panel [data-owed-filter]:disabled', ns => ns.filter(n => !n.title).length);
        assert.equal(disabled, 0, `${label}: a disabled filter without a reason`);
    };

    await page.goto(url); await boot(); say(`[${w}] fresh life, bundle ${bundle}`);
    await openLedger('owed');
    const empty = await panel.locator('[data-owed="empty"]').innerText();
    assert.match(empty, /No one owes you and you owe no one\. Rows appear here when you borrow from a house/);
    assert.equal(await panel.locator('[data-ledger-tab="owed"]').innerText(), 'Owed');
    await fits('empty'); await page.screenshot({path: `${evidence}/owed-empty-1920.png`}); say(`[${w}] empty: ${empty.slice(0, 70)}…`);

    // Earned step: borrow through the existing Standing and ledger panel.
    await page.getByRole('combobox', {name: 'Other known panels'}).selectOption('economy_standing');
    const borrow = page.locator('#economy_standing_panel [data-credit-row="market_circle"] button', {hasText: 'Borrow 10'});
    await borrow.waitFor({state: 'visible'}); await borrow.click();
    await page.locator('#economy_standing_panel', {hasText: 'Borrowed 10 coins'}).waitFor();
    await openLedger('owed');
    assert.equal(await panel.locator('[data-ledger-tab="owed"]').innerText(), 'Owed 1');
    const row = panel.locator('[data-owed-row="credit:market_circle"]');
    assert.match(await row.innerText(), /To the Market Circle\s+10 coins\s+Money\s+due in 28 days/);
    await row.locator('button').click();
    const inspector = await panel.locator('[data-owed="inspector"]').innerText();
    assert.match(inspector, /You owe the Market Circle 10 coins, due in 28 days\./); assert.match(inspector, /Settle: Repay it in Standing and ledger → Credit/);
    await fits('borrowed'); await page.screenshot({path: `${evidence}/owed-borrowed-1920.png`}); say(`[${w}] earned row: ${(await row.innerText()).replace(/\s+/g, ' ')}`);

    // Named fixture owed-seeded: the same save, edited the way a long life would leave it.
    const s = await page.evaluate(() => simulationTestHooks.snapshot());
    const st = s.economy_standing, t = st.loans.market_circle.takenAt;
    st.loans.market_circle.due = Math.max(0, t - 5 * DAY);
    st.loans.gutter_crews = {principal: 6, rate: 0.36, takenAt: t, accruedFrom: t, due: t + 9 * DAY, missed: false};
    st.claims = [{id: `claim:${t}`, amount: 12, at: t, due: t + 2 * DAY, why: 'Insurance claim for cargo'}];
    st.ledger.rows.push({id: 'credit:gutter_crews', kind: 'coin', debtor: 'player', creditor: 'gutter_crews', amount: 6, why: 'Borrowed from the Gutter Crews', source: 'economy_standing', since: t, eases: 0, carries: true},
        {id: `claim:${t}`, kind: 'coin', debtor: 'insurer', creditor: 'player', amount: 12, why: 'Insurance claim for cargo', source: 'economy_standing', since: t, eases: 0, carries: false},
        {id: 'craft:verge-grudge', kind: 'grievance', debtor: 'player', creditor: 'village_verge', amount: 2, why: 'Wasted common verge herbs on steeps that came to nothing', source: 'crafting', since: t, eases: 1, carries: false});
    st.ledger.rows.sort((a, b) => a.id < b.id ? -1 : 1);
    await page.evaluate(x => localStorage.setItem('save data', JSON.stringify(x)), s); await page.reload(); await boot();
    await openLedger('owed');
    const ids = await panel.locator('[data-owed-row]').evaluateAll(ns => ns.map(n => n.dataset.owedRow));
    assert.deepEqual(ids, ['credit:market_circle', `claim:${t}`, 'credit:gutter_crews', 'craft:verge-grudge']);
    assert.match(await panel.locator('[data-owed="summary"]').innerText(), /You owe 3 accounts \(16 coins\)\. Owed to you: 1 account \(12 coins\)\. Next date: the Market Circle, overdue\./);
    await panel.locator(`[data-owed-row="claim:${t}"] button`).click();
    assert.match(await panel.locator('[data-owed="inspector"]').innerText(), /The broker owes you 12 coins, due in 2 days\./);
    await fits('seeded'); await page.screenshot({path: `${evidence}/owed-seeded-1920.png`});
    await panel.locator('[data-owed-filter="owe"]').click();
    assert.equal(await panel.locator('[data-owed-row]').count(), 3);
    await page.screenshot({path: `${evidence}/owed-filter-owe-1920.png`}); say(`[${w}] seeded: ${ids.join(', ')}; filter "You owe" leaves 3`);

    // The Work tab is untouched and still first.
    await panel.locator('[data-ledger-tab="work"]').click();
    assert.match(await panel.locator('[data-ledger-pane="work"]').innerText(), /Complete work, claim points/);
    const text = await panel.innerText();
    fs.writeFileSync(`${evidence}/owed-text-form.txt`, `bundle ${bundle}\n` + text + '\n');
    say(`404s (static server, not this slice): ${[...new Set(missing)].join(', ') || 'none'}`);
    assert.deepEqual(errors, []); say('PASS');
}).catch(e => { console.error(e); process.exitCode = 1; });
