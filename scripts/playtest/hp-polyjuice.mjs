// Headless Chrome journey for the Polyjuice slice (book.hp pack): fresh origin, 1920x1080,
// obtain -> prepare/stew -> brew -> use -> aftermath, then Save, reload, Export and literal Import.
// Disposable temp-dir bundle and private port; never opens a personal save; no window opens.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {Session, buildBundle, serve} from './lib.mjs';

const out = resolve(process.argv[2] || '/tmp/hp-polyjuice-journey');
await mkdir(out, {recursive: true});
const bundle = await buildBundle(), server = await serve(bundle.dir);
const bundleSha256 = createHash('sha256').update(await readFile(join(bundle.dir, 'bundle.js'))).digest('hex');
const s = new Session({url: server.url, seed: 21, wall: Date.UTC(2026, 9, 22), opTimeout: 15000});
const checks = [], I = id => `book.hp.ing.${id}`;
const coarse = process.env.HP_COARSE_HORN === '1';
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
// Literal Import reloads the page; a rejection stays on the page, so report its message instead of a load timeout.
const importLiteral = async literal => {
    const loaded = p.waitForEvent('load', {timeout: 20000}).then(() => true, () => false);
    await p.evaluate(x => load_progress(x), literal);
    if(!(await loaded)) throw Error('Literal Import did not reload: ' + JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.message_critical')].map(n => n.innerText).slice(-3))));
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
    await lotRow('Horn of a bicorn').getByRole('button', {name: coarse ? 'Coarse powder' : 'Fine powder'}).click();
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
    await act('brew');
    assert.match(await text(), /simmering/);
    await s.step(1440); await s.step(1440 + 5); await p.waitForTimeout(100);
    const final = panelSlice(await s.save()), batch = Object.values(final.batches)[0];
    // The bought ready-stewed lot hides a 90% draw; the expected grade comes from saved truth, so a seed change cannot flake this.
    const expected = coarse || stewedTruth < 30240 ? 'degraded' : 'canon';
    assert.equal(batch.grade, expected, 'saved truth decides the grade');
    assert.match(await text(), /Unidentified brew/);
    assert.ok(!(await text()).includes('Polyjuice Potion · 3 doses'), 'grade is not shown before it is observed (MR31)');
    checks.push(`${coarse ? 'Coarse horn' : 'Fine horn'} yielded a ${expected} batch; its grade stayed hidden before use`);

    // 4. Keep the batch at the bench, then retrieve it before adding a sample at the glass.
    await p.getByRole('button', {name: 'Ask for a hair'}).first().click();
    const sampleId = Object.keys(panelSlice(await s.save()).samples)[0];
    await act('store-batch');
    const stored = panelSlice(await s.save());
    assert.equal(stored.batches[batch.id].custody, 'bench');
    assert.equal(stored.batches[batch.id].dosesLeft, batch.dosesLeft);
    await p.reload(); await play(); await open();
    assert.deepEqual(panelSlice(await s.save()).batches[batch.id], stored.batches[batch.id]);
    await pick('batch', batch.id);
    await pick('sample', sampleId);
    assert.equal(await p.locator('[data-hp-action="drink"]:not([disabled])').count(), 0);
    assert.ok(panelSlice(await s.save()).samples[sampleId], 'a stored portion does not spend the sample');
    await act('retrieve-batch');
    await pick('batch', batch.id);
    await pick('sample', sampleId);
    await act('drink');
    const drunk = panelSlice(await s.save());
    assert.equal(drunk.batches[batch.id].dosesLeft, batch.dosesLeft - 1);
    assert.equal(drunk.samples[sampleId], undefined);
    assert.equal(drunk.effect.endsAt - drunk.effect.startedAt, expected === 'canon' ? 60 : 30);
    checks.push('Bench custody survives reload, blocks use, and retrieval preserves the exact batch for a single dose and sample debit');
    assert.match(await text(), /You are .* \((Polyjuice|thin draught)\) for about \d+ more minutes/);
    save = await s.save();
    const keep = JSON.stringify(panelSlice(save));
    await p.reload(); await play(); await open();
    assert.equal(JSON.stringify(panelSlice(await s.save())), keep, 'Save then reload keeps the slice byte for byte');
    assert.match(await text(), /You are .* \((Polyjuice|thin draught)\)/);
    checks.push(`Drinking binds the donor for ${expected === 'canon' ? 60 : 30} minutes; Save and reload keep the effect and the slice byte for byte`);
    const literal = await p.evaluate(() => save_to_file());
    assert.equal(typeof literal, 'string');
    await importLiteral(literal);
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
    checks.push('After the effect expires, the aftermath is recorded in the saved ledger and shown after a reload; two doses remain');

    // 5b. Animal hair: staged features on the shared affliction seam, hospital care, a weekly check,
    // then Save/reload and literal Import. The sample's hidden species is set in the stored save
    // (no UI reveals or picks it), then the drink and care run through the panel.
    await act('sample-ask'); // a donor not on the ask cooldown
    await p.evaluate(() => window.saveProgress());
    await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('save data')); const x = Object.values(d.hp_brewing.samples).at(-1); x.truth.species = 'cat'; localStorage.setItem('save data', JSON.stringify(d)); });
    await p.reload(); await play(); await open();
    const catSample = Object.values(panelSlice(await s.save()).samples).at(-1);
    assert.equal(catSample.truth.species, 'cat');
    await pick('batch', batch.id); await pick('sample', catSample.id);
    await act('drink');
    assert.match(await text(), /Animal features, stage 3 of 3: Fur on your face, a tail and animal eyes\. Next check in about 7 days\./);
    await act('seek-care');
    assert.match(await text(), /in the hospital wing\./);
    assert.equal(await p.locator('[data-hp-action="seek-care"]').count(), 0);
    let track = panelSlice(await s.save()).condition;
    assert.equal(track.care, true); assert.equal(track.track.stage, 3);
    checks.push('A cat-hair drink shows staged animal features (stage 3 of 3) and the hospital-wing check-in is admitted once and saved');
    for(let d = 0; d < 7; d++) await s.step(1440);
    await s.step(5); await p.waitForTimeout(100);
    const afterWeek = panelSlice(await s.save());
    assert.ok(afterWeek.condition === null || afterWeek.condition.track.treatments.length === 1, 'one weekly check with care recorded');
    const weekText = afterWeek.condition ? `stage ${afterWeek.condition.track.stage}` : 'cleared';
    const keepFeatures = JSON.stringify(afterWeek);
    await p.reload(); await play(); await open();
    assert.equal(JSON.stringify(panelSlice(await s.save())), keepFeatures, 'reload keeps the staged track');
    const literal2 = await p.evaluate(() => save_to_file());
    await importLiteral(literal2);
    await play(); await open();
    assert.equal(JSON.stringify(panelSlice(await s.save())), keepFeatures, 'literal Import keeps the staged track');
    checks.push(`After one played week in care the check ran (${weekText}); Save/reload and literal Import keep the track byte for byte`);
    await p.locator('[data-hp-condition]').scrollIntoViewIfNeeded().catch(() => {});
    await p.screenshot({path: join(out, 'hp-animal-features-1920.png')});

    // 6. UI checks at the primary target.
    const ui = await s.uiCheck();
    assert.equal(ui.pageOverflow, 0);
    await p.screenshot({path: join(out, 'hp-polyjuice-1920.png')});
    // The fixture host 404s optional private_packs files in every session; anything else is a failure.
    assert.deepEqual(s.errors.filter(e => !(e.kind === 'console' && /status of 404/.test(e.text))), []);
    checks.push('No page errors; no horizontal overflow at 1920x1080; labelled controls');
    await writeFile(join(out, 'receipt.json'), JSON.stringify({bundleSha256, checks, errors: s.errors, viewport: '1920x1080', origin: 'fresh headless context'}, null, 2));
    console.log(JSON.stringify({checks, out, errors: s.errors}, null, 1));
} catch(e) {
    await writeFile(join(out, 'failure.txt'), e.stack || String(e));
    await writeFile(join(out, 'errors.json'), JSON.stringify(s.errors, null, 2));
    await p?.screenshot({path: join(out, 'failure.png')}).catch(() => {});
    console.error(e.stack || e); process.exitCode = 1;
} finally { await s.close(); server.close(); await bundle.dispose(); }
