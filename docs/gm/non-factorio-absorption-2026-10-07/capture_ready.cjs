// Fresh browser contexts and generated test saves only. No user profile access.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const {chromium} = require('/tmp/yairpg-nonfactorio-proof-tools/node_modules/playwright');
const url = process.argv[2];
const out = '/tmp/yairpg-nonfactorio-proof';
fs.mkdirSync(out, {recursive: true});
(async () => {
    const browser = await chromium.launch({headless: true,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
    const errors = [];
    const warnings = [];
    const open = async fixture => {
        const context = await browser.newContext({viewport: {width: 1500, height: 1000}});
        if (fixture) await context.addInitScript(data => {if (!localStorage.getItem('save data')) localStorage.setItem('save data', JSON.stringify(data));}, fixture);
        const page = await context.newPage();
        page.setDefaultTimeout(12000);
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => {if (['error', 'warning'].includes(message.type())) warnings.push(message.text());});
        await page.goto(url);
        try {await page.getByText('PLAY', {exact: true}).click();}
        catch (error) {
            fs.writeFileSync(out + '/startup-failure.json', JSON.stringify({errors,
                fixture: !!fixture, text: await page.locator('body').innerText()}, null, 2));
            await browser.close();
            throw error;
        }
        if (await page.getByText('Confirm', {exact: true}).isVisible()) await page.getByText('Confirm', {exact: true}).click();
        return {context, page};
    };
    const save = async page => {
        await page.evaluate(() => window.saveProgress());
        return page.evaluate(() => JSON.parse(localStorage.getItem('save data')));
    };
    let {context, page} = await open();
    await page.getByText('Talk to someone', {exact: false}).click();
    await page.locator('[data-dialogue="villageElder"]').click();
    await page.locator('[data-textline="hello"]').click();
    await page.locator('.end_dialogue_button').click();
    const base = await save(page);
    assert.equal(base.expansion.simulation, null);
    await page.screenshot({path: out + '/base-opening.png', fullPage: true});
    const ready = structuredClone(base);
    ready.character.money = 100;
    for (const [id, count] of [['Rough wood log',20], ['Tree sap',6], ['Cooking herbs',3]]) {
        ready.inventories.person.main_character[JSON.stringify({id})] = {count};
    }
    ready.availabilities.person.oldCraftsman |= 1;
    ready.availabilities.dialogue.oldCraftsman |= 1;
    ready.availabilities.textline['oldCraftsman:hello'] |= 4;
    ready.availabilities.textline['villageElder:hello'] |= 4;
    ready.availabilities.location.Shack |= 1;
    fs.writeFileSync(out + '/pre-eda-save.json', JSON.stringify(ready, null, 2));
    await context.close();
    ({context, page} = await open(ready));
    fs.writeFileSync(out + '/ready-loaded.json', JSON.stringify({errors, warnings,
        text: await page.locator('body').innerText()}, null, 2));
    // Existing Here projection opts into Eda through the actual live command.
    await page.locator('#journal_show_notebook').click();
    await page.locator('[data-notebook-view="here"]').click();
    const panel = page.locator('#feature_expansion_panel');
    if (!await panel.evaluate(n => n.open)) await panel.locator(':scope > summary').click();
    await panel.locator('summary').filter({hasText: /^Fitting tools & materials$/}).click();
    try {await page.getByRole('button', {name: /Meet Eda, the sluice fitter/}).click();}
    catch (error) {
        fs.writeFileSync(out + '/eda-failure.json', JSON.stringify({errors,
            text: await page.locator('body').innerText(), save: await save(page)}, null, 2));
        await browser.close();
        throw error;
    }
    const enrolled = await save(page);
    assert.equal(enrolled.expansion.actors.player.facts['feature_objects.introduced'], true);
    assert.equal(enrolled.expansion.simulation.owners['feature_objects.miri']['{"id":"Sound repair stave"}'], 2);
    assert.deepEqual(errors, []);
    fs.writeFileSync(out + '/ready-save.json', JSON.stringify(enrolled, null, 2));
    fs.writeFileSync(out + '/baseline-proof.json', JSON.stringify({url, errors,
        findings: ['Fresh human opening and elder conversation reached.',
            'Generated story availability/funds/material fixture then actual UI Eda enrollment produced her finite two-stave stock.'],
        limits: ['Generated fixture bypasses natural rat-field progression; that journey is not proved.']}, null, 2));
    await page.screenshot({path: out + '/eda-ready.png', fullPage: true});
    await browser.close();
    console.log('Fresh opening and Eda fixture captured.');
})().catch(error => {console.error(error); process.exit(1);});
