// Ordinary Hogwarts arrival, worktable controls and real file Import.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp, readFile, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Session, buildBundle, serve} from './lib.mjs';

const out = await mkdtemp(join(tmpdir(), 'yair-potion-lining-'));
const bundle = await buildBundle();
const server = await serve(bundle.dir);
const session = new Session({url: server.url, seed: 21, wall: Date.UTC(2026, 9, 22), opTimeout: 15000});
const world = 'book.hp.school.world';
const page = () => session.page;
const navigate = id => page().locator('#workspace_navigation select').first().selectOption(id);
const panel = () => page().locator('#hp_brewing');
const click = id => panel().locator(`[data-hp-action="working-${id}"]:not([disabled])`).first().click();
const saved = async () => (await session.save()).hp_brewing.potionWorkings[world];

async function bench() {
    await page().waitForFunction(() => window.simulationTestHooks && (document.getElementById('loading_screen_play_button')?.checkVisibility()
        || document.getElementById('loading_screen')?.style.visibility === 'hidden'), null, {polling: 100});
    await page().evaluate(() => simulationTestHooks.pause());
    const play = page().locator('#loading_screen_play_button');
    if(await play.isVisible()) await play.click({force:true});
    await navigate('hp-polyjuice');
    await panel().getByRole('heading', {name:'Lined cauldron'}).waitFor();
}
async function roundTrip(label) {
    const before = await saved();
    await page().reload();
    await bench();
    assert.deepEqual(await saved(), before);
    const [download] = await Promise.all([page().waitForEvent('download'), page().locator('#save_to_file_button').click()]);
    const file = join(out, `${label}.txt`);
    await download.saveAs(file);
    assert.match(await readFile(file, 'utf8'), /^YAIR-UTF8-1:/);
    await Promise.all([page().waitForEvent('load', {timeout:45000}), page().locator('#saved_file_input').setInputFiles(file)]);
    await bench();
    assert.deepEqual(await saved(), before);
}
async function source(id, minutes) {
    await click(`source-${id}`);
    await session.step(minutes);
}
async function brew(materials) {
    await click('reset');
    for(const material of materials) await click(`measure-${material}`);
    await click('append-stir');
    await click('brew');
    const {serial} = await saved();
    await session.step(2);
    await click(`inspect-${serial}`);
}

try {
    await session.start();
    await session.open();
    await navigate('beginning');
    await page().locator('[data-structured-choice="life"]').selectOption('book.hp.school');
    await page().getByRole('button', {name:'Confirm arrival', exact:true}).click();
    await bench();
    await source('water', 1);
    await brew(['water']);
    assert.match(await panel().innerText(), /No blue tracer in this bottle/);

    await source('blue_tracer', 2);
    await source('water', 1);
    await brew(['blue_tracer', 'water']);
    assert.match(await panel().innerText(), /12 parts added · 6 bottled · 6 in the lining/);
    await roundTrip('marked');
    await source('water', 1);
    await brew(['water']);
    assert.match(await panel().innerText(), /Blue tracer in the bottle: 3 parts.*lining released 6/);

    const wash = panel().locator('[data-hp-action="working-wash-lining"]');
    assert(await wash.isDisabled());
    await source('water', 1);
    await click('wash-lining');
    await roundTrip('washing');
    assert.equal((await saved()).job.lining.kind, 'wash');
    await session.step(3);
    assert.match(await panel().innerText(), /Wash jar \d+: 3 parts of blue tracer/);
    assert.match(await panel().innerText(), /12 parts added · 9 bottled · 0 in the lining · 3 in wash jars · 0 used/);

    await source('water', 1);
    await brew(['water']);
    assert.equal((await panel().innerText()).match(/No blue tracer in this bottle/g).length, 2);
    await roundTrip('washed');
    assert.equal((await saved()).liningHistory.filter(row => row.kind === 'wash').length, 1);
    assert.equal((await session.uiCheck()).pageOverflow, 0);
    await panel().getByRole('heading', {name:'Lined cauldron'}).scrollIntoViewIfNeeded();
    await page().screenshot({path:join(out,'lining-1920.png')});
    await page().setViewportSize({width:1536,height:864});
    for(const size of [14,21]) {
        await navigate('customization');
        await page().locator('[aria-label="Font size"]').fill(String(size));
        await page().locator('[aria-label="Font size"]').dispatchEvent('change');
        await page().getByRole('button',{name:'Apply and save',exact:true}).first().click();
        await navigate('hp-polyjuice');
        await panel().getByText(/Wash jar \d+: 3 parts of blue tracer/).scrollIntoViewIfNeeded();
        assert.equal((await session.uiCheck()).pageOverflow,0);
        await page().screenshot({path:join(out,`lining-1536-${size}.png`)});
    }
    assert.deepEqual(session.errors.filter(row => row.kind !== 'console' || !/status of 404/.test(row.text)), []);
    const bundleSha256 = createHash('sha256').update(await readFile(join(bundle.dir, 'bundle.js'))).digest('hex');
    const receipt = {bundleSha256, viewport:'1920x1080', route:'ordinary Hogwarts pupil', initial:12, bottled:[6,3,0], wash:3, persistence:['marked','washing','washed'],layout:'1536x864 at 14 and 21 px'};
    await writeFile(join(out,'receipt.json'), JSON.stringify(receipt,null,2));
    console.log(JSON.stringify({out,...receipt}));
} catch(error) {
    const reports = await page()?.getByText(/Import rejected|Import blocked/).allTextContents().catch(() => []);
    await page()?.screenshot({path:join(out,'failure.png')}).catch(() => {});
    console.error(out,error,reports);
    process.exitCode = 1;
} finally {
    await session.browser?.close();
    await server.close();
    await bundle.dispose();
}
