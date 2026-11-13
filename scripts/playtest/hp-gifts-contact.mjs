// Gifts and talk as thought rows, browser proof (src/book_world_hp_contact_panel.js). Headless 1920x1080, fresh origin, rebuilt bundle.
// Fixture: the native HP wave-3 endpoint (scripts/playtest/cross-world-ties.mjs walkHpBench writes hp-wave3-end.save.json: sorted,
// at school, Ron known). Then by buttons: save a treacle tart from the house table, give it to Ron, see the row, talk with him, then
// Save, reload, literal Export and Import and reread the row. Output holds ids, counts and the row lines only.
// HP_SORTED_SEED=<hp-gifts-sorted.save.json from an earlier run> skips the route.
// Usage: HP_BENCH_SEED=/path/hp-wave3-end.save.json node scripts/playtest/hp-gifts-contact.mjs [outDir]
// Or HP_HOUSEHOLD_SEED=<a save at the end of the household day on this build>: the script waits to term (lead day 32) and takes the
// train and the Sorting by their own buttons first.
import assert from 'node:assert/strict';
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve, join} from 'node:path';
import {Session, buildBundle, serve} from './lib.mjs';
import {NativeContinuation} from './native-continuation.mjs';

const out = resolve(process.argv[2] || '/tmp/hp-gifts-contact');
await mkdir(out, {recursive: true});
const bundle = await buildBundle(), server = await serve(bundle.dir);
const receipt = {bundle: createHash('sha256').update(await readFile(join(bundle.dir, 'bundle.js'))).digest('hex'), checks: []};
const P = 'book.hp.lead', RON = `${P}.ron`, TART = JSON.stringify({id: `${P}.food.treacle_tart`});
const snap = p => p.evaluate(() => window.simulationTestHooks.snapshot().expansion);
const play = async p => {
    await p.waitForFunction(() => !!window.simulationTestHooks && (document.getElementById('loading_screen_play_button')?.checkVisibility() ||
        document.getElementById('loading_screen')?.style.visibility === 'hidden'), null, {timeout: 60000});
    await p.evaluate(() => window.simulationTestHooks.pause());
    const b = p.locator('#loading_screen_play_button'); if(await b.isVisible()) await b.click({force: true});
    await p.waitForTimeout(400);
};
const s = new Session({url: server.url, seed: 11, wall: Date.UTC(2026, 10, 10), opTimeout: 20000});
const lines = p => p.locator('#hp_contact_panel [data-contact-line]').allInnerTexts();
try {
    const seedPath = process.env.HP_SORTED_SEED || process.env.HP_BENCH_SEED || process.env.HP_HOUSEHOLD_SEED;
    await s.start(); await s.open(JSON.parse(await readFile(seedPath, 'utf8'))); const p = s.page;
    if(process.env.HP_HOUSEHOLD_SEED && !process.env.HP_SORTED_SEED) {
        const hp = async () => {await p.locator('#workspace_navigation select[aria-label="Other known panels"]').selectOption('hp'); await p.waitForTimeout(250);};
        const press = async id => {await hp(); const b = p.locator(`[data-hp="${id}"], [data-hp-school="${id}"]`).first(); assert.equal(await b.isDisabled(), false, id); await b.click();};
        for(let d = 0; d < 40 && (await p.evaluate(() => simulationTestHooks.snapshot().expansion.clock)) < 32 * 1440; d++) {await s.step(1440); console.error(`hp: day ${d + 1}`);}
        await press(`${P}.arrive_school`); await s.step(490);
        // The arrival and Sorting are now the arc's own acts (deputy head, the hat, ...): take the current one until Ron is known.
        const nc = new NativeContinuation(s, {panel: 'hp', attrPrefix: 'hp', stepLimit: 2000});
        for(let n = 0; n < 30; n++) {
            const st = await snap(p);
            if(st.actors.player.facts['hp.lead.house'] === 'gryffindor' && st.simulation.knowledge.player[`${P}.ron_known`]) break;
            await nc.panel(); await nc.startCurrent(); await nc.settle();
        }
        await writeFile(join(out, 'hp-gifts-sorted.save.json'), JSON.stringify(await s.save()));
        assert.equal((await snap(p)).actors.player.facts['hp.lead.house'], 'gryffindor');
        receipt.route = 'household-end save on this build, then term wait, train and Sorting by their buttons';
        receipt.checks.push('route: train and Sorting by their own buttons; Harry is in Gryffindor and knows Ron');
    } else receipt.route = process.env.HP_SORTED_SEED ? 'sorted save written by this script\'s own native route on this build' : 'native HP wave-3 endpoint save';
    const open = async () => {await p.locator('#workspace_navigation select[aria-label="Other known panels"]').selectOption('hp-contact'); await p.waitForTimeout(300);
        await p.evaluate(() => document.getElementById('hp_contact_panel')?.render?.(true)); await p.waitForTimeout(100);};
    await open();
    const panel = p.locator('#hp_contact_panel');
    assert.match(await panel.innerText(), /Friends at school/);
    assert.equal(await p.locator(`[data-contact-person="${RON}"]`).count(), 1);
    receipt.before = await lines(p);
    receipt.checks.push('fixture: the Friends at school panel opens and lists Ron');
    await p.locator(`[data-contact-take="take.${P}.food.treacle_tart"]`).click(); await open();
    assert.equal(await p.locator(`[data-contact-gift='${TART}']`).count(), 1); // Harry's own stock is the native inventory; the button reads it
    assert.ok(await p.evaluate(() => document.body.innerText.includes('Slice of treacle tart')), 'the tart shows in the Inventory panel (ITM22)');
    receipt.checks.push('Save a slice of treacle tart from the house table by its button: one tart in Harry\'s inventory, listed in the Inventory panel');
    const gift = p.locator(`[data-contact-gift='${TART}']`);
    assert.equal(await gift.count(), 1);
    await gift.click(); await open();
    let st = await snap(p);
    assert.equal(await p.locator(`[data-contact-gift='${TART}']`).count(), 0); assert.equal(st.simulation.owners[RON][TART], 1);
    const after = await lines(p);
    assert.ok(after.includes('you gave him a slice of treacle tart, and he was glad of it'), JSON.stringify(after));
    receipt.notice = await p.locator('#hp_contact_panel [data-contact-notice]').innerText();
    receipt.checks.push('Give Ron a slice of treacle tart by its button: the tart moves to Ron and the row shows under "On Ron\'s mind lately"');
    await p.locator(`[data-contact-talk="${RON}"]`).click(); await open();
    assert.ok((await lines(p)).includes('you sat and talked with him for a while'));
    await p.locator(`[data-contact-talk="${RON}"]`).click(); await open();
    assert.match(await p.locator('#hp_contact_panel [data-contact-notice]').innerText(), /already caught up today/);
    assert.equal((await lines(p)).filter(l => l.startsWith('you sat')).length, 1);
    receipt.checks.push('Sit and talk with Ron twice the same day: one talk row, the second says it changes nothing');
    receipt.tieLine = await p.evaluate(() => window.simulationTestHooks.project('hp')?.ties?.map(t => t.line));
    await p.screenshot({path: join(out, 'hp-gifts-contact.png')});
    const shown = await lines(p);
    // Save, reload, literal Export and Import.
    await p.evaluate(() => window.saveProgress()); await p.reload(); await play(p); await open();
    assert.deepEqual(await lines(p), shown); assert.equal((await snap(p)).simulation.owners[RON][TART], 1);
    const literal = await p.evaluate(() => window.save_to_file());
    await Promise.all([p.waitForEvent('load', {timeout: 30000}), p.evaluate(x => load_progress(x), literal)]); await play(p); await open();
    assert.deepEqual(await lines(p), shown); assert.equal((await snap(p)).simulation.owners[RON][TART], 1);
    receipt.checks.push('Save, reload, Export and Import keep both rows and the tart in Ron\'s keeping');
    receipt.shown = shown;
    receipt.errors = s.errors; assert.equal(s.errors.length, 0, JSON.stringify(s.errors.slice(0, 3)));
    receipt.ok = true;
} catch(e) {
    receipt.ok = false; receipt.error = String(e.stack || e).slice(0, 1500); receipt.errors = s.errors.slice(0, 5);
    await s.page?.screenshot({path: join(out, 'hp-gifts-contact-fail.png')}).catch(() => {});
} finally { await s.close?.(); server.close(); await bundle.dispose(); }
await writeFile(join(out, 'receipt.json'), JSON.stringify(receipt, null, 1));
console.log(JSON.stringify(receipt, null, 1));
process.exit(receipt.ok ? 0 : 1);
