// RPX11 rebuilt browser proof at 1920x1080: the relationship web in People route (known-people), from a fresh
// life (earned elder greeting) and a generated save for the craftsman route (named fixture, as in
// people_browser.cjs). Checks the web stays outside the person cards and shows no hidden axis.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const {launchChrome} = require('./ui_helpers.cjs');
const url = process.env.YAIRPG_PROOF_URL || 'http://127.0.0.1:18549/';
const output = process.env.YAIRPG_PROOF_DIR || 'docs/representations/evidence/relationship-web'; fs.mkdirSync(output, {recursive: true});
(async () => {
    const browser = await launchChrome(); try {
    const errors = [], findings = [];
    const open = async fixture => {
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}});
        if(fixture) await context.addInitScript(data => {if(!localStorage.getItem('save data')) localStorage.setItem('save data', JSON.stringify(data));}, fixture);
        const page = await context.newPage(); page.setDefaultTimeout(60000); // master has 1-2 s long tasks after workshop enrolment (pre-existing) page.on('pageerror', e => errors.push(e.stack));
        await page.goto(url); await page.getByText('PLAY', {exact: true}).click();
        if(await page.getByText('Confirm', {exact: true}).isVisible()) await page.getByText('Confirm', {exact: true}).click();
        return {page, context};
    };
    const save = async page => {await page.evaluate(() => window.saveProgress()); return page.evaluate(() => JSON.parse(localStorage.getItem('save data')));};
    // People you know is its own top-bar route now (the Notebook people tab is hidden on master).
    const people = async page => {await page.locator('[data-route-id="known-people"]').first().click(); await page.locator('#known_people_panel').waitFor({state: 'visible'});};
    const webText = page => page.locator('#relationship_web pre.fig-text').textContent();
    const shot = async (page, name) => {await page.locator('#relationship_web').scrollIntoViewIfNeeded(); await page.screenshot({path: path.join(output, name)});};

    let {page, context} = await open();
    const fingerprint = await page.evaluate(() => performance.getEntriesByType('resource').find(e => e.name.includes('/dist/bundle.js?version='))?.name);
    await page.getByRole('button', {name: 'Talk to someone'}).click(); await page.locator('[data-dialogue="villageElder"]').click();
    await page.locator('[data-textline="hello"]').click();
    await people(page);
    const web = page.locator('#known_people_panel > #relationship_web');
    assert.equal(await web.isVisible(), true, 'the web sits directly in the People panel');
    assert.equal(await page.locator('[data-known-person] #relationship_web, #relationship_web [data-known-person]').count(), 0);
    assert.equal(await web.locator('svg.fig-svg').count(), 1);
    assert.equal(await web.evaluate(n => n.open), false, 'web starts closed; cards carry the glance');
    assert.match(await page.locator('[data-known-person="villageElder"] summary').textContent(), /Village elder · Met/);
    await web.locator(':scope > summary').click(); await web.locator('details > summary', {hasText: 'Read as text'}).click();
    const fresh = await webText(page);
    assert.match(fresh, /Who knows what about you/); assert.match(fresh, /Village elder/);
    assert.doesNotMatch(fresh, /trust \d|archive|successor/i);
    await shot(page, 'game-fresh-life-elder.png');
    const base = await save(page);
    findings.push(`Fresh life, earned route: greeting the elder shows the web in People route (known-people) with the elder and the text form: ${JSON.stringify(fresh.split('\n').slice(0, 6))}`);
    await context.close();

    // Named fixture route: generated save opens the craftsman greeting (as people_browser.cjs does).
    const ready = structuredClone(base), wood = JSON.stringify({id: 'Rough wood log'});
    ready.character.money = 30; ready.inventories.person.main_character[wood] = {count: 10};
    ready.availabilities.textline['oldCraftsman:hello'] |= 4;
    ({page, context} = await open(ready));
    // The workshop sits in Notebook -> People tab on master; the web is on the People route.
    await page.locator('[data-route-id="records:notebook"]').first().click(); await page.locator('[data-notebook-view="people"]').click();
    if(!await page.locator('#simulation_panel').evaluate(n => n.open)) await page.locator('#simulation_panel > summary').click(); await page.locator('[data-simulation="enroll"]').click();
    await page.locator('[data-simulation="village.working_habits"]').click();
    await page.locator('[data-simulation="village.commission"]').click();
    await people(page);
    if(!await page.locator('#relationship_web').evaluate(n => n.open)) await page.locator('#relationship_web > summary').click();
    if(!await page.locator('#relationship_web details').evaluate(n => n.open)) await page.locator('#relationship_web details > summary').click();
    const commissioned = await webText(page);
    assert.match(commissioned, /Old craftsman to You: owes, owes you: a commissioned kit \(pending\)/);
    assert.match(commissioned, /Old craftsman to You: saw, saw \d deeds?\. Saw: /);
    const snapshot = await save(page), hidden = snapshot.expansion.simulation.relationships.oldCraftsman?.player?.axes?.trust;
    assert.doesNotMatch(commissioned, /Craftsman's trust|trust: \d/);
    const craftCard = page.locator('[data-known-person="oldCraftsman"]');
    assert.match(await craftCard.locator('summary').textContent(), /Old craftsman · Familiar · here · owes you/);
    if(!await craftCard.evaluate(n => n.open)) await craftCard.locator('summary').click();
    assert.match(await craftCard.locator('.meter-bar').textContent(), /Bond: Familiar/);
    assert.doesNotMatch(await craftCard.textContent(), /Who knows what|Craftsman's trust/);
    await page.locator('#relationship_web > summary').click(); // close the web: the cards are the glance
    await craftCard.scrollIntoViewIfNeeded(); await page.screenshot({path: path.join(output, 'game-craftsman-card-bond.png')});
    await page.locator('#relationship_web > summary').click();
    await shot(page, 'game-craftsman-commission.png');
    findings.push(`Fixture route (generated save, craftsman greeting): enrolling, asking his habits and paying the commission adds "owes you: a commissioned kit" and "saw" edges; his hidden trust axis (${hidden}) does not appear.`);
    const result = {url, viewport: '1920x1080', fingerprint, findings, errors, generatedSavesOnly: true, text: {fresh, commissioned}};
    fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
    assert.deepEqual(errors, []); } finally {await browser.close().catch(() => {});}
})().catch(e => {console.error(e); process.exit(1);});
