// bk-forms (2026-10-30): live-route proof of the People web with the interaction layer and form switch, from a fresh
// life (earned elder greeting) at 1920x1080. Usage: YAIRPG_PROOF_URL=http://127.0.0.1:PORT/ YAIRPG_PROOF_DIR=dir node scripts/form_fit_live.cjs
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const {launchChrome} = require('./ui_helpers.cjs');
const url = process.env.YAIRPG_PROOF_URL, output = process.env.YAIRPG_PROOF_DIR || 'docs/audits/evidence/form-fit-2026-10-30/live-people'; fs.mkdirSync(output, {recursive: true});
(async () => {
    const browser = await launchChrome(); try {
        const errors = [], page = await (await browser.newContext({viewport: {width: 1920, height: 1080}})).newPage(); page.setDefaultTimeout(60000);
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(url); await page.getByText('PLAY', {exact: true}).click();
        if (await page.getByText('Confirm', {exact: true}).isVisible()) await page.getByText('Confirm', {exact: true}).click();
        const bundle = await page.evaluate(() => performance.getEntriesByType('resource').find(e => e.name.includes('/dist/bundle.js?version='))?.name);
        await page.getByRole('button', {name: 'Talk to someone'}).click(); await page.locator('[data-dialogue="villageElder"]').click();
        await page.locator('[data-textline="hello"]').evaluate(n => n.click());
        await page.evaluate(() => end_dialogue());
        await page.locator('[data-route-id="known-people"]').first().click(); await page.locator('#known_people_panel').waitFor({state: 'visible'});
        const web = page.locator('#known_people_panel > #relationship_web');
        if (!await web.evaluate(n => n.open)) await web.locator(':scope > summary').click();
        const shot = name => page.screenshot({path: path.join(output, name)});
        const steps = {};
        steps.switchButtons = await web.locator('.fig-form-choice').allTextContents();
        steps.figureDefault = await web.locator('.fig-form-choice[aria-pressed="true"]').textContent();
        assert.deepEqual(steps.switchButtons.slice(0, 3), ['Figure', 'Table', 'Matrix']); assert.equal(steps.figureDefault, 'Figure');
        const marker = web.locator('.fig-marker').first(); await marker.locator('.fig-body').hover();
        steps.cardAfterHover = (await web.locator('.fig-card').first().textContent()).slice(0, 120);
        assert.ok(await web.locator('.fig-card').count() >= 1, 'hover opens a card');
        await shot('live-1-hover-card.png');
        await marker.locator('.fig-body').click(); steps.pinned = await marker.getAttribute('aria-pressed'); assert.equal(steps.pinned, 'true');
        await page.mouse.move(5, 5); await shot('live-2-pinned.png');
        await web.locator('.fig-form-choice[data-form="table"]').click();
        assert.ok(await web.locator('table.fig-table').count() === 1); await web.locator('tbody tr').first().click();
        steps.inspector = (await web.locator('.fig-inspector').textContent()).slice(0, 120); await shot('live-3-table-inspector.png');
        await web.locator('.fig-form-choice[data-form="web"]').click();
        assert.equal(await web.locator('svg.fig-svg').count(), 1, 'the old figure is reachable again');
        await web.locator('details > summary', {hasText: 'Read as text'}).click();
        assert.match(await web.locator('pre').first().textContent(), /Who knows what about you/);
        assert.deepEqual(errors, []);
        fs.writeFileSync(path.join(output, 'live.json'), JSON.stringify({viewport: '1920x1080', route: 'fresh life, elder greeting, People route', bundle, steps, pageErrors: errors}, null, 1));
        console.log('live people proof ok', bundle, JSON.stringify(steps).slice(0, 300));
    } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
