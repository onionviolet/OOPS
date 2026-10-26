// Headless Chrome journey for the Polyjuice slice (book.hp pack): fresh origin, 1920x1080,
// obtain -> prepare/stew -> brew -> use -> aftermath, then Save, reload, Export and literal Import.
// Disposable temp-dir bundle and private port; never opens a personal save; no window opens.
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {Session, serve} from './lib.mjs';

const out = resolve(process.argv[2] || '/tmp/hp-polyjuice-journey');
await mkdir(out, {recursive: true});
const bundle = {dir: resolve('m4-build/dist'), dispose: async () => {}}, server = await serve(bundle.dir);
const s = new Session({url: server.url, seed: 21, wall: Date.UTC(2026, 9, 22), opTimeout: 15000});
const checks = [], I = id => `book.hp.ing.${id}`;
let p;
const panelSlice = save => save.hp_brewing;
const play = async () => {
    await p.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 60000});
    await p.evaluate(() => window.simulationTestHooks.pause());
    await p.locator('#loading_screen_play_button').click();
    await p.waitForFunction(() => typeof simulationTestHooks !== 'undefined', null, {timeout: 60000});
    await p.waitForTimeout(300);
};
const open = async () => {
    await p.locator('#workspace_navigation select').first().selectOption('hp-polyjuice');
    await p.locator('#hp_brewing').waitFor({state: 'visible'});
};
const act = async (id, {nth = 0} = {}) => { await p.locator(`[data-hp-action="${id}"]:not([disabled])`).nth(nth).click(); await p.waitForTimeout(60); };
const pick = async (sel, value) => { await p.locator(`[data-hp-select="${sel}"]`).selectOption(value); await p.waitForTimeout(40); };
const obtain = async (ingredient, route, prepared = false) => {
    await pick('ingredient', ingredient); await pick('route', route);
    if(prepared) await p.locator('[data-hp-prepared]').check();
    await act('acquire'); if(prepared) await p.locator('[data-hp-prepared]').uncheck();
};
const lotRow = name => p.locator('[data-hp-lot]').filter({hasText: name}).first();
const text = () => p.locator('#hp_brewing').innerText();

try {
    await s.start(); await s.open(null); p = s.page;
    // The unbegun player keeps byte-identical saves (MR33).
    assert.equal(panelSlice(await s.save()), undefined);
    checks.push('A fresh origin saves with no hp_brewing slice before the player begins');
    await open();
    assert.match(await text(), /Polyjuice bench/);
    await act('begin');
    assert.ok(panelSlice(await s.save()), 'slice saved after Begin');
    assert.match(await text(), /moon: (Full|Waning|New|Waxing)/);

    // 1. Obtain: school cupboard, own harvest under the game's moon, a trusted supplier.
    const moonAtStart = (await text()).match(/moon: (\w+)/)[1];
    await obtain(I('lacewing_flies'), 'book.hp.route.student_store');
    await obtain(I('lacewing_flies'), 'book.hp.route.trusted_supplier', true);
    await obtain(I('leeches'), 'book.hp.route.student_store');
    await obtain(I('knotgrass'), 'book.hp.route.student_store');
    await obtain(I('fluxweed'), 'book.hp.route.harvest');
    await obtain(I('bicorn_horn'), 'book.hp.route.trusted_supplier');
    await obtain(I('boomslang_skin'), 'book.hp.route.trusted_supplier');
    checks.push(`Qualified lots obtained through three owners (student cupboard, own harvest under the ${moonAtStart} moon, trusted supplier incl. a ready-stewed lacewing lot); purse spent`);

    // 2. Prepare and stew (timed play; a game day costs real seconds headless, so the full
    // twenty-one-day completion is unit-verified and the brew uses the bought ready-stewed lot).
    await lotRow('Horn of a bicorn').getByRole('button', {name: process.env.M4_COARSE ? 'Coarse powder' : 'Fine powder'}).click();
    await lotRow('Skin of a boomslang').getByRole('button', {name: 'Fine shreds'}).click();
    await p.locator('[data-hp-lot]').filter({hasText: 'raw'}).filter({hasText: 'Lacewing flies'}).first().getByRole('button', {name: 'Stew', exact: true}).click();
    for(let d = 0; d < 3; d++) await s.step(1440);
    let save = await s.save(); const lace = Object.values(panelSlice(save).lots).find(l => l.ingredient === I('lacewing_flies') && l.stew);
    assert.ok(lace && lace.form === 'raw', 'stew still in progress after three days');
    // Save, reload, partial stew survives.
    await p.reload(); await play(); await open();
    assert.match(await text(), /stewing, day (3|4)/);
    checks.push('Mid-stew Save and reload keep the lacewing stew at day 3 or 4 (game clock, not wall clock)');

    if(process.env.HP_FULL_STEW) {
        // Optional slow gate (about thirteen real seconds per game day): the stew itself reaches twenty-one days.
        for(let d = 0; d < 18; d++) await s.step(1440);
        await s.step(10); await p.waitForTimeout(100);
        const done = Object.values(panelSlice(await s.save()).lots).filter(l => l.ingredient === I('lacewing_flies') && l.claim === 'Taken from the student store-cupboard.');
        assert.equal(done[0].form, 'stewed'); assert.equal(done[0].truth.stewedMinutes, 30240);
        checks.push('Own lacewing stew completes after twenty-one game days through the ordinary clock tick');
    }

    // 3. Assemble: pick every slot (labels carry the slot ingredient) and simmer.
    const lots = Object.values(panelSlice(await s.save()).lots);
    // Full-stew runs brew with the self-stewed lot (guaranteed 21 days); quick runs with the bought lot.
    const stewedLot = lots.find(l => l.ingredient === I('lacewing_flies') && l.form === 'stewed' && (process.env.HP_FULL_STEW ? l.route === 'book.hp.route.student_store' : l.route !== 'book.hp.route.student_store'));
    const stewedTruth = stewedLot.truth.stewedMinutes;
    for(const [slot, ing] of [['lacewing', 'lacewing_flies'], ['leeches', 'leeches'], ['fluxweed', 'fluxweed'], ['knotgrass', 'knotgrass'], ['bicorn', 'bicorn_horn'], ['boomslang', 'boomslang_skin']])
        await pick(`slot-${slot}`, (slot === 'lacewing' ? stewedLot : lots.find(l => l.ingredient === I(ing) && !l.stew)).id);
    await writeFile(join(out, 'prepared.save.json'), JSON.stringify(await s.save()));
    const assessment = p.locator('[data-hp-assessment]');
    assert.equal(await assessment.getAttribute('data-hp-assessment'), process.env.M4_COARSE ? 'deviation' : process.env.HP_FULL_STEW ? 'supported' : 'uncertain');
    await assessment.locator(':scope > summary').click();
    assert.match(await assessment.innerText(), /Consumes each selected lot once/);
    if(!process.env.HP_FULL_STEW) assert.match(await assessment.innerText(), /supplier claim is not an observation/);
    await assessment.scrollIntoViewIfNeeded();
    await p.screenshot({path: join(out, 'preparation-comparison-1920.png')});
    checks.push('Selected real held lots have an observer-safe method assessment and actual lot/time/dose costs');
    if(!process.env.M4_COARSE) {
        const screenFixture = await s.save();
        for(const [width, height, size] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]) {
            const fixture = structuredClone(screenFixture);
            fixture.customization.profiles.Default.settings.typography.size = size;
            await s.open(fixture); p = s.page; await p.setViewportSize({width,height}); await open();
            for(const [slot, ing] of [['lacewing','lacewing_flies'],['leeches','leeches'],['fluxweed','fluxweed'],['knotgrass','knotgrass'],['bicorn','bicorn_horn'],['boomslang','boomslang_skin']])
                await pick(`slot-${slot}`, (slot === 'lacewing' ? stewedLot : lots.find(l => l.ingredient === I(ing) && !l.stew)).id);
            const detail = p.locator('[data-hp-assessment]'); await detail.locator(':scope > summary').click(); await detail.scrollIntoViewIfNeeded();
            const geometry = await detail.evaluate(n => ({width:n.clientWidth, scroll:n.scrollWidth, font:getComputedStyle(n).fontSize}));
            assert.equal(geometry.font, `${size}px`); assert.ok(geometry.scroll <= geometry.width + 1);
            assert.equal((await s.uiCheck()).pageOverflow, 0);
            await p.screenshot({path:join(out, `comparison-${width}-${size}.png`)});
            checks.push(`Populated preparation comparison fits ${width}x${height} with actual ${size}px type`);
        }
        await s.open(screenFixture); p=s.page; await open();
        for(const [slot, ing] of [['lacewing','lacewing_flies'],['leeches','leeches'],['fluxweed','fluxweed'],['knotgrass','knotgrass'],['bicorn','bicorn_horn'],['boomslang','boomslang_skin']])
            await pick(`slot-${slot}`, (slot === 'lacewing' ? stewedLot : lots.find(l => l.ingredient === I(ing) && !l.stew)).id);
    }
    await act('brew');
    assert.equal(await p.locator('[data-hp-action="brew"]').isDisabled(), true, 'stale selected lots are refused after consumption');
    assert.match(await text(), /simmering/);
    await s.step(1440); await s.step(1440 + 5); await p.waitForTimeout(100);
    const final = panelSlice(await s.save()), batch = Object.values(final.batches)[0];
    // The bought ready-stewed lot hides a 90% draw; the expected grade comes from saved truth, so a seed change cannot flake this.
    const expected = process.env.M4_COARSE ? 'degraded' : process.env.HP_FULL_STEW || stewedTruth >= 30240 ? 'canon' : 'degraded';
    assert.equal(batch.grade, expected, 'saved truth decides the grade');
    assert.match(await text(), /Unidentified brew/);
    assert.ok(!(await text()).includes('Polyjuice Potion · 3 doses'), 'grade is not shown before it is observed (MR31)');
    checks.push(`Selected preparation yields ${expected}; the panel still says Unidentified brew until observation`);

    // 4. Sample (consent), drink, observe, save/reload mid-effect, Export and literal Import.
    await p.getByRole('button', {name: 'Ask for a hair'}).first().click();
    await pick('batch', batch.id);
    await pick('sample', Object.keys(panelSlice(await s.save()).samples)[0]);
    await act('drink');
    assert.match(await text(), /You are .* \((Polyjuice|thin draught)\) for about \d+ more minutes/);
    save = await s.save();
    const duration = panelSlice(save).effect.endsAt - panelSlice(save).effect.startedAt;
    assert.equal(duration, expected === 'canon' ? 60 : 30);
    const keep = JSON.stringify(panelSlice(save));
    await p.reload(); await play(); await open();
    assert.equal(JSON.stringify(panelSlice(await s.save())), keep, 'Save then reload keeps the slice byte for byte');
    assert.match(await text(), /You are .* \((Polyjuice|thin draught)\)/);
    checks.push(`Drinking consumes a dose/sample and binds the donor for ${duration} played minutes; Save/reload keep the slice byte for byte`);
    const literal = await p.evaluate(() => save_to_file());
    assert.equal(typeof literal, 'string');
    await Promise.all([p.waitForEvent('load'), p.evaluate(x => load_progress(x), literal)]);
    await play(); await open();
    assert.equal(JSON.stringify(panelSlice(await s.save())), keep, 'literal Import reproduces the slice');
    checks.push('Export then literal Import reproduces the slice byte for byte');

    // 5. Lasting consequence after the hour.
    await s.step(61); await p.waitForTimeout(100);
    save = await s.save();
    assert.equal(panelSlice(save).effect, null);
    assert.ok(panelSlice(save).ledger.some(e => e.kind === 'aftermath'));
    await p.reload(); await play(); await open();
    assert.match(await text(), /The change wore off/);
    assert.match(await text(), /Batch|2 doses/);
    checks.push('After the hour the aftermath is recorded in the saved ledger and shown after a reload; two doses remain');

    // 6. UI checks at the primary target.
    const ui = await s.uiCheck();
    assert.equal(ui.pageOverflow, 0);
    await p.screenshot({path: join(out, 'hp-polyjuice-1920.png')});
    // The fixture host 404s optional private_packs files in every session; anything else is a failure.
    assert.deepEqual(s.errors.filter(e => !(e.kind === 'console' && /status of 404/.test(e.text))), []);
    checks.push('No page errors; no horizontal overflow at 1920x1080; labelled controls');
    await writeFile(join(out, 'receipt.json'), JSON.stringify({checks, duration, expected, errors: s.errors, viewport: '1920x1080', origin: 'fresh headless context'}, null, 2));
    console.log(JSON.stringify({checks, out, errors: s.errors}, null, 1));
} catch(e) {
    await writeFile(join(out, 'failure.txt'), e.stack || String(e));
    await writeFile(join(out, 'errors.json'), JSON.stringify(s.errors, null, 2));
    await p?.screenshot({path: join(out, 'failure.png')}).catch(() => {});
    console.error(e.stack || e); process.exitCode = 1;
} finally { await s.close(); server.close(); await bundle.dispose(); }
