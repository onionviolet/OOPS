// Rebuilt desktop proof. Usage: node tests/hp_reading_browser.cjs <build-root> <fixture.json> <evidence-dir>
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const {launchChrome, advanceGameMinutes} = require('../scripts/ui_helpers.cjs');
const {serveCheckout, openFixture, openPanel} = require('../scripts/fixture_browser.cjs');
const [buildRoot, fixture, evidence] = process.argv.slice(2);
if (!buildRoot || !fixture || !evidence) throw Error('Supply build root, hp-term-jinx fixture and evidence directory.');
(async () => {
    fs.mkdirSync(evidence, {recursive: true});
    fs.writeFileSync(path.join(buildRoot, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
    const server = await serveCheckout(path.resolve(buildRoot)), browser = await launchChrome();
    const errors = [];
    try {
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}, acceptDownloads: true});
        const page = await context.newPage();
        page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => d.accept());
        await openFixture(page, {base: server.base, name: 'hp-term-jinx', text: fs.readFileSync(fixture, 'utf8')});
        await openPanel(page, 'hp');
        const school = page.locator('[data-hp-school-day]');
        await school.locator('[data-hp-lesson="charms"]').click();
        await advanceGameMinutes(page, 30);
        const cast = school.locator('[data-hp-cast]');
        await cast.click(); await cast.click();
        const quote = () => school.locator('[data-hp-school-group="practice"]').innerText();
        assert.match(await quote(), /about 60% to lift/);
        await school.scrollIntoViewIfNeeded();
        await page.screenshot({path: path.join(evidence, 'before.jpg'), quality: 85});
        const start = await page.evaluate(() => simulationTestHooks.clock());
        for (let i = 0; i < 3; i++) await school.locator('[data-hp-study="study.hp.charms"]').click();
        assert.equal((await page.evaluate(() => simulationTestHooks.clock())) - start, 180);
        assert.match(await quote(), /about 70% to lift/);
        assert.match(await quote(), /Levitation reading understood/);
        assert.match(await school.locator('[data-hp-school-group="recap"]').innerText(), /steady wrist/);
        assert.equal(await page.locator('[data-hp-study="study.hp.charms"]').count(), 0, 'completed study is not offered twice');
        await page.screenshot({path: path.join(evidence, 'understood.jpg'), quality: 85});
        await cast.click();
        assert.match(await quote(), /about 80% to lift/);
        const expected = await page.evaluate(() => {
            const s = simulationTestHooks.snapshot();
            return {power: s.expansion.simulation.powers.player['book.hp.lead.levitation'], study: s.expansion.simulation.knowledge.player['study.hp.charms.writeup'], inquiry: s.inquiry};
        });
        console.log('proved reading and cast');
        await page.locator('#save_button').click();
        await page.reload();
        await page.locator('#loading_screen_play_button').waitFor({state: 'visible'});
        await page.evaluate(() => simulationTestHooks.pause()); await page.locator('#loading_screen_play_button').click();
        await openPanel(page, 'hp');
        assert.match(await quote(), /about 80% to lift/);
        console.log('proved reload');
        const download = page.waitForEvent('download'); await page.locator('#save_to_file_button').click();
        const exported = path.join(evidence, 'roundtrip-save.txt'); await (await download).saveAs(exported);
        const importedContext = await browser.newContext({viewport: {width: 1920, height: 1080}}), imported = await importedContext.newPage();
        imported.on('pageerror', e => errors.push(e.message)); imported.on('dialog', d => d.accept());
        await openFixture(imported, {base: server.base, name: 'hp-term-jinx', text: fs.readFileSync(fixture, 'utf8')});
        console.log('import origin ready');
        await imported.locator('#saved_file_input').setInputFiles(exported);
        await imported.waitForFunction(() => {
            try {return simulationTestHooks.snapshot().expansion.simulation.knowledge.player['study.hp.charms.writeup']?.stage === 'understood';} catch {return false;}
        }, null, {timeout: 120000});
        if (await imported.locator('#loading_screen_play_button').isVisible()) await imported.locator('#loading_screen_play_button').click();
        await imported.evaluate(() => simulationTestHooks.pause()); await openPanel(imported, 'hp');
        const actual = await imported.evaluate(() => {
            const s = simulationTestHooks.snapshot();
            return {power: s.expansion.simulation.powers.player['book.hp.lead.levitation'], study: s.expansion.simulation.knowledge.player['study.hp.charms.writeup'], inquiry: s.inquiry};
        });
        assert.deepEqual(actual, expected);
        assert.match(await imported.locator('[data-hp-school-group="practice"]').innerText(), /about 80% to lift/);
        assert.deepEqual(errors, []);
        await imported.screenshot({path: path.join(evidence, 'imported.jpg'), quality: 85});
        fs.unlinkSync(exported);
        const result = {route: 'hp-term-jinx composed; lesson, two casts, three library sessions, third cast, save/reload, Export/file Import', before: 60, reading: 70, nextCast: 80, minutes: 180, errors};
        fs.writeFileSync(path.join(evidence, 'result.json'), JSON.stringify(result, null, 2));
        console.log(JSON.stringify(result));
    } catch (error) {console.error('proof failure', error); throw error;} finally {
        for (const context of browser.contexts()) await context.close();
        await browser.close(); await server.close();
    }
})().catch(e => {console.error(e); process.exitCode = 1;});
