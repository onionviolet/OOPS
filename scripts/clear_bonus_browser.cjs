// PS160 clear bonuses at 1920x1080 from a fresh origin, headless. Run after a build:
//   python3 -m http.server 19761 --bind 127.0.0.1 &  YAIRPG_PORT=19761 node scripts/clear_bonus_browser.cjs
// Setup (fixture, not proof): a fresh life with the Infested field opened and the hero's combat skills raised so the run is
// short. Played: the field's clear line names its public bonus and keeps the rarer one as "?", real clears roll the bonus,
// Reports marks a hit as a chance bonus with its odds, the bread arrives; then save, reload, Export and Import keep it.
const fs = require('node:fs'), assert = require('node:assert/strict');
const {runBrowser} = require('./ui_helpers.cjs');
const {startFresh} = require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url = `http://127.0.0.1:${process.env.YAIRPG_PORT || 19761}/?test_hooks=1`, evidence = process.env.YAIRPG_PROOF_DIR || 'docs/representations/evidence/economy';
const say = m => console.log(m); fs.mkdirSync(evidence, {recursive: true});
const BREAD = JSON.stringify({id: 'Fresh bread'});
runBrowser(async browser => {
    const errors = [], context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    await context.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}));
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if(m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    const boot = async () => { await page.waitForFunction(() => window.simulationTestHooks); await page.evaluate(() => simulationTestHooks.pause()); await startFresh(page);
        await page.waitForFunction(() => { const s = simulationTestHooks.saveStatus(); return s.ownsSave && !s.restoring && !s.writeBlocked; }, null, {timeout: 15000}); };
    const snap = () => page.evaluate(() => simulationTestHooks.snapshot());
    const reseed = async edit => { const s = await snap(); edit(s); await page.evaluate(x => localStorage.setItem('save data', JSON.stringify(x)), s); await page.reload(); await boot(); };
    const clearLine = () => page.evaluate(() => document.getElementById('clear_count_div')?.innerText.replace(/\s+/g, ' ') ?? '');
    const bodyText = () => page.evaluate(() => document.body.innerText);
    const bread = s => s.inventories.person.main_character[BREAD]?.count ?? 0;

    await page.goto(url); await boot(); say('fresh life');
    await reseed(s => {
        s.character.xp.total_xp = 1e6; s.levels.person.main_character.total_xp = 1e6;
        for(const id of ['Combat', 'Unarmed', 'Evasion', 'Iron skin', 'Fortitude']) s.levels.person.main_character.skill_xp[id] = 1e7;
        s.availabilities.location['Infested field'] |= 1;
    });
    const start = await snap();

    await page.evaluate(() => simulationTestHooks.resume?.());
    await page.evaluate(() => window.change_location({location_id: 'Infested field'}));
    await page.waitForFunction(() => simulationTestHooks.snapshot()['current location'] === 'Infested field', null, {timeout: 20000});
    const line0 = await clearLine(); say(`field line: ${line0}`);
    assert.match(line0, /sometimes: a farmer left bread at the field's edge \(about 1 in 3\) · rarer: \?/);

    // Fight until a clear rolls the bonus (about 1 in 3 per clear) or ten clears pass.
    let hit = null;
    for(let i = 0; i < 900 && !hit; i++) {
        const x = await page.evaluate(() => { const s = simulationTestHooks.snapshot(); return {at: s['current location'], killed: s.locations['Infested field']?.enemy_groups_killed ?? 0, deaths: s.total_deaths}; });
        if(i % 30 === 0) say(JSON.stringify(x));
        if(x.at !== 'Infested field') await page.evaluate(() => window.change_location({location_id: 'Infested field'}));
        const text = await bodyText(); const m = /Clear bonus \(about 1 in 3\): a farmer left bread at the field's edge\./.exec(text);
        if(m) hit = {text: m[0], killed: x.killed};
        else if(x.killed >= 150) break;
        else await page.waitForTimeout(1000);
    }
    await page.evaluate(() => window.change_location({location_id: 'Village'}));
    await page.waitForFunction(() => simulationTestHooks.snapshot()['current location'] === 'Village', null, {timeout: 20000});
    await page.evaluate(() => simulationTestHooks.pause());
    assert.ok(hit, 'a clear rolled the bonus within ten clears'); say(`hit after ${hit.killed} groups: ${hit.text}`);
    const after = await snap();
    assert.ok(bread(after) >= bread(start) + 2, 'the bread is in the pack');
    await page.screenshot({path: `${evidence}/clear-bonus-1920.png`});

    // Persistence: save, reload, Export, Import keep the clears and the bread.
    await page.evaluate(() => window.saveProgress()); await page.reload(); await boot();
    const kept = await snap(); assert.equal(bread(kept), bread(after)); assert.equal(kept.locations['Infested field'].enemy_groups_killed, after.locations['Infested field'].enemy_groups_killed);
    const encoded = await page.evaluate(() => window.save_to_file());
    await Promise.all([page.waitForNavigation(), page.locator('#saved_file_input').setInputFiles({name: 'ps160.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)})]);
    await page.waitForFunction(() => window.simulationTestHooks); await page.getByText('PLAY', {exact: true}).click();
    await page.waitForFunction(() => simulationTestHooks.snapshot()?.locations, null, {timeout: 15000});
    const imported = await snap(); assert.equal(bread(imported), bread(after));
    say(`kept through reload and import: ${bread(imported)} bread, ${imported.locations['Infested field'].enemy_groups_killed} groups`);
    assert.deepEqual(errors, []);
    say('PS160 clear bonus: passed');
});
