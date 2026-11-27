import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {Session} from '../../scripts/playtest/lib.mjs';

const [origin, out] = process.argv.slice(2);
if (!origin || !out) throw Error('Pass the busy-Journal preview URL and an output directory.');
const url = new URL(origin);
assert.equal(url.hostname, '127.0.0.1', 'Use the isolated preview origin.');
url.searchParams.set('test_hooks', '1');
url.searchParams.set('rewind_preview', '1');
await mkdir(out, {recursive: true});
const session = await new Session({url: url.href, seed: 7, wall: Date.UTC(2026, 10, 18), opTimeout: 20000}).start();
const results = [];
try {
    await session.open();
    const {page} = session;
    const panel = page.locator('#rewind_panel');
    const back = panel.getByRole('button', {name: 'Return to the mark', exact: true});
    const placement = panel.getByLabel('Memory detail');
    const summary = panel.locator('.rewind-preview-disclosure summary');
    const memory = page.locator('[aria-label="Who half-remembers"]');
    const journal = page.locator('[data-region="journal"] #journal_content_div');
    const dock = page.locator('[data-region="journal"] > .rewind-preview-companion');
    const openRewind = async () => {
        await page.locator('#workspace_navigation select').selectOption('rewind');
        await panel.waitFor();
    };
    await openRewind();
    console.log('Opened Return to the mark in the busy Journal fixture.');
    await panel.getByRole('button', {name: 'Set mark and seed two memories'}).click();
    const seeded = await session.save();
    assert.deepEqual(Object.keys(seeded.memory.holders).sort(), ['player', 'rowan']);
    await back.click();
    assert.ok(await back.isDisabled());
    assert.match(await panel.locator('[aria-label="What the rewind did"]').innerText(), /Came back.*what people remember/s);
    assert.match(await memory.textContent(), /rowan felt it was familiar/i);
    const after = await session.save();
    assert.deepEqual(Object.keys(after.memory.holders), ['player']);

    for (const [width, height] of [[1920, 1080], [1800, 1072], [1800, 1040]]) {
        await page.setViewportSize({width, height});
        await page.evaluate(() => document.fonts.ready);
        await placement.selectOption('demand');
        await dock.waitFor({state: 'hidden'});
        if (await summary.evaluate(el => el.parentElement.open)) await summary.click();
        await memory.waitFor({state: 'hidden'});
        const original = await journal.innerText();
        for (const title of ['Lost memory', 'Village expansion', 'Bonemeal delivery', 'Light in the darkness']) {
            assert.ok(original.includes(title), `Missing busy Journal entry: ${title}`);
        }
        await summary.focus();
        await page.keyboard.press('Enter');
        await memory.waitFor();
        assert.ok(await summary.evaluate(el => el.parentElement.open));
        assert.ok(await panel.locator(memory).count(), 'On-demand list belongs to Return to the mark');
        await page.mouse.move(0, 0);
        if (height !== 1040) await page.screenshot({path: join(out, `rewind-on-demand-${width}x${height}.png`)});
        await placement.selectOption('journal');
        await memory.waitFor();
        assert.ok(await dock.locator(memory).count(), 'Dock uses the same native memory list');
        assert.equal(await page.locator('[aria-label="Who half-remembers"]').count(), 1);
        assert.equal(await journal.innerText(), original);
        const memoryHit = await memory.locator('li').first().evaluate(el => {
            const r = el.getBoundingClientRect();
            return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
        });
        assert.ok(memoryHit, 'Busy Journal must leave the memory row unobscured');
        await page.mouse.move(0, 0);
        if (height !== 1040) await page.screenshot({path: join(out, `rewind-below-journal-${width}x${height}.png`)});
        results.push({width, height, journal: original.split('\n').filter(Boolean), memory: await memory.innerText(), oneList: true});
        console.log(`Compared both placements at ${width}×${height}.`);
    }
    const changed = await session.save();
    assert.deepEqual(changed.memory, after.memory);
    assert.deepEqual(changed.rewind, after.rewind);
    await page.reload();
    await page.waitForFunction(() => window.simulationTestHooks &&
        (document.documentElement.dataset.startScreen === 'closed' || document.getElementById('loading_screen_play_button')?.checkVisibility()));
    await page.evaluate(() => window.simulationTestHooks.pause());
    const play = page.locator('#loading_screen_play_button');
    if (await play.isVisible()) await play.click({force: true});
    await openRewind();
    await placement.selectOption('journal');
    await memory.waitFor();
    assert.match(await memory.innerText(), /rowan felt it was familiar/i);
    assert.deepEqual(session.errors.filter(error => error.kind === 'pageerror'), []);
    await writeFile(join(out, 'rewind-placement-results.json'), JSON.stringify({results, persistedMemory: true, pageErrors: 0}, null, 2) + '\n');
    console.log('Both memory placements passed at all sizes and the live memory record survived reload.');
} catch (error) {
    console.error(session.errors.slice(0, 6));
    await session.page?.screenshot({path: join(out, 'rewind-check-failure.png'), timeout: 10000}).catch(() => {});
    throw error;
} finally {
    await session.close();
}
