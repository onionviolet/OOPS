// Desktop AD43 proof for N2's Harry library-work slice. Arguments: isolated build root, fixture JSON, evidence directory.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {launchChrome, advanceGameMinutes} = require('../scripts/ui_helpers.cjs');
const {serveCheckout, openFixture, openPanel} = require('../scripts/fixture_browser.cjs');
const [buildRoot, fixture, evidence] = process.argv.slice(2);
if (!buildRoot || !fixture || !evidence) throw Error('Supply isolated build root, Astronomy fixture and evidence directory.');
const P = 'book.hp.lead.library_work', POWER = 'book.hp.lead.levitation';
const item = id => JSON.stringify({id});
const fixtureOrigin = route => route.fulfill({status: 200, contentType: 'text/plain', body: 'Fixture origin'});
const markers = page => page.evaluate(() => {
    const s = simulationTestHooks.snapshot(), p = 'book.hp.lead.library_work', bag = s.inventories.person.main_character;
    const count = id => bag[JSON.stringify({id})]?.count || 0;
    return {notes: count(p + '.astronomy_notes'), marked: count('book.hp.lead.day.marked.astronomy'), set: count('book.hp.lead.day.set.astronomy'),
        down: s.expansion.worlds['book.hp.lead.world'].facts[p + '.book_down'] === true,
        mastery: s.expansion.simulation.powers.player['book.hp.lead.levitation'].mastery,
        pin: s.content_packs.structured.extensions.find(e => e.id === p)};
});
(async () => {
    fs.mkdirSync(evidence, {recursive: true});
    const server = await serveCheckout(path.resolve(buildRoot)), browser = await launchChrome();
    const errors = [];
    try {
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}, acceptDownloads: true}), page = await context.newPage();
        await context.route('**/robots.txt', fixtureOrigin);
        page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => d.accept());
        const loadedBundle = page.waitForResponse(r => new URL(r.url()).pathname === '/dist/bundle.js');
        await openFixture(page, {base: server.base, name: 'hp-library-astronomy', text: fs.readFileSync(fixture, 'utf8')}); await openPanel(page, 'hp');
        const servedBundleSha256 = createHash('sha256').update(await (await loadedBundle).body()).digest('hex');
        assert.equal(servedBundleSha256, createHash('sha256').update(fs.readFileSync(path.join(buildRoot, 'dist/bundle.js'))).digest('hex'));
        const school = page.locator('[data-hp-school-day]');
        await school.getByRole('button', {name: 'Open your school timetable', exact: true}).click();
        await advanceGameMinutes(page, 1);
        const action = suffix => page.locator(`[data-hp-day-action="${P}.${suffix}"] button`).first();
        await school.locator('[data-hp-day-action="book.hp.lead.day.attend_astronomy"] button').click();
        await advanceGameMinutes(page, 60);
        assert.equal((await markers(page)).set, 1, 'Astronomy really sets the assignment');
        await school.locator('[data-hp-library-open]').click();
        await school.locator('[data-hp-school-group="library"]').scrollIntoViewIfNeeded();
        await page.screenshot({path: path.join(evidence, 'methods.jpg'), quality: 85});
        assert.match(await school.locator('[data-hp-school-group="library"]').innerText(), /1 stamina.*about \d+%/);
        const manualStart = await page.evaluate(() => simulationTestHooks.clock());
        await action('move_ladder').click(); await advanceGameMinutes(page, 10);
        assert.equal((await markers(page)).down, true);
        await action('copy_chart').click(); await advanceGameMinutes(page, 5);
        let state = await markers(page); assert.equal(state.notes, 1); assert.equal(state.down, false);
        assert.equal((await page.evaluate(() => simulationTestHooks.clock())) - manualStart, 15);
        const homework = school.locator('[data-hp-school-group="homework"]');
        assert.match(await homework.innerText(), /Write your Astronomy homework.*1 h/s);
        assert.match(await homework.innerText(), /Use reference notes.*30 min/s);
        await homework.scrollIntoViewIfNeeded(); await page.screenshot({path: path.join(evidence, 'homework-choice.jpg'), quality: 85});
        const homeworkStart = await page.evaluate(() => simulationTestHooks.clock());
        await action('write_astronomy').click(); await advanceGameMinutes(page, 30);
        assert.equal((await page.evaluate(() => simulationTestHooks.clock())) - homeworkStart, 30);
        state = await markers(page); assert.deepEqual([state.notes, state.marked, state.set], [1, 1, 0]);
        const beforeMastery = state.mastery;
        let tries = 0;
        while (!(await markers(page)).down) {
            assert.ok(++tries <= 8, 'ordinary practice reaches a book retrieval');
            await action('levitate_book').click();
        }
        state = await markers(page); assert.equal(state.mastery, beforeMastery + tries);
        await page.locator('#save_button').click(); await page.reload();
        await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 120000});
        await page.evaluate(() => simulationTestHooks.pause()); await page.locator('#loading_screen_play_button').click(); await openPanel(page, 'hp');
        assert.equal((await markers(page)).down, true, 'the lowered library book remains on the desk after reload');
        await action('copy_chart').click(); await advanceGameMinutes(page, 5);
        const expected = await markers(page); assert.deepEqual([expected.notes, expected.marked, expected.set, expected.down], [2, 1, 0, false]);
        await page.locator('#save_button').click();
        const downloading = page.waitForEvent('download'); await page.locator('#save_to_file_button').click();
        const exported = path.join(evidence, 'roundtrip-save.txt'); await (await downloading).saveAs(exported);
        const fresh = await browser.newContext({viewport: {width: 1920, height: 1080}}), imported = await fresh.newPage();
        await fresh.route('**/robots.txt', fixtureOrigin);
        imported.on('pageerror', e => errors.push(e.message)); imported.on('dialog', d => d.accept());
        await openFixture(imported, {base: server.base, name: 'hp-library-astronomy', text: fs.readFileSync(fixture, 'utf8')});
        await imported.locator('#saved_file_input').setInputFiles(exported);
        await imported.waitForFunction(() => {try {const s = simulationTestHooks.snapshot(); return s.inventories.person.main_character[JSON.stringify({id: 'book.hp.lead.library_work.astronomy_notes'})]?.count === 2;} catch {return false;}}, null, {timeout: 120000});
        if (await imported.locator('#loading_screen_play_button').isVisible()) await imported.locator('#loading_screen_play_button').click();
        await imported.evaluate(() => simulationTestHooks.pause()); await openPanel(imported, 'hp');
        assert.deepEqual(await markers(imported), expected);
        await imported.locator('[data-hp-school-group="library"]').scrollIntoViewIfNeeded();
        await imported.screenshot({path: path.join(evidence, 'imported.jpg'), quality: 85});
        assert.deepEqual(errors, []); fs.unlinkSync(exported);
        const result = {route: 'hp-library-astronomy composed after real Charms/wand commands; real Astronomy class and homework; both retrieval methods; Save/reload/Export/file Import',
            servedBundleSha256, manualMinutes: 15, homeworkMinutes: 30, magicTries: tries, notes: expected.notes, marked: expected.marked, errors};
        fs.writeFileSync(path.join(evidence, 'result.json'), JSON.stringify(result, null, 2)); console.log(JSON.stringify(result));
    } catch (error) {console.error('Library proof failure', error); throw error;}
    finally {await browser.close(); await server.close();}
})().catch(error => {console.error(error); process.exitCode = 1;});
