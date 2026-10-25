// Field layer (G7): spill, light, burn, collapse harm, hatch, away catch-up, vial from the mixing counter,
// save/reload/Export/Import in a rebuilt candidate. Headless.
// node scripts/playtest/fields-continuity.mjs /absolute/built/root /absolute/evidence/dir
import assert from 'node:assert/strict';
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {canonicalSave, diffSaves} from '../headless/runner.mjs';
import {defaultCustomizationState} from '../../src/customization_profiles.js';

const root = resolve(process.argv[2] || '.'), evidence = resolve(process.argv[3] || '/tmp/yair-fields-evidence');
await mkdir(evidence, {recursive: true});
const server = await serve(root), session = new Session({url: server.url + '?test_hooks=1', seed: 11, wall: Date.UTC(2026, 9, 23), opTimeout: 15000});
const key = id => JSON.stringify({id});
const receipt = {viewports: [], checks: []};
let page;
const playReload = async () => {
    await page.waitForFunction(() => typeof simulationTestHooks === 'object');
    await page.evaluate(() => simulationTestHooks.pause());
    await page.locator('#loading_screen_play_button').click();
    await page.waitForTimeout(450);
};
async function roundTrip(label) {
    const saved = await session.save();
    await page.reload(); await playReload();
    assert.deepEqual(diffSaves(canonicalSave(await session.save()), canonicalSave(saved)), []);
    const literal = await page.evaluate(() => save_to_file());
    const exported = await session.save();
    await Promise.all([page.waitForEvent('load'), page.evaluate(encoded => load_progress(encoded), literal)]);
    await playReload();
    assert.deepEqual(diffSaves(canonicalSave(await session.save()), canonicalSave(exported)), []);
    receipt.checks.push(label + ': Save/reload/Export/literal Import exact');
}
// The shell parks unpinned panels; a player opens this one from the "More panels" menu.
async function openPanel() {
    await page.locator('select', {has: page.locator('option[value=fields]')}).selectOption('fields');
    await page.locator('#fields_panel').waitFor({state: 'visible'});
    await page.locator('#fields_panel').scrollIntoViewIfNeeded();
}
const only = s => Object.values(s.fields.places)[0];
async function fixtureSeed() {
    const seed = JSON.parse(await readFile('tests/fixtures/perf/mid.json', 'utf8'));
    seed.customization = defaultCustomizationState();
    delete seed.availabilities.recipe.undefined; delete seed.availabilities.recipe['recipe/undefined'];
    const bag = seed.inventories.person.main_character;
    for (const [id, n] of [['River bellleaf', 3], ['Spring water', 3], ['Emberseed', 3], ['Oil lamp', 1]]) bag[key(id)] = {count: n};
    seed.lamplight = {schema: 1, lit: true, oil: 200, noticed: {}};
    return seed;
}
const health = async () => Number((await page.evaluate(() => document.body.innerText)).match(/(\d+)\s*\/\s*\d+\s*hp/)?.[1]);
try {
    await session.start(); await session.open(); page = session.page;
    // Case A, desktop 1920x1080: raw packs from the panel, light, burn, catch-up, reload and import.
    const seedA = structuredClone(await session.save()), bag = seedA.inventories.person.main_character;
    bag[key('Emberseed')] = {count: 3}; bag[key('Spring water')] = {count: 1}; bag[key('Oil lamp')] = {count: 1};
    seedA.lamplight = {schema: 1, lit: true, oil: 200, noticed: {}};
    await session.open(seedA); page = session.page;
    await page.setViewportSize({width: 1920, height: 1080}); receipt.viewports.push('1920x1080');
    await openPanel();
    const panel = page.locator('#fields_panel');
    await panel.locator('[data-field-pour]').click(); await panel.locator('[data-field-pour]').click();
    let s = await session.save();
    assert.equal(s.inventories.person.main_character[key('Emberseed')].count, 1); assert.equal(only(s).poured, 2000);
    await panel.locator('[data-field-light]').click();
    await session.step(3);
    await page.screenshot({path: join(evidence, 'burning-1920x1080.png')});
    s = await session.save();
    assert.ok(only(s).levels[0].fire && only(s).levels.reduce((n, l) => n + l.gas.smoke, 0) > 0, 'burning with smoke');
    receipt.checks.push('A panel: spill two packs, light with lit lamp, 3 minutes: fire and smoke in the saved slice');
    await roundTrip('A mid-burn');
    await session.step(120);
    s = await session.save();
    assert.ok(only(s).levels.every(l => !l.fire && l.gas.smoke === 0 && l.gas.fume === 0), 'settled after catch-up');
    receipt.checks.push('A catch-up: fire out and gas cleared after 120 more minutes');
    await roundTrip('A settled');

    // Case B, laptop 1440x900: a real vial from the mixing counter, hatch, collapse harm.
    await session.open(await fixtureSeed()); page = session.page;
    await page.setViewportSize({width: 1440, height: 900}); receipt.viewports.push('1440x900'); await page.waitForTimeout(300);
    await page.locator('#village_mixing_open').click();
    await page.locator('[data-mixture-destination]').first().waitFor({state: 'visible'});
    await page.waitForTimeout(600);
    await page.locator('[data-mixture-destination="steep"] button').click(); await page.waitForTimeout(400);
    s = await session.save();
    const vialKey = Object.keys(s.inventories.person.main_character).find(k => k.includes('Village mixture'));
    assert.ok(vialKey, 'a Village mixture vial was made at the counter');
    await page.reload(); await playReload();
    await openPanel();
    const panelB = page.locator('#fields_panel');
    const materialSel = panelB.locator('[data-field-material]');
    const vialValue = await page.evaluate(() => [...document.querySelectorAll('[data-field-material] option')].find(o => /vial/.test(o.textContent)).value);
    await panelB.locator('[data-field-level-select]').selectOption('1');
    await materialSel.selectOption(key('Emberseed'));
    for (let i = 0; i < 2; i++) await panelB.locator('[data-field-pour]').click();   // two Emberseed packs onto the shelf
    await materialSel.selectOption(vialValue);
    await panelB.locator('[data-field-pour]').click();
    s = await session.save();
    assert.ok(only(s).levels[1].solid.vigor > 0 && only(s).levels[1].solid.restore > 0, 'vial and packs share the shelf');
    receipt.checks.push('B laptop: a real vial from the mixing counter spills through the panel with its own fractions');
    await panelB.locator('[data-field-level-select]').selectOption('0');
    await panelB.locator('[data-field-seal]').click();
    s = await session.save(); assert.deepEqual(Object.keys(only(s).edges[0]), ['hatch']);
    await panelB.locator('[data-field-level-select]').selectOption('1');
    await panelB.locator('[data-field-light]').click();
    await page.screenshot({path: join(evidence, 'hatch-1440x900.png')});
    const hp0 = await health();
    let low = hp0;
    for (let i = 0; i < 14; i++) { await session.step(1); low = Math.min(low, await health()); }   // natural recovery refills some, so track the low point
    s = await session.save();
    assert.equal(only(s).collapses, 1, 'the burning shelf gave way'); assert.equal(only(s).levels[1].fallen, true);
    const hp1 = low;
    assert.ok(Number.isFinite(hp0) && hp1 < hp0 && hp1 >= 1, `harm applied and bounded: ${hp0} -> low ${hp1}`);
    assert.ok((await page.evaluate(() => document.body.innerText)).includes('Burning boards crash down on you.'));
    await page.screenshot({path: join(evidence, 'collapse-1440x900.png')});
    receipt.checks.push(`B collapse: shelf fell after burning; health ${hp0} -> low ${hp1} (never below 1; recovery refills); barred hatch persisted`);
    await roundTrip('B collapsed');
    await session.step(300);
    s = await session.save();
    assert.ok(only(s).levels.every(l => !l.fire && l.gas.smoke === 0 && l.gas.fume === 0), 'settled'); assert.equal(only(s).levels[1].fallen, true);
    await page.screenshot({path: join(evidence, 'settled-1440x900.png')});
    await roundTrip('B settled');
    assert.deepEqual(session.errors.filter(e => !(e.kind === 'console' && /404 \(Not Found\)/.test(e.text))), []);
    receipt.status = 'passed';
} catch (error) {
    receipt.status = 'failed'; receipt.failure = error.stack; receipt.errors = session.errors; throw error;
} finally {
    await writeFile(join(evidence, 'browser-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    await session.close(); await server.close();
}
process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
