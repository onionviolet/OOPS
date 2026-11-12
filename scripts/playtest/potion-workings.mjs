// Ordinary arrivals and workroom controls on a disposable headless origin.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp, readFile, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Session, buildBundle, serve} from './lib.mjs';

const out = await mkdtemp(join(tmpdir(), 'yair-potion-workings-'));
const bundle = await buildBundle();
const server = await serve(bundle.dir);
const session = new Session({url: server.url, seed: 21, wall: Date.UTC(2026, 9, 22), opTimeout: 15000});
const page = () => session.page;
const navigate = id => page().locator('#workspace_navigation select').first().selectOption(id);
const panel = () => page().locator('#hp_brewing');
const action = id => panel().locator(`[data-hp-action="working-${id}"]:not([disabled])`).first().click();
const notice = () => panel().getByRole('status').innerText();
const saved = async () => (await session.save()).hp_brewing;
const checks = [];
const hogwarts = 'book.hp.school.world';
const cyoria = 'book.mol.cyoria';
const workroom = async () => {
    await navigate('hp-polyjuice');
    await panel().waitFor({state: 'visible'});
};
async function roundTrip() {
    const before = await saved();
    const boot = async () => {
        const play = page().locator('#loading_screen_play_button');
        await page().waitForFunction(() => window.simulationTestHooks && (document.getElementById('loading_screen_play_button')?.checkVisibility()
            || document.getElementById('loading_screen')?.style.visibility === 'hidden'), null, {polling: 100});
        await page().evaluate(() => simulationTestHooks.pause());
        if(await play.isVisible()) await play.click({force: true});
        await workroom();
    };
    await page().reload();
    await boot();
    assert.deepEqual(await saved(), before);
    const [download] = await Promise.all([page().waitForEvent('download'), page().locator('#save_to_file_button').click()]);
    const exported = join(out, 'round-trip.txt');
    await download.saveAs(exported);
    assert.match(await readFile(exported, 'utf8'), /^YAIR-UTF8-1:/);
    const imported = page().waitForEvent('load', {timeout: 45000});
    await Promise.all([imported, page().locator('#saved_file_input').setInputFiles(exported)]);
    await boot();
    assert.deepEqual(await saved(), before);
}
async function source(id, minutes) {
    await action(`source-${id}`);
    await session.step(minutes);
}
async function brew(materials, steps, minutes) {
    await action('reset');
    for(const id of materials) await action(`measure-${id}`);
    for(const id of steps) await action(`append-${id}`);
    await action('brew');
    await session.step(minutes);
}
async function egg() {
    await action('fire');
    await session.step(25);
    await action('collect');
    await action('freeze');
}
async function cyoriaArrival() {
    const local = page().locator('#location_actions_div');
    await local.getByText('Talk to someone', {exact: false}).first().click();
    await local.locator('[data-dialogue="villageElder"]').click();
    for(const key of ['hello', 'what happened', 'ask to leave 1', 'need to']) {
        await local.locator(`.talk-view [data-topic-id="${key}"]`).click();
    }
    await page().locator('#center_mode_back').click();
    await session.step(3);
    await navigate('notebook');
    await page().locator('[data-notebook-view="here"]').click();
    const p = page().locator('#feature_expansion_panel');
    if(!await p.evaluate(n => n.open)) await p.locator(':scope > summary').click();
    const region = p.locator(':scope > div > details').filter({has: page().locator('summary').filter({hasText: /Mother of Learning/})}).first();
    if(!await region.evaluate(n => n.open)) await region.locator(':scope > summary').click();
    const act = id => p.locator(`[data-action-legibility-key="action:book.mol.${id}"] button.action-legibility__button`).click();
    await act('chart');
    await session.step(25);
    await act('begin_zorian');
    await page().waitForFunction(() => {
        const {continuation} = simulationTestHooks.snapshot();
        return continuation?.lives[continuation.active]?.initial.expansion.motherOfLearning?.entryProfile === 'book.mol.zorian@1';
    }, null, {polling: 100});
    await act('move.workshop');
    await page().waitForFunction(() => simulationTestHooks.snapshot().expansion.simulation?.people.player.location === 'Cyoria formula workshop', null, {polling: 100});
    const s = await session.save();
    assert.equal(s.expansion.actors.player.worldId, cyoria);
    assert.equal(s.expansion.simulation.people.player.location, 'Cyoria formula workshop');
}
try {
    await session.start();
    await session.open();
    await workroom();
    assert.equal(await panel().getByRole('heading', {name: 'Worktable'}).count(), 0);
    await navigate('beginning');
    await page().locator('[data-structured-choice="life"]').selectOption('book.hp.school');
    await page().getByRole('button', {name: 'Confirm arrival', exact: true}).click();
    assert.equal((await session.save()).expansion.actors.player.worldId, hogwarts);
    await workroom();
    await panel().getByRole('heading', {name: 'Hogwarts potioneering'}).waitFor();
    assert.equal(await saved(), undefined);
    await egg();
    await source('rose', 6);
    await source('water', 1);
    await roundTrip();
    await brew(['frozen_egg', 'rose', 'water'], ['extract', 'steep'], 12);
    let room = (await saved()).potionWorkings[hogwarts];
    assert.deepEqual(room.stock, {});
    assert.equal(Object.keys(room.craft.recipes).length, 0);
    await panel().locator('[data-hp-select="working-subject"]').selectOption('The greenhouse');
    await action('dose-oral');
    assert.match(await notice(), /Love Potion takes hold.*greenhouse/);
    room = (await saved()).potionWorkings[hogwarts];
    const duration = room.effects.fixation.endsAt - (await saved()).now;
    assert.equal(Object.keys(room.craft.recipes).length, 1);
    assert.equal(duration, 32);
    await roundTrip();
    await page().screenshot({path: join(out, 'hogwarts-1920.png')});
    await session.step(duration);
    assert.ok(!(await saved()).potionWorkings[hogwarts].effects.fixation);
    checks.push({case: 'Hogwarts', originalLovePotionMinutes: duration, firstRoute: 'school arrival', persistence: true});
    await egg();
    await source('rose', 6);
    await source('water', 1);
    await brew(['frozen_egg', 'rose', 'water'], ['steep', 'extract'], 12);
    await action('dose-oral');
    assert.match(await notice(), /no change/);
    await source('mucus', 8);
    await source('water', 1);
    await brew(['mucus', 'water'], ['stir'], 2);
    await action('dose-assay');
    assert.match(await notice(), /liquid moves more slowly/);
    await source('alihotsy', 8);
    await brew(['alihotsy'], ['steep'], 8);
    await action('dose-oral');
    assert.match(await panel().innerText(), /Alihotsy hysteria.*minutes remaining/);
    await source('treacle', 8);
    await brew(['treacle'], ['stir'], 2);
    await action('dose-oral');
    assert.match(await notice(), /symptoms cleared/);
    assert.ok(!(await saved()).potionWorkings[hogwarts].effects.hysteria);
    checks.push({case: 'Hogwarts controls', reversed: 'no change', mucus: 'slower flow', treacle: 'cleared Alihotsy'});

    await session.open();
    await cyoriaArrival();
    await workroom();
    await panel().getByRole('heading', {name: 'Cyoria apothecary'}).waitFor();
    for(const steps of [['steep', 'extract', 'stir'], ['extract', 'stir']]) {
        await source('leaf', 5);
        await source('oil', 5);
        await source('water', 1);
        await brew(['leaf', 'oil', 'water'], steps, steps.length === 3 ? 14 : 8);
        if(steps.length === 3) await action('sore-skin');
        await action('dose-topical');
        assert.match(await notice(), steps.length === 3 ? /no change/ : /symptoms cleared/);
    }
    await roundTrip();
    await source('leaf', 5);
    await source('oil', 5);
    await source('water', 1);
    await action('recall');
    assert.match(await panel().innerText(), /Cyorian balm leaf: 1 held · 1 measured/);
    await action('brew');
    await session.step(8);
    await page().screenshot({path: join(out, 'cyoria-1920.png')});
    assert.equal((await session.uiCheck()).pageOverflow, 0);
    checks.push({case: 'Cyoria', firstRoute: 'Zorian arrival and move to workshop', reversed: 'no change', worked: 'cleared irritation', recalled: true, persistence: true});

    assert.deepEqual(session.errors.filter(error => error.kind !== 'console' || !/status of 404/.test(error.text)), []);
    const bundleSha256 = createHash('sha256').update(await readFile(join(bundle.dir, 'bundle.js'))).digest('hex');
    const receipt = {bundleSha256, viewport: '1920x1080', checks};
    await writeFile(join(out, 'receipt.json'), JSON.stringify(receipt, null, 2));
    console.log(JSON.stringify({out, ...receipt}, null, 2));
} catch(error) {
    await page()?.screenshot({path: join(out, 'failure.png')}).catch(() => {});
    const reports = await page()?.getByText(/Import rejected|Import blocked/).allTextContents().catch(() => []);
    const localStatus = await page()?.locator('#feature_expansion_panel .action-legibility__notice:not([hidden])').allTextContents().catch(() => []);
    console.error(out, error, reports, localStatus, session.errors);
    process.exitCode = 1;
} finally {
    await session.browser?.close();
    await server.close();
    await bundle.dispose();
}
