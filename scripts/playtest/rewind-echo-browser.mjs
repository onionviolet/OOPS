// Fresh controls, both results, and literal import into a new origin context.
// Run from a rebuilt tree or BUILD_OUT directory.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session, VIEWPORT} from './lib.mjs';

const root = process.cwd();
const out = resolve(process.argv[2] ?? '/tmp/oops-rewind-echo-proof');
await mkdir(out, {recursive: true});
const server = await serve(root);
const session = await new Session({url: server.url + '?test_hooks=1', seed: 7, wall: Date.UTC(2026, 10, 18),
    opTimeout: 20000, hooks: {beforeOpen: context => context.route('**/private_packs/manifest.json',
        route => route.fulfill({json: {schema: 1, packs: []}}))}}).start();
const receipt = {bundleSha256: createHash('sha256').update(await readFile(join(root, 'dist/bundle.js'))).digest('hex'),
    viewport: VIEWPORT, scenarios: []};
const action = key => session.page.locator(`[data-echo-action="${key}"]`);
const charge = () => session.page.locator('[data-echo-charge]').innerText();
const mechanisms = () => session.page.locator('[data-echo-mechanisms]').innerText();
async function openWatch() {
    await session.page.locator('#workspace_navigation select').selectOption('rewind');
    await session.page.locator('[data-rewind-echo]').waitFor();
}
async function settleLoad() {
    const page = session.page;
    await page.waitForFunction(() => !!window.simulationTestHooks &&
        (document.documentElement.dataset.startScreen === 'closed' ||
            document.getElementById('loading_screen_play_button')?.checkVisibility()), null, {timeout: 60000});
    await page.evaluate(() => window.simulationTestHooks.pause());
    const play = page.locator('#loading_screen_play_button');
    if (await play.isVisible()) await play.click({force: true});
}
async function roundTrip(expected) {
    await session.page.reload();
    await settleLoad();
    await openWatch();
    assert.deepEqual((await session.save()).rewind.echoTrial, expected);
    const literal = await session.page.evaluate(() => window.save_to_file());
    await session.open();
    await Promise.all([session.page.waitForNavigation({waitUntil: 'domcontentloaded'}),
        session.page.locator('#saved_file_input').setInputFiles({name: 'watch.txt', mimeType: 'text/plain', buffer: Buffer.from(literal)})]);
    await settleLoad();
    await openWatch();
    assert.deepEqual((await session.save()).rewind.echoTrial, expected);
}
try {
    for (const key of ['lift', 'bell']) {
        await session.open();
        assert.equal((await session.save()).rewind, undefined);
        await openWatch();
        await action('begin').click();
        assert.match(await charge(), /^1 shared charge/);
        await action('surge').click();
        assert.match(await mechanisms(), /Supply lift: jammed. Warning bell: jammed/);
        assert.equal(await action('finish').isVisible(), false);
        await action(key).click();
        assert.match(await charge(), /^0 shared charges/);
        for (const route of ['lift', 'bell']) assert.equal(await action(route).isDisabled(), true);
        const spent = (await session.save()).rewind.echoTrial;
        assert.equal(spent.spent, key);
        const other = key === 'lift' ? 'bell' : 'lift';
        assert.equal(spent.rooms[key], 'working');
        assert.equal(spent.rooms[other], 'jammed');
        if (key === 'bell') {
            await session.page.screenshot({path: join(out, 'shared-charge-spent.png')});
            await roundTrip(spent);
            for (const route of ['lift', 'bell']) assert.equal(await action(route).isDisabled(), true);
        }
        await action('finish').click();
        const finished = (await session.save()).rewind.echoTrial;
        assert.equal(finished.finished, true);
        const end = await session.page.locator('[data-rewind-echo]').innerText();
        assert.match(end, key === 'lift' ? /repair crew reaches the lower pumps/ : /night watch clears the lower walkways/);
        if (key === 'lift') await roundTrip(finished);
        receipt.scenarios.push({chosen: key, restored: key, jammed: other, charges: 0, finished: true, roundTrip: true});
    }
    await session.open();
    await openWatch();
    await action('begin').click();
    await action('surge').click();
    await session.step(60);
    assert.match(await charge(), /mark has faded/);
    for (const route of ['lift', 'bell']) assert.equal(await action(route).isDisabled(), true);
    await action('finish').click();
    const expired = (await session.save()).rewind.echoTrial;
    assert.deepEqual(expired.rooms, {lift: 'jammed', bell: 'jammed'});
    assert.equal(expired.spent, null);
    assert.equal(expired.finished, true);
    receipt.scenarios.push({expired: true, restored: null, charges: 0, finished: true});
    receipt.pageErrors = session.errors.filter(error => error.kind === 'pageerror');
    assert.deepEqual(receipt.pageErrors, []);
    receipt.success = true;
    console.log(JSON.stringify(receipt));
} catch (error) {
    receipt.failure = error.stack;
    console.error(error.stack);
    process.exitCode = 1;
    await session.page?.screenshot({path: join(out, 'failure.png')}).catch(() => {});
} finally {
    await writeFile(join(out, 'receipt.json'), JSON.stringify(receipt, null, 2));
    await session.close();
    server.close();
}
