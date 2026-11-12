// Fresh headless origin. Actual bench controls, isolated save and no personal data.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp, readFile, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Session, buildBundle, serve} from './lib.mjs';

const out = await mkdtemp(join(tmpdir(), 'yair-hp-companion-proof-'));
const bundle = await buildBundle();
const server = await serve(bundle.dir);
const session = new Session({url: server.url, seed: 21, wall: Date.UTC(2026, 9, 22), opTimeout: 15000});
const checks = [];
const page = () => session.page;
const slice = async () => (await session.save()).hp_brewing;
const action = (id, n = 0) => page().locator(`[data-hp-action="${id}"]:not([disabled])`).nth(n);
const click = (id, n) => action(id, n).click();
const select = (id, value) => page().locator(`[data-hp-select="${id}"]`).selectOption(value);
const screen = () => page().locator('#hp_brewing').innerText();

async function openBench() {
    const play = page().locator('#loading_screen_play_button');
    await page().waitForFunction(() => !!window.simulationTestHooks);
    await page().evaluate(() => window.simulationTestHooks.pause());
    if(await play.isVisible()) await play.click({force: true});
    await page().locator('#workspace_navigation select').first().selectOption('hp-polyjuice');
    await page().locator('#hp_brewing').waitFor({state: 'visible'});
}

async function roundTrip() {
    const before = await slice();
    await page().reload();
    await openBench();
    assert.deepEqual(await slice(), before);
    const literal = await page().evaluate(() => save_to_file());
    assert.equal(typeof literal, 'string');
    const loaded = page().waitForEvent('load');
    await page().evaluate(text => load_progress(text), literal);
    await loaded;
    await openBench();
    assert.deepEqual(await slice(), before);
}

async function obtain(key, route, prepared = false) {
    await select('ingredient', `book.hp.ing.${key}`);
    await select('route', `book.hp.route.${route}`);
    if(prepared) await page().locator('[data-hp-prepared]').check();
    await click('acquire');
    if(prepared) await page().locator('[data-hp-prepared]').uncheck();
}

try {
    await session.start();
    await session.open(null);
    await openBench();
    assert.equal(await slice(), undefined);
    await click('begin');

    // Harvest first so the opening moon is the ordinary starting full moon.
    assert.match(await screen(), /moon: Full/);
    await obtain('fluxweed', 'harvest');
    await obtain('lacewing_flies', 'trusted_supplier', true);
    await obtain('leeches', 'student_store');
    await obtain('knotgrass', 'student_store');
    await obtain('bicorn_horn', 'trusted_supplier');
    await obtain('boomslang_skin', 'trusted_supplier');
    await page().locator('[data-hp-lot]').filter({hasText: 'Horn of a bicorn'}).getByRole('button', {name: 'Fine powder'}).click();
    await page().locator('[data-hp-lot]').filter({hasText: 'Skin of a boomslang'}).getByRole('button', {name: 'Fine shreds'}).click();
    const lots = Object.values((await slice()).lots);
    const slots = {lacewing: 'lacewing_flies', leeches: 'leeches', fluxweed: 'fluxweed', knotgrass: 'knotgrass', bicorn: 'bicorn_horn', boomslang: 'boomslang_skin'};
    for(const [slot, key] of Object.entries(slots)) {
        await select(`slot-${slot}`, lots.find(lot => lot.ingredient === `book.hp.ing.${key}`).id);
    }
    await click('brew-concentrated');
    assert.match(await screen(), /two days and one hour/);

    await click('companion-mix-0');
    await click('companion-mix-1');
    await session.step(5);
    assert.match(await screen(), /Plain chalk: about 0%/);
    assert.match(await screen(), /Chalk with Flobberworm mucus: about 61%/);
    checks.push('Same chalk, elapsed time and total mass: mucus kept 61% suspended and the control kept 0% after five minutes.');

    await click('companion-hysteria');
    assert.equal(await action('companion-treacle').getAttribute('title'), 'Give one serving and observe the response.');
    await click('companion-treacle');
    assert.match(await screen(), /The symptoms cleared after the dose/);
    assert.ok(!(await slice()).companionPotions.patient);
    await click('companion-fire');
    await session.step(25);
    await click('companion-collect');
    await click('companion-freeze');
    assert.match(await screen(), /You hold one frozen egg/);
    await roundTrip();
    await click('companion-ague');
    await click('companion-egg');
    assert.match(await screen(), /The symptoms cleared after the dose/);
    assert.ok(!(await slice()).companionPotions.egg);
    checks.push('Treacle clears the matching teaching case. Frozen egg and unfinished brew survive reload, Export and literal Import, then the egg is spent on ague.');

    const remaining = (await slice()).cauldron.brew.readyAt - (await slice()).now;
    await session.step(remaining);
    const [batch] = Object.values((await slice()).batches);
    assert.equal(batch.dosesLeft, 2);
    assert.equal(batch.history.finish.doseMinutes, 120);
    await click('sample-ask');
    const [sample] = Object.values((await slice()).samples);
    await select('batch', batch.id);
    await select('sample', sample.id);
    await click('drink');
    const used = await slice();
    assert.equal(used.effect.donorId, sample.donorId);
    assert.equal(used.effect.endsAt - used.effect.startedAt, 120);
    assert.equal(used.batches[batch.id].dosesLeft, 1);
    assert.ok(!Object.hasOwn(used.samples, sample.id));
    await roundTrip();
    await session.step(120);
    assert.equal((await slice()).effect, null);
    checks.push('Concentrated brew yields two portions. One dose binds the sampled donor for 120 minutes and expires after an active-state round trip.');

    const ui = await session.uiCheck();
    assert.equal(ui.pageOverflow, 0);
    assert.deepEqual(session.errors.filter(error => error.kind !== 'console' || !/status of 404/.test(error.text)), []);
    await page().locator('[data-hp-action="companion-treacle"]').scrollIntoViewIfNeeded();
    await page().screenshot({path: join(out, 'bench-1920.png')});
    const bundleSha256 = createHash('sha256').update(await readFile(join(bundle.dir, 'bundle.js'))).digest('hex');
    const receipt = {bundleSha256, viewport: '1920x1080', checks};
    await writeFile(join(out, 'receipt.json'), JSON.stringify(receipt, null, 2));
    console.log(JSON.stringify({out, ...receipt}, null, 2));
} catch(error) {
    await page()?.screenshot({path: join(out, 'failure.png')}).catch(() => {});
    console.error(out, error);
    process.exitCode = 1;
} finally {
    await session.browser?.close();
    await server.close();
    await bundle.dispose();
}
