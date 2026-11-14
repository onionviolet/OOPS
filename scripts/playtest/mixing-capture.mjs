// Mixing counter evidence: fresh mixing state, then mix and drink along the suggested tries, at 1920x1080.
// Usage: node scripts/playtest/mixing-capture.mjs [outDir]. Headless, fresh origin, mid-game fixture save (the counter is open there).
import assert from 'node:assert/strict';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {createHash} from 'node:crypto';
import {Session, buildBundle, serve} from './lib.mjs';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
const out = resolve(process.argv[2] || 'docs/representations/evidence/mixing'); await mkdir(out, {recursive: true});
const seed = JSON.parse(await readFile('tests/fixtures/perf/mid.json', 'utf8'));
delete seed.availabilities?.recipe?.undefined; delete seed.availabilities?.recipe?.['recipe/undefined'];
seed.customization = defaultCustomizationState(); seed.customization.profiles.Default.settings.effects = 'full';
const bundle = await buildBundle(), server = await serve(bundle.dir);
const s = new Session({url: server.url, seed: 19, wall: Date.UTC(2026, 9, 25), opTimeout: 15000});
const bundleHash = createHash('sha256').update(await readFile(join(bundle.dir, 'bundle.js'))).digest('hex');
const log = [`bundle sha256 ${bundleHash} (built from this tree), fixture tests/fixtures/perf/mid.json, headless Chrome 1920x1080`]; const say = m => { log.push(m); console.log(m); };
const resumeAfterLoad = async p => {
    await p.waitForFunction(() => !!window.simulationTestHooks &&
        (document.getElementById('loading_screen_play_button')?.checkVisibility() ||
         document.getElementById('loading_screen')?.style.visibility === 'hidden'));
    await p.evaluate(() => window.simulationTestHooks.pause());
    const play = p.locator('#loading_screen_play_button');
    if (await play.isVisible()) await play.click({force:true});
};
try {
    await s.start();
    const poorStart = structuredClone(seed);
    poorStart.character.money = 0;
    await s.open(poorStart);
    await s.page.emulateMedia({reducedMotion: 'reduce'});
    await s.page.locator('button[data-panel-path="mixing"]:visible').click();
    assert.equal(await s.page.locator('#center_mode_content').evaluate(n => n.classList.contains('center-mode-enter')), false);
    await s.page.getByRole('button', {name: /Buy one pack of River bellleaf/}).click();
    assert.match(await s.page.locator('#mixture_notice').innerText(), /Not enough coins/);
    await s.page.locator('#mixture_amount_River_bellleaf').fill('99');
    assert.match(await s.page.locator('#mixture_status').innerText(), /Missing .*River bellleaf/);
    await s.page.keyboard.press('Escape');
    assert.equal(await s.page.locator('button[data-panel-path="mixing"]:visible').evaluate(n => n === document.activeElement), true);
    say('PASS reduced motion, poor purchase and Escape focus return');

    await s.open(seed); const p = s.page;
    const sideColumns = () => p.locator('[data-region="player"], [data-region="inventory"], [data-region="log"]').evaluateAll(nodes => nodes.filter(n => n.checkVisibility()).map(n => {
        const {x,y,width,height} = n.getBoundingClientRect();
        return [x,y,width,height];
    }));
    const homeColumns = await sideColumns();
    assert.ok(homeColumns.length);
    await p.locator('button[data-panel-path="mixing"]:visible').click();
    const panel = p.locator('#village_mixing_panel'); await panel.waitFor({state: 'visible'});
    assert.deepEqual(await sideColumns(), homeColumns);
    const learned = () => p.locator('#mixture_discovery').evaluate(n => n.dataset.text);
    const shot = async name => { await p.locator('#mixture_discovery').evaluate(n => { for (let e = n; e; e = e.parentElement) e.scrollTop = 0; }); await p.screenshot({path: join(out, `${name}-1920x1080.png`)}); };
    say('FRESH\n' + await learned()); await shot('1-fresh');
    const set = async (amounts, process) => {
        for (const [id, n] of Object.entries(amounts)) await p.locator('#mixture_amount_' + id.replaceAll(' ', '_')).fill(String(n));
        await p.locator('#mixture_process').selectOption(process);
    };
    await p.locator('#mixture_amount_Spring_water').fill('0');
    assert.match(await p.locator('#mixture_status').innerText(), /Choose Spring water/);
    await p.locator('#mixture_amount_Spring_water').fill('1');
    await p.locator('.mixture-controls summary').click();
    await p.locator('#mixture_method').selectOption('responsive@2');
    assert.equal(await p.locator('.mixture-controls summary').innerText(), 'Responsive method');
    await p.locator('.mixture-controls summary').click();
    assert.equal(await p.locator('#mixture_method').isVisible(), false);
    await p.getByText('Worth a try', {exact:true}).click();
    await p.locator('#mixture_next_set').click();
    assert.equal(await p.locator('#mixture_method').inputValue(), 'ordinary@1');
    const buy = async id => { for (let i = 0; i < 4; i++) await p.getByRole('button', {name: new RegExp('Buy one pack of ' + id)}).click(); };
    for (const id of ['River bellleaf', 'Emberseed', 'Mellow salt', 'Spring water']) await buy(id);
    const mixAndDrink = async (label) => {
        await p.locator('#mixture_craft').click();
        for (let i = 0; i < 20 && !(await p.locator('[data-mixture-product] button', {hasText: /Experiment|Drink/}).count()); i++) { await s.step(30); await p.waitForTimeout(300); }
        await p.locator('[data-mixture-product] button', {hasText: /Experiment|Drink/}).first().click(); await p.waitForTimeout(300);
        say(`AFTER ${label}\n` + await learned());
    };
    await set({'River bellleaf':1, Emberseed:1, 'Spring water':1}, 'steep');
    await mixAndDrink('ambiguous blend');
    const clue = p.locator('summary[aria-label="River bellleaf, Health regeneration: Source unclear"]');
    await clue.focus();
    await p.keyboard.press('Enter');
    assert.equal(await clue.evaluate(n => n.parentElement.open), true);
    await p.waitForTimeout(650);
    assert.equal(await clue.evaluate(n => n === document.activeElement && n.parentElement.open), true);
    say('PASS keyboard evidence and focus through polling');

    if (!await p.locator('#mixture_next_set').isVisible()) await p.getByText('Worth a try', {exact:true}).click();
    await p.locator('#mixture_next_set').click();
    await mixAndDrink('isolated plant');
    assert.equal(await p.locator('tr[data-ingredient="River bellleaf"]').getAttribute('data-state'), 'known');
    await shot('2-after-isolating');
    const learn = panel.getByRole('button', {name:'Save observed method'}).first();
    const product = learn.locator('..');
    const productKey = await product.getAttribute('data-mixture-product');
    await learn.click();
    const escapedKey = await p.evaluate(key => CSS.escape(key), productKey);
    await panel.locator(`[data-mixture-product=${escapedKey}]`).getByRole('button', {name:'Queue learned method'}).click();
    assert.equal(await p.locator('#mixture_cancel').isVisible(), true);
    const reserved = await s.save();
    assert.ok(reserved.mixtures.job);
    const exported = await p.evaluate(() => window.save_to_file());
    await p.reload();
    await resumeAfterLoad(p);
    await p.locator('button[data-panel-path="mixing"]:visible').click();
    await p.locator('#mixture_cancel').click();
    assert.equal((await s.save()).mixtures.job, null);
    await Promise.all([
        p.waitForEvent('load'),
        p.locator('#saved_file_input').setInputFiles({name:'mixing.txt',mimeType:'text/plain',buffer:Buffer.from(exported)}),
    ]);
    await resumeAfterLoad(p);
    assert.deepEqual((await s.save()).mixtures.job, reserved.mixtures.job);
    if (!await p.locator('#mixture_cancel').isVisible()) await p.locator('button[data-panel-path="mixing"]:visible').click();
    await p.locator('#mixture_cancel').waitFor({state:'visible'});
    assert.equal(await p.locator('.mixture-controls summary').innerText(), 'Ordinary method');
    say('PASS saved reservation, reload, cancellation and exported file import');
    assert.deepEqual(s.errors.filter(e => e.kind === 'pageerror' || !/404/.test(e.text)), []); // 404s are optional pack manifests the fixture does not ship
    await writeFile(join(out, 'walk.txt'), log.join('\n\n') + '\n'); say('PASS');
} finally { await s.close(); server.close(); await bundle.dispose(); }
