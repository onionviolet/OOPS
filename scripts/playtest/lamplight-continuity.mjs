// Run against an already rebuilt disposable candidate, never the shared bundle:
// node scripts/playtest/lamplight-continuity.mjs /tmp/oops-engine-candidate /absolute/private/evidence
import assert from 'node:assert/strict';
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {canonicalSave, diffSaves} from '../headless/runner.mjs';

const root = resolve(process.argv[2] || '.'), evidence = resolve(process.argv[3] || '/tmp/oops-lamplight-evidence');
await mkdir(evidence, {recursive: true});
const missingResources = [];
const server = await serve(root), session = new Session({url: server.url + '?test_hooks=1', seed: 11, wall: Date.UTC(2026, 9, 21), opTimeout: 15000,
    hooks: {beforeOpen: context => context.on('response', response => {if (response.status() === 404) missingResources.push(new URL(response.url()).pathname);})}});
const BOOK = 'ABC for kids', key = id => JSON.stringify({id});
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
const progress = s => s.books[BOOK]?.accumulated_time ?? 0;
const fuel = s => s.lamplight?.oil ?? 0;
const receipt = {viewport: {width:1920,height:1080}, setup: 'Seeded current-format nighttime, book and market access; native inventory light/read commands. Short remaining fuel and completion fixtures are explicitly seeded, not natural acquisition.', checks: []};
let page;
const snap = () => page.evaluate(() => simulationTestHooks.snapshot());
async function playReload() {
    await page.waitForFunction(() => typeof simulationTestHooks === 'object');
    await page.evaluate(() => simulationTestHooks.pause());
    await page.locator('#loading_screen_play_button').click();
    await page.waitForTimeout(350);
}
async function roundTrip(label) {
    const saved = await session.save();
    await page.reload(); await playReload();
    assert.deepEqual(diffSaves(canonicalSave(await session.save()), canonicalSave(saved)), []);
    const literal = await page.evaluate(() => save_to_file());
    assert.equal(typeof literal, 'string');
    const exported = await session.save();
    await writeFile(join(evidence, label + '-export.txt'), literal);
    await Promise.all([page.waitForEvent('load'), page.evaluate(encoded => load_progress(encoded), literal)]);
    await playReload();
    assert.deepEqual(diffSaves(canonicalSave(await session.save()), canonicalSave(exported)), []);
    receipt.checks.push(label + ': Save/reload/Export/literal Import exact');
}
async function inventoryAction(id, action) {
    await page.locator(`#inventory_content_div > [data-character_item='${key(id)}']`).click();
    await page.locator(`[data-shell-item-action="${action}"]`).click();
}
try {
    await session.start(); await session.open(); page = session.page;
    const fresh = await session.save(), seed = structuredClone(fresh);
    Object.assign(seed['current time'], {hour:22, minute:0});
    seed.availabilities.trader.villageTrader = 1;
    seed.character.money = 5000;
    seed.inventories.person.main_character[key(BOOK)] = {count:1};
    for (const id of ['Oil lamp', 'Lamp oil']) seed.inventories.person.main_character[key(id)] = {count:1};
    await session.open(seed); page = session.page;
    await inventoryAction('Oil lamp', 'use');
    let state = await snap();
    assert.equal(fuel(state), 240); assert.equal(state.lamplight.lit, true);
    assert.equal(state.inventories.person.main_character[key('Lamp oil')], undefined);
    await inventoryAction(BOOK, 'read');
    await session.step(2);
    state = await snap(); closeTo(progress(state), 2.4); closeTo(fuel(state), 238);
    await page.waitForFunction(() => document.getElementById('proto23_item_detail')?.textContent.includes('Time to read: 98 minutes'));
    await page.screenshot({path:join(evidence, 'pending-reading.png')});
    receipt.checks.push('Native inventory light/read: 1 flask spent, 2 minutes produce 2.4 work and burn 2 fuel');
    await roundTrip('pending');

    const short = structuredClone(seed);
    short.books[BOOK] = {accumulated_time:0};
    short.lamplight = {schema:1,lit:true,oil:2.5,noticed:{}};
    await session.open(short); page = session.page;
    await inventoryAction(BOOK, 'read');
    await session.step(6);
    const whole = await session.save(); closeTo(progress(whole),6.5); closeTo(fuel(whole),0);
    assert.equal((await page.evaluate(() => simulationTestHooks.project('lamplight'))).shining, false);
    await page.waitForFunction(() => document.getElementById('proto23_item_detail')?.textContent.includes('Time to read: 113.5 minutes'));
    await page.screenshot({path:join(evidence, 'expired-reading.png')});
    await roundTrip('expired');
    receipt.checks.push('Fractional expiry: 2.5 lit + 3.5 unlit minutes = 6.5 work; current lamp is out; visible remaining estimate updates to 113.5 minutes');

    await session.open(short); page = session.page; await inventoryAction(BOOK, 'read');
    for (let i=0;i<6;i++) await session.step(1);
    assert.deepEqual(diffSaves(canonicalSave(await session.save()), canonicalSave(whole)), []);
    await session.open(short); page = session.page; await inventoryAction(BOOK, 'read');
    await page.evaluate(() => fastForward(6, {sliceMs:5}));
    assert.deepEqual(diffSaves(canonicalSave(await session.save()), canonicalSave(whole)), []);
    receipt.checks.push('advanceTicks(6), six single native minutes and fastForward(6) exact save equivalence');

    const finish = structuredClone(short);
    finish.lamplight.oil = 1;
    finish.books[BOOK].accumulated_time = 118.8;
    finish.levels.person.main_character.skill_xp.Literacy = 118.8;
    await session.open(finish); page=session.page; await inventoryAction(BOOK,'read');
    await session.step(1); state = await session.save();
    assert.equal(progress(state),120); assert.equal(state.is_reading,null); closeTo(fuel(state),0);
    // Immediate load backfills the independently scheduled Reader title. The selected
    // completion/fuel/XP state must already be exact; then the whole envelope is stable.
    const completed = state;
    await page.reload(); await playReload();
    const restored = await session.save();
    assert.deepEqual(restored.books, completed.books);
    assert.deepEqual(restored.lamplight, completed.lamplight);
    assert.equal(restored.levels.person.main_character.skill_xp.Literacy, completed.levels.person.main_character.skill_xp.Literacy);
    assert.equal(restored.is_reading, completed.is_reading);
    const recognitionDelta = diffSaves(canonicalSave(restored), canonicalSave(completed));
    assert.deepEqual(recognitionDelta.map(d => d.path), ['/character/titles/reader']);
    receipt.checks.push('Immediate completion reload: book/fuel/XP exact; existing Reader title backfilled by load');
    await roundTrip('completion');
    await session.step(2); assert.equal(progress(await snap()),120);
    receipt.checks.push('Completion coincides with expiry, remains complete after persistence and further time');
    // Private packs may be present locally or absent in an isolated public build.
    receipt.missingOptionalResources = [...new Set(missingResources)];
    assert.deepEqual(receipt.missingOptionalResources.filter(path=>path!=='/private_packs/manifest.json'), []);
    receipt.resource404s = session.errors.filter(e => e.kind === 'console' && /404 \(Not Found\)/.test(e.text)).length;
    assert.equal(receipt.resource404s, missingResources.length);
    assert.deepEqual(session.errors.filter(e => !(e.kind === 'console' && /404 \(Not Found\)/.test(e.text))), []);
    receipt.bundle_sha256 = createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex');
    receipt.status='passed';
} catch (error) {
    receipt.status='failed'; receipt.failure=error.stack; receipt.errors=session.errors;
    throw error;
} finally {
    await writeFile(join(evidence,'browser-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
    await session.close(); await server.close();
}
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
