// Round 16 Discord surfaces at 1920x1080 from a fresh origin, headless (PS164, PS166, PS167, PS168). Run after a build:
//   python3 -m http.server 19761 --bind 127.0.0.1 &  YAIRPG_PORT=19761 YAIRPG_HEAD=<hash> node scripts/discord_surfaces_browser.cjs
// Setup (fixture, not proof): a fresh life with crafting open, 5 Low quality iron ore, Coal seen once but none held, the Infested
// field opened and starred, and some Tough skin practice. Played: Fast travel's walking map and a pick on it; Silver
// ingot's short coal links to Charcoal and Back returns; leather pants on, the field's fight says Tough skin is not
// training and why; the Bestiary names Butchering as why wolves drop more (three wolf kills are setup).
const fs = require('node:fs'), assert = require('node:assert/strict');
const {runBrowser} = require('./ui_helpers.cjs');
const {startFresh} = require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url = `http://127.0.0.1:${process.env.YAIRPG_PORT || 19761}/?test_hooks=1`, evidence = process.env.YAIRPG_PROOF_DIR || 'docs/representations/evidence/discord-surfaces';
const head = process.env.YAIRPG_HEAD || 'local', say = m => console.log(m); fs.mkdirSync(evidence, {recursive: true});
const key = id => JSON.stringify({id});
runBrowser(async browser => {
    const errors = [], context = await browser.newContext({viewport: {width: 1920, height: 1080}});
    await context.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}));
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if(m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    const boot = async () => { await page.waitForFunction(() => window.simulationTestHooks); await page.evaluate(() => simulationTestHooks.pause()); await startFresh(page);
        await page.waitForFunction(() => { const s = simulationTestHooks.saveStatus(); return s.ownsSave && !s.restoring && !s.writeBlocked; }, null, {timeout: 15000}); };
    const snap = () => page.evaluate(() => simulationTestHooks.snapshot());
    const reseed = async edit => { const s = await snap(); edit(s); await page.evaluate(x => localStorage.setItem('save data', JSON.stringify(x)), s); await page.reload(); await boot(); };
    const shot = name => page.screenshot({path: `${evidence}/${name}-${head}-1920.png`});

    await page.goto(url); await boot(); say('fresh life');
    await reseed(s => {
        s.global_flags.is_crafting_unlocked = true;
        s.inventories.person.main_character[key('Low quality iron ore')] = {count: 5};
        for(const id of ['Coal', 'Low quality iron ore']) s.item_log[id] = {id, number: id === 'Coal' ? 1 : 5, quality_highest: 0, quality_lowest: 0};
        s.availabilities.location['Infested field'] |= 1;
        s.favourite_locations = {...(s.favourite_locations || {}), 'Infested field': true};
        s.character.xp.total_xp = 1e6; s.levels.person.main_character.total_xp = 1e6;
        for(const id of ['Combat', 'Evasion', 'Fortitude']) s.levels.person.main_character.skill_xp[id] = 1e7;
        s.levels.person.main_character.skill_xp['Iron skin'] = 50; s.levels.person.main_character.skill_xp.Butchering = 1e5; s.availabilities.skill.Butchering |= 1; s.enemy_killcount = {...(s.enemy_killcount || {}), 'Starving wolf': 3};
    });

    // PS166: the Bestiary knows observed drops, not base chances; under them it names the cause it can see. Wolf rats
    // have their own harvest (Butchering changes processing, not drops); the three wolf kills are setup.
    const note = await page.evaluate(() => document.querySelector('[data-drop-rate-cause]')?.textContent || '');
    say(`bestiary: ${note}`);
    if(process.env.DEBUG) say(JSON.stringify(await page.evaluate(() => ({kills: simulationTestHooks.snapshot().enemy_killcount, butch: simulationTestHooks.snapshot().levels.person.main_character.skill_xp.Butchering,
        entries: [...document.querySelectorAll('.bestiary_entry_div')].map(n => n.textContent.replace(/\s+/g, ' ').slice(0, 300))}))));
    assert.match(note, /^Butchering raises what these drop for you \(×[\d.]+\)\.$/);

    // PS164: Fast travel's opened view carries the walking map under its destinations.
    await page.locator('.location_choice_dropdown', {hasText: 'Fast travel'}).first().click();
    const map = page.locator('[data-fast-travel-map]');
    await map.waitFor({state: 'attached', timeout: 8000});
    await map.locator('summary').first().click();
    const mapText = (await map.evaluate(n => n.textContent)).replace(/\s+/g, ' '); say(`map: ${mapText.slice(0, 200)}`);
    assert.match(mapText, /Walking map · minutes from here/); assert.match(mapText, /Infested field/);
    await shot('ps164-walk-map');
    await map.locator('[data-id]', {hasText: 'Infested field'}).first().dispatchEvent('click');
    await page.waitForFunction(() => simulationTestHooks.snapshot()['current location'] === 'Infested field', null, {timeout: 20000});
    say('picked Infested field on the map: travelled');
    await page.evaluate(() => window.change_location({location_id: 'Village'}));
    await page.waitForFunction(() => simulationTestHooks.snapshot()['current location'] === 'Village', null, {timeout: 20000});

    // PS167: Low quality iron ingot is short of coal; the row links to Charcoal, and Back returns.
    await page.evaluate(() => window.openCraftingWindow());
    await page.locator('#crafting_mainpage_buttons [data-crafting_category="smelting"]').click();
    await page.locator('[data-crafting_category="smelting"] [data-recipe_id="Low quality iron ingot"] .recipe_item_name').click();
    if(process.env.DEBUG) say(`detail: ${(await page.evaluate(() => document.querySelector('#crafting_window [data-craft-sources]')?.parentElement?.innerText || document.querySelector('#crafting_window')?.innerText.slice(0, 1500))).replace(/\s+/g, ' ').slice(0, 900)}`);
    const make = page.locator('.craft_source_make').first();
    await make.waitFor({timeout: 8000});
    const makeText = await make.innerText(); say(`short coal: ${makeText}`);
    assert.equal(makeText, 'Make it: Charcoal');
    await shot('ps167-make-it');
    await make.click();
    const title = await page.locator('#crafting_window .craft_detail_title, #crafting_window h2, #crafting_window h3').first().innerText(); say(`followed to: ${title}`);
    assert.match(title, /Charcoal/);
    await page.evaluate(() => window.closeCraftingWindow?.());

    // PS168: leather pants on, the field's fight is a practice; Tough skin gets nothing and the line says why.
    const pants = Object.keys((await snap()).inventories.person.main_character).find(k => /Cheap leather pants/.test(k));
    await page.evaluate(k => window.equip_item(k), pants);
    await page.evaluate(() => simulationTestHooks.resume?.());
    await page.evaluate(() => window.change_location({location_id: 'Infested field'}));
    // Read the line and pause in the same poll that finds it: once a hit lands, Fortitude trains and the line rightly goes.
    const line = await (await page.waitForFunction(() => { const t = document.body.innerText.split('\n').find(t => /nothing has hurt you since you started/.test(t)); if(t) simulationTestHooks.pause(); return t; }, null, {timeout: 120000, polling: 500})).jsonValue();
    say(`practice: ${line}`);
    assert.match(line, /Infested field: no [^.]*Fortitude[^.]* XP since you started\. Fortitude: it learns from wounds, and nothing has hurt you since you started\./);
    await shot('ps168-practice-cause');

    await page.evaluate(() => simulationTestHooks.pause());
    assert.deepEqual(errors, []);
    say('discord surfaces: passed');
});
